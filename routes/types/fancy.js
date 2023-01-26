const express = require('express');
const router = express.Router();
const helpers =require('../../utils/helpers');
const routeHelpers = require('../routerHelpers');

router.get('/', (req, res, next) => {
    routeHelpers.routeHelper(req, res, next, 'fancy', 'personal');
});

router.get('/:activeRoute', (req, res, next) => {
    let activeRoute = (req.params.activeRoute.toString());
    if (!helpers.routeExists(activeRoute)) {
        return next(err, req, res, next);
    }
    if (activeRoute==='experience' || activeRoute==='education') {
        routeHelpers.routeHelpersExpEdu(req, res, next, 'fancy', activeRoute);
        return;
    }
    if (activeRoute==='certifications') {
        routeHelpers.routeHelperCertification(req, res, next, 'fancy', activeRoute);
        return;
    }
    else if (activeRoute==='skills') {
        routeHelpers.routeHelperSkills(req, res, next, 'fancy', activeRoute);
        return;
    }
    else if (activeRoute==='socialLinks') {
        routeHelpers.routeHelperSocial(req, res, next, 'fancy', activeRoute);
        return;
    }
    else if (activeRoute==='portfolio') {
        routeHelpers.routeHelperPortfolio(req, res, next, 'fancy', activeRoute);
        return;
    }
    else if (activeRoute==='finalize') {
        routeHelpers.routeHelperFinalize(req, res, next, 'fancy', activeRoute);
        return;
    }

    routeHelpers.routeHelper(req, res, next,'fancy', activeRoute);
    return;
});

router.get('/:activeRoute/create', (req, res, next) => {
    let activeRoute = (req.params.activeRoute);
    if (activeRoute!=='experience' && activeRoute!=='education') {
        return next(err, req, res, next);
    }
    routeHelpers.routeHelpersExpEduCreate(req, res, next, 'fancy', activeRoute);
    return;
});

router.get('/:activeRoute/:expEduId', (req, res, next) => {
    let activeRoute = req.params.activeRoute.toString();
    let expEduId = (req.params.expEduId);
    if (activeRoute!=='experience' && activeRoute!=='education') {
        return next(err, req, res, next);
    }
    routeHelpers.routeHelpersExpEduId(req, res, next, 'fancy', activeRoute, expEduId);
    return;
});

module.exports = router;
