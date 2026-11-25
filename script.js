/* ===== Tahun otomatis di footer ===== */
const tahun = new Date().getFullYear();
document.getElementById("year").textContent = tahun;
document.getElementById("year2").textContent = tahun;

/* ===== Efek mengetik di Beranda ===== */
(function () {
  const el = document.getElementById("typed");
  const kata = ["Web Developer", "Mahasiswa", "Pembelajar Cepat", "Software Engineer"];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { el.textContent = kata[0]; return; }

  let i = 0, j = 0, hapus = false;
  function ketik() {
    const kataIni = kata[i];
    el.textContent = kataIni.slice(0, j);
    let jeda = hapus ? 50 : 100;

    if (!hapus && j === kataIni.length) { hapus = true; jeda = 1500; }
    else if (hapus && j === 0) { hapus = false; i = (i + 1) % kata.length; jeda = 400; }
    else { j += hapus ? -1 : 1; }

    setTimeout(ketik, jeda);
  }
  ketik();
})();

/* ===== Menu mobile ===== */
const sidebar = document.getElementById("sidebar");
const toggle = document.getElementById("menuToggle");

function setMenu(buka) {
  sidebar.classList.toggle("open", buka);
  toggle.setAttribute("aria-expanded", String(buka));
  toggle.querySelector("i").className = buka ? "bi bi-x" : "bi bi-list";
}
toggle.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));
document.querySelectorAll("#nav a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* ===== Menu aktif mengikuti scroll ===== */
const links = [...document.querySelectorAll("#nav a")];
const sections = links.map(a => document.querySelector(a.getAttribute("href")));

function updateAktif() {
  const posisi = window.scrollY + window.innerHeight * 0.35;
  let aktif = 0;
  sections.forEach((s, idx) => { if (s && s.offsetTop <= posisi) aktif = idx; });
  links.forEach((a, idx) => a.classList.toggle("active", idx === aktif));
}

/* ===== Tombol kembali ke atas ===== */
const toTop = document.getElementById("toTop");
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

window.addEventListener("scroll", () => {
  updateAktif();
  toTop.classList.toggle("show", window.scrollY > 400);
}, { passive: true });
updateAktif();

/* ===== Bar keahlian terisi saat terlihat ===== */
const fills = document.querySelectorAll(".fill");
const obs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.style.width = en.target.dataset.w + "%";
      obs.unobserve(en.target);
    }
  });
}, { threshold: 0.4 });
fills.forEach(f => obs.observe(f));

/* ===== Filter portfolio ===== */
const filterBtns = document.querySelectorAll("#filters button");
const projects = document.querySelectorAll("#projects .project");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    projects.forEach(p => {
      const cocok = f === "all" || p.dataset.cat.split(" ").includes(f);
      p.classList.toggle("hide", !cocok);
    });
  });
});

/* ===== Formulir kontak (membuka aplikasi email) ===== */
const EMAIL_TUJUAN = "wahyudwi110707@gmail.com"; // ganti dengan emailmu
const form = document.getElementById("contactForm");
const pesanForm = document.getElementById("formMsg");

form.addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(form);
  const nama = data.get("nama").trim();
  const email = data.get("email").trim();
  const subjek = data.get("subjek").trim();
  const pesan = data.get("pesan").trim();

  form.querySelectorAll("input, textarea").forEach(f => f.classList.remove("invalid"));
  const kosong = [...form.querySelectorAll("[required]")].filter(f => !f.value.trim());
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (kosong.length || !emailValid) {
    kosong.forEach(f => f.classList.add("invalid"));
    if (!emailValid && email) form.email.classList.add("invalid");
    pesanForm.className = "form-msg err";
    pesanForm.textContent = "Lengkapi semua kolom dan pastikan format email benar.";
    return;
  }

  const isi = `Halo, saya ${nama} (${email}).\n\n${pesan}`;
  window.location.href =
    `mailto:${EMAIL_TUJUAN}?subject=${encodeURIComponent(subjek)}&body=${encodeURIComponent(isi)}`;

  pesanForm.className = "form-msg ok";
  pesanForm.textContent = "Aplikasi email akan terbuka. Kirim pesan dari sana.";
  form.reset();
});
