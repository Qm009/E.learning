import React from 'react';
import './CertifiedDegree.css';

const CertifiedDegree = () => {
  return (
    <div className="certified-degree-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Certified Degrees</h1>
            <p>Obtenez des certifications reconnues pour faire progresser votre carrière</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">5000+</span>
                <span className="stat-label">Certifiés</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">Taux de réussite</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">150+</span>
                <span className="stat-label">Partenaires</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <div className="certification-icon">🎓</div>
              <span>Certifications Professionnelles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <div className="programs-section">
        <div className="container">
          <h2>Nos Programmes de Certification</h2>
          <div className="programs-grid">
            <div className="program-card">
              <div className="program-icon">💻</div>
              <h3>Développement Web</h3>
              <p>Devenez expert en développement web full-stack avec les technologies les plus demandées.</p>
              <div className="program-details">
                <span className="duration">6 mois</span>
                <span className="level">Intermédiaire</span>
                <span className="price">Gratuit</span>
              </div>
              <button className="btn btn-primary">Commencer</button>
            </div>

            <div className="program-card">
              <div className="program-icon">📊</div>
              <h3>Data Science</h3>
              <p>Maîtrisez l'analyse de données, le machine learning et l'intelligence artificielle.</p>
              <div className="program-details">
                <span className="duration">8 mois</span>
                <span className="level">Avancé</span>
                <span className="price">Gratuit</span>
              </div>
              <button className="btn btn-primary">Commencer</button>
            </div>

            <div className="program-card">
              <div className="program-icon">🎨</div>
              <h3>Design UI/UX</h3>
              <p>Apprenez à créer des interfaces magnifiques et des expériences utilisateur intuitives.</p>
              <div className="program-details">
                <span className="duration">4 mois</span>
                <span className="level">Débutant</span>
                <span className="price">Gratuit</span>
              </div>
              <button className="btn btn-primary">Commencer</button>
            </div>

            <div className="program-card">
              <div className="program-icon">☁️</div>
              <h3>Cloud Computing</h3>
              <p>Expertisez-vous sur les plateformes cloud comme AWS, Azure et Google Cloud.</p>
              <div className="program-details">
                <span className="duration">5 mois</span>
                <span className="level">Intermédiaire</span>
                <span className="price">Gratuit</span>
              </div>
              <button className="btn btn-primary">Commencer</button>
            </div>

            <div className="program-card">
              <div className="program-icon">🔒</div>
              <h3>Cybersécurité</h3>
              <p>Protégez les systèmes contre les menaces cybernétiques avec les meilleures pratiques.</p>
              <div className="program-details">
                <span className="duration">7 mois</span>
                <span className="level">Avancé</span>
                <span className="price">Gratuit</span>
              </div>
              <button className="btn btn-primary">Commencer</button>
            </div>

            <div className="program-card">
              <div className="program-icon">📱</div>
              <h3>Développement Mobile</h3>
              <p>Créez des applications mobiles natives pour iOS et Android avec React Native et Flutter.</p>
              <div className="program-details">
                <span className="duration">6 mois</span>
                <span className="level">Intermédiaire</span>
                <span className="price">Gratuit</span>
              </div>
              <button className="btn btn-primary">Commencer</button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <div className="container">
          <h2>Pourquoi choisir nos certifications ?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🏆</div>
              <h3>Reconnu Mondialement</h3>
              <p>Nos certifications sont reconnues par les plus grandes entreprises technologiques.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <h3>Pratique</h3>
              <p>Projets réels et études de cas pour une expérience concrète.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">👨‍🏫</div>
              <h3>Experts</h3>
              <p>Apprenez avec des instructeurs experts de l'industrie.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔄</div>
              <h3>Mise à jour</h3>
              <p>Contenu régulièrement mis à jour avec les dernières technologies.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🤝</div>
              <h3>Support</h3>
              <p>Support 24/7 et communauté active d'apprenants.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Prêt à commencer votre parcours ?</h2>
            <p>Rejoignez des milliers d'apprenants et obtenez votre certification dès aujourd'hui.</p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-large">Commencer Maintenant</button>
              <button className="btn btn-outline btn-large">En Savoir Plus</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertifiedDegree;
