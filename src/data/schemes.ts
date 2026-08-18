/* The external ceilings a card programme operates under — and the distinction
   most people get wrong.

   Almost every published card-scheme monitoring programme is aimed at ACQUIRERS
   and their merchants. An issuer sits on the other side of the transaction, and
   the pressure it feels from the schemes runs in the opposite direction: the
   issuer-facing standards are largely about declining too much, not detecting
   too little. Quoting a merchant chargeback threshold at an issuer is the exact
   error a card-fraud interviewer notices.

   Everything here is from the schemes' own published rulebooks, checked August
   2026. Where a scheme declines to publish a number, that is recorded as
   unpublished rather than filled in from a vendor blog — and it is itself
   evidence for the argument that thresholds are portfolio-specific. */

export interface SchemeCeiling {
  name: string
  side: 'issuer' | 'acquirer / merchant'
  what: string
  number: string
  why: string
  source: string
}

export const SCHEME_NOTE =
  'A rule change spends four currencies: fraud loss, customer friction, analyst time, and the ' +
  'regulatory or scheme ceiling you are working under. The fourth is the one people skip, and it ' +
  'is the only one with an external referee. It is also the one most often quoted from the wrong ' +
  'side of the transaction.'

export const SCHEMES: SchemeCeiling[] = [
  {
    name: 'Authentication challenge ceiling',
    side: 'issuer',
    what: 'An issuer may not challenge more than a set share of authentication requests that arrive carrying an acquirer exemption or exclusion flag. Challenge more than that and the issuer is out of compliance — for being too cautious.',
    number: '5% of flagged requests',
    why: 'This is the clearest illustration that an issuer’s scheme pressure runs opposite to the fraud instinct. The scheme is not asking for more detection. It is capping how much friction may be imposed on transactions someone else has already assessed as low risk.',
    source: 'Mastercard Transaction Processing Rules, issuer standards (June 2026) — CONFIRMED',
  },
  {
    name: 'ATM approval-rate floor',
    side: 'issuer',
    what: 'A minimum approval rate on ATM transactions, with per-reason-code ceilings on declines, scoped on its face to credit card issuers.',
    number: '70% approval floor',
    why: 'Again a floor on approvals rather than a ceiling on fraud. A decline strategy that over-fires here is a compliance problem before it is a customer problem.',
    source: 'Mastercard Transaction Processing Rules (June 2026) — CONFIRMED',
  },
  {
    name: 'Fraud and Loss Database reporting',
    side: 'issuer',
    what: 'Confirmed fraud must be reported on or before the chargeback date. Reporting is a precondition of the issuer’s own recovery rights.',
    number: 'on or before the chargeback date',
    why: 'It makes the fraud label a scheme artefact with a deadline, not just an internal data point — and it is another reason label maturity is a governance question rather than an analytical inconvenience.',
    source: 'Mastercard scheme rules (2026) — CONFIRMED',
  },
  {
    name: 'PSD2 transaction risk analysis exemption',
    side: 'issuer',
    what: 'A payment service provider may skip strong customer authentication on low-risk remote transactions, but only while its own rolling 90-day fraud rate stays at or below a reference rate tied to the value band.',
    number: '0.13% up to €100 · 0.06% up to €250 · 0.01% up to €500',
    why: 'The single clearest example anywhere of fraud performance converting directly into permitted customer friction. Keep the fraud rate down and you are allowed to authenticate fewer people. It turns "reduce friction" into a regulated, measurable objective — and it lapses after two consecutive quarters above the rate.',
    source: 'Commission Delegated Regulation (EU) 2018/389, Arts. 18–20 and Annex — CONFIRMED',
  },
  {
    name: 'Excessive Chargeback and Excessive Fraud Merchant programmes',
    side: 'acquirer / merchant',
    what: 'Merchant-level monitoring inside the Acquirer Chargeback Monitoring Program, escalating through fees to a mandated action plan and a review of the acquirer.',
    number: 'thresholds not published',
    why: 'Included because it is the most frequently mis-cited ceiling in this space. It binds acquirers and their merchants, not issuers. And the numbers circulating for it are second-hand: the scheme defines the categories only by cross-reference to a manual it does not publish, so every figure in public circulation comes from acquirer documentation rather than the scheme. That absence is itself the point — even the scheme will not state a universal threshold.',
    source: 'Mastercard Security Rules and Procedures, Merchant Edition (August 2026), §8.3 — CONFIRMED, including the absence of published figures',
  },
  {
    name: 'Visa Acquirer Monitoring Program',
    side: 'acquirer / merchant',
    what: 'One ratio on card-not-present traffic: fraud reports plus non-fraud disputes over settled transactions.',
    number: '50 bps above standard · 70 bps excessive (acquirer); 150 bps excessive merchant since 1 April 2026',
    why: 'Shown for comparison only. It counts fraud and disputes together, so a first-party dispute problem and a third-party fraud problem land in the same number while implying completely different fixes. And it is a portfolio compliance ceiling, not a measure of whether any individual rule is well built.',
    source: 'Visa Acquirer Monitoring Program fact sheet, dated 15 May 2025 — CONFIRMED, source over a year old',
  },
]
