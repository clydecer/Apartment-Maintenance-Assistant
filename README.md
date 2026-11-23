# Apartment Maintenance Assistant

An AI-assisted coursework prototype for property managers reviewing unclear maintenance requests. It suggests a category, priority, explanations, missing details and questions for a staff member to check and edit. This is a starting point, not a production maintenance or emergency system.

## Privacy and safety

Use **fictional text only**. Do not enter names, addresses, contact details, or real resident information. When AI is configured, the description is sent to OpenAI; check your account's data handling and costs before use. The app has no persistent database. Browser state disappears on refresh or reset; provider retention is separate. The warning list and model cannot detect every emergency. Follow property procedures and contact appropriate emergency services when needed. The app never assigns workers, sends messages, schedules work, or calls emergency services.

## Run locally

Prerequisite: Python 3.10 or newer. No third-party Python packages are required.

```sh
python3 app.py
```

Open `http://127.0.0.1:8000`. To use AI, set an OpenAI API key in your shell before starting; do not commit the key:

```sh
export OPENAI_API_KEY='your-key-here'
python3 app.py
```

Optionally set `OPENAI_MODEL` to an available model supporting Chat Completions JSON mode; the default is `gpt-4o-mini`. Calls require network access and may incur charges. Without a key, the app demonstrates the failure and manual-review path; it does not simulate an AI result. Stop with Ctrl+C. The server binds to localhost only and is not intended for deployment.

## Demonstration

1. Enter `Water is leaking under my sink and spreading.` and select **Analyze request**. With a key, inspect the AI suggestion, reasons, excerpts and questions. Results vary and must be checked.
2. Edit the staff review fields and confirm. This records review only in the current page and sends nothing.
3. Try `My sink is broken` and inspect uncertainty and missing information. Changing input clears the old suggestion.
4. Try `There are sparks from the outlet`. A limited phrase check shows a notice even without AI. This list is not exhaustive.
5. Run without a key to see failure and manual review.

## Architecture

```text
Staff -> browser -> input checks -> AI adapter -> OpenAI API
         |              |                |
         | risk notice  |     validate schema and source excerpts
         +--------------+----------------+
                        -> staff edits -> confirm review
```

The Python server hosts the interface locally and forwards fictional descriptions to the AI provider. Current review state remains in browser memory. The validator checks required fields, approved labels, bounded lists, and literal excerpts. Matching text does not prove a reason is supported: staff must judge it. The original suggestion stays visible separately from edits.

## Tests

```sh
python3 -m unittest discover -s tests -v
```

Tests cover boundaries, danger phrases, candidate validation, and mocked success and failure responses. See [validation notes](docs/VALIDATION.md). A live model call has not yet been validated in this environment.

## Limitations and next steps

- AI can miss danger, invent facts, misclassify, or suggest the wrong priority; the warning phrase list is deliberately small.
- Priority rules and usability have not been confirmed with a property manager.
- This localhost demonstration lacks authentication, durable audit history, resident accounts, notifications, deployment and production privacy safeguards.
- Interview a stakeholder, test a wider set of fictional requests, measure timing, and record real model observations before making claims.

See [design and traceability](docs/DESIGN.md) and [AI assistance](docs/AI_ASSISTANCE.md). Repository: https://github.com/clydecer/Apartment-Maintenance-Assistant
