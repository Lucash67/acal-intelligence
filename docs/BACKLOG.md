# Backlog de pendências — ACAL Intelligence

Varrido em 18/08/2026 a partir do código, de `LEVANTAMENTO-DADOS-MESTRES.md`, do OSINT e do que foi deixado explícito para depois. Inclui tarefa boba.

Não feche o escopo em “12 lojas”. O spec fala em 12 gerentes; o site lista 11 unidades comerciais + Admin + CD; “Quem Somos” ainda cita 7.

## Já feito nesta fase

- Prompt OSINT e varredura pública
- Cadastro institucional público no seed
- 11 unidades comerciais + Admin + CD + Eusébio conflitante
- Badge “estrutura Acal · dados operacionais simulados”
- Temas claro / escuro / ACAL
- Pipeline isolado por `storeId` com providers substituíveis
- Tela de login com cookie assinado (`AUTH_USERNAME` / `AUTH_PASSWORD`)

## Se você só tiver uma hora

1. Git + `.env` consciente (memória ou Supabase vivo, nunca URL morta)
2. Planilha das unidades para a Acal preencher código ERP/BI e gerentes
3. Uma pergunta só: quem autoriza dado real e o nome “ACAL Intelligence”
4. Não peça Power BI, Z-API nem servidor do Rodrigo antes disso

---

## Agora (você consegue puxar)

- Criar repositório git e remoto (hoje não existe `.git`)
- Copiar `.env.example` → `.env` e decidir se o dashboard roda só em memória
- Montar a planilha `codigo | nome | cidade | uf | status | codigo_erp | codigo_bi` para a Acal preencher
- Combinar quem fala com o Rodrigo e o que **não** pedir a ele agora
- Pedir autorização do nome “ACAL Intelligence” (hoje é `WORKING_TITLE`)
- Pedir confirmação por escrito: MVP mostra só **contagem** de cliente, sem nome
- Confirmar com Operações a quantidade oficial de pontos ativos
- Cruzar os 12 gerentes do spec com as unidades públicas
- Confirmar se Conceito Eusébio está ativa e entra no fluxo

## Próximo (não bloqueia demo, mas organiza o piloto)

- Supabase pessoal + migrate + reseed com os slugs novos
- Instalar Chromium do Playwright para o PNG 1080×1350
- Matriz de Data Readiness (~100 itens com status)
- Página curta de “o que o sistema NÃO guarda”
- Testar `OpenAIProvider` com chave real
- Template visual do relatório vespertino (hoje só o matinal)
- Persistência Prisma de endereço, horário, tipo, proveniência
- Separar `OrganizationUnit` / `Manager` / `ReportRecipient` (1:N)
- Testes do Analytics Engine e do isolamento por loja
- Pedir dicionário/print das colunas do BI, sem extrair a base
- Obter Brandbook 2024 e validar HEX / wordmark / “home center”
- Confirmar modelo de Sobral, Aracati e Limoeiro
- Decidir se Admin e CD terão relatório próprio
- Cargo oficial do destinatário; meta em sábado/domingo/feriado
- Formato do WhatsApp: texto, imagem, PDF ou os três
- Confirmar se 07:00 e 14:00 são oficiais; exceção de feriado
- Existe conversão oficial? Se não, o campo fica `null`
- Saldo de estoque: loja vs CD

## Bloqueiam piloto real (Acal / TI)

- Quem autoriza uso de dado real
- `codigo_erp`, `codigo_bi`, `storeId` corporativo
- Nome do gerente, escopo (1:1 ou 1:N), WhatsApp autorizado, substituto
- Quem não pode receber dado de outra loja
- Lista oficial de consultores (código interno, nunca CPF)
- Critério de destaque vs atenção
- Meta diária oficial e recorte D-1 / tarde
- Definição de “total vendido”, devolução, e-commerce/televendas
- Zerado / crítico / alta demanda / queda relevante
- Cliente novo e dias para inativo
- Origem do Power BI, datasets, views, campo de isolamento
- Latência: D-1 às 06:30 e parcial às 13:30
- Quem libera leitura; existe homologação?
- Canal oficial (Z-API vs Meta), instância, dono, quem paga
- Número aceita mensagem de empresa?
- LGPD: telefone de gerente e nome de consultor no WhatsApp
- Implementar providers reais só depois dos itens acima

## Depois (mapear, não implementar agora)

- CNPJ por filial, se existir
- Hierarquia loja → regional → diretoria
- Grupo de WhatsApp da loja
- Nome salvo no celular do destinatário
- Apelido/crachá
- Metas semanais/mensais e campanhas no relatório
- Ticket médio / margem — só se já forem oficiais
- Retry e alerta humano quando a loja falhar
- Destino de produção, cron/worker/fila, autenticação, quem acessa o dashboard
- Retenção de relatórios/logs e quem apaga
- Tipografia oficial
- CI (lint + typecheck) quando houver git

## Bobo, mas está pendente

- Reiniciar `npm run dev` quando o Simple Browser der `ERR_NETWORK_IO_SUSPENDED`
- Considerar tirar o projeto do OneDrive (compile lento, processo inchado)
- Não ligar o scheduler nos horários públicos das lojas
- Validar fuso `America/Fortaleza`
- Decidir se `@acalhomecenter` entra em algum lugar (provavelmente não)
- Renomear menu “Lojas” → “Unidades”
- Traduzir leftovers em inglês (Overview, alguns status)
- Trocar `next lint` (deprecado no Next 16)
- Ignorar o aviso de npm 12
- Health check não deveria timeoutar na primeira compilação
