// Copyright (C) 2026 Neon Law Foundation.
// SPDX-License-Identifier: AGPL-3.0-only

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Markdown } from '../markdown'

/**
 * The renderer's contract with `research/convert.py`.
 *
 * That script wraps every court paragraph to 120 columns, because `navigator
 * validate` rejects a longer line, and escapes what wrapping turns into accidental
 * Markdown. Both are undone here rather than in the file, so both are asserted
 * here — a regression would show up as an opinion rendered one line per paragraph,
 * or as backslashes on the page, and neither is visible in a passing build.
 */
describe('the renderer for what convert.py emits', () => {
  it('joins wrapped lines back into the paragraph they came from', () => {
    render(<Markdown source={'One paragraph the converter\nwrapped across two lines.\n\nA second paragraph.\n'} />)
    expect(screen.getByText('One paragraph the converter wrapped across two lines.')).toBeInTheDocument()
    expect(screen.getByText('A second paragraph.')).toBeInTheDocument()
  })

  it('undoes the escapes that keep court text from reading as Markdown', () => {
    render(<Markdown source={'A citation at \\*5, and a statute cited as\n11\\.04.015(2)(b).\n'} />)
    expect(screen.getByText('A citation at *5, and a statute cited as 11.04.015(2)(b).')).toBeInTheDocument()
  })

  it('renders an autolinked URL as a link to itself', () => {
    render(<Markdown source={'Available at <http://www.courts.wa.gov/newsinfo>.\n'} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'http://www.courts.wa.gov/newsinfo')
  })

  it('keeps the head matter in the paragraphs the reporter wrote', () => {
    render(<Markdown source={'> Head matter, first\n> paragraph of it.\n>\n> Second paragraph.\n'} />)
    expect(screen.getByText('Head matter, first paragraph of it.')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument()
  })
})
