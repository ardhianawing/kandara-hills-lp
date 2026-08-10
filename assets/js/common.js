/* =========================================================================
   KANDARA HILLS — script bersama LP-WA & LP-FORM
   ========================================================================= */

/* -------------------------------------------------------------------------
   SITE_DATA — SATU-SATUNYA TEMPAT MENGUBAH ANGKA & TEKS DINAMIS.
   Semua yang bertanda DUMMY belum ada di bahan dari klien.
   WAJIB diganti data asli sebelum halaman ini dipakai beriklan.
   ------------------------------------------------------------------------- */
const SITE_DATA = {
  /* Nomor WhatsApp sales. Diambil dari LP rev-1 — pastikan masih aktif. */
  waNumber: '628133154170',

  /* Endpoint penerima lead (mis. Google Apps Script Web App atau Formspree).
     Dibiarkan kosong supaya demo tidak pernah error. Isi untuk mengaktifkan. */
  leadEndpoint: '',

  /* DUMMY — batas akhir harga pre-launching. Ganti ke tanggal sebenarnya. */
  preLaunchingEnd: '2026-09-09T23:59:59+07:00',

  /* DUMMY — harga & sisa unit per tipe. */
  types: {
    savaya: { label: 'SAVAYA — The Maison (6x12)',  price:  900000000, stock: 7 },
    alila:  { label: 'ALILA — The Verde (12x12)',   price: 1750000000, stock: 3 }
  },

  /* DUMMY — asumsi KPR. */
  kpr: { dpPercent: 20, tenorYears: 15, ratePercent: 5 },

  /* DUMMY — asumsi simulasi passive income. */
  invest: { nightlyRate: 1500000, occupancy: 55, griPercent: 6 }
};

/* ---------- util ---------- */
const rupiah = (n) =>
  'Rp' + Math.round(n).toLocaleString('id-ID');

const rupiahShort = (n) => {
  if (n >= 1e9) return 'Rp' + (n / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' M';
  if (n >= 1e6) return 'Rp' + (n / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 0 }) + ' Jt';
  return rupiah(n);
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- header menempel saat digulir ---------- */
const header = document.querySelector('[data-header]');
if (header) {
  const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
}

/* ---------- tautan WhatsApp dengan pesan sesuai konteks ----------
   Pakai: <a data-wa="Halo, saya tertarik tipe SAVAYA...">
   Pesannya sengaja berbeda per tombol supaya sales tahu klik datang dari mana. */
function waLink(message) {
  return 'https://wa.me/' + SITE_DATA.waNumber + '?text=' + encodeURIComponent(message);
}

document.querySelectorAll('[data-wa]').forEach((el) => {
  el.setAttribute('href', waLink(el.dataset.wa));
  el.setAttribute('target', '_blank');
  el.setAttribute('rel', 'noopener');
});

/* ---------- reveal saat masuk layar ---------- */
const revealables = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealables.forEach((el) => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
  );
  revealables.forEach((el) => revealObserver.observe(el));
}

/* ---------- angka statistik menghitung naik ---------- */
const counters = document.querySelectorAll('[data-count]');

function runCounters() {
  counters.forEach((el) => {
    const target = Number(el.dataset.count);

    if (reducedMotion) {
      el.textContent = String(target);
      return;
    }

    const started = performance.now();
    const duration = 1200;

    const tick = (now) => {
      const p = Math.min((now - started) / duration, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };

    el.textContent = '0';
    requestAnimationFrame(tick);
  });
}

const statsSection = document.querySelector('[data-stats]');
if (counters.length && statsSection && 'IntersectionObserver' in window) {
  const statsObserver = new IntersectionObserver(
    (entries, obs) => {
      if (!entries[0].isIntersecting) return;
      runCounters();
      obs.disconnect();
    },
    { threshold: 0.25 }
  );
  statsObserver.observe(statsSection);
} else if (counters.length) {
  runCounters();
}

/* ---------- hitung mundur pre-launching ---------- */
const countdownRoot = document.querySelector('[data-countdown]');

if (countdownRoot) {
  const cells = {
    days:    countdownRoot.querySelector('[data-cd="days"]'),
    hours:   countdownRoot.querySelector('[data-cd="hours"]'),
    minutes: countdownRoot.querySelector('[data-cd="minutes"]'),
    seconds: countdownRoot.querySelector('[data-cd="seconds"]')
  };
  const deadline = new Date(SITE_DATA.preLaunchingEnd).getTime();
  const pad = (n) => String(n).padStart(2, '0');

  const tickCountdown = () => {
    const left = deadline - Date.now();

    if (!Number.isFinite(deadline)) {
      countdownRoot.hidden = true;
      return true;
    }

    if (left <= 0) {
      Object.values(cells).forEach((c) => { if (c) c.textContent = '00'; });
      return true;
    }

    const s = Math.floor(left / 1000);
    if (cells.days)    cells.days.textContent    = pad(Math.floor(s / 86400));
    if (cells.hours)   cells.hours.textContent   = pad(Math.floor((s % 86400) / 3600));
    if (cells.minutes) cells.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    if (cells.seconds) cells.seconds.textContent = pad(s % 60);
    return false;
  };

  if (!tickCountdown()) {
    const timer = setInterval(() => {
      if (tickCountdown()) clearInterval(timer);
    }, 1000);
  }
}

/* ---------- sisa unit ---------- */
document.querySelectorAll('[data-stock]').forEach((el) => {
  const type = SITE_DATA.types[el.dataset.stock];
  if (type) el.textContent = String(type.stock);
});

/* ---------- kalkulator KPR ----------
   Rumus anuitas standar: A = P x i / (1 - (1 + i)^-n)
   P = pokok pinjaman, i = bunga per bulan, n = jumlah bulan. */
const kpr = document.querySelector('[data-kpr]');

if (kpr) {
  const typeSel  = kpr.querySelector('#kprType');
  const dpInput  = kpr.querySelector('#kprDp');
  const tenInput = kpr.querySelector('#kprTenor');
  const rateInput= kpr.querySelector('#kprRate');

  const dpOut    = kpr.querySelector('#kprDpOut');
  const tenOut   = kpr.querySelector('#kprTenorOut');
  const rateOut  = kpr.querySelector('#kprRateOut');

  const priceOut = kpr.querySelector('#kprPrice');
  const dpAmtOut = kpr.querySelector('#kprDpAmount');
  const loanOut  = kpr.querySelector('#kprLoan');
  const instOut  = kpr.querySelector('#kprInstalment');
  const waBtn    = kpr.querySelector('[data-kpr-wa]');
  const formBtn  = kpr.querySelector('[data-kpr-form]');

  function monthlyInstalment(principal, annualRatePercent, years) {
    const n = years * 12;
    const i = annualRatePercent / 100 / 12;
    if (i === 0) return principal / n;
    return (principal * i) / (1 - Math.pow(1 + i, -n));
  }

  function recalcKpr() {
    const type    = SITE_DATA.types[typeSel.value];
    const price   = type.price;
    const dpPct   = Number(dpInput.value);
    const years   = Number(tenInput.value);
    const rate    = Number(rateInput.value);

    const dpAmount = price * (dpPct / 100);
    const loan     = price - dpAmount;
    const monthly  = monthlyInstalment(loan, rate, years);

    dpOut.textContent   = dpPct + '%';
    tenOut.textContent  = years + ' tahun';
    rateOut.textContent = rate.toLocaleString('id-ID') + '%';

    priceOut.textContent = rupiah(price);
    dpAmtOut.textContent = rupiah(dpAmount);
    loanOut.textContent  = rupiah(loan);
    instOut.textContent  = rupiah(monthly);

    const summary =
      'Halo, saya sudah menghitung simulasi KPR di website Kandara Hills:\n' +
      '- Tipe: ' + type.label + '\n' +
      '- Harga: ' + rupiah(price) + '\n' +
      '- DP ' + dpPct + '%: ' + rupiah(dpAmount) + '\n' +
      '- Tenor: ' + years + ' tahun, bunga ' + rate + '%\n' +
      '- Estimasi cicilan: ' + rupiah(monthly) + '/bulan\n\n' +
      'Boleh dibantu cek skema yang sebenarnya?';

    if (waBtn) waBtn.setAttribute('href', waLink(summary));

    if (formBtn) {
      formBtn.dataset.prefillType = typeSel.value;
      formBtn.dataset.prefillNote = summary;
    }
  }

  [typeSel, dpInput, tenInput, rateInput].forEach((el) => {
    if (el) el.addEventListener('input', recalcKpr);
  });

  /* nilai awal dari SITE_DATA */
  if (dpInput)   dpInput.value   = SITE_DATA.kpr.dpPercent;
  if (tenInput)  tenInput.value  = SITE_DATA.kpr.tenorYears;
  if (rateInput) rateInput.value = SITE_DATA.kpr.ratePercent;

  recalcKpr();
}

/* ---------- simulasi passive income ---------- */
const investRoot = document.querySelector('[data-invest]');

if (investRoot) {
  const { nightlyRate, occupancy, griPercent } = SITE_DATA.invest;
  const price   = SITE_DATA.types.alila.price;
  const gross   = nightlyRate * 365 * (occupancy / 100);
  const gri     = price * (griPercent / 100);

  const set = (sel, value) => {
    const el = investRoot.querySelector(sel);
    if (el) el.textContent = value;
  };

  set('[data-inv="nightly"]',   rupiah(nightlyRate));
  set('[data-inv="occupancy"]', occupancy + '%');
  set('[data-inv="gross"]',     rupiah(gross));
  set('[data-inv="gri"]',       rupiah(gri));
  set('[data-inv="griPct"]',    griPercent + '%');
}
