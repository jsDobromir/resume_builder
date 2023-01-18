
function buildGenHTML(type, genObj) {
    switch(type) {
        case 'experience':
            return `<div class="form__group col-12">
                        <label class="form__label" for="position">Position</label>
                        <input type="text" class="form__input" id="position" name="position" required maxlength="40" value="${genObj ? genObj.serialize().position : ''}"/>
                    </div>
                    <div class="col-12">
                        <div class="row">
                            <div class="form__group col-6">
                                <label class="form__label" for="company">Company</label>
                                <input type="text" class="form__input" id="company" name="company" required maxlength="40" value="${genObj ? genObj.serialize().company : ''}"/>
                            </div>
                            <div class="form__group col-6">
                                <label class="form__label" for="company">Company Address</label>
                                <input type="text" class="form__input" id="company_address" name="companyaddress" maxlength="80" value="${(genObj && genObj.serialize()['companyaddress']) ? genObj.serialize()['companyaddress'] : ''}"/>
                            </div>
                        </div>
                    </div>`;
        case 'education':
            return `<div class="form__group col-12">
                        <label class="form__label" for="degree">Degree</label>
                        <input type="text" class="form__input" id="degree" name="degree" required maxlength="40" value="${genObj ? genObj.serialize().degree : ''}"/>
                    </div>
                    <div class="col-12">
                        <div class="row">
                            <div class="form__group col-6">
                                <label class="form__label" for="school">School</label>
                                <input type="text" class="form__input" id="school" name="school" required maxlength="40" value="${genObj ? genObj.serialize().school : ''}"/>
                            </div>
                            <div class="form__group col-6">
                                <label class="form__label" for="school">School Address</label>
                                <input type="text" class="form__input" id="school_address" name="schooladdress" maxlength="80" value="${(genObj && genObj.serialize()['schooladdress']) ? genObj.serialize()['schooladdress'] : ''}"/>
                            </div>
                        </div>
                    </div>`;
        default:
            return '';
    }
}

export {buildGenHTML};