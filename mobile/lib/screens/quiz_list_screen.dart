import 'package:flutter/material.dart';
import '../screens/quiz_screen.dart';
import 'package:lucide_icons/lucide_icons.dart';


class QuizListScreen extends StatefulWidget {
  const QuizListScreen({super.key});

  @override
  State<QuizListScreen> createState() => _QuizListScreenState();
}

class _QuizListScreenState extends State<QuizListScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _todoQuizzes = [];
  List<dynamic> _completedQuizzes = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadQuizzes();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadQuizzes() async {
    setState(() => _isLoading = true);
    
    // Simuler le chargement des données
    await Future.delayed(const Duration(seconds: 1));
    
    setState(() {
      _todoQuizzes = [
        {'id': '1', 'title': 'Flutter Quiz - Module 1', 'courseTitle': 'Introduction to Flutter', 'questions': 5, 'duration': '10 min', 'difficulty': 'Easy'},
        {'id': '2', 'title': 'UI/UX Design Quiz', 'courseTitle': 'Ergonomics and Prototyping', 'questions': 5, 'duration': '10 min', 'difficulty': 'Medium'},
        {'id': '3', 'title': 'React Native Quiz', 'courseTitle': 'Cross-Platform Development', 'questions': 4, 'duration': '8 min', 'difficulty': 'Hard'},
        {'id': '4', 'title': 'Python Quiz - Basics', 'courseTitle': 'Introduction to Python', 'questions': 3, 'duration': '5 min', 'difficulty': 'Easy'},
        {'id': '6', 'title': 'Advanced CSS Quiz', 'courseTitle': 'Web Design: Flexbox & Grid', 'questions': 3, 'duration': '5 min', 'difficulty': 'Medium'},
        {'id': '7', 'title': 'Git & GitHub Quiz', 'courseTitle': 'Version Control', 'questions': 3, 'duration': '6 min', 'difficulty': 'Easy'},
        {'id': '8', 'title': 'TypeScript Quiz', 'courseTitle': 'Static Typing for JS', 'questions': 4, 'duration': '8 min', 'difficulty': 'Medium'},
        {'id': '9', 'title': 'C# and .NET Quiz', 'courseTitle': 'Microsoft Backend', 'questions': 3, 'duration': '6 min', 'difficulty': 'Medium'},
        {'id': '10', 'title': 'Advanced SQL Quiz', 'courseTitle': 'Relational Databases', 'questions': 3, 'duration': '7 min', 'difficulty': 'Hard'},
        {'id': '11', 'title': 'Vue.js Quiz', 'courseTitle': 'Progressive Web Framework', 'questions': 3, 'duration': '5 min', 'difficulty': 'Medium'},
        {'id': '12', 'title': 'Docker Quiz', 'courseTitle': 'Application Containerization', 'questions': 4, 'duration': '10 min', 'difficulty': 'Hard'},
        {'id': '13', 'title': 'Node.js Quiz', 'courseTitle': 'Backend in JavaScript', 'questions': 3, 'duration': '5 min', 'difficulty': 'Medium'},
        {'id': '14', 'title': 'Web Security Quiz', 'courseTitle': 'Cybersecurity (XSS, CSRF)', 'questions': 3, 'duration': '8 min', 'difficulty': 'Hard'},
        {'id': '15', 'title': 'GraphQL Quiz', 'courseTitle': 'Data APIs', 'questions': 3, 'duration': '6 min', 'difficulty': 'Hard'},
      ];

      _completedQuizzes = [
        {'id': '5', 'title': 'JavaScript Quiz', 'courseTitle': 'Modern JavaScript', 'questions': 3, 'duration': '5 min', 'score': 100, 'date': '15/03/2024', 'passed': true},
        {'id': '16', 'title': 'Firebase Quiz', 'courseTitle': 'BaaS and Cloud Firestore', 'questions': 3, 'duration': '5 min', 'score': 85, 'date': '10/03/2024', 'passed': true},
        {'id': '17', 'title': 'AWS Cloud Quiz', 'courseTitle': 'Amazon Cloud Services', 'questions': 4, 'duration': '10 min', 'score': 45, 'date': '08/03/2024', 'passed': false},
        {'id': '18', 'title': 'Angular Quiz', 'courseTitle': 'TypeScript Framework', 'questions': 3, 'duration': '6 min', 'score': 70, 'date': '05/03/2024', 'passed': true},
        {'id': '19', 'title': 'Swift & iOS Quiz', 'courseTitle': 'iOS Development', 'questions': 3, 'duration': '5 min', 'score': 90, 'date': '01/03/2024', 'passed': true},
        {'id': '20', 'title': 'Kotlin & Android Quiz', 'courseTitle': 'Android Development', 'questions': 3, 'duration': '7 min', 'score': 30, 'date': '20/02/2024', 'passed': false},
      ];

      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      
      appBar: AppBar(
        
        elevation: 0,
        title: const Text(
          'My Quizzes',
          style: TextStyle(
            fontSize: 14, fontWeight: FontWeight.bold,
            
          ),
        ),
        bottom: TabBar(
          controller: _tabController,
          labelColor: Color(0xFF00C6FF),
          unselectedLabelColor: Colors.grey,
          indicatorColor: Color(0xFF00C6FF),
          tabs: const [
            Tab(text: 'To Do'),
            Tab(text: 'Completed'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildTodoQuizzesList(),
                _buildCompletedQuizzesList(),
              ],
            ),
    );
  }

  Widget _buildTodoQuizzesList() {
    if (_todoQuizzes.isEmpty) {
      return _buildEmptyState(
        'No quizzes to do',
        'You have completed all your quizzes!',
        LucideLucideLucideLucideLucideIcons.helpCircleCircleCircle_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: _loadQuizzes,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _todoQuizzes.length,
        itemBuilder: (context, index) {
          final quiz = _todoQuizzes[index];
          return _buildQuizCard(quiz, isCompleted: false);
        },
      ),
    );
  }

  Widget _buildCompletedQuizzesList() {
    if (_completedQuizzes.isEmpty) {
      return _buildEmptyState(
        'No completed quizzes',
        'Start your first quizzes to see your results here',
        LucideLucideIcons.emojiEventsOutlined,
      );
    }

    return RefreshIndicator(
      onRefresh: _loadQuizzes,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _completedQuizzes.length,
        itemBuilder: (context, index) {
          final quiz = _completedQuizzes[index];
          return _buildQuizCard(quiz, isCompleted: true);
        },
      ),
    );
  }

  Widget _buildEmptyState(String title, String subtitle, IconData icon) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 20, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              title,
              style: const TextStyle(
                fontSize: 14, fontWeight: FontWeight.bold,
                
              ),
            ),
            const SizedBox(height: 8),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 14, color: Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuizCard(Map<String, dynamic> quiz, {required bool isCompleted}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: isCompleted 
                        ? (quiz['passed'] ? Colors.green : Colors.red).withValues(alpha: 0.1)
                        : Color(0xFF00C6FF).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    isCompleted 
                        ? (quiz['passed'] ? LucideLucideLucideLucideLucideIcons.checkCircle : LucideLucideIcons.cancel)
                        : LucideLucideLucideLucideLucideIcons.helpCircleCircleCircle_outlined,
                    color: isCompleted 
                        ? (quiz['passed'] ? Colors.green : Colors.red)
                        : Color(0xFF00C6FF),
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        quiz['title'],
                        style: const TextStyle(
                          fontSize: 14, fontWeight: FontWeight.bold,
                          
                        ),
                      ),
                      Text(
                        quiz['courseTitle'],
                        style: TextStyle(
                          fontSize: 14, color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildInfoChip(LucideLucideIcons.questionAnswer, '${quiz['questions']} questions'),
                const SizedBox(width: 8),
                _buildInfoChip(LucideLucideIcons.schedule, quiz['duration']),
                if (!isCompleted) ...[
                  const SizedBox(width: 8),
                  _buildDifficultyChip(quiz['difficulty']),
                ],
              ],
            ),
            if (isCompleted) ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Score achieved',
                          style: TextStyle(
                            fontSize: 14, color: Colors.grey[600],
                          ),
                        ),
                        Row(
                          children: [
                            Text(
                              '${quiz['score']}%',
                              style: TextStyle(
                                fontSize: 14, fontWeight: FontWeight.bold,
                                color: quiz['passed'] ? Colors.green : Colors.red,
                              ),
                            ),
                            if (quiz['passed']) ...[
                              const SizedBox(width: 8),
                              const Icon(LucideLucideIcons.emojiEvents, color: Colors.amber),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),
                  Text(
                    quiz['date'],
                    style: TextStyle(
                      fontSize: 14, color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => QuizScreen(
                              quizId: quiz['id'],
                            ),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey[200],
                        foregroundColor: Color(0xFF042444),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: const Text('View corrections'),
                    ),
                  ),
                  if (!quiz['passed']) ...[
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => QuizScreen(
                                quizId: quiz['id'],
                              ),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFF00C6FF),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        child: const Text('Retry quiz'),
                      ),
                    ),
                  ],
                ],
              ),
            ] else ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => QuizScreen(
                          quizId: quiz['id'],
                        ),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF00C6FF),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Start quiz',
                    style: TextStyle(
                      fontSize: 14, fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 4),
          Text(
            text,
            style: TextStyle(
              fontSize: 14, color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDifficultyChip(String difficulty) {
    Color color;
    switch (difficulty.toLowerCase()) {
      case 'easy':
        color = Colors.green;
        break;
      case 'medium':
        color = Colors.orange;
        break;
      case 'hard':
        color = Colors.red;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        difficulty,
        style: TextStyle(
          fontSize: 14, color: color,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
