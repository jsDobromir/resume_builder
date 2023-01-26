import { filterRouter } from "../utils/domHelper";

export default class ButtonsNav {

    constructor(state, evEmmiter, router) {
        this.state = state;
        this.evEmmiter = evEmmiter;
        this.router = router;
    }

    attachEventListeners() {
        document.querySelectorAll('.navigation_buttons-desktop .buttons-desktop button').forEach(button => {
            button.addEventListener('click', (event) => {
                if (event.target.classList.contains('btn-back')) {
                    if (this.router.getPrevRouter()) {
                        this.router.dispatchBackRouter();
                    }
                }
                else if (event.target.classList.contains('btn-remove')) {
                    const activeRoute = document.querySelector('.wrapper').dataset.activeRoute;
                    const cvType = document.querySelector('.wrapper').dataset.activeCv;
                    const cv_id = document.querySelector('.wrapper').dataset.cvId;
                    if (window.confirm(`Are you sure you want to delete ${activeRoute} section?`)) {
                        fetch(`/deleteResumeRoute/${cv_id}/${cvType}/${activeRoute}`, {method: 'DELETE'})
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    let index = this.router.formRoutes.indexOf(activeRoute);
                                    let nextRouter = this.router.formRoutes[index+1];
                                    document.querySelector(`.track_bar .track_bar_inner [data-url="${activeRoute}"]`).remove();
                                    document.querySelector(`.track_bar .track_bar_inner [data-url="${nextRouter}"]`).classList.add('active');
                                    let filteredRouter = filterRouter(activeRoute);
                                    document.querySelector(`.cvcomp .${filteredRouter}`).remove();
                                    this.router.formRoutes = data.routes;
                                    this.router.dispatchView(nextRouter);
                                }
                            });
                    }
                }
                else if (event.target.classList.contains('btn-next')) {
                    console.log(this.router.getNextRouter());
                    if (this.router.getNextRouter()) {
                        this.router.dispatchNextRouter();
                    }
                }
            });
        });

        document.querySelectorAll('.navigation_buttons .buttons button').forEach(button => {
            button.addEventListener('click', (event) => {
                if (event.target.classList.contains('btn-back')) {
                    if (this.router.getPrevRouter()) {
                        this.router.dispatchBackRouter();
                    }
                }
                else if (event.target.classList.contains('btn-remove')) {
                    const activeRoute = document.querySelector('.wrapper').dataset.activeRoute;
                    const cvType = document.querySelector('.wrapper').dataset.activeCv;
                    const cv_id = document.querySelector('.wrapper').dataset.cvId;
                    if (window.confirm(`Are you sure you want to delete ${activeRoute} section?`)) {
                        fetch(`/deleteResumeRoute/${cv_id}/${cvType}/${activeRoute}`, {method: 'DELETE'})
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    let index = this.router.formRoutes.indexOf(activeRoute);
                                    let nextRouter = this.router.formRoutes[index+1];
                                    document.querySelector(`.track_bar .track_bar_inner [data-url="${activeRoute}"]`).remove();
                                    document.querySelector(`.track_bar .track_bar_inner [data-url="${nextRouter}"]`).classList.add('active');
                                    let filteredRouter = filterRouter(activeRoute);
                                    document.querySelector(`.cvcomp .${filteredRouter}`).remove();
                                    this.router.formRoutes = data.routes;
                                    this.router.dispatchView(nextRouter);
                                }
                            });
                    }
                }
                else if (event.target.classList.contains('btn-next')) {
                    if (this.router.getNextRouter()) {
                        this.router.dispatchNextRouter();
                    }
                }
            });
        });
    }

    setActiveRoute() {
        let backDisabled = this.router.getPrevRouter();
        if (backDisabled) {
            document.querySelector('.navigation_buttons-desktop .buttons-desktop .btn-back').removeAttribute('disabled');
            document.querySelector('.navigation_buttons .buttons .btn-back').removeAttribute('disabled');
        }
        else {
            document.querySelector('.navigation_buttons-desktop .buttons-desktop .btn-back').disabled = true;
            document.querySelector('.navigation_buttons .buttons .btn-back').disabled = true;
        }

        const activeRoute = document.querySelector('.wrapper').dataset.activeRoute;
        if (activeRoute==='personal' || activeRoute==='finalize') {
            document.querySelector('.navigation_buttons-desktop .buttons-desktop .btn-remove').disabled = true;
            document.querySelector('.navigation_buttons .buttons .btn-remove').disabled = true;
        }
        else {
            document.querySelector('.navigation_buttons-desktop .buttons-desktop .btn-remove').removeAttribute('disabled');
            document.querySelector('.navigation_buttons .buttons .btn-remove').removeAttribute('disabled');
        }

        let nextDisabled = this.router.getNextRouter();
        if (nextDisabled) {
            document.querySelector('.navigation_buttons-desktop .buttons-desktop .btn-next').removeAttribute('disabled');
            document.querySelector('.navigation_buttons .buttons .btn-next').removeAttribute('disabled');
        }
        else {
            document.querySelector('.navigation_buttons-desktop .buttons-desktop .btn-next').disabled = true;
            document.querySelector('.navigation_buttons .buttons .btn-next').disabled = true;
        }
    }
}