
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// URL de l'API The Movie DataBase
const API_KEY = 'fa672a1157087dc857a545e8d42b51a3';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const moviesContainer = document.getElementById('movies-container');
const moviePopup = document.getElementById('movie-popup');
const closePopup = document.getElementById('close-popup');
const showCommentForm = document.getElementById('show-comment-form');
const commentForm = document.getElementById('comment-form');
const submitComment = document.getElementById('submit-comment');

// Rexupération des films depuis l'API
function getMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            displayMovies(data.results);
        })
        .catch(err => console.error('Erreur lors de la récupération des films:', err));
}

// Affichage des films
function displayMovies(movies) {
    moviesContainer.innerHTML = ''; 
    movies.forEach(movie => {
        const { title, poster_path, id, overview } = movie;

        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : 'http://via.placeholder.com/1080x1580'}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
            </div>
        `;
        moviesContainer.appendChild(movieElement);

        // Affiche de la description du film recupérer depuis l'API
        movieElement.addEventListener('click', () => {
            openMoviePopup(title, overview);
        });
    });
}

function openMoviePopup(title, description) {
    document.getElementById('popup-title').textContent = title;
    document.getElementById('popup-description').textContent = description;
    moviePopup.style.display = 'flex'; 
}


closePopup.addEventListener('click', () => {
    moviePopup.style.display = 'none';
});

getMovies(API_URL);

//formulaire de commentaire
showCommentForm.addEventListener('click', () => {
    commentForm.style.display = 'block'; 
});

// Configuration Firebase
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};

// Initialisation de Firebase et firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

submitComment.addEventListener('click', async () => {
  const comment = document.getElementById('comment-text').value;
  if (comment) {
      try {
          // Enregistrement du commentaire
          await addDoc(collection(db, 'comments'), {
              movieTitle: document.getElementById('popup-title').textContent,
              comment: comment,
              timestamp: serverTimestamp()
          });
          console.log('Commentaire soumis avec succès:', comment);
          document.getElementById('comment-text').value = '';
          commentForm.style.display = 'none';
      } catch (err) {
          console.error('Erreur lors de la soumission du commentaire:', err);
      }
  } else {
      alert('Veuillez écrire un commentaire.');
  }
});



