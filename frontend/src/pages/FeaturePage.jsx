import './Home.css';

const FeaturePage = ({ title, description, icon }) => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-description">{description}</p>
          <a href="/courses" className="btn btn-primary btn-lg">
            Explore Courses
          </a>
        </div>
        <div className="hero-image">
          <div className="hero-image-placeholder">
            <div className="hero-icon">{icon}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturePage;