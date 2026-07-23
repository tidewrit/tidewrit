// Shared nav + footer, injected on every page. Set data-page on <body> for active link.
const LOGO_SVG = `<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="tg-${Math.random().toString(36).slice(2,6)}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E6BFF"/><stop offset="1" stop-color="#1E3FA8"/></linearGradient></defs><g transform="translate(100,100)"><circle r="92" fill="none" stroke="#2E6BFF" stroke-width="6" stroke-dasharray="12 8"/><circle r="73" fill="#2E6BFF"/><path d="M -47 7 C -38 -7, -28 -7, -19 7 C -14 14, -9 16, -5 12 L 36 -31" fill="none" stroke="#FFFFFF" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><circle cx="36" cy="-31" r="7" fill="#FFD98A"/></g></svg>`;

const PAGES = [
  ["index.html","Home"],
  ["services.html","What you get"],
  ["destinations.html","Destinations"],
  ["pricing.html","Pricing"],
  ["reviews.html","Reviews"],
  ["faq.html","FAQ"],
  ["mytrips.html","My Trips"],
  ["about.html","About"],
];

function buildNav(){
  const current = document.body.dataset.page || "";
  const links = PAGES.map(([href,label]) =>
    `<a href="${href}" class="${current===href?'on':''}">${label}</a>`).join("");
  const nav = document.createElement("nav");
  nav.innerHTML = `
    <div class="wrap nav-inner">
      <a class="logo" href="index.html">${LOGO_SVG}<span class="word">Tide<span style="color:var(--blue)">Writ</span></span></a>
      <div class="navlinks">${links}<a class="navcta" href="index.html#request">Start planning</a></div>
      <button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
    <div class="mobile-menu">${links}<a class="navcta" href="index.html#request">Start planning</a></div>`;
  document.body.prepend(nav);
  const burger = nav.querySelector(".burger");
  const menu = nav.querySelector(".mobile-menu");
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
}

function buildFooter(){
  const f = document.createElement("footer");
  f.innerHTML = `
    <div class="wrap">
      <div class="footer-grid">
        <a class="logo" href="index.html">${LOGO_SVG}<span class="word">Tide<span style="color:var(--blue)">Writ</span></span></a>
        <div class="footer-cols">
          <div class="footer-col"><h5>Explore</h5>
            <a href="services.html">What you get</a>
            <a href="destinations.html">Destinations</a>
            <a href="pricing.html">Pricing</a>
            <a href="reviews.html">Reviews</a></div>
          <div class="footer-col"><h5>Company</h5>
            <a href="about.html">About</a>
            <a href="terms.html">Terms &amp; Conditions</a>
            <a href="terms.html#privacy">Privacy</a>
            <a href="faq.html">FAQ</a>
            <a href="index.html#request">Start planning</a></div>
        </div>
      </div>
      <div class="footer-bottom">© 2026 Tidewrit. Every recommendation checked before it reaches you.</div>
    </div>`;
  document.body.append(f);
}

document.addEventListener("DOMContentLoaded", () => { buildNav(); buildFooter(); });
