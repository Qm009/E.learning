import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'new_home_screen.dart';
import 'student_home_screen.dart';
import 'courses_screen.dart';
import 'quiz_screen.dart';
import 'student_profile_screen.dart';
import '../utils/auth_service.dart';
import 'package:lucide_icons/lucide_icons.dart';


class StudentDashboardScreen extends StatefulWidget {
  const StudentDashboardScreen({super.key});

  @override
  State<StudentDashboardScreen> createState() => _StudentDashboardScreenState();
}

class _StudentDashboardScreenState extends State<StudentDashboardScreen> {
  int _currentIndex = 0;
  String _userName = 'Student';
  String _userRole = 'student';

  late final List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _pages = [
      HomeTab(onNavigate: _onNavigate),
      const CoursesScreen(),
      const QuizScreen(quizId: 'quiz-1'),
      const StudentProfileScreen(),
    ];
    _loadUserData();
  }

  void _onNavigate(int index) {
    setState(() => _currentIndex = index);
  }

  Future<void> _loadUserData() async {
    final userName = await AuthService.getUserName();
    final userRole = await AuthService.getUserRole();
    setState(() {
      _userName = userName ?? 'Student';
      _userRole = userRole ?? 'student';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // ✅ THÈME CLAIR : Fond blanc cassé
      
      
      
      // ✅ Contenu
      body: _pages[_currentIndex],
      
      // ✅ NAVIGATION EN BAS : Home | Courses | Quiz | Profile
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 10, offset: const Offset(0, -5),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(LucideLucideLucideLucideLucideIcons.home, 'Home', 0),
                _buildNavItem(LucideLucideLucideIcons.graduationCap, 'Courses', 1),
                _buildNavItem(LucideLucideLucideLucideLucideIcons.helpCircleCircleCircle, 'Quiz', 2),
                _buildNavItem(LucideLucideLucideIcons.user, 'Profile', 3),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ✅ Navigation Item Builder
  Widget _buildNavItem(IconData icon, String label, int index) {
    final isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected 
            ? Color(0xFF00C6FF).withValues(alpha: 0.1) 
            : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isSelected 
                ? Color(0xFF00C6FF) 
                : Color(0xFF94A3B8),
              size: 24,
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
      ),
    );
  }
}

// ✅ PAGE D'ACCUEIL - Thème Clair
class HomeTab extends StatelessWidget {
  final Function(int) onNavigate;

  const HomeTab({super.key, required this.onNavigate});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: SharedPreferences.getInstance().then((prefs) => prefs.getString('userRole') ?? 'student'),
      builder: (context, snapshot) {
        final userRole = snapshot.data ?? 'student';
        
        if (userRole == 'instructor') {
          return _buildInstructorHome(context);
        } else if (userRole == 'admin') {
          return _buildAdminHome(context);
        } else {
      return const StudentHomeScreen();
    }
      },
    );
  }


  Widget _buildInstructorHome(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Stats Cards
          Row(
            children: [
              Expanded(child: _buildStatCard('5', 'My Courses', Color(0xFF00C6FF))),
              const SizedBox(width: 12),
              Expanded(child: _buildStatCard('120', 'Students', Color(0xFF8B5CF6))),
              const SizedBox(width: 12),
              Expanded(child: _buildStatCard('4.8', 'Rating', Color(0xFF10B981))),
            ],
          ),
          const SizedBox(height: 24),
          
          // My Courses
          const Text(
            'My Courses',
            style: TextStyle(
              fontSize: 14, fontWeight: FontWeight.bold,
              
            ),
          ),
          const SizedBox(height: 16),
          
          _buildCourseCard(context, 'Flutter Development Masterclass', 1.0),
          const SizedBox(height: 12),
          _buildCourseCard(context, 'UI/UX Design Principles', 1.0),
          const SizedBox(height: 12),
          _buildCourseCard(context, 'Web Development Basics', 0.8),
        ],
      ),
    );
  }

  Widget _buildAdminHome(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Stats Cards
          Row(
            children: [
              Expanded(child: _buildStatCard('15', 'Total Courses', Color(0xFF00C6FF))),
              const SizedBox(width: 12),
              Expanded(child: _buildStatCard('500+', 'Students', Color(0xFF8B5CF6))),
              const SizedBox(width: 12),
              Expanded(child: _buildStatCard('8', 'Instructors', Color(0xFF10B981))),
            ],
          ),
          const SizedBox(height: 24),
          
          // Admin Actions
          const Text(
            'Admin Actions',
            style: TextStyle(
              fontSize: 14, fontWeight: FontWeight.bold,
              
            ),
          ),
          const SizedBox(height: 16),
          
          _buildAdminActionCard(context, 'Manage Users', LucideLucideLucideIcons.users, Colors.blue),
          const SizedBox(height: 12),
          _buildAdminActionCard(context, 'Manage Courses', LucideLucideLucideLucideIcons.book, Colors.green),
          const SizedBox(height: 12),
          _buildAdminActionCard(context, 'Approve Instructors', LucideLucideLucideIcons.userAdd, Colors.orange),
        ],
      ),
    );
  }
  
  Widget _buildAdminActionCard(BuildContext context, String title, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 14, fontWeight: FontWeight.bold,
                
              ),
            ),
          ),
          const Icon(LucideLucideLucideIcons.chevronRight, color: Colors.grey),
        ],
      ),
    );
  }

  Widget _buildStatCard(String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: 14, fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 14, color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCourseCard(BuildContext context, String title, double progress) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.2)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10, offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Color(0xFF00C6FF).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  LucideLucideLucideIcons.playCircle,
                  color: Color(0xFF00C6FF),
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14, fontWeight: FontWeight.w600,
                    
                  ),
                ),
              ),
              Text(
                '${(progress * 100).toInt()}%',
                style: const TextStyle(
                  fontSize: 14, fontWeight: FontWeight.bold,
                  color: Color(0xFF00C6FF),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: Color(0xFFE2E8F0),
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF00C6FF)),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(IconData icon, String label, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 14, fontWeight: FontWeight.w600, color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
