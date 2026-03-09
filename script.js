// ===== PAGE LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('page-loader').classList.add('loaded');
    }, 2000);
});

// ===== CUSTOM CURSOR =====
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

// Smooth ring follow
function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

// Cursor hover effects on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .btn, .tilt-card, .project-link, .nav-link, .skill-tags span');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
    });
});

// ===== SCROLL PROGRESS BAR =====
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = progress + '%';
});

// ===== PARTICLE CANVAS BACKGROUND =====
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let canvasMouseX = 0, canvasMouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', (e) => {
    canvasMouseX = e.clientX;
    canvasMouseY = e.clientY;
});

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse attraction
        const dx = canvasMouseX - this.x;
        const dy = canvasMouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            this.x += dx * 0.005;
            this.y += dy * 0.005;
            this.opacity = Math.min(this.opacity + 0.02, 0.8);
        } else {
            this.opacity = Math.max(this.opacity - 0.005, 0.1);
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(162, 155, 254, ${this.opacity})`;
        ctx.fill();
    }
}

// Create particles
for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const opacity = (1 - dist / 120) * 0.15;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.pageYOffset + 150;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinkEls.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}
window.addEventListener('scroll', updateActiveNav);

// ===== TYPEWRITER EFFECT =====
const typewriterEl = document.getElementById('typewriter');
const phrases = [
    'AI/ML Engineering Student',
    'Machine Learning Developer',
    'Deep Learning Enthusiast',
    'Building AI Solutions',
    'Data Science Explorer'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 80;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
    } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400;
    }

    setTimeout(typeWriter, typeSpeed);
}

// Start typewriter after loader
setTimeout(typeWriter, 2200);

// ===== CODE TYPING ANIMATION =====
const codeLines = [
    '<span class="code-keyword">import</span> <span class="code-module">tensorflow</span> <span class="code-keyword">as</span> tf',
    '<span class="code-keyword">from</span> <span class="code-module">sklearn.model_selection</span> <span class="code-keyword">import</span> train_test_split',
    '',
    '<span class="code-keyword">class</span> <span class="code-class">RecommendationEngine</span>:',
    '    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(self, model_config):',
    '        self.model = self.<span class="code-func">build_model</span>(model_config)',
    '        self.optimizer = tf.keras.optimizers.<span class="code-func">Adam</span>()',
    '',
    '    <span class="code-keyword">def</span> <span class="code-func">train</span>(self, data, epochs=<span class="code-num">50</span>):',
    '        X_train, X_val = <span class="code-func">train_test_split</span>(data)',
    '        <span class="code-keyword">return</span> self.model.<span class="code-func">fit</span>(X_train,',
    '            validation_data=X_val,',
    '            epochs=epochs)',
    '',
    '<span class="code-comment"># 🚀 Building the future with AI</span>'
];

const codeBody = document.getElementById('code-body');
let codeLineIndex = 0;

function typeCodeLine() {
    if (codeLineIndex < codeLines.length) {
        const line = document.createElement('div');
        line.className = 'code-line';
        line.style.animationDelay = '0s';
        line.innerHTML = codeLines[codeLineIndex] || '&nbsp;';
        codeBody.appendChild(line);
        codeLineIndex++;
        setTimeout(typeCodeLine, 120);
    }
}

// Start code typing after loader
setTimeout(typeCodeLine, 2400);

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== ANIMATED STAT COUNTER =====
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => counterObserver.observe(num));

function animateCounter(element, target) {
    let current = 0;
    const duration = 1500;
    const step = target / (duration / 16);

    function update() {
        current += step;
        if (current >= target) {
            element.textContent = target;
            return;
        }
        element.textContent = Math.floor(current);
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ===== 3D TILT EFFECT ON CARDS =====
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    const glow = card.querySelector('.card-glow');

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

        if (glow) {
            glow.style.left = x + 'px';
            glow.style.top = y + 'px';
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => { card.style.transition = 'transform 0.15s ease-out'; }, 500);
    });
});

// ===== MAGNETIC BUTTON EFFECT =====
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });

    // Ripple effect on click
    btn.addEventListener('click', function (e) {
        const ripple = this.querySelector('.btn-ripple');
        if (!ripple) return;
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        ripple.style.animation = 'none';
        ripple.offsetHeight; // trigger reflow
        ripple.style.animation = 'ripple-effect 0.6s ease-out forwards';
    });
});

// ===== TEXT SCRAMBLE EFFECT ON HERO NAME =====
const scrambleEl = document.querySelector('.scramble-text');
const originalText = scrambleEl ? scrambleEl.getAttribute('data-text') : '';
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

if (scrambleEl) {
    scrambleEl.addEventListener('mouseenter', () => {
        let iterations = 0;
        const interval = setInterval(() => {
            scrambleEl.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) return originalText[index];
                    if (char === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= originalText.length) {
                clearInterval(interval);
            }
            iterations += 1 / 2;
        }, 30);
    });
}

// ===== PARALLAX ON HERO CODE WINDOW =====
const codeWindow = document.querySelector('.code-window');
if (codeWindow) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        codeWindow.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });

    hero.addEventListener('mouseleave', () => {
        codeWindow.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        codeWindow.style.transition = 'transform 0.6s ease';
        setTimeout(() => { codeWindow.style.transition = 'transform 0.15s ease-out'; }, 600);
    });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== GITHUB API INTEGRATION =====
const GITHUB_USERNAME = 'idleshivam';
const githubProjectsContainer = document.getElementById('github-projects');

// ============================================================
//  PROJECT CONFIG — Edit this to customize each project card
//  Keys should match your GitHub repo names exactly.
// ============================================================
const projectConfig = {
    'AI-Policy-Gap-Impact-Analyzer': {
        techStack: ['Python', 'LangChain', 'LLMs', 'RAG', 'Streamlit'],
        demo: '',
        description: 'Led a team to build an AI-powered policy analysis system that ingests government scheme PDFs and uses LLM-driven RAG pipelines to extract eligibility criteria, benefits, constraints, and target demographics. As team lead, I architected and built the entire backend — from document parsing to LLM orchestration.',
        result: '🏆 Won the LLM Workshop · Team Lead & Backend Developer · Processes 50+ page policy documents with structured output via LangChain & RAG'
    },
    'ai-production-planning-ip': {
        techStack: ['Python', 'Flask', 'PuLP', 'Integer Programming'],
        demo: 'https://ai-production-planning-ip.onrender.com',
        description: 'Solo mini project — designed and deployed a full-stack AI optimization tool that solves production planning problems using Integer Programming. Users input resource constraints and costs via a web interface, and the system computes the optimal allocation in real time.',
        result: 'Solo Mini Project · Live on Render · Automates constraint-based production optimization with PuLP solver',
        language: 'Python'
    },
};

// Language color mapping
const langColors = {
    'Python': '#3572A5',
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Jupyter Notebook': '#DA5B0B',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'C++': '#f34b7d',
    'Java': '#b07219',
    'C': '#555555',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'R': '#198CE7',
    'Shell': '#89e051',
    'default': '#8b8b9e'
};

async function fetchGitHubRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`);
        if (!response.ok) throw new Error('GitHub API error');
        const repos = await response.json();

        // Only show repos that are in projectConfig
        const filteredRepos = repos.filter(repo =>
            projectConfig.hasOwnProperty(repo.name)
        );

        renderProjects(filteredRepos);
    } catch (error) {
        console.error('Failed to fetch GitHub repos:', error);
        renderFallbackProjects();
    }
}

function renderProjects(repos) {
    githubProjectsContainer.innerHTML = '';

    if (repos.length === 0) {
        renderFallbackProjects();
        return;
    }

    repos.forEach((repo, index) => {
        const card = document.createElement('article');
        card.className = 'project-card tilt-card reveal';
        card.style.setProperty('--delay', index);

        const config = projectConfig[repo.name] || {};
        const displayLang = config.language || repo.language;
        const langColor = langColors[displayLang] || langColors['default'];
        const description = config.description || repo.description || 'No description available.';

        // Tech stack: use config if available, else fall back to API topics/language
        const techStack = config.techStack
            || (repo.topics && repo.topics.length > 0 ? repo.topics : (repo.language ? [repo.language] : []));

        const demoUrl = config.demo || repo.homepage || '';
        const result = config.result || '';

        card.innerHTML = `
            <div class="card-glow"></div>
            <div class="project-header">
                <div class="project-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div class="project-meta">
                    ${displayLang ? `
                    <span class="project-meta-item">
                        <span class="project-lang-dot" style="background: ${langColor}"></span>
                        ${displayLang}
                    </span>` : ''}
                    ${repo.stargazers_count > 0 ? `
                    <span class="project-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        ${repo.stargazers_count}
                    </span>` : ''}
                </div>
            </div>

            <h3 class="project-title">${formatRepoName(repo.name)}</h3>
            <p class="project-desc">${description}</p>

            ${result ? `
            <div class="project-result">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>${result}</span>
            </div>` : ''}

            <div class="project-actions">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    GitHub
                </a>
                ${demoUrl ? `
                <a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="project-action-btn demo-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    Live Demo
                </a>` : `
                <span class="project-action-btn demo-btn disabled" title="Demo coming soon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    Demo Soon
                </span>`}
            </div>

            <div class="project-tech">
                <span class="tech-label">Tech Stack:</span>
                ${techStack.map(t => `<span>${t}</span>`).join('')}
            </div>
        `;

        githubProjectsContainer.appendChild(card);
    });

    // Re-initialize effects on new cards
    reinitializeCardEffects();
}

function formatRepoName(name) {
    return name
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

function renderFallbackProjects() {
    githubProjectsContainer.innerHTML = `
        <article class="project-card tilt-card reveal visible" style="--delay: 0">
            <div class="card-glow"></div>
            <div class="project-header">
                <div class="project-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div class="project-meta">
                    <span class="project-meta-item">
                        <span class="project-lang-dot" style="background: #DA5B0B"></span>
                        Jupyter Notebook
                    </span>
                </div>
            </div>
            <h3 class="project-title">AI Policy Gap Impact Analyzer</h3>
            <p class="project-desc">Led a team to build an AI-powered policy analysis system that ingests government scheme PDFs and uses LLM-driven RAG pipelines to extract eligibility criteria, benefits, constraints, and target demographics. As team lead, I architected and built the entire backend — from document parsing to LLM orchestration.</p>
            <div class="project-result">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>🏆 Won the LLM Workshop · Team Lead & Backend Developer · Processes 50+ page policy documents with structured output via LangChain & RAG</span>
            </div>
            <div class="project-actions">
                <a href="https://github.com/idleshivam/AI-Policy-Gap-Impact-Analyzer" target="_blank" rel="noopener noreferrer" class="project-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    GitHub
                </a>
                <span class="project-action-btn demo-btn disabled" title="Demo coming soon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    Demo Soon
                </span>
            </div>
            <div class="project-tech">
                <span class="tech-label">Tech Stack:</span>
                <span>Python</span><span>LangChain</span><span>LLMs</span><span>RAG</span><span>Streamlit</span>
            </div>
        </article>
    `;
    reinitializeCardEffects();
}

function reinitializeCardEffects() {
    const newCards = githubProjectsContainer.querySelectorAll('.reveal');
    newCards.forEach(el => revealObserver.observe(el));

    const newTiltCards = githubProjectsContainer.querySelectorAll('.tilt-card');
    newTiltCards.forEach(card => {
        const glow = card.querySelector('.card-glow');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            if (glow) { glow.style.left = x + 'px'; glow.style.top = y + 'px'; }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.style.transition = 'transform 0.5s ease';
            setTimeout(() => { card.style.transition = 'transform 0.15s ease-out'; }, 500);
        });
        card.addEventListener('mouseenter', () => { cursorDot.classList.add('hovering'); cursorRing.classList.add('hovering'); });
        card.addEventListener('mouseleave', () => { cursorDot.classList.remove('hovering'); cursorRing.classList.remove('hovering'); });
    });

    const newLinks = githubProjectsContainer.querySelectorAll('a, .project-action-btn');
    newLinks.forEach(el => {
        el.addEventListener('mouseenter', () => { cursorDot.classList.add('hovering'); cursorRing.classList.add('hovering'); });
        el.addEventListener('mouseleave', () => { cursorDot.classList.remove('hovering'); cursorRing.classList.remove('hovering'); });
    });
}

// Fetch repos after loader
setTimeout(fetchGitHubRepos, 2500);
