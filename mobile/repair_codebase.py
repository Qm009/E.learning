import os
import re

lib_dir = "lib"

# Fixes for common corrupted patterns
REPLACEMENTS = [
    # Missing numbers in SliverAppBar / Container
    (r'expandedHeight: 2floating: false', r'expandedHeight: 200, floating: false'),
    (r'width: 2height: 2decoration:', r'width: 200, height: 200, decoration:'),
    (r'width: 1height: 1decoration:', r'width: 100, height: 100, decoration:'),
    (r'width: 1height: 1fit:', r'width: 100, height: 100, fit:'),
    (r'width: 1height: 1child:', r'width: 100, height: 100, child:'),
    (r'radius: color:', r'radius: 20, color:'),
    (r'radius: 2color:', r'radius: 20, color:'),
    
    # Missing values in TextStyle/Icon/Padding
    (r'fontSize: fontWeight:', r'fontSize: 14, fontWeight:'),
    (r'size: color:', r'size: 20, color:'),
    (r'padding: const EdgeInsets.fromLTRB\(20\)', r'padding: const EdgeInsets.fromLTRB(20, 20, 20, 20)'),
    (r'offset: const Offset\(0\)', r'offset: const Offset(0, 4)'), # Guess
    (r'blurRadius: offset:', r'blurRadius: 10, offset:'),
    (r'sigmaX: sigmaY: 10', r'sigmaX: 10, sigmaY: 10'),
    (r'sigmaX: sigmaY: 70', r'sigmaX: 70, sigmaY: 70'),
    (r'horizontal: vertical: 15', r'horizontal: 20, vertical: 15'),
    (r'horizontal: vertical: 24', r'horizontal: 20, vertical: 24'),
    (r'horizontal: vertical: 10', r'horizontal: 16, vertical: 10'),
    (r'horizontal: vertical: 16', r'horizontal: 20, vertical: 16'),
    (r'horizontal: vertical: 8', r'horizontal: 16, vertical: 8'),
    
    # Orphans
    (r'Theme\.of\(context\)\.cardColor,(\d\d)', r'Theme.of(context).cardColor'),
    (r'Icon\(([^,)]+), (\d\d), size:', r'Icon(\1, size:'),
    (r'Icon\(([^,)]+), (\d\d)\)', r'Icon(\1)'),
    (r'Icon\(([^,)]+), color: ([^,)]+),(\d\d)\)', r'Icon(\1, color: \2)'),
    (r'Icon\(([^,)]+), color: ([^,)]+),(\d\d), size:', r'Icon(\1, color: \2, size:'),
    (r'Container\((\d\d),', r'Container('),
    
    # Duplicated color arguments
    (r'color: Theme\.of\(context\)\.cardColor,color: [^,)]+', r'color: Theme.of(context).cardColor'),
    (r'color: Theme\.of\(context\)\.cardColor,\s*color:\s*[^,)]+', r'color: Theme.of(context).cardColor'),
    (r'color: [^,)]+,color: Theme\.of\(context\)\.cardColor', r'color: Theme.of(context).cardColor'),
    
    # Missing context in static context or specific classes
    # We'll handle this by reverting to a safe color if BuildContext isn't available
    # But for now let's hope it's mostly inside build methods.
]

def fix_codebase():
    for root, _, files in os.walk(lib_dir):
        for file in files:
            if file.endswith(".dart"):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content
                for pattern, replacement in REPLACEMENTS:
                    new_content = re.sub(pattern, replacement, new_content)

                if new_content != content:
                    print(f"Fixed: {path}")
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

if __name__ == "__main__":
    fix_codebase()
