
import LanguageStar from './languages/LanguageStar.js';
import LanguageRange from './languages/LanguageRange.js';

export default function createLanguageInstance(cvType, stateObj, evEmitterObj, routerObj) {

    if (cvType==='standard') {
        return new LanguageStar(stateObj, evEmitterObj, routerObj);
    }
    else if (cvType==='custom') {
        return new LanguageRange(stateObj, evEmitterObj, routerObj);
    }
    else if (cvType==='simple') {
        return new LanguageStar(stateObj, evEmitterObj, routerObj);
    }
}