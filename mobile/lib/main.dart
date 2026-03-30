import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/new_register_screen.dart';
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
import 'screens/edit_profile_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/help_support_screen.dart';
import 'screens/ai_assistant_screen.dart';
import 'screens/student_home_screen.dart';
import 'screens/course_player_screen.dart';
import 'components/main_navigation.dart';
import 'utils/role_guard.dart';

// Global theme notifier for dark mode toggle from SettingsScreen
final ValueNotifier<ThemeMode> themeNotifier = ValueNotifier(ThemeMode.light);

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeNotifier,
      builder: (context, themeMode, _) {
        return MaterialApp(
          title: 'E-Learning App',
          debugShowCheckedModeBanner: false,
          themeMode: themeMode,
          theme: ThemeData(
            fontFamily: 'Roboto',
            primaryColor: Color(0xFF00C6FF),
            scaffoldBackgroundColor: Color(0xFFF5FAFF),
            colorScheme: ColorScheme.fromSeed(
              seedColor: Color(0xFF00C6FF),
              primary: Color(0xFF00C6FF),
              secondary: Color(0xFF0052D4),
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
                backgroundColor: Color(0xFF00C6FF),
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
          darkTheme: ThemeData(
            brightness: Brightness.dark,
            fontFamily: 'Roboto',
            primaryColor: Color(0xFF00C6FF),
            scaffoldBackgroundColor: Color(0xFF121212),
            colorScheme: ColorScheme.fromSeed(
              brightness: Brightness.dark,
              seedColor: Color(0xFF00C6FF),
              primary: Color(0xFF00C6FF),
              secondary: Color(0xFF0052D4),
            ),
          ),
          initialRoute: '/',
          routes: {
            '/': (context) => const HomeScreen(),
            '/login': (context) => const LoginScreen(),
            '/register': (context) => const NewRegisterScreen(),
            '/courses': (context) => const CoursesScreen(),
            '/main': (context) => const MainNavigation(),
            '/student_home': (context) => const StudentHomeScreen(),
            '/dashboard': (context) => const RoleGuard(
                  allowedRoles: ['admin'],
                  redirectRoute: '/',
                  child: DashboardScreen(),
                ),
            '/instructor': (context) => const InstructorProfileScreen(),
            '/admin_dashboard': (context) => const RoleGuard(
                  allowedRoles: ['admin'],
                  redirectRoute: '/',
                  child: AdminDashboardScreen(),
                ),
            '/instructor_dashboard': (context) => const RoleGuard(
                  allowedRoles: ['instructor', 'admin'],
                  redirectRoute: '/',
                  child: InstructorDashboardScreen(),
                ),
            '/instructor_courses': (context) => const RoleGuard(
                  allowedRoles: ['instructor', 'admin'],
                  redirectRoute: '/',
                  child: InstructorCoursesScreen(),
                ),
            '/specifications': (context) => const SpecificationsScreen(),
            '/certified-degree': (context) => const CertifiedDegreeScreen(),
            '/edit_profile': (context) => const EditProfileScreen(),
            '/settings': (context) => const SettingsScreen(),
            '/help_support': (context) => const HelpSupportScreen(),
            '/ai_assistant': (context) => const AIAssistantScreen(),
            '/expert-courses': (context) => const FeaturePageScreen(
                  title: 'Expert Courses',
                  description:
                      'Learn from industry experts and professionals with years of experience in their fields.',
                  icon: '📖',
                ),
            '/quality-education': (context) => const FeaturePageScreen(
                  title: 'Quality Education',
                  description:
                      'High-quality content with interactive lessons and real-world projects.',
                  icon: '🏆',
                ),
            '/community-support': (context) => const FeaturePageScreen(
                  title: 'Community Support',
                  description:
                      'Join a vibrant community of learners and get help when you need it.',
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
              final Map<dynamic, dynamic> safeArgs =
                  (args is Map) ? args : {};
              return MaterialPageRoute(
                settings: settings,
                builder: (context) => ChapterDetailScreen(
                  courseId: (safeArgs['courseId'] ?? '').toString(),
                  chapterIndex: (safeArgs['chapterIndex'] is int)
                      ? safeArgs['chapterIndex'] as int
                      : 0,
                  chapterData: (safeArgs['chapterData'] is Map)
                      ? safeArgs['chapterData'] as Map
                      : null,
                ),
              );
            }
            return null;
          },
        );
      },
    );
  }
}
