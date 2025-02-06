({
    doInit : function(component, event, helper){
        helper.doInit(component);
    },
    save : function(component, event, helper) {
        helper.save(component);
    },
    waiting: function(component, event, helper) {
    	$A.util.removeClass(component.find("loading"), "display-none");
    },
    doneWaiting: function(component, event, helper) {
    	$A.util.addClass(component.find("loading"), "display-none");
    },
    imageChange : function(component, event, helper){
        helper.imageChange(component);
    },
    colorCameraButton : function(component, event, helper){
    	$A.util.addClass(component.find("camera_button"), "clicked");
    },
    undoCameraButton : function(component, event, helper){
    	helper.undoCameraButton(component);
    },
    saveEvent : function(component, event, helper) {
        console.log('ImageUpload::saveEvent invoked...');
        //component.set('v.parentId', event.getParam("parentId"));
        helper.save(component);
    }
})