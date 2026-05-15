const API_BASE_URL = 'http://localhost:9090/api';

// Extrai a mensagem de erro do corpo da resposta do backend.
// O GlobalExceptionHandler sempre devolve { mensagem: "..." } nos erros.
async function extrairErro(response) {
  try {
    const body = await response.json();
    return body.mensagem || body.erro || `Erro ${response.status}`;
  } catch {
    return `Erro ${response.status}`;
  }
}

export async function fetchResiduos(ano) {
  const url = ano ? `${API_BASE_URL}/residuos/ano/${ano}` : `${API_BASE_URL}/residuos`;
  const response = await fetch(url);

  if (response.status === 404) return [];
  if (!response.ok) throw new Error(await extrairErro(response));

  return response.json();
}

export async function criarResiduo(residuo) {
  const response = await fetch(`${API_BASE_URL}/residuos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(residuo),
  });

  if (!response.ok) throw new Error(await extrairErro(response));

  return response.json();
}

export async function atualizarResiduo(id, residuo) {
  const response = await fetch(`${API_BASE_URL}/residuos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(residuo),
  });

  if (!response.ok) throw new Error(await extrairErro(response));

  return response.json();
}

export async function deletarResiduo(id) {
  const response = await fetch(`${API_BASE_URL}/residuos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error(await extrairErro(response));
}

export async function importarCsv(file) {
  const formData = new FormData();
  formData.append('arquivo', file);

  const response = await fetch(`${API_BASE_URL}/residuos/importar-csv`, {
    method: 'POST',
    body: formData,
  });

  const body = await response.json();

  // 409 = todos os registros do CSV já existiam no banco
  if (response.status === 409) throw new Error(body.erro);

  if (!response.ok) throw new Error(body.erro || body.mensagem || `Erro ${response.status}`);

  // Retorna o body completo: { mensagem, registrosImportados, duplicatasIgnoradas? }
  return body;
}