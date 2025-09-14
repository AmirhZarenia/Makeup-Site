
        // Initialize AOS
        AOS.init({
            duration: 420,
            once: true,
            offset: 80,
            disable: function () {
                return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            }
        });

        // Custom Cursor
        document.addEventListener('DOMContentLoaded', function() {
            const cursor = document.querySelector('.custom-cursor');
            const cursorDot = document.querySelector('.cursor-dot');

            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                cursorDot.style.left = e.clientX + 'px';
                cursorDot.style.top = e.clientY + 'px';
            });

            // Cursor hover effects
            const hoverElements = document.querySelectorAll('button, a, .product-card, .category-card');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                    cursor.style.background = 'rgba(255, 107, 157, 0.1)';
                });
                el.addEventListener('mouseleave', () => {
                    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursor.style.background = 'rgba(255, 107, 157, 0.2)';
                });
            });
        });

        // Create Particles
        function createParticles() {
            const container = document.getElementById('particles-container');
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const isMobile = window.innerWidth < 768;
            const particleCount = reduced ? 0 : (isMobile ? 12 : 24);

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random size
                const size = Math.random() * 6 + 2;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                // Random position
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                
                // Random color
                const colors = ['#ff6b9d', '#667eea', '#f8b500', '#764ba2'];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                // Random animation delay
                particle.style.animationDelay = Math.random() * 15 + 's';
                
                container.appendChild(particle);
            }
        }

        // Shopping Cart Functionality
        let cart = [];
        let wishlist = [];

        // Persian number and currency helpers
        function formatCurrency(amount) {
            try {
                return amount.toLocaleString('fa-IR') + ' تومان';
            } catch (e) {
                return amount.toString() + ' تومان';
            }
        }

        // LocalStorage helpers
        function saveCart() {
            localStorage.setItem('glam_cart', JSON.stringify(cart));
        }

        function loadCart() {
            try {
                const raw = localStorage.getItem('glam_cart');
                cart = raw ? JSON.parse(raw) : [];
            } catch (_) {
                cart = [];
            }
        }

        function updateCartUI() {
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            
            cartCount.textContent = cart.length.toLocaleString('fa-IR');
            cartCount.classList.add('cart-bounce');
            setTimeout(() => cartCount.classList.remove('cart-bounce'), 600);
            
            // Update cart items
            cartItems.innerHTML = '';
            let total = 0;
            
            cart.forEach((item, index) => {
                total += item.price;
                cartItems.innerHTML += `
                    <div class="flex items-center justify-between p-4 glass rounded-2xl">
                        <div class="flex items-center">
                            <div class="w-12 h-12 gradient-rose rounded-xl flex items-center justify-center mr-3">
                                <i class="fas fa-tint text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-800 text-sm">${item.name}</h4>
                                <p class="text-gray-600 text-xs">${item.price.toLocaleString('fa-IR')} تومان</p>
                            </div>
                        </div>
                        <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-600">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>
                `;
            });
            
            cartTotal.textContent = formatCurrency(total);
            saveCart();
        }

        function addToCart(productId) {
            const products = {
                1: { name: 'رژ لب مات لورآل', price: 295000 },
                2: { name: 'پالت سایه چشم میبلین', price: 450000 },
                3: { name: 'هایلایتر فنتی بیوتی', price: 680000 },
                4: { name: 'لب‌گلاس کرم رار بیوتی', price: 180000 }
            };
            
            cart.push(products[productId]);
            updateCartUI();
            showToast('محصول به سبد خرید اضافه شد');
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartUI();
        }

        function addToWishlist(productId) {
            if (!wishlist.includes(productId)) {
                wishlist.push(productId);
                document.getElementById('wishlistCount').textContent = wishlist.length;
                showToast('محصول به علاقه‌مندی‌ها اضافه شد');
            }
        }

        // Toast Notification
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.querySelector('p').textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Cart Sidebar
        function openCart() {
            const sidebar = document.getElementById('cartSidebar');
            const backdrop = document.getElementById('cartBackdrop');
            sidebar.style.transform = 'translateX(0)';
            backdrop.classList.remove('pointer-events-none');
            backdrop.style.opacity = '1';
            document.body.style.overflow = 'hidden';
        }

        function closeCart() {
            const sidebar = document.getElementById('cartSidebar');
            const backdrop = document.getElementById('cartBackdrop');
            sidebar.style.transform = 'translateX(100%)';
            backdrop.style.opacity = '0';
            backdrop.classList.add('pointer-events-none');
            document.body.style.overflow = '';
        }

        document.getElementById('cartBtn').addEventListener('click', openCart);
        document.getElementById('closeCart').addEventListener('click', closeCart);
        document.getElementById('cartBackdrop').addEventListener('click', closeCart);
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeCart();
        });

        // Product Filter
        document.querySelectorAll('.product-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                document.querySelectorAll('.product-filter').forEach(b => {
                    b.classList.remove('bg-primary', 'text-white', 'chip-active');
                    b.classList.add('bg-white', 'text-gray-900');
                });
                
                // Add active class to clicked button
                btn.classList.add('bg-primary', 'text-white', 'chip-active');
                btn.classList.remove('bg-white', 'text-gray-900');
                
                // Filter products
                const filter = btn.dataset.filter;
                const products = document.querySelectorAll('[data-category]');
                
                products.forEach(product => {
                    if (filter === 'all' || product.dataset.category === filter) {
                        product.classList.remove('hidden');
                    } else {
                        product.classList.add('hidden');
                    }
                });

                // Remove preview image section (no longer used)
            });
        });

        // Categories dropdown (click toggle)
        (function setupCategoriesDropdown(){
            const toggle = document.getElementById('categoriesToggle');
            const menu = document.getElementById('categoriesMenu');
            const chevron = document.getElementById('categoriesChevron');
            if (!toggle || !menu) return;
            const open = () => {
                menu.classList.remove('invisible');
                menu.style.opacity = '1';
                chevron.style.transform = 'rotate(180deg)';
                document.addEventListener('click', outside);
            };
            const close = () => {
                menu.style.opacity = '0';
                menu.classList.add('invisible');
                chevron.style.transform = 'rotate(0deg)';
                document.removeEventListener('click', outside);
            };
            const outside = (e) => {
                if (!document.getElementById('categoriesWrapper').contains(e.target)) close();
            };
            let isOpen = false;
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                isOpen ? close() : open();
                isOpen = !isOpen;
            });
            // ESC to close
            window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) { close(); isOpen = false; } });
        })();

        // Add to Cart Event Listeners
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.product;
                addToCart(parseInt(productId));
            });
        });

        // Add to Wishlist Event Listeners
        document.querySelectorAll('.add-to-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.product;
                addToWishlist(parseInt(productId));
            });
        });

        // Search Functionality
        document.getElementById('searchInput').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            // Add search logic here
            console.log('Searching for:', searchTerm);
        });

        // Initialize everything
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            loadCart();
            updateCartUI();

            // Testimonials carousel controls
            const track = document.getElementById('testiTrack');
            const prev = document.getElementById('testiPrev');
            const next = document.getElementById('testiNext');
            const dots = Array.from(document.querySelectorAll('#testiDots > button'));

            const cardWidth = () => {
                const first = track.querySelector('article');
                if (!first) return 320;
                const rect = first.getBoundingClientRect();
                const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '24');
                return rect.width + (isNaN(gap) ? 24 : gap);
            };

            const updateDots = () => {
                const index = Math.round(track.scrollLeft / cardWidth());
                dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
            };

            prev?.addEventListener('click', () => {
                track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
            });
            next?.addEventListener('click', () => {
                track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
            });
            track?.addEventListener('scroll', () => {
                window.requestAnimationFrame(updateDots);
            });
            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => {
                    track.scrollTo({ left: i * cardWidth(), behavior: 'smooth' });
                });
            });

            // Autoplay with pause on hover
            let autoTimer;
            const startAuto = () => {
                stopAuto();
                autoTimer = setInterval(() => {
                    const maxScroll = track.scrollWidth - track.clientWidth;
                    const nextLeft = track.scrollLeft + cardWidth();
                    track.scrollTo({ left: nextLeft > maxScroll ? 0 : nextLeft, behavior: 'smooth' });
                }, 3500);
            };
            const stopAuto = () => autoTimer && clearInterval(autoTimer);
            // Start autoplay only if track exists and has overflow
            if (track && track.scrollWidth > track.clientWidth + 10) startAuto();
            track?.addEventListener('mouseenter', stopAuto);
            track?.addEventListener('mouseleave', startAuto);

            // Subtle tilt effect per card
            document.querySelectorAll('.testi-tilt').forEach((el) => {
                const handle = (e) => {
                    const rect = el.getBoundingClientRect();
                    const px = (e.clientX - rect.left) / rect.width - 0.5;
                    const py = (e.clientY - rect.top) / rect.height - 0.5;
                    el.style.setProperty('--ry', `${-px * 10}deg`);
                    el.style.setProperty('--rx', `${py * 10}deg`);
                    el.querySelectorAll('.layer-1, .layer-2, .layer-3').forEach((layer) => {
                        const depth = parseInt(getComputedStyle(layer).getPropertyValue('--z')) || 30;
                        layer.style.setProperty('--tx', `${px * depth * 0.6}px`);
                        layer.style.setProperty('--ty', `${py * depth * 0.6}px`);
                    });
                    el.classList.add('is-active');
                };
                const reset = () => {
                    el.style.setProperty('--ry', '0deg');
                    el.style.setProperty('--rx', '0deg');
                    el.querySelectorAll('.layer-1, .layer-2, .layer-3').forEach((layer) => {
                        layer.style.setProperty('--tx', '0px');
                        layer.style.setProperty('--ty', '0px');
                    });
                    el.classList.remove('is-active');
                };
                el.addEventListener('mousemove', handle);
                el.addEventListener('mouseleave', reset);
            });

            // Drag to scroll (mouse / touch)
            let isDown = false, startX = 0, scrollLeft = 0;
            const onDown = (clientX) => {
                isDown = true;
                track.classList.add('dragging');
                startX = clientX - track.getBoundingClientRect().left;
                scrollLeft = track.scrollLeft;
                stopAuto();
            };
            const onMove = (clientX) => {
                if (!isDown) return;
                const x = clientX - track.getBoundingClientRect().left;
                const walk = (x - startX) * 1.2; // ضریب برای حس بهتر درگ
                track.scrollLeft = scrollLeft - walk;
            };
            const onUp = () => {
                if (!isDown) return;
                isDown = false;
                track.classList.remove('dragging');
                startAuto();
            };
            if (track) {
                // Mouse
                track.addEventListener('mousedown', (e) => onDown(e.clientX));
                window.addEventListener('mousemove', (e) => onMove(e.clientX));
                window.addEventListener('mouseup', onUp);
                // Touch
                track.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), { passive: true });
                window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
                window.addEventListener('touchend', onUp);
            }

            // Category tilt (subtle 3D)
            document.querySelectorAll('.cat-tilt').forEach((card) => {
                const move = (e) => {
                    const rect = card.getBoundingClientRect();
                    const cx = (e.clientX ?? (e.touches?.[0]?.clientX || 0)) - rect.left;
                    const cy = (e.clientY ?? (e.touches?.[0]?.clientY || 0)) - rect.top;
                    const px = cx / rect.width - 0.5;
                    const py = cy / rect.height - 0.5;
                    card.style.setProperty('--cat-ry', `${-px * 8}deg`);
                    card.style.setProperty('--cat-rx', `${py * 8}deg`);
                };
                const reset = () => {
                    card.style.setProperty('--cat-ry', '0deg');
                    card.style.setProperty('--cat-rx', '0deg');
                };
                card.addEventListener('mousemove', move);
                card.addEventListener('mouseleave', reset);
                card.addEventListener('touchmove', move, { passive: true });
                card.addEventListener('touchend', reset);
            });

            // Hero tilt
            const hero = document.querySelector('.hero-tilt');
            if (hero) {
                hero.addEventListener('mousemove', (e) => {
                    const r = hero.getBoundingClientRect();
                    const px = (e.clientX - r.left) / r.width - 0.5;
                    const py = (e.clientY - r.top) / r.height - 0.5;
                    hero.style.setProperty('--hy', `${-px * 6}deg`);
                    hero.style.setProperty('--hx', `${py * 6}deg`);
                });
                hero.addEventListener('mouseleave', () => {
                    hero.style.setProperty('--hy', '0deg');
                    hero.style.setProperty('--hx', '0deg');
                });
            }
            
            // Hide loading screen
            setTimeout(() => {
                document.getElementById('loadingScreen').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('loadingScreen').remove();
                }, 500);
            }, 2000);
        });

        // Scroll Effects
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.05)';
                header.style.backdropFilter = 'blur(20px)';
            }
        });

        // Mobile Menu
        const mobileMenuPanel = document.getElementById('mobileMenuPanel');
        const openMobileMenu = () => {
            mobileMenuPanel.style.transform = 'translateY(0)';
            document.body.style.overflow = 'hidden';
        };
        const closeMobileMenu = () => {
            mobileMenuPanel.style.transform = 'translateY(-100%)';
            document.body.style.overflow = '';
        };
        document.getElementById('mobileMenuBtn').addEventListener('click', openMobileMenu);
        document.getElementById('closeMobileMenu').addEventListener('click', closeMobileMenu);
        // Close on ESC
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileMenu();
        });

        // Newsletter Form
        document.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            if (email) {
                showToast('ایمیل شما با موفقیت ثبت شد');
                e.target.reset();
            }
        });