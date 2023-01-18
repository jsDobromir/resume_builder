import { domBuild, buildExperience, buildEducation} from "../../utils/domHelper";

export default class Custom {

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
                if (obj['input_value']) {
                    let addressDivIcon = document.querySelector('.cvcomp .address .address_icon');
                    let addressSpan = document.querySelector('.cvcomp .address .address_text');
                    if (addressDivIcon.classList.contains('d-none')) {
                        addressDivIcon.classList.remove('d-none');
                    }
                    addressSpan.textContent = obj['input_value'];
                }
                else {
                    let citySpan = document.querySelector('.cvcomp .address .city_country_text .city');
                    let addressSpan = document.querySelector('.cvcomp .address .address_text');
                    if (!citySpan.textContent) {
                        let locationDivIcon = document.querySelector('.cvcomp .address .address_icon');
                        locationDivIcon.classList.add('d-none');
                    }
                    addressSpan.textContent = obj['input_value'];
                }
            }
            else if (obj['input_id'] === 'city') {
                if (obj['input_value']) {
                    let locationDivIcon = document.querySelector('.cvcomp .address .address_icon');
                    let citySpan = document.querySelector('.cvcomp .address .city_country_text .city');
                    let commaSpan = document.querySelector('.cvcomp .address .city_country_text .comma');
                    let countrySpan = document.querySelector('.cvcomp .address .city_country_text .country');
                    if (locationDivIcon.classList.contains('d-none')) {
                        locationDivIcon.classList.remove('d-none');
                    }
                    citySpan.textContent = obj['input_value'];
                    if (countrySpan.textContent) {
                        commaSpan.classList.remove('d-none');
                    }
                }
                else {
                    let addressSpan = document.querySelector('.cvcomp .address .address_text');
                    let citySpan = document.querySelector('.cvcomp .address .city_country_text .city');
                    let countrySpan = document.querySelector('.cvcomp .address .city_country_text .country');
                    let commaSpan = document.querySelector('.cvcomp .address .city_country_text .comma');
                    if (!addressSpan.textContent && !countrySpan.textContent) {
                        let locationDivIcon = document.querySelector('.cvcomp .address .address_icon');;
                        locationDivIcon.classList.add('d-none');
                    }
                    citySpan.textContent = obj['input_value'];
                    commaSpan.classList.add('d-none');
                }
            }
            else if (obj['input_id'] === 'country') {
                if (obj['input_value']) {
                    let locationDivIcon = document.querySelector('.cvcomp .address .address_icon');
                    let commaSpan = document.querySelector('.cvcomp .address .city_country_text .comma');
                    let countrySpan = document.querySelector('.cvcomp .address .city_country_text .country');
                    if (locationDivIcon.classList.contains('d-none')) {
                        locationDivIcon.classList.remove('d-none');
                    }
                    commaSpan.classList.remove('d-none');
                    countrySpan.textContent = obj['input_value'];
                }
                else {
                    let locationDivIcon = document.querySelector('.cvcomp .address .address_icon');
                    let commaSpan = document.querySelector('.cvcomp .address .city_country_text .comma');
                    let addressSpan = document.querySelector('.cvcomp .address .address_text');
                    let citySpan = document.querySelector('.cvcomp .address .city_country_text .city');
                    let countrySpan = document.querySelector('.cvcomp .address .city_country_text .country');
                    if (!addressSpan.textContent && !citySpan.textContent) {
                        locationDivIcon.classList.add('d-none');
                    }
                    commaSpan.classList.add('d-none');
                    countrySpan.textContent = obj['input_value'];
                }
            }
            else if (obj['input_id'] === 'phone') {
                if (obj['input_value']) {
                    let phoneDivIcon = document.querySelector('.cvcomp .phone .phone_icon');
                    let phoneSpan = document.querySelector('.cvcomp .phone .right_text');
                    phoneDivIcon.classList.remove('d-none');
                    phoneSpan.textContent = obj['input_value'];
                }
                else {
                    let phoneDivIcon = document.querySelector('.cvcomp .phone .phone_icon');
                    let phoneSpan = document.querySelector('.cvcomp .phone .right_text');
                    phoneDivIcon.classList.add('d-none');
                    phoneSpan.textContent = obj['input_value']
                }
            }
            else if (obj['input_id'] === 'email') {
                if (obj['input_value']) {
                    let emailDivIcon = document.querySelector('.cvcomp .email .email_icon');
                    let emailSpan = document.querySelector('.cvcomp .email .right_text');
                    emailDivIcon.classList.remove('d-none');
                    emailSpan.textContent = obj['input_value'];
                }
                else {
                    let emailDivIcon = document.querySelector('.cvcomp .email .email_icon');
                    let emailSpan = document.querySelector('.cvcomp .email .right_text');
                    emailDivIcon.classList.add('d-none');
                    emailSpan.textContent = obj['input_value']
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
            let ul = domBuild('ul', {class: 'description ul_holder'}, document.createTextNode(''));
            expDiv.replaceChild(ul, expDiv.querySelector('.description'));
            this.evEmitterObj.emit('icon_update');
        });

        this.evEmitterObj.on('icon_changed_text', (obj) => {
            let expDiv = document.querySelector(`.${obj.type}__list .${obj.div}`);
            if (!expDiv) return;
            let div = domBuild('div', {class: 'description'}, document.createTextNode(''));
            expDiv.replaceChild(div, expDiv.querySelector('.description'));
            this.evEmitterObj.emit('icon_update');
        });

        this.evEmitterObj.on('bullet_added', (obj) => {
            let expDiv = document.querySelector(`.${obj.type}__list .${obj.div}`);
            if (!expDiv) return;
            const li = domBuild('li', {class: obj.liElem}, document.createTextNode(obj.textEl));
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
            let previousSpan = domBuild('span', {class: 'present'}, document.createTextNode('Present'));
            expDiv.querySelectorAll(`.cvcomp .${obj.type}__list .endMonth, .cvcomp .${obj.type}__list .endYear`).forEach(endDate => {
                endDate.remove();
            });
            expDiv.querySelector('.delimeter').classList.remove('d-none');
            expDiv.querySelector(`.${obj.type} .${obj.div} .dates`).appendChild(previousSpan);
        });

        this.evEmitterObj.on('end_date_enabled', (obj) => {
            let expDiv = document.querySelector(`.${obj.type}__list .${obj.div}`);
            if (!expDiv) return;
            let endMonth = domBuild('span', {class: 'date_span endMonth'}, document.createTextNode(obj.endMonth));
            let endYear = domBuild('span', {class: 'date_span endYear'}, document.createTextNode(obj.endYear));
            expDiv.querySelector('.present').remove();
            expDiv.querySelector(`.${obj.type} .${obj.div} .dates`).appendChild(endMonth);
            expDiv.querySelector(`.${obj.type} .${obj.div} .dates`).appendChild(endYear);
        });

        this.evEmitterObj.on('model_deleted', (obj) => {
            document.querySelector(`.cvcomp .${obj.type} .${obj.type}__list .${obj.div}`).remove();
        });

        this.evEmitterObj.on('skill', (obj) => {
            const skillDiv = this.createSkillDiv(obj);
            document.querySelector(`.cvcomp .skills`).appendChild(skillDiv);
        });

        this.evEmitterObj.on('delete_skill', (obj) => {
            document.querySelector(`.cvcomp .skills .${obj.div}`).remove();
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

        this.evEmitterObj.on('profile_desc', (obj) => {
            document.querySelector('.cvcomp .profile .desc').textContent = obj['input_value'];
        });
    }

    reRenderComponent(prevRoute) {
        if (prevRoute === 'personal') {
            let personal = this.state.getComponentArray('personal');
            if (Array.isArray(personal) && personal.length === 0) {
                document.querySelector('.cvcomp #firstName').textContent = "Name";
                document.querySelector('.cvcomp #lastName').textContent = "Name";
                document.querySelector('.cvcomp #position').textContent = '';
                document.querySelector('.cvcomp .address .address_icon').classList.add('d-none');
                document.querySelector('.cvcomp .address .address_text').textContent = '';
                document.querySelector('.cvcomp .address .city_country_text .city').textContent = '';
                document.querySelector('.cvcomp .address .city_country_text .comma').classList.add('d-none');
                document.querySelector('.cvcomp .address .city_country_text .country').textContent = '';
                document.querySelector('.cvcomp .phone .phone_icon').classList.add('d-none');
                document.querySelector('.cvcomp .phone .right_text').textContent = '';
                document.querySelector('.cvcomp .email .email_icon').classList.add('d-none');
                document.querySelector('.cvcomp .email .right_text').textContent = '';
            }
            else {
                document.querySelector('.cvcomp #firstName').textContent = personal['firstName'];
                document.querySelector('.cvcomp #lastName').textContent = personal['lastName'];
                document.querySelector('.cvcomp #position').textContent = personal['position'];
                document.querySelector('.cvcomp .address .address_icon').classList.remove('d-none');
                document.querySelector('.cvcomp .address .address_text').textContent = personal['address'];
                document.querySelector('.cvcomp .address .city_country_text .city').textContent = personal['city'];
                if (personal.hasOwnProperty('country') && personal['country']) {
                    document.querySelector('.cvcomp .address .city_country_text .comma').classList.remove('d-none');
                    document.querySelector('.cvcomp .address .city_country_text .country').textContent = personal['country'];
                }
                document.querySelector('.cvcomp .phone .phone_icon').classList.remove('d-none');
                document.querySelector('.cvcomp .phone .right_text').textContent = personal['phone'];
                document.querySelector('.cvcomp .email .email_icon').classList.remove('d-none');
                document.querySelector('.cvcomp .email .right_text').textContent = personal['email'];
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
                document.querySelector('.cvcomp .profile .desc').innerHTML = profile_desc;
            }
            else {
                document.querySelector('.cvcomp .profile .desc').innerHTML = '';
            }
        }
    }

    inputEventResponse(obj) {
        let expDiv = this.#divExists(obj);
        if (obj['input_id']==='endMonth' || obj['input_id']==='endYear') {
            expDiv.querySelector('.delimeter').classList.remove('d-none');
        }
        if (obj['input_id']!=='textarea_prof_desc') {
            expDiv.querySelector(`.${obj['input_id']}`).textContent = obj['input_value'];
        }
        if (obj['input_id']==='textarea_prof_desc') {
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
        let div = domBuild('div', {class: `skill_rating${lastSkill.index}`}, ...[
            domBuild('span', {class: `skill_name`}, document.createTextNode(lastSkill.skill)),
            domBuild('span', {class: `rating star_${lastSkill.starValue}`}, ...[
                domBuild('span', {class: `star1`}, document.createTextNode('')),
                domBuild('span', {class: `star2`}, document.createTextNode('')),
                domBuild('span', {class: `star3`}, document.createTextNode('')),
                domBuild('span', {class: `star4`}, document.createTextNode('')),
                domBuild('span', {class: `star5`}, document.createTextNode(''))
            ])
        ]);

        return div;
    }

    createLangDiv({lastLanguage}) {
        const div = domBuild('div', {class: `language_div_${lastLanguage.index}`}, ...[
            domBuild('div', {class: `language`}, document.createTextNode(lastLanguage.language)),
            domBuild('div', {class: `range_wrapper`}, ...[
                domBuild('div', {class: `language_range`, style:`width: ${lastLanguage.rangeValue}%;`}, document.createTextNode(''))
            ])
        ]);
        return div;
    }

    createCertificationDiv({lastCertification}) {
        let div = domBuild('div', {class: `certifications__list__item__${lastCertification.index}`}, document.createTextNode(lastCertification.certification));
        return div;
    }
}