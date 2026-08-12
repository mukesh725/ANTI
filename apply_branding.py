import os
import re

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    # Replace exact Tailwind classes
    content = re.sub(r'\bbg-alabaster\b', 'bg-paper', content)
    content = re.sub(r'\btext-alabaster\b', 'text-paper', content)
    content = re.sub(r'\bbg-charcoal\b', 'bg-ink', content)
    content = re.sub(r'\btext-charcoal\b', 'text-ink', content)
    content = re.sub(r'\bborder-charcoal\b', 'border-ink', content)
    content = re.sub(r'\bbg-background\b', 'bg-linen', content)
    content = re.sub(r'\btext-foreground\b', 'text-ink', content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
            replace_in_file(os.path.join(root, file))

print("Done")
