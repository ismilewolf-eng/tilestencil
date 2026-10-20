import Link from "next/link";
import { StencilLanding } from "@/components/StencilLanding";
import { localMetadata } from "@/lib/local-metadata";
import { localizedPath } from "@/lib/locale";

export const metadata = localMetadata("pt-BR", "photoToStencil", {
  title: "Fazer Estêncil de Foto Online Grátis (com Pontes, no Tamanho Real)",
  description:
    "Transforme uma foto em estêncil para recortar: a ferramenta adiciona pontes para os miolos não caírem e imprime no tamanho exato em várias folhas. Grátis; SVG para Cricut e laser por US$ 1,99. Sem enviar a foto.",
  keywords: ["estêncil", "fazer estêncil", "estêncil de foto", "como fazer estêncil", "transformar foto em estêncil", "molde para pintura"],
});

const howToSteps = [
  { name: "Escolha a foto", text: "Uma foto com um tema principal e fundo simples funciona melhor. Nada é enviado." },
  { name: "Ajuste o limiar de preto e branco", text: "Mova o controle olhando a prévia até o contorno ficar claro. Use Inverter se quiser recortar o tema em vez do fundo." },
  { name: "Digite o tamanho final", text: "A largura que o estêncil deve ter na parede, na camiseta ou na madeira, em centímetros." },
  { name: "Imprima em tamanho real e recorte", text: "Imprima em Tamanho real (100%), cole as folhas e recorte as partes pretas com estilete." },
];

const faqItems = [
  {
    question: "Como fazer um estêncil a partir de uma foto?",
    answer:
      "Escolha a foto nesta página, deixe o modo preto e branco ligado e mova o limiar até o desenho ficar claro na prévia. Digite o tamanho final e baixe o PDF. É grátis e a foto não sai do seu navegador.",
  },
  {
    question: "O que são as pontes do estêncil?",
    answer:
      "São tirinhas finas que seguram os miolos, como o centro de um O ou o branco de um olho. Sem elas, esses pedaços caem quando você recorta. A ferramenta encontra cada miolo e cria a ponte mais curta automaticamente.",
  },
  {
    question: "Dá para fazer um estêncil maior que a folha?",
    answer:
      "Dá. Digite o tamanho final, por exemplo 120 cm de largura para uma parede, e o estêncil é dividido em folhas numeradas com marcas para alinhar.",
  },
  {
    question: "Consigo usar na Cricut, na Silhouette ou no laser?",
    answer:
      "Sim, com o SVG: ele sai com as linhas de corte e as pontes prontas, na medida em milímetros. O SVG custa US$ 1,99 por imagem; o PDF para imprimir continua grátis.",
  },
  {
    question: "Em que material recorto o estêncil?",
    answer:
      "Para usar uma vez, o próprio papel preso com fita crepe resolve. Para pintar várias vezes, passe o desenho para acetato, radiografia, papel paraná ou plástico fino e recorte com estilete.",
  },
];

export default function PortuguesePhotoStencilPage() {
  return (
    <StencilLanding
      locale="pt-BR"
      route="photoToStencil"
      intro={{
        eyebrow: "ESTÊNCIL DE FOTO",
        heading: "Transforme uma foto em estêncil e imprima no tamanho que você precisa.",
        copy: "Ajuste o preto e branco olhando a prévia, deixe as pontes automáticas segurarem os miolos e baixe o estêncil dividido em folhas A4, A3 ou Carta. Tudo no navegador.",
      }}
      defaults={{ renderMode: "template", bridges: true, widthCm: 40, heightCm: 30 }}
      example="photo-to-stencil"
      howToName="Como fazer um estêncil a partir de uma foto"
      howToDescription="Transforme uma foto em estêncil preto e branco com pontes e imprima no tamanho real em várias folhas."
      howToSteps={howToSteps}
      quick={{
        heading: "Como transformar uma foto em estêncil",
        paragraphs: [
          <>
            Escolha a foto acima, mova o limiar até o contorno ficar claro e deixe as pontes ligadas para os miolos não caírem.
            Digite o tamanho final e baixe o PDF: imprima em <strong>Tamanho real / 100%</strong> e recorte as partes pretas. O
            PDF é grátis; o SVG para Cricut e laser custa US$ 1,99.
          </>,
        ],
      }}
      sections={[
        {
          heading: "Dicas para um estêncil limpo",
          items: [
            "Prefira fotos com contraste: rosto iluminado de lado, objeto escuro em fundo claro.",
            "Corte a foto só no que importa antes de escolher: fundo cheio de detalhes vira bagunça.",
            "Pontes de 2 mm servem para papel; use 3 a 4 mm em acetato que vai ser usado muitas vezes.",
            "Use Inverter quando quiser pintar o desenho e não o fundo.",
          ],
        },
        {
          heading: "Usos comuns",
          items: [
            "Pintura em parede, móveis e placas com spray",
            "Camisetas e ecobags com tinta para tecido",
            "Pirografia e marcenaria",
            <>
              Letras e números: use o <Link href={localizedPath("pt-BR", "letterStencils")}>gerador de moldes de letras</Link>
            </>,
          ],
        },
      ]}
      faqItems={faqItems}
    />
  );
}
