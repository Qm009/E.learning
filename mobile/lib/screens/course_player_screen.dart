import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:video_player/video_player.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';
import 'package:flutter_pdfview/flutter_pdfview.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'dart:io';
import 'package:url_launcher/url_launcher.dart';
import 'package:path_provider/path_provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/auth_service.dart';
import '../utils/api_config.dart';
import 'package:lucide_icons/lucide_icons.dart';


class CoursePlayerScreen extends StatefulWidget {
  final String courseId;
  
  const CoursePlayerScreen({
    super.key,
    required this.courseId,
  });

  @override
  State<CoursePlayerScreen> createState() => _CoursePlayerScreenState();
}

class _CoursePlayerScreenState extends State<CoursePlayerScreen> with TickerProviderStateMixin {
  late TabController _tabController;
  int _currentModuleIndex = 0;
  int _currentLessonIndex = 0;
  bool _isLoading = true;
  Map<String, dynamic>? _course;
  List<dynamic> _modules = [];
  Map<String, dynamic>? _currentLesson;
  final TextEditingController _notesController = TextEditingController();
  bool _isBookmarked = false;
  
  VideoPlayerController? _videoPlayerController;
  YoutubePlayerController? _youtubeController;
  String? _localPdfPath;
  bool _isPdfLoading = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadCourseContent();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _notesController.dispose();
    _videoPlayerController?.dispose();
    _youtubeController?.dispose();
    super.dispose();
  }

  Future<void> _loadCourseContent() async {
    try {
      final headers = await AuthService.getAuthHeaders();
      final res = await http.get(Uri.parse(ApiConfig.courseUrl(widget.courseId)), headers: headers);
      
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        
        setState(() {
          _course = {
            'id': data['_id'],
            'title': data['title'] ?? 'N/A',
            'description': data['description'] ?? '',
            'instructor': (data['instructor'] is Map) ? data['instructor']['name'] : 'Unknown',
            'rating': data['rating']?.toDouble() ?? 4.5,
            'students': data['enrolledStudents']?.length ?? 0,
            'duration': data['duration'] ?? 'N/A',
            'level': data['level'] ?? 'Intermediate',
            'language': 'English',
            'certificate': true,
            'lastUpdated': 'Recently',
          };

          // Transformer les leçons du backend en modules pour le UI
          final backendLessons = data['lessons'] as List? ?? [];
          
          if (backendLessons.isEmpty) {
            _modules = [
              {
                'id': '1',
                'title': 'Introduction',
                'description': 'Content being prepared',
                'duration': '-',
                'lessons': [
                  {
                    'id': 'empty',
                    'title': 'Coming soon',
                    'type': 'text',
                    'duration': '-',
                    'completed': false,
                    'content': {'text': 'Course content coming soon!'}
                  }
                ]
              }
            ];
          } else {
            // Mapper les leçons réelles de manière robuste
            _modules = [
              {
                'id': 'm1',
                'title': 'Module 1: Main Content',
                'description': 'All course lessons',
                'duration': '${backendLessons.length} lessons',
                'lessons': backendLessons.map((l) {
                  final String lessonContent = l['content'] ?? l['description'] ?? 'No content available.';
                  return {
                    'id': l['_id'] ?? UniqueKey().toString(),
                    'title': l['title'] ?? 'Untitled Lesson',
                    'type': (l['videoUrl'] != null && l['videoUrl'].toString().isNotEmpty) ? 'video' : 'text',
                    'duration': '15 min',
                    'completed': false,
                    'content': {
                      'videoUrl': l['videoUrl'],
                      'text': lessonContent,
                      'transcript': lessonContent,
                      'objectives': ['Learn the concept covered'],
                      'resources': []
                    }
                  };
                }).toList()
              }
            ];
          }

          if (_modules.isNotEmpty && _modules[0]['lessons'].isNotEmpty) {
            _currentLesson = _modules[0]['lessons'][0];
          }
          _isLoading = false;
        });

        // Auto-play si c'est une vidéo
        if (_currentLesson!['type'] == 'video' && _currentLesson!['content']['videoUrl'] != null) {
          _initializeVideo(_currentLesson!['content']['videoUrl']);
        }
      }
    } catch (e) {
      print('❌ Error loading course: $e');
      setState(() => _isLoading = false);
    }
  }

  void _navigateToLesson(int moduleIndex, int lessonIndex) {
    _videoPlayerController?.dispose();
    _videoPlayerController = null;
    _youtubeController?.dispose();
    _youtubeController = null;
    _localPdfPath = null;

    setState(() {
      _currentModuleIndex = moduleIndex;
      _currentLessonIndex = lessonIndex;
      _currentLesson = _modules[moduleIndex]['lessons'][lessonIndex];
      _notesController.clear();
    });

    if (_currentLesson!['type'] == 'video' && _currentLesson!['content']['videoUrl'] != null) {
      _initializeVideo(_currentLesson!['content']['videoUrl']);
    } else if (_currentLesson!['type'] == 'pdf' && _currentLesson!['content']['pdfUrl'] != null) {
      _downloadPdf(_currentLesson!['content']['pdfUrl']);
    }
  }

  Future<void> _initializeVideo(String url) async {
    // Détecter si c'est YouTube
    if (url.contains('youtube.com') || url.contains('youtu.be') || url.isEmpty || url.length < 5) {
      String? videoId = YoutubePlayer.convertUrlToId(url);
      if (videoId == null || videoId == 'dQw4w9WgXcQ') {
        final RegExp regExp = RegExp(r'^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*');
        final match = regExp.firstMatch(url);
        videoId = (match != null && match.group(7) != null && match.group(7)!.length == 11) ? match.group(7) : '1ukSR1GRtMU';
        if (videoId == 'dQw4w9WgXcQ') videoId = '1ukSR1GRtMU';
      }
      
      if (videoId != null) {
        setState(() {
          _youtubeController = YoutubePlayerController(
            initialVideoId: videoId!,
            flags: const YoutubePlayerFlags(
              autoPlay: true,
              mute: false,
              disableDragSeek: false,
              loop: false,
              isLive: false,
              forceHD: false,
              enableCaption: true,
            ),
          );
        });
        return;
      }
    }

    // Sinon utiliser le player standard
    _videoPlayerController = VideoPlayerController.networkUrl(Uri.parse(url));
    await _videoPlayerController!.initialize();
    if (mounted) setState(() {});
    _videoPlayerController!.play();
  }

  Future<void> _downloadPdf(String url) async {
    setState(() => _isPdfLoading = true);
    try {
      final filename = url.split('/').last;
      final dir = await getApplicationDocumentsDirectory();
      final file = File('${dir.path}/$filename');
      
      if (!await file.exists()) {
        final response = await http.get(Uri.parse(url));
        await file.writeAsBytes(response.bodyBytes);
      }
      
      if (mounted) {
        setState(() {
          _localPdfPath = file.path;
          _isPdfLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isPdfLoading = false);
    }
  }

  void _markLessonComplete() {
    setState(() {
      _currentLesson!['completed'] = true;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Lesson marked as completed!'),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    final currentModule = _modules[_currentModuleIndex];

    return Scaffold(
      
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverAppBar(
              expandedHeight: 200, floating: false,
              pinned: true,
              
              elevation: 0,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Color(0xFF00BCD4),
                        Color(0xFF1976D2),
                      ],
                    ),
                  ),
                  child: Stack(
                    children: [
                      Positioned(
                        top: 10, left: 10, right: 10, child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _course!['title'],
                              style: TextStyle(
                                color: Theme.of(context).cardColor,
                                fontSize: 14, fontWeight: FontWeight.bold,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Icon(LucideIcons.user, color: Theme.of(context).cardColor, size: 16),
                                const SizedBox(width: 6),
                                Text(
                                  _course!['instructor'],
                                  style: TextStyle(
                                    color: Theme.of(context).cardColor,
                                    fontSize: 14,
                                  ),
                                ),
                                const SizedBox(width: 16),
                                const Icon(LucideIcons.star, color: Colors.amber, size: 16),
                                Text(
                                  '${_course!['rating']}',
                                  style: TextStyle(
                                    color: Theme.of(context).cardColor,
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      Positioned(
                        top: 10, right: 10, child: Container(
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: Colors.black.withValues(alpha: 0.3)),
                          ),
                          child: IconButton(
                            icon: Icon(
                              _isBookmarked ? LucideIcons.bookmark : LucideIcons.bookmarkBorder,
                              color: Theme.of(context).cardColor,
                            ),
                            onPressed: () {
                              setState(() {
                                _isBookmarked = !_isBookmarked;
                              });
                            },
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              bottom: TabBar(
                controller: _tabController,
                tabs: const [
                  Tab(text: 'Content'),
                  Tab(text: 'Notes'),
                  Tab(text: 'Forum'),
                ],
                labelColor: Color(0xFF00BCD4),
                unselectedLabelColor: Colors.grey,
                indicatorColor: Color(0xFF00BCD4),
              ),
            ),
          ];
        },
        body: TabBarView(
          controller: _tabController,
          children: [
            _buildContentTab(),
            _buildNotesTab(),
            _buildForumTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildContentTab() {
    return Column(
      children: [
        // Navigation entre leçons
        Container(
          padding: const EdgeInsets.all(16),
          color: Theme.of(context).cardColor,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _modules[_currentModuleIndex]['title'],
                style: const TextStyle(
                  fontSize: 14, fontWeight: FontWeight.bold,
                  color: Color(0xFF1F2937),
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _currentLessonIndex > 0
                          ? () => _navigateToLesson(_currentModuleIndex, _currentLessonIndex - 1)
                          : null,
                      icon: const Icon(LucideIcons.skipPrevious),
                      label: const Text('Previous lesson'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey[300],
                        foregroundColor: Colors.grey[700],
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _currentLessonIndex < _modules[_currentModuleIndex]['lessons'].length - 1
                          ? () => _navigateToLesson(_currentModuleIndex, _currentLessonIndex + 1)
                          : null,
                      icon: const Icon(LucideIcons.skipNext),
                      label: const Text('Next lesson'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFF00BCD4),
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        
        // Contenu de la leçon
        Expanded(
          child: _buildLessonContent(),
        ),
      ],
    );
  }

  Widget _buildLessonContent() {
    if (_currentLesson == null) return const SizedBox.shrink();

    final lesson = _currentLesson!;
    final content = lesson['content'];

    switch (lesson['type']) {
      case 'video':
        return _buildVideoContent(content);
      case 'text':
        return _buildTextContent(content);
      case 'pdf':
        return _buildPdfContent(content);
      case 'exercise':
        return _buildExerciseContent(content);
      case 'quiz':
        return _buildQuizContent(content);
      default:
        return _buildDefaultContent(content);
    }
  }

  Widget _buildPdfContent(Map<String, dynamic> content) {
    if (_isPdfLoading) return const Center(child: CircularProgressIndicator());
    if (_localPdfPath == null) return const Center(child: Text('Error loading PDF'));

    return Column(
      children: [
        Expanded(
          child: PDFView(
            filePath: _localPdfPath,
            enableSwipe: true,
            swipeHorizontal: true,
            autoSpacing: false,
            pageFling: false,
          ),
        ),
        _buildLessonActions(content),
      ],
    );
  }

  Widget _buildLessonActions(Map<String, dynamic> content) {
    return Container(
      padding: const EdgeInsets.all(20),
      color: Theme.of(context).cardColor,
      child: Column(
        children: [
          if (content['resources'] != null) ...[
            ...content['resources'].map((resource) {
              return ListTile(
                leading: Icon(LucideIcons.link, color: Color(0xFF00BCD4)),
                title: Text(resource['title']),
                trailing: const Icon(LucideIcons.openInNew),
                onTap: () {},
              );
            }).toList(),
            const SizedBox(height: 16),
          ],
          if (!_currentLesson!['completed'])
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _markLessonComplete,
                icon: const Icon(LucideIcons.checkCircle),
                label: const Text('Mark as completed'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildVideoContent(Map<String, dynamic> content) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Texte Explicatif (Priorité 1)
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 10, offset: const Offset(0, 4),
                ),
              ],
              border: Border.all(color: Color(0xFF00BCD4).withValues(alpha: 0.1)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Color(0xFF00BCD4).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(LucideIcons.menuBookRounded, color: Color(0xFF00BCD4), size: 20),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'Course Study Guide',
                      style: TextStyle(
                        fontSize: 14, fontWeight: FontWeight.bold,
                        color: Color(0xFF1F2937),
                        letterSpacing: -0.5,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                // Debugging text presence
                if (content['text'] == null || content['text'].toString().trim().isEmpty)
                  const Text(
                    "Textual content loading or not available...",
                    style: TextStyle(color: Colors.red, fontStyle: FontStyle.italic),
                  )
                else
                  MarkdownBody(
                    data: content['text'],
                    styleSheet: MarkdownStyleSheet(
                      p: TextStyle(fontSize: 14, color: Colors.grey.shade600, height: 1.7),
                      h1: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1F2937), height: 1.4),
                      h2: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1F2937), height: 1.4),
                      code: TextStyle(backgroundColor: Colors.grey.shade600, color: Color(0xFF00BCD4), fontFamily: 'monospace'),
                      listBullet: TextStyle(color: Color(0xFF00BCD4), fontSize: 18),
                    ),
                  ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Support Vidéo (Priorité 2 - Optionnel)
          const Padding(
            padding: EdgeInsets.only(left: 4, bottom: 12),
            child: Row(
              children: [
                Icon(LucideIcons.ondemandVideoRounded, color: Colors.grey, size: 18),
                SizedBox(width: 8),
                Text(
                  'Video Support (supplementary to text)',
                  style: TextStyle(
                    fontSize: 14, fontWeight: FontWeight.w600, color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),
          
          Container(
            width: double.infinity,
            height: 2, decoration: BoxDecoration(
              
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.2),
                  blurRadius: 10, offset: const Offset(0, 8),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: kIsWeb
                  ? Stack(
                      fit: StackFit.expand,
                      children: [
                        // Thumbnail & Logic
                        Builder(
                          builder: (context) {
                            String videoUrl = content['videoUrl'] ?? '';
                            String? videoId = YoutubePlayer.convertUrlToId(videoUrl);
                            
                            if (videoId == null || videoId == 'dQw4w9WgXcQ') {
                              final RegExp regExp = RegExp(r'^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*');
                              final match = regExp.firstMatch(videoUrl);
                              videoId = (match != null && match.group(7) != null && match.group(7)!.length == 11) ? match.group(7) : '1ukSR1GRtMU';
                              if (videoId == 'dQw4w9WgXcQ') videoId = '1ukSR1GRtMU';
                              videoUrl = 'https://www.youtube.com/watch?v=$videoId';
                            }
                            
                            return Stack(
                              fit: StackFit.expand,
                              children: [
                                Image.network(
                                  'https://img.youtube.com/vi/$videoId/maxresdefault.jpg',
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) => Image.network(
                                    'https://img.youtube.com/vi/$videoId/0.jpg',
                                    fit: BoxFit.cover,
                                    errorBuilder: (c, e, s) => Container(color: Colors.grey.shade900),
                                  ),
                                ),
                                Container(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                      colors: [Colors.black.withValues(alpha: 0.4), Colors.transparent, Colors.black.withValues(alpha: 0.8)],
                                    ),
                                  ),
                                ),
                                Positioned(
                                  top: 10, left: 10, right: 10, child: Text(_currentLesson!['title'] ?? '', maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: Theme.of(context).cardColor, fontSize: 14, fontWeight: FontWeight.bold, shadows: const [Shadow(blurRadius: 5)])),
                                ),
                                Center(
                                  child: InkWell(
                                    onTap: () async {
                                      final uri = Uri.parse(videoUrl);
                                      if (await canLaunchUrl(uri)) {
                                        await launchUrl(uri, mode: LaunchMode.externalApplication);
                                      }
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.all(16),
                                      decoration: BoxDecoration(color: Color(0xFF00BCD4), shape: BoxShape.circle, boxShadow: [BoxShadow(blurRadius: 5, spreadRadius: 2.5)]),
                                      child: Icon(LucideIcons.playRounded, color: Theme.of(context).cardColor, size: 48),
                                    ),
                                  ),
                                ),
                              ],
                            );
                          },
                        ),
                        // Label
                        Positioned(
                          bottom: 10, left: 10, right: 10, child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Watch on YouTube',
                                style: TextStyle(
                                  color: Colors.black.withValues(alpha: 0.9),
                                  fontSize: 14, fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Click to launch the tutorial (Web Optimized)',
                                style: TextStyle(
                                  color: Colors.black.withValues(alpha: 0.6),
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    )
                  : Stack(
                      children: [
                        _youtubeController != null
                            ? YoutubePlayer(
                                controller: _youtubeController!,
                                showVideoProgressIndicator: true,
                                progressIndicatorColor: Color(0xFF00BCD4),
                                progressColors: const ProgressBarColors(
                                  playedColor: Color(0xFF00BCD4),
                                  handleColor: Color(0xFF00BCD4),
                                ),
                              )
                            : (_videoPlayerController != null && _videoPlayerController!.value.isInitialized
                                ? Stack(
                                    alignment: Alignment.bottomCenter,
                                    children: [
                                      GestureDetector(
                                        onTap: () {
                                          setState(() {
                                            _videoPlayerController!.value.isPlaying
                                                ? _videoPlayerController!.pause()
                                                : _videoPlayerController!.play();
                                          });
                                        },
                                        child: Center(
                                          child: AspectRatio(
                                            aspectRatio: _videoPlayerController!.value.aspectRatio,
                                            child: VideoPlayer(_videoPlayerController!),
                                          ),
                                        ),
                                      ),
                                      VideoProgressIndicator(
                                        _videoPlayerController!,
                                        allowScrubbing: true,
                                        colors: const VideoProgressColors(
                                          playedColor: Color(0xFF00BCD4),
                                          bufferedColor: Colors.white24, ),
                                      ),
                                    ],
                                  )
                                : Center(child: CircularProgressIndicator(color: Color(0xFF00BCD4)))),
                        
                        // Fallback Button if video is spinning
                        Positioned(
                          bottom: 10, right: 10, child: ElevatedButton.icon(
                            onPressed: () async {
                              final url = content['videoUrl'];
                              if (url != null) {
                                final uri = Uri.parse(url);
                                if (await canLaunchUrl(uri)) {
                                  await launchUrl(uri);
                                }
                              }
                            },
                            icon: const Icon(LucideIcons.openInNew, size: 14),
                            label: const Text('Open on YouTube', style: TextStyle(fontSize: 12)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.black.withValues(alpha: 0.8),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            ),
                          ),
                        ),
                      ],
                    ),
            ),
          ),
          
          const SizedBox(height: 32),
          const SizedBox(height: 24),
          
          // Objectifs
          if (content['objectives'] != null) ...[
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 10, offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Learning Objectives',
                    style: TextStyle(
                      fontSize: 14, fontWeight: FontWeight.bold,
                      color: Color(0xFF00BCD4),
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...content['objectives'].map((objective) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          Icon(LucideIcons.checkCircle, color: Color(0xFF00BCD4), size: 20),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              objective,
                              style: TextStyle(
                                fontSize: 14, color: Colors.grey.shade700,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ],
              ),
            ),
          ],
          
          const SizedBox(height: 24),
          
          // Ressources
          if (content['resources'] != null) ...[
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 10, offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Additional Resources',
                    style: TextStyle(
                      fontSize: 14, fontWeight: FontWeight.bold,
                      color: Color(0xFF1F2937),
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...content['resources'].map((resource) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade200, borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            Icon(LucideIcons.link, color: Color(0xFF00BCD4)),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                resource['title'],
                                style: const TextStyle(
                                  fontSize: 14, color: Color(0xFF1F2937),
                                ),
                              ),
                            ),
                            Icon(LucideIcons.openInNew, color: Colors.grey.shade600),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ],
              ),
            ),
          ],
          
          const SizedBox(height: 24),
          
          // Bouton de complétion
          if (!_currentLesson!['completed']) ...[
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _markLessonComplete,
                icon: const Icon(LucideIcons.checkCircle),
                label: const Text('Mark as completed'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildTextContent(Map<String, dynamic> content) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10, offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Le texte formaté serait ici - pour l'instant, affichage simple
            MarkdownBody(
              data: content['text'],
              styleSheet: MarkdownStyleSheet(
                p: TextStyle(fontSize: 14, color: Colors.grey.shade600, height: 1.6),
                h1: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
                h2: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Objectifs
            if (content['objectives'] != null) ...[
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Color(0xFF00BCD4).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Learning Objectives',
                      style: TextStyle(
                        fontSize: 14, fontWeight: FontWeight.bold,
                        color: Color(0xFF00BCD4),
                      ),
                    ),
                    const SizedBox(height: 12),
                    ...content['objectives'].map((objective) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          children: [
                            Icon(LucideIcons.checkCircle, color: Color(0xFF00BCD4), size: 20),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                objective,
                                style: TextStyle(
                                  fontSize: 14, color: Colors.grey.shade700,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ],
                ),
              ),
            ],
            
            const SizedBox(height: 24),
            
            // Bouton de complétion
            if (!_currentLesson!['completed']) ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _markLessonComplete,
                  icon: const Icon(LucideIcons.checkCircle),
                  label: const Text('Mark as completed'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildExerciseContent(Map<String, dynamic> content) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Exercice
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10, offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Practical Exercises',
                  style: TextStyle(
                    fontSize: 14, fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  content['exercise'],
                  style: TextStyle(
                    fontSize: 14, color: Colors.grey.shade600, height: 1.6,
                  ),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Solution
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Color(0xFF00BCD4).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Solution',
                  style: TextStyle(
                    fontSize: 14, fontWeight: FontWeight.bold,
                    color: Color(0xFF00BCD4),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  content['solution'],
                  style: TextStyle(
                    fontSize: 14, color: Colors.grey.shade600, height: 1.6,
                    fontFamily: 'monospace',
                  ),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Bouton de complétion
          if (!_currentLesson!['completed']) ...[
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _markLessonComplete,
                icon: const Icon(LucideIcons.checkCircle),
                label: const Text('Exercise completed'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildQuizContent(Map<String, dynamic> content) {
    final quiz = content['quiz'];
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10, offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Module Quiz',
                  style: TextStyle(
                    fontSize: 14, fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  quiz['title'],
                  style: const TextStyle(
                    fontSize: 14, color: Color(0xFF00BCD4),
                  ),
                ),
                const SizedBox(height: 24),
                
                // Questions du quiz
                ...quiz['questions'].asMap().entries.map((entry) {
                  final index = entry.key;
                  final question = entry.value;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 24),
                    child: _buildQuizQuestion(question, index),
                  );
                }).toList(),
              ],
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Bouton de complétion
          if (!_currentLesson!['completed']) ...[
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _markLessonComplete,
                icon: const Icon(LucideIcons.checkCircle),
                label: const Text('Quiz completed'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildQuizQuestion(Map<String, dynamic> question, int index) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey.shade200, borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Question ${index + 1}',
            style: const TextStyle(
              fontSize: 14, fontWeight: FontWeight.bold,
              color: Color(0xFF00BCD4),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            question['question'],
            style: const TextStyle(
              fontSize: 14, color: Color(0xFF1F2937),
            ),
          ),
          const SizedBox(height: 12),
          ...question['options'].asMap().entries.map((entry) {
            final optionIndex = entry.key;
            final option = entry.value;
            final isCorrect = optionIndex == question['correct'];
            
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isCorrect ? Colors.green.withValues(alpha: 0.1) : Colors.white,
                  border: Border.all(
                    color: isCorrect ? Colors.green : Colors.grey.shade300,
                  ),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 24, height: 24, decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isCorrect ? Colors.green : Colors.grey.shade300,
                      ),
                      child: Center(
                        child: isCorrect
                            ? Icon(LucideIcons.check, color: Theme.of(context).cardColor, size: 16)
                            : Text(
                                '${optionIndex + 1}',
                                style: TextStyle(
                                  fontSize: 14, color: Theme.of(context).cardColor,
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        option,
                        style: TextStyle(
                          fontSize: 14, color: isCorrect ? Colors.green : Colors.grey.shade600, fontWeight: isCorrect ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
          if (question['explanation'] != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.blue.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  const Icon(LucideIcons.info, color: Colors.blue, size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      question['explanation'],
                      style: const TextStyle(
                        fontSize: 14, color: Colors.blue,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDefaultContent(Map<String, dynamic> content) {
    return Container(
      padding: const EdgeInsets.all(24),
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10, offset: const Offset(0, 5),
          ),
        ],
      ),
      child: const Center(
        child: Text(
          'Content being prepared...',
          style: TextStyle(
            fontSize: 14, color: Colors.grey,
          ),
        ),
      ),
    );
  }

  Widget _buildNotesTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10, offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'My Notes',
                  style: TextStyle(
                    fontSize: 14, fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _notesController,
                  maxLines: 5, decoration: InputDecoration(
                    hintText: 'Take notes on this lesson...',
                    border: OutlineInputBorder(),
                    alignLabelWithHint: true,
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // TODO: Sauvegarder les notes
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Notes saved!'),
                          backgroundColor: Colors.green,
                        ),
                      );
                    },
                    icon: const Icon(LucideIcons.save),
                    label: const Text('Save'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFF00BCD4),
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildForumTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Messages du forum
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10, offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Discussion Forum',
                  style: TextStyle(
                    fontSize: 14, fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
                const SizedBox(height: 16),
                
                // Messages simulés
                _buildForumMessage(
                  'Alice',
                  'Question about setState',
                  'I\'m having trouble understanding when to use setState. Can someone explain?',
                  '2 hours ago',
                ),
                
                _buildForumMessage(
                  'Bob',
                  'Re: Question about setState',
                  'setState is used in a StatefulWidget to notify Flutter that the state has changed...',
                  '1 hour ago',
                ),
                
                _buildForumMessage(
                  'Charlie',
                  'Exercise 1 completed!',
                  'I finished the Todo exercise. Here is my code: [link to GitHub]',
                  '30 minutes ago',
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Champ de message
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10, offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              children: [
                const Text(
                  'Ask a question',
                  style: TextStyle(
                    fontSize: 14, fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
                const SizedBox(height: 16),
                const TextField(
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText: 'Your message...',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // TODO: Envoyer le message
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Message sent!'),
                          backgroundColor: Colors.green,
                        ),
                      );
                    },
                    icon: const Icon(LucideIcons.send),
                    label: const Text('Send'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFF00BCD4),
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildForumMessage(String author, String title, String content, String time) {
    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.grey.shade200, borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                backgroundColor: Color(0xFF00BCD4),
                child: Text(
                  author[0],
                  style: TextStyle(
                    color: Theme.of(context).cardColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      author,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1F2937),
                      ),
                    ),
                    Text(
                      time,
                      style: TextStyle(
                        fontSize: 14, color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Color(0xFF1F2937),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            content,
            style: TextStyle(
              color: Colors.grey.shade700,
            ),
          ),
        ],
      ),
    );
  }
}
