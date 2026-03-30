import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io' show File;
import 'package:flutter/foundation.dart' show kIsWeb;
import '../utils/api_config.dart';
import '../utils/auth_service.dart';
import 'package:lucide_icons/lucide_icons.dart';


class CreateCourseScreen extends StatefulWidget {
  const CreateCourseScreen({super.key});

  @override
  State<CreateCourseScreen> createState() => _CreateCourseScreenState();
}

class _CreateCourseScreenState extends State<CreateCourseScreen> {
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _categoryController = TextEditingController();
  final _durationController = TextEditingController();
  final List<Map<String, dynamic>> _chapters = [];
  XFile? _selectedImage;
  bool _isLoading = false;

  // Premium Colors
  static const Color kSlate900 = Color(0xFF0F172A);
  static const Color kIndigo600 = Color(0xFF4F46E5);
  static const Color kSlate50 = Color(0xFFF8FAFC);
  static const Color kSlate400 = Color(0xFF94A3B8);
  static const Color kSlate200 = Color(0xFFE2E8F0);

  Future<void> _pickImage() async {
    try {
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(source: ImageSource.gallery);
      
      if (pickedFile != null) {
        setState(() {
          _selectedImage = pickedFile;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking image: $e')),
      );
    }
  }

  void _addChapter() {
    setState(() {
      _chapters.add({
        'title': '',
        'content': '',
        'duration': '',
      });
    });
  }

  void _removeChapter(int index) {
    setState(() {
      _chapters.removeAt(index);
    });
  }

  void _updateChapter(int index, String field, String value) {
    setState(() {
      _chapters[index][field] = value;
    });
  }

  void _createCourse() async {
    if (_titleController.text.isEmpty || 
        _descriptionController.text.isEmpty ||
        _durationController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all required fields'), backgroundColor: Colors.orangeAccent),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final headers = await AuthService.getAuthHeaders();
      var request = http.MultipartRequest('POST', Uri.parse(ApiConfig.coursesUrl));
      request.headers.addAll(headers);

      request.fields['title'] = _titleController.text;
      request.fields['description'] = _descriptionController.text;
      request.fields['category'] = _categoryController.text;
      request.fields['duration'] = _durationController.text;
      request.fields['chapters'] = jsonEncode(_chapters);

      if (_selectedImage != null) {
        if (kIsWeb) {
          final bytes = await _selectedImage!.readAsBytes();
          request.files.add(http.MultipartFile.fromBytes('image', bytes, filename: _selectedImage!.name));
        } else {
          request.files.add(await http.MultipartFile.fromPath('image', _selectedImage!.path));
        }
      }

      final response = await request.send();
      
      if (response.statusCode == 201) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Course published successfully! 🎉'), backgroundColor: Colors.green));
          Navigator.pop(context);
        }
      } else {
        final responseData = await response.stream.bytesToString();
        _showError('Upload failed: $responseData');
      }
    } catch (e) {
      _showError('Error: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showError(String m) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(m), backgroundColor: Colors.redAccent));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kSlate50, appBar: AppBar(
        
        elevation: 0,
        title: Text('Course Builder', style: TextStyle(color: kSlate900, fontWeight: FontWeight.w800, fontSize: 18)),
        leading: IconButton(
          icon: Icon(LucideLucideLucideIcons.xRounded, color: kSlate900),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildImagePicker(),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionHeader('Core Details'),
                  const SizedBox(height: 16),
                  _buildModernField(_titleController, 'Course Title', LucideLucideIcons.titleRounded),
                  const SizedBox(height: 16),
                  _buildModernField(_categoryController, 'Category', LucideLucideLucideIcons.layoutGrid_rounded),
                  const SizedBox(height: 16),
                  _buildModernField(_durationController, 'Total Duration', LucideLucideLucideLucideIcons.timerRounded),
                  const SizedBox(height: 16),
                  _buildModernField(_descriptionController, 'Description', LucideLucideIcons.descriptionRounded, maxLines: 4),
                  
                  const SizedBox(height: 40),
                  _buildChapterSection(),
                  
                  const SizedBox(height: 60),
                  _buildPublishButton(),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImagePicker() {
    return GestureDetector(
      onTap: _pickImage,
      child: Container(
        width: double.infinity,
        height: 2, decoration: BoxDecoration(
          color: kSlate900, image: _selectedImage != null
              ? DecorationImage(
                  image: kIsWeb ? NetworkImage(_selectedImage!.path) : FileImage(File(_selectedImage!.path)) as ImageProvider,
                  fit: BoxFit.cover,
                  colorFilter: ColorFilter.mode(Colors.black.withValues(alpha: 0.4), BlendMode.darken),
                )
              : null,
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(LucideLucideLucideIcons.plusPhotoAlternateRounded, color: Colors.black.withValues(alpha: 0.8), size: 48),
              const SizedBox(height: 12),
              Text(
                'Add Course Thumbnail',
                style: TextStyle(color: Colors.black.withValues(alpha: 0.8), fontSize: 14, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String t) {
    return Text(t, style: TextStyle(color: kSlate900, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: -0.5));
  }

  Widget _buildModernField(TextEditingController c, String h, IconData i, {int maxLines = 1}) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: kSlate900.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: TextField(
        controller: c,
        maxLines: maxLines,
        style: TextStyle(color: kSlate900, fontWeight: FontWeight.w600),
        decoration: InputDecoration(
          prefixIcon: Icon(i, color: kIndigo600.withValues(alpha: 0.4), size: 20),
          hintText: h,
          hintStyle: TextStyle(color: kSlate400.withValues(alpha: 0.6), fontSize: 14),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.all(20),
        ),
      ),
    );
  }

  Widget _buildChapterSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildSectionHeader('Curriculum'),
            TextButton.icon(
              onPressed: _addChapter,
              icon: Icon(LucideLucideLucideIcons.plusCircleOutline, color: kIndigo600),
              label: Text('Add Chapter', style: TextStyle(color: kIndigo600, fontWeight: FontWeight.w800)),
            ),
          ],
        ),
        if (_chapters.isEmpty)
          Container(
            padding: const EdgeInsets.all(30),
            width: double.infinity,
            decoration: BoxDecoration(color: Theme.of(context).cardColor, borderRadius: BorderRadius.circular(24)),
            child: Center(child: Text('No chapters added yet.', style: TextStyle(color: kSlate400, fontWeight: FontWeight.w500))),
          )
        else
          ..._chapters.asMap().entries.map((entry) => _buildModernChapterItem(entry.key, entry.value)).toList(),
      ],
    );
  }

  Widget _buildModernChapterItem(int index, Map<String, dynamic> chapter) {
    return Container(
      margin: const EdgeInsets.only(top: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: kIndigo600.withValues(alpha: 0.05)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Chapter ${index + 1}', style: TextStyle(color: kIndigo600, fontWeight: FontWeight.w900, fontSize: 16)),
              IconButton(onPressed: () => _removeChapter(index), icon: const Icon(LucideLucideLucideIcons.trashRounded, color: Colors.redAccent, size: 20)),
            ],
          ),
          const SizedBox(height: 12),
          _buildChapterField(index, 'title', 'Chapter Title'),
          const SizedBox(height: 12),
          _buildChapterField(index, 'content', 'Objective / Description', maxLines: 2),
          const SizedBox(height: 12),
          _buildChapterField(index, 'duration', 'Duration (e.g. 15, m)'),
        ],
      ),
    );
  }

  Widget _buildChapterField(int index, String field, String hint, {int maxLines = 1}) {
    return Container(
      decoration: BoxDecoration(color: kSlate200, borderRadius: BorderRadius.circular(14)),
      child: TextField(
        onChanged: (v) => _updateChapter(index, field, v),
        maxLines: maxLines,
        style: TextStyle(color: kSlate900, fontSize: 14, fontWeight: FontWeight.w600),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: TextStyle(color: kSlate400.withValues(alpha: 0.6), fontSize: 13),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 12),
        ),
      ),
    );
  }

  Widget _buildPublishButton() {
    return SizedBox(
      width: double.infinity,
      child: GestureDetector(
        onTap: _isLoading ? null : _createCourse,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 20),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            gradient: LinearGradient(colors: [kSlate900, kIndigo600]),
            boxShadow: [BoxShadow(color: kIndigo600.withValues(alpha: 0.3), blurRadius: 10, offset: const Offset(0, 8))],
          ),
          child: Center(
            child: _isLoading
                ? SizedBox(height: 10, width: 100, child: CircularProgressIndicator(color: Theme.of(context).cardColor, strokeWidth: 3))
                : Text('Publish Course', style: TextStyle(color: Theme.of(context).cardColor, fontWeight: FontWeight.w900, fontSize: 16)),
          ),
        ),
      ),
    );
  }
}
