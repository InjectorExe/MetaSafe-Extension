/**
 * Replaces the files in a file input element with a new set of files
 * and dispatches a 'change' event to notify the page.
 * @param {HTMLInputElement} input The file input element.
 * @param {File[]} files The new array of File objects to assign.
 */
function replaceFileInputs(input, files) {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    input.files = dataTransfer.files;

    // Mark and dispatch an event so the page can react to the change.
    input.dataset.metasafeSynthetic = 'true';
    input.dispatchEvent(new Event('change', { bubbles: true }));
}


/**
 * Attaches a 'change' event listener to a file input to intercept selections.
 * @param {HTMLInputElement} input The file input element to monitor.
 */
function interceptFileInput(input) {
    if (input.dataset.metasafeAttached) return;
    input.dataset.metasafeAttached = 'true';

    input.addEventListener('change', async (event) => {
        // Ignore own crafted events to prevent an infinite loop.
        if (input.dataset.metasafeSynthetic === 'true') {
            delete input.dataset.metasafeSynthetic;
            return;
        }

        // Run before the pages scripts can see the original files.
        event.stopImmediatePropagation();

        const originalFiles = Array.from(input.files);
        if (originalFiles.length === 0) return;

        const sanitizedFiles = await Promise.all(
            originalFiles.map(file => window.MetaSafeUtils.sanitizeFile(file))
        );

        replaceFileInputs(input, sanitizedFiles);
    }, true);
}


/**
 * Intercepts drag-and-drop events to sanitize files before the page can access them.
 */
function interceptDropEvents() {
    window.addEventListener('drop', async (event) => {
        const hasFiles = event.dataTransfer && event.dataTransfer.files.length > 0;
        if (!hasFiles || event.isMetaSafeSynthetic) {
            return;
        }

        // Stop the original event to hide the original files from the page.
        event.preventDefault();
        event.stopImmediatePropagation();

        const originalFiles = Array.from(event.dataTransfer.files);
        const sanitizedFiles = await Promise.all(
            originalFiles.map(file => window.MetaSafeUtils.sanitizeFile(file))
        );

        const newTransfer = new DataTransfer();
        sanitizedFiles.forEach(file => newTransfer.items.add(file));

        // Create a new drop event with the sanitized files.
        const syntheticEvent = new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer: newTransfer,
        });
        syntheticEvent.isMetaSafeSynthetic = true; // Mark our event.

        event.target.dispatchEvent(syntheticEvent);
    }, true);

    // Prevent the browsers default behavior (like opening the file) for drag-over.
    window.addEventListener('dragover', (event) => {
        event.preventDefault();
    }, true);
}


/**
 * Initializes the content script.
 */
function init() {
    console.log('MetaSafe loaded. Intercepting file uploads...');

    document.querySelectorAll('input[type="file"]').forEach(interceptFileInput);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('input[type="file"]')) {
                        interceptFileInput(node);
                    }
                    node.querySelectorAll('input[type="file"]').forEach(interceptFileInput);
                }
            });
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    interceptDropEvents();
}

init();