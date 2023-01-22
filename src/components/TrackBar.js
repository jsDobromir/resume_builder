
export default class TrackBar {

    constructor(state, evEmmiter, router) {
        this.state = state;
        this.evEmmiter = evEmmiter;
        this.router = router;
    }

    attachEventListeners() {
        document.querySelector('.track_bar').querySelectorAll('a').forEach(route => {
            route.addEventListener('click', (event) => {
		event.preventDefault();
                if (event.target.classList.contains('active')) return;
                document.querySelector('.track_bar .active').classList.remove('active');
                const route = event.target.dataset.url;
                event.target.classList.add('active');
                this.router.dispatchView(route);
            });
        });
    }

    setActiveRoute() {
        const activeRoute = document.querySelector('.wrapper').dataset.activeRoute;
        document.querySelectorAll('.track_bar .track_bar_inner .route').forEach(route => {
            const routeLocal = route.dataset.url;
            if (activeRoute===routeLocal) {
                document.querySelector('.track_bar .active').classList.remove('active');
                route.classList.add('active');
            }
        });
    }
}
