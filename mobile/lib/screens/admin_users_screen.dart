import 'package:flutter/material.dart';
import '../utils/auth_service.dart';
import '../utils/api_config.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:lucide_icons/lucide_icons.dart';


class AdminUsersScreen extends StatefulWidget {
  const AdminUsersScreen({super.key});

  @override
  State<AdminUsersScreen> createState() => _AdminUsersScreenState();
}

class _AdminUsersScreenState extends State<AdminUsersScreen> {
  List<dynamic> _users = [];
  List<dynamic> _filteredUsers = [];
  String _searchQuery = '';
  String _selectedRole = 'All';
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUsers();
  }

  Future<void> _loadUsers() async {
    setState(() => _isLoading = true);
    
    try {
      final headers = await AuthService.getAuthHeaders();
      final response = await http.get(Uri.parse(ApiConfig.usersUrl), headers: headers);
      
      if (response.statusCode == 200) {
        final List<dynamic> users = jsonDecode(response.body);
        setState(() {
          _users = users.map((u) {
            final name = u['name'] ?? 'User';
            return {
              'id': u['_id'],
              'name': name,
              'email': u['email'] ?? '',
              'role': u['role'] ?? 'student',
              'status': u['status'] ?? 'active',
              'avatar': name.substring(0, name.contains(' ') ? 2 : 1).toUpperCase(),
              'registrationDate': 'Unknown', // Backend might not send this in the basic object
            };
          }).toList();
          _filteredUsers = _users;
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  void _filterUsers() {
    setState(() {
      _filteredUsers = _users.where((user) {
        final matchesSearch = user['name'].toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
                              user['email'].toString().toLowerCase().contains(_searchQuery.toLowerCase());
        
        // Mapping des rôles FR vers EN pour le filtrage
        String roleFilter = 'all';
        if (_selectedRole == 'Student') roleFilter = 'student';
        if (_selectedRole == 'Instructor') roleFilter = 'instructor';
        if (_selectedRole == 'Admin') roleFilter = 'admin';
        
        final matchesRole = _selectedRole == 'All' || user['role'] == roleFilter;
        return matchesSearch && matchesRole;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      
      appBar: AppBar(
        
        elevation: 0,
        title: const Text(
          'Manage Users',
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
                    _filterUsers();
                  },
                  decoration: InputDecoration(
                    hintText: 'Search a user...',
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
                // Filtres par rôle
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: ['All', 'Student', 'Instructor', 'Admin'].map((role) {
                      final isSelected = _selectedRole == role;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(role),
                          selected: isSelected,
                          onSelected: (selected) {
                            setState(() {
                              _selectedRole = role;
                            });
                            _filterUsers();
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
          
          // Liste des utilisateurs
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _filteredUsers.isEmpty
                    ? _buildEmptyState()
                    : RefreshIndicator(
                        onRefresh: _loadUsers,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: _filteredUsers.length,
                          itemBuilder: (context, index) {
                            final user = _filteredUsers[index];
                            return _buildUserCard(user);
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
            'No users found',
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

  Widget _buildUserCard(Map<String, dynamic> user) {
    Color roleColor;
    Color statusColor;
    String roleText;
    String statusText;

    switch (user['role']) {
      case 'student':
        roleColor = Colors.blue;
        roleText = 'Student';
        break;
      case 'instructor':
        roleColor = Colors.green;
        roleText = 'Instructor';
        break;
      case 'admin':
        roleColor = Colors.purple;
        roleText = 'Admin';
        break;
      default:
        roleColor = Colors.grey;
        roleText = user['role'];
    }

    switch (user['status']) {
      case 'active':
        statusColor = Colors.green;
        statusText = 'Active';
        break;
      case 'suspended':
        statusColor = Colors.red;
        statusText = 'Suspended';
        break;
      case 'pending':
        statusColor = Colors.orange;
        statusText = 'Pending';
        break;
      default:
        statusColor = Colors.grey;
        statusText = user['status'];
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
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                // Avatar
                CircleAvatar(
                  radius: 12, backgroundColor: roleColor.withValues(alpha: 0.1),
                  child: Text(
                    user['avatar'],
                    style: TextStyle(
                      color: roleColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                // Informations utilisateur
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user['name'],
                        style: const TextStyle(
                          fontSize: 14, fontWeight: FontWeight.bold,
                          
                        ),
                      ),
                      Text(
                        user['email'],
                        style: const TextStyle(
                          fontSize: 14, color: Color(0xFF64748B),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: roleColor.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              roleText,
                              style: TextStyle(
                                fontSize: 14, color: roleColor,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
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
                    ],
                  ),
                ),
                // Menu actions
                PopupMenuButton<String>(
                  icon: const Icon(LucideLucideLucideIcons.moreVertical),
                  onSelected: (value) => _handleUserAction(value, user),
                  itemBuilder: (BuildContext context) => [
                    const PopupMenuItem<String>(
                      value: 'change_role',
                      child: Row(
                        children: [
                          Icon(LucideLucideIcons.swapHoriz, size: 16),
                          SizedBox(width: 8),
                          Text('Change role'),
                        ],
                      ),
                    ),
                    if (user['status'] == 'active')
                      const PopupMenuItem<String>(
                        value: 'suspend',
                        child: Row(
                          children: [
                            Icon(LucideLucideIcons.block, size: 20, color: Colors.red),
                            SizedBox(width: 8),
                            Text('Suspend'),
                          ],
                        ),
                      ),
                    if (user['status'] == 'suspended')
                      const PopupMenuItem<String>(
                        value: 'reactivate',
                        child: Row(
                          children: [
                            Icon(LucideLucideLucideLucideLucideIcons.checkCircle, size: 20, color: Colors.green),
                            SizedBox(width: 8),
                            Text('Reactivate'),
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
                  ],
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Registered on ${user['registrationDate']}',
              style: TextStyle(
                fontSize: 14, color: Colors.grey[500],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _handleUserAction(String action, Map<String, dynamic> user) {
    switch (action) {
      case 'change_role':
        _showChangeRoleDialog(user);
        break;
      case 'suspend':
        _showConfirmDialog(
          'Suspend user',
          'Are you sure you want to suspend ${user['name']}?',
          () => _suspendUser(user['id']),
        );
        break;
      case 'reactivate':
        _showConfirmDialog(
          'Reactivate user',
          'Are you sure you want to reactivate ${user['name']}?',
          () => _reactivateUser(user['id']),
        );
        break;
      case 'delete':
        _showConfirmDialog(
          'Delete user',
          'Are you sure you want to delete ${user['name']}? This action is irreversible.',
          () => _deleteUser(user['id']),
        );
        break;
    }
  }

  void _showChangeRoleDialog(Map<String, dynamic> user) {
    String selectedRole = user['role'];
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Change the role of ${user['name']}'),
          content: StatefulBuilder(
            builder: (BuildContext context, StateSetter setState) {
              return Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('Select the new role:'),
                  const SizedBox(height: 16),
                  RadioListTile<String>(
                    title: const Text('Student'),
                    value: 'student',
                    groupValue: selectedRole,
                    onChanged: (value) {
                      setState(() => selectedRole = value!);
                    },
                  ),
                  RadioListTile<String>(
                    title: const Text('Instructor'),
                    value: 'instructor',
                    groupValue: selectedRole,
                    onChanged: (value) {
                      setState(() => selectedRole = value!);
                    },
                  ),
                  RadioListTile<String>(
                    title: const Text('Admin'),
                    value: 'admin',
                    groupValue: selectedRole,
                    onChanged: (value) {
                      setState(() => selectedRole = value!);
                    },
                  ),
                ],
              );
            },
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                _changeUserRole(user['id'], selectedRole);
              },
              child: const Text('Confirm'),
            ),
          ],
        );
      },
    );
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
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
              child: const Text('Confirm'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _changeUserRole(String userId, String newRole) async {
    try {
      final headers = await AuthService.getAuthHeaders();
      final res = await http.put(
        Uri.parse('${ApiConfig.usersUrl}/$userId'),
        headers: headers,
        body: jsonEncode({'role': newRole}),
      );
      if (res.statusCode == 200) {
        _showSnackBar('Role updated successfully', Colors.green);
        _loadUsers();
      }
    } catch (e) {
      _showSnackBar('Error while updating role', Colors.red);
    }
  }

  Future<void> _suspendUser(String userId) async {
    // Current backend doesn't have explicit suspend, but we can set a status field
    try {
      final headers = await AuthService.getAuthHeaders();
      final res = await http.put(
        Uri.parse('${ApiConfig.usersUrl}/$userId'),
        headers: headers,
        body: jsonEncode({'status': 'suspended'}),
      );
      if (res.statusCode == 200) {
        _showSnackBar('User suspended', Colors.orange);
        _loadUsers();
      }
    } catch (e) {
      _showSnackBar('Error while suspending user', Colors.red);
    }
  }

  Future<void> _reactivateUser(String userId) async {
    try {
      final headers = await AuthService.getAuthHeaders();
      final res = await http.put(
        Uri.parse('${ApiConfig.usersUrl}/$userId'),
        headers: headers,
        body: jsonEncode({'status': 'active'}),
      );
      if (res.statusCode == 200) {
        _showSnackBar('User reactivated', Colors.green);
        _loadUsers();
      }
    } catch (e) {
      _showSnackBar('Error while reactivating user', Colors.red);
    }
  }

  Future<void> _deleteUser(String userId) async {
    try {
      final headers = await AuthService.getAuthHeaders();
      final res = await http.delete(Uri.parse('${ApiConfig.usersUrl}/$userId'), headers: headers);
      
      print('Delete response status: ${res.statusCode}');
      print('Delete response body: ${res.body}');
      
      if (res.statusCode == 200 || res.statusCode == 204) {
        _showSnackBar('User deleted successfully', Colors.green);
        _loadUsers();
      } else {
        _showSnackBar('Failed to delete user: ${res.statusCode}', Colors.red);
      }
    } catch (e) {
      print('Delete error: $e');
      _showSnackBar('Error while deleting user: $e', Colors.red);
    }
  }

  void _showSnackBar(String m, Color c) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(m), backgroundColor: c, behavior: SnackBarBehavior.floating));
  }
}
