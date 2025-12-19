"use client";

import { useState } from "react";

export default function SummarizerForm() {
    const [input, setInput] = useState("");
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSummarize() {
        if (!input.trim()) return;

        setLoading(true);
        setError(null);
        setSummary(null);

        try {
            const res = await fetch("/api/summarizer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || `Request failed (${res.status})`);
            }

            const data: { summary: string } = await res.json();
            setSummary(data.summary);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4 max-w-xl">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text to summarize…"
          rows={6}
          className="w-full rounded border border-gray-300 p-2 text-sm"
        />
        <button onClick={handleSummarize} disabled={loading || !input.trim()}
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
          {loading ? "Summarizing…" : "Summarize"}
        </button>
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        {summary && (
          <div className="rounded bg-gray-100 p-4 text-sm whitespace-pre-wrap">
            {summary}
          </div>
        )}
        </div>
    );
}
