({
    getLaunchConfig : function(component) {
        //////////////////////
        // setup apex query //
        //////////////////////
        var action = component.get("c.getSettingConfig");
        
        var paramMap = {};
        paramMap['configId'] = component.get("v.launcherSetting");
        paramMap['prefix'] = component.get("v.context.networkPrefix");
        
        action.setParams({
            "params": JSON.stringify(paramMap)
        });
        
        /////////////////////
        // handle callback //
        /////////////////////
        action.setCallback(component, function(response) {
            var globalId = component.getGlobalId();
            var resp = JSON.parse(response.getReturnValue());
            if (resp.status === 'ERROR') {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Warning!",
                    "message": resp.msg,
                    //"duration": 2000,
                    "type": "warning",
                    mode: "sticky"
                });
                toastEvent.fire();
            }
            else
            {
                component.set('v.config', resp.data);
            }
        });
        
        $A.enqueueAction(action);
    },
    createRecord: function(component, item)
    {
        var navToRecord = component.get("v.navigateToRecord");
        
        //////////////////////
        // setup apex query //
        //////////////////////
        var action = component.get("c.createRecord");
        
        var paramMap = {};
        if (component.get("v.latitude") != null) paramMap['latitude'] = component.get("v.latitude");
        if (component.get("v.longitude") != null) paramMap['longitude'] = component.get("v.longitude");
        paramMap['item'] = JSON.stringify(item);
        
        action.setParams({
            "params": JSON.stringify(paramMap)
        });
        
        /////////////////////
        // handle callback //
        /////////////////////
        action.setCallback(component, function(response) {
            var globalId = component.getGlobalId();
            var resp = JSON.parse(response.getReturnValue());
            if (resp.status === 'ERROR') {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Warning!",
                    "message": resp.msg,
                    //"duration": 2000,
                    "type": "warning",
                    mode: "sticky"
                });
                toastEvent.fire();
            }
            else
            {
                if (navToRecord == 'false')
                {    
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success!",
                        "message": "Record created",
                        "duration": 2000,
                        "type": "success"
                    });
                    toastEvent.fire(); 
                }
                else
                { 
                    /////////////////////////////////////////////////////////
                    // only navigate to record if not anonymous/guest user //
                    /////////////////////////////////////////////////////////
                    var context = component.get("v.context");
                    if (context.userType != 'Guest')
                    {
                        var navEvt = $A.get("e.force:navigateToSObject");
                        navEvt.setParams({
                            "recordId": resp.data,
                            "slideDevName": "detail"
                        });
                        navEvt.fire(); 
                    }
                }
            }
        });
        
        $A.enqueueAction(action);
    },
    setRuntimeContext: function(component) {
        var self = this;
        console.log('helper setRuntimeContext started...');
        var action = component.get("c.getRuntimeContext");
        
        //Set up the callback
        var self = this;
        action.setCallback(this, function(a) {
            console.log(a.getReturnValue());
            var context = JSON.parse(a.getReturnValue());
            
            var baseURL = window.location.hostname;
            console.log('baseURL=' + baseURL);
            if (baseURL.includes("livepreview"))
            {
                context.networkPrefix = '/sfsites/c';   // override when in community builder mode
            }
            
            component.set("v.context", context);
            
            var backIcon = component.get("v.backIcon");
            if (!backIcon.startsWith('http') && context.networkPrefix != null)
            {
                component.set("v.backIcon", context.networkPrefix + backIcon);
            }
            
            var gpsIcon = component.get("v.gpsIcon");
            if (!backIcon.startsWith('http') && context.networkPrefix != null)
            {
                component.set("v.gpsIcon", context.networkPrefix + gpsIcon);
            }
            
            this.getLaunchConfig(component);
        });
        $A.enqueueAction(action);
    }
})