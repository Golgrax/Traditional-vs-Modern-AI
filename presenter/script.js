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

document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
        e.preventDefault(); // Prevent default F11 behavior
        toggleFullScreen();
    }
});

function handleMouseMove(e) {
    const rect = fullscreenBtn.getBoundingClientRect();
    const proximity = 150; // The distance in pixels to trigger the 'is-near' state

    // Center of the button
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;

    // Cursor position
    const cursorX = e.clientX;
    const cursorY = e.clientY;

    // Calculate distance
    const distance = Math.sqrt(Math.pow(btnX - cursorX, 2) + Math.pow(btnY - cursorY, 2));

    if (distance < proximity) {
        fullscreenBtn.classList.add('is-near');
    } else {
        fullscreenBtn.classList.remove('is-near');
    }
}

// This function sets up the listener on the iframe's content.
// It needs to be re-run every time the iframe's src changes.
function setupIframeListener() {
    try {
        // Also listen on the iframe's document
        iframe.contentWindow.document.addEventListener('mousemove', handleMouseMove);
    } catch (e) {
        console.error("Could not attach mousemove listener to iframe. This can happen due to cross-origin restrictions.", e);
    }
}

// Listen on the parent window
document.addEventListener('mousemove', handleMouseMove);

// Listen for when the iframe loads for the first time
iframe.addEventListener('load', setupIframeListener);

// Since navigation now happens inside the iframe, we need a way
// to re-attach the listener. The simplest way is to use a MutationObserver
// to detect when the iframe's 'src' attribute changes.
const observer = new MutationObserver((mutationsList) => {
    for(const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
            // The src has changed, so we need to wait for it to load and then re-attach.
            iframe.addEventListener('load', setupIframeListener, { once: true });
        }
    }
});

// Start observing the iframe for attribute changes
observer.observe(iframe, { attributes: true });
