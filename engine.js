// Chat engine for the HCI prototype: keyword symptom detection, reply
// building, and cross-chat inference correlation. Pure functions with no DOM access.
(() => {
    'use strict';

    const { SYMPTOMS, CONDITIONS } = globalThis.HealthAIData;

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

    // Extracts all symptom IDs mentioned by the user in a conversation
    function getChatSymptoms(chat) {
        const userText = (chat.messages || [])
            .filter(m => m.role === 'user')
            .map(m => m.text)
            .join(' ');
        return detectSymptoms(userText);
    }

    // Correlates current symptoms with symptoms from past conversations
    function findInference(currentSymptomIds, pastChats) {
        if (!currentSymptomIds || currentSymptomIds.length === 0 || !Array.isArray(pastChats)) return null;

        for (const condition of CONDITIONS) {
            const currentMatches = currentSymptomIds.filter(s => condition.symptomIds.includes(s));
            if (currentMatches.length === 0) continue;

            const matchedPastChats = [];
            const collectedSymptoms = new Set(currentMatches);

            for (const chat of pastChats) {
                if (chat.excluded) continue;
                const pastSymptoms = getChatSymptoms(chat).filter(s => condition.symptomIds.includes(s));
                if (pastSymptoms.length > 0) {
                    matchedPastChats.push({
                        chatId: chat.id,
                        title: chat.title,
                        createdAt: chat.createdAt,
                        symptoms: pastSymptoms
                    });
                    pastSymptoms.forEach(s => collectedSymptoms.add(s));
                }
            }

            if (collectedSymptoms.size >= condition.minimumMatches && matchedPastChats.length > 0) {
                return {
                    conditionId: condition.id,
                    conditionLabel: condition.label,
                    advice: condition.advice || '',
                    currentSymptoms: currentMatches,
                    matchedPastChats,
                    totalMatches: collectedSymptoms.size
                };
            }
        }
        return null;
    }

    // Builds the assistant's reply to one user message, evaluating cross-chat inference first.
    function buildReply(userText, pastChats = []) {
        const currentSymptomIds = detectSymptoms(userText);
        const inference = findInference(currentSymptomIds, pastChats);

        if (inference) {
            const currentNames = inference.currentSymptoms.map(id => `**${symptomLabel(id).toLowerCase()}**`);
            const chatNames = inference.matchedPastChats.map(c => `**${c.title}**`).join(' and ');

            return {
                symptomIds: currentSymptomIds,
                inference,
                text: `You mentioned ${joinLabels(currentNames)} today. Your earlier conversations about ${chatNames} may be related, pointing toward a possible **${inference.conditionLabel}**.\n\n`
                    + (inference.advice ? `${inference.advice}\n\n` : '')
                    + 'If these symptoms persist or worsen, please consider consulting a healthcare professional.',
            };
        }

        if (currentSymptomIds.length === 0) {
            return {
                symptomIds: currentSymptomIds,
                inference: null,
                text: "I didn't pick up a specific symptom in that message. "
                    + 'You can tell me how you are feeling, for example if you have a headache or feel tired.',
            };
        }

        const labels = currentSymptomIds.map(id => `**${symptomLabel(id).toLowerCase()}**`);
        const adviceList = currentSymptomIds
            .map(id => {
                const item = SYMPTOMS.find(s => s.id === id);
                return item && item.advice ? item.advice : '';
            })
            .filter(Boolean);
        const adviceText = adviceList.length > 0 ? `${adviceList.join(' ')}\n\n` : '';

        return {
            symptomIds: currentSymptomIds,
            inference: null,
            text: `You mentioned ${joinLabels(labels)}.\n\n`
                + adviceText
                + 'If this persists or gets worse, please consider speaking to a healthcare professional.',
        };
    }

    globalThis.HealthAIEngine = Object.freeze({ detectSymptoms, getChatSymptoms, findInference, buildReply });
})();
