const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');
const helpers =require('../utils/helpers');
const html_entities = require('html-entities');
const cheerio = require('cheerio');

router.get(['/:id/standard/', '/:id/standard/personal'], (req, res) => {

    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='standard') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'skills', 'languages', 'profile', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='personal') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    
    fs.readFile(path.join(__dirname, '../', 'views', 'newcv', 'editor.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }

        const objTemplate = {type: 'standard', current_resume: current_resume, isStandard: true, activeRoute: 'personal', isPersonal: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/standard/experience/', (req, res) => {

    let current_resume = null;
    let id = req.params.id;
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
    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }
    if (current_resume && current_resume.type!=='standard') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'skills', 'languages', 'profile', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/standard/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/standard/experience/create`);
    }

    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'standard_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        const expExists = current_resume ? (current_resume.experience.length > 0) : false;
        if (!expExists) {
            return res.redirect(`/editor/${id}/standard/experience/create`);
        }
        
        const objTemplate = {type: 'standard', current_resume: current_resume, isStandard: true, activeRoute: 'experience', isExperience: true, cvId: id, expExists: expExists, isList: true, isCreate: false, resumes: html_entities.encode(JSON.stringify(req.session.resumes)),routes: routes, trackRoutes: trackRoutes, months: months, years: years,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages') ,profile: routes.indexOf('profile')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/standard/experience/create/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }
    if (current_resume && current_resume.type!=='standard') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'skills', 'languages', 'profile', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/standard/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience.length > 0) : false;
    
    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'standard_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'standard', current_resume: current_resume, isStandard: true, isForm: true,activeRoute: 'experience', isExperience: true, cvId: id, expExists: expExists, isList: false, isCreate: true, resumes: html_entities.encode(JSON.stringify(req.session.resumes)),routes: routes, trackRoutes: trackRoutes, months: months, years: years,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages') ,profile: routes.indexOf('profile')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/standard/experience/:expId', (req, res) => {

    let current_resume = null;
    let id = req.params.id;
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
    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }
    if (current_resume && current_resume.type!=='standard') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'skills', 'languages', 'profile', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/standard/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience && current_resume.experience.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/standard/experience/create`);
    }
    const experienceItem = current_resume.experience.find(exp => exp.index==req.params.expId);
    if (!experienceItem) {
        return res.redirect(`/editor/${id}/standard/experience/`);
    }
    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
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
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'standard_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        const expExists = current_resume ? (current_resume.experience.length > 0) : false;
        if (!expExists) {
            return res.redirect(`/editor/${id}/standard/experience/create`);
        }
        
        const objTemplate = {type: 'standard', current_resume: current_resume, isStandard: true, activeRoute: 'experience', expItem: experienceItem,isExperience: true, cvId: id, expExists: expExists, isList: false, isCreate: true, isEdit: true, resumes: html_entities.encode(JSON.stringify(req.session.resumes)),routes: routes, trackRoutes: trackRoutes, months: months, years: years, checkboxChecked: checkboxChecked, textarea_prof_desc_string: textarea_prof_desc_string,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages') ,profile: routes.indexOf('profile')===-1 ? false : true, startMonths: startMonthsTemplate, startYears: startYearTemplate, endMonths: endMontsTemplate, endYears: endYearTemplate};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});


router.get('/:id/standard/education/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='standard') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'skills', 'languages', 'profile', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/standard/`);
        return;
    }
    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/standard/education/create`);
    }

    let trackRoutes = routes.map(route => {
        if (route==='education') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'standard_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'standard', current_resume: current_resume, isList: true,isStandard: true, months: months, years: years, activeRoute: 'education', isEducation: true, isCreate: false, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/standard/education/create/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='standard') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'skills', 'languages', 'profile', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/standard/`);
        return;
    }
    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;

    let trackRoutes = routes.map(route => {
        if (route==='education') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });

    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'standard_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'standard', current_resume: current_resume, isForm: true,isFancy: true, expExists: expExists,months: months, years: years, activeRoute: 'education', isEducation: true, isCreate: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                    experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/standard/education/:eduId', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='standard') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'skills', 'languages', 'profile', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/standard/`);
        return;
    }
    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/standard/education/create`);
    }
    const educationItem = current_resume.education.find(edu => edu.index==req.params.eduId);
    if (!educationItem) {
        return res.redirect(`/editor/${id}/standard/education/`);
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
            return {active: true, month: month}
        }
        else return {active: false, month: month};
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
    let checkboxChecked = educationItem['endMonth'] ? false : true;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'standard_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'standard', current_resume: current_resume, isEdit: true, checkboxChecked: checkboxChecked, eduItem: educationItem,isFancy: true, expExists: expExists,startMonths: startMonthsTemplate, startYears: startYearTemplate, endMonths: endMontsTemplate, endYears: endYearTemplate, activeRoute: 'education', isEducation: true, isCreate: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, textarea_prof_desc_string: textarea_prof_desc_string};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});


router.get('/:id/standard/skills/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='standard') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'skills', 'languages', 'profile', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('skills')===-1) {
        res.redirect(`/editor/${req.params.id}/standard/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='skills') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let skillsArrayLength = current_resume ? (current_resume.skills && current_resume.skills.length > 0) : false;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'standard_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'standard', current_resume: current_resume, isFancy: true, activeRoute: 'skills', isSkills: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, skillsArrayLength: skillsArrayLength,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/standard/languages/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='standard') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'skills', 'languages', 'profile', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('languages')===-1) {
        res.redirect(`/editor/${req.params.id}/standard/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='languages') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'standard_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'standard', current_resume: current_resume, isFancy: true, activeRoute: 'languages', isLanguages: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/standard/profile/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='standard') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'skills', 'languages', 'profile', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('profile')===-1) {
        res.redirect(`/editor/${req.params.id}/standard/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='profile') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let profileDesc = (current_resume && current_resume.profile && current_resume.profile.profile_desc) ? current_resume.profile.profile_desc : undefined;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'standard_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'standard', current_resume: current_resume, isFancy: true, activeRoute: 'profile', profileDesc: profileDesc, isProfile: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/standard/finalize/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='standard') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'skills', 'languages', 'profile', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='finalize') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let cvExists = helpers.cvExists(req.session.resumes, id);
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'standard_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'standard', current_resume: current_resume, isFancy: true, activeRoute: 'finalize', isFinalize: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, cvExists: cvExists,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

//cv2
//---------------------------------------------------------------------------------/

router.get(['/:id/fancy/', '/:id/fancy/personal/'], (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='fancy') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'certifications', 'skills', 'socialLinks', 'portfolio', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='personal') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'newcv', 'editor2.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'fancy', current_resume: current_resume, addressIcon: addressIcon,isFancy: true, activeRoute: 'personal', isPersonal: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, socialLinks: routes.indexOf('socialLinks')===-1 ? false : true, portfolio: routes.indexOf('portfolio')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/fancy/experience/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='fancy') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'certifications', 'skills', 'socialLinks', 'portfolio', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/fancy/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/fancy/experience/create`);
    }

    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'fancy_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'fancy', current_resume: current_resume, addressIcon: addressIcon,isList: true,isFancy: true, months: months, years: years, activeRoute: 'experience', isExperience: true, isCreate: false, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, socialLinks: routes.indexOf('socialLinks')===-1 ? false : true, portfolio: routes.indexOf('portfolio')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/fancy/experience/create/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='fancy') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'certifications', 'skills', 'socialLinks', 'portfolio', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/fancy/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience && current_resume.experience.length > 0) : false;

    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'fancy_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'fancy', current_resume: current_resume, addressIcon: addressIcon,isForm: true,isFancy: true, expExists: expExists,months: months, years: years, activeRoute: 'experience', isExperience: true, isCreate: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, socialLinks: routes.indexOf('socialLinks')===-1 ? false : true, portfolio: routes.indexOf('portfolio')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/fancy/experience/:expId', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='fancy') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'certifications', 'skills', 'socialLinks', 'portfolio', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/fancy/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience && current_resume.experience.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/fancy/experience/create`);
    }
    const experienceItem = current_resume.experience.find(exp => exp.index==req.params.expId);
    if (!experienceItem) {
        return res.redirect(`/editor/${id}/fancy/experience/`);
    }
    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
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
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'fancy_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'fancy', current_resume: current_resume, addressIcon: addressIcon,isEdit: true, checkboxChecked: checkboxChecked, expItem: experienceItem,isFancy: true, expExists: expExists,startMonths: startMonthsTemplate, startYears: startYearTemplate, endMonths: endMontsTemplate, endYears: endYearTemplate, activeRoute: 'experience', isExperience: true, isCreate: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, socialLinks: routes.indexOf('socialLinks')===-1 ? false : true, portfolio: routes.indexOf('portfolio')===-1 ? false : true, textarea_prof_desc_string: textarea_prof_desc_string};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/fancy/education/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='fancy') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'certifications', 'skills', 'socialLinks', 'portfolio', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/fancy/`);
        return;
    }
    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/fancy/education/create`);
    }

    let trackRoutes = routes.map(route => {
        if (route==='education') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'fancy_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'fancy', current_resume: current_resume, addressIcon: addressIcon,isList: true,isFancy: true, months: months, years: years, activeRoute: 'education', isEducation: true, isCreate: false, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, socialLinks: routes.indexOf('socialLinks')===-1 ? false : true, portfolio: routes.indexOf('portfolio')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/fancy/education/create/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='fancy') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'certifications', 'skills', 'socialLinks', 'portfolio', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/fancy/`);
        return;
    }
    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;

    let trackRoutes = routes.map(route => {
        if (route==='education') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });

    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'fancy_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'fancy', current_resume: current_resume, addressIcon: addressIcon,isForm: true,isFancy: true, expExists: expExists,months: months, years: years, activeRoute: 'education', isEducation: true, isCreate: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, socialLinks: routes.indexOf('socialLinks')===-1 ? false : true, portfolio: routes.indexOf('portfolio')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/fancy/education/:eduId', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='fancy') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'certifications', 'skills', 'socialLinks', 'portfolio', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/fancy/`);
        return;
    }
    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/fancy/education/create`);
    }
    const educationItem = current_resume.education.find(edu => edu.index==req.params.eduId);
    if (!educationItem) {
        return res.redirect(`/editor/${id}/fancy/education/`);
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
            return {active: true, month: month}
        }
        else return {active: false, month: month};
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
    let checkboxChecked = educationItem['endMonth'] ? false : true;
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'fancy_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'fancy', current_resume: current_resume, addressIcon: addressIcon,isEdit: true, checkboxChecked: checkboxChecked, eduItem: educationItem,isFancy: true, expExists: expExists,startMonths: startMonthsTemplate, startYears: startYearTemplate, endMonths: endMontsTemplate, endYears: endYearTemplate, activeRoute: 'education', isEducation: true, isCreate: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, socialLinks: routes.indexOf('socialLinks')===-1 ? false : true, portfolio: routes.indexOf('portfolio')===-1 ? false : true, textarea_prof_desc_string: textarea_prof_desc_string};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/fancy/certifications/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='fancy') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'certifications', 'skills', 'socialLinks', 'portfolio', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='certifications') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let certificationsArrayLength = current_resume ? (current_resume.certifications && current_resume.certifications.length > 0) : false;
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'fancy_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'fancy', current_resume: current_resume, addressIcon: addressIcon,isFancy: true, activeRoute: 'certifications', isCertifications: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, certificationsArrayLength: certificationsArrayLength,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, socialLinks: routes.indexOf('socialLinks')===-1 ? false : true, portfolio: routes.indexOf('portfolio')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/fancy/skills/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='fancy') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'certifications', 'skills', 'socialLinks', 'portfolio', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='skills') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let skillsArrayLength = current_resume ? (current_resume.skills && current_resume.skills.length > 0) : false;
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'fancy_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'fancy', current_resume: current_resume, addressIcon: addressIcon,isFancy: true, activeRoute: 'skills', isSkills: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, skillsArrayLength: skillsArrayLength,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, socialLinks: routes.indexOf('socialLinks')===-1 ? false : true, portfolio: routes.indexOf('portfolio')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/fancy/socialLinks/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='fancy') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'certifications', 'skills', 'socialLinks', 'portfolio', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='socialLinks') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'fancy_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'fancy', current_resume: current_resume, addressIcon: addressIcon,isFancy: true, activeRoute: 'socialLinks', isSocialLinks: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, socialLinks: routes.indexOf('socialLinks')===-1 ? false : true, portfolio: routes.indexOf('portfolio')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/fancy/portfolio/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='fancy') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'certifications', 'skills', 'socialLinks', 'portfolio', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='portfolio') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'fancy_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'fancy', current_resume: current_resume, addressIcon: addressIcon,isFancy: true, activeRoute: 'portfolio', isPortfolio: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, socialLinks: routes.indexOf('socialLinks')===-1 ? false : true, portfolio: routes.indexOf('portfolio')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/fancy/finalize/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='fancy') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'experience', 'education', 'certifications', 'skills', 'socialLinks', 'portfolio', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='finalize') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let cvExists = helpers.cvExists(req.session.resumes, id);
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'fancy_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'fancy', current_resume: current_resume, addressIcon: addressIcon,isFancy: true, activeRoute: 'finalize', isFinalize: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, cvExists: cvExists,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, socialLinks: routes.indexOf('socialLinks')===-1 ? false : true, portfolio: routes.indexOf('portfolio')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

//----------------------------------------------------------------------------------/
//-CUSTOM-//

router.get(['/:id/custom/', '/:id/custom/personal/'], (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='custom') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='personal') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'newcv', 'editor3.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }

        const objTemplate = {type: 'custom', current_resume: current_resume, isCustom: true, activeRoute: 'personal', isPersonal: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/custom/experience/', (req, res) => {

    let current_resume = null;
    let id = req.params.id;
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
    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }
    if (current_resume && current_resume.type!=='custom') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/custom/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/custom/experience/create`);
    }

    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'custom_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        const expExists = current_resume ? (current_resume.experience.length > 0) : false;
        if (!expExists) {
            return res.redirect(`/editor/${id}/custom/experience/create`);
        }
        
        const objTemplate = {type: 'custom', current_resume: current_resume, isCustom: true, activeRoute: 'experience', isExperience: true, cvId: id, expExists: expExists, isList: true, isCreate: false, resumes: html_entities.encode(JSON.stringify(req.session.resumes)),routes: routes, trackRoutes: trackRoutes, months: months, years: years,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages') ,profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/custom/experience/create/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }
    if (current_resume && current_resume.type!=='custom') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/custom/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience)? (current_resume.experience.length > 0) : false;
    
    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'custom_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'custom', current_resume: current_resume, isCustom: true, isForm: true,activeRoute: 'experience', isExperience: true, cvId: id, expExists: expExists, isList: false, isCreate: true, resumes: html_entities.encode(JSON.stringify(req.session.resumes)),routes: routes, trackRoutes: trackRoutes, months: months, years: years,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages') ,profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/custom/experience/:expId', (req, res) => {

    let current_resume = null;
    let id = req.params.id;
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
    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }
    if (current_resume && current_resume.type!=='custom') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/custom/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience && current_resume.experience.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/custon/experience/create`);
    }
    const experienceItem = current_resume.experience.find(exp => exp.index==req.params.expId);
    if (!experienceItem) {
        return res.redirect(`/editor/${id}/custom/experience/`);
    }
    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
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
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'custom_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        const expExists = current_resume ? (current_resume.experience.length > 0) : false;
        if (!expExists) {
            return res.redirect(`/editor/${id}/custom/experience/create`);
        }
        
        const objTemplate = {type: 'custom', current_resume: current_resume, isCustom: true, activeRoute: 'experience', expItem: experienceItem,isExperience: true, cvId: id, expExists: expExists, isList: false, isCreate: true, isEdit: true, resumes: html_entities.encode(JSON.stringify(req.session.resumes)),routes: routes, trackRoutes: trackRoutes, months: months, years: years, checkboxChecked: checkboxChecked, textarea_prof_desc_string: textarea_prof_desc_string,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages') ,profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, startMonths: startMonthsTemplate, startYears: startYearTemplate, endMonths: endMontsTemplate, endYears: endYearTemplate};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});


router.get('/:id/custom/education/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='custom') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/custom/`);
        return;
    }
    const expExists = (current_resume && current_resume.education)? (current_resume.education && current_resume.education.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/custom/education/create`);
    }

    let trackRoutes = routes.map(route => {
        if (route==='education') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'custom_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'custom', current_resume: current_resume, isList: true,isCustom: true, months: months, years: years, activeRoute: 'education', isEducation: true, isCreate: false, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/custom/education/create/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='custom') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/custom/`);
        return;
    }
    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;

    let trackRoutes = routes.map(route => {
        if (route==='education') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });

    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'custom_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'custom', current_resume: current_resume, isForm: true,isCustom: true, expExists: expExists,months: months, years: years, activeRoute: 'education', isEducation: true, isCreate: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                    experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/custom/education/:eduId', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='custom') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/custom/`);
        return;
    }
    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/custom/education/create`);
    }
    const educationItem = current_resume.education.find(edu => edu.index==req.params.eduId);
    if (!educationItem) {
        return res.redirect(`/editor/${id}/custom/education/`);
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
            return {active: true, month: month}
        }
        else return {active: false, month: month};
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
    let checkboxChecked = educationItem['endMonth'] ? false : true;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'custom_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'custom', current_resume: current_resume, isEdit: true, checkboxChecked: checkboxChecked, eduItem: educationItem,isFancy: true, expExists: expExists,startMonths: startMonthsTemplate, startYears: startYearTemplate, endMonths: endMontsTemplate, endYears: endYearTemplate, activeRoute: 'education', isEducation: true, isCreate: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, textarea_prof_desc_string: textarea_prof_desc_string};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/custom/profile/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='custom') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('profile')===-1) {
        res.redirect(`/editor/${req.params.id}/custom/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='profile') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let profileDesc = (current_resume && current_resume.profile && current_resume.profile.profile_desc) ? current_resume.profile.profile_desc : undefined;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'custom_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'custom', current_resume: current_resume, isCustom: true, activeRoute: 'profile', profileDesc: profileDesc, isProfile: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});


router.get('/:id/custom/skills/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='custom') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('skills')===-1) {
        res.redirect(`/editor/${req.params.id}/custom/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='skills') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let skillsArrayLength = current_resume ? (current_resume.skills && current_resume.skills.length > 0) : false;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'custom_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'custom', current_resume: current_resume, isCustom: true, activeRoute: 'skills', isSkills: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, skillsArrayLength: skillsArrayLength,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/custom/languages/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='custom') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('languages')===-1) {
        res.redirect(`/editor/${req.params.id}/custom/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='languages') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'custom_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'custom', current_resume: current_resume, isCustom: true, activeRoute: 'languages', isLanguages: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/custom/certifications/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='custom') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='certifications') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let certificationsArrayLength = current_resume ? (current_resume.certifications && current_resume.certifications.length > 0) : false;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'custom_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'custom', current_resume: current_resume, isCustom: true, activeRoute: 'certifications', isCertifications: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, certificationsArrayLength: certificationsArrayLength,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/custom/finalize/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='custom') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='finalize') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let cvExists = helpers.cvExists(req.session.resumes, id);
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'custom_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'custom', current_resume: current_resume, isCustom: true, activeRoute: 'finalize', isFinalize: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, cvExists: cvExists,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

//------------------------------------------------------------------------//
//simple

router.get(['/:id/simple/', '/:id/simple/personal/'], (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='simple') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='personal') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'newcv', 'editor4.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }

        const objTemplate = {type: 'simple', current_resume: current_resume, isSimple: true, activeRoute: 'personal', isPersonal: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/simple/experience/', (req, res) => {

    let current_resume = null;
    let id = req.params.id;
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
    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }
    if (current_resume && current_resume.type!=='simple') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/simple/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/simple/experience/create`);
    }

    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'simple_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        const expExists = current_resume ? (current_resume.experience.length > 0) : false;
        if (!expExists) {
            return res.redirect(`/editor/${id}/simple/experience/create`);
        }
        
        const objTemplate = {type: 'simple', current_resume: current_resume, isSimple: true, activeRoute: 'experience', isExperience: true, cvId: id, expExists: expExists, isList: true, isCreate: false, resumes: html_entities.encode(JSON.stringify(req.session.resumes)),routes: routes, trackRoutes: trackRoutes, months: months, years: years,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages') ,profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false: true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/simple/experience/create/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }
    if (current_resume && current_resume.type!=='simple') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes =  ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/simple/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience.length > 0) : false;
    
    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'simple_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'simple', current_resume: current_resume, isSimple: true, isForm: true,activeRoute: 'experience', isExperience: true, cvId: id, expExists: expExists, isList: false, isCreate: true, resumes: html_entities.encode(JSON.stringify(req.session.resumes)),routes: routes, trackRoutes: trackRoutes, months: months, years: years,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages') ,profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/simple/experience/:expId', (req, res) => {

    let current_resume = null;
    let id = req.params.id;
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
    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }
    if (current_resume && current_resume.type!=='standard') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('experience')===-1) {
        res.redirect(`/editor/${req.params.id}/simple/`);
        return;
    }
    const expExists = (current_resume && current_resume.experience) ? (current_resume.experience && current_resume.experience.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/simple/experience/create`);
    }
    const experienceItem = current_resume.experience.find(exp => exp.index==req.params.expId);
    if (!experienceItem) {
        return res.redirect(`/editor/${id}/simple/experience/`);
    }
    let trackRoutes = routes.map(route => {
        if (route==='experience') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
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
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'simple_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        const expExists = current_resume ? (current_resume.experience.length > 0) : false;
        if (!expExists) {
            return res.redirect(`/editor/${id}/simple/experience/create`);
        }
        
        const objTemplate = {type: 'simple', current_resume: current_resume, isSimple: true, activeRoute: 'experience', expItem: experienceItem,isExperience: true, cvId: id, expExists: expExists, isList: false, isCreate: true, isEdit: true, resumes: html_entities.encode(JSON.stringify(req.session.resumes)),routes: routes, trackRoutes: trackRoutes, months: months, years: years, checkboxChecked: checkboxChecked, textarea_prof_desc_string: textarea_prof_desc_string,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages') ,profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, startMonths: startMonthsTemplate, startYears: startYearTemplate, endMonths: endMontsTemplate, endYears: endYearTemplate};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});


router.get('/:id/simple/education/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='simple') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/simple/`);
        return;
    }
    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/simple/education/create`);
    }

    let trackRoutes = routes.map(route => {
        if (route==='education') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'simple_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'simple', current_resume: current_resume, isList: true,isSimple: true, months: months, years: years, activeRoute: 'education', isEducation: true, isCreate: false, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false: true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/simple/education/create/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='simple') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/simple/`);
        return;
    }
    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;

    let trackRoutes = routes.map(route => {
        if (route==='education') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });

    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'simple_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'simple', current_resume: current_resume, isForm: true,isSimple: true, expExists: expExists,months: months, years: years, activeRoute: 'education', isEducation: true, isCreate: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
                    experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/simple/education/:eduId', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='simple') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('education')===-1) {
        res.redirect(`/editor/${req.params.id}/simple/`);
        return;
    }
    const expExists = (current_resume && current_resume.education) ? (current_resume.education && current_resume.education.length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${id}/simple/education/create`);
    }
    const educationItem = current_resume.education.find(edu => edu.index==req.params.eduId);
    if (!educationItem) {
        return res.redirect(`/editor/${id}/simple/education/`);
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
            return {active: true, month: month}
        }
        else return {active: false, month: month};
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
    let checkboxChecked = educationItem['endMonth'] ? false : true;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'simple_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'simple', current_resume: current_resume, isEdit: true, checkboxChecked: checkboxChecked, eduItem: educationItem,isFancy: true, expExists: expExists,startMonths: startMonthsTemplate, startYears: startYearTemplate, endMonths: endMontsTemplate, endYears: endYearTemplate, activeRoute: 'education', isEducation: true, isCreate: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, textarea_prof_desc_string: textarea_prof_desc_string};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/simple/profile/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='simple') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('profile')===-1) {
        res.redirect(`/editor/${req.params.id}/simple/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='profile') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let profileDesc = (current_resume && current_resume.profile && current_resume.profile.profile_desc) ? current_resume.profile.profile_desc : undefined;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'simple_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'simple', current_resume: current_resume, isFancy: true, activeRoute: 'profile', profileDesc: profileDesc, isProfile: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/simple/skills/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='simple') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('skills')===-1) {
        res.redirect(`/editor/${req.params.id}/simple/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='skills') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let skillsArrayLength = current_resume ? (current_resume.skills && current_resume.skills.length > 0) : false;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'simple_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'simple', current_resume: current_resume, isSimple: true, activeRoute: 'skills', isSkills: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, skillsArrayLength: skillsArrayLength,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/simple/languages/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='simple') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('languages')===-1) {
        res.redirect(`/editor/${req.params.id}/simple/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route==='languages') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'simple_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'simple', current_resume: current_resume, isSimple: true, activeRoute: 'languages', isLanguages: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/simple/certifications/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='simple') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='certifications') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let certificationsArrayLength = current_resume ? (current_resume.certifications && current_resume.certifications.length > 0) : false;
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'simple_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'simple', current_resume: current_resume, isSimple: true, activeRoute: 'certifications', isCertifications: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, certificationsArrayLength: certificationsArrayLength,
                                experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get('/:id/simple/finalize/', (req, res) => {
    let current_resume = null;
    let id = req.params.id;
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

    if (!current_resume && req.session.tempArr.indexOf(id)===-1) {
        res.redirect('/newresume');
        return;
    }

    if (current_resume && current_resume.type!=='simple') {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = ['personal', 'profile', 'experience', 'education', 'skills', 'languages', 'certifications', 'finalize'];
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route==='finalize') {
            return {active: true, route: route};
        }
        else return {active: false, route: route};
    });
    let cvExists = helpers.cvExists(req.session.resumes, id);
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', 'simple_server.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        
        const objTemplate = {type: 'simple', current_resume: current_resume, isSimple: true, activeRoute: 'finalize', isFinalize: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, cvExists: cvExists,
        experience: routes.indexOf('experience')===-1 ? false : true, education: routes.indexOf('education')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, skills: routes.indexOf('skills')===-1 ? false : true, profile: routes.indexOf('profile')===-1 ? false : true, certifications: routes.indexOf('certifications')===-1 ? false : true, languages: routes.indexOf('languages')===-1 ? false : true};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

module.exports = router;