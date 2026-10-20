# Seu negócio · site de delivery

Loja própria de pizzas e lanches, mobile first, com a jornada de compra que o público brasileiro já conhece dos apps de delivery: busca, categorias, personalização com preço ao vivo, sacola persistente e checkout em etapas.

O mesmo template se transforma em outros segmentos: uma faixa no topo de todas as páginas troca o site, sem recarregar, entre **Pizzaria** (a identidade original), **Confeitaria**, **Cafeteria** e **Açaíteria**. Mudam cores, tipografia, fotos e textos da marca; a estrutura continua a mesma. Veja [Temas](#temas-um-site-quatro-marcas).

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
- **Temas:** faixa "Ver este site como" com seletor de segmento (paleta de cada tema no próprio seletor), transição animada entre as marcas, link direto por segmento (`?tema=cafeteria`). Cada tema tem a própria sacola, favoritos e histórico de pedidos.
- **Navegação:** barra inferior com o "Pedidos" central em destaque, barra flutuante "Ver sacola" (padrão de apps de delivery), cabeçalho completo no desktop. Sheets e menus ficam na URL, então o botão voltar do celular fecha o sheet em vez de sair da página.

## Estrutura

```
src/
  themes/        os quatro temas: uma pasta por segmento (catálogo, categorias, banners, fotos, textos da marca),
                 registro dos temas, pré-carregamento e os tokens de cada tema (themes.css)
  data/          dados compartilhados por todos os temas: configuração da loja, pagamentos, benefícios, cupons
  lib/           regras de negócio puras (preços, sacola, busca, checkout, máscaras, CEP)
  services/      contratos de pedidos e pagamento + implementação demonstrativa
  hooks/         estado compartilhado (sacola, favoritos, filtros, rascunho do checkout, toasts, overlays)
  components/
    ui/          design system (botões, sheet, campos, chips, logo...)
    catalog/     busca, filtros, categorias, cards, personalização
    cart/        sacola, cupom, resumo de valores
    checkout/    etapas do checkout
    home/        banners, benefícios, informações de entrega
    layout/      cabeçalhos, faixa de temas, barra inferior, barra da sacola, menu, notificações
  pages/         Início, Cardápio, Pedidos, Ofertas, Perfil, Favoritos, Checkout, Confirmação
```

O design system está documentado em [DESIGN.md](DESIGN.md) (tokens, tipografia, componentes e regras), com os tokens de origem em [src/index.css](src/index.css).

## Trocando os dados demonstrativos

| O quê | Onde |
|---|---|
| Produtos, preços, opções, badges, avaliações | `src/themes/<tema>/products.ts` (Pizzaria: [src/themes/pizzaria/products.ts](src/themes/pizzaria/products.ts)) |
| Categorias e ordem das seções do cardápio | `src/themes/<tema>/categories.ts` |
| Nome, slogan, horários, banners do topo, banner de combos | `src/themes/<tema>/index.ts` |
| Fotos (com a origem Unsplash de cada uma) | `src/themes/<tema>/images.ts` e `public/images/` (Pizzaria) ou `public/images/themes/<tema>/` |
| Cores e tipografia | Pizzaria: [src/index.css](src/index.css) (`@theme`); demais: [src/themes/themes.css](src/themes/themes.css) |
| Cupons (valem para todos os temas) | [src/data/promotions.ts](src/data/promotions.ts) |
| Taxa, tempo estimado, pedido mínimo, endereço de retirada, formas de pagamento, benefícios, modo demonstração | [src/data/store.ts](src/data/store.ts) |

Para esconder as avaliações demonstrativas, use `showDemoRatings: false` em `store.ts`. Para retirar os avisos de demonstração, use `demoMode: false`, mas só depois de ligar um backend real.

## Temas: um site, quatro marcas

| Tema | Marca | Paleta | Tipografia |
|---|---|---|---|
| Pizzaria (padrão) | Seu negócio | vermelho, farinha, forno | Barlow Condensed + Inter |
| Confeitaria | Ateliê Doce | framboesa, blush, vinho-chocolate | Bodoni Moda + Figtree |
| Cafeteria | Grão & Prosa | cobre, areia, torra escura | Besley + Hanken Grotesk |
| Açaíteria | Roxo Açaí | violeta, lavanda, polpa de açaí com destaque lima | Bricolage Grotesque + Onest |

- **Sempre começa na Pizzaria.** Para mandar a versão de um segmento a um cliente, use o link com `?tema=`: `/?tema=confeitaria`, `/?tema=cafeteria`, `/?tema=acaiteria`.
- **Como funciona:** os tokens de cor e tipografia ficam em `<html data-theme="…">`. Os componentes só leem tokens, então a troca não toca na estrutura. Na troca, as cores fazem a transição juntas (480 ms), cada foto faz crossfade só depois que a nova está carregada (sem quadro vazio), e as fontes do tema novo são carregadas antes. Com "reduzir movimento" ativo, tudo vira um fade de 200 ms.
- **Sacola, favoritos e pedidos são por tema**, como lojas diferentes. A Pizzaria continua usando as mesmas chaves do `localStorage` de antes, então sacolas já salvas não se perdem.
- **Os nomes Ateliê Doce, Grão & Prosa e Roxo Açaí são fictícios**, como todo o cardápio de demonstração.

### Adicionar um quinto segmento

1. Copie uma pasta de tema (por exemplo `src/themes/cafeteria/`) e troque produtos, categorias, banners, textos da marca e fotos. Ids de produto não podem se repetir entre temas, e uma categoria com o mesmo id em dois temas precisa ter o mesmo nome (os testes conferem).
2. Coloque as fotos em `public/images/themes/<tema>/` nos tamanhos dos outros temas (produtos 400/800 px quadrados, banners 800×600 e 1400×1050, categorias 192 px), cada uma com o `.json` de origem.
3. Acrescente o bloco `[data-theme='<tema>']` em [src/themes/themes.css](src/themes/themes.css) com os mesmos tokens dos outros temas, importe as fontes em [src/main.tsx](src/main.tsx) e confira o contraste.
4. Adicione o id em `ThemeId` ([src/themes/types.ts](src/themes/types.ts)) e o tema na lista de [src/themes/index.ts](src/themes/index.ts).

Nenhum componente precisa mudar. `npm test` confere se cada tema preenche os mesmos espaços do template, se todas as fotos existem e se as cores do seletor batem com os tokens.

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
- `npm test`: 64 testes passando (preços, cupons, sacola, busca, máscaras, validação do checkout, card de produto, e os temas: espaços do template preenchidos, fotos existentes, cores do seletor iguais aos tokens, desconto do banner igual ao dos combos, seletor por mouse e teclado, sacola separada por tema).
- **Temas, no navegador headless (Edge):** a Pizzaria ficou idêntica pixel a pixel à versão anterior (com a faixa de temas ocultada) em início, cardápio, ofertas, perfil, pedidos e favoritos, a 390 px e 1440 px; as únicas diferenças medidas são de decodificação das fotos, que a versão anterior também tem entre duas capturas dela mesma. Os quatro temas a 360, 390, 430, 768 e 1440 px (início, cardápio e ofertas), sem rolagem horizontal, sem nome da marca vazando do cabeçalho, sem imagem quebrada e sem erro no console; transição gravada quadro a quadro em câmera lenta; troca repetida e interrompida termina no último tema escolhido; "reduzir movimento" encurta tudo para 200 ms.
- Navegador headless (Chromium), em 390 px, 360 px, 768 px, 1280 px e 1440 px: busca parcial, busca sem resultado, categoria, filtros combinados e remoção individual, validação de opção obrigatória, preço calculado (2 × Suprema grande com borda e bacon = R$ 129,80), adição rápida, persistência após recarregar, cupom com teto (R$ 15,00), desfazer remoção, editar item, checkout completo com CEP real via ViaCEP, troco inválido, editar a partir da revisão, confirmação, favoritos, botão voltar fechando o menu, ordem de tabulação, Esc fechando o sheet com foco devolvido ao card. Sem rolagem horizontal em nenhuma largura e sem erros no console.
- **Não verificado em aparelho real:** safe areas (notch e barra de gestos), teclado virtual e sensação de toque precisam ser conferidos num celular físico.

## Imagens

Todas as fotos são da [Unsplash](https://unsplash.com) (Licença Unsplash, só fotos gratuitas, nenhuma Unsplash+). Elas foram baixadas para `public/images/` (Pizzaria) e `public/images/themes/<tema>/`, para o site não depender de CDN externo. O id de origem de cada foto está no `images.ts` de cada tema e no `.json` ao lado de cada arquivo. Fotos com marcas de terceiros visíveis (embalagens de café, copos de redes de açaí) foram descartadas na seleção.
