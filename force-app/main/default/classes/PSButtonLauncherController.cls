public class PSButtonLauncherController {
    @AuraEnabled
    public static String getSettingConfig(String params) {
        System.debug('params=' + params);
        Map<String, String> paramMap = (Map<String, String>)JSON.deserialize(params,   Map<String, String>.class);
        PSResponse resp = new PSResponse();
        
        try
        {         
            String configId = paramMap.get('configId');
            String prefix = paramMap.get('prefix');
            PSButtonLauncherSetting__c setting = [SELECT Id, Name__c, (SELECT Id, Name__c, Icon_URL__c FROM PSButtonLauncherCategory__r ORDER BY Name__c ASC)
                                                  FROM PSButtonLauncherSetting__c  WHERE Id = :configId ORDER BY Name__c ASC];
            
            LauncherSetting stg = new LauncherSetting();
            stg.name = setting.Name__c;
            
            LauncherItem tmpItem;
            
            
            //////////////////////////////        
            // get list of category ids //
            //////////////////////////////        
            List<Id> catIdList = new List<Id>();
            Map<Id, LauncherCategory> catMap = new Map<Id, LauncherCategory>();
            for (PSButtonLauncherCategory__c cat : setting.PSButtonLauncherCategory__r)
            {
                LauncherCategory tmpCat = new LauncherCategory();
                tmpCat.id = cat.Id;
                tmpCat.name = cat.Name__c;
                tmpCat.iconURL = prefixURL(cat.Icon_URL__c, prefix);
                catMap.put(cat.Id, tmpCat);
                
                catIdList.add(cat.Id);
            }
            
            ////////////////////////////////////////
            // get list of items for category ids //
            ////////////////////////////////////////
            for (PSButtonLauncherItem__c item : [SELECT Id, Name__c, Type__c, URL__c, Icon_URL__c, Object_API_Name__c, Contact_Field_API_Name__c, Latitude_Field_API_Name__c, 
                                                 Longitude_Field_API_Name__c, Confirmation_msg__c, Full_Address_Field_API_Name__c, Street_Field_API_Name__c, City_Field_API_Name__c,
                                                 State_Field_API_Name__c, Zipcode_Field_API_Name__c,
                                                 (SELECT Id, Key__c, Value__c FROM PSButtonLauncherKeyValues__r), PSButtonLauncherCategory__c 
                                                 FROM PSButtonLauncherItem__c WHERE PSButtonLauncherCategory__c IN :catIdList ORDER BY Name__c ASC] )
            {
                tmpItem = new LauncherItem();
                tmpItem.id = item.Id;
                tmpItem.name = item.Name__c;
                tmpItem.iconURL = prefixURL(item.Icon_URL__c, prefix);
                    
                tmpItem.type = item.Type__c;
                tmpItem.launchURL = item.URL__c;
                tmpItem.objectName = item.Object_API_Name__c;
                tmpItem.contactField = item.Contact_Field_API_Name__c;
                tmpItem.latitudeField = item.Latitude_Field_API_Name__c;
                tmpItem.longitudeField = item.Longitude_Field_API_Name__c;
                tmpItem.confirmationMsg = item.Confirmation_msg__c;
                tmpItem.fullAddressField = item.Full_Address_Field_API_Name__c;
                tmpItem.streetField = item.Street_Field_API_Name__c;
                tmpItem.cityField = item.City_Field_API_Name__c;
                tmpItem.stateField = item.State_Field_API_Name__c;
                tmpItem.zipcodeField = item.Zipcode_Field_API_Name__c;
                
                for (PSButtonLauncherKeyValue__c kv : item.PSButtonLauncherKeyValues__r)
                {
                    tmpItem.addKeyValue(kv.Key__c, kv.Value__c);
                }
                
                LauncherCategory tmpCat = catMap.get(item.PSButtonLauncherCategory__c);
                tmpCat.itemList.add(tmpItem);
            }
            
            for (ID tmpId : catIdList)
            {
                LauncherCategory tmpCat = catMap.get(tmpId);
                stg.catList.add(tmpCat);
            }
            
            
            ///////////////////////////////////
            // get list of items for setting //
            ///////////////////////////////////
            for (PSButtonLauncherItem__c item : [SELECT Id, Name__c, Type__c, URL__c, Icon_URL__c, Object_API_Name__c, Contact_Field_API_Name__c, Latitude_Field_API_Name__c, 
                                                 Longitude_Field_API_Name__c, Confirmation_msg__c, Full_Address_Field_API_Name__c, Street_Field_API_Name__c, City_Field_API_Name__c,
                                                 State_Field_API_Name__c, Zipcode_Field_API_Name__c,
                                                 (SELECT Id, Key__c, Value__c FROM PSButtonLauncherKeyValues__r) 
                                                 FROM PSButtonLauncherItem__c WHERE PSButtonLauncherSetting__c  = :configId  ORDER BY Name__c ASC])
            {
                tmpItem = new LauncherItem();
                tmpItem.id = item.Id;
                tmpItem.name = item.Name__c;
                tmpItem.iconURL = prefixURL(item.Icon_URL__c, prefix);
                tmpItem.type = item.Type__c;
                tmpItem.launchURL = item.URL__c;
                tmpItem.objectName = item.Object_API_Name__c;
                tmpItem.contactField = item.Contact_Field_API_Name__c;
                tmpItem.latitudeField = item.Latitude_Field_API_Name__c;
                tmpItem.longitudeField = item.Longitude_Field_API_Name__c;
                tmpItem.confirmationMsg = item.Confirmation_msg__c;
                tmpItem.fullAddressField = item.Full_Address_Field_API_Name__c;
                tmpItem.streetField = item.Street_Field_API_Name__c;
                tmpItem.cityField = item.City_Field_API_Name__c;
                tmpItem.stateField = item.State_Field_API_Name__c;
                tmpItem.zipcodeField = item.Zipcode_Field_API_Name__c;
                
                for (PSButtonLauncherKeyValue__c kv : item.PSButtonLauncherKeyValues__r)
                {
                    tmpItem.addKeyValue(kv.Key__c, kv.Value__c);
                }
                
                stg.itemList.add(tmpItem);
            }
            
            System.debug(JSON.serialize(stg));
            resp.data = stg;
        }
        catch (exception e)
        {
            resp.status = PSResponse.ERROR;
            resp.msg = e.getMessage();
        }
        
        return  JSON.serialize(resp);
    }
    
    private static String prefixURL(String url, String prefix)
    {
        if (prefix == null) return url;
        
        if (url.startsWith('http'))
        {
            return url;
        }
        else
        {
            return prefix + url;
        }
    }
    
    @AuraEnabled
    public static String createRecord(String params) {
        System.debug('params=' + params);
        Map<String, String> paramMap = (Map<String, String>)JSON.deserialize(params,   Map<String, String>.class);
        PSResponse resp = new PSResponse();
        
        try
        {    
           Decimal latitude = null;
           Decimal longitude = null;
           String contactId = null;
           
           if (paramMap.containsKey('latitude'))  latitude = Decimal.valueOf(paramMap.get('latitude'));
           if (paramMap.containsKey('longitude'))  longitude = Decimal.valueOf(paramMap.get('longitude'));
           
 
               
           LauncherItem item = (LauncherItem)JSON.deserialize(paramMap.get('item'), LauncherItem.class);
           System.debug('latitude=' + latitude);
           System.debug('longitude=' + longitude);
           System.debug('item=' + paramMap.get('item'));
            
           System.debug('objectName=' + item.objectName);
            
           ////////////////////////////////////////////////////////// 
           // determine if authenticated user/contact or anonymous //
           //////////////////////////////////////////////////////////
           ID userId = UserInfo.getUserId();
           String userType = UserInfo.getUserType();

           if (userType == 'CspLitePortal')
           {
               User u = [SELECT AccountId, ContactId FROM User WHERE Id = :userId];
               if (u.ContactId != null) contactId = u.ContactId;
           }
               
           
           /////////////////// 
           // create record //
           ///////////////////
           sObject rec = Schema.getGlobalDescribe().get(item.objectName).newSObject();

           for (LauncherKeyValue var : item.keyValueList)
           {
               rec.put(var.key , var.value) ;
           }
            
           if (item.latitudeField != null && latitude != null) rec.put(item.latitudeField, latitude);
           if (item.longitudeField != null && longitude != null) rec.put(item.longitudeField, longitude);
           
           
           if (item.contactField != null && contactId != null)
           {
               if (!item.contactField.endsWith('Id'))
               {
                  item.contactField = item.contactField + 'Id'; 
               }
               rec.put(item.contactField, contactId); 
           }
            
           if (latitude != null && longitude != null)
           {
             String geoResp = PSGeoUtils.reverseGeocodeEsri(latitude, longitude);
             PSEsriReverseGeocodeResponse esriResp = (PSEsriReverseGeocodeResponse)JSON.deserialize(geoResp, PSEsriReverseGeocodeResponse.class);
               
             if (item.fullAddressField != null && esriResp.getFullAddress() != null) rec.put(item.fullAddressField, esriResp.getFullAddress()); 
             if (item.streetField != null && esriResp.address.Address != null) rec.put(item.streetField, esriResp.address.Address);
             if (item.cityField != null && esriResp.address.City != null) rec.put(item.cityField, esriResp.address.City);
             if (item.stateField != null && esriResp.address.Region != null) rec.put(item.stateField, esriResp.address.Region);
             if (item.zipcodeField != null && esriResp.address.Postal != null) rec.put(item.zipcodeField, esriResp.address.Postal);
           }
               
           System.debug('rec=' + JSON.serialize(rec));
           insert rec;
            
           resp.data = rec.Id;
                       
        }
        catch (exception e)
        {
            resp.status = PSResponse.ERROR;
            resp.msg = e.getMessage();
        }
        
        return  JSON.serialize(resp);
    }
        
    
    public class LauncherSetting
    {
        public String name;
        public List<LauncherCategory> catList = new List<LauncherCategory>();
        public List<LauncherItem> itemList = new List<LauncherItem>();
    }
    
    public class LauncherCategory
    {
        public String id;
        public String name;
        public String iconURL;
        public List<LauncherItem> itemList = new List<LauncherItem>();
    }
    
    public class LauncherItem
    {
        public String id;
        public String name;
        public String iconURL;
        public String type;
        public String launchURL;
        public String objectName;
        public String contactField;
        public String latitudeField;
        public String longitudeField;
        public String confirmationMsg;
        public String fullAddressField;
        public String streetField;
        public String cityField;
        public String stateField;
        public String zipcodeField;
        
        public List<LauncherKeyValue> keyValueList = new List<LauncherKeyValue>();
        
        public void addKeyValue(String key, String value)
        {
            LauncherKeyValue kv = new LauncherKeyValue();
            kv.key = key;
            kv.value = value;
            keyValueList.add(kv);
        }
    }
    
    public class LauncherKeyValue
    {
        public String key;
        public String value;
    }
    
    public static void debug()
    {
        PSButtonLauncherController.getSettingConfig('a1C46000001Xy3FEAS');
    }
    
    @AuraEnabled
    public static String getRuntimeContext() {
        Map<String, String> contextMap = new Map<String, String>();
        
        contextMap.put('userId', UserInfo.getUserId());
        contextMap.put('userType', UserInfo.getUserType());
        contextMap.put('userFirstName', UserInfo.getFirstName());
        contextMap.put('userLastName', UserInfo.getLastName());
        contextMap.put('userName', UserInfo.getUserName());
        contextMap.put('orgName', UserInfo.getOrganizationName());
        
        if (Network.getNetworkId() != null)
        {
            contextMap.put('networkId', Network.getNetworkId());
            
            Network nw = [SELECT Name, UrlPathPrefix FROM Network WHERE Id = :Network.getNetworkId() LIMIT 1];   
            
            contextMap.put('networkName', nw.Name);
            contextMap.put('networkPrefix', '/' + nw.UrlPathPrefix);
        }
        
        return(JSON.serialize(contextMap));
    }
}