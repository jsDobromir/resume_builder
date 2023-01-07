import Model from './Model.js';

export default class GenericList {

    constructor(state, evEmitterObj, parentComp, routerObj, title) {
        this.state = state;
        this.evEmitterObj = evEmitterObj;
        this.parentComp = parentComp;
        this.routerObj = routerObj;
        this.title = title;
        this.objIndex = 1;
        this.list = this.getStateMap();
    }

    render() {
        let html = `<div class="${this.title}_list_wrapper">`
        html += `<div class="${this.title}_list">`;
        this.list.forEach(exp => {
            html+= exp.render();
        });
        html += `</div>`;
        html+= '</div>';
        html+= `<div class="add_${this.title}_div">
                    <button type="button" id="add_${this.title}" class="btn btn-add-experience">Add another ${this.title}</button>
                </div>`;
        html+='</div>';
        return html;
    }

    attachEventListeners() {
        document.querySelector(`.${this.title} #add_${this.title}`).addEventListener('click', (event) => {
            this.parentComp.changeView('form');
        });

        this.list.forEach((value, key) => {
            value.attachEventListeners();
        });        
    }

    createGenObj(data) {
        let key = `obj_${this.objIndex}`;
        const model = new Model(this, data, this.objIndex, this.routerObj, this.title);
        this.list.set(key, model);
        this.objIndex++;
        return model;
    }

    deleteGenObj(object) {
        let key = `obj_${object.index}`;
        this.list.delete(key);
        this.state.update(this.title, this.getListArray());
    }

    editGenObj(object, formDataObj) {
        let key = `obj_${object.index}`;
        let obj = this.list.get(key);
        obj.data = formDataObj;
        this.list.set(key, obj);
        return obj;
    }
    getGenObj(index) {
        let key = `obj_${index}`;
        return this.list.get(key);
    }

    getListArray() {
        const objects = Array.from(this.list.values()).map(obj => {
            return obj.serialize();
        })
        return objects;
    }

    getObjIndex() {
        return this.objIndex;
    }

    getStateMap() {
        const list = this.state.getComponentArray(this.title);
        const map = new Map();
        let lastIndex = list.length ? list[list.length-1].index : undefined;
        list.forEach(el => {
            let key = `obj_${el.index}`;
            const model = new Model(this, el, el.index, this.routerObj, this.title);
            map.set(key, model);
        });
        this.objIndex = lastIndex ? (lastIndex+1) : this.objIndex;
        return map;
    }
}