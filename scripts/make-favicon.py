from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "brand" / "acal-wordmark-blue.png"
APP = ROOT / "src" / "app"
PUBLIC = ROOT / "public"


def crop_mark(image: Image.Image) -> Image.Image:
    bbox = image.split()[3].getbbox()
    if not bbox:
        raise RuntimeError("Logo sem pixels visíveis.")
    cropped = image.crop(bbox)
    # Drop the HOME CENTER line; keep the house + wordmark that still reads at 16px.
    cutoff = max(1, int(cropped.height * 0.78))
    mark = cropped.crop((0, 0, cropped.width, cutoff))
    tight = mark.split()[3].getbbox()
    return mark.crop(tight) if tight else mark


def to_square(
    image: Image.Image,
    size: int,
    padding_ratio: float = 0.12,
    background: tuple[int, int, int, int] | None = None,
) -> Image.Image:
    inner = int(size * (1 - padding_ratio * 2))
    ratio = min(inner / image.width, inner / image.height)
    new_size = (max(1, int(image.width * ratio)), max(1, int(image.height * ratio)))
    resized = image.resize(new_size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), background or (0, 0, 0, 0))
    offset = ((size - resized.width) // 2, (size - resized.height) // 2)
    canvas.paste(resized, offset, resized)
    return canvas


def main() -> None:
    source = Image.open(SRC).convert("RGBA")
    mark = crop_mark(source)
    APP.mkdir(parents=True, exist_ok=True)

    icon = to_square(mark, 192)
    icon.save(APP / "icon.png", optimize=True)

    apple = to_square(mark, 180, background=(255, 255, 255, 255))
    apple.save(APP / "apple-icon.png", optimize=True)

    ico_32 = to_square(mark, 32)
    ico_48 = to_square(mark, 48)
    ico_32.save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(32, 32), (48, 48)],
        append_images=[ico_48],
    )
    print("icon", icon.size, APP / "icon.png")
    print("apple-icon", apple.size, APP / "apple-icon.png")
    print("favicon.ico", PUBLIC / "favicon.ico")


if __name__ == "__main__":
    main()
