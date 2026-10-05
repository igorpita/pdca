# Sistema PDCA / MASP - Solução Definitiva de Problemas

Sistema web moderno, responsivo e conteinerizado para gestão da metodologia **PDCA / MASP (Método de Análise e Solução de Problemas)**. Desenvolvido para substituir planilhas auxiliares em Excel por um fluxo de trabalho guiado, interativo e com persistência de dados.

![PDCA System](https://img.shields.io/badge/PDCA-MASP_v2.0-indigo?style=for-the-badge)
![Docker](https://img.shields.io/badge/Container-Docker_Swarm-blue?style=for-the-badge)
![Traefik](https://img.shields.io/badge/Reverse_Proxy-Traefik_v2%2Fv3-orange?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React_Vite-cyan?style=for-the-badge)

---

## 🎯 Metodologia & Etapas Interligadas (MASP)

O sistema segue exatamente os 7 passos interligados do MASP / QC Story:

1. **Etapa 1: Identificação do Problema & Meta (Plan)**: Cadastro do problema, meta e gráfico histórico de Meta vs Real.
2. **Etapa 2: Estratificação & Análise de Pareto (Plan)**: Desmembramento por categoria e Gráfico de Pareto (Regra 80/20).
3. **Etapa 3: Análise das Causas (Ishikawa / 6M) (Plan)**: Diagrama Espinha de Peixe cobrindo os 6M.
4. **Etapa 4: Análise das Hipóteses & Priorização GUT (Plan)**: Matriz GUT (Score $G \times U \times T$) e votação do time.
5. **Etapa 5: Investigação dos 5 Porquês (Causa Raiz) (Plan)**: Investigação até a causa raiz real.
6. **Etapa 6: Plano de Ação 5W2H (Do)**: Matriz 5W2H e Quadro Kanban com Farol de Status automático.
7. **Etapa 7: Verificação, Padronização & Lições (Check & Act)**: Procedimento Operacional Padrão (POP) e validação da meta.

---

## 🌐 Deploy em Produção (GitHub + Portainer + Docker Swarm + Traefik)

O repositório já está configurado com:
- **`docker-stack.yml`**: Configuração nativa para Docker Swarm com labels do Traefik para o domínio `pdca.vps.oab-ba.org.br`.
- **`.github/workflows/docker-publish.yml`**: GitHub Action automatizada para compilar e publicar a imagem no GitHub Container Registry (`ghcr.io`).

---

### Passo 1: Enviar o código para o seu Repositório GitHub

No seu terminal local, execute:

```bash
# 1. Crie um repositório chamado "PDCA" no seu GitHub (ex: github.com/SEU_USUARIO/PDCA)

# 2. Associe o repositório remoto e envie o código:
git remote add origin https://github.com/SEU_USUARIO/PDCA.git
git branch -M main
git push -u origin main
```

> **Build Automático**: Assim que você fizer o `git push`, o GitHub Actions irá compilar automaticamente a imagem Docker e publicá-la no registro:
> `ghcr.io/SEU_USUARIO/pdca-masp:latest` *(Certifique-se de que a visibilidade do pacote no GHCR esteja pública no GitHub).*

---

### Passo 2: Implantação no Portainer (Docker Swarm Stack)

1. Acesse o seu painel do **Portainer**.
2. Vá em **Stacks** -> **Add Stack**.
3. Defina o nome da Stack: `pdca-system`.
4. Escolha **Repository** (conecte ao seu repo do GitHub) ou selecione **Web editor** e cole o conteúdo do arquivo [`docker-stack.yml`](file:///Users/igorpita/PDCA/docker-stack.yml):

```yaml
version: '3.8'

services:
  pdca-app:
    image: ghcr.io/igorpita/pdca:latest
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DATA_DIR=/app/data
    volumes:
      - pdca_data:/app/data
    networks:
      - vps
    deploy:
      mode: replicated
      replicas: 1
      restart_policy:
        condition: on-failure
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.pdca.rule=Host(`pdca.vps.oab-ba.org.br`)"
        - "traefik.http.routers.pdca.entrypoints=websecure"
        - "traefik.http.routers.pdca.tls=true"
        - "traefik.http.routers.pdca.tls.certresolver=letsencryptresolver"
        - "traefik.http.services.pdca.loadbalancer.server.port=3001"

networks:
  vps:
    external: true

volumes:
  pdca_data:
    driver: local
```

5. Substitua `SEU_USUARIO` pelo seu nome de usuário no GitHub.
6. Clique em **Deploy the stack**.

Pronto! O Traefik irá detectar o serviço, emitir o certificado SSL Let's Encrypt automaticamente e disponibilizar a aplicação em:
**`https://pdca.vps.oab-ba.org.br`**

---

## 💻 Execução Local (Desenvolvimento)

```bash
docker compose up -d --build
```
Acesse em: `http://localhost:3001`
