import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'dart:ui';
import '../utils/api_config.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> with TickerProviderStateMixin {
  String _role = '';
  int _stat1 = 0;
  int _stat2 = 0;
  int _stat3 = 0;
  List<dynamic> _users = [];
  List<dynamic> _pendingInstructors = [];
  String _roleFilter = 'All';
  bool _isLoading = false;
  int _selectedTabIndex = 0;
  Map<dynamic, dynamic>? _user;
  int _stat4 = 0; // pending count

  late AnimationController _fadeController;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _loadDashboardData();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  Future<void> _loadDashboardData() async {
    if (mounted) setState(() => _isLoading = true);
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token != null) {
      try {
        final decodedToken = JwtDecoder.decode(token);
        if (mounted) {
          setState(() {
            _role = decodedToken['role'] ?? 'Student';
            _user = decodedToken;
          });
        }

        final response = await http.get(
          Uri.parse(ApiConfig.usersUrl),
          headers: {'Authorization': 'Bearer $token'},
        ).timeout(const Duration(seconds: 5));

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          if (mounted) {
            setState(() {
              if (_role.toLowerCase() == 'admin') {
                _users = data is List ? data : [];
                _stat1 = _users.length;
                _stat2 = _users.where((u) => u['role'] == 'instructor').length;
                _stat3 = 15;
              }
            });
          }
        } else {
          _populateDemoDashboardData();
        }

        // Fetch pending instructor requests
        try {
          final pendingResponse = await http.get(
            Uri.parse('${ApiConfig.baseUrl}/api/users/pending-instructors'),
            headers: {'Authorization': 'Bearer $token'},
          ).timeout(const Duration(seconds: 5));
          if (pendingResponse.statusCode == 200) {
            final pending = jsonDecode(pendingResponse.body);
            if (mounted) setState(() {
              _pendingInstructors = pending is List ? pending : [];
              _stat4 = _pendingInstructors.length;
            });
          }
        } catch (_) {}
      } catch (e) {
        _populateDemoDashboardData();
      }
    } else {
      _populateDemoDashboardData();
    }
    if (mounted) {
      setState(() => _isLoading = false);
      _fadeController.forward();
    }
  }

  void _populateDemoDashboardData() {
    if (mounted) {
      setState(() {
        if (_role.isEmpty) _role = 'Admin';
        if (_user == null) {
          _user = {'name': 'Demo Admin', 'email': 'admin@eduportal.com'};
        }
        
        _stat1 = 1250;
        _stat2 = 45;
        _stat3 = 320;

        _users = [
          {'name': 'Alice Smith', 'email': 'alice@example.com', 'role': 'Student', 'status': 'Active'},
          {'name': 'Dr. Bob Johnson', 'email': 'bob@academy.edu', 'role': 'Instructor', 'status': 'Online'},
          {'name': 'Charlie Brown', 'email': 'charlie@hq.com', 'role': 'Admin', 'status': 'Active'},
          {'name': 'Diana Prince', 'email': 'diana@amazon.com', 'role': 'Student', 'status': 'Inactive'},
          {'name': 'Evan Wright', 'email': 'evan@university.org', 'role': 'Instructor', 'status': 'Away'},
        ];
      });
    }
  }

  List<dynamic> get _filteredUsers {
    if (_roleFilter == 'All') return _users;
    return _users.where((u) => u['role'].toString().toLowerCase() == _roleFilter.toLowerCase()).toList();
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    if (mounted) {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  Future<void> _approveInstructor(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token') ?? '';
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/users/approve-instructor/$userId'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Instructor approved ✅')));
        _loadDashboardData();
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Error approving request')));
    }
  }

  Future<void> _rejectInstructor(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token') ?? '';
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/users/reject-instructor/$userId'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Request rejected ❌')));
        _loadDashboardData();
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Error rejecting request')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Stack(
        children: [
          // Vibrant Background Gradient
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: 300,
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFF0F172A),
                    Color(0xFF1E293B),
                    Color(0xFF334155),
                  ],
                ),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(40),
                  bottomRight: Radius.circular(40),
                ),
              ),
            ),
          ),
          
          SafeArea(
            child: FadeTransition(
              opacity: _fadeController,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildHeader(),
                  Expanded(
                    child: RefreshIndicator(
                      onRefresh: _loadDashboardData,
                      child: ListView(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                        children: [
                          _buildStatsCarousel(),
                          const SizedBox(height: 30),
                          if (_pendingInstructors.isNotEmpty) ...
                          [
                            _buildSectionTitle('⏳ Pending Instructor Requests'),
                            const SizedBox(height: 15),
                            ..._pendingInstructors.map((u) => _buildPendingCard(u)).toList(),
                            const SizedBox(height: 30),
                          ],
                          _buildSectionTitle('Active Management'),
                          const SizedBox(height: 15),
                          _buildActionGrid(),
                          const SizedBox(height: 30),
                          _buildSectionTitle('All Users'),
                          const SizedBox(height: 15),
                          ..._filteredUsers.map((u) => _buildModernUserCard(u)).toList(),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(2),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white24, width: 2),
            ),
            child: CircleAvatar(
              radius: 28,
              backgroundColor: const Color(0xFF38BDF8).withOpacity(0.2),
              child: Text(
                _user?['name']?.toString().substring(0, 1).toUpperCase() ?? 'A',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 22),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Hello, ${_user?['name']?.split(' ')[0] ?? 'Admin'}!',
                  style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold, letterSpacing: -0.5),
                ),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.white10,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    _role.toUpperCase(),
                    style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 10, fontWeight: FontWeight.w600, letterSpacing: 1),
                  ),
                ),
              ],
            ),
          ),
          _buildGlassIconButton(Icons.notifications_none_rounded, () {}),
          const SizedBox(width: 12),
          _buildGlassIconButton(Icons.logout_rounded, _logout),
        ],
      ),
    );
  }

  Widget _buildGlassIconButton(IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            padding: const EdgeInsets.all(10),
            color: Colors.white.withOpacity(0.1),
            child: Icon(icon, color: Colors.white, size: 22),
          ),
        ),
      ),
    );
  }

  Widget _buildStatsCarousel() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      child: Row(
        children: [
          _buildGlassStatCard('Total Users', _stat1.toString(), '+12.5%', Icons.people_alt_rounded, [const Color(0xFF38BDF8), const Color(0xFF0EA5E9)]),
          _buildGlassStatCard('Instructors', _stat2.toString(), '+3.2%', Icons.school_rounded, [const Color(0xFF818CF8), const Color(0xFF6366F1)]),
          _buildGlassStatCard('Live Courses', _stat3.toString(), '+8.0%', Icons.auto_stories_rounded, [const Color(0xFFF472B6), const Color(0xFFEC4899)]),
          if (_stat4 > 0)
            _buildGlassStatCard('Pending', _stat4.toString(), 'Awaiting', Icons.pending_actions_rounded, [const Color(0xFFFFA500), const Color(0xFFFF6B00)]),
        ],
      ),
    );
  }

  Widget _buildGlassStatCard(String label, String value, String trend, IconData icon, List<Color> colors) {
    return Container(
      width: 160,
      margin: const EdgeInsets.only(right: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: colors[0].withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: colors[0].withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: colors[0], size: 20),
          ),
          const SizedBox(height: 20),
          Text(value, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: Color(0xFF1E293B))),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
          const SizedBox(height: 12),
          Row(
            children: [
              const Icon(Icons.trending_up_rounded, color: Color(0xFF10B981), size: 14),
              const SizedBox(width: 4),
              Text(trend, style: const TextStyle(color: Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
        TextButton(onPressed: () {}, child: const Text('See all', style: TextStyle(color: Color(0xFF38BDF8)))),
      ],
    );
  }

  Widget _buildActionGrid() {
    return Row(
      children: [
        Expanded(child: _buildActionCard('Add User', Icons.person_add_alt_1_rounded, const Color(0xFF38BDF8), () => Navigator.pushNamed(context, '/register'))),
        const SizedBox(width: 16),
        Expanded(child: _buildActionCard('New Course', Icons.add_circle_outline_rounded, const Color(0xFF818CF8), () {})),
      ],
    );
  }

  Widget _buildActionCard(String title, IconData icon, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.1)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 30),
            const SizedBox(height: 12),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF334155))),
          ],
        ),
      ),
    );
  }

  Widget _buildModernUserCard(dynamic user) {
    final bool isOnline = user['status'] == 'Online' || user['status'] == 'Active';
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(color: Color(0x06000000), blurRadius: 10, offset: Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          Stack(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: const Color(0xFFF1F5F9),
                child: Text(user['name']?.toString().substring(0, 1) ?? 'U', style: const TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
              ),
              Positioned(
                right: 0,
                bottom: 0,
                child: Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: isOnline ? const Color(0xFF10B981) : const Color(0xFFCBD5E1),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(user['name']?.toString() ?? 'Unnamed', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF1E293B))),
                const SizedBox(height: 2),
                Text(user['role']?.toString().toUpperCase() ?? 'STUDENT', style: TextStyle(color: const Color(0xFF38BDF8), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
              ],
            ),
          ),
          const Icon(Icons.more_vert_rounded, color: Color(0xFF94A3B8)),
        ],
      ),
    );
  }

  Widget _buildPendingCard(dynamic user) {
    final name = user['name']?.toString() ?? 'Unknown';
    final email = user['email']?.toString() ?? '';
    final id = user['_id']?.toString() ?? '';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFFFA500).withOpacity(0.3), width: 1.5),
        boxShadow: [
          BoxShadow(color: const Color(0xFFFFA500).withOpacity(0.07), blurRadius: 12, offset: const Offset(0, 6)),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: const Color(0xFFFFF3E0),
            child: Text(name.isNotEmpty ? name[0].toUpperCase() : 'I',
                style: const TextStyle(color: Color(0xFFFFA500), fontWeight: FontWeight.bold)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF1E293B))),
                Text(email, style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(color: const Color(0xFFFFF3E0), borderRadius: BorderRadius.circular(6)),
                  child: const Text('Wants to be Instructor', style: TextStyle(color: Color(0xFFFFA500), fontSize: 10, fontWeight: FontWeight.w600)),
                ),
              ],
            ),
          ),
          Column(
            children: [
              GestureDetector(
                onTap: () => _approveInstructor(id),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(20)),
                  child: const Text('Approve', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 6),
              GestureDetector(
                onTap: () => _rejectInstructor(id),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  decoration: BoxDecoration(color: const Color(0xFFEF4444), borderRadius: BorderRadius.circular(20)),
                  child: const Text('Reject', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
