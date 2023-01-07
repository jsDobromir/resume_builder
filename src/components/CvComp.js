import { domBuild } from "../utils/domHelper";
import Standard from "./cvCompUtils/Standard";
import Fancy from './cvCompUtils/Fancy';

export default class CvComp {

    constructor(state, evEmitterObj, routerObj, cvType) {
        this.state = state;
        this.evEmitterObj = evEmitterObj;
        this.routerObj = routerObj;
        this.title = 'cvcomp';
        this.cvType = cvType;
        this.activeObject = null;

        if (this.cvType === 'standard') {
            const standardObj = new Standard(state, evEmitterObj, routerObj);
            this.activeObject = standardObj;
        }
        else if (this.cvType === 'fancy') {
            const fancyObj = new Fancy(state, evEmitterObj, routerObj);
            this.activeObject = fancyObj;
        }
    }

    setComponentAfterReroute(prevRoute) {
        if (this.activeObject) {
            this.activeObject.reRenderComponent(prevRoute);
        }
    }

    inputEventResponse(obj) {
        let expDiv = this.#divExists(obj);
        if (obj['input_id']==='startMonth' || obj['input_id']==='startYear' || obj['input_id']==='endMonth' || obj['input_id']==='endYear') {
            expDiv.querySelector('.slash-delimeter').classList.remove('d-none');
        }
        if (obj['input_id']==='endMonth' || obj['input_id']==='endYear') {
            expDiv.querySelector('.delimeter').classList.remove('d-none');
        }
        if (obj['input_id']==='company' || obj['input_id']==='school') {
            obj['input_value'] ? expDiv.querySelector('.at-delimeter').classList.remove('d-none') : expDiv.querySelector('.at-delimeter').classList.add('d-none');
        }
        if (obj['input_id']!=='textarea_prof_desc') {
            expDiv.querySelector(`#${obj['input_id']}`).textContent = obj['input_value'];
        }
    }

    #divExists(obj) {
        let expDiv = document.querySelector(`.${obj.type}_list .${obj.div}`);
        if (obj.mode === 'create' && !expDiv) {
            let div = this.createDiv(obj.div, obj.type);
            document.querySelector(`.${obj.type}_list`).appendChild(div);
            expDiv = document.querySelector(`.${obj.type}_list .${obj.div}`);
        }
        return expDiv;
    }

    //replace div with ul or ul with div
    #replaceHtmlAttribute(obj) {
        let expDiv = document.querySelector(`.cvcomp .${obj.div}`);
        if (!expDiv) return;
        let elType = obj.content;
        let newElement = domBuild(elType, {class: 'description_list'}, document.createTextNode(obj.textFirstChild));
        expDiv.replaceChild(newElement, expDiv.querySelector('.description_list'));
    }

    createDiv(divString, type) {
        let div = domBuild('div', { class: `${divString}` }, ...[
            domBuild('div', { class: `${type}_heading`, }, ...[
                domBuild('div', {}, ...[
                    domBuild('strong', {class: `${type==='experience' ? 'position' : 'degree'}`, id: `${type==='experience' ? 'position' : 'degree'}`}, document.createTextNode('')),
                    domBuild('span', {class: `at-delimeter d-none`}, document.createTextNode(' at ')),
                    domBuild('strong', {class: `${type==='experience' ? 'company' : 'school'}`, id: `${type==='experience' ? 'company' : 'school'}`}, document.createTextNode('')),
                    domBuild('span', {class: `slash-delimeter d-none`}, document.createTextNode(' | ')),
                    domBuild('span', {class:`date_span startMonth`}, document.createTextNode('')),
                    domBuild('span', {class: `date_span startYear`}, document.createTextNode('')),
                    domBuild('span', {class: 'delimeter d-none'}, document.createTextNode(' - ')),
                    domBuild('span', {class: `date_span endMonth`}, document.createTextNode('')),
                    domBuild('span', {class: `date_span endYear`}, document.createTextNode(''))
                ])
            ]),
            domBuild('div', { class: `description_list` })
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

    render() {
        const current_cv_id = document.querySelector('.wrapper').dataset.cvId;;
        let resumes = window.localStorage.getItem('resumes') ? JSON.parse(window.localStorage.getItem('resumes'))[current_cv_id] : null;
        let personal = resumes ? resumes['personal'] : null;
        let experiencesArray = resumes ? resumes['experience'] : null;
        let educationArray = resumes ? resumes['education'] : null;
        let skillsArray = resumes ? resumes['skills'] : null;
        return `<div class="row">
                    <div class="cv_header col-12">
                        <div class="profile_photo" id="profilePhoto" style="background-image:url(${personal?.['profilePhoto'] ? `/images/${personal['profilePhoto']}` : '/images/profile.webp'})"></div>
                        <div class="personal_info">
                            <div class="info_name">
                                <span class="firstName" id="firstName">${personal?.['firstName'] ? personal['firstName'] : ''}</span>
                                <span class="lastName" id="lastName">${personal?.['lastName'] ? personal['lastName'] : ''}</span>
                            </div>
                            <span class="jobTitle" id="jobTitle">${personal?.['jobTitle'] ? personal['jobTitle'] : ''}</span>
                        </div>
                        <div class="address_info">
                            <span class="address" id="address">${personal?.['address'] ? personal['address'] : ''}</span>
                            <span class="city" id="city">${personal?.['city'] ? personal['city'] : ''}</span>
                            <span class="phone" id="phone">${personal?.['phone'] ? personal['phone'] : ''}</span>
                            <span class="email" id="email">${personal?.['email'] ? personal['email'] : ''}</span>
                            
                        </div>
                    </div>
                    <div class="cv_desc col-12">
                        Passionate web developer, love JavaScript, Nodejs, Express and coding.
                    </div>

                    <div class="experience col-12">
                        <p class="exp_title">Professional Experience</p>
                        <div class="experience_list">
                            ${experiencesArray ? experiencesArray.map(exp => {
                                return `<div class="experience_div_${exp.index}">
                                            <div class="experience_heading">
                                                <div>
                                                    <strong class="position" id="position">${exp.position}</strong>
                                                    <span class="at-delimeter"> at </span>
                                                    <strong class="company" id="company">${exp.company}</strong>
                                                    <span class="slash-delimeter"> | </span>
                                                    <span class="date_span" id="startMonth">${exp.startMonth}</span>
                                                    <span class="date_span" id="startYear">${exp.startYear}</span>
                                                    <span class="delimeter"> - </span>
                                                    <span class="date_span" id="endMonth">${exp.endMonth}</span>
                                                    <span class="date_span" id="endYear">${exp.endYear}</span>
                                                </div>
                                            </div>
                                            <${exp.textarea_type} class="description_list">
                                                ${exp.textarea_prof_desc}
                                            </${exp.textarea_type}>
                                        </div>`;
                            }).join('') : ''}
                        </div>
                    </div>

                    <div class="education col-12">
                        <p class="edu_title">Education</p>
                        <div class="education_list">
                        ${educationArray ? educationArray.map(edu => {
                            return `<div class="education_div_${edu.index}">
                                        <div class="education_heading">
                                            <div>
                                                <strong class="degree" id="degree">${edu.degree}</strong>
                                                <span class="at-delimeter"> at </span>
                                                <strong class="school" id="school">${edu.school}</strong>
                                                <span class="slash-delimeter"> | </span>
                                                <span class="date_span" id="startMonth">${edu.startMonth}</span>
                                                <span class="date_span" id="startYear">${edu.startYear}</span>
                                                <span class="delimeter"> - </span>
                                                <span class="date_span" id="endMonth">${edu.endMonth}</span>
                                                <span class="date_span" id="endYear">${edu.endYear}</span>
                                            </div>
                                        </div>
                                        <${edu.textarea_type} class="description_list">
                                            ${edu.textarea_prof_desc}
                                        </${edu.textarea_type}>
                                    </div>`;
                        }).join('') : ''}
                        </div>
                    </div>

                    <div class="skills col-12">
                        <p class="skills_tittle">Skills</p>
                        <div class="skills_wrapper">
                            ${skillsArray ? skillsArray.map(skill => {
                                return `<div class="skill_div_${skill.index}">
                                            <div class="skill">${skill.skill}</div>
                                            <div class="range_wrapper">
                                                <div class="skill_range" style="width: ${skill.rangeValue}%;"></div>
                                            </div>
                                        </div>`
                            }).join('') : ''}
                        </div>
                    </div>
                </div>`;
    }

    
}
