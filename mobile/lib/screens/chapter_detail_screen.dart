import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';


class ChapterDetailScreen extends StatelessWidget {
  final String courseId;
  final int chapterIndex;
  final Map<dynamic, dynamic>? chapterData;

  const ChapterDetailScreen({
    super.key,
    required this.courseId,
    required this.chapterIndex,
    this.chapterData,
  });

  @override
  Widget build(BuildContext context) {
    final Map<dynamic, dynamic> data = chapterData ?? {};

    return Scaffold(
      appBar: AppBar(title: Text(data['title'] ?? 'Chapter Detail')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (data['duration'] != null)
              Text(
                '⏱️ ${data['duration']}',
                style: const TextStyle(color: Colors.grey, fontSize: 14),
              ),
            const Divider(height: 32),
            
            if (data['videoUrl'] != null) ...[
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.black87,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(LucideLucideLucideIcons.playCircle, color: Colors.white, size: 60),
                      SizedBox(height: 8),
                      Text('Video Playback Placeholder', style: TextStyle(color: Colors.white)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
            
            if (data['content'] != null) ...[
              Text(
                data['content'],
                style: const TextStyle(fontSize: 16, height: 1.5),
              ),
              const SizedBox(height: 32),
            ],

            if (data['lessons'] != null && (data['lessons'] as List).isNotEmpty) ...[
              const Text(
                'Leçons dans ce chapitre :',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              ...(data['lessons'] as List).map((lesson) {
                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  elevation: 2,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          lesson['title'] ?? 'Section',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        if (lesson['duration'] != null) ...[
                          const SizedBox(height: 4),
                          Text('⏱️ ${lesson['duration']}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                        ],
                        if (lesson['videoUrl'] != null) ...[
                          const SizedBox(height: 16),
                          Container(
                            height: 150,
                            width: double.infinity,
                            decoration: BoxDecoration(
                              color: Colors.black87,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Center(
                              child: Icon(LucideLucideLucideIcons.playCircle, color: Colors.white, size: 40),
                            ),
                          ),
                        ],
                        if (lesson['content'] != null) ...[
                          const SizedBox(height: 16),
                          Text(lesson['content'], style: const TextStyle(fontSize: 14, color: Colors.black87)),
                        ],
                      ],
                    ),
                  ),
                );
              }).toList(),
            ] else if (data['content'] == null && data['videoUrl'] == null) ...[
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32.0),
                  child: Text('Le contenu de ce chapitre n\'est pas encore disponible.',
                      style: TextStyle(fontStyle: FontStyle.italic, color: Colors.grey),
                      textAlign: TextAlign.center),
                ),
              )
            ]
          ],
        ),
      ),
    );
  }
}
