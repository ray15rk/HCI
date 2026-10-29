const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const browser = vm.createContext({ structuredClone });
vm.runInContext(readFileSync(path.join(root, 'data.js'), 'utf8'), browser);
const data = browser.HealthAIData;

test('the page loads the data as a classic browser script', () => {
    const html = readFileSync(path.join(root, 'index.html'), 'utf8');
    assert.match(html, /<script src="data\.js"><\/script>/);
    assert.ok(data);
    assert.ok(Object.isFrozen(data));
});

test('symptom IDs and keyword aliases are unique and usable', () => {
    const ids = new Set();
    const keywords = new Set();
    for (const symptom of data.SYMPTOMS) {
        assert.ok(symptom.id && symptom.label);
        assert.ok(!ids.has(symptom.id), `Duplicate symptom: ${symptom.id}`);
        ids.add(symptom.id);
        assert.ok(symptom.keywords.length > 0);
        for (const keyword of symptom.keywords) {
            assert.ok(keyword.trim());
            assert.equal(keyword, keyword.toLowerCase());
            assert.ok(!keywords.has(keyword), `Ambiguous keyword: ${keyword}`);
            keywords.add(keyword);
        }
    }
    assert.ok(ids.size > 0);
});

test('condition mappings reference valid symptoms and achievable thresholds', () => {
    const symptomIds = new Set(data.SYMPTOMS.map(symptom => symptom.id));
    const conditionIds = new Set();
    assert.ok(data.CONDITIONS.length > 0);
    for (const condition of data.CONDITIONS) {
        assert.ok(condition.id && condition.label);
        assert.ok(!conditionIds.has(condition.id));
        conditionIds.add(condition.id);
        assert.equal(new Set(condition.symptomIds).size, condition.symptomIds.length);
        assert.ok(condition.symptomIds.every(id => symptomIds.has(id)));
        assert.ok(Number.isInteger(condition.minimumMatches));
        assert.ok(condition.minimumMatches > 0);
        assert.ok(condition.minimumMatches <= condition.symptomIds.length);
    }
});

test('mock chats have unique IDs, valid dates, and user/assistant messages', () => {
    const ids = new Set();
    const messageIds = new Set();
    assert.ok(data.MOCK_HISTORY.length >= 3);
    for (const chat of data.MOCK_HISTORY) {
        assert.ok(chat.id && chat.title);
        assert.ok(!ids.has(chat.id));
        ids.add(chat.id);
        assert.equal(chat.isMock, true);
        assert.ok(Number.isFinite(Date.parse(chat.createdAt)));
        assert.ok(chat.messages.some(message => message.role === 'user'));
        assert.ok(chat.messages.some(message => message.role === 'assistant'));
        for (const message of chat.messages) {
            assert.ok(message.id && message.text.trim());
            assert.ok(!messageIds.has(message.id));
            messageIds.add(message.id);
            assert.ok(['user', 'assistant'].includes(message.role));
        }
    }
});

test('the demo supplies the three migraine-pattern keywords across separate chats', () => {
    const condition = data.CONDITIONS.find(item => item.id === 'migraine-pattern');
    const contributingChats = new Set();
    for (const id of condition.symptomIds) {
        const symptom = data.SYMPTOMS.find(item => item.id === id);
        const chat = data.MOCK_HISTORY.find(item => item.messages.some(message =>
            message.role === 'user' && symptom.keywords.some(keyword => message.text.toLowerCase().includes(keyword))));
        assert.ok(chat, `Missing demonstration symptom: ${id}`);
        contributingChats.add(chat.id);
    }
    assert.equal(contributingChats.size, 3);
});

test('editable history copies cannot mutate the seed or other copies', () => {
    const first = data.createMockHistory();
    const second = data.createMockHistory();
    first[0].messages[0].text = 'Edited';
    first.pop();
    assert.notEqual(second[0].messages[0].text, 'Edited');
    assert.notEqual(data.MOCK_HISTORY[0].messages[0].text, 'Edited');
    assert.equal(second.length, data.MOCK_HISTORY.length);
    assert.ok(Object.isFrozen(data.MOCK_HISTORY[0].messages[0]));
});
