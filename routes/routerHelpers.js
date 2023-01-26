const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');
const helpers = require('../utils/helpers');
const html_entities = require('html-entities');
const cheerio = require('cheerio');
var customId = require("custom-id");


function routeHelper(req, res, next, type, activeRoute) {
    let id = null;
    if (!req.session.resumes_ids[`${type}`]) {
        req.session.resumes_ids[`${type}`] = customId({ name: `${type}` });
        req.session.save(() => {
        });
    }
    id = req.session.resumes_ids[`${type}`];
    let current_resume = null;
    for (let i = 0; i < req.session.resumes.length; i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey == id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div !== 'boolean') {
                        exp.textarea_type_div = exp.textarea_type_div === 'true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div !== 'boolean') {
                        edu.textarea_type_div = edu.textarea_type_div === 'true';
                    }
                });
            }
            break;
        }
    }
    if (current_resume && current_resume.type !== type) {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes(type);
    }
    else {
        routes = current_resume['routes'];
    }

    if (activeRoute !== 'personal' && routes.indexOf(activeRoute) === -1) {
        res.redirect(`/editor/${type}/`);
        return;
    }

    let trackRoutes = routes.map(route => {
        if (route === activeRoute) {
            return { active: true, route: route, fullUrl: `/editor/${type}/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/${type}/${route}` };
    });

    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });

    let template = helpers.getType(type);
    fs.readFile(path.join(__dirname, '../', 'views', 'newcv', `${template}.mustache`), (err, data) => {
        if (err) {
            return next(err, req, res, next);
        }

        const objTemplate = {
            type: type, current_resume: current_resume, isStandard: true, activeRoute: activeRoute, [`is${activeRoute.charAt(0).toUpperCase() + activeRoute.slice(1)}`]: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), trackRoutes: trackRoutes,
            ...nonDeletedRoutes, routes: routes
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
}

function routeHelpersExpEdu(req, res, next, type, activeRoute) {
    let id = null;
    if (!req.session.resumes_ids[`${type}`]) {
        req.session.resumes_ids[`${type}`] = customId({ name: `${type}` });
        req.session.save(() => {
        });
    }
    id = req.session.resumes_ids[`${type}`];

    let current_resume = null;
    for (let i = 0; i < req.session.resumes.length; i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey == id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div !== 'boolean') {
                        exp.textarea_type_div = exp.textarea_type_div === 'true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div !== 'boolean') {
                        edu.textarea_type_div = edu.textarea_type_div === 'true';
                    }
                });
            }
            break;
        }
    }

    if (current_resume && current_resume.type !== type) {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes(type);
    }
    else {
        routes = current_resume['routes'];
    }

    if (activeRoute !== 'personal' && routes.indexOf(activeRoute) === -1) {
        res.redirect(`/editor/${type}/`);
        return;
    }

    const expExists = (current_resume && current_resume[activeRoute]) ? (current_resume[activeRoute].length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${type}/${activeRoute}/create`);
    }

    let trackRoutes = routes.map(route => {
        if (route === activeRoute) {
            return { active: true, route: route, fullUrl: `/editor/${type}/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/${type}/${route}` };
    });

    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();

    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return next(err, req, res, next);
        }
        let actRoute = [`is${activeRoute.charAt(0).toUpperCase() + activeRoute.slice(1)}`];
        console.log(actRoute);
        const objTemplate = {
            type: type, current_resume: current_resume, isStandard: true, activeRoute: activeRoute, [actRoute]: true, cvId: id, isList: true, isCreate: false, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), trackRoutes: trackRoutes,
            ...nonDeletedRoutes, months: months, years: years, expExists: expExists, isList: true, isCreate: false, routes: routes
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
}

function routeHelpersExpEduCreate(req, res, next, type, activeRoute) {
    let id = null;
    if (!req.session.resumes_ids[`${type}`]) {
        req.session.resumes_ids[`${type}`] = customId({ name: `${type}` });
        req.session.save(() => {
        });
    }
    id = req.session.resumes_ids[`${type}`];

    let current_resume = null;
    for (let i = 0; i < req.session.resumes.length; i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey == id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div !== 'boolean') {
                        exp.textarea_type_div = exp.textarea_type_div === 'true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div !== 'boolean') {
                        edu.textarea_type_div = edu.textarea_type_div === 'true';
                    }
                });
            }
            break;
        }
    }

    if (current_resume && current_resume.type !== type) {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes(type);
    }
    else {
        routes = current_resume['routes'];
    }

    if (activeRoute !== 'personal' && routes.indexOf(activeRoute) === -1) {
        res.redirect(`/editor/${type}/`);
        return;
    }

    const expExists = (current_resume && current_resume[activeRoute]) ? (current_resume[activeRoute].length > 0) : false;

    let trackRoutes = routes.map(route => {
        if (route === activeRoute) {
            return { active: true, route: route, fullUrl: `/editor/${type}/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/${type}/${route}` };
    });

    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();

    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return next(err, req, res, next);
        }
        let actRoute = `is${activeRoute.charAt(0).toUpperCase() + activeRoute.slice(1)}`;
        console.log(actRoute);
        const objTemplate = {
            type: type, current_resume: current_resume, isStandard: true, activeRoute: activeRoute, [actRoute]: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), trackRoutes: trackRoutes,
            ...nonDeletedRoutes, months: months, years: years, expExists: expExists, isList: false, isCreate: true, isForm: true, routes: routes
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
}

function routeHelpersExpEduId(req, res, next, type, activeRoute, expEduId) {
    let id = null;
    if (!req.session.resumes_ids[`${type}`]) {
        req.session.resumes_ids[`${type}`] = customId({ name: `${type}` });
        req.session.save(() => {
        });
    }
    id = req.session.resumes_ids[`${type}`];

    let current_resume = null;
    for (let i = 0; i < req.session.resumes.length; i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey == id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div !== 'boolean') {
                        exp.textarea_type_div = exp.textarea_type_div === 'true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div !== 'boolean') {
                        edu.textarea_type_div = edu.textarea_type_div === 'true';
                    }
                });
            }
            break;
        }
    }

    if (current_resume && current_resume.type !== type) {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes(type);
    }
    else {
        routes = current_resume['routes'];
    }

    if (activeRoute !== 'personal' && routes.indexOf(activeRoute) === -1) {
        res.redirect(`/editor/${type}/`);
        return;
    }

    const expExists = (current_resume && current_resume[activeRoute]) ? (current_resume[activeRoute].length > 0) : false;
    if (!expExists) {
        return res.redirect(`/editor/${type}/${activeRoute}/create`);
    }

    const expEduItem = current_resume[activeRoute].find(item => item.index == expEduId);
    if (!expEduItem) {
        return res.redirect(`/editor/${type}/${activeRoute}/`);
    }

    let trackRoutes = routes.map(route => {
        if (route === activeRoute) {
            return { active: true, route: route, fullUrl: `/editor/${type}/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/${type}/${route}` };
    });

    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    let months = helpers.buildMonths();
    let years = helpers.buildYear();
    let startMonthsTemplate = months.map(month => {
        if (month == expEduItem.startMonth) {
            return { active: true, month: month }
        }
        else return { active: false, month: month };
    });
    let startYearTemplate = years.map(year => {
        if (year == expEduItem.startYear) {
            return { active: true, year: year };
        }
        else return { active: false, year: year };
    });

    let endMontsTemplate = months.map(month => {
        if (expEduItem.endMonth && month == expEduItem.endMonth) {
            return { active: true, month: month };
        }
        else return { active: false, month: month };
    });
    let endYearTemplate = years.map(year => {
        if (expEduItem.endYear && year == expEduItem.endYear) {
            return { active: true, year: year };
        }
        else return { active: false, year: year };
    });
    textarea_prof_desc_string = undefined;
    if (expEduItem.textarea_type === 'list') {
        const $ = (cheerio.load(expEduItem.textarea_prof_desc));
        let elementArray = [];
        $('li').each(function (el) {
            let index = ($(this).attr('class')).split('_')[1];
            let element = `<li class="${$(this).attr('class')}"><div class="divElemIcon"><span>${$(this).text().trim()}</span><span class="remove_icon remove_icon_${index}"><i class="fa-sharp fa-solid fa-trash"></i></span></div></li>`;
            elementArray.push(element);
        });
        textarea_prof_desc_string = elementArray.map(el => {
            return el;
        }).join('');
    }
    let checkboxChecked = expEduItem['endMonth'] ? false : true;

    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return next(err, req, res, next);
        }

        const objTemplate = {
            type: type, current_resume: current_resume, isStandard: true, activeRoute: activeRoute, [`is${activeRoute.charAt(0).toUpperCase() + activeRoute.slice(1)}`]: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), trackRoutes: trackRoutes,
            ...nonDeletedRoutes, expItem: expEduItem, eduItem: expEduItem, isExperience: true, cvId: id, expExists: expExists, isList: false, isCreate: true, isEdit: true, months: months, years: years, checkboxChecked: checkboxChecked, textarea_prof_desc_string: textarea_prof_desc_string,
            startMonths: startMonthsTemplate, startYears: startYearTemplate, endMonths: endMontsTemplate, endYears: endYearTemplate, routes: routes
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
}

function routeHelperSkills(req, res, next, type, activeRoute) {
    let id = null;
    if (!req.session.resumes_ids[`${type}`]) {
        req.session.resumes_ids[`${type}`] = customId({ name: `${type}` });
        req.session.save(() => {
        });
    }
    id = req.session.resumes_ids[`${type}`];
    let current_resume = null;
    for (let i = 0; i < req.session.resumes.length; i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey == id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div !== 'boolean') {
                        exp.textarea_type_div = exp.textarea_type_div === 'true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div !== 'boolean') {
                        edu.textarea_type_div = edu.textarea_type_div === 'true';
                    }
                });
            }
            break;
        }
    }
    if (current_resume && current_resume.type !== type) {
        return res.redirect('/newresume');
    }

    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes(type);
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('skills') === -1) {
        res.redirect(`/editor/${type}/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route === 'skills') {
            return { active: true, route: route, fullUrl: `/editor/standard/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/standard/${route}` };
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

        const objTemplate = {
            type: type, current_resume: current_resume, isFancy: true, activeRoute: 'skills', isSkills: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, skillsArrayLength: skillsArrayLength,
            ...nonDeletedRoutes
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
}

function routeHelperLanguages(req, res, next, type, activeRoute) {
    let id = null;
    if (!req.session.resumes_ids[`${type}`]) {
        req.session.resumes_ids[`${type}`] = customId({ name: `${type}` });
        req.session.save(() => {
        });
    }
    id = req.session.resumes_ids[`${type}`];
    let current_resume = null;
    for (let i = 0; i < req.session.resumes.length; i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey == id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div !== 'boolean') {
                        exp.textarea_type_div = exp.textarea_type_div === 'true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div !== 'boolean') {
                        edu.textarea_type_div = edu.textarea_type_div === 'true';
                    }
                });
            }
            break;
        }
    }
    if (current_resume && current_resume.type !== type) {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes(type);
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('languages') === -1) {
        res.redirect(`/editor/${type}/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route === 'languages') {
            return { active: true, route: route, fullUrl: `/editor/${type}/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/${type}/${route}` };
    });
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>');
        }

        const objTemplate = {
            type: type, current_resume: current_resume, isFancy: true, activeRoute: 'languages', isLanguages: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
            ...nonDeletedRoutes
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
}

function routeHelperProfile(req, res, next, type, activeRoute) {
    let id = null;
    if (!req.session.resumes_ids[`${type}`]) {
        req.session.resumes_ids[`${type}`] = customId({ name: `${type}` });
        req.session.save(() => {
        });
    }
    id = req.session.resumes_ids[`${type}`];
    let current_resume = null;
    for (let i = 0; i < req.session.resumes.length; i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey == id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div !== 'boolean') {
                        exp.textarea_type_div = exp.textarea_type_div === 'true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div !== 'boolean') {
                        edu.textarea_type_div = edu.textarea_type_div === 'true';
                    }
                });
            }
            break;
        }
    }
    if (current_resume && current_resume.type !== type) {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes(type);
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('profile') === -1) {
        res.redirect(`/editor/${type}/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route === 'profile') {
            return { active: true, route: route, fullUrl: `/editor/${type}/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/${type}/${route}` };
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

        const objTemplate = {
            type: type, current_resume: current_resume, isFancy: true, activeRoute: 'profile', profileDesc: profileDesc, isProfile: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
            ...nonDeletedRoutes
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
}

function routeHelperFinalize(req, res, next, type, activeRoute) {
    let id = null;
    if (!req.session.resumes_ids[`${type}`]) {
        req.session.resumes_ids[`${type}`] = customId({ name: `${type}` });
        req.session.save(() => {
        });
    }
    id = req.session.resumes_ids[`${type}`];
    let current_resume = null;
    for (let i = 0; i < req.session.resumes.length; i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey == id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div !== 'boolean') {
                        exp.textarea_type_div = exp.textarea_type_div === 'true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div !== 'boolean') {
                        edu.textarea_type_div = edu.textarea_type_div === 'true';
                    }
                });
            }
            break;
        }
    }
    if (current_resume && current_resume.type !== type) {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes(type);
    }
    else {
        routes = current_resume['routes'];
    }
    let trackRoutes = routes.map(route => {
        if (route === 'finalize') {
            return { active: true, route: route, fullUrl: `/editor/${type}/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/${type}/${route}` };
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

        const objTemplate = {
            type: type, current_resume: current_resume, isFancy: true, activeRoute: 'finalize', isFinalize: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, cvExists: cvExists,
            ...nonDeletedRoutes
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
}

function routeHelperCertification(req, res, next, type, activeRoute) {
    let id = null;
    if (!req.session.resumes_ids[`${type}`]) {
        req.session.resumes_ids[`${type}`] = customId({ name: `${type}` });
        req.session.save(() => {
        });
    }
    id = req.session.resumes_ids[`${type}`];
    let current_resume = null;
    for (let i = 0; i < req.session.resumes.length; i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey == id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div !== 'boolean') {
                        exp.textarea_type_div = exp.textarea_type_div === 'true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div !== 'boolean') {
                        edu.textarea_type_div = edu.textarea_type_div === 'true';
                    }
                });
            }
            break;
        }
    }
    if (current_resume && current_resume.type !== type) {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes(type);
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('certifications') === -1) {
        res.redirect(`/editor/${type}/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route === 'certifications') {
            return { active: true, route: route, fullUrl: `/editor/fancy/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/fancy/${route}` };
    });
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    let certificationsArrayLength = current_resume ? (current_resume.certifications && current_resume.certifications.length > 0) : false;
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>');
        }

        const objTemplate = {
            type: type, current_resume: current_resume, addressIcon: addressIcon, isFancy: true, activeRoute: 'certifications', isCertifications: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes, certificationsArrayLength: certificationsArrayLength,
            ...nonDeletedRoutes
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
}

function routeHelperSocial(req, res, next, type, activeRoute) {
    let id = null;
    if (!req.session.resumes_ids[`${type}`]) {
        req.session.resumes_ids[`${type}`] = customId({ name: `${type}` });
        req.session.save(() => {
        });
    }
    id = req.session.resumes_ids[`${type}`];
    let current_resume = null;
    for (let i = 0; i < req.session.resumes.length; i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey == id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div !== 'boolean') {
                        exp.textarea_type_div = exp.textarea_type_div === 'true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div !== 'boolean') {
                        edu.textarea_type_div = edu.textarea_type_div === 'true';
                    }
                });
            }
            break;
        }
    }
    if (current_resume && current_resume.type !== type) {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes(type);
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('socialLinks') === -1) {
        res.redirect(`/editor/${type}/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route === 'socialLinks') {
            return { active: true, route: route, fullUrl: `/editor/${type}/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/${type}/${route}` };
    });
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }

    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>');
        }

        const objTemplate = {
            type: type, current_resume: current_resume, addressIcon: addressIcon, isFancy: true, activeRoute: 'socialLinks', isSocialLinks: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
            ...nonDeletedRoutes
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
}

function routeHelperPortfolio(req, res, next, type, activeRoute) {
    let id = null;
    if (!req.session.resumes_ids[`${type}`]) {
        req.session.resumes_ids[`${type}`] = customId({ name: `${type}` });
        req.session.save(() => {
        });
    }
    id = req.session.resumes_ids[`${type}`];
    let current_resume = null;
    for (let i = 0; i < req.session.resumes.length; i++) {
        let objKey = Object.keys(req.session.resumes[i])[0];
        if (objKey == id) {
            current_resume = req.session.resumes[i][objKey];
            if (Object.prototype.hasOwnProperty.call(current_resume, 'experience')) {
                current_resume.experience.forEach(exp => {
                    if (typeof exp.textarea_type_div !== 'boolean') {
                        exp.textarea_type_div = exp.textarea_type_div === 'true';
                    }
                });
            }
            if (Object.prototype.hasOwnProperty.call(current_resume, 'education')) {
                current_resume.education.forEach(edu => {
                    if (typeof edu.textarea_type_div !== 'boolean') {
                        edu.textarea_type_div = edu.textarea_type_div === 'true';
                    }
                });
            }
            break;
        }
    }
    if (current_resume && current_resume.type !== type) {
        return res.redirect('/newresume');
    }
    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes(type);
    }
    else {
        routes = current_resume['routes'];
    }
    if (routes.indexOf('portfolio') === -1) {
        res.redirect(`/editor/${type}/`);
        return;
    }
    let trackRoutes = routes.map(route => {
        if (route === 'portfolio') {
            return { active: true, route: route, fullUrl: `/editor/${type}/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/${type}/${route}` };
    });
    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });
    let addressIcon = false;
    if (current_resume && current_resume.personal) {
        addressIcon = (Boolean(current_resume.personal.address) || Boolean(current_resume.personal.city) || Boolean(current_resume.personal.country));
    }
    fs.readFile(path.join(__dirname, '../', 'views', 'server_side_templates', `${type}_server.mustache`), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>');
        }

        const objTemplate = {
            type: type, current_resume: current_resume, addressIcon: addressIcon, isFancy: true, activeRoute: 'portfolio', isPortfolio: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), routes: routes, trackRoutes: trackRoutes,
            ...nonDeletedRoutes
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
}

module.exports = {
    routeHelper: routeHelper,
    routeHelpersExpEdu: routeHelpersExpEdu,
    routeHelpersExpEduCreate: routeHelpersExpEduCreate,
    routeHelpersExpEduId: routeHelpersExpEduId,
    routeHelperSkills: routeHelperSkills,
    routeHelperLanguages: routeHelperLanguages,
    routeHelperProfile: routeHelperProfile,
    routeHelperFinalize: routeHelperFinalize,
    routeHelperCertification: routeHelperCertification,
    routeHelperSocial: routeHelperSocial,
    routeHelperPortfolio: routeHelperPortfolio
};