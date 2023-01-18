

export default class SkillsList {

    constructor(state, evEmitter, routerObj) {
        this.state = state;
        this.evEmitter = evEmitter;
        this.routerObj = routerObj;
        this.tittle = 'skills';
        this.type =  'list';
        this.multiRouteComp = false;
        this.divIndex = 1;
        this.skills = this.getSkillsMap();
    }

    reRender() {
        const updatedHtml = this.render();
        document.querySelector(`.formcomp .${this.tittle}-${this.type}`).outerHTML = updatedHtml;
    }

    render() {
        const skillsArray = this.convertMapToArray();
        const html = `<div class="skills-list">
                        <div class="form_add_skill">
                            <form>
                                <div class="skill_div form__group">
                                    <label class="form__label" for="skill">Skill</label>
                                    <input type="text" class="form__input" id="skill" name="skill" required maxlength="40"/>
                                </div>
                                
                                <div class="buttons">
                                    <button type="submit" class="btn btn-next" id="btnSave">Save</button>
                                </div>
                            </form>
                        </div>

                        <ul class="skills_list_wrapper">
                            ${skillsArray.map(skill => {
                                return `<li class="skill__li__${skill.index}">
                                            <span class="skill__content">${skill.skill}</span>
                                            <span id="delete_skill" data-hover="Delete"><i class="fa-sharp fa-solid fa-trash"></i></span>
                                        </li>`
                            }).join('')}
                        </ul>

                      </div>`;
        return html;
    }

    attachEventListeners() {
        const formAddSkill = document.querySelector('.form_add_skill');

        formAddSkill.querySelector('form').addEventListener('submit', (formEvent) => {
            formEvent.preventDefault();
            const skill =formAddSkill.querySelector('#skill').value;
            this.saveSkill({skill, index: this.divIndex});
        });

        document.querySelectorAll(`.formcomp .${this.tittle}-${this.type} li[class*="skill__li__"]`).forEach(skillDiv => {
            skillDiv.querySelector('#delete_skill').addEventListener('click', (buttonEv) => {
                const classname = skillDiv.classList[0];
                const index = parseInt(classname.split('__')[2]);
                this.deleteSkill(index);
            });
        });
    }

    deleteSkill(index) {
        let key = `skill_${index}`;
        this.skills.delete(key);
        this.state.update(this.tittle, this.convertMapToArray()).then(() => {
            this.evEmitter.emit('delete_skill', {li: `skill_li_${index}`});
            document.querySelector(`.formcomp .${this.tittle}-${this.type} .skill__li__${index}`).remove();
            this.reRender();
            this.attachEventListeners();
        });
    }

    saveSkill(skill) {
        let key = `skill_${skill.index}`;
        this.skills.set(key, skill);
        this.divIndex++;
        this.state.update(this.tittle, this.convertMapToArray()).then(() => {
            const lastSkill = this.skills.get(key);
            this.evEmitter.emit('skill', {lastSkill});
            this.reRender();
            this.attachEventListeners();
        });
    }

    getSkillsMap() {
        const list = this.state.getComponentArray(this.tittle);
        const map = new Map();
        let lastIndex = list.length ? list[list.length-1].index : undefined;
        list.forEach(skill => {
            let key = `skill_${skill.index}`;
            map.set(key, skill);
        });
        this.divIndex = lastIndex ? (lastIndex+1) : this.divIndex;
        return map;
    }

    convertMapToArray() {
        const skillsArray = Array.from(this.skills.values()).map(skill => {
            return skill;
        })
        return skillsArray;
    }
}