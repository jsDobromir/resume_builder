
import buildHtml from './personalUtils/buildHtml.js';
export default class Personal{

    constructor(state, evEmitterObj, routerObj) {
        this.state = state;
        this.evEmitterObj = evEmitterObj;
        this.routerObj = routerObj;
        this.title = 'personal';
        this.multiRouteComp = false;
    }

    attachEventListeners() {
        let form = document.querySelector(`.wrapper[data-active-route=${this.title}]`).querySelector('form');
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('keyup', (keyEvent) => {
                if (keyEvent.target.id!=='profilePhoto') {
                    this.evEmitterObj.emit('keytyped', {input_id: keyEvent.target.id, input_value: keyEvent.target.value});
                }
            });
        });
        form.addEventListener('submit', (formEvent) => {
            formEvent.preventDefault();
            let formData = new FormData(form);
            let formDataReversed = new FormData();
            let current_cv_id = document.querySelector('.wrapper').dataset.cvId;
            formDataReversed.append('current_cv_id', current_cv_id);
            for (let pair of formData.entries()) {
                if (pair[1] instanceof File) {
                    continue;
                }
                formDataReversed.append(pair[0], pair[1]);
            }
            formDataReversed.append('cvType', this.state.cvType);
            formDataReversed.append('profilePhoto', formData.get('profilePhoto'));
            
            this.state.updateMultipartFormData(formDataReversed).then(() => {
                this.routerObj.dispatchNextRouter();
            });
        });
        this.attachFileListener();
    }

    attachFileListener() {
        let profilePhoto = document.querySelector(`.${this.title} #profilePhoto`);
        profilePhoto.addEventListener('change', async (fileEv) => {
            let file = profilePhoto.files[0];
            if (!file.type.match(/image.*/) || file.size > 1000000) {
                const alert_toast = document.querySelector(`.alert_toast`);
                alert_toast.textContent = `File must be an image and not bigger than 1mb!`;
                alert_toast.style.display = 'flex';
                setTimeout(() => {
                    alert_toast.textContent = '';
                    alert_toast.style.display = 'none';
                }, 3000);
                return;
            }
            
            const imgSrc = await this.convertToImgSrc(file);
            this.evEmitterObj.emit('image_updated', {imgSrc: imgSrc});
        });
    }

    convertToImgSrc(file) {
        const fr = new FileReader();
        return new Promise((res, rej) => {
            fr.onload = () => {
                return res(fr.result);
            }
            fr.readAsDataURL(file);
        });
    }

    render() {
        const resumes = this.state.resumes;
        const current_cv_id = document.querySelector('.wrapper').dataset.cvId;
        let current_resume = null;
        for(let i=0;i<resumes.length;i++) {
            let objKey = Object.keys(resumes[i])[0];
            if (objKey==current_cv_id) {
                current_resume = resumes[i][objKey];
                break;
            }
        }
        let savedData = (current_resume && current_resume.personal) ? current_resume.personal : null;
        return buildHtml(this.state.cvType, savedData);
    }
};

