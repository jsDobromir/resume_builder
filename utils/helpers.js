

module.exports = {
    getProfilePhoto: function(req, cv_id) {
        for(let i=0;i<req.session.resumes.length;i++) {
            let object = req.session.resumes[i];
            const object_id = Object.keys(object)[0];
            if (object_id==cv_id) {
                const personal = req.session.resumes[i][cv_id]['personal'];
                return personal ? personal.profilePhoto : 'profile.png';
            }
        }

        return 'profile.png';
    },

    cvExists: function(resumesArray, cv_id) {
        for(let i=0;i<resumesArray.length;i++) {
            let object = resumesArray[i];
            const object_id = Object.keys(object)[0];
            if (object_id==cv_id) return true;
        }
        return false;
    },

    getRoutes: function(cvType) {
        if (cvType==='standard') {
            const formRoutes = [
                'personal',
                'experience',
                'education',
                'skills',
                'languages',
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
    },
    buildMonths: function () {
        return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    },
    
    buildYear: function () {
        let yearsArray = [];
        for (let currentYear = new Date().getFullYear(); currentYear>=1920;currentYear--) {
            yearsArray.push(currentYear);
        }
        return yearsArray;
    }
};