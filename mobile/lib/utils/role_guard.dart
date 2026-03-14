import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Guards a route by role. If the stored role is not in [allowedRoles],
/// redirects to [redirectRoute].
class RoleGuard extends StatelessWidget {
  final Widget child;
  final List<String> allowedRoles;
  final String redirectRoute;

  const RoleGuard({
    super.key,
    required this.child,
    required this.allowedRoles,
    this.redirectRoute = '/',
  });

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: _getRole(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final role = snapshot.data ?? 'student';

        if (!allowedRoles.contains(role)) {
          // Use addPostFrameCallback to avoid calling Navigator during build
          WidgetsBinding.instance.addPostFrameCallback((_) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Access denied. You do not have permission to view this page.')),
            );
            Navigator.pushReplacementNamed(context, redirectRoute);
          });
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        return child;
      },
    );
  }

  Future<String> _getRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('role') ?? 'student';
  }
}
