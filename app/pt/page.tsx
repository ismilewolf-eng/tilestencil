import Link from "next/link";
import { OrganizationJsonLd, WebApplicationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { StencilLanding } from "@/components/StencilLanding";
import { localMetadata } from "@/lib/local-metadata";
import { localizedPath } from "@/lib/locale";

export const metadata = localMetadata("pt-BR", "home", {
  title: "Imprimir Imagem em Várias Folhas A4 Grátis (Tamanho Real) | TileStencil",
  description:
    "Divida qualquer imagem em várias folhas A4, A3 ou Carta no tamanho exato que você quer, com marcas de corte e sobreposição para montar. Grátis, sem cadastro e sem marca d'água. A imagem não sai do seu navegador.",
  keywords: [
    "imprimir imagem em várias folhas",
    "imprimir imagem em várias folhas a4",
    "dividir imagem para imprimir",
    "ampliar imagem para imprimir em várias folhas",
    "imprimir pôster em várias folhas",
    "pôster em folhas a4",
  ],
});

const howToSteps = [
  { name: "Escolha a imagem", text: "Selecione um JPG ou PNG do seu computador ou celular. A imagem é processada no navegador e não é enviada para nenhum servidor." },
  { name: "Digite o tamanho final", text: "Informe a largura ou a altura que o pôster deve ter na parede, em centímetros. A outra medida acompanha a proporção da imagem." },
  { name: "Escolha o papel", text: "Selecione A4, A3 ou Carta, retrato ou paisagem. A ferramenta mostra quantas folhas vai usar e como ficam divididas." },
  { name: "Imprima em tamanho real e monte", text: "Baixe o PDF, imprima em Tamanho real (100%), recorte nas marcas e cole as folhas seguindo os códigos A1, A2, B1…" },
];

const faqItems = [
  {
    question: "Como imprimir uma imagem em várias folhas A4?",
    answer:
      "Escolha a imagem nesta página, digite o tamanho final (por exemplo, 60 × 84 cm), selecione A4 e baixe o PDF. Cada folha sai numerada e com marcas de corte. Na hora de imprimir, escolha Tamanho real ou 100%, nunca Ajustar à página, para o pôster sair na medida certa.",
  },
  {
    question: "É grátis mesmo?",
    answer:
      "Sim. Dividir a imagem e baixar o PDF é grátis, sem cadastro, sem marca d'água e sem limite de folhas. Só o SVG para máquinas de corte (Cricut, Silhouette, laser) é pago: US$ 1,99 por imagem.",
  },
  {
    question: "Quantas folhas A4 eu preciso?",
    answer:
      "Depende do tamanho final e da margem da sua impressora. Com margem de 8 mm, um pôster de 60 × 84 cm usa 16 folhas A4 em retrato. A ferramenta mostra o número exato antes de você baixar.",
  },
  {
    question: "A imagem perde qualidade quando amplio?",
    answer:
      "A ferramenta não comprime nem transforma a imagem em pontinhos; ela usa os pixels originais. Mas uma foto pequena esticada até 1 metro vai ficar borrada de perto. Para pôsteres grandes, use a maior resolução que você tiver.",
  },
  {
    question: "Dá para usar no celular?",
    answer: "Dá. A página funciona no Chrome e no Safari do celular. O PDF baixado pode ser enviado para a impressora ou levado numa gráfica.",
  },
];

export default function PortugueseHomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd locale="pt-BR" />
      <WebApplicationJsonLd locale="pt-BR" />
      <StencilLanding
        locale="pt-BR"
        route="home"
        intro={{
          eyebrow: "PÔSTER EM VÁRIAS FOLHAS",
          heading: "Imprima qualquer imagem em várias folhas A4, no tamanho exato.",
          copy: "Escolha um JPG ou PNG, digite o tamanho final em centímetros e baixe um PDF dividido em folhas A4, A3 ou Carta, com marcas de corte para montar. Grátis, e a imagem não sai do seu navegador.",
        }}
        defaults={{ widthCm: 60, heightCm: 40 }}
        howToName="Como imprimir uma imagem em várias folhas A4"
        howToDescription="Divida uma imagem em várias folhas A4, A3 ou Carta no tamanho real e monte um pôster grande."
        howToSteps={howToSteps}
        quick={{
          heading: "Como imprimir uma imagem grande em várias folhas",
          paragraphs: [
            <>
              Escolha a imagem acima, digite o tamanho que o pôster deve ter (por exemplo, 60 × 84 cm), selecione A4 e clique em
              Exportar. O PDF sai com cada folha numerada (A1, A2, B1…), marcas de corte e uma faixa de sobreposição para colar.
              Imprima em <strong>Tamanho real / 100%</strong>. É grátis, sem cadastro e sem marca d&apos;água.
            </>,
            <>
              Exemplo: um pôster de 60 × 84 cm com margem de 8 mm usa 16 folhas A4 em retrato (4 colunas × 4 linhas).
            </>,
          ],
        }}
        sections={[
          {
            heading: "Para que serve",
            items: [
              "Painel de festa e decoração de aniversário com a foto do aniversariante",
              "Pôster grande para a parede do quarto, sem pagar gráfica",
              "Molde para pintar parede, mural ou letreiro",
              "Moldes de costura, artesanato e EVA impressos em tamanho real",
              <>
                Estêncil a partir de uma foto: veja o <Link href={localizedPath("pt-BR", "photoToStencil")}>criador de estêncil de foto</Link>
              </>,
            ],
          },
          {
            heading: "Dicas para o pôster sair certo",
            items: [
              "Na janela de impressão, escolha Tamanho real ou 100%. Ajustar à página encolhe cada folha e o pôster não fecha.",
              "Mantenha a sobreposição em 5 mm: dá para colar uma folha por cima da outra sem aparecer emenda.",
              "Recorte a margem branca só de um lado de cada folha e cole por trás com fita.",
              <>
                Procurando o Rasterbator? Veja a <Link href={localizedPath("pt-BR", "rasterbatorAlternative")}>alternativa ao Rasterbator</Link> sem
                pontinhos.
              </>,
            ],
          },
        ]}
        faqItems={faqItems}
      />
    </>
  );
}
