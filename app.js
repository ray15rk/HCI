// Chat state, rendering, and message dispatch for the HCI prototype.
// Depends on data.js (HealthAIData) and engine.js (HealthAIEngine).
(() => {
    'use strict';

    const REPLY_DELAY_MS = 600;
    const DEFAULT_TITLE = 'New chat';
    const MAX_TITLE_LENGTH = 40;

    const chatTitleElement = document.getElementById('chat-title');
    const chatSubtitleElement = document.getElementById('chat-subtitle');
    const chatHistoryElement = document.getElementById('chat-history');
    const recentChatsElement = document.getElementById('recent-chats');
    const userInputElement = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const newChatButton = document.querySelector('.new-chat-btn');

    // --- STATE ---
    const chats = HealthAIData.createMockHistory();
    const pendingChatIds = new Set(); // chats currently waiting for a reply
    let nextId = 1;
    let activeChat = createChat();

    function createChat() {
        const chat = {
            id: `chat-${nextId++}`,
            title: DEFAULT_TITLE,
            createdAt: new Date().toISOString(),
            isMock: false,
            messages: [],
        };
        chats.push(chat);
        return chat;
    }

    function addMessage(chat, role, text, inference = null) {
        chat.messages.push({
            id: `${chat.id}-m${chat.messages.length + 1}`,
            role,
            text,
            inference,
        });
    }

    function shortTitle(text) {
        return text.length > MAX_TITLE_LENGTH ? `${text.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…` : text;
    }

    // --- ACTIONS ---
    function newChat() {
        // Reuse an unused empty chat rather than piling up blank ones.
        activeChat = chats.find(chat => !chat.isMock && chat.messages.length === 0) || createChat();
        render();
        userInputElement.focus();
    }

    function selectChat(id) {
        const chat = chats.find(item => item.id === id);
        if (!chat) return;
        activeChat = chat;
        render();
    }

    function sendMessage() {
        const text = userInputElement.value.trim();
        if (!text) return;

        const chat = activeChat;
        if (pendingChatIds.has(chat.id)) return; // one reply at a time per chat

        addMessage(chat, 'user', text);
        if (chat.title === DEFAULT_TITLE) chat.title = shortTitle(text);
        userInputElement.value = '';
        pendingChatIds.add(chat.id);
        render();

        // The reply is added to the chat the message was sent in, even if the
        // user has switched to another chat in the meantime.
        setTimeout(() => {
            pendingChatIds.delete(chat.id);
            const otherChats = chats.filter(c => c.id !== chat.id);
            const reply = HealthAIEngine.buildReply(text, otherChats);
            addMessage(chat, 'assistant', reply.text, reply.inference);
            render();
        }, REPLY_DELAY_MS);
    }

    // --- RENDERING ---
    function formatDate(iso) {
        return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }

    // Appends text to an element, turning **bold** markers and newlines into DOM nodes.
    function appendFormattedText(element, text) {
        text.split('\n').forEach((line, lineIndex) => {
            if (lineIndex > 0) element.appendChild(document.createElement('br'));
            line.split(/\*\*(.+?)\*\*/).forEach((part, partIndex) => {
                if (partIndex % 2 === 1) {
                    const strong = document.createElement('strong');
                    strong.textContent = part;
                    element.appendChild(strong);
                } else if (part) {
                    element.appendChild(document.createTextNode(part));
                }
            });
        });
    }

    function createMessageRow(role, fill, inference = null) {
        const row = document.createElement('div');
        row.className = `message-row ${role === 'user' ? 'user' : 'ai'}`;
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        if (role === 'user') {
            fill(bubble);
        } else {
            const icon = document.createElement('div');
            icon.className = 'ai-icon';
            icon.textContent = '✦';
            const content = document.createElement('div');
            content.className = 'ai-content';
            const body = document.createElement('div');
            fill(body);
            content.appendChild(body);

            if (inference) {
                const card = document.createElement('div');
                card.className = 'insight-card';
                card.innerHTML = `
                    <div class="badge-row">✦ AI-inferred • Based on ${inference.matchedPastChats.length + 1} conversations</div>
                    <div class="insight-text">Connected with your earlier chats: ${inference.matchedPastChats.map(c => `<em>${c.title}</em>`).join(', ')}</div>
                    <div class="insight-footer">Why am I seeing this?</div>
                `;
                content.appendChild(card);
            }

            bubble.append(icon, content);
        }
        row.appendChild(bubble);
        return row;
    }

    function renderSidebar() {
        const visible = chats
            .filter(chat => chat === activeChat || chat.messages.length > 0)
            .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        recentChatsElement.replaceChildren(...visible.map(chat => {
            const item = document.createElement('div');
            item.className = `sidebar-item${chat === activeChat ? ' active' : ''}`;
            item.dataset.chatId = chat.id;
            item.textContent = chat.title;
            return item;
        }));
    }

    function renderChat() {
        chatTitleElement.textContent = activeChat.title;
        chatSubtitleElement.textContent = activeChat.isMock
            ? `${formatDate(activeChat.createdAt)} • Past conversation`
            : 'General GenAI conversation';

        const rows = activeChat.messages.map(message =>
            createMessageRow(message.role, element => {
                if (message.role === 'user') element.textContent = message.text;
                else appendFormattedText(element, message.text);
            }, message.inference));
        if (pendingChatIds.has(activeChat.id)) {
            rows.push(createMessageRow('assistant', element => { element.textContent = 'Thinking...'; }));
        }
        chatHistoryElement.replaceChildren(...rows);
        chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
    }

    function render() {
        renderSidebar();
        renderChat();
    }

    // --- EVENTS ---
    sendButton.addEventListener('click', sendMessage);
    newChatButton.addEventListener('click', newChat);
    userInputElement.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !event.isComposing) {
            event.preventDefault();
            sendMessage();
        }
    });
    recentChatsElement.addEventListener('click', event => {
        const item = event.target.closest('.sidebar-item');
        if (item) selectChat(item.dataset.chatId);
    });

    render();
})();
