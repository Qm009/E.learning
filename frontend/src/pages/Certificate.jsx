import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Certificate.css';
import { BookOpen, GraduationCap, Lightbulb } from 'lucide-react';


const Certificate = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simuler les données de certificat (remplacer par API réelle)
  const certificateData = {
    id: 'CERT-2024-001',
    studentName: user?.name || 'Étudiant',
    courseName: 'Développement Web Full-Stack',
    instructorName: 'Jean Dupont',
    completionDate: new Date().toLocaleDateString('fr-FR'),
    duration: '6 mois',
    grade: 'A',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
    certificateId: 'CERT-DEV-WEB-2024-001'
  };

  React.useEffect(() => {
    // Simuler le chargement des données de certificat
    setTimeout(() => {
      setCertificate(certificateData);
      setLoading(false);
    }, 1000);
  }, []);

  const downloadCertificate = () => {
    // Créer un certificat PDF à télécharger
    const certificateContent = generateCertificatePDF(certificateData);
    const blob = new Blob([certificateContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificat-${certificateData.courseName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareCertificate = () => {
    // Partager le certificat sur LinkedIn ou autres réseaux
    const shareText = `<span className="icon-wrapper"><GraduationCap size={18} /></span> J'ai obtenu ma certification en ${certificateData.courseName} !`;
    if (navigator.share) {
      navigator.share({
        title: 'Nouvelle Certification Obtenue',
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback : copier dans le presse-papiers
      navigator.clipboard.writeText(shareText);
      alert('Lien du certificat copié dans le presse-papiers !');
    }
  };

  const generateCertificatePDF = (data) => {
    // Génération simplifiée du contenu PDF (remplacer par une vraie librairie PDF)
    return `
      CERTIFICAT DE COMPLÉTION
      
      Ce certificat atteste que
      
      ${data.studentName}
      a complété avec succès le cours
      
      ${data.courseName}
      
      Sous la direction de ${data.instructorName}
      
      Durée: ${data.duration}
      Note: ${data.grade}
      Date d'achèvement: ${data.completionDate}
      
      Compétences acquises: ${data.skills.join(', ')}
      
      ID du certificat: ${data.certificateId}
      
      Ce certificat a été généré le ${new Date().toLocaleDateString('fr-FR')}
    `;
  };

  if (!user) {
    return (
      <div className="certificate-page">
        <div className="certificate-container">
          <div className="access-denied">
            <h2>🔒 Connexion Requise</h2>
            <p>Vous devez être connecté pour accéder à vos certificats.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Se Connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="certificate-page">
        <div className="certificate-container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement de votre certificat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="certificate-page">
      <div className="certificate-container">
        {/* Header */}
        <div className="certificate-header">
          <h1><span className="icon-wrapper"><GraduationCap size={18} /></span> Votre Certificat</h1>
          <p>Félicitations pour avoir complété votre formation !</p>
        </div>

        {/* Certificate Content */}
        <div className="certificate-content">
          <div className="certificate-paper">
            <div className="certificate-border">
              <div className="certificate-inner">
                <div className="certificate-title">
                  <h2>CERTIFICAT DE COMPLÉTION</h2>
                </div>
                
                <div className="certificate-info">
                  <div className="info-row">
                    <span className="label">Étudiant:</span>
                    <span className="value">{certificate.studentName}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Cours:</span>
                    <span className="value">{certificate.courseName}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Instructeur:</span>
                    <span className="value">{certificate.instructorName}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Durée:</span>
                    <span className="value">{certificate.duration}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Note:</span>
                    <span className="value grade">{certificate.grade}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Date d'achèvement:</span>
                    <span className="value">{certificate.completionDate}</span>
                  </div>
                </div>

                <div className="certificate-skills">
                  <h3>Compétences acquises:</h3>
                  <div className="skills-grid">
                    {certificate.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="certificate-id">
                  <p><strong>ID du certificat:</strong> {certificate.certificateId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="certificate-actions">
          <button 
            className="btn btn-primary btn-large"
            onClick={downloadCertificate}
          >
            📥 Télécharger le PDF
          </button>
          
          <button 
            className="btn btn-outline btn-large"
            onClick={shareCertificate}
          >
            📤 Partager
          </button>
          
          <button 
            className="btn btn-secondary btn-large"
            onClick={() => navigate('/courses')}
          >
            <span className="icon-wrapper"><BookOpen size={18} /></span> Voir d'autres cours
          </button>
        </div>

        {/* Footer Info */}
        <div className="certificate-footer">
          <p>
            <strong><span className="icon-wrapper"><Lightbulb size={18} /></span> Conseil:</strong> Ajoutez ce certificat à votre profil LinkedIn 
            pour valoriser vos nouvelles compétences !
          </p>
          <p>
            <small>
              Ce certificat a été généré le {new Date().toLocaleDateString('fr-FR')} 
              • ID unique: {certificate.certificateId}
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
