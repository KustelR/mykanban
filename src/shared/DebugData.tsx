import React from "react";

type DebugInfo = Map<string, string | number>;

export default function DebugData(props: { header: string; data: DebugInfo }) {
  const { header, data } = props;
  return (
    <section className="p-1 text-xs">
      <header className="font-semibold">{header}</header>
      <ul>
        {[...data.entries()].map((item, idx) => {
          return (
            <li key={idx}>
              {item[0]}: {item[1]}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
