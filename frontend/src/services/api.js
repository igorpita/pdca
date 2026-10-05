const API_BASE = '/api';

export async function getProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error('Falha ao carregar lista de projetos');
  return res.json();
}

export async function getProjectById(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error('Falha ao carregar o projeto');
  return res.json();
}

export async function createProject(projectData) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  if (!res.ok) throw new Error('Falha ao criar o projeto');
  return res.json();
}

export async function updateProject(id, projectData) {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  if (!res.ok) throw new Error('Falha ao salvar as alterações do projeto');
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Falha ao excluir o projeto');
  return res.json();
}
