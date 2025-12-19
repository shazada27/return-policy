// ===== DOM ELEMENTS =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const returnForm = document.getElementById('returnForm');
const formSuccess = document.getElementById('formSuccess');
const trackingCode = document.getElementById('trackingCode');
const backToTop = document.getElementById('backToTop');
const preloader = document.getElementById('preloader');

// ===== PRELOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.add('loaded');
        animateStats();
    }, 1000);
});

// ===== MOBILE NAVIGATION =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(15, 15, 26, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 15, 26, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    // Back to top button
    if (currentScroll > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// ===== BACK TO TOP =====
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.step, .feature-card, .market-card, .problem-card, .solution-card, .testimonial-card, .faq-item, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

const style = document.createElement('style');
style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// ===== MULTI-STEP FORM =====
const formSteps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-step');
const nextBtns = document.querySelectorAll('.btn-next');
const prevBtns = document.querySelectorAll('.btn-prev');
let currentStep = 1;

function updateFormStep(step) {
    formSteps.forEach(s => s.classList.remove('active'));
    progressSteps.forEach(s => { s.classList.remove('active'); s.classList.remove('completed'); });
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    progressSteps.forEach((s, i) => {
        if (i + 1 < step) s.classList.add('completed');
        if (i + 1 === step) s.classList.add('active');
    });
}

nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const inputs = currentFormStep.querySelectorAll('input[required], select[required], textarea[required]');
        let valid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) { valid = false; showFieldError(input); } else { clearFieldError(input); }
        });
        if (valid && currentStep < 3) { currentStep++; updateFormStep(currentStep); }
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener('click', () => { if (currentStep > 1) { currentStep--; updateFormStep(currentStep); } });
});

// ===== FORM HANDLING =====
returnForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;
    const code = generateTrackingCode();
    trackingCode.textContent = code;
    returnForm.classList.add('hidden');
    document.querySelector('.form-progress').style.display = 'none';
    formSuccess.classList.add('show');
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function validateForm() {
    const requiredFields = returnForm.querySelectorAll('[required]');
    let isValid = true;
    requiredFields.forEach(field => {
        if (!field.value.trim()) { isValid = false; showFieldError(field); } else { clearFieldError(field); }
    });
    const emailField = document.getElementById('email');
    if (emailField.value && !isValidEmail(emailField.value)) { isValid = false; showFieldError(emailField, 'Please enter a valid email'); }
    return isValid;
}

function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function showFieldError(field, message = 'This field is required') {
    field.style.borderColor = '#ef4444';
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    const errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    errorEl.style.cssText = 'color: #ef4444; font-size: 0.8rem; margin-top: 4px; display: block;';
    errorEl.textContent = message;
    field.parentNode.appendChild(errorEl);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const errorEl = field.parentNode.querySelector('.error-message');
    if (errorEl) errorEl.remove();
}

function generateTrackingCode() {
    const prefix = 'RET';
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${year}-${random}`;
}

function resetForm() {
    returnForm.reset();
    returnForm.classList.remove('hidden');
    document.querySelector('.form-progress').style.display = 'flex';
    formSuccess.classList.remove('show');
    currentStep = 1;
    updateFormStep(currentStep);
    returnForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function copyTrackingCode() {
    navigator.clipboard.writeText(trackingCode.textContent);
    const btn = document.querySelector('.copy-btn');
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => { btn.innerHTML = '<i class="fas fa-copy"></i>'; }, 2000);
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// ===== TESTIMONIALS SLIDER =====
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dots = document.querySelectorAll('.testimonial-dots .dot');
let currentTestimonial = 0;

function updateTestimonialSlider() {
    testimonialCards.forEach((card, index) => {
        card.style.display = index === currentTestimonial ? 'block' : 'none';
        card.style.opacity = index === currentTestimonial ? '1' : '0';
        card.style.transform = index === currentTestimonial ? 'translateY(0)' : 'translateY(30px)';
    });
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        updateTestimonialSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        updateTestimonialSlider();
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        updateTestimonialSlider();
    });
});

// Initialize slider
if (testimonialCards.length > 0) {
    updateTestimonialSlider();
}

// ===== INPUT FOCUS EFFECTS =====
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function () {
        const label = this.parentNode.querySelector('label');
        if (label) label.style.color = '#8b5cf6';
    });
    input.addEventListener('blur', function () {
        const label = this.parentNode.querySelector('label');
        if (label) label.style.color = '';
    });
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
function highlightNavLink() {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
            });
        }
    });
}
window.addEventListener('scroll', highlightNavLink);

// ===== STATS COUNTER ANIMATION =====
function animateStats() {
    const stats = document.querySelectorAll('.stat-number[data-target]');
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target.toLocaleString();
            }
        };
        updateCounter();
    });
}

// ===== PARALLAX EFFECT FOR ORBS =====
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 15;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
            contactForm.reset();
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                btn.style.background = '';
            }, 3000);
        }, 1500);
    });
}

// ===== NEWSLETTER FORM =====
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const btn = newsletterForm.querySelector('button');
        btn.innerHTML = '<i class="fas fa-check"></i>';
        input.value = '';
        input.placeholder = 'Subscribed!';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
            input.placeholder = 'Enter your email';
        }, 2000);
    });
}

// ===== SET MIN DATE FOR PICKUP =====
const pickupDate = document.getElementById('pickupDate');
const purchaseDate = document.getElementById('purchaseDate');
if (pickupDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    pickupDate.min = tomorrow.toISOString().split('T')[0];
}
if (purchaseDate) {
    purchaseDate.max = new Date().toISOString().split('T')[0];
}

console.log('🚀 Return Policy Website Loaded Successfully!');

// ===== GEMINI CHATBOT =====
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotForm = document.getElementById('chatbotForm');
const chatInput = document.getElementById('chatInput');
const chatbotMessages = document.getElementById('chatbotMessages');
const suggestionChips = document.querySelectorAll('.suggestion-chip');

const SYSTEM_CONTEXT = `You are ReturnPolicy AI, a helpful assistant for a return management system. 
You help customers with:
- Starting and tracking returns
- Understanding return policies (7-day return window, original packaging required)
- Pickup scheduling (free doorstep pickup within 24-48 hours)
- Refund timelines (3-5 business days after verification)
- Return eligibility (items must be unused, in original condition)

Be friendly, concise, and helpful. Keep responses under 100 words.
If asked about specific orders, ask for their tracking code (format: RET-YYYY-XXXXX).`;

let conversationHistory = [];

// Toggle chatbot
chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
    if (chatbotWindow.classList.contains('active')) {
        chatInput.focus();
    }
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
});

// Suggestion chips
suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const message = chip.dataset.message;
        chatInput.value = message;
        handleSendMessage(message);
    });
});

// Send message
chatbotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (message) {
        handleSendMessage(message);
    }
});

async function handleSendMessage(message) {
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    chatInput.disabled = true;
    document.getElementById('chatSend').disabled = true;

    // Hide suggestions after first message
    document.querySelector('.chatbot-suggestions').style.display = 'none';

    // Show typing indicator
    showTypingIndicator();

    try {
        const response = await sendToGemini(message);
        removeTypingIndicator();
        addMessage(response, 'bot');
    } catch (error) {
        removeTypingIndicator();
        addMessage('Sorry, I\'m having trouble connecting. Please try again or contact support at ahmadwrites04@gmail.com', 'bot');
        console.error('Gemini API Error:', error);
    }

    chatInput.disabled = false;
    document.getElementById('chatSend').disabled = false;
    chatInput.focus();
}

async function sendToGemini(userMessage) {
    conversationHistory.push({ role: 'user', parts: [{ text: userMessage }] });

    // Check if API key is set
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
        // Fallback responses for demo mode
        return getDemoResponse(userMessage);
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                { role: 'user', parts: [{ text: SYSTEM_CONTEXT }] },
                { role: 'model', parts: [{ text: 'I understand. I\'m ReturnPolicy AI and I\'ll help customers with returns.' }] },
                ...conversationHistory
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 256,
            }
        })
    });

    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    const botResponse = data.candidates[0].content.parts[0].text;
    conversationHistory.push({ role: 'model', parts: [{ text: botResponse }] });

    return botResponse;
}

function getDemoResponse(message) {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('start') && lowerMsg.includes('return')) {
        return 'Starting a return is easy! Just scroll down to our "Submit Your Return" section and fill out the 3-step form. You\'ll need your Order ID, product details, and preferred pickup date. 📦';
    } else if (lowerMsg.includes('refund') || lowerMsg.includes('money')) {
        return 'Refunds are processed within 3-5 business days after our warehouse verifies your return. The amount will be credited to your original payment method. 💳';
    } else if (lowerMsg.includes('track')) {
        return 'To track your return, you\'ll need your tracking code (format: RET-YYYY-XXXXX). You received this code when you submitted your return. What\'s your tracking code? 🔍';
    } else if (lowerMsg.includes('pickup')) {
        return 'We offer FREE doorstep pickup! After submitting your return, our courier will arrive within 24-48 hours at your scheduled time slot. Just keep the item packed and ready! 🚚';
    } else if (lowerMsg.includes('policy') || lowerMsg.includes('eligible')) {
        return 'Our return policy: Items can be returned within 7 days of delivery. Products must be unused, in original packaging with all tags attached. Some items like perishables or intimate wear are non-returnable. 📋';
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
        return 'Hello! 👋 Welcome to ReturnPolicy support. I can help you with starting returns, tracking orders, refund timelines, and our return policies. What would you like to know?';
    } else {
        return 'I\'d be happy to help! I can assist with: starting a return, tracking your order, understanding refund timelines, or explaining our return policies. What would you like to know? 🤔';
    }
}

function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-${type === 'bot' ? 'robot' : 'user'}"></i></div>
        <div class="message-content"><p>${text}</p></div>
    `;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing';
    typingDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-content typing-indicator"><span></span><span></span><span></span></div>
    `;
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingMsg = chatbotMessages.querySelector('.typing');
    if (typingMsg) typingMsg.remove();
}
