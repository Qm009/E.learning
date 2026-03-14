import './Specifications.css';

const Specifications = () => {
  const requirements = [
    {
      title: 'Teachers shall upload courses',
      icon: '📤',
      description: 'Instructors can easily create and upload comprehensive courses with multiple chapters, lessons, and multimedia content. Teachers have full control over their course curriculum, pricing, and scheduling. The platform supports various file formats and provides tools to organize content systematically for maximum student engagement.',
      details: [
        'Create course with detailed descriptions',
        'Upload video, audio, and document content',
        'Organize lessons and chapters hierarchically',
        'Set course pricing and enrollment limits',
        'Track student progress and engagement metrics',
        'Update course content in real-time'
      ]
    },
    {
      title: 'Students shall take quizzes',
      icon: '✏️',
      description: 'Students have access to comprehensive quizzes and assessments that test their knowledge and understanding of course material. Interactive quizzes provide immediate feedback, helping students identify areas for improvement. The platform supports multiple question types including multiple choice, short answers, and practical assignments.',
      details: [
        'Take multiple choice and essay quizzes',
        'Receive instant feedback on answers',
        'Retake quizzes to improve scores',
        'Access quiz history and performance',
        'Download certificates upon completion',
        'Track learning progress with analytics'
      ]
    },
    {
      title: 'System shall compute quiz scores',
      icon: '📊',
      description: 'The system automatically calculates and records quiz scores with precision and accuracy. Advanced algorithms ensure fair evaluation of student responses. Scores are computed instantly and can be reviewed by both students and instructors. The system maintains detailed performance records for comprehensive analytics and reporting.',
      details: [
        'Automatic score calculation and verification',
        'Support for weighted scoring systems',
        'Instant result generation and feedback',
        'Grade distribution and performance analytics',
        'Detailed score reports for educators',
        'Score history and trend analysis'
      ]
    },
    {
      title: 'Admin shall manage users',
      icon: '🔐',
      description: 'Administrators have complete control over user management, including registration, verification, role assignment, and account monitoring. Admins can enforce security policies, manage access levels, and ensure compliance with platform guidelines. The admin dashboard provides comprehensive tools for user analytics and system management.',
      details: [
        'Review and approve user registrations',
        'Assign roles: Student, Instructor, Admin',
        'Monitor user activity and engagement',
        'Enforce security and compliance policies',
        'Manage user accounts and permissions',
        'Generate comprehensive system reports'
      ]
    }
  ];

  return (
    <div className="specifications-page">
      {/* Header */}
      <div className="specs-header">
        <div className="container-lg">
          <h1>System Requirements & Features</h1>
          <p>Core functionalities that power EduPortal</p>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="specs-section">
        <div className="container-lg">
          <div className="specs-grid">
            {requirements.map((req, index) => (
              <div key={index} className="spec-card">
                <div className="spec-icon">{req.icon}</div>
                <h2>{req.title}</h2>
                <p className="spec-description">{req.description}</p>
                <div className="spec-details">
                  <h4>Key Features:</h4>
                  <ul>
                    {req.details.map((detail, i) => (
                      <li key={i}>
                        <span className="check-mark">✓</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Section */}
      <div className="integration-section">
        <div className="container-lg">
          <h2>How It All Works Together</h2>
          <div className="flow-diagram">
            <div className="flow-step">
              <div className="flow-number">1</div>
              <h3>Teacher Creates</h3>
              <p>Instructors upload comprehensive courses with structured content</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-number">2</div>
              <h3>Student Learns</h3>
              <p>Students browse and enroll in courses that match their learning goals</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-number">3</div>
              <h3>Assessment</h3>
              <p>Students complete quizzes to test their understanding</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-number">4</div>
              <h3>Admin Oversight</h3>
              <p>Admin monitors system for quality assurance and user management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <div className="container-lg">
          <h2>Why These Features Matter</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <h3>📚 Complete Learning Ecosystem</h3>
              <p>Everything needed for a comprehensive learning experience in one platform</p>
            </div>
            <div className="benefit-item">
              <h3>🎯 Quality Assurance</h3>
              <p>Admin oversight ensures content quality and user experience standards</p>
            </div>
            <div className="benefit-item">
              <h3>📈 Performance Tracking</h3>
              <p>Automated scoring and analytics help students track progress effectively</p>
            </div>
            <div className="benefit-item">
              <h3>🔒 Secure & Reliable</h3>
              <p>Robust system architecture ensures data security and platform stability</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specifications;
