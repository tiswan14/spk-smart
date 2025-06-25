function generateForm() {
    const criteriaCount = parseInt(document.getElementById("criteria-count").value);
    const alternativeCount = parseInt(document.getElementById("alternative-count").value);
    const container = document.getElementById("form-container");
    container.innerHTML = "";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `<th>Nama</th>` + Array.from({ length: criteriaCount }, (_, i) => `<th>C${i + 1}</th>`).join("");
    thead.appendChild(headerRow);

    for (let i = 0; i < alternativeCount; i++) {
        const row = document.createElement("tr");
        row.innerHTML = `<td><input type="text" name="nama" value="Dosen ${i + 1}" /></td>` +
            Array.from({ length: criteriaCount }, (_, j) => `<td><input type="text" name="C${j + 1}" required /></td>`).join("");
        tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
    document.getElementById("smart-form").style.display = "block";
}

document.getElementById("smart-form").addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("error-message").textContent = "";

    const formRows = document.querySelectorAll("#form-container tbody tr");
    const data = [];
    let hasError = false;

    formRows.forEach(row => {
        const inputs = row.querySelectorAll("input");
        const nama = inputs[0].value;
        const scores = Array.from(inputs).slice(1).map(i => {
            let val = i.value.replace(',', '.');
            let num = parseFloat(val);
            if (isNaN(num)) {
                hasError = true;
                return 0;
            }
            return num;
        });
        data.push({ nama, scores });
    });

    if (hasError) {
        document.getElementById("error-message").textContent = "Please enter valid value. Contoh: 91.00 atau 92.00.";
        return;
    }

    const criteriaCount = data[0].scores.length;
    const weights = Array(criteriaCount).fill(1 / criteriaCount);
    const maxScores = data[0].scores.map((_, i) => Math.max(...data.map(d => d.scores[i])));

    const normHead = document.getElementById("norm-head");
    const normBody = document.getElementById("norm-body");
    normHead.innerHTML = `<tr><th>Nama</th>` + maxScores.map((_, i) => `<th>C${i + 1}</th>`).join("") + `</tr>`;
    normBody.innerHTML = "";
    data.forEach(d => {
        const norm = d.scores.map((val, i) => (val / maxScores[i]).toFixed(4));
        d.utility = norm.map(Number);
        const row = document.createElement("tr");
        row.innerHTML = `<td>${d.nama}</td>` + norm.map(n => `<td>${n}</td>`).join("");
        normBody.appendChild(row);
    });
    document.getElementById("normalisasi-table").style.display = "table";

    const results = data.map(d => {
        const score = d.utility.reduce((sum, u, i) => sum + u * weights[i], 0);
        return { nama: d.nama, skor: score.toFixed(4) };
    }).sort((a, b) => b.skor - a.skor);

    const rankBody = document.getElementById("ranking-body");
    rankBody.innerHTML = "";
    results.forEach((r, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${i + 1}</td><td>${r.nama}</td><td>${r.skor}</td>`;
        rankBody.appendChild(row);
    });
    document.getElementById("ranking-table").style.display = "table";
});
