document.addEventListener("DOMContentLoaded", () => {
    const resultadosDiv = document.getElementById("resultados");

    document.querySelector(".btn-calc").addEventListener("click", () => {
        const ip = document.getElementById("ip").value;
        const prefix = parseInt(document.getElementById("prefix").value);

        if (!ip || isNaN(prefix) || prefix < 1 || prefix > 32) {
            alert("Por favor ingresa una IP válida y un prefijo entre 1 y 32.");
            return;
        }

        // Validar IP
        const ipParts = ip.split(".").map(Number);
        if (ipParts.length !== 4 || ipParts.some(p => p < 0 || p > 255)) {
            alert("La IP no es válida.");
            return;
        }

        const ipBin = ipParts.map(p => p.toString(2).padStart(8, "0")).join("");

        // Máscara
        const maskBin = "1".repeat(prefix).padEnd(32, "0");
        const maskParts = maskBin.match(/.{8}/g).map(b => parseInt(b, 2));
        const maskStr = maskParts.join(".");

        // Wildcard
        const wildcardParts = maskParts.map(p => 255 - p);
        const wildcardStr = wildcardParts.join(".");
        const wildcardBin = wildcardParts.map(p => p.toString(2).padStart(8, "0")).join(".");

        // Red
        const netBin = ipBin.split("").map((b, i) => b & maskBin[i]).join("");
        const netParts = netBin.match(/.{8}/g).map(b => parseInt(b, 2));
        const netStr = netParts.join(".");

        // Broadcast
        const broadBin = netBin.slice(0, prefix).padEnd(32, "1");
        const broadParts = broadBin.match(/.{8}/g).map(b => parseInt(b, 2));
        const broadStr = broadParts.join(".");

        // Primer y último host
        const firstIp = [...netParts];
        firstIp[3] += 1;

        const lastIp = [...broadParts];
        lastIp[3] -= 1;

        // Número de hosts
        const numHosts = Math.pow(2, 32 - prefix) - 2;

        // Clase y tipo de IP
        let clase = "";
        if (ipParts[0] >= 1 && ipParts[0] <= 126) clase = "Clase A";
        else if (ipParts[0] >= 128 && ipParts[0] <= 191) clase = "Clase B";
        else if (ipParts[0] >= 192 && ipParts[0] <= 223) clase = "Clase C";
        else clase = "Clase D/E";

        let tipo = (ipParts[0] === 10 || (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) || (ipParts[0] === 192 && ipParts[1] === 168)) 
                   ? "IP Privada" : "IP Pública";

        resultadosDiv.style.display = "block";
        resultadosDiv.innerHTML = `
            <h3>${ip} /${prefix}</h3>
            <table class="tabla-ip">
                <tr><th>Item</th><th>Decimal</th><th>Binario</th></tr>
                <tr><td>Dirección IPv4</td><td>${ip}</td><td>${ipBin.match(/.{8}/g).join(".")}</td></tr>
                <tr><td>Máscara de red</td><td>${maskStr}</td><td>${maskBin.match(/.{8}/g).join(".")}</td></tr>
                <tr><td>Máscara Wildcard</td><td>${wildcardStr}</td><td>${wildcardBin}</td></tr>
                <tr><td>Dirección de red</td><td>${netStr}</td><td>${netBin.match(/.{8}/g).join(".")}</td></tr>
                <tr><td>Dirección del primer host</td><td>${firstIp.join(".")}</td><td></td></tr>
                <tr><td>Dirección del último host</td><td>${lastIp.join(".")}</td><td></td></tr>
                <tr><td>Dirección de difusión</td><td>${broadStr}</td><td>${broadBin.match(/.{8}/g).join(".")}</td></tr>
                <tr><td>Número de direcciones asignables</td><td>${numHosts}</td><td></td></tr>
                <tr><td>Tipo de dirección IPv4</td><td><span style="color:red">${tipo}</span>, ${clase}</td><td></td></tr>
            </table>
        `;
    });
});
