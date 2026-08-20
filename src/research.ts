// Copyright (C) 2026 Neon Law Foundation.
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * The research behind the plan: Washington cases in which the decedent died
 * intestate.
 *
 * Why intestacy, for a matter that is making a will? Because the will exists to
 * beat the statute. Cornelius Montgomery has no spouse and no issue, so if he
 * died today the residue would pass by descent to his collateral kindred —
 * nearly, but not exactly, the division he wants. Every case below is a
 * Washington estate that went that way, and read together they are the argument
 * for signing something.
 *
 * The full opinions live in `research/opinions/` as text, pulled from the
 * Caselaw Access Project. This module is the index the portal renders; the
 * folder is the corpus. Neither is a citator — no treatment has been verified.
 *
 * Data lives here rather than inside a component for the same reason the matter
 * does — see `matter.ts`. A real portal replaces this module with a same-origin
 * read against Navigator's `/app/api`.
 */

export interface Authority {
  id: string
  /** The reported caption, which is how a lawyer will look for it. */
  caption: string
  citation: string
  year: number
  court: 'Supreme Court' | 'Court of Appeals'
  /** File under `research/opinions/`, without the extension. */
  file: string
  /** What this case is in the folder for. */
  holding: string
}

export const RESEARCH_JURISDICTION = 'Washington'

export const AUTHORITIES: Authority[] = [
  {
    id: 'borghi',
    caption: 'In re Estate of Borghi',
    citation: '167 Wash. 2d 480',
    year: 2009,
    court: 'Supreme Court',
    file: 'in-re-estate-of-borghi',
    holding:
      'Whether property is separate or community is fixed at acquisition, and an intestate death distributes it as it stands.',
  },
  {
    id: 'olver',
    caption: 'Olver v. Fowler',
    citation: '161 Wash. 2d 655',
    year: 2007,
    court: 'Supreme Court',
    file: 'olver-v-fowler',
    holding:
      'A committed intimate partner may take an equitable share of what the couple built, but never a spouse’s intestate share.',
  },
  {
    id: 'little',
    caption: 'In re Estate of Little',
    citation: '106 Wash. 2d 269',
    year: 1986,
    court: 'Supreme Court',
    file: 'in-re-estate-of-little',
    holding:
      'RCW 11.04.035 limits half-blood kindred among collateral heirs only — the statute the residue would fall to here.',
  },
  {
    id: 'gonzales',
    caption: 'Gonzales v. Cowen',
    citation: '76 Wash. App. 277',
    year: 1994,
    court: 'Court of Appeals',
    file: 'gonzales-v-cowen',
    holding:
      'An intestate with no issue passes to surviving parents, and a parent may prove the relationship after the death.',
  },
  {
    id: 'bentzen',
    caption: 'Bentzen v. Demmons',
    citation: '68 Wash. App. 339',
    year: 1993,
    court: 'Court of Appeals',
    file: 'bentzen-v-demmons',
    holding:
      'A nephew took as sole heir by intestate succession, and an unmarried partner had to sue the estate for her share.',
  },
  {
    id: 'binge',
    caption: "In re Binge's Estate",
    citation: '5 Wash. 2d 446',
    year: 1940,
    court: 'Supreme Court',
    file: 'in-re-binges-estate',
    holding:
      'An intestate without issue: the widow’s community half, the separate residue, and the homestead award ahead of the heirs.',
  },
  {
    id: 'france',
    caption: 'France v. Freeze',
    citation: '4 Wash. 2d 120',
    year: 1940,
    court: 'Supreme Court',
    file: 'france-v-freeze',
    holding:
      'Title vests in the heirs at the moment of death, and a decree of distribution binds nobody who was not before the court.',
  },
  {
    id: 'graley',
    caption: "In re Graley's Estate",
    citation: '183 Wash. 268',
    year: 1935,
    court: 'Supreme Court',
    file: 'in-re-graleys-estate',
    holding:
      '“Leaving no heirs” means none has appeared and claimed; the State carries the burden before an estate escheats.',
  },
  {
    id: 'lyons',
    caption: "In re Lyons' Estate",
    citation: '175 Wash. 115',
    year: 1933,
    court: 'Supreme Court',
    file: 'in-re-lyons-estate',
    holding:
      'Escheat follows the situs of the property, but the law of the decedent’s domicil distributes the personalty.',
  },
  {
    id: 'cowley',
    caption: 'State ex rel. Cowley v. Superior Court',
    citation: '158 Wash. 546',
    year: 1930,
    court: 'Supreme Court',
    file: 'cowley-v-superior-court',
    holding:
      '“Next of kin” entitled to administer means those who would inherit — the right to administer follows the property.',
  },
  {
    id: 'fields',
    caption: 'In re Estate of Fields',
    citation: '141 Wash. 526',
    year: 1927,
    court: 'Supreme Court',
    file: 'in-re-estate-of-fields',
    holding:
      'No issue, no parents, no surviving siblings: what nieces and nephews take by representation, and what they do not.',
  },
]

/**
 * The case this matter is closest to.
 *
 * *Fields* is the fact pattern in the mirror — a decedent survived by a widow
 * and by nieces and nephews of predeceased siblings, whose shares were settled
 * by the descent statute rather than by an instrument. It is the one entry a
 * client should read if they read only one.
 */
export const NEAREST_AUTHORITY = 'fields'

/** Where the full text sits, for the note under the table. */
export const RESEARCH_FOLDER = 'research/opinions/'
