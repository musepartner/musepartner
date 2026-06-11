const SITE_LINKS = {
  scholar: "https://scholar.google.com/citations?hl=en&user=j9ICsOEAAAAJ",
  quantumByte: "https://quantumbyte.ai/"
};

const BLOG_POSTS = [
  {
    title: "Opening Notes on Muse Partner",
    date: "2026-06-10",
    category: "AI",
    excerpt: "A short note on the site as a public home for AI essays, research notes, and software experiments."
  },
  {
    title: "Research Notes Archive",
    date: "2026-06-10",
    category: "Research Notes",
    excerpt: "A placeholder for concise research notes that are useful enough to keep public and easy to reference."
  }
];

function pageName() {
  return document.body.dataset.page || "home";
}

function renderHeader() {
  const current = pageName();
  const header = document.querySelector('[data-component="site-header"]');

  if (!header) return;

  const navItems = [
    { label: "Blog", href: "blog.html", page: "blog" },
    { label: "Research", href: "research.html", page: "research" },
    { label: "About", href: "about.html", page: "about" }
  ];

  header.innerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="index.html" aria-label="Muse Partner home">
          <span class="brand-mark" aria-hidden="true">MP</span>
          <span class="brand-name">Muse Partner</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open navigation">
          <span class="nav-toggle-lines" aria-hidden="true"></span>
        </button>
        <nav class="nav" id="site-nav" aria-label="Main navigation">
          ${navItems.map((item) => `
            <a href="${item.href}"${current === item.page ? ' aria-current="page"' : ""}>${item.label}</a>
          `).join("")}
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  const footer = document.querySelector('[data-component="site-footer"]');

  if (!footer) return;

  footer.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-copy">
          <p>&copy; 2026 Muse Partner</p>
        </div>
        <div class="footer-links" aria-label="Footer links">
          <a href="${SITE_LINKS.scholar}" rel="noopener noreferrer">Google Scholar</a>
          <span aria-hidden="true">&middot;</span>
          <a href="${SITE_LINKS.quantumByte}" rel="noopener noreferrer">QuantumByte.ai</a>
          <span aria-hidden="true">&middot;</span>
          <a href="blog.html">Blog</a>
        </div>
      </div>
    </footer>
  `;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function postCard(post, headingLevel = "h2") {
  const heading = headingLevel === "h3" ? "h3" : "h2";
  const tag = post.url ? "a" : "article";
  const href = post.url ? ` href="${post.url}"` : "";

  return `
    <${tag} class="post-card"${href} data-category="${post.category}">
      <div class="post-meta">
        <time datetime="${post.date}">${formatDate(post.date)}</time>
        <span aria-hidden="true">/</span>
        <span class="post-category">${post.category}</span>
      </div>
      <${heading}>${post.title}</${heading}>
      <p>${post.excerpt}</p>
    </${tag}>
  `;
}

function renderPosts() {
  const fullList = document.querySelector("[data-posts]");
  const previewList = document.querySelector("[data-posts-preview]");

  if (fullList) {
    fullList.innerHTML = BLOG_POSTS.map((post) => postCard(post)).join("");
  }

  if (previewList) {
    const limit = Number(previewList.dataset.limit || 2);
    previewList.innerHTML = BLOG_POSTS.slice(0, limit).map((post) => postCard(post, "h3")).join("");
  }
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    });
  });
}

function setupCategoryFilters() {
  const buttons = document.querySelectorAll("[data-category-filter]");
  const posts = document.querySelectorAll("[data-category]");

  if (!buttons.length || !posts.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.categoryFilter;

      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      posts.forEach((post) => {
        const isVisible = category === "all" || post.dataset.category === category;
        post.hidden = !isVisible;
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderPosts();
  setupNavigation();
  setupCategoryFilters();
});
