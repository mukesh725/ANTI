import re

def remove_line_with(filepath, patterns):
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    with open(filepath, 'w') as f:
        for line in lines:
            if not any(re.search(p, line) for p in patterns):
                f.write(line)
            else:
                pass # skip this line

remove_line_with('src/app/about/page.tsx', [r'import Link'])
remove_line_with('src/app/grocery/page.tsx', [r'Shield', r'closingSection'])
remove_line_with('src/app/health/page.tsx', [r'ArrowRight', r'Activity', r'Cpu', r'import Link', r'ParallaxImage', r'heroRef', r'praana', r'clinicalCategories', r'buttons'])
remove_line_with('src/app/minute-clinic/page.tsx', [r'ArrowRight', r'Shield', r'import Link', r'visionSection'])
remove_line_with('src/app/page.tsx', [r'footerData'])
remove_line_with('src/app/pharmacy/page.tsx', [r'Shield', r'closingSection'])
remove_line_with('src/app/press/page.tsx', [r'import Link'])

print("Done")
