import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';


class AIAssistantScreen extends StatefulWidget {
  const AIAssistantScreen({super.key});

  @override
  State<AIAssistantScreen> createState() => _AIAssistantScreenState();
}

class _AIAssistantScreenState extends State<AIAssistantScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isTyping = false;
  
  final List<Map<String, dynamic>> _messages = [
    {
      'id': 1,
      'type': 'bot',
      'content': '👋 Bonjour ! Je suis votre assistant IA éducatif. Je peux vous aider avec :\n\n📚 Questions sur les cours et programmation\n🎯 Aide aux devoirs et exercices\n💡 Conseils de carrière et orientation\n🔧 Support technique et dépannage',
      'timestamp': DateTime.now(),
    }
  ];

  final Map<String, String> _responses = {
    'personnalise': '🎯 **Apprentissage Personnalisé activé.**\nPour adapter mes réponses, veuillez m\'indiquer :\n1. Votre niveau actuel (Débutant, Intermédiaire, Avancé)\n2. Votre langage ou outil de prédilection\n3. Votre objectif (Ex: Trouver un emploi, Réussir un examen, Créer un projet personnel)',
    'connaissances': '📚 **Base de Connaissances**\nJe suis connecté à plus de 5000 ressources.\nQue cherchez-vous exactement ?\n- Tutoriels de code\n- Exercices pratiques\n- Documentation technique\n- Vidéos explicatives',
    'instantane': '⚡ **Réponses Instantanées**\nJe suis prêt ! Collez simplement votre code ici avec le message d\'erreur que vous obtenez, et je vous expliquerai comment le résoudre étape par étape.',
    'integration': '🔗 **Intégration Cours**\nD\'après vos données, vous êtes actuellement inscrit(e) au cours de JavaScript. Vous en êtes au module "Les Promises". Voulez-vous que je génère un quiz rapide pour tester vos connaissances sur ce chapitre ?',
    'react': 'Pour améliorer vos compétences en React, je vous recommande : 1) Pratiquez les Hooks fondamentaux (useState, useEffect) 2) Créez des projets réels comme une todo-liste ou une application de météo 3) Étudiez les patterns avancés comme HOCs et Render Props 4) Explorez Next.js ou React Native pour élargir vos compétences.',
    'javascript': 'Les meilleures pratiques pour débuter : 1) Maîtrisez les bases (variables, fonctions, tableaux) 2) Comprenez le DOM et les événements 3) Apprenez ES6+ (arrow functions, destructuring, spread) 4) Pratiquez avec des projets concrets comme une calculatrice ou un jeu simple.',
  };

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent + 1, duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  Future<void> _sendMessage(String text, {String? explicitKey}) async {
    if (text.trim().isEmpty) return;

    setState(() {
      _messages.add({
        'id': DateTime.now().millisecondsSinceEpoch,
        'type': 'user',
        'content': text,
        'timestamp': DateTime.now(),
      });
      _isTyping = true;
    });
    
    _messageController.clear();
    Future.delayed(const Duration(milliseconds: 100), _scrollToBottom);

    // Simulate Network delay for AI
    await Future.delayed(const Duration(milliseconds: 1500));

    String aiResponseStr = '🤖 Je réfléchis à votre question...';
    
    // First, check if we have an explicit key (like a Feature card click)
    if (explicitKey != null && _responses.containsKey(explicitKey)) {
      aiResponseStr = _responses[explicitKey]!;
    } else {
      // Check keywords
      String lowerMessage = text.toLowerCase();
      for (var entry in _responses.entries) {
        if (lowerMessage.contains(entry.key)) {
          aiResponseStr = entry.value;
          break;
        }
      }
      if (aiResponseStr == '🤖 Je réfléchis à votre question...') {
        aiResponseStr = '🎓 Je suis là pour vous aider dans votre parcours d\'apprentissage ! Posez-moi vos questions sur la programmation, les cours, les projets ou votre carrière.';
      }
    }

    if (mounted) {
      setState(() {
        _isTyping = false;
        _messages.add({
          'id': DateTime.now().millisecondsSinceEpoch + 1,
          'type': 'bot',
          'content': aiResponseStr,
          'timestamp': DateTime.now(),
        });
      });
      Future.delayed(const Duration(milliseconds: 100), _scrollToBottom);
    }
  }

  void _handleFeatureClick(String key, String prompt) {
    _sendMessage(prompt, explicitKey: key);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      
      appBar: AppBar(
        title: const Text('EduPortal AI Assistant'),
        leading: IconButton(
          icon: const Icon(LucideLucideLucideIcons.arrowLeft),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Column(
        children: [
          // Features Section
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: Theme.of(context).cardColor,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  '🚀 Fonctionnalités Avancées',
                  style: TextStyle(
                    fontSize: 14, fontWeight: FontWeight.bold,
                    
                  ),
                ),
                const SizedBox(height: 8),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildFeatureCard(
                        'personnalise',
                        "Activer l'apprentissage personnalisé",
                        '🎯', 
                        'Apprentissage Personnalisé', 
                        'Adapte ses réponses'
                      ),
                      _buildFeatureCard(
                        'connaissances',
                        "Rechercher dans la base de connaissances",
                        '📚', 
                        'Base de Connaissances', 
                        'Accès aux tutoriels'
                      ),
                      _buildFeatureCard(
                        'instantane',
                        "J'ai besoin d'une réponse instantanée pour du code",
                        '⚡', 
                        'Réponses Instantanées', 
                        'Aide technique immédiate'
                      ),
                      _buildFeatureCard(
                        'integration',
                        "Où en est ma progression dans mes cours ?",
                        '🔗', 
                        'Intégration Cours', 
                        'Suivi personnalisé'
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          
          const Divider(height: 1, thickness: 1),

          // Chat Messages
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_isTyping ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length && _isTyping) {
                  return _buildTypingIndicator();
                }
                
                final msg = _messages[index];
                final isUser = msg['type'] == 'user';
                
                return _buildMessageBubble(msg, isUser);
              },
            ),
          ),

          // Input field
          Container(
            padding: const EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 12),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10, offset: const Offset(0, -5),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: InputDecoration(
                      hintText: 'Posez votre question ici...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Color(0xFFF0F2F5),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 8.14,
                      ),
                    ),
                    onSubmitted: (val) => _sendMessage(val),
                  ),
                ),
                const SizedBox(width: 12),
                InkWell(
                  onTap: () => _sendMessage(_messageController.text),
                  borderRadius: BorderRadius.circular(24),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: const BoxDecoration(
                      color: Color(0xFF00BCD4),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      LucideLucideIcons.sendRounded,
                      color: Theme.of(context).cardColor,
                      size: 20,
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

  Widget _buildFeatureCard(String key, String prompt, String icon, String title, String subtitle) {
    return Container(
      margin: const EdgeInsets.only(right: 12),
      width: 160, child: Material(
        color: Color(0xFFF5FAFF),
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          onTap: () => _handleFeatureClick(key, prompt),
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(color: Color(0xFFE2E8F0)),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(icon, style: const TextStyle(fontSize: 24)),
                const SizedBox(height: 8),
                Text(
                  title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 14, color: Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> msg, bool isUser) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isUser) ...[
            CircleAvatar(
              backgroundColor: Color(0xFFE3F2FD),
              radius: 20, child: const Text('🤖', style: TextStyle(fontSize: 16)),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isUser ? Color(0xFF00BCD4) : Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(isUser ? 16 : 0),
                  bottomRight: Radius.circular(isUser ? 0 : 16),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 5,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Text(
                msg['content'],
                style: TextStyle(
                  color: isUser ? Colors.white : Color(0xFF1E293B),
                  fontSize: 14, height: 1.5,
                ),
              ),
            ),
          ),
          if (isUser) ...[
            const SizedBox(width: 8),
            CircleAvatar(
              backgroundColor: Color(0xFF042444),
              radius: 20, child: Icon(LucideLucideLucideIcons.user, size: 20, color: Theme.of(context).cardColor,),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            backgroundColor: Color(0xFFE3F2FD),
            radius: 20, child: const Text('🤖', style: TextStyle(fontSize: 16)),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
                bottomRight: Radius.circular(16),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 5,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildDot(0),
                _buildDot(150),
                _buildDot(300),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDot(int delay) {
    return TweenAnimationBuilder(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeInOutSine,
      builder: (context, double value, child) {
        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 2),
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: Color(0xFF00BCD4).withValues(alpha: 0.4 + (value * 0.6)),
            shape: BoxShape.circle,
          ),
        );
      },
    );
  }
}
