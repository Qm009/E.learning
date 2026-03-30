// Fichier centralisé pour la configuration de l'API
// En production (Vercel), VITE_API_BASE_URL sera défini dans les environnement variables Vercel
// En développement, on utilise localhost:5050
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

export default API_BASE_URL;
