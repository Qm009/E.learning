import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';


class BottomNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const BottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10, offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(context, LucideIcons.home, 'Home', 0, '/dashboard'),
              _buildNavItem(context, LucideIcons.graduationCap, 'Courses', 1, '/courses'),
              _buildNavItem(context, LucideIcons.helpCircleCircleCircle, 'Quiz', 2, '/quiz'),
              _buildNavItem(context, LucideIcons.user, 'Profile', 3, '/student_dashboard'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(BuildContext context, IconData icon, String label, int index, String route) {
    final isSelected = currentIndex == index;
    return GestureDetector(
      onTap: () {
        onTap(index);
        Navigator.pushNamed(context, route);
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: isSelected 
                ? Color(0xFF00C6FF).withValues(alpha: 0.1) 
                : Colors.transparent,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              icon,
              color: isSelected 
                ? Color(0xFF00C6FF) 
                : Color(0xFF94A3B8),
              size: 24,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              color: isSelected 
                ? Color(0xFF00C6FF) 
                : Color(0xFF94A3B8),
              fontSize: 14, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}
