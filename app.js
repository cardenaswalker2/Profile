/* GRINGOFFX - Core Application Logic (Premium Cyberpunk Command Center) */

// Global Application State
const state = {
  isLoaded: false,
  isLoggedIn: false,
  selectedDevice: 'iPhone 17 Pro Max', // default selected device
  optimizations: {}
};

const iphoneModels = [
  'iPhone 7 Plus', 'iPhone 8 Plus', 'iPhone X', 'iPhone 11',
  'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15',
  'iPhone 16', 'iPhone 16 Pro', 'iPhone 17 Pro', 'iPhone 17 Pro Max'
];

// Simulated Command logs for active console terminal logger
const commandLogs = [
  "INICIANDO ENLACE TÁCTIL SEGURO...",
  "CONECTANDO KERNEL CON DISPOSITIVO...",
  "RESPUESTA DE BUFFER RECIBIDA: OK (0ms)",
  "CARGANDO PARAMETROS DE ACCESIBILIDAD...",
  "ESTABLECIENDO DPI VIRTUAL A 950...",
  "AJUSTANDO SENSIBILIDAD GENERAL A 98%...",
  "CALIBRANDO TASA DE MUESTREO TÁCTIL: 240Hz",
  "APLICANDO FILTRO ANTIALIASING EN PANTALLA...",
  "ESTABILIZANDO FRAME BUFFER A 120 FPS...",
  "SUPRIMIENDO LATENCIA DE ENTRADA: -4.2ms",
  "MODO ULTRA DESLIZAMIENTO: CONFIGURADO",
  "MEMORIA CACHÉ DE RESPUESTA DIRECTA: OPTIMIZADA",
  "COMPILANDO PERFIL COMPETITIVO FREE FIRE...",
  "INYECCIÓN DE SENSIBILIDAD COMPLETADA.",
  "PROCESO DE MONITOREO TÁCTIL ONLINE.",
  "DPI ACTIVO: CALIBRADO Y AJUSTADO.",
  "TOLERANCIA DE TOQUE DE PANTALLA: MÍNIMA",
  "MONITORIZANDO PARÁMETROS EN VIVO..."
];

// 1. Cursor Custom styling
function initCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');
  
  if (!cursor || !cursorDot) return;

  window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });

  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.85)';
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1.4)';
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  const hoverElements = 'button, input, select, textarea, [role="button"], .tilt-card, a, .sens-row, .opt-check-row';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverElements)) {
      cursor.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverElements)) {
      cursor.classList.remove('cursor-hover');
    }
  });
}

// 2. Background Canvas laser particles
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let particles = [];
  const particleCount = 45;

  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.8;
      this.speedX = Math.random() * 0.3 - 0.15;
      this.speedY = Math.random() * 0.3 - 0.15;
      
      const colors = ['rgba(139, 92, 246, 0.3)', 'rgba(6, 182, 212, 0.3)', 'rgba(16, 185, 129, 0.15)'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      else if (this.x < 0) this.x = canvas.width;

      if (this.y > canvas.height) this.y = 0;
      else if (this.y < 0) this.y = canvas.height;

      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          this.x += (dx / distance) * force * 2;
          this.y += (dy / distance) * force * 2;
        }
      }
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connect() {
    let maxDist = 120;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          let opacity = (1 - (dist / maxDist)) * 0.1;
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
    animationId = requestAnimationFrame(animate);
  }

  init();
  animate();
}

// 3. Cinematic Preloader Screen
function initLoader() {
  const splash = document.getElementById('splash-screen');
  const percentText = document.getElementById('loader-percentage');
  const loaderBar = document.getElementById('loader-fill');
  const startBtnContainer = document.getElementById('start-btn-container');

  if (!splash) return;

  let percent = 0;
  
  function updateProgress() {
    if (percent >= 100) {
      percentText.innerText = 'SISTEMA INICIALIZADO';
      percentText.classList.add('text-glow-purple', 'text-purple-400');
      loaderBar.style.width = '100%';
      
      startBtnContainer.innerHTML = `
        <button id="btn-initialize-system" class="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-gamer tracking-widest text-xs hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 active:scale-95 glow-purple focus:outline-none flex items-center justify-center space-x-2">
          <i class="lucide-power text-sm text-glow-purple animate-pulse"></i>
          <span>INICIAR SISTEMA</span>
        </button>
      `;
      
      const initBtn = document.getElementById('btn-initialize-system');
      if (initBtn) {
        initBtn.addEventListener('click', () => {
          if (window.cyberSynth) {
            window.cyberSynth.init();
            window.cyberSynth.playSuccess();
            window.cyberSynth.startDrone();
          }
          
          splash.classList.add('transition-all', 'duration-1000', 'opacity-0', 'scale-105', 'pointer-events-none');
          setTimeout(() => {
            splash.style.display = 'none';
            showLandingPage();
          }, 1000);
        });
      }
      return;
    }

    percent += Math.floor(Math.random() * 6) + 1;
    if (percent > 100) percent = 100;
    
    percentText.innerText = `${percent}% COMPILANDO NÚCLEO...`;
    loaderBar.style.width = `${percent}%`;

    setTimeout(updateProgress, Math.random() * 80 + 10);
  }

  setTimeout(updateProgress, 300);
}

// 4. Iniciar Landing Control Console (Left split screen)
function showLandingPage() {
  const appCenter = document.getElementById('app-command-center');
  if (!appCenter) return;

  appCenter.classList.remove('hidden');
  appCenter.classList.add('opacity-0', 'transition-all', 'duration-700');
  setTimeout(() => {
    appCenter.classList.remove('opacity-0');
    appCenter.classList.add('opacity-100');
    
    // Animate stats numbers
    animateLandingStats();
  }, 100);

  // Form password eye toggle
  const passToggle = document.getElementById('toggle-password-visibility');
  const passInput = document.getElementById('login-password');
  const eyeIcon = document.getElementById('password-eye-icon');

  if (passToggle && passInput && eyeIcon) {
    passToggle.addEventListener('click', () => {
      if (window.cyberSynth) window.cyberSynth.playToggle();
      if (passInput.type === 'password') {
        passInput.type = 'text';
        eyeIcon.className = 'lucide-eye-off text-sm';
      } else {
        passInput.type = 'password';
        eyeIcon.className = 'lucide-eye text-sm';
      }
    });
  }

  // Bind Form Login Validation
  const form = document.getElementById('login-form');
  const userInput = document.getElementById('login-username');
  const errorMsg = document.getElementById('login-error-message');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const userVal = userInput.value.trim();
      const passVal = passInput.value;

      if (userVal === 'gringoffx' && passVal === 'gringiyo2003') {
        // Access Granted
        errorMsg.innerHTML = '<span class="text-green-400 font-gamer text-xs tracking-wider animate-pulse">✓ ACCESO CONCEDIDO - CONECTANDO</span>';
        userInput.style.borderColor = 'var(--color-green)';
        passInput.style.borderColor = 'var(--color-green)';
        
        if (window.cyberSynth) window.cyberSynth.playSuccess();
        
        setTimeout(() => {
          loginSystem();
        }, 800);
        
      } else {
        // Access Denied
        if (window.cyberSynth) window.cyberSynth.playError();
        const card = document.getElementById('login-card');
        card.classList.add('shake');
        
        userInput.style.borderColor = 'var(--color-red)';
        passInput.style.borderColor = 'var(--color-red)';
        errorMsg.innerHTML = '<span class="text-glow-red text-red-500 font-gamer text-[9px] tracking-wider">✕ CREDENCIALES INCORRECTAS</span>';
        
        setTimeout(() => {
          card.classList.remove('shake');
        }, 500);
      }
    });
  }

  // Left Options Click Behaviors
  const optionBtns = document.querySelectorAll('.landing-option-btn');
  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-target-tab');
      
      if (state.isLoggedIn) {
        scrollToSection(targetTab);
      } else {
        // Trigger Pre-Login alarm
        triggerLockAlarm();
      }
    });
  });

  // Sound toggler
  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (window.cyberSynth) {
        const isMuted = window.cyberSynth.toggleMute();
        soundToggle.innerHTML = isMuted 
          ? '<i class="lucide-volume-x text-red-500 text-sm"></i>' 
          : '<i class="lucide-volume-2 text-cyan-400 text-sm"></i>';
      }
    });
  }

  // Lock overlay simulation click and direct background warning click triggers
  const lockOverlay = document.getElementById('dashboard-lock-overlay');
  if (lockOverlay) {
    lockOverlay.addEventListener('click', (e) => {
      if (!state.isLoggedIn) {
        triggerLockAlarm();
      }
    });
  }

  // Bind Navbar tab buttons for scroll triggers
  const tabLinks = document.querySelectorAll('[data-dash-tab]');
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
      const tab = link.getAttribute('data-dash-tab');
      
      if (!state.isLoggedIn) {
        triggerLockAlarm();
      } else {
        if (tab === 'inicio') {
          // Scroll back to top
          const scrollBody = document.getElementById('dashboard-scroll-body');
          if (scrollBody) {
            scrollBody.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          scrollToSection(tab);
        }
      }
    });
  });

  // Setup Logout click actions
  const logoutBtnTop = document.getElementById('logout-btn');
  if (logoutBtnTop) {
    logoutBtnTop.addEventListener('click', () => {
      if (state.isLoggedIn) {
        logoutSystem();
      }
    });
  }

  const logoutBtnLeft = document.getElementById('logout-btn-left');
  if (logoutBtnLeft) {
    logoutBtnLeft.addEventListener('click', () => {
      if (state.isLoggedIn) {
        logoutSystem();
      }
    });
  }
}

// 5. Pre-login red pulsing locked feedback alarm trigger
function triggerLockAlarm() {
  if (window.cyberSynth) window.cyberSynth.playError();
  
  const overlay = document.getElementById('dashboard-lock-overlay');
  const shield = document.getElementById('lock-shield-circle');
  const title = document.getElementById('lock-overlay-title');
  const msg = document.getElementById('lock-overlay-msg');
  
  if (overlay) {
    overlay.classList.add('alarm-flash-active');
    setTimeout(() => overlay.classList.remove('alarm-flash-active'), 1200);
  }
  
  if (shield) {
    shield.classList.add('shake-alarm-active');
    shield.style.borderColor = 'var(--color-red)';
    shield.style.color = 'var(--color-red)';
    shield.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.8)';
    
    setTimeout(() => {
      shield.classList.remove('shake-alarm-active');
      if (!state.isLoggedIn) {
        shield.style.borderColor = '';
        shield.style.color = '';
        shield.style.boxShadow = '';
      }
    }, 1200);
  }
  
  if (title) {
    title.classList.add('text-red-500', 'text-glow-red');
    title.classList.remove('text-slate-100');
    setTimeout(() => {
      if (!state.isLoggedIn) {
        title.classList.remove('text-red-500', 'text-glow-red');
        title.classList.add('text-slate-100');
      }
    }, 1200);
  }
}

// 6. Login Transition and Console Activation
function loginSystem() {
  state.isLoggedIn = true;
  document.body.classList.add('logged-in');

  // Fade out login card, show green logger card
  const loginCard = document.getElementById('login-card-container');
  const activeConsole = document.getElementById('active-console-container');
  
  if (loginCard) loginCard.style.display = 'none';
  if (activeConsole) {
    activeConsole.style.display = 'block';
    activeConsole.classList.add('animate-fade-in');
  }

  // Start simulated logger stream
  startTerminalStreaming();

  // Render all three modules stacked in scrolling body simultaneously!
  renderAllDashboardSections();

  // Dissolve Lock Overlay holographically
  const overlay = document.getElementById('dashboard-lock-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 700);
  }

  // Play audio drone synthesized link
  if (window.cyberSynth) {
    window.cyberSynth.playSuccess();
    window.cyberSynth.startDrone();
  }

  // Initialize Scroll tracking with Intersection Observer
  initScrollIntersectionObserver();
}

// 7. Logout Actions and System Lockdown
function logoutSystem() {
  state.isLoggedIn = false;
  document.body.classList.remove('logged-in');

  // Stop terminal intervals
  stopTerminalStreaming();

  // Show login card, hide green logger card
  const loginCard = document.getElementById('login-card-container');
  const activeConsole = document.getElementById('active-console-container');
  
  if (loginCard) loginCard.style.display = 'block';
  if (activeConsole) activeConsole.style.display = 'none';

  // Clear inputs and error feedback
  const form = document.getElementById('login-form');
  if (form) form.reset();
  const errorMsg = document.getElementById('login-error-message');
  if (errorMsg) errorMsg.innerHTML = '';
  
  const userInput = document.getElementById('login-username');
  const passInput = document.getElementById('login-password');
  if (userInput) userInput.style.borderColor = '';
  if (passInput) passInput.style.borderColor = '';

  // Restore lock overlay
  const overlay = document.getElementById('dashboard-lock-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
    }, 50);
  }

  // Stop background synth ambient drone
  if (window.cyberSynth) {
    window.cyberSynth.playError();
    window.cyberSynth.stopDrone();
  }

  // Clear rendered dashboard panels to conserve system memory
  document.getElementById('configuraciones-row').innerHTML = '';
  document.getElementById('sensibilidades-row').innerHTML = '';
  document.getElementById('optimizar-row').innerHTML = '';
}

// 8. Simulated Tactical Logger Streams
let terminalInterval = null;
function startTerminalStreaming() {
  const terminal = document.getElementById('terminal-log');
  if (!terminal) return;
  
  terminal.innerHTML = '';
  appendTerminalLog("CONECTANDO MANDO DE SINTONIZACIÓN INTERNO...");
  appendTerminalLog("ENLACE ESTABLECIDO CON KERNEL IOS CON ÉXITO.");
  
  terminalInterval = setInterval(() => {
    const log = commandLogs[Math.floor(Math.random() * commandLogs.length)];
    appendTerminalLog(log);
  }, 1600);
}

function stopTerminalStreaming() {
  if (terminalInterval) {
    clearInterval(terminalInterval);
    terminalInterval = null;
  }
}

function appendTerminalLog(message) {
  const terminal = document.getElementById('terminal-log');
  if (!terminal) return;
  
  const time = new Date();
  const h = String(time.getHours()).padStart(2, '0');
  const m = String(time.getMinutes()).padStart(2, '0');
  const s = String(time.getSeconds()).padStart(2, '0');
  const stamp = `[${h}:${m}:${s}]`;
  
  const line = document.createElement('p');
  line.className = 'leading-tight animate-fade-in font-mono text-[8px] text-green-550/90';
  line.innerHTML = `> <span class="text-green-600/70">${stamp}</span> ${message}`;
  
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

// 9. Dashboard Panels Redraw Stack
function renderAllDashboardSections() {
  const configRow = document.getElementById('configuraciones-row');
  const sensiRow = document.getElementById('sensibilidades-row');
  const optRow = document.getElementById('optimizar-row');
  
  if (configRow) renderConfigurationsLayout(configRow);
  if (sensiRow) renderSensitivitiesLayout(sensiRow);
  if (optRow) renderOptimizeLayout(optRow);
}

// Global iPhone selectors sync
function selectDeviceGlobally(dev) {
  state.selectedDevice = dev;
  
  // Find all cards
  const cards = document.querySelectorAll(`[data-device-select]`);
  cards.forEach(card => {
    const cardDev = card.getAttribute('data-device-select');
    const isSelected = cardDev === dev;
    
    if (isSelected) {
      card.className = "device-item-card bg-[#030307] border border-purple-600/60 shadow-[0_0_8px_rgba(139,92,246,0.3)] bg-purple-950/5 rounded-lg p-1.5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/40 hover:bg-slate-900/10 transition-all duration-200";
      const svg = card.querySelector('svg');
      if (svg) svg.className.baseVal = "w-4 h-7 text-purple-400";
    } else {
      card.className = "device-item-card bg-[#030307] border border-slate-900 rounded-lg p-1.5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/40 hover:bg-slate-900/10 transition-all duration-200";
      const svg = card.querySelector('svg');
      if (svg) svg.className.baseVal = "w-4 h-7 text-slate-600";
    }
  });

  // Update active phone text labels across columns
  const activeLabels = document.querySelectorAll('.active-device-label');
  activeLabels.forEach(label => {
    label.innerText = dev;
  });

  if (window.cyberSynth) window.cyberSynth.playScan();
}

// Smooth scrolling helper to ID rows
function scrollToSection(tabName) {
  const row = document.getElementById(`${tabName}-row`);
  if (row) {
    if (window.cyberSynth) window.cyberSynth.playClick();
    row.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// =========================================================
// 🔧 HTML TEMPLATE HELPERS
// =========================================================

// Generates the iPhone model grid cards HTML for the middle column
function getDeviceGridItemsHTML(activeDevice) {
  return iphoneModels.map(model => {
    const isSelected = model === activeDevice;
    return `
      <div
        class="device-item-card ${isSelected
          ? 'bg-purple-950/10 border border-purple-600/60 shadow-[0_0_8px_rgba(139,92,246,0.25)]'
          : 'bg-[#030307] border border-slate-900 hover:border-purple-500/40 hover:bg-slate-900/10'
        } rounded-lg p-1.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200"
        data-device-select="${model}">
        <div class="w-5 h-8 flex items-center justify-center mb-1">
          <svg class="w-4 h-7 ${isSelected ? 'text-purple-400' : 'text-slate-600'}" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="34" rx="3.5" stroke="currentColor" stroke-width="1.8"/>
            <circle cx="12" cy="33" r="1" fill="currentColor"/>
            <path d="M10 4.5H14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="text-[8px] font-hud font-bold tracking-wider ${isSelected ? 'text-purple-300' : 'text-slate-400'} leading-tight line-clamp-2 text-center">${model}</span>
      </div>
    `;
  }).join('');
}

// Generates the sensitivity presets list rows
function getSensiListHTML() {
  const sensiPresets = [
    { n: 1, name: 'SENSIBILIDAD INSANA',     sub: 'DPI máximo — Velocidad ultra agresiva.' },
    { n: 2, name: 'SENSIBILIDAD LETAL',      sub: 'Alto DPI — Para jugadores de alta agresividad.' },
    { n: 3, name: 'SENSIBILIDAD HACKER',     sub: 'Curva de tiro calibrada de elite.' },
    { n: 4, name: 'SENSIBILIDAD BRASILEÑA',  sub: 'Estilo de movimiento latinoamericano.' },
    { n: 5, name: 'SENSIBILIDAD PRECISA',    sub: 'Balanceada para snipers y francotiradores.' },
    { n: 6, name: 'SENSIBILIDAD COMPLETA',   sub: 'Configuración de torneo profesional.' },
    { n: 7, name: 'SENSIBILIDAD NIVEL DIOS', sub: 'Perfil exclusivo de pro players.' },
    { n: 8, name: 'SENSIBILIDAD PRO PLAYER', sub: 'Optimizada para eSports competitivos.' },
    { n: 9, name: 'SENSIBILIDAD TODO ROJO',  sub: 'Perfil de máxima agresividad y caos.' },
    { n: 10, name: 'SENSIBILIDAD PERFECTA',  sub: 'La configuración más demandada de GringoTV.' }
  ];

  return sensiPresets.map(s => `
    <div class="sens-row flex items-center justify-between bg-[#030307] border border-slate-950 px-2.5 py-1.5 rounded-lg text-[9px] font-hud hover:border-cyan-500/30 hover:bg-cyan-950/5 transition-colors cursor-pointer group" data-sensi-name="${s.name}">
      <span class="text-slate-600 font-bold mr-2 w-4 text-center shrink-0">${s.n}</span>
      <div class="flex-1 min-w-0">
        <span class="text-slate-200 font-bold block uppercase tracking-wide truncate">${s.name}</span>
        <span class="text-[8px] text-slate-600 group-hover:text-slate-500 transition-colors">${s.sub}</span>
      </div>
      <i class="lucide-chevron-right text-slate-700 group-hover:text-cyan-400 transition-colors text-[10px] ml-1 shrink-0"></i>
    </div>
  `).join('');
}

// Generates the optimization step checklist HTML rows
function getChecklistHTML(checklist) {
  const steps = [
    { title: 'ACTUALIZA TU IOS',                    desc: 'Mantén tu iPhone con la última versión del sistema.' },
    { title: 'LIBERA ESPACIO EN DISCO',             desc: 'Necesitas al menos 10 GB libres para óptimo rendimiento.' },
    { title: 'DESACTIVA APPS EN 2DO PLANO',         desc: 'Cierra todas las apps que no estés usando activamente.' },
    { title: 'ACTIVA MODO BAJO CONSUMO',            desc: 'Reduce procesos en segundo plano y libera RAM del kernel.' },
    { title: 'REDUCE EFECTOS DE MOVIMIENTO',        desc: 'Ajustes › Accesibilidad › Movimiento › Reducir movimiento.' },
    { title: 'REINICIA TU IPHONE',                  desc: 'Reinicia el dispositivo para que todos los cambios apliquen.' }
  ];

  return steps.map((step, i) => {
    const checked = checklist[i] !== false;
    return `
      <div class="opt-check-row flex items-start space-x-2.5 bg-[#030307] border border-slate-950 p-2 rounded-xl hover:border-green-500/20 transition-colors cursor-pointer" data-check-idx="${i}">
        <span class="w-4 h-4 mt-0.5 rounded-full border border-green-500/40 flex items-center justify-center text-green-400 shrink-0 ${checked ? 'bg-green-500/10' : ''}">
          <i class="lucide-check text-[8px] ${checked ? 'block' : 'hidden'}"></i>
        </span>
        <div class="flex-1 min-w-0 space-y-0.5">
          <span class="text-slate-200 font-bold block uppercase tracking-wide text-[9px] truncate">${step.title}</span>
          <span class="text-[8px] text-slate-500 font-sans block">${step.desc}</span>
        </div>
      </div>
    `;
  }).join('');
}

// 10. CONFIGURACIONES PANEL
function renderConfigurationsLayout(targetEl) {
  const dev = state.selectedDevice;
  
  // Backside realistic SVG of the triple lens iPhone 17 Pro Max with G logo
  const iphoneSvgMockup = `
    <div class="flex justify-center items-center py-2 bg-[#030307] rounded-xl border border-slate-950">
      <svg class="w-20 h-36 filter drop-shadow-[0_0_12px_rgba(139,92,246,0.25)] animate-pulse" viewBox="0 0 160 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="150" height="290" rx="36" fill="#06060a" stroke="#1c1c28" stroke-width="3" />
        <rect x="7.5" y="7.5" width="145" height="285" rx="33.5" stroke="rgba(139, 92, 246, 0.3)" stroke-width="1.5" />
        <rect x="18" y="24" width="56" height="56" rx="16" fill="#040406" stroke="rgba(168, 85, 247, 0.25)" stroke-width="1.2" />
        <circle cx="34" cy="40" r="9" fill="#101016" stroke="#252535" stroke-width="1" />
        <circle cx="34" cy="40" r="4.5" fill="#000000" />
        <circle cx="35.5" cy="38.5" r="2" fill="rgba(6, 182, 212, 0.7)" />
        <circle cx="34" cy="64" r="9" fill="#101016" stroke="#252535" stroke-width="1" />
        <circle cx="34" cy="64" r="4.5" fill="#000000" />
        <circle cx="35.5" cy="62.5" r="2" fill="rgba(139, 92, 246, 0.7)" />
        <circle cx="58" cy="52" r="9" fill="#101016" stroke="#252535" stroke-width="1" />
        <circle cx="58" cy="52" r="4.5" fill="#000000" />
        <circle cx="59.5" cy="50.5" r="2" fill="rgba(6, 182, 212, 0.7)" />
        <circle cx="58" cy="70" r="3" fill="#1b1b22" />
        <circle cx="58" cy="34" r="4" fill="#d1d5db" />
        <circle cx="58" cy="34" r="2" fill="#fde047" />
        <g class="animate-pulse" style="animation-duration: 3s;">
          <path d="M80 135 C68 135, 60 143, 60 155 C60 167, 68 175, 80 175 C88 175, 95 170, 97 163 L82 163 L82 153 L100 153 L100 158 C100 173, 90 185, 80 185 C62 185, 48 171, 48 155 C48 139, 62 125, 80 125 C92 125, 101 133, 104 142 L92 146 C90 140, 86 135, 80 135 Z" fill="#8b5cf6" stroke="rgba(6, 182, 212, 0.5)" stroke-width="1.2" />
        </g>
        <line x1="8" y1="20" x2="152" y2="20" stroke="rgba(6, 182, 212, 0.2)" stroke-width="1.2" class="animate-bounce" style="animation-duration: 4s;" />
      </svg>
    </div>
  `;

  targetEl.innerHTML = `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-5 w-full items-stretch animate-fade-in">
      <!-- Col 1: Title Card -->
      <div class="xl:col-span-3 bg-[#08080f] border border-purple-500/15 rounded-2xl p-5 flex flex-col justify-center items-center text-center space-y-4 relative overflow-hidden glass min-h-[220px]">
        <div class="scanner-line"></div>
        <div class="w-14 h-14 rounded-full bg-purple-950/20 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
          <i class="lucide-sliders text-2xl animate-pulse"></i>
        </div>
        <div>
          <h2 class="font-gamer font-bold text-sm tracking-widest text-purple-400 text-glow-purple">CONFIGURACIONES</h2>
          <p class="text-slate-500 text-[9px] uppercase font-hud tracking-wider mt-1">Sintonizador General de Sistema</p>
        </div>
        <div class="text-[8px] font-mono text-purple-400/60 uppercase tracking-widest">SENSITIVITY HUB</div>
      </div>

      <!-- Col 2: Middle Device Selector Grid -->
      <div class="xl:col-span-5 bg-[#08080f] border border-slate-900 rounded-2xl p-4 flex flex-col space-y-3 glass">
        <div class="border-b border-slate-900 pb-2">
          <h3 class="font-gamer font-bold text-[10px] tracking-wider text-slate-400 uppercase">1. SELECCIONA TU IPHONE</h3>
        </div>
        <div class="grid grid-cols-3 gap-2 overflow-y-auto max-h-[200px] xl:max-h-[300px] pr-1 scrollbar-thin">
          ${getDeviceGridItemsHTML(dev)}
        </div>
      </div>

      <!-- Col 3: Details & Realistic SVG -->
      <div class="xl:col-span-4 bg-[#08080f] border border-slate-900 rounded-2xl p-4 flex flex-col justify-between space-y-3 glass">
        <div class="space-y-3">
          <div class="flex justify-between items-start border-b border-slate-900 pb-2">
            <div>
              <h3 class="font-gamer font-bold text-[9px] tracking-wider text-purple-400 uppercase">2. AJUSTES TÁCTICOS</h3>
              <span class="active-device-label text-[11px] font-hud font-bold text-white tracking-wider uppercase mt-0.5 block">${dev}</span>
            </div>
            <i class="lucide-sliders text-purple-400 text-sm"></i>
          </div>

          <div class="grid grid-cols-2 gap-2 bg-[#030307] border border-slate-950 p-2.5 rounded-xl text-[10px] font-hud">
            <div class="flex justify-between border-b border-slate-900/40 pb-0.5">
              <span class="text-slate-500">GRÁFICOS</span>
              <span class="text-slate-200 font-bold">SUAVE</span>
            </div>
            <div class="flex justify-between border-b border-slate-900/40 pb-0.5">
              <span class="text-slate-500">FPS</span>
              <span class="text-purple-400 font-bold">MAX INY</span>
            </div>
            <div class="flex justify-between border-b border-slate-900/40 pb-0.5">
              <span class="text-slate-500">SOMBRAS</span>
              <span class="text-slate-200 font-bold">DESACT.</span>
            </div>
            <div class="flex justify-between border-b border-slate-900/40 pb-0.5">
              <span class="text-slate-500">ALTA RES.</span>
              <span class="text-slate-200 font-bold">APAGADO</span>
            </div>
            <div class="flex justify-between border-b border-slate-900/40 pb-0.5 col-span-2">
              <span class="text-slate-500">CURVA DE TOQUE</span>
              <span class="text-cyan-400 font-bold">VÍVIDO COMPETITIVO</span>
            </div>
          </div>

          ${iphoneSvgMockup}
        </div>

        <div class="border-t border-slate-900 pt-2 flex items-center justify-between">
          <div class="space-y-0.5">
            <span class="text-[8px] font-gamer text-slate-500 uppercase tracking-widest block">TAMAÑO DE BOTÓN RECOMENDADO</span>
            <span class="text-xs font-gamer font-bold text-white tracking-widest text-glow-purple">48% - 52%</span>
          </div>
          <div class="w-8 h-8 rounded-full bg-purple-950/20 border border-purple-500/30 flex items-center justify-center text-purple-400 animate-pulse cursor-pointer hover:scale-105 transition-transform" onclick="window.triggerDeviceCalibrate()">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="1" x2="12" y2="23" />
              <line x1="1" y1="12" x2="23" y2="12" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 11. SENSIBILIDADES PANEL
function renderSensitivitiesLayout(targetEl) {
  const dev = state.selectedDevice;
  targetEl.innerHTML = `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-5 w-full items-stretch animate-fade-in">
      <!-- Col 1: Title Card -->
      <div class="xl:col-span-3 bg-[#08080f] border border-cyan-500/15 rounded-2xl p-5 flex flex-col justify-center items-center text-center space-y-4 relative overflow-hidden glass min-h-[220px]">
        <div class="scanner-line" style="background: linear-gradient(90deg, transparent, var(--color-cyan), transparent)"></div>
        <div class="w-14 h-14 rounded-full bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <i class="lucide-target text-2xl animate-pulse"></i>
        </div>
        <div>
          <h2 class="font-gamer font-bold text-sm tracking-widest text-cyan-400 text-glow-cyan">SENSIBILIDADES</h2>
          <p class="text-slate-500 text-[9px] uppercase font-hud tracking-wider mt-1">AJUSTES DE RETROCESO DE ARMAS</p>
        </div>
        <div class="text-[8px] font-mono text-cyan-400/60 uppercase tracking-widest">AIM STABILIZER</div>
      </div>

      <!-- Col 2: Selector Grid -->
      <div class="xl:col-span-5 bg-[#08080f] border border-slate-900 rounded-2xl p-4 flex flex-col space-y-3 glass">
        <div class="border-b border-slate-900 pb-2">
          <h3 class="font-gamer font-bold text-[10px] tracking-wider text-slate-400 uppercase">1. SELECCIONA TU IPHONE</h3>
        </div>
        <div class="grid grid-cols-3 gap-2 overflow-y-auto max-h-[200px] xl:max-h-[300px] pr-1 scrollbar-thin">
          ${getDeviceGridItemsHTML(dev)}
        </div>
      </div>

      <!-- Col 3: Recommendations Display -->
      <div class="xl:col-span-4 bg-[#08080f] border border-slate-900 rounded-2xl p-4 flex flex-col justify-between space-y-3 glass">
        <div class="space-y-3 flex-1 flex flex-col overflow-hidden">
          <div class="flex justify-between items-start border-b border-slate-900 pb-2">
            <div>
              <h3 class="font-gamer font-bold text-[9px] tracking-wider text-cyan-400 uppercase">2. SENSIBILIDADES COMPILADAS</h3>
              <span class="active-device-label text-[11px] font-hud font-bold text-white tracking-wider uppercase mt-0.5 block">${dev}</span>
            </div>
            <i class="lucide-target text-cyan-400 text-sm"></i>
          </div>

          <div class="flex-1 overflow-y-auto space-y-1.5 max-h-[180px] xl:max-h-[240px] pr-1 scrollbar-thin">
            ${getSensiListHTML()}
          </div>
        </div>

        <div class="border-t border-slate-900 pt-2 flex items-center justify-between">
          <div class="space-y-0.5">
            <span class="text-[8px] font-gamer text-slate-500 uppercase tracking-widest block">TAMAÑO DE BOTÓN RECOMENDADO</span>
            <span class="text-xs font-gamer font-bold text-white tracking-widest text-glow-cyan">48% - 52%</span>
          </div>
          <div class="w-8 h-8 rounded-full bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 animate-pulse cursor-pointer hover:scale-105 transition-transform" onclick="window.triggerDeviceCalibrate()">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="1" x2="12" y2="23" />
              <line x1="1" y1="12" x2="23" y2="12" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 12. OPTIMIZAR PANEL
function renderOptimizeLayout(targetEl) {
  const dev = state.selectedDevice;
  const checklist = state.optimizations[dev] || [true, true, true, true, true, true];

  targetEl.innerHTML = `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-5 w-full items-stretch animate-fade-in">
      <!-- Col 1: Title Card -->
      <div class="xl:col-span-3 bg-[#08080f] border border-green-500/15 rounded-2xl p-5 flex flex-col justify-center items-center text-center space-y-4 relative overflow-hidden glass min-h-[220px]">
        <div class="scanner-line" style="background: linear-gradient(90deg, transparent, var(--color-green), transparent); animation-duration: 3s"></div>
        <div class="w-14 h-14 rounded-full bg-green-950/20 border border-green-500/20 flex items-center justify-center text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          <i class="lucide-zap text-2xl animate-pulse"></i>
        </div>
        <div>
          <h2 class="font-gamer font-bold text-sm tracking-widest text-green-400 text-glow-green">OPTIMIZAR</h2>
          <p class="text-slate-500 text-[9px] uppercase font-hud tracking-wider mt-1">MOTOR DE ACELERACIÓN DE HARDWARE</p>
        </div>
        <div class="text-[8px] font-mono text-green-400/60 uppercase tracking-widest">RAM & KERNEL BOOSTER</div>
      </div>

      <!-- Col 2: Selector Grid -->
      <div class="xl:col-span-5 bg-[#08080f] border border-slate-900 rounded-2xl p-4 flex flex-col space-y-3 glass">
        <div class="border-b border-slate-900 pb-2">
          <h3 class="font-gamer font-bold text-[10px] tracking-wider text-slate-400 uppercase">1. SELECCIONA TU IPHONE</h3>
        </div>
        <div class="grid grid-cols-3 gap-2 overflow-y-auto max-h-[200px] xl:max-h-[300px] pr-1 scrollbar-thin">
          ${getDeviceGridItemsHTML(dev)}
        </div>
      </div>

      <!-- Col 3: Recommendations Display -->
      <div class="xl:col-span-4 bg-[#08080f] border border-slate-900 rounded-2xl p-4 flex flex-col justify-between space-y-3 glass">
        <div class="space-y-3 flex-1 flex flex-col overflow-hidden">
          <div class="flex justify-between items-start border-b border-slate-900 pb-2">
            <div>
              <h3 class="font-gamer font-bold text-[9px] tracking-wider text-green-400 uppercase">2. PASOS TÁCTICOS SUIZOS</h3>
              <span class="active-device-label text-[11px] font-hud font-bold text-white tracking-wider uppercase mt-0.5 block">${dev}</span>
            </div>
            <i class="lucide-rocket text-green-400 text-sm"></i>
          </div>

          <div class="flex-1 overflow-y-auto space-y-1.5 max-h-[180px] xl:max-h-[240px] pr-1 scrollbar-thin">
            ${getChecklistHTML(checklist)}
          </div>
        </div>

        <div class="bg-green-950/10 border border-green-500/20 p-2.5 rounded-xl flex items-center justify-between text-left space-x-2 animate-fade-in shadow-[0_0_10px_var(--color-green-glow)]">
          <div class="space-y-0.5 flex-1">
            <h4 class="font-gamer font-bold text-[8px] tracking-wider uppercase text-green-400">¡DISPOSITIVO OPTIMIZADO!</h4>
            <p class="text-[8px] text-slate-400 font-sans">El núcleo de calibración táctil responde al 100%.</p>
          </div>
          <div class="w-6 h-6 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
            <i class="lucide-check text-xs animate-pulse"></i>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 13. Dynamic active hologram scan simulation
function triggerSensApplySimulation(sensName) {
  if (window.cyberSynth) window.cyberSynth.playScan();

  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center space-y-6 cyber-overlay animate-fade-in';
  
  overlay.innerHTML = `
    <div class="relative w-36 h-36 flex items-center justify-center">
      <div class="absolute inset-0 rounded-full border-4 border-dashed border-cyan-500/30 animate-spin" style="animation-duration: 10s"></div>
      <div class="absolute inset-2 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" style="animation-duration: 2s"></div>
      <div class="absolute inset-6 rounded-full border border-dashed border-slate-700 animate-reverse-spin"></div>
      <i class="lucide-target text-3xl text-cyan-400 text-glow-cyan animate-pulse"></i>
    </div>
    
    <div class="text-center space-y-2">
      <h3 class="font-gamer text-white tracking-widest text-lg">${sensName}</h3>
      <p id="sens-step" class="text-xs text-purple-400 font-hud tracking-widest uppercase animate-pulse">Sincronizando DPI y Curva...</p>
    </div>
    
    <div class="w-64 bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden relative">
      <div id="sens-progress" class="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 h-full w-[0%] transition-all duration-300"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const steps = [
    'Estableciendo canal táctil...',
    'Inyectando DPI interno...',
    'Ajustando matriz de retroceso...',
    '¡Sincronización completa!'
  ];

  let currentStep = 0;
  const progressEl = document.getElementById('sens-progress');
  const stepText = document.getElementById('sens-step');

  function updateScan() {
    if (currentStep >= steps.length) {
      if (window.cyberSynth) window.cyberSynth.playSuccess();
      
      stepText.innerText = 'SENS SINCRONIZADA ÉXITO';
      stepText.className = 'text-green-400 font-gamer text-sm animate-bounce';
      
      setTimeout(() => {
        overlay.classList.add('opacity-0', 'transition-all', 'duration-500');
        setTimeout(() => {
          overlay.remove();
          
          // Display popup alert
          const notice = document.createElement('div');
          notice.className = 'fixed bottom-5 right-5 glass bg-slate-900 border border-green-500 text-green-400 px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-in font-hud';
          notice.innerHTML = `
            <div class="flex items-center space-x-3">
              <i class="lucide-shield-check text-lg text-glow-cyan animate-bounce"></i>
              <div>
                <h4 class="font-gamer font-bold text-xs uppercase text-white">CONSOLA TÁCTIL ACTUALIZADA</h4>
                <p class="text-[11px] text-slate-400 mt-1">${sensName} aplicada con éxito en tu dispositivo.</p>
              </div>
            </div>
          `;
          document.body.appendChild(notice);
          setTimeout(() => {
            notice.classList.add('opacity-0', 'transition-all', 'duration-500');
            setTimeout(() => notice.remove(), 500);
          }, 3000);

        }, 500);
      }, 800);
      return;
    }

    stepText.innerText = steps[currentStep];
    progressEl.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    currentStep++;

    if (window.cyberSynth) window.cyberSynth.playToggle();
    setTimeout(updateScan, 650);
  }

  setTimeout(updateScan, 400);
}

// 14. Calibrate alerts
function triggerDeviceCalibrate() {
  if (window.cyberSynth) window.cyberSynth.playSuccess();
  
  const dev = state.selectedDevice;
  const notice = document.createElement('div');
  notice.className = 'fixed bottom-5 right-5 glass bg-slate-900 border border-green-500 text-green-400 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 z-50 animate-fade-in font-hud';
  notice.innerHTML = `
    <i class="lucide-shield-check text-xl animate-bounce"></i>
    <div>
      <h4 class="font-gamer font-bold text-xs tracking-wider uppercase text-white">CALIBRACIÓN AUTOMÁTICA</h4>
      <p class="text-[11px] text-slate-400 mt-1">El motor de disparo táctil en ${dev} ha sido calibrado al 50% recomendado.</p>
    </div>
  `;
  document.body.appendChild(notice);

  setTimeout(() => {
    notice.classList.add('opacity-0', 'transition-all', 'duration-500');
    setTimeout(() => notice.remove(), 500);
  }, 3500);
}
window.triggerDeviceCalibrate = triggerDeviceCalibrate;

// 15. Stats counter numbers loader animation
function animateLandingStats() {
  const usersEl = document.getElementById('landing-users-count');
  const downloadsEl = document.getElementById('landing-downloads-count');
  
  if (usersEl) animateSingleNum(usersEl, 54210, '+', 'K');
  if (downloadsEl) animateSingleNum(downloadsEl, 108450, '+', 'K');
}

function animateSingleNum(el, target, prefix, suffix) {
  let start = 0;
  const inc = target / 60;
  function run() {
    start += inc;
    if (start >= target) {
      el.innerText = `${prefix}${target.toLocaleString()}${suffix}`;
    } else {
      el.innerText = `${prefix}${Math.floor(start).toLocaleString()}${suffix}`;
      requestAnimationFrame(run);
    }
  }
  run();
}

// 16. Scroll tracking using IntersectionObserver
function initScrollIntersectionObserver() {
  const scrollBody = document.getElementById('dashboard-scroll-body');
  if (!scrollBody) return;

  const options = {
    root: scrollBody,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const tabName = id.replace('-row', '');
        
        // Update top navbar
        const navLinks = document.querySelectorAll('[data-dash-tab]');
        navLinks.forEach(link => {
          const linkTab = link.getAttribute('data-dash-tab');
          if (linkTab === tabName) {
            link.classList.add('border-purple-500', 'text-white');
            link.classList.remove('text-slate-400');
          } else {
            link.classList.remove('border-purple-500', 'text-white');
            link.classList.add('text-slate-400');
          }
        });
        
        // Update mobile header text
        const mobIndicator = document.getElementById('mobile-tab-indicator');
        if (mobIndicator) {
          mobIndicator.innerText = tabName.toUpperCase();
        }
        
        // Update mobile buttons
        const mobBtns = document.querySelectorAll('.mobile-tab-btn');
        mobBtns.forEach(btn => {
          const btnTab = btn.getAttribute('data-dash-tab');
          if (btnTab === tabName) {
            btn.classList.add('text-purple-400', 'font-bold');
            btn.classList.remove('text-slate-400');
          } else {
            btn.classList.remove('text-purple-400', 'font-bold');
            btn.classList.add('text-slate-400');
          }
        });
      }
    });
  }, options);

  // Observe all three section row boxes
  const configRow = document.getElementById('configuraciones-row');
  const sensiRow = document.getElementById('sensibilidades-row');
  const optRow = document.getElementById('optimizar-row');
  
  if (configRow) observer.observe(configRow);
  if (sensiRow) observer.observe(sensiRow);
  if (optRow) observer.observe(optRow);
}

// Event delegation for clicks inside our dynamically rendered columns
function initDynamicEventDelegation() {
  // Device grid selectors
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-device-select]');
    if (card) {
      const dev = card.getAttribute('data-device-select');
      selectDeviceGlobally(dev);
    }
  });

  // Sensibilities row items click
  document.addEventListener('click', (e) => {
    const row = e.target.closest('.sens-row');
    if (row) {
      const name = row.getAttribute('data-sensi-name');
      triggerSensApplySimulation(name);
    }
  });

  // Optimization checkmark items toggle clicks
  document.addEventListener('click', (e) => {
    const row = e.target.closest('.opt-check-row');
    if (row) {
      const idx = parseInt(row.getAttribute('data-check-idx'));
      const dev = state.selectedDevice;
      const currentList = state.optimizations[dev] || [true, true, true, true, true, true];
      
      currentList[idx] = !currentList[idx];
      state.optimizations[dev] = currentList;
      
      if (window.cyberSynth) window.cyberSynth.playToggle();
      
      // Update check box visuals
      const checkIcon = row.querySelector('.lucide-check');
      const box = row.querySelector('span');
      if (box && checkIcon) {
        if (currentList[idx]) {
          box.classList.add('bg-green-500/10');
          checkIcon.classList.remove('hidden');
          checkIcon.classList.add('block');
        } else {
          box.classList.remove('bg-green-500/10');
          checkIcon.classList.remove('block');
          checkIcon.classList.add('hidden');
        }
      }
    }
  });
}

// 17. Load Event Initialization
window.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initParticles();
  initLoader();
  initDynamicEventDelegation();
});
