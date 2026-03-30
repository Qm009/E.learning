import 'package:flutter/material.dart';
import '../utils/auth_service.dart';
import 'package:lucide_icons/lucide_icons.dart';


class InstructorStudentsScreen extends StatefulWidget {
  const InstructorStudentsScreen({super.key});

  @override
  State<InstructorStudentsScreen> createState() => _InstructorStudentsScreenState();
}

class _InstructorStudentsScreenState extends State<InstructorStudentsScreen> {
  List<dynamic> _students = [];
  List<dynamic> _filteredStudents = [];
  String _searchQuery = '';
  String _selectedCourse = 'Tous';
  bool _isLoading = true;

  // Premium Colors
  static const Color kSlate900 = Color(0xFF0F172A);
  static const Color kIndigo600 = Color(0xFF4F46E5);
  static const Color kSlate50 = Color(0xFFF8FAFC);
  static const Color kSlate400 = Color(0xFF94A3B8);
  static const Color kSlate200 = Color(0xFFE2E8F0);

  @override
  void initState() {
    super.initState();
    _loadStudents();
  }

  Future<void> _loadStudents() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 800)); // Smooth transition
    
    setState(() {
      _students = [
        {
          'id': '1',
          'name': 'Alice Martin',
          'email': 'alice.martin@email.com',
          'avatar': 'AM',
          'course': 'Flutter Masterclass',
          'progress': 0.75,
          'quizScore': 85,
          'enrollmentDate': '15/01/2024',
          'lastActivity': '2 days ago',
        },
        {
          'id': '2',
          'name': 'Bob Dupont',
          'email': 'bob.dupont@email.com',
          'avatar': 'BD',
          'course': 'Advanced UI/UX',
          'progress': 0.45,
          'quizScore': 72,
          'enrollmentDate': '20/01/2024',
          'lastActivity': '1 day ago',
        },
        {
          'id': '3',
          'name': 'Carla Bernard',
          'email': 'carla.bernard@email.com',
          'avatar': 'CB',
          'course': 'Fullstack React',
          'progress': 0.90,
          'quizScore': 92,
          'enrollmentDate': '10/02/2024',
          'lastActivity': '3 hours ago',
        },
      ];
      _filteredStudents = _students;
      _isLoading = false;
    });
  }

  void _filterStudents() {
    setState(() {
      _filteredStudents = _students.where((student) {
        final matchesSearch = student['name'].toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
                              student['email'].toString().toLowerCase().contains(_searchQuery.toLowerCase());
        final matchesCourse = _selectedCourse == 'Tous' || student['course'] == _selectedCourse;
        return matchesSearch && matchesCourse;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kSlate50, appBar: AppBar(
        
        elevation: 0,
        title: Text('Learner Insights', style: TextStyle(color: kSlate900, fontWeight: FontWeight.w800, fontSize: 18)),
        leading: IconButton(
          icon: Icon(LucideLucideLucideIcons.arrowLeft_ios_new_rounded, color: kSlate900, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          _buildFilters(),
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator(color: kIndigo600))
                : _filteredStudents.isEmpty
                    ? _buildEmptyState()
                    : RefreshIndicator(
                        onRefresh: _loadStudents,
                        color: kIndigo600, child: ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          itemCount: _filteredStudents.length,
                          itemBuilder: (context, index) => _buildStudentCard(_filteredStudents[index]),
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: const BorderRadius.only(bottomLeft: Radius.circular(32), bottomRight: Radius.circular(32)),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(color: kSlate200, borderRadius: BorderRadius.circular(16)),
            child: TextField(
              onChanged: (v) { _searchQuery = v; _filterStudents(); },
              decoration: InputDecoration(
                hintText: 'Search learners...',
                hintStyle: TextStyle(color: kSlate400.withValues(alpha: 0.6), fontSize: 14),
                prefixIcon: Icon(LucideLucideLucideLucideIcons.searchRounded, color: kSlate400, size: 20),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ),
          const SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: ['Tous', 'Flutter Masterclass', 'Advanced UI/UX', 'Fullstack React'].map((c) {
                final isSelected = _selectedCourse == c;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(c),
                    selected: isSelected,
                    onSelected: (v) { setState(() => _selectedCourse = c); _filterStudents(); },
                    selectedColor: kIndigo600, backgroundColor: kSlate50, labelStyle: TextStyle(
                      color: isSelected ? Colors.white : kSlate900, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500, fontSize: 12,
                    ),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide.none),
                    showCheckmark: false,
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideLucideLucideIcons.userSearchRounded, size: 20, color: kSlate400.withValues(alpha: 0.3)),
          const SizedBox(height: 16),
          Text('No learners found', style: TextStyle(color: kSlate900, fontSize: 14, fontWeight: FontWeight.bold)),
          Text('Try adjusting your search filters', style: TextStyle(color: kSlate400, fontSize: 14)),
        ],
      ),
    );
  }

  Widget _buildStudentCard(Map<String, dynamic> student) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: kSlate900.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 12, backgroundColor: kIndigo600.withValues(alpha: 0.1),
                child: Text(student['avatar'], style: TextStyle(color: kIndigo600, fontWeight: FontWeight.w900)),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(student['name'], style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: kSlate900)),
                    Text(student['course'], style: TextStyle(fontSize: 14, color: kIndigo600, fontWeight: FontWeight.w700)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 5),
                decoration: BoxDecoration(color: Colors.green.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)),
                child: Text('${student['quizScore']}%', style: const TextStyle(color: Colors.green, fontWeight: FontWeight.w900, fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Learning Progress', style: TextStyle(fontSize: 14, color: kSlate400, fontWeight: FontWeight.w600)),
                        Text('${(student['progress'] * 100).toInt()}%', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: kSlate900)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: LinearProgressIndicator(
                        value: student['progress'],
                        backgroundColor: kSlate200, valueColor: AlwaysStoppedAnimation<Color>(kIndigo600),
                        minHeight: 6,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Divider(color: kSlate200, thickness: 1),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildMiniStat(LucideLucideIcons.calendarTodayRounded, 'Joined ${student['enrollmentDate']}'),
              _buildMiniStat(LucideLucideLucideIcons.clockRounded, 'Active ${student['lastActivity']}'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMiniStat(IconData i, String t) {
    return Row(
      children: [
        Icon(i, size: 20, color: kSlate400),
        const SizedBox(width: 4),
        Text(t, style: TextStyle(fontSize: 14, color: kSlate400, fontWeight: FontWeight.w500)),
      ],
    );
  }
}
