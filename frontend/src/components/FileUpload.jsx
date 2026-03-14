import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onFileUploaded, onFileRemoved, uploadedFiles, maxFiles = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`Vous ne pouvez uploader que ${maxFiles} fichiers maximum`);
      return;
    }

    // Vérifier la taille des fichiers (10MB max)
    const maxSize = 10 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError('Certains fichiers dépassent la taille maximale de 10MB');
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('token');
      
      // Uploader TOUS les fichiers en UNE SEULE requête
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post('http://localhost:5000/api/upload/course-files', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          // Calculer la progression par fichier, pas globale
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      if (response.data.files && response.data.files.length > 0) {
        // Ajouter TOUS les fichiers uploadés
        response.data.files.forEach(file => {
          onFileUploaded(file);
        });
      }

      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);

    } catch (err) {
      console.error('❌ Error uploading files:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'upload');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = async (file) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5000/api/upload/file/${file.filename}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      onFileRemoved(file);
    } catch (err) {
      console.error('❌ Error removing file:', err);
      setError('Erreur lors de la suppression du fichier');
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return '🖼️';
    } else if (mimeType.includes('pdf')) {
      return '📄';
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return '📝';
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return '📊';
    } else if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
      return '📽️';
    } else if (mimeType.includes('zip') || mimeType.includes('rar')) {
      return '🗜️';
    } else {
      return '📁';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload">
      <div className="upload-area">
        <input
          type="file"
          id="file-upload"
          multiple
          onChange={handleFileSelect}
          disabled={uploading}
          accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload" className={`upload-label ${uploading ? 'disabled' : ''}`}>
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            {uploading ? 'Upload en cours...' : 'Cliquez pour ajouter des fichiers'}
          </div>
          <div className="upload-hint">
            Images, PDF, Word, Excel, PowerPoint, ZIP (max 10MB)
          </div>
        </label>
        
        {uploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="progress-text">{uploadProgress}%</div>
          </div>
        )}
        
        {error && (
          <div className="upload-error">
            ❌ {error}
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Fichiers uploadés ({uploadedFiles.length}/{maxFiles})</h4>
          <div className="files-list">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  <span className="file-icon">{getFileIcon(file.mimeType)}</span>
                  <div className="file-details">
                    <div className="file-name">{file.originalName}</div>
                    <div className="file-meta">
                      {formatFileSize(file.size)} • {file.type}
                    </div>
                  </div>
                </div>
                <button 
                  className="remove-file-btn"
                  onClick={() => handleRemoveFile(file)}
                  title="Supprimer le fichier"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .file-upload {
          margin: 1rem 0;
        }

        .upload-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          transition: border-color 0.3s ease;
        }

        .upload-area:hover {
          border-color: #007bff;
        }

        .upload-label {
          cursor: pointer;
          display: block;
        }

        .upload-label.disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .upload-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .upload-hint {
          font-size: 0.9rem;
          color: #666;
        }

        .upload-progress {
          margin-top: 1rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #007bff;
          transition: width 0.3s ease;
        }

        .progress-text {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }

        .upload-error {
          margin-top: 1rem;
          padding: 0.75rem;
          background: #f8d7da;
          color: #721c24;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .uploaded-files {
          margin-top: 1.5rem;
        }

        .uploaded-files h4 {
          margin-bottom: 1rem;
          color: #333;
        }

        .files-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .file-icon {
          font-size: 1.5rem;
        }

        .file-details {
          flex: 1;
        }

        .file-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .file-meta {
          font-size: 0.8rem;
          color: #666;
        }

        .remove-file-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .remove-file-btn:hover {
          background: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default FileUpload;
