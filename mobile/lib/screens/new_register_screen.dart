import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/auth_service.dart';
import 'login_screen.dart';
import 'package:lucide_icons/lucide_icons.dart';


class NewRegisterScreen extends StatefulWidget {
  const NewRegisterScreen({super.key});

  @override
  State<NewRegisterScreen> createState() => _NewRegisterScreenState();
}

class _NewRegisterScreenState extends State<NewRegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _expertiseController = TextEditingController();
  final _motivationController = TextEditingController();
  
  String _selectedRole = 'student';
  String? _selectedExpertise;
  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  final List<String> _expertiseFields = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Digital Marketing',
    'Data Science',
    'Business & Management',
    'Health & Wellness',
    'Languages',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _expertiseController.dispose();
    _motivationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header avec image
            Stack(
              children: [
                Container(
                  height: 250, width: double.infinity,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color(0xFF00BCD4),
                        Color(0xFF1976D2),
                      ],
                    ),
                  ),
                ),
                Positioned(
                  top: 10, left: 10, child: IconButton(
                    icon: Icon(LucideLucideLucideIcons.arrowLeft, color: Theme.of(context).cardColor,),
                    onPressed: () => Navigator.pop(context),
                  ),
                ),
                Center(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 80),
                    child: Column(
                      children: [
                        Icon(LucideLucideLucideIcons.graduationCap, size: 20, color: Theme.of(context).cardColor,),
                        const SizedBox(height: 16),
                        Text(
                          'Create an Account',
                          style: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.bold,
                            color: Theme.of(context).cardColor,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Join our learning community',
                          style: TextStyle(
                            fontSize: 14, color: Colors.black.withValues(alpha: 0.9),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            // Formulaire d'inscription
            Padding(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Informations de base
                    const Text(
                      'Personal Information',
                      style: TextStyle(
                        fontSize: 14, fontWeight: FontWeight.bold,
                        
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Nom complet
                    TextFormField(
                      controller: _nameController,
                      decoration: InputDecoration(
                        labelText: 'Full Name',
                        hintText: 'Enter your full name',
                        prefixIcon: const Icon(LucideLucideLucideIcons.user),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Color(0xFF00BCD4)),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your name';
                        }
                        if (value.length < 3) {
                          return 'Name must be at least 3 characters';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // Email
                    TextFormField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        labelText: 'Email',
                        hintText: 'Enter your email',
                        prefixIcon: const Icon(LucideLucideLucideIcons.mail),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Color(0xFF00BCD4)),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your email';
                        }
                        if (!value.contains('@')) {
                          return 'Please enter a valid email';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // Mot de passe
                    TextFormField(
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        hintText: 'Enter your password',
                        prefixIcon: const Icon(LucideLucideLucideLucideIcons.lock),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword ? LucideLucideLucideIcons.eye : LucideLucideLucideIcons.eyeOff,
                          ),
                          onPressed: () {
                            setState(() {
                              _obscurePassword = !_obscurePassword;
                            });
                          },
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Color(0xFF00BCD4)),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter a password';
                        }
                        if (value.length < 8) {
                          return 'Password must be at least 8 characters';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // Confirmation mot de passe
                    TextFormField(
                      controller: _confirmPasswordController,
                      obscureText: _obscureConfirmPassword,
                      decoration: InputDecoration(
                        labelText: 'Confirm Password',
                        hintText: 'Confirm your password',
                        prefixIcon: const Icon(LucideLucideLucideLucideIcons.lock),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscureConfirmPassword ? LucideLucideLucideIcons.eye : LucideLucideLucideIcons.eyeOff,
                          ),
                          onPressed: () {
                            setState(() {
                              _obscureConfirmPassword = !_obscureConfirmPassword;
                            });
                          },
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Color(0xFF00C6FF)),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please confirm your password';
                        }
                        if (value != _passwordController.text) {
                          return 'Passwords do not match';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 32),

                    // Sélection du rôle
                    const Text(
                      'Choose your role',
                      style: TextStyle(
                        fontSize: 14, fontWeight: FontWeight.bold,
                        
                      ),
                    ),
                    const SizedBox(height: 16),

                    Row(
                      children: [
                        Expanded(
                          child: _buildRoleCard(
                            'Student',
                            'Access to all courses and quizzes',
                            LucideLucideLucideIcons.graduationCap,
                            'student',
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildRoleCard(
                            'Instructor',
                            'Create and share your courses',
                            LucideLucideLucideIcons.user,
                            'instructor',
                          ),
                        ),
                      ],
                    ),

                    // Champs supplémentaires pour instructeur
                    if (_selectedRole == 'instructor') ...[
                      const SizedBox(height: 24),
                      const Text(
                        'Instructor Information',
                        style: TextStyle(
                          fontSize: 14, fontWeight: FontWeight.bold,
                          
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Domaine d'expertise
                      DropdownButtonFormField<String>(
                        value: _selectedExpertise,
                        decoration: InputDecoration(
                          labelText: 'Field of expertise',
                          prefixIcon: const Icon(LucideLucideLucideIcons.briefcase),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Color(0xFF00BCD4)),
                          ),
                        ),
                        items: _expertiseFields.map((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          );
                        }).toList(),
                        onChanged: (newValue) {
                          setState(() {
                            _selectedExpertise = newValue;
                          });
                        },
                        validator: (value) {
                          if (_selectedRole == 'instructor' && (value == null || value.isEmpty)) {
                            return 'Please select your field of expertise';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Message de motivation
                      TextFormField(
                        controller: _motivationController,
                        maxLines: 4,
                        minLines: 3,
                        decoration: InputDecoration(
                          labelText: 'Motivation message',
                          hintText: 'Why do you want to become an instructor? (minimum 50 characters)',
                          prefixIcon: const Icon(LucideLucideIcons.message),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Color(0xFF00BCD4)),
                          ),
                          counterText: '${_motivationController.text.length} / 50 min',
                        ),
                        onChanged: (value) {
                          setState(() {}); // For update counterText
                        },
                        validator: (value) {
                          if (_selectedRole == 'instructor' && (value == null || value.isEmpty)) {
                            return 'Please enter a motivation message';
                          }
                          if (_selectedRole == 'instructor' && value!.length < 50) {
                            return 'Message must be at least 50 characters';
                          }
                          return null;
                        },
                      ),
                    ],

                    const SizedBox(height: 32),

                    // Bouton d'inscription
                    SizedBox(
                      width: double.infinity,
                      height: 50, child: ElevatedButton(
                        onPressed: _isLoading ? null : _register,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFF00BCD4),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 0,
                        ),
                        child: _isLoading
                            ? CircularProgressIndicator(color: Theme.of(context).cardColor,)
                            : Text(
                                'Créer mon compte',
                                style: TextStyle(
                                  fontSize: 14, fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Lien vers connexion
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'Already have an account?',
                          style: TextStyle(color: Colors.grey),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const LoginScreen(),
                              ),
                            );
                          },
                          child: const Text(
                            'Sign In',
                            style: TextStyle(
                              color: Color(0xFF00BCD4),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRoleCard(String title, String description, IconData icon, String role) {
    final isSelected = _selectedRole == role;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedRole = role;
        });
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? Color(0xFF00BCD4).withValues(alpha: 0.1) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? Color(0xFF00BCD4) : Colors.grey.shade600, width: isSelected ? 2 : 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10, offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(
              icon,
              size: 20, color: isSelected ? Color(0xFF00BCD4) : Colors.grey.shade600,
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: TextStyle(
                fontSize: 14, fontWeight: FontWeight.bold,
                color: isSelected ? Color(0xFF00BCD4) : Color(0xFF042444),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              description,
              style: TextStyle(
                fontSize: 14, color: Colors.grey.shade600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _isLoading = true);

    try {
      // Appeler AuthService pour s'inscrire
      final result = await AuthService.register(
        _nameController.text,
        _emailController.text,
        _passwordController.text,
        _selectedRole,
        instructorName: _selectedRole == 'instructor' ? _nameController.text : null,
        expertise: _selectedExpertise,
        motivation: _motivationController.text,
      );

      if (result['success'] == true) {
        // Afficher un message de succès
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              _selectedRole == 'instructor'
                  ? 'Registration successful! Your instructor request is pending approval.'
                  : 'Registration successful! You can now sign in.',
            ),
            backgroundColor: Colors.green,
          ),
        );

        // Rediriger vers la page de connexion
        await Future.delayed(const Duration(seconds: 2));
        if (mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => const LoginScreen(),
            ),
          );
        }
      } else {
        throw Exception(result['error'] ?? 'Registration failed');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error during registration: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }
}
