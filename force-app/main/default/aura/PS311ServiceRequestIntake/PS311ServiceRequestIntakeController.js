({
    doInit: function(component, event, helper) {
        console.log('doInit...');
        var toggleText = component.find("step2Div");
        $A.util.addClass(toggleText, 'hide');
        toggleText = component.find("step3Div");
        $A.util.addClass(toggleText, 'toggle');
        toggleText = component.find("step4Div");
        $A.util.addClass(toggleText, 'hide');
        toggleText = component.find("step5Div");
        $A.util.addClass(toggleText, 'hide');
        
        helper.getTypes(component);
        helper.getUserInfo(component);
        
    },
    jsLoaded: function(component, event, helper) {
        console.log('jsLoaded...');
        
        helper.setRuntimeEnv(component);
        
        setTimeout(function() {
            var markersLayer = new L.LayerGroup();
            var markersLayerList = [];
            markersLayerList.push(markersLayer);
            
            var map = L.map('map', {
                zoomControl: false
            }).setView([parseFloat(component.get("v.mapCenterLat")), parseFloat(component.get("v.mapCenterLng"))], component.get("v.mapZoomLevel"));
            //var map = L.map('map', { zoomControl: false }).setView([location.coords.latitude, location.coords.longitude], 14);
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles © Esri'
            }).addTo(map);
            component.set("v.map", map);
            
            var crosshairIcon = L.icon({
                //iconUrl: '/dev/resource/mapCrosshair',
                iconUrl: $A.get('$Resource.mapCrosshair'),
                iconSize: [200, 200] // size of the icon
            });
            console.log('crosshairIcon=' + JSON.stringify(crosshairIcon));
            console.log('setting crosshair center=' + map.getCenter());
            crosshair = new L.marker(map.getCenter(), {
                icon: crosshairIcon,
                clickable: false
            });
            crosshair.addTo(map);
            
            // Move the crosshair to the center of the map when the user pans
            map.on('move', function(e) {
                crosshair.setLatLng(map.getCenter());
            });
            
            map.on('moveend', $A.getCallback(function(e) {
                console.log('moveend2=' + map.getCenter());
                var coords = map.getCenter();
                component.set('v.latitude', coords.lat);
                component.set('v.longitude', coords.lng);
                
                //helper.reverseGeocodeNominatim(component, coords.lat, coords.lng);
                helper.reverseGeocodeEsri(component, coords.lat, coords.lng);
                
            }));
            
            console.log('getCurrentPosition');
            var autoCenter = component.get('v.autoCenter');
            if (autoCenter == 'true')
            {
                navigator.geolocation.getCurrentPosition($A.getCallback(function(location) {
                    console.log(location.coords.latitude);
                    console.log(location.coords.longitude);
                    console.log(location.coords.accuracy);
                    
                    map.setView([location.coords.latitude, location.coords.longitude], 14);
                    
                    helper.reverseGeocodeEsri(component, location.coords.latitude, location.coords.longitude);
                    
                }));
            }
            
        });
    },
    handleNextClick: function(component, event, helper) {
        console.log('handleNextClick');
        console.log('event=' + event.getSource().getLocalId());
        var comp = event.getSource().getLocalId();
        component.set('v.errorMsg', '');
        
        switch (comp) {
            case "step1Next":
                /////////////////////////////
                // Update the progress bar //
                /////////////////////////////
                var target = component.find("step1Div");
                $A.util.addClass(target, 'hide');
                target = component.find("step2Div");
                $A.util.removeClass(target, 'hide');
                target = component.find("step1Indicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-complete');
                target = component.find("step2Indicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-incomplete');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-current');
                
                // hack for leaflet issue with initilizing with zero div
                target = component.find("step3Div");
                $A.util.addClass(target, 'hide');
                $A.util.removeClass(target, 'toggle');
                break;
            case "step2Next":
                /////////////////////////////
                // Update the progress bar //
                /////////////////////////////
                var target = component.find("step2Div");
                $A.util.addClass(target, 'hide');
                target = component.find("step3Div");
                $A.util.removeClass(target, 'hide');
                target = component.find("step2Indicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-complete');
                target = component.find("step3Indicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-incomplete');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-current');
                break;
            case "step3Next":
                /////////////////////////////
                // Update the progress bar //
                /////////////////////////////
                var target = component.find("step3Div");
                $A.util.addClass(target, 'hide');
                target = component.find("step4Div");
                $A.util.removeClass(target, 'hide');
                target = component.find("step3Indicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-complete');
                target = component.find("step4Indicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-incomplete');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-current');
                
                //component.set('v.parentId', '001ao00000D6zwmAAR');
                //console.log('v.parentId=' + component.get('v.parentId'));
                component.set("v.Spinner", true);
                helper.saveCase(component);
                break;
        }
    },
    handleBackClick: function(component, event, helper) {
        console.log('handleNextClick');
        console.log('event=' + event.getSource().getLocalId());
        //console.log('event=' + JSON.stringify(event));
        var comp = event.getSource().getLocalId();
        
        switch (comp) {
            case "step2Back":
                /////////////////////////////
                // Update the progress bar //
                /////////////////////////////
                var target = component.find("step2Div");
                $A.util.addClass(target, 'hide');
                target = component.find("step1Div");
                $A.util.removeClass(target, 'hide');
                target = component.find("step2Indicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-incomplete');
                target = component.find("step1Indicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-complete');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-current');
                break;
            case "step3Back":
                /////////////////////////////
                // Update the progress bar //
                /////////////////////////////
                var target = component.find("step3Div");
                $A.util.addClass(target, 'hide');
                target = component.find("step2Div");
                $A.util.removeClass(target, 'hide');
                target = component.find("step3Indicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-incomplete');
                target = component.find("step2Indicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-complete');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-current');
                break;
            case "step4Back":
                /////////////////////////////
                // Update the progress bar //
                /////////////////////////////
                var target = component.find("step4Div");
                $A.util.addClass(target, 'hide');
                target = component.find("step3Div");
                $A.util.removeClass(target, 'hide');
                target = component.find("step4Indicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-incomplete');
                target = component.find("step3Indicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-complete');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-current');
                break;
        }
    },
    onTypeChange: function(component, event, helper) {
        console.log('onTypeChange');
        helper.getSubTypes(component, component.get("v.type"));
    },
    onContactOptionChange: function(component, event, helper) {
        console.log('onContactOptionChange');
        console.log(document.documentElement.clientWidth)
        
        var anonymousFlag = component.get("v.anonymousFlag");
        if (anonymousFlag == true) {
            component.set("v.anonymousFlag", false);
        } else {
            component.set("v.anonymousFlag", true);
        }
        
    },
    saveFileComplete: function(component, event, helper) {
        console.log('saveFileComplete invoked...');
        component.set("v.Spinner", false);
        
        var status = event.getParam('status');
        var iconToShow;
        var msg;
        
        if (status === "SUCCESS") {
            iconToShow = "action:approval";
            msg = 'Case has been saved correctly!'
        } else {
            iconToShow = "action:close";
            msg = 'Error: ' + event.getParam('message');
            console.log('error=' + msg);
        }
        
        helper.showConfirm(component, iconToShow, msg);
        
        /*
    var pId = component.get("v.parentId");
    var sObectEvent = $A.get("e.force:navigateToSObject");
    sObectEvent.setParams({
        "recordId": pId,
        "slideDevName": "detail"
    });
    sObectEvent.fire();
    */
  },
    imageChange: function(component, event, helper) {
        console.log('imageChange');
        console.log('event=' + JSON.stringify(event));
        
        var fileOperation = event.getParam('fileOperation');
        var fileName = event.getParam('fileName');
        console.log('fileName=' + fileName);
        
        component.set("v.attachFileName", fileName);
    },
    navigateToRecord: function(component, event, helper) {
        
        $A.get('e.force:refreshView').fire();
        
        var recordId = component.get("v.parentId");
        var sObectEvent = $A.get("e.force:navigateToSObject");
        sObectEvent.setParams({
            "recordId": recordId,
            "slideDevName": "detail"
        });
        sObectEvent.fire();
        
        $A.get('e.force:refreshView').fire();
        
    }
    
})