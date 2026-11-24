// ===== Pembuat soal acak: setiap set berisi soal baru yang berbeda =====
const rnd = n => Math.floor(Math.random() * n);
const pick = (n, max = 9) => { const s = new Set(); while (s.size < n) s.add(1 + rnd(max)); return [...s].sort((a, b) => a - b); };
const fmt = a => "{" + a.join(",") + "}";
const U = [1,2,3,4,5,6,7,8,9];
const un = (a, b) => [...new Set([...a, ...b])].sort((x, y) => x - y);
const it = (a, b) => a.filter(x => b.includes(x));
const df = (a, b) => a.filter(x => !b.includes(x));
const sd = (a, b) => un(df(a, b), df(b, a));
const sz = () => 3 + rnd(3);

// tiap generator mengembalikan {q, ans} ; ans berupa array (himpunan) atau angka
const gens = [
  () => { const A = pick(sz()), B = pick(sz()); return {q: `Jika A = ${fmt(A)} dan B = ${fmt(B)}, tentukan A ∪ B`, ans: un(A, B)}; },
  () => { const A = pick(sz()), B = pick(sz()); return {q: `Jika A = ${fmt(A)} dan B = ${fmt(B)}, tentukan A ∩ B`, ans: it(A, B)}; },
  () => { const A = pick(sz()), B = pick(sz()); return {q: `Jika A = ${fmt(A)} dan B = ${fmt(B)}, tentukan A − B`, ans: df(A, B)}; },
  () => { const A = pick(sz()), B = pick(sz()); return {q: `Jika A = ${fmt(A)} dan B = ${fmt(B)}, tentukan B − A`, ans: df(B, A)}; },
  () => { const A = pick(sz()), B = pick(sz()); return {q: `Jika A = ${fmt(A)} dan B = ${fmt(B)}, tentukan A ⊕ B (beda setangkup)`, ans: sd(A, B)}; },
  () => { const A = pick(sz()); return {q: `Jika U = {1,2,3,4,5,6,7,8,9} dan A = ${fmt(A)}, tentukan komplemen A`, ans: df(U, A)}; },
  () => { const A = pick(sz()), B = pick(sz()), C = pick(sz()); return {q: `Jika A = ${fmt(A)}, B = ${fmt(B)}, C = ${fmt(C)}, tentukan A ∩ (B ∪ C)`, ans: it(A, un(B, C))}; },
  () => { const A = pick(sz()), B = pick(sz()), C = pick(sz()); return {q: `Jika A = ${fmt(A)}, B = ${fmt(B)}, C = ${fmt(C)}, tentukan (A ∪ B) − C`, ans: df(un(A, B), C)}; },
  () => { const n = 2 + rnd(5); return {q: `Jika himpunan A memiliki ${n} elemen, berapa banyak elemen himpunan kuasa P(A)?`, ans: 2 ** n}; },
  () => { const x = 2 + rnd(4), y = 2 + rnd(4); return {q: `Jika |X| = ${x} dan |Y| = ${y}, berapa |X × Y| (jumlah pasangan berurutan)?`, ans: x * y}; },
  () => { const A = pick(sz()), B = pick(sz()); return {q: `Jika A = ${fmt(A)} dan B = ${fmt(B)}, berapa n(A ∪ B)?`, ans: un(A, B).length}; },
  () => { const A = pick(sz()), B = pick(sz()); return {q: `Jika A = ${fmt(A)} dan B = ${fmt(B)}, berapa n(A ∩ B)?`, ans: it(A, B).length}; },
  () => { const n = 2 + rnd(4); return {q: `Berapa banyak himpunan bagian dari himpunan yang memiliki ${n} elemen?`, ans: 2 ** n}; }
];
const show = a => Array.isArray(a) ? fmt(a) : String(a);

function distractors(ans) {
  const out = new Set([show(ans)]); let t = 0;
  while (out.size < 4 && t++ < 200) {
    if (Array.isArray(ans)) {
      let d = [...ans];
      const r = rnd(3);
      if (r === 0 || !d.length) d = un(d, [1 + rnd(9)]);
      else if (r === 1) d.splice(rnd(d.length), 1);
      else { d.splice(rnd(d.length), 1); d = un(d, [1 + rnd(9)]); }
      out.add(fmt(d));
    } else out.add(String(Math.max(0, ans + [-2, -1, 1, 2, ans][rnd(5)] || ans + 3)));
  }
  return [...out].sort(() => Math.random() - .5);
}

const dipakai = new Set();   // riwayat soal agar tidak ada yang berulang
let setKe = 0, soal = [], sudahCek = false;

function buat() {
  setKe++; sudahCek = false; soal = [];
  const mk = tipe => {
    for (let t = 0; t < 500; t++) {
      const s = gens[rnd(gens.length)]();
      if (!dipakai.has(s.q)) { dipakai.add(s.q); s.tipe = tipe; if (tipe === "pg") s.opsi = distractors(s.ans); return s; }
    }
    const s = gens[rnd(gens.length)](); s.tipe = tipe; if (tipe === "pg") s.opsi = distractors(s.ans); return s;
  };
  for (let i = 0; i < 5; i++) soal.push(mk("pg"));
  for (let i = 0; i < 5; i++) soal.push(mk("isi"));
  render();
}

function render() {
  document.getElementById("setNo").textContent = setKe;
  document.getElementById("quiz").innerHTML = soal.map((s, i) => `
    <div class="q" id="q${i}"><span class="tipe">${s.tipe === "pg" ? "Pilihan ganda" : "Isian"}</span><p>${i + 1}. ${s.q}</p>
    ${s.tipe === "pg" ? s.opsi.map((o, j) => `<label class="opt"><input type="radio" name="n${i}" value="${o}">${"ABCD"[j]}. ${o}</label>`).join("")
    : `<input type="text" name="n${i}" placeholder="Tulis jawabanmu" autocomplete="off">`}
    <div class="fb"></div></div>`).join("");
  document.getElementById("cek").hidden = false;
  document.getElementById("baru").hidden = true;
  document.getElementById("hasil").hidden = true;
  progres();
}

const ambil = i => {
  const e = document.querySelector(`[name=n${i}]:checked`) || document.querySelector(`input[type=text][name=n${i}]`);
  return e ? e.value.trim() : "";
};
function progres() {
  const n = soal.filter((_, i) => ambil(i) !== "").length;
  document.getElementById("fill").style.width = n * 10 + "%";
  document.getElementById("prog").textContent = `Terjawab ${n} dari 10`;
}
document.getElementById("quiz").addEventListener("input", progres);

// normalisasi jawaban isian: ambil angka-angka, urutkan
function norm(str, ans) {
  const s = str.toLowerCase().replace(/\s/g, "");
  if (!Array.isArray(ans)) return s.replace(/[^0-9]/g, "");
  if (s === "" ) return null;
  if (/^(\{\}|ø|∅|kosong|himpunankosong)$/.test(s)) return "";
  const m = s.match(/\d+/g);
  return m ? [...new Set(m.map(Number))].sort((a, b) => a - b).join(",") : null;
}

document.getElementById("cek").onclick = () => {
  if (sudahCek) return;
  sudahCek = true; let skor = 0;
  soal.forEach((s, i) => {
    const box = document.getElementById("q" + i), j = ambil(i);
    const bener = s.tipe === "pg" ? j === show(s.ans) : norm(j, s.ans) === (Array.isArray(s.ans) ? s.ans.join(",") : String(s.ans));
    if (bener) skor++;
    box.classList.add(bener ? "benar" : "salah");
    box.querySelector(".fb").textContent = bener ? "Benar!" : `Belum tepat. Jawaban yang benar: ${show(s.ans)}`;
    box.querySelectorAll("input").forEach(x => x.disabled = true);
  });
  const h = document.getElementById("hasil");
  h.hidden = false;
  h.innerHTML = `Skor kamu <b>${skor * 10}</b> / 100 (${skor} dari 10 benar)`;
  document.getElementById("cek").hidden = true;
  document.getElementById("baru").hidden = false;
  h.scrollIntoView({behavior: "smooth"});
};
document.getElementById("baru").onclick = () => { buat(); scrollTo({top: 0, behavior: "smooth"}); };
buat();