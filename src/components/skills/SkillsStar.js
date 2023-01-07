export default class SkillsStar {

    constructor(state, evEmitter, routerObj) {
        this.state = state;
        this.evEmitter = evEmitter;
        this.routerObj = routerObj;
        this.tittle = 'skills';
        this.type =  'star';
        this.multiRouteComp = false;
        this.divIndex = 1;
        this.skills = this.getSkillsMap();
    }

    render() {
        const skillsArray = this.convertMapToArray();
        const html = `<div class="skills-star">
                        <div class="skills_wrapper">
                            ${skillsArray.map(skill => {
                                return `<div class="skill_div_${skill.index}">
                                                    <span class="skill_name">${skill.skill}</span> 
                                                    <span class="rating star_${skill.starValue}">
                                                        <span class="star1"></span>
                                                        <span class="star2"></span>
                                                        <span class="star3"></span>
                                                        <span class="star4"></span>
                                                        <span class="star5"></span>
                                                    </span>
                                                <span id="delete_skill" data-hover="Delete"><i class="fa-sharp fa-solid fa-trash"></i></span>
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
                                        <fieldset class="rating">
                                        <input type="radio" id="rating-5" name="rating" value="5" /><label for="rating-5"></label>
                                        <input type="radio" id="rating-4" name="rating" value="4" /><label for="rating-4"></label>
                                        <input type="radio" id="rating-3" name="rating" value="3" checked="checked"/><label for="rating-3"></label>
                                        <input type="radio" id="rating-2" name="rating" value="2" /><label for="rating-2"></label>
                                        <input type="radio" id="rating-1" name="rating" value="1" /><label for="rating-1"></label>                                 
                                        </fieldset>
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
            const starValue = formAddSkill.querySelector('input[name="rating"]:checked').value;
            this.saveSkill({skill, starValue, index: this.divIndex});
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
            this.evEmitter.emit('delete_skill', {div: `skill_rating${index}`});
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