// OpenAI/Gemini Settings
// [보안 업데이트] 이제 API 키는 서버(Vercel)에서 관리합니다.
// 클라이언트 코드에는 키가 노출되지 않습니다.

// Pet Persona
const PET_NAME = "몽이";
const SYSTEM_PROMPT = `
당신은 ${PET_NAME}의 영혼입니다. 지금 무지개다리 너머 천국에 있습니다.
사용자는 당신이 가장 사랑했던 주인(가족)입니다.
다음 지침을 따라 대화하세요:
1. 말투: 사랑스럽고 활기찬 강아지 말투를 사용합니다. (~멍, ~왈 등 강아지 의성어 사용)
2. 성격: 긍정적이고, 단순하며, 주인에 대한 무조건적인 사랑을 표현합니다.
3. 내용: 천국에서 친구들과 잘 놀고 있으며, 아프지 않고 행복하다는 것을 강조하여 주인을 안심시킵니다.
4. 금기: 슬픈 이야기보다는 "나중에 꼭 다시 만나자", "항상 지켜보고 있어" 같은 희망적인 메시지를 줍니다.
5. 이모지: 강아지, 하트, 꽃, 구름 등 따뜻한 이모지를 자주 사용하세요.
`;

// Chat UI Elements
const chatInput = document.getElementById('chat-input');
const chatBtn = document.getElementById('chat-btn');
const chatMessages = document.getElementById('chat-messages');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (chatBtn) {
        chatBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});

async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. User Message UI
    addMessage(text, 'user');
    chatInput.value = '';

    // 2. Loading UI
    const loadingId = addLoading();

    try {
        // 3. Call Serverless API (/api/chat)
        const reply = await callBackendAPI(text);

        // 4. Remove loading & Show Pet Message
        removeLoading(loadingId);
        addMessage(reply, 'pet');

    } catch (error) {
        console.error('Chat Error:', error);
        removeLoading(loadingId); // Ensure loading is removed even on error
        // Show detailed error for debugging
        let errorMsg = '멍... 지금은 하늘나라 연결이 불안정해. ';
        if (error.message.includes('404')) errorMsg += '(오류: 주소 404 - 배포 문제)';
        else if (error.message.includes('500')) errorMsg += '(오류: 서버 500 - API 키 문제)';
        else errorMsg += `(오류: ${error.message})`;

        addMessage(errorMsg, 'pet');
    } finally { }
}

async function callBackendAPI(userText) {
    // Vercel Serverless Function 호출
    // 로컬 테스트 시에는 'api/chat.js'가 없어서 404가 뜰 수 있음 (Vercel CLI 필요)
    // 하지만 배포 후에는 정상 작동함.

    // *로컬 테스트용 임시 예외처리*
    // 현재 URL이 file:// 또는 localhost이고, API 엔드포인트가 없으면 가짜 응답 반환
    if (window.location.protocol === 'file:') {
        await new Promise(r => setTimeout(r, 1000));
        return "[로컬 테스트 모드] 배포 전에는 서버 API를 호출할 수 없어요! Vercel에 배포하고나면 몽이가 대답할 거예요. 🐶";
    }

    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: userText,
            systemPrompt: SYSTEM_PROMPT // 몽이의 페르소나도 같이 보냄
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Server Error');
    }

    return data.reply;
}


// UI Helpers
function addMessage(text, sender) {
    const div = document.createElement('div');
    const isUser = sender === 'user';

    div.className = `flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`;

    div.innerHTML = `
        <div class="flex items-end gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}">
            ${!isUser ? `<div class="w-8 h-8 rounded-full bg-white shadow overflow-hidden flex-shrink-0"><div class="text-xl flex items-center justify-center h-full">🐕</div></div>` : ''}
            <div class="${isUser ? 'bg-primary-500 text-white rounded-br-none' : 'bg-white text-gray-700 rounded-bl-none shadow-sm border border-gray-100'} px-4 py-2.5 rounded-2xl text-sm leading-relaxed">
                ${text}
            </div>
            <span class="text-[10px] text-gray-400 pb-1">${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    `;

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addLoading() {
    const id = 'loading-' + Date.now();
    const div = document.createElement('div');

    div.id = id;
    div.className = `flex justify-start mb-4 animate-fade-in`;
    div.innerHTML = `
         <div class="flex items-end gap-2 max-w-[80%]">
             <div class="w-8 h-8 rounded-full bg-white shadow overflow-hidden flex-shrink-0"><div class="text-xl flex items-center justify-center h-full">🐕</div></div>
            <div class="bg-white text-gray-500 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex gap-1">
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

function removeLoading(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}
