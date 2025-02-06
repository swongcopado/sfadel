global class PSButtonLauncherSettingPicklist extends VisualEditor.DynamicPickList{
        global override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('', '');
        return defaultValue;
    }
    
    global override VisualEditor.DynamicPickListRows getValues() {
       
        VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();
        
        for (PSButtonLauncherSetting__c setting : [SELECT Id, Name__c FROM PSButtonLauncherSetting__c ORDER BY Name])
        {
            VisualEditor.DataRow value1 = new VisualEditor.DataRow(setting.Name__c, '' + setting.Id);
            myValues.addRow(value1);
        }
        
        return myValues;
    }
}