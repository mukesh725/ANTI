from PIL import Image, ImageChops
import glob

for file in glob.glob('public/templates/*.jpg'):
    img = Image.open(file)
    bg = Image.new(img.mode, img.size, (255,255,255))
    diff = ImageChops.difference(img, bg)
    bbox = diff.getbbox()
    if bbox:
        cropped = img.crop(bbox)
        cropped.save(file)
        print(f"Cropped {file} to {bbox}")
