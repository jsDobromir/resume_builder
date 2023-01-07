const express = require('express');
const path = require('path');
const session = require('express-session');
const Mustache = require('mustache');
const fs = require('fs');
const generatePdf = require('./utils/generatePdf');
const pg = require('pg');
const pgSession = require('connect-pg-simple')(session);
const multer = require('multer');
const helmet = require('helmet');
const helpers = require('./utils/helpers.js');
const editorRoute = require('./routes/editor.js');
var customId = require("custom-id");

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './dist/images/')
    },
    filename: function(req, file, callback) {
        const filename = `${req.body.current_cv_id}.${file.mimetype.replace(/(.*)\//g, '')}`;
        req.profilePhoto = filename;
        callback(null, filename);
    }
});

const upload = multer({storage: storage}).single('profilePhoto');

const app = express();

//app.use(helmet());

const dbOptions = {
    host:'localhost',
    database:'dobromir',
    user: 'dobromir',
    password:'dobromir',
    prot: 5432
};

const pgPool = new pg.Pool(dbOptions);

app.use(session({
    secret: 'sessionkey',
    store: new pgSession({
        pool: pgPool,
        tableName: 'session'
    }),
    resave: false,
    saveUninitialized: true,
    unset: 'destroy',
    cookie: {secure: false, maxAge: (3600000 * 24 * 30) }
}));
// /3600000 * 24 * 30
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
    req.session.resumes = req.session.resumes || [];
    req.session.tempArr = req.session.tempArr || [];
    next();
});

app.get('/', (req, res) => {
    req.session.tempArr = [];
    fs.readFile(path.join(__dirname, 'src', 'home.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>');
        }

        const id1 = customId({name: 'standard'});
        const id2 = customId({name: 'fancy'});
        const id3 = customId({name: 'custom'});
        const id4 = customId({name: 'simple'});
        req.session.tempArr.push(id1);req.session.tempArr.push(id2);req.session.tempArr.push(id3);req.session.tempArr.push(id4);
        const objTemplate = {id1: id1, id2: id2, id3: id3, id4: id4};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

app.get('/newcv', (req, res) => {
    req.session.tempArr = [];
    fs.readFile(path.join(__dirname, 'views', 'newcv', 'newcv.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }
        const id1 = customId({name: 'standard'});
        const id2 = customId({name: 'fancy'});
        const id3 = customId({name: 'custom'});
        const id4 = customId({name: 'simple'});
        req.session.tempArr.push(id1);req.session.tempArr.push(id2);req.session.tempArr.push(id3);req.session.tempArr.push(id4);
        const objTemplate = {id1: id1, id2: id2, id3: id3, id4: id4};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

app.use('/editor', editorRoute);

app.post('/saveData', (req, res) => {
    if (helpers.cvExists(req.session.resumes, req.body.current_cv_id)) {
        for(let i=0;i<req.session.resumes.length;i++) {
            let object = req.session.resumes[i];
            const object_id = Object.keys(object)[0];
            if (object_id==req.body.current_cv_id) {
                req.session.resumes[i][req.body.current_cv_id][req.body.componentSource] = req.body.content;
                break;
            }
        }
    }
    else {
        const newCvObject = {[req.body.current_cv_id]: {type: req.body.cvType}};
        newCvObject[req.body.current_cv_id][req.body.componentSource] = req.body.content;
        if (!newCvObject[req.body.current_cv_id].hasOwnProperty('createdDate')) {
            newCvObject[req.body.current_cv_id]['createdDate'] = Date.now();
        }
        if (!newCvObject[req.body.current_cv_id].hasOwnProperty('routes')) {
            newCvObject[req.body.current_cv_id]['routes'] = helpers.getRoutes(req.body.cvType);
        }
        req.session.resumes.push(newCvObject);
        if (req.session.resumes.length>10) {
            let newResumes = req.session.resumes.slice(1);
            req.session.resumes = newResumes;
        }
    }
    res.status(200).json(req.session.resumes);
});

app.post('/saveMutlipartData', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.sendStatus(400).json({error: true, message: 'Error uploading file'});
            return;
        }
        const personalObj = Object.assign({}, {...req.body});
        const cv_id = personalObj['current_cv_id'];
        delete personalObj['current_cv_id'];
        personalObj.profilePhoto = req.profilePhoto ? req.profilePhoto : helpers.getProfilePhoto(req, cv_id);
        if (helpers.cvExists(req.session.resumes, cv_id)) {
            for(let i=0;i<req.session.resumes.length;i++) {
                let object = req.session.resumes[i];
                const object_id = Object.keys(object)[0];
                if (object_id==cv_id) {
                    req.session.resumes[i][cv_id]['personal'] = personalObj;
                    break;
                }
            }
        }
        else {
            //build the object
            const newCvObject = {[cv_id]: {type: req.body.cvType}};
            newCvObject[cv_id]['personal'] = personalObj;
            if (!newCvObject[req.body.current_cv_id].hasOwnProperty('createdDate')) {
                newCvObject[req.body.current_cv_id]['createdDate'] = Date.now();
            }
            if (!newCvObject[req.body.current_cv_id].hasOwnProperty('routes')) {
                newCvObject[req.body.current_cv_id]['routes'] = helpers.getRoutes(req.body.cvType);
            }
            req.session.resumes.push(newCvObject);
            if (req.session.resumes.length>10) {
                let newResumes = req.session.resumes.slice(1);
                req.session.resumes = newResumes;
            }
        }
        res.json(req.session.resumes);
    });
});

app.get('/deleteResume/:id', (req, res) => {
    let remainingResumes = req.session.resumes.map(resume => {
        let resumeId = Object.keys(resume)[0];
        if (resumeId==req.params.id) return null;
        return resume;
    });
    remainingResumes = remainingResumes.filter(resume => resume!==null);
    req.session.resumes = remainingResumes;
    return res.redirect('/resumes');
});

app.delete('/deleteResumeRoute/:id/:type/:route', (req, res) => {
    let resume = null;
    for(let i=0;i<req.session.resumes.length;i++) {
        let object = req.session.resumes[i];
        const object_id = Object.keys(object)[0];
        if (object_id==req.params.id) {
            resume = req.session.resumes[i][object_id];
        }
    }
    if(!resume) {
        const newCvObject = {[req.params.id]: {type: req.params.type}};
        newCvObject[req.params.id]['createdDate'] = Date.now();
        newCvObject[req.params.id]['routes'] = helpers.getRoutes(req.params.type);
        let newRoutes = newCvObject[req.params.id].routes.filter(route => route!=req.params.route);
        newCvObject[req.params.id].routes = newRoutes;
        req.session.resumes.push(newCvObject);
        if (req.session.resumes.length>10) {
            let newResumes = req.session.resumes.slice(1);
            req.session.resumes = newResumes;
        }
        return res.status(200).json({'success': true, routes: newRoutes});
    }
    let newRoutes = resume.routes.filter(route => route!=req.params.route);
    resume.routes = newRoutes;
    return res.status(200).json({'success': true, routes: newRoutes});
});

app.get('/resumes', (req, res) => {
    let resumesReversed = [];
    let resumes = req.session.resumes;
    for (let i=resumes.length-1;i>=0;i--) {
        let key = Object.keys(resumes[i])[0];
        let currResume_copy = JSON.parse(JSON.stringify(resumes[i][key]));
        currResume_copy['id'] = key;
        let routes = currResume_copy.routes || [];
        routes.forEach(route => {
            currResume_copy[`route${route}`] = true;
        });
        currResume_copy[`is${(currResume_copy.type[0].toUpperCase() + currResume_copy.type.slice(1).toLowerCase())}`] = true;
        resumesReversed.push(currResume_copy);
    }
    let resumesEmpty = resumesReversed.length===0;
    console.log(resumesReversed);
    fs.readFile(path.join(__dirname, 'views', 'newcv', 'resumes_page.mustache'), (err, data) => {
        if (err) {
            return res.send('<h1>Server is down, try again in couple of minutes</h1>'); 
        }

        const objTemplate = {resumesEmpty: resumesEmpty, resumes: resumesReversed};
        const output = Mustache.render(data.toString(), objTemplate);
        res.setHeader("Content-Type", "text/html");
        res.send(output);
    });
});

app.post('/download', (req, res) => {
    const current_cv_id = req.body.current_cv_id;
    let current_resume = null;
    for(let i=0;i<req.session.resumes.length;i++) {
        let object = req.session.resumes[i];
        const object_id = Object.keys(object)[0];
        if (object_id==current_cv_id) {
            current_resume = object[object_id];
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
    let type = current_resume.type;
    let routes = {};
    let experienceImage = undefined;
    let educationImage = undefined;
    let certImage = undefined;
    if (type==='standard') {
        if (current_resume && current_resume.routes) {
            current_resume.routes.forEach(route => {
                routes[route] = true;
            })
        }
    }
    else if (type==='fancy') {
        let resumeRoutes = current_resume.routes;
        routes['experience'] = (resumeRoutes.indexOf('experience')===-1) ? false : true;
        routes['education'] = (resumeRoutes.indexOf('education')===-1) ? false : true;
        routes['certifications'] = resumeRoutes.indexOf('certifications')===-1 ? false : true;
        routes['skills'] = resumeRoutes.indexOf('skills')===-1 ? false : true;
        routes['socialLinks'] = resumeRoutes.indexOf('socialLinks')===-1 ? false : true;
        routes['portfolio'] = resumeRoutes.indexOf('portfolio')===-1 ? false : true;
        //convert images to base64
        let experiencebase64 = fs.readFileSync(path.join(__dirname, 'dist', 'public', 'briefcase.png'), 'base64');
        experienceImage = `data:image/png;base64, ${experiencebase64}`;
        let educationbase64 = fs.readFileSync(path.join(__dirname, 'dist', 'public', 'education.png'), 'base64');
        educationImage = `data:image/png;base64, ${educationbase64}`;
        let certbase64 = fs.readFileSync(path.join(__dirname, 'dist', 'public', 'certificate.png'), 'base64');
        certImage = `data:image/png;base64, ${certbase64}`;
    }

    fs.readFile(path.join(__dirname, 'views', 'templates', `${type}.mustache`), async(err, data) => {
        if (err) {
            res.status(500).json({error: true});
            return;
        }

        //read the image file
        const imgProfile = current_resume && current_resume.personal ? current_resume.personal.profilePhoto : 'profile.png';
        const dataType = path.extname(imgProfile).slice(1);
        let base64Img = fs.readFileSync(path.join(__dirname, 'dist', 'images', `${imgProfile}`), 'base64');
        let imageProfile = `data:image/${dataType};base64, ${base64Img}`;
        const dataTemplate = {current_resume: current_resume, imageProfile: imageProfile, experienceImage: experienceImage, educationImage: educationImage, certImage: certImage, ...routes};
        const output = Mustache.render(data.toString(), dataTemplate);
        const pdfBuffer = await generatePdf(output);
        res.setHeader("Content-Type", "application/pdf");
        res.status(200).send(pdfBuffer);
    });
});

app.listen(8080, () => {
    console.log('listening on port 8080');
});
