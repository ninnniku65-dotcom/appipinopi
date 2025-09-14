/**
 * 共通ヘッダーを挿入します。
 */
function setupHeader() {
  const headerHTML = `
    <nav>
      <a href="index.html">HOME</a>
      <a href="event.html">EVENT</a>
      <a href="blog.html">BLOG</a>
      <a href="blog-tool.html">BLOG TOOL</a>
    </nav>
  `;
  const headerElement = document.getElementById('header');
  if (headerElement) {
    headerElement.innerHTML = headerHTML;
  }
}

/**
 * 共通フッターを挿入します。
 */
function setupFooter() {
  const footerElement = document.getElementById('footer');
  if (!footerElement) return;

  // ↓↓↓ ご自身のFormspreeのエンドポイントURLに書き換えてください ↓↓↓
  const formspreeURL = "https://formspree.io/f/mqadjrkk";
  // ↓↓↓ ご自身のYouTubeとX(Twitter)のURLに書き換えてください ↓↓↓
  const youtubeURL = "https://www.youtube.com/@appipinopi";
  const xURL = "https://x.com/@appipinopi";

  const footerHTML = `
    <form id="message-form" action="${formspreeURL}" method="POST">
      <input type="text" name="message" id="message-input" placeholder="応援メッセージ・依頼内容" required>
      <input type="email" name="email" id="email-input" placeholder="メールアドレス" required>
      <button type="submit">送信</button>
    </form>
    <div class="footer-links">
      <a href="https://github.com/appipinopi/IRIAM-Liver-Site_Template" target="_blank">ソースコード</a> |
      <a href="https://web.iriam.com/" target="_blank">IRIAM</a> |
      <a href="${youtubeURL}" target="_blank">YouTube</a> |
      <a href="${xURL}" target="_blank">X</a>
    </div>
  `;
  footerElement.innerHTML = footerHTML;

  // Formspree送信後のアラート
  const messageForm = document.getElementById('message-form');
  if (messageForm) {
    messageForm.addEventListener('submit', (e) => {
      // デフォルトの送信を少し遅らせて、非同期送信が完了するのを待つ
      e.preventDefault();
      fetch(formspreeURL, {
          method: 'POST',
          body: new FormData(messageForm),
          headers: {
              'Accept': 'application/json'
          }
      }).then(response => {
          if (response.ok) {
              alert('メッセージを送信しました！');
              messageForm.reset();
          } else {
              alert('メッセージの送信に失敗しました。');
          }
      }).catch(error => {
          alert('メッセージの送信中にエラーが発生しました。');
      });
    });
  }
}

/**
 * ブログ記事を `blog-posts.json` から読み込んで表示します。
 */
async function setupBlog() {
  const blogList = document.getElementById('blog-list');
  if (!blogList) return;

  try {
    const response = await fetch('js/blog-posts.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blogs = await response.json();

    blogList.innerHTML = blogs.map(post => `
      <div class="blog-post">
        ${post.icon ? `<img src="${post.icon}" alt="icon" class="blog-icon">` : ''}
        <div class="blog-post-content">
          <h3>${post.title}</h3>
          <small>${post.date}</small>
          <p>${post.content}</p>
        </div>
      </div>`
    ).join('');
  } catch (error) {
    console.error("ブログ記事の読み込みに失敗しました:", error);
    blogList.innerHTML = "<p>ブログ記事の読み込みに失敗しました。管理者にお問い合わせください。</p>";
  }
}

/**
 * X (旧Twitter) のタイムラインを埋め込みます。
 */
function setupXTimeline() {
  const timelineContainer = document.getElementById('x-timeline');
  if (!timelineContainer) return;

  // ↓↓↓ ご自身のXアカウントIDに置き換えてください（@は不要） ↓↓↓
  const xAccount = "appipinopi";

  timelineContainer.innerHTML = `<a class="twitter-timeline" data-height="400" href="https://x.com/${xAccount}">Tweets by ${xAccount}</a>`;

  // Twitterのウィジェットスクリプトが既に読み込まれていないか確認
  if (!window.twttr) {
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://platform.twitter.com/widgets.js";
    script.charset = "utf-8";
    document.body.appendChild(script);
  }
}

/**
 * ページの読み込みが完了したら各機能を初期化する
 */
document.addEventListener('DOMContentLoaded', () => {
  setupHeader();
  setupFooter();
  setupBlog();
  setupXTimeline();
});