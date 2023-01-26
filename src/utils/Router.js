
export default class Router {

    constructor(state) {
        this.stateObject = state;
        this.formRoutes = document.querySelector('.wrapper').dataset.routes.split(',');
    }

    getNextRouter() {
        let currentActiveRouter = document.querySelector('.wrapper').dataset.activeRoute;
        let mode = document.querySelector('.wrapper').dataset.mode;
        const cvType = document.querySelector('.wrapper').dataset.activeCv;
        const cvId = document.querySelector('.wrapper').dataset.cvId;
        let index = this.formRoutes.indexOf(currentActiveRouter);
        if (index===-1 || index===this.formRoutes.length-1) return undefined;
        let nextRouter = this.formRoutes[index+1];
        nextRouter += this.stateObject.getViewRoute(nextRouter);
        let compRouter = '';
        if (mode==='new') {
            compRouter = `/editor/new/${cvType}/${nextRouter}`;
        }
        else if (mode==='edit') {
            compRouter = `/editor/${cvId}/${cvType}/${nextRouter}`;
        }
        else {
            compRouter = `/editor/${cvType}/${nextRouter}`;
        }
        console.log(compRouter);
        return compRouter;
    }

    getPrevRouter() {
        let currentActiveRouter = document.querySelector('.wrapper').dataset.activeRoute;
        let mode = document.querySelector('.wrapper').dataset.mode;
        let index = this.formRoutes.indexOf(currentActiveRouter);
        const cvType = document.querySelector('.wrapper').dataset.activeCv;
        const cvId = document.querySelector('.wrapper').dataset.cvId;
        if (index===-1 || index===0) return undefined;
        let backRouter = this.formRoutes[index-1];
        backRouter += this.stateObject.getViewRoute(backRouter);
        let compRouter = '';
        if (mode==='new') {
            compRouter = `/editor/new/${cvType}/${backRouter}`;
        }
        else if (mode==='edit') {
            compRouter = `/editor/${cvId}/${cvType}/${backRouter}`;
        }
        else {
            compRouter = `/editor/${cvType}/${backRouter}`
        }
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
        let mode = document.querySelector('.wrapper').dataset.mode;
        const cvId = document.querySelector('.wrapper').dataset.cvId;
        let router = '';
        if (mode==='new') {
            router = `/editor/new/${this.stateObject.cvType}/${view}` + this.stateObject.getViewRoute(view);
        }
        else if (mode==='edit') {
            router = `/editor/${cvId}/${this.stateObject.cvType}/${view}` + this.stateObject.getViewRoute(view);
        }
        else {
            router = `/editor/${this.stateObject.cvType}/${view}` + this.stateObject.getViewRoute(view);
        }
        window.history.pushState('', '', window.location.origin + router);
        window.dispatchEvent(new PopStateEvent('popstate', {state: router}));
    }

    dispatchAbsView(route) {
        let mode = document.querySelector('.wrapper').dataset.mode;
        const cvId = document.querySelector('.wrapper').dataset.cvId;
        let router = '';
        if (mode==='new') {
            router = `/editor/new/${this.stateObject.cvType}/${route}`;
        }
        else if (mode==='edit') {
            router = `/editor/${cvId}/${this.stateObject.cvType}/${route}`;
        }
        else {
            router = `/editor/${this.stateObject.cvType}/${route}`;
        }
        window.history.pushState('', '', window.location.origin + router);
        window.dispatchEvent(new PopStateEvent('popstate', {state: router}));
    }

    listenForRouteEvent() {
        window.addEventListener("popstate", (e) => {
            //change div here
            //let prevActiveRouter = document.querySelector('.cv-form').dataset.activeClass;
            let pathnameArray = window.location.pathname.split('/').filter(url => url!=='');
            console.log(pathnameArray);
            let mode = document.querySelector('.wrapper').dataset.mode;
            if (mode==='new') {
                let cvType = pathnameArray[2];
                let view = pathnameArray[3];
                let params = pathnameArray.slice(4);
                this.stateObject.updateView(view, params);
            }
            else if (mode==='edit') {
                let cvType = pathnameArray[2];
                let view = pathnameArray[3];
                let params = pathnameArray.slice(4);
                this.stateObject.updateView(view, params);
            }
            else {
                let cvType = pathnameArray[1];
                let view = pathnameArray[2];
                let params = pathnameArray.slice(3);
                this.stateObject.updateView(view, params);
            }
        });
    }
};