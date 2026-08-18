import type { Source } from './types.ts'

export const SOURCE_NOTE =
  'Everything on this site is built from public material. Regulatory and industry claims are ' +
  'attributed below, and each is classed by how it was established: CONFIRMED means it was read ' +
  'in the primary document; RESEARCH means a reliable secondary source; INFERENCE means it is ' +
  'reasoning from a product shape rather than a fact about any firm. Where a scheme or regulator ' +
  'declines to publish a number, that is recorded as unpublished rather than filled with an estimate.'

export const SOURCES_CHECKED = 'Sources checked August 2026. Scheme programmes change annually — treat any figure older than a year as needing re-verification.'

export const SOURCES: Source[] = [
  {
    title: 'FCA Handbook — Financial Crime Guide (FCG)',
    url: 'https://www.handbook.fca.org.uk/handbook/FCG/',
    supports: 'The good and poor practice lists for automated monitoring: unclear rule rationales and poorly calibrated thresholds, firms not understanding what the system is detecting and why, off-the-shelf rules applied without tailoring, insufficient staff to scrutinise alerts, no regular review of rules and typologies, and failure to test before deployment. Also the expectation that senior management receive informative, objective MI.',
    cls: 'CONFIRMED',
  },
  {
    title: 'FCA FG24/6 — Payment firms and fraud (finalised guidance)',
    url: 'https://www.fca.org.uk/publications/finalised-guidance/fg24-6-payment-firms',
    supports: 'Fraud technology calibrated to detect and prevent fraud while minimising the impact on legitimate payments; the Consumer Duty requirement for appropriate friction rather than no friction; and the specified record for a delayed payment — grounds for suspicion, length of delay, whether it completed or was refused, value, and whether the payer showed characteristics of vulnerability.',
    cls: 'CONFIRMED',
  },
  {
    title: 'FCA multi-firm review — Proceeds of fraud: detecting and preventing money mules',
    url: 'https://www.fca.org.uk/publications/multi-firm-reviews/proceeds-fraud-detecting-preventing-money-mules',
    supports: 'The criticism of monitoring outbound flows only; the named red flags including high-value payments into a new or dormant account with similar amounts debiting shortly after, one device accessing multiple unrelated accounts, and virtual office addresses; and the expectation of device profiling, geolocation, behavioural biometrics and machine learning alongside tactical rules.',
    cls: 'CONFIRMED',
  },
  {
    title: 'Federal Reserve SR 11-7 — Guidance on Model Risk Management (2011)',
    url: 'https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm',
    supports: 'Effective challenge and its dependence on incentives, competence and influence; documentation sufficient for a party unfamiliar with the model; back-testing as outcomes analysis on a sample period not used in development; ongoing monitoring and benchmarking; periodic review at least annually; predetermined thresholds of acceptability; the model inventory including recently retired models; and the footnote that qualitative approaches outside the model definition should still be subject to a rigorous control process.',
    cls: 'CONFIRMED',
  },
  {
    title: 'EBA/GL/2019/04 — Guidelines on ICT and security risk management',
    url: 'https://www.eba.europa.eu/regulation-and-policy/internal-governance/guidelines-on-ict-and-security-risk-management',
    supports: 'Change management requiring changes to be recorded, tested, assessed, approved, implemented and verified in a controlled manner, with adequate safeguards for emergency changes (para 75); testing and approval prior to first use in environments that adequately reflect production (para 70); segregation of production from development and test (para 72); and documentation reducing unnecessary dependency on subject matter experts (para 73).',
    cls: 'CONFIRMED',
  },
  {
    title: 'Wolfsberg Group — Statement on Effective Monitoring for Suspicious Activity (2024)',
    url: 'https://db.wolfsberg-group.org/assets/54acbaad-5b02-4c2b-8c1e-e9d0a8c95edf/Wolfsberg%20Group%20Statement%20on%20Effective%20Monitoring%20for%20Suspicious%20Activity%202024.pdf',
    supports: 'Above-the-line and below-the-line testing and the criticism that firms typically only nudge thresholds around ten per cent; champion/challenger and parallel run; definitions of precision, recall and accuracy; the warning that aiming for total recall produces an ineffective system; and the criticism that alert and case volume metrics measure quantity rather than usefulness.',
    cls: 'CONFIRMED',
  },
  {
    title: 'Commission Delegated Regulation (EU) 2018/389 — RTS on strong customer authentication',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32018R0389',
    supports: 'The transaction risk analysis exemption and its reference fraud rates of 0.13%, 0.06% and 0.01% at the EUR 100, 250 and 500 bands for remote card payments; the rolling 90-day fraud rate definition; immediate reporting on breach and lapse after two consecutive quarters; and the annual independent audit of the methodology and reported rates.',
    cls: 'CONFIRMED',
  },
  {
    title: 'Dal Pozzolo, Boracchi, Caelen, Alippi & Bontempi — Credit Card Fraud Detection: A Realistic Modeling and a Novel Learning Strategy (IEEE TNNLS)',
    url: 'https://ieeexplore.ieee.org/document/8038008',
    supports: 'Verification latency and the delay between a decision and a confirmed label; the distinction between fast investigator feedback and slow delayed labels; alert-feedback bias, where the system only ever learns from what it already flagged; alert precision measured at investigator capacity; concept drift as customers change and fraudsters adapt; and the layered detection architecture.',
    cls: 'CONFIRMED',
  },
  {
    title: 'Saito & Rehmsmeier — The Precision-Recall Plot Is More Informative than the ROC Plot (PLOS ONE, 2015)',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0118432',
    supports: 'Why precision-recall curves are preferred to ROC on heavily imbalanced data: the PR baseline moves with the class distribution while ROC keeps a fixed baseline that hides accumulating false positives.',
    cls: 'CONFIRMED',
  },
  {
    title: 'Visa — Enumeration and card testing attack guidance (Article ID AI11312)',
    supports: 'The distinction between enumeration and card testing; the decline response codes that indicate an attack (14, 54, 55, 59, 82, N7 and their conversion to 05); enumeration through authentication at the Access Control Server; approved authorisations never submitted for clearing; merchant descriptors containing random characters; and the structural mitigations — CAPTCHA, session throttling, blocking unused ranges, and not issuing sequential PANs or batch expiry dates.',
    cls: 'CONFIRMED',
  },
  {
    title: 'Mastercard — Security Rules and Procedures, Merchant Edition (August 2026) and Transaction Processing Rules (June 2026)',
    url: 'https://www.mastercard.com/global/en/business/overview/rules.html',
    supports: 'That the Excessive Chargeback Programme, its ECM and HECM tiers, and the Excessive Fraud Merchant programme all sit inside the ACQUIRER Chargeback Monitoring Program and do not bind an issuer; that Mastercard no longer publishes the numeric ECM, HECM or EFM thresholds, defining them only by cross-reference to a manual that is not public; that the chargeback ratio uses the preceding month as its denominator; that the Global Merchant Audit Program is suspended; and that BRAM polices illegal and brand-damaging transactions rather than fraud rates.',
    cls: 'CONFIRMED',
  },
  {
    title: 'Visa Acquirer Monitoring Program (VAMP) fact sheet, dated 15 May 2025',
    supports: 'The VAMP ratio as fraud (TC40) plus non-fraud disputes (TC15) over settled card-not-present transactions; acquirer thresholds of 50 basis points Above Standard and 70 Excessive; and the merchant Excessive threshold moving from 220 to 150 basis points on 1 April 2026 in AP, Canada, EU and US, with CEMEA remaining at 220. Included here only as a comparison — it is an acquirer programme, and it is used on this site to illustrate the shape of an external ceiling rather than as a constraint on any issuer.',
    cls: 'CONFIRMED',
  },
  {
    title: 'Economic Crime and Corporate Transparency Act 2023, Part 5',
    url: 'https://www.legislation.gov.uk/ukpga/2023/56/part/5',
    supports: 'The failure-to-prevent-fraud offence: criminal liability for a large organisation where an associated person commits a listed fraud offence intending to benefit it, with a defence of reasonable prevention procedures, and the large-organisation test of meeting two of turnover over £36m, balance sheet over £18m, or more than 250 employees.',
    cls: 'CONFIRMED',
  },
  {
    title: 'Proceeds of Crime Act 2002 and the Money Laundering Regulations 2017',
    url: 'https://www.legislation.gov.uk/ukpga/2002/29/contents',
    supports: 'That fraud proceeds are criminal property and that the regulated sector carries a positive duty to report knowledge or suspicion — which is why a fraud alert can become an AML obligation, and why suppressing alerts can quietly suppress the input to one.',
    cls: 'CONFIRMED',
  },
  {
    title: 'ACFE — Report to the Nations (2024)',
    url: 'https://legacy.acfe.com/report-to-the-nations/2024/',
    supports: 'That expense reimbursement sits within the fraudulent-disbursements branch of asset misappropriation, which is the most common occupational fraud category by case count while typically carrying lower median losses than corruption or financial statement fraud.',
    cls: 'RESEARCH',
  },
  {
    title: 'FinCEN advisories on account takeover and email compromise fraud (FIN-2011-A016, FIN-2016-A003)',
    url: 'https://www.fincen.gov/resources/advisories',
    supports: 'The account-takeover hallmark of a contact-detail change that locks the victim out, and the business email compromise red flags developed with the FBI and US Secret Service — bank-detail redirection, urgency and confidentiality framing, and out-of-process approval.',
    cls: 'RESEARCH',
  },
  {
    title: 'Federal Reserve — Synthetic identity payments fraud white papers (2019–2020)',
    url: 'https://www.federalreserve.gov/publications/synthetic-identity-payments-fraud.htm',
    supports: 'Synthetic identities combining real and fabricated data elements, nurtured until they appear creditworthy and then run to full limit across every available line in a compressed window — the bust-out shape.',
    cls: 'RESEARCH',
  },
]
