const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'pdca-store.json');
const SEED_FILE = path.join(__dirname, '../../../scratch/seed_data.json');

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadSeedData() {
  try {
    if (fs.existsSync(SEED_FILE)) {
      const seedRaw = fs.readFileSync(SEED_FILE, 'utf-8');
      const seed = JSON.parse(seedRaw);
      return seed.map((p, idx) => ({
        id: `proj-${Date.now()}-${idx + 1}`,
        ...p
      }));
    }
  } catch (err) {
    console.error('Error loading seed file:', err);
  }
  
  // Default fallback project if seed file not accessible
  return [{
    id: `proj-default-1`,
    title: "Plano de Redução de Incidentes de TI",
    unit: "TI Infraestrutura",
    location: "Matriz / SP",
    responsible: "Igor Pita / Antoniel",
    createdAt: new Date().toISOString().split('T')[0],
    status: "Em Execução",
    identification: {
      problem: "Quantidade de ocorrências de incidentes muito elevada. Acima de 60%",
      goal: "Reduzir em 40% as ocorrências de incidentes para o próximo período.",
      indicator: "Ocorrência de Incidentes",
      unit: "Chamados / %",
      source: "Sistema de Service Desk (GLPI/Jira)",
      frequency: "Mensal",
      metricHistory: [
        { period: "Jan", target: 90, real: 86 },
        { period: "Fev", target: 90, real: 114 },
        { period: "Mar", target: 90, real: 118 },
        { period: "Abr", target: 90, real: 449 },
        { period: "Mai", target: 90, real: 90 },
        { period: "Jun", target: 90, real: 122 },
        { period: "Jul", target: 90, real: 89 },
        { period: "Ago", target: 90, real: 77 },
        { period: "Set", target: 90, real: 150 },
        { period: "Out", target: 90, real: 171 },
        { period: "Nov", target: 90, real: 379 },
        { period: "Dez", target: 90, real: 111 }
      ]
    },
    stratification: [
      { category: "Impressão", count: 30, percentage: 28.85, cumulativePercentage: 28.85 },
      { category: "Software Aplicativo", count: 26, percentage: 25.0, cumulativePercentage: 53.85 },
      { category: "Manutenção de Equipamentos", count: 19, percentage: 18.27, cumulativePercentage: 72.12 },
      { category: "E-mail", count: 15, percentage: 14.42, cumulativePercentage: 86.54 },
      { category: "SAM: Licenciar Software", count: 14, percentage: 13.46, cumulativePercentage: 100.0 }
    ],
    causes: [
      { id: "C1", category: "Método", cause: "Licenças de TS ainda não foram ativadas" },
      { id: "C2", category: "Método", cause: "Chamados são encaminhados diretamente para o N2" },
      { id: "C3", category: "Mão de Obra", cause: "Falta de conhecimento da equipe de N1" },
      { id: "C4", category: "Medida", cause: "Falta de acesso da equipe de N1" },
      { id: "C5", category: "Método", cause: "Atendimentos realizados fora do fluxo de acionamento da TI" }
    ],
    hypotheses: [
      { id: "H1", causeId: "C1", causeText: "Licenças de TS ainda não foram ativadas", g: 5, u: 5, t: 4, votes: 10, isInfluential: true },
      { id: "H2", causeId: "C2", causeText: "Chamados são encaminhados diretamente para o N2", g: 4, u: 4, t: 3, votes: 8, isInfluential: true },
      { id: "H3", causeId: "C3", causeText: "Falta de conhecimento da equipe de N1", g: 4, u: 3, t: 3, votes: 7, isInfluential: true }
    ],
    fiveWhys: [
      {
        causeText: "Licenças de TS ainda não foram ativadas",
        whys: [
          "Por que as licenças de TS não foram ativadas? R: Faltou ação da equipe responsável.",
          "Por que faltou ação da equipe responsável? R: Não havia mapeamento claro de qual servidor necessitava de quantas licenças.",
          "Por que não havia mapeamento claro? R: Faltou levantamento do contrato e inventário de servidores.",
          "Por que faltou o levantamento? R: Ausência de processo padrão de inventário de licenças TS.",
          "Causa Raiz: Processo de gestão de licenças TS inexistente/desatualizado."
        ],
        actions: [
          "Definir quantidade de licenças para cada servidor",
          "Buscar dados do contrato de licenças de TS",
          "Ativar cada servidor com a quantidade de licenças necessárias"
        ]
      }
    ],
    actionPlan: [
      {
        no: 1,
        what: "Eleger categorias de chamados para treinar o N1",
        why: "Capacitar o N1 nos problemas mais frequentes (Impressão, Softwares)",
        where: "TI Infraestrutura / N1",
        who: "Antoniel",
        plannedStart: "2026-06-10",
        plannedEnd: "2026-06-13",
        realStart: "2026-06-10",
        realEnd: "2026-06-13",
        status: "Concluído",
        notes: "Categorias selecionadas com base no gráfico de Pareto."
      },
      {
        no: 2,
        what: "Treinar a equipe de N1",
        why: "Garantir resolução no primeiro nível e reduzir transbordo pro N2",
        where: "Sala de Treinamento TI",
        who: "Antoniel",
        plannedStart: "2026-06-14",
        plannedEnd: "2026-06-19",
        realStart: "2026-06-14",
        realEnd: null,
        status: "Em Andamento",
        notes: "Módulos de Impressão e Softwares em andamento."
      },
      {
        no: 3,
        what: "Ativar cada servidor com a quantidade de licenças necessárias",
        why: "Resolver bloqueio de acessos remotos via Terminal Server",
        where: "Servidores WTSMONDIAL01 e WTSMONDIAL03",
        who: "Igor Pita",
        plannedStart: "2026-06-15",
        plannedEnd: "2026-06-17",
        realStart: "2026-06-15",
        realEnd: "2026-06-16",
        status: "Concluído",
        notes: "Licenças ativadas com sucesso. Servidores operando normalmente."
      }
    ],
    standardization: {
      verifiedResult: "Redução parcial observada de 25% nos primeiros 30 dias após ativação das licenças e início dos treinamentos.",
      standardAction: "Criar procedimento operacional padrão (POP) para onboarding de N1 e gestão de licenças TS.",
      isGoalAchieved: false,
      nextSteps: "Concluir treinamento do N1 e realizar auditoria mensal do Pareto de Incidentes."
    }
  }];
}

function initStore() {
  ensureDirectoryExists(DATA_DIR);
  if (!fs.existsSync(DATA_FILE)) {
    const seed = loadSeedData();
    fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    console.log(`Initialized database store at ${DATA_FILE} with ${seed.length} projects.`);
  }
}

function readStore() {
  initStore();
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading store:', err);
    return [];
  }
}

function writeStore(data) {
  ensureDirectoryExists(DATA_DIR);
  const tempPath = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, DATA_FILE);
}

module.exports = {
  getProjects: () => readStore(),
  getProjectById: (id) => {
    const projects = readStore();
    return projects.find(p => p.id === id) || null;
  },
  createProject: (projectData) => {
    const projects = readStore();
    const newProject = {
      id: `proj-${Date.now()}`,
      title: projectData.title || "Novo Projeto PDCA",
      unit: projectData.unit || "TI Infraestrutura",
      location: projectData.location || "Matriz",
      responsible: projectData.responsible || "Usuário",
      createdAt: new Date().toISOString().split('T')[0],
      status: "Em Planejamento",
      identification: projectData.identification || {
        problem: "",
        goal: "",
        indicator: "",
        unit: "",
        source: "",
        frequency: "Mensal",
        metricHistory: []
      },
      stratification: projectData.stratification || [],
      causes: projectData.causes || [],
      hypotheses: projectData.hypotheses || [],
      fiveWhys: projectData.fiveWhys || [],
      actionPlan: projectData.actionPlan || [],
      standardization: projectData.standardization || {
        verifiedResult: "",
        standardAction: "",
        isGoalAchieved: false,
        nextSteps: ""
      }
    };
    projects.push(newProject);
    writeStore(projects);
    return newProject;
  },
  updateProject: (id, projectData) => {
    const projects = readStore();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    projects[index] = {
      ...projects[index],
      ...projectData,
      id // preserve ID
    };
    writeStore(projects);
    return projects[index];
  },
  deleteProject: (id) => {
    const projects = readStore();
    const filtered = projects.filter(p => p.id !== id);
    if (filtered.length === projects.length) return false;
    writeStore(filtered);
    return true;
  }
};
