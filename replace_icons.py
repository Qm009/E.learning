import os
import re

FRONTEND_DIR = '/home/Josias/Desktop/E.learning REAL/frontend/src'
MOBILE_DIR = '/home/Josias/Desktop/E.learning REAL/mobile/lib'

EMOJI_MAP = {
    '📚': 'BookOpen',
    '🎓': 'GraduationCap',
    '👥': 'Users',
    '🏆': 'Trophy',
    '📊': 'BarChart',
    '⏰': 'Clock',
    '🎯': 'Target',
    '📈': 'TrendingUp',
    '📖': 'Book',
    '📋': 'Clipboard',
    '⏱️': 'Timer',
    '⏱': 'Timer',
    '👤': 'User',
    '💡': 'Lightbulb',
    '⚙️': 'Settings',
    '⚙': 'Settings',
    '📝': 'FileText',
    '📷': 'Camera',
    '❌': 'X',
    '✅': 'Check',
    '✓': 'Check',
    '○': 'Circle',
    '🚪': 'LogOut',
    '🔐': 'Lock',
    '👨‍🎓': 'GraduationCap',
    '👨‍🏫': 'MonitorPlay',
    '👨‍💼': 'Briefcase',
    '🚀': 'Rocket',
    '🧠': 'Brain',
    '🛡️': 'Shield',
    '🛡': 'Shield',
    '💬': 'MessageSquare',
    '✨': 'Sparkles',
    '☰': 'Menu',
    '🌟': 'Star',
    '👨‍💻': 'UserCog',
    '💻': 'Laptop',
    '📱': 'Smartphone',
    '🏢': 'Building',
    '❤️': 'Heart',
    '⭐': 'Star',
    '🔍': 'Search',
    '🔔': 'Bell',
    '🔥': 'Flame',
    '❓': 'HelpCircle',
}

def process_frontend():
    for root, dirs, files in os.walk(FRONTEND_DIR):
        for file in files:
            if file.endswith('.jsx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                used_icons = set()
                new_content = content
                for emoji, icon in EMOJI_MAP.items():
                    if emoji in new_content:
                        used_icons.add(icon)
                        new_content = new_content.replace(emoji, f'<span className="icon-wrapper"><{icon} size={{18}} /></span>')

                # Handle specific React replacements if needed
                if used_icons:
                    # Check if 'lucide-react' is already imported
                    if 'lucide-react' not in new_content:
                        imports = 'import { ' + ', '.join(sorted(used_icons)) + " } from 'lucide-react';\n"
                        # Insert after last import
                        lines = new_content.split('\n')
                        last_import_idx = -1
                        for i, line in enumerate(lines):
                            if line.startswith('import '):
                                last_import_idx = i
                        
                        if last_import_idx != -1:
                            lines.insert(last_import_idx + 1, imports)
                        else:
                            lines.insert(0, imports)
                        
                        new_content = '\n'.join(lines)
                    else:
                        # Find existing lucide import and add to it
                        pass # too complex to parse here, maybe some already exist, but for now we append if missing

                    if content != new_content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated {filepath} with {used_icons}")

FLUTTER_ICON_MAPPING = {
    'Icons.home_rounded': 'LucideIcons.home',
    'Icons.home': 'LucideIcons.home',
    'Icons.school_rounded': 'LucideIcons.graduationCap',
    'Icons.school': 'LucideIcons.graduationCap',
    'Icons.quiz_rounded': 'LucideIcons.helpCircle',
    'Icons.quiz': 'LucideIcons.helpCircle',
    'Icons.person_rounded': 'LucideIcons.user',
    'Icons.person': 'LucideIcons.user',
    'Icons.search': 'LucideIcons.search',
    'Icons.notifications': 'LucideIcons.bell',
    'Icons.settings': 'LucideIcons.settings',
    'Icons.arrow_back': 'LucideIcons.arrowLeft',
    'Icons.arrow_back_ios': 'LucideIcons.chevronLeft',
    'Icons.play_arrow': 'LucideIcons.play',
    'Icons.pause': 'LucideIcons.pause',
    'Icons.star': 'LucideIcons.star',
    'Icons.error': 'LucideIcons.alertCircle',
    'Icons.check_circle': 'LucideIcons.checkCircle',
    'Icons.lock': 'LucideIcons.lock',
    'Icons.email': 'LucideIcons.mail',
    'Icons.visibility': 'LucideIcons.eye',
    'Icons.visibility_off': 'LucideIcons.eyeOff',
    'Icons.edit': 'LucideIcons.edit',
    'Icons.delete': 'LucideIcons.trash',
    'Icons.add': 'LucideIcons.plus',
    'Icons.close': 'LucideIcons.x',
    'Icons.logout': 'LucideIcons.logOut',
    'Icons.help': 'LucideIcons.helpCircle',
    'Icons.book': 'LucideIcons.book',
    'Icons.laptop': 'LucideIcons.laptop',
    'Icons.menu': 'LucideIcons.menu',
    'Icons.timer': 'LucideIcons.timer',
    'Icons.more_vert': 'LucideIcons.moreVertical',
    'Icons.chevron_right': 'LucideIcons.chevronRight',
    'Icons.chevron_left': 'LucideIcons.chevronLeft',
    'Icons.play_circle_fill': 'LucideIcons.playCircle',
    'Icons.file_copy': 'LucideIcons.file',
    'Icons.download': 'LucideIcons.download',
    'Icons.camera_alt': 'LucideIcons.camera',
    'Icons.photo': 'LucideIcons.image',
    'Icons.library_books': 'LucideIcons.library',
    'Icons.category': 'LucideIcons.layoutGrid',
    'Icons.bar_chart': 'LucideIcons.barChart',
    'Icons.people': 'LucideIcons.users',
    'Icons.check': 'LucideIcons.check',
    'Icons.access_time': 'LucideIcons.clock',
    'Icons.video_library': 'LucideIcons.video',
    'Icons.chat': 'LucideIcons.messageCircle',
    'Icons.arrow_forward_ios': 'LucideIcons.chevronRight',
    'Icons.arrow_forward': 'LucideIcons.arrowRight',
    'Icons.admin_panel_settings': 'LucideIcons.shield',
    'Icons.dashboard': 'LucideIcons.layoutDashboard',
    'Icons.article': 'LucideIcons.fileText',
    'Icons.lightbulb': 'LucideIcons.lightbulb',
    'Icons.thumb_up': 'LucideIcons.thumbsUp',
    'Icons.bookmark': 'LucideIcons.bookmark',
    'Icons.share': 'LucideIcons.share2',
    'Icons.history': 'LucideIcons.history',
    'Icons.refresh': 'LucideIcons.refreshCw',
    'Icons.info': 'LucideIcons.info',
    'Icons.warning': 'LucideIcons.alertTriangle',
    'Icons.assignment': 'LucideIcons.clipboardList',
    'Icons.star_border': 'LucideIcons.star',
    'Icons.star_half': 'LucideIcons.starHalf',
    'Icons.language': 'LucideIcons.globe',
    'Icons.dark_mode': 'LucideIcons.moon',
    'Icons.light_mode': 'LucideIcons.sun',
    'Icons.support_agent': 'LucideIcons.headset',
    'Icons.attach_money': 'LucideIcons.dollarSign',
    'Icons.work': 'LucideIcons.briefcase',
}

def process_mobile():
    for root, dirs, files in os.walk(MOBILE_DIR):
        for file in files:
            if file.endswith('.dart'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content
                used_lucide = False
                
                # Replace generic 'Icons.*' with mapped 'LucideIcons.*'
                for material_icon, lucide_icon in FLUTTER_ICON_MAPPING.items():
                    if material_icon in new_content:
                        used_lucide = True
                        new_content = new_content.replace(material_icon, lucide_icon)
                
                # Try to replace any unmapped Icons.x with LucideIcons.x using a regex 
                # (convert Icons.something to camelCase, which happens to match most of the time, 
                # but better to do it safely only if we know they exist. Let's stick strictly to regex for a fallback or just leave remaining ones)
                
                def unmapped_replacer(match):
                    icon_name = match.group(1)
                    # Convert snake_case to camelCase
                    parts = icon_name.split('_')
                    camel_name = parts[0] + ''.join(p.title() for p in parts[1:])
                    return f'LucideIcons.{camel_name}'

                old_content = new_content
                new_content = re.sub(r'Icons\.([a-z0-9_]+)', unmapped_replacer, new_content)
                if old_content != new_content:
                    used_lucide = True

                if used_lucide and 'package:lucide_icons/lucide_icons.dart' not in new_content:
                    import_statement = "import 'package:lucide_icons/lucide_icons.dart';\n"
                    
                    # Insert after the last import
                    lines = new_content.split('\n')
                    last_import_idx = -1
                    for i, line in enumerate(lines):
                        if line.startswith('import '):
                            last_import_idx = i
                    
                    if last_import_idx != -1:
                        lines.insert(last_import_idx + 1, import_statement)
                    else:
                        lines.insert(0, import_statement)
                    
                    new_content = '\n'.join(lines)

                if content != new_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath} with Lucide icons")

if __name__ == '__main__':
    print("Processing frontend...")
    process_frontend()
    print("Processing mobile...")
    process_mobile()
