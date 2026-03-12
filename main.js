// ── Custom Cursor ──
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', function(e) {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 1;
  ry += (my - ry) * 1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

function bindCursorHover() {
  document.querySelectorAll('a, button, input, textarea, select, .cat-card, .gallery-photo').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      ring.style.width  = '10px';
      ring.style.height = '10px';
      ring.style.borderColor = 'rgba(200,169,110,0.8)';
    });
    el.addEventListener('mouseleave', function() {
      ring.style.width  = '10px';
      ring.style.height = '10px';
      ring.style.borderColor = 'rgba(200,169,110,0.5)';
    });
  });
}
bindCursorHover();

// ── Scroll Reveal ──
const revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(function(el) {
  revealObserver.observe(el);
});

// ── Auto-set category covers from first gallery image ──
function initCovers() {
  document.querySelectorAll('.cat-card').forEach(function(card) {
    var onclick = card.getAttribute('onclick') || '';
    var match = onclick.match(/openGallery\('(\w+)'\)/);
    if (!match) return;
    var category = match[1];
    var images = galleryData[category];
    if (!images || !images.length) return;

    var img = document.createElement('img');
    img.className = 'cat-cover';
    img.src = images[0].src;
    img.alt = category + ' cover';
    card.insertBefore(img, card.querySelector('.cat-card-overlay'));
    card.classList.add('has-cover');
  });
}

// ── Gallery Data ──
const galleryData = {
  cars: [
    { src: 'images/mclaren-fading-to-purple.jpeg',  caption: 'Mclaren - Fading to Purple' },
    { src: 'images/viper-green.JPEG',            caption: 'Viper - Green Snake' },
    { src: 'images/merc-amg-cla45.jpeg',         caption: 'AMG CLA45 - In the Woods' },
    { src: 'images/mazda3-snowy-blizzard.jpeg',  caption: 'Mazda3 - Wintery Blizzard' },
    { src: 'images/porsche-911-wingman.jpeg',    caption: 'Porsche 911 - Wingman' },
    { src: 'images/mclaren-front-bpillar.jpeg',  caption: 'Mclaren - Angels Alore' },
  ],
  portraits: [
    { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80', caption: 'Mountain Pass' },
    { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', caption: 'Foggy Morning' },
    { src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80', caption: 'Forest Path' },
    { src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80', caption: 'Coastal View' }
  ],
  landscapes: [
    { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', caption: 'Fashion Week' },
    { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', caption: 'Vogue Concept' },
    { src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80', caption: 'Minimalist' },
    { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', caption: 'Urban Style' }
  ]
};

const descriptions = {
  cars:  'Automotive design, motion, and the elegance of machines.',
  portraits: 'Intimate studies of light, expression, and the human form.',
  landscape: 'Documentary landscapes exploring the quiet drama of the horizon.'
};

// ── Initialise covers once DOM + data are ready ──
initCovers();

// ── Gallery Open / Close ──
function openGallery(category) {
  const grid   = document.getElementById('galleryGrid');
  const images = galleryData[category];

  document.getElementById('galleryBreadcrumb').innerText = category;
  document.getElementById('galleryTitle').innerHTML = category + ' <span>Photography</span>';
  document.getElementById('galleryDesc').innerText = descriptions[category];

  grid.innerHTML = '';
  images.forEach(function(item) {
    const div = document.createElement('div');
    div.className = 'gallery-photo';
    div.onclick = function() { openLightbox(item.src); };

    // gallery-photo-thumb wrapper is required for the 1:1 square ratio
    div.innerHTML =
      '<img src="' + item.src + '" alt="' + item.caption + '">' +
      '<div class="gallery-photo-label">' + item.caption + '</div>';

    grid.appendChild(div);
  });

  document.getElementById('galleryOverlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
  bindCursorHover();
}

function closeGallery() {
  document.getElementById('galleryOverlay').classList.remove('visible');
  document.body.style.overflow = '';
}

// ── Lightbox ──
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add('visible');
}

function closeLightbox(e) {
  if (e.target === lightbox || e.target.closest('.lightbox-close')) {
    lightbox.classList.remove('visible');
    setTimeout(function() { lightboxImg.src = ''; }, 400);
  }
}

// ── Keyboard shortcuts ──
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeLightbox({ target: lightbox });
    closeGallery();
  }
});

// ── Contact Form ──
function handleSubmit(e) {
  e.preventDefault();
  var name    = document.getElementById('fname').value.trim();
  var email   = document.getElementById('femail').value.trim();
  var service = document.getElementById('fservice').value;
  var message = document.getElementById('fmessage').value.trim();

  var subject = encodeURIComponent('Photography Inquiry' + (service ? ' - ' + service : ''));
  var body    = encodeURIComponent(
    'Name: '    + name    +
    '\nEmail: ' + email   +
    '\nService: ' + (service || 'N/A') +
    '\n\nMessage:\n' + message
  );

  window.location.href = 'mailto:stamatopoulospavlos1@gmail.com?subject=' + subject + '&body=' + body;

  document.getElementById('contactForm').style.display = 'none';
  var success = document.getElementById('formSuccess');
  success.style.display = 'block';
  setTimeout(function() {
    success.style.display = 'none';
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('contactForm').reset();
  }, 5000);
}
