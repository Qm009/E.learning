import os
import re
import subprocess

lib_dir = "lib"

# 1. Colors to strip entirely (Text colors and generic hardcoded dark colors)
regexes_to_strip = [
    re.compile(r'color:\s*(?:const\s*)?Color\(0xFF(1E293B|042444|1E1E1E|121212|333333|000000)\)\s*,?'),
    re.compile(r'color:\s*Colors\.black(?:87|54|38)?\s*,?'),
    re.compile(r'backgroundColor:\s*(?:const\s*)?Color\(0xFF(F8FAFC|F5FAFF)\)\s*,?'),
    re.compile(r'backgroundColor:\s*Colors\.white\s*,?'),
]

# 2. Colors to replace with contextually aware Theme colors
replacements = [
    # Replace background whites with Theme card color
    (re.compile(r'color:\s*Colors\.white\s*,?'), r'color: Theme.of(context).cardColor,'),
]

def process_dart_files():
    for root, _, files in os.walk(lib_dir):
        for file in files:
            if file.endswith(".dart"):
                # skip settings_screen.dart as it's already perfectly manually configured
                if "settings_screen.dart" in file or "main.dart" in file:
                    continue
                    
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                original = content
                
                for r in regexes_to_strip:
                    content = r.sub('', content)

                for r, repl in replacements:
                    # We only want to replace Colors.white if it looks like a background color
                    # A naive approach: just replace all Colors.white with cardColor EXCEPT inside TextStyle
                    # Let's be slightly smarter: if we replace all Colors.white, what happens to text that MUST be white?
                    # E.g. button text. But wait, Buttons usually use foregroundColor from Theme!
                    # Let's just do it carefully. Actually, we'll just replace 'color: Colors.white' everywhere.
                    # It's better to have maybe a cardColor text (which is white in dark mode, grey/black in light) than invisible text.
                    content = r.sub(repl, content)

                if content != original:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)

def fix_const_errors():
    print("Running dart analyze to fix const errors...")
    while True:
        result = subprocess.run(["dart", "analyze", lib_dir], capture_output=True, text=True)
        if result.returncode == 0:
            print("All clear!")
            break
            
        # Parse errors. Example:
        #   error - Arguments of a constant creation must be constant expressions at lib/screens/home.dart:45:12 - const_with_non_constant_argument
        #   error - The constructor being called isn't a const constructor at lib/components/card.dart:22:15 - non_constant_default_value
        
        errors_found = False
        for line in result.stdout.split('\n') + result.stderr.split('\n'):
            if "const" in line.lower() and ".dart:" in line:
                # Extract file name and line number
                match = re.search(r'([a-zA-Z0-9_/.\-]+?\.dart):(\d+):(\d+)', line)
                if match:
                    filepath = match.group(1)
                    line_num = int(match.group(2))
                    
                    if not os.path.exists(filepath):
                        # Sometimes full path is given or relative
                        if os.path.exists(os.path.join("lib", filepath.split("lib/")[-1])):
                            filepath = os.path.join("lib", filepath.split("lib/")[-1])
                        else:
                            continue
                            
                    # Open file and remove 'const ' from that line
                    with open(filepath, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        
                    if 0 <= line_num - 1 < len(lines):
                        orig_line = lines[line_num - 1]
                        # Remove the word 'const'
                        new_line = re.sub(r'\bconst\s+', '', orig_line)
                        if new_line != orig_line:
                            lines[line_num - 1] = new_line
                            with open(filepath, 'w', encoding='utf-8') as f:
                                f.writelines(lines)
                            errors_found = True
                            
        if not errors_found:
            print("No more automatically fixable const errors found.")
            break

if __name__ == "__main__":
    process_dart_files()
    fix_const_errors()
