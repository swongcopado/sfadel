({
	doInit : function(component, event, helper) {
        // Get a reference to the dynamicTasks() function defined in the Apex controller
		var action = component.get("c.dynamicTasks");
                        
        // Register the callback function
        action.setCallback(this, function(response) {
            console.log('We have a call back!');
            console.log('Response Vals: [' + response.getReturnValue() + ']');

            var state = response.getState();
            if(component.isValid && state === "SUCCESS") {
                component.set("v.dTasks", response.getReturnValue());
                console.log('*** Response: [' + response.getReturnValue() + ']');
                console.log('*** Subject: ' + component.get("v.dTasks.Subject"));
                
            }
        });
        
        // Invoke the service
        console.log("Call Apex");
        $A.enqueueAction(action);
        
        // get path prefix to properly format hyperlinks to records
        // for a community or internal use
        // see: https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_classes_sites.htm
        var action = component.get("c.pathPrefix");
        action.setCallback(this, function(response) {
            var pathPrefix = response.getReturnValue();
            component.set("v.pathPrefix", pathPrefix);
        });
        $A.enqueueAction(action);
        
	},
    
    completeTask : function (component, event, helper) {
        console.log("completeTask");

        var cmpStrike;
        // create var for store record id for selected checkboxes  
        var completedId = [];
        // get all checkboxes 
        var getAllId = component.find("checkbox");
        // If the local ID is unique [in single record case], find() returns the component not array
        if(!Array.isArray(getAllId)){
            if (getAllId.get("v.value") == true) {
                completedId.push(getAllId.get("v.text"));
                cmpStrike = document.getElementById(getAllId[i].get("v.text"));
                cmpStrike.className += ' strikeOutCompleted';
            }
        } 
        else {
            // play a for loop and check every checkbox values 
            // if value is checked (true) then add those Id (store in Text attribute on checkbox) in completedId var
            for (var i = 0; i < getAllId.length; i++) {
                if (getAllId[i].get("v.value") == true) {
                    completedId.push(getAllId[i].get("v.text"));
                    cmpStrike = document.getElementById(getAllId[i].get("v.text"));
                    cmpStrike.className += ' strikeOutCompleted';
                }
            }
        } 
        
        // call the helper function and pass all selected record id's.    
        helper.completeTaskHelper(component, event, completedId);        
    },
    
    // opens modal and runs flow
    runFlow : function( component, event, helper ) {
        let flowName = event.getSource().get( "v.name" );

        component.set( "v.showModal", true );

        $A.createComponent(
            "lightning:flow",
            {
                "onstatuschange": component.getReference( "c.hideModal" )
            },
            ( flow, status, errorMessage ) => {
                if ( status === "SUCCESS" ) {
                    component.set( "v.body", flow );
                    component.set( "v.flow", flow );
                    flow.startFlow( flowName );
                }
            }
        );
    },
	
    // hides flow modal
    hideModal : function( component, event, helper ) {
        if ( event.getParam( "status" ).indexOf( "FINISHED" ) !== -1 ) {
            component.set( "v.showModal", false );
            component.get( "v.flow" ).destroy();
            $A.get('e.force:refreshView').fire();
        }
    },
    
    // closes the flow modal when user clicks the close button
    closeModal : function( component, event, helper ) {
        component.set( "v.showModal", false );
        component.get( "v.flow" ).destroy();
    },
    
    // where DTask_Type__c = Link,
    // opens a new browser tab/window and
    // redirects user to the DTask_Link_URL__c
    // when they click on the link button
    gotoURL : function (cmp, event, helper) {
        var gotoURL = event.getSource().get("v.name");
        console.log("You are clicking the link button and going to" + gotoURL);
        // alert("You are aclicked gotoURL:  " + gotoURL);
        
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": gotoURL
        });
        urlEvent.fire();
    }
})