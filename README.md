# Health AI HCI prototype

## Start the project

Open `index.html` in a current Chrome, Edge, or Firefox browser. No installation,
server, API key, or build step is needed for this version.

This version includes commits 1 to 3: the chat layout, its data layer, and message
sending with keyword symptom detection. Cross-chat inference is implemented in
subsequent commits.

## Commit 2: data

`data.js` loads through `index.html` and exposes `window.HealthAIData`:

- `SYMPTOMS`: nine symptom IDs, display labels, and lowercase keyword aliases.
- `CONDITIONS`: three illustrative patterns, their symptom IDs, and minimum match counts.
- `MOCK_HISTORY`: three fictional past conversations with stable chat/message IDs.
- `createMockHistory()`: a fresh editable copy of the mock conversations.

The definitions are frozen to protect the seed data. Future chat code can start
with `const chats = HealthAIData.createMockHistory();`. The three mock chats each
mention a different symptom from the migraine-like pattern, ready for the later
cross-chat demonstration. These mappings are demonstration rules, not diagnoses
or a clinically validated symptom checker.

To inspect the loaded data, open the browser developer console and enter
`HealthAIData` or `HealthAIData.createMockHistory()`.

## Commit 3: chat and symptom detection

- `engine.js` exposes `window.HealthAIEngine` with `detectSymptoms(text)` (whole-word
  keyword matching against `HealthAIData.SYMPTOMS`) and `buildReply(text)`. It has no DOM
  access.
- `app.js` holds the chat state and rendering. It starts with the mock history plus an
  empty new chat, and handles sending (send button or Enter), switching chats from the
  sidebar, and "New chat". Each message gets a short "Thinking..." delay and then a
  reply naming any symptoms it found. The first message names an untitled chat.

Try it: send "I have a headache and feel tired" to see both symptoms picked up.

## Verify

With Node.js 18 or newer installed, run from the project folder:

```powershell
node --test
```

The checks (`tests/data.test.cjs` and `tests/engine.test.cjs`) cover browser-script loading, data integrity, condition references,
the cross-chat demo fixture, isolation of editable history copies, and symptom
detection. They use
Node's built-in test runner; no packages are required.
