import type { RouteId } from './routes'

export interface Scene {
  route: RouteId
  title: string
  note: string
  /** the standing "what this screen is built from" line — shown on every scene */
  basis: string
  /** optional focus hint consumed by the page (which map, which record) */
  focus?: string
}

/**
 * A curated four to five minute route, driven over a screen share.
 * Every scene must render inside 1280×720 with nothing to click and no page scroll.
 */
export const PRESENTER_SCENES: Scene[] = [
  {
    route: 'overview',
    title: 'The argument',
    note: 'A rule is not right or wrong. It is a position on a curve.',
    basis: 'The published role description, public regulatory and industry sources, and public company material. No firm’s internal rules, thresholds or systems appear anywhere in this.',
  },
  {
    route: 'layer',
    title: 'Where decisioning sits',
    note: 'Seven functions, each measured on something different.',
    basis: 'The responsibilities named in the published role description, and how those functions relate in a regulated firm generally.',
  },
  {
    route: 'lifecycle',
    title: 'The rule lifecycle',
    note: 'Authority, evidence and consequence sit in three different lanes.',
    basis: 'Public supervisory and industry sources on change control and model risk: the FCA Financial Crime Guide, EBA/GL/2019/04, SR 11-7 and the Wolfsberg Group’s 2024 monitoring statement.',
    focus: 'lifecycle',
  },
  {
    route: 'lifecycle',
    title: 'The two costs',
    note: 'Most moves trade detection against the customer. Three do not.',
    basis: 'The same public sources, plus the FCA’s FG24/6 on fraud controls and Consumer Duty, and the PSD2 transaction risk analysis exemption.',
    focus: 'costs',
  },
  {
    route: 'typologies',
    title: 'Every signal has an innocent twin',
    note: 'A signal without its false positive is pattern-matching, not judgement.',
    basis: 'Public typology sources including Visa’s enumeration and card-testing guidance, the FCA’s money-mules multi-firm review, FinCEN advisories and ACFE research. The false positives are reasoned from the shape of a spend-management product.',
  },
  {
    route: 'simulator',
    title: 'The trade-off, moved',
    note: 'There is no threshold that is simply right.',
    basis: 'A synthetic population generated in the browser from a fixed seed. Every figure here is illustrative and none of it describes any real portfolio.',
  },
  {
    route: 'change',
    title: 'What the process missed',
    note: 'The shadow run answered the wrong question.',
    basis: 'An illustrative change worked end to end on synthetic data, following the lifecycle above.',
  },
  {
    route: 'closing',
    title: 'What this leaves out',
    note: 'The gaps are the discipline, not the omission.',
    basis: 'Public material only. Where something is not public — the platform, the thresholds, the actual rule set — it is left out rather than guessed at.',
  },
]
