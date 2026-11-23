# Design and traceability

The stakeholder problem is that staff must understand and prioritize requests that may lack useful details. This slice uses staff-entered text and human review; photos, accounts, assignment, scheduling and repair completion are outside the prototype.

| Requirements | Implementation | Evidence |
| --- | --- | --- |
| FR-1 input | Text entry and 1–2,000 character validation | Input tests |
| FR-2–4 category, priority, explanation | AI adapter and structured candidate validator | Mock endpoint and validation tests; live behavior pending |
| FR-5–7 missing details, questions, uncertainty | Candidate fields | Schema checks; model quality evaluation pending |
| FR-8 review | Editable form and explicit confirmation | Browser walkthrough pending |
| FR-9 warning | Independent limited phrase check | Unit and endpoint tests; not comprehensive |
| FR-10 errors | Safe error, retained input, manual form | Missing-key and failure endpoint tests; browser walkthrough pending |
| Privacy and human authority | Fictional data notice, local binding, no persistent storage or external actions | Code inspection; provider handling depends on account settings |

Design change: Unlike the Assignment 2 proposal, review state stays in browser memory rather than server session memory. A refresh loses the review. The provider request uses a 25-second socket timeout, not a guaranteed 30-second end-to-end deadline; timing validation remains outstanding. The warning runs client-side immediately and server-side in the response. Neither detects every danger.
