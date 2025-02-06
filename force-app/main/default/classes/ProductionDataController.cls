public class ProductionDataController {
    public ProductionDataController() {

    }

    @AuraEnabled
    public static List<Food_Production__c> getFisheryData(String farmId, String year, String period){
        //Query data based on last year's data. AS of now,we may hardcode the farmID to retrieve specific set of records

        System.debug('farmId:'+farmId);
        System.debug('year:' + year);
        System.debug('period:'+period);
        //first attempt to see if there is draft data. 
        List<Food_Production__c> foodProductionList = [Select Id,Species_of_Fish__c,Fingerlings_Eggs_Species__c, Quantity__c,Transhipped__c,Unit_of_Measure__c,Average_Price__c,Food_Production_Submission__c,Food_Production_Submission__r.Year_of_Sale__c,Food_Production_Submission__r.Sale_Period__c FROM Food_Production__c WHERE Food_Production_Submission__r.Farm_Plot_Number__c =:farmId AND  Food_Production_Submission__r.Year_of_Sale__c =: year AND Food_Production_Submission__r.Sale_Period__c =: period AND  Food_Production_Submission__r.Status__c = 'Draft'];

        system.debug('Period is '+ period);
        //No Draft Data
       /* if(foodProductionList.isEmpty()){
            //Get previous year data. 
            Integer lastYear = Integer.valueOf(year); 
            lastYear = lastYear - 1; 
            year = String.valueOf(lastYear); 
            system.debug('Last year is '+ year );
            foodProductionList = [Select Species_of_Fish__c,Fingerlings_Eggs_Species__c, Quantity__c,Transhipped__c,Unit_of_Measure__c,Average_Price__c,Food_Production_Submission__c,Food_Production_Submission__r.Year_of_Sale__c,Food_Production_Submission__r.Sale_Period__c FROM Food_Production__c WHERE Food_Production_Submission__r.Farm_Plot_Number__c =:farmId AND  Food_Production_Submission__r.Year_of_Sale__c =: year AND Food_Production_Submission__r.Sale_Period__c =: period];
        }*/

        //Check if there is existing data in draft status for current period, if there are retrieve that to use these data
        //If there are no pending submission, then proceed to retrieve the data from the the same period last year 
        return foodProductionList; 
        
    }

    @AuraEnabled
    public static List<Food_Production__c> getPastFisheryData(String farmId, String year, String period){
        //Query data based on last year's data. AS of now,we may hardcode the farmID to retrieve specific set of records

        System.debug('farmId:'+farmId);
        System.debug('year:' + year);
        System.debug('period:'+period);

        //Get previous year data. 
        Integer lastYear = Integer.valueOf(year); 
        lastYear = lastYear - 1; 
        year = String.valueOf(lastYear); 
        system.debug('Last year is '+ year );
        List<Food_Production__c> foodProductionList = [Select Id,Species_of_Fish__c,Fingerlings_Eggs_Species__c, Quantity__c,Transhipped__c,Unit_of_Measure__c,Average_Price__c,Food_Production_Submission__c,Food_Production_Submission__r.Year_of_Sale__c,Food_Production_Submission__r.Sale_Period__c FROM Food_Production__c WHERE Food_Production_Submission__r.Farm_Plot_Number__c =:farmId AND  Food_Production_Submission__r.Year_of_Sale__c =: year AND Food_Production_Submission__r.Sale_Period__c =: period];
    
        //Check if there is existing data in draft status for current period, if there are retrieve that to use these data
        //If there are no pending submission, then proceed to retrieve the data from the the same period last year 
        return foodProductionList; 
        
    }

    @InvocableMethod(label='Get Default Quarter Year' description='To help with defaulting the quarter and year input')
    public static List<String> getDefaultYearPeriod(List<String> yearQtr){
        Date todayDate = date.today();
        Integer currentYearInt = todayDate.year();
        Integer currentMonthInt =  todayDate.month();
        Integer quarter; 
        String quarterStr = '';
        String yearStr = '';

        //adjust year and quarter if user input data on the last month of the year
        if(currentMonthInt == 12){
            currentYearInt = currentYearInt + 1;
            currentMonthInt = 1; 
            quarterStr = 'q1';
        }

        yearStr = String.valueOf(currentYearInt);

        quarter = (currentMonthInt+1)/3;
        if(quarter == 0)
            quarterStr = 'q1';
        else if(quarter == 1)
            quarterStr = 'q2';
        else if (quarter == 2)
            quarterStr = 'q3';
        else 
            quarterStr = 'q4';

        System.debug('current year is '+ yearStr);

        List<List<String>> nestedList = new List<List<String>>();
        List<String> returnData = new List<String>();
        //returnData.add(quarterStr); 
        //returnData.add(yearStr);
        nestedList.add(returnData);
        if(yearQtr[0] == 'year'){
            returnData.add(yearStr);
        }else{
            returnData.add(quarterStr); 
        }
        return returnData;
    }

    @AuraEnabled
    public static Boolean removeFoodProductRecord(Id productionId){
        Food_Production__c foodProductRecord = new Food_Production__c(Id = productionId);
        try{
            delete foodProductRecord; 
            return true; 
        }catch(Exception e){
            system.debug('Exception captured: ' + e.getMessage());
            return false;
        }
    }

    @AuraEnabled
    public static Boolean insertUpdateNewProductionRecords(String parendtId, List<Food_Production__c> insertProductionList, List<Food_Production__c> updateProductionList){
        try{
            system.debug('update data list'+updateProductionList);
           insert insertProductionList;
           update updateProductionList;
            return true; 
        }catch(Exception e){
            system.debug('Exception captured: ' + e.getMessage());
            return false;
        }
    }

    @AuraEnabled
    public static List<Supply_Chain__c> getSupplyChainData(String foodTracingId){
        //Query data based on last year's data. AS of now,we may hardcode the farmID to retrieve specific set of records

        //Get previous year data. 
        List<Supply_Chain__c> supplyChainData = [Select Id,Days_Since_Initiated__c,Reported_By__c, Reported_By__r.Name,Source_From__c, Source_From_Name__c,Supply_To__c, Supply_To_Name__c,Status__c, Quantity__c,Unit_of_Measure__c,Source_Confirmed__c,Supply_Confirmed__c,Is_End_Node__c, Timeliness__c, Food_Supply_Tracing__c FROM Supply_Chain__c WHERE Food_Supply_Tracing__c=: foodTracingId];
    
        //Check if there is existing data in draft status for current period, if there are retrieve that to use these data
        //If there are no pending submission, then proceed to retrieve the data from the the same period last year 
        return supplyChainData; 
        
    }

    //Product__c
    @AuraEnabled
    public static List<Food_Supply_Tracing__c> getFoodSupplyTracingData(String foodTracingId){
        //Query data based on last year's data. AS of now,we may hardcode the farmID to retrieve specific set of records

        //Get previous year data. 
        List<Food_Supply_Tracing__c> supplyChainData = [Select Id, Product__c,Affected_Lot_Number__c, Reason_for_Tracing__c,Status__c,Target_Completion_Date__c FROM Food_Supply_Tracing__c WHERE Id=: foodTracingId];
    
        //Check if there is existing data in draft status for current period, if there are retrieve that to use these data
        //If there are no pending submission, then proceed to retrieve the data from the the same period last year 
        return supplyChainData; 
        
    }

    @AuraEnabled
    public static List<Account> getAccountData(List<String> accountList){
        //Query data based on last year's data. AS of now,we may hardcode the farmID to retrieve specific set of records
        //String dynamicString = String.join(',', accountList.stream().map(p -> '\'' + p + '\'').collect(Collectors.toList()));

        //Get previous year data. 
        List<Account> accountRecords = [Select id, type, Name FROM Account WHERE Id IN: accountList];
    
        //Check if there is existing data in draft status for current period, if there are retrieve that to use these data
        //If there are no pending submission, then proceed to retrieve the data from the the same period last year 
        return accountRecords; 
        
    }

    
}