import SkillsRange from "./skills/SkillsRange.js";
import SkillsStar from "./skills/SkillsStar.js";
import SkillsList from "./skills/SkillsList.js";

export default function createSkillInstance(cvType, stateObj, evEmitterObj, routerObj) {

    if (cvType==='standard') {
        return new SkillsRange(stateObj, evEmitterObj, routerObj);
    }
    else if (cvType==='fancy') {
        return new SkillsStar(stateObj, evEmitterObj, routerObj);
    }
    else if (cvType==='custom') {
        return new SkillsStar(stateObj, evEmitterObj, routerObj);
    }
    else if (cvType==='simple') {
        return new SkillsList(stateObj, evEmitterObj, routerObj);
    }
}