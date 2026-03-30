import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/api_config.dart';
import 'package:lucide_icons/lucide_icons.dart';


class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  String _name = '';
  String _email = '';
  String _password = '';
  String _role = 'student';
  bool _isLoading = false;

   Future<void> _register() async {
    if (mounted) setState(() => _isLoading = true);
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.registerUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': _name,
          'email': _email,
          'password': _password,
          'requestedRole': _role,
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final dynamic data = jsonDecode(response.body);
        if (data is Map && data['token'] != null) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('token', data['token'].toString());
          
          if (mounted) {
            if (_role == 'instructor') {
              _showSuccessDialog('Your request to become an instructor has been sent. Please wait for admin approval.');
            } else {
              Navigator.pushReplacementNamed(context, '/dashboard');
            }
          }
        } else {
          _showError('Invalid response from server');
        }
      } else {
        String errMsg = 'Registration failed';
        try {
          final data = jsonDecode(response.body);
          errMsg = data['message'] ?? errMsg;
        } catch (_) {}
        _showError(errMsg);
      }
    } catch (e) {
      _showError('Connection error: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showError(String message) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                      icon: const Icon(LucideIcons.arrowLeft_ios_new_rounded),
                      onPressed: () => Navigator.pop(context),
                    ),
                    TextButton(
                      onPressed: () => Navigator.pushNamed(context, '/login'),
                      child: const Text('Log in'),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                const Text(
                  'Create your account',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Join EduPortal and start learning with top instructors.',
                  style: TextStyle(
                    fontSize: 14,
                    color: Color(0xFF6B7A90),
                  ),
                ),
                const SizedBox(height: 32),
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Full name',
                    prefixIcon: const Icon(LucideIcons.userOutlineRounded),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  validator: (value) =>
                      value == null || value.isEmpty ? 'Enter name' : null,
                  onChanged: (value) => _name = value,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Email',
                    prefixIcon: const Icon(LucideIcons.mailOutlined),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) =>
                      value == null || value.isEmpty ? 'Enter email' : null,
                  onChanged: (value) => _email = value,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Password',
                    prefixIcon: const Icon(LucideIcons.lockOutlineRounded),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  obscureText: true,
                  validator: (value) =>
                      value == null || value.isEmpty ? 'Enter password' : null,
                  onChanged: (value) => _password = value,
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _role,
                  items: const [
                    DropdownMenuItem(value: 'student', child: Text('Student')),
                    DropdownMenuItem(
                      value: 'instructor',
                      child: Text('Request to become Instructor'),
                    ),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setRole(value);
                    }
                  },
                  decoration: InputDecoration(
                    labelText: 'Role',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _isLoading
                        ? null
                        : () {
                            if (_formKey.currentState!.validate()) {
                              _register();
                            }
                          },
                    child: _isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Text('Create account'),
                  ),
                ),
                const SizedBox(height: 16),
                Center(
                  child: TextButton(
                    onPressed: () => Navigator.pushNamed(context, '/login'),
                    child: const Text('Already have an account? Log in'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void setRole(String value) {
    setState(() {
      _role = value;
    });
  }

  void _showSuccessDialog(String message) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('Registration Successful'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              Navigator.pushReplacementNamed(context, '/login');
            },
            child: const Text('Go to Login'),
          ),
        ],
      ),
    );
  }
}
