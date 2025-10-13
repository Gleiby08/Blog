// Clase para el carrusel infinito
class InfiniteCarousel {
    constructor(containerId, items) {
        this.track = document.getElementById(containerId);
        this.container = this.track.parentElement;
        this.indicatorsContainer = document.getElementById('carouselIndicators');
        this.items = items;
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.autoplayInterval = null;

        if (!this.track || !this.container) return;
        
        this.init();
    }

    init() {
        // Clonar imágenes para crear efecto infinito
        this.renderImages();
        this.setupEventListeners();
        this.renderIndicators();
        this.updateIndicators();
        this.startAutoplay();
    }

    renderImages() {
        // Limpiar contenido previo
        this.track.innerHTML = '';

        // Añadir imágenes con clonación
        const totalItems = this.items.length;
        
        // Imagen anterior (última)
        const prevImage = this.createImageElement(
            this.items[totalItems - 1]
        );
        this.track.appendChild(prevImage);

        // Imágenes actuales
        this.items.forEach(itemData => {
            const img = this.createImageElement(itemData);
            this.track.appendChild(img);
        });

        // Siguiente imagen (primera)
        const nextImage = this.createImageElement(this.items[0]);
        this.track.appendChild(nextImage);

        // Posicionar en la primera imagen real
        this.track.style.transform = `translateX(-100%)`;
    }

    renderIndicators() {
        this.indicatorsContainer.innerHTML = '';
        this.items.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.dataset.index = index;
            this.indicatorsContainer.appendChild(indicator);
        });
    }

    createImageElement(itemData) {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        
        const img = document.createElement('img');
        img.src = itemData.src;
        img.alt = 'Imagen de Carrusel';
        
        const caption = document.createElement('div');
        caption.className = 'carousel-caption';
        caption.textContent = itemData.caption;

        item.appendChild(img);
        item.appendChild(caption);

        return item;
    }

    next() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.moveTo(this.currentIndex, 'next');
    }

    prev() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.moveTo(this.currentIndex, 'prev');
    }

    moveTo(index, direction) {
        this.isTransitioning = true;
        const targetIndex = direction === 'next' ? this.currentIndex + 1 : this.currentIndex - 1;
        
        this.track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        this.track.style.transform = `translateX(-${(index + 1) * 100}%)`;
        this.currentIndex = index;
        this.updateIndicators();
        
        setTimeout(() => {
            // Re-posicionamiento silencioso para el bucle infinito
            if (this.currentIndex === this.items.length) {
                this.track.style.transition = 'none';
                this.track.style.transform = `translateX(-100%)`;
                this.currentIndex = 0;
            } else if (this.currentIndex < 0) {
                this.track.style.transition = 'none';
                this.track.style.transform = `translateX(-${this.items.length * 100}%)`;
                this.currentIndex = this.items.length - 1;
            }
            this.isTransitioning = false;
        }, 600);
    }

    updateIndicators() {
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    setupEventListeners() {
        document.getElementById('carouselNext').addEventListener('click', () => this.next());
        document.getElementById('carouselPrev').addEventListener('click', () => this.prev());

        this.indicatorsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('indicator')) {
                const index = parseInt(e.target.dataset.index, 10);
                if (index !== this.currentIndex) {
                    this.moveTo(index);
                }
            }
        });

        // Pausar al pasar el ratón
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    startAutoplay() {
        // Evitar múltiples intervalos
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, 4000); // Aumenté el tiempo para una mejor visualización
    }

    stopAutoplay() {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
    }
}

// Función para scroll reveal
function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal'); // Esto ya funciona, selecciona todos los elementos con la clase base.
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            } else {
                // Opcional: remover la clase para que la animación se repita al volver a scrollear
                entry.target.classList.remove('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Función para agregar efectos de partículas
function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            animation: float ${5 + Math.random() * 10}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        particleContainer.appendChild(particle);
    }
    
    document.body.appendChild(particleContainer);
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar scroll reveal
    initScrollReveal();
    
    // Crear partículas flotantes
    createFloatingParticles();
    
    // Lógica para Lazy Loading de imágenes con efecto blur
    const lazyImages = document.querySelectorAll('.lazy-image');

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    
                    // Usamos un truco para cargar la imagen en segundo plano
                    const tempImage = new Image();
                    tempImage.src = lazyImage.dataset.src;

                    tempImage.onload = () => {
                        lazyImage.src = lazyImage.dataset.src;
                        if (lazyImage.srcset) {
                           lazyImage.srcset = lazyImage.dataset.srcset || '';
                        }
                        lazyImage.classList.add('loaded');
                    };

                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    }

    // Inicializar carrusel
    const carouselData = [
        { src: 'https://www.khmertimeskh.com/wp-content/uploads/2017/11/20-063_876897716.jpg', caption: 'La Evolución del Juego Moderno' },
        { src: 'https://www.bostonsportsjournal.com/img/legacy/GettyImages-1145754279-1600x900.jpg', caption: 'Estrellas que Definen una Era' },
        { src: 'https://phantom-marca-us.unidadeditorial.es/ef456de5b1bb725d18901e494f5c8d61/resize/828/f/jpg/assets/multimedia/imagenes/2024/06/17/17186527905154.jpg', caption: 'Boston Celtics: Campeones 2024' },
        { src: 'https://e00-marca.uecdn.es/assets/multimedia/imagenes/2024/06/07/17177219895448.jpg', caption: 'El Impacto Global del Baloncesto' }
    ];

    // Solo inicializar el carrusel si el elemento existe en la página
    if (document.getElementById('carouselTrack')) {
        new InfiniteCarousel('carouselTrack', carouselData);
    }

    // Lógica para el botón "Volver Arriba"
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            // Muestra el botón después de 300px de scroll
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Lógica para el menú de hamburguesa
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Lógica para ocultar/mostrar navbar al hacer scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            // No ocultar si el menú móvil está activo
            if (navLinks.classList.contains('active')) {
                return;
            }

            if (window.scrollY > lastScrollY && window.scrollY > navbar.offsetHeight) {
                // Scroll hacia abajo
                navbar.classList.add('navbar--hidden');
            } else {
                // Scroll hacia arriba
                navbar.classList.remove('navbar--hidden');
            }
            lastScrollY = window.scrollY;
        });
    }

    // Lógica para la barra de progreso de lectura
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            
            if (scrollHeight > 0) {
                const scrollProgress = (scrollTop / scrollHeight) * 100;
                progressBar.style.width = scrollProgress + '%';
            } else {
                // Si no hay scroll, la barra está al 0%
                progressBar.style.width = '0%';
            }
        });
    }
});
