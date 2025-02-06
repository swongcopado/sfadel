public with sharing class TroyTest {
   public static void test()
   {
    String clientId = '3MVG9KsVczVNcM8yeUebkgNHVpqW9UBn.UahHH_zP9OA43PruPPEC64hCbXjrbgfstopwXyPhmhNcDbSuT0gb';
    String clientSecret = '6D4E59050C3E661EFF2FB8C5EFB163F97ADD891E4AD070BBF2CE774711EAD55D';

    String username = '{!$Credential.Username}';
    String password = '{!$Credential.Password}';

    Http h = new Http();
    HttpRequest req = new HttpRequest();
    req.setEndpoint('callout:Lightning_Scheduler_API_User/services/oauth2/token');
    req.setMethod('POST');
    req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.setBody('grant_type=password&client_id='+clientId+'&client_secret='+clientSecret+'&username={!$Credential.Username}&password={!$Credential.Password}');
    //req.setBody('grant_type=password&client_id='+clientId+'&client_secret='+clientSecret+'&username=' + username + ' &password=' + password);
    
    //req.setBody('grant_type=password&client_id=' + clientId + '&client_secret=' + clientSecret + '&username=contributor@pbuido.demo&password=Admin123');
    HttpResponse res = h.send(req);
    System.debug('resp=' + res.getBody());
    Map<String, Object> responseJson = (Map<String, Object>)JSON.deserializeUntyped(res.getBody());
    string access_token = (string)responseJson.get('access_token');  

   }
}