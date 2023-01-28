const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');
const helpers =require('../utils/helpers');
const html_entities = require('html-entities');
const cheerio = require('cheerio');

const standardRoute = require('./types/standard');
const fancyRoute = require('./types/fancy');
const customRoute = require('./types/custom');
const simpleRoute = require('./types/simple');
const newRoute = require('./types/newRoute');

router.use('/standard', standardRoute);

router.use('/fancy', fancyRoute);

router.use('/custom', customRoute);

router.use('/simple', simpleRoute);

router.use('/new', newRoute);

router.get(['/:id/:type/', '/:id/:type/personal'], (req, res) => {

    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }

    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }

    routes = current_resume['routes'];
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    let trackRoutes = routes.map(route => {
        if (route==='personal') {
            return {active: true, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
        }
        else return {active: false, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
    });
    let template = helpers.getType(type);
    fs.readFile(path.join(__dirname, '../', 'views', 'newcv', `${template}.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }

        const objTemplate = {type: type, current_resume: current_resume, [`is${type}`]: true, activeRoute: 'personal', isPersonal: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                ...nonDeletedRoutes, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/:type/experience/', (req, res) => {

    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }
    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }
    
    let routes = current_resume['routes'];
    
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/${type}/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/${type}/experience/create`);
    }

    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
        }
        else return {active: false, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: type, current_resume: current_resume, [`is${type}`]: true, activeRoute: 'experience', isExperience: true, cvId: id, expExists: expExists, isList: true, isCreate: false, resumes: html_entities.encode(JSON.stringify(req.session.resumes)),routes: routes, trackRoutes: trackRoutes, months: months, years: years,
                            ...nonDeletedRoutes, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/:type/experience/create/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }
    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }

    let routes = current_resume['routes'];
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/${type}/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience.length > 0) : false;
    
    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route, fullUrl: `/editor/${id}/${type}/${route}/create`};
        }
        else return {active: false, route: route, fullUrl: `/editor/${id}/${type}/${route}/create`};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: type, current_resume: current_resume, [`is${type}`]: true, isForm: true,activeRoute: 'experience', isExperience: true, cvId: id, expExists: expExists, isList: false, isCreate: true, resumes: html_entities.encode(JSON.stringify(req.session.resumes)),routes: routes, trackRoutes: trackRoutes, months: months, years: years,
                                ...nonDeletedRoutes, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/:type/experience/:expId', (req, res) => {

    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }
    
    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }
    
    let routes = current_resume['routes'];
    
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/${type}/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience && current_resume.experience.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/${type}/experience/create`);
    }
    const experienceItem = current_resume.experience.find(exp => exp.index==req.params.expId);
    if (!experienceItem) {
        return res.redirect(`/editor/${id}/${type}/experience/`);
    }
    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
        }
        else return {active: false, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
    });

    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    let startMonthsTemplate = months.map(month => {
        if (month==experienceItem.startMonth) {
            return {active: true, month: month}
        }
        else return {active: false, month: month};
    });
    let startYearTemplate = years.map(year => {
        if (year==experienceItem.startYear) {
            return {active: true, year: year};
        }
        else return {active: false, year: year};
    });

    let endMontsTemplate = months.map(month => {
        if (experienceItem.endMonth && month==experienceItem.endMonth) {
            return {active: true, month: month};
        }
        else return {active: false, month: month};
    });
    let endYearTemplate = years.map(year => {
        if (experienceItem.endYear && year==experienceItem.endYear) {
            return {active: true, year: year};
        }
        else return {active: false, year: year};
    });
    textarea_prof_desc_string = undefined;
    if (experienceItem.textarea_type==='list') {
        const $ = (cheerio.load(experienceItem.textarea_prof_desc));
        let elementArray = [];
        $('li').each(function(el) {
            let index = ($(this).attr('class')).split('_')[1];
            let element = `<li class="${$(this).attr('class')}"><div class="divElemIcon"><span>${$(this).text().trim()}</span><span class="remove_icon remove_icon_${index}"><i class="fa-sharp fa-solid fa-trash"></i></span></div></li>`;
            elementArray.push(element);
        });
        textarea_prof_desc_string = elementArray.map(el => {
            return el;
        }).join(''); 
    }
    let checkboxChecked = experienceItem['endMonth'] ? false : true;
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        const expExists = current_resume ? (current_resume.experience.length > 0) : false;
        if (!expExists) {
            return res.redirect(`/editor/${id}/standard/experience/create`);
        }
        
        const objTemplate = {type: type, current_resume: current_resume, [`is${type}`]: true, activeRoute: 'experience', expItem: experienceItem,isExperience: true, cvId: id, expExists: expExists, isList: false, isCreate: true, isEdit: true, resumes: html_entities.encode(JSON.stringify(req.session.resumes)),routes: routes, trackRoutes: trackRoutes, months: months, years: years, checkboxChecked: checkboxChecked, textarea_prof_desc_string: textarea_prof_desc_string,
                            ...nonDeletedRoutes, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});


router.get('/:id/:type/education/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }

    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }
    
    let routes = current_resume['routes'];
    
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/${type}/`);
        return;
    }
    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/${type}/education/create`);
    }

    let trackRoutes = routes.map(route => {
        if (route==='education') {
            return {active: true, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
        }
        else return {active: false, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: type, current_resume: current_resume, isList: true,[`is${type}`]: true, months: months, years: years, activeRoute: 'education', isEducation: true, isCreate: false, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                ...nonDeletedRoutes, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/:type/education/create/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }

    
    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }
    
    let routes = current_resume['routes'];
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/${type}/`);
        return;
    }
    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;

    let trackRoutes = routes.map(route => {
        if (route==='education') {
            return {active: true, route: route, fullUrl: `/editor/${id}/${type}/${route}/create`};
        }
        else return {active: false, route: route, fullUrl: `/editor/${id}/${type}/${route}/create`};
    });
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: type, current_resume: current_resume, isForm: true,[`is${type}`]: true, expExists: expExists,months: months, years: years, activeRoute: 'education', isEducation: true, isCreate: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                    ...nonDeletedRoutes, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/:type/education/:eduId', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }

    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }
    
    let routes = current_resume['routes'];
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/${type}/`);
        return;
    }

    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/${type}/education/create`);
    }
    const educationItem = current_resume.education.find(edu => edu.index==req.params.eduId);
    if (!educationItem) {
        return res.redirect(`/editor/${id}/${type}/education/`);
    }
    let trackRoutes = routes.map(route => {
        if (route==='education') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });

    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    let startMonthsTemplate = months.map(month => {
        if (month==educationItem.startMonth) {
            return {active: true, month: month, fullUrl: `/editor/${id}/${type}/${route}`}
        }
        else return {active: false, month: month, fullUrl: `/editor/${id}/${type}/${route}`};
    });
    let startYearTemplate = years.map(year => {
        if (year==educationItem.startYear) {
            return {active: true, year: year};
        }
        else return {active: false, year: year};
    });

    let endMontsTemplate = months.map(month => {
        if (educationItem.endMonth && month==educationItem.endMonth) {
            return {active: true, month: month};
        }
        else return {active: false, month: month};
    });
    let endYearTemplate = years.map(year => {
        if (educationItem.endYear && year==educationItem.endYear) {
            return {active: true, year: year};
        }
        else return {active: false, year: year};
    });
    textarea_prof_desc_string = undefined;
    if (educationItem.textarea_type==='list') {
        const $ = (cheerio.load(educationItem.textarea_prof_desc));
        let elementArray = [];
        $('li').each(function(el) {
            let index = ($(this).attr('class')).split('_')[1];
            let element = `<li class="${$(this).attr('class')}"><div class="divElemIcon"><span>${$(this).text().trim()}</span><span class="remove_icon remove_icon_${index}"><i class="fa-sharp fa-solid fa-trash"></i></span></div></li>`;
            elementArray.push(element);
        });
        textarea_prof_desc_string = elementArray.map(el => {
            return el;
        }).join(''); 
    }
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    let checkboxChecked = educationItem['endMonth'] ? false : true;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: type, current_resume: current_resume, isEdit: true, checkboxChecked: checkboxChecked, eduItem: educationItem, [`is${type}`]: true, expExists: expExists,startMonths: startMonthsTemplate, startYears: startYearTemplate, endMonths: endMontsTemplate, endYears: endYearTemplate, activeRoute: 'education', isEducation: true, isCreate: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                            ...nonDeletedRoutes, textarea_prof_desc_string: textarea_prof_desc_string, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});


router.get('/:id/:type/skills/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }

    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }
    
    let routes = current_resume['routes'];
    
    if (routes.indexOf('skills')===-1) {
        res.redirect(`/editor/${req.params.id}/${type}/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='skills') {
            return {active: true, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
        }
        else return {active: false, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
    });
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    let skillsArrayLength = current_resume ? (current_resume.skills && current_resume.skills.length > 0) : false;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: type, current_resume: current_resume, [`is${type}`]: true, activeRoute: 'skills', isSkills: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, skillsArrayLength: skillsArrayLength,
                            ...nonDeletedRoutes, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/:type/languages/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }

    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }
    
    let routes = current_resume['routes'];
    
    if (routes.indexOf('languages')===-1) {
        res.redirect(`/editor/${req.params.id}/${type}/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='languages') {
            return {active: true, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
        }
        else return {active: false, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
    });
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: type, current_resume: current_resume, [`is${type}`]: true, activeRoute: 'languages', isLanguages: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                    ...nonDeletedRoutes, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/:type/profile/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }

    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }
    
    let routes = current_resume['routes'];

    if (routes.indexOf('profile')===-1) {
        res.redirect(`/editor/${req.params.id}/${type}/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='profile') {
            return {active: true, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
        }
        else return {active: false, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
    });
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    let profileDesc = (current_resume && current_resume.profile && current_resume.profile.profile_desc) ? current_resume.profile.profile_desc : undefined;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: type, current_resume: current_resume, [`is${type}`]: true, activeRoute: 'profile', profileDesc: profileDesc, isProfile: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                            ...nonDeletedRoutes, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/:type/finalize/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }

    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }
    
    let routes = current_resume['routes'];

    let trackRoutes = routes.map(route => {
        if (route==='finalize') {
            return {active: true, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
        }
        else return {active: false, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
    });
    let cvExists = helpers.cvExists(req.session.resumes, id);
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: type, current_resume: current_resume, [`is${type}`]: true, activeRoute: 'finalize', isFinalize: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, cvExists: cvExists,
                            ...nonDeletedRoutes, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/:type/certifications/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }

    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }
    
    let routes = current_resume['routes'];
    if (routes.indexOf('certifications')===-1) {
        res.redirect(`/editor/${req.params.id}/${type}/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='certifications') {
            return {active: true, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
        }
        else return {active: false, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
    });
    let certificationsArrayLength = current_resume ? (current_resume.certifications && current_resume.certifications.length > 0) : false;
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: type, current_resume: current_resume, addressIcon: addressIcon,[`is${type}`]: true, activeRoute: 'certifications', isCertifications: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, certificationsArrayLength: certificationsArrayLength,
                                ...nonDeletedRoutes, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/:type/socialLinks/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }

    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }
    
    let routes = current_resume['routes'];
    if (routes.indexOf('socialLinks')===-1) {
        res.redirect(`/editor/${req.params.id}/${type}/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='socialLinks') {
            return {active: true, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
        }
        else return {active: false, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
    });
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: type, current_resume: current_resume, addressIcon: addressIcon,[`is${type}`]: true, activeRoute: 'socialLinks', isSocialLinks: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                ...nonDeletedRoutes, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/:type/portfolio/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
    let type = req.params.type;
    for(let i=0;i<req.session.resumes.length;i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey==id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div!=='boolean') {
                        exp.textarea_type_div = exp.textarea_type_div==='true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div!=='boolean') {
                        edu.textarea_type_div = edu.textarea_type_div==='true';
                    }
                });
            }
            break;
        }
    }

    if (!current_resume) {
        return res.redirect(`/editor/${type}`);
    }
    
    let routes = current_resume['routes'];
    if (routes.indexOf('portfolio')===-1) {
        res.redirect(`/editor/${req.params.id}/${type}/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='portfolio') {
            return {active: true, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
        }
        else return {active: false, route: route, fullUrl: `/editor/${id}/${type}/${route}`};
    });
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: type, current_resume: current_resume, addressIcon: addressIcon,[`is${type}`]: true, activeRoute: 'portfolio', isPortfolio: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                ...nonDeletedRoutes, mode: 'edit'};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

module.exports = router;