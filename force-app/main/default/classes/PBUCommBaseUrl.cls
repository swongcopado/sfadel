public class PBUCommBaseUrl {
    
    public class CommunityInput{
        @InvocableVariable(required=true)
        public string CommunityName;
    }
    
    @InvocableMethod(label='Get Community Article Base URL')
    public static List<String> getCommunityArticleBaseUrl(List<CommunityInput> input)
    {
        List<Network> communityNetworks = [SELECT Id FROM Network WHERE Name = :input[0].CommunityName ];
        String sArticleBaseUrl = '';
        if (communityNetworks.size()>0)
        {
            Network communityNetwork = communityNetworks[0];
            String sLoginUrl = Network.getLoginUrl(communityNetwork.id);
            sArticleBaseUrl = sLoginUrl.replace('/login', '/article/');
            System.debug('MyDebug - Community Login URL: ' + sLoginUrl);
            System.debug('MyDebug - Article Base URL: ' + sArticleBaseUrl);
        }
        List<String> baseUrls = new List<String>();
        baseUrls.add(sArticleBaseUrl);
        return baseUrls;
    }
}