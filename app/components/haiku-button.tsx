"use client";

import { useState } from "react";

export default function HaikuButton() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [haiku, setHaiku] = useState<string | null>(null);

    async function handleClick() {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/haiku", { method: "POST" });
            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            const data = await res.json();
            setHaiku(data.text);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <button
                onClick={handleClick}
                disabled={loading}
                className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
            >
                {loading ? "Writing..." : "Haiku"}
            </button>
            {error && <p className="mt-2 text-red-600">{error}</p>}
            {haiku && (
                <pre className="whitespace-pre-wrap rounded bg-gray-100 p-4 text-sm">{haiku}</pre>
            )}
        </div>
    );
}
