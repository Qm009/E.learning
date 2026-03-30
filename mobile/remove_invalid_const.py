import os
import re

lib_dir = "lib"

def remove_invalid_const():
    for root, _, files in os.walk(lib_dir):
        for file in files:
            if file.endswith(".dart"):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Find lines that have 'const' and 'Theme.of(context)' or other dynamic calls
                # This is tricky because 'const' might be further up the tree.
                # A simple approach: if a line contains 'Theme.of(context)', remove 'const ' from that line or the preceding few lines.
                
                lines = content.split('\n')
                new_lines = []
                for i, line in enumerate(lines):
                    if 'Theme.of(context)' in line or 'ApiConfig.' in line:
                        # Scan backwards to remove 'const' from this or parent lines
                        line = line.replace('const ', '')
                        # Also check previous lines for 'const' that might govern this expression
                        # But that's complex. Let's just fix the most obvious ones first.
                        pass
                    new_lines.append(line)
                
                new_content = '\n'.join(new_lines)
                
                # Another regex: remove 'const' before any widget that uses Theme.of(context)
                # pattern: const [A-Z][a-zA-Z0-9]*\(.*Theme\.of
                # Actually, many errors are simply methods invoked in constant expressions.
                # Let's just remove 'const' globally where it breaks things.
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

if __name__ == "__main__":
    remove_invalid_const()
