import animals from "@/lib/gallery/animals.json";
import christmas from "@/lib/gallery/christmas.json";
import flowers from "@/lib/gallery/flowers.json";
import halloween from "@/lib/gallery/halloween.json";
import shapes from "@/lib/gallery/shapes.json";
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
  route: Exclude<SiteRoute, "home" | "privacy">;
  label: { en: string; zh: string };
  /** One line for the hub page, listing what is inside. */
  blurb: { en: string; zh: string };
  designs: GalleryDesign[];
  groups: GalleryGroup[];
};

export const HALLOWEEN: GalleryCategory = {
  id: "halloween",
  route: "halloweenStencils",
  label: { en: "Halloween stencils", zh: "万圣节模板" },
  blurb: { en: "Pumpkin faces, bats, black cats, skulls, spider webs, witches, and more", zh: "南瓜脸、蝙蝠、黑猫、骷髅、蜘蛛网、女巫等" },
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

export const CHRISTMAS: GalleryCategory = {
  id: "christmas",
  route: "christmasStencils",
  label: { en: "Christmas stencils", zh: "圣诞模板" },
  blurb: { en: "Snowflakes, stars, Christmas trees, reindeer, ornaments, and more", zh: "雪花、星星、圣诞树、驯鹿、圣诞彩球等" },
  designs: christmas as GalleryDesign[],
  groups: [
    {
      id: "snowflake",
      heading: { en: "Snowflake stencils", zh: "雪花模板" },
      tip: {
        en: "Spray white or silver through a snowflake onto windows, mirrors, and wrapping paper, or dab glass paint with a sponge. Resize a few copies to different widths so the flakes do not all look the same.",
        zh: "用白色或银色透过雪花模板喷在窗户、镜子、包装纸上，或者用海绵蘸玻璃颜料拍。多做几份不同大小的，雪花看起来更自然。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "star",
      heading: { en: "Star stencils", zh: "星星模板" },
      tip: {
        en: "Stars are the most useful stencils of all: tree toppers, cards, walls, and signs. The nautical star keeps its two-tone points thanks to bridges along each point.",
        zh: "星星是最常用的模板：树顶、贺卡、墙面、招牌都能用。航海星每个角的黑白两半靠连接桥连在一起。",
      },
      tool: "cricutStencil",
    },
    {
      id: "tree",
      heading: { en: "Christmas tree stencils", zh: "圣诞树模板" },
      tip: {
        en: "Paint trees in a row along a wooden sign, or print one large across several pages for a wall or door. The bauble tree uses bridges to hold each white ornament in place.",
        zh: "可以在木牌上画一排圣诞树，或者放大分几页打印做墙面、门上的大树。挂彩球那款的每个白色小球都靠连接桥固定。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "ornament",
      heading: { en: "Ornament and bell stencils", zh: "彩球和铃铛模板" },
      tip: {
        en: "Ornaments make good gift tags and card fronts: cut them from card stock and paint through them, or keep the cut-out shapes as decorations.",
        zh: "彩球和铃铛适合做礼物标签和贺卡：用卡纸刻好后刷颜料，刻下来的形状本身也能当装饰。",
      },
      tool: "cricutStencil",
    },
    {
      id: "reindeer",
      heading: { en: "Reindeer stencils", zh: "驯鹿模板" },
      tip: {
        en: "Reindeer look great in a line across a window or mantel. Antlers are thin, so print at 15 cm or larger and use card or plastic for a reusable stencil.",
        zh: "驯鹿排成一排贴在窗户或壁炉上很好看。鹿角比较细，建议打印 15 厘米以上，用卡纸或塑料片做可重复用的模板。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "more",
      heading: { en: "Snowman, gingerbread, stockings, and gifts", zh: "雪人、姜饼人、圣诞袜和礼物" },
      tip: {
        en: "Small designs for cookies, cards, kids' crafts, and fabric. For cookies, cut the stencil from food-safe plastic and dust icing sugar or cocoa through it.",
        zh: "适合饼干、贺卡、儿童手工和布料的小图案。做饼干时用食品级塑料片刻模板，透过它筛糖粉或可可粉。",
      },
      tool: "cricutStencil",
    },
  ],
};

export const FLOWERS: GalleryCategory = {
  id: "flowers",
  route: "flowerStencils",
  label: { en: "Flower, butterfly and leaf stencils", zh: "花朵、蝴蝶和叶子模板" },
  blurb: { en: "Daisies, sunflowers, tulips, lotus, roses, butterflies, and leaves", zh: "雏菊、向日葵、郁金香、莲花、玫瑰、蝴蝶、叶子等" },
  designs: flowers as GalleryDesign[],
  groups: [
    {
      id: "flower",
      heading: { en: "Flower stencils", zh: "花朵模板" },
      tip: {
        en: "Simple flowers like the daisy and sunflower print well from 5 cm up, so they suit cards and cakes as well as walls. Line-art flowers such as the dahlia need 12 cm or more for the bridges to stay strong.",
        zh: "雏菊、向日葵这类简单的花 5 厘米起就能印，贺卡、蛋糕、墙面都合适。大丽花这种线条图案要 12 厘米以上，连接桥才结实。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "rose",
      heading: { en: "Rose stencils", zh: "玫瑰模板" },
      tip: {
        en: "Roses have many enclosed petals, so these versions already include bridges. Paint them in one colour, or stencil the leaves in green first and the flower in red once it is dry.",
        zh: "玫瑰的花瓣大多是封闭的，这些版本已经加好连接桥。可以单色印，也可以先用绿色印叶子，干了再用红色印花。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "butterfly",
      heading: { en: "Butterfly stencils", zh: "蝴蝶模板" },
      tip: {
        en: "Butterflies look best in a loose group flying across a wall or up a staircase. Print one design at a few sizes, or flip it in your printer settings for a mirror-image pair.",
        zh: "蝴蝶适合一群散开地飞过墙面或楼梯。同一个图案按几种大小打印，或者在打印设置里水平翻转，得到一对方向相反的。",
      },
      tool: "cricutStencil",
    },
    {
      id: "leaf",
      heading: { en: "Leaf stencils", zh: "叶子模板" },
      tip: {
        en: "Leaves work for autumn decorations, tea towels, and botanical walls. Stencil them in two shades of green, or in reds and oranges for fall.",
        zh: "叶子适合秋季装饰、茶巾和植物主题墙。可以用两种深浅的绿色，秋天用红色和橙色。",
      },
      tool: "sprayPaintStencil",
    },
  ],
};

export const ANIMALS: GalleryCategory = {
  id: "animals",
  route: "animalStencils",
  label: { en: "Animal stencils", zh: "动物模板" },
  blurb: { en: "Dogs, cats, wolves, birds, horses, unicorns, dragons, and dinosaurs", zh: "狗、猫、狼、鸟、马、独角兽、龙、恐龙等" },
  designs: animals as GalleryDesign[],
  groups: [
    {
      id: "pets",
      heading: { en: "Dog, cat, and paw print stencils", zh: "狗、猫和爪印模板" },
      tip: {
        en: "Paw prints make a trail across a floor, a pet bowl mat, or a dog bed. Print one at about 6 cm and repeat it, alternating left and right.",
        zh: "爪印可以在地板、宠物餐垫或狗窝上印一串。打印成约 6 厘米，左右交替重复印。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "wild",
      heading: { en: "Wolf, bear, and wild animal stencils", zh: "狼、熊和野生动物模板" },
      tip: {
        en: "Wild animals suit cabin signs, mugs, and outdoor gear. The howling wolf looks best in front of a full moon: paint a circle first, then spray the wolf in black.",
        zh: "野生动物适合木屋招牌、杯子和户外用品。嚎叫的狼配满月最好看：先刷一个圆当月亮，再用黑色喷狼。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "bird",
      heading: { en: "Bird, eagle, and owl stencils", zh: "鸟、老鹰和猫头鹰模板" },
      tip: {
        en: "Birds look natural in small flocks: print the same bird two or three times at different sizes. The owl's eyes are held by bridges, so it can be cut as one piece.",
        zh: "鸟成群更自然：同一只鸟按两三种大小打印。猫头鹰的眼睛靠连接桥固定，可以整张刻出来。",
      },
      tool: "cricutStencil",
    },
    {
      id: "horse",
      heading: { en: "Horse and unicorn stencils", zh: "马和独角兽模板" },
      tip: {
        en: "Unicorns are a favourite for kids' rooms and party decorations. Paint them in white or pastel colours, then add glitter while the paint is still wet.",
        zh: "独角兽很适合儿童房和派对装饰。用白色或浅色刷，趁颜料没干撒上亮粉。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "fantasy",
      heading: { en: "Dragon and dinosaur stencils", zh: "龙和恐龙模板" },
      tip: {
        en: "Dinosaurs work well walking in a line along a wall or a toy box. The Welsh dragon and heraldic lion have fine claws and tongues, so print them at 20 cm or more.",
        zh: "恐龙适合沿着墙或玩具箱排成一队。威尔士红龙和纹章狮子的爪子、舌头比较细，建议打印 20 厘米以上。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "sea",
      heading: { en: "Fish and turtle stencils", zh: "鱼和乌龟模板" },
      tip: {
        en: "Fish and turtles suit bathrooms, beach houses, and tote bags. Use fabric paint on cotton, or outdoor acrylic on wood and stone.",
        zh: "鱼和乌龟适合浴室、海边小屋和帆布袋。棉布用布用颜料，木头和石头用户外丙烯。",
      },
      tool: "cricutStencil",
    },
  ],
};

export const SHAPES: GalleryCategory = {
  id: "shapes",
  route: "shapeStencils",
  label: { en: "Heart, moon, mandala and pattern stencils", zh: "爱心、月亮、曼陀罗和花砖图案模板" },
  blurb: { en: "Hearts, moons, suns, mandalas, Moroccan tiles, honeycomb, crowns, and anchors", zh: "爱心、月亮、太阳、曼陀罗、摩洛哥花砖、蜂窝、皇冠、船锚等" },
  designs: shapes as GalleryDesign[],
  groups: [
    {
      id: "heart",
      heading: { en: "Heart stencils", zh: "爱心模板" },
      tip: {
        en: "Hearts are the most printed stencil of all: Valentine's cards, wedding signs, cookies, and kids' crafts. The outline heart keeps its centre thanks to a single bridge.",
        zh: "爱心是最常用的模板：情人节贺卡、婚礼指示牌、饼干、儿童手工都能用。空心爱心中间那块靠一条连接桥固定。",
      },
      tool: "cricutStencil",
    },
    {
      id: "sky",
      heading: { en: "Moon, sun, cloud, and rainbow stencils", zh: "月亮、太阳、云朵和彩虹模板" },
      tip: {
        en: "Sky shapes suit nurseries and boho walls. Print a moon and a few stars at different sizes and scatter them across a ceiling or a dark accent wall.",
        zh: "天空元素适合婴儿房和波西米亚风墙面。把月亮和几颗星星按不同大小打印，散布在天花板或深色墙上。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "mandala",
      heading: { en: "Mandala stencils", zh: "曼陀罗模板" },
      tip: {
        en: "Mandalas are made of many separate pieces, so a spray adhesive on the back of the stencil keeps the small petals flat. Print at 20 cm or more for walls and tabletops.",
        zh: "曼陀罗由很多分开的小块组成，模板背面喷一点喷胶，小花瓣才能贴平。墙面和桌面建议打印 20 厘米以上。",
      },
      tool: "sprayPaintStencil",
    },
    {
      id: "pattern",
      heading: { en: "Tile and pattern stencils for floors and walls", zh: "地板和墙面花砖图案模板" },
      tip: {
        en: "Each tile design is one repeat. Print it at the size of your floor or wall tiles, and stencil every tile, or every other tile for a checkerboard effect.",
        zh: "每个花砖图案是一个重复单元。按地砖或墙砖的大小打印，每块都印，或者隔一块印一块做出棋盘效果。",
      },
      tool: "stencilGuide",
    },
    {
      id: "symbol",
      heading: { en: "Crown, anchor, compass, and arrow stencils", zh: "皇冠、船锚、罗盘和箭头模板" },
      tip: {
        en: "Symbols work on signs, shirts, tote bags, and furniture. The anchor and compass rose suit nautical rooms; the crown and arrow are popular on kids' and boho decor.",
        zh: "这些符号适合招牌、T 恤、帆布袋和家具。船锚和罗盘适合航海风房间，皇冠和箭头常用在儿童房和波西米亚风装饰上。",
      },
      tool: "cricutStencil",
    },
  ],
};

export const GALLERY_CATEGORIES: GalleryCategory[] = [HALLOWEEN, CHRISTMAS, FLOWERS, ANIMALS, SHAPES];

export function designFiles(design: GalleryDesign) {
  const base = `/stencils/${design.category}/${design.slug}`;
  return { png: `${base}.png`, webp: `${base}.webp`, pdf: `${base}.pdf` };
}

export const LICENSE_URL = {
  "Public domain": "https://creativecommons.org/publicdomain/mark/1.0/",
  CC0: "https://creativecommons.org/publicdomain/zero/1.0/",
} as Record<string, string>;
