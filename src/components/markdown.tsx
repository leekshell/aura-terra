import React from "react";

/** Renderizador Markdown mínimo (headings, listas, tabelas, citações, negrito) — sem dependências. */
export function Markdown({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className="prose-aura">
      {blocks.map((block, i) => {
        const lines = block.split("\n");

        if (block.startsWith("## ")) return <h2 key={i}>{inline(block.slice(3))}</h2>;
        if (block.startsWith("### ")) return <h3 key={i}>{inline(block.slice(4))}</h3>;
        if (block.startsWith("> "))
          return <blockquote key={i}>{inline(block.replace(/^> ?/gm, ""))}</blockquote>;

        if (lines.every((l) => /^\s*[-*] /.test(l)))
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-*] /, ""))}</li>
              ))}
            </ul>
          );

        if (lines.every((l) => /^\s*\d+\. /.test(l)))
          return (
            <ol key={i} className="ml-5 list-decimal space-y-1.5">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*\d+\. /, ""))}</li>
              ))}
            </ol>
          );

        if (lines.length > 2 && lines[0].includes("|") && /^\|[\s\-|:]+\|$/.test(lines[1].trim())) {
          const head = cells(lines[0]);
          const body = lines.slice(2).map(cells);
          return (
            <div key={i} className="my-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-areia-100 text-left">
                    {head.map((h, j) => (
                      <th key={j} className="border border-areia-200 px-3 py-2 font-semibold text-forest-800">
                        {inline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, j) => (
                    <tr key={j}>
                      {row.map((c, k) => (
                        <td key={k} className="border border-areia-200 px-3 py-2 align-top">
                          {inline(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return <p key={i}>{inline(block)}</p>;
      })}
    </div>
  );
}

function cells(line: string) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
}

function inline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("_") && p.endsWith("_")) return <em key={i}>{p.slice(1, -1)}</em>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}
