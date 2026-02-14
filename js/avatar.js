// js/avatar.js
// Handles 3D avatar generation using the backend proxy (Real Implementation)

async function generateAvatar(file) {
    const statusDiv = document.getElementById('model-status');
    const statusText = document.getElementById('model-status-text');
    const viewer = document.querySelector('model-viewer');

    try {
        // 1. UI Update
        statusDiv.classList.remove('hidden');
        statusText.innerText = '사진을 서버로 전송 중...';

        // 2. File to Base64 (to send to Vercel Backend)
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });

        const base64Data = await toBase64(file);
        const fileExt = file.name.split('.').pop().toLowerCase();

        // 3. Upload to Tripo (via Proxy)
        statusText.innerText = '서버에 사진 업로드 중...';
        const uploadResponse = await fetch('/api/tripo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'upload',
                payload: {
                    filename: file.name,
                    content: base64Data,
                    type: fileExt
                }
            })
        });

        const uploadData = await uploadResponse.json();
        if (uploadData.error) throw new Error(uploadData.error);

        // Tripo API returns { code: 0, data: { image_token: "..." } } usually
        const imageToken = uploadData.data?.image_token || uploadData.image_token;

        if (!imageToken) throw new Error('이미지 토큰 발급 실패');

        // 4. Create Generation Task
        statusText.innerText = '3D 모델 생성 요청 중...';
        const createResponse = await fetch('/api/tripo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'create_task',
                payload: { file_token: imageToken }
            })
        });

        const createData = await createResponse.json();
        if (createData.error) throw new Error(createData.error);

        const taskId = createData.data?.task_id || createData.task_id;
        if (!taskId) throw new Error('작업 ID 발급 실패');

        // 5. Poll for Result
        statusText.innerText = '3D 모델 생성 중... (약 2~3분 소요)';

        let attempts = 0;
        const maxAttempts = 60; // 5 min max (5s interval)
        const interval = setInterval(async () => {
            attempts++;
            if (attempts > maxAttempts) {
                clearInterval(interval);
                alert('생성 시간이 너무 오래 걸립니다. 나중에 다시 시도해주세요.');
                statusDiv.classList.add('hidden');
                return;
            }

            try {
                const checkResponse = await fetch('/api/tripo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'get_task',
                        payload: { task_id: taskId }
                    })
                });
                const checkData = await checkResponse.json();
                const task = checkData.data || checkData;

                if (task.status === 'success') {
                    clearInterval(interval);
                    statusText.innerText = '완료! 모델을 불러옵니다...';

                    // Success! Update Viewer
                    // Tripo returns model url in output.model
                    const modelUrl = task.output?.model || task.model_url;

                    if (modelUrl) {
                        viewer.src = modelUrl;
                        statusDiv.classList.add('hidden');
                        alert('✨ 몽이가 3D로 변신했어요!');
                    } else {
                        throw new Error('모델 URL을 찾을 수 없습니다.');
                    }
                } else if (task.status === 'failed') {
                    clearInterval(interval);
                    throw new Error('3D 생성 실패: ' + (task.message || '알 수 없는 오류'));
                }
                // If 'running' or 'queued', waiting...
                statusText.innerText = `3D 모델 생성 중... (${task.progress || ((attempts / maxAttempts) * 100).toFixed(0)}%)`;

            } catch (err) {
                console.error('Polling Error:', err);
                // Continues polling despite minor network glitches
            }
        }, 5000); // Check every 5 seconds

    } catch (error) {
        console.error(error);

        // 🚨 Fallback for Insufficient Credits (Code 2010)
        // If API fails due to credits, show a DEMO DOG model to satisfy user experience
        if (error.message.includes('2010') || error.message.includes('credit')) {
            alert('⚠️무료 크레딧이 부족하여 생성이 중단되었습니다.\n대신 "샘플 강아지" 모델을 불러와서 기능을 보여드릴게요! 🐶');

            // Public URL for a cute Shiba Inu (low poly) or similar
            // Using a reliable public asset
            const demoModelUrl = 'https://modelviewer.dev/shared-assets/models/shishkebab.glb';
            viewer.src = demoModelUrl;

            statusText.innerText = '샘플 모델(케밥먹는 강아지) 로드 완료!';
            setTimeout(() => statusDiv.classList.add('hidden'), 2000);
            return;
        }

        alert(`생성 실패: ${error.message}`);
        statusDiv.classList.add('hidden');
    }
}

// Event Listener for File Input
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('avatar-upload');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                generateAvatar(e.target.files[0]);
            }
        });
    }
});

// Interaction Logic
window.interactAvatar = function (type) {
    const viewer = document.querySelector('model-viewer');

    // 1. Motion Response (CSS Animation)
    viewer.classList.remove('animate-bounce', 'animate-pulse', 'animate-wiggle');
    void viewer.offsetWidth; // Trigger reflow to restart animation

    if (type === 'pet') {
        // Gentle bounce like being petted
        viewer.style.transformOrigin = 'bottom center';
        viewer.classList.add('animate-bounce');
        createParticles('❤️');
        showBubble('기분 좋아! 멍!');
    } else if (type === 'feed') {
        // Shake like eating vigorously
        viewer.classList.add('animate-pulse');
        createParticles('🦴');
        showBubble('냠냠! 맛있다!');
    } else if (type === 'play') {
        // Spin or big movement
        const currentOrbit = viewer.getCameraOrbit();
        viewer.cameraOrbit = `${currentOrbit.theta + 180}deg ${currentOrbit.phi}deg ${currentOrbit.radius}m`;
        createParticles('✨');
        showBubble('헤헤! 신난다!');
    }

    // Reset standard animations after a while? 
    // Tailwind animate classes loop by default, so we might want custom classes or remove them
    setTimeout(() => {
        viewer.classList.remove('animate-bounce', 'animate-pulse');
    }, 1000);
}

// Helper: Floating Particles
function createParticles(emoji) {
    const container = document.querySelector('.relative.group'); // The avatar container
    if (!container) return;

    for (let i = 0; i < 5; i++) {
        const p = document.createElement('div');
        p.innerText = emoji;
        p.className = 'absolute text-2xl animate-float pointer-events-none z-20';
        p.style.left = (50 + (Math.random() * 40 - 20)) + '%';
        p.style.top = '50%';
        p.style.animationDuration = (1 + Math.random()) + 's';

        container.appendChild(p);

        // Remove after animation
        setTimeout(() => p.remove(), 1500);
    }
}

// Helper: Speech Bubble
function showBubble(text) {
    // Check if bubble exists
    let bubble = document.getElementById('avatar-bubble');
    if (!bubble) {
        const container = document.querySelector('.relative.group');
        bubble = document.createElement('div');
        bubble.id = 'avatar-bubble';
        bubble.className = 'absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg text-xs font-bold text-gray-700 whitespace-nowrap opacity-0 transition-opacity duration-300 z-30 border border-primary-100';
        container.appendChild(bubble);

        // Add tiny triangle
        const arrow = document.createElement('div');
        arrow.className = 'absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white transform rotate-45';
        bubble.appendChild(arrow);
    }

    bubble.childNodes[0].nodeValue = text; // Update text node only, keep arrow
    bubble.classList.remove('opacity-0');
    bubble.classList.add('opacity-100', '-translate-y-2');


    setTimeout(() => {
        bubble.classList.remove('opacity-100', '-translate-y-2');
        bubble.classList.add('opacity-0');
    }, 2000);
}

// Theme Logic
window.setTheme = function (theme) {
    const container = document.getElementById('avatar-container');
    if (!container) return;

    // Reset classes
    container.className = "w-48 h-48 mx-auto relative group rounded-full overflow-hidden border-4 border-white shadow-lg transition-colors duration-500";

    // Apply new theme
    switch (theme) {
        case 'sky':
            container.classList.add('bg-gradient-to-b', 'from-sky-200', 'to-sky-50');
            break;
        case 'night':
            container.classList.add('bg-gradient-to-b', 'from-indigo-900', 'to-slate-900');
            break;
        case 'nature':
            container.classList.add('bg-gradient-to-b', 'from-green-300', 'to-emerald-100');
            break;
        case 'cozy':
            container.classList.add('bg-gradient-to-b', 'from-orange-100', 'to-amber-50');
            break;
        default:
            container.classList.add('bg-gradient-to-b', 'from-sky-200', 'to-sky-50');
    }

    createParticles('✨'); // Effect feedback
}

// Add custom float animation to global style if not present
if (!document.getElementById('anim-style')) {
    const style = document.createElement('style');
    style.id = 'anim-style';
    style.innerHTML = `
        @keyframes floatUp {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
        }
        .animate-float {
            animation-name: floatUp;
            animation-timing-function: ease-out;
            animation-fill-mode: forwards;
        }
    `;
    document.head.appendChild(style);
}
