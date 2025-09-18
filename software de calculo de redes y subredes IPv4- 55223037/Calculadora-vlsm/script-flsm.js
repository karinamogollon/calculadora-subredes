function calcularFLSM() {
  let red = document.getElementById("redFLSM").value;
  let subredes = parseInt(document.getElementById("numSubredes").value);
  let salida = document.getElementById("resultado-flsm");

  if (!red.includes("/")) {
    salida.innerHTML = "<p style='color:red;'>Formato inválido. Ejemplo: 192.168.1.0/24</p>";
    return;
  }

  let prefijo = parseInt(red.split("/")[1]);
  let bitsNuevos = Math.ceil(Math.log2(subredes));
  let nuevoPrefijo = prefijo + bitsNuevos;

  salida.innerHTML = `
    <p><b>Red base:</b> ${red}</p>
    <p><b>Número de subredes:</b> ${subredes}</p>
    <p><b>Nuevo prefijo:</b> /${nuevoPrefijo}</p>
  `;
}
