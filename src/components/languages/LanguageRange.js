
export default class LanguageRange {

    constructor(state, evEmitter, routerObj) {
        this.state = state;
        this.evEmitter = evEmitter;
        this.routerObj = routerObj;
        this.tittle = 'languages';
        this.type = 'range';
        this.multiRouteComp = false;
        this.divIndex = 1;
        this.languages = this.getLanguagesMap();
    }

    render() {
        const languagesArray = this.convertMapToArray();
        const html = `<div class="languages-range">

                        <div class="form_add_language">
                            <form>
                                    <div class="language_div form__group">
                                        <label class="form__label" for="language">Language</label>
                                        <input type="text" class="form__input" id="language" name="language" required maxlength="40"/>
                                    </div>
                                    <div class="input_div form__group">
                                        <label class="form__label">Level Competency</label>
                                        <input type="range" class="slider" id="languageRange" value="50" max="100"/>
                                    </div>
                                
                                <div class="buttons">
                                    <button type="submit" class="btn btn-next" id="btnSave">Save</button>
                                </div>
                            </form>
                        </div>

                        <div class="languages_wrapper">
                            ${languagesArray.map(language => {
                                return `<div class="language_div_${language.index}">
                                            <div class="language">
                                                <span>${language.language}</span>
                                                <span id="delete_language" data-hover="Delete"><i class="fa-sharp fa-solid fa-trash"></i></span>
                                            </div>
                                            <div class="range_wrapper">
                                                <div class="language_range" style="width: ${language.rangeValue}%;"></div>
                                            </div>
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
        const formAddLanguage = document.querySelector('.form_add_language');

        formAddLanguage.querySelector('form').addEventListener('submit', (formEvent) => {
            formEvent.preventDefault();
            const language =formAddLanguage.querySelector('#language').value;
            const rangeValue = formAddLanguage.querySelector('#languageRange').value;
            this.saveLanguage({language, rangeValue, index: this.divIndex});
        });

        document.querySelectorAll(`.formcomp .${this.tittle}-${this.type} div[class*="language_div_"]`).forEach(languageDiv => {
            languageDiv.querySelector('#delete_language').addEventListener('click', (buttonEv) => {
                const classname = languageDiv.classList[0];
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
            document.querySelector(`.formcomp .${this.tittle}-${this.type} .language_div_${index}`).remove();
            this.reRender();
            this.attachEventListeners();
        });
    }

    saveLanguage(language) {
        let key = `language_${language.index}`;
        this.languages.set(key, language);
        this.divIndex++;
        this.state.update(this.tittle, this.convertMapToArray()).then(() => {
            const lastLanguage = this.languages.get(key);
            this.evEmitter.emit('language', {lastLanguage});
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
        const languagesArray = Array.from(this.languages.values()).map(language => {
            return language;
        })
        return languagesArray;
    }
}