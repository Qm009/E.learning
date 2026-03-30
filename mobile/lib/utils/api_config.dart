import 'package:flutter/foundation.dart' show kIsWeb;

// ⚠️ DÉPLOIEMENT: Remplacez cette URL par l'URL de votre backend Railway
// Exemple: 'https://elearning-backend-production.up.railway.app'
const String _productionBackendUrl = 'RAILWAY_URL_ICI';

class ApiConfig {
  static String get baseUrl {
    // Si une URL de production est définie, l'utiliser en priorité
    if (_productionBackendUrl != 'RAILWAY_URL_ICI') {
      return _productionBackendUrl;
    }
    if (kIsWeb) {
      return 'http://localhost:5050';
    } else {
      // For Android Emulator (10.0.2.2 points to host machine)
      return 'http://10.0.2.2:5050';
    }
  }

  static String get loginUrl => '$baseUrl/api/auth/login';
  static String get registerUrl => '$baseUrl/api/auth/register';
  static String get usersUrl => '$baseUrl/api/users';
  static String get coursesUrl => '$baseUrl/api/courses';
  
  // Missing endpoints identified by analyzer
  static String courseUrl(String id) => '$baseUrl/api/courses/$id';
  static String get pendingInstructorsUrl => '$baseUrl/api/users/instructors/pending';
  static String approveInstructorUrl(String id) => '$baseUrl/api/users/instructors/$id/approve';
  static String rejectInstructorUrl(String id) => '$baseUrl/api/users/instructors/$id/reject';
}
