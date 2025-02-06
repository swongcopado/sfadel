({
    MAX_FILE_SIZE: 750 000,
    doInit : function(cmp){
    	orientation = 0;
        /*
        var action = cmp.get("c.checkParentId");
        action.setParams({
            parentId: cmp.get("v.parentId")
        });
        action.setCallback(this, function(a) {
            if(a.getReturnValue() != ''){
                cmp.set( "v.message", a.getReturnValue() );
    			$A.util.addClass(cmp.find("message_div"), "warning");	
            }
        });
        $A.run(function() {
            $A.enqueueAction(action); 
        });
        */
	},
        
    save : function(cmp) {
        console.log('ImageUpload__fk::save...');
        var fileInput = cmp.find("file").getElement();
        var file = fileInput.files[0];
        if(!file){
            var compEvent = cmp.getEvent("saveCompleteEvent");
            compEvent.setParams({"status" : "SUCCESS" });
            compEvent.setParams({"message" : "No file to save." });
            compEvent.fire();

            $A.util.addClass(cmp.find("message_div"), "warning");
            cmp.set( "v.message", "Please select a file" );
            return false;
        }
        var self = this;
        var canvas = document.getElementById('canvas');
        self.upload(cmp, file, self.getBase64Image(canvas));
        self.undoCameraButton(cmp);
    },
        
    upload : function(cmp, file, fileContents) {
        console.log('ImageUpload__fk::upload...');
        var action = cmp.get("c.saveTheFile"); 

        action.setParams({
            parentId: cmp.get("v.parentId"),
            fileName: file.name,
            base64Data: encodeURIComponent(fileContents), 
            contentType: file.type
        });

        action.setCallback(this, function(a) {
            var message = '';
            var status = 'SUCCESS';
            
            console.log('callback=' + JSON.stringify(a));
            if (a.getState() === "SUCCESS") {
                console.log('upload=' + a.getReturnValue());
                message = a.getReturnValue();
                if(message.indexOf('error') > -1) 
            	$A.util.addClass(cmp.find("message_div"), "warning");	
            } else if (a.getState() === "ERROR"){
                var errors = action.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        message = errors[0].message;
                    }
                }
            }
            //cmp.set( "v.message", message );
            var compEvent = cmp.getEvent("saveCompleteEvent");
            compEvent.setParams({"status" : status });
            compEvent.setParams({"message" : message });
            compEvent.fire();
            });
            
        $A.run(function() {
            $A.enqueueAction(action); 
        });
    },
    
    imageChange : function(cmp){
        console.log('ImageUpload__fk::imageChange...');
        $A.util.removeClass(cmp.find("message_div"), "warning");
        cmp.set( "v.message", "" );
        if(this.disabled) return alert('File upload not supported!');
        var fileInput = cmp.find("file").getElement();
        var file = fileInput.files[0];
        var canvas = document.getElementById('canvas');
        if(file){
            var self = this;
            self.megapix(cmp, file, canvas);

            var compEvent = cmp.getEvent("imageChangeEvent");
            compEvent.setParams({"fileOperation" : "Add" });
            compEvent.setParams({"fileName" : file.name });
            compEvent.fire();
        }
    },
	getBase64Image: function(img) {
        console.log('ImageUpload__fk::getBase64Image...');
        var dataURL = img.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    },
    undoCameraButton : function(cmp){
        $A.util.removeClass(cmp.find("camera_button"), "clicked");
    },
    base64ToArrayBuffer : function(base64) {
        console.log('ImageUpload__fk::base64ToArrayBuffer...');
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array( len );
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
    	return bytes.buffer;
    },    
    megapix: function(cmp, file, canvas) {
        console.log('ImageUpload__fk::megapix...');
        var reader = new FileReader();
        var self = this;
        var orientation;
        reader.readAsDataURL(file); 
        reader.onloadend = function(f) {
            cmp.set( "v.file_title", file.name );
            orientation = EXIF.readFromBinaryFile(self.base64ToArrayBuffer(this.result)).Orientation;
            var mpImg = new MegaPixImage(file);
            
            if(!orientation)  orientation = 0;
            mpImg.render(canvas, { maxWidth: 600, maxHeight: 600, orientation: orientation });
        }
    }
}