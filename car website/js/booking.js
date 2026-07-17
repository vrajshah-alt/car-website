/**
 * booking.js - Car Website Booking & Response Functionality
 * Handles form validation, fare calculators, IDs, animations, PDF download
 */

(function() {
  "use strict";

  /* ============================== HELPERS ============================== */
  const el = (s, all = false) => {
    s = s.trim();
    return all ? [...document.querySelectorAll(s)] : document.querySelector(s);
  };

  const qs = (selector) => document.querySelector(selector);
  const qsa = (selector) => document.querySelectorAll(selector);

  /* ===== Generate random alphanumeric ID ===== */
  window.genId = (prefix = 'ID', len = 8) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = prefix + '-';
    for (let i = 0; i < len; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    return res;
  };

  /* ===== Generate date ===== */
  window.todayDate = () => new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  window.todayDateTime = () => new Date().toLocaleString('en-IN');

  /* ===== Animate Value ===== */
  window.animateValue = (elId, start, end, duration, prefix = '', suffix = '') => {
    const obj = typeof elId === 'string' ? document.getElementById(elId) : elId;
    if (!obj) return;
    let s = start, e = end, d = duration;
    let step = Math.abs(Math.floor(d / (e - s)));
    step = step < 20 ? 20 : step;
    let up = e > s;
    let timer = setInterval(() => {
      s = up ? s + 1 : s - 1;
      obj.textContent = prefix + s.toLocaleString('en-IN') + suffix;
      if (s === e) clearInterval(timer);
    }, step);
  };

  /* ===== Confetti Animation ===== */
  window.fireConfetti = (duration = 2000) => {
    const colors = ['#34b7a7','#2a9d8f','#15c9c9','#ffbb2c','#e80368','#47aeff'];
    for (let i = 0; i < 80; i++) {
      let p = document.createElement('div');
      p.style.cssText = `position:fixed;left:50%;top:35%;width:8px;height:8px;border-radius:50%;background:${colors[Math.floor(Math.random()*colors.length)]};z-index:9999;pointer-events:none;`;
      document.body.appendChild(p);
      let vx = (Math.random() - 0.5) * 12;
      let vy = (Math.random() - 1.5) * 14 - 2;
      let x = 0, y = 0, grav = 0.6;
      let anim = setInterval(() => {
        x += vx; y += vy; vy += grav;
        p.style.transform = `translate(${x*10}px,${y*10}px)`;
        p.style.opacity = 1 - Math.abs(y)/30;
        if (y > 20) { clearInterval(anim); p.remove(); }
      }, 30);
    }
  };

  /* ===== Success Checkmark Animation ===== */
  window.animateCheckmark = () => {
    const c = el('.checkmark-circle');
    if (!c) return;
    c.classList.add('animate');
  };

  /* ===== LocalStorage Helpers ===== */
  window.storeObj = (key, obj) => localStorage.setItem(key, JSON.stringify(obj));
  window.getObj = (key) => { let d = localStorage.getItem(key); return d ? JSON.parse(d) : null; };

  /* ===== Download Summary as Text ===== */
  window.downloadReceipt = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* ============================== FORM VALIDATION ============================== */
  const validateRequired = (input, msg) => {
    if (!input || !input.value.trim()) {
      input.classList.add('is-invalid');
      let fb = input.parentElement.querySelector('.invalid-feedback');
      if (fb) fb.textContent = msg;
      return false;
    }
    input.classList.remove('is-invalid');
    return true;
  };

  const validateEmail = (input) => {
    const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rx.test(input.value.trim())) {
      input.classList.add('is-invalid');
      let fb = input.parentElement.querySelector('.invalid-feedback');
      if (fb) fb.textContent = 'Please enter a valid email';
      return false;
    }
    input.classList.remove('is-invalid');
    return true;
  };

  const validatePhone = (input) => {
    const rx = /^[6-9]\d{9}$/;
    if (!rx.test(input.value.replace(/\s/g,''))) {
      input.classList.add('is-invalid');
      let fb = input.parentElement.querySelector('.invalid-feedback');
      if (fb) fb.textContent = 'Enter valid 10-digit mobile number';
      return false;
    }
    input.classList.remove('is-invalid');
    return true;
  };

  window.clearValidation = (form) => {
    form.querySelectorAll('.form-control, .form-select').forEach(i => i.classList.remove('is-invalid'));
  };

  /* ============================== FARE CALCULATORS ============================== */
  /* Distance-based fare for With-Driver */
  window.calcDriverFare = (pickup, drop, carType) => {
    const baseFare = { sedan: 250, suv: 350, luxury: 500, premium: 420 };
    let dist = Math.floor(Math.random() * 30) + 5; // simulated distance km
    let rate = baseFare[carType] || 300;
    let fare = (dist * rate) + 100; // + service fee
    let gst = Math.round(fare * 0.05);
    let total = fare + gst;
    return { distance: dist, base: fare - 100, serviceFee: 100, gst, total };
  };

  /* Self-drive rental calculator */
  window.calcSelfDrive = (carType, rentalType, pickupDate, returnDate) => {
    const p1 = new Date(pickupDate), p2 = new Date(returnDate);
    const diffMs = p2 - p1;
    if (diffMs <= 0) return null;
    const hours = Math.ceil(diffMs / 3600000);
    const days = Math.ceil(hours / 24);
    const weeks = Math.ceil(days / 7);
    const rates = { sedan: 60, suv: 90, luxury: 150, hatchback: 45 };
    const deposit = { sedan: 5000, suv: 10000, luxury: 25000, hatchback: 3000 };
    const kmLimits = { sedan: '300 km/day', suv: '250 km/day', luxury: '200 km/day', hatchback: '350 km/day' };
    const rate = rates[carType] || 60;
    const dep = deposit[carType] || 5000;
    let rentalCost = 0;
    let period = '';
    if (rentalType === 'hourly') { rentalCost = hours * rate; period = hours + ' hours'; }
    else if (rentalType === 'daily') { rentalCost = days * rate * 8; period = days + ' days'; }
    else { rentalCost = weeks * rate * 40; period = weeks + ' weeks'; }
    let gst = Math.round(rentalCost * 0.18);
    let total = rentalCost + gst;
    return { period, rentalCost, gst, total, deposit: dep, kmLimit: kmLimits[carType] || '300 km/day', hours, days, weeks };
  };

  /* ============================== LOGO ANIMATION ============================== */
  window.initLogoSwap = () => {
    const logo = el('.logo-swap');
    if (!logo) return;
    const words = logo.dataset.words ? logo.dataset.words.split(',') : ['CARS','BOOKING'];
    let idx = 0;
    setInterval(() => {
      logo.style.opacity = 0;
      setTimeout(() => {
        idx = (idx + 1) % words.length;
        logo.textContent = words[idx];
        logo.style.opacity = 1;
      }, 400);
    }, 3000);
  };

  /* ============================== WHATSAPP FLOAT BUTTON ============================== */
  const initWhatsApp = () => {
    if (el('.whatsapp-float')) return;
    let wa = document.createElement('a');
    wa.href = 'https://wa.me/919876543210?text=Hello%20Cars%20World%21%20I%20need%20assistance.';
    wa.target = '_blank';
    wa.className = 'whatsapp-float';
    wa.innerHTML = '<i class="bi bi-whatsapp"></i>';
    wa.title = 'Contact us on WhatsApp';
    document.body.appendChild(wa);
  };

  /* ============================== DOM LOADED ============================== */
  document.addEventListener('DOMContentLoaded', () => {
    initWhatsApp();

    /* -- Tab switching for booking forms -- */
    qsa('[data-booking-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        let target = btn.dataset.bookingTab;
        qsa('[data-booking-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        qsa('[data-booking-panel]').forEach(p => {
          p.style.display = (p.dataset.bookingPanel === target) ? 'block' : 'none';
        });
      });
    });

    /* -- Form validation bindings -- */
    qsa('.booking-form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        let ok = true;
        qsa('.form-control[required], .form-select[required]', true).forEach(inp => {
          if (!inp.value.trim()) { ok = false; validateRequired(inp, 'This field is required'); }
        });
        let email = form.querySelector('input[type="email"]');
        if (email && email.value.trim() && !validateEmail(email)) ok = false;
        let phone = form.querySelector('input[type="tel"]');
        if (phone && phone.value.trim() && !validatePhone(phone)) ok = false;
        if (!ok) e.preventDefault();
      });
    });

    /* -- Progress tracker activation -- */
    qsa('.status-step').forEach((step, idx) => {
      if (step.classList.contains('active-step')) {
        step.style.animationDelay = (idx * 0.3) + 's';
        setTimeout(() => step.style.opacity = 1, idx * 300);
      }
    });

    /* -- Fire success animations on load -- */
    if (el('.success-page')) {
      window.fireConfetti(2500);
      window.animateCheckmark();
    }

    /* -- Init dynamic auth elements in Navbar -- */
    injectAuthStyles();
    injectAuthModal();
    window.AuthUtils.initNavbar();

    /* -- AOS re-init for new elements -- */
    if (typeof AOS !== 'undefined') AOS.refresh();
  });

  /* ============================== AUTH SYSTEM & UI INJECTION ============================== */
  const injectAuthStyles = () => {
    if (document.getElementById('auth-styles')) return;
    const styles = `
      .nav-profile-badge {
        display: flex !important;
        align-items: center;
        gap: 6px;
        background: rgba(52, 183, 167, 0.1);
        border: 1px solid rgba(52, 183, 167, 0.2);
        padding: 4px 12px;
        border-radius: 20px;
        color: #34b7a7 !important;
        font-weight: 600;
        transition: all 0.3s ease;
        text-decoration: none;
      }
      .nav-profile-badge:hover {
        background: rgba(52, 183, 167, 0.2);
      }
      .auth-modal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .auth-modal-overlay.active {
        opacity: 1;
        pointer-events: auto;
      }
      .auth-modal-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.45);
        border-radius: 24px;
        width: 100%;
        max-width: 440px;
        padding: 40px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        transform: translateY(30px) scale(0.95);
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        overflow: hidden;
      }
      .auth-modal-overlay.active .auth-modal-card {
        transform: translateY(0) scale(1);
      }
      .auth-modal-close {
        position: absolute;
        top: 20px; right: 20px;
        background: rgba(0,0,0,0.05);
        border: none;
        width: 32px; height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 18px;
        color: #333;
        transition: all 0.2s ease;
      }
      .auth-modal-close:hover {
        background: rgba(0,0,0,0.1);
        transform: rotate(90deg);
      }
      .auth-brand {
        text-align: center;
        margin-bottom: 24px;
      }
      .auth-brand h3 {
        font-weight: 700;
        background: linear-gradient(135deg, #34b7a7, #2a9d8f);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 4px;
        margin-top: 0;
      }
      .auth-step {
        display: none;
      }
      .auth-step.active {
        display: block;
        animation: fadeIn 0.4s ease forwards;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .auth-input-group {
        margin-bottom: 20px;
      }
      .auth-input-group label {
        font-size: 13px;
        font-weight: 600;
        color: #666;
        margin-bottom: 6px;
        display: block;
      }
      .auth-input {
        width: 100%;
        padding: 14px 18px;
        border-radius: 12px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        background: rgba(255, 255, 255, 0.7);
        font-size: 16px;
        transition: all 0.3s ease;
        outline: none;
        box-sizing: border-box;
      }
      .auth-input:focus {
        border-color: #34b7a7;
        background: #fff;
        box-shadow: 0 0 0 4px rgba(52, 183, 167, 0.15);
      }
      .auth-btn {
        width: 100%;
        padding: 14px;
        border-radius: 12px;
        border: none;
        background: linear-gradient(135deg, #34b7a7, #2a9d8f);
        color: white;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 6px 16px rgba(52, 183, 167, 0.25);
      }
      .auth-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(52, 183, 167, 0.35);
      }
      .auth-btn:active {
        transform: translateY(0);
      }
      .auth-toast {
        position: fixed;
        bottom: 24px; right: 24px;
        background: rgba(33, 37, 41, 0.95);
        backdrop-filter: blur(10px);
        color: white;
        padding: 16px 24px;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        z-index: 10100;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateY(100px) scale(0.9);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: 1px solid rgba(255,255,255,0.1);
        max-width: 380px;
        pointer-events: none;
      }
      .auth-toast.active {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: auto;
      }
      .auth-toast-icon {
        color: #ffbb2c;
        font-size: 24px;
      }
      .auth-toast-content strong {
        display: block;
        color: #34b7a7;
        font-size: 15px;
      }
      .auth-toast-content span {
        font-size: 13px;
        color: #ddd;
      }
    `;
    const styleEl = document.createElement('style');
    styleEl.id = 'auth-styles';
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
  };

  const showToast = (title, message) => {
    let t = document.querySelector('.auth-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'auth-toast';
      t.innerHTML = `
        <div class="auth-toast-icon"><i class="bi bi-shield-lock-fill"></i></div>
        <div class="auth-toast-content">
          <strong class="toast-title"></strong>
          <span class="toast-msg"></span>
        </div>
      `;
      document.body.appendChild(t);
    }
    t.querySelector('.toast-title').textContent = title;
    t.querySelector('.toast-msg').textContent = message;
    
    setTimeout(() => t.classList.add('active'), 100);
    setTimeout(() => t.classList.remove('active'), 8000);
  };

  const injectAuthModal = () => {
    if (document.querySelector('.auth-modal-overlay')) return;
    const modalHtml = `
      <div class="auth-modal-overlay">
        <div class="auth-modal-card">
          <button class="auth-modal-close" onclick="AuthUtils.closeLoginModal()">&times;</button>
          <div class="auth-brand">
            <h3>CARS WORLD</h3>
            <p class="text-muted small">One-Time Password Authentication</p>
          </div>
          
          <div class="auth-step step-phone active">
            <div class="auth-input-group">
              <label for="authPhone">Mobile Number</label>
              <input type="tel" id="authPhone" class="auth-input" placeholder="Enter 10-digit mobile" maxlength="10">
            </div>
            <button class="auth-btn" id="btnSendOtp" onclick="AuthUtils.sendOtp()">
              Send Verification Code <i class="bi bi-chat-left-dots"></i>
            </button>
          </div>
          
          <div class="auth-step step-otp">
            <div class="auth-input-group">
              <label for="authOtp">Verification Code (OTP)</label>
              <input type="text" id="authOtp" class="auth-input" placeholder="Enter 6-digit OTP" maxlength="6" style="letter-spacing:4px; text-align:center; font-weight:700;">
            </div>
            <button class="auth-btn" id="btnVerifyOtp" onclick="AuthUtils.verifyOtp()" style="background:linear-gradient(135deg, #ffbb2c, #e6a800);">
              Verify & Connect <i class="bi bi-shield-check"></i>
            </button>
            <div class="text-center mt-3">
              <a href="#" class="small text-muted" onclick="AuthUtils.showStep('phone'); return false;">Back to mobile number</a>
            </div>
          </div>
        </div>
      </div>
    `;
    const temp = document.createElement('div');
    temp.innerHTML = modalHtml.trim();
    document.body.appendChild(temp.firstChild);
  };

  /* Auth utility logic */
  window.AuthUtils = {
    _loginCallback: null,
    _verifyCallback: null,
    _verifyPhone: null,

    initNavbar: () => {
      const navList = document.querySelector('#navbar ul');
      if (!navList) return;
      
      const existing = navList.querySelectorAll('.auth-nav-item');
      existing.forEach(e => e.remove());
      
      const user = window.AuthUtils.getCurrentUser();
      if (user) {
        const li = document.createElement('li');
        li.className = 'dropdown auth-nav-item';
        li.innerHTML = `
          <a href="#" class="nav-profile-badge dropbtn"><i class="bi bi-person-circle"></i> ${user.name}</a>
          <div class="dropdown-content" style="right:0; left:auto;">
            <a href="#" onclick="AuthUtils.logout(); return false;"><i class="bi bi-box-arrow-left"></i> Logout</a>
          </div>
        `;
        navList.appendChild(li);
      } else {
        const li = document.createElement('li');
        li.className = 'auth-nav-item';
        const page = window.location.pathname.split('/').pop() || 'Home.html';
        const search = window.location.search;
        li.innerHTML = `
          <a href="login.html?redirect=${encodeURIComponent(page + search)}" class="btn-login-nav" style="color:black;"><i class="bi bi-box-arrow-in-right"></i> Login</a>
        `;
        navList.appendChild(li);
      }
    },

    isLoggedIn: () => {
      return !!localStorage.getItem('currentUser');
    },

    getCurrentUser: () => {
      const data = localStorage.getItem('currentUser');
      return data ? JSON.parse(data) : null;
    },

    openLoginModal: (callback = null) => {
      const page = window.location.pathname.split('/').pop() || 'Home.html';
      const search = window.location.search;
      window.location.href = `login.html?redirect=${encodeURIComponent(page + search)}`;
    },

    closeLoginModal: () => {
      const modal = document.querySelector('.auth-modal-overlay');
      if (modal) modal.classList.remove('active');
      window.AuthUtils._loginCallback = null;
      window.AuthUtils._verifyCallback = null;
      window.AuthUtils._verifyPhone = null;
    },

    showStep: (step) => {
      document.querySelectorAll('.auth-step').forEach(e => e.classList.remove('active'));
      document.querySelector('.step-' + step).classList.add('active');
    },

    sendOtp: () => {
      const phoneInput = document.getElementById('authPhone');
      const phone = phoneInput.value.trim().replace(/\s/g,'');
      if (!/^[6-9]\d{9}$/.test(phone)) {
        phoneInput.classList.add('is-invalid');
        alert('Please enter a valid 10-digit mobile number');
        return;
      }
      phoneInput.classList.remove('is-invalid');

      const btn = document.getElementById('btnSendOtp');
      btn.disabled = true;
      btn.innerHTML = 'Sending...';

      fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      .then(res => res.json())
      .then(data => {
        btn.disabled = false;
        btn.innerHTML = 'Send Verification Code <i class="bi bi-chat-left-dots"></i>';
        
        if (data.success) {
          window.AuthUtils._verifyPhone = phone;
          window.AuthUtils.showStep('otp');
          showToast('OTP VERIFICATION CODE', `Your code for ${phone} is: ${data.otp}.`);
        } else {
          alert('Error sending OTP: ' + (data.error || 'Unknown error'));
        }
      })
      .catch(err => {
        btn.disabled = false;
        btn.innerHTML = 'Send Verification Code <i class="bi bi-chat-left-dots"></i>';
        console.error(err);
        alert('Could not connect to authentication server.');
      });
    },

    verifyOtp: () => {
      const otpInput = document.getElementById('authOtp');
      const otp = otpInput.value.trim();
      const phone = window.AuthUtils._verifyPhone;

      if (!/^\d{6}$/.test(otp)) {
        otpInput.classList.add('is-invalid');
        alert('Please enter the 6-digit OTP code');
        return;
      }
      otpInput.classList.remove('is-invalid');

      const btn = document.getElementById('btnVerifyOtp');
      btn.disabled = true;
      btn.innerHTML = 'Verifying...';

      fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      })
      .then(res => res.json())
      .then(data => {
        btn.disabled = false;
        btn.innerHTML = 'Verify & Connect <i class="bi bi-shield-check"></i>';

        if (data.success) {
          if (window.AuthUtils._loginCallback) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            window.AuthUtils.initNavbar();
            window.AuthUtils.closeLoginModal();
            window.AuthUtils._loginCallback(data.user);
          } else if (window.AuthUtils._verifyCallback) {
            window.AuthUtils.closeLoginModal();
            window.AuthUtils._verifyCallback(phone);
          } else {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            window.AuthUtils.initNavbar();
            window.AuthUtils.closeLoginModal();
            showToast('WELCOME BACK!', `Connected successfully as ${data.user.name}`);
          }
        } else {
          alert('Invalid OTP. Please check the code and try again.');
        }
      })
      .catch(err => {
        btn.disabled = false;
        btn.innerHTML = 'Verify & Connect <i class="bi bi-shield-check"></i>';
        console.error(err);
        alert('Error connecting to authentication server.');
      });
    },

    logout: () => {
      localStorage.removeItem('currentUser');
      window.AuthUtils.initNavbar();
      showToast('LOGGED OUT', 'Successfully disconnected.');
      if (window.location.pathname.includes('confirmed') || window.location.pathname.includes('success')) {
        window.location.href = 'Home.html';
      }
    },

    verifyBookingPhone: (phone, callback) => {
      window.AuthUtils._loginCallback = null;
      window.AuthUtils._verifyCallback = callback;
      window.AuthUtils._verifyPhone = phone;

      injectAuthStyles();
      injectAuthModal();

      document.getElementById('authPhone').value = phone;
      document.getElementById('authOtp').value = '';

      window.AuthUtils.showStep('phone');
      document.querySelector('.auth-modal-overlay').classList.add('active');
      window.AuthUtils.sendOtp();
    }
  };

  /* ================ PROTECTED EXPORTS ================ */
  window.BookingUtils = {
    validateRequired, validateEmail, validatePhone,
    calcDriverFare, calcSelfDrive,
    genId: window.genId, todayDate: window.todayDate,
    storeObj: window.storeObj, getObj: window.getObj,
    downloadReceipt: window.downloadReceipt,
    fireConfetti: window.fireConfetti, animateCheckmark: window.animateCheckmark,
    animateValue: window.animateValue, initLogoSwap: window.initLogoSwap,
    AuthUtils: window.AuthUtils
  };

})();

