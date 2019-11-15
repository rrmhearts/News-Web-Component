class NewsArticle extends HTMLElement {
  constructor() {
    super();
    // using shadow dom before real dom. improves dom updates.
    this.root = this.attachShadow({ mode: 'open' });
  }
  set article(article) {
    // inline style is required when using shadow dom.
    this.root.innerHTML = `
          <style>
           h2 {
            font-family: Georgia, 'Times New Roman', Times, serif;
          }
          
           a,
           a:visited {
            text-decoration: none;
            color: inherit;
          }
          
           img {
            width: 100%;
          }
          </style>
          <a href="${article.url}">
            <h2>${article.title}</h2>
            <img src="${article.urlToImage ? article.urlToImage : ''}">
            <p>${article.description}</p>
          </a>`; // component structure for a news story. article come from index.js getNews
  }
}
// define custom element called "news-article"
customElements.define('news-article', NewsArticle);
