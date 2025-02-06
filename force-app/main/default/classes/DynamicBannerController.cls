public class DynamicBannerController {
    // Queries for the info of the current user
    @AuraEnabled(cacheable=true)
    public static List<User> getUser(String userId) {
        return [SELECT Id,
                FirstName,
                LastName,
                FullPhotoUrl
                FROM User
                WHERE Id = :userId
                LIMIT 1];
    }
    
    // Returns all active Dynamic_Content__c records
    // for a given Content_Type__c and Tag__c
    @AuraEnabled
    public static List<Dynamic_Content__c> getDynamicContentRecords(String ParamTag, String ParamContentType){
        if(String.isBlank(ParamTag)){
            // return all active records, no matter what the Tag is
            return [SELECT Content_Type__c,Flow_URL__c,Description__c,Icon__c,Title_Label__c,URL_Behavior__c FROM Dynamic_Content__c WHERE Content_Type__c LIKE :(ParamContentType + '%') AND Active__c = TRUE AND Tag__c = 'all' ORDER BY Display_Order__c ASC];
        }
        else {
            // return only the active records associated with the Tag
            return [SELECT Content_Type__c,Flow_URL__c,Description__c,Icon__c,Title_Label__c,URL_Behavior__c FROM Dynamic_Content__c WHERE Content_Type__c LIKE :(ParamContentType + '%') AND Active__c = TRUE AND (Tag__c =: ParamTag OR Tag__c = 'all') ORDER BY Display_Order__c ASC];
        }
    }
}