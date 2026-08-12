import os
import re

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    
    # Generic replacements
    content = content.replace('text-[#1C1C1E]', 'text-ink')
    content = content.replace('bg-[#1C1C1E]', 'bg-theme') # Buttons/Accents use dynamic theme
    content = content.replace('border-[#1C1C1E]', 'border-theme')
    content = content.replace('text-[#FFFFFF]', 'text-paper')
    content = content.replace('bg-[#FFFFFF]', 'bg-paper')
    content = content.replace('border-[#FFFFFF]', 'border-paper')

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            replace_in_file(os.path.join(root, file))

print("Done")
