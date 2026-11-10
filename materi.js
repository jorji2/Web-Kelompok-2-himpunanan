// Daftar isi samping + penanda bagian aktif
const secs = [...document.querySelectorAll("section")];
const menu = document.getElementById("menu");
menu.innerHTML = secs.map(s => `<li><a href="#${s.id}">${s.querySelector("h2").textContent}</a></li>`).join("");
const links = [...menu.querySelectorAll("a")];
secs.forEach(s => new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle("on", l.hash === "#" + s.id));
}), {rootMargin: "-20% 0px -70% 0px"}).observe(s));

// Diagram Venn (SVG)
let k = 0;
function venn(type) {
  const id = "c" + k++, A = `<circle cx="95" cy="75" r="55"`, B = `<circle cx="165" cy="75" r="55"`, S = "#7fc8b8";
  let f = "";
  if (type === "union") f = `${A} fill="${S}"/>${B} fill="${S}"/>`;
  if (type === "inter") f = `<clipPath id="${id}">${A}/></clipPath>${B} fill="${S}" clip-path="url(#${id})"/>`;
  if (type === "diff") f = `${A} fill="${S}"/>${B} fill="#fff"/>`;
  if (type === "sym") f = `<clipPath id="${id}">${A}/></clipPath>${A} fill="${S}"/>${B} fill="${S}"/>${B} fill="#fff" clip-path="url(#${id})"/>`;
  if (type === "komp") f = `<rect width="260" height="150" fill="${S}"/>${A} fill="#fff"/>${B} fill="#fff"/>`;
  return `<svg viewBox="0 0 260 150" width="260">${f}${A} fill="none" stroke="#333"/>${B} fill="none" stroke="#333"/>
  <text x="60" y="45" font-size="14">A</text><text x="195" y="45" font-size="14">B</text><rect width="260" height="150" fill="none" stroke="#333"/></svg>`;
}
document.querySelectorAll(".figs").forEach(d => {
  if (d.dataset.v === "contoh") {
    d.innerHTML = `<svg viewBox="0 0 320 170" width="320"><rect x="2" y="2" width="316" height="166" fill="none" stroke="#333"/>
    <ellipse cx="105" cy="90" rx="70" ry="55" fill="none" stroke="#333"/><ellipse cx="190" cy="90" rx="70" ry="55" fill="none" stroke="#333"/>
    <text x="10" y="18" font-size="13">U</text><text x="85" y="55" font-size="13">A</text><text x="200" y="55" font-size="13">B</text>
    <text x="70" y="85" font-size="13">1</text><text x="70" y="115" font-size="13">3</text><text x="140" y="85" font-size="13">2</text><text x="140" y="115" font-size="13">5</text>
    <text x="205" y="85" font-size="13">6</text><text x="205" y="115" font-size="13">8</text><text x="285" y="60" font-size="13">7</text><text x="285" y="120" font-size="13">4</text></svg>`;
  } else d.innerHTML = venn(d.dataset.v);
});