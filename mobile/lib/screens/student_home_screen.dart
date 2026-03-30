import 'package:flutter/material.dart';
import 'dart:ui';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/auth_service.dart';
import '../screens/course_detail_screen.dart';
import '../screens/quiz_screen.dart';
import '../screens/course_player_screen.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:lucide_icons/lucide_icons.dart';


class StudentHomeScreen extends StatefulWidget {
  const StudentHomeScreen({super.key});

  @override
  State<StudentHomeScreen> createState() => _StudentHomeScreenState();
}

class _StudentHomeScreenState extends State<StudentHomeScreen>
    with TickerProviderStateMixin {
  String _userName = 'Student';
  bool _hasPendingInstructorRequest = false;
  List<dynamic> _continueLearning = [];
  List<dynamic> _upcomingQuiz = [];
  List<dynamic> _recommendedCourses = [];
  bool _isLoading = true;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _animationController.forward();
    
    _loadUserData();
    _loadHomeData();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  Future<void> _loadUserData() async {
    final userName = await AuthService.getUserName();
    final userRole = await AuthService.getUserRole();
    final userData = await AuthService.getUserData();
    
    setState(() {
      _userName = userName?.split(' ')[0] ?? 'Student';
      _hasPendingInstructorRequest = 
          userData?['status'] == 'pending' ||
          (userRole == 'student' && userData?['requestedRole'] == 'instructor' && userData?['status'] == 'pending');
    });
  }

  Future<void> _loadHomeData() async {
    await Future.delayed(const Duration(milliseconds: 800));
    
    setState(() {
      _continueLearning = [
        {
          'id': '1',
          'title': 'Flutter Beginner - Complete',
          'image': 'https://picsum.photos/seed/flutter-complete/600/400.jpg',
          'progress': 0.75,
          'instructor': 'Jean Dupont',
          'duration': '15 hours',
          'lessons': 32,
          'completedLessons': 24,
          'nextLesson': 'State Management with Provider',
          'rating': 4.9,
          'students': 3421,
          'description': 'Become a Flutter expert with this complete course',
          'category': 'Mobile Development',
          'difficulty': 'Beginner',
          'price': '49.99€',
          'certificate': true,
          'language': 'English',
          'lastAccessed': '2 days ago',
          'totalHours': 15.5,
          'modules': [
            {
              'title': 'Introduction to Flutter',
              'lessons': 8,
              'completed': 8,
              'duration': '3.5, h'
            },
            {
              'title': 'Core Widgets',
              'lessons': 12,
              'completed': 10,
              'duration': '5, h'
            },
            {
              'title': 'State Management',
              'lessons': 8,
              'completed': 4,
              'duration': '4, h'
            },
            {
              'title': 'Navigation',
              'lessons': 4,
              'completed': 2,
              'duration': '3, h'
            }
          ]
        },
        {
          'id': '2',
          'title': 'React Native - iOS/Android Apps',
          'image': 'https://picsum.photos/seed/react-native/600/400.jpg',
          'progress': 0.45,
          'instructor': 'Marie Martin',
          'duration': '20 hours',
          'lessons': 40,
          'completedLessons': 18,
          'nextLesson': 'Hooks and Lifecycle',
          'rating': 4.7,
          'students': 2156,
          'description': 'Create native apps with React Native',
          'category': 'Mobile Development',
          'difficulty': 'Intermediate',
          'price': '59.99€',
          'certificate': true,
          'language': 'English',
          'lastAccessed': '1 day ago',
          'totalHours': 20.0,
          'modules': [
            {
              'title': 'Setup and Configuration',
              'lessons': 6,
              'completed': 6,
              'duration': '2, h'
            },
            {
              'title': 'React Native Components',
              'lessons': 14,
              'completed': 8,
              'duration': '8, h'
            },
            {
              'title': 'Advanced Navigation',
              'lessons': 10,
              'completed': 4,
              'duration': '6, h'
            },
            {
              'title': 'API and Backend',
              'lessons': 10,
              'completed': 0,
              'duration': '4, h'
            }
          ]
        },
        {
          'id': '3',
          'title': 'UI/UX Design - Fundamental Principles',
          'image': 'https://picsum.photos/seed/uiux-design/600/400.jpg',
          'progress': 0.90,
          'instructor': 'Sophie Laurent',
          'duration': '12 hours',
          'lessons': 24,
          'completedLessons': 22,
          'nextLesson': 'Final Portfolio',
          'rating': 4.8,
          'students': 1876,
          'description': 'Master the principles of modern design',
          'category': 'Design',
          'difficulty': 'Beginner',
          'price': '39.99€',
          'certificate': true,
          'language': 'English',
          'lastAccessed': 'Today',
          'totalHours': 12.0,
          'modules': [
            {
              'title': 'Design Theory',
              'lessons': 8,
              'completed': 8,
              'duration': '3, h'
            },
            {
              'title': 'Design Tools',
              'lessons': 8,
              'completed': 8,
              'duration': '4, h'
            },
            {
              'title': 'Practical Projects',
              'lessons': 8,
              'completed': 6,
              'duration': '5, h'
            }
          ]
        }
      ];

      _upcomingQuiz = [
        {
          'id': '1',
          'title': 'Final Quiz - Flutter',
          'courseTitle': 'Flutter Beginner - Complete',
          'courseId': '1',
          'questions': 20,
          'duration': '30 min',
          'difficulty': 'Intermediate',
          'deadline': 'In 2 days',
          'topics': ['Widgets', 'State Management', 'Navigation', 'Animations'],
          'passingScore': 70,
          'attempts': 0,
          'maxAttempts': 3,
          'description': 'Test your Flutter knowledge',
          'points': 100,
          'certificate': true
        },
        {
          'id': '2',
          'title': 'Module 3 Quiz - React Native',
          'courseTitle': 'React Native - iOS/Android Apps',
          'courseId': '2',
          'questions': 15,
          'duration': '25 min',
          'difficulty': 'Easy',
          'deadline': 'In 5 days',
          'topics': ['Components', 'Props', 'State', 'Hooks'],
          'passingScore': 60,
          'attempts': 1,
          'maxAttempts': 3,
          'description': 'Evaluation of React Native components',
          'points': 75,
          'certificate': false
        }
      ];

      _recommendedCourses = [
        {
          'id': '4',
          'title': 'Python for Data Science',
          'image': 'https://picsum.photos/seed/python-data/600/400.jpg',
          'instructor': 'Dr. Robert Chen',
          'rating': 4.9,
          'price': '69.99€',
          'level': 'Intermediate',
          'duration': '25 hours',
          'students': 4532,
          'category': 'Data Science',
          'description': 'Master Python for data analysis and machine learning',
          'skills': ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization'],
          'certificate': true,
          'language': 'English',
          'updated': '1 week ago',
          'reviews': 892,
          'hours': 25.0,
          'lessons': 50
        },
        {
          'id': '5',
          'title': 'Modern JavaScript - ES6+',
          'image': 'https://picsum.photos/seed/javascript-modern/600/400.jpg',
          'instructor': 'Alex Bernard',
          'rating': 4.8,
          'price': '44.99€',
          'level': 'Intermediate',
          'duration': '18 hours',
          'students': 3214,
          'category': 'Web Development',
          'description': 'Learn ES6+ JavaScript and modern frameworks',
          'skills': ['ES6+', 'Async/Await', 'Promises', 'Modules', 'Classes'],
          'certificate': true,
          'language': 'English',
          'updated': '3 days ago',
          'reviews': 654,
          'hours': 18.0,
          'lessons': 36
        },
        {
          'id': '6',
          'title': 'Strategic Digital Marketing',
          'image': 'https://picsum.photos/seed/marketing-strategy/600/400.jpg',
          'instructor': 'Claire Dubois',
          'rating': 4.7,
          'price': '34.99€',
          'level': 'Beginner',
          'duration': '14 hours',
          'students': 1987,
          'category': 'Marketing',
          'description': 'Digital marketing strategies for modern businesses',
          'skills': ['SEO', 'Social Media', 'Content Marketing', 'Analytics', 'Email Marketing'],
          'certificate': true,
          'language': 'English',
          'updated': '5 days ago',
          'reviews': 423,
          'hours': 14.0,
          'lessons': 28
        },
        {
          'id': '7',
          'title': 'Blockchain and Cryptocurrencies',
          'image': 'https://picsum.photos/seed/blockchain-crypto/600/400.jpg',
          'instructor': 'Pierre Martin',
          'rating': 4.6,
          'price': '79.99€',
          'level': 'Advanced',
          'duration': '30 hours',
          'students': 1234,
          'category': 'Blockchain',
          'description': 'Understand blockchain technology and cryptocurrencies',
          'skills': ['Blockchain', 'Smart Contracts', 'DeFi', 'Web3', 'NFTs'],
          'certificate': true,
          'language': 'English',
          'updated': '1 week ago',
          'reviews': 298,
          'hours': 30.0,
          'lessons': 60
        }
      ];

      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF0F2F5),
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: CustomScrollView(
          slivers: [
            // Header complètement redesigné
            SliverAppBar(
              expandedHeight: 200, floating: false,
              pinned: true,
              backgroundColor: Color(0xFF042444),
              elevation: 0,
              flexibleSpace: FlexibleSpaceBar(
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    // Gradient de fond principal
                    Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Color(0xFF00BCD4),
                            Color(0xFF1976D2),
                            Color(0xFF042444),
                          ],
                        ),
                      ),
                    ),
                    // Cercles décoratifs avec flou
                    Positioned(
                      right: -50, top: -50, child: Container(
                        width: 200, height: 200, decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.black.withValues(alpha: 0.08),
                        ),
                      ),
                    ),
                    Positioned(
                      left: -20, top: 10, child: Container(
                        width: 100, height: 100, decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.black.withValues(alpha: 0.05),
                        ),
                      ),
                    ),
                    // Contenu principal
                    SafeArea(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        border: Border.all(color: Theme.of(context).cardColor, width: 2),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withValues(alpha: 0.2),
                                            blurRadius: 10, offset: const Offset(0, 4),
                                          ),
                                        ],
                                      ),
                                      child: CircleAvatar(
                                        radius: 20,
                                        backgroundColor: Colors.black.withValues(alpha: 0.2),
                                        child: Text(
                                          _userName.isNotEmpty ? _userName[0].toUpperCase() : 'E',
                                          style: TextStyle(
                                            color: Theme.of(context).cardColor,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 20,
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Hello $_userName 👋',
                                          style: TextStyle(
                                            color: Theme.of(context).cardColor,
                                            fontSize: 14, fontWeight: FontWeight.bold,
                                            letterSpacing: -0.5,
                                          ),
                                        ),
                                        Text(
                                          'Ready for a new lesson?',
                                          style: TextStyle(
                                            color: Colors.black.withValues(alpha: 0.8),
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Container(
                                      decoration: BoxDecoration(
                                        color: Colors.black.withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      // Bouton IA Assistant
                                      child: IconButton(
                                        icon: Icon(LucideIcons.smartToyRounded, color: Theme.of(context).cardColor,),
                                        onPressed: () {
                                          Navigator.pushNamed(context, '/ai_assistant');
                                        },
                                        tooltip: 'Assistant IA',
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Container(
                                      decoration: BoxDecoration(
                                        color: Colors.black.withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: IconButton(
                                        icon: Icon(LucideIcons.bellNoneRounded, color: Theme.of(context).cardColor,),
                                        onPressed: () {},
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            const SizedBox(height: 32),
                            // Barre de recherche "Glassmorphism"
                            Container(
                              height: 56, decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: Colors.black.withValues(alpha: 0.2)),
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(16),
                                child: BackdropFilter(
                                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                                  child: TextField(
                                    controller: _searchController,
                                    focusNode: _searchFocusNode,
                                    style: TextStyle(color: Theme.of(context).cardColor,),
                                    decoration: InputDecoration(
                                      hintText: 'Search for a course, a topic...',
                                      hintStyle: TextStyle(color: Colors.black.withValues(alpha: 0.6), fontSize: 14),
                                      prefixIcon: Icon(LucideIcons.searchRounded, color: Theme.of(context).cardColor,),
                                      suffixIcon: Container(
                                        margin: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          color: Color(0xFF00BCD4),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: Icon(LucideIcons.tuneRounded, color: Theme.of(context).cardColor, size: 20),
                                      ),
                                      border: InputBorder.none,
                                      contentPadding: const EdgeInsets.symmetric(vertical: 15),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Statistiques flottantes (Redevient visible après le scroll)
            SliverToBoxAdapter(
              child: Transform.translate(
                offset: const Offset(0, -30),
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 24),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.08),
                        blurRadius: 10, offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Expanded(child: _buildQuickStat('3', 'Active courses', LucideIcons.bookRounded, Color(0xFF00BCD4))),
                      Container(width: 1, height: 30, color: Colors.grey.shade200),
                      Expanded(child: _buildQuickStat('67%', 'Progress', LucideIcons.trendingUpRounded, Color(0xFF1976D2))),
                      Container(width: 1, height: 30, color: Colors.grey.shade200),
                      Expanded(child: _buildQuickStat('12 h', 'Total time', LucideIcons.timerRounded, Color(0xFF042444))),
                    ],
                  ),
                ),
              ),
            ),

            // Bannière de demande instructeur
            if (_hasPendingInstructorRequest)
              SliverToBoxAdapter(
                child: Container(
                  margin: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.amber.shade400, Colors.orange.shade600],
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.orange.withValues(alpha: 0.3),
                        blurRadius: 10, offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.25),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(LucideIcons.pending, color: Theme.of(context).cardColor, size: 32),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Instructor request pending',
                              style: TextStyle(
                                color: Theme.of(context).cardColor,
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            Text(
                              'Review by administrator',
                              style: TextStyle(
                                color: Theme.of(context).cardColor,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          'Pending',
                          style: TextStyle(
                            color: Theme.of(context).cardColor,
                            fontSize: 14, fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

            // Section "Continuez votre apprentissage"
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Continue learning',
                          style: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.bold,
                            color: Color(0xFF1F2937),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: Color(0xFF00BCD4).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            '${_continueLearning.length} courses',
                            style: const TextStyle(
                              color: Color(0xFF00BCD4),
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    // Cards des cours avec contenu réel
                    ..._continueLearning.asMap().entries.map((entry) {
                      final index = entry.key;
                      final course = entry.value;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 20),
                        child: _buildEnhancedCourseCard(course, index),
                      );
                    }).toList(),
                  ],
                ),
              ),
            ),

            // Section "Quiz à venir"
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Upcoming Quizzes',
                          style: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.bold,
                            color: Color(0xFF1F2937),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: Color(0xFF1976D2).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            '${_upcomingQuiz.length} quizzes',
                            style: const TextStyle(
                              color: Color(0xFF1976D2),
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    // Cards des quiz avec contenu détaillé
                    ..._upcomingQuiz.asMap().entries.map((entry) {
                      final index = entry.key;
                      final quiz = entry.value;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: _buildEnhancedQuizCard(quiz, index),
                      );
                    }).toList(),
                  ],
                ),
              ),
            ),

            // Section "Recommandés pour vous"
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Recommended for you',
                          style: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.bold,
                            color: Color(0xFF1F2937),
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            // TODO: Voir tous les cours
                          },
                          child: const Row(
                            children: [
                              Text(
                                'See all',
                                style: TextStyle(
                                  color: Color(0xFF00BCD4),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              SizedBox(width: 8),
                              Icon(LucideIcons.arrowRight, color: Color(0xFF00BCD4), size: 20),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    // Grid des cours recommandés
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.8,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                    ),
                      itemCount: _recommendedCourses.length,
                      itemBuilder: (context, index) {
                        final course = _recommendedCourses[index];
                        return _buildRecommendedCard(course, index);
                      },
                    ),
                  ],
                ),
              ),
            ),

            // Espace en bas
            const SliverToBoxAdapter(
              child: SizedBox(height: 100),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickStat(String value, String label, IconData icon, Color color) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: color, size: 20),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            
            fontSize: 14, fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            color: Colors.grey.shade600, fontSize: 14, fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildEnhancedCourseCard(Map<String, dynamic> course, int index) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 10, offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header de la carte avec image et badges progressifs
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                child: ShaderMask(
                  shaderCallback: (rect) {
                    return LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.black.withValues(alpha: 0.1), Colors.black.withValues(alpha: 0.7)],
                    ).createShader(rect);
                  },
                  blendMode: BlendMode.darken,
                  child: Image.network(
                    course['image'],
                    width: double.infinity, height: 200, fit: BoxFit.cover,
                  ),
                ),
              ),
              Positioned(
                top: 10, left: 10, child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Color(0xFF00BCD4),
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: Text(
                    course['category'].toString().toUpperCase(),
                    style: TextStyle(color: Theme.of(context).cardColor, fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                  ),
                ),
              ),
              Positioned(
                bottom: 10, left: 10, right: 10, child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      course['title'],
                      style: TextStyle(color: Theme.of(context).cardColor, fontSize: 14, fontWeight: FontWeight.bold),
                      maxLines: 1, overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(LucideIcons.starRounded, color: Colors.amber, size: 16),
                        const SizedBox(width: 4),
                        Text('${course['rating']}', style: TextStyle(color: Theme.of(context).cardColor, fontSize: 14, fontWeight: FontWeight.bold)),
                        const SizedBox(width: 12),
                        Icon(LucideIcons.usersAltRounded, color: Theme.of(context).cardColor, size: 16),
                        const SizedBox(width: 4),
                        Text('${course['students']}', style: TextStyle(color: Theme.of(context).cardColor, fontSize: 12)),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          // Corps de la carte
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Progress', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, )),
                    Text('${(course['progress'] * 100).toInt()}%', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF00BCD4))),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: LinearProgressIndicator(
                    value: course['progress'],
                    backgroundColor: Color(0xFF00BCD4).withValues(alpha: 0.1),
                    valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF00BCD4)),
                    minHeight: 8,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    CircleAvatar(
                      radius: 12, backgroundColor: Color(0xFF042444).withValues(alpha: 0.1),
                      child: const Icon(LucideIcons.playRounded, size: 16, ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Next: ${course['nextLesson']}',
                        style: TextStyle(color: Colors.grey.shade600, fontSize: 12, fontStyle: FontStyle.italic),
                        maxLines: 1, overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => CoursePlayerScreen(courseId: course['id']),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFF1E293B),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      elevation: 0,
                    ),
                    child: const Text('Resume course', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEnhancedQuizCard(Map<String, dynamic> quiz, int index) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF00BCD4),
            Color(0xFF1976D2),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF00BCD4).withValues(alpha: 0.3),
            blurRadius: 10, offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(
                    LucideIcons.helpCircleCircleCircle,
                    color: Theme.of(context).cardColor,
                    size: 32,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        quiz['title'],
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14, color: Theme.of(context).cardColor,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        quiz['courseTitle'],
                        style: TextStyle(
                          fontSize: 14, color: Colors.black.withValues(alpha: 0.9),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 6),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    quiz['difficulty'],
                    style: TextStyle(
                      fontSize: 14, color: Theme.of(context).cardColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 20),
            
            // Description
            Text(
              quiz['description'],
              style: TextStyle(
                fontSize: 14, color: Colors.black.withValues(alpha: 0.9),
                height: 1.4,
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Topics
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: (quiz['topics'] as List<String>).map((topic) {
                return Container(
                  padding: const EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 6),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    topic,
                    style: TextStyle(
                      fontSize: 14, color: Theme.of(context).cardColor,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                );
              }).toList(),
            ),
            
            const SizedBox(height: 20),
            
            // Informations détaillées
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildQuizInfoChip(LucideIcons.questionAnswer, '${quiz['questions']} questions'),
                      _buildQuizInfoChip(LucideIcons.schedule, quiz['duration']),
                      _buildQuizInfoChip(LucideIcons.star, '${quiz['points']} points'),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildQuizInfoChip(LucideIcons.trendingUp, 'Score: ${quiz['passingScore']}%'),
                      _buildQuizInfoChip(LucideIcons.repeat, 'Attempts: ${quiz['attempts']}/${quiz['maxAttempts']}'),
                      if (quiz['certificate'] ?? false)
                        _buildQuizInfoChip(LucideIcons.cardMembership, 'Certificate'),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Deadline
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(LucideIcons.clock, size: 20, color: Theme.of(context).cardColor,),
                  const SizedBox(width: 12),
                  Text(
                    'Deadline: ${quiz['deadline']}',
                    style: TextStyle(
                      fontSize: 14, color: Theme.of(context).cardColor,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Bouton
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => QuizScreen(
                        quizId: quiz['id'],
                      ),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  
                  foregroundColor: Color(0xFF1976D2),
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text(
                  'Start quiz',
                  style: TextStyle(
                    fontSize: 14, fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuizInfoChip(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 20, color: Theme.of(context).cardColor,),
          const SizedBox(width: 4),
          Text(
            text,
            style: TextStyle(
              fontSize: 14, color: Theme.of(context).cardColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendedCard(Map<String, dynamic> course, int index) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10, offset: const Offset(0, 4),
          ),
        ],
      ),
      child: InkWell(
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => CourseDetailScreen(courseId: course['id']))),
        borderRadius: BorderRadius.circular(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 4,
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                    child: Image.network(course['image'], width: double.infinity, height: double.infinity, fit: BoxFit.cover),
                  ),
                  Positioned(
                    top: 8, right: 8,
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(color: Theme.of(context).cardColor, shape: BoxShape.circle),
                      child: const Icon(LucideIcons.favoriteBorder, size: 20, color: Colors.red),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: Color(0xFF00BCD4).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
                    child: Text(course['category'].toString().toUpperCase(), style: TextStyle(color: Color(0xFF00BCD4), fontSize: 8, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 8),
                  Text(course['title'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, height: 1.2), maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(LucideIcons.starRounded, color: Colors.amber, size: 14),
                      const SizedBox(width: 4),
                      Text('${course['rating']}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                      const Spacer(),
                      Text(course['price'] ?? 'Free', style: TextStyle(color: Color(0xFF1976D2), fontWeight: FontWeight.bold, fontSize: 13)),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatChip(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 6),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14),
          const SizedBox(width: 6),
          Text(text, style: const TextStyle(fontSize: 11, )),
        ],
      ),
    );
  }
}
