({
    doInit: function(component, event, helper) {
        console.log("doInit called");
        
        var device = $A.get("$Browser.formFactor");
        console.log("formFactor=" + device);
        
        //////////////////////////////////////
        // get the current lat/lng location //
        //////////////////////////////////////
        navigator.geolocation.getCurrentPosition($A.getCallback(function(location) {
            component.set("v.latitude", location.coords.latitude);
            component.set("v.longitude", location.coords.longitude);
            
            var gpsIndicator = component.get("v.gpsIndicator");
            if (gpsIndicator == 'true')
            {
              var target = component.find("locateDiv");
              $A.util.removeClass(target, 'hide');
            }
            
            if (device == 'DESKTOPX')
            {
            var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "GPS location obtained!",
                    "duration": 500,
                    "type": "info"
                });
                toastEvent.fire();
            }
            
        }));
        
        helper.setRuntimeContext(component);
        
    },
    onCategoryClick: function(component, event, helper) {
        console.log("onCategoryClick called");
        var idx = event.target.id;
        console.log("idx=" + idx);
        component.set('v.catSelectId', idx);
        var config = component.get('v.config');
        
        for (var i=0; i<config.catList.length; i++)
        {
            var cat = config.catList[i];
            if (cat.id == idx)
            {
                component.set("v.catConfig", cat);
                break;
            }
            
        }
    },
    onItemClick: function(component, event, helper) {
        console.log("onItemClick called");
        
        
        var idx = event.target.id;
        console.log("idx=" + idx);
        
        var config = component.get("v.config");
        var catConfig = component.get("v.catConfig");
        var item;
        var itemList;
        
        //////////////////////////////////////////
        // determine which item list of process //
        //////////////////////////////////////////
        if (catConfig != null)
        {
            itemList = catConfig.itemList;
        }
        else
        {
            itemList = config.itemList;
        }
        
        ////////////////////////////
        // find the specific item //
        ////////////////////////////
        for (var i=0; i<itemList.length; i++)
        {
            var tempItem = itemList[i];
            if (tempItem.id == idx)
            {
                item = tempItem;
                break;
            }
        }
        
        //////////////////////
        // process the item //
        //////////////////////
        if (item.type == 'URL')
        {
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": item.launchURL
            });
            urlEvent.fire();
        }
        else if (item.type == 'Create Record')
        {
            var confirmCreateRecord = component.get("v.confirmCreateRecord");
            if (confirmCreateRecord == 'true')
            {
                if (item.confirmationMsg == null)
                {
                    item.confirmationMsg = "Do you really want to execute this action?";
                }
                if (confirm(item.confirmationMsg))
                {
                    helper.createRecord(component, item);
                }
            }
            else
            {
                helper.createRecord(component, item);
            }
        }
        
    },
    onBackClick: function(component, event, helper) {
        console.log("onBackClick called");
        component.set("v.catConfig", null);
    }
})