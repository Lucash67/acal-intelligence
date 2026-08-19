from pathlib import Path
from PIL import Image

BRAND = Path(r"C:\Users\lucas\OneDrive\Desktop\Projeto Acal Intelligence\public\brand")
SRC = BRAND / "acal-logo-blue-alt.png"


def crop_alpha(im: Image.Image, pad: int = 4) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    left, top, right, bottom = bbox
    return im.crop(
        (
            max(0, left - pad),
            max(0, top - pad),
            min(im.width, right + pad),
            min(im.height, bottom + pad),
        )
    )


def isolate_blue_mark(im: Image.Image) -> Image.Image:
    out = im.copy()
    pixels = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            brand = b >= 90 and b > r + 12 and b >= g - 8
            if not brand:
                pixels[x, y] = (r, g, b, 0)
                continue
            luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
            if luma < 36:
                pixels[x, y] = (r, g, b, 0)
    return crop_alpha(out)


def to_white_mark(im: Image.Image) -> Image.Image:
    out = im.copy()
    pixels = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            pixels[x, y] = (255, 255, 255, a)
    return out


if __name__ == "__main__":
    source = Image.open(SRC).convert("RGBA")
    blue = isolate_blue_mark(source)
    blue.save(BRAND / "acal-wordmark-blue.png", "PNG")
    to_white_mark(blue).save(BRAND / "acal-wordmark-white.png", "PNG")
    print(blue.size, blue.mode)
