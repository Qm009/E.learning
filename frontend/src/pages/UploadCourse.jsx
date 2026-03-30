import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../api';
import './UploadCourse.css';
import { Clipboard, X } from 'lucide-react';


const UploadCourse = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    lessons: [{ title: '', content: '', duration: '' }],
    files: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    'Development', 'Design', 'Data Science', 'Security', 'DevOps',
    'Gaming', 'Business', 'Marketing', 'Photography', 'Music'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLessonChange = (index, field, value) => {
    const updatedLessons = [...formData.lessons];
    updatedLessons[index][field] = value;
    setFormData(prev => ({
      ...prev,
      lessons: updatedLessons
    }));
  };

  const addLesson = () => {
    setFormData(prev => ({
      ...prev,
      lessons: [...prev.lessons, { title: '', content: '', duration: '' }]
    }));
  };

  const removeLesson = (index) => {
    if (formData.lessons.length > 1) {
      const updatedLessons = formData.lessons.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        lessons: updatedLessons
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: files
    }));
  };

  const removeFile = (index) => {
    const updatedFiles = formData.files.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      files: updatedFiles
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('instructor', user._id);
      data.append('lessons', JSON.stringify(formData.lessons));
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      // Ajouter les autres fichiers si nécessaire
      if (formData.files && formData.files.length > 0) {
        formData.files.forEach(file => {
          data.append('files', file);
        });
      }

      const response = await axios.post(`${API_BASE_URL}/api/courses`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMessage('Course uploaded successfully! 🎉');
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        lessons: [{ title: '', content: '', duration: '' }],
        files: []
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(error.response?.data?.message || 'Failed to upload course');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'instructor') {
    return (
      <div className="upload-course-page">
        <div className="container-lg">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>Only instructors can upload courses.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-course-page">
      <div className="upload-header">
        <div className="container-lg">
          <h1>Upload New Course</h1>
          <p>Share your knowledge with students worldwide</p>
        </div>
      </div>

      <div className="upload-section">
        <div className="container-lg">
          <form onSubmit={handleSubmit} className="upload-form">
            {message && (
              <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <div className="form-section">
              <h3>Course Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="title">Course Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter course title"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Course Thumbnail *</label>
                  <div className={`image-upload-container ${imagePreview ? 'has-image' : ''}`}>
                    {imagePreview ? (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button type="button" onClick={removeImage} className="remove-image-btn">
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="image-upload" className="image-upload-label">
                        <div className="upload-placeholder">
                          <i className="fas fa-image"></i>
                          <span>Click to upload course image</span>
                        </div>
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Course Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Describe what students will learn in this course"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Course Lessons</h3>
              {formData.lessons.map((lesson, index) => (
                <div key={index} className="lesson-item">
                  <div className="lesson-header">
                    <h4>Lesson {index + 1}</h4>
                    {formData.lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLesson(index)}
                        className="remove-lesson-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="lesson-form">
                    <div className="form-group">
                      <label>Lesson Title *</label>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                        required
                        placeholder="Enter lesson title"
                      />
                    </div>

                    <div className="form-group">
                      <label>Lesson Duration *</label>
                      <input
                        type="text"
                        value={lesson.duration}
                        onChange={(e) => handleLessonChange(index, 'duration', e.target.value)}
                        required
                        placeholder="e.g., 2 hours, 30 minutes"
                      />
                    </div>

                    <div className="form-group">
                      <label>Lesson Content *</label>
                      <textarea
                        value={lesson.content}
                        onChange={(e) => handleLessonChange(index, 'content', e.target.value)}
                        required
                        rows="6"
                        placeholder="Write detailed lesson content"
                      />
                    </div>

                    <div className="form-group">
                      <label>Video URL (optional)</label>
                      <input
                        type="url"
                        value={lesson.videoUrl}
                        onChange={(e) => handleLessonChange(index, 'videoUrl', e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section pour les fichiers */}
            <div className="form-section">
              <h3>📁 Course Files</h3>
              <div className="files-upload">
                <div className="form-group">
                  <label htmlFor="files">Upload Files (PDF, Images, Videos)</label>
                  <input
                    type="file"
                    id="files"
                    name="files"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <p className="file-help">
                    Supported formats: PDF, Images (JPG, PNG, GIF), Videos (MP4, AVI, MOV)
                  </p>
                </div>
                {formData.files && formData.files.length > 0 && (
                  <div className="files-list">
                    <h4><span className="icon-wrapper"><Clipboard size={18} /></span> Files to Upload ({formData.files.length})</h4>
                    {formData.files.map((file, index) => (
                      <div key={index} className="file-item">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="remove-file-btn"
                        >
                          <span className="icon-wrapper"><X size={18} /></span> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadCourse;