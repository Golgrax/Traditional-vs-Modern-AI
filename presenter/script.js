const iframe = document.getElementById('slide-iframe');
const fullscreenBtn = document.querySelector('.fullscreen-toggle');

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

fullscreenBtn.addEventListener('click', toggleFullScreen);

// --- Keyboard & Mouse Wheel Scrolling Bypass ---
function handleScroll(event) {
    // Check if the iframe and its content window are accessible
    if (iframe && iframe.contentWindow) {
        if (event.type === 'keydown') {
            const scrollAmount = 50; // Pixels to scroll on each key press
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                iframe.contentWindow.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                iframe.contentWindow.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
            }
        } else if (event.type === 'wheel') {
            event.preventDefault();
            // Use the wheel delta to scroll the iframe content
            iframe.contentWindow.scrollBy({ top: event.deltaY, behavior: 'smooth' });
        }
    }
}

document.addEventListener('keydown', handleScroll);
// We need to listen for the wheel event on the main window
// because the iframe might not capture it if the mouse is not over it.
// A more robust solution would listen on both.
window.addEventListener('wheel', handleScroll, { passive: false });


// --- Proximity detection for the fullscreen button ---
function handleMouseMove(e) {
    const rect = fullscreenBtn.getBoundingClientRect();
    const proximity = 150;

    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;
    const cursorX = e.clientX;
    const cursorY = e.clientY;

    const distance = Math.sqrt(Math.pow(btnX - cursorX, 2) + Math.pow(btnY - cursorY, 2));

    if (distance < proximity) {
        fullscreenBtn.classList.add('is-near');
    } else {
        fullscreenBtn.classList.remove('is-near');
    }
}

function setupIframeListeners() {
    try {
        const iframeDoc = iframe.contentWindow.document;
        // Listen for events inside the iframe
        iframeDoc.addEventListener('mousemove', handleMouseMove);
        // Also attach the wheel listener here to capture events inside the iframe
        iframe.contentWindow.addEventListener('wheel', handleScroll, { passive: false });
    } catch (e) {
        console.error("Could not attach listeners to iframe.", e);
    }
}

document.addEventListener('mousemove', handleMouseMove);
iframe.addEventListener('load', setupIframeListeners);

const observer = new MutationObserver((mutationsList) => {
    for(const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
            iframe.addEventListener('load', setupIframeListeners, { once: true });
        }
    }
});
observer.observe(iframe, { attributes: true });