import './news-article.js';
import { topHeadlinesUrl } from './newsApi.js';

window.addEventListener('load', () => {
  getNews();
  registerSW();
});

async function getNews() {
  const res = await fetch(topHeadlinesUrl);
  const json = await res.json();

  // Main section of index.html is selected
  const main = document.querySelector('main');

  // For each article fetched, create new Web component element and append as child to main!
  json.articles.forEach(article => {
    const el = document.createElement('news-article');
    el.article = article;
    main.appendChild(el);
  });
}

/* Register service worker. Permits an offline experience! Watches page, works on actions in background.
 Could include notifications and background sync. Here it allows offline content.
 This is boilerplate setup.
 */
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (e) {
      console.log(`SW registration failed`);
    }
  }
}
/*

The Web Workers specification defines an API for spawning background scripts in your web application.
Web Workers allow you to do things like fire up long-running scripts to handle computationally 
intensive tasks, but without blocking the UI or other scripts to handle user interactions. They're 
going to help put and end to that nasty 'unresponsive script' dialog that we've all come to love:
*/