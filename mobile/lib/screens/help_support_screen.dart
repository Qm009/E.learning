import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';


class HelpSupportScreen extends StatelessWidget {
  const HelpSupportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Help & Support'),
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'How can we help you?',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),
            _buildContactCard(
              context,
              'Contact Support',
              'Email our team for personalized help',
              LucideLucideLucideIcons.mailOutlined,
              Color(0xFF10B981),
              () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Opening email compose...')),
                );
              },
            ),
            const SizedBox(height: 16),
            _buildContactCard(
              context,
              'Live Chat',
              'Chat with an agent for immediate help',
              LucideLucideLucideIcons.messageCircle_bubble_outline,
              Color(0xFF3B82F6),
              () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Starting live chat...')),
                );
              },
            ),
            const SizedBox(height: 32),
            const Text(
              'Frequently Asked Questions',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildFaqItem(
              context,
              'How do I change my password?',
              'You can change your password in Settings > Account Options > Change Password. Follow the prompts to reset it.',
            ),
            _buildFaqItem(
              context,
              'Where can I find my course progress?',
              'Your course progress is visible in the Student Dashboard and on individual course detail pages.',
            ),
            _buildFaqItem(
              context,
              'How do I upgrade to an Instructor account?',
              'You can apply to be an instructor during registration. Admin users review requests and approve them.',
            ),
            _buildFaqItem(
              context,
              'My app is crashing, what should I do?',
              'Please ensure you have the latest version of the application installed. If the problem persists, reach out via Contact Support.',
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildContactCard(
    BuildContext context,
    String title,
    String subtitle,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                        color: Color(0xFF64748B), fontSize: 13),
                  ),
                ],
              ),
            ),
            const Icon(LucideLucideLucideIcons.chevronRight,
                color: Color(0xFFCBD5E1), size: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildFaqItem(
      BuildContext context, String question, String answer) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Color(0xFFE2E8F0)),
      ),
      child: ExpansionTile(
        title: Text(
          question,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
        ),
        iconColor: Color(0xFF10B981),
        collapsedIconColor: Color(0xFF94A3B8),
        childrenPadding:
            const EdgeInsets.only(left: 16, right: 16, bottom: 16),
        children: [
          Text(
            answer,
            style: const TextStyle(
                color: Color(0xFF64748B), fontSize: 14, height: 1.5),
          ),
        ],
      ),
    );
  }
}
