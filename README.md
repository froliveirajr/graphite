# Graphite Operacional

Sistema web para gerenciamento operacional da Graphite, com foco em obras, reformas, equipes, materiais, compras, estoque, descarte, diario de obra, financeiro e relatorios.

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 7
- PostgreSQL
- Zod
- lucide-react

## O que ja existe

- Dashboard operacional com indicadores, alertas, obras em foco e tarefas do dia.
- Tela de login visual para o fluxo de autenticacao futuro.
- Listagem de clientes.
- Listagem de obras com filtros visuais.
- Detalhe de obra com abas previstas pelo SDD, resumo financeiro, ambientes e tarefas.
- Kanban inicial de tarefas.
- Catalogo inicial de materiais.
- Telas preparadas para compras, estoque, funcionarios, terceirizados, descarte, relatorios e configuracoes.
- Schema Prisma amplo com usuarios, clientes, obras, ambientes, tarefas, checklist, funcionarios, terceirizados, fornecedores, materiais, compras, estoque, descarte, diario, arquivos, financeiro, aprovacoes e auditoria.

## Rodar localmente

```bash
npm install
npm run dev
```

A aplicacao abre em `http://localhost:3000`.

## Banco de dados

O projeto esta preparado para usar o PostgreSQL do Supabase Free com Prisma.

No painel do Supabase, abra o projeto e clique em **Connect**. Para Prisma, use as URLs do **Supavisor**:

- `DATABASE_URL`: connection string pooled usada pela aplicacao.
- `DIRECT_URL`: connection string usada por Prisma Migrate/CLI.

Para deploy serverless, como Vercel, use a connection string do Supavisor em modo transaction na porta `6543` como `DATABASE_URL`. Para migrations, use a session pooler na porta `5432` como `DIRECT_URL`.

Crie um arquivo `.env` baseado em `.env.example`:

```bash
DATABASE_URL="postgresql://[DB-USER].[PROJECT-REF]:[DB-PASSWORD]@[DB-REGION].pooler.supabase.com:6543/postgres?sslmode=require"
DIRECT_URL="postgresql://[DB-USER].[PROJECT-REF]:[DB-PASSWORD]@[DB-REGION].pooler.supabase.com:5432/postgres?sslmode=require"
```

Recomendacao do Supabase: criar um usuario dedicado para o Prisma no SQL Editor, por exemplo `prisma`, com permissoes no schema `public`. Depois use esse usuario nas URLs acima.

Valide, gere o client e aplique as migrations:

```bash
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate
```

O helper de banco fica em `src/lib/db/prisma.ts` e usa `DATABASE_URL` com o adapter oficial `@prisma/adapter-pg`.

Para popular o banco com dados iniciais de demonstracao:

```bash
npm run db:seed
```

## Proximos passos recomendados

1. Implementar autenticacao real e controle de permissoes por perfil.
2. Conectar CRUD de clientes e obras ao Prisma.
3. Criar Server Actions ou API routes para formularios com validacao Zod.
4. Implementar upload de arquivos em storage externo.
5. Adicionar testes basicos para regras de negocio criticas.
