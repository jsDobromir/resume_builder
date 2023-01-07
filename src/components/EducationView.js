import GenericList from "./genericUtils/GenericList";
import GenericForm from "./genericUtils/GenericForm";

export default class EducationView {

    constructor(state, evEmmiterObj, router) {
        this.state = state;
        this.evEmmiterObj = evEmmiterObj;
        this.routerObj = router;
        this.title = 'education';
        this.multiRouteComp = true;
        this.currentView = null;
        this.listView = new GenericList(this.state, this.evEmmiterObj, this, this.routerObj, this.title);
        this.formView = new GenericForm(this.state, this.evEmmiterObj, this, this.routerObj, this.title);
    }

    render(params) {
        let html = '<div class="education editor">'

        if (params.length) {
            let param = params[0];
            this.currentView = 'form';
            //render form
            if (param==='create') {
                html+= this.formView.render() + '</div>';
            }
            else {
                //get experience
                let genObj = this.listView.getGenObj(param);
                html+= this.formView.render(genObj) + '</div>';
            }
            return html;
        }

        this.currentView = 'list';
        html += this.listView.render() + '</div>';
        return html;
    }

    setView(isList) {
        isList ? this.currentView = 'list' : this.currentView = 'form';
    }

    attachEventListeners() {
        if (this.currentView==='list') {
            this.listView.attachEventListeners();
        }
        else if (this.currentView==='form') {
            this.formView.attachEventListeners();
        }
    }

    checkRouteExtension() {
        return (this.listView.getListArray().length > 0 ? '' : '/create');
    }

    createGenObj(dataObj) {
        const newExp = this.listView.createGenObj(dataObj);
        return newExp;
    }

    editGenObj(experience, formDataObj) {
        return this.listView.editGenObj(experience, formDataObj);
    }

    changeView(nextView) {
        this.currentView = nextView;
        if (nextView==='list') {
            this.routerObj.dispatchAbsView(this.title);
            return;
        }
        else if (nextView==='form') {
            this.routerObj.dispatchAbsView(this.title + '/create');
            return;
        }
    }

    setEditObj() {
        let index = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
        const cv_id = document.querySelector('.wrapper').dataset.cvId;
        let resume = null;
        for (let i=0;i<this.state.resumes.length;i++) {
            let key = Object.keys(this.state.resumes[i]);
            if (key==cv_id) {
                resume = this.state.resumes[i][key];
                break;
            }
        }

        if (!resume) return;

        let eduItem = resume.education.find(edu => edu.index==index);
        this.formView.mode = 'edit';
        this.formView.editObj = eduItem;
        let textarea_type = eduItem.textarea_type;
        this.formView.textAreaComp.contentElement = textarea_type;
    }
}