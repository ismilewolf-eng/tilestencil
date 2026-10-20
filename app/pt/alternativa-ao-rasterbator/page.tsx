import Link from "next/link";
import { StencilLanding } from "@/components/StencilLanding";
import { localMetadata } from "@/lib/local-metadata";
import { localizedPath } from "@/lib/locale";

export const metadata = localMetadata("pt-BR", "rasterbatorAlternative", {
  title: "Alternativa ao Rasterbator em Português: Pôster em Folhas A4 sem Pontinhos",
  description:
    "Quer o efeito do Rasterbator, mas com a foto nítida? Divida a imagem em várias folhas A4 no tamanho exato em centímetros, sem transformar em pontinhos. Grátis, em português, sem cadastro e sem enviar a imagem.",
  keywords: [
    "rasterbator",
    "rasterbator online",
    "rasterbator em português",
    "alternativa ao rasterbator",
    "rasterbator grátis",
    "dividir imagem em várias folhas",
  ],
});

const howToSteps = [
  { name: "Escolha a imagem", text: "Selecione um JPG ou PNG. A foto continua com os pixels originais: nada vira pontinho." },
  { name: "Defina o tamanho em centímetros", text: "Digite a largura ou a altura final do mural. A proporção da imagem é mantida." },
  { name: "Escolha o papel e baixe o PDF", text: "A4, A3 ou Carta. Cada folha sai numerada, com marcas de corte e sobreposição." },
  { name: "Imprima em tamanho real e monte", text: "Imprima em Tamanho real (100%) e cole as folhas seguindo os códigos da grade." },
];

const faqItems = [
  {
    question: "Esta ferramenta é o Rasterbator?",
    answer:
      "Não. O TileStencil é uma ferramenta independente que faz o mesmo trabalho de dividir uma imagem em várias folhas, mas sem o efeito de pontinhos (rasterização). O Rasterbator original continua no ar em rasterbator.net.",
  },
  {
    question: "Qual é a diferença para o Rasterbator?",
    answer:
      "O Rasterbator é famoso por transformar a foto em pontinhos de tamanhos diferentes, que de longe formam a imagem. Aqui a foto fica como é, nítida, e você define o tamanho final exato em centímetros. Se você quer justamente o visual de pontinhos, o Rasterbator é a ferramenta certa.",
  },
  {
    question: "Precisa baixar algum programa?",
    answer: "Não. Tudo roda no navegador, inclusive no celular. A imagem não é enviada para nenhum servidor.",
  },
  {
    question: "É grátis?",
    answer:
      "Sim. Dividir a imagem e baixar o PDF é grátis, sem cadastro, sem marca d'água e sem limite de folhas. Só o SVG para máquinas de corte é pago (US$ 1,99 por imagem).",
  },
  {
    question: "Quantas folhas vou usar num mural de 1 metro?",
    answer:
      "Um mural de 100 × 70 cm em A4 paisagem, com margem de 8 mm e sobreposição de 5 mm, usa 16 folhas (4 × 4). A ferramenta mostra o número exato para o seu tamanho antes de baixar.",
  },
];

export default function PortugueseRasterbatorPage() {
  return (
    <StencilLanding
      locale="pt-BR"
      route="rasterbatorAlternative"
      intro={{
        eyebrow: "ALTERNATIVA AO RASTERBATOR",
        heading: "Pôster gigante em folhas A4, como no Rasterbator, mas com a foto nítida.",
        copy: "Divida a imagem em várias folhas no tamanho exato em centímetros, sem virar pontinhos. Grátis, em português, e a imagem não sai do seu navegador.",
      }}
      defaults={{ widthCm: 100, heightCm: 70, paperSize: "a4" }}
      howToName="Como fazer um pôster em várias folhas sem o efeito de pontinhos"
      howToDescription="Divida uma foto em várias folhas A4 no tamanho real, mantendo a imagem nítida."
      howToSteps={howToSteps}
      quick={{
        heading: "Uma alternativa ao Rasterbator que mantém a foto nítida",
        paragraphs: [
          <>
            Se você quer o efeito de pontinhos, use o Rasterbator. Se quer a foto como ela é, no tamanho exato, use esta página:
            escolha a imagem, digite o tamanho final em centímetros, escolha A4 e baixe o PDF dividido em folhas numeradas. É
            grátis, sem cadastro e sem marca d&apos;água.
          </>,
          <>Exemplo: um mural de 100 × 70 cm em A4 paisagem usa 16 folhas (4 × 4).</>,
        ],
      }}
      sections={[
        {
          heading: "TileStencil e Rasterbator: o que muda",
          items: [
            <>
              <strong>Sem pontinhos:</strong> a imagem mantém os pixels originais, então rostos, textos e desenhos ficam
              legíveis de perto.
            </>,
            <>
              <strong>Tamanho exato:</strong> você digita a largura em centímetros e o pôster impresso sai com essa medida.
            </>,
            <>
              <strong>Montagem fácil:</strong> cada folha tem código (A1, A2, B1…), marcas de corte e uma faixa de
              sobreposição para colar.
            </>,
            <>
              <strong>Privado:</strong> a divisão e o PDF são feitos no seu navegador; a imagem não é enviada.
            </>,
            <>
              <strong>Moldes também:</strong> o modo preto e branco transforma a foto em{" "}
              <Link href={localizedPath("pt-BR", "photoToStencil")}>estêncil para recortar</Link>.
            </>,
          ],
        },
        {
          heading: "Outras opções grátis",
          body: (
            <>
              O <Link href={localizedPath("pt-BR", "blockpostersAlternative")}>Block Posters</Link> (online) e o PosteRazor
              (programa para Windows, Mac e Linux) também dividem imagens em várias folhas.
            </>
          ),
        },
      ]}
      faqItems={faqItems}
    />
  );
}
