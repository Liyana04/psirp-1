// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Button click handlers
document.querySelector('.btn-primary').addEventListener('click', () => {
    alert('Redirect to signup page');
});

document.querySelector('.btn-secondary').addEventListener('click', () => {
    alert('Open demo link');
});

document.querySelector('.start-free-btn').addEventListener('click', () => {
    alert('Redirect to signup page');
});