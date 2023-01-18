


export default function (cvType, data) {
    if (cvType === 'standard') {
        return `<div class="personal">

                    <form enctype="multipart/form-data" class="form">

                        <div class="form__group">
                            <label class="form__label" for="firstName">First Name</label>
                            <input type="text" class="form__input" id="firstName" name="firstName" required maxlength="40" value="${data ? data['firstName'] : ''}"/>
                        </div>

                        <div class="form__group">
                            <label class="form__label" for="lastName">Last Name</label>
                            <input type="text" class="form__input" id="lastName" name="lastName" required maxlength="40" value="${data ? data['lastName'] : ''}"/>
                        </div>
                        
                        <div class="form__group">
                                <label class="form__label form__label__file"> Profile Photo
                                    <input type="file" class="form__input" id="profilePhoto" name="profilePhoto">
                                    <span class="btn btn_upload">Upload photo</span>
                                </label>
                        </div>
                        
                        <div class="form__group">
                            <label class="form__label" for="address">Address</label>
                            <input type="text" class="form__input" id="address" name="address" maxlength="40" value="${(data && data['address'])? data['address'] : ''}"/>
                        </div>

                        <div class="form__group">
                            <label class="form__label" for="city">City</label>
                            <input type="text" class="form__input" id="city" name="city" maxlength="40" value="${(data && data['city'])? data['city'] : ''}"/>
                        </div>
                                
                        <div class="form__group">
                            <label class="form__label" for="phone">Phone</label>
                            <input type="text" class="form__input" id="phone" name="phone" pattern="^[+0-9-]*$" maxlength="40" value="${(data && data['phone'])? data['phone'] : ''}"/>
                            
                        </div>
                        
                        <div class="form__group">
                            <label class="form__label" for="email">Email</label>
                            <input type="email" class="form__input" id="email" name="email" maxlength="50" value="${(data && data['email'])? data['email'] : ''}"/>
                                    
                        </div>

                        <div class="btn-group">
                            <button type="submit" class="btn btn_submit">Submit</button>
                        </div>
                    </form>

                </div>`;
    }
    else if (cvType === 'fancy') {
        return `<div class="personal">
                    <form enctype="multipart/form-data" class="form">
                                        
                    <div class="row">
                        <div class="col-6">
                            <div class="form__group">
                                <label class="form__label" for="firstName">First Name</label>
                                <input type="text" class="form__input" id="firstName" name="firstName" required maxlength="50" value="${data ? data['firstName'] : ''}"/>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form__group ml">
                                <label class="form__label" for="lastName">Last Name</label>
                                <input type="text" class="form__input" id="lastName" name="lastName" required maxlength="50" value="${data ? data['lastName'] : ''}"/>
                            </div>
                        </div>
                    </div>

                    <div class="form__group">
                        <label class="form__label" for="position">Position</label>
                        <input type="text" class="form__input" id="position" name="position" maxlength="50" value="${(data && data['position']) ? data['position'] : ''}"/>
                    </div>
                    
                    <div class="form__group">
                            <label class="form__label form__label__file"> Profile Photo
                                <input type="file" class="form__input" id="profilePhoto" name="profilePhoto">
                                <span class="btn btn_upload">Upload photo</span>
                            </label>
                    </div>

                    <div class="form__group">
                        <label class="form__label" for="address">Address</label>
                        <input type="text" class="form__input" id="address" name="address" maxlength="100" value="${(data && data['address']) ? data['address'] : ''}"/>
                    </div>

                    <div class="row">
                        <div class="col-6">
                            <div class="form__group">
                                <label class="form__label" for="city">City</label>
                                <input type="text" class="form__input" id="city" name="city" maxlength="50" value="${(data && data['city']) ? data['city'] : ''}"/>
                            </div>
                        </div>

                        <div class="col-6 ml">
                            <div class="form__group">
                                <label class="form__label" for="country">Country</label>
                                <input type="text" class="form__input" id="country" name="country" maxlength="50" value="${(data && data['country']) ? data['country'] : ''}"/>
                            </div>
                        </div>
                    </div>
                            
                    <div class="form__group">
                        <label class="form__label" for="phone">Phone</label>
                        <input type="text" class="form__input" id="phone" name="phone" pattern="^[+0-9-]*$" maxlength="40" value="${(data && data['phone']) ? data['phone'] : ''}"/>
                        
                    </div>
                    
                    <div class="form__group">
                        <label class="form__label" for="email">Email</label>
                        <input type="email" class="form__input" id="email" name="email" maxlength="50" value="${(data && data['email'])? data['email'] : ''}"/>
                                
                    </div>

                    <div class="btn-group">
                        <button type="submit" class="btn btn_submit">Submit</button>
                    </div>
                </form>
                </div>`;
    }else if (cvType === 'custom') {
        return `<div class="personal">
                    <form enctype="multipart/form-data" class="form">
                                        
                    <div class="form__group">
                                <label class="form__label" for="firstName">First Name</label>
                                <input type="text" class="form__input" id="firstName" name="firstName" required maxlength="50" value="${data ? data['firstName'] : ''}"/>
                    </div>

                    <div class="form__group">
                                <label class="form__label" for="lastName">Last Name</label>
                                <input type="text" class="form__input" id="lastName" name="lastName" required maxlength="80" value="${data ? data['firstName'] : ''}"/>
                            </div>

                    <div class="form__group">
                                <label class="form__label" for="position">Position</label>
                                <input type="text" class="form__input" id="position" name="position" maxlength="50" value="${data ? data['position'] : ''}"/>
                    
                    </div>

                    <div class="form__group">
                        <label class="form__label" for="address">Address</label>
                        <input type="text" class="form__input" id="address" name="address" maxlength="100" value="${data ? data['address'] : ''}"/>
                    </div>

                    <div class="row">
                        <div class="col-6">
                            <div class="form__group">
                                <label class="form__label" for="city">City</label>
                                <input type="text" class="form__input" id="city" name="city" maxlength="50" value="${data ? data['city'] : ''}"/>
                            </div>
                        </div>

                        <div class="col-6 ml">
                            <div class="form__group">
                                <label class="form__label" for="country">Country</label>
                                <input type="text" class="form__input" id="country" name="country" maxlength="50" value="${data ? data['country'] : ''}"/>
                            </div>
                        </div>
                    </div>
                            
                    <div class="form__group">
                        <label class="form__label" for="phone">Phone</label>
                        <input type="text" class="form__input" id="phone" name="phone" pattern="^[+0-9-]*$" maxlength="40" value="${data ? data['phone'] : ''}"/>
                        
                    </div>
                    
                    <div class="form__group">
                        <label class="form__label" for="email">Email</label>
                        <input type="email" class="form__input" id="email" name="email" maxlength="50" value="${data ? data['email'] : ''}"/>
                                
                    </div>

                    <div class="btn-group">
                        <button type="submit" class="btn btn_submit">Submit</button>
                    </div>
                </form>
                </div>`;
    } else if (cvType==='simple') {
        return `<div class="personal">
                    <form enctype="multipart/form-data" class="form">

                    <div class="form__group">
                        <label class="form__label" for="firstName">First Name</label>
                        <input type="text" class="form__input" id="firstName" name="firstName" required maxlength="80" value="${data ? data['firstName'] : ''}"/>
                    </div>

                    <div class="form__group">
                        <label class="form__label" for="lastName">Last Name</label>
                        <input type="text" class="form__input" id="lastName" name="lastName" required maxlength="80" value="${data ? data['lastName'] : ''}"/>
                    </div>

                    <div class="form__group">
                        <label class="form__label" for="position">Position</label>
                        <input type="text" class="form__input" id="position" name="position" maxlength="40" value="${(data && data['position']) ? data['position'] : ''}"/>
                    </div>

                    
                    <div class="form__group">
                        <label class="form__label" for="phone">Full Address</label>
                        <input type="text" class="form__input" id="address" name="address" maxlength="150" value="${(data && data['address']) ? data['address'] : ''}"/>
                    </div>
                            
                    <div class="form__group">
                        <label class="form__label" for="phone">Phone</label>
                        <input type="text" class="form__input" id="phone" name="phone" pattern="^[+0-9-]*$" maxlength="40" value="${(data && data['phone']) ? data['phone'] : ''}"/>
                        
                    </div>
                    
                    <div class="form__group">
                        <label class="form__label" for="email">Email</label>
                        <input type="email" class="form__input" id="email" name="email" maxlength="50" value="${(data && data['email']) ? data['email'] : ''}"/>
                                
                    </div>

                    <div class="form__group">
                        <label class="form__label" for="linkedin">Linkedin</label>
                        <div class="row">
                            <div class="col-3">
                                <span class="link_text_wrapper">https://</span>
                            </div>
                            <div class="col-9">
                                <input type="text" class="form__input linkedin__input" id="linkedin" name="linkedin" maxlength="150" value="${(data && data['linkedin']) ? data['linkedin'] : ''}"/>
                            </div>
                        </div>
                    </div>

                    <div class="btn-group u-margin-top-small">
                        <button type="submit" class="btn btn_submit">Submit</button>
                    </div>
                </form>
                </div>`;
    }
}