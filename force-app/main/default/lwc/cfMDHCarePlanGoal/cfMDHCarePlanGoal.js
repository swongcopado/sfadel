import { FlexCardMixin } from "omnistudio/flexCardMixin";
    import {interpolateWithRegex, interpolateKeyValue, loadCssFromStaticResource } from "omnistudio/flexCardUtility";
    
          import { LightningElement, api, track, wire } from "lwc";
          import pubsub from "omnistudio/pubsub";
          import { getRecord } from "lightning/uiRecordApi";
          
          import data from "./definition";
          
          import styleDef from "./styleDefinition";
              
          export default class cfMDHCarePlanGoal extends FlexCardMixin(LightningElement){
              @api debug;
              @api recordId;
              @api objectApiName;
              
              @track record;
              
              
              pubsubEvent = [];
              customEvent = [];
               
        firstRender0 = true;
        @wire(getRecord , {recordId: "$recordId" , fields:"GoalAssignment.Id",optionalFields: $cmp.getWireOptionalFields(data.events[0])})
          wiredRecord0({ error, data }){
            if (this.objectApiName === 'GoalAssignment'){
              if(data && this.firstRender0){
                this.firstRender0 = false;
                return;
              }else{
                this.recordChangeEventHandler(error,data,0)
              }
            }
          }
        
              connectedCallback() {
                super.connectedCallback();
                this.setStyleDefinition(styleDef);
                data.Session = {} //reinitialize on reload
                
                
                
                this.setDefinition(data);
 this.registerEvents();
                
                
              }
              
              disconnectedCallback(){
                super.disconnectedCallback();
                    
                    

                  this.unregisterEvents();
              }

              registerEvents() {
                
              }

              unregisterEvents(){
                
              }
            
              renderedCallback() {
                super.renderedCallback();
                
              }
          }