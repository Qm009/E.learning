import 'package:flutter/material.dart';
import 'new_register_screen.dart';
import 'package:lucide_icons/lucide_icons.dart';


class NewHomeScreen extends StatefulWidget {
  const NewHomeScreen({super.key});

  @override
  State<NewHomeScreen> createState() => _NewHomeScreenState();
}

class _NewHomeScreenState extends State<NewHomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Hero Section with large image
            Stack(
              children: [
                Container(
                  width: double.infinity,
                  height: 500, decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color(0xFF00C6FF).withValues(alpha: 0.8),
                        Color(0xFF0052D4).withValues(alpha: 0.9),
                      ],
                    ),
                  ),
                  child: Image.network(
                    'https://picsum.photos/seed/elearning/1200/500.jpg',
                    width: double.infinity,
                    height: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: Color(0xFF00C6FF),
                        child: Center(
                          child: Icon(LucideIcons.graduationCap, size: 80, color: Theme.of(context).cardColor,),
                        ),
                      );
                    },
                  ),
                ),
                // Overlay content
                Container(
                  width: double.infinity,
                  height: 500, decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Colors.black.withValues(alpha: 0.6),
                      ],
                    ),
                  ),
                  child: SafeArea(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'E-LEARNING',
                            style: TextStyle(
                              fontSize: 14, fontWeight: FontWeight.bold,
                              color: Theme.of(context).cardColor,
                              letterSpacing: 3,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Learn at your own pace',
                            style: TextStyle(
                              fontSize: 14, color: Theme.of(context).cardColor,
                              letterSpacing: 1,
                            ),
                          ),
                          const SizedBox(height: 40),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              ElevatedButton(
                                onPressed: () {
                                  Navigator.pushNamed(context, '/login');
                                },
                                style: ElevatedButton.styleFrom(
                                  
                                  foregroundColor: Color(0xFF00C6FF),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 20, vertical: 16,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(30),
                                  ),
                                ),
                                child: const Text(
                                  'Sign In',
                                  style: TextStyle(
                                    fontSize: 14, fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 16),
                              ElevatedButton(
                                onPressed: () {
                                  Navigator.pushNamed(context, '/register');
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.transparent,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 20, vertical: 16,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(30),
                                    side: BorderSide(color: Theme.of(context).cardColor,),
                                  ),
                                ),
                                child: const Text(
                                  'Sign Up',
                                  style: TextStyle(
                                    fontSize: 14, fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),

            // Stats Section
            Container(
              padding: const EdgeInsets.all(60),
              color: Color(0xFFF8FAFC),
              child: Column(
                children: [
                  const Text(
                    'Our Key Figures',
                    style: TextStyle(
                      fontSize: 14, fontWeight: FontWeight.bold,
                      
                    ),
                  ),
                  const SizedBox(height: 40),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildStatItem('10,000+', 'Students', LucideIcons.users),
                      _buildStatItem('500+', 'Courses', LucideIcons.book),
                      _buildStatItem('50+', 'Instructors', LucideIcons.graduationCap),
                      _buildStatItem('95%', 'Satisfaction', LucideIcons.star),
                    ],
                  ),
                ],
              ),
            ),

            // Features Section
            Container(
              padding: const EdgeInsets.all(60),
              color: Theme.of(context).cardColor,
              child: Column(
                children: [
                  const Text(
                    'Why choose us?',
                    style: TextStyle(
                      fontSize: 14, fontWeight: FontWeight.bold,
                      
                    ),
                  ),
                  const SizedBox(height: 40),
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 16, runSpacing: 16, children: [
                      _buildFeatureItem(
                        'Flexible Learning',
                        'Study whenever you want, wherever you want',
                        LucideIcons.schedule,
                      ),
                      _buildFeatureItem(
                        'Quality Courses',
                        'Content created by domain experts',
                        LucideIcons.verified,
                      ),
                      _buildFeatureItem(
                        'Recognized Certificates',
                        'Get valued certificates',
                        LucideIcons.emojiEvents,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Popular Courses Section
            Container(
              padding: const EdgeInsets.all(60),
              color: Color(0xFFF8FAFC),
              child: Column(
                children: [
                  const Text(
                    'Popular Courses',
                    style: TextStyle(
                      fontSize: 14, fontWeight: FontWeight.bold,
                      
                    ),
                  ),
                  const SizedBox(height: 40),
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 16, runSpacing: 16, children: [
                      _buildCourseCard(
                        'Introduction to Flutter',
                        'John Doe',
                        '4.8',
                        '\$29.99',
                        'https://picsum.photos/seed/flutter-course/400/300.jpg',
                      ),
                      _buildCourseCard(
                        'Advanced UI/UX Design',
                        'Jane Smith',
                        '4.6',
                        '\$39.99',
                        'https://picsum.photos/seed/design-course/400/300.jpg',
                      ),
                      _buildCourseCard(
                        'Python for Beginners',
                        'Sarah Wilson',
                        '4.9',
                        '\$19.99',
                        'https://picsum.photos/seed/python-course/400/300.jpg',
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // CTA Section
            Container(
              padding: const EdgeInsets.all(80),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFF00C6FF),
                    Color(0xFF0052D4),
                  ],
                ),
              ),
              child: Column(
                children: [
                  Text(
                    'Prêt à commencer votre voyage d\'apprentissage ?',
                    style: TextStyle(
                      fontSize: 14, fontWeight: FontWeight.bold,
                      color: Theme.of(context).cardColor,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Rejoignez des milliers d\'étudiants qui transforment leur carrière',
                    style: TextStyle(
                      fontSize: 14, color: Theme.of(context).cardColor,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 40),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const NewRegisterScreen(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      
                      foregroundColor: Color(0xFF00C6FF),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 8.20,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                    child: const Text(
                      'Commencer maintenant',
                      style: TextStyle(
                        fontSize: 14, fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Footer
            Container(
              padding: const EdgeInsets.all(40),
              
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(LucideIcons.graduationCap, color: Theme.of(context).cardColor, size: 32),
                      const SizedBox(width: 12),
                      Text(
                        'E-LEARNING',
                        style: TextStyle(
                          fontSize: 14, fontWeight: FontWeight.bold,
                          color: Theme.of(context).cardColor,
                          letterSpacing: 2,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    '© 2024 E-Learning. All rights reserved.',
                    style: TextStyle(
                      color: Theme.of(context).cardColor,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String number, String label, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 20, color: Color(0xFF00C6FF)),
        const SizedBox(height: 16),
        Text(
          number,
          style: const TextStyle(
            fontSize: 14, fontWeight: FontWeight.bold,
            
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: TextStyle(
            fontSize: 14, color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  Widget _buildFeatureItem(String title, String description, IconData icon) {
    return Container(
      width: 2, padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10, offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Icon(icon, size: 20, color: Color(0xFF00C6FF)),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(
              fontSize: 14, fontWeight: FontWeight.bold,
              
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Text(
            description,
            style: TextStyle(
              fontSize: 14, color: Colors.grey[600],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildCourseCard(String title, String instructor, String rating, String price, String image) {
    return Container(
      width: 2, decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10, offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: Image.network(
              image,
              height: 1, width: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  height: 1, color: Colors.grey[300],
                  child: const Icon(LucideIcons.book, color: Colors.grey, size: 50),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14, fontWeight: FontWeight.bold,
                    
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  instructor,
                  style: TextStyle(
                    fontSize: 14, color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(LucideIcons.star, size: 20, color: Colors.amber),
                        Text(
                          rating,
                          style: const TextStyle(fontSize: 14),
                        ),
                      ],
                    ),
                    Text(
                      price,
                      style: const TextStyle(
                        fontSize: 14, fontWeight: FontWeight.bold,
                        color: Color(0xFF00C6FF),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
