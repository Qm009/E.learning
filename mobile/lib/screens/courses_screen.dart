import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/api_config.dart';
import 'package:lucide_icons/lucide_icons.dart';


class CoursesScreen extends StatefulWidget {
  const CoursesScreen({super.key});

  @override
  _CoursesScreenState createState() => _CoursesScreenState();
}

class _CoursesScreenState extends State<CoursesScreen> {
  List<dynamic> _courses = [];
  final TextEditingController _searchController = TextEditingController();
  String _selectedCategory = 'All';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<String> _getCategories() {
    final categories = _courses
        .map((course) => course['category'] as String?)
        .where((c) => c != null)
        .cast<String>()
        .toSet()
        .toList();
    categories.insert(0, 'All');
    return categories;
  }

  List<dynamic> _getFilteredCourses() {
    return _courses.where((course) {
      final matchesSearch = _searchController.text.isEmpty ||
          (course['title']?.toString().toLowerCase() ?? '')
              .contains(_searchController.text.toLowerCase()) ||
          (course['description']?.toString().toLowerCase() ?? '')
              .contains(_searchController.text.toLowerCase());
              
      final matchesCategory = _selectedCategory == 'All' ||
          course['category'] == _selectedCategory;
          
      return matchesSearch && matchesCategory;
    }).toList()
      ..sort((a, b) {
        // Enforce the same sort as web: default to ID string sort if no date
        return (b['_id'] ?? '').toString().compareTo((a['_id'] ?? '').toString());
      });
  }

  @override
  void initState() {
    super.initState();
    _populateDemoData();
    _fetchCourses();
  }

  void _populateDemoData() {
    _courses = [
      {
        '_id': '1',
        'title': 'Introduction à JavaScript',
        'description': 'Apprenez les bases de JavaScript, le langage de programmation le plus populaire pour le développement web.',
        'instructor': {'name': 'Jean Dupont'},
        'category': 'Développement Web',
        'level': 'Débutant',
        'price': 0,
        'lessons': List.filled(9, {}),
        'image': 'https://images.unsplash.com/photo-1627398242454-45 a1465, c2479?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '2',
        'title': 'React Avancé',
        'description': 'Maîtrisez React avec les hooks, Redux et les meilleures pratiques de développement.',
        'instructor': {'name': 'Marie Martin'},
        'category': 'Framework JavaScript',
        'level': 'Intermédiaire',
        'price': 49,
        'lessons': List.filled(6, {}),
        'image': 'https://images.unsplash.com/photo-1633356122544-f134324 a6, cee?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '3',
        'title': 'Python pour Data Science',
        'description': 'Explorez Python avec Pandas, NumPy et Matplotlib pour l\'analyse de données.',
        'instructor': {'name': 'Pierre Durand'},
        'category': 'Data Science',
        'level': 'Intermédiaire',
        'price': 39,
        'lessons': List.filled(6, {}),
        'image': 'https://images.unsplash.com/photo-1526379095098-d400 fd0, bf935?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '4',
        'title': 'Design UI/UX',
        'description': 'Apprenez les principes du design d\'interface et d\'expérience utilisateur.',
        'instructor': {'name': 'Sophie Lemaire'},
        'category': 'Design',
        'level': 'Débutant',
        'price': 29,
        'lessons': List.filled(3, {}),
        'image': 'https://images.unsplash.com/photo-1555949963-aa79 dcee981, c3?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '5',
        'title': 'Node.js Backend',
        'description': 'Créez des serveurs robustes avec Node.js, Express et MongoDB.',
        'instructor': {'name': 'Thomas Bernard'},
        'category': 'Backend',
        'level': 'Intermédiaire',
        'price': 59,
        'lessons': List.filled(3, {}),
        'image': 'https://images.unsplash.com/photo-1627398242454-45 a1465, c2479?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '6',
        'title': 'HTML5 & CSS3 Complet',
        'description': 'Maîtrisez les fondamentaux du web avec HTML5 et CSS3.',
        'instructor': {'name': 'Claire Petit'},
        'category': 'Développement Web',
        'level': 'Débutant',
        'price': 19,
        'lessons': List.filled(6, {}),
        'image': 'https://images.unsplash.com/photo-1507003211169-0 a1, dd7228, f2, d?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '7',
        'title': 'Vue.js Moderne',
        'description': 'Apprenez Vue.js 3 avec Composition API et les meilleures pratiques.',
        'instructor': {'name': 'Lucas Girard'},
        'category': 'Framework JavaScript',
        'level': 'Intermédiaire',
        'price': 49,
        'lessons': List.filled(3, {}),
        'image': 'https://images.unsplash.com/photo-1633356122544-f134324 a6, cee?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '8',
        'title': 'Machine Learning',
        'description': 'Introduction au machine learning avec Python et scikit-learn.',
        'instructor': {'name': 'Emma Robert'},
        'category': 'Intelligence Artificielle',
        'level': 'Avancé',
        'price': 89,
        'lessons': List.filled(3, {}),
        'image': 'https://images.unsplash.com/photo-1555255707-c07966088 b7, b?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '9',
        'title': 'Docker et Conteneurs',
        'description': 'Apprenez à containeriser vos applications avec Docker.',
        'instructor': {'name': 'Nicolas Dubois'},
        'category': 'DevOps',
        'level': 'Intermédiaire',
        'price': 39,
        'lessons': List.filled(3, {}),
        'image': 'https://images.unsplash.com/photo-1603895123512-6 a4, f2, a4, e5, b7, f?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '10',
        'title': 'Git et GitHub',
        'description': 'Maîtrisez le contrôle de version avec Git et GitHub.',
        'instructor': {'name': 'Camille Leroy'},
        'category': 'Outils Développement',
        'level': 'Débutant',
        'price': 19,
        'lessons': List.filled(6, {}),
        'image': 'https://images.unsplash.com/photo-1618401471353-b98 afee0, b2, eb?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '11',
        'title': 'UX/UI Design Fondamentaux',
        'description': 'Apprenez les principes du design d\'interface et de l\'expérience utilisateur.',
        'instructor': {'name': 'Claire Bernard'},
        'category': 'Design',
        'level': 'Débutant',
        'price': 29,
        'lessons': List.filled(3, {}),
        'image': 'https://images.unsplash.com/photo-1559028006-448665 bd7, c7, f?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '12',
        'title': 'Node.js Backend Development',
        'description': 'Créez des serveurs web robustes avec Node.js et Express.',
        'instructor': {'name': 'Thomas Petit'},
        'category': 'Développement Web',
        'level': 'Intermédiaire',
        'price': 59,
        'lessons': List.filled(3, {}),
        'image': 'https://images.unsplash.com/photo-1627398242454-45 a1465, c2479?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '13',
        'title': 'Marketing Digital',
        'description': 'Stratégies de marketing en ligne pour les entreprises modernes.',
        'instructor': {'name': 'Sophie Leroy'},
        'category': 'Marketing',
        'level': 'Débutant',
        'price': 39,
        'lessons': List.filled(3, {}),
        'image': 'https://images.unsplash.com/photo-1460925895917-afdab827 c52, f?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '14',
        'title': 'Cybersécurité',
        'description': 'Protégez vos systèmes et données contre les menaces informatiques.',
        'instructor': {'name': 'Lucas Martin'},
        'category': 'Sécurité',
        'level': 'Avancé',
        'price': 99,
        'lessons': List.filled(3, {}),
        'image': 'https://images.unsplash.com/photo-1563013544-824 ae1, b704, d3?w=300&h=200&fit=crop&auto=format',
      },
      {
        '_id': '15',
        'title': 'Blockchain et Cryptomonnaies',
        'description': 'Comprendre la technologie blockchain et les cryptomonnaies.',
        'instructor': {'name': 'Maxime Dubois'},
        'category': 'Blockchain',
        'level': 'Intermédiaire',
        'price': 69,
        'lessons': List.filled(3, {}),
        'image': 'https://images.unsplash.com/photo-1639762681485-074 b7, f938, ba0?w=300&h=200&fit=crop&auto=format',
      },
    ];
  }

  Future<void> _fetchCourses() async {
    try {
      final response = await http.get(
        Uri.parse(ApiConfig.coursesUrl),
      ).timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List && data.isNotEmpty) {
          if (mounted) {
            setState(() {
              _courses = data;
            });
          }
        }
      }
    } catch (_) {
      // API failed or timed out, we already have demo data from initState
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Courses'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'All Courses'),
              Tab(text: 'My Courses'),
            ],
            indicatorColor: Color(0xFF00C6FF),
            labelColor: Color(0xFF042444),
            unselectedLabelColor: Color(0xFF6B7A90),
          ),
        ),
        body: TabBarView(
          children: [
            // All Courses Tab
            Column(
              children: [
                // Search Bar
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: TextField(
                    onChanged: (text) {
                      setState(() {
                        // Triggers rebuild, filtered courses computed below
                      });
                    },
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search courses by name or description...',
                      prefixIcon: const Icon(LucideIcons.search),
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(vertical: 0),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(LucideIcons.clear),
                              onPressed: () {
                                _searchController.clear();
                                setState(() {});
                              },
                            )
                          : null,
                    ),
                  ),
                ),
                
                // Categories
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    children: _getCategories().map((category) {
                      final isSelected = _selectedCategory == category;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: FilterChip(
                          label: Text(category),
                          selected: isSelected,
                          onSelected: (selected) {
                            setState(() {
                              _selectedCategory = category;
                            });
                          },
                          // selectedColor: Color(0xFF00C6FF).withValues(alpha: 0.2), // Deprecated
                          selectedColor: Color(0xFF00C6FF).withValues(alpha: 0.2),
                          checkmarkColor: Color(0xFF0052D4),
                          labelStyle: TextStyle(
                            color: isSelected ? Color(0xFF0052D4) : Colors.black87,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                
                Expanded(
                  child: _getFilteredCourses().isEmpty 
                    ? const Center(
                        child: Text('No Courses Found\nTry adjusting your search or filter criteria', textAlign: TextAlign.center, style: TextStyle(color: Colors.black54)),
                      )
                    : ListView.builder(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: _getFilteredCourses().length,
                    itemBuilder: (context, index) {
                      final course = _getFilteredCourses()[index];
                      return GestureDetector(
                        onTap: () => Navigator.pushNamed(
                          context,
                          '/course_detail',
                          arguments: course['_id'],
                        ),
                        child: _CourseCard(
                          title: course['title'] ?? 'Untitled',
                          instructor: course['instructor']?['name'] ?? 'Unknown',
                          imagePath: course['image'] ?? '',
                          lessons: (course['lessons'] as List?)?.length.toString() ?? '0',
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
            
            // My Courses Tab (Placeholder)
            const Center(
              child: Text(
                'Enroll in a course to see it here.',
                style: TextStyle(
                  color: Color(0xFF6B7A90),
                  fontSize: 16,
                ),
              ),
            ),
          ],
        ),
        bottomNavigationBar: Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 10,
                offset: Offset(0, -5),
              ),
            ],
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _NavItem(
                    icon: LucideIcons.home,
                    label: 'Home',
                    onTap: () => Navigator.pushReplacementNamed(context, '/'),
                  ),
                  _NavItem(
                    icon: LucideIcons.book,
                    label: 'Courses',
                    isActive: true,
                    onTap: () {},
                  ),
                  _NavItem(
                    icon: LucideIcons.layoutDashboard,
                    label: 'Admin',
                    onTap: () => Navigator.pushReplacementNamed(context, '/dashboard'),
                  ),
                  _NavItem(
                    icon: LucideIcons.user,
                    label: 'Profile',
                    onTap: () => Navigator.pushReplacementNamed(context, '/instructor'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
} // End of _CoursesScreenState

class _CourseCard extends StatelessWidget {
  final String title;
  final String instructor;
  final String imagePath;
  final String lessons;

  const _CourseCard({
    required this.title,
    required this.instructor,
    required this.imagePath,
    required this.lessons,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 8,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(20),
                bottomLeft: Radius.circular(20),
              ),
              image: DecorationImage(
                image: NetworkImage(
                  imagePath.isNotEmpty
                      ? imagePath
                      : 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
                ),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    instructor,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF6B7A90),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(
                        LucideIcons.calendar,
                        size: 14,
                        color: Color(0xFF6B7A90),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '$lessons lessons',
                        style: const TextStyle(
                          fontSize: 11,
                          color: Color(0xFF6B7A90),
                        ),
                      ),
                      const Spacer(),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    this.isActive = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            color: isActive ? Color(0xFF00C6FF) : Color(0xFF6B7A90),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              color: isActive ? Color(0xFF00C6FF) : Color(0xFF6B7A90),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}
