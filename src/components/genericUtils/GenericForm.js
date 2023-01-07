import { buildGenHTML } from "./helpers";
import { buildMonths, buildYear} from "../../utils/domHelper.js";
import TextAreaComp from "./TextAreaComp";
export default class GenericForm {

    constructor(state, evEmitterObj, parentComp, routerObj, title) {
        this.state = state;
        this.evEmitterObj = evEmitterObj;
        this.parentComp = parentComp;
        this.routerObj = routerObj;
        this.title = title;
        this.mode = 'create';
        this.editObj = null;
        this.textAreaComp = new TextAreaComp(this, this.title, this.evEmitterObj);
    }

    render(genObj) {
        this.mode = genObj ? 'edit' : 'create';
        this.editObj = genObj ? genObj : null;
        const listLength = this.parentComp.listView.getListArray().length;
        if (this.mode==='create') {
            this.textAreaComp.reset();
        }
        return `<form class="form_${this.title} ${genObj ? 'edit' : ''}">
                            <div class="row">
                                ${buildGenHTML(this.title, genObj)}
                            
                                <div class="form__group col-6 date_top">
                                    <select name="startMonth" id="startMonth" class="form-select date_select" required>
                                        <option value="" selected disabled hidden>Select Start Month</option>
                                        ${buildMonths().map(month => {
                                            return `<option value="${month}" ${genObj ? (month == genObj.serialize()['startMonth'] ? 'selected' : '') : ''}>${month}</option>`
                                        })};
                                    </select>
                                </div>

                                <div class="form__group col-6 date_top">
                                    <select name="startYear" id="startYear" class="form-select date_select" required>
                                        <option value="" selected disabled hidden>Select Start Year</option>
                                        ${buildYear(true).map(year => {
                                            return `<option value="${year}" ${genObj ? (year == genObj.serialize()['startYear'] ? 'selected' : '') : ''}>${year}</option>`
                                        })};
                                    </select>
                                </div>
                            
                                <div class="form__group col-6">
                                    <select name="endMonth" id="endMonth" class="form-select date_select" required ${(genObj && !genObj.serialize()['endMonth']) ? 'disabled' : ''}>
                                    <option value="" selected disabled hidden>Select End Month</option>
                                        ${buildMonths(false).map(month => {
                                            return `<option value="${month}" ${genObj ? (month == genObj.serialize()['endMonth'] ? 'selected' : '') : ''}>${month}</option>`
                                        })};
                                    </select>
                                </div>

                                <div class="form__group col-6">
                                    <select name="endYear" id="endYear" class="form-select date_select" required ${(genObj && !genObj.serialize()['endYear']) ? 'disabled' : ''}>
                                        <option value="" selected disabled hidden>Select End Year</option>
                                        ${buildYear(false).map(year => {
                                            return `<option value="${year}" ${genObj ? (year == genObj.serialize()['endYear'] ? 'selected' : '') : ''}>${year}</option>`
                                        })};
                                    </select>

                                    <div class="form__check">
                                        <input class="form__check__input" type="checkbox" id="present" ${genObj ? (genObj.serialize()['endMonth'] ? '' : 'checked') : ''}/>
                                        <label class="form__check__label" id="checkbox-inline" for="present">I currently ${this.title==='experience' ? 'work' : 'study'} here</label>
                                    </div>
                                </div>
                            
                                ${this.textAreaComp.render(genObj)}
                            
                                <div class="col-12 buttons">
                                    <div class="buttons_wrapper">
                                        <button type="button" class="btn btn_cancel" id="cancelBtn" ${listLength===0 ? 'disabled' : ''}>Cancel</button>
                                        <button type="submit" class="btn btn-form-submit" id="btnContinue">${this.mode === 'create' ? 'Add' : `Update`}</button>
                                    </div>
                                </div>
                            
                            </div>
                        </form>`;
    }

    attachEventListeners() {
        
        let form = document.querySelector(`.wrapper[data-active-route=${this.title}]`).querySelector('form');
        form.querySelectorAll('input:not([type="checkbox"])').forEach(input => {
            input.addEventListener('keyup', (keyEvent) => {
                if (keyEvent.target.id==='bullet_desc') return;
                let div_index = this.parentComp.listView.getObjIndex();
                if (this.mode === 'edit') div_index = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
                this.evEmitterObj.emit(`input_event_list`, { input_id: keyEvent.target.id, input_value: keyEvent.target.value, div: `${this.title}__list__item__${div_index}`, mode: this.mode, type: this.title, description_type: this.textAreaComp.contentElement });
            });
        });
        form.querySelectorAll('select').forEach(selectInput => {
            selectInput.addEventListener('change', (keyEvent) => {
                let div_index = this.parentComp.listView.getObjIndex();
                if (this.mode === 'edit') div_index = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
                this.evEmitterObj.emit(`input_event_list_select`, { input_id: keyEvent.target.id, input_value: keyEvent.target.value, div: `${this.title}__list__item__${div_index}`, mode: this.mode, type: this.title, description_type: this.textAreaComp.contentElements });
            });
        });
        form.addEventListener('submit', async (formEvent) => {
            formEvent.preventDefault();
            let editMode = form.classList.contains('edit');
            if (form.checkValidity()) {
                let data = new FormData(form);
                const formDataObj = {};
                
                data.append('textarea_type', this.textAreaComp.contentElement);
                data.append('textarea_type_div', (this.textAreaComp.contentElement==='text'));
                if (this.textAreaComp.contentElement==='text') {
                    data.append('textarea_prof_desc', document.querySelector(`.${this.title} #textarea_prof_desc`).value);
                }
                else if (this.textAreaComp.contentElement==='list') {
                    let div_index = this.parentComp.listView.getObjIndex();
                    if (this.mode === 'edit') div_index = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
                    let list = document.querySelector(`.cvcomp .${this.title}__list__item__${div_index} .ul_holder`);
                    data.append('textarea_prof_desc', list.innerHTML);
                }
                data.forEach((value, key) => (formDataObj[key] = value));
                
                let exp = editMode ? this.parentComp.editGenObj(this.editObj, formDataObj) : this.parentComp.createGenObj(formDataObj);
                
                this.state.update(this.title, this.parentComp.listView.getListArray()).then(() => {
                    
                    this.parentComp.changeView('list');
                });
            }
        });

        document.querySelectorAll(`.wrapper[data-active-route=${this.title}] .date_select`).forEach(selectEl => {
            selectEl.addEventListener('change', (event) => {
                this.checkDatesCorrect();
            });
        });

        //checkbox listener
        let checkbox = document.querySelector(`.wrapper[data-active-route=${this.title}] #present`);
        checkbox.addEventListener('click', (event) => {
            let checked = checkbox.checked;
            let div_index = this.parentComp.listView.getObjIndex();
            if (this.mode === 'edit') div_index = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
            if (checked) {
                document.querySelectorAll(`.formcomp .${this.title} #endMonth, .formcomp .${this.title} #endYear`).forEach(endDate => {
                    endDate.disabled = true;
                });
                this.evEmitterObj.emit('end_date_disabled', { div: `${this.title}__list__item__${div_index}`, type: this.title });
                this.checkDatesCorrect();
            }
            else {
                document.querySelectorAll(`.formcomp .${this.title} #endMonth, .formcomp .${this.title} #endYear`).forEach(endDate => {
                    endDate.disabled = false;
                });
                let endMonth = document.querySelector(`.formcomp .${this.title} #endMonth`).value;
                let endYear = document.querySelector(`.formcomp .${this.title} #endYear`).value;
                this.evEmitterObj.emit('end_date_enabled', { div: `${this.title}__list__item__${div_index}`, type: this.title, endMonth: endMonth, endYear: endYear });
                this.checkDatesCorrect();
            }
        });

        this.textAreaComp.addEventListeners();

        document.querySelector(`.wrapper[data-active-route=${this.title}] #cancelBtn`).addEventListener('click', (event) => {
            this.parentComp.currentView = null;
            this.parentComp.changeView('list');
        });

    }

    emitDescriptionEvent(type, obj) {
        let div_index = this.mode === 'edit' ? window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] : (this.parentComp.listView.getObjIndex());
        this.evEmitterObj.emit(type, { ...obj, div: `${this.title}_div_${div_index}`, mode: this.mode, type: this.title });
    }

    checkDatesCorrect() {
        document.querySelector(`.formcomp .${this.title} #btnContinue`).disabled = false;
        const alert_toast = document.querySelector(`.alert_toast`);
        alert_toast.textContent = '';
        alert_toast.style.display = 'none';
        const startMonth = document.querySelector(`.formcomp .${this.title} #startMonth`).value;
        const startYear = document.querySelector(`.formcomp .${this.title} #startYear`).value;
        const endMonth = document.querySelector(`.formcomp .${this.title} #endMonth`).disabled ? undefined : document.querySelector(`.formcomp .${this.title} #endMonth`).value;
        const endYear = document.querySelector(`.formcomp .${this.title} #endYear`).disabled ? undefined : document.querySelector(`.formcomp .${this.title} #endYear`).value;
        if (startMonth && startYear && endMonth && endYear) {
            const startDate = new Date(`${startYear}-${startMonth}`);
            const endDate = new Date(`${endYear}-${endMonth}`);
            if (startDate.getTime() >= endDate.getTime()) {
                document.querySelector(`.formcomp .${this.title} #btnContinue`).disabled = true;
                alert_toast.textContent = `Dates are incorrect, please fix them!`;
                alert_toast.style.display = 'flex';
                setTimeout(() => {
                    alert_toast.textContent = '';
                    alert_toast.style.display = 'none';
                }, 3000);
            }
        }
    }

    updateTextComp() {
        const html = this.textAreaComp.getHtml();
        document.querySelector(`.textarea_comp`).innerHTML = html;
        this.textAreaComp.addEventListeners();
    }
}