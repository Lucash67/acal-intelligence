# Prompt GPT — OSINT público da ACAL

Cole o bloco abaixo no ChatGPT (com navegação/web ligada, se disponível).

O GPT **não substitui** ERP, Power BI nem RH. Ele só acelera o que já é público. Depois, a Acal/TI confirma.

---

## Prompt para colar

```
Você é um analista de OSINT corporativo. Sua tarefa é preencher um levantamento de dados mestres da empresa ACAL Home Center (Ceará, Brasil) usando APENAS fontes públicas verificáveis.

REGRAS:
- Não invente nomes de gerentes, consultores, telefones pessoais, WhatsApp de funcionários, metas, vendas, estoque ou clientes.
- Se não encontrar, escreva "NÃO ENCONTRADO" e diga o que a empresa precisaria confirmar internamente.
- Toda afirmação deve ter URL da fonte e data de acesso.
- Classifique cada item: CONFIRMADO (site/oficial) | INDICADO (imprensa) | DESATUALIZADO | CONFLITANTE | NÃO ENCONTRADO.
- Separe claramente: loja de venda, loja Conceito, showroom/franquia, administração e centro de distribuição.
- Não extraia CPF, dados de clientes ou planilhas internas.
- Não invente códigos de ERP/BI.

FONTES OBRIGATÓRIAS A CONSULTAR:
1. https://www.acalhomecenter.com.br/nossaslojas
2. https://www.acalhomecenter.com.br/quem-somos
3. https://www.acalhomecenter.com.br/
4. Imprensa recente (70 anos, rebrand 2024, franquia Sobral, Conceito Eusébio)
5. Instagram/LinkedIn oficiais da marca, se públicos
6. Cartórios/CNPJ públicos da ARAUJO CABRAL E ALVES LTDA (07.201.916/0001-59), só dados institucionais

ENTREGUE NESTE FORMATO:

### A. Cadastro institucional
- razão social, nome fantasia, CNPJ matriz, sede, fundação, segmento

### B. Rede de unidades
Tabela:
codigo_provisorio | nome_publico | tipo (home_center/conceito/showroom/admin/cd) | cidade | bairro | endereco | telefone_publico | horario | fonte | confianca

### C. Conflitos
Onde "Quem Somos" diz 7 lojas e "Nossas Lojas" lista mais unidades, explique o conflito. Não escolha um número oficial.

### D. O que NÃO apareceu em fonte pública
Liste gerentes, consultores, metas, WhatsApp pessoal, códigos ERP, regras de estoque/inativo, Power BI.

### E. Hipótese operacional para o produto
Quais unidades provavelmente receberiam relatório executivo de gerente de loja, e quais provavelmente não (admin/CD). Marque como HIPÓTESE.

Não escreva texto motivacional. Seja factual e curto.
```

---

## O que o GPT consegue vs o que não consegue

| Consegue (público) | Não consegue (interno) |
| --- | --- |
| Nomes e endereços das lojas no site | Código ERP / storeId |
| Telefone da central e de algumas lojas | WhatsApp pessoal do gerente |
| Horário de funcionamento publicado | Meta diária |
| CNPJ e sede | Vendas, estoque, clientes |
| Tipos de unidade (Conceito, Showroom) | Quem é o gerente de cada loja |
| Notícias de expansão | Regras oficiais de inativo/estoque |

---

## Achados já verificados neste projeto

Fonte: [Nossas Lojas](https://www.acalhomecenter.com.br/nossaslojas) — acesso em 2026-08-18.

| codigo_provisorio | nome_publico | tipo | cidade | endereco | telefone_publico |
| --- | --- | --- | --- | --- | --- |
| pub-pk | Fortaleza Loja Presidente Kennedy | home_center | Fortaleza | Av. Cearenses, 423 | (85) 3492-5000 |
| pub-aldeota | Fortaleza Loja Aldeota | home_center | Fortaleza | Av. Desembargador Moreira, 2211 | (85) 3492-5000 |
| pub-messejana | Fortaleza Loja Messejana | home_center | Fortaleza | Av. Washington Soares, 10008 | (85) 3492-5000 |
| pub-parangaba | Fortaleza Loja Parangaba | home_center | Fortaleza | Av. Godofredo Maciel, 767 | (85) 3492-5000 |
| pub-centro | Fortaleza Loja Centro | home_center | Fortaleza | Av. Tristão Gonçalves, 1074 | (85) 3492-5000 |
| pub-conceito-aldeota | Fortaleza Loja Conceito Aldeota | conceito | Fortaleza | Av. Antônio Sales, 3210 | (85) 3492-5000 |
| pub-caucaia | Caucáia Loja Parque Soledade | home_center | Caucaia | Rua Coronel Correia, 2273 | (85) 3492-5000 |
| pub-maracanau | Maracanaú Loja Rodovia Senador Almir Pinto | home_center | Maracanaú | Rodovia Senador Almir Pinto, 10101 – Lote 11 | (85) 3492-5000 |
| pub-sobral | Sobral Loja Junco | showroom/franquia | Sobral | Av. Cleto Ferreira da Ponte, 1288 | (88) 9 8109-7766 |
| pub-aracati | Aracati Campo Verde | home_center | Aracati | R. Dragão do Mar, 1086A | (88) 9254-4535 |
| pub-limoeiro | Limoeiro do Norte Limoeiro | home_center | Limoeiro do Norte | Av. Dom Aureliano Matos, 883 | (88) 92145-5956 |
| pub-admin | Fortaleza Administração Rodolfo Teófilo | admin | Fortaleza | Rua Padre Cícero, 400 | (85) 3492-5000 |
| pub-cd | Centro de Distribuição Rodolfo Teófilo | cd | Fortaleza | Rua Pastor Samuel Munguba, 360 | (85) 3492-5000 |

Institucional público: ARAUJO CABRAL E ALVES LTDA, CNPJ 07.201.916/0001-59, fundada em 1954.

Conflito: a página Quem Somos ainda fala em 7 lojas; a página Nossas Lojas lista mais unidades. O spec do produto falava em 12 gerentes. A Acal precisa dizer quais unidades entram no disparo.

HIPÓTESE (não oficial): os 11 pontos de venda acima receberiam relatório; admin e CD não.
