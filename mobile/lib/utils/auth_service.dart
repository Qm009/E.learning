import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'api_config.dart';

class AuthService {
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';

  // Save token to SharedPreferences
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  // Get token from SharedPreferences
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  // Save user data to SharedPreferences
  static Future<void> saveUserData(Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, jsonEncode(userData));
  }

  // Get user data from SharedPreferences
  static Future<Map<String, dynamic>?> getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final userDataString = prefs.getString(_userKey);
    if (userDataString != null) {
      return jsonDecode(userDataString);
    }
    return null;
  }

  // Get user name
  static Future<String?> getUserName() async {
    final userData = await getUserData();
    if (userData != null && userData['name'] != null) return userData['name'];
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('userName');
  }

  // Get user email
  static Future<String?> getUserEmail() async {
    final userData = await getUserData();
    if (userData != null && userData['email'] != null) return userData['email'];
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('email');
  }

  // Get user role
  static Future<String?> getUserRole() async {
    final userData = await getUserData();
    if (userData != null && userData['role'] != null) return userData['role'];
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('role');
  }

  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }

  // Check user roles
  static Future<bool> isAdmin() async {
    final role = await getUserRole();
    return role == 'admin';
  }

  static Future<bool> isInstructor() async {
    final role = await getUserRole();
    return role == 'instructor';
  }

  static Future<bool> isStudent() async {
    final role = await getUserRole();
    return role == 'student';
  }

  static Future<bool> isInstructorOrAdmin() async {
    final role = await getUserRole();
    return role == 'instructor' || role == 'admin';
  }

  // Login with proper role handling
  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.loginUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        await saveToken(data['token']);
        await saveUserData(data['user']);
        return {
          'success': true,
          'user': data['user'],
          'token': data['token'],
        };
      } else {
        final data = jsonDecode(response.body);
        return {
          'success': false,
          'error': data['message'] ?? 'Erreur de connexion',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'error': 'Erreur de connexion: $e',
      };
    }
  }

  // Register with instructor request handling
  static Future<Map<String, dynamic>> register(
    String name,
    String email,
    String password,
    String requestedRole, {
    String? instructorName,
    String? expertise,
    String? motivation,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.registerUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
          'requestedRole': requestedRole,
          'instructorName': instructorName,
          'expertise': expertise,
          'motivation': motivation,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        // We don't auto-login if it's a pending instructor, or maybe we do? 
        // Backend returns token. Let's save it.
        await saveToken(data['token']);
        await saveUserData(data['user']);
        
        return {
          'success': true,
          'user': data['user'],
          'token': data['token'],
          'message': requestedRole == 'instructor' 
              ? 'Inscription réussie ! Votre demande d\'instructeur est en attente d\'approbation.'
              : 'Inscription réussie ! Vous pouvez maintenant vous connecter.',
        };
      } else {
        final data = jsonDecode(response.body);
        return {
          'success': false,
          'error': data['message'] ?? 'Erreur lors de l\'inscription',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'error': 'Erreur de connexion: $e',
      };
    }
  }

  // Get authenticated headers for API calls
  static Future<Map<String, String>> getAuthHeaders() async {
    final token = await getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // Get instructor's courses
  static Future<List<dynamic>> getInstructorCourses() async {
    try {
      final headers = await getAuthHeaders();
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/courses/instructor'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Update user profile
  static Future<Map<String, dynamic>> updateProfile(String name, String email) async {
    try {
      final userData = await getUserData();
      if (userData == null || userData['id'] == null) {
        return {'success': false, 'error': 'User not found in local storage'};
      }
      final userId = userData['id'];
      
      final headers = await getAuthHeaders();
      final response = await http.put(
        Uri.parse('${ApiConfig.usersUrl}/$userId'),
        headers: headers,
        body: jsonEncode({
          'name': name,
          'email': email,
        }),
      );

      if (response.statusCode == 200) {
        final updatedData = jsonDecode(response.body);
        // Mettre à jour les données locales
        userData['name'] = name;
        userData['email'] = email;
        await saveUserData(userData);
        
        return {
          'success': true,
          'user': updatedData,
        };
      } else {
        final data = jsonDecode(response.body);
        return {
          'success': false,
          'error': data['message'] ?? 'Failed to update profile',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'error': 'Connection error: $e',
      };
    }
  }
}
