// Copyright (C) 2026 Neon Law Foundation.
// SPDX-License-Identifier: AGPL-3.0-only

import { Card, Facts } from './Card'
import {
  BENEFICIARIES,
  CIRCUMSTANCES,
  INSTRUMENTS,
  MATTER,
  MATTER_FACTS,
  NEXT_STEPS,
  sharePercent,
} from './matter'
import { Ready } from './ready'

export function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-300 bg-white/60 px-6 py-8 dark:border-slate-700 dark:bg-slate-900/50">
        <Ready />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{MATTER.caption}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {MATTER.practice} — your matter workspace
        </p>
      </header>

      <main className="mx-auto grid max-w-3xl gap-4 px-6 py-8">
        <Card title="Your matter">
          <Facts facts={MATTER_FACTS} />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{CIRCUMSTANCES.note}</p>
        </Card>

        <Card title="How the residue is divided">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th scope="col" className="pb-2 font-medium">
                  Beneficiary
                </th>
                <th scope="col" className="pb-2 font-medium">
                  Relation
                </th>
                <th scope="col" className="pb-2 font-medium">
                  Share
                </th>
              </tr>
            </thead>
            <tbody>
              {BENEFICIARIES.map((person) => (
                <tr key={person.id} className="border-t border-slate-200 dark:border-slate-800">
                  <th scope="row" className="py-2 pr-3 font-medium">
                    {person.name}
                  </th>
                  <td className="py-2 pr-3">{person.relation}</td>
                  <td className="py-2">{sharePercent(person.shareBps)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="The instruments">
          <ul className="space-y-3 text-sm">
            {INSTRUMENTS.map((instrument) => (
              <li key={instrument.id}>
                <span className="font-medium">{instrument.title}</span>
                <p className="text-slate-600 dark:text-slate-400">{instrument.detail}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Next steps">
          <ul className="space-y-3 text-sm">
            {NEXT_STEPS.map((step) => (
              <li key={step.id}>
                <span className="font-medium">{step.title}</span>
                <p className="text-slate-600 dark:text-slate-400">{step.detail}</p>
              </li>
            ))}
          </ul>
        </Card>
      </main>

      <footer className="px-6 pb-10 text-xs text-slate-500 dark:text-slate-400">
        Fixture data only — {MATTER.caption} is a simulated matter, and nobody named here is a real
        person.
      </footer>
    </div>
  )
}
