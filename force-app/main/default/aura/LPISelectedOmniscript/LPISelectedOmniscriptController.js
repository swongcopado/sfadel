({
    doInit : function(cmp) {
        	var action = cmp.get("c.demoOmniscript");
        	console.log("in doInit");
            var OSType = cmp.get("v.Type");
        	console.log("OSType is " + OSType);
        	action.setParams({OSType: cmp.get("v.Type")});
        	
            action.setCallback(this, function(response) {
            console.log("In setCallBack");
            console.log('We have a call back!');
            console.log('Response Vals: [' + response.getReturnValue() + ']');
            var state = response.getState();
            if (state === "SUCCESS") {
                // Alert the user with the value returned 
                // from the server
                console.log("From server: " + response.getReturnValue());
       			var omniscriptname = response.getReturnValue();
                $A.createComponent(
                    omniscriptname,
                    {},
                    function(element, status, errorMessage){
                        if (cmp.isValid() && status == 'SUCCESS'){
                            var body = cmp.get('v.body');
                            body.push(element);
                            cmp.set('v.body', element);
                        }
                    }
                );
                

            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        
        $A.enqueueAction(action);
    }
    
}
)