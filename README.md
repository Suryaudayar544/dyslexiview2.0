# DSLEC Game: Dyslexia Support Learning Educational Challenge

DSLEC Game is a web-based educational application designed to help children with dyslexia improve their reading, word recognition, color-word association, and handwriting skills through interactive and engaging games.

## Screenshots

To add screenshots:
1. Run the development server with `npm run dev` and open http://localhost:8080 in your browser.
2. Take screenshots of key features (e.g., login, dashboard, each game level, reading helper).
3. Create a `screenshots` folder in the project root (or `public/screenshots` for static serving).
4. Add the image files (e.g., PNG or JPG) to the folder.
5. Reference them in this README using Markdown: `![Alt text](screenshots/filename.png)`.
6. Commit and push the changes: `git add . && git commit -m "Add screenshots to README" && git push`.

Example placeholders (replace with your actual images):
![Dashboard Screenshot](screenshots/dashboard.png)
![Level 1 Gameplay Screenshot](screenshots/level1.png)
![Level 2 Gameplay Screenshot](screenshots/level2.png)
![Level 3 Handwriting Screenshot](screenshots/level3.png)
![Reading Helper Screenshot](screenshots/reading-helper.png)

## Recent Updates

- **Level3Game.tsx**: Integrated Google Cloud Vision API for accurate handwriting recognition of drawn letters, with improved feedback and error handling.
- **index.html**: Added OpenGraph and Twitter meta tags for better social media sharing and SEO, including title, description, and image previews.

## ✨ Key Features

- **User Authentication**: Simple login system to personalize experience and track progress.
- **Gamified Learning**: Three levels targeting dyslexia-related skills:
  - **Level 1 (Word Listen)**: Listen to a word and select the matching option from visuals or text.
  - **Level 2 (Color Challenge)**: Say the color of the word (Stroop effect-inspired), using Web Speech API for recognition.
  - **Level 3 (Write Letters)**: Draw letters on canvas; recognized via Google Cloud Vision API with feedback.
- **Handwriting Recognition**: Integrates Google Cloud Vision API for accurate letter detection from drawings.
- **Reading Helper Tool**: Upload images or PDFs; extracts text using Tesseract.js (images) and pdf.js (PDFs).
- **Text-to-Speech (TTS)**: Reads extracted text aloud via ElevenLabs API (optional, high-quality) or browser's Web Speech API.
- **Dyslexia-Friendly UI**: Uses OpenDyslexic font and high-contrast, spaced text for better readability.
- **Progress Tracking**: Local storage saves scores, stars, and levels completed.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui components
- **APIs & Libraries**: Google Cloud Vision API (handwriting), Tesseract.js (OCR), pdfjs-dist (PDF), Web Speech API (TTS/STT)
- **Storage**: Local Storage for progress
- **Text-to-Speech (Optional)**: ElevenLabs API

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