public class demoOmniscriptController {

    public demoOmniscriptController(String OSType) {
        
    }
    
 @AuraEnabled
    public static String demoOmniscript(String OSType) {

    LPI_Demo_Data__c[] demoSelected = [SELECT demoselected__c FROM LPI_Demo_Data__c WHERE Type__c = :OSType ORDER BY CreatedDate desc  LIMIT 1];
    
    return demoSelected[0].demoselected__c;
    
    }
  }