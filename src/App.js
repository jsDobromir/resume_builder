import Router from './utils/Router.js';
import State from './utils/State.js';
import EventEmitter from 'events';
import {decode} from 'html-entities';

import Personal from './components/Personal.js';
import experienceFunc from './components/ExperienceView.js';
import FinalizeView from './components/FinalizeView.js';
import EducationView from './components/EducationView.js';
import TrackBar from './components/TrackBar.js';
import createSkillInstance from './components/SkillsFactory.js';
import createLanguageInstance from './components/LanguageFactory.js';
import CvComp from './components/CvComp.js';
import ButtonsNav from './components/ButtonsNav.js';
import ProfileView from './components/ProfileView.js';
import Certifications from './components/Certifications.js';
import SocialLinks from './components/SocialLinks.js';
import Portfolio from './components/Portfolio.js';

export default class App {

    constructor() {
        this.componentsMap = new Object();
    }

    init() {
        const cvType = document.querySelector('.wrapper').dataset.activeCv;
        const cv_id = document.querySelector('.wrapper').dataset.cvId;
        let resumes = decode(document.querySelector('.wrapper').dataset.resumes);

        const evEmitterObj = new EventEmitter();
        let stateObj = State.initState(cvType, resumes);
        const routerObj = new Router(stateObj);
        let personalInstance = new Personal(stateObj, evEmitterObj, routerObj);
        let experienceInstance = experienceFunc(stateObj, evEmitterObj, routerObj);
        let educationInstance = new EducationView(stateObj, evEmitterObj, routerObj);
        let finalizeInstance = new FinalizeView(stateObj, evEmitterObj, routerObj);
        let trackbarInstance = new TrackBar(stateObj, evEmitterObj, routerObj);
        let skillsInstance = createSkillInstance(cvType, stateObj, evEmitterObj, routerObj);
        let languagesInstance = createLanguageInstance(cvType, stateObj, evEmitterObj, routerObj);
        let cvCompInstance = new CvComp(stateObj, evEmitterObj, routerObj, cvType);
        let profileInstance = new ProfileView(stateObj, evEmitterObj, routerObj);
        let portfolioInstance = new Portfolio(stateObj, evEmitterObj, routerObj);
        let buttonsNavInstance = new ButtonsNav(stateObj, evEmitterObj, routerObj);
        let certificationsInstance = new Certifications(stateObj, evEmitterObj, routerObj);
        let socialLinksInstance = new SocialLinks(stateObj, evEmitterObj, routerObj);

        this.componentsMap['personal'] = personalInstance;
        this.componentsMap['education'] = educationInstance;
        this.componentsMap['experience'] = experienceInstance;
        this.componentsMap['skills'] = skillsInstance;
        this.componentsMap['languages'] = languagesInstance;
        this.componentsMap['socialLinks'] = socialLinksInstance;
        this.componentsMap['finalize'] = finalizeInstance;
        this.componentsMap['trackbar'] = trackbarInstance;
        this.componentsMap['profile'] = profileInstance;
        this.componentsMap['portfolio'] = portfolioInstance;
        this.componentsMap['buttonsnav'] = buttonsNavInstance;
        this.componentsMap['certifications'] = certificationsInstance;
        this.componentsMap['cvCompInstance'] = cvCompInstance;

        stateObj.buildComponentsMap(this.componentsMap);
        trackbarInstance.setActiveRoute();
        trackbarInstance.attachEventListeners();
        buttonsNavInstance.attachEventListeners();
        routerObj.listenForRouteEvent();
    }

    attachListenersToActiveComp() {
        const activeRoute = document.querySelector('.wrapper').dataset.activeRoute;
        if (activeRoute==='experience' || activeRoute==='education') {
            if (document.querySelector(`.${activeRoute}.editor`).dataset.expExists=='true') {
                this.componentsMap[activeRoute].setView(false);
            }
            else {
                this.componentsMap[activeRoute].setView(true);
            }

            if (document.querySelector(`.${activeRoute}.editor`).dataset.isEdit=='true') {
                this.componentsMap[activeRoute].setEditObj();
            }
        }
        this.componentsMap[activeRoute].attachEventListeners();
    }
}