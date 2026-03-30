import 'package:flutter/material.dart';
import 'dart:ui';
import 'package:lucide_icons/lucide_icons.dart';


class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
    _fadeAnim = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF0F172A),
      body: FadeTransition(
        opacity: _fadeAnim,
        child: Stack(
          children: [
            // Star-like background particles
            _buildBackground(),

            SafeArea(
              child: Column(
                children: [
                  Expanded(
                    child: SingleChildScrollView(
                      physics: const BouncingScrollPhysics(),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildTopBar(context),
                          _buildHeroSection(context),
                          _buildStatsRow(),
                          _buildSectionHeader('🔥 Popular Categories', context),
                          _buildCategoriesRow(context),
                          _buildSectionHeader('✨ Why Choose Us', context),
                          _buildFeatureGrid(context),
                          _buildCTASection(context),
                          const SizedBox(height: 20),
                        ],
                      ),
                    ),
                  ),
                  _buildBottomNav(context),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBackground() {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF0F172A)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
    );
  }

  Widget _buildTopBar(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '👋 Welcome to',
                  style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 14),
                ),
                const Text(
                  'EduPortal',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.5,
                  ),
                ),
              ],
            ),
          ),
          _glassButton(
            icon: LucideLucideLucideIcons.userOutlineRounded,
            onTap: () => Navigator.pushNamed(context, '/login'),
          ),
          const SizedBox(width: 10),
          _glassButton(
            icon: LucideLucideLucideLucideIcons.searchRounded,
            onTap: () => Navigator.pushNamed(context, '/courses'),
          ),
        ],
      ),
    );
  }

  Widget _glassButton({required IconData icon, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.white12),
            ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
        ),
      ),
    );
  }

  Widget _buildHeroSection(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(28),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(28),
          gradient: const LinearGradient(
            colors: [Color(0xFF38BDF8), Color(0xFF6366F1)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: Color(0xFF38BDF8).withValues(alpha: 0.25),
              blurRadius: 30,
              offset: const Offset(0, 12),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text('🚀 World-class Education', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
            ),
            const SizedBox(height: 14),
            const Text(
              'Elevate Your\nLearning Experience',
              style: TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.w800,
                height: 1.2,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Access thousands of expert-led courses anytime, anywhere.',
              style: TextStyle(color: Colors.white.withValues(alpha: 0.85), fontSize: 14, height: 1.5),
            ),
            const SizedBox(height: 22),
            Row(
              children: [
                GestureDetector(
                  onTap: () => Navigator.pushNamed(context, '/courses'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(50),
                      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 8, offset: const Offset(0, 4))],
                    ),
                    child: Text('Browse Courses', style: TextStyle(color: Color(0xFF6366F1), fontWeight: FontWeight.bold, fontSize: 14)),
                  ),
                ),
                const SizedBox(width: 12),
                GestureDetector(
                  onTap: () => Navigator.pushNamed(context, '/register'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(50),
                      border: Border.all(color: Colors.white38),
                    ),
                    child: const Text('Sign Up Free', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 14)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsRow() {
    final stats = [
      {'value': '10K+', 'label': 'Students'},
      {'value': '500+', 'label': 'Courses'},
      {'value': '95%', 'label': 'Satisfaction'},
      {'value': '50+', 'label': 'Experts'},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: stats.map((s) {
          return _StatPill(value: s['value']!, label: s['label']!);
        }).toList(),
      ),
    );
  }

  Widget _buildSectionHeader(String title, BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
      child: Text(title, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildCategoriesRow(BuildContext context) {
    final cats = [
      {'label': 'Development', 'icon': '💻', 'color': Color(0xFF38BDF8)},
      {'label': 'Design', 'icon': '🎨', 'color': Color(0xFF818CF8)},
      {'label': 'Business', 'icon': '📈', 'color': Color(0xFF34D399)},
      {'label': 'Marketing', 'icon': '📣', 'color': Color(0xFFF472B6)},
      {'label': 'Science', 'icon': '🔬', 'color': Color(0xFFFBBF24)},
    ];

    return Padding(
      padding: const EdgeInsets.only(top: 16, left: 12),
      child: SizedBox(
        height: 100,
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          itemCount: cats.length,
          padding: const EdgeInsets.symmetric(horizontal: 8),
          separatorBuilder: (_, __) => const SizedBox(width: 12),
          itemBuilder: (context, i) {
            final cat = cats[i];
            return GestureDetector(
              onTap: () => Navigator.pushNamed(context, '/courses'),
              child: Container(
                width: 90,
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: (cat['color'] as Color).withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: (cat['color'] as Color).withValues(alpha: 0.3)),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(cat['icon'] as String, style: const TextStyle(fontSize: 26)),
                    const SizedBox(height: 6),
                    Text(cat['label'] as String, style: TextStyle(color: cat['color'] as Color, fontSize: 11, fontWeight: FontWeight.w600), textAlign: TextAlign.center),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildFeatureGrid(BuildContext context) {
    final features = [
      {'icon': LucideLucideLucideLucideIcons.menuBookRounded, 'title': 'Expert Courses', 'sub': 'Learn from the best', 'color': Color(0xFF38BDF8), 'route': '/expert-courses'},
      {'icon': LucideLucideLucideIcons.briefcasespacePremiumRounded, 'title': 'Certificates', 'sub': 'Boost your career', 'color': Color(0xFFF472B6), 'route': '/certified-degree'},
      {'icon': LucideLucideLucideIcons.usersRounded, 'title': 'Community', 'sub': 'Learn together', 'color': Color(0xFF34D399), 'route': '/community-support'},
      {'icon': LucideLucideLucideLucideIcons.starRounded, 'title': 'Top Quality', 'sub': 'Vetted content', 'color': Color(0xFFFBBF24), 'route': '/quality-education'},
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
      child: GridView.count(
        crossAxisCount: 2,
        childAspectRatio: 1.4,
        crossAxisSpacing: 14,
        mainAxisSpacing: 14,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        children: features.map((f) {
          return GestureDetector(
            onTap: () => Navigator.pushNamed(context, f['route'] as String),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: (f['color'] as Color).withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: (f['color'] as Color).withValues(alpha: 0.25)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: (f['color'] as Color).withValues(alpha: 0.15), borderRadius: BorderRadius.circular(12)),
                    child: Icon(f['icon'] as IconData, color: f['color'] as Color, size: 20),
                  ),
                  const Spacer(),
                  Text(f['title'] as String, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                  Text(f['sub'] as String, style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 11)),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildCTASection(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white10),
        ),
        child: Column(
          children: [
            const Text('🎓 Ready to Start Learning?', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
            const SizedBox(height: 8),
            Text('Join thousands of students on EduPortal today.', style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 13), textAlign: TextAlign.center),
            const SizedBox(height: 18),
            Row(
              children: [
                Expanded(
                  child: _PillButton(label: 'Login', outlined: true, onTap: () => Navigator.pushNamed(context, '/login')),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _PillButton(label: 'Create Account', outlined: false, onTap: () => Navigator.pushNamed(context, '/register')),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNav(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
      decoration: BoxDecoration(
        color: Color(0xFF1E293B),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.3), blurRadius: 20, offset: const Offset(0, -4))],
        border: const Border(top: BorderSide(color: Colors.white10)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _NavItem2(icon: LucideLucideLucideLucideIcons.homeFilled, label: 'Home', isActive: true, onTap: () {}),
          _NavItem2(icon: LucideLucideLucideLucideIcons.menuBookRounded, label: 'Courses', onTap: () => Navigator.pushNamed(context, '/courses')),
          _NavItem2(icon: LucideLucideLucideIcons.layoutDashboard_rounded, label: 'Dashboard', onTap: () => Navigator.pushNamed(context, '/dashboard')),
          _NavItem2(icon: LucideLucideLucideIcons.userOutlineRounded, label: 'Profile', onTap: () => Navigator.pushNamed(context, '/login')),
        ],
      ),
    );
  }
}

class _StatPill extends StatelessWidget {
  final String value;
  final String label;

  const _StatPill({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.07),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        children: [
          Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 18)),
          Text(label, style: TextStyle(color: Colors.white.withValues(alpha: 0.55), fontSize: 10)),
        ],
      ),
    );
  }
}

class _PillButton extends StatelessWidget {
  final String label;
  final bool outlined;
  final VoidCallback onTap;

  const _PillButton({required this.label, required this.outlined, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 13),
        decoration: BoxDecoration(
          color: outlined ? Colors.transparent : Color(0xFF38BDF8),
          borderRadius: BorderRadius.circular(50),
          border: Border.all(color: outlined ? Colors.white24 : Colors.transparent),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              color: outlined ? Colors.white70 : Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem2 extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _NavItem2({required this.icon, required this.label, this.isActive = false, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final color = isActive ? Color(0xFF38BDF8) : Colors.white38;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isActive ? Color(0xFF38BDF8).withValues(alpha: 0.12) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 3),
            Text(label, style: TextStyle(fontSize: 10, color: color, fontWeight: isActive ? FontWeight.bold : FontWeight.w500)),
          ],
        ),
      ),
    );
  }
}
