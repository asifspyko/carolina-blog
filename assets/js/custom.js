document.addEventListener('DOMContentLoaded', function () {
    var targetURL = 'https://picsum.photos/v2/list';

    // fetch from the target URL
    fetch(targetURL)
        .then(response => response.json())
        .then(data => {
            // cache the returned articles
            window.articles = data;

            // print/insert articles to DOM
            putArticles();
        })
        .catch(error => console.error(error))

    // document.querySelectorAll('.articles-nav-button').addEventListener('click', function(e) {
    //     this.css.display = 'none';
    // });

    document.querySelectorAll('.articles-nav-button').forEach(function(button) {
        button.addEventListener('click', function() {
            var offset = parseInt(document.querySelector('#articles-wrap').dataset.offset || 0);

            // determine if it's next or prev articles
            if (this.getAttribute('id') == 'articles-nav-prev' ) {
                offset = offset - 6;
            }

            putArticles(offset, true);
        });
    });
});

function putArticles(offset = 0, cycle = false, num = 3) {

    if (cycle && offset < 0) {
        offset = window.articles.length - 4;
    }

    if (offset < 0 || !num || window.articles.length < offset) {
        return;
    }

    // fetch articles wrapper
    var articlesWrap = document.querySelector('#articles-wrap');
    var hasNextArticle = true;

    // empty the articles wrapper
    while(articlesWrap.firstChild){
        articlesWrap.removeChild(articlesWrap.firstChild);
    }

    while (hasNextArticle) {
        var article = window.articles[offset];

        console.log(article);

        // prepare article markup
        var articleMarkup = `
            <div class="article-block">
                <div class="article-thumbnail">
                    <img src="${article.download_url}" alt="${article.author}">
                </div>
                <div class="article-content">
                    <h4>${article.author}</h4>
                </div>
            </div>
        `;

        // send the markup to DOM
        articlesWrap.appendChild(createElementFromHTML(articleMarkup));

        // increment offset for next article
        offset++;

        // decrement number of articles to print
        num--;

        // cycle the articles
        if (cycle && offset >= window.articles.length) {
            offset = 0;
        }

        // bail out if there's no further articles
        if (window.articles.length <= offset || !num) {
            hasNextArticle = false;
        }
    }

    // update current offset
    articlesWrap.dataset.offset = offset;
}

/*
<div class="article-block">
    <div class="article-thumbnail">
        <img src="assets/images/article1.png" alt="">
    </div>
    <div class="article-content">
        <h4>Monks & Yoga in Bali</h4>
    </div>
</div>
*/

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}