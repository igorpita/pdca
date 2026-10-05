# Sistema PDCA / MASP - Solução Definitiva de Problemas

Sistema web moderno, responsivo e conteinerizado para gestão da metodologia **PDCA / MASP (Método de Análise e Solução de Problemas)**. Desenvolvido para substituir planilhas auxiliares em Excel por um fluxo de trabalho guiado, interativo e com persistência de dados.

![PDCA System](https://img.shields.io/badge/PDCA-MASP_v2.0-indigo?style=for-the-badge)
![Docker](https://img.shields.io/badge/Container-Docker-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React_Vite-cyan?style=for-the-badge)

---

## 🎯 Metodologia & Etapas Interligadas (MASP)

O sistema segue exatamente os 7 passos interligados do MASP / QC Story:

1. **Etapa 1: Identificação do Problema & Meta (Plan)**
   - Cadastro da unidade gerencial, responsáveis, declaração clara do problema (fenômeno) e meta (objetivo + valor + prazo).
   - Tabela e **Gráfico Histórico de Meta vs Real** por período.

2. **Etapa 2: Estratificação & Análise de Pareto (Plan)**
   - Desmembramento das ocorrências em categorias/dimensões.
   - Cálculo automático de % Individual, % Acumulado e destaque dos **20% vitais (Regra de Pareto 80/20)**.
   - **Gráfico de Pareto Interativo** (Frequência em Barras + Curva Acumulada).

3. **Etapa 3: Análise das Causas (Ishikawa / 6M) (Plan)**
   - **Diagrama Espinha de Peixe (Ishikawa)** visual cobrindo os 6M: *Mão de Obra, Método, Material, Máquina, Meio Ambiente, Medida*.
   - Mapeamento dinâmico de causas conectadas à cabeça do peixe (problema).

4. **Etapa 4: Análise das Hipóteses & Priorização GUT (Plan)**
   - **Matriz GUT**: Avaliação de Gravidade (1-5), Urgência (1-5) e Tendência (1-5).
   - Score automático ($G \times U \times T$) de 1 a 125 e votação da equipe.
   - Seleção das **Causas Influentes** para investigação profunda.

5. **Etapa 5: Investigação dos 5 Porquês (Causa Raiz) (Plan)**
   - Árvore de investigação sucessiva (*1º Por quê* até o *5º Por quê / Causa Raiz*).
   - Definição de **Contra-medidas / Etapas de Solução** que alimentam automaticamente o Plano de Ação.

6. **Etapa 6: Plano de Ação 5W2H (Do)**
   - Matriz 5W2H (O que, Por que, Onde, Quem, Quando Planejado, Quando Real, Status/Farol).
   - **Alternância de Visualização**: Tabela 5W2H completa ou **Quadro Kanban por Status**.
   - Cálculo automático do **Farol de Status** (*No Prazo, Em Andamento, Concluído, Atrasado, Cancelado*).

7. **Etapa 7: Verificação, Padronização & Lições (Check & Act)**
   - Validação da meta alcançada com **efeito comemorativo (Confetti)**.
   - Elaboração do **Procedimento Operacional Padrão (POP)** para garantir a não reincidência do problema.

---

## 🚀 Como Executar o Sistema

### Opção 1: Via Container Docker (Recomendado)

Certifique-se de que o Docker esteja em execução e rode na raiz do projeto:

```bash
docker compose up -d --build
```

O sistema estará acessível em: **`http://localhost:3001`**

> **Persistência de Dados**: Todos os dados dos projetos são persistidos no volume Docker `pdca_data` mapeado em `/app/data/pdca-store.json`.

---

### Opção 2: Execução Local (Modo Desenvolvimento)

#### 1. Iniciar o Backend API
```bash
cd backend
npm install
npm start
```
*O backend iniciará em `http://localhost:3001`.*

#### 2. Iniciar o Frontend React/Vite
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```
*O frontend estará disponível em `http://localhost:3000` com proxy transparente para o backend.*

---

## 📊 Dados Pré-Carregados

O sistema já vem pré-carregado com os dados exatos extraídos da planilha **`PDCA-Incidentes.xlsm`** ("*TI Infraestrutura - Plano de Redução de Incidentes de TI*"), permitindo navegação e teste imediato de todas as etapas.

---

## 📁 Estrutura do Projeto

```
PDCA/
├── Dockerfile                  # Container multi-stage (Frontend + Backend)
├── docker-compose.yml          # Orquestração do container com volume persistente
├── PDCA-Incidentes.xlsm        # Planilha original convertida
├── backend/
│   ├── src/
│   │   ├── server.js           # API REST Express
│   │   └── db.js               # Gerenciador de armazenamento JSON atômico
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/         # Componentes React de cada etapa do MASP
    │   ├── services/api.js     # Cliente API
    │   ├── App.jsx             # Orquestrador de estado e etapas
    │   └── index.css           # Design system (Glassmorphism, Dark Theme)
    └── package.json
```
