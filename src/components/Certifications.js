
export default class Certifications {

    constructor(state, evEmmitter, router) {
        this.state = state;
        this.evEmitter = evEmmitter;
        this.router = router;
        this.tittle = 'certifications';
        this.multiRouteComp = false;
        this.divIndex = 1;
        this.certifications = this.getCertificationsMap();
    }

    render() {
        let certificationsArray = this.convertMapToArray();
        const html = `<div class="certifications">
                        <div class="certifications_wrapper">
                        ${certificationsArray.map(certification => {
                            return `<div class="certification_div_${certification.index}">
                                        <div class="certification">
                                            <span>${certification.certification}</span>
                                            <span id="delete_certification" data-hover="Delete"><i class="fa-sharp fa-solid fa-trash"></i></span>
                                        </div>
                                    </div>`
                        }).join('')}
                        </div>

                        <div class="button_wrapper">
                            <span class="add_certification">+ Add ${(certificationsArray.length) ? 'one more ' : ''}certification</span>
                        </div>

                        <div class="form_add_certification d-none">
                            <form>
                                    <div class="certification_div form__group">
                                        <label class="form__label" for="certification">Certification</label>
                                        <input type="text" class="form__input" id="certification" name="certification" required maxlength="150"/>
                                    </div>
                                
                                <div class="buttons">
                                    <button type="button" class="btn btn_cancel btn-back" id="cancelBtn">Cancel</button>
                                    <button type="submit" class="btn btn-next" id="btnSave">Save</button>
                                </div>
                            </form>
                        </div>

                      </div>`;

        return html;
    }

    reRender() {
        const updatedHtml = this.render();
        document.querySelector(`.formcomp .certifications`).outerHTML = updatedHtml;
    }

    attachEventListeners() {
        const formAddCertification = document.querySelector('.form_add_certification');
        document.querySelector(`.certifications .add_certification`).addEventListener('click', (event) => {
            const addCertificationButton = event.currentTarget;
            if (formAddCertification.classList.contains('d-none')) {
                addCertificationButton.textContent = `- Cancel`;
                formAddCertification.classList.remove('d-none');
            }
            else {
                let certificationsArray = this.convertMapToArray();
                addCertificationButton.textContent = `+ Add ${(certificationsArray.length) ? 'one more ' : ''}certification`;
                formAddCertification.classList.add('d-none');
            }
        });

        formAddCertification.querySelector('form').addEventListener('submit', (formEvent) => {
            formEvent.preventDefault();
            const certification =formAddCertification.querySelector('#certification').value;
            this.saveCertification({certification, index: this.divIndex});
        });

        document.querySelectorAll(`.formcomp .certifications div[class*="certification_div_"]`).forEach(certificateDiv => {
            certificateDiv.querySelector('#delete_certification').addEventListener('click', (buttonEv) => {
                const classname = certificateDiv.classList[0];
                const index = parseInt(classname.split('_')[2]);
                this.deleteCertification(index);
            });
        });

        document.querySelector(`.certifications #cancelBtn`).addEventListener('click', (event) => {
            let certificationsArray = this.convertMapToArray();
            document.querySelector('.add_certification').textContent = `+ Add ${(certificationsArray.length) ? 'one more ' : ''}certification`;
            formAddCertification.classList.add('d-none');
        });
    }

    deleteCertification(index) {
        let key = `certification_${index}`;
        this.certifications.delete(key);
        this.state.update(this.tittle, this.convertMapToArray()).then(() => {
            this.evEmitter.emit('delete_certification', {div: `certifications__list__item__${index}`});
            document.querySelector(`.formcomp .certifications .certification_div_${index}`).remove();
            this.reRender();
            this.attachEventListeners();
        });
    }

    saveCertification(certification) {
        let key = `certification_${certification.index}`;
        this.certifications.set(key, certification);
        this.divIndex++;
        this.state.update(this.tittle, this.convertMapToArray()).then(() => {
            const lastCertification = this.certifications.get(key);
            this.evEmitter.emit('certification', {lastCertification});
            this.reRender();
            this.attachEventListeners();
        });
    }

    getCertificationsMap() {
        const list = this.state.getComponentArray(this.tittle);
        const map = new Map();
        let lastIndex = list.length ? list[list.length-1].index : undefined;
        list.forEach(certification => {
            let key = `certification_${certification.index}`;
            map.set(key, certification);
        });
        this.divIndex = lastIndex ? (lastIndex+1) : this.divIndex;
        return map;
    }

    convertMapToArray() {
        const certificationsArray = Array.from(this.certifications.values()).map(certification => {
            return certification;
        });
        return certificationsArray;
    }
}