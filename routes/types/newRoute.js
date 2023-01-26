const express = require('express');
const router = express.Router();
var customId = require("custom-id");
const html_entities = require('html-entities');
const helpers = require('../../utils/helpers');
const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');

router.get('/standard', (req, res, next) => {
    req.session.resumes_ids[`standard`] = customId({ name: `standard` });
    req.session.save(() => {
    });
    let id = req.session.resumes_ids['standard'];
    let current_resume = null;

    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes('standard');
    }
    else {
        routes = current_resume['routes'];
    }

    let trackRoutes = routes.map(route => {
        if (route === 'personal') {
            return { active: true, route: route, fullUrl: `/editor/new/standard/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/new/standard/${route}` };
    });

    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });

    fs.readFile(path.join(__dirname, '../../', 'views', 'newcv', `editor.mustache`), (err, data) => {
        if (err) {
            return next(err, req, res, next);
        }

        const objTemplate = {
            type: 'standard', current_resume: current_resume, isStandard: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), trackRoutes: trackRoutes,
            ...nonDeletedRoutes, routes: routes, mode: 'new'
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get(['/standard/personal', '/standard/experience', '/standard/experience/create', '/standard/education', '/standard/education/create',
    '/standard/skills', '/standard/languages', '/standard/profile', '/standard/finalize'], (req, res, next) => {
        return res.redirect('/editor/new/standard');
    });

router.get('/fancy', (req, res, next) => {
    req.session.resumes_ids[`fancy`] = customId({ name: `fancy` });
    req.session.save(() => {
    });
    let id = req.session.resumes_ids['fancy'];
    let current_resume = null;

    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes('fancy');
    }
    else {
        routes = current_resume['routes'];
    }

    let trackRoutes = routes.map(route => {
        if (route === 'personal') {
            return { active: true, route: route, fullUrl: `/editor/new/fancy/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/new/fancy/${route}` };
    });

    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });

    fs.readFile(path.join(__dirname, '../../', 'views', 'newcv', `editor2.mustache`), (err, data) => {
        if (err) {
            return next(err, req, res, next);
        }

        const objTemplate = {
            type: 'fancy', current_resume: current_resume, isFancy: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), trackRoutes: trackRoutes,
            ...nonDeletedRoutes, routes: routes, mode: 'new'
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get(['/fancy/personal', '/fancy/experience', '/fancy/experience/create', '/fancy/education', '/fancy/education/create',
    '/fancy/certifications', '/fancy/skills', '/fancy/socialLinks', '/fancy/portfolio', '/fancy/finalize'], (req, res, next) => {
        return res.redirect('/editor/new/fancy');
    });

router.get('/custom', (req, res, next) => {
    req.session.resumes_ids[`custom`] = customId({ name: `custom` });
    req.session.save(() => {
    });
    let id = req.session.resumes_ids['custom'];
    let current_resume = null;

    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes('custom');
    }
    else {
        routes = current_resume['routes'];
    }

    let trackRoutes = routes.map(route => {
        if (route === 'personal') {
            return { active: true, route: route, fullUrl: `/editor/new/custom/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/new/custom/${route}` };
    });

    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });

    fs.readFile(path.join(__dirname, '../../', 'views', 'newcv', `editor3.mustache`), (err, data) => {
        if (err) {
            return next(err, req, res, next);
        }

        const objTemplate = {
            type: 'custom', current_resume: current_resume, isCustom: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), trackRoutes: trackRoutes,
            ...nonDeletedRoutes, routes: routes, mode: 'new'
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get(['/custom/personal', '/custom/experience', '/custom/experience/create', '/custom/education', '/custom/education/create',
    '/custom/skills', '/custom/languages', '/custom/certifications', '/custom/finalize'], (req, res, next) => {
        return res.redirect('/editor/new/custom');
    });

router.get('/simple', (req, res, next) => {
    req.session.resumes_ids[`simple`] = customId({ name: `simple` });
    req.session.save(() => {
    });
    let id = req.session.resumes_ids['simple'];
    let current_resume = null;

    let routes;
    if (!current_resume) {
        routes = helpers.getRoutes('simple');
    }
    else {
        routes = current_resume['routes'];
    }

    let trackRoutes = routes.map(route => {
        if (route === 'personal') {
            return { active: true, route: route, fullUrl: `/editor/new/simple/${route}` };
        }
        else return { active: false, route: route, fullUrl: `/editor/new/simple/${route}` };
    });

    let nonDeletedRoutes = {};
    routes.forEach(route => {
        nonDeletedRoutes[route] = true;
    });

    fs.readFile(path.join(__dirname, '../../', 'views', 'newcv', `editor4.mustache`), (err, data) => {
        if (err) {
            return next(err, req, res, next);
        }

        const objTemplate = {
            type: 'simple', current_resume: current_resume, isSimple: true, cvId: id, resumes: html_entities.encode(JSON.stringify(req.session.resumes)), trackRoutes: trackRoutes,
            ...nonDeletedRoutes, routes: routes, mode: 'new'
        };
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

router.get(['/simple/personal', '/simple/experience', '/simple/experience/create', '/simple/education', '/simple/education/create',
            '/simple/profile', '/simple/skills', '/simple/languages', '/simple/certifications', '/simple/finalize'], (req, res, next) => {
        return res.redirect('/editor/new/custom');
    });

module.exports = router;