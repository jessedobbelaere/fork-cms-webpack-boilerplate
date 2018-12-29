'use strict';

// Styles
import '../Layout/Scss/screen.scss';

// Components
import navigation from './components/navigation';

/**
 * Check if the document is ready to start executing scripts.
 * Similar to jQuery's $(document).ready function.
 * @param fn
 */
const documentReady = (fn) => {
    if (document.readyState !== 'loading') {
        return fn();
    }
    document.addEventListener('DOMContentLoaded', fn);
};

/**
 * Initialize components when document is ready.
 */
documentReady(() => {
    console.log('Document is ready!');

    // Initialize the navigation and other components
    navigation();

    // Dynamic imports with code splitting for lazy loading
    // Lazy, or "on demand", loading is a great way to optimize your site or application. This practice essentially involves splitting your
    // code at logical breakpoints, and then loading it once the user has done something that requires, or will require, a new block of code.
    // This speeds up the initial load of the application and lightens its overall weight as some blocks may never even be loaded.
    if (document.querySelector('.photo-gallery-instance')) {
        import('./components/photos').then(photos => photos.default('.photo-gallery-instance'));
    }
});

// Check if HMR is enabled, then accept itself.
if (module.hot) {
    module.hot.accept();
}
