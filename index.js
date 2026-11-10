const topik = [
 ["Pengertian himpunan","pengertian"],["Karakteristik himpunan","karakteristik"],["Ekspresi himpunan","ekspresi"],
 ["Cara penyajian himpunan","penyajian"],["Relasi himpunan","relasi"],["Kardinalitas","kardinalitas"],
 ["Himpunan kosong","kosong"],["Himpunan ekuivalen","ekuivalen"],["Himpunan saling lepas","lepas"],
 ["Himpunan kuasa","kuasa"],["Operasi terhadap himpunan","operasi"],["Sifat-sifat operasi himpunan","sifat"]
];
document.getElementById("toc").innerHTML = topik.map(t => `<li><a href="materi.html#${t[1]}">${t[0]}</a></li>`).join("");