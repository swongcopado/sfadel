/**
 * LWC to Display Progress Circle
 *
 * @author  Kirk Leibert - kleibert@salesforce.com
 * @version 1.0
 *
 * History
 * -------
 * v1.0 - 6/27/2021 - Initial Version
 * 
 * 
 * Parameters
 * --------
 * progresspercent - this value gets displayed as the perent value - passed in from Flecard as a custom property.
 * 
 **/

import { LightningElement, api, track } from 'lwc';
export default class LwcDisplayProgress extends LightningElement {

@track 
progresspercent_data;

@api
get progresspercent() {
    return this.progresspercent_data;
}

set progresspercent(val) {
    if (val === null) {
       console.log("progresspercent parameter received null source data.");
       return
    } 
    this.progresspercent_data = val;
}

renderedCallback(){
    this.initCSSVariables();
} 

connectedCallback(){
    console.log('rendered callback:' + this.progresspercent);
}

initCSSVariables() {
    let pctvalue =  this.progresspercent;
    let dynamic_classname = "circle per-" + pctvalue;
    let divblock = this.template.querySelector('[data-id="circle"]');
    if(divblock){
        this.template.querySelector('[data-id="circle"]').className=dynamic_classname ;
        } 
    }        
}