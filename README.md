# Health AI HCI prototype

## Start the project

Open `index.html` in a current Chrome, Edge, or Firefox browser. No installation,
server, API key, or build step is needed for this version.

This version includes commits 1 and 2: the static chat layout and its data layer.
Sending messages, displaying chat history, detecting symptoms, and inference are
implemented in subsequent commits. Loading the page currently shows the layout.

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

## Verify

With Node.js 18 or newer installed, run from the project folder:

```powershell
node --test tests/data.test.cjs
```

The checks cover browser-script loading, data integrity, condition references,
the cross-chat demo fixture, and isolation of editable history copies. They use
Node's built-in test runner; no packages are required.
