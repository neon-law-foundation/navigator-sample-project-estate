# Research — Washington estates that passed without a will

Pulled 2026-08-20. Eleven Washington cases in which the decedent **died intestate**: the estate was divided by the
descent statute because there was no instrument to divide it otherwise. The portal renders this list under its
*Research* tab ([`src/research.ts`](../src/research.ts) is the index it reads); this folder is the full text.

Read the `.md` files. The `.json` files are the source they are generated from.

**The cases are real. The matter is not.** *Estate of Cornelius Montgomery* is fixture data and nobody named in the rest
of this repository exists. Published opinions are public record, which is why they can sit in a public repository at all
— no client material belongs here, ever.

## Why intestacy, for a matter that is writing a will

The plan exists to beat the statute. There is no spouse and there are no children, so the residue would pass to
collateral kindred by operation of law — nearly, but not exactly, what the testator wants. Every case below is an estate
that went that way.

## The cases

- [In re Estate of Borghi](opinions/in-re-estate-of-borghi.md), 167 Wash. 2d 480 (2009) — separate vs. community
  character, fixed at acquisition and distributed as it stands.
- [Olver v. Fowler](opinions/olver-v-fowler.md), 161 Wash. 2d 655 (2007) — a committed intimate partner takes an
  equitable share, never a spouse's intestate share.
- [In re Estate of Little](opinions/in-re-estate-of-little.md), 106 Wash. 2d 269 (1986) — RCW 11.04.035: half-blood
  kindred limited among collateral heirs only.
- [Gonzales v. Cowen](opinions/gonzales-v-cowen.md), 76 Wash. App. 277 (1994) — intestate with no issue passes to
  surviving parents; paternity proved after the death.
- [Bentzen v. Demmons](opinions/bentzen-v-demmons.md), 68 Wash. App. 339 (1993) — nephew as sole heir by intestate
  succession; an unmarried partner must sue the estate.
- [In re Binge's Estate](opinions/in-re-binges-estate.md), 5 Wash. 2d 446 (1940) — intestate without issue: community
  half, separate residue, homestead award ahead of heirs.
- [France v. Freeze](opinions/france-v-freeze.md), 4 Wash. 2d 120 (1940) — title vests in the heirs at death; a decree
  binds nobody who was not before the court.
- [In re Graley's Estate](opinions/in-re-graleys-estate.md), 183 Wash. 268 (1935) — "Leaving no heirs" means none has
  appeared; the State carries the burden before escheat.
- [In re Lyons' Estate](opinions/in-re-lyons-estate.md), 175 Wash. 115 (1933) — escheat follows situs, but the law of
  the domicil distributes the personalty.
- [State ex rel. Cowley v. Superior Court](opinions/cowley-v-superior-court.md), 158 Wash. 546 (1930) — "Next of kin"
  entitled to administer means those who would inherit.
- [In re Estate of Fields](opinions/in-re-estate-of-fields.md), 141 Wash. 526 (1927) — no issue, no parents, no
  surviving siblings — what nieces and nephews take by representation.

*Fields* is the fact pattern in the mirror, and the one entry to read if you read only one: a decedent survived by a
widow and by the children of predeceased brothers and sisters, with the shares settled by the descent statute rather
than by an instrument.

## Where this came from

The **Caselaw Access Project** static archive (`static.case.law`), the Harvard Law Library digitisation of the printed
reporters — authoritative text with the reporter's page numbers preserved. CourtListener and Descrybe were used to find
the right cases; the text itself is CAP's.

[`convert.py`](convert.py) regenerates the Markdown from the JSON. Nothing in `opinions/` is edited by hand:

```bash
python3 research/convert.py
```

## Four things to know before relying on these

**Three are filed at CAP under a party caption.** The filenames here follow the reported caption; CAP's index does not:

- *In re Binge's Estate* is filed as *Binge v. Mumm*.
- *In re Graley's Estate* is filed as *State v. Plum*.
- *In re Lyons' Estate* is filed as *State v. Territory of Alaska*.

Citation, date, and text are the right ones either way, and each `.md` header carries the caption CAP used.

**Fields never uses the word "intestate".** It is here because the estate proceeded on a petition for letters of
administration and the court settled the shares under the descent statute, Rem. Comp. Stat. § 1341, which is what an
intestate death looks like in a 1927 opinion.

**The older scans carry OCR damage.** *Fields* reads "brought up iu the transcript" and "survived bim". Check any
quotation against the reporter before it goes anywhere.

**This is not a citator.** No treatment was verified. These are the texts, not a view on whether each is still good law.

## One thing to reconcile

The research is Washington because that is where the client lives. `src/matter.ts` records `jurisdiction: 'Nevada'`,
matching Navigator's own seed. Those two disagree, and which one moves is a decision about the fixture rather than about
the research — so nothing was changed to paper over it.
