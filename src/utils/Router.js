import { getFormRoutes } from "./domHelper";

export default class Router {

    constructor(state) {
        this.stateObject = state;
        this.formRoutes = document.querySelector('.wrapper').dataset.routes.split(',');
    }

    getNextRouter() {
        let currentActiveRouter = document.querySelector('.wrapper').dataset.activeRoute;
        let current_cv_id = document.querySelector('.wrapper').dataset.cvId;
        let index = this.formRoutes.indexOf(currentActiveRouter);
        if (index===-1 || index===this.formRoutes.length-1) return undefined;
        let nextRouter = this.formRoutes[index+1];
        nextRouter += this.stateObject.getViewRoute(nextRouter);
        const cvType = this.stateObject.cvType;
        const compRouter = `/editor/${current_cv_id}/${cvType}/${nextRouter}`;
        return compRouter;
    }

    getPrevRouter() {
        let currentActiveRouter = document.querySelector('.wrapper').dataset.activeRoute;
        let index = this.formRoutes.indexOf(currentActiveRouter);
        let current_cv_id = document.querySelector('.wrapper').dataset.cvId;
        if (index===-1 || index===0) return undefined;
        let backRouter = this.formRoutes[index-1];
        backRouter += this.stateObject.getViewRoute(backRouter);
        const cvType = this.stateObject.cvType;
        const compRouter = `/editor/${current_cv_id}/${cvType}/${backRouter}`;
        return compRouter;
    }

    dispatchNextRouter() {
        let nextRouter = this.getNextRouter();
        if (!nextRouter) return false;
        window.history.pushState({nextRouter}, nextRouter, window.location.origin + nextRouter);
        window.dispatchEvent(new PopStateEvent('popstate', {state: nextRouter}));
    }

    dispatchBackRouter() {
        let prevRouter = this.getPrevRouter();
        prevRouter = (prevRouter==='index') ? '/' : prevRouter; 
        if (!prevRouter) return false;
        window.history.pushState({prevRouter}, prevRouter, window.location.origin + prevRouter);
        window.dispatchEvent(new PopStateEvent('popstate', {state: prevRouter}));
    }

    dispatchView(view) {
        let current_cv_id = document.querySelector('.wrapper').dataset.cvId;
        let router = `/editor/${current_cv_id}/${this.stateObject.cvType}/${view}` + this.stateObject.getViewRoute(view);
        window.history.pushState('', '', window.location.origin + router);
        window.dispatchEvent(new PopStateEvent('popstate', {state: router}));
    }

    dispatchAbsView(route) {
        let current_cv_id = document.querySelector('.wrapper').dataset.cvId;
        window.history.pushState('', '', window.location.origin + `/editor/${current_cv_id}/${this.stateObject.cvType}/${route}`);
        window.dispatchEvent(new PopStateEvent('popstate', {state: `/editor/${current_cv_id}/${this.stateObject.cvType}/${route}`}));
    }

    listenForRouteEvent() {
        window.addEventListener("popstate", (e) => {
            //change div here
            //let prevActiveRouter = document.querySelector('.cv-form').dataset.activeClass;
            let pathnameArray = window.location.pathname.split('/').filter(url => url!=='');
            if (pathnameArray.length>=4) {
                let id = pathnameArray[1];
                let cvType = pathnameArray[2];
                let view = pathnameArray[3];
                let params = pathnameArray.slice(4);
                this.stateObject.updateView(id, view, params);
            }
        });
    }
};