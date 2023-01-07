import { domBuild } from "../../utils/domHelper";

export default class TextAreaComp {

    constructor(parentComp, type, evEmitterObj) {
        this.parentComp = parentComp;
        this.type = type;
        this.contentElement = 'text';
        this.evEmitterObj = evEmitterObj;
    }

    render(genObj) {
        let obj = genObj ? genObj.serialize() : undefined;
        if (obj) {
            this.contentElement = obj.textarea_type;
            if (obj.textarea_type==='text') {
                let html = `<div class="form__group col-12 textarea_comp">
                        <div class="wrapper_label">
                            <label class="form__label" for="description">Describe your ${this.type}</label>
                            <span class="icon_label_list"></span>
                        </div>
                        <textarea class="form-control" rows="8" name="textarea_prof_desc" id="textarea_prof_desc">${obj.textarea_prof_desc}</textarea>
                    </div>`;
            return html;
            }
            else if (obj.textarea_type==='list') {
                const divLi = document.createElement('div');
                divLi.innerHTML = obj.textarea_prof_desc.trim();
                let html = `<div class="form__group col-12 textarea_comp">
                                <div class="wrapper_label">
                                    <label class="form__label" for="description">Describe your ${this.type}<span class="bullet_text">(as bullet list)</span></label>
                                    <span class="icon_label_text"></span>
                                </div>
                                    <div class="row">
                                        <div class="col-6">
                                            <input type="text" class="form__input bullet_desc" id="bullet_desc" maxlength="250"/>
                                        </div>
                                        <div class="col-6">
                                            <button type="button" class="btn btn_add_bullet">Save</button>
                                        </div>
                                    </div>
                                <ul class="list_holder">
                                    ${Array.from(divLi.querySelectorAll('li')).map(elLi => {
                                        const index = elLi.className.split('_')[1];
                                        return `<li class="${elLi.className}"><div class="divElemIcon"><span>${elLi.textContent}</span><span class="remove_icon remove_icon_${index}"><i class="fa-sharp fa-solid fa-trash"></i></span></div></li>`;
                                    }).join('')}
                                </ul>
                            </div>`;
                return html;
            }
        }
        else {
            if (this.contentElement==='text') {
                let html = `<div class="form__group col-12 textarea_comp">
                            <div class="wrapper_label">
                                <label class="form__label" for="description">Describe your ${this.type}</label>
                                <span class="icon_label_list"></span>
                            </div>
                            <textarea class="form-control" rows="8" name="textarea_prof_desc" id="textarea_prof_desc"></textarea>
                        </div>`;
                return html;
            }
            else if (this.contentElement==='list') {
                let html = `<div class="form__group col-12 textarea_comp">
                                <div class="wrapper_label">
                                    <label class="form__label" for="description">Describe your ${this.type}<span class="bullet_text">(as bullet list)</span></label>
                                    <span class="icon_label_text"></span>
                                </div>
                                    <div class="row">
                                        <div class="col-6">
                                            <input type="text" class="form__input bullet_desc" id="bullet_desc" maxlength="250"/>
                                        </div>
                                        <div class="col-6">
                                            <button type="button" class="btn btn_add_bullet">Save</button>
                                        </div>
                                    </div>
                                <ul class="list_holder></ul>
                            </div>`;
                return html;
            }
        }
    }

    addEventListeners() {
        if (this.contentElement==='text') {
            document.querySelector('.textarea_comp textarea').addEventListener('keyup', (keyEvent) => {
                let div_index = this.parentComp.parentComp.listView.getObjIndex();
                if (this.parentComp.mode === 'edit') div_index = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
                let title = this.parentComp.title;
                this.evEmitterObj.emit(`input_event_list`, { input_id: keyEvent.target.id, input_value: keyEvent.target.value, div: `${title}__list__item__${div_index}`, mode: this.parentComp.mode, type: this.parentComp.title, description_type: this.contentElement });
            });
            document.querySelector('.wrapper_label .icon_label_list').addEventListener('click', (ev) => {
                this.contentElement = 'list';
                this.parentComp.updateTextComp();
                let div_index = this.parentComp.parentComp.listView.getObjIndex();
                if (this.parentComp.mode === 'edit') div_index = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
                let title = this.parentComp.title;
                this.evEmitterObj.emit('icon_changed_list', {type: title,div: `${title}__list__item__${div_index}`});
            });
        }
        else if (this.contentElement==='list') {
            document.querySelector('.textarea_comp .btn_add_bullet').addEventListener('click', (event) => {
                const textEl = document.querySelector('#bullet_desc').value;
                document.querySelector('#bullet_desc').value = '';
                const childCount = document.querySelector('.list_holder').lastElementChild ? 
                    (parseInt(document.querySelector('.list_holder').lastElementChild.classList.value.split('_')[1]) + 1) : (document.querySelector('.list_holder').childElementCount + 1);
                const li = domBuild('li', {class: `liElem_${childCount}`}, ...[
                    domBuild('div',{class: 'divElemIcon'}, ...[
                        domBuild('span', {}, document.createTextNode(textEl)),
                        domBuild('span', {class: `remove_icon remove_icon_${childCount}`}, ...[
                            domBuild('i', {class: 'fa-sharp fa-solid fa-trash'}, document.createTextNode(''))
                        ])
                    ])
                ]);
                let div_index = this.parentComp.parentComp.listView.getObjIndex();
                if (this.parentComp.mode === 'edit') div_index = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
                let title = this.parentComp.title;
                this.evEmitterObj.emit('bullet_added', {type: title, div: `${title}__list__item__${div_index}`,liElem: `liElem_${childCount}`, textEl: textEl});
                document.querySelector('.list_holder').appendChild(li);
                this.addNewRemoveListener(childCount);
            });
            this.addRemoveListener();
            document.querySelector('.wrapper_label .icon_label_text').addEventListener('click', (ev) => {
                this.contentElement = 'text';
                this.parentComp.updateTextComp();
                let div_index = this.parentComp.parentComp.listView.getObjIndex();
                if (this.parentComp.mode === 'edit') div_index = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
                let title = this.parentComp.title;
                this.evEmitterObj.emit('icon_changed_text', {type: title, div: `${title}__list__item__${div_index}`});
            });
        }
    }

    addRemoveListener() {
        document.querySelectorAll(`.list_holder .remove_icon`).forEach(remIcon => {
            remIcon.addEventListener('click', (ev) => {
                const index = ev.currentTarget.classList.value.split(' ')[1].split('_')[2];
                document.querySelector(`.textarea_comp .liElem_${index}`).remove();
                let title = this.parentComp.title;
                let div_index = this.parentComp.parentComp.listView.getObjIndex();
                if (this.parentComp.mode === 'edit') div_index = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
                this.evEmitterObj.emit('bullet_removed', {type: title, div: `${title}__list__item__${div_index}`, liElem: `liElem_${index}`});
            });
        })
    }

    addNewRemoveListener(index) {
        document.querySelector(`.list_holder .remove_icon_${index}`).addEventListener('click', (ev) => {
            document.querySelector(`.textarea_comp .liElem_${index}`).remove();
            let title = this.parentComp.title;
            let div_index = this.parentComp.parentComp.listView.getObjIndex();
            if (this.parentComp.mode === 'edit') div_index = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
            this.evEmitterObj.emit('bullet_removed', {type: title, div: `${title}__list__item__${div_index}`, liElem: `liElem_${index}`});
        });
    }

    getHtml() {
        if (this.contentElement==='text') {
            let html = `
                        <div class="wrapper_label">
                            <label class="form__label" for="description">Describe your ${this.type}</label>
                            <span class="icon_label_list"></span>
                        </div>
                        <textarea class="form-control" rows="8" name="textarea_prof_desc" id="textarea_prof_desc"></textarea>`;
            return html;
        }
        else if (this.contentElement==='list') {
            let html = `
                            <div class="wrapper_label">
                                <label class="form__label" for="description">Describe your ${this.type}<span class="bullet_text">(as bullet list)</span></label>
                                <span class="icon_label_text"></span>
                            </div>
                                <div class="row">
                                    <div class="col-6">
                                        <input type="text" class="form__input bullet_desc" id="bullet_desc" maxlength="250"/>
                                    </div>
                                    <div class="col-6">
                                        <button type="button" class="btn btn_add_bullet">Save</button>
                                    </div>
                                </div>
                                <ul class="list_holder"></ul>`;

            return html;
        }
    }

    reset() {
        this.contentElement = 'text';
    }
}
