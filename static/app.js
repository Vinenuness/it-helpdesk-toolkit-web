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

document.querySelectorAll(".card").forEach(btn => {
  btn.addEventListener("click", () => {
    const endpoint = btn.getAttribute("data-endpoint");
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
