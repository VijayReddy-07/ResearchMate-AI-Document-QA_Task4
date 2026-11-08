# ResearchMate – AI Document Q&A

An AI-powered PDF question-answering application built with Next.js, React, TypeScript and Google Gemini. Upload research papers or academic documents, ask questions, and receive context-aware AI-generated answers with relevant PDF page references.

## Application Preview

<img width="1731" height="1336" alt="image" src="https://github.com/user-attachments/assets/2bc3facf-3567-4965-b0ef-797a0ce7780d" />

*ResearchMate – AI-powered document question-answering interface.*

## Overview

ResearchMate helps students, researchers and professionals understand lengthy PDF documents more efficiently. Users can upload a research paper, ask questions in natural language, and receive answers generated using relevant information extracted from the document.

The application combines PDF text extraction, text chunking, relevant passage retrieval and Google's Gemini API to provide document-based answers.

## Key Features

- **PDF Upload:** Upload PDF documents using a simple interface.
- **AI-Powered Q&A:** Ask questions about uploaded documents.
- **Context-Aware Responses:** Retrieves relevant passages before generating answers.
- **Streaming Responses:** Displays AI-generated answers progressively.
- **Source References:** Shows relevant PDF page references.
- **Markdown Rendering:** Displays formatted headings, lists, bold text, and tables.
- **Input Validation:** Validates PDF format, file size, and question length.
- **Loading Indicators:** Provides feedback during document processing.
- **Error Handling:** Displays understandable API and processing errors.
- **Responsive Design:** Clean and user-friendly interface.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | CSS |
| AI Model | Google Gemini |
| AI Integration | Google GenAI SDK |
| PDF Processing | pdf-parse |
| Markdown Rendering | React Markdown, Remark GFM |
| Development | VS Code, npm |
| Version Control | Git, GitHub |
| Deployment | Vercel |

## System Architecture

```text
             USER
               |
               v
      ResearchMate Frontend
         (Next.js + React)
               |
               v
          Upload PDF
               |
               v
         Backend API
          (/api/ask)
               |
               v
        Extract PDF Text
               |
               v
          Text Chunking
               |
               v
     Relevant Passage Retrieval
               |
               v
        Google Gemini API
               |
               v
       Streaming AI Response
               |
               v
       Answer + Page Sources
               |
               v
             USER
```

## Project Structure

```text
ai-research-assistant/
│
├── app/
│   ├── api/
│   │   └── ask/
│   │       └── route.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── screenshots/
│   └── researchmate-dashboard.png
│
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
├── next-env.d.ts
└── README.md
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/VijayReddy-07/ResearchMate-AI-Document-QA.git
```

### 2. Navigate to the Project

```bash
cd ResearchMate-AI-Document-QA
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory.

Add your Google Gemini API credentials:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_available_gemini_model
```

Get your API key from [Google AI Studio](https://aistudio.google.com/apikey).

Use a Gemini model available to your API key.

**Security:** Never expose your API key in frontend code or upload `.env.local` to GitHub.

### 5. Run the Application

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

## How to Use

1. Open ResearchMate in your browser.
2. Upload a PDF research paper or document.
3. Enter a question related to the uploaded document.
4. Submit your question.
5. Wait for the AI to process the document.
6. View the generated answer and relevant PDF page references.

### Example Questions

- What is the main objective of this research paper?
- Explain the key concepts discussed in the document.
- What methodologies are used in this research?
- Summarize the major findings.
- What are the applications of the proposed approach?
- What limitations are mentioned in the document?

## AI Processing Workflow

1. Accepts a PDF document from the user.
2. Extracts text from the uploaded PDF.
3. Divides the extracted text into smaller overlapping chunks.
4. Identifies relevant passages based on the user's question.
5. Sends the selected context to Google Gemini.
6. Generates a context-aware answer.
7. Streams the response to the frontend.
8. Displays the answer with relevant source references.

## Deployment

The application can be deployed using [Vercel](https://researchmates.netlify.app/).

1. Push the project repository to GitHub.
2. Import the repository into Vercel.
3. Configure the environment variables:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL`
4. Deploy the application.
5. Test PDF uploads and question answering using the public URL.
