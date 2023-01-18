import { domBuild, buildExperience, buildEducation } from "../../utils/domHelper";

export default class Simple {

    constructor(state, evEmitterObj, routerObj) {
        this.state = state;
        this.evEmitterObj = evEmitterObj;
        this.routerObj = routerObj;

        this.evEmitterObj.on('keytyped', (obj) => {
            if (obj['input_id'] === 'firstName' || obj['input_id'] === 'lastName' || obj['input_id'] === 'position') {
                const span = document.querySelector(`.cvcomp #${obj['input_id']}`);
                span.textContent = obj['input_value'];
            }
            else if (obj['input_id'] === 'address') {
                let addressIcon = document.querySelector('.cvcomp .contact_info .icon_address');
                let addressSpan = document.querySelector('.cvcomp .contact_info .address .right_text');
                if (obj['input_value']) {
                    if (addressIcon.classList.contains('d-none')) {
                        addressIcon.classList.remove('d-none');
                    }
                    addressSpan.textContent = obj['input_value'];
                }
                else {
                    addressIcon.classList.add('d-none');
                    addressSpan.textContent = obj['input_value'];
                }
            }
            else if (obj['input_id'] === 'phone') {
                let phoneIcon = document.querySelector('.cvcomp .contact_info .icon_phone');
                let phoneSpan = document.querySelector('.cvcomp .contact_info .phone .right_text');
                if (obj['input_value']) {
                    phoneIcon.classList.remove('d-none');
                    phoneSpan.textContent = obj['input_value'];
                }
                else {
                    phoneIcon.classList.add('d-none');
                    phoneSpan.textContent = obj['input_value']
                }
            }
            else if (obj['input_id'] === 'email') {
                let emailDivIcon = document.querySelector('.cvcomp .contact_info .icon_email');
                let emailSpan = document.querySelector('.cvcomp .contact_info .email .right_text');
                if (obj['input_value']) {
                    emailDivIcon.classList.remove('d-none');
                    emailSpan.textContent = obj['input_value'];
                }
                else {
                    emailDivIcon.classList.add('d-none');
                    emailSpan.textContent = obj['input_value']
                }
            }
            else if (obj['input_id'] === 'linkedin') {
                let linkedDivIcon = document.querySelector('.cvcomp .contact_info .icon_linkedin');
                let linkedSpan = document.querySelector('.cvcomp .contact_info .linkedin .right_text');
                if (obj['input_value']) {
                    linkedDivIcon.classList.remove('d-none');
                    linkedSpan.textContent = obj['input_value'];
                    let newContent = `https://${obj['input_value']}`;
                    linkedSpan.textContent = newContent;
                }
                else {
                    linkedDivIcon.classList.add('d-none');
                    linkedSpan.textContent = obj['input_value']
                }
            }
        });

        this.evEmitterObj.on('input_event_list', (obj) => {
            this.inputEventResponse(obj);
        });

        this.evEmitterObj.on('input_event_list_select', (obj) => {
            this.inputEventResponse(obj);
        });

        this.evEmitterObj.on('icon_changed_list', (obj) => {
            //changed to ul element
            let expDiv = document.querySelector(`.${obj.type}__list .${obj.div}`);
            if (!expDiv) return;
            //replace div with ul
            let ul = domBuild('ul', { class: 'description ul_holder' }, document.createTextNode(''));
            expDiv.replaceChild(ul, expDiv.querySelector('.description'));
            this.evEmitterObj.emit('icon_update');
        });

        this.evEmitterObj.on('icon_changed_text', (obj) => {
            let expDiv = document.querySelector(`.${obj.type}__list .${obj.div}`);
            if (!expDiv) return;
            let div = domBuild('div', { class: 'description' }, document.createTextNode(''));
            expDiv.replaceChild(div, expDiv.querySelector('.description'));
            this.evEmitterObj.emit('icon_update');
        });

        this.evEmitterObj.on('bullet_added', (obj) => {
            let expDiv = document.querySelector(`.${obj.type}__list .${obj.div}`);
            if (!expDiv) return;
            const li = domBuild('li', { class: obj.liElem }, document.createTextNode(obj.textEl));
            expDiv.querySelector('.description').appendChild(li);
        });

        this.evEmitterObj.on('bullet_removed', (obj) => {
            let expDiv = document.querySelector(`.${obj.type}__list .${obj.div}`);
            if (!expDiv) return;
            expDiv.querySelector(`.${obj.liElem}`).remove();
        });

        this.evEmitterObj.on('end_date_disabled', (obj) => {
            let expDiv = document.querySelector(`.${obj.type}__list .${obj.div}`);
            if (!expDiv) return;
            let previousSpan = domBuild('span', { class: 'present' }, document.createTextNode('Present'));
            expDiv.querySelectorAll(`.cvcomp .${obj.type}__list .endMonth, .cvcomp .${obj.type}__list .endYear`).forEach(endDate => {
                endDate.remove();
            });
            expDiv.querySelector('.delimeter').classList.remove('d-none');
            expDiv.querySelector(`.${obj.type} .${obj.div} .dates`).appendChild(previousSpan);
        });

        this.evEmitterObj.on('end_date_enabled', (obj) => {
            let expDiv = document.querySelector(`.${obj.type}__list .${obj.div}`);
            if (!expDiv) return;
            let endMonth = domBuild('span', { class: 'date_span endMonth' }, document.createTextNode(obj.endMonth));
            let endYear = domBuild('span', { class: 'date_span endYear' }, document.createTextNode(obj.endYear));
            expDiv.querySelector('.present').remove();
            expDiv.querySelector(`.${obj.type} .${obj.div} .dates`).appendChild(endMonth);
            expDiv.querySelector(`.${obj.type} .${obj.div} .dates`).appendChild(endYear);
        });

        this.evEmitterObj.on('model_deleted', (obj) => {
            document.querySelector(`.${obj.type} .${obj.type}__list .${obj.div}`).remove();
        });

        this.evEmitterObj.on('profile_desc', (obj) => {
            document.querySelector('.cvcomp .profile .profile_desc').textContent = obj['input_value'];
        });

        this.evEmitterObj.on('skill', (obj) => {
            const skillDiv = this.createSkillDiv(obj);
            document.querySelector(`.cvcomp .skills .skills_list`).appendChild(skillDiv);
        });

        this.evEmitterObj.on('delete_skill', (obj) => {
            document.querySelector(`.cvcomp .skills .skills_list .${obj.li}`).remove();
        });

        this.evEmitterObj.on('language', (obj) => {
            const langDiv = this.createLangDiv(obj);
            document.querySelector(`.cvcomp .languages`).appendChild(langDiv);
        });

        this.evEmitterObj.on('delete_language', (obj) => {
            document.querySelector(`.cvcomp .languages .${obj.div}`).remove();
        });

        this.evEmitterObj.on('certification', (obj) => {
            const certficationDiv = this.createCertificationDiv(obj);
            document.querySelector('.cvcomp .certifications__list').appendChild(certficationDiv);
        });

        this.evEmitterObj.on('delete_certification', (obj) => {
            document.querySelector(`.cvcomp .certifications__list .${obj.div}`).remove();
        });
    }

    inputEventResponse(obj) {
        let expDiv = this.#divExists(obj);
        if (obj['input_id'] === 'endMonth' || obj['input_id'] === 'endYear') {
            expDiv.querySelector('.delimeter').classList.remove('d-none');
        }
        if (obj['input_id'] !== 'textarea_prof_desc') {
            expDiv.querySelector(`.${obj['input_id']}`).textContent = obj['input_value'];
        }
        if (obj['input_id'] === 'textarea_prof_desc') {
            expDiv.querySelector(`.description`).innerHTML = obj['input_value'];
        }
    }

    #divExists(obj) {
        let expDiv = document.querySelector(`.${obj.type}__list .${obj.div}`);
        if (obj.mode === 'create' && !expDiv) {
            let div = this.createDiv(obj);
            document.querySelector(`.${obj.type}__list`).appendChild(div);
            expDiv = document.querySelector(`.${obj.type}__list .${obj.div}`);
        }
        return expDiv;
    }

    createDiv(obj) {
        let div = domBuild('div', {class: `${obj.type}__list__item ${obj.div}`}, ...[
            domBuild('span', {class: `${obj.type==='experience' ? 'position' : 'degree'}`}, document.createTextNode('')),
            domBuild('div', {class: 'company_wrapper editor'}, ...[
                domBuild('div', {class: `${obj.type}_address_wrapper`}, ...[
                    domBuild('span', {class: `${obj.type==='experience' ? 'company' : 'school'}`}, document.createTextNode('')),
                    domBuild('span', {class: `${obj.type==='experience' ? 'company' : 'school'}_address`}, document.createTextNode(''))
                ]),
                domBuild('span', {class: 'dates'}, ...[
                    domBuild('span', {class:`date_span startMonth`}, document.createTextNode('')),
                    domBuild('span', {class: `date_span startYear`}, document.createTextNode('')),
                    domBuild('span', {class: 'delimeter d-none'}, document.createTextNode(' - ')),
                    domBuild('span', {class: `date_span endMonth`}, document.createTextNode('')),
                    domBuild('span', {class: `date_span endYear`}, document.createTextNode(''))
                ]),
            ]),
            domBuild(`${obj['description_type']==='text' ? 'div' : 'ul'}`, {class: `description ${obj['description_type']==='list' ? 'ul_holder' : ''}`}, document.createTextNode(''))
        ]);
        return div;
    }

    createSkillDiv({lastSkill}) {
        let div = domBuild('li', {class: `skill_li skill_li_${lastSkill.index}`}, document.createTextNode(lastSkill.skill));
        return div;
    }

    createLangDiv({lastLang}) {
        const div = domBuild('div', {class: `language_div_${lastLang.index}`}, ...[
            domBuild('span', {class: `language_name`}, document.createTextNode(lastLang.language)),
            domBuild('span', {class: `rating star_${lastLang.starValue}`}, ...[
                domBuild('span', {class: `star1`}, document.createTextNode('')),
                domBuild('span', {class: `star2`}, document.createTextNode('')),
                domBuild('span', {class: `star3`}, document.createTextNode('')),
                domBuild('span', {class: `star4`}, document.createTextNode('')),
                domBuild('span', {class: `star5`}, document.createTextNode(''))
            ])
        ]);
        return div;
    }

    createCertificationDiv({lastCertification}) {
        let div = domBuild('div', {class: `certifications__list__item__${lastCertification.index}`}, document.createTextNode(lastCertification.certification));
        return div;
    }

    reRenderComponent(prevRoute) {
        if (prevRoute === 'personal') {
            let personal = this.state.getComponentArray('personal');
            if (Array.isArray(personal) && personal.length === 0) {
                document.querySelector('.cvcomp #firstName').textContent = "Name";
                document.querySelector('.cvcomp #lastName').textContent = "Name";
                document.querySelector('.cvcomp #position').textContent = '';
                document.querySelector('.cvcomp .contact_info .icon_address').classList.add('d-none');
                document.querySelector('.cvcomp .contact_info .address .right_text').textContent = '';
                document.querySelector('.cvcomp .contact_info .icon_phone').classList.add('d-none');
                document.querySelector('.cvcomp .contact_info .phone .right_text').textContent = '';
                document.querySelector('.cvcomp .contact_info .icon_email').classList.add('d-none');
                document.querySelector('.cvcomp .contact_info .email .right_text').textContent = '';
                document.querySelector('.cvcomp .contact_info .icon_linkedin').classList.add('d-none');
                document.querySelector('.cvcomp .contact_info .linkedin .right_text').textContent = '';
            }
            else {
                document.querySelector('.cvcomp #firstName').textContent = personal['firstName'];
                document.querySelector('.cvcomp #lastName').textContent = personal['lastName'];
                document.querySelector('.cvcomp #position').textContent = personal['position'];
                if (personal['address']) {
                    document.querySelector('.cvcomp .contact_info .icon_address').classList.remove('d-none');
                    document.querySelector('.cvcomp .contact_info .address .right_text').textContent = personal['address'];
                }
                else {
                    document.querySelector('.cvcomp .contact_info .icon_address').classList.add('d-none');
                    document.querySelector('.cvcomp .contact_info .address .right_text').textContent = '';
                }
                if (personal['phone']) {
                    document.querySelector('.cvcomp .contact_info .icon_phone').classList.remove('d-none');
                    document.querySelector('.cvcomp .contact_info .phone .right_text').textContent = personal['phone'];
                }
                else {
                    document.querySelector('.cvcomp .contact_info .icon_phone').classList.add('d-none');
                    document.querySelector('.cvcomp .contact_info .phone .right_text').textContent = '';
                }
                if (personal['email']) {
                    document.querySelector('.cvcomp .contact_info .icon_email').classList.remove('d-none');
                    document.querySelector('.cvcomp .contact_info .email .right_text').textContent = personal['email'];
                }
                else {
                    document.querySelector('.cvcomp .contact_info .icon_email').classList.add('d-none');
                    document.querySelector('.cvcomp .contact_info .email .right_text').textContent = '';
                }
                if (personal['linkedin']) {
                    document.querySelector('.cvcomp .contact_info .icon_linkedin').classList.remove('d-none');
                    document.querySelector('.cvcomp .contact_info .linkedin .right_text').textContent = personal['linkedin'];
                }
                else {
                    document.querySelector('.cvcomp .contact_info .icon_linkedin').classList.add('d-none');
                    document.querySelector('.cvcomp .contact_info .linkedin .right_text').textContent = '';
                }
            }
        }
        else if (prevRoute === 'experience') {
            let experience = this.state.getComponentArray('experience');
            buildExperience(experience);
        }
        else if (prevRoute==='education') {
            let education = this.state.getComponentArray('education');
            buildEducation(education);
        }
        else if (prevRoute==='profile') {
            let profile = this.state.getComponentArray('profile');
            if (profile && profile['profile_desc']) {
                let profile_desc = profile['profile_desc'];
                document.querySelector('.cvcomp .profile .profile_desc').innerHTML = profile_desc;
            }
            else {
                document.querySelector('.cvcomp .profile .profile_desc').innerHTML = '';
            }
        }
    }

}