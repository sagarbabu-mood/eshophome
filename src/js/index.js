// Dynamic navigation links data
const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Products', href: '#products' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

// Dynamic features data
const features = [
  {
    icon: 'fa-star',
    title: 'Top Quality',
    desc: 'Only the best brands and products, guaranteed authentic.',
  },
  {
    icon: 'fa-truck-fast',
    title: 'Fast Delivery',
    desc: 'Lightning-fast shipping to your doorstep, every time.',
  },
  {
    icon: 'fa-rotate-left',
    title: 'Easy Returns',
    desc: 'Hassle-free returns and exchanges for peace of mind.',
  },
  {
    icon: 'fa-tags',
    title: 'Best Prices',
    desc: 'Unbeatable deals and exclusive offers every week.',
  },
];

// Dynamic products data
const products = [
  {
    title: 'UltraBook Pro 15',
    desc: 'Powerful performance in a sleek, lightweight design.',
    price: 79999,
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80',
    category: 'Laptops',
  },
  {
    title: 'Noise Cancelling Headphones',
    desc: 'Immersive sound with active noise cancellation.',
    price: 5499,
    rating: 4.7,
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    category: 'Audio',
  },
  {
    title: 'Smartwatch X2',
    desc: 'Track your fitness and stay connected on the go.',
    price: 3999,
    rating: 4.6,
    img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=300&q=80',
    category: 'Wearables',
  },
];

// Cart state
let cart = [];

// Filtering and search state
let selectedCategory = 'All';
let searchQuery = '';
let sortOption = 'default';

// Helper: Render Cart Modal
function renderCartModal() {
  let cartModal = document.getElementById('cart-modal');
  if (!cartModal) {
    cartModal = document.createElement('div');
    cartModal.id = 'cart-modal';
    document.body.appendChild(cartModal);
  }
  cartModal.innerHTML = `
    <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" style="display:${cart.length ? 'flex' : 'none'};">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 w-full max-w-md relative">
        <button onclick="closeCartModal()" class="absolute top-2 right-2 text-gray-500 hover:text-sky-500 text-2xl">&times;</button>
        <h2 class="text-xl font-bold mb-4 text-sky-700 dark:text-white">Your Cart</h2>
        ${cart.length === 0 ? '<p class="text-gray-600 dark:text-gray-300">Your cart is empty.</p>' : `
          <ul class="divide-y divide-gray-200 dark:divide-gray-700 mb-4">
            ${cart.map((item, idx) => `
              <li class="py-2 flex items-center justify-between">
                <span>${item.title} <span class="text-xs text-gray-400">x${item.qty}</span></span>
                <div class="flex items-center gap-2">
                  <button onclick="updateCartQty(${idx}, -1)" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">-</button>
                  <button onclick="updateCartQty(${idx}, 1)" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">+</button>
                  <span class="font-bold">₹${(item.price * item.qty).toLocaleString()}</span>
                  <button onclick="removeFromCart(${idx})" class="text-red-500 hover:underline ml-2">Remove</button>
                </div>
              </li>
            `).join('')}
          </ul>
          <div class="font-bold text-right mb-4">Total: ₹${cart.reduce((sum, item) => sum + item.price * item.qty, 0).toLocaleString()}</div>
          <button class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded w-full">Checkout</button>
        `}
      </div>
    </div>
  `;
}

window.closeCartModal = function() {
  document.getElementById('cart-modal').style.display = 'none';
};

window.updateCartQty = function(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty < 1) cart[idx].qty = 1;
  renderCartModal();
};

window.removeFromCart = function(idx) {
  cart.splice(idx, 1);
  renderCartModal();
};

// Helper: Add to Cart
function addToCart(product) {
  const found = cart.find(item => item.title === product.title);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCartModal();
  document.getElementById('cart-modal').style.display = 'flex';
}

// Helper: Render Product Filters
function renderProductFilters() {
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  return `
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <div class="flex gap-2 flex-wrap">
        ${categories.map(cat => `<button class="px-4 py-2 rounded ${selectedCategory === cat ? 'bg-sky-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}" onclick="filterByCategory('${cat}')">${cat}</button>`).join('')}
      </div>
      <input type="text" id="search-bar" placeholder="Search products..." value="${searchQuery}" class="rounded px-3 py-2 text-sky-700 dark:text-gray-900 border border-gray-300 dark:border-gray-700" oninput="searchProducts(this.value)" />
      <select id="sort-select" class="rounded px-3 py-2 text-sky-700 dark:text-gray-900 border border-gray-300 dark:border-gray-700" onchange="sortProducts(this.value)">
        <option value="default" ${sortOption === 'default' ? 'selected' : ''}>Sort By</option>
        <option value="price-asc" ${sortOption === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
        <option value="price-desc" ${sortOption === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
        <option value="rating-desc" ${sortOption === 'rating-desc' ? 'selected' : ''}>Rating: High to Low</option>
      </select>
    </div>
  `;
}

window.filterByCategory = function(cat) {
  selectedCategory = cat;
  renderSections();
};

window.searchProducts = function(query) {
  searchQuery = query;
  renderSections();
};

window.sortProducts = function(option) {
  sortOption = option;
  renderSections();
};

// Render navigation links
document.addEventListener('DOMContentLoaded', () => {
  const navList = document.getElementById('nav-list');
  navList.innerHTML = navLinks.map(link => `<li><a href="${link.href}" class="hover:text-sky-500 dark:hover:text-primary transition">${link.name}</a></li>`).join('');

  renderSections();
});

function renderSections() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <section id="home" class="flex flex-col md:flex-row items-center justify-between px-6 py-12 bg-gradient-to-r from-sky-100 to-sky-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div class="max-w-xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-sky-700 dark:text-white">Welcome to <span class="text-sky-500 dark:text-primary">ECart</span></h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">Discover premium tech products with unbeatable prices and fast delivery. Shop the latest gadgets, laptops, and accessories now!</p>
        <div class="flex gap-4">
          <a href="#products" class="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold shadow transition">Shop Now</a>
          <a href="#features" class="bg-white dark:bg-gray-900 border border-sky-500 dark:border-primary text-sky-500 dark:text-primary px-6 py-3 rounded-lg font-semibold shadow hover:bg-sky-50 dark:hover:bg-gray-800 transition">Learn More</a>
        </div>
      </div>
      <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80" alt="Hero" class="rounded-2xl shadow-lg mt-8 md:mt-0 md:ml-8 w-full max-w-md" />
    </section>
    <section id="features" class="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      ${features.map(f => `
        <div class="flex flex-col items-center p-6 rounded-xl shadow bg-white/70 dark:bg-gray-800/70">
          <i class="fa-solid ${f.icon} text-sky-500 text-3xl mb-2"></i>
          <h3 class="text-gray-600 dark:text-gray-300 font-bold text-lg mb-1">${f.title}</h3>
          <p class="text-gray-600 dark:text-gray-300 text-center">${f.desc}</p>
        </div>
      `).join('')}
    </section>
    <section id="carousel-section" class="max-w-6xl mx-auto py-12 px-6">
      <h2 class="text-2xl font-bold text-sky-700 dark:text-white mb-8 text-center">Featured Carousel</h2>
      <div class="carousel-container relative overflow-hidden rounded-2xl shadow-lg bg-white/80 dark:bg-gray-800/80 p-4 mb-12">
        <div id="carousel" class="flex transition-transform duration-700 ease-in-out" style="will-change: transform;">
          <div class="flex-shrink-0 w-full flex flex-col items-center px-4">
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80" alt="Carousel 1" class="rounded-2xl shadow-lg w-full h-64 md:h-80 object-cover" />
            <div class="mt-4 text-center">
              <h3 class="text-xl font-bold text-sky-700 dark:text-white mb-2">Big Summer Sale</h3>
              <p class="text-gray-600 dark:text-gray-300">Save up to 50% on select gadgets and accessories!</p>
            </div>
          </div>
          <div class="flex-shrink-0 w-full flex flex-col items-center px-4">
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80" alt="Carousel 2" class="rounded-2xl shadow-lg w-full h-64 md:h-80 object-cover" />
            <div class="mt-4 text-center">
              <h3 class="text-xl font-bold text-sky-700 dark:text-white mb-2">New Arrivals</h3>
              <p class="text-gray-600 dark:text-gray-300">Check out the latest tech products in our store.</p>
            </div>
          </div>
          <div class="flex-shrink-0 w-full flex flex-col items-center px-4">
            <img src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80" alt="Carousel 3" class="rounded-2xl shadow-lg w-full h-64 md:h-80 object-cover" />
            <div class="mt-4 text-center">
              <h3 class="text-xl font-bold text-sky-700 dark:text-white mb-2">Exclusive Offers</h3>
              <p class="text-gray-600 dark:text-gray-300">Members get extra discounts and early access!</p>
            </div>
          </div>
        </div>
        <!-- Carousel Controls -->
        <button aria-label="Previous" onclick="previousSlide()" class="absolute left-2 top-1/2 -translate-y-1/2 bg-sky-500/80 hover:bg-sky-600 text-white rounded-full p-2 shadow-lg z-10"><i class="fa-solid fa-chevron-left"></i></button>
        <button aria-label="Next" onclick="nextSlide()" class="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500/80 hover:bg-sky-600 text-white rounded-full p-2 shadow-lg z-10"><i class="fa-solid fa-chevron-right"></i></button>
        <!-- Carousel Indicators -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <button class="carousel-indicator w-3 h-3 rounded-full bg-sky-500 opacity-50 transition" onclick="goToSlide(0)"></button>
          <button class="carousel-indicator w-3 h-3 rounded-full bg-sky-500 opacity-50 transition" onclick="goToSlide(1)"></button>
          <button class="carousel-indicator w-3 h-3 rounded-full bg-sky-500 opacity-50 transition" onclick="goToSlide(2)"></button>
        </div>
      </div>
    </section>
    <section id="products" class="max-w-6xl mx-auto py-12 px-6">
      <h2 class="text-2xl font-bold text-sky-700 dark:text-white mb-8 text-center">Trending Products</h2>
      ${renderProductFilters()}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        ${products
          .filter(p => (selectedCategory === 'All' || p.category === selectedCategory))
          .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .sort((a, b) => {
            if (sortOption === 'price-asc') return a.price - b.price;
            if (sortOption === 'price-desc') return b.price - a.price;
            if (sortOption === 'rating-desc') return b.rating - a.rating;
            return 0;
          })
          .map(p => `
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center transition-colors duration-300">
            <img src="${p.img}" alt="${p.title}" class="rounded mb-3 w-full h-48 object-cover" />
            <h2 class="font-semibold text-lg mb-1 text-sky-700 dark:text-white">${p.title}</h2>
            <p class="text-gray-600 dark:text-gray-300 mb-2">${p.desc}</p>
            <div class="flex items-center justify-center gap-2 mb-2">
              <i class="fa-solid fa-star text-yellow-400"></i>
              <span class="text-gray-600 dark:text-gray-200">${p.rating}</span>
            </div>
            <div class="font-bold text-sky-500 dark:text-primary mb-2">₹${p.price.toLocaleString()}</div>
            <button class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded transition" onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
          </div>
        `).join('')}
      </div>
      <div id="cart-modal"></div>
    </section>
    <section id="about" class="max-w-5xl mx-auto py-16 px-6 flex flex-col md:flex-row items-center gap-10 bg-gradient-to-r from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg mb-12">
      <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80" alt="About ECart" class="rounded-2xl shadow-lg w-full max-w-xs mb-6 md:mb-0 animate-fade-in-up" />
      <div>
        <h2 class="text-3xl font-bold text-sky-700 dark:text-white mb-4">About <span class="text-sky-500 dark:text-primary">ECart</span></h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 text-lg">ECart is your one-stop shop for the latest tech products. We offer quality, value, and service you can trust. Our mission is to bring you the best deals and a seamless shopping experience.</p>
        <ul class="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
          <li>Curated selection of trending gadgets and accessories</li>
          <li>Fast, reliable delivery and easy returns</li>
          <li>Dedicated customer support</li>
          <li>Secure payments and exclusive offers</li>
        </ul>
      </div>
    </section>
    <section id="testimonials" class="max-w-5xl mx-auto py-12 px-6 mb-12">
      <div class="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow p-6">
        <h3 class="text-2xl font-bold mb-6 text-sky-700 dark:text-white text-center">What Our Customers Say</h3>
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-1">
            <blockquote class="italic text-gray-600 dark:text-gray-300">“Great service and fast delivery. Highly recommended!”</blockquote>
            <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">- Priya S.</div>
          </div>
          <div class="flex-1">
            <blockquote class="italic text-gray-600 dark:text-gray-300">“The best prices and genuine products. My go-to tech store.”</blockquote>
            <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">- Rahul K.</div>
          </div>
          <div class="flex-1">
            <blockquote class="italic text-gray-600 dark:text-gray-300">“Customer support was super helpful with my return.”</blockquote>
            <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">- Anjali M.</div>
          </div>
        </div>
      </div>
    </section>
    <section id="contact" class="max-w-4xl mx-auto py-12 px-6">
      <h2 class="text-2xl font-bold text-sky-700 dark:text-white mb-4">Contact Us</h2>
      <form class="flex flex-col gap-4">
        <input type="text" placeholder="Your Name" class="rounded px-3 py-2 text-sky-700 dark:text-gray-900" required />
        <input type="email" placeholder="Your Email" class="rounded px-3 py-2 text-sky-700 dark:text-gray-900" required />
        <textarea placeholder="Your Message" class="rounded px-3 py-2 text-sky-700 dark:text-gray-900" required></textarea>
        <button class="bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded px-3 py-2 transition">Send Message</button>
      </form>
    </section>
    <section id="newsletter" class="max-w-6xl mx-auto py-12 px-6">
      <div class="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="mb-4 md:mb-0">
          <h3 class="text-2xl font-bold text-sky-700 dark:text-white mb-2">Stay Updated!</h3>
          <p class="text-gray-600 dark:text-gray-300">Subscribe to our newsletter for exclusive offers and the latest news.</p>
        </div>
        <form class="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center" onsubmit="event.preventDefault(); alert('Thank you for subscribing!')">
          <label for="newsletter" class="sr-only">Email</label>
          <input id="newsletter" type="email" required placeholder="Your email address" class="rounded px-3 py-2 text-sky-700 dark:text-gray-900 border border-gray-300 dark:border-gray-700 w-full md:w-64" />
          <button type="submit" class="bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded px-3 py-2 transition">Subscribe</button>
        </form>
      </div>
    </section>
    <footer class="w-full bg-sky-700 dark:bg-gray-900 text-white py-8 mt-12">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-6">
        <div class="flex items-center gap-3 mb-4 md:mb-0">
          <img src="../icons/favicon.ico" alt="ECart Logo" class="w-10 h-10 rounded" />
          <span class="font-bold text-xl tracking-wide">ECart</span>
        </div>
        <ul class="flex gap-6 text-sm mb-4 md:mb-0">
          <li><a href="#home" class="hover:underline">Home</a></li>
          <li><a href="#products" class="hover:underline">Products</a></li>
          <li><a href="#about" class="hover:underline">About</a></li>
          <li><a href="#contact" class="hover:underline">Contact</a></li>
        </ul>
        <div class="flex gap-4">
          <a href="#" aria-label="Twitter" class="hover:text-sky-300"><i class="fab fa-twitter text-xl"></i></a>
          <a href="#" aria-label="Instagram" class="hover:text-sky-300"><i class="fab fa-instagram text-xl"></i></a>
          <a href="#" aria-label="Facebook" class="hover:text-sky-300"><i class="fab fa-facebook text-xl"></i></a>
        </div>
      </div>
      <div class="text-center text-xs text-white/70 mt-6">&copy; ${new Date().getFullYear()} ECart. All rights reserved.</div>
    </footer>
  `;
}

// Carousel functionality
let currentSlide = 0;
let totalSlides = 3;

document.addEventListener('DOMContentLoaded', function () {
    // Recalculate totalSlides in case images are dynamic
    const carousel = document.getElementById('carousel');
    if (carousel) {
        totalSlides = carousel.children.length;
    }
    updateCarousel();
});

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    const carousel = document.getElementById('carousel');
    const indicators = document.querySelectorAll('.carousel-indicator');
    if (!carousel) return;
    carousel.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
    carousel.style.width = `${totalSlides * 100}%`;
    Array.from(carousel.children).forEach(child => {
        child.style.flex = `0 0 ${100 / totalSlides}%`;
        child.style.maxWidth = `${100 / totalSlides}%`;
    });
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.remove('opacity-50');
            indicator.classList.add('opacity-100');
        } else {
            indicator.classList.remove('opacity-100');
            indicator.classList.add('opacity-50');
        }
    });
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function () {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (window.scrollY > 400) {
        scrollBtn.classList.remove('opacity-0', 'pointer-events-none');
        scrollBtn.classList.add('opacity-100');
    } else {
        scrollBtn.classList.add('opacity-0', 'pointer-events-none');
        scrollBtn.classList.remove('opacity-100');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Auto-play carousel
let autoPlayInterval = setInterval(nextSlide, 5000);

// Pause auto-play on hover
document.addEventListener('DOMContentLoaded', function () {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        carouselContainer.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(nextSlide, 5000);
        });
    }
});

// Add loading animation to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function (e) {
        if (this.textContent.includes('Add to Cart') || this.textContent.includes('Add')) {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Adding...';
            this.disabled = true;

            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check mr-2"></i>Added!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 1000);
            }, 1000);
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.animate-fade-in-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});
