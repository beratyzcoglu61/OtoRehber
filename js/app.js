/* =========================================================
   OTOREHBER 2026 – Uygulama Mantığı & Etkileşim Motoru
   ========================================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));

/* ---------------------------------------------------------
   YARDIMCILAR & FORMATLAYICILAR
   --------------------------------------------------------- */
const fmtTL = n => {
  if (n === Infinity) return "Sınırsız";
  if (!n && n !== 0) return "—";
  if (n >= 1e6) {
    return (n / 1e6).toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + " Mn ₺";
  }
  return Math.round(n).toLocaleString("tr-TR") + " ₺";
};

const fmtNum = n => Math.round(n).toLocaleString("tr-TR");
const budgetOf = p => BUDGETS.find(b => p >= b.min && p < b.max) || BUDGETS[0];
const isEV = c => c.fuel === "Elektrik";
const isAWD = c => c.drive === "AWD" || c.drive === "4x4";
const consLabel = c => isEV(c) ? `${c.cons} kWh` : `${c.cons} L`;
const hue = s => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7);
const carName = c => `${c.brand} ${c.model}`;

/* ---------------------------------------------------------
   TOAST BİLDİRİMİ
   --------------------------------------------------------- */
let toastTimeout;
function showToast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.innerHTML = msg;
  t.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.remove("show"), 3200);
}

/* ---------------------------------------------------------
   KULLANICI KAYIT, GİRİŞ & OTURUM YÖNETİMİ (localStorage)
   --------------------------------------------------------- */
const STORAGE_KEYS = {
  USER: "otorehber_user",
  USERS: "otorehber_users",
  FAVS: "otorehber_favs",
  REVIEWS: "otorehber_reviews"
};

let currentUser = null;
let userFavorites = new Set();
let allReviews = [];

function initAuth() {
  try {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) currentUser = JSON.parse(savedUser);

    const savedFavs = localStorage.getItem(STORAGE_KEYS.FAVS);
    if (savedFavs) userFavorites = new Set(JSON.parse(savedFavs));

    const savedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (savedReviews) {
      allReviews = JSON.parse(savedReviews);
    } else {
      allReviews = [...SEED_REVIEWS];
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(allReviews));
    }
  } catch (err) {
    console.error("Storage yüklenirken hata:", err);
    allReviews = [...SEED_REVIEWS];
  }
  updateAuthUI();
  updateFavCountUI();
}

function updateAuthUI() {
  const btnLabel = $("#navAuthLabel");
  const tabProfile = $("#tabProfileBtn");
  if (!btnLabel) return;

  if (currentUser) {
    btnLabel.innerHTML = `👤 ${currentUser.name.split(" ")[0]}`;
    if (tabProfile) tabProfile.style.display = "inline-block";
  } else {
    btnLabel.innerHTML = "👤 Giriş Yap";
    if (tabProfile) tabProfile.style.display = "none";
  }
}

function updateFavCountUI() {
  const el = $("#favCount");
  if (el) el.textContent = userFavorites.size;
  // Kartlardaki kalp ikonlarını güncelle
  $$(".fav-btn").forEach(btn => {
    const id = +btn.dataset.id;
    btn.classList.toggle("is-fav", userFavorites.has(id));
  });
}

function toggleFavorite(id) {
  const car = CARS.find(x => x.id === id);
  if (!car) return;

  if (userFavorites.has(id)) {
    userFavorites.delete(id);
    showToast(`💔 <b>${carName(car)}</b> favorilerden çıkarıldı.`);
  } else {
    userFavorites.add(id);
    showToast(`❤️ <b>${carName(car)}</b> favorilere eklendi!`);
  }
  try {
    localStorage.setItem(STORAGE_KEYS.FAVS, JSON.stringify([...userFavorites]));
  } catch (e) {}
  updateFavCountUI();
}

function saveUserSession(user) {
  currentUser = user;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  updateAuthUI();
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem(STORAGE_KEYS.USER);
  updateAuthUI();
  closeModal();
  showToast("👋 Başarıyla çıkış yapıldı.");
}

function openAuthModal(defaultTab = "login") {
  const modal = $("#authModal");
  if (!modal) return;
  renderAuthTabs(defaultTab);
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function renderAuthTabs(tab = "login") {
  $$(".auth-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  const container = $("#authContent");

  if (tab === "login") {
    container.innerHTML = `
      <form class="auth-form" id="loginForm">
        <h3>Giriş Yap</h3>
        <p class="muted-sm">Kayıtlı favorilerinize ve yorumlarınıza erişin.</p>
        <label>E-Posta Adresi
          <input type="email" id="loginEmail" required placeholder="ornek@mail.com" />
        </label>
        <label>Şifre
          <input type="password" id="loginPass" required placeholder="••••••••" />
        </label>
        <button type="submit" class="btn btn-primary" style="margin-top:6px">Giriş Yap</button>
        <div class="auth-demo-box">
          <p class="muted-sm">Hesap oluşturmadan anında denemek için:</p>
          <button type="button" class="btn btn-ghost" id="quickDemoBtn" style="margin-top:6px;width:100%">⚡ Tek Tıkla Demo Girişi</button>
        </div>
      </form>`;
    
    $("#loginForm").onsubmit = e => {
      e.preventDefault();
      const email = $("#loginEmail").value.trim();
      const name = email.split("@")[0];
      saveUserSession({ name: name.charAt(0).toUpperCase() + name.slice(1), email });
      closeModal();
      showToast(`🎉 Hoş geldiniz, <b>${currentUser.name}</b>!`);
    };

    $("#quickDemoBtn").onclick = () => {
      saveUserSession({ name: "Ahmet Yılmaz", email: "ahmet@otorehber.com", car: "Renault Megane 1.3 TCe" });
      closeModal();
      showToast(`⚡ Demo hesabı ile giriş yapıldı: <b>Ahmet Yılmaz</b>`);
    };

  } else if (tab === "register") {
    container.innerHTML = `
      <form class="auth-form" id="regForm">
        <h3>Kayıt Ol</h3>
        <p class="muted-sm">OtoRehber topluluğuna katılın, araç kroniklerini ve tecrübelerinizi paylaşın.</p>
        <label>Adınız ve Soyadınız
          <input type="text" id="regName" required placeholder="Örn: Mehmet Özkan" />
        </label>
        <label>E-Posta Adresi
          <input type="email" id="regEmail" required placeholder="mehmet@gmail.com" />
        </label>
        <label>Şifre Belirleyin
          <input type="password" id="regPass" required placeholder="En az 6 karakter" minlength="6" />
        </label>
        <label>Şu An Kullandığınız veya Hayalinizdeki Araç (Opsiyonel)
          <input type="text" id="regCar" placeholder="Örn: 2023 Toyota Corolla Hibrit" />
        </label>
        <button type="submit" class="btn btn-primary" style="margin-top:6px">Hesap Oluştur</button>
      </form>`;

    $("#regForm").onsubmit = e => {
      e.preventDefault();
      const name = $("#regName").value.trim();
      const email = $("#regEmail").value.trim();
      const car = $("#regCar").value.trim();
      saveUserSession({ name, email, car, joined: new Date().toLocaleDateString("tr-TR") });
      closeModal();
      showToast(`🎉 Kaydınız tamamlandı! Hoş geldiniz, <b>${name}</b>.`);
    };

  } else if (tab === "profile") {
    if (!currentUser) return renderAuthTabs("login");
    const favCount = userFavorites.size;
    const userReviewsCount = allReviews.filter(r => r.userName && r.userName.includes(currentUser.name)).length;

    container.innerHTML = `
      <div class="auth-form">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">
          <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:grid;place-items:center;font-size:1.8rem;font-weight:bold;color:#fff">
            ${currentUser.name.charAt(0)}
          </div>
          <div>
            <h3 style="margin:0">${currentUser.name}</h3>
            <span class="muted-sm">${currentUser.email}</span>
            ${currentUser.car ? `<div class="tag" style="margin-top:4px">🚗 ${currentUser.car}</div>` : ""}
          </div>
        </div>

        <div class="specs" style="grid-template-columns:1fr 1fr;margin:10px 0 16px">
          <div><b>${favCount}</b> Favori Araç</div>
          <div><b>${userReviewsCount}</b> Gönderilen Deneyim / Bildirim</div>
        </div>

        <button class="btn btn-primary" onclick="closeModal(); openFavoritesModal();" style="width:100%">
          ❤️ Favorilerimi Listele
        </button>

        <button class="btn btn-danger" onclick="logoutUser()" style="width:100%;margin-top:8px">
          Çıkış Yap
        </button>
      </div>`;
  }
}

/* ---------------------------------------------------------
   FAVORİLER MODALI
   --------------------------------------------------------- */
function openFavoritesModal() {
  const modal = $("#favModal");
  const listEl = $("#favModalList");
  if (!modal || !listEl) return;

  const favCars = CARS.filter(c => userFavorites.has(c.id));
  if (!favCars.length) {
    listEl.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px 20px">
        <p style="font-size:3rem;margin-bottom:8px">🤍</p>
        <h4>Henüz favori aracınız yok</h4>
        <p class="muted">Katalogdaki veya detay sayfalarındaki kalp (❤️) butonuna basarak araçları listenize ekleyin.</p>
        <button class="btn btn-primary" onclick="closeModal(); filterCatalog('qReset','');">Kataloğa Göz At</button>
      </div>`;
  } else {
    listEl.innerHTML = favCars.map(c => `
      <div class="fav-item-card" data-car="${c.id}">
        <img class="fav-item-thumb" src="${c.img}" alt="${carName(c)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'" />
        <div>
          <small class="muted">${c.brand}</small>
          <h4 style="margin:2px 0 6px">${c.model}</h4>
          <b style="color:var(--accent2);font-size:1.1rem">${fmtTL(c.price)}</b>
          <div class="tags" style="margin-top:6px">
            <span class="tag">${c.cat}</span>
            <span class="tag">${c.fuel}</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:auto">
          <button class="btn btn-primary" style="flex:1;padding:8px" onclick="event.stopPropagation(); closeModal(); showDetail(${c.id});">İncele</button>
          <button class="btn btn-ghost" style="padding:8px 12px" title="Favoriden Kaldır" onclick="event.stopPropagation(); toggleFavorite(${c.id}); openFavoritesModal();">✕</button>
        </div>
      </div>`).join("");
  }

  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

/* ---------------------------------------------------------
   EKONOMİ & SAHİP OLMA MALİYETİ HESAPLAMA (TCO)
   --------------------------------------------------------- */
const econ = { km: 15000, gas: 52, diesel: 54, elec: 7 };
const MAINT_TL = { 1: 14000, 2: 24000, 3: 40000, 4: 65000, 5: 110000 };
const DEPR_RATES = { 5: 0.06, 4: 0.09, 3: 0.13, 2: 0.17, 1: 0.22 };

function annualCost(c) {
  let unit = econ.gas;
  if (c.fuel === "Dizel") unit = econ.diesel;
  if (isEV(c)) unit = econ.elec;

  const fuel = (c.cons / 100) * econ.km * unit;
  const maint = (MAINT_TL[c.maint] || 25000) * (0.6 + econ.km / 37500);
  const depr = c.price * (DEPR_RATES[c.resale] || 0.12);
  const run = fuel + maint;
  const total = fuel + maint + depr;
  const perKm = fuel / econ.km;
  return { fuel, maint, depr, run, total, perKm };
}

let runMin, runMax;
function computeRanges() {
  const runs = CARS.map(c => Math.log(annualCost(c).total));
  runMin = Math.min(...runs);
  runMax = Math.max(...runs);
}

const ecoScore = c => Math.round(clamp(100 - ((Math.log(annualCost(c).total) - runMin) / (runMax - runMin)) * 90));
const comfortScore = c => c.comfort * 10;
const perfScore = c => Math.round(clamp(((14 - c.acc) / (14 - 2.8)) * 100));
const familyScore = c => Math.round(clamp(c.comfort * 4 + Math.min(c.trunk, 900) / 16 + (c.seats >= 7 ? 20 : 0) - (c.seats <= 4 ? 25 : 0)));
const reliabilityScore = c => {
  const issuePenalty = (c.issues?.length || 0) * 12;
  const maintBonus = (6 - c.maint) * 10;
  return clamp(100 - issuePenalty + maintBonus - 15, 30, 99);
};

/* ---------------------------------------------------------
   SVG SİLÜETLERİ (GÖRSEL YÜKLENEMEZSE YEDEK OLARAK)
   --------------------------------------------------------- */
const SHAPES = {
  sedan:  { b: "M10,58 L12,46 Q14,40 30,38 L62,36 L82,22 Q88,19 100,19 L130,19 Q140,19 148,26 L162,36 L182,40 Q190,42 190,50 L190,58 Z", w: ["M70,36 L86,24 Q90,22 100,22 L112,22 L112,36 Z", "M116,22 L130,22 Q138,22 144,28 L152,36 L116,36 Z"] },
  hatch:  { b: "M14,58 L14,44 Q16,38 32,36 L58,34 L80,18 Q86,15 96,15 L150,15 Q160,15 166,24 L176,38 Q184,42 184,50 L184,58 Z", w: ["M66,34 L84,20 Q88,18 96,18 L116,18 L116,34 Z", "M120,18 L148,18 Q156,18 160,26 L166,34 L120,34 Z"] },
  wagon:  { b: "M10,58 L12,46 Q14,40 30,38 L60,35 L80,20 Q86,17 98,17 L172,17 Q180,17 183,26 L188,40 Q190,44 190,50 L190,58 Z", w: ["M68,35 L84,21 Q88,20 98,20 L118,20 L118,35 Z", "M122,20 L150,20 L150,35 L122,35 Z", "M154,20 L172,20 Q178,20 180,28 L182,35 L154,35 Z"] },
  suv:    { b: "M12,58 L12,40 Q14,34 30,32 L56,30 L74,12 Q78,9 88,9 L170,9 Q178,9 181,18 L186,32 Q190,36 190,46 L190,58 Z", w: ["M62,30 L78,14 Q81,12 88,12 L120,12 L120,30 Z", "M124,12 L168,12 Q174,12 176,20 L180,30 L124,30 Z"] },
  offroad:{ b: "M14,58 L14,34 Q14,30 20,30 L56,28 L66,8 L178,8 Q184,8 184,14 L186,30 Q188,32 188,40 L188,58 Z", w: ["M64,28 L72,12 L118,12 L118,28 Z", "M122,12 L180,12 L182,28 L122,28 Z"] },
  pickup: { b: "M10,58 L10,38 Q12,32 26,31 L52,30 L68,12 Q72,10 80,10 L118,10 Q124,10 124,16 L124,32 L190,32 L190,58 Z", w: ["M58,30 L72,14 L96,14 L96,30 Z", "M100,14 L120,14 L120,30 L100,30 Z"] },
  van:    { b: "M12,58 L12,36 Q14,30 24,28 L40,26 L58,8 Q62,6 70,6 L180,6 Q188,6 188,14 L188,58 Z", w: ["M46,26 L62,10 L92,10 L92,26 Z", "M96,10 L134,10 L134,26 L96,26 Z", "M138,10 L182,10 L182,26 L138,26 Z"] },
  coupe:  { b: "M8,58 L10,48 Q12,42 30,40 L70,36 L96,24 Q104,21 116,21 L134,21 Q146,22 158,32 L182,40 Q192,44 192,52 L192,58 Z", w: ["M80,36 L100,26 Q106,24 116,24 L128,24 L128,36 Z", "M132,24 L136,24 Q144,25 152,32 L156,36 L132,36 Z"] }
};
let svgIdCounter = 0;
function carSVG(type, h = 10) {
  const s = SHAPES[type] || SHAPES.sedan, id = "svg_g_" + (svgIdCounter++);
  const wheel = x => `<circle cx="${x}" cy="58" r="12" fill="#0b0b0f" stroke="#3a3f4b" stroke-width="3"/><circle cx="${x}" cy="58" r="4.5" fill="#9aa3b5"/>`;
  return `<svg viewBox="0 0 200 74" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="hsl(${h},75%,62%)"/><stop offset="1" stop-color="hsl(${h},70%,36%)"/></linearGradient></defs>
    <ellipse cx="100" cy="70" rx="88" ry="4" fill="rgba(0,0,0,.45)"/>
    <path d="${s.b}" fill="url(#${id})"/>
    ${s.w.map(w => `<path d="${w}" fill="rgba(15,22,35,.85)" stroke="rgba(255,255,255,.15)"/>`).join("")}
    <rect x="178" y="42" width="10" height="4" rx="2" fill="#ffe7a3"/><rect x="12" y="44" width="8" height="4" rx="2" fill="#ff4d4d"/>
    ${wheel(50)}${wheel(150)}</svg>`;
}
const iconOf = c => CATEGORIES[c.cat]?.icon || "sedan";

/* ---------------------------------------------------------
   KARŞILAŞTIRMA SEPETİ
   --------------------------------------------------------- */
let compare = [];
function toggleCompare(id) {
  const car = CARS.find(x => x.id === id);
  if (!car) return;

  if (compare.includes(id)) {
    compare = compare.filter(x => x !== id);
    showToast(`⚖️ <b>${carName(car)}</b> karşılaştırmadan çıkarıldı.`);
  } else {
    if (compare.length >= 3) {
      return alert("En fazla 3 aracı aynı anda karşılaştırabilirsiniz.");
    }
    compare.push(id);
    showToast(`⚖️ <b>${carName(car)}</b> karşılaştırmaya eklendi (${compare.length}/3).`);
  }
  renderCompareBar();
  $$(".cmp-btn").forEach(b => b.classList.toggle("is-cmp", compare.includes(+b.dataset.id)));
}

function renderCompareBar() {
  const bar = $("#compareBar");
  if (!bar) return;
  bar.classList.toggle("show", compare.length > 0);
  $("#compareItems").innerHTML = compare.map(id => {
    const c = CARS.find(x => x.id === id);
    return `<span class="chip">${carName(c)} <button data-rm="${id}" title="Kaldır">✕</button></span>`;
  }).join("") + `<span class="muted-sm" style="align-self:center">${compare.length}/3</span>`;
}

/* ---------------------------------------------------------
   ARAÇ KARTI OLUŞTURUCU
   --------------------------------------------------------- */
function scoreRow(label, v, color) {
  return `<div class="score"><span>${label}</span><div class="track"><div class="fill" style="width:${v}%;background:${color}"></div></div><b>${v}</b></div>`;
}

function carCard(c) {
  const b = budgetOf(c.price);
  const isFav = userFavorites.has(c.id);
  const isCmp = compare.includes(c.id);
  const issueCount = c.issues?.length || 0;
  const starCount = c.highlights?.length || 0;

  return `
    <article class="car" data-car="${c.id}">
      <div class="car-media">
        <span class="car-badge-top" style="color:${b.color}">● ${b.name}</span>
        <div class="car-actions-top">
          <button class="car-icon-btn fav-btn ${isFav ? "is-fav" : ""}" data-id="${c.id}" title="Favorilere Ekle/Çıkar">
            ${isFav ? "❤️" : "🤍"}
          </button>
          <button class="car-icon-btn cmp-btn ${isCmp ? "is-cmp" : ""}" data-id="${c.id}" title="Karşılaştırmaya Ekle">
            ⚖️
          </button>
        </div>
        <img class="car-real-img" src="${c.img}" alt="${carName(c)}" loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';" />
        <div class="car-svg-fallback">
          ${carSVG(iconOf(c), hue(c.brand + c.model))}
        </div>
        <div class="car-media-overlay"></div>
      </div>

      <div class="car-body">
        <div class="car-header">
          <div class="car-title">
            <small>${BRANDS[c.brand]?.flag || "🚗"} ${c.brand}</small>
            <h4>${c.model}</h4>
          </div>
          <div class="car-price">${fmtTL(c.price)}</div>
        </div>

        <div class="specs">
          <div><small>Güç</small><b>${c.hp} HP</b></div>
          <div><small>0-100</small><b>${c.acc}s</b></div>
          <div><small>Tüketim</small><b>${consLabel(c)}</b></div>
        </div>

        <div class="tags">
          <span class="tag">${c.cat}</span>
          <span class="tag fuel-${c.fuel.split(" ")[0]}">${c.fuel}</span>
          <span class="tag">${c.drive}</span>
          <span class="tag">${c.trans}</span>
        </div>

        <div class="car-indicators">
          ${issueCount > 0 
            ? `<div class="indicator-badge warn">⚠️ ${issueCount} Kronik Uyarı Bildirildi</div>` 
            : `<div class="indicator-badge star">🛡️ Düşük Kronik Riski (Sorunsuz)</div>`}
          ${starCount > 0 ? `<div class="indicator-badge star">⭐ ${starCount} Yıldız Avantajı Var</div>` : ""}
        </div>

        <div class="scores">
          ${scoreRow("Ekonomi", ecoScore(c), "#22c55e")}
          ${scoreRow("Konfor", comfortScore(c), "#3b82f6")}
          ${scoreRow("Performans", perfScore(c), "#ef4444")}
        </div>
      </div>
    </article>`;
}

/* ---------------------------------------------------------
   BÖLGESEL UYGUNLUK MANTIĞI & KURALLARI
   --------------------------------------------------------- */
const small = c => ["Hatchback", "Crossover", "Sedan"].includes(c.cat) && c.price < 5e6;
const big = c => ["Pick-up", "Arazi (4x4)", "MPV / Aile", "Hafif Ticari"].includes(c.cat) || c.trunk > 800;

const commonRules = [
  { t: c => c.maint === 1, p: 14, l: "Çok ucuz parça & her sanayide servis" },
  { t: c => c.maint === 2, p: 8 },
  { t: c => c.maint === 4, p: -10 },
  { t: c => c.maint === 5, p: -22 },
  { t: c => c.resale === 5, p: 7, l: "Yüksek ikinci el değeri" },
  { t: c => c.cat === "Süper Spor", p: -30 }
];

const REGIONS = {
  marmara: {
    name: "Marmara", emoji: "🌉",
    climate: "Ilıman-nemli iklim • Yoğun metropol trafiği (İstanbul, Bursa, Kocaeli) • Yaygın hızlı şarj ağı • Sürekli otoyol ve köprü geçişleri",
    ideal: [
      "Kendi kendini şarj eden hibrit ve elektrikli araçlar (dur-kalk trafiğinde sıfır sarfiyat)",
      "Konforlu otomatik şanzıman (yoğun trafikte sol ayak yorgunluğunu önler)",
      "Kompakt boyutlar – dar sokaklar ve kapalı otoparklarda kolay manevra",
      "Düşük şehir içi tüketim ve dur-kalkta rejeneratif frenleme"
    ],
    avoid: [
      "Manuel vitesli araçlar (İstanbul köprü trafiğinde debriyaj aşınması ve yorgunluk)",
      "Büyük Amerikan pick-up ve 5 metreyi aşan heybetli arazi araçları (park yeri sorunu)",
      "V8 ve yüksek tüketimli büyük motorlar"
    ],
    rules: [
      { t: c => c.fuel === "Hibrit", p: 26, l: "Hibrit – dur-kalkta sıfır tüketim" },
      { t: c => isEV(c), p: 26, l: "Elektrikli – Marmara'da yaygın şarj ağı" },
      { t: c => c.fuel === "Plug-in Hibrit", p: 16, l: "Şarj edilebilir hibrit" },
      { t: c => c.trans === "Otomatik", p: 15, l: "Otomatik vites konforu" },
      { t: c => c.trans === "Manuel", p: -12 },
      { t: c => small(c), p: 20, l: "Kompakt – kolay park" },
      { t: c => big(c), p: -18 },
      { t: c => !isEV(c) && c.cons > 9, p: -20 },
      { t: c => !isEV(c) && c.cons < 5.5, p: 12, l: "Düşük şehir içi tüketim" }
    ]
  },
  ege: {
    name: "Ege", emoji: "🫒",
    climate: "Ilıman Akdeniz iklimi • Virajlı sahil rotaları (Çeşme, Bodrum, Datça) • Zeytinlik ve yazlık köy yolları • İzmir yoğun şehir içi",
    ideal: [
      "Hibrit ve elektrikli araçlar (güneşli ve ılıman iklimde sıfır menzil kaybı)",
      "Crossover modeller – hem sahil otoyolunda konfor hem köy yollarında alt açıklığı",
      "Cabrio ve geniş cam tavanlı ferah araçlar",
      "Klima açıkken çekişten düşmeyen dengeli motorlar"
    ],
    avoid: [
      "Aşırı alçak gövdeye sahip süper sporlar (yazlık beldelerin dik kasisleri ve stabilize köy yolları)",
      "Ağır ve yüksek yakıt yakan eski nesil SUV'lar"
    ],
    rules: [
      { t: c => c.fuel === "Hibrit", p: 22, l: "Hibrit verimlilik" },
      { t: c => isEV(c), p: 18, l: "Elektrikli – ılıman iklimde tam menzil" },
      { t: c => c.cat === "Crossover", p: 15, l: "Şehir ve yazlık yol dengesi" },
      { t: c => c.cat === "Cabrio / Roadster", p: 15, l: "Sahil keyfi" },
      { t: c => c.clr >= 160, p: 9, l: "Köy ve plaj yoluna uygun yükseklik" },
      { t: c => c.comfort >= 7, p: 8, l: "Tatil yolunda konfor" },
      { t: c => c.trans === "Otomatik", p: 6 },
      { t: c => !isEV(c) && c.cons > 9, p: -18 },
      { t: c => c.clr < 125, p: -12 }
    ]
  },
  akdeniz: {
    name: "Akdeniz", emoji: "☀️",
    climate: "Çok sıcak ve nemli yazlar (42°C+) • Toros dağ geçitleri ve virajlı rampalar • Turizm transferleri ve yaygın seracılık",
    ideal: [
      "Güçlü klima performansı ve yüksek ısı yalıtımı",
      "Toros geçitlerinde nefesi kesilmeyen 130+ HP güçlü motor veya yüksek tork",
      "Seracılık, tarım ve otel taşımacılığı için dayanıklı pick-up ve hafif ticari araçlar",
      "Rölantide klima çalışırken motoru yormayan hibrit sistemler"
    ],
    avoid: [
      "100 HP altı zayıf atmosferik motorlar (yokuşta klima açıkken bayılır)",
      "Aşırı alçak tamponlu otomobiller"
    ],
    rules: [
      { t: c => c.fuel === "Hibrit", p: 22, l: "Hibrit – klima çalışırken verimli" },
      { t: c => isEV(c), p: 12, l: "Elektrikli – rölantide sessiz klima" },
      { t: c => c.comfort >= 8, p: 14, l: "Yüksek kabin ve klima konforu" },
      { t: c => c.hp >= 130, p: 12, l: "Toros dağ yolları için güçlü motor" },
      { t: c => c.hp < 100, p: -14 },
      { t: c => c.cat === "Pick-up", p: 12, l: "Seracılık ve tarım işleri" },
      { t: c => ["SUV", "Crossover"].includes(c.cat), p: 8, l: "Yüksek sürüş pozisyonu" },
      { t: c => c.clr < 130, p: -10 }
    ]
  },
  icanadolu: {
    name: "İç Anadolu", emoji: "🌾",
    climate: "Karasal iklim • Düz, geniş ve uzun otoyollar (Ankara, Konya, Kayseri, Eskişehir) • Soğuk sert kışlar ve kuru yazlar",
    ideal: [
      "Uzun yolda yüksek hız istikrarı ve fısıltı sessizliğinde kabin sunan Sedan ve Station Wagon'lar",
      "Uzun mesafe ekonomisi sağlayan dizel ve hibrit motorlar",
      "Kışın karlı ve buzlu yollarda savrulmayan AWD dört çeker veya dengeli şasi",
      "Geniş aile bagajı ve konforlu koltuklar"
    ],
    avoid: [
      "Küçük motorlu A/B sınıfı araçlar (otoyolda yan rüzgârdan etkilenir ve motor bağırır)",
      "Şarj menzili 400 km altı küçük elektrikli araçlar"
    ],
    rules: [
      { t: c => c.fuel === "Dizel", p: 24, l: "Dizel – uzun otoyol ekonomisi" },
      { t: c => c.fuel === "Hibrit", p: 15, l: "Hibrit ekonomi" },
      { t: c => ["Sedan", "Station Wagon"].includes(c.cat), p: 18, l: "Otoyolda dengeli & sessiz" },
      { t: c => c.comfort >= 8, p: 12, l: "Uzun yol konforu" },
      { t: c => c.top >= 200, p: 8, l: "Yüksek hız istikrarı" },
      { t: c => isAWD(c), p: 10, l: "Kış koşulları için AWD" },
      { t: c => isEV(c) && (c.range || 0) >= 500, p: 8, l: "Uzun menzilli EV" },
      { t: c => isEV(c) && (c.range || 0) < 450, p: -10 },
      { t: c => c.hp < 100, p: -12 }
    ]
  },
  karadeniz: {
    name: "Karadeniz", emoji: "🌧️",
    climate: "Yıl boyu yoğun yağmur ve kaygan asfalt • Aşırı dik yokuşlar ve virajlı dağlar • Dar yayla ve çay bahçesi yolları • Kışın yükseklerde ağır kar",
    ideal: [
      "AWD / 4x4 dört çeker sistemi (ıslak zeminde patinaja düşmeden viraj alma)",
      "Yüksek yerden yükseklik (200 mm+) – yayla ve taşlı yollarda altı vurmaz",
      "Dar köy yolları için manevrası kolay kompakt boyutlar",
      "Dik rampalarda bayılmayan yüksek tork (turbo benzinli veya dizel)"
    ],
    avoid: [
      "Arkadan itişli (RWD) alçak spor sedanlar (ıslak parke ve dik yokuşta kayma riski)",
      "Gövdesi yere çok yakın olan araçlar"
    ],
    rules: [
      { t: c => c.drive === "4x4", p: 34, l: "Gerçek 4x4 – yayla yollarında rakipsiz" },
      { t: c => c.drive === "AWD", p: 28, l: "AWD – yağışta maksimum yol tutuş" },
      { t: c => c.clr >= 200, p: 20, l: "Yüksek gövde – yayla yollarına uygun" },
      { t: c => c.clr >= 175 && c.clr < 200, p: 12, l: "Yüksek yerden yükseklik" },
      { t: c => ["Crossover", "SUV", "Arazi (4x4)"].includes(c.cat) && c.trunk < 750, p: 9, l: "Dar dağ yollarına kıvrak boyut" },
      { t: c => c.hp >= 130, p: 10, l: "Dik yokuşlar için yüksek güç" },
      { t: c => c.hp < 100, p: -15 },
      { t: c => c.clr < 140, p: -25 },
      { t: c => c.drive === "RWD", p: -18 }
    ]
  },
  dogu: {
    name: "Doğu Anadolu", emoji: "❄️",
    climate: "Türkiye'nin en sert kışı (-35°C) • 5 ay karlı zemin ve buzlanma • Yüksek rakım (1800m+) • Seyrek yetkili servis ağı • Engebeli stabilize yollar",
    ideal: [
      "4x4 / AWD çekiş sistemi (karda yolda kalmamak için şart)",
      "200 mm üzerinde yüksek yerden yükseklik (kar küreme öncesi ilerleme)",
      "Dondurucu soğukta güvenilir benzinli veya dayanıklı dizel mekanik",
      "Her yerde tamiri yapılabilen basit, yedek parçası ucuz araçlar"
    ],
    avoid: [
      "Elektrikli araçlar (-25°C derecede %35 menzil kaybı, yavaş şarj ve seyrek şarj istasyonu)",
      "Alçak gövde ve narin lüks elektronik süspansiyonlar",
      "Arkadan itiş (karda rampada kalır)"
    ],
    rules: [
      { t: c => c.drive === "4x4", p: 38, l: "4x4 – ağır kış şartlarında vazgeçilmez" },
      { t: c => c.drive === "AWD", p: 28, l: "AWD – buzda üstün çekiş" },
      { t: c => c.clr >= 200, p: 22, l: "Derin karda altı oturmayan yükseklik" },
      { t: c => c.clr >= 175 && c.clr < 200, p: 12, l: "Yüksek gövde" },
      { t: c => c.fuel === "Dizel", p: 12, l: "Dizel – yüksek tork" },
      { t: c => isEV(c), p: -30 },
      { t: c => c.fuel === "Plug-in Hibrit", p: -10 },
      { t: c => c.clr < 145, p: -28 },
      { t: c => c.drive === "RWD", p: -20 },
      { t: c => c.maint <= 2, p: 8, l: "Yaygın servis & basit mekanik" }
    ]
  },
  guneydogu: {
    name: "Güneydoğu Anadolu", emoji: "🏜️",
    climate: "Aşırı sıcak ve kuru yazlar (45°C) • Tozlu ve taşlı köy-tarım yolları • Uzun mesafeli şehirlerarası ulaşım • Tarım ve ticaret odaklı kullanım",
    ideal: [
      "Dayanıklı, basit ve ucuz parçalı yürüyen aksam (Fiat Egea, Toyota, Duster)",
      "Tarım, inşaat ve yük için 4x4 Pick-up modelleri (Hilux, Ranger)",
      "Uzun mesafede az yakan dizel motorlar",
      "Tozlu ve bozuk yollarda sürtmeyen yüksek alt açıklık"
    ],
    avoid: [
      "Elektrikli araçlar (kırsalda kısıtlı şarj altyapısı ve aşırı sıcakta klima tüketimi)",
      "Bakımı ve parçası pahalı egzotik araçlar",
      "Alçak spor otomobiller"
    ],
    rules: [
      { t: c => c.fuel === "Dizel", p: 22, l: "Dizel – uzun mesafe ekonomisi" },
      { t: c => c.fuel === "Hibrit", p: 8, l: "Hibrit tasarruf" },
      { t: c => isEV(c), p: -20 },
      { t: c => c.cat === "Pick-up", p: 18, l: "Tarım, arazi ve yük taşıma" },
      { t: c => c.maint === 1, p: 12, l: "Parça her mahallede & en ucuz bakım" },
      { t: c => c.resale === 5, p: 8 },
      { t: c => c.clr >= 170, p: 12, l: "Taşlı ve bozuk yollara uygun" },
      { t: c => c.clr < 135, p: -16 },
      { t: c => ["Sedan", "Hafif Ticari"].includes(c.cat) && c.price < 2.5e6, p: 12, l: "Bölgede en çok tutulan ve aranan sınıf" }
    ]
  }
};

function regionRaw(c, key) {
  let raw = 0;
  const why = [];
  [...REGIONS[key].rules, ...commonRules].forEach(r => {
    if (r.t(c)) {
      raw += r.p;
      if (r.l && r.p > 0) why.push([r.p, r.l]);
    }
  });
  return { raw, why: why.sort((a, b) => b[0] - a[0]).map(x => x[1]) };
}

const regionCache = {};
function regionScores(key) {
  if (regionCache[key]) return regionCache[key];
  const list = CARS.map(c => ({ c, ...regionRaw(c, key) }));
  const mn = Math.min(...list.map(x => x.raw)), mx = Math.max(...list.map(x => x.raw));
  list.forEach(x => {
    x.score = Math.round(30 + 68 * ((x.raw - mn) / (mx - mn)));
  });
  return (regionCache[key] = list.sort((a, b) => b.score - a.score));
}
const regionScoreOf = (c, key) => regionScores(key).find(x => x.c.id === c.id);

/* ---------------------------------------------------------
   RENDER: HERO & ASİSTAN
   --------------------------------------------------------- */
function renderHero() {
  $("#heroStats").innerHTML = `
    <div><b>${CARS.length}+</b><span>Model</span></div>
    <div><b>${Object.keys(BRANDS).length}</b><span>Marka</span></div>
    <div><b>${Object.keys(ISSUES).length}</b><span>Kronik Arıza</span></div>
    <div><b>7</b><span>Bölge Analizi</span></div>`;

  $("#fBudget").innerHTML = BUDGETS.map(b =>
    `<option value="${b.max}">${b.name} (${b.max === Infinity ? "Sınırsız" : "≤ " + fmtTL(b.max)})</option>`
  ).join("");
  $("#fBudget").selectedIndex = 1;

  $("#fRegion").innerHTML = Object.entries(REGIONS).map(([k, r]) =>
    `<option value="${k}">${r.emoji} ${r.name}</option>`
  ).join("");

  $("#finder").addEventListener("submit", e => {
    e.preventDefault();
    const max = +$("#fBudget").value;
    const reg = $("#fRegion").value;
    const pr = $("#fPriority").value;

    const prioMap = {
      eco: ecoScore,
      reliable: reliabilityScore,
      comfort: comfortScore,
      speed: perfScore,
      family: familyScore
    };
    const prioFn = prioMap[pr] || ecoScore;

    const res = CARS.filter(c => c.price <= max)
      .map(c => ({
        c,
        s: regionScoreOf(c, reg).score * 0.4 + prioFn(c) * 0.6
      }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 4);

    $("#finderResult").innerHTML = res.length
      ? res.map((x, i) => `
        <div class="mini" data-car="${x.c.id}">
          <span class="rank">${i + 1}</span>
          <div style="flex:1">
            <b>${carName(x.c)}</b>
            <small>${x.c.cat} • ${x.c.fuel} • ${fmtTL(x.c.price)}</small>
          </div>
          <b style="color:var(--green)">%${Math.round(x.s)} Uyum</b>
        </div>`).join("")
      : `<p class="muted-sm">Bu bütçe aralığında araç bulunamadı.</p>`;
  });
}

/* ---------------------------------------------------------
   RENDER: KATALOG
   --------------------------------------------------------- */
let filterPillState = { favOnly: false, hybridEV: false, awdOnly: false, lowRiskOnly: false };

function initCatalog() {
  const uniq = arr => [...new Set(arr)].filter(Boolean);

  // Markalar
  $("#qBrand").innerHTML = `<option value="">Tüm Markalar</option>` +
    Object.keys(BRANDS).sort((a, b) => a.localeCompare(b, "tr")).map(b => `<option>${b}</option>`).join("");

  // Kategoriler
  $("#qCat").innerHTML = `<option value="">Tüm Kasa Tipleri</option>` +
    Object.keys(CATEGORIES).map(c => `<option>${c}</option>`).join("");

  // Yakıtlar
  $("#qFuel").innerHTML = `<option value="">Tüm Yakıt Tipleri</option>` +
    uniq(CARS.map(c => c.fuel)).map(f => `<option>${f}</option>`).join("");

  // Bütçeler
  $("#qBudget").innerHTML = `<option value="">Tüm Bütçeler</option>` +
    BUDGETS.map(b => `<option value="${b.key}">${b.name}</option>`).join("");

  // Event Listeners
  ["qSearch", "qBrand", "qCat", "qFuel", "qBudget", "qDrive", "qTrans", "qChronic", "qSort"].forEach(id => {
    const el = $("#" + id);
    if (el) el.addEventListener("input", renderCatalog);
  });

  // Hızlı hap butonları (Quick pills)
  $("#pillFavOnly").onclick = () => {
    filterPillState.favOnly = !filterPillState.favOnly;
    $("#pillFavOnly").classList.toggle("active", filterPillState.favOnly);
    renderCatalog();
  };
  $("#pillHybridEV").onclick = () => {
    filterPillState.hybridEV = !filterPillState.hybridEV;
    $("#pillHybridEV").classList.toggle("active", filterPillState.hybridEV);
    renderCatalog();
  };
  $("#pillAWD").onclick = () => {
    filterPillState.awdOnly = !filterPillState.awdOnly;
    $("#pillAWD").classList.toggle("active", filterPillState.awdOnly);
    renderCatalog();
  };
  $("#pillLowRisk").onclick = () => {
    filterPillState.lowRiskOnly = !filterPillState.lowRiskOnly;
    $("#pillLowRisk").classList.toggle("active", filterPillState.lowRiskOnly);
    renderCatalog();
  };

  $("#qReset").onclick = () => {
    $$(".filters select, .filters input").forEach(el => {
      if (el.id === "qSort") el.value = "price-asc";
      else el.value = "";
    });
    filterPillState = { favOnly: false, hybridEV: false, awdOnly: false, lowRiskOnly: false };
    $$(".filter-pill").forEach(p => p.classList.remove("active"));
    renderCatalog();
  };

  renderCatalog();
}

function renderCatalog() {
  const q = ($("#qSearch")?.value || "").toLocaleLowerCase("tr");
  const br = $("#qBrand")?.value || "";
  const cat = $("#qCat")?.value || "";
  const fu = $("#qFuel")?.value || "";
  const bu = $("#qBudget")?.value || "";
  const dr = $("#qDrive")?.value || "";
  const tr = $("#qTrans")?.value || "";
  const ch = $("#qChronic")?.value || "";
  const so = $("#qSort")?.value || "price-asc";

  let list = CARS.filter(c => {
    // Arama
    const fullSearchText = `${c.brand} ${c.model} ${c.cat} ${c.segment || ""} ${c.fuel}`.toLocaleLowerCase("tr");
    if (q && !fullSearchText.includes(q)) return false;
    // Marka
    if (br && c.brand !== br) return false;
    // Kategori
    if (cat && c.cat !== cat) return false;
    // Yakıt
    if (fu && c.fuel !== fu) return false;
    // Bütçe
    if (bu && budgetOf(c.price).key !== bu) return false;
    // Çekiş
    if (dr) {
      if (dr === "AWD" && !isAWD(c)) return false;
      if (dr !== "AWD" && c.drive !== dr) return false;
    }
    // Vites
    if (tr && c.trans !== tr) return false;
    // Kronik Filtresi
    if (ch === "low" && (c.issues?.length || 0) > 0) return false;
    if (ch === "warn" && (c.issues?.length || 0) === 0) return false;
    // Quick pills
    if (filterPillState.favOnly && !userFavorites.has(c.id)) return false;
    if (filterPillState.hybridEV && !["Hibrit", "Plug-in Hibrit", "Elektrik"].includes(c.fuel)) return false;
    if (filterPillState.awdOnly && !isAWD(c)) return false;
    if (filterPillState.lowRiskOnly && (c.issues?.length || 0) > 0) return false;

    return true;
  });

  // Sıralama
  const sorters = {
    "price-asc":  (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    eco:          (a, b) => ecoScore(b) - ecoScore(a),
    comfort:      (a, b) => b.comfort - a.comfort || a.price - b.price,
    speed:        (a, b) => a.acc - b.acc,
    hp:           (a, b) => b.hp - a.hp,
    name:         (a, b) => carName(a).localeCompare(carName(b), "tr")
  };
  list.sort(sorters[so] || sorters["price-asc"]);

  $("#resultCount").textContent = `${list.length} araç listeleniyor`;
  $("#catalogGrid").innerHTML = list.length
    ? list.map(carCard).join("")
    : `<div style="grid-column:1/-1;text-align:center;padding:50px 20px">
        <p style="font-size:2.5rem;margin-bottom:8px">🔍</p>
        <h4>Aradığınız kriterlere uygun araç bulunamadı</h4>
        <p class="muted">Filtreleri sıfırlayarak veya arama teriminizi değiştirerek tekrar deneyebilirsiniz.</p>
        <button class="btn btn-ghost" onclick="$('#qReset').click()">Filtreleri Sıfırla</button>
      </div>`;
}

function filterCatalog(field, value) {
  $("#qReset").click();
  if (field && value !== undefined) {
    const el = $("#" + field);
    if (el) el.value = value;
  }
  renderCatalog();
  $("#katalog").scrollIntoView({ behavior: "smooth" });
}

/* ---------------------------------------------------------
   RENDER: KATEGORİLER
   --------------------------------------------------------- */
function renderCategories() {
  $("#catGrid").innerHTML = Object.entries(CATEGORIES).map(([name, m]) => {
    const list = CARS.filter(c => c.cat === name);
    const prices = list.map(c => c.price);
    return `
      <div class="cat" data-cat="${name}">
        ${carSVG(m.icon, hue(name))}
        <h3>${name} <span>${list.length} model</span></h3>
        <p>${m.desc}</p>
        ${list.length ? `
          <div class="range">💰 ${fmtTL(Math.min(...prices))} – ${fmtTL(Math.max(...prices))}</div>
          <div class="tags" style="margin-top:10px">
            ${list.slice(0, 3).map(c => `<span class="tag">${c.brand} ${c.model.split(" ")[0]}</span>`).join("")}
          </div>` : ""}
      </div>`;
  }).join("");

  $$(".cat").forEach(el => el.onclick = () => filterCatalog("qCat", el.dataset.cat));
}

/* ---------------------------------------------------------
   RENDER: MARKALAR
   --------------------------------------------------------- */
const TIERS = ["Tümü", "Bütçe", "Ana Akım", "Premium", "Lüks", "Egzotik"];
function renderBrands(tier = "Tümü") {
  $("#tierTabs").innerHTML = TIERS.map(t =>
    `<button class="tab ${t === tier ? "active" : ""}" data-tier="${t}">${t}</button>`
  ).join("");

  $$("#tierTabs .tab").forEach(b => b.onclick = () => renderBrands(b.dataset.tier));

  const entries = Object.entries(BRANDS).filter(([, m]) => tier === "Tümü" || m.tier === tier);
  $("#brandGrid").innerHTML = entries.map(([name, m]) => {
    const list = CARS.filter(c => c.brand === name);
    const pr = list.map(c => c.price);
    return `
      <div class="brand" data-brand="${name}">
        <span class="flag">${m.flag}</span>
        <h4>${name}</h4>
        <small>${m.country} • ${m.tier}</small><br>
        <small>${list.length} model ${pr.length ? `• ${fmtTL(Math.min(...pr))}+` : ""}</small>
      </div>`;
  }).join("");

  $$(".brand").forEach(el => el.onclick = () => showBrand(el.dataset.brand));
}

function showBrand(name) {
  $$(".brand").forEach(b => b.classList.toggle("active", b.dataset.brand === name));
  const m = BRANDS[name];
  const list = CARS.filter(c => c.brand === name).sort((a, b) => a.price - b.price);
  const cats = [...new Set(list.map(c => c.cat))];

  $("#brandDetail").innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
        <div>
          <h3>${m.flag} ${name}</h3>
          <p class="muted" style="margin:4px 0 10px">${m.country} • Konumlandırma: <b>${m.tier} Sınıf</b></p>
        </div>
        <button class="btn btn-primary" onclick="filterCatalog('qBrand', '${name}')">Katalogda Filtrele</button>
      </div>
      <p style="color:var(--text-soft)">${m.desc}</p>
      <div class="tags" style="margin-top:14px">
        ${cats.map(c => `<span class="tag">${c}: ${list.filter(x => x.cat === c).length} Model</span>`).join("")}
      </div>

      <div class="table-wrap">
        <table class="model-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Kasa</th>
              <th>Yakıt</th>
              <th>Güç & Tork</th>
              <th>0-100</th>
              <th>Tüketim</th>
              <th>Kronik Durumu</th>
              <th>Fiyat</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(c => `
              <tr data-car="${c.id}">
                <td><b>${c.model}</b></td>
                <td>${c.cat}</td>
                <td><span class="tag fuel-${c.fuel.split(" ")[0]}">${c.fuel}</span></td>
                <td>${c.hp} HP / ${c.torque || "—"} Nm</td>
                <td>${c.acc} s</td>
                <td>${consLabel(c)}</td>
                <td>
                  ${(c.issues?.length || 0) > 0 
                    ? `<span style="color:#fbbf24;font-size:.78rem">⚠️ ${c.issues.length} Uyarı</span>` 
                    : `<span style="color:#4ade80;font-size:.78rem">🛡️ Düşük Risk</span>`}
                </td>
                <td><b style="color:var(--accent2)">${fmtTL(c.price)}</b></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`;

  $("#brandDetail").scrollIntoView({ block: "nearest", behavior: "smooth" });
}

/* ---------------------------------------------------------
   RENDER: KRONİK SORUNLAR ANSİKLOPEDİSİ
   --------------------------------------------------------- */
function renderChronicIssues() {
  const grid = $("#chronicGrid");
  if (!grid) return;

  grid.innerHTML = Object.entries(ISSUES).map(([k, item]) => {
    const sevLabel = item.sev === 3 ? "Ciddi Arıza Riski" : item.sev === 2 ? "Orta Masraf Riski" : "Hafif / Takip";
    return `
      <div class="chronic-card">
        <div class="chronic-head">
          <h3>${item.title}</h3>
          <span class="sev-pill sev-${item.sev}">${sevLabel}</span>
        </div>
        <div class="chronic-meta">
          <span>Kategori: <b>${item.area}</b></span>
          <span>Tahmini Masraf: <b style="color:#f87171">${item.cost}</b></span>
        </div>
        <p class="chronic-desc">${item.desc}</p>
        <div class="chronic-tip">
          <b>🔧 Usta ve Satın Alma Tavsiyesi:</b>
          ${item.solution}
        </div>
      </div>`;
  }).join("");
}

/* ---------------------------------------------------------
   RENDER: BÜTÇE
   --------------------------------------------------------- */
function bestBy(list, fn) { return [...list].sort((a, b) => fn(b) - fn(a))[0]; }

function renderBudgets() {
  $("#budgetBar").innerHTML = BUDGETS.map(b => {
    const n = CARS.filter(c => budgetOf(c.price).key === b.key).length;
    return `
      <div class="bseg" style="border-top-color:${b.color}" data-goto="b-${b.key}">
        <b>${b.name}</b>
        <small>${b.max === Infinity ? fmtTL(b.min) + " +" : (b.min ? fmtTL(b.min) : "0 ₺") + " – " + fmtTL(b.max)}</small><br>
        <small style="color:var(--text)">${n} Araç</small>
      </div>`;
  }).join("");

  $$(".bseg").forEach(el => el.onclick = () => {
    const target = $("#" + el.dataset.goto);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });

  $("#budgetList").innerHTML = BUDGETS.map(b => {
    const list = CARS.filter(c => budgetOf(c.price).key === b.key).sort((x, y) => x.price - y.price);
    if (!list.length) return "";
    const e = bestBy(list, ecoScore);
    const k = bestBy(list, c => c.comfort * 10 - c.price / 1e7);
    const p = bestBy(list, perfScore);

    return `
      <div class="budget-block" id="b-${b.key}">
        <div class="budget-block-head">
          <div>
            <h3><span class="dot" style="background:${b.color}"></span>${b.name}</h3>
            <p>${b.max === Infinity ? fmtTL(b.min) + " ve üzeri" : (b.min ? fmtTL(b.min) : "0 ₺") + " – " + fmtTL(b.max)} • ${b.desc}</p>
          </div>
          <span class="muted" style="margin:0">${list.length} Araç</span>
        </div>

        <div class="best-picks">
          <div class="pick" data-car="${e.id}">
            <small>💰 En Ekonomik Seçim</small>
            <b>${carName(e)}</b>
            <span>Ekonomi Puanı: ${ecoScore(e)}/100 • ${consLabel(e)}/100km</span>
          </div>
          <div class="pick" data-car="${k.id}">
            <small>🛋️ En Konforlu Seçim</small>
            <b>${carName(k)}</b>
            <span>Konfor: ${k.comfort}/10 Puan</span>
          </div>
          <div class="pick" data-car="${p.id}">
            <small>🏁 En Hızlı Seçim</small>
            <b>${carName(p)}</b>
            <span>0-100: ${p.acc} s • ${p.hp} HP</span>
          </div>
        </div>

        <div class="hscroll">
          ${list.map(carCard).join("")}
        </div>
      </div>`;
  }).join("");
}

/* ---------------------------------------------------------
   RENDER: BÖLGESEL KULLANIŞLILIK
   --------------------------------------------------------- */
let currentRegion = "marmara", regionBudget = "";
function renderRegions() {
  $("#regionTabs").innerHTML = Object.entries(REGIONS).map(([k, r]) =>
    `<button class="tab ${k === currentRegion ? "active" : ""}" data-reg="${k}">${r.emoji} ${r.name}</button>`
  ).join("");

  $$("#regionTabs .tab").forEach(b => b.onclick = () => {
    currentRegion = b.dataset.reg;
    renderRegions();
  });

  const r = REGIONS[currentRegion];
  const list = regionScores(currentRegion)
    .filter(x => !regionBudget || budgetOf(x.c.price).key === regionBudget)
    .slice(0, 10);

  $("#regionPanel").innerHTML = `
    <div class="card region-info">
      <h3>${r.emoji} ${r.name} Bölgesi</h3>
      <p class="clim">${r.climate}</p>
      <label>Bütçe Filtresi
        <select id="regBudget">
          <option value="">Tüm Bütçeler</option>
          ${BUDGETS.map(b => `<option value="${b.key}" ${b.key === regionBudget ? "selected" : ""}>${b.name}</option>`).join("")}
        </select>
      </label>
      <h4>✅ Bölge İçin İdeal Nitelikler</h4>
      <ul>${r.ideal.map(i => `<li>${i}</li>`).join("")}</ul>
      <h4>⚠️ Kaçınılması Gereken Özellikler</h4>
      <ul class="avoid">${r.avoid.map(i => `<li>${i}</li>`).join("")}</ul>
    </div>

    <div class="region-list">
      ${list.map((x, i) => `
        <div class="rcar" data-car="${x.c.id}">
          <span class="rank">${i + 1}</span>
          <img class="rcar-thumb" src="${x.c.img}" alt="${carName(x.c)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'" />
          <div>
            <h4>${carName(x.c)}</h4>
            <small class="muted">${x.c.cat} • ${x.c.fuel} • ${x.c.drive} • ${fmtTL(x.c.price)}</small>
            <div class="why">${x.why.slice(0, 4).map(w => `<span>${w}</span>`).join("")}</div>
          </div>
          <div class="rscore">
            <b>%${x.score}</b>
            <small>uygunluk</small>
          </div>
        </div>`).join("") || `<p class="muted">Bu bütçede uygun araç bulunamadı.</p>`}
    </div>`;

  $("#regBudget").onchange = e => {
    regionBudget = e.target.value;
    renderRegions();
  };
}

/* ---------------------------------------------------------
   RENDER: EKONOMİ SİMÜLATÖRÜ
   --------------------------------------------------------- */
function initEconomy() {
  $("#eBudget").innerHTML = BUDGETS.map(b =>
    `<option value="${b.max}">≤ ${b.max === Infinity ? "Sınırsız" : fmtTL(b.max)}</option>`
  ).join("");
  $("#eBudget").selectedIndex = 2;

  ["eKm", "eGas", "eDiesel", "eElec", "eBudget"].forEach(id => {
    $("#" + id).addEventListener("input", () => {
      econ.km = +$("#eKm").value || 15000;
      econ.gas = +$("#eGas").value || 52;
      econ.diesel = +$("#eDiesel").value || 54;
      econ.elec = +$("#eElec").value || 7;
      computeRanges();
      renderEconomy();
      renderCatalog();
    });
  });

  renderEconomy();
}

function renderEconomy() {
  const max = +$("#eBudget").value;
  const list = CARS.filter(c => c.price <= max)
    .map(c => ({ c, a: annualCost(c) }))
    .sort((x, y) => x.a.total - y.a.total)
    .slice(0, 10);

  $("#ecoTable").innerHTML = list.map((x, i) => `
    <div class="eco-row" data-car="${x.c.id}">
      <span class="rank">${i + 1}</span>
      <div>
        <h5>${carName(x.c)}</h5>
        <small>Yakıt ${fmtTL(x.a.fuel)} • Bakım ${fmtTL(x.a.maint)} • Değer Kaybı ${fmtTL(x.a.depr)} • <b>${x.a.perKm.toFixed(2)} ₺/km</b></small>
      </div>
      <div class="cost">
        <b>${fmtTL(x.a.total)}</b>
        <small>/ yıl toplam</small>
      </div>
    </div>`).join("");

  const group = keyFn => {
    const g = {};
    CARS.forEach(c => {
      const k = keyFn(c);
      (g[k] = g[k] || []).push(annualCost(c).run);
    });
    return Object.entries(g)
      .map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length])
      .sort((a, b) => a[1] - b[1]);
  };

  const bars = arr => {
    const mx = Math.max(...arr.map(x => x[1]));
    return arr.map(([k, v]) => `
      <div class="cls">
        <span>${k}</span>
        <div class="track"><div class="fill" style="width:${(v / mx) * 100}%"></div></div>
        <b>${fmtTL(v)}</b>
      </div>`).join("");
  };

  $("#ecoClasses").innerHTML = `
    <p class="muted-sm" style="margin-top:0">Yıllık ortalama yakıt + periyodik bakım gideri (değer kaybı hariç)</p>
    <h4 style="margin:12px 0 8px">Yakıt Tipine Göre</h4>
    ${bars(group(c => c.fuel))}
    <h4 style="margin:18px 0 8px">Kasa Tipine Göre</h4>
    ${bars(group(c => c.cat))}`;
}

/* ---------------------------------------------------------
   RENDER: KONFOR & HIZ
   --------------------------------------------------------- */
function miniList(list, valFn) {
  return list.map((c, i) => `
    <div class="mini" data-car="${c.id}" style="margin-bottom:8px">
      <span class="rank">${i + 1}</span>
      <div style="flex:1">
        <b>${carName(c)}</b>
        <small>${c.cat} • ${fmtTL(c.price)}</small>
      </div>
      <b>${valFn(c)}</b>
    </div>`).join("");
}

function renderComfort() {
  const lux = [...CARS].sort((a, b) => b.comfort - a.comfort || b.price - a.price).slice(0, 7);
  const afford = CARS.filter(c => c.price < 4e6).sort((a, b) => b.comfort - a.comfort || a.price - b.price).slice(0, 7);
  const fam = CARS.filter(c => c.seats >= 5 && c.price < 1e7).sort((a, b) => familyScore(b) - familyScore(a)).slice(0, 7);

  $("#comfortCols").innerHTML = `
    <div class="card col-card">
      <h3>👑 Lüks Sınıf Konfor Liderleri</h3>
      <p>Havalı süspansiyon, çift katmanlı akustik camlar, masajlı napa deri koltuklar.</p>
      ${miniList(lux, c => c.comfort + " / 10 Puan")}
    </div>
    <div class="card col-card">
      <h3>💎 Uygun Fiyatlı Konfor Şampiyonları</h3>
      <p>4 Mn ₺ altında, sınıf standartlarının üzerinde sessizlik ve süspansiyon darbe emişi.</p>
      ${miniList(afford, c => c.comfort + " / 10 Puan")}
    </div>
    <div class="card col-card">
      <h3>👨‍👩‍👧 Aile & Uzun Yol Konforu</h3>
      <p>Geniş arka koltuk diz mesafesi, devasa bagaj hacmi ve yormayan sürüş.</p>
      ${miniList(fam, c => c.trunk + " L Bagaj")}
    </div>`;
}

function renderSpeed() {
  const cheap = CARS.filter(c => c.price < 4.2e6).sort((a, b) => a.acc - b.acc).slice(0, 7);
  const prem = CARS.filter(c => c.price >= 4.2e6 && c.price < 22e6).sort((a, b) => a.acc - b.acc).slice(0, 7);
  const exo = [...CARS].sort((a, b) => b.top - a.top).slice(0, 7);

  $("#speedCols").innerHTML = `
    <div class="card col-card">
      <h3>🔥 Bütçe Dostu Hız & Hot-Hatch</h3>
      <p>4.2 Mn ₺ altında en çevik ivmelenen makineler. Elektriklilerin anlık torku ve GTI efsaneleri.</p>
      ${miniList(cheap, c => c.acc + " s (0-100)")}
    </div>
    <div class="card col-card">
      <h3>⚡ Premium Performans</h3>
      <p>Günlük kullanım konforu ile süper spor performansını birleştiren M, RS ve AMG dünyası.</p>
      ${miniList(prem, c => c.acc + " s (0-100)")}
    </div>
    <div class="card col-card">
      <h3>🏎️ En Yüksek Azami Sürat</h3>
      <p>Pist günleri ve otoban fatihleri için 300+ km/s azami sürat şampiyonları.</p>
      ${miniList(exo, c => c.top + " km/s")}
    </div>`;

  const top15 = [...CARS].sort((a, b) => a.acc - b.acc).slice(0, 15);
  const worstAcc = 14;
  $("#speedChart").innerHTML = top15.map(c => `
    <div class="bar" data-car="${c.id}">
      <span>${carName(c)}</span>
      <div class="track"><div class="fill" style="width:${((worstAcc - c.acc) / (worstAcc - 2.5)) * 100}%"></div></div>
      <b>${c.acc} s</b>
    </div>`).join("");
}

/* ---------------------------------------------------------
   MODAL: DETAY SAYFASI, KRONİK RAPORU & KULLANICI YORUMLARI
   --------------------------------------------------------- */
function openModal(html) {
  $("#modalContent").innerHTML = html;
  $("#modal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $$(".modal").forEach(m => m.classList.remove("show"));
  document.body.style.overflow = "";
}

function showDetail(id) {
  const c = CARS.find(x => x.id === id);
  if (!c) return;
  const b = budgetOf(c.price);
  const a = annualCost(c);
  const isFav = userFavorites.has(c.id);
  const isCmp = compare.includes(c.id);
  const regs = Object.keys(REGIONS)
    .map(k => ({ k, s: regionScoreOf(c, k).score }))
    .sort((x, y) => y.s - x.s);
  const similar = CARS.filter(x => x.id !== c.id && x.cat === c.cat)
    .sort((x, y) => Math.abs(x.price - c.price) - Math.abs(y.price - c.price))
    .slice(0, 3);

  // Kronik detaylarını topla
  const issueDetails = (c.issues || []).map(key => ISSUES[key] || {
    title: key,
    sev: 2,
    area: "Genel Mekanik",
    cost: "Değişken",
    desc: "Bu model için kronik şikâyet bildirilmiştir.",
    solution: "Periyodik bakımda kontrol ettiriniz."
  });

  // Topluluk yorumları
  const carReviews = allReviews.filter(r => r.carId === c.id);

  openModal(`
    <div class="detail-hero">
      <div class="detail-media">
        <img class="detail-real-img" src="${c.img}" alt="${carName(c)}"
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80'" />
      </div>
      <div class="detail-head-content">
        <small class="muted">${BRANDS[c.brand]?.flag || "🚗"} ${c.brand} • ${BRANDS[c.brand]?.tier || "Otomobil"}</small>
        <h2>${c.model}</h2>
        <div class="detail-meta-row">
          <span class="tag" style="color:${b.color};border-color:${b.color}">● ${b.name}</span>
          <span class="tag">${c.cat}</span>
          <span class="tag">${c.segment || "Binek"}</span>
          <span class="tag fuel-${c.fuel.split(" ")[0]}">${c.fuel}</span>
          <span class="tag">${c.trans}</span>
        </div>
        <div class="detail-price">${fmtTL(c.price)}</div>
        <div class="detail-actions">
          <button class="btn btn-primary" onclick="toggleFavorite(${c.id}); showDetail(${c.id});">
            ${isFav ? "❤️ Favorilerden Çıkar" : "🤍 Favorilere Ekle"}
          </button>
          <button class="btn btn-ghost" onclick="toggleCompare(${c.id}); showDetail(${c.id});">
            ${isCmp ? "⚖️ Karşılaştırmadan Çıkar" : "⚖️ Karşılaştır"}
          </button>
        </div>
      </div>
    </div>

    <!-- KRONİK ARIZA & UYARI KUTUSU -->
    <div class="detail-warning-box">
      <h4>⚠️ Kronik Sıkıntılar & Dikkat Edilmesi Gereken Noktalar</h4>
      ${issueDetails.length ? issueDetails.map(iss => `
        <div class="chronic-item-modal">
          <div class="chronic-modal-head">
            <b>${iss.title}</b>
            <div style="display:flex;gap:6px">
              <span class="sev-pill sev-${iss.sev}">${iss.sev === 3 ? "Ciddi Risk" : iss.sev === 2 ? "Orta Risk" : "Hafif"}</span>
              <span class="chronic-cost-pill">${iss.cost}</span>
            </div>
          </div>
          <p class="chronic-modal-desc">${iss.desc}</p>
          <div class="chronic-modal-solution">
            <b>🔧 Usta / Ekspertiz Tavsiyesi:</b> ${iss.solution}
          </div>
        </div>`).join("")
      : `<p style="color:#86efac;font-size:.9rem;margin:0">
          🛡️ <b>Mükemmel Güvenilirlik:</b> Bu araç için kritik bir mekanik veya şanzıman kronik arızası bildirilmemiştir.
         </p>`}
    </div>

    <!-- ÇOK İYİ & ÖNE ÇIKAN ÖZELLİKLERİ -->
    <div class="detail-star-box">
      <h4>⭐ Çok İyi & Öne Çıkan Yıldız Özellikleri</h4>
      <ul class="star-list">
        ${(c.highlights || []).map(hl => `<li>${hl}</li>`).join("") || "<li>Sınıfında dengeli ve ekonomik bir seçenek.</li>"}
      </ul>
    </div>

    <!-- TEKNİK VERİ TABLOSU -->
    <h4 style="margin:20px 0 10px">📊 Detaylı Teknik Özellikler</h4>
    <div class="spec-grid">
      <div><small>Motor Gücü</small><b>${c.hp} HP</b></div>
      <div><small>Tork Değeri</small><b>${c.torque || "—"} Nm</b></div>
      <div><small>0-100 km/s Hızlanma</small><b>${c.acc} saniye</b></div>
      <div><small>Azami Sürat</small><b>${c.top} km/s</b></div>
      <div><small>Ortalama Tüketim</small><b>${consLabel(c)} / 100km</b></div>
      <div><small>Çekiş Sistemi</small><b>${c.drive}</b></div>
      <div><small>Şanzıman Tipi</small><b>${c.trans}</b></div>
      <div><small>Yerden Yükseklik</small><b>${c.clr} mm</b></div>
      <div><small>Bagaj Hacmi</small><b>${c.trunk} Litre</b></div>
      <div><small>Oturma Kapasitesi</small><b>${c.seats} Kişilik</b></div>
      <div><small>Yıllık Yakıt Masrafı</small><b>${fmtTL(a.fuel)}</b></div>
      <div><small>Yıllık Toplam Sahip Olma</small><b style="color:var(--green)">${fmtTL(a.total)}</b></div>
    </div>

    <div class="verdict">
      <div class="card">
        <h4 style="margin-bottom:8px">👍 Artıları</h4>
        <ul class="pro">
          ${(c.pros || []).map(p => `<li>${p}</li>`).join("")}
        </ul>
      </div>
      <div class="card">
        <h4 style="margin-bottom:8px">👎 Eksileri</h4>
        <ul class="con">
          ${(c.cons || []).map(con => `<li>${con}</li>`).join("")}
        </ul>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <h4>🗺️ Türkiye 7 Bölge Uygunluk Analizi</h4>
      <p class="muted-sm" style="margin-bottom:12px">İklim, rakım ve yol durumuna göre bu aracın bölgelerdeki verimlilik puanı:</p>
      <div class="scores">
        ${regs.map(r => scoreRow(
          REGIONS[r.k].name,
          r.s,
          r.s >= 75 ? "#22c55e" : r.s >= 55 ? "#eab308" : "#ef4444"
        )).join("")}
      </div>
    </div>

    ${similar.length ? `
      <div class="card" style="margin-top:16px">
        <h4>🔁 Benzer Kasa & Fiyat Alternatifleri</h4>
        <div style="margin-top:12px">${miniList(similar, x => fmtTL(x.price))}</div>
      </div>` : ""}

    <!-- TOPLULUK YORUMLARI & KRONİK GERİ BİLDİRİM FORMU -->
    <div class="reviews-section">
      <div class="reviews-head">
        <h4>👥 Gerçek Kullanıcı Deneyimleri & Kronik Raporları (${carReviews.length})</h4>
        <span class="tag">Topluluk Doğrulamalı</span>
      </div>

      <div class="reviews-list">
        ${carReviews.length ? carReviews.map(r => `
          <div class="review-card">
            <div class="review-header">
              <span class="review-user">
                ${r.userName} 
                <small>• ${r.city || "Türkiye"} ${r.km ? `• ${r.km}` : ""} ${r.date ? `• ${r.date}` : ""}</small>
              </span>
              <span class="review-stars">${"★".repeat(r.rating || 5)}${"☆".repeat(5 - (r.rating || 5))}</span>
            </div>
            <div class="review-title">${r.title}</div>
            <p class="review-comment">${r.comment}</p>
          </div>`).join("")
        : `<p class="muted-sm">Henüz bu araç için kullanıcı yorumu eklenmemiş. İlk tecrübeyi siz paylaşın!</p>`}
      </div>

      <!-- YORUM EKLEME FORMU -->
      <form class="review-form" id="newReviewForm" onsubmit="handleReviewSubmit(event, ${c.id})">
        <h5>✍️ Bu Araca Sahip Misiniz? Tecrübenizi / Kronik Sorunu Paylaşın</h5>
        <div class="review-form-grid">
          <input type="text" id="revUser" placeholder="Adınız Soyadınız" required value="${currentUser ? currentUser.name : ""}" />
          <input type="text" id="revCity" placeholder="Şehir (Örn: Ankara)" required />
          <input type="text" id="revKm" placeholder="Aracın Kilometresi (Örn: 45.000 km)" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 120px;gap:10px;margin-bottom:10px">
          <input type="text" id="revTitle" placeholder="Kısa Başlık (Örn: Şanzıman çok iyi ama yakıtı yüksek)" required />
          <select id="revRating">
            <option value="5">5 Yıldız ★★★★★</option>
            <option value="4">4 Yıldız ★★★★☆</option>
            <option value="3">3 Yıldız ★★★☆☆</option>
            <option value="2">2 Yıldız ★★☆☆☆</option>
            <option value="1">1 Yıldız ★☆☆☆☆</option>
          </select>
        </div>
        <textarea id="revComment" placeholder="Aracın iyi yönlerini, karşılaştığınız kronik sıkıntıları veya servis deneyiminizi detaylıca yazın..." required></textarea>
        <button type="submit" class="btn btn-primary">Geri Bildirimi Gönder</button>
      </form>
    </div>
  `);
}

function handleReviewSubmit(e, carId) {
  e.preventDefault();
  const userName = $("#revUser").value.trim();
  const city = $("#revCity").value.trim();
  const km = $("#revKm").value.trim();
  const title = $("#revTitle").value.trim();
  const rating = +$("#revRating").value || 5;
  const comment = $("#revComment").value.trim();

  const newRev = {
    carId,
    userName,
    city,
    km,
    title,
    rating,
    comment,
    date: new Date().toLocaleDateString("tr-TR"),
    verifiedOwner: true
  };

  allReviews.unshift(newRev);
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(allReviews));
  } catch (err) {}

  showToast("🎉 Deneyiminiz ve geri bildiriminiz başarıyla yayınlandı!");
  showDetail(carId);
}

/* ---------------------------------------------------------
   MODAL: KARŞILAŞTIRMA EKRANI
   --------------------------------------------------------- */
function showCompare() {
  const cars = compare.map(id => CARS.find(c => c.id === id)).filter(Boolean);
  if (cars.length < 2) {
    return alert("Karşılaştırma yapmak için lütfen en az 2 araç seçiniz.");
  }

  const rows = [
    ["Satış Fiyatı", c => c.price, fmtTL, "min"],
    ["Bütçe Segmenti", c => budgetOf(c.price).name, x => x],
    ["Kasa Tipi", c => c.cat, x => x],
    ["Yakıt Tipi", c => c.fuel, x => x],
    ["Motor Gücü", c => c.hp, x => x + " HP", "max"],
    ["Tork Gücü", c => c.torque || 0, x => x ? x + " Nm" : "—", "max"],
    ["0-100 km/s Hızlanma", c => c.acc, x => x + " s", "min"],
    ["Azami Sürat", c => c.top, x => x + " km/s", "max"],
    ["Yakıt / Tüketim", c => c.cons, (x, c) => consLabel(c), "min"],
    ["Çekiş Sistemi", c => c.drive, x => x],
    ["Şanzıman", c => c.trans, x => x],
    ["Yerden Yükseklik", c => c.clr, x => x + " mm", "max"],
    ["Bagaj Hacmi", c => c.trunk, x => x + " Litre", "max"],
    ["Koltuk Sayısı", c => c.seats, x => x + " Kişi", "max"],
    ["Konfor Puanı", c => c.comfort, x => x + " / 10", "max"],
    ["Ekonomi Skoru", ecoScore, x => x + " / 100", "max"],
    ["Performans Skoru", perfScore, x => x + " / 100", "max"],
    [
      "Kronik Arıza Sayısı",
      c => c.issues?.length || 0,
      x => x > 0 ? `⚠️ ${x} Uyarı` : `🛡️ Sorunsuz`,
      "min"
    ],
    ["Yıllık Toplam Sahip Olma Maliyeti", c => annualCost(c).total, fmtTL, "min"]
  ];

  openModal(`
    <h2 style="margin-bottom:16px">⚖️ Detaylı Araç Karşılaştırma</h2>
    <div class="table-wrap">
      <table class="cmp-table">
        <thead>
          <tr>
            <th>Kriter</th>
            ${cars.map(c => `
              <th>
                <img src="${c.img}" style="width:110px;height:70px;border-radius:8px;object-fit:cover;margin:0 auto 6px" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80'" />
                <br><b>${carName(c)}</b>
              </th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map(([label, get, fmt, best]) => {
            const vals = cars.map(get);
            const target = best === "max" ? Math.max(...vals) : best === "min" ? Math.min(...vals) : null;
            return `
              <tr>
                <td>${label}</td>
                ${cars.map((c, i) => `
                  <td class="${target !== null && vals[i] === target ? "best" : ""}">
                    ${fmt(vals[i], c)}
                  </td>`).join("")}
              </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
    <div style="margin-top:20px;text-align:right">
      <button class="btn btn-ghost" onclick="compare=[]; renderCompareBar(); closeModal();">Listeyi Temizle</button>
    </div>`);
}

/* ---------------------------------------------------------
   GLOBAL ETKİNLİK DİNLEYİCİLERİ
   --------------------------------------------------------- */
document.addEventListener("click", e => {
  // Favori butonu
  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) {
    e.stopPropagation();
    return toggleFavorite(+favBtn.dataset.id);
  }

  // Karşılaştırma butonu
  const cmpBtn = e.target.closest(".cmp-btn");
  if (cmpBtn) {
    e.stopPropagation();
    return toggleCompare(+cmpBtn.dataset.id);
  }

  // Karşılaştırma sepetinden kaldırma
  const rm = e.target.closest("[data-rm]");
  if (rm) {
    e.stopPropagation();
    return toggleCompare(+rm.dataset.rm);
  }

  // Detay kartına tıklama
  const carEl = e.target.closest("[data-car]");
  if (carEl) {
    const id = +carEl.dataset.car;
    if (id) return showDetail(id);
  }
});

// Modal Kapatma
$("#modalClose").onclick = closeModal;
$("#authModalClose").onclick = closeModal;
$("#favModalClose").onclick = closeModal;

$$(".modal").forEach(m => {
  m.onclick = e => {
    if (e.target === m) closeModal();
  };
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

// Navbar Butonları
$("#navFavBtn").onclick = openFavoritesModal;
$("#navAuthBtn").onclick = () => {
  if (currentUser) openAuthModal("profile");
  else openAuthModal("login");
};

// Auth Tab Değişimi
$("#authTabs").onclick = e => {
  const tab = e.target.closest(".auth-tab");
  if (tab) renderAuthTabs(tab.dataset.tab);
};

// Karşılaştırma Butonları
$("#compareOpen").onclick = showCompare;
$("#compareClear").onclick = () => {
  compare = [];
  renderCompareBar();
  $$(".cmp-btn").forEach(b => b.classList.remove("is-cmp"));
  showToast("Karşılaştırma listesi temizlendi.");
};

// Mobil Menü Hamburger
$("#burger").onclick = () => $("#navLinks").classList.toggle("open");
$$("#navLinks a").forEach(a => a.onclick = () => $("#navLinks").classList.remove("open"));

// ScrollSpy Aktif Nav Linkleri
const obs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      $$("#navLinks a").forEach(a =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id)
      );
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });

$$("section[id]").forEach(s => obs.observe(s));

/* ---------------------------------------------------------
   SİSTEMİ BAŞLAT
   --------------------------------------------------------- */
computeRanges();
initAuth();
renderHero();
initCatalog();
renderCategories();
renderBrands();
renderChronicIssues();
renderBudgets();
renderRegions();
initEconomy();
renderComfort();
renderSpeed();
