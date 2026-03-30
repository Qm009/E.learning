import os
import re

lib_dir = "lib"

# Patterns to fix based on analysis
CORE_REPLACEMENTS = [
    # Join fixes (e.g., 8 12 -> 8, 12)
    (r'(\d)\s+(\d)', r'\1, \2'),
    # Truncated labels (e.g., 1duration -> 12, duration)
    (r'(\d)([a-zA-Z])', r'\1, \2'),
    
    # Specific merges
    (r'radius:\s*child:', r'radius: 20, child:'),
    (r'top:\s*child:', r'top: 10, child:'),
    (r'bottom:\s*child:', r'bottom: 10, child:'),
    (r'left:\s*child:', r'left: 10, child:'),
    (r'right:\s*child:', r'right: 10, child:'),
    (r'fontSize:\s*height:', r'fontSize: 14, height:'),
    (r'height:\s*decoration:', r'height: 200, decoration:'),
    (r'width:\s*child:', r'width: 100, child:'),
    (r'color:\s*shadows:', r'color: Colors.white, shadows:'),
    (r'blurRadius:\s*spreadRadius:', r'blurRadius: 5, spreadRadius: 2'),
    
    # MaterialColor shade fixes
    (r'shade@', r'shade600'),
    (r'shade(\d)(?!\d)', r'shade\g<1>00'),
    
    # Double colon fix
    (r'::', r':'),
    
    # ApiConfig methods
    (r'ApiConfig\.courseUrl', r'ApiConfig.courseUrl'), # just check
]

def final_surgical_repair():
    for root, _, files in os.walk(lib_dir):
        for file in files:
            if file.endswith(".dart"):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content
                for pattern, replacement in CORE_REPLACEMENTS:
                    new_content = re.sub(pattern, replacement, new_content)

                if new_content != content:
                    print(f"Surgical repairing: {path}")
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

if __name__ == "__main__":
    final_surgical_repair()
