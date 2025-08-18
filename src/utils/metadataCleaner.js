/**
 * Creates a placeholder file to replace unsupported file types.
 * @returns {File} A new File object with placeholder content.
 */
function createBlockedFilePlaceholder() {
    const placeholderContent = 'This file was blocked by the MetaSafe Extension because its type is not yet supported for metadata cleaning.';
    const placeholderBlob = new Blob([placeholderContent], { type: 'text/plain' });

    // We replace the file with a generic .txt file.
    // This is a strict security policy to prevent any potential data leaks.
    return new File([placeholderBlob], 'sanitized.txt', {
        type: 'text/plain',
        lastModified: Date.now(),
    });
}


// Namespace to avoid polluting the global scope.
window.MetaSafeUtils = {
    /**
     * Sanitizes a file based on its type. JPEGs get their EXIF data stripped,
     * while other file types are replaced with a safe placeholder for now.
     * @param {File} file The original file object.
     * @returns {Promise<File>} A promise that resolves to the processed file.
     */
    sanitizeFile: async function(file) {
        const supportedImageTypes = ['image/jpeg', 'image/jpg'];

        if (supportedImageTypes.includes(file.type)) {
            console.log('MetaSafe: Sanitizing JPEG: ${file.name}');

            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const strippedDataUrl = piexif.remove(event.target.result);
                        fetch(strippedDataUrl)
                            .then(res => res.blob())
                            .then(blob => {
                                const sanitizedFile = new File([blob], file.name, {
                                    type: file.type,
                                    lastModified: file.lastModified,
                                });
                                resolve(sanitizedFile);
                            });
                    } catch (error) {
                        console.error('MetaSafe: Sanitization failed for ${file.name}. Blocking file.', error);
                        resolve(createBlockedFilePlaceholder());
                    }
                };
                reader.onerror = (error) => {
                    console.error('MetaSafe: FileReader error for ${file.name}. Blocking file.', error);
                    resolve(createBlockedFilePlaceholder());
                };
                reader.readAsDataURL(file);
            });
        }

        // For any unsupported file, block it to enforce a strict privacy policy.
        console.log('MetaSafe: Blocking unsupported file type (${file.type}): ${file.name}');
        return createBlockedFilePlaceholder();
    }
};