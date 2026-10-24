import os

def replace_colors_in_dir(directory):
    replacements = {
        '#0B2114': '#1C1C1E',
        '#0b2114': '#1C1C1E',
        '#1A3324': '#2C2C2E',
        '#1a3324': '#2C2C2E',
        '#D4AF37': '#0A84FF',
        '#d4af37': '#0A84FF',
        '#FAF8F5': '#FFFFFF',
        '#faf8f5': '#FFFFFF'
    }

    files_modified = 0

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                original_content = content
                for old, new in replacements.items():
                    content = content.replace(old, new)

                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    files_modified += 1
                    print(f"Updated {file_path}")

    print(f"Total files modified: {files_modified}")

if __name__ == '__main__':
    replace_colors_in_dir('src')
