// Copyright (C) 2026 Neon Law Foundation.
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * The matter this portal renders — fixture data, and nothing else.
 *
 * *Estate of Cornelius Montgomery* is simulated. Cornelius Montgomery does not
 * exist and neither do any of the beneficiaries below. It is one of the three
 * matters Navigator's own seed opens (`store/src/seed.rs`), which is why the
 * code and the caption match that seed exactly: a sample that disagrees with
 * the fixture it is served beside teaches the wrong thing.
 *
 * Data lives here rather than inside a component on purpose — see the sibling
 * repositories for the same split. A real portal replaces this module with a
 * same-origin read against Navigator's `/app/api`.
 */

export const MATTER = {
  /** The Project code. It is also the first segment of the bucket prefix. */
  code: 'sample-estate',
  caption: 'Estate of Cornelius Montgomery',
  client: 'Cornelius Montgomery',
  practice: 'Estate plan',
  jurisdiction: 'Nevada',
} as const

/**
 * Why this estate needs a plan at all, stated as data because it is the whole
 * problem the matter exists to solve.
 *
 * There is no spouse and there are no children, so nothing passes to a
 * surviving spouse or issue. Nevada intestacy would divide the residue among
 * the next degree of kindred by operation of law — which is very nearly what
 * the testator wants, and "very nearly" is the reason for a will. Intestacy
 * cannot express an unequal share, cannot name a personal representative, and
 * cannot hold a beneficiary's gift in trust until they are old enough for it.
 */
export const CIRCUMSTANCES = {
  spouse: false,
  issue: false,
  note: 'No spouse and no children. The residue is divided among nieces and nephews by the plan rather than by the intestacy statute.',
} as const

/**
 * The beneficiaries and their shares.
 *
 * Shares are in basis points so they sum exactly. Percentages of an estate are
 * the classic place a rounding error becomes a dispute between people who have
 * just lost someone, and a share table that does not add up is the one bug in
 * this file that would matter.
 */
export const BENEFICIARIES = [
  { id: 'harriet', name: 'Harriet Montgomery-Vale', relation: 'Niece', shareBps: 3000 },
  { id: 'julian', name: 'Julian Montgomery', relation: 'Nephew', shareBps: 2500 },
  { id: 'priya', name: 'Priya Montgomery-Rao', relation: 'Niece', shareBps: 2000 },
  { id: 'desmond', name: 'Desmond Ashcroft', relation: 'Nephew', shareBps: 1500 },
  { id: 'tessa', name: 'Tessa Ashcroft', relation: 'Niece', shareBps: 1000 },
] as const

/** Basis points in a whole. Exported so the share test names the invariant. */
export const WHOLE_BPS = 10_000

/** One beneficiary's share as a percentage string. */
export function sharePercent(shareBps: number): string {
  return `${(shareBps / 100).toFixed(shareBps % 100 === 0 ? 0 : 1)}%`
}

export const MATTER_FACTS = [
  { label: 'Client', value: MATTER.client },
  { label: 'Practice', value: MATTER.practice },
  { label: 'Beneficiaries', value: String(BENEFICIARIES.length) },
  { label: 'Data', value: 'Fixture only' },
]

/** The instruments the plan is made of. */
export const INSTRUMENTS = [
  { id: 'will', title: 'Will', detail: 'Names the personal representative and divides the residue.' },
  { id: 'trust', title: 'Trust', detail: "Holds a beneficiary's share where an outright gift is not appropriate yet." },
  { id: 'directive-health', title: 'Health care directive', detail: 'Who decides, and on what instructions.' },
  { id: 'directive-financial', title: 'Financial power of attorney', detail: 'Who signs during incapacity.' },
]

/** What the client is being asked to do next. */
export const NEXT_STEPS = [
  {
    id: 'confirm-beneficiaries',
    title: 'Confirm the list of nieces and nephews',
    detail:
      'Every name and share below has to be right before the will is engrossed. A missing beneficiary is the hardest thing to fix later.',
  },
  {
    id: 'review-drafts',
    title: 'Review the draft will and trust',
    detail: 'Read both end to end and note anything that does not match your intentions.',
  },
  {
    id: 'ask-questions',
    title: 'Message your legal team with questions',
    detail: 'Anything unclear is worth raising early rather than at a signing.',
  },
]
