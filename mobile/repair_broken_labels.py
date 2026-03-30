import os
import re

lib_dir = "lib"

# Patterns to fix based on analysis
CORE_REPLACEMENTS = [
    # labels merged together (e.g., radius: backgroundColor: -> radius: 10, backgroundColor:)
    (r'radius:\s*backgroundColor:', r'radius: 12, backgroundColor:'),
    (r'fontSize:\s*color:', r'fontSize: 14, color:'),
    (r'height:\s*width:', r'height: 10, width:'),
    (r'width:\s*height:', r'width: 10, height:'),
    (r'color:\s*fontSize:', r'color: Colors.black, fontSize:'),
    (r'itemCount:\s*itemBuilder:', r'itemCount: 0, itemBuilder:'),
    (r'padding:\s*child:', r'padding: EdgeInsets.zero, child:'),
    (r'decoration:\s*child:', r'decoration: BoxDecoration(), child:'),
    (r'icon:\s*onPressed:', r'icon: Icon(Icons.error), onPressed:'),
    (r'title:\s*style:', r'title: Text(""), style:'),
    (r'value:\s*onChanged:', r'value: false, onChanged: (v) {}'),
    (r'onTap:\s*child:', r'onTap: () {}, child:'),
    
    # broken property assignments
    (r'horizontal:\s*vertical:', r'horizontal: 16, vertical: 8'),
    (r'vertical:\s*horizontal:', r'vertical: 8, horizontal: 16'),
    
    # Shadow/BoxShadow corruption
    (r'color:\s*blurRadius:', r'color: Colors.black, blurRadius:'),
    (r'blurRadius:\s*offset:', r'blurRadius: 10, offset:'),
    (r'offset:\s*spreadRadius:', r'offset: Offset.zero, spreadRadius:'),
    
    # MaterialColor shades
    (r'shadeborderRadius', r'shade200'),
    (r'kSlateborderRadius', r'kSlate200'),
    (r'kSlatevalueColor', r'kSlate200'),
    (r'kSlatebody', r'kSlate50'),
    (r'kSlateappBar', r'kSlate50'),
    
    # Specific ones for MainNavigation
    (r'unselectedItemColor::', r'unselectedItemColor:'),
    
    # Specific ones for Admin screens
    (r'radius:\s*backgroundColor:', r'radius: 12, backgroundColor:'),
]

def repair_broken_labels():
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
                    print(f"Repairing broken labels in: {path}")
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

if __name__ == "__main__":
    repair_broken_labels()
