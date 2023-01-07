import {v4 as uuidv4} from "uuid";

export default class State {

    constructor(cvType, resumes) {
        this.resumes = JSON.parse(resumes);
        this.currentCvId = null;
        this.cvType = cvType;
    }

    updateView(id, nextView, params) {
        this.renderView(id, nextView, params);
    }

    renderView(id, view, params) {
        let prevRoute = document.querySelector('.wrapper').dataset.activeRoute;
        let viewInstance = this.componentsMap[view];
        let cvCompInstance = this.componentsMap['cvCompInstance'];
        const formCompHtml = viewInstance.render(params);
        document.querySelector('.wrapper').dataset.activeRoute = view;
        document.querySelector('.wrapper .formcomp').innerHTML = formCompHtml;
        viewInstance.attachEventListeners();
        cvCompInstance.setComponentAfterReroute(prevRoute);
        let trackbarInstance = this.componentsMap['trackbar'];
        trackbarInstance.setActiveRoute();
        let buttonsNavInstance = this.componentsMap['buttonsnav'];
        buttonsNavInstance.setActiveRoute();
    }

    getViewRoute(view) {
        let viewInstance = this.componentsMap[view];
        if (viewInstance.multiRouteComp) {
            let path = viewInstance.checkRouteExtension();
            if (path) {
                return path;
            }
        }
        return '';
    }

    static initState(cvType, resumes) {
        return new State(cvType, resumes);
    }

    buildComponentsMap(componentsMap) {
        this.componentsMap = componentsMap;
    }

    update(componentSource, content) {
        return new Promise(async (resolve, reject) => {
            const current_cv_id = document.querySelector('.wrapper').dataset.cvId;
            const resumesResponse = await this.sendDataToServer({current_cv_id: current_cv_id, componentSource: componentSource, content: content, cvType: this.cvType});
            return resolve();
        });
    }

    updateMultipartFormData(formData) {
        return new Promise((resolve, reject) => {
            fetch('/saveMutlipartData', {
                method: 'POST',
                body: formData,
                enctype: 'multipart/form-data',
                cache: 'reload'
            }).then(response => response.json())
            .then(data => {
                this.resumes = data;
                return resolve();
            })
            .catch(err => {
                return reject();
            })
        });
    }

    sendDataToServer(obj) {
        return new Promise((resolve, reject) => {
            fetch('/saveData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            }).then(response => response.json())
            .then(data => {
                this.resumes = data;
                return resolve();
            });
        });
    }

    getComponentArray(componentSource) {
        const current_cv_id = document.querySelector('.wrapper').dataset.cvId;
        let list = [];
        for(let i=0;i<this.resumes.length;i++) {
            const objKey = Object.keys(this.resumes[i])[0];
            if (current_cv_id==objKey) {
                list = (this.resumes[i][objKey][componentSource] || []);
                break;
            }
        }
        return list;
    }

    getComponentObject(componentSource) {
        const current_cv_id = document.querySelector('.wrapper').dataset.cvId;
        let obj = null;
        for(let i=0;i<this.resumes.length;i++) {
            const objKey = Object.keys(this.resumes[i])[0];
            if (current_cv_id==objKey) {
                obj = this.resumes[i][objKey][componentSource];
                break;
            }
        }
        return obj;
    }
}