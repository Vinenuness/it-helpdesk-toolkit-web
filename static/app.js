const resultEl = document.getElementById("result");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");

function setLoading(text) {
  resultEl.textContent = text;
}

async function callApi(endpoint) {
  setLoading("Executando... aguarde.");
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    resultEl.textContent = data.result || "Sem resultado.";
  } catch (e) {
    resultEl.textContent = "Erro ao chamar API: " + e.message;
  }
}

ddocument.querySelectorAll(".card").forEach(btn => {
  btn.addEventListener("click", () => {
    const endpoint = btn.getAttribute("data-endpoint");

    // Se for "client", não chama API; gera info local
    if (endpoint === "client") {
      resultEl.textContent = getClientInfoText();
      return;
    }

    callApi(endpoint);
  });
});


clearBtn.addEventListener("click", () => {
  resultEl.textContent = "Saída limpa.";
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(resultEl.textContent);
    resultEl.textContent = "Copiado ✅\n\n" + resultEl.textContent;
  } catch {
    resultEl.textContent = "Não consegui copiar (permissão do navegador).";
  }
});
function getClientInfoText() {
  const ua = navigator.userAgent;
  const lang = navigator.language;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const screenInfo = `${screen.width}x${screen.height}`;
  const windowInfo = `${window.innerWidth}x${window.innerHeight}`;
  const platform = navigator.platform || "N/A";
  const online = navigator.onLine ? "Sim" : "Não";

  let connText = "N/A";
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    const down = conn.downlink ? `${conn.downlink} Mbps` : "N/A";
    const rtt = conn.rtt ? `${conn.rtt} ms` : "N/A";
    const type = conn.effectiveType || "N/A";
    connText = `Tipo: ${type} | Downlink: ${down} | RTT: ${rtt}`;
  }

  return [
    "=== Info do Cliente (Browser) ===",
    `Online: ${online}`,
    `Idioma: ${lang}`,
    `Fuso horário: ${tz}`,
    `Plataforma (browser): ${platform}`,
    `Resolução da tela: ${screenInfo}`,
    `Tamanho da janela: ${windowInfo}`,
    `Conexão (estimativa): ${connText}`,
    "",
    "User-Agent:",
    ua
  ].join("\n");
}
