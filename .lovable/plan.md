
## Plano: Academia Benefit

### Fase 1 — Landing Page (`/benefit`)
- Criar página pública com visual próprio (diferente da GRID)
- Seções: Hero, Modalidades, Estrutura (1.400m²), Avaliações, Contato
- Dados: endereço, telefone, horários, links sociais (Facebook, Instagram)
- WhatsApp: (47) 99174-6474

### Fase 2 — Backend (Lovable Cloud)
- Ativar Lovable Cloud
- Criar tabelas: `profiles`, `user_roles` (admin/professor/funcionario/aluno)
- Configurar RLS para cada role

### Fase 3 — Sistema de Login (`/benefit/login`)
- Tela de login com email/senha
- Dashboard por role:
  - **ADM**: gerenciar todos os usuários, registrar alunos, ver tudo
  - **Funcionário**: registrar alunos, enviar cobrança via WhatsApp (link direto)
  - **Professor**: montar treinos para alunos
  - **Aluno**: ver seus treinos

### Fase 4 — Funcionalidades
- **Registro de alunos**: ADM/Funcionário cadastra aluno no sistema
- **Cobranças via WhatsApp**: Funcionário clica "Cobrar" → abre WhatsApp com mensagem pré-formatada
- **Montagem de treinos**: Professor cria treino (exercícios, séries, repetições) e vincula ao aluno
- **Visualização de treino**: Aluno faz login e vê seu treino atual

### Ordem de execução
Começarei pela Fase 1 (landing page) e Fase 2 (ativar Cloud), depois seguirei para login e funcionalidades.
