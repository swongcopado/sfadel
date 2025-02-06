trigger CaseGeocodeTrigger on Case (
  after insert,
  after update)
{
  ////////////////////////////////////////////////////////////////////////////////
  // this statement is needed to prevent recursive callback from @future method //
  ////////////////////////////////////////////////////////////////////////////////
  if(System.isFuture()) return;

  if (PSCheckRecursive.runOnce())
  {
    if (Trigger.isAfter)
    {
      /////////////////////////////////////
      // logic on initial record inserts //
      /////////////////////////////////////
      if (Trigger.isInsert)
      {
        for (Case rec : Trigger.new)
        {
          if (rec.Street__c != null && rec.Street__c.length() > 0 &&
              rec.City__c != null && rec.City__c.length() > 0 &&
              rec.State__c != null && rec.State__c.length() > 0 &&
              rec.Zip__c != null && rec.Zip__c.length() > 0)
          {
            PSGeoUtils.geocodeAddress(rec.Id, rec.Street__c, rec.City__c, rec.State__c, rec.Zip__c, 'Location__Latitude__s', 'Location__Longitude__s');
          }
        }
      }
      //////////////////////////////
      // logic for record updates //
      //////////////////////////////
      else if (Trigger.isUpdate)
      {
        for (Case rec : Trigger.new)
        {
          Case oldRec = Trigger.oldMap.get(rec.Id);
          
          if (rec.Street__c != oldRec.Street__c ||
              rec.City__c != oldRec.City__c ||
              rec.State__c != oldRec.State__c ||
              rec.Zip__c != oldRec.Zip__c)
          {
            PSGeoUtils.geocodeAddress(rec.Id, rec.Street__c, rec.City__c, rec.State__c, rec.Zip__c, 'Location__Latitude__s', 'Location__Longitude__s');
          }
        }
      }
    }

  }
}