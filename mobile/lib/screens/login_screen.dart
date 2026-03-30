import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/api_config.dart';
import 'package:lucide_icons/lucide_icons.dart';


class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (mounted) setState(() => _isLoading = true);
    
    debugPrint('🔔 [LOGIN] Tentative avec: $email');
    debugPrint('🔔 [LOGIN] URL: ${ApiConfig.loginUrl}');
    
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.loginUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      ).timeout(const Duration(seconds: 15));

      debugPrint('🔔 [LOGIN] Status Code: ${response.statusCode}');

      if (response.statusCode == 200) {
        final dynamic data = jsonDecode(response.body);
        if (data is Map && data['token'] != null) {
          final prefs = await SharedPreferences.getInstance();
          final token = data['token'].toString();
          await prefs.setString('token', token);

          // Store role and name for easy access
          final user = data['user'];
          if (user is Map) {
            String role = (user['role'] ?? 'student').toString().toLowerCase();
            await prefs.setString('role', role);
            await prefs.setString('userName', (user['name'] ?? '').toString());
            await prefs.setString('userId', (user['id'] ?? '').toString());
            await prefs.setString('user_data', jsonEncode(user));
            debugPrint('✅ [LOGIN] Success! Role: $role');
          }

          if (mounted) {
            final role = prefs.getString('role') ?? 'student';
            // Important: redirection vers la bonne page
            if (role == 'admin') {
              Navigator.pushReplacementNamed(context, '/main');
            } else if (role == 'instructor') {
              Navigator.pushReplacementNamed(context, '/main');
            } else {
              // Student → MainNavigation avec bottom nav bar
              Navigator.pushReplacementNamed(context, '/main');
            }
          }
        } else {
          _showError('Réponse invalide du serveur.');
        }
      } else {
        String errMsg = 'Identifiants invalides ou erreur serveur.';
        try {
          final data = jsonDecode(response.body);
          errMsg = data['message'] ?? errMsg;
        } catch (_) {}
        _showError(errMsg);
      }
    } catch (e) {
      debugPrint('❌ [LOGIN] ERROR: $e');
      _showError('Problème de connexion au serveur (vérifie qu\'il est lancé).');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showError(String message) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: Colors.redAccent,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(
                      icon: const Icon(LucideLucideLucideIcons.arrowLeft_ios_new_rounded),
                      onPressed: () => Navigator.pop(context),
                    ),
                    TextButton(
                      onPressed: () => Navigator.pushNamed(context, '/register'),
                      child: const Text('Sign up', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                const Text(
                  'Welcome back 👋',
                  style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, letterSpacing: -1),
                ),
                const SizedBox(height: 8),
                Text(
                  'Log in to continue to your learning dashboard.',
                  style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                ),
                const SizedBox(height: 40),
                TextFormField(
                  controller: _emailController,
                  decoration: InputDecoration(
                    labelText: 'Email Address',
                    prefixIcon: const Icon(LucideLucideLucideIcons.mailOutlined),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) => value == null || value.isEmpty ? 'Please enter your email' : null,
                ),
                const SizedBox(height: 20),
                TextFormField(
                  controller: _passwordController,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    prefixIcon: const Icon(LucideLucideLucideLucideIcons.lockOutlineRounded),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  obscureText: true,
                  validator: (value) => value == null || value.isEmpty ? 'Please enter your password' : null,
                ),
                const SizedBox(height: 12),
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () {},
                    child: const Text('Forgot password?'),
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : () {
                      if (_formKey.currentState!.validate()) {
                        _login();
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF00C6FF),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: _isLoading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text('Login', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(height: 24),
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text("Don't have an account?"),
                      TextButton(
                        onPressed: () => Navigator.pushNamed(context, '/register'),
                        child: const Text('Sign up', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
