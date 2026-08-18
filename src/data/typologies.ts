/* Generated from the content workflow, then reviewed and applied by hand.
   Do not regenerate without re-running scripts/verify.ts — the swimlane geometry
   is asserted there and a longer node label will silently clip. */

import type { Typology } from './types.ts'

export const TYPOLOGY_INTRO = "Fourteen typologies, each with the shape of rule that catches it and the legitimate behaviour that rule will also catch. The false-positive column is the reason this page exists. Anyone can list fraud signals. What separates someone who has run a rule estate is knowing which innocent customers each signal collects on the way through. On a spend-management product the innocent explanations are unusually strong, because the attack shape and the product's happy path are frequently the same shape: many new virtual cards fanning out to many new merchants, a burst of small unsettled authorisations, a new admin issuing cards from an unfamiliar device, a young company drawing its full limit the week after it raises. A rule tuned without that column does not reduce fraud. It reduces the product.\n\nOne note on sourcing. Where a decline or response code is named below it comes from Visa's published enumeration and card-testing guidance, because that is the bulletin that is public. The same attack shapes appear on every scheme; the code values do not. Anyone building this on a different network should take the mechanism from here and the codes from their own scheme's rulebook — quoting one scheme's response codes at an issuer on another is a small error that reads as a large one."

export const TYPOLOGIES: Typology[] = [
  {
    "id": "cnp-corporate-cards",
    "name": "Card-not-present fraud on issued corporate cards",
    "family": "card fraud",
    "oneLine": "Someone who is not your customer has the card number and spends it online before anyone notices.",
    "how": "A third party obtains the PAN, expiry and CVV2 from a breach, a phishing run, malware or a card shop, then spends at e-commerce merchants before the cardholder or the issuer reacts. On a corporate programme the credential is often a virtual card whose details sit in a vendor portal, a shared password manager or an employee's inbox, so the compromise usually happens inside the customer's environment rather than at the issuer. Visa records that successfully tested credentials are frequently sold on to be used in exactly this way (CONFIRMED, Visa AI11312). The issuer sees the spend. It never sees the theft.",
    "signals": [
      "Merchant, MCC or country never seen before for that card, that cardholder, or the customer's entire card programme",
      "Spend on a virtual card outside the merchant lock, amount cap or validity window it was issued with",
      "A card used only for recurring SaaS suddenly used for one-off retail or digital goods",
      "CVV2 absent, or a CVV2 or AVS mismatch, on a card that normally presents both cleanly",
      "Cards belonging to several unrelated customers hitting the same rare merchant inside a short window (common point of compromise)",
      "A small successful authorisation followed by a rapid sequence of rising-value authorisations on the same card",
      "Checkout device, IP or geolocation inconsistent with that employee's established pattern, where the merchant passes that data"
    ],
    "ruleShape": "Composite velocity plus novelty, scored per card and per cardholder, and baseline-relative rather than absolute. Count and value of authorisations in a rolling window are compared against that card's own trailing behaviour and against a peer cohort of similar cardholders, then uplifted when the merchant, MCC or country is new to the entity and when CVV2 or AVS results are weak. A separate cross-customer aggregation keys on merchant identifier and flags one merchant appearing across many unrelated cards. No fixed amount belongs in this rule; an absolute limit is a spend policy, not a fraud control. First trigger steps up, because novelty is this product's normal state and a decline here declines the customer's ordinary work.",
    "action": "step up",
    "falsePositive": "A finance lead onboarding five overseas SaaS vendors in one afternoon: five new merchants, five new MCCs, three new countries, one burst of authorisations, all on a card that had only ever paid the same three subscriptions.",
    "fpWhy": "That afternoon is what the customer bought the product for. Every novelty signal fires at once and none of them is wrong about the facts, only about the intent. Conference weeks, end-of-quarter procurement and a new employee's first trip all produce the same shape at scale, so a novelty-weighted decline rule does not merely annoy customers. It blocks the workflow the product is sold on.",
    "layer": "real-time step-up",
    "productHook": "INFERENCE about product shape, not a claim about any firm: virtual and vendor cards issued in-product, alongside a multi-currency account, mean the credential most likely to be compromised lives in a supplier portal the issuer cannot see, and cross-border SaaS spend is routine rather than exceptional. That combination weakens novelty as a signal and pushes weight onto the cross-customer merchant aggregation instead.",
    "metric": "Alert precision measured at actual review capacity (card precision CPk, Dal Pozzolo et al.), not precision in the abstract. Limitation: it is tied to the staffing constant, so it moves whenever headcount or shift patterns change, and it is blind to everything below the review cut-off. Quote it with recall and with the operating point, and never on a window where chargeback labels have not matured."
  },
  {
    "id": "bin-enumeration",
    "name": "Enumeration and BIN attack against the issued range",
    "family": "card fraud",
    "oneLine": "An attacker guesses card numbers against your BIN at machine speed and waits for one approval to tell them a card is real.",
    "how": "CONFIRMED (Visa AI11312): attackers submit high volumes of card-not-present authorisation attempts concentrated on one or a few BINs, iterating PAN, expiry, CVV2 and postal code until an approval confirms a working combination. The approval is the product. The spend comes later, or the credential is sold on. Visa also names enumeration through authentication, where the attacker drives 3-D Secure authentication attempts instead of authorisations, which keeps the volume out of the authorisation stream entirely. An issuer that only counts declines on its own BIN will see the first variant and miss the second completely.",
    "signals": [
      "CONFIRMED (Visa AI11312) — attempt spikes on one issuing BIN with sequential or near-sequential PANs, identical or similar amounts, and cross-border card-not-present traffic",
      "CONFIRMED (Visa AI11312, published for the Visa network; equivalent response codes differ by scheme) — clusters of fraud-indicative decline codes such as 14 invalid account number, 54 expired card, 59 suspected fraud, 82 negative CVV result and N7 CVV2 failure, some of which arrive converted to 05 Do Not Honor",
      "Approval rate on the BIN collapsing against its own norm while attempt volume climbs",
      "CONFIRMED (Visa AI11312) — attempts originating from new, inactive or dormant merchants, and descriptors containing random characters (key smashing)",
      "CONFIRMED (Visa AI11312) — spikes at the Access Control Server: many step-up or one-time-password requests in a short period that are never completed",
      "Attempts landing on unissued or dormant PANs inside the range, which no genuine process should ever touch",
      "Concentration in a handful of merchant category codes that were not previously active on the range"
    ],
    "ruleShape": "Two layers, both keyed on the attacker rather than on the customer. Layer one is an attempt-velocity monitor on BIN, PAN-sequence proximity, merchant identifier and source session or IP, compared against that key's own trailing baseline rather than a fixed count, so a deliberately slow attack is still visible. Layer two is a decline-composition rule on the ratio of fraud-indicative response codes to total attempts on the key, which catches an attacker who throttles below any count rule. This is the one typology in the set where a hard block is the proportionate first action, because the subject of the block is an attacking session, not a person trying to buy something.",
    "action": "decline",
    "falsePositive": "An account-updater run, or a mass retry of recurring subscription billing after a bulk card reissue: a burst of expired-card and invalid-account declines, on near-sequential PANs, on one BIN, at similar amounts, inside minutes.",
    "fpWhy": "It is indistinguishable from the attack in the authorisation stream, and on a product that issues virtual cards in bulk it happens routinely. A customer provisioning cards to a vendor list, or a reissue after a compromise, produces the same clustered, same-BIN, similar-amount shape. Blocking the key stops genuine revenue collection for real merchants and stops genuine card provisioning for the customer, and neither party is told why.",
    "layer": "real-time decline",
    "productHook": "INFERENCE about product shape, not a claim about any firm: a firm issuing directly under its own scheme licence owns the BIN range and therefore owns this detection outright, with no sponsor in between. Bulk virtual-card issuance is a documented feature, so near-sequential PANs and synchronised expiry batches are a normal by-product of the product, which is precisely the pattern schemes advise issuers not to create.",
    "metric": "Time to containment on an attacking key, from first attempt to block, read against the attempt volume absorbed before it. Limitation: it rewards speed and says nothing about correctness, so a fast block on an account-updater run scores perfectly and is a failure. Pair it with the count of blocked keys later confirmed as legitimate batch processes, or the metric drives exactly the wrong behaviour."
  },
  {
    "id": "card-testing",
    "name": "Card testing and credential validation",
    "family": "card fraud",
    "oneLine": "Someone who already has stolen card details makes a tiny charge purely to find out whether the card still works.",
    "how": "CONFIRMED (Visa AI11312): distinct from enumeration, because the attacker already holds the credentials. One or two low-value authorisations confirm the account is live before it is taken over or resold, typically across many accounts inside the same issuing BIN. Visa's stated most common access route is bots injecting card data into a legitimate merchant's checkout page where fraud controls are weak, and the published aliases include BIN testing, card stuffing and card tumbling. The test itself costs almost nothing. The loss arrives afterwards, on a card the issuer has already approved once.",
    "signals": [
      "Very low-value or zero-value authorisations on a card with no other recent activity, followed shortly by a materially larger authorisation",
      "Many distinct PANs inside one issuing BIN transacting at the same merchant or descriptor in a short window",
      "One device fingerprint, session or IP presenting many different PANs",
      "CONFIRMED (Visa AI11312) — approved authorisations whose sales drafts are never submitted for clearing and settlement, the approval itself being the object",
      "Charity, donation or digital-goods merchants appearing on a card with no plausible business reason",
      "A small charge on a dormant card immediately before a change to cardholder contact details"
    ],
    "ruleShape": "A fan-in rule at the merchant end and a sequence rule at the card end, both baseline-relative. At the merchant end, count distinct PANs per descriptor, session or device over a rolling window against that merchant's own trailing profile. At the card end, watch for a low-value authorisation followed by escalation, and monitor the authorise-without-clearing gap. The design choice that matters is what you optimise for. Do not try to block the test, which is cheap and already approved by the time you see it. Arm the card so its next material authorisation steps up. That turns a detection you were always going to be late for into a control that still works.",
    "action": "step up",
    "falsePositive": "Hotel, car-hire and fuel pre-authorisations, and payment-gateway verification messages fired when a company attaches a new virtual card to a subscription vendor. All are genuinely small, genuinely unsettled and genuinely never cleared.",
    "fpWhy": "The unsettled small authorisation is not an anomaly on this product. It is the onboarding handshake. A customer distributing virtual cards across a supplier list in one push produces exactly the shape the rule hunts for: dozens of distinct PANs generating tiny unsettled authorisations across many merchants in an hour. Declining the pound would be pointless anyway. Arming the wrong cards for step-up is what actually costs the customer.",
    "layer": "real-time step-up",
    "productHook": "INFERENCE about product shape, not a claim about any firm: vendor cards are documented as virtual cards created per supplier, so the gateway verification traffic that mimics card testing is generated by the product's own onboarding flow. Travel and fuel spend on physical cards adds a second, unrelated source of the same signal. Both argue for arming the card rather than blocking the test.",
    "metric": "Share of confirmed compromised cards where the follow-on material authorisation was prevented, not the share of test transactions blocked. Limitation: the denominator only contains cards you eventually learned were compromised, and those labels arrive weeks late through chargebacks and customer reports, so any recent window flatters the number. State the label maturity window before quoting it at all."
  },
  {
    "id": "account-takeover-admin",
    "name": "Account takeover of a customer admin or employee",
    "family": "account takeover",
    "oneLine": "An attacker gets inside the customer's own account and then uses the product exactly as it was designed to be used.",
    "how": "The attacker reaches the customer's tenancy through phishing, credential stuffing, a SIM swap, a stolen session token or a compromised corporate mailbox or SSO, then does nothing technically abnormal at all: issues virtual cards, lifts limits, adds a user, changes a supplier's bank details, exports employee data. RESEARCH (FinCEN account-takeover and email-compromise advisories): a hallmark is changing the registered email or phone so the victim is locked out and the firm cannot reach them. Because the platform is a spend rail, takeover converts into issued credentials and outbound payments within minutes, not days.",
    "signals": [
      "Login from a new device, IP or ASN followed within a short interval by a security-relevant change to email, phone, password or MFA; the sequence matters far more than either event alone",
      "MFA removed, downgraded to a weaker method, or re-enrolled on a new device",
      "A new admin or approver role granted, or an approval workflow weakened or bypassed",
      "Bulk virtual-card issuance, limit uplift or card unlock immediately following a credential change",
      "Notification suppression: alert emails redirected, a forwarding rule added, or notification settings switched off",
      "CONFIRMED (FCA multi-firm review, Proceeds of fraud) — one device accessing multiple otherwise-unrelated accounts",
      "Impossible travel, or behavioural drift inside the session that does not match the enrolled user"
    ],
    "ruleShape": "Score the chain, not the event. A sequence rule over the identity event stream: novel authentication context, then a credential or contact change, then a privilege or money-movement action, all inside a rolling window, with the score weighted by how much damage the final action can do. Enforcement is a cooling-off period on card issuance and money movement after any contact or MFA change, with out-of-band re-verification on the previously registered channel and never on the newly changed one. Single-event rules are useless here, because every individual event in that chain is something a real administrator does on a normal Tuesday.",
    "action": "step up",
    "falsePositive": "A newly hired fractional CFO logging in for the first time on an unrecognised device, being granted admin, replacing the outgoing finance lead's contact details, and immediately issuing cards to the team. The takeover chain, executed by the right person.",
    "fpWhy": "Finance staff turn over constantly and the handover always looks like this. A founder who lost a phone abroad produces a new device, an MFA re-enrolment and a number change in one sitting. A company migrating identity provider does it for everyone at once. Over-tight sequence rules lock a finance team out of their own spend controls at month-end, which is the moment they least tolerate it.",
    "layer": "real-time step-up",
    "productHook": "INFERENCE about product shape, not a claim about any firm: multi-entity accounts with a multi-entity admin concentrate authority in a single credential reaching across several legal entities, and card issuance and limit changes are self-service by design. That raises the value of one compromised admin session and shortens the distance from login to issued credential to almost nothing.",
    "metric": "Chain-completion rate: the share of confirmed takeovers where the control fired before the first card issuance or money movement, not merely at some point during the incident. Limitation: the denominator only holds takeovers that were discovered, and discovery usually happens because the real user was locked out. A quiet takeover that never locked anyone out is absent from numerator and denominator alike."
  },
  {
    "id": "application-bust-out",
    "name": "Application fraud and bust-out on a corporate credit line",
    "family": "first-party",
    "oneLine": "A business identity is manufactured or hijacked to obtain cards and credit, behaves impeccably until the limit is high, then draws everything and disappears.",
    "how": "RESEARCH (Federal Reserve synthetic identity payments fraud papers, 2019 to 2020): fabricated identities combine real and fictitious data elements, are nurtured until they look creditworthy, then bust out, with every available line drawn to its limit inside a compressed window and abandoned. The business-entity version uses a shell or hijacked company with real registry filings, a virtual office and a thin trading history. RESEARCH (lender and vendor sources): rings run many identities in parallel across institutions and synchronise the timing. On a prefunded balance there is little to steal. Wherever a credit line exists, there is.",
    "signals": [
      "Directors, beneficial owners, phone, device or address shared across several unrelated applicant entities",
      "Incorporation very recent relative to the credit sought, or a long-dormant company suddenly reactivated with new officers",
      "CONFIRMED as an FCA-flagged onboarding red flag — a virtual office or mail-forwarding address, and one device used to open more than one account",
      "Repayment behaviour that is unusually clean and exactly to limit, then a step change to full utilisation across every line at once",
      "A limit-increase request followed closely by full drawdown",
      "Spend concentrated in liquid, easily resold categories, gift cards, or one unfamiliar merchant",
      "Application data that verifies element by element but does not cohere: claimed turnover inconsistent with filed accounts, sector inconsistent with the observed MCC mix"
    ],
    "ruleShape": "Two rules on two different clocks. At onboarding, an entity-resolution rule scores how many high-risk attributes an application shares with other applicants and with known-fraud records, across device, address, phone, beneficial owner and bank account, feeding a review queue rather than an automatic decline, because every one of those attributes is also shared by legitimate early-stage companies. Post-onboarding, a utilisation-trajectory rule watches for a sharp, sustained break from the account's own established repayment and utilisation pattern. The shape is the signal, not any percentage. Contribute to and consult shared fraud data; in the UK the FCA has reviewed firms on National Fraud Database participation.",
    "action": "investigate",
    "falsePositive": "A seed-stage startup that closes a funding round on Monday and ramps to full limit across every card by Friday. Recently incorporated, no credit file, registered at the accountant's address, two founders sharing one laptop.",
    "fpWhy": "That is not an edge case for a spend-management product, it is the core customer. A bust-out rule carrying consumer-credit intuitions fires hardest on the best accounts in the book, at the exact moment they are ready to grow, through a control the customer never sees. Declining or freezing here loses the customer permanently and teaches the rule nothing, because you never observe how they would have performed.",
    "layer": "onboarding",
    "productHook": "INFERENCE about product shape, not a claim about any firm: a prefunded e-money product caps exposure at the loaded balance, so classic bust-out has little to take. Two documented features change that. An authorised negative balance may be permitted while an auto top-up direct debit settles, and a UK overdraft effective 13 March 2026 names the UK entity as lender. Credit exposure is where this typology becomes real, and it is recent.",
    "metric": "Forward loss on an approval cohort tracked to a fixed maturity, not a hit rate at decision time. Limitation: it takes months to observe, so it cannot steer this quarter's tuning, and it is one-sided, because you never see how the applications you declined would have performed. Without a deliberate approve-through holdout there is no way to price the cost of tightening, only the benefit."
  },
  {
    "id": "friendly-fraud-chargeback",
    "name": "First-party fraud and chargeback abuse",
    "family": "first-party",
    "oneLine": "The person disputing the transaction is the person who made it.",
    "how": "RESEARCH (Mastercard material on first-party misuse and its First-Party Trust programme, US launch late 2024 with wider rollout during 2025; verify current scope against the scheme's own rules): the legitimate cardholder disputes a transaction they authorised. It runs from honest error, an unrecognised billing descriptor or a forgotten subscription, through to organised repeat disputing. The corporate form is distinctive. The customer disputes their own employee's authorised spend, or an employee raises a dispute to remove a purchase they would rather not see on the month-end reconciliation. The authentication evidence is usually perfect, because nothing was ever compromised.",
    "signals": [
      "Dispute rate for a customer or cardholder far above both its own history and its peer cohort",
      "Disputes filed against transactions with strong evidence: 3DS-authenticated, AVS and CVV2 matched, goods delivered, or a digital service with usage logs",
      "Repeat disputes naming the same merchant or the same reason code",
      "A dispute raised after the service was fully consumed, or after the return window closed",
      "Dispute followed by re-purchase at the same merchant",
      "Disputes clustering on one cardholder across many unrelated merchants"
    ],
    "ruleShape": "A dispute-propensity score at cardholder and customer level, built from the dispute-to-transaction ratio against that entity's own baseline and its peer cohort, weighted by the strength of authentication and delivery evidence on the disputed items. It has no business in the authorisation path, because the transaction it would decline was legitimate when it happened. Use it at dispute intake instead: surface the evidence and the underlying purchase detail to the customer's own admin before a chargeback is raised, and enrich descriptors at the point of purchase so honest non-recognition never becomes a dispute. The constraint is two-sided. Suppressing genuine disputes is a conduct problem; letting abuse run is a scheme-programme problem.",
    "action": "report to customer",
    "falsePositive": "An admin disputing a charge from a SaaS company billing under an unfamiliar parent legal name, on a shared virtual card, made by a colleague who has since left. Genuine non-recognition is the largest bucket of disputes by a wide margin.",
    "fpWhy": "Non-recognition is a reconciliation problem the product exists to solve, so a high dispute rate frequently means the customer's internal visibility is poor rather than that anyone is abusing anything. Scoring them as an abuser gets the diagnosis backwards, damages the commercial relationship, and quietly moves a conduct risk into a system built only to measure loss.",
    "layer": "near-real-time alert",
    "productHook": "INFERENCE about product shape, not a claim about any firm: shared virtual cards, vendor cards and multi-entity accounts mean the person reviewing a statement is very often not the person who made the purchase. That structurally raises non-recognition, the dominant benign cause of disputes, and makes descriptor quality and receipt matching a fraud control in their own right.",
    "metric": "Pre-dispute deflection rate: the share of intended disputes resolved with evidence before a chargeback is raised. Limitation: it is trivially gameable by making the dispute journey harder, which is a Consumer Duty problem rather than an improvement. It is only meaningful read alongside complaint volume and the eventual chargeback win rate."
  },
  {
    "id": "funding-rail-abuse",
    "name": "Third-party loading and the authorised negative balance",
    "family": "AML-adjacent",
    "oneLine": "Value enters the account from somewhere it contractually should not, or leaves against a balance that has not settled yet.",
    "how": "A prefunded e-money account is a poor target for classic credit fraud — there is nothing to draw down beyond what has been loaded. The exposure moves to the funding rail itself. Two shapes matter. First, an inbound load from a party who is not the customer: on many spend products this is contractually prohibited, so it is not merely unusual, it is a breach of the agreement and a placement route in one. Second, the settlement gap: where an automatic top-up pulls by direct debit when the balance falls below a set point, spending may be permitted against an authorised negative balance until the debit clears. That window is real, uncollateralised exposure on a product most people describe as prefunded.",
    "signals": [
      "A load arriving from a name, account or institution that does not match the customer's registered funding source",
      "Load volume that outruns the customer's filed turnover, headcount or observed operating pattern",
      "Spend clustering inside the settlement window and falling away once the debit clears — the pattern repeating, cycle after cycle",
      "A direct debit that fails or is recalled after the spend against it has already cleared",
      "A funding source that changes shortly before a step-change in spend",
      "Load, spend to cash-equivalent value, and repeat, with negligible balance retained between cycles",
      "Rapid load-and-withdraw across ATM or near-cash merchant categories"
    ],
    "ruleShape": "Two rules with different clocks and different owners. On the way in, a funding-source reconciliation rule: every load matched against the registered funding instrument for that customer, with any mismatch routed to investigation rather than declined outright, because a legitimate rebanking looks identical on the first event. On the way out, an exposure rule watching spend inside the unsettled window against that customer's own trailing pattern, escalating where the ratio of unsettled spend to settled funding breaks from its baseline, and where a prior debit has failed. The important design point is that the first rule is a contractual control, not a risk score — the agreement already says what is permitted, so the rule is enforcing a term rather than estimating a probability, and it can be stated in a specification without a threshold at all.",
    "action": "investigate",
    "falsePositive": "A group treasury function funding a subsidiary's account, or an investor paying a first round directly into the operating account rather than routing it through the parent. The name on the inbound payment is genuinely not the account holder, the amount is genuinely out of proportion to filed turnover, and everything about it is legitimate and, for an early-stage company, completely ordinary.",
    "fpWhy": "Multi-entity structures are a documented feature of these products, which means intra-group funding is a supported use case rather than an edge case. A rule that treats every third-party inbound as a breach will fire hardest on exactly the customers a spend platform most wants: funded startups and groups with a central treasury. The control has to distinguish a related party from an unrelated one, and that is an entity-resolution problem rather than a threshold problem.",
    "layer": "batch / periodic review",
    "productHook": "INFERENCE about product shape, not a claim about any firm. Reasoned from documented features of spend-management products generally: prefunded e-money accounts, a prohibition on loading by anyone other than the customer, automatic top-up by direct debit with an authorised negative balance permitted until it settles, and multi-entity accounts.",
    "metric": "Value of unsettled exposure at peak, alongside the count of funding-source mismatches resolved as legitimate. The limitation is that the first is only measurable after the fact and the second is dominated by benign cases — so neither works as a real-time trigger, and reading either as a fraud rate would be wrong."
  },
  {
    "id": "employee-card-misuse",
    "name": "Employee card misuse",
    "family": "internal misuse",
    "oneLine": "A real employee uses a real company card for something the company did not agree to buy.",
    "how": "Personal purchases mixed into business spend, gift cards and vouchers bought as cash equivalents, a purchase split across consecutive authorisations to stay under an approval level, or continued use of a card after leaving. RESEARCH (ACFE Report to the Nations): expense reimbursement sits inside the fraudulent-disbursements branch of asset misappropriation, the most common occupational fraud category by case count and typically lower in median loss than corruption or financial-statement fraud. The structural point matters more than the mechanics. The victim is the customer, not the issuer, which changes who decides, who is told, and what the platform is for here.",
    "signals": [
      "MCC inconsistent with the cardholder's role or the customer's stated policy: gambling, personal retail, gift cards, cash equivalents",
      "Repeated amounts sitting just under an approval or receipt-required level, or one purchase split across consecutive authorisations at the same merchant",
      "Spend outside working patterns, or in a location inconsistent with the employee's recorded travel",
      "Persistently missing receipts, or a chronically unreconciled card relative to peers in the same cost centre",
      "Activity on a card after the cardholder's offboarding date in the customer's HR feed",
      "A cardholder whose merchant mix diverges sharply from same-role, same-seniority peers"
    ],
    "ruleShape": "Peer-cohort outlier detection, not absolute limits. Score each cardholder against same-role, same-cost-centre, same-seniority peers on merchant mix, receipt-compliance rate and the distribution of transaction values near approval boundaries. Add one deterministic structuring rule for amounts bunching immediately below a policy level, and a joiner-mover-leaver reconciliation against the customer's HR feed. This belongs nowhere near the authorisation path. The platform cannot know the customer's own policy exceptions, so a real-time decline substitutes the issuer's judgement for the customer's on spend the customer authorised. The output is a report to the finance owner, who has both the context and the standing to act on it.",
    "action": "report to customer",
    "falsePositive": "An on-call engineer buying food at three in the morning, a manager buying vouchers as a genuine team reward, and client entertainment landing on consumer-looking merchant categories. All three are approved spend that looks exactly like misuse.",
    "fpWhy": "The product's value is that employees can spend without asking first, so out-of-pattern spend is the feature rather than the exception. Amounts sitting just under the receipt threshold are also what a well-briefed employee does when told to keep claims below the level requiring one. Surfacing these as suspected misuse damages the customer's trust in their own staff, which is a worse outcome than the leakage.",
    "layer": "batch / periodic review",
    "productHook": "INFERENCE about product shape, not a claim about any firm: physical and virtual cards issued to individual employees, in-app receipt capture, ATM withdrawals, mileage and per diem all create spend that the customer, not the issuer, must police. Per diem and mileage in particular are policy constructs, so what counts as misuse is defined by the customer's own rules and cannot be read off the transaction.",
    "metric": "The share of reported cases the customer's own finance owner confirms as out of policy. Limitation: it measures the customer's appetite to confront the individual, not whether the rule was right. A customer unwilling to challenge a senior employee marks the case as fine, and the rule then looks over-sensitive in precisely the situations where it was accurate."
  },
  {
    "id": "expense-claim-abuse",
    "name": "Expense-claim abuse and fabricated receipts",
    "family": "first-party",
    "oneLine": "The fraudulent object is the claim, not the card transaction, and increasingly the receipt was never a real document at all.",
    "how": "Inflated amounts, personal spend recoded as business, one receipt submitted twice (once against the card feed and once as a manual claim), two colleagues each claiming one split bill, or a wholly fabricated receipt. RESEARCH (vendor and trade-press reporting during 2026: AppZen detection data via PYMNTS and Accounting Today, an Emburse survey): generative-AI receipt images grew quickly as a share of detected fakes, are typically low in value, and appear aimed at auto-approval bands. Treat those figures as vendor research. The structural point is solid. Image forensics look for evidence of editing, and a generated receipt was never edited.",
    "signals": [
      "A claimed receipt with no matching card authorisation on merchant, amount, timestamp or MCC",
      "Merchant, amount and date matching an existing claim or an existing card transaction (duplicate)",
      "Receipt metadata inconsistencies: no camera provenance, uniform rendering, implausible tax arithmetic, a VAT number that does not resolve, an address that does not exist",
      "Claims clustering immediately below the value at which human review or receipt scrutiny is triggered",
      "The same merchant or receipt template appearing across unrelated employees, or across unrelated customers",
      "Round-number amounts bunching in cash-claim categories",
      "A long lag between claimed transaction date and submission, or many old claims submitted in one batch"
    ],
    "ruleShape": "Make transaction matching the primary control and image analysis the secondary one, because a match to a real authorisation is evidence while an image forensic is an inference. Require each reimbursable claim to bind to a real authorisation on merchant, amount, timestamp and MCC, and route unmatched claims to review. Layer fuzzy duplicate detection on merchant plus amount plus date window, across the claimant, their team and the whole customer. Add a distribution rule watching for value bunching beneath review bands, and sample-review a random slice below the auto-approval level so the band cannot be learned and farmed. The hold sits in the reimbursement workflow, where delay costs days rather than a declined card at a till.",
    "action": "hold",
    "falsePositive": "A duplicate the product itself created: an employee photographs a receipt and submits it manually while the same purchase also lands on the card feed. Two records, one purchase, and the rule sees a claim matching an existing transaction.",
    "fpWhy": "Receipt capture and the card feed are both core features, so the product manufactures its own duplicates at volume. Cash-heavy round-number claims, taxis, tips and cash per diems, look fabricated and usually are not. An employee who genuinely lost a receipt and reconstructed the amount honestly is indistinguishable from one who invented it, which is why the first action must be to ask rather than to accuse.",
    "layer": "near-real-time alert",
    "productHook": "INFERENCE about product shape, not a claim about any firm: reimbursements, reimbursement-only users, mileage and per diem are all documented, and every one of them produces a claim with no card authorisation to match against. The primary control is structurally unavailable on exactly the population that needs it most, which is why a reimbursement-only user requires a different rule set from a cardholder.",
    "metric": "Value of claims rejected after review as a share of value routed to review. Limitation: it improves whenever you route less, so it is meaningless without total value routed beside it. It also counts honest reconstruction errors as recoveries, and it is blind to fabricated claims that happen to match a genuine authorisation, which is the case that matters most."
  },
  {
    "id": "trial-promotion-abuse",
    "name": "Subscription, free trial and promotion abuse",
    "family": "first-party",
    "oneLine": "Disposable card numbers are used to farm free trials, sign-up credits and referral bonuses at scale.",
    "how": "Programmatically generated or disposable payment credentials harvest trials, introductory pricing, sign-up credits and referral bonuses, either by an external actor abusing the card product or by users abusing merchants with cards the product issued. Virtual-card issuance is the enabling capability, so this is a typology the product's own core feature creates rather than one imposed from outside. The commercial exposure is second-order and worse than the direct loss. A merchant that suffers it may block the whole BIN range, degrading checkout for every legitimate customer at once, including customers who never touched a trial.",
    "signals": [
      "Many freshly created virtual cards from one account converging on the same merchant's trial or sign-up endpoint in a short window",
      "Each card used exactly once, for a trial or a zero-value authorisation, then never again",
      "Sign-ups sharing device fingerprint, IP subnet or email pattern (plus-addressing, disposable domains) while presenting different cards",
      "Cards cancelled or left to expire immediately after a trial converts to paid",
      "Merchant-side declines or blocks concentrating on one BIN range",
      "Card-creation rate on an account far above its own baseline with no matching growth in headcount or vendor count"
    ],
    "ruleShape": "Shape the issuance, not the spend. Monitor card-creation velocity per account against that account's own baseline and against its user and vendor counts, then detect fan-out where many freshly created cards converge on one merchant. Correlate on account and device, because the entire mechanism is that the cards differ while the actor does not. Keep it out of the authorisation path: declining the trial charge does not stop the abuse and does stop the legitimate trial. The proportionate first move is an alert and a conversation with the customer about what they are doing, because the same pattern is a paying customer using the headline feature correctly.",
    "action": "alert only",
    "falsePositive": "A procurement team running a genuine vendor bake-off: six competing tools trialled in a week on six brand-new virtual cards, each used once, at six merchants nobody at that company has ever paid before.",
    "fpWhy": "That is the product demo. One locked virtual card per vendor, per team or per campaign is the reason customers buy virtual cards, and a company onboarding a hundred staff spikes card creation with no fraudulent intent whatsoever. Any control that suppresses issuance removes the feature the customer is paying for, so the proportionate response is merchant-level or velocity-level friction plus a human conversation.",
    "layer": "near-real-time alert",
    "productHook": "INFERENCE about product shape, not a claim about any firm: vendor cards are documented as virtual cards created per supplier, which makes high card-creation velocity and one-card-per-merchant fan-out the intended usage pattern. There is no version of this rule that separates abuse from the happy path on card behaviour alone. It has to key on the actor.",
    "metric": "Merchant-side block rate on the BIN range, the external signal that the abuse has become a commercial problem. Limitation: it lags badly. By the time a merchant blocks the range, every legitimate customer is already affected, and the block cannot be attributed to the specific accounts that caused it, so it tells you there is a problem without telling you where it is."
  },
  {
    "id": "rewards-round-tripping",
    "name": "Cashback, rebate and rewards abuse",
    "family": "first-party",
    "oneLine": "Where spending earns a reward, spend can be manufactured and cycled back so the reward is earned on money that never really left.",
    "how": "Where a spend-linked reward exists, whether cashback, rebate, tiered pricing or referral credit, the incentive itself becomes the target. Spend is routed through a controlled or colluding merchant, or cycled through a channel that returns the funds, so the reward accrues on volume that cost the earner nothing. The same mechanic, money out and money back with a fee earned in between, is a textbook layering pattern, which is why this typology sits on the fraud and AML boundary rather than neatly inside either. INFERENCE: it applies to any spend product operating such a scheme and asserts nothing about any particular firm.",
    "signals": [
      "Spend at a merchant related to the cardholder or the customer by shared bank account, address, directorship or device",
      "High gross spend paired with offsetting refunds, credits or inbound transfers of similar aggregate value",
      "Reward earned wildly out of proportion to the customer's headcount, sector or filed turnover",
      "Repeating cycles of similar amounts at short, regular intervals",
      "Spend concentrated in cash-equivalent or easily reversible categories",
      "Reward-to-net-economic-activity ratio far outside the peer cohort"
    ],
    "ruleShape": "Fix the accrual basis before writing any rule at all. Compute eligibility on net, settled, non-reversed spend and re-assess after a claw-back window, so the obvious version of the abuse becomes uneconomic by construction rather than by detection. Then add a round-tripping detector that nets debits against subsequent credits and inbound funding at counterparty level over a rolling period, and a relationship-graph check between the earning entity and its largest merchants. Exclude related-party spend from accrual by contract, so the control is enforceable and not merely analytical. This is inherently periodic: the pattern exists only across a cycle and is invisible in any single transaction.",
    "action": "investigate",
    "falsePositive": "A media-buying agency, travel management company or reseller putting enormous genuine pass-through client spend on cards precisely because the cashback is the point: huge gross spend, large offsetting client receipts, reward absurd relative to headcount.",
    "fpWhy": "That customer is optimising the incentive exactly as designed, and pass-through businesses are a large and deliberately courted segment for a spend product. Every quantitative signal, reward per employee, gross-to-net ratio, offsetting inbound value, is extreme and entirely legitimate. Only the relationship between the earner and the merchant separates the two cases, which is why the graph check carries the whole rule.",
    "layer": "batch / periodic review",
    "productHook": "INFERENCE about product shape, not a claim about any firm: this attaches to any spend-linked reward or rebate scheme, and the round-trip rail is usually the documented accounts-payable, invoice or multi-currency surface rather than the card itself. Where no reward scheme exists the typology simply does not apply, which is worth stating rather than assuming either way.",
    "metric": "Reward paid on spend later reversed or refunded, as a share of total reward paid. Limitation: it only catches money that came back through the same rail. Funds returned by bank transfer from a related merchant never appear in it, so the metric understates by construction and cannot on its own support a conclusion that the scheme is clean."
  },
  {
    "id": "refund-credit-abuse",
    "name": "Refund and credit abuse",
    "family": "merchant",
    "oneLine": "Value leaves through the refund rail instead of the purchase rail, sometimes with no purchase behind it at all.",
    "how": "An employee returns goods and takes the refund to a personal instrument or store credit while the company card bore the charge. A refund is pushed to a card other than the one originally charged. A colluding merchant issues credits with no matching sale. The last one matters most to an issuer, because an unmatched credit is a cash-out and a laundering vector rather than mere leakage: value appears on the card with no underlying commerce. A refund also cannot be declined at authorisation, which removes the fastest control in the stack from the table entirely.",
    "signals": [
      "A credit with no matching prior authorisation on that card, that merchant and a plausible amount",
      "Refund amount materially different from the original sale, or aggregate refunds at a merchant exceeding aggregate sales over a period",
      "Refund directed to a different card or instrument than the one charged",
      "Refund-to-purchase ratio for a cardholder or a merchant well outside its own baseline and its cohort",
      "Bursts of refunds in a short window, or at a merchant onboarded very recently",
      "Credits landing on cards that are dormant or about to be closed"
    ],
    "ruleShape": "The unmatched-credit rule is the core control: reconcile every credit to a prior debit on the same card and merchant inside a plausible window, and route unmatched or over-value credits to investigation, with funding holds considered at the merchant end. Add a ratio-drift rule on refund value against sales value per merchant and per cardholder, measured against that entity's own trailing baseline rather than a fixed ceiling. Note what the layer decision is not: an issuer cannot decline an inbound credit, so real-time decline is not on the menu here. Escalation should include the AML route as well as the loss-recovery route, because unmatched credits shade directly into layering.",
    "action": "investigate",
    "falsePositive": "A cancelled company offsite generating a wave of travel refunds on one day, and IT procurement that legitimately orders, evaluates and returns hardware, so refunds exceed sales at that supplier for the month.",
    "fpWhy": "Refunds landing on a different card are routine here too, because a card reissued after compromise or an employee change means the original PAN no longer exists. The mismatch is the product working correctly. Corporate buying is lumpy by nature, so ratio drift at a single supplier over a single month carries almost no information without the customer's own procurement context beside it.",
    "layer": "near-real-time alert",
    "productHook": "INFERENCE about product shape, not a claim about any firm: virtual card lifecycles are short by design and cards are reissued freely, so refund-to-original-PAN matching fails often for entirely benign reasons. Invoices, accounts payable and a multi-currency account add further routes by which a credit arrives detached from the debit that should explain it.",
    "metric": "Unmatched-credit value as a share of total credit value, cut by merchant and by card. Limitation: the matching window creates the number. Widen the window and unmatched credits disappear with no change in anyone's behaviour, so the figure means nothing unless the window is stated alongside it and held constant across comparisons."
  },
  {
    "id": "merchant-collusion-laundering",
    "name": "Merchant collusion, MCC miscoding and transaction laundering",
    "family": "merchant",
    "oneLine": "The merchant is in on it: invoicing for nothing, hiding what it really sells, or processing someone else's payments through its own account.",
    "how": "Three overlapping forms. An employee and a supplier agree to invoice for goods never supplied, or inflate an invoice and rebate the difference. A merchant is coded into a category that attracts less scrutiny than its real business. Or, RESEARCH (widely documented across acquiring sources, also called undisclosed aggregation or factoring), a merchant processes another un-underwritten party's payments through its own approved account, so prohibited or higher-risk commerce enters the system disguised as ordinary card revenue. CONFIRMED (Visa AI11312) that weak merchant underwriting is treated as an attack vector. Every individual transaction looks completely ordinary, which is the whole problem.",
    "signals": [
      "An unusually large share of one customer's or one approver's spend at a single small or recently onboarded supplier",
      "Invoice values that are round, sequential, or repeat exactly month to month with no volume rationale",
      "Merchant descriptor, website content or delivered goods inconsistent with the assigned MCC",
      "A supplier sharing a director, bank account, address, phone or device with the employee who approves the spend",
      "A merchant with no discernible online presence, or a storefront whose checkout differs from the site's stated business",
      "CONFIRMED (Visa AI11312) — descriptors containing random characters (key smashing), and activity from new, inactive or dormant merchants",
      "Payment flows disproportionate to the merchant's stated size or sector"
    ],
    "ruleShape": "Relationship graphs and concentration analytics, not transaction rules. Score each supplier on share of spend for a given approver, on shared identifying attributes with employees resolved across bank account, address, phone and directorship, and on consistency between the assigned MCC and observed transaction characteristics. Content-check merchant websites on high-scoring cases. This must never sit in the authorisation path: the transactions are individually unremarkable, the evidence is relational and slow to assemble, and a real-time decline would cut off a supplier the customer depends on before anyone has looked at anything. It is an investigation with an analytical trigger, and the honest output is a case file rather than a decision.",
    "action": "investigate",
    "falsePositive": "A company that uses one agency, one contract manufacturer or one recruitment firm. Extreme spend concentration, repeating round invoice values month after month, a one-person consultancy with almost no web presence. Entirely normal and entirely rational.",
    "fpWhy": "Small customers concentrate spend because they are small, and the product actively encourages one vendor card per supplier, which makes concentration a designed outcome rather than an anomaly. MCC mismatches are also very often the acquirer's coding error rather than the merchant's deception. Acting on concentration alone investigates the customer's most important commercial relationship on the strength of the customer being small.",
    "layer": "batch / periodic review",
    "productHook": "INFERENCE about product shape, not a claim about any firm: vendor cards locked to a single supplier and an invoice or accounts-payable surface both make one-supplier concentration a designed outcome. That drains most of the signal out of concentration on its own and forces the weight onto entity resolution between the supplier and the person approving the spend.",
    "metric": "Conversion from investigated supplier relationship to a confirmed finding. Limitation: the base rate is very low, and confirmation depends on the customer being willing to investigate its own staff. Poor conversion may mean the rule is weak, or it may mean nobody wanted to look, and the metric cannot distinguish the two, so it must never be used alone to retire the control."
  },
  {
    "id": "mule-layering",
    "name": "Money mule and layering activity",
    "family": "AML-adjacent",
    "oneLine": "The account is used as a staging post: money arrives from people with no reason to send it and leaves almost immediately.",
    "how": "CONFIRMED (FCA multi-firm review, 'Proceeds of fraud: detecting and preventing money mules'): fraudsters rely on interconnected mule accounts to move and conceal fraud proceeds. The corporate variant uses a business account or business card as the layering step, with funds arriving from unrelated third parties and moving out quickly, or being spent to cash-equivalent value. RESEARCH (Cifas commentary alongside the UK national risk assessment): business accounts are a growing share of mule cases because their flows are larger and less remarkable. RESEARCH (FATF work on prepaid and new payment methods): the exploitable attributes are anonymity, portability, global reach and accessible funding.",
    "signals": [
      "CONFIRMED (FCA) — high-value payments into a new or previously dormant account, with similar amounts debiting shortly afterwards",
      "CONFIRMED (FCA) — a dormant account now in receipt of large funds, and account behaviour breaking sharply from its established pattern",
      "CONFIRMED (FCA) — one device accessing multiple accounts, multiple customers sharing a device or address, and virtual or mail-forwarding addresses",
      "Inbound funding from third parties with no commercial relationship to the account holder's stated business",
      "Rapid in and out with negligible retained balance and none of the costs a trading business carries: no payroll, no rent, no tax",
      "Cards never activated, or activated only to reach cash-equivalent value",
      "Stated business purpose inconsistent with the observed flow of funds"
    ],
    "ruleShape": "Monitor inbound as well as outbound. The FCA's specific criticism was over-reliance on outbound-only monitoring, which misses a mule before the money has left. Build pass-through rules on the ratio of value out to value in over a rolling window with low retained balance, dormancy-to-activity step-change rules, and a shared-attribute graph across device, address and beneficiary. Combine tactical rules with models, device profiling and geolocation, and check shared fraud data. The output must route to the MLRO for suspicion assessment and not only to a fraud-loss queue, because a fraud queue closes an alert when no loss is found and a suspicion does not stop existing because nobody lost money.",
    "action": "hold",
    "falsePositive": "A newly incorporated startup receiving its first funding round into a days-old account and paying suppliers the same week. Large credit into a new account, similar amounts debiting shortly after, negligible retained balance, founders sharing a laptop, registered at a virtual office.",
    "fpWhy": "Every structural feature of an early-stage customer matches the FCA's own mule indicators, and so does every genuinely pass-through business: recruitment and umbrella companies, payroll bureaux, freight forwarders. On a spend product built for growing companies these are not the tail of the distribution. Holding funds here stops payroll, which is the single most damaging thing a control can do to a small company.",
    "layer": "near-real-time alert",
    "productHook": "INFERENCE about product shape, not a claim about any firm: on a prefunded e-money product whose published terms require the customer to load the account and state that loading by cardholders or another source is not permitted without approval, a third-party inbound load is a contractual breach signal as well as a risk signal. That is unusually clean. Most mule indicators are probabilistic; this one is closer to definitional.",
    "metric": "Share of confirmed mule cases where inbound monitoring fired before the outbound leg, not overall detection. Limitation: the denominator only holds cases confirmed as mules, and confirmation usually arrives from outside, through a victim's bank, a shared-data match or a law-enforcement request. You are largely measuring other firms' detection, and every mule nobody else reported is missing from the number entirely."
  },
  {
    "id": "bec-supplier-redirection",
    "name": "Business email compromise and supplier bank-detail redirection",
    "family": "AML-adjacent",
    "oneLine": "A real, fully authenticated finance user is tricked into paying a real invoice into the wrong bank account.",
    "how": "RESEARCH (FinCEN email-compromise advisories, FIN-2016-A003 and successors, whose red flags were developed with the FBI and the Secret Service): an attacker impersonates a supplier or an executive, through a spoofed lookalike domain or a genuinely compromised mailbox, and induces the finance team to redirect a legitimate payment or approve an urgent out-of-process one. It is relevant to any product with bill pay, supplier onboarding or reimbursement rails, because the fraudulent instruction arrives through a legitimate, fully authenticated session. Authentication strength is not a usable signal here. The user really is who they claim to be.",
    "signals": [
      "A change to a supplier's bank details, especially shortly before a scheduled or large payment",
      "A new payee created and paid inside a very short interval, bypassing the usual approval chain",
      "Beneficiary account name not matching the supplier's known legal name, a Confirmation of Payee style mismatch in the UK",
      "Instruction arriving from a lookalike domain, a reply-to that differs from the sender, or a newly created forwarding rule on the requester's mailbox",
      "Urgency or confidentiality framing, and a single approver acting outside their normal pattern",
      "Payment amount and timing matching a genuine invoice, but the destination account differing from the account historically paid",
      "Beneficiary account newly opened, or previously recorded as a mule account"
    ],
    "ruleShape": "Treat the bank-detail change as the controlled event, not the payment. Any supplier bank-detail amendment triggers out-of-band verification on a previously held contact channel, a settling period before a payment on the new details can execute, and dual approval independent of the requester. Add a new-payee-to-first-payment interval rule, a beneficiary-name-match rule, and a payee-history rule comparing the target account against the account historically paid for that supplier. Because the session is genuinely authenticated, no authentication or device signal helps at all; process friction is the only control that works. The step-up therefore sits on a settings change, which is an unusual and deliberate place to put one.",
    "action": "hold",
    "falsePositive": "A supplier genuinely rebanking, being acquired, or moving to a factoring provider whose account name legitimately differs from the trading name, so the name-match check fails on a completely honest change days before a real invoice falls due.",
    "fpWhy": "Quarter-end and year-end genuinely produce urgent, out-of-pattern, single-approver payments to brand-new payees, which is the exact profile the rule targets. Applied indiscriminately, verification friction delays real suppliers and, worse, teaches finance teams to route urgent payments around the platform. Pushing the payment onto a rail you cannot monitor is a worse outcome than the delay you avoided.",
    "layer": "real-time step-up",
    "productHook": "INFERENCE about product shape, not a claim about any firm: an invoices and accounts-payable surface, supplier onboarding and reimbursement rails mean the platform holds the beneficiary record, so it can enforce a settling period on a bank-detail change that an email-based process never could. Multi-entity administration also concentrates who is able to make that change across several legal entities at once.",
    "metric": "Coverage: the share of supplier bank-detail changes verified out of band before the first payment on the new details. Limitation: coverage says nothing about verification quality. Ringing the phone number printed on the new invoice is one hundred per cent coverage and zero control, so it must be paired with an assurance sample on which channel was actually used."
  }
]
