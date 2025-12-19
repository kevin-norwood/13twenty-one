import { NextResponse } from "next/server";
import { getClaude, MODEL } from "@/app/claude/client";

export async function POST() {
    const claude = await getClaude();

    const response = await claude.messages.create({
        model: MODEL,
        max_tokens: 512,
        messages: [{ role: "user", content: "Write a haiku about programming." }],
    });

    const text = response.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n");

    console.log(text);

    return NextResponse.json({ ok: true, text });
}