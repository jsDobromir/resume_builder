import { domBuild } from "../../utils/domHelper";

export default class LanguageStar {

    constructor(state, evEmitter, routerObj) {
        this.state = state;
        this.evEmitter = evEmitter;
        this.routerObj = routerObj;
        this.tittle = 'languages';
        this.type =  'star';
        this.multiRouteComp = false;
        this.divIndex = 1;
        this.languages = this.getLanguagesMap();
    }

    render() {
        const languagesArray = this.convertMapToArray();
        const html = `<div class="languages-star">

                        <div class="form_add_language">
                            <form>
                                    <div class="language_div form__group">
                                        <label class="form__label" for="language">Language</label>
                                        <input type="text" class="form__input" id="language" name="language" required maxlength="40"/>
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
                                    <button type="submit" class="btn btn-next" id="btnSave">Save</button>
                                </div>
                            </form>
                        </div>

                        <div class="languages_wrapper">
                            ${languagesArray.map(language => {
                                return `<div class="language_div_${language.index}">
                                                    <span class="language_name">${language.language}</span> 
                                                    <span class="rating star_${language.starValue}">
                                                        <span class="star1"></span>
                                                        <span class="star2"></span>
                                                        <span class="star3"></span>
                                                        <span class="star4"></span>
                                                        <span class="star5"></span>
                                                    </span>
                                                <span id="delete_language" data-hover="Delete"><i class="fa-sharp fa-solid fa-trash"></i></span>
                                        </div>`
                            }).join('')}
                        </div>

                    </div>`;
        return html;
    }

    reRender() {
        const updatedHtml = this.render();
        document.querySelector(`.formcomp .${this.tittle}-${this.type}`).outerHTML = updatedHtml;
    }

    attachEventListeners() {
        const formAddSkill = document.querySelector('.form_add_language');
        
        formAddSkill.querySelector('form').addEventListener('submit', (formEvent) => {
            formEvent.preventDefault();
            const language =formAddSkill.querySelector('#language').value;
            const starValue = formAddSkill.querySelector('input[name="rating"]:checked').value;
            this.saveLanguage({language, starValue, index: this.divIndex});
        });

        document.querySelectorAll(`.formcomp .${this.tittle}-${this.type} div[class*="language_div_"]`).forEach(langDiv => {
            langDiv.querySelector('#delete_language').addEventListener('click', (buttonEv) => {
                const classname = langDiv.classList[0];
                const index = parseInt(classname.split('_')[2]);
                this.deleteLanguage(index);
            });
        });
    }

    deleteLanguage(index) {
        let key = `language_${index}`;
        this.languages.delete(key);
        this.state.update(this.tittle, this.convertMapToArray()).then(() => {
            this.evEmitter.emit('delete_language', {div: `language_div_${index}`});
            document.querySelector(`.formcomp .${this.tittle}-${this.type} .languages_wrapper .language_div_${index}`).remove();
            this.reRender();
            this.attachEventListeners();
        });
    }

    saveLanguage(language) {
        let key = `language_${language.index}`;
        this.languages.set(key, language);
        this.divIndex++;
        this.state.update(this.tittle, this.convertMapToArray()).then(() => {
            const lastLang = this.languages.get(key);
            this.evEmitter.emit('language', {lastLang});
            this.reRender();
            this.attachEventListeners();
        });
    }

    getLanguagesMap() {
        const list = this.state.getComponentArray(this.tittle);
        const map = new Map();
        let lastIndex = list.length ? list[list.length-1].index : undefined;
        list.forEach(language => {
            let key = `language_${language.index}`;
            map.set(key, language);
        });
        this.divIndex = lastIndex ? (lastIndex+1) : this.divIndex;
        return map;
    }

    convertMapToArray() {
        const languagesArray = Array.from(this.languages.values()).map(lang => {
            return lang;
        })
        return languagesArray;
    }
};