export default class Model {

    constructor(genList, data, index, routerObj, title) {
        this.genList = genList;
        this.data = data;
        this.index = index;
        this.routerObj = routerObj;
        this.title = title;
        this.classname = `${this.title}_${this.index}`;
    }

    serialize() {
        this.data['index'] = this.index;
        return this.data;
    }
    
    render() {
        let address_school_comp = undefined;
        if (this.data && this.data['companyaddress']) {
            address_school_comp = this.data['companyaddress'];
        }
        else if (this.data && this.data['schooladdress']) {
            address_school_comp = this.data['schooladdress'];
        }
        return `<div class="${this.classname}">
                    <div class="buttons_icons">
                        <div class="select-wrapper">
                            <button type="button" class="btn-edit-resume" id="edit_exp">Edit</button>
                            <button type="button" class="btn-delete-resume" id="delete_exp">Delete</button>
                        </div>
                    </div>
                    <span class="position">${this.title==='experience' ? this.data.position : this.data.degree}</span>
                    <div class="dates_comp_wrapper">
                        <div class="${this.title==='experience' ? 'exp' : 'edu'}_address_wrapper">
                            <span class="place">${this.title==='experience' ? this.data.company : this.data.school}</span>
                            <span class="${this.title}_address">${address_school_comp ? address_school_comp : ''}</span>
                        </div>
                        <span class="dates">
                            <span class="date_span startMonth">${this.data.startMonth}</span>
                            <span class="date_span startYear">${this.data.startYear}</span>
                            <span class="delimeter"> - </span>
                            ${(this.data.endMonth && this.data.endYear) ? `<span class="date_span endMonth">${this.data.endMonth}</span> <span class="date_span endYear">${this.data.endYear}</span>` : 
                                                                            `<span class="date_span">Present</span>`}
                        </span>
                    </div>
                    ${this.data.textarea_type_div ? `<div class="description">${this.data.textarea_prof_desc}</div>` : `<ul class="description ul_holder">${this.data.textarea_prof_desc}</ul>`}
                    
                </div>`;
    }

    attachEventListeners() {
        document.querySelector(`.${this.classname} #delete_exp`).addEventListener('click', (event) => {
            document.querySelector(`.${this.title} .${this.classname}`).remove();
            this.genList.deleteGenObj(this);
            if (this.genList.getListArray().length===0) {
                this.routerObj.dispatchAbsView(this.title + '/create');
                this.genList.evEmitterObj.emit(`model_deleted`, {div: `${this.title}__list__item__${this.index}`, type: this.title});
                return;
            }
            this.genList.evEmitterObj.emit(`model_deleted`, {div: `${this.title}__list__item__${this.index}`, type: this.title});
        });

        document.querySelector(`.${this.classname} #edit_exp`).addEventListener('click', (event) => {
            this.routerObj.dispatchAbsView(this.title + '/' + this.index);
        });
    }
}