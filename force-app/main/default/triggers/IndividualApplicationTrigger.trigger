trigger IndividualApplicationTrigger on IndividualApplication (after update) {

    String procedureName = 'BenefitManagement_ProcessIndividualApplication';
    Map <String, Object> ipInput = new Map <String, Object> ();
    Map <String, Object> ipOutput = new Map <String, Object> ();
    Map <String, Object> ipOptions = new Map <String, Object> ();
    
    for(IndividualApplication ia : trigger.new){
        if(trigger.oldMap.get(ia.Id).status != ia.status && ia.status == 'Approved'){
            Flow.Interview.CreateBusinessLicenseFromLAPv2 myFlow;
            Map<String, Object> myMap = new Map<String, Object>();
            myMap.put('IARecordId', ia.Id);
            myFlow = new Flow.Interview.CreateBusinessLicenseFromLAPv2(myMap);
            myFlow.start();
        }
        
        /* Populating input map for an Integration Procedure. Follow whatever structure your VIP expects */
        if(ia.Status == 'Submitted' && ia.Category == 'Benefit') {
            String recordId = ia.Id;
            ipInput.put('RecordId', recordId);
        
            /* Call the IP via runIntegrationService, and save the output to ipOutput */
            ipOutput = (Map <String, Object>) omnistudio.IntegrationProcedureService.runIntegrationService(procedureName, ipInput, ipOptions);
        
            System.debug('IP Output: ' + ipOutput);
        }
    }
}