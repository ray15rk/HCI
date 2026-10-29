// Chat engine for the HCI prototype: keyword symptom detection and reply
// building. Pure functions with no DOM access, so they can be tested in Node.
// Cross-chat correlation is added in commit 4.
(() => {
    'use strict';

    const { SYMPTOMS } = globalThis.HealthAIData;

    // Lowercase, straighten curly apostrophes, and collapse whitespace so that
    // "Can’t  sleep" matches the keyword "can't sleep".
    function normalize(text) {
        return String(text).toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
    }

    function escapeRegExp(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Whole-word/phrase match, so "retired" does not match "tired".
    const MATCHERS = SYMPTOMS.map(symptom => ({
        id: symptom.id,
        patterns: symptom.keywords.map(keyword =>
            new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalize(keyword))}($|[^a-z0-9])`)),
    }));

    // Returns the IDs of every symptom mentioned in the text, in SYMPTOMS order.
    function detectSymptoms(text) {
        const normalized = normalize(text);
        return MATCHERS
            .filter(matcher => matcher.patterns.some(pattern => pattern.test(normalized)))
            .map(matcher => matcher.id);
    }

    function symptomLabel(id) {
        const symptom = SYMPTOMS.find(item => item.id === id);
        return symptom ? symptom.label : id;
    }

    function joinLabels(labels) {
        if (labels.length <= 1) return labels.join('');
        return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;
    }

    // Builds the assistant's reply to one user message.
    // Returns { text, symptomIds }; the text may use **bold** markers.
    function buildReply(userText) {
        const symptomIds = detectSymptoms(userText);
        if (symptomIds.length === 0) {
            return {
                symptomIds,
                text: "I didn't pick up a specific symptom in that message. "
                    + 'You can tell me how you are feeling, for example if you have a headache or feel tired.',
            };
        }
        const labels = symptomIds.map(id => `**${symptomLabel(id).toLowerCase()}**`);
        return {
            symptomIds,
            text: `You mentioned ${joinLabels(labels)}. Thanks for sharing.\n\n`
                + 'If this persists or gets worse, please consider speaking to a healthcare professional.',
        };
    }

    globalThis.HealthAIEngine = Object.freeze({ detectSymptoms, buildReply });
})();
