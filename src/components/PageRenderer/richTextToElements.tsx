import React from 'react';

type Node =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] };

function isBlank(line: string) {
  return line.trim().length === 0;
}

export function richTextToElements(input: string): React.ReactNode {
  // Strapi "richtext" sometimes stores markdown-like text. We render a safe subset
  // without using dangerouslySetInnerHTML.
  const lines = input.replace(/\r\n/g, '\n').split('\n');
  const nodes: Node[] = [];

  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    const text = paragraph.join(' ').trim();
    if (text) nodes.push({ type: 'p', text });
    paragraph = [];
  };

  const flushList = () => {
    if (listItems.length) nodes.push({ type: 'ul', items: listItems });
    listItems = [];
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (isBlank(line)) {
      flushList();
      flushParagraph();
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      flushParagraph();
      nodes.push({ type: 'h3', text: line.slice(4).trim() });
      continue;
    }

    if (line.startsWith('## ')) {
      flushList();
      flushParagraph();
      nodes.push({ type: 'h2', text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith('- ')) {
      flushParagraph();
      listItems.push(line.slice(2).trim());
      continue;
    }

    // Otherwise, part of a paragraph.
    flushList();
    paragraph.push(line);
  }

  flushList();
  flushParagraph();

  return (
    <>
      {nodes.map((n, idx) => {
        if (n.type === 'h2') return <h2 key={idx}>{n.text}</h2>;
        if (n.type === 'h3') return <h3 key={idx}>{n.text}</h3>;
        if (n.type === 'p') return <p key={idx}>{n.text}</p>;
        return (
          <ul key={idx}>
            {n.items.map((item: string, i: number) => (
              <li key={`${idx}-${i}`}>{item}</li>
            ))}
          </ul>
        );
      })}
    </>
  );
}

