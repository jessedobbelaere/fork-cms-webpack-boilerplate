import React from 'react';
import { render } from 'react-dom';

import SplashPageApp from './SplashPageApp';

export default (): void => {
    render(<SplashPageApp />, document.getElementById('splash-app'));
};
