# Seu negócio · site de delivery

Loja própria de pizzas e lanches, mobile first, com a jornada de compra que o público brasileiro já conhece dos apps de delivery: busca, categorias, personalização com preço ao vivo, sacola persistente e checkout em etapas.

> **Ambiente de demonstração.** Cardápio, preços, avaliações, promoções, horários e pedidos são fictícios. Nenhum pedido é enviado à loja e nenhum pagamento é processado. Tudo isso está identificado na interface.

## Como rodar

Requer Node 20.19+ ou 22.12+ (testado com Node 24).

```bash
npm install
npm run dev        # http://localhost:5173 (também abre na rede local para testar no celular)
npm run build      # checagem de tipos + build de produção em dist/
npm run preview    # serve o build de produção
npm test           # testes unitários e de componente (Vitest)
```

Para testar num celular: rode `npm run dev`, conecte o celular na mesma rede e abra o endereço "Network" que o Vite mostra no terminal.

## O que funciona

- **Início:** cabeçalho com menu, saudação, logo, notificações e sacola; busca com filtros; tempo, taxa e pedido mínimo antes de escolher; banner com 3 destaques (deslizar ou pelos pontos); categorias; "Mais pedidos"; banner de combos; benefícios.
- **Busca e filtros:** busca por parte do nome, sem acento e sem diferenciar maiúsculas; filtros de categoria, faixa de preço e ordenação, combináveis e removíveis um a um; estado vazio com sugestões.
- **Produto:** sheet com tamanho, meio a meio (cobra o sabor mais caro), massa, borda, adicionais com preço, remoção de ingredientes, quantidade e observação. O preço final aparece no botão e é atualizado a cada escolha. Opções obrigatórias são validadas antes de adicionar.
- **"+" consistente:** adiciona direto quando não há escolha obrigatória; quando há, abre as opções.
- **Sacola:** editar personalização, mudar quantidade, remover com "Desfazer", limpar com confirmação, cupom (com motivo claro quando não vale), subtotal, taxa e desconto em linhas separadas, aviso de pedido mínimo. Persiste no `localStorage` e sincroniza entre abas.
- **Checkout em 4 etapas:** dados (nome e celular), entrega ou retirada (CEP preenche o endereço via ViaCEP), pagamento (Pix, cartão na entrega, dinheiro com troco validado) e revisão, com "Alterar" que volta direto para a revisão. Depois vem a confirmação.
- **Pedidos, Ofertas, Perfil e Favoritos:** histórico local dos pedidos demonstrativos, combos e cupons, dados salvos no aparelho (com opção de apagar), favoritos.
- **Navegação:** barra inferior com o "Pedidos" central em destaque, barra flutuante "Ver sacola" (padrão de apps de delivery), cabeçalho completo no desktop. Sheets e menus ficam na URL, então o botão voltar do celular fecha o sheet em vez de sair da página.

## Estrutura

```
src/
  data/          catálogo, categorias, promoções, configuração da loja, registro de imagens
  lib/           regras de negócio puras (preços, sacola, busca, checkout, máscaras, CEP)
  services/      contratos de pedidos e pagamento + implementação demonstrativa
  hooks/         estado compartilhado (sacola, favoritos, filtros, rascunho do checkout, toasts, overlays)
  components/
    ui/          design system (botões, sheet, campos, chips, logo...)
    catalog/     busca, filtros, categorias, cards, personalização
    cart/        sacola, cupom, resumo de valores
    checkout/    etapas do checkout
    home/        banners, benefícios, informações de entrega
    layout/      cabeçalhos, barra inferior, barra da sacola, menu, notificações
  pages/         Início, Cardápio, Pedidos, Ofertas, Perfil, Favoritos, Checkout, Confirmação
```

O design system está documentado em [DESIGN.md](DESIGN.md) (tokens, tipografia, componentes e regras), com os tokens de origem em [src/index.css](src/index.css).

## Trocando os dados demonstrativos

| O quê | Onde |
|---|---|
| Produtos, preços, opções, badges, avaliações | [src/data/products.ts](src/data/products.ts) |
| Categorias | [src/data/categories.ts](src/data/categories.ts) |
| Banners, combos, cupons | [src/data/promotions.ts](src/data/promotions.ts) |
| Taxa, tempo estimado, pedido mínimo, horários, formas de pagamento, benefícios, modo demonstração | [src/data/store.ts](src/data/store.ts) |
| Fotos (com a origem Unsplash de cada uma) | [src/data/images.ts](src/data/images.ts) e `public/images/` |

Para esconder as avaliações demonstrativas, use `showDemoRatings: false` em `store.ts`. Para retirar os avisos de demonstração, use `demoMode: false`, mas só depois de ligar um backend real.

## O que ainda depende de backend

- **Pedidos:** [src/services/orders.ts](src/services/orders.ts) define o contrato (`createOrder`, `listOrders`, `getOrder`). Hoje os pedidos ficam só no navegador. A tela de confirmação já tem a linha do tempo de status, que só aparece para pedidos vindos da API.
- **Pagamento:** [src/services/payments.ts](src/services/payments.ts) define o contrato do provedor. Pix online e cartão online precisam de um provedor no servidor. O front nunca deve receber dados de cartão.
- **Cardápio, disponibilidade e horários:** hoje são arquivos estáticos. O filtro já esconde produtos com `available: false`.
- **Notificações e acompanhamento da entrega:** não existem. O sino não mostra contagem até haver uma fonte real.
- **Cupons:** validados no cliente apenas para demonstração. Em produção, a validação precisa acontecer no servidor.
- **Área de entrega:** nenhum CEP é recusado. A validação de raio ou bairro atendido depende da loja.

## Pesquisa de UX que orientou as decisões

Fontes consultadas em 20/10/2026:

- **iFood, "Bastidores: como funciona um pedido do iFood"** (institucional, 11/07/2025). Lida.
- **iFood, "iFood é o app de delivery mais conhecido e usado do país"** (institucional, 15/07/2025, pesquisa Opinion Box 2023). Lida.
- **iFood Tech, "De ideias a impacto: o Jeito iFood de fazer Produto & Design"** (Bel Araújo, 08/10/2025, via feed RSS da publicação). Lida.
- **iFood Tech, "Os bastidores do seu pedido no iFood"** e **"Designers que brincam com comida"** (Medium). **Não acessadas:** o Medium bloqueou a leitura (HTTP 403) e o arquivo da web não estava disponível. Nada aqui se baseia nelas.

| Princípio (fonte) | Problema do usuário | Decisão | Onde |
|---|---|---|---|
| O app mostra tempo previsto e taxas já na listagem (iFood, como funciona um pedido) | Surpresa com custo e prazo no fim | Linha "Entrega 30–40 min · Taxa · Mínimo" antes do cardápio; taxa separada em todo resumo | Início, sacola, checkout |
| O app confere o último endereço usado e sugere revisá-lo (idem) | Pedido entregue no lugar errado | Endereço salvo no aparelho, preenchido e sempre visível na revisão com "Alterar" | Checkout |
| Itens, complementos e observações como "tirar um ingrediente" (idem) | Não conseguir pedir do jeito que gosta | Grupos de opções, remoção de ingredientes e observação com limite | Sheet do produto |
| A sacola mostra meios de pagamento e cupons antes de fechar (idem) | Descobrir tarde que o cupom não vale | Cupons disponíveis listados na sacola, com motivo claro quando não se aplicam | Sacola |
| Itens indisponíveis não aparecem (idem) | Escolher algo que não pode ser vendido | Produtos com `available: false` saem da listagem | Catálogo |
| 96% conhecem e 94% usam o iFood (Opinion Box 2023, citado pelo iFood) | Ter que aprender uma interface nova | Padrões conhecidos: busca no topo, trilho de categorias, "+" vermelho, barra "Ver sacola", sheet de opções | Todo o site |
| 52% desistem de comprar diante de avaliações ruins (idem) | Avaliação falsa enganaria quem decide | Avaliações marcadas "demo", sem contagem de avaliações nem de vendas | Cards e produto |
| Decisões baseadas em evidência; o trabalho continua após a entrega (Jeito iFood de Produto & Design) | Achismo no lugar de dados | Dados fictícios separados e rotulados, prontos para trocar por dados reais e medir | `src/data`, `src/services` |

As convenções de interface acima seguem o que o público conhece de apps de delivery. Elas não são apresentadas como regra oficial do iFood: as fontes descrevem o fluxo e a lógica do pedido, não especificações de tela.

## Decisões que fogem do briefing

- **Saudação sem emoji:** o briefing pedia "Olá, seja bem-vindo! 🍕", mas a regra do projeto ([CLAUDE.md](CLAUDE.md)) proíbe emojis. Usei o ícone de pizza do Lucide no lugar.
- **"Pedidos" no centro + sacola sempre à vista:** mantive o destaque central da referência para "Pedidos" (histórico, como no iFood). A sacola fica no canto do cabeçalho e na barra flutuante "Ver sacola", para nunca haver dúvida sobre onde ela está.
- **Duas colunas no celular:** a referência mostra três cards por linha. O briefing pede duas colunas no celular, para manter nomes e preços legíveis.
- **Fotos inteiras nas categorias:** a referência usa recortes de comida sobre fundo branco. Usei fotos reais enquadradas, porque não há recortes disponíveis.
- **Texto secundário #6E6862:** o #777777 do briefing não atinge contraste AA sobre o fundo bege.

## Verificação feita

- `npm run build`: tipos sem erros e build de produção OK.
- `npm test`: 32 testes passando (preços, cupons, sacola, busca, máscaras, validação do checkout e card de produto).
- Navegador headless (Chromium), em 390 px, 360 px, 768 px, 1280 px e 1440 px: busca parcial, busca sem resultado, categoria, filtros combinados e remoção individual, validação de opção obrigatória, preço calculado (2 × Suprema grande com borda e bacon = R$ 129,80), adição rápida, persistência após recarregar, cupom com teto (R$ 15,00), desfazer remoção, editar item, checkout completo com CEP real via ViaCEP, troco inválido, editar a partir da revisão, confirmação, favoritos, botão voltar fechando o menu, ordem de tabulação, Esc fechando o sheet com foco devolvido ao card. Sem rolagem horizontal em nenhuma largura e sem erros no console.
- **Não verificado em aparelho real:** safe areas (notch e barra de gestos), teclado virtual e sensação de toque precisam ser conferidos num celular físico.

## Imagens

Todas as fotos são da [Unsplash](https://unsplash.com) (Licença Unsplash). Elas foram baixadas para `public/images/`, para o site não depender de CDN externo. O id de origem de cada foto está em [src/data/images.ts](src/data/images.ts) e no `.json` ao lado de cada arquivo.
