import GenericList from "./genericUtils/GenericList";
import GenericForm from "./genericUtils/GenericForm";

class ExperienceView {

    constructor(state, evEmitterObj, routerObj) {
        this.state = state;
        this.evEmitterObj = evEmitterObj;
        this.routerObj = routerObj;
        this.title = 'experience';
        this.multiRouteComp = true;
        this.currentView = null;
        this.listView = new GenericList(this.state, this.evEmitterObj, this, this.routerObj, this.title);
        this.formView = new GenericForm(this.state, this.evEmitterObj, this, this.routerObj, this.title);
    }

    attachEventListeners() {
        if (this.currentView==='list') {
            this.listView.attachEventListeners();
        }
        else if (this.currentView==='form') {
            this.formView.attachEventListeners();
        }
    }

    setView(isList) {
        isList ? this.currentView = 'list' : this.currentView = 'form';
    }

    render(params) {
        let html = '<div class="experience editor">'

        if (params.length) {
            let param = params[0];
            //render form
            this.currentView = 'form';
            if (param==='create') {
                html+= this.formView.render() + '</div>';
            }
            else {
                //get experience
                let experience = this.listView.getGenObj(param);
                html+= this.formView.render(experience) + '</div>';
            }
            return html;
        }

        this.currentView = 'list';
        html += this.listView.render() + '</div>';
        return html;
    }

    checkRouteExtension() {
        return (this.listView.getListArray().length > 0 ? '' : '/create');
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

    createGenObj(dataObj) {
        const newExp = this.listView.createGenObj(dataObj);
        return newExp;
    }

    editGenObj(experience, formDataObj) {
        return this.listView.editGenObj(experience, formDataObj);
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

        let expItem = resume.experience.find(exp => exp.index==index);
        this.formView.mode = 'edit';
        this.formView.editObj = expItem;
        let textarea_type = expItem.textarea_type;
        this.formView.textAreaComp.contentElement = textarea_type;
    }
}


export default function(state, evEmitterObj, routerObj) {
    const experienceInstance = new ExperienceView(state, evEmitterObj, routerObj);
    return experienceInstance;
}