import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/api_config.dart';
import '../utils/auth_service.dart';
import 'package:lucide_icons/lucide_icons.dart';


class InstructorRequestsScreen extends StatefulWidget {
  const InstructorRequestsScreen({super.key});

  @override
  _InstructorRequestsScreenState createState() => _InstructorRequestsScreenState();
}

class _InstructorRequestsScreenState extends State<InstructorRequestsScreen> {
  List<dynamic> _pendingRequests = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchPendingRequests();
  }

  Future<void> _fetchPendingRequests() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final headers = await AuthService.getAuthHeaders();
      final response = await http.get(
        Uri.parse(ApiConfig.pendingInstructorsUrl),
        headers: headers,
      );

      if (response.statusCode == 200) {
        setState(() {
          _pendingRequests = jsonDecode(response.body);
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = 'Erreur lors du chargement des demandes';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Erreur de connexion: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _approveInstructor(String userId) async {
    try {
      final headers = await AuthService.getAuthHeaders();
      final response = await http.post(
        Uri.parse(ApiConfig.approveInstructorUrl(userId)),
        headers: headers,
      );

      if (response.statusCode == 200) {
        _showSuccessMessage('Instructeur approuvé avec succès');
        _fetchPendingRequests(); // Refresh
      } else {
        _showErrorMessage('Erreur lors de l\'approbation');
      }
    } catch (e) {
      _showErrorMessage('Erreur: $e');
    }
  }

  Future<void> _rejectInstructor(String userId) async {
    try {
      final headers = await AuthService.getAuthHeaders();
      final response = await http.post(
        Uri.parse(ApiConfig.rejectInstructorUrl(userId)),
        headers: headers,
      );

      if (response.statusCode == 200) {
        _showSuccessMessage('Demande rejetée avec succès');
        _fetchPendingRequests(); // Refresh
      } else {
        _showErrorMessage('Erreur lors du rejet');
      }
    } catch (e) {
      _showErrorMessage('Erreur: $e');
    }
  }

  void _showSuccessMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _showErrorMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Demandes d\'instructeurs'),
        
        foregroundColor: Color(0xFF1E293B),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideLucideLucideIcons.arrowLeft_ios_new_rounded, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(LucideLucideLucideIcons.alertCircle, size: 20, color: Colors.red),
                      const SizedBox(height: 16),
                      Text(_error!, textAlign: TextAlign.center),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _fetchPendingRequests,
                        child: const Text('Réessayer'),
                      ),
                    ],
                  ),
                )
              : _pendingRequests.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(LucideLucideLucideLucideLucideIcons.checkCircle, size: 20, color: Colors.green),
                          SizedBox(height: 16),
                          Text(
                            'Aucune demande en attente',
                            style: TextStyle(
                              fontSize: 14, fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Toutes les demandes ont été traitées',
                            style: TextStyle(color: Colors.grey),
                          ),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _fetchPendingRequests,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _pendingRequests.length,
                        itemBuilder: (context, index) {
                          final request = _pendingRequests[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 16),
                            elevation: 4,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      CircleAvatar(
                                        radius: 12, backgroundColor: Color(0xFF00BCD4),
                                        child: Text(
                                          request['name']?.toString().substring(0, 1).toUpperCase() ?? '?',
                                          style: TextStyle(
                                            color: Theme.of(context).cardColor,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 20,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              request['name'] ?? 'Nom inconnu',
                                              style: const TextStyle(
                                                fontSize: 14, fontWeight: FontWeight.bold,
                                                
                                              ),
                                            ),
                                            Text(
                                              request['email'] ?? 'Email inconnu',
                                              style: TextStyle(
                                                color: Colors.grey[600],
                                                fontSize: 14,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                    const SizedBox(height: 12),
                                    Container(
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: Color(0xFF00BCD4).withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          _buildDetailRow(LucideLucideLucideIcons.briefcase, 'Expertise', request['expertise'] ?? 'Non précisé'),
                                          const SizedBox(height: 8),
                                          _buildDetailRow(LucideLucideIcons.message, 'Motivation', request['motivation'] ?? 'Non précisé'),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      const Icon(LucideLucideIcons.calendarToday, size: 20, color: Colors.grey),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Demandé le: ${_formatDate(request['createdAt'])}',
                                        style: TextStyle(
                                          color: Colors.grey[600],
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: ElevatedButton.icon(
                                          onPressed: () => _approveInstructor(request['_id']),
                                          icon: const Icon(LucideLucideLucideLucideIcons.check, size: 18),
                                          label: const Text('Approuver'),
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Colors.green,
                                            foregroundColor: Colors.white,
                                            padding: const EdgeInsets.symmetric(vertical: 12),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: ElevatedButton.icon(
                                          onPressed: () => _rejectInstructor(request['_id']),
                                          icon: const Icon(LucideLucideLucideIcons.x, size: 18),
                                          label: const Text('Rejeter'),
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Colors.red,
                                            foregroundColor: Colors.white,
                                            padding: const EdgeInsets.symmetric(vertical: 12),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
    );
  }

  String _formatDate(String? dateString) {
    if (dateString == null) return 'Date inconnue';
    try {
      final date = DateTime.parse(dateString);
      return '${date.day}/${date.month}/${date.year}';
    } catch (e) {
      return dateString;
    }
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: Color(0xFF00BCD4)),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '$label:',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14, color: Color(0xFF00BCD4),
                ),
              ),
              Text(
                value,
                style: const TextStyle(fontSize: 14, ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
