const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform';

const categoryVideos = {
    'flutter': [
        'https://www.youtube.com/watch?v=fq4N0hgOWzU',
        'https://www.youtube.com/watch?v=lVpT6SrkU8A',
        'https://www.youtube.com/watch?v=Zf00P8pL0y4'
    ],
    'web': [
        'https://www.youtube.com/watch?v=rzkO_r8qEIs',
        'https://www.youtube.com/watch?v=zJSY8tJYnC4',
        'https://www.youtube.com/watch?v=HcOc7P5BMi4'
    ],
    'data': [
        'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
        'https://www.youtube.com/watch?v=ua-CiDNNj30',
        'https://www.youtube.com/watch?v=dcqPhpQ7QHw'
    ],
    'cyber': [
        'https://www.youtube.com/watch?v=U_P2fR1Scyw',
        'https://www.youtube.com/watch?v=nzj7Wg4DAbs',
        'https://www.youtube.com/watch?v=in_vU_xGSh8'
    ],
    'ai': [
        'https://www.youtube.com/watch?v=5NgNicANyq4',
        'https://www.youtube.com/watch?v=aircAruvnKk',
        'https://www.youtube.com/watch?v=JMuLXrjyeHY'
    ],
    'universal': [
        'https://www.youtube.com/watch?v=7O472HY-xvQ',
        'https://www.youtube.com/watch?v=v_p82ZIn528',
        'https://www.youtube.com/watch?v=I-hW_O-x1iY'
    ]
};

const generateDynamicContent = (title, lessonNumber) => {
    const subjects = {
        'flutter': 'le développement mobile multiplateforme avec Flutter (Google)',
        'web': 'le développement web moderne et les architectures fullstack',
        'data': 'l\'analyse de données et le langage Python',
        'cyber': 'la protection des données et la cybersécurité offensive/défensive',
        'ai': 'l\'intelligence artificielle et les Large Language Models',
        'marketing': 'le marketing digital et la croissance en ligne',
        'agile': 'les méthodologies Agiles et la gestion de projet moderne'
    };

    let subject = 'votre domaine d\'expertise expert';
    for (let key in subjects) {
        if (title.toLowerCase().includes(key)) {
            subject = subjects[key];
            break;
        }
    }

    return `
# ${lessonNumber === 1 ? 'Module Fondamental' : 'Module Avancé'} : ${title}

Bienvenue dans cette leçon approfondie sur **${title}**. Nous allons explorer en détail les concepts de **${subject}**.

## Rappel Pédagogique
Ce texte constitue votre base de connaissance. Lisez-le attentivement pour comprendre la structure et la logique de **${title}**.

### Points clés abordés aujourd'hui :
- **Architecture de ${title}** : Comment les composants interagissent entre eux.
- **Mise en situation** : Cas d'études réels dans le domaine de **${subject}**.
- **Expertise** : Les secrets des professionnels pour maîtriser ${title} rapidement.

La vidéo ci-dessous est un support complémentaire sélectionné pour sa qualité pédagogique. Elle illustre les concepts de **${subject}** expliqués ci-dessus. [Contenu mis à jour en 2024]
    `;
};

const seedRichContent = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        const courses = await Course.find();
        
        let globalIndex = 0;
        for (let course of courses) {
            console.log(`Global Seeding 2024 for: ${course.title}`);
            const lowTitle = course.title.toLowerCase();
            
            let category = 'universal';
            if (lowTitle.includes('flutter')) category = 'flutter';
            else if (lowTitle.includes('web') || lowTitle.includes('html') || lowTitle.includes('js')) category = 'web';
            else if (lowTitle.includes('data') || lowTitle.includes('python')) category = 'data';
            else if (lowTitle.includes('cyber')) category = 'cyber';
            else if (lowTitle.includes('ai') || lowTitle.includes('intelligence')) category = 'ai';

            const videos = categoryVideos[category];

            course.lessons = [
                {
                    title: `1. Introduction Globale - ${course.title}`,
                    content: generateDynamicContent(course.title, 1),
                    videoUrl: videos[globalIndex % videos.length]
                },
                {
                    title: `2. Techniques de Pointe - ${course.title}`,
                    content: generateDynamicContent(course.title, 2),
                    videoUrl: videos[(globalIndex + 1) % videos.length]
                }
            ];

            await course.save();
            globalIndex++;
        }

        console.log('Seed completed successfully with FRESH 2024 VIDEOS!');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seedRichContent();
