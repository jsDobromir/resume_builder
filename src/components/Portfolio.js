export default class Portfolio {

    constructor(state, evEmitter, router) {
        this.state = state;
        this.evEmitter = evEmitter;
        this.router = router;
        this.tittle = 'portfolio';
        this.multiRouteComp = false;
        this.divIndex = 1;
        this.portfolioLinks = this.getPortfolioListMap();
    }

    render() {
        const portfolioLinksArray = this.convertMapToArray();
        const html = `<div class="portfolio">
                        <div class="form_wrapper">
                            <form>
                                <div class="row">
                                    <div class="form__group col-6">
                                        <label class="form__label" for="portfolio">Description (optional)</label>
                                        <input type="text" name="portfolio" class="form__input" id="portfolio" maxlength="150"/>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="form__group col-6">
                                        <label for="portfolio_link" class="form__label">Link:</label>
                                        <input type="text" name="portfolio_link" required class="form__input" id="portfolio_link" maxlength="120" placeholder="Please provide full link including the http(s) protocol"/>
                                    </div>

                                    <div class="form__group col-6 button_wrapper">
                                        <button type="submit" class="btn btn-form-submit button_abs">Save</button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div class="portfolio_links_list">
                            ${portfolioLinksArray.map(portLink => {
                                return `<div class="portfoliolink_div_${portLink.index}">
                                            <div class="portfolio_wrapper">
                                                ${portLink['portfolio_desc'] ? `<span class="portfolio_desc">${portLink['portfolio_desc']}</span>` : ''}
                                                <a href="${portLink.link}" target='_blank'>${portLink.link}</a>
                                            </div>
                                            <span id="delete_portfolio" data-hover="Delete"><i class="fa-sharp fa-solid fa-trash"></i></span>
                                        </div>`
                            }).join('')}
                        </div>
                    </div>`;
        return html;
    }


    reRender() {
        const updatedHtml = this.render();
        document.querySelector(`.formcomp .portfolio`).outerHTML = updatedHtml;
    }

    attachEventListeners() {
        let form = document.querySelector('.formcomp .portfolio form');
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            let portfolio_desc = form.querySelector('#portfolio').value;
            let link = form.querySelector('#portfolio_link').value;
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
            portfolio_desc = portfolio_desc ? (portfolio_desc + ':') : portfolio_desc;
            this.savePortfolioLink({link, portfolio_desc, index: this.divIndex});
        });
        document.querySelectorAll(`.formcomp .portfolio_links_list div[class*="portfoliolink_div_"]`).forEach(portfolioLink => {
            portfolioLink.querySelector('#delete_portfolio').addEventListener('click', (buttonEv) => {
                const classname = portfolioLink.classList[0];
                const index = parseInt(classname.split('_')[2]);
                this.deletePortfolioLink(index);
            });
        });
    }

    savePortfolioLink(portfolioLink) {
        let key = `portfolio_${portfolioLink.index}`;
        this.portfolioLinks.set(key, portfolioLink);
        this.divIndex++;
        this.state.update(this.tittle, this.convertMapToArray()).then(() => {
            const lastPortfolioLink = this.portfolioLinks.get(key);
            this.evEmitter.emit('portfolioLink', {lastPortfolioLink});
            this.reRender();
            this.attachEventListeners();
        });
    }

    deletePortfolioLink(index) {
        let key = `portfolio_${index}`;
        this.portfolioLinks.delete(key);
        this.state.update(this.tittle, this.convertMapToArray()).then(() => {
            this.evEmitter.emit('delete_portfolio', {div: `portfolio_link_${index}`});
            document.querySelector(`.formcomp .portfolio_links_list .portfoliolink_div_${index}`).remove();
            this.reRender();
            this.attachEventListeners();
        });
    }

    getPortfolioListMap() {
        const list = this.state.getComponentArray(this.tittle);
        const map = new Map();
        let lastIndex = list.length ? list[list.length-1].index : undefined;
        list.forEach(portfolio => {
            let key = `portfolio_${portfolio.index}`;
            map.set(key, portfolio);
        });
        this.divIndex = lastIndex ? (lastIndex+1) : this.divIndex;
        return map;
    }

    convertMapToArray() {
        const portfolioLinksArray = Array.from(this.portfolioLinks.values()).map(portfolioLink => {
            return portfolioLink;
        })
        return portfolioLinksArray;
    }
}