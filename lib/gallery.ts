import halloween from "@/lib/gallery/halloween.json";
import type { SiteRoute } from "@/lib/locale";

/**
 * Free stencil gallery. Each design is published under public/stencils/<category>/ as a cut-ready PNG
 * (already bridged by the tool), a WebP thumbnail, and a one-page A4 PDF. The JSON files are written by
 * the gallery build script together with those images.
 */
export type GalleryDesign = {
  slug: string;
  category: string;
  group: string;
  name: { en: string; zh: string };
  /** true = drawn by TileStencil; false = public domain / CC0 artwork from Wikimedia Commons. */
  own: boolean;
  title?: string;
  license?: string;
  source?: string;
  width: number;
  height: number;
};

export type GalleryGroup = {
  id: string;
  heading: { en: string; zh: string };
  tip: { en: string; zh: string };
  /** The tool page that opens a design for resizing or SVG export. */
  tool: SiteRoute;
};

export type GalleryCategory = {
  id: string;
  route: SiteRoute;
  designs: GalleryDesign[];
  groups: GalleryGroup[];
};

export const HALLOWEEN: GalleryCategory = {
  id: "halloween",
  route: "halloweenStencils",
  designs: halloween as GalleryDesign[],
  groups: [
    {
      id: "pumpkin",
      heading: { en: "Pumpkin face stencils", zh: "南瓜脸模板" },
      tip: {
        en: "Tape the printout to the pumpkin, prick along the black shapes with a pin or poking tool, peel the paper off, and carve along the dots. The grey pumpkin is only a size guide.",
        zh: "把打印稿贴在南瓜上，用针沿黑色形状扎一圈孔，揭掉纸后沿孔刻。灰色南瓜只是尺寸参考，不用刻。",
      },
      tool: "pumpkinStencil",
    },
    {
      id: "bat",
      heading: { en: "Bat stencils", zh: "蝙蝠模板" },
      tip: {
        en: "Bats look best in groups: print one sheet, then resize two or three copies at different widths and spray or paint them flying up a wall or across a window.",
        zh: "蝙蝠成群最好看：同一张图按不同宽度多做几份，从墙角往上或在窗户上排成一群。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "cat",
      heading: { en: "Black cat stencils", zh: "黑猫模板" },
      tip: {
        en: "Cut from black card for window silhouettes, or use as a spray paint stencil on porch signs and pumpkins painted instead of carved.",
        zh: "用黑卡纸刻出来贴窗户，或者当喷漆模板用在门牌、不想刻的南瓜上。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "ghost",
      heading: { en: "Ghost stencils", zh: "幽灵模板" },
      tip: {
        en: "The thin strips across the eyes are bridges: they hold the eye pieces in place so the stencil survives cutting. Fill the gaps with a brush afterwards if you want solid eyes.",
        zh: "眼睛上的细条是连接桥，用来固定眼睛那块不让它掉。喷完后可以用小刷子把缝补上。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "skull",
      heading: { en: "Skull stencils", zh: "骷髅模板" },
      tip: {
        en: "Skulls have lots of enclosed shapes (eyes, nose, teeth), so these versions already include bridges. For a shirt or tote bag, cut from freezer paper and iron it on before painting.",
        zh: "骷髅有很多封闭形状（眼睛、鼻子、牙齿），这些版本已经加好了连接桥。印T恤或帆布袋可以用冷冻纸刻好后熨上再刷颜料。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "spider",
      heading: { en: "Spider and spider web stencils", zh: "蜘蛛和蜘蛛网模板" },
      tip: {
        en: "A web is all enclosed shapes, so every gap between the threads is held by a bridge. Cut webs from thin plastic or vinyl for clean lines, and spray with white or silver on dark walls.",
        zh: "蜘蛛网全是封闭格子，每格都已加好连接桥。用薄塑料片或刻字膜刻线条更利落，深色墙上喷白色或银色最显眼。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "raven",
      heading: { en: "Raven and crow stencils", zh: "乌鸦模板" },
      tip: {
        en: "Ravens work well as window and wall silhouettes. Enlarge one to life size (about 60 cm wingspan) with the resize button and print it across a few pages.",
        zh: "乌鸦适合做窗户和墙面剪影。点“改尺寸”可以放大到真实大小（翼展约 60 厘米），分几页打印。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "witch",
      heading: { en: "Witch stencils", zh: "女巫模板" },
      tip: {
        en: "A witch flying across the moon is a classic: paint a large circle first, let it dry, then spray the witch over it in black.",
        zh: "经典做法是女巫飞过月亮：先刷一个大圆当月亮，干了以后再用黑色把女巫喷上去。",
      },
      tool: "sprayPaintStencil",
    },
  ],
};

export const GALLERY_CATEGORIES: GalleryCategory[] = [HALLOWEEN];

export function designFiles(design: GalleryDesign) {
  const base = `/stencils/${design.category}/${design.slug}`;
  return { png: `${base}.png`, webp: `${base}.webp`, pdf: `${base}.pdf` };
}

export const LICENSE_URL = {
  "Public domain": "https://creativecommons.org/publicdomain/mark/1.0/",
  CC0: "https://creativecommons.org/publicdomain/zero/1.0/",
} as Record<string, string>;
