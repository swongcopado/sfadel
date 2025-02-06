public without sharing class ImageUploadController_fk
{

  @AuraEnabled
  public static String checkParentId(String parentId)
  {
    String errMessage;
    try
    {
      if (parentId == '') return '';
      Savepoint sp = Database.setSavepoint();
      sObject post = Schema.getGlobalDescribe().get('FeedItem').newSObject();
      post.put('ParentId', parentId);
      post.put('Body', 'Test');
      if (Network.getNetworkId() != null)
      {
        post.put('NetworkScope', Network.getNetworkId());
      }
      Insert post;
      Database.rollback(sp);
      errMessage = '';
    }
    catch (Exception ex)
    {
      errMessage = ex.getMessage();
    }
    return errMessage;
  }
  @AuraEnabled
  public static String saveTheFile(String parentId, String fileName, String base64Data, String contentType)
  {
    String message;
    try
    {
      base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
      if (parentId == null || parentId == '') parentId = UserInfo.getUserId();

      System.debug('name=' + UserInfo.getName());
      System.debug('userId=' + UserInfo.getUserId());
      System.debug('userType=' + UserInfo.getUserType());

      if (UserInfo.getUserType() == 'Guest')
      {
        Attachment attachment = new Attachment();
        attachment.Body = EncodingUtil.base64Decode(base64Data);
        attachment.Name = fileName;
        attachment.ParentId = parentId;

        insert attachment;
      }
      else
      {
        sObject post = Schema.getGlobalDescribe().get('FeedItem').newSObject();
        post.put('ParentId', parentId);
        post.put('ContentData', EncodingUtil.base64Decode(base64Data));
        post.put('ContentFileName', fileName);
        post.put('Visibility', 'AllUsers');
        //if (Network.getNetworkId() != null)
        //{
        //  post.put('NetworkScope', Network.getNetworkId());
        //}
        Insert post;
      }

      message = 'Image Uploaded!';
      //message = 'name=' + UserInfo.getName() + ' userId=' + UserInfo.getUserId() + ' userType=' + UserInfo.getUserType();
    }
    catch (Exception ex)
    {
      message = ex.getMessage();
    }
    return message;
  }
}