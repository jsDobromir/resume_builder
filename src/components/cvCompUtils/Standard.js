import { domBuild } from "../../utils/domHelper";

export default class Standard {

    constructor(state, evEmitterObj, routerObj) {
        this.state = state;
        this.evEmitterObj = evEmitterObj;
        this.routerObj = routerObj;

        this.evEmitterObj.on('keytyped', function (obj) {
            const element = document.querySelector('.cvcomp').querySelector(`#${obj['input_id']}`);
            if (obj['input_id']==='email' || obj['input_id']==='phone') {
                const span = element.parentElement.firstElementChild;
                const spanText = span.dataset.text;
                if (obj['input_value']) {
                    span.textContent = spanText;
                }
                else {
                    span.textContent = '';
                }
            }

            if (obj['input_id']==='city' || obj['input_id']==='address' ) {
                const span = element.parentElement.firstElementChild;
                const spanText = span.dataset.text;
                if (!obj['input_value']) {
                    if (obj['input_id']==='city') {
                        let other = document.querySelector('.cvcomp').querySelector(`#address`).textContent;
                        if(!other) span.textContent = '';
                    }
                    else if (obj['input_id']==='address') {
                        let other = document.querySelector('.cvcomp').querySelector(`#city`).textContent;
                        if(!other) span.textContent = '';
                    }
                }
                else {
                    span.textContent = spanText;
                }
            }

            element.textContent = obj['input_value'];
        });

        this.evEmitterObj.on('image_updated', function(obj) {
            document.querySelector(`#cvProfilePhoto`).src = obj.imgSrc;
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
            document.querySelector(`.${obj.type} .${obj.type}__list .${obj.div}`).remove();
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

        this.evEmitterObj.on('profile_desc', (obj) => {
            document.querySelector('.cvcomp .profile').textContent = obj['input_value'];
        });
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
                domBuild('span', {class: `${obj.type==='experience' ? 'company' : 'school'}`}, document.createTextNode('')),
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
        let div = domBuild('div', {class: `skill_div_${lastSkill.index}`}, ...[
            domBuild('div', {class: `skill`}, document.createTextNode(lastSkill.skill)),
            domBuild('div', {class: `range_wrapper`}, ...[
                domBuild('div', {class: `skill_range`, style:`width: ${lastSkill.rangeValue}%;`}, document.createTextNode(''))
            ])
        ]);

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

    reRenderComponent(prevRoute) {
        if (prevRoute === 'personal') {
            let personal = this.state.getComponentArray('personal');
            if (Array.isArray(personal) && personal.length === 0) {
                document.querySelector('.cvcomp #firstName').textContent = "Name";
                document.querySelector('.cvcomp #lastName').textContent = "Name";
                document.querySelector('.cvcomp #cvProfilePhoto').src = "/images/profile.png";
                document.querySelector('.cvcomp .personal .bio .weighted.address').textContent = '';
                document.querySelector('.cvcomp .personal .bio #address').textContent = '';
                document.querySelector('.cvcomp .personal .bio #city').textContent = '';
                document.querySelector('.cvcomp .personal .bio .weighted.phone').textContent = '';
                document.querySelector('.cvcomp .personal #phone').textContent = '';
                document.querySelector('.cvcomp .personal .bio .weighted.email').textContent = '';
                document.querySelector('.cvcomp .personal #email').textContent = '';
            }
            else {
                document.querySelector('.cvcomp #firstName').textContent = personal['firstName'];
                document.querySelector('.cvcomp #lastName').textContent = personal['lastName'];
                document.querySelector('.cvcomp #cvProfilePhoto').src = '/images/' + personal['profilePhoto'];
                if (personal['address'] || personal['city']) {
                    const spanText = document.querySelector('.cvcomp .personal .bio .weighted.address').dataset.text;
                    document.querySelector('.cvcomp .personal .bio .weighted.address').textContent = spanText;
                }
                document.querySelector('.cvcomp .personal .bio #address').textContent = personal['address'];
                document.querySelector('.cvcomp .personal .bio #city').textContent = personal['city'];
                if (personal['phone']) {
                    const spanText = document.querySelector('.cvcomp .personal .bio .weighted.phone').dataset.text;
                    document.querySelector('.cvcomp .personal .bio .weighted.phone').textContent = spanText;
                }
                document.querySelector('.cvcomp .personal #phone').textContent = personal['phone'];
                if (personal['email']) {
                    const spanText = document.querySelector('.cvcomp .personal .bio .weighted.email').dataset.text;
                    document.querySelector('.cvcomp .personal .bio .weighted.email').textContent = spanText;
                }
                document.querySelector('.cvcomp .personal #email').textContent = personal['email'];
            }
        }
        else if (prevRoute === 'experience') {
            let experience = this.state.getComponentArray('experience');
            let localExperience = Array.from(document.querySelectorAll('.cvcomp .experience__list .experience__list__item'));
            for (let i = 0; i < localExperience.length; i++) {
                document.querySelector(`.${localExperience[i].classList[1]}`).remove();
            }

            for (let i = 0; i < experience.length; i++) {
                let divHolder = document.createElement('div');
                divHolder.setAttribute("class", `experience__list__item experience__list__item__${experience[i].index}`);
                let spanPosition = document.createElement('span');
                spanPosition.setAttribute("class", "position");
                spanPosition.textContent = experience[i].position;
                let divCompanyWrapper = document.createElement('div');
                divCompanyWrapper.setAttribute("class", "company_wrapper editor");
                let spanCompany = document.createElement('span');
                spanCompany.setAttribute("class", "company");
                spanCompany.textContent = experience[i].company;
                let spanDates = document.createElement('span');
                spanDates.setAttribute("class", "dates");
                let startMonth = document.createElement('span');
                startMonth.setAttribute("class", "date_span startMonth");
                startMonth.innerHTML = experience[i].startMonth + '&nbsp;';
                spanDates.appendChild(startMonth);
                let startYear = document.createElement('span');
                startYear.setAttribute("class", "date_span startYear");
                startYear.textContent = experience[i].startYear;
                spanDates.appendChild(startYear);
                let delimeter = document.createElement('span');
                delimeter.setAttribute("class", 'delimeter');
                delimeter.textContent = " - ";
                spanDates.appendChild(delimeter);
                if (experience[i].endMonth) {
                    let endMonth = document.createElement('span');
                    endMonth.setAttribute("class", "date_span endMonth");
                    endMonth.innerHTML = experience[i].endMonth + '&nbsp;';
                    let endYear = document.createElement('span');
                    endYear.setAttribute("class", "date_span endYear");
                    endYear.textContent = experience[i].endYear;
                    spanDates.appendChild(endMonth);
                    spanDates.appendChild(endYear);
                }
                else {
                    let presentSpan = document.createElement('span');
                    presentSpan.setAttribute("class", "present");
                    presentSpan.textContent = "Present";
                    spanDates.appendChild(presentSpan);
                }
                divCompanyWrapper.appendChild(spanCompany);
                divCompanyWrapper.appendChild(spanDates);
                divHolder.appendChild(spanPosition);
                divHolder.appendChild(divCompanyWrapper);
                if (experience[i]['textarea_type'] === 'text') {
                    let divDesc = document.createElement('div');
                    divDesc.setAttribute("class", "description");
                    divDesc.innerHTML = experience[i]['textarea_prof_desc'];
                    divHolder.appendChild(divDesc);
                }
                else {
                    let ulDesc = document.createElement('ul');
                    ulDesc.setAttribute("class", "description ul_holder");
                    ulDesc.innerHTML = experience[i]['textarea_prof_desc'];
                    divHolder.appendChild(ulDesc);
                }
                document.querySelector('.cvcomp .experience__list').appendChild(divHolder);
            }
        }
        else if (prevRoute==='education') {
            let education = this.state.getComponentArray('education');
            let localEducation = Array.from(document.querySelectorAll('.cvcomp .education__list .education__list__item'));
            for (let i = 0; i < localEducation.length; i++) {
                document.querySelector(`.${localEducation[i].classList[1]}`).remove();
            }

            for (let i = 0; i < education.length; i++) {
                let divHolder = document.createElement('div');
                divHolder.setAttribute("class", `education__list__item education__list__item__${education[i].index}`);
                let spanDegree = document.createElement('span');
                spanDegree.setAttribute("class", "degree");
                spanDegree.textContent = education[i].degree;
                let divCompanyWrapper = document.createElement('div');
                divCompanyWrapper.setAttribute("class", "company_wrapper editor");
                let spanSchool = document.createElement('span');
                spanSchool.setAttribute("class", "school");
                spanSchool.textContent = education[i].school;
                let spanDates = document.createElement('span');
                spanDates.setAttribute("class", "dates");
                let startMonth = document.createElement('span');
                startMonth.setAttribute("class", "date_span startMonth");
                startMonth.innerHTML = education[i].startMonth + '&nbsp;';
                spanDates.appendChild(startMonth);
                let startYear = document.createElement('span');
                startYear.setAttribute("class", "date_span startYear");
                startYear.textContent = education[i].startYear;
                spanDates.appendChild(startYear);
                let delimeter = document.createElement('span');
                delimeter.setAttribute("class", 'delimeter');
                delimeter.textContent = " - ";
                spanDates.appendChild(delimeter);
                if (education[i].endMonth) {
                    let endMonth = document.createElement('span');
                    endMonth.setAttribute("class", "date_span endMonth");
                    endMonth.innerHTML = education[i].endMonth + '&nbsp;';
                    let endYear = document.createElement('span');
                    endYear.setAttribute("class", "date_span endYear");
                    endYear.textContent = education[i].endYear;
                    spanDates.appendChild(endMonth);
                    spanDates.appendChild(endYear);
                }
                else {
                    let presentSpan = document.createElement('span');
                    presentSpan.setAttribute("class", "present");
                    presentSpan.textContent = "Present";
                    spanDates.appendChild(presentSpan);
                }
                divCompanyWrapper.appendChild(spanSchool);
                divCompanyWrapper.appendChild(spanDates);
                divHolder.appendChild(spanDegree);
                divHolder.appendChild(divCompanyWrapper);
                if (education[i]['textarea_type'] === 'text') {
                    let divDesc = document.createElement('div');
                    divDesc.setAttribute("class", "description");
                    divDesc.innerHTML = education[i]['textarea_prof_desc'];
                    divHolder.appendChild(divDesc);
                }
                else {
                    let ulDesc = document.createElement('ul');
                    ulDesc.setAttribute("class", "description ul_holder");
                    ulDesc.innerHTML = education[i]['textarea_prof_desc'];
                    divHolder.appendChild(ulDesc);
                }
                document.querySelector('.cvcomp .education__list').appendChild(divHolder);
            }
        }
        else if (prevRoute==='profile') {
            let profile = this.state.getComponentArray('profile');
            if (profile && profile['profile_desc']) {
                let profile_desc = profile['profile_desc'];
                document.querySelector('.cvcomp .profile').innerHTML = profile_desc;
            }
            else {
                document.querySelector('.cvcomp .profile').innerHTML = '';
            }
        }
    }
};  