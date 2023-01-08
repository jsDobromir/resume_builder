export default class ProfileView {

    constructor(state, evEmitter, routerObj) {
        this.state = state;
        this.evEmitter = evEmitter;
        this.routerObj = routerObj;
        this.title = 'profile';
        this.multiRouteComp = false;
    }

    render() {
        let profile = this.state.getComponentObject(this.title);
        const html = `<div class="profile standard">
                    <form>
                        <div class="form__group">
                            <label class="form__label" for="description">Describe yourself shortly</label>
                            <textarea class="form-control" rows="10" name="profile_desc" id="profile_desc">${profile && profile['profile_desc'] ? profile['profile_desc'] : ''}</textarea>
                        </div>
                        <div class="buttons">
                                    <button type="submit" class="btn btn-next" id="btnSave">Submit</button>
                                </div>
                    </form>
                        </div>`;

        return html;
    }

    attachEventListeners() {
        document.querySelector('.profile.standard form').addEventListener('submit', (form) => {
            form.preventDefault();
            const textareaValue = (document.querySelector('.profile.standard form #profile_desc').value).trim();
            if (textareaValue) {
                this.state.update(this.title, {profile_desc: textareaValue}).then(() => {
                    this.routerObj.dispatchNextRouter();
                });
            }
        });

        document.querySelector('.profile.standard #profile_desc').addEventListener('keyup', (keyEvent) => {
            this.evEmitter.emit('profile_desc', {input_value: keyEvent.target.value});
        });
    }
}