import os
import re
import subprocess

lib_dir = "lib"

# 1. First, fix the broken syntax introduced by my previous script
for root, _, files in os.walk(lib_dir):
    for file in files:
        if file.endswith(".dart"):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Fix `.withOpacity` orphans
            new_content = re.sub(r'(?<=[\s\[\(,])\.withOpacity\(', r'color: Colors.black.withOpacity(', content)

            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)

print("Syntax fixes applied.")

# 2. Iteratively run `dart analyze` and remove `const` keyword on failing lines
while True:
    print("Running dart analyze...")
    result = subprocess.run(["dart", "analyze", lib_dir], capture_output=True, text=True)
    if result.returncode == 0:
        print("All clear! No errors.")
        break
        
    errors_handled = 0
    lines = result.stdout.split('\n') + result.stderr.split('\n')
    
    # Example error line:
    # error • Arguments of a constant creation must be constant expressions • lib/screens/home.dart:45:12 • const_with_non_constant_argument
    for line in lines:
        if "error" in line.lower() and "const" in line.lower() and ".dart:" in line:
            match = re.search(r'([a-zA-Z0-9_/.\-]+?\.dart):(\d+):(\d+)', line)
            if match:
                filepath = match.group(1)
                line_num = int(match.group(2))
                
                # resolve path if it's relative
                if not os.path.exists(filepath):
                    temp_path = os.path.join(lib_dir, filepath.split("lib/")[-1])
                    if os.path.exists(temp_path):
                        filepath = temp_path
                    else:
                        continue
                        
                with open(filepath, 'r', encoding='utf-8') as f:
                    file_lines = f.readlines()
                    
                if 0 <= line_num - 1 < len(file_lines):
                    orig_line = file_lines[line_num - 1]
                    # We simply remove the word 'const ' from the line
                    new_line = re.sub(r'\bconst\s+', '', orig_line)
                    if new_line != orig_line:
                        file_lines[line_num - 1] = new_line
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.writelines(file_lines)
                        errors_handled += 1

    if errors_handled == 0:
        print("Could not parse or handle any more errors. Breaking loop to prevent infinite loop.")
        break
    else:
        print(f"Handled {errors_handled} const errors. Re-analyzing...")

