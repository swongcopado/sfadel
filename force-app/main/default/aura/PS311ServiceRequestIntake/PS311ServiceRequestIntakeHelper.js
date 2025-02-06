({
  reverseGeocodeEsri: function(component, lat, lng) {

    var action = component.get("c.reverseGeocodeEsri");
    action.setParams({
      "lat": lat,
      "lng": lng
    });

    action.setCallback(self, function(a) {
      console.log(a.getReturnValue());
      var resp = JSON.parse(a.getReturnValue());

      if (resp.hasOwnProperty('error')) {
        component.set('v.address', resp.error.details[0]);
      } else {
        //component.set('v.address', resp.address.Match_addr);
        var tmpAddr = '';
        if (resp.address.Address != null && resp.address.Address.length > 0)
        {
            tmpAddr = resp.address.Address;
        }
          
        if (resp.address.City != null && resp.address.City.length > 0)
        {
            if (tmpAddr.length > 0)
            {
              tmpAddr += ', ' + resp.address.City;
            }
            else
            {
              tmpAddr = resp.address.City;
            }
        }
        if (resp.address.Region != null && resp.address.Region.length > 0)
        {
            if (tmpAddr.length > 0)
            {
              tmpAddr += ', ' + resp.address.Region;
            }
            else
            {
              tmpAddr = resp.address.Region;
            }
        }
        if (resp.address.Postal != null && resp.address.Postal.length > 0)
        {
            if (tmpAddr.length > 0)
            {
              tmpAddr += ' ' + resp.address.Postal;
            }
            else
            {
              tmpAddr = resp.address.Postal;
            }
        }
        
        //console.log('tmpAdd=[' + tmpAddr + ']');
        component.set('v.address', tmpAddr);
        component.set('v.street', resp.address.Address);
        component.set('v.city', resp.address.City);
        component.set('v.state', resp.address.Region);
        component.set('v.postal', resp.address.Postal);
      }
    });
    // Enqueue the action
    $A.enqueueAction(action);
    //$A.clientService.runActions([action], this, function() {});
  },
    getTypes: function(component) {
        var action = component.get("c.getTypeOptions");
        action.setParams({
            "myDomain": component.get("v.myDomain"),
            "recordTypeId": component.get("v.recordTypeId")
        });
        
        
        var self = this;
        action.setCallback(this, function(actionResult) {
            component.set("v.typeList", actionResult.getReturnValue());
        });
        $A.enqueueAction(action);
    },
  getSubTypes: function(component, type) {
    var action = component.get("c.getSubTypeOptions");
    action.setParams({
      "type": type,
    });

    var self = this;
    action.setCallback(this, function(actionResult) {
      component.set("v.subtypeList", actionResult.getReturnValue());
    });
    $A.enqueueAction(action);
  },
  saveCase: function(component) {
    var self = this;
    var map = {};

    map['userId'] = component.get('v.userId');
    map['contactId'] = component.get('v.contactId');

    map['latitude'] = component.get('v.latitude');
    map['longitude'] = component.get('v.longitude');
    map['address'] = component.get('v.address');
    map['addressField'] = component.get('v.addressField');
    map['street'] = component.get('v.street');
    map['streetField'] = component.get('v.streetField');
    map['city'] = component.get('v.city');
    map['cityField'] = component.get('v.cityField');
    map['state'] = component.get('v.state');
    map['stateField'] = component.get('v.stateField');
    map['postal'] = component.get('v.postal');
    map['postalField'] = component.get('v.postalField');
    map['description'] = component.get('v.description');
    map['type'] = component.get('v.type');
    map['subtype'] = component.get('v.subtype');

    map['anonymousFlag'] = component.get('v.anonymousFlag').toString();
    map['firstName'] = component.get('v.firstName');
    map['lastName'] = component.get('v.lastName');
    map['email'] = component.get('v.email');
    map['phone'] = component.get('v.phone');
      
    map['recordTypeId'] = component.get('v.recordTypeId');

    console.log('paramMap=' + JSON.stringify(map));

    var action = component.get("c.saveCase");
    action.setParams({
      "params": JSON.stringify(map)
    });

    action.setCallback(self, function(a) {
      console.log(a.getReturnValue());
      var resp = JSON.parse(a.getReturnValue());

      if (resp.status == 'SUCCESS') {
        component.set('v.parentId', resp.data.Id);
        self.fireSaveFileEvent(component);
      } else {
        component.set("v.Spinner", false);

        self.showConfirm(component, "action:close", resp.msg);
      }

    });
    // Enqueue the action
    $A.enqueueAction(action);

  },
  getUserInfo: function(component) {
    console.log('getUserInfo called...');

    var action = component.get("c.getUserInfo");

    action.setCallback(self, function(a) {
      console.log(a.getReturnValue());
      var resp = JSON.parse(a.getReturnValue());
      console.log('resp=' + JSON.stringify(resp));

      if (resp.status == 'SUCCESS') {

        component.set('v.userId', resp.data.UserId);
        component.set('v.contactId', resp.data.ContactId);

        component.set('v.firstName', resp.data.FirstName);
        component.set('v.lastName', resp.data.LastName);
        component.set('v.email', resp.data.Email);
        component.set('v.phone', resp.data.Phone);
      }

    });
    // Enqueue the action
    $A.enqueueAction(action);

  },
  fireSaveFileEvent: function(component) {
    console.log('ImageUpload::fireSaveFileEvent invoked...');
    var appEvent = $A.get("e.c:ImageUploadSaveEvent_fk");
    appEvent.fire();
  },
  showConfirm: function(component, iconToShow, msg) {
    $A.createComponent(
      "lightning:icon", {
        "aura:id": "resultsIcon",
        "iconName": iconToShow,
        "size": "medium"
      },
      function(newIcon, st, errorMessage) {
        if (st === "SUCCESS") {
          var body = component.get("v.body");
          body.push(newIcon);
          component.set("v.body", body);

          component.set("v.saveResult", msg);
        } else if (status === "INCOMPLETE") {
          console.log("No reponse from server");
        } else if (status === "ERROR") {
          component.set("v.saveResult", "ERROR: " + msg);
          console.log("Error: " + errorMessage);
        }
      }
    );
  },
  setRuntimeEnv: function(component) {
    console.log('href=' + location.href);

    var env = "unknown";
    var baseURL = "";
    var pathArray = location.href.split('/');

    if (location.href.includes('one.app')) {
      env = "lightning";
      baseURL = pathArray[0] + '//' + pathArray[2] + '/one/one.app?source=aloha#/sObject/';
    } else if (location.href.includes('/s/')) {
      env = "community";
      baseURL = pathArray[0] + '//' + pathArray[2] + '/' + pathArray[3] + '/s/';
    }

    var envRT = {
      'env': env,
      'baseURL': baseURL
    };
    console.log(JSON.stringify(envRT));

    component.set("v.runtimeEnv", envRT);
  }
    

})