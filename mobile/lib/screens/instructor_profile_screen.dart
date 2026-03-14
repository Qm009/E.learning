import 'package:flutter/material.dart';

class InstructorProfileScreen extends StatelessWidget {
  const InstructorProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 24),
            CircleAvatar(
              radius: 40,
              backgroundColor: const Color(0xFFE0F8FF),
              child: const Icon(
                Icons.person_outline_rounded,
                size: 48,
                color: Color(0xFF0052D4),
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Alex Johnson',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'UI/UX Design Instructor',
              style: TextStyle(
                color: Color(0xFF6B7A90),
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                children: const [
                  _ProfileSectionTitle('Certifications Earned'),
                  _ProfileTile(
                    title: 'Advanced React Patterns',
                    subtitle: '12 modules • Completed',
                    icon: Icons.verified_rounded,
                  ),
                  _ProfileTile(
                    title: 'Modern Typography Systems',
                    subtitle: '8 modules • In progress',
                    icon: Icons.auto_graph_rounded,
                  ),
                  SizedBox(height: 24),
                  _ProfileSectionTitle('Account Settings'),
                  _ProfileTile(
                    title: 'Personal Information',
                    subtitle: 'Update your basic info',
                    icon: Icons.person_outline_rounded,
                  ),
                  _ProfileTile(
                    title: 'Notification Settings',
                    subtitle: 'Email & push notifications',
                    icon: Icons.notifications_none_rounded,
                  ),
                  _ProfileTile(
                    title: 'Privacy & Security',
                    subtitle: 'Password, 2FA and more',
                    icon: Icons.lock_outline_rounded,
                  ),
                  _ProfileTile(
                    title: 'Help & Support',
                    subtitle: 'FAQ and contact',
                    icon: Icons.help_outline_rounded,
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () {
                    Navigator.popUntil(
                      context,
                      (route) => route.settings.name == '/',
                    );
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Logged out'),
                        duration: Duration(milliseconds: 800),
                      ),
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFFFF4D4F),
                    side: const BorderSide(color: Color(0xFFFF4D4F)),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                  ),
                  child: const Text('Logout Account'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileSectionTitle extends StatelessWidget {
  final String title;

  const _ProfileSectionTitle(this.title);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}

class _ProfileTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;

  const _ProfileTile({
    required this.title,
    required this.subtitle,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('$title tapped'),
            duration: const Duration(milliseconds: 800),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFFE0F8FF),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                icon,
                color: const Color(0xFF00A4E4),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF6B7A90),
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_right_rounded,
              color: Color(0xFF9BA9C4),
            ),
          ],
        ),
      ),
    );
  }
}
