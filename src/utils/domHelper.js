function domBuild(name, attrs, ...children) {
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
    for (let currentYear = new Date().getFullYear(); currentYear >= 1920; currentYear--) {
        yearsArray.push(currentYear);
    }
    return yearsArray;
}


function getFormRoutes(cvType) {
    if (cvType === 'standard') {
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
    else if (cvType === 'fancy') {
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
    for (let i = 0; i < experience.length; i++) {
        if (experience[i].index == index) return true;
    }

    return false;
}

function filterRouter(route) {
    if (route === 'socialLinks') {
        return 'social_links';
    }
    return route;
}

function buildExperience(experience) {
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
        let exp_address_wrapper = document.createElement('div');
        exp_address_wrapper.setAttribute("class", "experience_address_wrapper");
        let spanCompany = document.createElement('span');
        spanCompany.setAttribute("class", "company");
        spanCompany.textContent = experience[i].company;
        let spanCompanyAddress = document.createElement('span');
        spanCompanyAddress.setAttribute("class", "company_address");
        spanCompanyAddress.textContent = experience[i]['companyaddress'];
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
        exp_address_wrapper.appendChild(spanCompany);
        exp_address_wrapper.appendChild(spanCompanyAddress);
        divCompanyWrapper.appendChild(exp_address_wrapper);
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

function buildEducation(education) {
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
        let edu_address_wrapper = document.createElement('div');
        edu_address_wrapper.setAttribute("class", "education_address_wrapper");
        let spanSchool = document.createElement('span');
        spanSchool.setAttribute("class", "school");
        spanSchool.textContent = education[i].school;
        let spanSchoolAddress = document.createElement('span');
        spanSchoolAddress.setAttribute("class", "school_address");
        spanSchoolAddress.textContent = education[i]['schooladdress'];
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
        edu_address_wrapper.appendChild(spanSchool);
        edu_address_wrapper.appendChild(spanSchoolAddress);
        divCompanyWrapper.appendChild(edu_address_wrapper);
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

export { domBuild, buildMonths, buildYear, getFormRoutes, indexExists, filterRouter, buildExperience, buildEducation };