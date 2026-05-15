const API_BASE_URL = 'http://localhost:9090/api';

export async function fetchResiduos(ano) {
  const url = ano ? `${API_BASE_URL}/residuos/ano/${ano}` : `${API_BASE_URL}/residuos`;
  const response = await fetch(url);

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`Falha ao carregar dados do backend: ${response.status}`);
  }

  return response.json();
}

export async function criarResiduo(residuo) {
  const response = await fetch(`${API_BASE_URL}/residuos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(residuo),
  });

  if (!response.ok) {
    throw new Error(`Falha ao criar registro: ${response.status}`);
  }

  return response.json();
}

export async function atualizarResiduo(id, residuo) {
  const response = await fetch(`${API_BASE_URL}/residuos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(residuo),
  });

  if (!response.ok) {
    throw new Error(`Falha ao atualizar registro: ${response.status}`);
  }

  return response.json();
}

export async function deletarResiduo(id) {
  const response = await fetch(`${API_BASE_URL}/residuos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Falha ao deletar registro: ${response.status}`);
  }
}

export async function importarCsv(file) {
  const formData = new FormData();
  formData.append('arquivo', file);

  const response = await fetch(`${API_BASE_URL}/residuos/importar-csv`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Falha ao importar CSV: ${response.status}`);
  }

  return response.json();
}
