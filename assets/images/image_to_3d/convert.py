#!/usr/bin/env python3
import os
from PIL import Image

SHIFT_RATIO = 0.10  # move up by 10%

def process_image(path: str):
    # Open original and ensure alpha channel
    img = Image.open(path).convert("RGBA")
    w, h = img.size

    # Calculate vertical shift (positive y shifts down; so use negative to move up)
    y_offset = -int(h * SHIFT_RATIO)

    # Create blank transparent canvas same size
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    # Paste original onto canvas shifted up
    canvas.paste(img, (0, y_offset), img)

    # Overwrite original
    canvas.save(path, format="PNG")

def main():
    for fname in os.listdir('.'):
        if fname.lower().endswith('.png') and os.path.isfile(fname):
            print(f"Shifting {fname} up by {int(SHIFT_RATIO*100)}%...")
            process_image(fname)

if __name__ == "__main__":
    main()