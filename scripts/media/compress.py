import os
from PIL import Image

def optimize_image(filename):
    filepath = os.path.join('public/templates', filename)
    if not os.path.exists(filepath):
        return
    img = Image.open(filepath).convert("RGB")
    # Resize to exact card dimensions
    img = img.resize((860, 880), Image.Resampling.LANCZOS)
    
    new_filename = filename.replace('.png', '.jpg')
    new_filepath = os.path.join('public/templates', new_filename)
    
    # Save as highly compressed JPEG
    img.save(new_filepath, format="JPEG", quality=40, optimize=True)
    print(f"Optimized {filename} -> {new_filename}")

optimize_image('gold.png')
optimize_image('silver.png')
optimize_image('black.png')
