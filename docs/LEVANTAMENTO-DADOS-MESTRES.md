# Levantamento de Dados Mestres — ACAL Intelligence

Instrumento para varredura da empresa antes de substituir mocks por dados reais.

Pesquisa pública com GPT: use o prompt em `docs/PROMPT-GPT-OSINT-ACAL.md`. OSINT cobre lojas, endereços e telefones institucionais. Não cobre gerentes, metas, vendas nem WhatsApp pessoal.

Não coletar, copiar nem enviar à IA:

- bases corporativas completas
- CPF, endereço, histórico detalhado de cliente
- dados de funcionário além do necessário ao relatório
- planilhas do Power BI sem autorização

Nesta fase, o objetivo é **nomear, mapear e autorizar**. Extração real vem depois, com Acal/TI.

Para cada item: **dado → fonte oficial → dono → status**.

---

## 0. Cadastro organizacional

| # | Dado | Por que precisamos | Fonte provável | Status |
| --- | --- | --- | --- | --- |
| 0.1 | Razão social e nome fantasia oficiais | Textos, rodapé, relatórios | Jurídico / site | PUBLIC_CONFIRMED — ARAUJO CABRAL E ALVES LTDA / Acal Home Center |
| 0.2 | Quantidade oficial de lojas/filiais ativas | Confirmar se são 12 | Operações | CONFLICTING — “Quem Somos” cita 7; “Nossas Lojas” lista 11 comerciais + Admin + CD. Spec fala em 12 gerentes. Não usar um número oficial. |
| 0.3 | Lojas inativas, em reforma ou sazonais | Não disparar relatório morto | Operações | CONFLICTING — Conceito Eusébio em imprensa 2024, ausente da listagem oficial 18/08/2026 |
| 0.4 | Código interno oficial da loja (ERP / BI) | `storeId` real | TI / ERP | INTERNAL_PENDING — slugs provisórios no seed |
| 0.5 | Hierarquia: loja → regional → diretoria | Futuros destinatários | Diretoria | INTERNAL_PENDING — modelar OrganizationUnit / Manager / ReportRecipient |
| 0.6 | Fuso e horário comercial por loja | Ciclos 06:30 / 13:30 | Operações | Horários de loja PUBLIC_CONFIRMED no site; fuso America/Fortaleza PUBLIC_INFERRED. Scheduler ainda não depende disso. |
| 0.7 | Quem autoriza uso de dados reais no MVP | Compliance | Diretoria / TI | INTERNAL_PENDING |

---

## 1. Lojas e filiais (prioridade máxima)

Uma linha por loja. Sem inventar nome.

| # | Dado | Exemplo de uso | Status |
| --- | --- | --- | --- |
| 1.1 | Código oficial | Chave de isolamento por loja | INTERNAL_PENDING — IDs atuais são slugs nossos |
| 1.2 | Nome oficial da loja/filial | Header do relatório | PUBLIC_CONFIRMED — 11 unidades comerciais na página “Nossas Lojas” |
| 1.3 | Cidade / bairro / shopping | Contexto no card | PUBLIC_CONFIRMED |
| 1.4 | UF | Agrupamento futuro | PUBLIC_CONFIRMED — CE |
| 1.5 | Tipo (rua, shopping, outlet, aeroporto, etc.) | Só se existir na Acal | PARCIAL — home center / conceito / showroom inferidos; Aracati e Limoeiro INTERNAL_PENDING |
| 1.6 | Status (ativa / inativa) | Ligar/desligar disparo | PUBLIC_CONFIRMED para as 11 da listagem; Eusébio CONFLICTING |
| 1.7 | Telefone da loja (se houver) | Não confundir com WhatsApp do gerente | PUBLIC_CONFIRMED — canais institucionais; alguns números de interior |
| 1.8 | CNPJ da filial, se cada loja tiver um | Só se for necessário ao cadastro | INTERNAL_PENDING — só CNPJ matriz público |

Entregar como planilha: `codigo | nome | cidade | uf | status | codigo_erp | codigo_bi`.

---

## 2. Destinatários (gerentes / líderes)

| # | Dado | Observação | Status |
| --- | --- | --- | --- |
| 2.1 | Nome do gerente ou líder operacional | Como deve aparecer no relatório | MOCK — nomes fictícios; LinkedIn não usado |
| 2.2 | Cargo oficial | Gerente, sub, líder de equipe | |
| 2.3 | Loja(s) sob responsabilidade | 1:1 ou um líder em mais de uma loja? | |
| 2.4 | WhatsApp oficial de destino (DDI + DDD + número) | Número corporativo ou pessoal autorizado | |
| 2.5 | Nome do contato no celular | Evitar disparo para número antigo | |
| 2.6 | Substituto em folga/férias | TODO(ACAL-WHATSAPP) | |
| 2.7 | Grupo de WhatsApp da loja, se existir | Não implementar agora; só mapear | |
| 2.8 | Quem **não** pode receber dados de outras lojas | Regra de isolamento | |

---

## 3. Consultores / equipe comercial

| # | Dado | Observação | Status |
| --- | --- | --- | --- |
| 3.1 | Código interno do consultor | Nunca usar CPF no sistema | |
| 3.2 | Nome de apresentação | Como o gerente reconhece no dia a dia | |
| 3.3 | Loja de lotação | Isolamento | |
| 3.4 | Status (ativo, férias, desligado) | Não ranquear desligado | |
| 3.5 | Meta individual oficial | Diária? Por ciclo? | |
| 3.6 | Existe conversão oficial? | Se não, o campo fica `null` | |
| 3.7 | Critério oficial de destaque vs atenção | Não inventar | |
| 3.8 | Apelido ou nome de crachá | Só se o time usar isso no chão de loja | |

---

## 4. Metas e calendário comercial

| # | Dado | Observação | Status |
| --- | --- | --- | --- |
| 4.1 | Meta diária da loja | Relatório matinal/vespertino | |
| 4.2 | A meta matinal usa D-1 ou outro recorte? | Confirmar o spec atual | |
| 4.3 | A meta vespertina é do dia em curso? | Confirmar | |
| 4.4 | Meta muda em sábado, domingo e feriado? | |
| 4.5 | Quem cadastra/atualiza meta | Comercial / controladoria | |
| 4.6 | Existem metas semanais/mensais oficiais? | Mapear; não implementar agora | |
| 4.7 | Campanhas vigentes que alteram leitura | Só se a Acal quiser no relatório | |

---

## 5. Vendas e resultado da loja

| # | Dado | Observação | Status |
| --- | --- | --- | --- |
| 5.1 | Definição oficial de “total vendido” | Bruto, líquido, com serviço, sem devolução? | |
| 5.2 | Moeda e casas decimais | BRL | |
| 5.3 | Horário de corte do D-1 | Ex.: 23:59 da loja | |
| 5.4 | Horário de corte do parcial da tarde | Ex.: 13:29 | |
| 5.5 | Devoluções entram no dia da venda ou do estorno? | |
| 5.6 | Venda de outro canal (televendas, site) entra na loja? | |
| 5.7 | Ticket médio, margem, conversão da loja | Só se já forem oficiais no BI | |

---

## 6. Estoque e produtos

| # | Dado | Observação | Status |
| --- | --- | --- | --- |
| 6.1 | Código SKU oficial | |
| 6.2 | Nome comercial do produto | Como o gerente identifica | |
| 6.3 | Unidade (un, cx, m) | |
| 6.4 | Saldo oficial e em qual depósito | Loja vs CD | |
| 6.5 | O que é “zerado” | Saldo = 0 na loja? | |
| 6.6 | O que é “crítico” | Threshold, cobertura, ruptura? | |
| 6.7 | O que é “alta demanda” | |
| 6.8 | O que é “queda relevante de vendas” | % ? dias ? | |
| 6.9 | Linhas/famílias oficiais | |
| 6.10 | Itens que não devem ir ao WhatsApp | Preço de custo, fornecedor, etc. | |

---

## 7. Clientes

| # | Dado | Observação | Status |
| --- | --- | --- | --- |
| 7.1 | O que conta como cliente novo | Cadastro do dia? Primeira compra? | |
| 7.2 | Quantos dias para inativo | TODO(ACAL-BUSINESS) | |
| 7.3 | Inativo é sem compra ou sem visita? | |
| 7.4 | Cliente da loja vs cliente da rede | Isolamento | |
| 7.5 | Podemos mostrar **contagem** sem nome? | Preferível no MVP | |
| 7.6 | Se um dia houver lista nominal | Autorização LGPD explícita | |

Não pedir nome, telefone, CPF ou histórico de cliente nesta varredura, salvo autorização formal.

---

## 8. Fontes de dados (Power BI / ERP / banco)

| # | Dado | Observação | Status |
| --- | --- | --- | --- |
| 8.1 | Sistema de origem do Power BI | ERP, SQL Server, Data Warehouse, API | |
| 8.2 | Nome dos datasets/relatórios oficiais | |
| 8.3 | Tabelas/views por loja, venda, estoque, cliente, vendedor | |
| 8.4 | Campo que isola a loja | `storeId` real | |
| 8.5 | Latência: dados de ontem estão prontos às 06:30? | Crítico para o ciclo matinal | |
| 8.6 | Dados do dia já existem às 13:30? | Ciclo vespertino | |
| 8.7 | Quem pode liberar acesso somente-leitura | Rodrigo / TI | |
| 8.8 | Ambiente de homologação existe? | Sem produção no MVP | |
| 8.9 | Dicionário de dados ou print das colunas | Sem extrair a base | |

---

## 9. Regras de negócio ainda abertas

Confirmar com Comercial/Operações. Não inventar.

| # | Regra | Status |
| --- | --- | --- |
| 9.1 | Top 3 destaques: por atingimento, faturamento ou outro? | |
| 9.2 | Top 3 atenção: atingimento, conversão, distância da meta ou combinação? | |
| 9.3 | Empate no ranking | |
| 9.4 | Consultor sem meta entra no ranking? | |
| 9.5 | Dias para cliente inativo | |
| 9.6 | Estoque crítico | |
| 9.7 | Queda relevante de linha | |
| 9.8 | Alta demanda + estoque insuficiente | |
| 9.9 | Relatório sai se a loja estiver fechada? | |
| 9.10 | Relatório sai se faltar um bloco (ex.: estoque)? | |

---

## 10. Distribuição WhatsApp

| # | Dado | Status |
| --- | --- | --- |
| 10.1 | Canal oficial: Z-API, API Meta ou outro | |
| 10.2 | Instância, dono e quem paga | |
| 10.3 | Enviar texto, imagem 1080×1350, PDF ou os três? | |
| 10.4 | Um número por gerente ou grupo da loja? | |
| 10.5 | Confirmação de que o número aceita mensagem de empresa | |
| 10.6 | Política de retry | |
| 10.7 | Quem recebe alerta se a loja falhar | |
| 10.8 | Horários 07:00 e 14:00 são oficiais e imutáveis? | |
| 10.9 | Exceção em feriado | |

---

## 11. Identidade visual

| # | Dado | Status |
| --- | --- | --- |
| 11.1 | Brandbook / Manual ACAL 2024 | EXISTE / obter internamente |
| 11.2 | HEX oficiais (primary, secundárias, fundo) | NÃO ENCONTRADO — primary atual amostrado do wordmark (`#009CE0`) |
| 11.3 | Wordmark oficial (azul, branco, versões) | ASSETS PÚBLICOS EXISTEM — validar versão 2024 |
| 11.4 | Uso do “home center” no produto interno | A VALIDAR |
| 11.5 | Tipografias oficiais | Estilo descrito em imprensa; fonte exata INTERNAL_PENDING |
| 11.6 | Pode usar “ACAL Intelligence” como nome do produto? | WORKING_TITLE — não autorizado oficialmente |

---

## 12. Infraestrutura e TI

| # | Dado | Status |
| --- | --- | --- |
| 12.1 | Destino de produção (quando sair do Supabase pessoal) | |
| 12.2 | Quem decide com Rodrigo | |
| 12.3 | Scheduler (cron, worker, fila) | |
| 12.4 | Autenticação corporativa futura | |
| 12.5 | Quem acessa o dashboard além do time de desenvolvimento | |

---

## 13. Privacidade e autorização

| # | Dado | Status |
| --- | --- | --- |
| 13.1 | Autorização para tratar telefone de gerente | |
| 13.2 | Autorização para nomes de consultores no WhatsApp | |
| 13.3 | Proibição explícita de dados de cliente pessoa física | |
| 13.4 | Retenção de relatórios e logs (quantos dias) | |
| 13.5 | Quem apaga um disparo/histórico | |

---

## Ordem recomendada da varredura

1. Lista oficial das lojas (nome, código, cidade, status)
2. Gerente de cada loja + WhatsApp autorizado
3. Fonte do Power BI e campo de isolamento por loja
4. Definição de “total vendido” e meta
5. Cadastro de consultores por loja
6. Regras de destaque, atenção, estoque e inativo
7. Brandbook
8. Z-API / destinatários
9. Infra com Rodrigo/TI

## Readiness após OSINT (18/08/2026)

| Bloco | Estado |
| --- | --- |
| Organização pública | PARCIALMENTE MAPEADA |
| Unidades | PARCIALMENTE CONFIRMADAS (11 comerciais + Admin + CD; Eusébio conflitante) |
| Estrutura gerencial | INTERNAL_PENDING |
| Dados operacionais | MOCK |
| Integração BI | INTERNAL_PENDING |
| WhatsApp | INTERNAL_PENDING |
| Brand system | PARCIALMENTE MAPEADO |

Cadastro organizacional pode sair parcialmente de MOCK. Dados operacionais continuam 100% MOCK.

TODO(ACAL-BUSINESS): confirmar relação entre os 12 gerentes do spec e as unidades públicas.
TODO(ACAL-DATA): obter código ERP/BI oficial de cada unidade.
