
import LanguageStar from './languages/LanguageStar.js';

export default function createLanguageInstance(cvType, stateObj, evEmitterObj, routerObj) {

    if (cvType==='standard') {
        return new LanguageStar(stateObj, evEmitterObj, routerObj);
    }
}