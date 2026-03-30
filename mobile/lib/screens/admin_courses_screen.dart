import 'package:flutter/material.dart';
import '../utils/auth_service.dart';
import '../utils/api_config.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:lucide_icons/lucide_icons.dart';


class AdminCoursesScreen extends StatefulWidget {
  const AdminCoursesScreen({super.key});

  @override
  State<AdminCoursesScreen> createState() => _AdminCoursesScreenState();
}

class _AdminCoursesScreenState extends State<AdminCoursesScreen> {
  List<dynamic> _courses = [];
  List<dynamic> _filteredCourses = [];
  String _searchQuery = '';
  String _selectedStatus = 'All';
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCourses();
  }

  Future<void> _loadCourses() async {
    setState(() => _isLoading = true);
    
    try {
      final headers = await AuthService.getAuthHeaders();
      final response = await http.get(Uri.parse(ApiConfig.coursesUrl), headers: headers);
      
      if (response.statusCode == 200) {
        final List<dynamic> courses = jsonDecode(response.body);
        setState(() {
          _courses = courses.map((c) {
            final instructor = c['instructor'] is Map ? c['instructor'] : {'name': 'Instructor'};
            return {
              'id': c['_id'],
              'title': c['title'] ?? 'Untitled',
              'instructor': instructor['name'] ?? 'Instructor',
              'instructorAvatar': (instructor['name'] ?? 'I').substring(0, 1).toUpperCase(),
              'image': (c['image'] != null && c['image'].isNotEmpty) 
                  ? (c['image'].startsWith('http') ? c['image'] : '${ApiConfig.baseUrl}${c['image']}')
                  : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
              'students': (c['enrolledStudents'] as List?)?.length ?? 0,
              'rating': 4.8, // Fallback
              'status': c['status'] ?? 'draft',
              'price': c['price']?.toDouble() ?? 0.0,
              'category': c['category'] ?? 'Development',
            };
          }).toList();
          _filteredCourses = _courses;
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  void _filterCourses() {
    setState(() {
      _filteredCourses = _courses.where((course) {
        final matchesSearch = course['title'].toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
                              course['instructor'].toString().toLowerCase().contains(_searchQuery.toLowerCase());
        final matchesStatus = _selectedStatus == 'All' || course['status'] == _selectedStatus.toLowerCase();
        return matchesSearch && matchesStatus;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      
      appBar: AppBar(
        
        elevation: 0,
        title: const Text(
          'Manage Courses',
          style: TextStyle(
            fontSize: 14, fontWeight: FontWeight.bold,
            
          ),
        ),
        leading: IconButton(
          icon: const Icon(LucideLucideLucideIcons.arrowLeft_ios_new_rounded,  size: 18),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          // Barre de recherche et filtres
          Container(
            padding: const EdgeInsets.all(16),
            color: Theme.of(context).cardColor,
            child: Column(
              children: [
                // Barre de recherche
                TextField(
                  onChanged: (value) {
                    _searchQuery = value;
                    _filterCourses();
                  },
                  decoration: InputDecoration(
                    hintText: 'Search a course...',
                    prefixIcon: const Icon(LucideLucideLucideLucideIcons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(color: Colors.grey[300]!),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(color: Color(0xFF00BCD4)),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                // Filtres par statut
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: ['All', 'Published', 'Pending', 'Unpublished'].map((status) {
                      String translatedStatus = status;
                      if (status == 'Published') translatedStatus = 'published';
                      if (status == 'Pending') translatedStatus = 'pending';
                      if (status == 'Unpublished') translatedStatus = 'unpublished';
                      if (status == 'All') translatedStatus = 'All';

                      final isSelected = _selectedStatus == translatedStatus;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(status),
                          selected: isSelected,
                          onSelected: (selected) {
                            setState(() {
                              _selectedStatus = translatedStatus;
                            });
                            _filterCourses();
                          },
                          backgroundColor: isSelected ? Color(0xFF00BCD4) : Color(0xFFF1F5F9),
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : Color(0xFF64748B),
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
          
          // Liste des cours
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _filteredCourses.isEmpty
                    ? _buildEmptyState()
                    : RefreshIndicator(
                        onRefresh: _loadCourses,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: _filteredCourses.length,
                          itemBuilder: (context, index) {
                            final course = _filteredCourses[index];
                            return _buildCourseCard(course);
                          },
                        ),
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
          Icon(LucideLucideLucideLucideIcons.searchOff, size: 20, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            'No courses found',
            style: TextStyle(
              fontSize: 14, fontWeight: FontWeight.bold,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Try changing your search criteria',
            style: TextStyle(
              fontSize: 14, color: Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCourseCard(Map<String, dynamic> course) {
    Color statusColor;
    String statusText;

    switch (course['status']) {
      case 'published':
        statusColor = Colors.green;
        statusText = 'Published';
        break;
      case 'pending':
        statusColor = Colors.orange;
        statusText = 'Pending';
        break;
      case 'unpublished':
        statusColor = Colors.red;
        statusText = 'Unpublished';
        break;
      default:
        statusColor = Colors.grey;
        statusText = course['status'];
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image et informations principales
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Image du cours
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  course['image'],
                  width: 100, height: 100, fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      width: 1, height: 1, color: Colors.grey[300],
                      child: const Icon(LucideLucideLucideLucideIcons.book, color: Colors.grey),
                    );
                  },
                ),
              ),
              const SizedBox(width: 12),
              // Informations du cours
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      course['title'],
                      style: const TextStyle(
                        fontSize: 14, fontWeight: FontWeight.bold,
                        
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 12, backgroundColor: Color(0xFF00BCD4).withValues(alpha: 0.1),
                          child: Text(
                            course['instructorAvatar'],
                            style: const TextStyle(
                              color: Color(0xFF00BCD4),
                              fontSize: 14, fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          course['instructor'],
                          style: TextStyle(
                            fontSize: 14, color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(LucideLucideLucideLucideIcons.star, size: 20, color: Colors.amber),
                        Text(
                          '${course['rating']}',
                          style: const TextStyle(fontSize: 12),
                        ),
                        const SizedBox(width: 12),
                        Icon(LucideLucideLucideIcons.users, size: 20, color: Colors.grey[600]),
                        Text(
                          '${course['students']} students',
                          style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    // Badge de statut
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: statusColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        statusText,
                        style: TextStyle(
                          fontSize: 14, color: statusColor,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Menu actions
              PopupMenuButton<String>(
                icon: const Icon(LucideLucideLucideIcons.moreVertical),
                onSelected: (value) => _handleCourseAction(value, course),
                itemBuilder: (BuildContext context) => [
                  if (course['status'] != 'published')
                    const PopupMenuItem<String>(
                      value: 'publish',
                      child: Row(
                        children: [
                          Icon(LucideLucideIcons.publish, size: 20, color: Colors.green),
                          SizedBox(width: 8),
                          Text('Publish'),
                        ],
                      ),
                    ),
                  if (course['status'] == 'published')
                    const PopupMenuItem<String>(
                      value: 'unpublish',
                      child: Row(
                        children: [
                          Icon(LucideLucideIcons.unpublished, size: 20, color: Colors.orange),
                          SizedBox(width: 8),
                          Text('Unpublish'),
                        ],
                      ),
                    ),
                  const PopupMenuItem<String>(
                    value: 'delete',
                    child: Row(
                      children: [
                        Icon(LucideLucideLucideIcons.trash, size: 20, color: Colors.red),
                        SizedBox(width: 8),
                        Text('Delete'),
                      ],
                    ),
                  ),
                  const PopupMenuItem<String>(
                    value: 'view',
                    child: Row(
                      children: [
                        Icon(LucideLucideLucideIcons.eye, size: 16),
                        SizedBox(width: 8),
                        Text('View course'),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
          
          // Prix
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: const BoxDecoration(
              color: Color(0xFFF8FAFC),
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(12)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  course['category'],
                  style: TextStyle(
                    fontSize: 14, color: Colors.grey[600],
                  ),
                ),
                Text(
                  '${course['price']}€',
                  style: const TextStyle(
                    fontSize: 14, fontWeight: FontWeight.bold,
                    color: Color(0xFF00BCD4),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _handleCourseAction(String action, Map<String, dynamic> course) {
    switch (action) {
      case 'publish':
        _showConfirmDialog(
          'Publish course',
          'Are you sure you want to publish "${course['title']}"?',
          () => _publishCourse(course['id']),
        );
        break;
      case 'unpublish':
        _showConfirmDialog(
          'Unpublish course',
          'Are you sure you want to unpublish "${course['title']}"?',
          () => _unpublishCourse(course['id']),
        );
        break;
      case 'delete':
        _showConfirmDialog(
          'Delete course',
          'Are you sure you want to delete "${course['title']}"? This action is irreversible.',
          () => _deleteCourse(course['id']),
        );
        break;
      case 'view':
        // TODO: Naviguer vers la page de détail du cours
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Navigation to ${course['title']}'),
            backgroundColor: Colors.blue,
          ),
        );
        break;
    }
  }

  void _showConfirmDialog(String title, String message, VoidCallback onConfirm) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                onConfirm();
              },
              child: const Text('Confirm'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _publishCourse(String courseId) async {
    try {
      final headers = await AuthService.getAuthHeaders();
      final res = await http.put(
        Uri.parse('${ApiConfig.coursesUrl}/$courseId'),
        headers: headers,
        body: jsonEncode({'status': 'published'}),
      );
      if (res.statusCode == 200) {
        _showSnackBar('Course published successfully', Colors.green);
        _loadCourses();
      }
    } catch (e) {
      _showSnackBar('Error publishing course', Colors.red);
    }
  }

  Future<void> _unpublishCourse(String courseId) async {
    try {
      final headers = await AuthService.getAuthHeaders();
      final res = await http.put(
        Uri.parse('${ApiConfig.coursesUrl}/$courseId'),
        headers: headers,
        body: jsonEncode({'status': 'draft'}), // Or unpublished
      );
      if (res.statusCode == 200) {
        _showSnackBar('Course unpublished', Colors.orange);
        _loadCourses();
      }
    } catch (e) {
      _showSnackBar('Error unpublishing course', Colors.red);
    }
  }

  Future<void> _deleteCourse(String courseId) async {
    try {
      final headers = await AuthService.getAuthHeaders();
      final res = await http.delete(Uri.parse('${ApiConfig.coursesUrl}/$courseId'), headers: headers);
      if (res.statusCode == 200) {
        _showSnackBar('Course deleted', Colors.red);
        _loadCourses();
      }
    } catch (e) {
      _showSnackBar('Error deleting course', Colors.red);
    }
  }

  void _showSnackBar(String m, Color c) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(m), backgroundColor: c, behavior: SnackBarBehavior.floating));
  }
}
