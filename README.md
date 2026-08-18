# Fraud Decisioning Frameworks

Card & payment risk · the rule lifecycle.

An analytical work product about how a fraud rule gets proposed, sized, tested, approved,
deployed, monitored, tuned and rolled back — and what each of those steps costs.

Built from a published role description, public regulatory and industry sources, and the
public shape of a spend-management card product. It holds no firm's internal material,
because none of that is public.

Every figure in a worked example or in the simulator is **synthetic and labelled as such**.
No real portfolio, rule, threshold or fraud rate is represented anywhere.

## Running it

```bash
npm ci
npm run dev
```

## Checks

```bash
npm run verify        # swimlane geometry, content depth, class-name collisions
npm run sim           # the tuning simulator's statistical invariants
npm run contamination # nothing private reaches the published site
npm run build         # type-check and bundle
```

`npm run verify` asserts the diagram arithmetic rather than trusting a screenshot: a
screenshot scales, and would hide a diagram whose labels have shrunk below the point where
they can be read over a screen share.
