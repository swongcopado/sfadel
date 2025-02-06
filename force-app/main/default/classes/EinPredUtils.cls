public without sharing class EinPredUtils {
    public static String getPrediction(String recId, String predDefId)
    {
        /*
        ConnectApi.SmartDataDiscoveryPredictInput inputRep = new ConnectApi.SmartDataDiscoveryPredictInput();
        inputRep.entityId = recId;
        inputRep.predictionDefinitionId = predDefId;
        */

        ConnectApi.SmartDataDiscoveryPredictInputRecords inputRep = new ConnectApi.SmartDataDiscoveryPredictInputRecords();
        inputRep.predictionDefinition = predDefId;
        inputRep.records = new List<Id>{recId};

        // using the connect api here - could be REST just as easilly
        ConnectApi.SmartDataDiscoveryPrediction predOut = ConnectApi.SmartDataDiscovery.predict(inputRep);
        System.debug('predOut=' + JSON.serializePretty(predOut));

        return '';
    }
}