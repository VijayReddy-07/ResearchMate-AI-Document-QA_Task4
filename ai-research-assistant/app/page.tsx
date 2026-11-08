"use client";

import { FormEvent, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Source = { page: number; excerpt: string };
type AnswerState = "idle" | "loading" | "done" | "error";

const MAX_FILE_MB = 10;
const MAX_QUESTION = 1000;

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [status, setStatus] = useState<AnswerState>("idle");
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function acceptFile(candidate?: File) {
    if (!candidate) return;
    if (candidate.type !== "application/pdf" && !candidate.name.toLowerCase().endsWith(".pdf")) {
      setError("Please choose a PDF document.");
      return;
    }
    if (candidate.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`The PDF must be smaller than ${MAX_FILE_MB} MB.`);
      return;
    }
    setFile(candidate);
    setAnswer("");
    setSources([]);
    setError("");
    setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setAnswer("");
    setSources([]);
    setElapsed(null);

    if (!file) {
      setError("Upload a PDF before asking a question.");
      return;
    }
    if (!question.trim()) {
      setError("Enter a question about your document.");
      return;
    }
    if (question.trim().length > MAX_QUESTION) {
      setError(`Your question must be ${MAX_QUESTION} characters or fewer.`);
      return;
    }

    setStatus("loading");
    const started = Date.now();

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("question", question.trim());

      const response = await fetch("/api/ask", { method: "POST", body: form });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || `Request failed (${response.status}).`);
      }
      if (!response.body) throw new Error("The server returned an empty response.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let completed = false;

      while (!completed) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6);
          if (raw === "[DONE]") {
            completed = true;
            break;
          }
          const event = JSON.parse(raw);
          if (event.type === "text") setAnswer((current) => current + event.text);
          if (event.type === "sources") setSources(event.sources);
          if (event.type === "error") throw new Error(event.message);
        }
      }
      setElapsed((Date.now() - started) / 1000);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark">R</span> ResearchMate</a>
        <span className="top-pill"><span className="green-dot" /> AI DOCUMENT ASSISTANT</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="spark">✦</span> YOUR DOCUMENT. YOUR ANSWERS.</div>
        <h1>Understand your PDFs<br /><span>with a little help from AI.</span></h1>
        <p className="hero-copy">Upload a research paper, study notes, or technical guide. Ask a question and get an answer grounded in your document, with page references.</p>
      </section>

      <section className="workspace">
        <div className="panel upload-panel">
          <div className="panel-heading">
            <div><span className="step">01</span><h2>Add a document</h2></div>
            <span className="muted-label">PDF ONLY</span>
          </div>
          <div
            className={`dropzone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files[0]); }}
          >
            <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(e) => acceptFile(e.target.files?.[0])} />
            <div className="file-icon">PDF</div>
            {file ? (
              <>
                <strong className="filename">{file.name}</strong>
                <span className="drop-hint">{(file.size / 1024 / 1024).toFixed(2)} MB · Ready to analyze</span>
                <button className="text-button" type="button" onClick={() => { setFile(null); setAnswer(""); setSources([]); }}>Remove document</button>
              </>
            ) : (
              <>
                <strong>Drop your PDF here</strong>
                <span className="drop-hint">or choose a file from your computer</span>
                <button className="secondary-button" type="button" onClick={() => inputRef.current?.click()}>Choose PDF <span>↗</span></button>
                <span className="limit-note">Maximum file size: {MAX_FILE_MB} MB</span>
              </>
            )}
          </div>
          <div className="privacy-note"><span>♧</span> Your file is processed for this request and is not saved to a public database.</div>
        </div>

        <div className="panel question-panel">
          <div className="panel-heading">
            <div><span className="step">02</span><h2>Ask your question</h2></div>
            <span className="muted-label">DOCUMENT Q&amp;A</span>
          </div>
          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="question">What would you like to know?</label>
            <textarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={MAX_QUESTION} placeholder="e.g. What are the key findings of this paper?" rows={5} />
            <div className="input-footer"><span>Be specific for more useful answers.</span><span>{question.length}/{MAX_QUESTION}</span></div>
            <button className="primary-button" type="submit" disabled={status === "loading"}>
              {status === "loading" ? <><span className="spinner" /> Reading your document…</> : <>Generate answer <span>→</span></>}
            </button>
          </form>
          <div className="suggestions">
            <span className="suggestion-label">TRY ASKING</span>
            {["Summarize the main ideas", "Explain the key methodology", "What are the important conclusions?"].map((item) => (
              <button key={item} type="button" className="suggestion" onClick={() => setQuestion(item)}>{item} <span>↗</span></button>
            ))}
          </div>
        </div>
      </section>

      {error && <div className="error-banner" role="alert"><span>!</span><div><strong>Something needs your attention</strong><p>{error}</p></div></div>}

      {(answer || status === "loading") && (
        <section className="panel answer-panel" aria-live="polite">
          <div className="answer-heading"><div><span className="answer-icon">✦</span><div><span className="muted-label">YOUR DOCUMENT-BASED RESPONSE</span><h2>Here&apos;s what I found</h2></div></div>{status === "loading" && <span className="live-label"><span className="green-dot" /> GENERATING</span>}</div>
          <div className="answer-content">
            {answer ? (
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
              </div>
            ) : (
              <span className="answer-placeholder">Reading relevant passages and preparing your answer…</span>
            )}
            {status === "loading" && <span className="cursor" />}
          </div>
          {sources.length > 0 && <div className="sources"><h3>Sources from your PDF</h3><div className="source-grid">{sources.map((source, index) => <div className="source-card" key={`${source.page}-${index}`}><span className="page-tag">PAGE {source.page}</span><p>{source.excerpt}</p></div>)}</div></div>}
          {status === "done" && elapsed !== null && <div className="answer-meta">Generated in {elapsed.toFixed(1)} seconds · Grounded in your uploaded PDF</div>}
        </section>
      )}

      <footer><span>ResearchMate</span><span>Built with Next.js + Gemini · AI can make mistakes, verify important details.</span></footer>
    </main>
  );
}
