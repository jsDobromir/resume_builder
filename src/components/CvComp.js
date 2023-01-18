import { domBuild } from "../utils/domHelper";
import Standard from "./cvCompUtils/Standard";
import Fancy from './cvCompUtils/Fancy';
import Custom from './cvCompUtils/Custom';
import Simple from './cvCompUtils/Simple';

export default class CvComp {

    constructor(state, evEmitterObj, routerObj, cvType) {
        this.state = state;
        this.evEmitterObj = evEmitterObj;
        this.routerObj = routerObj;
        this.title = 'cvcomp';
        this.cvType = cvType;
        this.activeObject = null;

        if (this.cvType === 'standard') {
            const standardObj = new Standard(state, evEmitterObj, routerObj);
            this.activeObject = standardObj;
        }
        else if (this.cvType === 'fancy') {
            const fancyObj = new Fancy(state, evEmitterObj, routerObj);
            this.activeObject = fancyObj;
        }
        else if (this.cvType === 'custom') {
            const customObj = new Custom(state, evEmitterObj, routerObj);
            this.activeObject = customObj;
        }
        else if (this.cvType === 'simple') {
            const simpleObj = new Simple(state, evEmitterObj, routerObj);
            this.activeObject = simpleObj;
        }
    }

    setComponentAfterReroute(prevRoute) {
        if (this.activeObject) {
            this.activeObject.reRenderComponent(prevRoute);
        }
    }
}
