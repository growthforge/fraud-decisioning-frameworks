/* How the function runs, as distinct from how one change is made.
   A rule estate can be immaculate and the function around it still fail, because
   almost everything that makes a decisioning team work quickly lives in one
   person's head. This is the part of the work that never appears in a rule
   specification and is the first thing to break when someone leaves. */

export interface ContinuityItem {
  risk: string
  looksLike: string
  artefact: string
  test: string
}

export const CONTINUITY_NOTE =
  'A decisioning function is not only a set of rules. It is an intake route, a queue, a review ' +
  'rhythm, and a small number of people who know why things are the way they are. The rule estate ' +
  'is documented because someone insisted on it. The rest usually is not — and the rest is what ' +
  'stops working when one person is on leave.'

export const CONTINUITY: ContinuityItem[] = [
  {
    risk: 'One person is the intake route',
    looksLike:
      'Fraud Ops raise things by messaging whoever answered last time. Requests arrive in three channels and none of them is a queue. Nobody can say how many requests are open, how old the oldest is, or which were declined and why.',
    artefact:
      'A single intake form with the fields a proposal actually needs — typology, population, the harm, the proposed action, the requester, the urgency and the reason for it — and one place it lands.',
    test:
      'Ask how many rule requests are open right now. If the answer requires asking a specific person, the intake route is that person.',
  },
  {
    risk: 'One person knows why the threshold is that number',
    looksLike:
      'The logic is in the platform and the reasoning is in a chat thread from fourteen months ago. The rule works. Nobody will touch it, because nobody can reconstruct what it would break.',
    artefact:
      'The versioned specification, with the evidence for the operating point attached to the version rather than to the rule. Untouchable rules are a symptom, not a safety feature.',
    test:
      'Pick a live rule at random and ask someone who did not write it to explain why the threshold sits where it does. Give them the documentation and nothing else.',
  },
  {
    risk: 'One person can approve, and they are on leave',
    looksLike:
      'The change queue stops, or the emergency path gets used for changes that are not emergencies — which is worse, because the standard control then never binds and the audit trail says it did.',
    artefact:
      'A named deputy with the same standing, and an emergency route with a defined trigger, a time limit and a mandatory retrospective review. Emergency use is itself a monitored metric.',
    test:
      'Count what share of changes in the last quarter went through the emergency path. If it is not small, there is one path, not two.',
  },
  {
    risk: 'Nobody owns the rule after the person who built it moves on',
    looksLike:
      'An inventory with an owner column full of people who have left. Rules accumulate because retiring one requires understanding it, and adding one does not.',
    artefact:
      'Ownership reassigned as part of the leaver process, and a review date that forces a decision rather than a renewal. A rule whose owner cannot be named is a finding.',
    test:
      'Reconcile the inventory owner column against the current staff list. That one query is usually the whole answer.',
  },
  {
    risk: 'The operating rhythm is a series of interruptions',
    looksLike:
      'Every request is urgent because there is no forum in which a non-urgent one can be dealt with. Decision Intelligence spends the week reacting, and the tuning work that would reduce the reacting never starts.',
    artefact:
      'A standing review at a fixed cadence with a published agenda — new proposals, rules breaching monitoring triggers, rules past their review date, and last period’s post-implementation reviews. Anything genuinely urgent still cuts the queue; the point is that most things are not.',
    test:
      'Ask when the next scheduled rule review is. A date is a rhythm. "When something comes up" is not.',
  },
  {
    risk: 'The monitoring only exists as a query someone runs',
    looksLike:
      'Rule performance is visible when a particular analyst runs a particular query. Post-deployment monitoring is real, and it is also a person rather than a system.',
    artefact:
      'Scheduled reporting that arrives whether or not anyone asks for it, with rule-level attribution rather than estate-level totals, and an owner who is expected to act on it.',
    test:
      'Stop asking for the report for a month and see whether anyone notices it has not arrived.',
  },
]
