from PIL import Image

def make_transparent():
    # Open the image
    img = Image.open("public/airo-one-logo.png").convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Get RGB values
        r, g, b, a = item
        
        # Calculate luminance
        luminance = (0.299 * r + 0.587 * g + 0.114 * b)
        
        # The background seems to be very light gray or white.
        # Let's map high luminance to transparent, and keep darker colors opaque.
        # But wait, we want the logo to be dark gray or black.
        # Better: keep the color exactly as is, but change alpha based on how dark it is.
        # If it's pure white (255), alpha = 0.
        # If it's black (0), alpha = 255.
        
        # Simple alpha scaling: alpha = 255 - luminance
        # That means dark gray will become partially transparent. 
        # Alternatively, we can just hard-threshold the background.
        
        # If the background is e.g. #f3f4f6 (which is r=243, g=244, b=246), 
        # luminance is ~244. 
        if luminance > 240:
            new_data.append((255, 255, 255, 0)) # Fully transparent
        else:
            # We want to keep the antialiasing smooth. Let's do a smooth alpha blend for edges.
            # alpha = 255 if lum < 200, 0 if lum > 240.
            if luminance < 180:
                new_data.append((r, g, b, 255))
            else:
                # scale from 180 to 240
                ratio = (240 - luminance) / (240 - 180)
                alpha = int(255 * ratio)
                new_data.append((r, g, b, alpha))

    img.putdata(new_data)
    img.save("public/airo-one-logo.png", "PNG")
    print("Successfully made background transparent")

make_transparent()
