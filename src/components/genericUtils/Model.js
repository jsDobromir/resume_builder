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
        return `<div class="${this.classname}">
                    <span class="position">${this.title==='experience' ? this.data.position : this.data.degree}</span>
                    <div class="dates_comp_wrapper">
                        <span class="place">${this.title==='experience' ? this.data.company : this.data.school}</span>
                        <span class="dates">
                            <span class="date_span startMonth">${this.data.startMonth}</span>
                            <span class="date_span startYear">${this.data.startYear}</span>
                            <span class="delimeter"> - </span>
                            ${(this.data.endMonth && this.data.endYear) ? `<span class="date_span endMonth">${this.data.endMonth}</span> <span class="date_span endYear">${this.data.endYear}</span>` : 
                                                                            `<span class="date_span">Present</span>`}
                        </span>
                    </div>
                    ${this.data.textarea_type_div ? `<div class="description">${this.data.textarea_prof_desc}</div>` : `<ul class="description ul_holder">${this.data.textarea_prof_desc}</ul>`}
                    <div class="buttons_icons">
                        <span id="delete_exp" data-hover="Delete"><i class="fa-sharp fa-solid fa-trash"></i></span>
                        <span id="edit_exp" data-hover="Edit"><i class="fa-solid fa-pen"></i></span>
                    </div>
                </div>`;
    }

    attachEventListeners() {
        document.querySelector(`.${this.classname} #delete_exp`).addEventListener('click', (event) => {
            document.querySelector(`.${this.title} .${this.classname}`).remove();
            this.genList.deleteGenObj(this);
            this.genList.evEmitterObj.emit(`model_deleted`, {div: `${this.title}__list__item__${this.index}`, type: this.title});
            if (this.genList.getListArray().length===0) {
                this.routerObj.dispatchAbsView(this.title + '/create');
            }
        });

        document.querySelector(`.${this.classname} #edit_exp`).addEventListener('click', (event) => {
            this.routerObj.dispatchAbsView(this.title + '/' + this.index);
        });
    }
}