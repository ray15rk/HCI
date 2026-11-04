const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const browser = vm.createContext({ structuredClone });
for (const file of ['data.js', 'engine.js']) {
    vm.runInContext(readFileSync(path.join(root, file), 'utf8'), browser);
}
const data = browser.HealthAIData;
const engine = browser.HealthAIEngine;

test('the page loads the engine and app after the data, in order', () => {
    const html = readFileSync(path.join(root, 'index.html'), 'utf8');
    const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(match => match[1]);
    assert.deepEqual(scripts, ['data.js', 'engine.js', 'app.js']);
});

test('detects a single symptom from any of its keyword aliases', () => {
    assert.deepEqual(Array.from(engine.detectSymptoms('I have a headache')), ['headache']);
    assert.deepEqual(Array.from(engine.detectSymptoms('my head hurts')), ['headache']);
    assert.deepEqual(Array.from(engine.detectSymptoms('Feeling QUEASY today')), ['nausea']);
});

test('detects several symptoms in one message, in taxonomy order', () => {
    assert.deepEqual(Array.from(engine.detectSymptoms('I am tired and have a fever and a headache')),
        ['fatigue', 'headache', 'fever']);
});

test('matches whole words only', () => {
    assert.deepEqual(Array.from(engine.detectSymptoms('My retired uncle visited')), []);
    assert.deepEqual(Array.from(engine.detectSymptoms('Tired.')), ['fatigue']);
});

test('handles curly apostrophes and extra whitespace', () => {
    assert.deepEqual(Array.from(engine.detectSymptoms('I can’t   sleep')), ['sleep-difficulty']);
});

test('returns nothing for unrelated or empty text', () => {
    assert.deepEqual(Array.from(engine.detectSymptoms('What is the weather like?')), []);
    assert.deepEqual(Array.from(engine.detectSymptoms('')), []);
});

test('every symptom keyword is detected as that symptom', () => {
    for (const symptom of data.SYMPTOMS) {
        for (const keyword of symptom.keywords) {
            assert.ok(Array.from(engine.detectSymptoms(`I have ${keyword}.`)).includes(symptom.id),
                `Keyword not detected: ${keyword}`);
        }
    }
});

test('each mock chat is detected as its own symptom', () => {
    const detected = Array.from(data.MOCK_HISTORY, chat => Array.from(engine.detectSymptoms(chat.messages[0].text)));
    assert.deepEqual(detected, [['headache'], ['muscle-pain'], ['sleep-difficulty'], ['tingling'], ['hair-thinning'], ['constipation'], []]);
});

test('replies name the detected symptoms', () => {
    const reply = engine.buildReply('I have a headache and I feel nauseous');
    assert.deepEqual(Array.from(reply.symptomIds), ['headache', 'nausea']);
    assert.match(reply.text, /\*\*headaches\*\* and \*\*nausea\*\*/);
});

test('replies without a symptom invite the user to describe one', () => {
    const reply = engine.buildReply('hello there');
    assert.deepEqual(Array.from(reply.symptomIds), []);
    assert.match(reply.text, /didn't pick up a specific symptom/);
});

test('consent: engine blocks cross-chat inference when memory is disabled (empty array)', () => {
    const userText = 'I have a headache and feel nauseous';
    
    // With consent (passing MOCK_HISTORY)
    const replyWithConsent = engine.buildReply(userText, data.MOCK_HISTORY);
    assert.ok(replyWithConsent.inference !== null, 'Inference should trigger when history is provided');

    // Without consent (passing empty array from the UI toggle)
    const replyWithoutConsent = engine.buildReply(userText, []);
    assert.equal(replyWithoutConsent.inference, null, 'Inference must be blocked when history is withheld');
});

test('consent: engine respects individual chat exclusion flags', () => {
    const userText = 'I have a headache and feel nauseous';
    const pastChats = structuredClone(data.MOCK_HISTORY);
    
    // Simulate the user opting specific past chats out of the training/memory pool
    pastChats.forEach(chat => chat.excluded = true); 
    
    const reply = engine.buildReply(userText, pastChats);
    assert.equal(reply.inference, null, 'Excluded chats should not be used for inference');
});

test('bulk: extracts symptoms from bulk multi-message chat histories', () => {
    const bulkChat = {
        messages: [
            { role: 'user', text: 'I have a fever.' },
            { role: 'assistant', text: 'Noted.' },
            { role: 'user', text: 'And also a severe sore throat.' },
            { role: 'assistant', text: 'Are you coughing?' },
            { role: 'user', text: 'Yes, I have a bad cough too.' }
        ]
    };
    const symptoms = Array.from(engine.getChatSymptoms(bulkChat));
    assert.deepEqual(symptoms, ['cough', 'sore-throat', 'fever']); 
});

test('api failures: engine gracefully handles missing, null, or malformed payloads', () => {
    assert.deepEqual(Array.from(engine.detectSymptoms(null)), []);
    assert.deepEqual(Array.from(engine.detectSymptoms(undefined)), []);
    const badReply = engine.buildReply('I have a headache', null);
    assert.equal(badReply.inference, null, 'Should fail gracefully to null inference');
    assert.deepEqual(Array.from(badReply.symptomIds), ['headache']);
});
