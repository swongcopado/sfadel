public class DynamicTasksCtrl {
    public DynamicTasksCtrl() {        
    }

    @AuraEnabled
    public static List<Task> dynamicTasks() {
        System.debug('dynamicTasks');
        
        // get users tasks
        List<Task> tsk = new List<Task>();
        
        //get user contact Id
        String userID  = UserInfo.getUserID();
        
        System.debug('userID [' + userID + ']');
        
        // need to get the Community Id based on URL prefix
        if(userID != null && userID != '') {
            Id taskRecordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByName().get('Dynamic Tasks').getRecordTypeId();
            System.debug('taskRecordTypeId [' + taskRecordTypeId + ']');
            System.debug('SOQL [SELECT ID, Subject, Description, Priority, Status, RecordTypeId, WhoId, OwnerId, DTask_Type__c, DTask_Flow_Name__c, ActivityDate, DTask_Link_URL__c, DTask_Link_Label__c FROM Task WHERE RecordTypeId =' + taskRecordTypeId + ' AND OwnerId = '+ userID + ' AND Status != Completed ORDER BY ActivityDate asc]');
            tsk  = [SELECT ID, Subject, Description, Priority, Status, RecordTypeId, WhoId, OwnerId, ActivityDate, DTask_Type__c, DTask_Flow_Name__c, DTask_Link_URL__c, DTask_Link_Label__c FROM Task WHERE RecordTypeId = :taskRecordTypeId AND OwnerId = :userID AND Status != 'Completed' ORDER BY ActivityDate asc];
            System.debug('tsk [' + tsk + ']');            
        }
        
        return tsk;
    } 

    @AuraEnabled
    public static String completeDynamicTasks(List<String> DynamicTasks) {
        System.debug('completeDynamicTasks');
        
        String errorMsg = '';
        
        // get list of tasks to complete
        List<Task> taskList = new List<Task>();
        
        //loop through tasks and set status to completed
        for(Task t : [SELECT Id, Status FROM Task WHERE Id IN: DynamicTasks]) {
            System.debug('t: [' + t + ']');
            t.Status = 'Completed';
            taskList.add(t);
        }
        update taskList;
        
        return errorMsg;        
    }

    @AuraEnabled
    public static String pathPrefix(){
        String pathPrefix = Site.GetPathPrefix();
        return pathPrefix;
    }
}