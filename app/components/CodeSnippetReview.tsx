"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function CodeSnippetReview({ code, language, comments = [] }: {
  code: string; language: string; comments?: Array<{ lineNumber?: number; content: string; authorId?: { name?: string } }>
}) {
  const [value] = useState(code);
  return <section className="overflow-hidden rounded-lg border border-zinc-800">
    <div className="border-b border-zinc-800 px-4 py-2 text-xs text-zinc-400">{language}</div>
    <SyntaxHighlighter language={language} style={oneDark} customStyle={{ margin: 0, background: "#09090b" }}>{value}</SyntaxHighlighter>
    <div className="divide-y divide-zinc-800">
      {comments.map((comment, i) => <article key={i} className="px-4 py-3 text-sm">
        <p className="text-xs text-zinc-500">{comment.authorId?.name ?? "Comentário"}{comment.lineNumber ? ` · linha ${comment.lineNumber}` : ""}</p>
        <p className="mt-1">{comment.content}</p>
      </article>)}
    </div>
  </section>;
}