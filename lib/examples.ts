/**
 * Before/after examples shown on the use-case landing pages. Every source image is public domain
 * or CC0 on Wikimedia Commons; the stencil next to it was made with this tool at the given threshold.
 */
export type StencilExample = {
  width: number;
  height: number;
  threshold: number;
  alt: { en: string; zh: string };
  author?: string;
  license: "Public domain" | "CC0";
  source: string;
};

export const STENCIL_EXAMPLES = {
  "photo-to-stencil": {
    width: 720, height: 576, threshold: 45,
    alt: { en: "a black labrador", zh: "一只黑色拉布拉多" },
    author: "Michelle Buntin", license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Black_lab_dog_sephia.jpg",
  },
  "spray-paint": {
    width: 546, height: 720, threshold: 65,
    alt: { en: "a portrait of a girl in profile", zh: "一张少女侧脸肖像" },
    author: "Edward S. Curtis, 1907", license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Edward_S._Curtis,_Qahatika_girl,_Arizona,_1907.jpg",
  },
  pumpkin: {
    width: 720, height: 463, threshold: 150,
    alt: { en: "a walking dog", zh: "一只走路的狗" },
    author: "Vassil", license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Bush_dog_on_a_white_background.png",
  },
  cricut: {
    width: 720, height: 312, threshold: 80,
    alt: { en: "a deer at sunset", zh: "夕阳下的一头鹿" },
    author: "USFWS Mountain-Prairie", license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Deer_Silhouette_(15195904858).jpg",
  },
  airbrush: {
    width: 577, height: 720, threshold: 110,
    alt: { en: "a resting wolf", zh: "一只趴着的狼" },
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Front_view_of_a_resting_Canis_lupus_ssp.jpg",
  },
  "wood-burning": {
    width: 720, height: 480, threshold: 125,
    alt: { en: "a snowy owl", zh: "一只雪鸮" },
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:An_owl_portrait_(52264733713).jpg",
  },
  tattoo: {
    width: 569, height: 720, threshold: 130,
    alt: { en: "a drawing of a rose", zh: "一幅玫瑰画" },
    author: "Cooper Hewitt, 1860–70", license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Drawing,_A_Rose_Bough,_1860%E2%80%9370_(CH_18202453).jpg",
  },
  wall: {
    width: 610, height: 720, threshold: 80,
    alt: { en: "a bare tree", zh: "一棵光秃的树" },
    author: "Krishna k. sahh", license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Deciduous_tree_with_budding_branches_at_Shivapuri_hills.png",
  },
} satisfies Record<string, StencilExample>;

export type ExampleKey = keyof typeof STENCIL_EXAMPLES;
