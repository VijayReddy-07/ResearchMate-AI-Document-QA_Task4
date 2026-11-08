# ResearchMate — AI Document Q&A

A purpose-built PDF question-answering web app built with Next.js, React, TypeScript and the Google Gemini API. It extracts PDF text on the server, selects relevant passages, streams an answer, and displays page references.

## Features

- PDF upload (maximum 10 MB)
- Document-grounded Q&A with page citations
- Streaming answer output
- Loading, validation and error states
- Responsive interface
- Gemini API key is used only on the server
- No persistent storage: the uploaded PDF is processed for each question and is not saved by this app

## Requirements

- Node.js 20.9 or newer
- npm
- A Google Gemini API key from Google AI Studio

## Run locally (Windows PowerShell)

```powershell
# Open this project folder in VS Code, then run:
npm install

# Create your local environment file
Copy-Item .env.example .env.local

# Open .env.local and set your real key:
# GEMINI_API_KEY=your_real_key
# GEMINI_MODEL=gemini-3.8-flash

npm run dev
```

Open http://localhost:3000.

If the selected model is not available for your API key, set `GEMINI_MODEL` to a model that is listed as available in your Google AI Studio / Gemini API account. Do not put the API key in any file under `app/` or in a `NEXT_PUBLIC_` variable.

## How it works

1. The browser sends the PDF and question to `POST /api/ask`.
2. The Next.js server validates the file and question.
3. `pdf-parse` extracts selectable text from the PDF.
4. Text is split into overlapping passages and ranked using a lightweight keyword relevance score.
5. The top passages are sent to Gemini as context.
6. The server streams Gemini's response to the browser using Server-Sent Events.
7. The UI displays the response and the pages of the selected passages.

## Deploy to Vercel

1. Push this project to a new GitHub repository.
2. Import the repository into Vercel.
3. In Vercel → Project → Settings → Environment Variables, add:
   - `GEMINI_API_KEY` = your Gemini API key
   - `GEMINI_MODEL` = a model available to your key (default in code: `gemini-3.8-flash`)
4. Deploy and open the public URL.
5. Test with a real text-based PDF, a normal question, an empty question, and a scanned PDF.

Do not commit `.env.local`. If the key has ever been committed or shared, rotate it.

## Important limitations

- This starter uses keyword-based passage ranking, not a persistent vector database. It is intentionally stateless so it can run on Vercel serverless hosting without requiring a separate database service.
- It processes up to the first 100 pages and a 10 MB PDF limit.
- Scanned/image-only PDFs require OCR and are reported as unsupported.
- Source cards show the retrieved PDF page numbers. Always verify important claims against the original document.
- This app is a starter implementation; before production use, add authentication, per-user rate limits, usage monitoring, malware scanning and stronger retrieval (for example, embeddings with a managed vector database).

## Project structure

```text
ai-research-assistant/
├── app/
│   ├── api/ask/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```
