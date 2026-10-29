// Demo data for the HCI prototype. These illustrative mappings are not diagnoses
// or a clinically validated symptom checker. Keyword detection is added in commit 3.
(() => {
    'use strict';

    const SYMPTOMS = [
        { id: 'headache', label: 'Headache', keywords: ['headache', 'headaches', 'head hurts'] },
        { id: 'nausea', label: 'Nausea', keywords: ['nausea', 'nauseous', 'queasy'] },
        { id: 'light-sensitivity', label: 'Light sensitivity', keywords: ['light sensitivity', 'sensitive to light', 'bright lights'] },
        { id: 'fatigue', label: 'Tiredness', keywords: ['tired', 'fatigue', 'exhausted'] },
        { id: 'sleep-difficulty', label: 'Sleep difficulty', keywords: ['poor sleep', 'cannot sleep', "can't sleep", 'trouble sleeping', 'insomnia'] },
        { id: 'stress', label: 'Stress', keywords: ['stress', 'stressed', 'overwhelmed'] },
        { id: 'cough', label: 'Cough', keywords: ['cough', 'coughing'] },
        { id: 'sore-throat', label: 'Sore throat', keywords: ['sore throat', 'throat hurts'] },
        { id: 'fever', label: 'Fever', keywords: ['fever', 'feverish'] },
    ];

    const CONDITIONS = [
        { id: 'migraine-pattern', label: 'Migraine-like pattern',
            symptomIds: ['headache', 'nausea', 'light-sensitivity'], minimumMatches: 3 },
        { id: 'stress-sleep-pattern', label: 'Stress and sleep pattern',
            symptomIds: ['stress', 'sleep-difficulty', 'fatigue'], minimumMatches: 3 },
        { id: 'respiratory-pattern', label: 'Respiratory symptom pattern',
            symptomIds: ['cough', 'sore-throat', 'fever'], minimumMatches: 3 },
    ];

    // Each conversation contributes a different symptom for the later
    // cross-chat demonstration. All people and conversations are fictional.
    const MOCK_HISTORY = [
        {
            id: 'demo-headache', title: 'Headaches after studying',
            createdAt: '2026-10-20T10:00:00+08:00', isMock: true,
            messages: [
                { id: 'demo-headache-user', role: 'user', text: 'I have a headache after studying.' },
                { id: 'demo-headache-assistant', role: 'assistant', text: 'When did you first notice this?' },
            ],
        },
        {
            id: 'demo-nausea', title: 'Feeling queasy',
            createdAt: '2026-10-23T14:30:00+08:00', isMock: true,
            messages: [
                { id: 'demo-nausea-user', role: 'user', text: 'I felt nauseous this afternoon.' },
                { id: 'demo-nausea-assistant', role: 'assistant', text: 'What else was happening around that time?' },
            ],
        },
        {
            id: 'demo-light', title: 'Bright lights',
            createdAt: '2026-10-26T18:00:00+08:00', isMock: true,
            messages: [
                { id: 'demo-light-user', role: 'user', text: 'Recently I have been sensitive to light.' },
                { id: 'demo-light-assistant', role: 'assistant', text: 'Thanks for sharing. You can add more details whenever you like.' },
            ],
        },
    ];

    function freezeData(value) {
        Object.values(value).forEach(child => {
            if (child !== null && typeof child === 'object') freezeData(child);
        });
        return Object.freeze(value);
    }

    // Shared browser API for subsequent commits. Call createMockHistory() to get
    // editable chat state without changing the original demonstration data.
    globalThis.HealthAIData = freezeData({
        SYMPTOMS,
        CONDITIONS,
        MOCK_HISTORY,
        createMockHistory: () => structuredClone(MOCK_HISTORY),
    });
})();
