import 'package:flutter/material.dart';
import '../utils/auth_service.dart';
import '../screens/create_course_screen.dart';
import '../utils/api_config.dart';
import 'package:lucide_icons/lucide_icons.dart';


class InstructorHomeScreen extends StatefulWidget {
  const InstructorHomeScreen({super.key});

  @override
  State<InstructorHomeScreen> createState() => _InstructorHomeScreenState();
}

class _InstructorHomeScreenState extends State<InstructorHomeScreen> {
  String _userName = 'Professor';
  Map<String, dynamic> _stats = {};
  List<dynamic> _recentActivity = [];
  List<dynamic> _featuredCourses = [];
  bool _isLoading = true;

  // Premium Colors
  static const Color kSlate900 = Color(0xFF0F172A);
  static const Color kIndigo600 = Color(0xFF4F46E5);
  static const Color kSlate50 = Color(0xFFF8FAFC);
  static const Color kSlate400 = Color(0xFF94A3B8);

  @override
  void initState() {
    super.initState();
    _loadUserData();
    _loadHomeData();
  }

  Future<void> _loadUserData() async {
    final userName = await AuthService.getUserName();
    setState(() {
      _userName = userName?.split(' ')[0] ?? 'Professor';
    });
  }

  Future<void> _loadHomeData() async {
    setState(() => _isLoading = true);
    
    try {
      final courses = await AuthService.getInstructorCourses();
      int totalStudents = 0;
      double totalRevenue = 0;
      
      for (var course in courses) {
        final enrolled = course['enrolledStudents'] as List? ?? [];
        totalStudents += enrolled.length;
        totalRevenue += (course['price'] ?? 0) * enrolled.length;
      }

      setState(() {
        _featuredCourses = courses.isEmpty ? _dummyCourses() : courses;
        _stats = {
          'totalStudents': totalStudents,
          'activeCourses': courses.length,
          'averageRating': 4.9,
          'monthlyRevenue': totalRevenue,
        };
        
        _recentActivity = [
          {'message': 'New student enrolled in Flutter Pro', 'time': '2, h ago', 'icon': LucideLucideLucideIcons.userAddRounded, 'color': kIndigo600},
          {'message': 'Course content updated successfully', 'time': 'Yesterday', 'icon': LucideLucideIcons.autoAwesomeRounded, 'color': Colors.amber},
        ];
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  List<dynamic> _dummyCourses() => [
    {'title': 'Mastering Flutter Architecture', 'students': 1240, 'rating': 4.9, 'revenue': 4200, 'image': 'https://placeholder.com/150'},
    {'title': 'Premium UI Design Systems', 'students': 850, 'rating': 4.8, 'revenue': 2900, 'image': 'https://placeholder.com/150'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kSlate50, body: _isLoading
          ? Center(child: CircularProgressIndicator(color: kIndigo600))
          : CustomScrollView(
              slivers: [
                _buildSliverAppBar(),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionHeader('Overview'),
                        const SizedBox(height: 16),
                        _buildStatsGrid(),
                        const SizedBox(height: 32),
                        _buildSectionHeader('Recent Performance'),
                        const SizedBox(height: 16),
                        _buildFeaturedCourses(),
                        const SizedBox(height: 32),
                        _buildSectionHeader('Live Feed'),
                        const SizedBox(height: 16),
                        _buildActivityList(),
                        const SizedBox(height: 100),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 200, floating: false,
      pinned: true,
      backgroundColor: kSlate900, elevation: 0,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [kSlate900, kIndigo600],
            ),
          ),
          child: Stack(
            children: [
              Positioned(
                top: -50, right: -50, child: Container(width: 200, height: 200, decoration: BoxDecoration(color: Colors.black.withValues(alpha: 0.05), shape: BoxShape.circle)),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 20, backgroundColor: Colors.black.withValues(alpha: 0.2),
                      child: Text(_userName[0].toUpperCase(), style: TextStyle(color: Theme.of(context).cardColor, fontWeight: FontWeight.w900, fontSize: 20)),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Welcome back,', style: TextStyle(color: Colors.black.withValues(alpha: 0.6), fontSize: 14, fontWeight: FontWeight.w600)),
                          Text('Prof. $_userName', style: TextStyle(color: Theme.of(context).cardColor, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: -0.5)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String t) {
    return Text(t, style: TextStyle(color: kSlate900, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: -0.5));
  }

  Widget _buildStatsGrid() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 3,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      childAspectRatio: 0.9,
      children: [
        _buildHomeStatCard('Students', '${_stats['totalStudents']}', LucideLucideIcons.groupsRounded, kIndigo600),
        _buildHomeStatCard('Courses', '${_stats['activeCourses']}', LucideLucideLucideIcons.graduationCap, kSlate900),
        _buildHomeStatCard('Rating', '${_stats['averageRating']}', LucideLucideLucideLucideIcons.starRounded, Colors.amber),
      ],
    );
  }

  Widget _buildHomeStatCard(String t, String v, IconData i, Color c) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: kSlate900.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(i, color: c, size: 24),
          const SizedBox(height: 12),
          Text(v, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: kSlate900)),
          Text(t, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: kSlate400)),
        ],
      ),
    );
  }

  Widget _buildFeaturedCourses() {
    return Column(
      children: _featuredCourses.map((c) => _buildModernCourseRow(c)).toList(),
    );
  }

  Widget _buildModernCourseRow(Map<String, dynamic> c) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: kSlate900.withValues(alpha: 0.02), blurRadius: 10, offset: const Offset(0, 2))],
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(
              c['image'] != null && c['image'].toString().isNotEmpty
                  ? (c['image'].toString().startsWith('http') ? c['image'] : '${ApiConfig.baseUrl}${c['image']}')
                  : 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300',
              width: 60, height: 60, fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(color: kSlate400.withValues(alpha: 0.1), child: Icon(LucideLucideLucideLucideIcons.bookRounded, color: kSlate400)),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(c['title'], style: TextStyle(fontWeight: FontWeight.w800, color: kSlate900, fontSize: 14), maxLines: 1),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text('${c['students']} enrolled', style: TextStyle(fontSize: 14, color: kSlate400, fontWeight: FontWeight.w600)),
                    const SizedBox(width: 8),
                    const Icon(LucideLucideLucideLucideIcons.starRounded, size: 20, color: Colors.amber),
                    Text('${c['rating']}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
                  ],
                ),
              ],
            ),
          ),
          Text('\$${c['revenue']}', style: TextStyle(fontWeight: FontWeight.w900, color: kIndigo600, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _buildActivityList() {
    return Column(
      children: _recentActivity.map((a) => Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Theme.of(context).cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: kSlate900.withValues(alpha: 0.03))),
        child: Row(
          children: [
            Icon(a['icon'], color: a['color'], size: 20),
            const SizedBox(width: 16),
            Expanded(child: Text(a['message'], style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: kSlate900))),
            Text(a['time'], style: TextStyle(fontSize: 14, color: kSlate400, fontWeight: FontWeight.w500)),
          ],
        ),
      )).toList(),
    );
  }
}
