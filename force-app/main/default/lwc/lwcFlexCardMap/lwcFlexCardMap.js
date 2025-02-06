/**
 * LWC that displays a Customizable Map in a Flex Card
 *
 * @author  Kirk Leibert - kleibert@salesforce.com
 * @version 1.1
 *
 * History
 * -------
 * v1.0 - 6/27/2021 - Initial Version
 * v1.1 - 7/18/2021 - Added white gradient fade overlay to map
 * 
 * Parameters
 * --------
 *  mapMarkers;
 *  mapTitle;
 **/

import { LightningElement, api, track } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class LwcFlexCardMap extends LightningElement {
    @api mapMarkers;
    @api mapTitle;
    @track selectedMarkerValue;
    @track zoomLevel;
    @track listView;
    @track mapOption;

connectedCallback() {
    this.mapTitle = "hello world!";
    this.zoomLevel = 12;
    this.listView = "hidden";
    this.mapMarkers = [{
            location: {
                // Location Information
                City: 'San Francisco',
                Country: 'USA',
                PostalCode: '94105',
                State: 'CA',
                Street: '50 Fremont St',
            },

            // For onmarkerselect
            value: 'SF1',

            // Extra info for tile in list & info window
            icon: 'standard:account',
            title: 'Salesforce', // e.g. Account.Name
            description: 'Salesforce',
        }];

    this.mapOptions = {
        draggable: true,
        disableDefaultUI: false
    };
    this.selectedMarkerValue = "SF1";
}

//c-wc-locations 
renderedCallback() {
    //max-height: 100%;
    console.log("renderedCallback - adding white gradient");
    const style = document.createElement('style');
    style.innerText = '.slds-map {min-width: 0 !important;  position: relative; min-width: 5.0rem; width: 100%; height:112px !important; }';
    this.template.querySelector('lightning-map').appendChild(style);
}
    handleMarkerSelect(event) {
        this.selectedMarkerValue = event.target.selectedMarkerValue;
    }
}