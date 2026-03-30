import 'package:flutter/material.dart';
import 'dart:ui';
import 'package:lucide_icons/lucide_icons.dart';


class ExpertPathScreen extends StatelessWidget {
  const ExpertPathScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
       // Clean, light background
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          _buildSliverAppBar(context),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 32),
                  _buildSectionHeader('🚀 Career Mastery Tracks'),
                  const SizedBox(height: 16),
                  _buildTracksCarousel(context),
                  const SizedBox(height: 40),
                  _buildSectionHeader('🗺️ Your Path to Expert'),
                  const SizedBox(height: 16),
                  _buildRoadmap(context),
                  const SizedBox(height: 40),
                  _buildSectionHeader('🎓 Top Tier Mentors'),
                  const SizedBox(height: 16),
                  _buildMentorsList(context),
                  const SizedBox(height: 40),
                  _buildCTA(context),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSliverAppBar(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 300, pinned: true,
      stretch: true,
      
      elevation: 0,
      leading: IconButton(
        icon: const Icon(LucideLucideLucideIcons.arrowLeft_ios_new_rounded,  size: 20),
        onPressed: () => Navigator.pop(context),
      ),
      flexibleSpace: FlexibleSpaceBar(
        stretchModes: const [StretchMode.zoomBackground, StretchMode.blurBackground],
        background: Stack(
          fit: StackFit.expand,
          children: [
            Image.network(
              'https://images.unsplash.com/photo-1522202176988-66273 c2, fd55, f?w=1200&q=80',
              fit: BoxFit.cover,
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withValues(alpha: 0.1),
                    Color(0xFFF8FAFC).withValues(alpha: 1.0),
                  ],
                ),
              ),
            ),
            Positioned(
              bottom: 10, left: 10, right: 10, child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 6),
                    decoration: BoxDecoration(
                      color: Color(0xFF38BDF8).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Color(0xFF38BDF8).withValues(alpha: 0.3)),
                    ),
                    child: const Text(
                      'ELITE PROGRAM',
                      style: TextStyle(color: Color(0xFF38BDF8), fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.5),
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'The Expert Path',
                    style: TextStyle( fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: -1),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Intensive curriculums designed by industry leaders to take you from zero to elite.',
                    style: TextStyle(color: Colors.black.withValues(alpha: 0.6), fontSize: 14, height: 1.5),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle( fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: -0.5),
    );
  }

  Widget _buildTracksCarousel(BuildContext context) {
    final tracks = [
      {'title': 'Fullstack Titan', 'img': 'https://images.unsplash.com/photo-1498050108023-c5249 f4, df085?w=400', 'color': Color(0xFF6366F1), 'cat': 'Développement'},
      {'title': 'AI Architect', 'img': 'https://images.unsplash.com/photo-1555255707-c079664889 ec?w=400', 'color': Color(0xFFF472B6), 'cat': 'Data Science'},
      {'title': 'UX Master', 'img': 'https://images.unsplash.com/photo-1586717791821-3 f44, a563, de4, c?w=400', 'color': Color(0xFF34D399), 'cat': 'Design'},
    ];

    return SizedBox(
      height: 220, child: ListView.separated(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        itemCount: tracks.length,
        separatorBuilder: (_, __) => const SizedBox(width: 16),
        itemBuilder: (context, i) {
          final t = tracks[i];
          final color = t['color'] as Color;
          return GestureDetector(
            onTap: () => Navigator.pushNamed(context, '/courses', arguments: t['cat']),
            child: Container(
              width: 180, decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4))],
                image: DecorationImage(image: NetworkImage(t['img'] as String), fit: BoxFit.cover),
              ),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [Colors.black.withValues(alpha: 0.7), Colors.transparent],
                  ),
                ),
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Container(
                      width: 30, height: 4,
                      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(2)),
                    ),
                    const SizedBox(height: 8),
                    Text(t['title'] as String, style: TextStyle(color: Theme.of(context).cardColor, fontWeight: FontWeight.bold, fontSize: 18)),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildRoadmap(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.black.withValues(alpha: 0.05)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 10, offset: const Offset(0, 0))],
      ),
      child: Column(
        children: [
          _buildRoadmapStep(context, '01', 'Core Foundations', 'Master the basics with 100+ labs.', true, '/feature_detail', {
            'title': 'Core Foundations',
            'description': 'Master the essential building blocks of your chosen track, from syntax to design patterns.',
            'icon': '📖'
          }),
          _buildRoadmapDivider(),
          _buildRoadmapStep(context, '02', 'Advanced Frameworks', 'Deep dive into performance & scale.', false, '/feature_detail', {
            'title': 'Advanced Frameworks',
            'description': 'Deep dive into performance, scalability, and industry-standard frameworks used by experts.',
            'icon': '⚡'
          }),
          _buildRoadmapDivider(),
          _buildRoadmapStep(context, '03', 'Real-world Capstone', 'Build and deploy a production system.', false, '/feature_detail', {
            'title': 'Real-world Capstone',
            'description': 'Build and deploy a complex, production-ready system to showcase your expertise.',
            'icon': '🚀'
          }),
          _buildRoadmapDivider(),
          _buildRoadmapStep(context, '04', 'Expert Certification', 'Get verified by our world-class panel.', false, '/certified-degree'),
        ],
      ),
    );
  }

  Widget _buildRoadmapStep(BuildContext context, String num, String title, String sub, bool active, String route, [Map<dynamic, dynamic>? args]) {
    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, route, arguments: args),
      child: Row(
        children: [
          Container(
            width: 40, height: 40, decoration: BoxDecoration(
              color: active ? Color(0xFF38BDF8) : Color(0xFFF1F5F9),
              shape: BoxShape.circle,
              boxShadow: active ? [BoxShadow(color: Color(0xFF38BDF8).withOpacity(0.3), blurRadius: 10)] : null,
            ),
            child: Center(child: Text(num, style: TextStyle(color: active ? Colors.white : Color(0xFF94A3B8), fontWeight: FontWeight.bold))),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle( fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text(sub, style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRoadmapDivider() {
    return Container(
      margin: const EdgeInsets.only(left: 19),
      height: 20, width: 2,
      color: Color(0xFFF1F5F9),
    );
  }

  Widget _buildMentorsList(BuildContext context) {
    final mentors = [
      {'name': 'Sarah Drasner', 'role': 'Google Developer Expert', 'img': 'https://images.unsplash.com/photo-1494790108377-be9 c29, b29330?w=200'},
      {'name': 'Kent C. Dodds', 'role': 'Trophy Expert', 'img': 'https://images.unsplash.com/photo-1500648767791-00 dcc994, a43, e?w=200'},
      {'name': 'Angie Jones', 'role': 'Automation Leader', 'img': 'https://images.unsplash.com/photo-1573496359142-b8 d87734, a5, a2?w=200'},
    ];

    return Column(
      children: mentors.map((m) {
        return GestureDetector(
          onTap: () => Navigator.pushNamed(context, '/instructor'),
          child: Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.black.withValues(alpha: 0.05)),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 10, offset: const Offset(0, 4))],
            ),
            child: Row(
              children: [
                CircleAvatar(radius: 24, backgroundImage: NetworkImage(m['img'] as String)),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(m['name'] as String, style: const TextStyle( fontWeight: FontWeight.bold, fontSize: 16)),
                      Text(m['role'] as String, style: TextStyle(color: Color(0xFF38BDF8), fontSize: 14, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
                Icon(LucideLucideIcons.verifiedRounded, color: Color(0xFF38BDF8).withValues(alpha: 0.6), size: 20),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildCTA(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [Color(0xFF38BDF8), Color(0xFF6366F1)]),
        borderRadius: BorderRadius.circular(32),
        boxShadow: [BoxShadow(color: Color(0xFF38BDF8).withValues(alpha: 0.3), blurRadius: 10, offset: Offset(0, 4))],
      ),
      child: Column(
        children: [
          Text(
            'Ready to become an Expert?',
            textAlign: TextAlign.center,
            style: TextStyle(color: Theme.of(context).cardColor, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: -1),
          ),
          const SizedBox(height: 12),
          Text(
            'Join our elite community and accelerate your career with mentored experience.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Theme.of(context).cardColor, fontSize: 14, height: 1.5, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => Navigator.pushNamed(context, '/courses'),
            style: ElevatedButton.styleFrom(
              
              foregroundColor: Color(0xFF1E293B),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 0,
            ),
            child: const Text('Enroll Now', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ),
        ],
      ),
    );
  }
}
