@isTest 
private class TestImageUploadController_fk {
    static testMethod void testMethod1() {
        ImageUploadController_fk.saveTheFile('', 'Test', Blob.valueof('Test').toString(), 'image/png');
        ImageUploadController_fk.checkParentId(UserInfo.getUserId());
    }
}