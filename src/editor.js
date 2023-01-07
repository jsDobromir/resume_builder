
import App from './App.js';

document.addEventListener('DOMContentLoaded', (event) => {

    const app = new App();
    app.init();
    app.attachListenersToActiveComp();
});