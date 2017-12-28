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
    navigation();
});

// Check if HMR is enabled, then accept itself.
if (module.hot) {
    module.hot.accept();
}
