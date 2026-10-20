import Link from "next/link";
import { StencilLanding } from "@/components/StencilLanding";
import { localMetadata } from "@/lib/local-metadata";
import { localizedPath } from "@/lib/locale";

export const metadata = localMetadata("pt-BR", "blockpostersAlternative", {
  title: "Block Posters Grátis em Português: Pôster em Várias Folhas sem Limite",
  description:
    "Faça um block poster grátis: divida qualquer imagem em várias folhas A4, A3 ou Carta no tamanho exato, sem limite de folhas e sem marca d'água. Em português, sem cadastro, a imagem não sai do navegador.",
  keywords: ["block posters", "block posters grátis", "block poster em português", "alternativa ao block posters", "pôster em várias folhas a4"],
});

const howToSteps = [
  { name: "Escolha a imagem", text: "JPG ou PNG, do computador ou do celular. Nada é enviado para servidor." },
  { name: "Digite o tamanho final", text: "Em centímetros. A outra medida acompanha a proporção." },
  { name: "Escolha o papel", text: "A4, A3 ou Carta, retrato ou paisagem. Veja quantas folhas vai usar." },
  { name: "Baixe, imprima e monte", text: "Imprima em Tamanho real (100%) e cole as folhas seguindo os códigos da grade." },
];

const faqItems = [
  {
    question: "Este site é o Block Posters?",
    answer:
      "Não. O Block Posters (blockposters.com) é outro site. O TileStencil faz a mesma coisa, dividir uma imagem em várias folhas para montar um pôster, e é uma alternativa grátis.",
  },
  {
    question: "Tem limite de folhas ou marca d'água?",
    answer:
      "Não. Você pode dividir em quantas folhas precisar e o PDF sai sem marca d'água. A versão grátis do Block Posters já teve limite de folhas e de resolução; confira as condições atuais no site deles.",
  },
  {
    question: "Consigo definir o tamanho em centímetros?",
    answer:
      "Sim. Você digita a largura ou a altura final em centímetros (ou polegadas) e o pôster impresso sai com essa medida, desde que você imprima em Tamanho real (100%).",
  },
  {
    question: "Quanto custa?",
    answer: "O PDF é grátis. Só o SVG para máquinas de corte (Cricut, Silhouette, laser) é pago: US$ 1,99 por imagem.",
  },
];

export default function PortugueseBlockPostersPage() {
  return (
    <StencilLanding
      locale="pt-BR"
      route="blockpostersAlternative"
      intro={{
        eyebrow: "BLOCK POSTERS GRÁTIS",
        heading: "Block poster grátis: sua imagem em várias folhas, no tamanho exato.",
        copy: "Escolha a imagem, digite o tamanho final em centímetros e baixe o PDF dividido em folhas A4, A3 ou Carta. Sem limite de folhas, sem marca d'água e sem cadastro.",
      }}
      defaults={{ widthCm: 60, heightCm: 40 }}
      howToName="Como fazer um block poster grátis"
      howToDescription="Divida uma imagem em várias folhas no tamanho real e monte um pôster grande."
      howToSteps={howToSteps}
      quick={{
        heading: "Como fazer um block poster de graça",
        paragraphs: [
          <>
            Escolha a imagem acima, digite o tamanho final (por exemplo, 60 × 84 cm), selecione A4 e baixe o PDF. Cada folha sai
            numerada, com marcas de corte e sobreposição. Imprima em <strong>Tamanho real / 100%</strong> e cole as folhas. Não tem
            limite de folhas nem marca d&apos;água.
          </>,
        ],
      }}
      sections={[
        {
          heading: "O que você ganha aqui",
          items: [
            "Tamanho final exato em centímetros ou polegadas",
            "Folhas A4, A3 ou Carta, retrato ou paisagem",
            "Margem da impressora e sobreposição ajustáveis",
            "Modo cinza e modo preto e branco para economizar tinta ou fazer moldes",
            "A imagem fica no seu navegador: nada é enviado",
          ],
        },
        {
          heading: "Ideias de uso",
          items: [
            "Painel de festa com foto ou personagem",
            "Pôster de parede e quadro grande",
            <>
              Molde de letras grandes para painel: use o <Link href={localizedPath("pt-BR", "letterStencils")}>gerador de moldes de letras</Link>
            </>,
            <>
              Quer o efeito de pontinhos? Veja a <Link href={localizedPath("pt-BR", "rasterbatorAlternative")}>comparação com o Rasterbator</Link>
            </>,
          ],
        },
      ]}
      faqItems={faqItems}
    />
  );
}
