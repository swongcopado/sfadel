({
    completeTaskHelper: function(component, event, taskIdList) {
        //call apex class method
        var action = component.get('c.completeDynamicTasks');
        // pass the all selected record's Id's to apex method 
        action.setParams({
            "DynamicTasks": taskIdList
        });
        action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('completeTaskHelper callback: [' + state + ']');
                if (response.getReturnValue() != '') {
                    // if getting any error while delete the records , then display a alert msg/
                    alert('The following error has occurred. while Delete record-->' + response.getReturnValue());
                } else {
                    console.log('check it--> delete successful');
                }
                
            }
        });
        $A.enqueueAction(action);
    },
})