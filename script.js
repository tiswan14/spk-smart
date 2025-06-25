function generateForm(data = null) {
    const criteriaCount = parseInt(
        document.getElementById('criteria-count').value
    )
    const alternativeCount = parseInt(
        document.getElementById('alternative-count').value
    )
    const container = document.getElementById('form-container')
    container.innerHTML = ''

    const table = document.createElement('table')
    const thead = document.createElement('thead')
    const tbody = document.createElement('tbody')

    const headerRow = document.createElement('tr')
    headerRow.innerHTML =
        `<th>Nama</th>` +
        Array.from(
            { length: criteriaCount },
            (_, i) => `<th>C${i + 1}</th>`
        ).join('')
    thead.appendChild(headerRow)

    for (let i = 0; i < alternativeCount; i++) {
        const row = document.createElement('tr')

        const nama = data ? namaDosen[i] : `Dosen ${i + 1}`
        const nilai = data ? data.map((baris) => baris[i]) : []

        row.innerHTML =
            `<td><input type="text" name="nama" value="${nama}" /></td>` +
            Array.from({ length: criteriaCount }, (_, j) => {
                const val = nilai[j] !== undefined ? nilai[j] : ''
                return `<td><input type="text" name="C${
                    j + 1
                }" value="${val}" required /></td>`
            }).join('')
        tbody.appendChild(row)
    }

    table.appendChild(thead)
    table.appendChild(tbody)
    container.appendChild(table)
    document.getElementById('smart-form').style.display = 'block'
}

document.getElementById('smart-form').addEventListener('submit', function (e) {
    e.preventDefault()
    document.getElementById('error-message').textContent = ''

    const formRows = document.querySelectorAll('#form-container tbody tr')
    const data = []
    let hasError = false

    formRows.forEach((row) => {
        const inputs = row.querySelectorAll('input')
        const nama = inputs[0].value
        const scores = Array.from(inputs)
            .slice(1)
            .map((i) => {
                let val = i.value.replace(',', '.')
                let num = parseFloat(val)
                if (isNaN(num)) {
                    hasError = true
                    return 0
                }
                return num
            })
        data.push({ nama, scores })
    })

    if (hasError) {
        document.getElementById('error-message').textContent =
            'Please enter valid value. Contoh: 91.00 atau 92.00.'
        return
    }

    const criteriaCount = data[0].scores.length
    const weights = [0.2, 0.2, 0.25, 0.1, 0.15, 0.1]
    const criteriaNames = [
        'Kedisiplinan',
        'Komunikasi',
        'Metode Pengajaran',
        'Inovasi',
        'Penilaian',
        'Dukungan Akademik',
    ]

    // Hitung nilai maksimal tiap kriteria
    const maxScores = data[0].scores.map((_, i) =>
        Math.max(...data.map((d) => d.scores[i]))
    )

    // Tampilkan tabel normalisasi
    const normHead = document.getElementById('norm-head')
    const normBody = document.getElementById('norm-body')

    // Header tabel dengan kriteria
    normHead.innerHTML = `
        <tr>
            <th>Normalisasi</th>
            ${data.map((_, i) => `<th>A${i + 1} ${data[i].nama}</th>`).join('')}
            <th>Normalisasi</th>
        </tr>
    `

    normBody.innerHTML = ''

    // Isi tabel normalisasi per kriteria
    criteriaNames.forEach((name, i) => {
        const row = document.createElement('tr')
        const normValues = data.map((d) => {
            const normalized = d.scores[i] / maxScores[i]
            return Math.round(normalized * 10000) / 10000
        })

        row.innerHTML = `
            <td>C${i + 1}: ${name}</td>
            ${normValues
                .map(
                    (n) => `
                <td>${n.toFixed(4).replace('.', ',')}</td>
            `
                )
                .join('')}
            <td>${weights[i].toFixed(2).replace('.', ',')}</td>
        `
        normBody.appendChild(row)
    })

    document.getElementById('normalisasi-table').style.display = 'table'

    // Hitung skor akhir dan ranking
    // Di bagian hasil perhitungan, ganti ini:
    const results = data
        .map((d, idx) => {
            const utility = d.scores.map((val, i) => val / maxScores[i])
            const score = utility.reduce((sum, u, i) => sum + u * weights[i], 0)

            return {
                nama: d.nama,
                skor: score,
                skorDisplay: score.toFixed(5).replace('.', ','),
                c1ScoreRaw: utility[0],
                c1Score: utility[0].toFixed(5).replace('.', ','),
                c1Weighted: (utility[0] * weights[0])
                    .toFixed(5)
                    .replace('.', ','),
                // Tambahkan nilai utility untuk semua kriteria
                utilities: utility.map((u) => u.toFixed(5).replace('.', ',')),
            }
        })
        .sort((a, b) => b.skor - a.skor) // Urutkan berdasarkan skor akhir, bukan hanya C1

    // Di bagian tampilan ranking, ganti menjadi:
    const rankBody = document.getElementById('ranking-body')
    rankBody.innerHTML = `
<tr>
    <th></th>
    ${results.map((_, i) => `<th>A${i + 1} ${results[i].nama}</th>`).join('')}
</tr>
<tr>
    <td>Skor Akhir</td>
    ${results.map((r) => `<td>${r.skorDisplay}</td>`).join('')}
</tr>
<tr>
    <td>Rank</td>
    ${results.map((_, i) => `<td>${i + 1}</td>`).join('')}
</tr>
`

    document.getElementById('ranking-table').style.display = 'table'
})

const namaDosen = ['Pa Teguh', 'Pa Yusuf', 'Pa Missi', 'Pa Aso']
const nilaiAlternatif = [
    [91.0, 68.0, 74.17, 72.67], // C1
    [91.33, 67.33, 74.17, 74.0], // C2
    [85.0, 68.89, 75.0, 74.0], // C3
    [85.0, 65.19, 70.0, 69.33], // C4
    [90.67, 61.57, 74.44, 76.0], // C5
    [90.0, 66.67, 75.0, 78.0], // C6
]
function generateForm(data = null) {
    const criteriaCount = parseInt(
        document.getElementById('criteria-count').value
    )
    const alternativeCount = parseInt(
        document.getElementById('alternative-count').value
    )
    const container = document.getElementById('form-container')
    container.innerHTML = ''

    const table = document.createElement('table')
    const thead = document.createElement('thead')
    const tbody = document.createElement('tbody')

    const headerRow = document.createElement('tr')
    headerRow.innerHTML =
        `<th>Nama</th>` +
        Array.from(
            { length: criteriaCount },
            (_, i) => `<th>C${i + 1}</th>`
        ).join('')
    thead.appendChild(headerRow)

    for (let i = 0; i < alternativeCount; i++) {
        const row = document.createElement('tr')

        const nama = data ? namaDosen[i] : `Dosen ${i + 1}`
        const nilai = data ? data.map((row) => row[i]) : []

        row.innerHTML =
            `<td><input type="text" name="nama" value="${nama}" /></td>` +
            Array.from({ length: criteriaCount }, (_, j) => {
                const val = nilai[j] !== undefined ? nilai[j] : ''
                return `<td><input type="text" name="C${
                    j + 1
                }" value="${val}" required /></td>`
            }).join('')
        tbody.appendChild(row)
    }

    table.appendChild(thead)
    table.appendChild(tbody)
    container.appendChild(table)
    document.getElementById('smart-form').style.display = 'block'
}

function autoFill() {
    document.getElementById('criteria-count').value = 6
    document.getElementById('alternative-count').value = 4
    generateForm(nilaiAlternatif)

    // Delay untuk tunggu form selesai dirender lalu submit otomatis
    setTimeout(() => {
        document.getElementById('smart-form').dispatchEvent(new Event('submit'))
    }, 100) // 100ms cukup
}
