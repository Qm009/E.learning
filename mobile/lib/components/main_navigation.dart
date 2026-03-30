import 'package:flutter/material.dart';
import '../utils/auth_service.dart';
import '../screens/student_home_screen.dart';
import '../screens/courses_screen.dart';
import '../screens/quiz_list_screen.dart';
import '../screens/student_profile_screen.dart';
import '../screens/instructor_home_screen.dart';
import '../screens/instructor_courses_screen.dart';
import '../screens/instructor_students_screen.dart';
import '../screens/instructor_profile_screen.dart';
import '../screens/admin_dashboard_screen.dart';
import '../screens/admin_users_screen.dart';
import '../screens/admin_courses_screen.dart';
import '../screens/instructor_requests_screen.dart';
import 'package:lucide_icons/lucide_icons.dart';


class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  static const Color kSlate900 = Color(0xFF0F172A);
  static const Color kIndigo600 = Color(0xFF4F46E5);
  static const Color kSlate400 = Color(0xFF94A3B8);
  int _currentIndex = 0;
  String? _userRole;

  @override
  void initState() {
    super.initState();
    _loadUserRole();
  }

  Future<void> _loadUserRole() async {
    final role = await AuthService.getUserRole();
    setState(() {
      _userRole = role ?? 'student';
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_userRole == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    switch (_userRole) {
      case 'student':
        return _buildStudentNavigation();
      case 'instructor':
        return _buildInstructorNavigation();
      case 'admin':
        return _buildAdminNavigation();
      default:
        return _buildStudentNavigation();
    }
  }

  Widget _buildStudentNavigation() {
    final List<Widget> pages = [
      const StudentHomeScreen(),
      const CoursesScreen(),
      const QuizListScreen(),
      const StudentProfileScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: pages,
      ),
      bottomNavigationBar: _buildBottomNavigationBar([
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideLucideIcons.homeOutlined),
          activeIcon: Icon(LucideLucideLucideLucideIcons.home),
          label: 'Home',
        ),
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideLucideIcons.bookOutlined),
          activeIcon: Icon(LucideLucideLucideLucideIcons.book),
          label: 'Courses',
        ),
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideLucideLucideIcons.helpCircleCircleCircle_outlined),
          activeIcon: Icon(LucideLucideLucideLucideLucideIcons.helpCircleCircleCircle),
          label: 'Quiz',
        ),
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideIcons.userOutline),
          activeIcon: Icon(LucideLucideLucideIcons.user),
          label: 'Profile',
        ),
      ]),
    );
  }

  Widget _buildInstructorNavigation() {
    final List<Widget> pages = [
      const InstructorHomeScreen(),
      const CoursesScreen(),
      const InstructorCoursesScreen(),
      const InstructorStudentsScreen(),
      const QuizListScreen(),
      const InstructorProfileScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: pages,
      ),
      bottomNavigationBar: _buildBottomNavigationBar([
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideLucideIcons.homeOutlined),
          activeIcon: Icon(LucideLucideLucideLucideIcons.home),
          label: 'Home',
        ),
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideLucideIcons.searchRounded),
          activeIcon: Icon(LucideLucideLucideLucideIcons.searchRounded),
          label: 'Explore',
        ),
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideIcons.plusCircleOutline),
          activeIcon: Icon(LucideLucideLucideIcons.plusCircle),
          label: 'New',
        ),
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideIcons.usersOutline),
          activeIcon: Icon(LucideLucideLucideIcons.users),
          label: 'Students',
        ),
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideLucideLucideIcons.helpCircleCircleCircle_outlined),
          activeIcon: Icon(LucideLucideLucideLucideLucideIcons.helpCircleCircleCircle),
          label: 'Quiz',
        ),
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideIcons.userOutline),
          activeIcon: Icon(LucideLucideLucideIcons.user),
          label: 'Profile',
        ),
      ]),
    );
  }

  Widget _buildAdminNavigation() {
    final List<Widget> pages = [
      const AdminDashboardScreen(),
      const AdminUsersScreen(),
      const AdminCoursesScreen(),
      const QuizListScreen(),
      const InstructorRequestsScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: pages,
      ),
      bottomNavigationBar: _buildBottomNavigationBar([
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideIcons.layoutDashboard_outlined),
          activeIcon: Icon(LucideLucideLucideIcons.layoutDashboard),
          label: 'Dashboard',
        ),
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideIcons.usersOutline),
          activeIcon: Icon(LucideLucideLucideIcons.users),
          label: 'Users',
        ),
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideLucideIcons.bookOutlined),
          activeIcon: Icon(LucideLucideLucideLucideIcons.book),
          label: 'Courses',
        ),
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideLucideLucideIcons.helpCircleCircleCircle_outlined),
          activeIcon: Icon(LucideLucideLucideLucideLucideIcons.helpCircleCircleCircle),
          label: 'Quiz',
        ),
        const BottomNavigationBarItem(
          icon: Icon(LucideLucideLucideIcons.userAddOutlined),
          activeIcon: Icon(LucideLucideLucideIcons.userAdd),
          label: 'Requests',
        ),
      ]),
    );
  }

  Widget _buildBottomNavigationBar(List<BottomNavigationBarItem> items) {
    const kIndigo600 = Color(0xFF4F46E5);
    const kSlate900 = Color(0xFF0F172A);
    const kSlate400 = Color(0xFF94A3B8);

    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        boxShadow: [
          BoxShadow(
            color: kSlate900.withValues(alpha: 0.08),
            blurRadius: 10,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: items,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: kIndigo600,
        unselectedItemColor: kSlate400,
        elevation: 0,
        selectedLabelStyle:
            const TextStyle(fontWeight: FontWeight.w800, fontSize: 12),
        unselectedLabelStyle:
            const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
      ),
    );
  }
}
