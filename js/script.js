const dataUrl = './data.json';
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');
const heroButtons = document.getElementById('hero-buttons');
const heroSection = document.getElementById('hero-section');
const infoSection = document.getElementById('info-section');
const infoTitle = document.getElementById('info-title');
const infoCards = document.querySelector('.info-cards');
const pageSection = document.getElementById('page-section');
const sectionTitle = document.getElementById('section-title');
const sectionText = document.getElementById('section-text');
const sectionDetails = document.getElementById('section-details');
const navLinks = document.querySelectorAll('[data-page].nav-link');

const mockupSection = document.getElementById('mockup-section');
const mockupTitle = document.getElementById('mockup-title');
const mockupSubtitle = document.getElementById('mockup-subtitle');
const mockupImageContainer = document.getElementById('mockup-image-container');

let siteData = null;

async function loadSiteData() {
  try {
    const response = await fetch(dataUrl);
    siteData = await response.json();
  } catch (error) {
    console.error('Failed to load site data:', error);
  }
}

function createButton(item) {
  const button = document.createElement('a');
  button.className = item.type === 'primary' ? 'btn-primary' : 'btn-secondary';
  button.textContent = item.label;
  
  // 1. Force a clean absolute URL to prevent 404s from relative pathing
  if (item.href) {
    try {
      const url = new URL(item.href);
      button.href = url.href;
    } catch (e) {
      button.href = item.href; // Fallback if it's already a string
    }
  } else {
    button.href = '#';
  }

  // 2. Standardize target handling
  if (item.href && item.href.startsWith('http')) {
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    
    // 3. Optional: Prevent "bubbling" issues that cause channel errors
    button.addEventListener('click', (e) => {
      // If it's a simple link, we don't need e.preventDefault(),
      // but stopping propagation can stop extensions from interfering.
      e.stopPropagation();
    });
  }
  
  return button;
}

function createInfoCard(card) {
  const article = document.createElement('article');
  article.className = 'info-card';
  article.innerHTML = `
    <div class="card-heading">
      <img src="${card.icon}" alt="Card icon" class="card-icon">
      <h3>${card.title}</h3>
    </div>
    <p>${card.description}</p>
  `;
  return article;
}

function setActiveNav(page) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}

function formatContent(text) {
  return text ? text.replace(/\n/g, '<br>') : '';
}

function renderPage(pageKey) {
  if (!siteData || !siteData.pages) {
    return;
  }

  const page = siteData.pages[pageKey] || siteData.pages.home;
  setActiveNav(pageKey);

  if (pageKey === 'home') {
    heroSection.classList.remove('hidden');
    mockupSection.classList.remove('hidden'); // Show new section
    infoSection.classList.remove('hidden');
    pageSection.classList.add('hidden');
    pageTitle.innerHTML = page.title;
    pageSubtitle.textContent = page.subtitle;
    heroButtons.innerHTML = '';
    mockupTitle.textContent = page.mockupTitle || '';
    mockupSubtitle.textContent = page.mockupSubtitle || '';

    if (page.mockupImage) {
    // Clear any previous background styles
    mockupImageContainer.style.backgroundImage = 'none';
    
    // Insert an image tag to ensure the full image renders
    mockupImageContainer.innerHTML = `
        <img src="${page.mockupImage}" alt="Mockup" class="mockup-img">
    `;
}

    if (Array.isArray(page.buttons)) {
      page.buttons.forEach(item => {
        heroButtons.appendChild(createButton(item));
      });
    }

    infoCards.innerHTML = '';
    if (Array.isArray(page.infoCards)) {
      page.infoCards.forEach(card => {
        infoCards.appendChild(createInfoCard(card));
      });
    }
    infoTitle.textContent = page.infoTitle || '';
  } else {
    heroSection.classList.add('hidden');
    mockupSection.classList.add('hidden'); // Hide on other pages
    infoSection.classList.add('hidden');
    pageSection.classList.remove('hidden');
    sectionTitle.textContent = page.title;
    sectionText.innerHTML = formatContent(page.content || page.subtitle);
    sectionDetails.innerHTML = '';

    if (Array.isArray(page.details)) {
      page.details.forEach(detail => {
        const detailCard = document.createElement('div');
        detailCard.className = 'page-detail';
        detailCard.innerHTML = `
          <strong>${detail.label}</strong>
          <span>${detail.value}</span>
        `;
        sectionDetails.appendChild(detailCard);
      });
    }
  }

  if (location.hash.slice(1) !== pageKey) {
    history.replaceState(null, '', `#${pageKey}`);
  }
}

function handleNavigation(event) {
  const button = event.target.closest('[data-page]');
  if (!button) return;
  event.preventDefault();
  const page = button.dataset.page;
  renderPage(page);
}

window.addEventListener('hashchange', () => {
  const page = location.hash.slice(1) || 'home';
  renderPage(page);
});

window.addEventListener('DOMContentLoaded', async () => {
  await loadSiteData();
  const initialPage = location.hash.slice(1) || 'home';
  renderPage(initialPage);
  document.body.addEventListener('click', handleNavigation);
});