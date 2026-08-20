#!/usr/bin/env python3
# Copyright (C) 2026 Neon Law Foundation.
# SPDX-License-Identifier: AGPL-3.0-only

"""Render the Caselaw Access Project JSON in `opinions/` as readable Markdown.

The JSON is the source and the Markdown is derived, so nothing here is edited by
hand — re-run this rather than fixing a `.md` in place:

    python3 research/convert.py

One `.md` per `.json`, written beside it. A case whose JSON is replaced by a
fresh download regenerates identically, which is the point: the text a reader
quotes should be traceable to the file it came from.
"""

import json
import pathlib

OPINIONS = pathlib.Path(__file__).parent / "opinions"


def citations(case: dict) -> list[str]:
    return [c["cite"] for c in case.get("citations", [])]


def render(case: dict) -> str:
    body = case.get("casebody", {})
    out = [f"# {case.get('name_abbreviation', 'Untitled')}", ""]
    out += [f"**Full caption:** {case.get('name', '—')}", ""]
    out += ["| | |", "|---|---|"]
    out.append(f"| Citations | {'; '.join(citations(case)) or '—'} |")
    out.append(f"| Court | {case.get('court', {}).get('name', '—')} |")
    out.append(f"| Decided | {case.get('decision_date', '—')} |")
    out.append(f"| Docket | {case.get('docket_number') or '—'} |")
    out.append(f"| Pages | {case.get('first_page')}–{case.get('last_page')} |")
    out.append(f"| Source | Caselaw Access Project (static.case.law), CAP id {case.get('id')} |")
    out.append("")

    if body.get("judges"):
        out += [f"**Judges:** {'; '.join(body['judges'])}", ""]
    if body.get("attorneys"):
        out += [f"**Counsel:** {' '.join(body['attorneys'])}", ""]

    # The head matter is the reporter's own front page — caption, counsel, and
    # syllabus. Quoted rather than reflowed, because it is not the court's text.
    for line in (body.get("head_matter") or "").strip().splitlines():
        if line.strip():
            out.append(f"> {line.strip()}")
    if body.get("head_matter"):
        out.append("")

    for opinion in body.get("opinions", []):
        label = (opinion.get("type") or "opinion").replace("-", " ").title()
        author = opinion.get("author")
        out += [f"## {label}" + (f" — {author}" if author else ""), ""]
        out += [opinion.get("text", "").strip(), ""]

    return "\n".join(out).rstrip() + "\n"


def main() -> None:
    for path in sorted(OPINIONS.glob("*.json")):
        case = json.loads(path.read_text())
        markdown = path.with_suffix(".md")
        markdown.write_text(render(case))
        words = sum(
            len(o.get("text", "").split()) for o in case.get("casebody", {}).get("opinions", [])
        )
        print(f"{markdown.name:34} {words:>7,} words  {case.get('name_abbreviation')}")


if __name__ == "__main__":
    main()
