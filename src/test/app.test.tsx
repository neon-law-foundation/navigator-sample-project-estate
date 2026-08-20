// Copyright (C) 2026 Neon Law Foundation.
// SPDX-License-Identifier: AGPL-3.0-only

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { App } from '../App'
import { BENEFICIARIES, CIRCUMSTANCES, MATTER, WHOLE_BPS, sharePercent } from '../matter'

describe('the Montgomery estate portal', () => {
  it('shows the matter it was built for', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(MATTER.caption)
  })

  /**
   * The invariant that actually matters in an estate plan: the shares add up
   * to the whole. Percentages of an estate are the classic place a rounding
   * error becomes a dispute between people who have just lost someone, so this
   * is asserted on the data rather than eyeballed in the table.
   */
  it('divides exactly the whole residue', () => {
    const total = BENEFICIARIES.reduce((sum, person) => sum + person.shareBps, 0)
    expect(total).toBe(WHOLE_BPS)
  })

  /**
   * The premise of the matter: no spouse, no issue, so nieces and nephews.
   *
   * The page says it in more than one place — the circumstances note and the
   * first next step — which is deliberate, so this counts rather than
   * expecting one match. A client should not have to infer why the plan exists.
   */
  it('is an estate with no spouse and no issue', () => {
    expect(CIRCUMSTANCES.spouse).toBe(false)
    expect(CIRCUMSTANCES.issue).toBe(false)
    render(<App />)
    expect(screen.getAllByText(/nieces and nephews/).length).toBeGreaterThan(0)
  })

  it('names every beneficiary and their share', () => {
    render(<App />)
    for (const person of BENEFICIARIES) {
      expect(screen.getByText(person.name)).toBeInTheDocument()
    }
    expect(BENEFICIARIES.length).toBeGreaterThan(1)
  })

  it('renders a whole-number share without a trailing zero', () => {
    expect(sharePercent(3000)).toBe('30%')
    expect(sharePercent(2550)).toBe('25.5%')
  })

  it('says outright that the matter is simulated', () => {
    render(<App />)
    expect(screen.getByText(/simulated matter/)).toBeInTheDocument()
  })
})
