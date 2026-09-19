"use client";

import type { PropDoc } from "@/catalog/api";

export function PropsTable({ props: rows }: { props: PropDoc[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-app-border-mid">
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-app-border bg-app-panel">
            {["Prop", "Type", "Default", "Description"].map((h) => (
              <th
                key={h}
                className="px-3 py-2 font-title text-[11px] font-semibold tracking-[0.08em] text-app-dim uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr
              key={p.name}
              className="border-b border-app-border align-top last:border-0"
            >
              <td className="px-3 py-2.5 font-mono text-[12px] whitespace-nowrap text-app-bright">
                {p.name}
              </td>
              <td className="px-3 py-2.5 font-mono text-[11px] text-app-accent">
                {p.type}
              </td>
              <td className="px-3 py-2.5 font-mono text-[11px] whitespace-nowrap text-app-dim">
                {p.default ?? "—"}
              </td>
              <td className="px-3 py-2.5 text-[12px] leading-relaxed text-app-text">
                {p.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
