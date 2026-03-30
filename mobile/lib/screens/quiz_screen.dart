import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:math';
import 'package:lucide_icons/lucide_icons.dart';


class QuizScreen extends StatefulWidget {
  final String quizId;
  const QuizScreen({super.key, required this.quizId});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> with TickerProviderStateMixin {
  int _currentQuestion = 0;
  int _score = 0;
  bool _answered = false;
  int? _selectedAnswer;
  bool _isFinished = false;
  Timer? _timer;
  int _timeLeft = 30;
  late AnimationController _progressController;
  late Animation<double> _progressAnimation;

  final List<Map<String, dynamic>> _questions = [
    {
      'question': 'What is the primary purpose of Flutter?',
      'options': ['Backend development', 'Building cross-platform UIs', 'Database management', 'Server-side scripting'],
      'correct': 1,
      'explanation': 'Flutter is Google\'s UI toolkit for building natively compiled apps for mobile, web, and desktop from a single codebase.',
    },
    {
      'question': 'Which programming language does Flutter use?',
      'options': ['Java', 'Kotlin', 'Dart', 'Swift'],
      'correct': 2,
      'explanation': 'Flutter uses Dart, a language developed by Google, optimized for building fast apps on any platform.',
    },
    {
      'question': 'What is a Widget in Flutter?',
      'options': ['A database table', 'A UI building block', 'A package manager', 'A testing framework'],
      'correct': 1,
      'explanation': 'In Flutter, everything is a widget. Widgets are the basic building blocks of a Flutter app\'s user interface.',
    },
    {
      'question': 'What does setState() do in Flutter?',
      'options': ['Initializes the app', 'Saves data to disk', 'Triggers UI rebuild', 'Closes the screen'],
      'correct': 2,
      'explanation': 'setState() notifies the framework that the internal state of this object has changed and triggers a UI rebuild.',
    },
    {
      'question': 'Which widget is used for vertical scrolling lists?',
      'options': ['Row', 'Column', 'ListView', 'Stack'],
      'correct': 2,
      'explanation': 'ListView is the primary widget for displaying scrollable lists of widgets in Flutter.',
    },
  ];

  @override
  void initState() {
    super.initState();
    _progressController = AnimationController(vsync: this, duration: const Duration(seconds: 30));
    _progressAnimation = Tween<double>(begin: 1.0, end: 0.0).animate(_progressController);
    _startTimer();
  }

  void _startTimer() {
    _timeLeft = 30;
    _progressController.reset();
    _progressController.forward();
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) return;
      setState(() {
        _timeLeft--;
        if (_timeLeft <= 0) {
          t.cancel();
          if (!_answered) _selectAnswer(-1);
        }
      });
    });
  }

  void _selectAnswer(int index) {
    if (_answered) return;
    _timer?.cancel();
    _progressController.stop();
    setState(() {
      _selectedAnswer = index;
      _answered = true;
      if (index == _questions[_currentQuestion]['correct']) {
        _score++;
      }
    });
  }

  void _nextQuestion() {
    if (_currentQuestion < _questions.length - 1) {
      setState(() {
        _currentQuestion++;
        _answered = false;
        _selectedAnswer = null;
      });
      _startTimer();
    } else {
      setState(() => _isFinished = true);
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _progressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isFinished) return _buildResultScreen();
    final q = _questions[_currentQuestion];
    final pct = (_currentQuestion + 1) / _questions.length;

    return Scaffold(
      backgroundColor: const Color(0xFFF0F4FF),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text('Quiz · Question ${_currentQuestion + 1}/${_questions.length}',
            style: const TextStyle(color: Color(0xFF042444), fontWeight: FontWeight.bold, fontSize: 16)),
        leading: IconButton(
          icon: const Icon(LucideLucideLucideIcons.x, color: Color(0xFF042444)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          // Progress bar
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Column(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: pct,
                    backgroundColor: const Color(0xFFE0E7FF),
                    valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF6366F1)),
                    minHeight: 8,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Score: $_score / ${_questions.length}',
                        style: const TextStyle(color: Color(0xFF6B7A90), fontWeight: FontWeight.w600)),
                    Row(
                      children: [
                        AnimatedBuilder(
                          animation: _progressAnimation,
                          builder: (context, _) => SizedBox(
                            width: 36, height: 36,
                            child: CircularProgressIndicator(
                              value: _progressAnimation.value,
                              backgroundColor: Colors.grey.shade200,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                  _timeLeft <= 10 ? Colors.red : const Color(0xFF00C6FF)),
                              strokeWidth: 3,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text('${_timeLeft}s', style: TextStyle(
                          color: _timeLeft <= 10 ? Colors.red : const Color(0xFF042444),
                          fontWeight: FontWeight.bold,
                        )),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),

          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Question card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 12, offset: const Offset(0, 4))],
                    ),
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEEF2FF),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(LucideLucideLucideLucideLucideIcons.helpCircleCircleCircle, color: Color(0xFF6366F1), size: 28),
                        ),
                        const SizedBox(height: 16),
                        Text(q['question'], textAlign: TextAlign.center,
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF042444), height: 1.4)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Answer options
                  ...List.generate((q['options'] as List).length, (i) {
                    final isCorrect = i == q['correct'];
                    final isSelected = i == _selectedAnswer;
                    Color bgColor = Colors.white;
                    Color borderColor = Colors.grey.shade200;
                    Color textColor = const Color(0xFF042444);

                    if (_answered) {
                      if (isCorrect) { bgColor = Colors.green.shade50; borderColor = Colors.green; textColor = Colors.green.shade800; }
                      else if (isSelected) { bgColor = Colors.red.shade50; borderColor = Colors.red; textColor = Colors.red.shade800; }
                    } else if (isSelected) {
                      bgColor = const Color(0xFFEEF2FF); borderColor = const Color(0xFF6366F1);
                    }

                    return GestureDetector(
                      onTap: () => _selectAnswer(i),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: bgColor,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: borderColor, width: 2),
                          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8)],
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 32, height: 32,
                              decoration: BoxDecoration(
                                color: _answered && isCorrect ? Colors.green : (_answered && isSelected ? Colors.red : const Color(0xFF6366F1).withValues(alpha: 0.1)),
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: _answered
                                    ? Icon(isCorrect ? LucideLucideLucideLucideIcons.check : (isSelected ? LucideLucideLucideIcons.x : null),
                                        color: Colors.white, size: 16)
                                    : Text(String.fromCharCode(65 + i),
                                        style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF6366F1))),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(child: Text(q['options'][i], style: TextStyle(fontSize: 15, color: textColor, fontWeight: FontWeight.w500))),
                          ],
                        ),
                      ),
                    );
                  }),

                  // Explanation
                  if (_answered) ...[
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0FDF4),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.green.shade200),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(LucideLucideLucideLucideIcons.lightbulb, color: Colors.amber, size: 20),
                          const SizedBox(width: 10),
                          Expanded(child: Text(q['explanation'], style: TextStyle(color: Colors.grey.shade700, fontSize: 14, height: 1.5))),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _nextQuestion,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF6366F1),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: Text(
                          _currentQuestion < _questions.length - 1 ? 'Next Question →' : 'See Results',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResultScreen() {
    final pct = (_score / _questions.length * 100).round();
    final passed = pct >= 60;
    return Scaffold(
      backgroundColor: const Color(0xFFF0F4FF),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 20, offset: const Offset(0, 8))],
                ),
                child: Column(
                  children: [
                    Text(passed ? '🏆' : '📚', style: const TextStyle(fontSize: 60)),
                    const SizedBox(height: 16),
                    Text(passed ? 'Excellent Work!' : 'Keep Practicing!',
                        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold,
                            color: passed ? Colors.green.shade700 : const Color(0xFF042444))),
                    const SizedBox(height: 8),
                    Text('Quiz ID: ${widget.quizId}', style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                    const SizedBox(height: 24),
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        SizedBox(
                          width: 120, height: 120,
                          child: CircularProgressIndicator(
                            value: _score / _questions.length,
                            strokeWidth: 10,
                            backgroundColor: Colors.grey.shade200,
                            valueColor: AlwaysStoppedAnimation<Color>(passed ? Colors.green : Colors.orange),
                          ),
                        ),
                        Column(
                          children: [
                            Text('$pct%', style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Color(0xFF042444))),
                            Text('$_score/${_questions.length}', style: TextStyle(color: Colors.grey.shade600)),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      decoration: BoxDecoration(
                        color: passed ? Colors.green.shade50 : Colors.orange.shade50,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        passed ? '✅ Quiz Passed! Certificate earned.' : '⚠️ Score below 60%. Try again!',
                        style: TextStyle(color: passed ? Colors.green.shade700 : Colors.orange.shade700, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: const Text('Back to Quizzes'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => setState(() {
                        _currentQuestion = 0; _score = 0; _answered = false;
                        _selectedAnswer = null; _isFinished = false;
                        _startTimer();
                      }),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF6366F1),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: const Text('Retry Quiz', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

