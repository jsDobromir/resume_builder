function domBuild(name, attrs, ...children){
    let dom = document.createElement(name);
    for (let attr of Object.keys(attrs)) {
        dom.setAttribute(attr, attrs[attr]);
    }
    for (let child of children) {
        dom.appendChild(child);
    }
    return dom;
}

function buildMonths(start) {
    return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
}

function buildYear(start) {
    let yearsArray = [];
    for (let currentYear = new Date().getFullYear(); currentYear>=1920;currentYear--) {
        yearsArray.push(currentYear);
    }
    return yearsArray;
}


function getFormRoutes(cvType) {
    if (cvType==='standard') {
        const formRoutes = [
            'personal',
            'experience',
            'education',
            'skills',
            'profile',
            'finalize'
        ];
        return formRoutes;
    }
    else if (cvType==='fancy') {
        return [
            'personal',
            'experience',
            'education',
            'certifications',
            'skills',
            'socialLinks',
            'portfolio',
            'finalize'
        ];
    }
}

function indexExists(experience, index) {
    for(let i=0;i<experience.length;i++) {
        if (experience[i].index==index) return true;
    }

    return false;
}

function filterRouter(route) {
    if (route==='socialLinks') {
        return 'social_links';
    }
    return route;
}


export {domBuild, buildMonths, buildYear, getFormRoutes, indexExists, filterRouter};