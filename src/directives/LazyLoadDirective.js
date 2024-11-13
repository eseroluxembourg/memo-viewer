export default {
    mounted: (el) => {
        function loadImage() {
            const children = Array.from(el.children);
            const imageElement = children.find((el) => el.nodeName === 'IMG');

            if (imageElement) {
                imageElement.addEventListener('load', () => {
                    setTimeout(() => el.classList.add('loaded'), 100);
                });
                imageElement.addEventListener('error', () => console.error('error'));
                imageElement.src = imageElement.dataset.url;
            }

            const sourceElement = children.find((el) => el.nodeName === 'SOURCE');
            if (sourceElement) {
                sourceElement.addEventListener('load', () => {
                    setTimeout(() => el.classList.add('loaded'), 100);
                });
                sourceElement.addEventListener('error', () => console.error('error'));
                sourceElement.srcset = sourceElement.dataset.srcset;
            }
        }

        function handleIntersect(entries, observer) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadImage();
                    observer.unobserve(el);
                }
            });
        }

        function createIntersectionObserver() {
            const options = {
                root: null,
                threshold: '0',
            };
            const intersectionObserver = new IntersectionObserver(handleIntersect, options);
            intersectionObserver.observe(el);
        }
        if (window['IntersectionObserver']) {
            createIntersectionObserver();
        } else {
            loadImage();
        }

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'data-url' || mutation.attributeName === 'data-srcset') {
                    if (window['IntersectionObserver']) {
                        createIntersectionObserver();
                    } else {
                        loadImage();
                    }
                }
            });
        });
        const children = Array.from(el.children);
        const imageElement = children.find((el) => el.nodeName === 'IMG');

        if (imageElement) {
            observer.observe(imageElement, { attributes: true, childList: false, characterData: false });
        }
        const sourceElement = children.find((el) => el.nodeName === 'SOURCE');

        if (sourceElement && imageElement) {
            observer.observe(imageElement, { attributes: true, childList: false, characterData: false });
        }
    },
};
