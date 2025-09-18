function generarCampos() {
    const numSubredes = document.getElementById("numSubredes").value;
    const contenedor = document.getElementById("subredHosts");
    contenedor.innerHTML = "";

    for (let i = 1; i <= numSubredes; i++) {
        contenedor.innerHTML += `
            <label for="hosts${i}">Subred ${i} - Número de Hosts:</label>
            <input type="number" id="hosts${i}" min="1" required>
        `;
    }
}

function calcularVLSM() {
    const ipBase = document.getElementById("ip").value;
    const prefix = parseInt(document.getElementById("prefix").value);
    const numSubredes = parseInt(document.getElementById("numSubredes").value);

    let hosts = [];
    for (let i = 1; i <= numSubredes; i++) {
        hosts.push(parseInt(document.getElementById(`hosts${i}`).value));
    }

    // Ordenar hosts de mayor a menor
    hosts = hosts.sort((a, b) => b - a);

    let ip = ipBase.split(".").map(oct => parseInt(oct));
    let html = `<h2>Resultados de VLSM</h2>
    <table>
        <tr>
            <th>Subred</th>
            <th>Nº Hosts</th>
            <th>IP de Red</th>
            <th>Máscara</th>
            <th>Primer Host</th>
            <th>Último Host</th>
            <th>Broadcast</th>
        </tr>`;

    hosts.forEach((h, index) => {
        let bitsNecesarios = Math.ceil(Math.log2(h + 2)); 
        let mascara = 32 - bitsNecesarios;
        let bloque = Math.pow(2, bitsNecesarios);

        let ipRed = ip.join(".");
        let broadcast = [...ip];
        broadcast[3] += bloque - 1;

        let primerHost = [...ip];
        primerHost[3] += 1;

        let ultimoHost = [...broadcast];
        ultimoHost[3] -= 1;

        html += `
            <tr>
                <td>Subred ${index + 1}</td>
                <td>${h}</td>
                <td>${ipRed} /${mascara}</td>
                <td>${maskFromPrefix(mascara)}</td>
                <td>${primerHost.join(".")}</td>
                <td>${ultimoHost.join(".")}</td>
                <td>${broadcast.join(".")}</td>
            </tr>
        `;

        ip[3] += bloque;
    });

    html += "</table>";
    document.getElementById("resultado").innerHTML = html;
}

function maskFromPrefix(prefix) {
    let mask = [];
    for (let i = 0; i < 4; i++) {
        let bits = Math.min(8, prefix);
        mask.push(256 - Math.pow(2, 8 - bits));
        prefix -= bits;
    }
    return mask.join(".");
}
