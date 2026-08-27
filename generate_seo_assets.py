
import math
from PIL import Image, ImageDraw

# 1. Generate og.png (1200 x 630)
W, H = 1200, 630
img = Image.new("RGBA", (W, H), (246, 241, 232, 255))
draw = ImageDraw.Draw(img)

# Background subtle grid pattern
grid_size = 40
for x in range(0, W, grid_size):
    draw.line([(x, 0), (x, H)], fill=(225, 218, 206, 120), width=1)
for y in range(0, H, grid_size):
    draw.line([(0, y), (W, y)], fill=(225, 218, 206, 120), width=1)

# Card container
card_x1, card_y1, card_x2, card_y2 = 80, 70, 1120, 560
draw.rounded_rectangle([card_x1, card_y1, card_x2, card_y2], radius=24, fill=(255, 253, 248, 255), outline=(217, 208, 193, 255), width=2)

# Left Side: Tile Grid Visual Mockup
mock_x, mock_y, mock_w, mock_h = 130, 130, 360, 360
draw.rounded_rectangle([mock_x, mock_y, mock_x + mock_w, mock_y + mock_h], radius=16, fill=(244, 238, 227, 255), outline=(163, 79, 43, 200), width=2)

# 2x2 Tiles with alignment marks
t_w = (mock_w - 20) // 2
t_h = (mock_h - 20) // 2

for r in range(2):
    for c in range(2):
        tx1 = mock_x + 10 + c * (t_w + 5)
        ty1 = mock_y + 10 + r * (t_h + 5)
        tx2 = tx1 + t_w
        ty2 = ty1 + t_h
        draw.rounded_rectangle([tx1, ty1, tx2, ty2], radius=8, fill=(255, 255, 255, 255), outline=(163, 79, 43, 160), width=1)
        # Inner dashed cut line
        draw.rectangle([tx1 + 8, ty1 + 8, tx2 - 8, ty2 - 8], outline=(200, 180, 160, 150), width=1)
        # Label (A1, A2, B1, B2)
        row_char = "A" if r == 0 else "B"
        label = row_char + str(c + 1)
        draw.text((tx1 + t_w // 2, ty1 + t_h // 2), label, fill=(163, 79, 43, 255), font_size=20, anchor="mm")

# 100% Actual Size Badge
badge_cx, badge_cy, badge_r = mock_x + mock_w - 20, mock_y + mock_h - 20, 42
draw.ellipse([badge_cx - badge_r, badge_cy - badge_r, badge_cx + badge_r, badge_cy + badge_r], fill=(244, 222, 211, 255), outline=(163, 79, 43, 255), width=2)
draw.text((badge_cx, badge_cy), "100%", fill=(128, 58, 29, 255), font_size=20, anchor="mm")

# Right Side: Typography & Description
# Brand Kicker
draw.text((540, 140), "LOCAL PRINT WORKBENCH · ZERO UPLOAD", fill=(163, 79, 43, 255), font_size=16)

# Main Title
draw.text((540, 180), "TileStencil", fill=(34, 32, 27, 255), font_size=56)

# Subtitle
draw.text((540, 260), "Free Multi-Page Poster & Stencil Printer", fill=(34, 32, 27, 230), font_size=26)
draw.text((540, 305), "Turn any JPG/PNG into accurately sized multi-sheet A4, A3, or Letter PDF.", fill=(104, 97, 88, 255), font_size=18)

# Bullet Points
bullets = [
    "✓ 100% Actual Physical Scale (cm & in)",
    "✓ Automatic Tiling Grid with Overlap & Cut Marks",
    "✓ 100% Private in Browser (Zero Image Upload)",
    "✓ Posters, Stencils, Sewing Patterns & Banners"
]
for idx, b in enumerate(bullets):
    draw.text((540, 365 + idx * 34), b, fill=(40, 38, 32, 240), font_size=17)

# URL Tag
draw.text((540, 508), "https://tilestencil.com", fill=(163, 79, 43, 255), font_size=20)

# Save image
img.convert("RGB").save("public/og.png", "PNG", optimize=True)
print("Saved public/og.png")

# 2. Generate SVG favicon/icon
svg_icon = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#a34f2b" />
  <rect x="8" y="8" width="22" height="22" rx="4" fill="#fffdf8" />
  <rect x="34" y="8" width="22" height="22" rx="4" fill="#fffdf8" opacity="0.9" />
  <rect x="8" y="34" width="22" height="22" rx="4" fill="#fffdf8" opacity="0.9" />
  <rect x="34" y="34" width="22" height="22" rx="4" fill="#f4ded3" stroke="#fffdf8" stroke-width="1.5" />
  <text x="45" y="49" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#a34f2b" text-anchor="middle">100%</text>
</svg>'''

with open("public/icon.svg", "w", encoding="utf-8") as f:
    f.write(svg_icon)
print("Saved public/icon.svg")

# 3. Generate icon.png (32x32, 192x192, apple-touch-icon)
icon_img = Image.new("RGBA", (192, 192), (0, 0, 0, 0))
icon_draw = ImageDraw.Draw(icon_img)
icon_draw.rounded_rectangle([0, 0, 192, 192], radius=42, fill=(163, 79, 43, 255))
icon_draw.rounded_rectangle([24, 24, 90, 90], radius=12, fill=(255, 253, 248, 255))
icon_draw.rounded_rectangle([102, 24, 168, 90], radius=12, fill=(255, 253, 248, 230))
icon_draw.rounded_rectangle([24, 102, 90, 168], radius=12, fill=(255, 253, 248, 230))
icon_draw.rounded_rectangle([102, 102, 168, 168], radius=12, fill=(244, 222, 211, 255), outline=(255, 253, 248, 255), width=4)
icon_draw.text((135, 135), "100%", fill=(163, 79, 43, 255), font_size=20, anchor="mm")

icon_img.save("public/icon.png", "PNG")
icon_img.resize((32, 32)).save("public/favicon.ico", "ICO")
icon_img.resize((180, 180)).save("public/apple-touch-icon.png", "PNG")
print("Saved icons successfully.")

