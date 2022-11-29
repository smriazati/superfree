function setTickerAnimation() {
    const ref = document.getElementById('marquee');
    const span = ref.querySelector('span');
    if (!ref || !span || !gsap) {
        console.log('cancelling ticker', ref, span, gsap)
        return;
    }
    let tickerTextWidth = span.offsetWidth;
    let windowWidth = window.innerWidth;
    let speed;
    if (windowWidth > 768) {
        speed = 30;
    } else {
        speed = 15;
    }
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

function initTicker() {
    setTickerAnimation();
}

document.addEventListener('DOMContentLoaded', initTicker, false);



var timeout = false, // holder for timeout id
    delay = 250, // delay after event is "complete" to run callback
    calls = 0;


// window.resize event listener
window.addEventListener('resize', function () {
    // clear the timeout
    clearTimeout(timeout);
    // start timing for event "completion"
    timeout = setTimeout(initTicker, delay);
});



