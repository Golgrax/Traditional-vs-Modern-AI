const iframe = document.getElementById('slide-iframe');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');

let currentSlide = 1;
const totalSlides = 10;

function updateIframeSrc() {
    const slideNumber = currentSlide.toString().padStart(2, '0');
    iframe.src = `../slides/slide-${slideNumber}/index.html`;
}

prevBtn.addEventListener('click', () => {
    if (currentSlide > 1) {
        currentSlide--;
        updateIframeSrc();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides) {
        currentSlide++;
        updateIframeSrc();
    }
});

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenBtn.style.display = 'none';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fullscreenBtn.style.display = 'block';
        }
    }
});

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenBtn.style.display = 'block';
    }
});
