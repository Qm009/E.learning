import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Courses.css';

const ChapterDetail = () => {
  const { courseId, chapterIndex } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/courses/${courseId}`);
        if (res.data && res.data._id) {
          setCourse(res.data);
          if (res.data.lessons && res.data.lessons[chapterIndex]) {
            setChapter(res.data.lessons[chapterIndex]);
          }
        }
      } catch (err) {
        console.error('Failed to load course, falling back to demo:', err);
        // fallback demo with detailed content
        const demoLessons = [
          {
            title: 'Introduction Fundamentals',
            content: `This comprehensive introduction covers all the foundational concepts you need to get started. In this lesson, we explore the basic principles that underpin the entire subject matter. Understanding these fundamentals is crucial for your success in advanced topics.\n\nWe begin with a historical perspective, examining how this field has evolved over time. You'll learn about key milestones and breakthrough moments that shaped the discipline. This context helps you appreciate the current state of the field and why certain approaches are preferred.\n\nNext, we'll establish essential terminology and concepts. Clear definitions ensure we're all speaking the same language as we progress through the curriculum. Pay special attention to these foundational terms, as they'll appear repeatedly in more complex topics.\n\nThroughout this lesson, we'll use real-world examples to illustrate abstract concepts. These practical applications help bridge the gap between theory and practice. By the end of this section, you should be able to explain core concepts to others and understand how they apply in professional settings.`
          },
          {
            title: 'Core Concepts and Theory',
            content: `Building on the foundation established in the previous lesson, we now dive deeper into the theoretical frameworks that support this field. These concepts form the backbone of professional practice and advanced applications.\n\nWe'll examine several interconnected theories that explain how systems work at a fundamental level. Each theory provides a unique perspective, and together they create a comprehensive understanding. Don't feel pressured to memorize everything on your first read-through; understanding the relationships between concepts is more important.\n\nThis lesson includes several case studies demonstrating theory in action. Real organizations use these frameworks to solve complex problems and improve their operations. As you study each case, try to identify which theoretical concepts apply and how they guide decision-making.\n\nWe also explore common misconceptions about these concepts. Understanding what these ideas are NOT is just as important as knowing what they are. This helps you avoid typical pitfalls and apply concepts correctly in your own work.`
          },
          {
            title: 'Practical Application Methods',
            content: `Theory becomes powerful when applied effectively. This lesson focuses on practical methodologies you can use in real-world situations. We'll explore step-by-step processes that professionals use to implement concepts in professional environments.\n\nYou'll learn multiple approaches to problem-solving within this field. Different situations call for different methods, so we'll examine when to use each approach and why certain methods are better suited for specific scenarios. This flexibility is what separates novices from experienced professionals.\n\nThroughout this lesson, we'll work through detailed examples demonstrating each methodology. Following along carefully and trying to predict the next steps before reading them enhances your learning. After completing this lesson, you should feel confident applying these methods to new situations.\n\nWe also discuss common pitfalls and how to avoid them. Learning from mistakes others have made saves you time and resources in your own projects. Pay attention to the warning signs that indicate a particular approach may not be working as expected.`
          },
          {
            title: 'Advanced Topics and Integration',
            content: `Now that you've mastered the fundamentals and practical methods, we explore advanced applications that integrate multiple concepts. This is where you develop the expertise of seasoned professionals in the field.\n\nAdvanced topics build on everything you've learned previously. You should feel comfortable referring back to earlier lessons as you encounter references to foundational concepts. The beauty of a well-designed curriculum is that everything connects together coherently.\n\nThis lesson introduces sophisticated techniques used by industry leaders. These approaches often represent the cutting edge of current practice. By learning these techniques, you position yourself at the forefront of your profession.\n\nWe also consider emerging trends and future directions for the field. Understanding where the industry is headed helps you anticipate changes and prepare accordingly. This forward-thinking perspective transforms you from a competent practitioner into a true expert.\n\nFinal projects in this section challenge you to synthesize everything you've learned. These capstone activities demonstrate genuine mastery of the material and prepare you for independent professional work.`
          },
          {
            title: 'Implementation and Best Practices',
            content: `Making the transition from learning to doing requires understanding best practices developed by thousands of professionals. This lesson codifies these practices to help you hit the ground running in professional environments.\n\nBest practices represent proven approaches that consistently deliver superior results. Rather than discovering solutions through trial and error, you benefit from the collective wisdom of your profession. Adopting these practices accelerates your path to excellence.\n\nWe examine frameworks used by leading organizations worldwide. These frameworks provide structure and consistency to complex processes. Understanding why these frameworks succeed helps you adapt them successfully in your own environment.\n\nThis lesson also addresses quality assurance and continuous improvement. The best professionals constantly refine their approaches based on results and feedback. We'll explore metrics and assessment methods that help you evaluate your own performance.\n\nWe conclude with guidance on ongoing professional development. This field evolves constantly, and maintaining expertise requires commitment to continuous learning. We'll provide resources and strategies for staying current as the field advances, ensuring your skills remain valuable throughout your career.`
          }
        ];
        
        setCourse({
          _id: courseId,
          title: 'Demo Course',
          lessons: demoLessons,
        });
        setChapter(demoLessons[parseInt(chapterIndex)] || demoLessons[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, chapterIndex]);

  if (loading) {
    return (
      <div className="courses-page">
        <div className="courses-section">
          <div className="container-lg">
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading chapter...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div className="container-lg">
          <h1>{course?.title || 'Course'}</h1>
          <p>Chapter {parseInt(chapterIndex) + 1}: {chapter?.title}</p>
        </div>
      </div>

      <div className="courses-section">
        <div className="container-lg">
          <div className="chapter-content">
            <h2>{chapter?.title}</h2>
            <div className="chapter-text">
              <p>{chapter?.content}</p>
            </div>
            <div className="chapter-navigation">
              {parseInt(chapterIndex) > 0 && (
                <a href={`/courses/${courseId}/chapter/${parseInt(chapterIndex) - 1}`} className="btn btn-outline">
                  Previous Chapter
                </a>
              )}
              {course?.lessons && parseInt(chapterIndex) < course.lessons.length - 1 && (
                <a href={`/courses/${courseId}/chapter/${parseInt(chapterIndex) + 1}`} className="btn btn-primary">
                  Next Chapter
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetail;