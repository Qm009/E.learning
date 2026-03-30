import os
import re

lib_dir = "lib"

# Fixes for orphaned Opacity values from Colors.black45, Colors.white70, etc.
orphans = [
    (re.compile(r'color:\s*Theme\.of\(context\)\.cardColor,(\d\d)'), r'color: Theme.of(context).cardColor'),
    (re.compile(r',\s*(\d\d),\s*'), r', '),
    (re.compile(r',\s*(\d\d)\)'), r')'),
    (re.compile(r'\((\d\d),\s*'), r'('),
    (re.compile(r'(\d\d),\s*(?=[a-zA-Z_]+:)'), r''),  # e.g. "45, size:" -> "size:"
]

# Fixes for duplicated colors
duplicates = [
    (re.compile(r'color:\s*Theme\.of\(context\)\.cardColor,\s*color:\s*'), r'color: '),
]

def apply_fixes():
    for root, _, files in os.walk(lib_dir):
        for file in files:
            if file.endswith(".dart"):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Fix duplicated colors
                for regex, repl in duplicates:
                    content = regex.sub(repl, content)

                # Fix orphans
                for regex, repl in orphans:
                    content = regex.sub(repl, content)
                
                # Fix context undefined cases (we will just revert Theme.of(context).cardColor -> Colors.white where context is missing)
                # This requires parsing or we can just globally replace it if it's inside a method without context.
                # Since we don't have an AST parser, we can do a hack: if "Theme.of(context)" is in the file, and no build(BuildContext context) or function with BuildContext context exists enclosing it...
                # Actually, let's just globally replace "Theme.of(context).cardColor" back to "Colors.white" ONLY on the lines that errored.
                # We have the exact error lines from the user prompt!

                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)

if __name__ == "__main__":
    apply_fixes()
