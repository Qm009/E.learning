import os
import re

lib_dir = "lib"

# Patterns to fix based on analysis
CORE_REPLACEMENTS = [
    # Deprecations
    (r'\.withOpacity\((.*?)\)', r'.withValues(alpha: \1)'),
    (r'FontWeight\.w9(?![0-9])', r'FontWeight.w900'),
    (r'FontWeight\.w8(?![0-9])', r'FontWeight.w800'),
    (r'FontWeight\.w7(?![0-9])', r'FontWeight.w700'),
    (r'FontWeight\.w6(?![0-9])', r'FontWeight.w600'),
    (r'FontWeight\.w5(?![0-9])', r'FontWeight.w500'),
    (r'FontWeight\.w4(?![0-9])', r'FontWeight.w400'),
    (r'FontWeight\.w3(?![0-9])', r'FontWeight.w300'),
    
    # Octal corruption fix (shade8 -> shade@ due to \100 mistake)
    (r'shade@', r'shade600'),
    
    # Missing variable keywords in specific files
    (r'^\s*kIndigo600 =', r'    final kIndigo600 ='),
    (r'^\s*kSlate900 =', r'    final kSlate900 ='),
    (r'^\s*kSlate500 =', r'    final kSlate500 ='),
    (r'^\s*kSlate200 =', r'    final kSlate200 ='),
    
    # Expand merged Positioned/Container properties
    (r'radius:\s*backgroundColor:', r'radius: 12, backgroundColor:'),
    (r'fontSize:\s*color:', r'fontSize: 14, color:'),
    (r'height:\s*width:', r'height: 10, width:'),
    (r'top:\s*left:\s*right:\s*child:', r'top: 10, left: 10, right: 10, child:'),
    (r'top:\s*right:\s*child:', r'top: 10, right: 10, child:'),
    (r'bottom:\s*left:\s*right:\s*child:', r'bottom: 10, left: 10, right: 10, child:'),
    (r'bottom:\s*right:\s*child:', r'bottom: 10, right: 10, child:'),
    (r'onTap:\s*child:', r'onTap: () {}, child:'),
    
    # Broken shadex
    (r'shade(\d)(?!\d)', r'shade\g<1>00'),
    
    # Missing commas/tokens
    (r'unselectedItemColor::', r'unselectedItemColor:'),
    
    # Specific fix for expert_path_screen.dart
    (r'w900letterSpacing', r'w900, letterSpacing'),
]

def mega_repair():
    for root, _, files in os.walk(lib_dir):
        for file in files:
            if file.endswith(".dart"):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content
                for pattern, replacement in CORE_REPLACEMENTS:
                    if "withOpacity" in pattern: # special handle for regex
                         new_content = re.sub(pattern, replacement, new_content)
                    else:
                         new_content = re.sub(pattern, replacement, new_content, flags=re.MULTILINE)

                if new_content != content:
                    print(f"Mega repairing: {path}")
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

if __name__ == "__main__":
    mega_repair()
