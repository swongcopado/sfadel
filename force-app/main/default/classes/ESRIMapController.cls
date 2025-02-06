public class ESRIMapController {



public String getReferer()
{
    return ApexPages.currentPage().getHeaders().get('referer');
}  


}