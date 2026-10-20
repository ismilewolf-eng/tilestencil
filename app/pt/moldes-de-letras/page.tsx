import Link from "next/link";
import { StencilLanding } from "@/components/StencilLanding";
import { localMetadata } from "@/lib/local-metadata";
import { localizedPath } from "@/lib/locale";

export const metadata = localMetadata("pt-BR", "letterStencils", {
  title: "Moldes de Letras para Imprimir em Qualquer Tamanho (Grátis)",
  description:
    "Digite a palavra e imprima moldes de letras vazadas no tamanho exato, de 5 cm a mais de 1 metro, divididos em folhas A4. Três fontes de estêncil, grátis e sem cadastro.",
  keywords: [
    "molde de letras para imprimir",
    "moldes de letras grandes",
    "letras vazadas para imprimir",
    "molde de letras para pintura",
    "letras grandes para imprimir",
    "molde de números",
  ],
});

const howToSteps = [
  { name: "Digite o texto", text: "Uma palavra, um nome, o número da casa ou uma frase curta. Use Enter para quebrar linha." },
  { name: "Escolha a fonte", text: "São três fontes de estêncil, já com as pontes que seguram o miolo de letras como A, B, O e 8." },
  { name: "Digite o tamanho final", text: "A largura total que o texto deve ter. Se for maior que uma folha, ele é dividido em várias." },
  { name: "Imprima, cole e recorte", text: "Imprima em Tamanho real (100%), cole as folhas pelos códigos e recorte as letras." },
];

const faqItems = [
  {
    question: "Como imprimir moldes de letras grandes?",
    answer:
      "Digite o texto nesta página, escolha a fonte e informe a largura total, por exemplo 90 cm para um painel. O PDF divide as letras em folhas A4 com marcas de corte. Imprima em Tamanho real (100%) e cole as folhas.",
  },
  {
    question: "Por que as letras têm esses espaços?",
    answer:
      "São as pontes do estêncil. Letras como A, B, D, O, P e R e os números 0, 4, 6, 8 e 9 têm miolo fechado; sem as pontes, o miolo cairia ao recortar. Para recortar a letra inteira em EVA ou papel colorido, é só ignorar essas pontes.",
  },
  {
    question: "Funciona com acento e ç?",
    answer: "Funciona. As três fontes têm as letras acentuadas do português (á, â, ã, é, ê, í, ó, ô, õ, ú) e o ç, então dá para escrever nomes como JOÃO ou CONCEIÇÃO.",
  },
  {
    question: "Preciso imprimir o alfabeto inteiro?",
    answer: "Não. Você digita só as letras que vai usar e elas já saem com espaçamento e no tamanho certo.",
  },
  {
    question: "Posso usar para vender placas e produtos?",
    answer: "Pode. As fontes usam a licença SIL Open Font License, que permite uso comercial. O texto não sai do seu navegador.",
  },
  {
    question: "Dá para exportar para Cricut ou Silhouette?",
    answer: "Dá, com o SVG, que já vem com os caminhos de corte e as pontes. Custa US$ 1,99 por desenho; o PDF continua grátis.",
  },
];

export default function PortugueseLetterStencilsPage() {
  return (
    <StencilLanding
      locale="pt-BR"
      route="letterStencils"
      source="text"
      intro={{
        eyebrow: "MOLDES DE LETRAS",
        heading: "Digite a palavra e imprima o molde de letras no tamanho exato.",
        copy: "Escolha uma fonte de estêncil, digite a largura final e baixe um PDF que divide as letras grandes em folhas A4, A3 ou Carta. Grátis, sem cadastro.",
      }}
      defaults={{ renderMode: "template", widthCm: 60, heightCm: 20 }}
      howToName="Como imprimir moldes de letras grandes em casa"
      howToDescription="Gere moldes de letras vazadas em qualquer tamanho e imprima em várias folhas no tamanho real."
      howToSteps={howToSteps}
      quick={{
        heading: "Moldes de letras em qualquer tamanho, sem baixar o alfabeto inteiro",
        paragraphs: [
          <>
            Digite a palavra acima, escolha a fonte e informe a largura total (por exemplo, 90 cm). O PDF sai com as letras já
            espaçadas e divididas em folhas A4. Imprima em <strong>Tamanho real / 100%</strong>, cole as folhas e recorte. É
            grátis.
          </>,
        ],
      }}
      sections={[
        {
          heading: "Para que serve",
          items: [
            "Nome do aniversariante no painel de festa",
            "Número da casa e nome na caixa de correio",
            "Placas de madeira para loja, sítio e jardim",
            "Letreiros pintados em parede, caixote e vaga de garagem",
          ],
        },
        {
          heading: "Dicas para pintar com o molde",
          items: [
            "Prenda o molde com fita crepe ou cola spray para a tinta não escorrer por baixo.",
            "Bata a tinta com esponja ou pincel de estêncil; não pincele de lado.",
            "Tire o molde com a tinta ainda um pouco úmida para a borda ficar limpa.",
            <>
              Quer um desenho ou uma foto em vez de letras? Use o <Link href={localizedPath("pt-BR", "photoToStencil")}>estêncil de foto</Link>.
            </>,
          ],
        },
      ]}
      faqItems={faqItems}
    />
  );
}
