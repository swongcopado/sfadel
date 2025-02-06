public class demoStandardOmniscriptController {

    public demoStandardOmniscriptController(String OSType) {
        
    }
    
 @AuraEnabled
    public static OmniProcess demoOmniscript(String OSType) {

    LPI_Demo_Data__c[] scenarioSelected = [SELECT Demo_Scenario__c FROM LPI_Demo_Data__c WHERE Type__c = :OSType ORDER BY CreatedDate desc  LIMIT 1];
    
    LPI_Demo_Scenario__c[] omniscriptSelected = [SELECT OmniScript__c FROM LPI_Demo_Scenario__c WHERE Id = :scenarioSelected[0].Demo_Scenario__c LIMIT 1];
    
    Omniprocess[] omniscriptDetails = [SELECT Type, SubType, Language,VersionNumber from Omniprocess where Id = :omniscriptSelected[0].Omniscript__c LIMIT 1];
    
    return omniscriptDetails[0];
    
    }
  }