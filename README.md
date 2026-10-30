# Health AI HCI prototype

## Start the project

Open `index.html` in a current Chrome, Edge, or Firefox browser. No installation,
server, API key, or build step is needed.

## Data Layer

`data.js` loads through `index.html` and exposes `window.HealthAIData`:

- `SYMPTOMS`: symptom IDs, display labels, and lowercase keyword aliases.
- `CONDITIONS`: illustrative patterns, their symptom IDs, and minimum match counts.
- `MOCK_HISTORY`: fictional past conversations with stable chat/message IDs.
- `createMockHistory()`: a fresh editable copy of the mock conversations.

The definitions are frozen to protect the seed data. Chat code can start
with `const chats = HealthAIData.createMockHistory();`. The three mock chats each
mention a different symptom from the migraine-like pattern, ready for the
cross-chat demonstration. These mappings are demonstration rules, not diagnoses
or a clinically validated symptom checker.

To inspect the loaded data, open the browser developer console and enter
`HealthAIData` or `HealthAIData.createMockHistory()`.

## Chat & Symptom Detection

- `engine.js` exposes `window.HealthAIEngine` with:
  - `detectSymptoms(text)`: whole-word keyword matching against `HealthAIData.SYMPTOMS`.
  - `getChatSymptoms(chat)`: scans past conversations for referenced symptoms.
  - `findInference(currentSymptomIds, pastChats)`: correlates symptoms across conversations against health condition patterns.
  - `buildReply(userText, pastChats)`: generates contextual replies with cross-chat correlation insights.
- `app.js` holds the chat state and rendering. It starts with the mock history plus an
  empty new chat, and handles sending (send button or Enter), switching chats from the
  sidebar, and "New chat". Each message gets a short "Thinking..." delay and then a
  reply naming any symptoms or cross-chat inferences it found. The first message names an untitled chat.

## Cross-Chat Inference & Explainability

When current symptoms correlate with symptoms recorded in past conversations to reach a condition threshold, the assistant detects the cross-chat pattern and presents an explainability card ("Why am I seeing this?") beneath the message.
