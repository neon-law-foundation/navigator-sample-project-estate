// Copyright (C) 2026 Neon Law Foundation.
// SPDX-License-Identifier: AGPL-3.0-only

import {
  Accordion,
  ActionList,
  Badge,
  BarChart,
  Callout,
  CaseHead,
  ClaimTable,
  FactCard,
  FactGrid,
  LegalDisclaimer,
  LinkTabs,
  Panel,
  Shell,
  Stack,
} from '@neon-law-source-code/navigator-ux'

import {
  BENEFICIARIES,
  CIRCUMSTANCES,
  INSTRUMENTS,
  MATTER,
  MATTER_FACTS,
  NEXT_STEPS,
  sharePercent,
} from './matter'
import { Markdown } from './markdown'
import { portalPath } from './mount'
import { opinionMarkdown } from './opinions'
import { AUTHORITIES, NEAREST_AUTHORITY, RESEARCH_FOLDER, RESEARCH_JURISDICTION } from './research'
import { Ready } from './ready'

/**
 * Which view is showing, read from the query string.
 *
 * `LinkTabs` navigates rather than swapping client state, so the open tab is in
 * the URL and survives a reload, a bookmark, and a link pasted to someone else.
 * Anything Navigator serves under this mount answers with the same document, so
 * `?tab=` costs nothing on the server and buys an address for every view.
 */
type Tab = 'matter' | 'research'

function currentTab(): Tab {
  if (typeof window === 'undefined') return 'matter'
  return new URLSearchParams(window.location.search).get('tab') === 'research'
    ? 'research'
    : 'matter'
}

/**
 * The portal, composed entirely from Navigator UX.
 *
 * Every surface here is a library component and every color it wears resolves
 * through a `--nav-*` token, so this file states what the matter says and never
 * how a matter looks. That is the same seam the local `Card` drew before, moved
 * out of the repository: restyling now happens in one dependency rather than in
 * however many class strings a page has accumulated.
 */
export function App() {
  const tab = currentTab()

  return (
    <Shell>
      <CaseHead
        kicker={<Ready />}
        title={MATTER.caption}
        docket={`${MATTER.practice} · ${MATTER.jurisdiction}`}
        summary="Your matter workspace — what the plan does, who takes what, and what we need from you next."
      />

      <LinkTabs
        aria-label="Portal sections"
        tabs={[
          { label: 'The matter', href: portalPath(), current: tab === 'matter' },
          { label: 'Research', href: portalPath('?tab=research'), current: tab === 'research' },
        ]}
      />

      {tab === 'research' ? <Research /> : <Matter />}
    </Shell>
  )
}

/** The plan itself: the facts, the shares, the instruments, and what is next. */
function Matter() {
  return (
    <Stack>
      <Panel
        title="Your matter"
        actions={<Badge tone="source">Fixture data</Badge>}
      >
        <FactGrid>
          {MATTER_FACTS.map((fact) => (
            <FactCard key={fact.label} title={fact.label}>
              {fact.value}
            </FactCard>
          ))}
        </FactGrid>
        {/* The premise of the plan, and the reason intestacy will not do.
            A callout rather than a paragraph because it is the one thing on
            this page a client should not be able to scroll past. */}
        <Callout tone="info">{CIRCUMSTANCES.note}</Callout>
      </Panel>

      <Panel
        title="How the residue is divided"
        note="Shares are held in basis points and add up to the whole."
        actions={<Badge tone="ready">{BENEFICIARIES.length} beneficiaries</Badge>}
      >
        {/* The same five shares, drawn as well as listed. The table is what a
            beneficiary reads to find their own line; the chart is what makes
            the plan's inequality legible at a glance, which is exactly the
            thing a column of percentages hides. Given names on the axis
            because the surnames repeat and the ticks do not have room. */}
        <BarChart
          label="Residuary share by beneficiary"
          data={BENEFICIARIES.map((person) => ({
            label: person.name.split(' ')[0] ?? person.name,
            value: person.shareBps / 100,
          }))}
          format={(value) => `${value}%`}
          height={200}
        />

        <ClaimTable
          caption={`Residuary shares under the ${MATTER.practice.toLowerCase()}`}
          columns={[
            { key: 'name', header: 'Beneficiary', cell: (person) => person.name },
            { key: 'relation', header: 'Relation', cell: (person) => person.relation },
            { key: 'share', header: 'Share', cell: (person) => sharePercent(person.shareBps) },
          ]}
          rows={[...BENEFICIARIES]}
          rowKey={(person) => person.id}
        />
      </Panel>

      <Panel title="The instruments">
        <FactGrid>
          {INSTRUMENTS.map((instrument) => (
            <FactCard key={instrument.id} title={instrument.title}>
              {instrument.detail}
            </FactCard>
          ))}
        </FactGrid>
      </Panel>

      <Panel title="Next steps">
        <ActionList items={NEXT_STEPS} />
      </Panel>

      <LegalDisclaimer title="Fixture data only">
      {MATTER.caption} is a simulated matter, and nobody named here is a real person.
      </LegalDisclaimer>
    </Stack>
  )
}

/**
 * The research tab: what the statute would do if there were no plan.
 *
 * The table is the index; `research/opinions/` in the repository holds the full
 * text of each opinion, so a reader who wants the language rather than the
 * summary has somewhere to go. Nothing here links out — an authenticated portal
 * that reaches an outside host is a third party watching a matter, and the CSP
 * would block it anyway.
 */
function Research() {
  return (
    <Stack>
      <Panel
        title={`${RESEARCH_JURISDICTION} intestacy authority`}
        note="Estates that passed by the descent statute because there was no will."
        actions={<Badge tone="source">{AUTHORITIES.length} cases</Badge>}
      >
        <Callout tone="info">
          Every case below is an estate that went the way this one would without a plan. Read
          together they are the argument for signing something: the statute divides, but it cannot
          divide unequally, cannot name who administers, and cannot hold a young beneficiary&rsquo;s
          share in trust.
        </Callout>

        {/* Every case carries its own opinion rather than a link to one. The
            disclosure is `<details>`, so in-page find reaches a collapsed
            opinion — a reader searching for a phrase gets the section opened
            for them instead of a table that swears the text is elsewhere. */}
        <Accordion
          exclusive
          items={AUTHORITIES.map((authority) => ({
            id: authority.id,
            trigger: (
              <span className="authority">
                <span className="authority__case">
                  {authority.caption}
                  {authority.id === NEAREST_AUTHORITY ? <Badge tone="next">Closest</Badge> : null}
                </span>
                <span className="authority__cite">
                  {authority.citation} · {authority.court}, {authority.year}
                </span>
                <span className="authority__holding">{authority.holding}</span>
              </span>
            ),
            children: <Opinion file={authority.file} caption={authority.caption} />,
          }))}
        />
      </Panel>

      <Panel title="Where the text lives">
        <FactGrid>
          <FactCard title="Full opinions">
            {RESEARCH_FOLDER} in this repository — one Markdown file per case, rendered from the
            Caselaw Access Project JSON beside it.
          </FactCard>
          <FactCard title="Regenerating">
            <code>python3 research/convert.py</code> rewrites every Markdown file from its JSON.
            Nothing in that folder is edited by hand.
          </FactCard>
          <FactCard title="Not a citator">
            No treatment has been verified. These are the texts, not an opinion on whether each is
            still good law.
          </FactCard>
          <FactCard title="Jurisdiction">
            Washington, per the client&rsquo;s residence. The matter record above still reads{' '}
            {MATTER.jurisdiction}, and the two should be reconciled before anything is drafted.
          </FactCard>
        </FactGrid>
      </Panel>

      <LegalDisclaimer title="Fixture data only">
        {MATTER.caption} is a simulated matter, and nobody named here is a real person. The cases
        are real published decisions; the client they are collected for is not.
      </LegalDisclaimer>
    </Stack>
  )
}

/** One opinion, rendered from the Markdown checked in beside this bundle. */
function Opinion({ file, caption }: { file: string; caption: string }) {
  const source = opinionMarkdown(file)

  if (!source) {
    return (
      <Callout tone="warning">
        The text of {caption} is indexed but not in this bundle — `{RESEARCH_FOLDER}
        {file}.md` is missing. Run <code>python3 research/convert.py</code> to regenerate it from
        the JSON.
      </Callout>
    )
  }

  return (
    <div className="opinion">
      <Markdown source={source} />
    </div>
  )
}
