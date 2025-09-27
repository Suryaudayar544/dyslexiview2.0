#  Word Wonder: Interactive Learning Games

Word Wonder is a web-based educational application designed to help children, especially those with dyslexia, improve their reading, recognition, and writing skills through fun and interactive games.

![Reading Helper Screenshot](https://storage.googleapis.com/lovable-public-assets/response-images/image_e625bb.png)
![Level 3 Gameplay Screenshot](https://storage.googleapis.com/lovable-public-assets/response-images/image_e625f3.png)

## ✨ Key Features

-   **User Authentication**: A simple login system to personalize the experience and track progress.
-   **Gamified Learning**: Three engaging levels that target different learning skills:
    -   **Level 1 (Word Listen)**: An auditory recognition game where users listen to a word and select the correct one from a list.
    -   **Level 2 (Color Challenge)**: A cognitive game that challenges users to say the *color* of a word, not the word itself, using the Web Speech API for voice recognition.
    -   **Level 3 (Write Letters)**: A writing practice game where users draw letters on a canvas, which are then evaluated by a Machine Learning model.
-   **Handwriting Recognition**: Uses Google Cloud Vision API to recognize handwritten letters and provide feedback.
-   **Reading Helper Tool**: An assistive tool that uses **Tesseract.js** (for images) and **pdf.js** (for PDFs) to extract text from uploaded files.
-   **Advanced Text-to-Speech (TTS)**: Extracted text is read aloud using high-quality voices from the **ElevenLabs API** (if a key is provided) or the browser's native Web Speech API.
-   **Dyslexia-Friendly UI**: Text is rendered in dyslexia-friendly fonts and formats to improve readability.
-   **Progress Tracking**: User scores and stars are saved locally, allowing them to track their improvement over time.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **UI**: Tailwind CSS, shadcn/ui
-   **Machine Learning**: TensorFlow.js, Tesseract.js
-   **Browser APIs**: Web Speech API (Synthesis & Recognition), Canvas, Local Storage
-   **PDF Parsing**: pdfjs-dist
-   **Text-to-Speech (Optional)**: ElevenLabs API

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   npm or bun package manager

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_GIT_URL>
    cd <YOUR_PROJECT_NAME>
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up Environment Variables (Optional):**
    To enable high-quality text-to-speech in the Reading Helper, create a file named `.env` in the project root and add your ElevenLabs API key:
    ```
    VITE_ELEVENLABS_API_KEY="your_elevenlabs_api_key_here"
    ```
    *Note: The `.env` file is included in `.gitignore` to keep your API key private.*

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:8080](http://localhost:8080) to view the application in your browser.

## 📁 Project Structure

The project is organized with a clear separation of concerns:

-   `public/`: Static assets.
-   `src/`: Main application source code.
    -   `components/`: Reusable React components, including game levels and UI elements.
    -   `hooks/`: Custom React hooks for state management (`useGameState`).
    -   `lib/`: Utility functions.
    -   `pages/`: Top-level page components for routing.
-   `App.tsx`: The root component that sets up routing and global providers.
-   `main.tsx`: The application's entry point.