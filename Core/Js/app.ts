// Styles
import '../Layout/Css/app.css';

// Dependencies
import Turbolinks from 'turbolinks';

// Components
// Import javascript components here

// Run Turbolinks
Turbolinks.start();

/**
 * This is needed to register every Turbolinks page change in Google Analytics!
 * See: https://www.neontsunami.com/posts/google-analytics-with-turbolinks-5
 * @param {*} event
 */
const registerGoogleAnalyticsPageView = (event): void => {
    if (typeof ga === 'function') {
        ga('set', 'location', event.data.url);
        ga('send', 'pageview');
    }
};

/**
 * Initialize components when document is ready.
 */
document.addEventListener('turbolinks:load', (event) => {
    registerGoogleAnalyticsPageView(event);
    // Initialize components here that are loaded on every page
    // navigation();
    // forms();

    // Dynamic imports with code splitting for lazy loading
    // Lazy, or "on demand", loading is a great way to optimize your site or application. This practice essentially involves splitting your
    // code at logical breakpoints, and then loading it once the user has done something that requires, or will require, a new block of code.
    // This speeds up the initial load of the application and lightens its overall weight as some blocks may never even be loaded.
    if (document.getElementById('splash-app')) {
        import('./containers/SplashPage').then((page) => page.default());
    }
});

// Turbolinks should not reload when clicking anchor links
// See: https://github.com/turbolinks/turbolinks/issues/75#issuecomment-443256173
document.addEventListener('turbolinks:click', (event) => {
    if (event.target.getAttribute('href').charAt(0) === '#') {
        Turbolinks.controller.pushHistoryWithLocationAndRestorationIdentifier(event.data.url, Turbolinks.uuid());
        event.preventDefault();
    }
});

// Check if HMR is enabled, then accept itself.
if (module.hot) {
    module.hot.accept();

    // Make sure we trigger turbolinks to do a page load and re-init the components to see our changes.
    module.hot.addStatusHandler((status) => {
        if (status === 'idle') {
            Turbolinks.dispatch('turbolinks:load');
        }
    });
}
