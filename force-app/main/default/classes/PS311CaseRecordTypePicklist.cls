global class PS311CaseRecordTypePicklist extends VisualEditor.DynamicPickList
{
    global override VisualEditor.DataRow getDefaultValue()
    {
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('', '');
        return defaultValue;
    }
    
    global override VisualEditor.DynamicPickListRows getValues() {
        
        VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();
        VisualEditor.DataRow value1 = new VisualEditor.DataRow('', '');
        myValues.addRow(value1);
        
        Map<String, Schema.RecordTypeInfo> recordTypes = Schema.SObjectType.Case.getRecordTypeInfosByName();
        for (String key : recordTypes.keySet())
        {
            Schema.RecordTypeInfo rti = (Schema.RecordTypeInfo)recordTypes.get(key);
            value1 = new VisualEditor.DataRow(key, '' + rti.recordtypeid);
            myValues.addRow(value1);
        }
        
        return myValues;
    }
}