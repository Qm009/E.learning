import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/api_config.dart';

class CourseDetailScreen extends StatefulWidget {
  final String courseId;

  const CourseDetailScreen({super.key, required this.courseId});

  @override
  _CourseDetailScreenState createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  Map<dynamic, dynamic>? _course;
  String? _token;

  @override
  void initState() {
    super.initState();
    _loadToken();
    _fetchCourse();
  }

  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _token = prefs.getString('token');
    });
  }

  Future<void> _fetchCourse() async {
    final String id = widget.courseId;
    final Map<String, String> headers = {
      'Content-Type': 'application/json',
      if (_token != null) 'Authorization': 'Bearer $_token',
    };

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.coursesUrl}/$id'),
        headers: headers,
      ).timeout(const Duration(seconds: 5));
      if (response.statusCode == 200) {
        final dynamic data = jsonDecode(response.body);
        if (data is Map && data['_id'] != null) {
          if (mounted) {
            setState(() {
              _course = data;
            });
          }
          return;
        }
      }
    } catch (_) {
      // Ignore network errors or timeout
    }

    // Fallback to default data or demo data
    final defaultCourse = _getDefaultCourse(widget.courseId);
    if (defaultCourse != null) {
      setState(() {
        _course = defaultCourse;
      });
    } else {
      setState(() {
        _course = {
          '_id': widget.courseId,
          'title': 'Demo Course',
          'description': 'This is a demo course description used when the backend is not available.',
          'instructor': {'name': 'EduPortal Instructor'},
          'price': 0,
          'category': 'Demo',
          'chapters': [
            {
              'title': 'Chapitre 1: Introduction',
              'content': 'Bienvenue dans ce chapitre d\'introduction ! Ce texte sert de contenu de remplissage détaillé pour vous permettre de vérifier l\'apparence visuelle.',
              'duration': '15 min'
            },
            {
              'title': 'Chapitre 2: Avancé',
              'content': 'Dans cette section plus avancée, nous allons détailler des notions plus complexes. \n\nVoici par exemple plusieurs points clés à retenir :\n- Toujours commencer par les bases.\n- Ne pas hésiter à pratiquer régulièrement.\n- Poser des questions à la communauté en cas de blocage.',
              'duration': '30 min'
            }
          ],
          'lessons': List.generate(5, (i) => {
            'title': 'Demo Lesson ${i + 1}',
            'content': 'Ceci est un exemple de contenu de leçon détaillé.',
          }),
        };
      });
    }
  }

  Map<dynamic, dynamic>? _getDefaultCourse(String id) {
    final demoCourses = [
      {
        '_id': '1',
        'title': 'Introduction à JavaScript (Complet)',
        'description': 'Apprenez les bases de JavaScript, le langage de programmation le plus populaire pour le développement web. Ce cours couvre tout, de la syntaxe de base aux concepts asynchrones avancés.',
        'instructor': {'name': 'Jean Dupont'},
        'category': 'Développement Web',
        'level': 'Débutant',
        'price': 0,
        'chapters': [
          {
            'title': '🚀 Chapitre 1: L\'Histoire et l\'Évolution de JS',
            'content': '''JavaScript est bien plus qu'un simple langage de script pour les navigateurs. Né en 1995 dans les bureaux de Netscape, il a parcouru un chemin incroyable pour devenir le langage le plus utilisé au monde.

Dans ce premier module, nous allons explorer en profondeur pourquoi JavaScript est devenu indispensable. Nous ne nous contenterons pas de survoler la syntaxe ; nous analyserons comment il a transformé le web statique en une plateforme interactive riche. 

Voici ce que nous allons couvrir en détail :
1. Les origines : De Mocha à LiveScript puis JavaScript.
2. L'ascension du web : Comment AJAX a tout changé au début des années 2000.
3. L'ère moderne : L'arrivée de Node.js et la conquête du côté serveur.
4. L'écosystème actuel : Pourquoi les frameworks comme React, Vue et Angular dominent le marché.

Ce chapitre pose les fondations théoriques nécessaires pour comprendre non seulement "comment" coder, mais surtout "pourquoi" nous utilisons ces outils aujourd'hui. L'apprentissage de l'informatique demande de la patience, et ce voyage historique vous donnera la perspective nécessaire pour apprécier les facilités du développement moderne.''',
            'videoUrl': 'https://www.youtube.com/embed/W6NZfCO5SIk',
            'lessons': [
              {
                'title': 'Le moteur V8 et l\'exécution',
                'duration': '15 min',
                'content': 'Comprendre comment le code est interprété et compilé à la volée par le navigateur. Nous analyserons le fonctionnement du moteur V8 de Google et son impact sur les performances des applications web modernes.'
              }
            ]
          },
          {
            'title': '🧠 Chapitre 2: Logique de Programmation Avancée',
            'content': '''Maîtriser JavaScript, c'est avant tout maîtriser sa logique. Dans cette section, nous plongeons dans le cœur du langage pour comprendre comment structurer des algorithmes robustes et évolutifs.

La programmation ne se résume pas à écrire des lignes de code ; c'est un art de la résolution de problèmes. Nous allons apprendre à décomposer des tâches complexes en petites fonctions simples et réutilisables.

Points clés abordés dans ce chapitre :
• Manipulation avancée des tableaux : map, filter, reduce et find.
• La puissance des Closures : pourquoi c'est le concept le plus important à comprendre.
• Portée des variables et Hoisting : évitez les pièges classiques du débutant.
• Programmation Fonctionnelle vs Orientée Objet : choisir le bon paradigme.

À la fin de ce chapitre, vous serez capable de construire des bases de données locales, de filtrer des informations complexes et de gérer des états d'application avec une précision chirurgicale. Préparez votre éditeur de texte, car nous allons coder intensément !''',
            'videoUrl': 'https://www.youtube.com/embed/1OsGxDqvbNI',
            'lessons': [
              {
                'title': 'Les structures de données ES6+',
                'duration': '20 min',
                'content': 'Exploration des Maps, Sets et Symboles. Pourquoi et quand les utiliser à la place des objets classiques.'
              }
            ]
          }
        ]
      },
      {
        '_id': '2',
        'title': 'React Avancé (Masterclass)',
        'description': 'Maîtrisez React avec les hooks, Redux et les meilleures pratiques de développement pour créer des SPAs ultra-rapides.',
        'instructor': {'name': 'Marie Martin'},
        'category': 'Framework JavaScript',
        'level': 'Intermédiaire',
        'price': 49,
        'chapters': [
          {
            'title': '🛠️ Chapitre 1: Architecture de Composants Clean Code',
            'content': '''Développer avec React est facile, mais développer BIEN avec React demande de la rigueur. Dans ce chapitre, nous allons voir comment structurer vos projets pour qu'ils restent maintenables même après des mois de travail.

Nous introduisons le concept de "Atomic Design" et comment il s'applique parfaitement aux composants React. Nous apprendrons à séparer la logique (Smart Components) de la présentation (Dumb Components).

Programme détaillé :
• Séparation des préoccupations (SOC) dans React.
• Patterns de composition : Render Props et HOCs.
• Gestion professionnelle des formulaires avec React Hook Form.
• Style atomique et CSS-in-JS (Styled Components).

Un bon développeur React passe 80% de son temps à réfléchir à l'architecture et 20% à coder. Ce chapitre est conçu pour vous faire passer dans la catégorie des seniors en vous donnant les bonnes habitudes dès le départ.''',
            'videoUrl': 'https://www.youtube.com/embed/TNhaISOUy6Q',
            'lessons': [
              {
                'title': 'Optimisation du Rendu',
                'duration': '25 min',
                'content': 'Utilisation de React.memo, useMemo et useCallback pour éviter les re-renders inutiles dans les grandes applications.'
              }
            ]
          }
        ]
      },
    ];

    try {
      final chaptersFallback = [
        {
          'title': '📄 MODULE D\'INTRODUCTION GÉNÉRALE',
          'content': '''Bienvenue dans ce module de formation approfondi. Ce texte est un exemple de contenu réel que vous trouverez dans chaque chapitre de cette application EduPortal.

Dans cette partie, nous posons les bases de l'apprentissage. Il est crucial de comprendre que chaque compétence demande du temps et de la répétitvité. Nous avons structuré ce cours pour qu'il soit progressif et accessible.

Pourquoi suivre cette formation ?
1. Contenu mis à jour régulièrement selon les standards de l'industrie.
2. Exercices pratiques basés sur des cas réels d'entreprise.
3. Accès à une communauté d'apprenants passionnés.

Prenez le temps de lire chaque section. Le savoir ne se transmet pas seulement par la vidéo, mais aussi par une lecture attentive des concepts théoriques.''',
          'duration': '15 min'
        },
        {
          'title': '💎 MODULE DE SPÉCIALISATION PRATIQUE',
          'content': '''Félicitations pour être arrivé jusqu'ici. Maintenant que nous avons vu la théorie, il est temps de passer à la mise en application concrète de vos connaissances.

Dans ce chapitre, nous allons construire un projet de bout en bout. Nous verrons comment intégrer toutes les briques logicielles que nous avons étudiées précédemment dans un système cohérent et performant.

Les thèmes abordés incluent :
• Débogage efficace : Apprendre à lire les erreurs et à trouver des solutions.
• Optimisation des performances : Rendre votre code 10 fois plus rapide.
• Sécurité : Protéger les données de vos utilisateurs finaux.
• Documentation : Comment écrire pour être compris par vos pairs.

Continuez vos efforts, la maîtrise technique est à portée de main !''',
          'duration': '30 min'
        }
      ];

      final course = demoCourses.firstWhere(
        (c) => c['_id'] == id,
        orElse: () => {
          '_id': id,
          'title': '🎓 Formation Expert EduPortal',
          'description': 'Ce programme d\'excellence offre une immersion totale dans le sujet sélectionné, avec un contenu riche et structuré pour la réussite professionnelle.',
          'instructor': {'name': 'Élite EduPortal'},
          'price': 0,
          'category': 'Expertise',
          'chapters': chaptersFallback,
        },
      );
      
      if (course['chapters'] == null) {
        course['chapters'] = chaptersFallback;
      }
      
      return course;
    } catch (_) {
      return null;
    }
  }

  Future<void> _enroll() async {
    if (_token == null) return;
    final response = await http.post(
      Uri.parse('http://10.0.2.2:5000/api/courses/${widget.courseId}/enroll'),
      headers: {'Authorization': 'Bearer $_token'},
    );
    if (response.statusCode == 200) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Enrolled successfully')));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_course == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      appBar: AppBar(title: Text(_course!['title'] ?? 'Course Detail')),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          Text(
            _course!['description'] ?? '',
            style: const TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 16),
          if (_course!['category'] != null) ...[
            Text('Category: ${_course!['category']}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
          ],
          Text('Instructor: ${_course!['instructor']?['name'] ?? 'Unknown'}'),
          const SizedBox(height: 8),
          const SizedBox(height: 8),
          /* Price removed as per user request
          Text(
            'Price: ${_course!['price'] == 0 ? 'Free' : '\$${_course!['price']}'}',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF00C6FF),
            ),
          ),
          */
          const SizedBox(height: 16),
          if (_token != null)
            ElevatedButton(
              onPressed: _enroll,
              child: const Text('Enroll Now'),
            )
          else
            const Text(
              'Log in to enroll in this course.',
              style: TextStyle(fontStyle: FontStyle.italic, color: Colors.grey),
            ),
          const SizedBox(height: 24),

          // Course Files Section (matches web)
          if (_course!['files'] != null && (_course!['files'] as List).isNotEmpty) ...[
            Text(
              '📁 Fichiers du cours (${(_course!['files'] as List).length})',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            ...(_course!['files'] as List).map((file) {
              final isImage = file['mimeType']?.toString().startsWith('image/') ?? false;
              final isPdf = file['mimeType'] == 'application/pdf';
              final icon = isImage ? '🖼️' : (isPdf ? '📄' : '📁');
              return Card(
                elevation: 2,
                margin: const EdgeInsets.symmetric(vertical: 4),
                child: ListTile(
                  leading: Text(icon, style: const TextStyle(fontSize: 24)),
                  title: Text(file['originalName'] ?? 'Unnamed file'),
                  subtitle: Text('${isImage ? 'Image' : (isPdf ? 'PDF' : 'Document')} • ${((file['size'] ?? 0) / 1024 / 1024).toStringAsFixed(2)} MB'),
                  trailing: const Icon(Icons.download_rounded, color: Color(0xFF00C6FF)),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Download simulating...')),
                    );
                  },
                ),
              );
            }).toList(),
            const SizedBox(height: 24),
          ],

          // Chapters Section
          if (_course!['chapters'] != null && (_course!['chapters'] as List).isNotEmpty) ...[
            const Text(
              'Course Curriculum',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            ...(_course!['chapters'] as List).asMap().entries.map((entry) {
              final index = entry.key;
              final chapter = entry.value;
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                  side: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
                elevation: 0,
                child: InkWell(
                  onTap: () {
                    // Navigate to chapter detail directly
                    Navigator.pushNamed(
                      context,
                      '/chapter_detail',
                      arguments: {
                        'courseId': widget.courseId,
                        'chapterIndex': index,
                        'chapterData': chapter,
                      },
                    );
                  },
                  borderRadius: BorderRadius.circular(8),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                '📖 Chapitre ${index + 1}: ${chapter['title'] ?? 'No title'}',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF2D3748),
                                ),
                              ),
                            ),
                            const Text(
                              'Voir le contenu ➔',
                              style: TextStyle(
                                color: Color(0xFF667EEA),
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            if (chapter['duration'] != null)
                              Text('⏱️ ${chapter['duration']}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                            if (chapter['videoUrl'] != null) ...[
                              if (chapter['duration'] != null) const SizedBox(width: 10),
                              const Text('🎥 Vidéo incluse', style: TextStyle(color: Colors.grey, fontSize: 12)),
                            ]
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }).toList(),
            const SizedBox(height: 20),
          ] else if (_course!['lessons'] != null && (_course!['lessons'] as List).isNotEmpty) ...[
            // Fallback for courses that only have lessons but no chapters
            const Text(
              'Course Lessons',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            ...(_course!['lessons'] as List).asMap().entries.map((entry) {
              final index = entry.key;
              final lesson = entry.value;
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                  side: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
                child: ListTile(
                  title: Text(
                    '📖 Leçon ${index + 1}: ${lesson['title'] ?? 'No title'}',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: lesson['duration'] != null 
                    ? Text('⏱️ ${lesson['duration']}') 
                    : null,
                  trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Color(0xFF667EEA)),
                  onTap: () {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: Text(lesson['title'] ?? 'Lesson Content'),
                        content: SingleChildScrollView(
                          child: Text(lesson['content'] ?? 'No content available.'),
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Close'),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              );
            }).toList(),
          ] else ...[
             const Center(
               child: Padding(
                 padding: EdgeInsets.all(24.0),
                 child: Text('📚 No chapters or lessons available yet for this course.',
                    style: TextStyle(color: Colors.grey)),
               ),
             )
          ],
        ],
      ),
    );
  }
}
