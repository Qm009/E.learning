import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/courses_screen.dart';
import 'screens/course_detail_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/instructor_profile_screen.dart';
import 'screens/admin_dashboard_screen.dart';
import 'screens/instructor_dashboard_screen.dart';
import 'screens/instructor_courses_screen.dart';
import 'screens/chapter_detail_screen.dart';
import 'screens/feature_page_screen.dart';
import 'screens/certified_degree_screen.dart';
import 'screens/quiz_screen.dart';
import 'screens/specifications_screen.dart';
import 'utils/role_guard.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'E-Learning App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: 'Roboto',
        primaryColor: const Color(0xFF00C6FF),
        scaffoldBackgroundColor: const Color(0xFFF5FAFF),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF00C6FF),
          primary: const Color(0xFF00C6FF),
          secondary: const Color(0xFF0052D4),
        ),
        appBarTheme: const AppBarTheme(
          elevation: 0,
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF042444),
          centerTitle: true,
          titleTextStyle: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFF042444),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF00C6FF),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
            ),
            padding: const EdgeInsets.symmetric(
              horizontal: 24,
              vertical: 14,
            ),
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        textTheme: const TextTheme(
          headlineMedium: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Color(0xFF042444),
          ),
          bodyMedium: TextStyle(
            fontSize: 14,
            color: Color(0xFF6B7A90),
          ),
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const HomeScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/courses': (context) => const CoursesScreen(),
        '/dashboard': (context) => RoleGuard(
          allowedRoles: ['admin'],
          redirectRoute: '/',
          child: const DashboardScreen(),
        ),
        '/instructor': (context) => const InstructorProfileScreen(),
        '/admin_dashboard': (context) => RoleGuard(
          allowedRoles: ['admin'],
          redirectRoute: '/',
          child: const AdminDashboardScreen(),
        ),
        '/instructor_dashboard': (context) => RoleGuard(
          allowedRoles: ['instructor', 'admin'],
          redirectRoute: '/',
          child: const InstructorDashboardScreen(),
        ),
        '/instructor_courses': (context) => RoleGuard(
          allowedRoles: ['instructor', 'admin'],
          redirectRoute: '/',
          child: const InstructorCoursesScreen(),
        ),
        '/quiz': (context) => const QuizScreen(),
        '/specifications': (context) => const SpecificationsScreen(),
        '/certified-degree': (context) => const CertifiedDegreeScreen(),
        '/expert-courses': (context) => const FeaturePageScreen(
              title: 'Expert Courses',
              description: 'Learn from industry experts and professionals with years of experience in their fields.',
              icon: '📖',
            ),
        '/quality-education': (context) => const FeaturePageScreen(
              title: 'Quality Education',
              description: 'High-quality content with interactive lessons and real-world projects.',
              icon: '🏆',
            ),
        '/community-support': (context) => const FeaturePageScreen(
              title: 'Community Support',
              description: 'Join a vibrant community of learners and get help when you need it.',
              icon: '👥',
            ),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/course_detail') {
          final args = settings.arguments;
          final String courseId = (args is String) ? args : '';
          return MaterialPageRoute(
            settings: settings,
            builder: (context) => CourseDetailScreen(courseId: courseId),
          );
        }
        if (settings.name == '/chapter_detail') {
          final args = settings.arguments;
          final Map<dynamic, dynamic> safeArgs = (args is Map) ? args : {};
          return MaterialPageRoute(
            settings: settings,
            builder: (context) => ChapterDetailScreen(
              courseId: (safeArgs['courseId'] ?? '').toString(),
              chapterIndex: (safeArgs['chapterIndex'] is int) ? safeArgs['chapterIndex'] as int : 0,
              chapterData: (safeArgs['chapterData'] is Map) ? safeArgs['chapterData'] as Map : null,
            ),
          );
        }
        return null;
      },
    );
  }
}
