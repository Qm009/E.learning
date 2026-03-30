import os
import re

lib_dir = "lib"

# Patterns to revert damage from surgical_repair.py
REVERT_PATTERNS = [
    # Fix hex codes: 0, x -> 0x
    (r'0,\s*x', r'0x'),
    # Fix broken hex sequences like Color(0x, FF, 00, ...)
    (r'Color\((.*?)\)', lambda m: m.group(0).replace(', ', '')), # Very aggressive, might be too much
]

# Better approach: find all Color(0x...) and remove commas inside the hex part
def fix_hex_in_file(content):
    def hex_replacer(match):
        hex_content = match.group(1)
        # Remove ", " inside what looks like a single hex block
        # e.g. 0x, F, F, 0, 0, B, C, D, 4 -> 0xFF00BCD4
        fixed = hex_content.replace(', ', '')
        return f'Color({fixed})'
    
    return re.sub(r'Color\((0x[0-9a-fA-F, \s]+)\)', hex_replacer, content)

def undo_and_fix_properly():
    for root, _, files in os.walk(lib_dir):
        for file in files:
            if file.endswith(".dart"):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Step 1: Fix hex codes corrupted into 0, x...
                new_content = content.replace('0, x', '0x')
                new_content = fix_hex_in_file(new_content)
                
                # Step 2: Fix 8, 12 -> 812 (wait, did I mean 8, 12 was good?)
                # Actually, 8 12 was probably 8.0, 12.0 or 8, 12.
                # If they were 8 12, they were probably merged labels like fontSize: 14color: Colors.red
                # So 8 12 -> 8, 12 is actually GOOD for padding/margin.
                
                # Step 3: Fix 1, duration -> 180 (or whatever it was)
                # It was likely expandedHeight: 160, but was 160 -> 160... wait.
                # If it was 160, it wouldn't match (\d)(\d).
                # Ah! FontWeight.w900 became FontWeight.w9, 00? No.
                
                if new_content != content:
                    print(f"Fixing hex corruption: {path}")
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

if __name__ == "__main__":
    undo_and_fix_properly()
