function preventBarbaIntoShop() {
    const collections = document.querySelectorAll("a[href^='/collections/']");
    const products = document.querySelectorAll("a[href^='/products/']");
    const cart = document.querySelectorAll("a[href^='/cart']");
    const account = document.querySelectorAll("a[href^='/account']");

    collections.forEach(el => el.classList.add('prevent'));
    products.forEach(el => el.classList.add('prevent'));
    cart.forEach(el => el.classList.add('prevent'));
    account.forEach(el => el.classList.add('prevent'));
}

function setBodyClass(next) {
    const body = document.querySelector('body');
    const nextNamespace = next.namespace;

    const customPageTemplates = ['about', 'faqs', 'contact']; // add new page template handles here 
    let templateType = nextNamespace;
    if (customPageTemplates.includes(nextNamespace)) {
        templateType = 'page';
    }

    body.className = "";
    body.classList.add(`template-${templateType}`)
}

function closeMobileMenu() {
    const btn = document.getElementById('menuToggle');
    if (!btn) { return }

    // if (window.innerWidth > 800) { return }
    const header = btn.closest('header');
    if (!header) { return }

    const targetClass = 'collapsed';
    const isCollapsed = header.classList.contains(targetClass);

    // if the menu is open, close it 
    if (!isCollapsed) {
        header.classList.toggle(targetClass);
    }
}

function setTickerAnimation() {
    const ref = document.getElementById('marquee');
    const span = ref.querySelector('span');
    if (!ref || !span || !gsap) {
        console.log('cancelling ticker', ref, span, gsap)
        return;
    }
    let tickerTextWidth = span.offsetWidth;
    let windowWidth = window.innerWidth;
    let speed = 30;

    gsap.set(ref, {
        x: windowWidth,
    });
    gsap.to(ref, {
        x: -tickerTextWidth,
        repeat: -1,
        ease: "linear",
        duration: speed,
    });
}

function setResizeTickerAnimation() {
    var timeout = false, // holder for timeout id
        delay = 250; // delay after event is "complete" to run callback

    // window.resize event listener
    window.addEventListener('resize', function () {
        // clear the timeout
        clearTimeout(timeout);
        // start timing for event "completion"
        timeout = setTimeout(initTicker, delay);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    barba.init({
        views: [{
            namespace: 'faqs',
            beforeEnter(next) {
                let script = document.createElement('script');
                script.src = "https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js";
                next.container.appendChild(script);
            }
        }, {
            namespace: 'index',
            afterEnter() {
                setTickerAnimation();
                setResizeTickerAnimation();
            }
        }],
        transitions: [{
            name: 'default-transition',
            once(data) {
                gsap.set(data.next.container, {
                    opacity: 0,
                });
                preventBarbaIntoShop();
            },
            afterOnce(data) {
                gsap.to(data.next.container, {
                    opacity: 1,
                    duration: 1.1,
                });
            },
            leave(data) {
                gsap.to(data.current.container, {
                    opacity: 0,
                    ease: "power1.out",
                    duration: 0.4,
                    onComplete: function () { window.scrollTo(0, 0); },
                });
            },
            enter(data) {
                gsap.set(data.next.container, {
                    opacity: 0,
                });
                gsap.to(data.next.container, {
                    opacity: 1,
                    duration: 0.7
                });

            }
        }],
        prevent: ({ el }) => el.classList && el.classList.contains('prevent')
    });

    barba.hooks.enter(() => {
        preventBarbaIntoShop();
    });

    barba.hooks.beforeEnter(({ current, next }) => {
        if (current.container) {
            setBodyClass(next);
        }
    });

    barba.hooks.beforeLeave(() => {
        closeMobileMenu();
    });

});