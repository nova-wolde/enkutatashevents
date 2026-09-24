#!/usr/bin/env python3
"""
apply_brand_image.py — one-command brand asset pipeline for enkutatashevents.com

Takes a single source image (logo / mark) and regenerates EVERY icon & logo asset:

  public/favicon-16x16.png          16x16   (rounded-corner transparency)
  public/favicon-32x32.png          32x32   (rounded-corner transparency)
  public/favicon-192.png            192x192 (rounded-corner transparency, PWA "any")
  public/favicon-512.png            512x512 (rounded-corner transparency, PWA "any")
  public/enkutatash-mark-512.png    512x512 (copy of favicon-512, manifest "any")
  public/enkutatash-mark-512-maskable.png  512x512 (full-bleed bg, safe-zone, "maskable")
  public/apple-touch-icon.png       180x180 (full-bleed bg — iOS rounds it)
  public/favicon.ico                16+32+48 multi-size
  public/favicon.svg                wrapper -> /enkutatash-mark-512.png
  public/enkutatash-logo.png        1024x1024 master logo (used by all app components)

Usage:
  python3 scripts/apply_brand_image.py <source.png> [--bg auto] [--radius 0.22] [--out public]

  --bg     corner/background fill for full-bleed variants:
           "auto"  = sample the source's own corner colour (default)
           "hex"   = e.g. --bg "#0b3d2e"
           "none"  = white
  --radius corner radius fraction used when rounding the "any" icons (0 = square corners)
  --safe   safe-zone fraction for maskable icon content (default 0.78)

After running, bump CACHE_NAME in public/sw.js (done separately) so clients refetch.
"""
import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

REPO = Path(__file__).resolve().parent.parent


# --------------------------------------------------------------------------- helpers
def load_source(path: Path) -> Image.Image:
    im = Image.open(path)
    im = ImageOps.exif_transpose(im).convert("RGBA")
    return im


def autocrop(im: Image.Image, tol: int = 12) -> Image.Image:
    """Trim a uniform outer border (works on transparent or solid-colour mats)."""
    a = np_safe(im)
    alpha = a[:, :, 3]
    if (alpha < 250).any():  # has real transparency -> trim by alpha
        mask = alpha > 8
    else:  # solid mat -> trim by corner-colour similarity
        corner = a[2, 2, :3].astype(int)
        diff = abs(a[:, :, 0].astype(int) - corner[0]) + \
               abs(a[:, :, 1].astype(int) - corner[1]) + \
               abs(a[:, :, 2].astype(int) - corner[2])
        mask = diff > tol * 3
    ys, xs = np_where(mask)
    if xs.size == 0:
        return im
    pad = 1
    box = (max(xs.min() - pad, 0), max(ys.min() - pad, 0),
           min(xs.max() + 1 + pad, im.width), min(ys.max() + 1 + pad, im.height))
    return im.crop(box)


def square_crop(im: Image.Image) -> Image.Image:
    """Center-crop to square if not already square."""
    w, h = im.size
    if w == h:
        return im
    s = min(w, h)
    left, top = (w - s) // 2, (h - s) // 2
    return im.crop((left, top, left + s, top + s))


def rounded(im: Image.Image, radius_px: int) -> Image.Image:
    """Apply rounded-corner transparency."""
    if radius_px <= 0:
        return im
    mask = Image.new("L", im.size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, im.width - 1, im.height - 1], radius=radius_px, fill=255)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out


def sample_corner_bg(im: Image.Image) -> tuple:
    """Median colour of the 4 corner patches — used as full-bleed background."""
    a = np_safe(im)
    patches = []
    k = max(6, im.width // 40)
    for (y0, x0) in [(0, 0), (0, im.width - k), (im.height - k, 0), (im.height - k, im.width - k)]:
        patches.append(a[y0:y0 + k, x0:x0 + k, :3].reshape(-1, 3))
    allpx = np_concat(patches)
    med = np_median(allpx, axis=0).astype(int)
    opaque = (a[0:k, 0:k, 3] > 200).mean() > 0.5  # corners actually painted?
    return tuple(int(v) for v in med), bool(opaque)


def sample_edge_bg(im: Image.Image) -> tuple:
    """Mean colour of the outermost ring of *painted* pixels — seamless ring fill
    for maskable icons (matches artwork edges, hides rounded-corner gaps)."""
    a = np_safe(im)
    rgb, alpha = a[:, :, :3].astype(int), a[:, :, 3]
    ring = (alpha > 250)  # strictly opaque — exclude anti-aliased fringe
    # keep only the outer 3% border of the bounding box of painted pixels
    ys, xs = np_where(ring)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    border = ring.copy()
    border[y0 + int((y1 - y0) * 0.03):y1 - int((y1 - y0) * 0.03),
           x0 + int((x1 - x0) * 0.03):x1 - int((x1 - x0) * 0.03)] = False
    px = rgb[border]
    if px.size == 0:
        return (11, 61, 46)
    med = np_median(px, axis=0).astype(int)
    return tuple(int(v) for v in med)


def full_bleed(im: Image.Image, size: int, bg: tuple, safe: float) -> Image.Image:
    """Content scaled into safe zone, centered on solid bg (for maskable / apple)."""
    canvas = Image.new("RGBA", (size, size), (*bg, 255))
    inner = int(size * safe)
    content = im.resize((inner, inner), Image.LANCZOS)
    off = (size - inner) // 2
    canvas.paste(content, (off, off), content)
    return canvas


def cover_bleed(im: Image.Image, size: int, zoom: float = 1.14) -> Image.Image:
    """Artwork scaled past the tile edges so its rounded corners never show —
    gives a true full-bleed tile (for apple-touch)."""
    big = int(size * zoom)
    content = im.resize((big, big), Image.LANCZOS)
    off = (size - big) // 2
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(content, (off, off), content)
    return canvas


# --------------------------------------------------------- numpy shims (no hard dep)
def np_safe(im: Image.Image):
    try:
        import numpy as np
        return np.array(im)
    except ImportError:
        sys.exit("numpy is required: pip install numpy")


def np_where(mask):
    import numpy as np
    return np.where(mask)


def np_concat(parts):
    import numpy as np
    return np.concatenate(parts, axis=0)


def np_median(a, axis):
    import numpy as np
    return np.median(a, axis=axis)


# ----------------------------------------------------------------------------- main
def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("source", type=Path)
    p.add_argument("--bg", default="auto")
    p.add_argument("--radius", type=float, default=0.22)
    p.add_argument("--safe", type=float, default=0.78)
    p.add_argument("--master-size", type=int, default=512)
    p.add_argument("--out", type=Path, default=REPO / "public")
    args = p.parse_args()

    out: Path = args.out
    out.mkdir(parents=True, exist_ok=True)

    im = load_source(args.source)
    im = autocrop(im)
    im = square_crop(im)
    if im.width < 512:
        print(f"  ! source small ({im.width}px) — upscaling (quality may soften)")
    master = im.resize((1024, 1024), Image.LANCZOS)  # work at high res for downscales
    master_small = im.resize((args.master_size, args.master_size), Image.LANCZOS)

    transparent_src = bool((np_safe(master)[:, :, 3] < 250).any())
    (bg, opaque) = sample_corner_bg(master) if args.bg == "auto" else (None, False)
    if args.bg == "auto":
        if not opaque:  # transparent mat -> black canvas so the artwork pops
            bg = (0, 0, 0)
        print(f"  auto bg = rgb{bg} (transparent source: {transparent_src})")
    elif args.bg == "none":
        bg = (255, 255, 255)
    else:
        bg = tuple(int(args.bg.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4))

    radius_px = int(1024 * args.radius)

    # "any" icons — rounded-corner transparency
    any1024 = rounded(master, radius_px)
    favicon512 = any1024.resize((512, 512), Image.LANCZOS)
    favicon192 = any1024.resize((192, 192), Image.LANCZOS)
    fav32 = any1024.resize((32, 32), Image.LANCZOS)
    fav16 = any1024.resize((16, 16), Image.LANCZOS)

    favicon512.save(out / "favicon-512.png", optimize=True)
    favicon512.save(out / "enkutatash-mark-512.png", optimize=True)
    favicon192.save(out / "favicon-192.png", optimize=True)
    fav32.save(out / "favicon-32x32.png", optimize=True)
    fav16.save(out / "favicon-16x16.png", optimize=True)

    # master logo used across the app (square, transparent corners)
    any_master_small = rounded(master_small, int(args.master_size * args.radius))
    any_master_small.save(out / "enkutatash-logo.png", optimize=True)

    # apple-touch — full-bleed cover (iOS applies its own corner mask)
    if transparent_src:
        # cutout artwork: center the whole mark on a solid canvas (no petal cropping)
        full_bleed(master, 180, bg, safe=0.86).convert("RGB").save(
            out / "apple-touch-icon.png", optimize=True)
    else:
        cover_bleed(master, 180).convert("RGB").save(out / "apple-touch-icon.png", optimize=True)

    # maskable — rounded artwork inside safe zone on seamless edge-colour ring
    if transparent_src:
        mask_bg = bg  # solid canvas colour (edge sampling would pick artwork colours)
    else:
        mask_bg = sample_edge_bg(any1024)
    print(f"  maskable ring bg = rgb{mask_bg}")
    full_bleed(any1024, 512, mask_bg, safe=args.safe).save(
        out / "enkutatash-mark-512-maskable.png", optimize=True)

    # multi-size .ico
    fav32.save(out / "favicon.ico", format="ICO",
               sizes=[(16, 16), (32, 32), (48, 48)], append_images=[fav16])

    # svg wrapper (same mechanism as before, now pointing at the mark)
    (out / "favicon.svg").write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
        'viewBox="0 0 512 512" width="512" height="512">\n'
        '  <image xlink:href="/enkutatash-mark-512.png" width="512" height="512" '
        'preserveAspectRatio="xMidYMid meet"/>\n</svg>\n'
    )

    print(f"  wrote 11 assets to {out} (master {args.master_size}px)")
    print("  next: bump CACHE_NAME in public/sw.js so PWA clients refetch icons")


if __name__ == "__main__":
    main()
