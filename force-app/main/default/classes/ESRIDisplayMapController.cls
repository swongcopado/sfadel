public class ESRIDisplayMapController {
   
    public String CenterAddress {
        get {
            
            for(BusinessLicenseApplication c: landInfo) {
                CenterAddress = c.Account.BillingStreet + ',' + c.Account.BillingCity + ',' + c.Account.BillingState + ',' + c.Account.BillingPostalCode;
            }
            return CenterAddress;            
        } 
        set;
    }
    
    public String PolygonCoordinates {
        get {
            
            for(BusinessLicenseApplication c: landInfo) {
                PolygonCoordinates = c.Coordinates__c;
            }
            return PolygonCoordinates;            
        } 
        set;
    }
    
    public String TypeOfWork {
        get {
            
            for(BusinessLicenseApplication c: landInfo) {
                TypeOfWork = c.Type_of_Work__c;
            }
            return TypeOfWork;            
        } 
        set;
    }
    
    public String WorkEntity {
        get {
            
            for(BusinessLicenseApplication c: landInfo) {
                WorkEntity = c.Work_Entity_Information__c;
            }
            return WorkEntity;            
        } 
        set;
    }
    
    public String AccountName {
        get {
            
            for(BusinessLicenseApplication c: landInfo) {
                AccountName = c.Account.Name;
            }
            return AccountName;            
        } 
        set;
    }

    public List<BusinessLicenseApplication> landInfo {get; set;}
    
    public ESRIDisplayMapController() {
        // Get the BLA and Coordinates information
        landInfo = [SELECT Coordinates__c, Account.Name, Account.BillingStreet,Account.BillingState,Account.BillingCity,Account.BillingPostalCode,Type_of_Work__c, Work_Entity_Information__c FROM BusinessLicenseApplication  WHERE Id = :ApexPages.currentPage().getParameters().get('id')];
        System.debug('ESRIDisplayMapController: landInfo: [' + landInfo + ']');
    }
}