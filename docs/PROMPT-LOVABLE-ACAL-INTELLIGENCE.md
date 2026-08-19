# Prompt Lovable — ACAL Intelligence (UI de alto nível)

Cole o bloco abaixo inteiro no Lovable. O objetivo é gerar um **protótipo visual de elite** (React + Tailwind) para depois clonarmos o que for bom no repositório real. Não peça backend, banco, WhatsApp real nem Power BI. Tudo simulado.

---

Você é um diretor de design de produto, não um gerador de dashboard SaaS genérico.

Construa o **ACAL Intelligence**: plataforma interna de inteligência executiva da **Acal Home Center**, rede cearense de materiais para reforma e construção (70+ anos). O produto transforma dados da loja em um relatório matinal/vespertino e entrega no WhatsApp do gerente. Nesta fase, a UI é o produto: ela precisa parecer uma **sala de comando de uma marca de 70 anos**, não um template do shadcn.

Trabalhe em **português do Brasil** em 100% da interface. Zero inglês visível: nada de Overview, Dashboard, Settings, Success, Failed, Live, Mock, Preview, Login, Logout, Theme. Use Visão geral, Sucesso, Falha, Sair, Entrar, Aparência, Ambiente simulado.

## O que este produto É (e o que NÃO é)

É: um sistema interno para gerentes de loja e operação. Cada loja é isolada. O objeto sagrado da interface é o **relatório visual 1080×1350** — um cartão vertical que o gerente recebe no celular. O dashboard existe para operar, simular e auditar esse ciclo.

Não é: e-commerce, ERP, CRM, Power BI, site institucional, app de cliente final.

Selo permanente no topo do sistema:
**Estrutura Acal · dados operacionais simulados**

Nomes e endereços das unidades são reais e públicos. Gerentes, telefones de gerente, vendas, metas, estoque, clientes e consultores são **100% fictícios**. Nunca invente CPF, cliente nominal, código ERP ou código BI. Nunca use nomes do LinkedIn.

O nome **ACAL Intelligence** é título de trabalho. Trate como marca do produto, em caixa baixa no lockup: `acal` / `intelligence`.

## Direção estética (é aqui que você precisa me surpreender)

Referência de **estrutura** (não de cor): Odontology Finance — https://odontology-finance.vercel.app
- Login: marca no canto superior esquerdo, selo no canto superior direito, headline grande centralizada, cartão de acesso no centro, botão **Entrar →**
- App: coluna esquerda escura, marca no topo, navegação em grupos com ícones, rodapé do menu **preso na altura da janela** (tema + Sair sempre visíveis, sem scroll da página)
- Conteúdo: área clara, cartões com raio ~16px, hierarquia tipográfica calma, muito ar

**Proibido copiar o verde, o creme e o preto do Odontology.** A Acal não é clínica. É home center do Ceará.

Paleta (única permitida, amostrada do wordmark oficial):
- Azul Acal `#009CE0`
- Azul claro `#6FD0F2`
- Azul profundo `#0077AB`
- Navy da operação `#061018`
- Superfície `#F4FBFE`
- Texto `#06344A`
- Sucesso `#2F8A5F` / Atenção `#C08E0C` / Falha `#C24B4B`

Três temas, trocáveis no rodapé do menu, sem recarregar:
1. **Acal** — azul bebê como cor de página, sidebar navy, azul da marca nos acentos
2. **Claro** — papel quase branco, azul só nos destaques
3. **Escuro** — navy `#061018`, sem cinza morto de template

A identidade 2024 da Acal (70 anos) é: azul tradicional + tipografia minúscula + formas arredondadas + sensação de material (piso, tinta, porcelanato) sem virar catálogo de loja. Pense em **luz de Fortaleza às 7h da manhã** — o horário em que o gerente abre o WhatsApp.

Quero que a UI tenha:
- Lockup com marca geométrica (A estilizado / prisma de luz) + `acal` / `intelligence` em minúsculas. Grande. Legível a 5 metros.
- Tipografia: uma grotesk humana para UI + uma mono tabular só para números (hora, R$, %).
- Números como objetos: atingimento 97% precisa ter peso emocional, não ser um `<stat>`.
- O relatório 1080×1350 como um **objeto físico** na tela (proporção 1080/1350, cantos 22px, como um cartão que caberia na mão).
- Microinterações curtas (120–180ms), sem festa.
- Empty states bonitos, em português.
- Zero gradiente arco-íris, zero glassmorphism barato, zero emoji, zero ilustração de stock.

Se você for tentado a fazer um “admin template azul”, pare e redesenhe. Quero algo que um diretor da Acal abra e pense: isso nasceu aqui.

## Arquitetura de telas (implemente TODAS)

Rotas:
- `/login`
- `/` Visão geral
- `/relatorios` Histórico
- `/relatorios/:id` Visualização do relatório
- `/automacoes` Ciclos
- `/lojas` Unidades
- `/lojas/:id` Unidade
- `/indicadores` Leitura por loja
- `/entregas` Distribuição
- `/logs` Registros
- `/configuracoes` Ambiente

Navegação, grupos e ícones (Lucide):
**Operação**
- Visão geral — LayoutDashboard — `/`
- Relatórios — FileText — `/relatorios`
- Automações — Timer — `/automacoes`
- Unidades — Building2 — `/lojas`
- Indicadores — BarChart3 — `/indicadores`

**Sistema**
- Entregas — Truck — `/entregas`
- Registros — ScrollText — `/logs`
- Configurações — Settings — `/configuracoes`

Sidebar: `h-screen`, `position: sticky`, largura 248px, fundo navy. Nav com `overflow-y-auto` só se precisar. Rodapé **sempre visível**: Aparência (3 ícones: sol, lua, marca Acal) + Sair. Em mobile: header com menu + lockup + Sair.

## Cadastro institucional (use no login e em Configurações)

- Razão social: ARAUJO CABRAL E ALVES LTDA
- Nome fantasia: Acal Home Center
- CNPJ matriz: 07.201.916/0001-59
- Fundação: 1954
- Sede: Rua Padre Cícero, 400, Rodolfo Teófilo, CEP 60430-585, Fortaleza/CE
- SAC: (85) 3492-5001
- Central de Vendas: (85) 3492-5000
- Para Empresas: (85) 3492-5010
- Fuso: America/Fortaleza
- Instagram público da marca: @acalhomecenter (não precisa ir para o menu)

## Unidades (dados mestres da UI)

Não invente loja. Use exatamente estas. IDs são slugs nossos, **não** são código ERP/BI.

### Comerciais — entram no relatório (reportEnabled)

1. Loja Presidente Kennedy — Fortaleza / Presidente Kennedy — Av. Cearenses, 423 — (85) 3492-5000 — Seg–Sex 8h–20h; Sáb 8h–15h; Dom fechada — Home center — meta simulada R$ 22.000 — gerente simulado Helena Duarte
2. Loja Aldeota — Fortaleza / Aldeota — Av. Desembargador Moreira, 2211 — (85) 3492-5000 — Seg–Sex 8h–20h; Sáb 8h–15h; Dom 8h–14h — Home center — R$ 28.000 — Rafael Moura
3. Loja Messejana — Fortaleza / Messejana — Av. Washington Soares, 10008 — (85) 3492-5000 — Seg–Sex 8h–20h; Sáb 8h–15h; Dom fechada — Home center — R$ 20.000 — Marina Costa
4. Loja Parangaba — Fortaleza / Parangaba — Av. Godofredo Maciel, 767 — (85) 3492-5000 — Seg–Sex 8h–19h; Sáb 8h–15h; Dom 8h–14h — Home center — R$ 19.000 — Paulo Mendes
5. Loja Centro — Fortaleza / Centro — Av. Tristão Gonçalves, 1074 — (85) 3492-5000 — Seg–Sex 8h–18h; Sáb 8h–15h; Dom fechada — Home center — R$ 18.000 — Camila Freitas
6. Loja Conceito Aldeota — Fortaleza / Aldeota — Av. Antônio Sales, 3210 — (85) 3492-5000 — Seg–Sex 9h–18h; Sáb 9h–13h; Dom fechada — Conceito — R$ 16.000 — Eduardo Pires
7. Loja Parque Soledade — Caucaia / Parque Soledade — Rua Coronel Correia, 2273 — (85) 3492-5000 — Seg–Sex 8h–18h; Sáb 8h–15h; Dom fechada — Home center — R$ 15.000 — Diego Azevedo
8. Loja Rodovia Senador Almir Pinto — Maracanaú / Parque Tijuca — Rodovia Senador Almir Pinto, 10101 – Lote 11 — (85) 3492-5000 — Seg–Sex 8h–19h; Sáb 8h–15h; Dom fechada — Home center — R$ 17.000 — Beatriz Ramos
9. Loja Junco — Sobral / Junco — Av. Cleto Ferreira da Ponte, 1288 — (88) 9 8109-7766 — Seg–Sex 8h–18:30; Sáb 8h–13h; Dom fechada — Showroom (modelo franquia é INDICADO, não definitivo) — R$ 12.000 — Lívia Castro
10. Campo Verde — Aracati / Campo Verde — R. Dragão do Mar, 1086A — (88) 9254-4535 — Seg–Sex 8h–19h; Sáb 8h–16h; Dom fechada — tipo própria/franquia pendente — R$ 11.000 — Thiago Nogueira
11. Limoeiro — Limoeiro do Norte — Av. Dom Aureliano Matos, 883 — (88) 92145-5956 — Seg–Sex 8h–19h; Sáb 8h–16h; Dom fechada — tipo pendente — R$ 10.000 — Sofia Barros

### Fora do relatório de gerente
12. Administração Rodolfo Teófilo — Fortaleza — Rua Padre Cícero, 400 — Seg–Sex 8h–17h — sem relatório
13. Centro de Distribuição Rodolfo Teófilo — Fortaleza — Rua Pastor Samuel Munguba, 360 — Seg–Sex 8h–17h; Sáb 8h–12h — sem relatório
14. Acal Conceito Eusébio — Eusébio — Av. Eusébio de Queiroz, 2850, Mall Marché — **Conflitante / inativa**: inaugurada em 2024 na imprensa, ausente da listagem oficial atual. Não entra no fluxo.

Conflito estrutural (mostre com honestidade, sem inventar um número oficial):
- Página “Quem Somos” cita 7 lojas
- “Nossas Lojas” lista 11 comerciais + Admin + CD
- Spec interno fala em 12 gerentes
- Nunca escreva “12 lojas” como verdade

Proveniência (badges em português): Público confirmado · Inferido · Simulado · Pendente interno · Conflitante

## O ciclo que a UI precisa tornar óbvio

Esteira: **Dados → Métricas → Inteligência → Relatório → Design → Entrega → Histórico**

Dois ciclos (agendamento desligado nesta fase; botões só simulam):
- Matinal: processa 06:30 · entrega 07:00 · dados do dia anterior
- Vespertino: processa 13:30 · entrega 14:00 · parcial do dia

Pipeline isolado por unidade. Falha de uma loja não para as outras. Destino futuro: WhatsApp. Agora a entrega é simulada.

## Relatório executivo (o objeto mais importante)

Cartão vertical **1080 × 1350**. Preview no dashboard e na página da loja.

Blocos, nesta ordem:
1. Cabeçalho: acal intelligence · Relatório matinal/vespertino · nome da loja · cidade · data · gerente
2. KPIs: Vendas · Meta · Atingimento
3. Desempenho: Top consultores (destaque)
4. Atenção: consultores abaixo
5. Estoque: zerados e críticos (SKU + nome de material de construção: tinta, porcelanato, argamassa, louça — fictícios)
6. Clientes: só **contagens** — novos e inativos. Jamais nome, telefone ou CPF
7. Inteligência: parágrafo executivo curto
8. Plano de ação: 3 a 5 itens

Status de consultor: Destaque · Estável · Atenção  
Estoque: Alta demanda / Normal / Baixa · tendência Sobe / Estável / Cai

Use BRL com formatação pt-BR. Datas dd/mm/aaaa. Horário 24h.

## Conteúdo de cada tela

**Login**
Headline: “Inteligência executiva para a operação da Acal”
Sub: estrutura pública da rede; números operacionais simulados.
Campos: Usuário, Senha, Entrar →
Selo: Ambiente simulado
Tema no canto.

**Visão geral**
Título: Central operacional
4 cartões: Próxima execução (06:30 / 13:30) · Relatórios hoje · Entregas · Falhas
Status do sistema: modo, persistência (Memória local), inteligência, saúde
Tabela: últimas execuções (loja, período Matinal/Vespertino, status Sucesso/Falha, início)
Botão: Simular ciclo matinal

**Relatórios**
Histórico por loja. Abrir preview.

**Automações**
Dois cartões de ciclo, horários enormes em mono, selo “Agendamento inativo”, botão simular.

**Unidades**
Grade com as 14 entidades. Comerciais clicáveis. Admin/CD/Eusébio com estado visual distinto. Endereço, horário, tipo, relatório simulado ou não aplicável.

**Unidade**
Endereço público, telefone institucional, horário, códigos internos = “Pendente”. Se for comercial: KPIs simulados + cartão 1080×1350 + execuções. Se não: mensagem de fora do fluxo.

**Indicadores**
Gráfico de atingimento das 11 lojas comerciais + tabela (vendas, meta, atingimento, zerados, novos, inativos). Números simulados, nomes reais.

**Entregas**
Tabela: loja, destinatário fictício, canal WhatsApp, horário, tentativas, status.

**Registros**
Tabela: horário, loja, etapa (Início, Fonte de dados, Indicadores, Inteligência, Relatório, Entrega, Conclusão), duração, status, detalhe. Sem secrets.

**Configurações**
Cadastro institucional público. Provedores: Fonte de dados Simulado · Inteligência Simulada · Mensagens Simuladas. Conectividade Pronto/Desligado. Tema. Identidade: HEX acima. Nunca mostre senha, token ou connection string.

## Dados simulados de exemplo (pode usar)

Visão geral do dia 19/08/2026:
- Relatórios hoje: 5
- Entregas: 2
- Falhas: 2
- Últimas: Parangaba Sucesso · Parque Soledade Sucesso · Limoeiro Falha · Presidente Kennedy Sucesso · Messejana Falha

Atingimentos simulados (manhã):
Presidente Kennedy 118% · Aldeota 97% · Messejana 71% · Parangaba 109% · Centro 82% · Conceito Aldeota 114% · Parque Soledade 94% · Almir Pinto 122% · Junco 88% · Campo Verde 102% · Limoeiro 116%

## Regras duras

- Não invente a 12ª loja comercial.
- Não use verde Odontology, roxo Linear, laranja Vercel.
- Não coloque autenticação corporativa, gráfico 3D, dark-only, inglês, Lorem ipsum.
- Não construa CRUD pesado. É um protótipo de operação + relatórios.
- Faça desktop first (1440) e um mobile honesto do login e do relatório.
- Entregue as 10 rotas navegáveis, com dados preenchidos, não wireframe cinza.

Quando terminar o casco, refine o **login** e o **cartão 1080×1350** até parecerem peça de marca. Se só uma tela puder ser perfeita, que seja o relatório na mão do gerente às 07:00 em Fortaleza.
