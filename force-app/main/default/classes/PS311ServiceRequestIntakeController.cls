public without sharing class PS311ServiceRequestIntakeController
{
    public PS311ServiceRequestIntakeController()
    {
        
    }
    
    @AuraEnabled
    public static String reverseGeocodeEsri(Decimal lat, Decimal lng)
    {
        System.debug('reverseGeocodeEsri invoked...');
        
        return PSGeoUtils.reverseGeocodeEsri(lat, lng);
    }
    
    @AuraEnabled
    public static List<String> getTypeOptions(String myDomain, String recordTypeId)
    {
        List<String> retList = new List<String>();
        retList.add('');
        
        if (recordTypeId == null || recordTypeId.length() == 0)
        {
            Schema.DescribeFieldResult fieldResult = Case.Type.getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            
            for ( Schema.PicklistEntry f : ple)
            {
                retList.add(f.getLabel());
            }
        }
        else
        {
            String queryStr = 'https://' + myDomain + '.my.salesforce.com/services/data/v41.0/ui-api/object-info/Case/picklist-values/' + recordTypeId + '/Type';
            System.debug('queryStr=' + queryStr);
            
            // setup the REST API call
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint(queryStr);
            request.setMethod('GET');
            //request.setHeader('Content-Type', 'application/json');
            request.setTimeout(120000);   // 2 minute (maximum that can be set)
            request.setHeader('Authorization','Bearer '+UserInfo.getSessionID());   
            
            // query the IBM Watson service
            HttpResponse response = http.send(request);
            System.debug('body=' + JSON.serialize(response.getBody()));
            PicklistTypeResponse ptr = (PicklistTypeResponse)JSON.deserialize(response.getBody(), PicklistTypeResponse.class);
            
            for (PicklistValueResponse val : ptr.values)
            {
                retList.add(val.value);
            }
        }
        
        retList.sort();
        return retList;
    }
    
    @AuraEnabled
    public static String getUserInfo()
    {
        System.debug('getUserInfo invoked...');
        
        PSResponse resp = new PSResponse();
        
        Id userId = UserInfo.getUserId();
        try
        {
            User u = [SELECT Id, ContactId, MobilePhone, Phone, Email
                      FROM User
                      WHERE Id = :userId LIMIT 1];
            
            if (u != null && u.ContactId != null)
            {
                Contact c = [SELECT Id, Email, MobilePhone, HomePhone
                             FROM Contact
                             WHERE Id = :u.ContactId LIMIT 1];
                
                Map<String, Object>respMap = new Map<String, Object>();
                respMap.put('UserId', userId);
                respMap.put('ContactId', u.ContactId);
                respMap.put('FirstName', UserInfo.getFirstName());
                respMap.put('LastName', UserInfo.getLastName());
                respMap.put('Email', c.Email);
                if (c.MobilePhone != null)
                {
                    respMap.put('Phone', formatPhone(c.MobilePhone));
                }
                else
                {
                    respMap.put('Phone', formatPhone(c.HomePhone));
                }
                
                resp.data = respMap;
            }
            else if (u != null && u.ContactId == null)
            {
                Map<String, Object>respMap = new Map<String, Object>();
                respMap.put('UserId', userId);
                respMap.put('ContactId', u.ContactId);
                respMap.put('FirstName', UserInfo.getFirstName());
                respMap.put('LastName', UserInfo.getLastName());
                respMap.put('Email', u.Email);
                if (u.MobilePhone != null)
                {
                    respMap.put('Phone', formatPhone(u.MobilePhone));
                }
                else
                {
                    respMap.put('Phone', formatPhone(u.Phone));
                }
                
                resp.data = respMap;
            }
            else
            {
                resp.status = PSResponse.ERROR;
                resp.msg = 'User was not found!';
            }
        }
        catch (exception e)
        {
            resp.status = PSResponse.ERROR;
            resp.msg = 'User was not found!';
        }
        
        return  JSON.serialize(resp);
    }
    
    @AuraEnabled
    public static String saveCase(String params)
    {
        System.debug('saveCase invoked...');
        Map<String, String> paramMap = (Map<String, String>)JSON.deserialize(params,   Map<String, String>.class);
        PSResponse resp = new PSResponse();
        
        try
        {
            
            Case c = new Case();
            c.Subject = paramMap.get('type') + ' submitted!';
            c.Description = paramMap.get('description');
            c.Type = paramMap.get('type');
            c.Sub_Type__c = paramMap.get('subtype');
            
            if (paramMap.get('latitude') != null && paramMap.get('longitude') != null)
            {
                c.Location__Latitude__s = Decimal.valueOf(paramMap.get('latitude'));
                c.Location__Longitude__s = Decimal.valueOf(paramMap.get('longitude'));
            }
            
            if (paramMap.get('address') != null && paramMap.get('addressField') != null && paramMap.get('addressField').length() > 0)
            {
                c.put(paramMap.get('addressField'), paramMap.get('address'));
            }
            
            if (paramMap.get('street') != null && paramMap.get('streetField') != null && paramMap.get('streetField').length() > 0)
            {
                c.put(paramMap.get('streetField'), paramMap.get('street'));
                //c.Street__c = paramMap.get('street');
            }
            if (paramMap.get('city') != null && paramMap.get('cityField') != null && paramMap.get('cityField').length() > 0)
            {
                c.put(paramMap.get('cityField'), paramMap.get('city'));
                //c.City__c = paramMap.get('city');
            }
            if (paramMap.get('state') != null && paramMap.get('stateField') != null && paramMap.get('stateField').length() > 0)
            {
                c.put(paramMap.get('stateField'), paramMap.get('state'));
                //c.State__c = paramMap.get('state');
            }
            if (paramMap.get('postal') != null && paramMap.get('postalField') != null && paramMap.get('postalField').length() > 0)
            {
                c.put(paramMap.get('postalField'), paramMap.get('postal'));
                //c.Zip__c = paramMap.get('postal');
            }  
            
            if (paramMap.get('anonymousFlag') == 'false' && paramMap.get('contactId') != null && paramMap.get('contactId').length() > 0)
            {
                c.ContactId = paramMap.get('contactId');
            }
            else if (paramMap.get('anonymousFlag') == 'false' && paramMap.get('firstName') != null && paramMap.get('lastName') != null)
            {
                List<Contact> conList = [SELECT Id FROM Contact WHERE email = :paramMap.get('email') LIMIT 1];
                Contact con;
                
                if (conList == null || conList.size() == 0)
                {
                    con = new Contact();
                    con.FirstName = paramMap.get('firstName');
                    con.LastName = paramMap.get('lastName');
                    con.Email = paramMap.get('email');
                    con.Phone = paramMap.get('phone');
                    
                    insert con;
                }
                else {
                    con = conList[0];
                }
                
                c.ContactId = con.Id;
            }
            
            String recordTypeId = paramMap.get('recordTypeId');
            if (recordTypeId != null && recordTypeId.length() > 0)
            {
                c.put('RecordTypeId',recordTypeId);
            }
            
            System.debug('case=' + JSON.serializePretty(c));
            insert c;
            
            Map<String, Object>respMap = new Map<String, Object>();
            respMap.put('Id', c.Id);
            resp.data = respMap;
        }
        catch (exception e)
        {
            resp.status = PSResponse.ERROR;
            resp.msg = e.getMessage();
        }
        
        return  JSON.serialize(resp);
    }
    
    private static String formatPhone(String Phone)
    {
        if (Phone == null) return null;
        
        string nondigits = '[^0-9]';
        string PhoneDigits;
        
        // remove all non numeric
        PhoneDigits = Phone.replaceAll(nondigits, '');
        
        // 10 digit: reformat with dashes
        if (PhoneDigits.length() == 10)
            return PhoneDigits.substring(0, 3) + '-' +
            PhoneDigits.substring(3, 6) + '-' +
            PhoneDigits.substring(6, 10);
        // 11 digit: if starts with 1, format as 10 digit
        if (PhoneDigits.length() == 11)
        {
            if (PhoneDigits.substring(0, 1) == '1')
            {
                return  PhoneDigits.substring(1, 4) + '-' +
                    PhoneDigits.substring(4, 7) + '-' +
                    PhoneDigits.substring(7, 11);
            }
        }
        
        
        // if it isn't a 10 or 11 digit number, return the original because
        // it may contain an extension or special information
        return ( Phone );
    }
    
    @AuraEnabled
    public static List<String> getSubTypeOptions(String type)
    {
        return PSMetaUtils.GetDependentOptions('Case', 'Type', 'Sub_Type__c', type);
    }
    
    @AuraEnabled
    public static List<String> getPriorityOptions()
    {
        Schema.DescribeFieldResult fieldResult = Case.Priority.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        
        List<String> retList = new List<String>();
        retList.add('');
        
        for ( Schema.PicklistEntry f : ple)
        {
            retList.add(f.getLabel());
        }
        
        retList.sort();
        return retList;
    }
    
    public class PicklistTypeResponse
    {
        public List<PicklistValueResponse> values;
    }
    
    public class PicklistValueResponse
    {
        public String label;
        public String value;
    }
}