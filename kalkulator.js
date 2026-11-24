const $ = id => document.getElementById(id);

function parseSet(value, label) {
  const cleaned = value.trim().replace(/^\{/, "").replace(/\}$/, "").trim();
  if (!cleaned) return [];
  const items = cleaned.split(",").map(item => item.trim());
  if (items.some(item => item === "")) {
    throw new Error(`Periksa masukan ${label}. Pisahkan anggota dengan koma dan jangan sisakan koma kosong.`);
  }
  return [...new Set(items)];
}

function formatSet(items) {
  return items.length ? `{ ${items.join(", ")} }` : "∅ (himpunan kosong)";
}

function calculate() {
  $("error").hidden = true;
  $("result").hidden = true;
  try {
    const A = parseSet($("setA").value, "A");
    const B = parseSet($("setB").value, "B");
    let title = "", value = "", info = "";
    switch ($("operation").value) {
      case "union":
        title = "Gabungan A ∪ B"; value = formatSet([...new Set([...A, ...B])]);
        info = "Anggota yang terdapat pada A atau B, tanpa pengulangan."; break;
      case "intersection":
        title = "Irisan A ∩ B"; value = formatSet(A.filter(x => B.includes(x)));
        info = "Anggota yang terdapat pada A dan B sekaligus."; break;
      case "differenceAB":
        title = "Selisih A − B"; value = formatSet(A.filter(x => !B.includes(x)));
        info = "Anggota A yang tidak terdapat pada B."; break;
      case "differenceBA":
        title = "Selisih B − A"; value = formatSet(B.filter(x => !A.includes(x)));
        info = "Anggota B yang tidak terdapat pada A."; break;
      case "symmetric":
        title = "Beda setangkup A ⊕ B";
        value = formatSet([...A.filter(x => !B.includes(x)), ...B.filter(x => !A.includes(x))]);
        info = "Anggota yang terdapat pada A atau B, tetapi tidak pada keduanya."; break;
      case "cartesian":
        title = "Perkalian kartesian A × B";
        value = A.length && B.length ? `{ ${A.flatMap(a => B.map(b => `(${a}, ${b})`)).join(", ")} }` : "∅ (himpunan kosong)";
        info = `Jumlah pasangan berurutan: ${A.length * B.length}.`; break;
      case "cardinalityA":
        title = "Kardinalitas A, n(A)"; value = String(A.length);
        info = `Himpunan A memiliki ${A.length} anggota.`; break;
      case "cardinalityB":
        title = "Kardinalitas B, n(B)"; value = String(B.length);
        info = `Himpunan B memiliki ${B.length} anggota.`; break;
      default:
        throw new Error("Operasi yang dipilih tidak dikenali.");
    }
    $("resultName").textContent = title;
    $("resultValue").textContent = value;
    $("resultInfo").textContent = info;
    $("result").hidden = false;
  } catch (error) {
    $("error").textContent = error.message;
    $("error").hidden = false;
  }
}
$("calculate").addEventListener("click", calculate);
