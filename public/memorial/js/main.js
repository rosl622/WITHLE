document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // Common: Navigation Scroll Effect
    // ==========================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-sm');
                navbar.classList.remove('py-4');
                navbar.classList.add('py-2');
            } else {
                navbar.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-sm', 'py-2');
                navbar.classList.add('py-4');
            }
        });
    }

    // ==========================================
    // Landing Page: Intersection Observer for Fade-in
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, observerOptions);

    // Apply to elements with .animate-on-scroll class (not yet added to HTML, but good for future)
    // Or apply to sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('transition-all', 'duration-1000', 'ease-out');
        // section.classList.add('opacity-0', 'translate-y-10'); // Uncomment to enable section fade-in
        // observer.observe(section);
    });


    // ==========================================
    // Demo Page Logic
    // ==========================================

    // 1. Tab Switching
    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');

    if (tabs.length > 0) {
        window.showTab = function (targetId) {
            // Update Tab UI
            tabs.forEach(t => {
                if (t.dataset.target === targetId) {
                    t.classList.add('active-tab', 'text-primary-600');
                    t.classList.remove('text-gray-500');
                } else {
                    t.classList.remove('active-tab', 'text-primary-600');
                    t.classList.add('text-gray-500');
                }
            });

            // Show Content
            contents.forEach(c => {
                if (c.id === `tab-${targetId}`) {
                    c.classList.remove('hidden');
                } else {
                    c.classList.add('hidden');
                }
            });
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                showTab(tab.dataset.target);
            });
        });
    }

    // 2. Guestbook Form
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookList = document.getElementById('guestbook-list');

    if (guestbookForm && guestbookList) {
        guestbookForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('guest-name').value;
            const message = document.getElementById('guest-message').value;
            const icon = document.querySelector('input[name="icon"]:checked').value;

            const today = new Date().toISOString().split('T')[0].replace(/-/g, '.');

            // Create new entry
            const newEntry = document.createElement('div');
            newEntry.className = 'bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-fade-in ring-2 ring-primary-100';
            newEntry.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <span class="font-bold text-gray-800 flex items-center gap-2">
                        <span class="bg-gray-100 rounded-full p-1 text-xs">${icon}</span> ${name}
                    </span>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-primary-500 font-bold">New</span>
                        <span class="text-xs text-gray-400">${today}</span>
                    </div>
                </div>
                <p class="text-gray-600">${message}</p>
            `;

            // Prepend to list
            guestbookList.insertBefore(newEntry, guestbookList.firstChild);

            // Reset form
            guestbookForm.reset();
            alert('메시지가 등록되었습니다. 몽이가 무지개다리에서 기뻐할 거예요!');
        });
    }

    // 3. Lightbox (Gallery)
    window.openLightbox = function (index) {
        const lightbox = document.getElementById('lightbox');
        const img = document.getElementById('lightbox-img');

        // Mock images (same as in HTML)
        const images = [
            'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800', // Dog 1
            '', // Emoji 1 (Not supporting images for emoji placeholders in this simple logic, but handling gently)
            '',
            '',
            '',
            ''
        ];

        // If it's a real image URL
        if (index === 0) {
            img.src = images[0];
            img.classList.remove('hidden');
        } else {
            // For emoji placeholders, we might just show a placeholder or alert
            // For this demo, let's just reuse the first image for all "real" image interactions or skip
            img.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800';
        }

        lightbox.classList.remove('hidden');
    }

    window.closeLightbox = function () {
        document.getElementById('lightbox').classList.add('hidden');
    }

    // Close on background click
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});
