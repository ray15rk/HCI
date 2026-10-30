// Demo data for the HCI prototype. These illustrative mappings are not diagnoses
// or a clinically validated symptom checker.
(() => {
    'use strict';

    const SYMPTOMS = [
        {
            id: 'fatigue',
            label: 'Fatigue',
            keywords: ['tired', 'fatigue', 'exhausted', 'no energy', 'low energy', 'sleepy', 'weak'],
            advice: 'Ensure you are getting enough sleep, eating balanced meals, and staying hydrated. Gentle daily movement can also help boost energy levels.'
        },
        {
            id: 'cold',
            label: 'Feeling cold',
            keywords: ['feel cold', 'feeling cold', 'always cold', 'so cold', 'am cold', 'cold hands', 'cold feet', 'freezing', 'chilly'],
            advice: 'Try wearing warm layers and having a warm, caffeine-free drink. Make sure your environment is at a comfortable temperature.'
        },
        {
            id: 'constipation',
            label: 'Constipation',
            keywords: ['constipat', 'constipated', 'hard stool'],
            advice: 'Increasing your dietary fiber, drinking plenty of water, and getting regular physical activity can help keep your digestion moving.'
        },
        {
            id: 'hair-thinning',
            label: 'Hair thinning',
            keywords: ['hair thinning', 'hair loss', 'losing hair', 'hair fall', 'thinning hair'],
            advice: 'Gentle hair care, avoiding tight hairstyles, and ensuring a nutrient-rich diet can support overall hair health.'
        },
        {
            id: 'tingling',
            label: 'Tingling / numbness',
            keywords: ['tingl', 'tingling', 'pins and needles', 'numb', 'numbness'],
            advice: 'Avoid sitting or standing in one position for too long. Gentle stretching and moving around can help improve circulation.'
        },
        {
            id: 'thirst',
            label: 'Excess thirst',
            keywords: ['thirst', 'thirsty', 'dry mouth'],
            advice: 'Keep a water bottle handy and sip water throughout the day. Try to avoid excessive caffeine and sugary drinks, which can be dehydrating.'
        },
        {
            id: 'frequent-urine',
            label: 'Frequent urination',
            keywords: ['urinat', 'peeing a lot', 'pee a lot', 'bathroom a lot', 'frequent urination'],
            advice: 'Try limiting fluids right before bed to reduce waking up at night, and note if certain drinks like coffee or tea make it worse.'
        },
        {
            id: 'blurred-vision',
            label: 'Blurred vision',
            keywords: ['blurry', 'blurred vision', 'blurry vision'],
            advice: 'Give your eyes regular breaks from screens using the 20-20-20 rule (look at something 20 feet away for 20 seconds every 20 minutes).'
        },
        {
            id: 'slow-healing',
            label: 'Slow-healing wounds',
            keywords: ['slow healing', 'wounds heal slowly', 'cuts heal slowly'],
            advice: 'Keep the area clean and protected. Eating a balanced diet rich in vitamins and protein supports the body\'s healing process.'
        },
        {
            id: 'dizziness',
            label: 'Dizziness',
            keywords: ['dizz', 'dizzy', 'dizziness', 'lightheaded', 'light-headed'],
            advice: 'Sit or lie down safely until the feeling passes. Drink some water and try to avoid sudden changes in posture.'
        },
        {
            id: 'pale-skin',
            label: 'Pale skin',
            keywords: ['pale', 'pale skin'],
            advice: 'Ensure you are eating a varied diet rich in iron and vitamins. If you feel unwell, take it easy and rest.'
        },
        {
            id: 'breathless',
            label: 'Shortness of breath',
            keywords: ['short of breath', 'shortness of breath', 'out of breath', 'breathless'],
            advice: 'Sit upright, take slow, deep breaths, and try to relax. Pacing your daily activities can help manage breathlessness.'
        },
        {
            id: 'weight-gain',
            label: 'Weight gain',
            keywords: ['weight gain', 'gaining weight', 'gained weight'],
            advice: 'Focus on a balanced diet of whole foods, regular physical activity, and good sleep habits.'
        },
        {
            id: 'weight-loss',
            label: 'Weight loss',
            keywords: ['weight loss', 'losing weight', 'lost weight', 'unexplained weight'],
            advice: 'Eating smaller, more frequent meals packed with nutrients and healthy fats can help maintain your energy and weight.'
        },
        {
            id: 'dry-skin',
            label: 'Dry skin',
            keywords: ['dry skin'],
            advice: 'Use a gentle, fragrance-free moisturizer after showering and try to avoid very hot water.'
        },
        {
            id: 'headache',
            label: 'Headaches',
            keywords: ['headache', 'headaches', 'head hurts', 'migraine'],
            advice: 'Rest in a quiet, dark room, stay hydrated, and try placing a cool cloth on your forehead or neck.'
        },
        {
            id: 'sleep-difficulty',
            label: 'Trouble sleeping',
            keywords: ['insomnia', 'trouble sleeping', "can't sleep", 'cant sleep', 'cannot sleep', 'not sleeping', 'waking up at night', 'keep waking up', 'sleepless', 'poor sleep'],
            advice: 'Stick to a regular sleep schedule, keep your bedroom cool and dark, and avoid screens for at least an hour before bed.'
        },
        {
            id: 'brain-fog',
            label: 'Brain fog',
            keywords: ['brain fog', "can't concentrate", 'cant concentrate', "can't focus", 'cant focus', 'hard to focus', 'trouble focusing', 'difficulty concentrating', 'forgetful'],
            advice: 'Take short breaks during focused tasks, stay hydrated, and ensure you are getting enough quality sleep each night.'
        },
        {
            id: 'bloating',
            label: 'Bloating',
            keywords: ['bloat', 'bloated', 'bloating', 'gassy'],
            advice: 'Eating slowly, chewing your food well, and avoiding highly carbonated drinks can help reduce trapped gas.'
        },
        {
            id: 'stomach-pain',
            label: 'Stomach pain',
            keywords: ['stomach pain', 'stomach hurts', 'stomach ache', 'stomachache', 'abdominal pain', 'belly pain', 'cramps'],
            advice: 'Try resting with a warm water bottle on your stomach. Eating small, bland meals might also help settle it.'
        },
        {
            id: 'diarrhea',
            label: 'Diarrhea',
            keywords: ['diarrh', 'diarrhea', 'loose stool'],
            advice: 'Focus on staying hydrated with water or electrolyte solutions. Stick to plain, easily digestible foods like rice or toast.'
        },
        {
            id: 'palpitations',
            label: 'Racing heartbeat',
            keywords: ['palpitation', 'palpitations', 'heart racing', 'racing heart', 'heart is racing', 'heart pounding', 'heart is pounding'],
            advice: 'Sit down, try taking slow and deep breaths, and minimize caffeine or known stress triggers.'
        },
        {
            id: 'low-mood',
            label: 'Low mood',
            keywords: ['low mood', 'feeling down', 'feel down', 'unmotivated'],
            advice: 'Try getting outside for a short walk, talking to a trusted friend or family member, and making sure you get enough rest.'
        },
        {
            id: 'muscle-pain',
            label: 'Muscle / joint aches',
            keywords: ['muscle pain', 'muscle ache', 'sore muscles', 'body ache', 'bone pain', 'joint pain'],
            advice: 'Gentle stretching, a warm bath, or applying a heat pack can help soothe sore muscles.'
        },
        {
            id: 'frequent-illness',
            label: 'Getting sick often',
            keywords: ['getting sick', 'sick often', 'catch colds', 'catching colds', 'frequent colds', 'always sick'],
            advice: 'Focus on good sleep hygiene, hydration, and a balanced diet rich in fruits and vegetables.'
        },
        {
            id: 'stress',
            label: 'Stress',
            keywords: ['stress', 'stressed', 'overwhelmed'],
            advice: 'Try taking mindful breathing breaks, stepping outside for fresh air, and balancing your workload.'
        },
        {
            id: 'nausea',
            label: 'Nausea',
            keywords: ['nausea', 'nauseous', 'queasy'],
            advice: 'Sip cool water or ginger tea slowly and rest in an upright position in fresh air.'
        },
        {
            id: 'light-sensitivity',
            label: 'Light sensitivity',
            keywords: ['light sensitivity', 'sensitive to light', 'bright lights'],
            advice: 'Rest in a dimly lit room and avoid looking at high-brightness screens.'
        },
        {
            id: 'cough',
            label: 'Cough',
            keywords: ['cough', 'coughing'],
            advice: 'Stay hydrated with warm fluids and consider a spoonful of honey to soothe throat irritation.'
        },
        {
            id: 'sore-throat',
            label: 'Sore throat',
            keywords: ['sore throat', 'throat hurts'],
            advice: 'Gargle warm salt water and drink warm soothing fluids throughout the day.'
        },
        {
            id: 'fever',
            label: 'Fever',
            keywords: ['fever', 'feverish'],
            advice: 'Rest comfortably, wear lightweight clothing, and stay well hydrated.'
        }
    ];

    const CONDITIONS = [
        {
            id: 'thyroid',
            label: 'Thyroid Health',
            symptomIds: ['fatigue', 'cold', 'constipation', 'hair-thinning', 'weight-gain', 'dry-skin', 'brain-fog'],
            minimumMatches: 2,
            advice: 'The thyroid helps regulate energy and metabolism, so changes there can show up in several ways. A simple blood test (TSH) can check this.'
        },
        {
            id: 'gut-health',
            label: 'Digestive Health',
            symptomIds: ['bloating', 'stomach-pain', 'constipation', 'diarrhea', 'fatigue', 'weight-loss'],
            minimumMatches: 2,
            advice: 'Persistent bloating, stomach pain or bowel changes can have dietary or digestive causes. A food diary can help, and a doctor can check for things like intolerances or IBS.'
        },
        {
            id: 'blood-sugar',
            label: 'Blood Sugar Regulation',
            symptomIds: ['thirst', 'frequent-urine', 'fatigue', 'tingling', 'blurred-vision', 'slow-healing', 'weight-loss'],
            minimumMatches: 2,
            advice: 'Blood sugar that runs high can affect thirst, energy, vision and nerve sensation. A quick blood glucose test can check this.'
        },
        {
            id: 'iron-b12',
            label: 'Iron / Vitamin B12 Levels',
            symptomIds: ['fatigue', 'hair-thinning', 'tingling', 'dizziness', 'pale-skin', 'breathless', 'cold', 'brain-fog'],
            minimumMatches: 2,
            advice: 'Low iron or vitamin B12 can affect energy, hair and nerve sensation. A blood test for iron, ferritin and B12 can check this.'
        },
        {
            id: 'vitamin-d',
            label: 'Vitamin D Levels',
            symptomIds: ['fatigue', 'muscle-pain', 'low-mood', 'frequent-illness'],
            minimumMatches: 2,
            advice: 'Vitamin D supports energy, muscles, mood and immunity. If you get little sun, a blood test for vitamin D can check this.'
        },
        {
            id: 'sleep-quality',
            label: 'Sleep Quality',
            symptomIds: ['sleep-difficulty', 'fatigue', 'brain-fog', 'low-mood'],
            minimumMatches: 2,
            advice: 'Ongoing poor sleep can affect energy, focus and mood. A regular schedule and less caffeine and screen time before bed can help.'
        },
        {
            id: 'stress-anxiety',
            label: 'Stress or Anxiety',
            symptomIds: ['palpitations', 'sleep-difficulty', 'headache', 'low-mood', 'muscle-pain', 'stress'],
            minimumMatches: 2,
            advice: 'Stress and anxiety can show up physically, in your heartbeat, sleep and headaches. Slow breathing, regular movement and talking to someone can help.'
        },
        {
            id: 'dehydration',
            label: 'Hydration',
            symptomIds: ['thirst', 'dizziness', 'headache', 'dry-skin', 'fatigue'],
            minimumMatches: 2,
            advice: 'Not drinking enough fluids can cause thirst, headaches, dizziness and tiredness. Try drinking water regularly through the day and see if it improves.'
        },
        {
            id: 'migraine-pattern',
            label: 'Migraine-like pattern',
            symptomIds: ['headache', 'nausea', 'light-sensitivity'],
            minimumMatches: 2,
            advice: 'Recurring headaches accompanied by nausea or sensitivity to light often suggest migraine patterns. Keeping a headache diary can help identify triggers.'
        },
        {
            id: 'respiratory-pattern',
            label: 'Respiratory symptom pattern',
            symptomIds: ['cough', 'sore-throat', 'fever'],
            minimumMatches: 2,
            advice: 'Cough, sore throat and fever commonly accompany respiratory infections. Rest and hydration can support recovery.'
        }
    ];

    const MOCK_HISTORY = [
        {
            id: 'c5',
            title: 'Frequent headaches',
            createdAt: '2026-10-03T14:00:00+08:00',
            isMock: true,
            messages: [
                { id: 'c5-m1', role: 'user', text: "I've been getting headaches most afternoons." },
                { id: 'c5-m2', role: 'assistant', text: "That's worth keeping an eye on. Try noting when they start, how much water you've had, and how you slept." }
            ]
        },
        {
            id: 'c7',
            title: 'Muscle aches',
            createdAt: '2026-10-01T11:00:00+08:00',
            isMock: true,
            messages: [
                { id: 'c7-m1', role: 'user', text: "I've had sore muscles lately even though I haven't been exercising." },
                { id: 'c7-m2', role: 'assistant', text: "Gentle stretching and rest can help soothe sore muscles." }
            ]
        },
        {
            id: 'c4',
            title: 'Trouble sleeping',
            createdAt: '2026-09-30T22:30:00+08:00',
            isMock: true,
            messages: [
                { id: 'c4-m1', role: 'user', text: "I've had trouble sleeping this week and I keep waking up at 3am." },
                { id: 'c4-m2', role: 'assistant', text: "A consistent bedtime, a cooler room, and less screen time before bed can help." }
            ]
        },
        {
            id: 'c3',
            title: 'Tingling feet',
            createdAt: '2026-09-27T19:00:00+08:00',
            isMock: true,
            messages: [
                { id: 'c3-m1', role: 'user', text: "My feet keep tingling at night, almost like pins and needles." },
                { id: 'c3-m2', role: 'assistant', text: "Tingling can have many causes, from posture to circulation or nutrient levels." }
            ]
        },
        {
            id: 'c2',
            title: 'Hair thinning',
            createdAt: '2026-09-24T16:15:00+08:00',
            isMock: true,
            messages: [
                { id: 'c2-m1', role: 'user', text: "I've noticed hair thinning around the crown of my head." },
                { id: 'c2-m2', role: 'assistant', text: "Hair thinning can be linked to stress, diet, or hormonal changes." }
            ]
        },
        {
            id: 'c1',
            title: 'Constipation',
            createdAt: '2026-09-20T09:45:00+08:00',
            isMock: true,
            messages: [
                { id: 'c1-m1', role: 'user', text: "I've been constipated for about a week now. Is there anything I can do?" },
                { id: 'c1-m2', role: 'assistant', text: "More fiber, plenty of water, and some gentle movement each day can help keep digestion moving." }
            ]
        },
        {
            id: 'c-trip',
            title: 'Trip planning',
            createdAt: '2026-09-15T15:00:00+08:00',
            isMock: true,
            messages: [
                { id: 'c-trip-m1', role: 'user', text: "What are some good places to visit for a 5-day holiday in Japan?" },
                { id: 'c-trip-m2', role: 'assistant', text: "Tokyo and Kyoto are fantastic choices for a first visit, balancing modern sights and historic temples." }
            ]
        }
    ];

    function freezeData(value) {
        Object.values(value).forEach(child => {
            if (child !== null && typeof child === 'object') freezeData(child);
        });
        return Object.freeze(value);
    }

    globalThis.HealthAIData = freezeData({
        SYMPTOMS,
        CONDITIONS,
        MOCK_HISTORY,
        createMockHistory: () => structuredClone(MOCK_HISTORY),
    });
})();
