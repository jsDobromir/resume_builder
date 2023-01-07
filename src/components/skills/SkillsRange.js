
export default class SkillsRange {

    constructor(state, evEmitter, routerObj) {
        this.state = state;
        this.evEmitter = evEmitter;
        this.routerObj = routerObj;
        this.tittle = 'skills';
        this.type =  'range';
        this.multiRouteComp = false;
        this.divIndex = 1;
        this.skills = this.getSkillsMap();
    }

    render() {
        const skillsArray = this.convertMapToArray();
        const html = `<div class="skills-range">
                        <div class="skills_wrapper">
                            ${skillsArray.map(skill => {
                                return `<div class="skill_div_${skill.index}">
                                            <div class="skill">
                                                <span>${skill.skill}</span>
                                                <span id="delete_skill" data-hover="Delete"><i class="fa-sharp fa-solid fa-trash"></i></span>
                                            </div>
                                            <div class="range_wrapper">
                                                <div class="skill_range" style="width: ${skill.rangeValue}%;"></div>
                                            </div>
                                        </div>`
                            }).join('')}
                        </div>
    
                        <div class="button_wrapper">
                            <span class="add_skill">+ Add ${(skillsArray.length) ? 'one more ' : ''}skill</span>
                        </div>

                        <div class="form_add_skill d-none">
                            <form>
                                    <div class="skill_div form__group">
                                        <label class="form__label" for="skill">Skill</label>
                                        <input type="text" class="form__input" id="skill" name="skill" required maxlength="40"/>
                                    </div>
                                    <div class="input_div form__group">
                                        <label class="form__label">Level Competency</label>
                                        <input type="range" class="slider" id="skillRange" value="100" max="100"/>
                                    </div>
                                
                                <div class="buttons">
                                    <button type="button" class="btn btn_cancel btn-back" id="cancelBtn">Cancel</button>
                                    <button type="submit" class="btn btn-next" id="btnSave">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>`;
        return html;
    }

    reRender() {
        const updatedHtml = this.render();
        document.querySelector(`.formcomp .${this.tittle}-${this.type}`).outerHTML = updatedHtml;
    }

    attachEventListeners() {
        const formAddSkill = document.querySelector('.form_add_skill');
        document.querySelector(`.${this.tittle}-${this.type} .add_skill`).addEventListener('click', (event) => {
            const addSkillButton = event.currentTarget;
            if (formAddSkill.classList.contains('d-none')) {
                addSkillButton.textContent = `- Cancel`;
                formAddSkill.classList.remove('d-none');
            }
            else {
                const skillsArray = this.convertMapToArray();
                addSkillButton.textContent = `+ Add ${(skillsArray.length) ? 'one more ' : ''}skill`;
                formAddSkill.classList.add('d-none');
            }
        });

        formAddSkill.querySelector('form').addEventListener('submit', (formEvent) => {
            formEvent.preventDefault();
            const skill =formAddSkill.querySelector('#skill').value;
            const rangeValue = formAddSkill.querySelector('#skillRange').value;
            this.saveSkill({skill, rangeValue, index: this.divIndex});
        });

        document.querySelectorAll(`.formcomp .${this.tittle}-${this.type} div[class*="skill_div_"]`).forEach(skillDiv => {
            skillDiv.querySelector('#delete_skill').addEventListener('click', (buttonEv) => {
                const classname = skillDiv.classList[0];
                const index = parseInt(classname.split('_')[2]);
                this.deleteSkill(index);
            });
        });

        document.querySelector(`.${this.tittle}-${this.type} #cancelBtn`).addEventListener('click', (event) => {
            const skillsArray = this.convertMapToArray();
            document.querySelector('.add_skill').textContent = `+ Add ${(skillsArray.length) ? 'one more ' : ''}skill`;
            formAddSkill.classList.add('d-none');
        });
    }

    deleteSkill(index) {
        let key = `skill_${index}`;
        this.skills.delete(key);
        this.state.update(this.tittle, this.convertMapToArray()).then(() => {
            this.evEmitter.emit('delete_skill', {div: `skill_div_${index}`});
            document.querySelector(`.formcomp .${this.tittle}-${this.type} .skill_div_${index}`).remove();
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