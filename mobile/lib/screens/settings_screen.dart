import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../main.dart';
import 'package:lucide_icons/lucide_icons.dart';


class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _personalDataEnabled = true;
  bool _notificationsEnabled = false;
  bool _darkModeEnabled = false;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _personalDataEnabled = prefs.getBool('personalDataEnabled') ?? true;
      _notificationsEnabled = prefs.getBool('notificationsEnabled') ?? false;
      _darkModeEnabled = prefs.getBool('darkModeEnabled') ?? false;
    });
  }

  Future<void> _saveSetting(String key, bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(key, value);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor =
        isDark ? Color(0xFF121212) : Color(0xFFF8FAFC);
    final cardColor = isDark ? Color(0xFF1E1E1E) : Colors.white;
    final textColor =
        isDark ? Colors.white : Color(0xFF1E293B);
    final sectionTitleColor =
        isDark ? Colors.grey[500] : Color(0xFF94A3B8);
    final dividerColor =
        isDark ? Color(0xFF2C2C2C) : Color(0xFFF1F5F9);

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        title: Text(
          'Settings',
          style: TextStyle(
            color: textColor,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: Icon(LucideLucideLucideIcons.arrowLeft_ios, color: textColor, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 4, bottom: 12),
              child: Text(
                'ACCOUNT',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: sectionTitleColor,
                  letterSpacing: 1.2,
                ),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black
                        .withValues(alpha: isDark ? 0.3 : 0.02),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  _buildSwitchRow(
                    title: 'Personal Data',
                    subtitle: 'Update your info to keep your account safe',
                    icon: LucideLucideLucideIcons.userOutline,
                    iconColor: Color(0xFF8B5CF6),
                    value: _personalDataEnabled,
                    onChanged: (val) {
                      setState(() => _personalDataEnabled = val);
                      _saveSetting('personalDataEnabled', val);
                    },
                  ),
                  Divider(
                      height: 1,
                      indent: 64,
                      endIndent: 16,
                      color: dividerColor),
                  _buildSwitchRow(
                    title: 'Notifications',
                    subtitle: 'Listen to your course updates',
                    icon: LucideLucideLucideIcons.bellNone,
                    iconColor: _notificationsEnabled
                        ? Color(0xFF8B5CF6)
                        : (isDark
                            ? Colors.grey[600]!
                            : Color(0xFF94A3B8)),
                    value: _notificationsEnabled,
                    onChanged: (val) {
                      setState(() => _notificationsEnabled = val);
                      _saveSetting('notificationsEnabled', val);
                    },
                  ),
                  Divider(
                      height: 1,
                      indent: 64,
                      endIndent: 16,
                      color: dividerColor),
                  _buildSwitchRow(
                    title: 'Dark Mode',
                    subtitle: 'Change your screen lighting',
                    icon: LucideLucideIcons.removeRedEyeOutlined,
                    iconColor: Color(0xFF8B5CF6),
                    value: _darkModeEnabled,
                    onChanged: (val) {
                      setState(() => _darkModeEnabled = val);
                      _saveSetting('darkModeEnabled', val);
                      themeNotifier.value =
                          val ? ThemeMode.dark : ThemeMode.light;
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            Padding(
              padding: const EdgeInsets.only(left: 4, bottom: 12),
              child: Text(
                'MORE OPTIONS',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: sectionTitleColor,
                  letterSpacing: 1.2,
                ),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black
                        .withValues(alpha: isDark ? 0.3 : 0.02),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  _buildChevronRow(
                    title: 'Help Center',
                    subtitle: 'Have an issue? We can help',
                    icon: LucideLucideLucideLucideIcons.helpCircleCircle_outline,
                    iconColor: Color(0xFF8B5CF6),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('Opening Help Center...')),
                      );
                    },
                  ),
                  Divider(
                      height: 1,
                      indent: 64,
                      endIndent: 16,
                      color: dividerColor),
                  _buildChevronRow(
                    title: 'Privacy Policy',
                    subtitle: 'Review our terms and privacy',
                    icon: LucideLucideIcons.privacyTipOutlined,
                    iconColor: Color(0xFF8B5CF6),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('Opening Privacy Policy...')),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitchRow({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final titleColor = isDark ? Colors.white : Color(0xFF1E293B);
    final subColor = isDark ? Colors.grey[400] : Color(0xFF94A3B8);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: isDark ? 0.2 : 0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: iconColor, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                    color: titleColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 13,
                    color: subColor,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          CupertinoSwitch(
            value: value,
            activeTrackColor: Color(0xFF8B5CF6),
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildChevronRow({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final titleColor = isDark ? Colors.white : Color(0xFF1E293B);
    final subColor = isDark ? Colors.grey[400] : Color(0xFF94A3B8);
    final arrowColor =
        isDark ? Colors.grey[600] : Color(0xFFCBD5E1);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: isDark ? 0.2 : 0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: iconColor, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                      color: titleColor,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 13,
                      color: subColor,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Icon(LucideLucideLucideIcons.chevronRight, color: arrowColor, size: 16),
          ],
        ),
      ),
    );
  }
}
