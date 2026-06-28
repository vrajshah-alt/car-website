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

    /* -- AOS re-init for new elements -- */
    if (typeof AOS !== 'undefined') AOS.refresh();
  });

  /* ================ PROTECTED EXPORTS ================ */
  window.BookingUtils = {
    validateRequired, validateEmail, validatePhone,
    calcDriverFare, calcSelfDrive,
    genId: window.genId, todayDate: window.todayDate,
    storeObj: window.storeObj, getObj: window.getObj,
    downloadReceipt: window.downloadReceipt,
    fireConfetti: window.fireConfetti, animateCheckmark: window.animateCheckmark,
    animateValue: window.animateValue, initLogoSwap: window.initLogoSwap
  };

})();

