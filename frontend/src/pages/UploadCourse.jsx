import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './UploadCourse.css';

const UploadCourse = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    image: '',
    lessons: [{ title: '', content: '', videoUrl: '' }]
  });
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
      lessons: [...prev.lessons, { title: '', content: '', videoUrl: '' }]
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const courseData = {
        ...formData,
        instructor: user._id,
        instructorName: user.name,
        price: parseFloat(formData.price) || 0
      };

      const response = await axios.post('http://localhost:5000/api/courses', courseData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMessage('Course uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        image: '',
        lessons: [{ title: '', content: '', videoUrl: '' }]
      });
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

                <div className="form-group">
                  <label htmlFor="image">Course Image URL</label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
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

              <button type="button" onClick={addLesson} className="add-lesson-btn">
                + Add Another Lesson
              </button>
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