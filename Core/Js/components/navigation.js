'use strict';

export default (
    navigation = '.js-nav',
    metaNavigation = '.js-nav-meta',
    trigger = '.js-nav-trigger'
) => {
    $(trigger).on('click', function () {
        $(navigation).toggleClass('is-visible');
        $(trigger).toggleClass('is-active');
    });
};
