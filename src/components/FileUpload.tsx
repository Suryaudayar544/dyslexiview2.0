import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Image, Play, Pause, Volume2 } from "lucide-react";
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Set workerSrc for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


interface FileUploadProps {
  onBack: () => void;
}

interface ExtractedContent {
  text: string;
  confidence: number;
  source: string;
}

export const FileUpload = ({ onBack }: FileUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  
  // Securely get the API key from environment variables
  const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setExtractedContent(null);

    try {
      if (file.type.startsWith('image/')) {
        toast.info("Processing Image...", { description: "Extracting text from your image..." });

        const result = await Tesseract.recognize(file, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(m.progress * 100);
            }
          }
        });

        setExtractedContent({
          text: result.data.text,
          confidence: result.data.confidence,
          source: file.name
        });

        toast.success("Text Extracted!", {
          description: `Found text with ${Math.round(result.data.confidence)}% confidence`,
        });

      } else if (file.type === 'application/pdf') {
        toast.info("Processing PDF...", { description: "Extracting text from your PDF..." });
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (!event.target?.result) return;
          const typedarray = new Uint8Array(event.target.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            setProgress((i / pdf.numPages) * 100);
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => (item as any).str).join(' ');
          }
          setExtractedContent({ text, confidence: 100, source: file.name });
          toast.success("Text Extracted!", {
            description: `Successfully extracted text from the PDF.`,
          });
        };
        reader.readAsArrayBuffer(file);
      } else {
        toast.error("Unsupported File", {
          description: "Please upload an image or PDF file.",
        });
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error("Processing Error", {
        description: "Failed to extract text from the file. Please try again.",
      });
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const playTextToSpeech = async () => {
    if (!extractedContent?.text) return;
  
    if (isPlaying) {
      if (currentAudio) {
        currentAudio.pause();
      } else if (currentUtterance) {
        speechSynthesis.pause();
      }
      setIsPlaying(false);
      return;
    }
  
    if (!isPlaying && speechSynthesis.paused && !elevenLabsKey) {
      speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }
  
    if (elevenLabsKey) {
      toast.info("Generating high-quality audio...");
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': elevenLabsKey,
            },
            body: JSON.stringify({
              text: extractedContent.text.trim(),
              voice_settings: { stability: 0.5, similarity_boost: 0.75 },
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`ElevenLabs API request failed with status ${response.status}`);
        }
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        audio.play();
        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
      } catch (error) {
        console.error('ElevenLabs error:', error);
        toast.error("ElevenLabs Error", {
          description: "Could not play audio. Check your API key and console for errors.",
        });
      }
    } else {
      const utterance = new SpeechSynthesisUtterance(extractedContent.text);
      
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
  
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Google') || voice.name.includes('Microsoft'))
      );
      if (preferredVoice) utterance.voice = preferredVoice;
  
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => { setIsPlaying(false); setCurrentUtterance(null); };
      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentUtterance(null);
        toast.error("Speech Error", { description: "Failed to play audio. Please try again." });
      };
  
      setCurrentUtterance(utterance);
      speechSynthesis.speak(utterance);
    }
  };

  const stopTextToSpeech = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentUtterance(null);
  };

  const formatTextForDyslexia = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => (
        <p key={index} className="mb-3 leading-relaxed text-lg font-medium tracking-wide" style={{ fontFamily: 'OpenDyslexic, Arial, sans-serif', wordSpacing: '0.2em', letterSpacing: '0.05em' }}>
          {line}
        </p>
      ));
  };

  return (
    <div className="min-h-screen bg-gradient-game p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={onBack}>
            ← Back to Dashboard
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">Reading Helper</h1>
            <p className="text-muted-foreground">Upload images or PDFs to extract and hear text</p>
          </div>
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-game">
            <h2 className="text-xl font-semibold mb-4">Upload File</h2>
            <div
              className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
              <p className="text-muted-foreground mb-4">
                Support for images (PNG, JPG) and PDF files.
              </p>
              <Button variant="outline">Choose File</Button>
            </div>
            <input id="file-input" type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
            {isProcessing && (
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Processing...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </Card>

          <Card className="p-6 shadow-game">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Extracted Text</h2>
              {extractedContent && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={playTextToSpeech} disabled={!extractedContent.text}>
                    {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  {isPlaying && (
                    <Button variant="outline" size="sm" onClick={stopTextToSpeech}>
                      <Volume2 className="w-4 h-4 mr-1" /> Stop
                    </Button>
                  )}
                </div>
              )}
            </div>
            {extractedContent ? (
              <div className="space-y-4">
                <div className="text-xs text-muted-foreground mb-2">
                  From: {extractedContent.source} {extractedContent.confidence < 100 && `• Confidence: ${Math.round(extractedContent.confidence)}%`}
                </div>
                <div className="max-h-96 overflow-y-auto p-4 bg-muted/20 rounded-lg">
                  {extractedContent.text ? (
                    formatTextForDyslexia(extractedContent.text)
                  ) : (
                    <p className="text-muted-foreground italic">No text found in the document.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Upload a document to extract text</p>
                <p className="text-sm mt-2">The text will appear here in a dyslexia-friendly format</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};