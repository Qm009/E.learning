import 'package:flutter/material.dart';
import '../utils/auth_service.dart';
import 'package:lucide_icons/lucide_icons.dart';


class NewInstructorProfileScreen extends StatefulWidget {
  const NewInstructorProfileScreen({super.key});

  @override
  State<NewInstructorProfileScreen> createState() => _NewInstructorProfileScreenState();
}

class _NewInstructorProfileScreenState extends State<NewInstructorProfileScreen> {
  String _userName = 'Professeur';
  String _userEmail = 'prof@email.com';
  final String _bio = 'Passionné par l\'éducation et la technologie, j\'aide mes étudiants à atteindre leurs objectifs professionnels.';
  Map<String, dynamic> _stats = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final userName = await AuthService.getUserName();
    final userEmail = await AuthService.getUserEmail();
    
    setState(() {
      _userName = userName ?? 'Professor';
      _userEmail = userEmail ?? 'prof@email.com';
    });

    // Simuler le chargement des statistiques
    await Future.delayed(const Duration(seconds: 1));
    
    setState(() {
      _stats = {
        'totalStudents': 1247,
        'totalCourses': 8,
        'averageRating': 4.7,
        'totalRevenue': 45678.90,
        'yearsOfExperience': 5,
        'certificatesIssued': 892,
      };
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      
      appBar: AppBar(
        
        elevation: 0,
        title: const Text(
          'Instructor Profile',
          style: TextStyle(
            fontSize: 14, fontWeight: FontWeight.bold,
            
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.edit),
            onPressed: () {
              // TODO: Naviguer vers l'édition du profil
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Photo et informations de base
                  _buildProfileHeader(),
                  
                  const SizedBox(height: 24),
                  
                  // Statistiques globales
                  _buildSectionTitle('Global Statistics'),
                  const SizedBox(height: 12),
                  _buildStatsGrid(),
                  
                  const SizedBox(height: 24),
                  
                  // Menu des actions
                  _buildSectionTitle('Actions'),
                  const SizedBox(height: 12),
                  _buildActionMenu(),
                  
                  const SizedBox(height: 100), // Espace pour la bottom nav
                ],
              ),
            ),
    );
  }

  Widget _buildProfileHeader() {
    return Container(
      padding: const EdgeInsets.all(20),
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
      child: Row(
        children: [
          // Photo de profil
          GestureDetector(
            onTap: () {
              // TODO: Changer la photo de profil
            },
            child: Stack(
              children: [
                CircleAvatar(
                  radius: 12, backgroundColor: Color(0xFF00C6FF),
                  child: Text(
                    _userName.isNotEmpty ? _userName[0].toUpperCase() : 'P',
                    style: TextStyle(
                      color: Theme.of(context).cardColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 24,
                    ),
                  ),
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Color(0xFF00C6FF),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      LucideIcons.camera,
                      color: Theme.of(context).cardColor,
                      size: 16,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          // Informations
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      _userName,
                      style: const TextStyle(
                        fontSize: 14, fontWeight: FontWeight.bold,
                        
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.green.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        'Instructor',
                        style: TextStyle(
                          fontSize: 14, color: Colors.green,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  _userEmail,
                  style: TextStyle(
                    fontSize: 14, color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  _bio,
                  style: TextStyle(
                    fontSize: 14, color: Colors.grey[700],
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 14, fontWeight: FontWeight.bold,
        
      ),
    );
  }

  Widget _buildStatsGrid() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 16, crossAxisSpacing: 16, childAspectRatio: 1.5,
      children: [
        _buildStatCard('Total Students', '${_stats['totalStudents']}', LucideIcons.users, Colors.blue),
        _buildStatCard('Courses Created', '${_stats['totalCourses']}', LucideIcons.book, Colors.green),
        _buildStatCard('Average Rating', '${_stats['averageRating']}', LucideIcons.star, Colors.amber),
        _buildStatCard('Total Revenue', '\$${_stats['totalRevenue']}', LucideIcons.dollarSign, Colors.purple),
        _buildStatCard('Years of Experience', '${_stats['yearsOfExperience']}', LucideIcons.briefcase, Colors.orange),
        _buildStatCard('Certificates Issued', '${_stats['certificatesIssued']}', LucideIcons.graduationCap, Colors.red),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, color: color, size: 20),
                ),
                const Spacer(),
                Icon(LucideIcons.moreVertical, color: Colors.grey[400]),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              value,
              style: const TextStyle(
                fontSize: 14, fontWeight: FontWeight.bold,
                
              ),
            ),
            Text(
              title,
              style: TextStyle(
                fontSize: 14, color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionMenu() {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          _buildActionItem(
            LucideIcons.user,
                        'Edit my profile',
            () {
              // TODO: Naviguer vers l'édition du profil
            },
          ),
          _buildDivider(),
          _buildActionItem(
            LucideIcons.lock,
            'Change my password',
            () {
              // TODO: Naviguer vers le changement de mot de passe
            },
          ),
          _buildDivider(),
          _buildActionItem(
            LucideIcons.dollarSign,
            'My earnings and payments',
            () {
              // TODO: Naviguer vers les revenus
            },
          ),
          _buildDivider(),
          _buildActionItem(
            LucideIcons.bell,
            'Notifications',
            () {
              // TODO: Naviguer vers les notifications
            },
          ),
          _buildDivider(),
          _buildActionItem(
            LucideIcons.moon,
            'Dark Mode',
            () {
              // TODO: Activer/désactiver le mode sombre
            },
          ),
          _buildDivider(),
          _buildActionItem(
            LucideIcons.logOut,
            'Sign Out',
            () async {
              await AuthService.logout();
              Navigator.pushReplacementNamed(context, '/login');
            },
            color: Colors.red,
          ),
        ],
      ),
    );
  }

  Widget _buildActionItem(IconData icon, String title, VoidCallback onTap, {Color? color}) {
    return ListTile(
      leading: Icon(icon, color: color ?? Color(0xFF042444)),
      title: Text(
        title,
        style: TextStyle(
          color: color ?? Color(0xFF042444),
        ),
      ),
      onTap: onTap,
    );
  }

  Widget _buildDivider() {
    return Divider(
      height: 1,
      color: Colors.grey[200],
    );
  }
}
