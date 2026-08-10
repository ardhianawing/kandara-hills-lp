/* =========================================================================
   KANDARA HILLS — penanganan form lead (khusus LP-FORM)
   Butuh common.js sudah dimuat lebih dulu (memakai SITE_DATA).
   ========================================================================= */

/* Normalkan nomor WhatsApp Indonesia ke format 62xxxxxxxxxx. */
function normalizeWa(raw) {
  const digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('62'))  return digits;
  if (digits.startsWith('0'))   return '62' + digits.slice(1);
  if (digits.startsWith('8'))   return '62' + digits;
  return digits;
}

function isValidWa(raw) {
  const n = normalizeWa(raw);
  return /^62\d{8,13}$/.test(n);
}

function setFieldError(input, message) {
  const field = input.closest('.field');
  if (!field) return;
  const box = field.querySelector('.field__error');
  if (message) {
    field.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    if (box) box.textContent = message;
  } else {
    field.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
  }
}

/* Kirim ke endpoint kalau diisi. Kegagalan jaringan tidak boleh menahan
   pengunjung — lead sudah tersimpan di localStorage sebagai cadangan. */
async function pushLead(payload) {
  if (!SITE_DATA.leadEndpoint) return;
  try {
    await fetch(SITE_DATA.leadEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('Lead gagal dikirim ke endpoint, tersimpan lokal saja.', err);
  }
}

function storeLeadLocally(payload) {
  try {
    const key = 'kandara_leads';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push(payload);
    localStorage.setItem(key, JSON.stringify(list));
  } catch (err) {
    /* localStorage bisa diblokir di mode privat — abaikan, bukan hal kritis. */
  }
}

document.querySelectorAll('[data-lead-form]').forEach((form) => {
  const nameInput = form.querySelector('[name="nama"]');
  const waInput   = form.querySelector('[name="whatsapp"]');
  const typeInput = form.querySelector('[name="tipe"]');
  const submitBtn = form.querySelector('[type="submit"]');
  const submitLabel = submitBtn ? submitBtn.textContent : '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let ok = true;

    if (!nameInput.value.trim()) {
      setFieldError(nameInput, 'Nama belum diisi.');
      ok = false;
    } else {
      setFieldError(nameInput, null);
    }

    if (!isValidWa(waInput.value)) {
      setFieldError(waInput, 'Masukkan nomor WhatsApp yang benar, contoh 0812xxxxxxx.');
      ok = false;
    } else {
      setFieldError(waInput, null);
    }

    if (!ok) {
      form.querySelector('.has-error input')?.focus();
      return;
    }

    const payload = {
      nama:     nameInput.value.trim(),
      whatsapp: normalizeWa(waInput.value),
      tipe:     typeInput ? typeInput.value : '',
      catatan:  form.dataset.note || '',
      sumber:   form.dataset.source || 'lp-form',
      halaman:  location.pathname,
      waktu:    new Date().toISOString()
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim…';
    }

    storeLeadLocally(payload);
    await pushLead(payload);

    const params = new URLSearchParams({
      nama: payload.nama,
      tipe: payload.tipe
    });
    location.href = 'terima-kasih.html?' + params.toString();

    /* Kalau redirect gagal (mis. dibatalkan browser), kembalikan tombol. */
    if (submitBtn) {
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      }, 4000);
    }
  });

  /* Bersihkan pesan error begitu pengunjung memperbaiki isiannya. */
  [nameInput, waInput].forEach((input) => {
    input?.addEventListener('input', () => setFieldError(input, null));
  });
});

/* Tombol yang mengarahkan ke form sambil memilihkan tipe tertentu. */
document.querySelectorAll('[data-prefill-type]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.querySelector('#formPenawaran');
    if (!target) return;

    const select = target.querySelector('[name="tipe"]');
    if (select && btn.dataset.prefillType) select.value = btn.dataset.prefillType;
    if (btn.dataset.prefillNote) target.dataset.note = btn.dataset.prefillNote;

    target.querySelector('[name="nama"]')?.focus({ preventScroll: true });
  });
});
