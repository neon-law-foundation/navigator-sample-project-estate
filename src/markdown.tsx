// Copyright (C) 2026 Neon Law Foundation.
// SPDX-License-Identifier: AGPL-3.0-only

import type { ReactNode } from 'react'

/**
 * A renderer for the Markdown this repository actually produces.
 *
 * It is deliberately not a Markdown implementation. `research/convert.py` emits
 * a known shape — a heading, a metadata table, the reporter's head matter as a
 * blockquote, then the opinions as headings and paragraphs — and this reads that
 * shape and nothing else. A CommonMark parser would be a dependency, a bundle,
 * and a parser surface, all to render text that one script in this repository
 * generates.
 *
 * The consequence to know: an opinion whose text happens to contain a Markdown
 * construct this does not implement renders as literal characters rather than
 * being interpreted. For court prose that is the safer failure — a stray
 * underscore in a citation should not become emphasis.
 *
 * Two shapes here exist because `navigator validate` holds the generated files to
 * 120 columns. Court paragraphs are wrapped, so consecutive lines are joined back
 * into one paragraph rather than each becoming its own; and `convert.py` escapes
 * what wrapping turns into accidental Markdown — an `at *5` citation, a statute
 * number that lands at the start of a line — so the escapes are undone on the way
 * out. Both are the inverse of something that script does, and neither is a step
 * toward being a Markdown implementation.
 */
export function Markdown({ source }: { source: string }): ReactNode {
  return <>{blocks(source.split('\n'))}</>
}

/** Group the lines into blocks, since every construct here is line-based. */
function blocks(lines: string[]): ReactNode[] {
  const out: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index] ?? ''

    if (!line.trim()) {
      index += 1
      continue
    }

    if (line.startsWith('# ')) {
      out.push(<h3 key={index}>{inline(line.slice(2))}</h3>)
      index += 1
      continue
    }

    if (line.startsWith('## ')) {
      out.push(<h4 key={index}>{inline(line.slice(3))}</h4>)
      index += 1
      continue
    }

    if (line.startsWith('|')) {
      const rows: string[] = []
      while (index < lines.length && (lines[index] ?? '').startsWith('|')) {
        rows.push(lines[index] ?? '')
        index += 1
      }
      out.push(<Grid key={`table-${index}`} rows={rows} />)
      continue
    }

    if (line.startsWith('>')) {
      const quoted: string[] = []
      while (index < lines.length && (lines[index] ?? '').startsWith('>')) {
        quoted.push((lines[index] ?? '').replace(/^>\s?/, ''))
        index += 1
      }
      out.push(
        <blockquote key={`quote-${index}`}>
          {paragraphs(quoted).map((text, offset) => (
            <p key={offset}>{inline(text)}</p>
          ))}
        </blockquote>,
      )
      continue
    }

    const paragraph: string[] = []
    while (index < lines.length) {
      const next = lines[index] ?? ''
      const construct =
        next.startsWith('# ') || next.startsWith('## ') || next.startsWith('|') || next.startsWith('>')
      if (!next.trim() || construct) {
        break
      }
      paragraph.push(next.trim())
      index += 1
    }
    out.push(<p key={index}>{inline(paragraph.join(' '))}</p>)
  }

  return out
}

/**
 * Wrapped lines, rejoined into the paragraphs they were before wrapping.
 *
 * A blank line — inside a blockquote, a `>` with nothing after it — is the break.
 */
function paragraphs(lines: string[]): string[] {
  const out: string[] = []
  let current: string[] = []

  for (const line of lines) {
    if (line.trim()) {
      current.push(line.trim())
    } else if (current.length) {
      out.push(current.join(' '))
      current = []
    }
  }
  if (current.length) {
    out.push(current.join(' '))
  }

  return out
}

/**
 * The metadata table.
 *
 * `convert.py` writes a two-column table with an empty header row, so the
 * separator line is dropped and the first row is treated as data rather than
 * promoted to `<th>` — a header of two empty cells reads as a column of blanks
 * to a screen reader, which is worse than no header at all.
 */
function Grid({ rows }: { rows: string[] }) {
  const body = rows
    .filter((row) => !/^\|[\s|:-]*\|$/.test(row))
    .map((row) =>
      row
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim()),
    )
    .filter((cells) => cells.some((cell) => cell.length > 0))

  return (
    <table>
      <tbody>
        {body.map((cells, rowIndex) => (
          <tr key={rowIndex}>
            {cells.map((cell, cellIndex) => (
              <td key={cellIndex}>{inline(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** `**strong**`, `` `code` ``, and `<https://…>`: the whole of the inline vocabulary. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|<https?:\/\/[^>\s]+>)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={index}>{unescape(part.slice(2, -2))}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={index}>{part.slice(1, -1)}</code>
    }
    if (part.startsWith('<http') && part.endsWith('>')) {
      const href = part.slice(1, -1)
      return (
        <a key={index} href={href} rel="noreferrer">
          {href}
        </a>
      )
    }
    return <span key={index}>{unescape(part)}</span>
  })
}

/**
 * Undo the backslash escapes `convert.py` writes.
 *
 * It escapes what court text produces by accident once it is wrapped — the `*5` of
 * a LEXIS citation, the `11.` of a statute number that lands at a line's start —
 * and a reader should see the character, not the backslash in front of it.
 */
function unescape(text: string): string {
  return text.replace(/\\([\\*_`[\]()#+\-.!>])/g, '$1')
}
