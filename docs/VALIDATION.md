# Validation notes

## Observations on November 27, 2026

The prototype ran locally without an API key. In a browser, a fictional request stating that there were sparks from an outlet displayed the danger notice before analysis. Selecting Analyze displayed an AI configuration error and a manual review form; the danger notice remained visible. Selecting Electrical and Urgent, entering an explanation, and confirming changed the status to Reviewed. Changing the request to `My sink is broken.` cleared the earlier review and returned the status to Draft. This was a developer walkthrough, not a stakeholder usability evaluation.

The automated test command completed with 10 tests passing. The tests cover input limits, danger phrases, response validation, mocked local endpoint success and failure, and the AI adapter's request, timeout, malformed response, and unsupported-source behavior. The adapter tests use controlled responses and do not contact an AI provider.

## Still to validate

A live model call was not run because no API key was configured. Test the live provider with clear, vague, and hazard-related fictional requests; assess the generated output, uncertainty, and follow-up questions; and record the model, date, response time, actual result, and limitations. Check stakeholder priority rules and usability. A phrase match or exact source excerpt does not prove safety or factual correctness. Never include personal data in the test evidence.
