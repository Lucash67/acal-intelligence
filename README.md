# ACAL Intelligence

Plataforma interna de automação e inteligência executiva da Acal.

Esta fase entrega um MVP isolado para provar a esteira:

**DADOS → MÉTRICAS → IA → RELATÓRIO → DESIGN → ENTREGA → HISTÓRICO**

Nenhum dado corporativo, servidor da TI, WhatsApp real ou cron de produção entra neste ambiente.

O cadastro de unidades usa nomes e endereços públicos da Acal. Gerentes, metas, vendas, estoque e clientes permanecem simulados.

## Como executar

```bash
npm install
npx prisma generate
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

O dashboard funciona sem Supabase e sem OpenAI. Nesse caso, a persistência fica em memória e a IA usa `MockAIProvider`.

Em produção (Vercel) o acesso exige login. Configure `AUTH_USERNAME`, `AUTH_PASSWORD` e `AUTH_SECRET`. Localmente, se a senha estiver vazia, o middleware libera o dashboard.

## Supabase (opcional nesta fase)

1. Crie um projeto pessoal de desenvolvimento no Supabase.
2. Copie `.env.example` para `.env`.
3. Preencha `DATABASE_URL` (pooler, porta 6543) e `DIRECT_URL` (conexão direta, porta 5432).
4. Rode:

```bash
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Não copie bases corporativas, clientes reais, funcionários reais, vendas reais ou datasets do Power BI.

## Scripts

| Script | Uso |
| --- | --- |
| `npm run dev` | Dashboard local |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run db:generate` | Prisma Client |
| `npm run db:migrate` | Migrations |
| `npm run db:seed` | Seed de desenvolvimento |
| `npm run db:studio` | Prisma Studio |

## Arquitetura

A persistência fica atrás de repositórios. Providers de dados, IA e mensageria são substituíveis.

```
MockDataSourceProvider  →  AnalyticsEngine  →  AIProvider  →  ReportGenerator
        ↑                        ↑                 ↑                ↓
   storeId isolado         métricas oficiais   JSON validado   ExecutiveReport
                                                                   ↓
                                                         Visual + Messaging
                                                                   ↓
                                                         Execução / Entrega / Log
```

Substituições futuras, sem reconstruir o produto:

- `MockDataSourceProvider` → provider corporativo
- `MockAIProvider` → `OpenAIProvider`
- `MockMessagingProvider` → `ZApiMessagingProvider`
- Supabase de desenvolvimento → infraestrutura definida com Rodrigo/TI

## Segurança

- Cada execução trabalha com um `storeId`.
- A IA recebe apenas as métricas da loja em processamento.
- Secrets ficam em variáveis de ambiente e só no server-side.
- Falha de uma loja não interrompe as demais.

## Fora desta fase

- Banco corporativo
- Servidor administrado pelo Rodrigo
- Disparo real no WhatsApp
- Cron de produção
- Autenticação corporativa definitiva
- Regras de negócio ainda não definidas pela Acal
