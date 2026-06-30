import os

def replace_colors_in_dir(directory):
    replacements = {
        '#0B2114': '#597467',
        '#0b2114': '#597467',
        '#1A3324': '#7C9A8E',
        '#1a3324': '#7C9A8E',
        '#D4AF37': '#E6AFA3',
        '#d4af37': '#E6AFA3'
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
