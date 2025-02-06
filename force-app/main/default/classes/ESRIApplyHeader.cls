public class ESRIApplyHeader 
{
    public ESRIApplyHeader()
    {
         Apexpages.currentPage().getHeaders().put('Content-Security-Policy', 'frame-ancestors https://*.force.com https://*.salesforce.com https://*.visualforce.com https://*.arcgis.com https://*.site.com; frame-src "self"');   
    }
}