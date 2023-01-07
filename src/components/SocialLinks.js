

export default class SocialLinks {

    constructor(stateObj, evEmitterObj, routerObj) {
        this.stateObj = stateObj;
        this.evEmitterObj = evEmitterObj;
        this.routerObj = routerObj;
        this.tittle = 'sociallinks';
        this.multiRouteComp = false;
        this.divIndex = 1;
        this.socialLinks = this.getSocialLinksMap();
    }

    render() {
        const socialLinksArray = this.convertMapToArray();
        const html = `<div class="social_links">

                        <div class="form_wrapper">
                            <form>
                                <div class="row">
                                    <div class="form__group col-12">
                                        <laber class="form__label" for="social_media">Social Media Type:</label>
                                        <div class="radio_buttons">
                                            <div>
                                                <input type="radio" class="form__radio-input" name="social_links" id="linkedin" value="linkedin" required="required"></input>
                                                <label for="linkedin" class="form__radio-label">
                                                    <span class="form__radio-button"></span>
                                                    <i class="fa-brands fa-linkedin"></i> Linkedin
                                                </label>
                                            </div>

                                            <div>
                                                <input type="radio" class="form__radio-input" name="social_links" id="facebook" value="facebook"></input>
                                                <label for="facebook" class="form__radio-label">
                                                    <span class="form__radio-button"></span>
                                                    <i class="fa-brands fa-facebook"></i> Facebook
                                                </label>
                                            </div>

                                            <div>
                                                <input type="radio" class="form__radio-input" name="social_links" id="twitter" value="twitter"></input>
                                                <label for="twitter" class="form__radio-label">
                                                    <span class="form__radio-button"></span>
                                                    <i class="fa-brands fa-twitter"></i> Twitter
                                                </label>
                                            </div>

                                            <div>
                                                <input type="radio" class="form__radio-input" name="social_links" id="instagram" value="instagram"></input>
                                                <label for="instagram" class="form__radio-label">
                                                    <span class="form__radio-button"></span>
                                                    <i class="fa-brands fa-instagram"></i> Instagram
                                                </label>
                                            </div>

                                            <div>
                                                <input type="radio" class="form__radio-input" name="social_links" id="youtube" value="youtube"></input>
                                                <label for="youtube" class="form__radio-label">
                                                    <span class="form__radio-button"></span>
                                                    <i class="fa-brands fa-youtube"></i> Youtube
                                                </label>
                                            </div>

                                            <div>
                                                <input type="radio" class="form__radio-input" name="social_links" id="pinterest" value="pinterest"></input>
                                                <label for="pinterest" class="form__radio-label">
                                                    <span class="form__radio-button"></span>
                                                    <i class="fa-brands fa-pinterest"></i> Pinterest
                                                </label>
                                            </div>

                                            <div>
                                                <input type="radio" class="form__radio-input" name="social_links" id="github" value="github"></input>
                                                <label for="github" class="form__radio-label">
                                                    <span class="form__radio-button"></span>
                                                    <i class="fa-brands fa-github"></i> Github
                                                </label>
                                            </div>

                                            <div>
                                                <input type="radio" class="form__radio-input" name="social_links" id="tiktok" value="tiktok"></input>
                                                <label for="tiktok" class="form__radio-label">
                                                    <span class="form__radio-button"></span>
                                                    <i class="fa-brands fa-tiktok"></i> TikTok
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row linkrow">
                                    <div class="form__group col-6">
                                        <label for="link" class="form__label">Link:</label>
                                        <input type="text" name="social_link" class="form__input" id="social_link" maxlength="120" placeholder="Please provide full link including the http(s) protocol"/>
                                    </div>

                                    <div class="form__group col-6 button_wrapper">
                                        <button type="submit" class="btn btn-form-submit button_abs">Save</button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div class="social_links_list">
                            ${socialLinksArray.map(socLink => {
                                return `<div class="sociallink_div_${socLink.index}">
                                            <div class="link_icon_wrapper"><span class="icon"><i class="fa-brands fa-${socLink.type}"></i></span>
                                            <a href="${socLink.link}" target='_blank'>${socLink.link}</a></div>
                                            <span id="delete_social" data-hover="Delete"><i class="fa-sharp fa-solid fa-trash"></i></span>
                                        </div>`
                            }).join('')}
                        </div>

                    </div>`;
        return html;
    }
    
    reRender() {
        const updatedHtml = this.render();
        document.querySelector(`.formcomp .social_links`).outerHTML = updatedHtml;
    }

    attachEventListeners() {
        let form = document.querySelector('.social_links form');
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            let type = form.querySelector('input[name="social_links"]:checked').value;
            let link = form.querySelector('#social_link').value;
            if (!link.startsWith('http://') && !link.startsWith('https://')) {
                const alert_toast = document.querySelector(`.alert_toast`);
                alert_toast.textContent = `Please provide correct link including http(s) protocol`;
                alert_toast.style.display = 'flex';
                setTimeout(() => {
                    alert_toast.textContent = '';
                    alert_toast.style.display = 'none';
                }, 3000);
                return;
            }
            this.saveSocialLink({link, type, index: this.divIndex});
        });
        document.querySelectorAll(`.formcomp .social_links div[class*="sociallink_div_"]`).forEach(socialLink => {
            socialLink.querySelector('#delete_social').addEventListener('click', (buttonEv) => {
                const classname = socialLink.classList[0];
                const index = parseInt(classname.split('_')[2]);
                this.deleteSocialLink(index);
            });
        });
    }

    saveSocialLink(socialLink) {
        let key = `social_${socialLink.index}`;
        this.socialLinks.set(key, socialLink);
        this.divIndex++;
        this.stateObj.update(this.tittle, this.convertMapToArray()).then(() => {
            const lastSocialLink = this.socialLinks.get(key);
            this.evEmitterObj.emit('socialLink', {lastSocialLink});
            this.reRender();
            this.attachEventListeners();
        });
    }

    deleteSocialLink(index) {
        let key = `social_${index}`;
        this.socialLinks.delete(key);
        this.stateObj.update(this.tittle, this.convertMapToArray()).then(() => {
            this.evEmitterObj.emit('delete_social', {div: `social_link_${index}`});
            document.querySelector(`.formcomp .social_links .sociallink_div_${index}`).remove();
            this.reRender();
            this.attachEventListeners();
        });
    }

    getSocialLinksMap() {
        const list = this.stateObj.getComponentArray(this.tittle);
        const map = new Map();
        let lastIndex = list.length ? list[list.length-1].index : undefined;
        list.forEach(socialLink => {
            let key = `social_${socialLink.index}`;
            map.set(key, socialLink);
        });
        this.divIndex = lastIndex ? (lastIndex+1) : this.divIndex;
        return map;
    }

    convertMapToArray() {
        const socialLinksArray = Array.from(this.socialLinks.values()).map(socialLink => {
            return socialLink;
        })
        return socialLinksArray;
    }
}