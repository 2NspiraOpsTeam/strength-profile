# Strength Profile V1 architecture review

Reviewer: Adam. Date: 2026-11-13. Source: main `5e19c02eedca3d5ed07f4d019bfff48f3ede9c31`. Scope: issue #9, architecture review only. No production change.

## Verdict

The 24-question / eight-dimension structure is suitable as a lightweight **self-reflection** scaffold, but current result readiness and archetype selection are **not acceptable for a credible V1 result experience**. Do not describe the scores as validated psychometrics, confidence, aptitude, percentiles or a job-fit diagnosis. No reliability/validity study is established here.

## Reproduced scoring observations

Executed current `assessment-config`, `profile-config`, and `scoring` as ES modules without changing their logic. These are logic probes, not browser/production verification.

| Input | Overall | Profile | Problem |
| --- | --- | --- | --- |
| No answers | 0 | Creative Catalyst | Unanswered input receives a named profile |
| All 24 answers = 5 | 100 | Creative Catalyst | All dimensions tied; array order implies unique strengths and weak areas |
| All 24 answers = 3 | 50 | Creative Catalyst | Same unsupported tie outcome |
| q1 = 5 only | 13 | Creative Catalyst | One answered question produces ranked strengths and a named profile |
| q1 = 99 | 0 | Creative Catalyst | Out-of-range numeric answer silently scores zero |

All dimensions currently have three questions. Rating mapping is 1→0, 2→25, 3→50, 4→75, 5→100. Dimensions are averaged, then overall is the equally weighted mean of dimension averages. Missing questions are ignored within a dimension; an entirely missing dimension becomes zero. This makes partial results incomparable with completed results.

`getPrimaryProfile` compares only the top two dimension IDs with eight configured pairs. **20 of 28 possible unordered top-two pairs are unmapped** and fall back to Strategic Synthesizer regardless of their actual dimensions. All-tied inputs happen to match Creative Catalyst because stable sorting preserves configuration order. `weakest` reverses the tie order and then describes equally strong dimensions as friction zones.

## Readiness and validation contract

1. Validate the exact 24 known question IDs and integer ratings 1–5. Ignore unknown keys for progress; reject invalid values from scoring. Never count `Object.keys(responses)` as completion.
2. Incomplete means no finalized archetype, ranked report, report request or “Assessment complete” status. Show answered/required count and return to the first missing answer. Section navigation may be free, but View Results must enforce readiness.
3. All-high/all-low/flat results mean **no clear differentiation**, not one dominant profile. Present equal patterns neutrally; do not manufacture weakest dimensions or recommend manager treatment from an arbitrary tie-break.
4. Preserve tied groups. A deterministic sort is acceptable for display order only, never as evidence of ranking. Do not invent a statistical confidence number.
5. Complete and differentiated results: report relative self-reported tendencies. An unmapped pair should receive a neutral combined-dimensions summary, not a mismatched default archetype. Broadening pair mappings requires reviewed copy; do not invent new validated archetypes.
6. Missing optional name, role or context must remain valid and produce generic copy. These fields affect narrative only, not scoring. Do not say the profile is personalized to a context that was not supplied.

## Component findings and persistence

`components/strength-profile-app.js` Next/View Results has no answer-completeness gate; a visitor can advance without answering. Scoring and narrative helpers run even when incomplete. The result heading claims completion and the UI labels one top profile.

`getInitialState` catches malformed JSON/read failures but does not validate response/profile shapes or types. A truthy malformed stored response value can leak into scoring; non-string `name` can fail `.trim()`. The persistence effect writes to localStorage without exception handling. Reading and writing in separate mount effects means the write initially observes defaults before restored state is applied; Strict Mode/browser behavior requires explicit hydration tests before claiming reliable restoration. Do not present this as proven user-data loss without a rendered reproduction.

Only responses/context are persisted, not navigation or result-view state. Refresh begins at the landing view with restored answers rather than restoring the same result step. Retake returns to assessment with previous answers; it is currently edit/review, not a clean new attempt. Make those semantics explicit.

### Required implementation behavior

- Version and validate persisted schema; safely default invalid fields. Gate writes until initial restoration completes.
- Catch storage quota/security errors, keep the form usable in memory, and show a non-blocking “progress cannot be saved on this device” notice. Do not promise cloud or cross-device storage.
- Offer **Review answers** preserving the current attempt, and **Start a new assessment** with confirmation and deliberate reset. Do not clear on an ambiguous Retake click.
- Define refresh behavior explicitly: resume saved assessment, with a clear Results entry only after valid completion. Avoid claiming hidden context is required.
- Name/email/work context in localStorage should be disclosed as device-local; data minimization and retention/clear controls need an explicit design decision. No data transmission was tested in this review.

## Handoff to Maya and Cleo

Maya: use “Your responses suggest…” and “relative self-reported patterns.” For flat/tied results use “Your responses do not show one clearly differentiated pattern.” Avoid scientific confidence, weakest-personality judgments, and career suitability guarantees. Keep all context optional.

Cleo: implement readiness/validation before polishing final-report layout. Keep scoring pure and return explicit readiness and differentiation metadata. Never let a UI disable-only gate substitute for scorer validation. Preserve existing contact behavior; sending mail is not part of this review.

## Acceptance for follow-up implementation

- Zero/partial/invalid/unknown-key inputs never finalize a report; 24 valid answers do.
- All-low/mid/high and two-/three-way top ties yield honest tied/no-differentiation states; no fabricated friction zones.
- Every one of the 28 top-two pairs either has a justified mapping or a neutral fallback.
- Optional/malformed context does not crash rendering or change numeric scoring.
- Reload restores valid saved data without default overwrite; corrupt JSON/schema and denied/quota-exceeded storage leave assessment usable.
- Review, new attempt, cancel reset, refresh and repeated clicks have defined outcomes.
- Rendered desktop/mobile and keyboard QA verifies readiness, error recovery, report language and persistence. No such rendered app QA or production verification is claimed by this architecture review.
