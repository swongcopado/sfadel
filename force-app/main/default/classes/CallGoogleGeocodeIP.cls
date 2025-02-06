/**
 * This calls the GoogleMaps Geocode Integration Procedure.  
 * Couldn't get the InvokeIP function to work so using this as alternative
 * 
 * @author Jeremy Blankenship (jblankenship@salesforce.com)
 * @version 1.0
 * 
 * History
 * =======
 * v1.0 - 09-26-2023 - Initial Version
 * 
 */
global without sharing class CallGoogleGeocodeIP implements Callable{

    public Object call(String action, Map<String, Object> args) {

        Map<String, Object> input = (Map<String, Object>)args.get('input');
        Map<String, Object> output = (Map<String, Object>)args.get('output');
        Map<String, Object> options = (Map<String, Object>)args.get('options');

        return invokeMethod(action, input, output, options);
    }
 
    global Boolean invokeMethod(String methodName, Map<String, Object> inputMap, Map<String, Object> outputMap, Map<String, Object> options) {

        if (methodName == 'CallIP') return CallIP(inputMap, outputMap, options);  
        
        return false;
    }

    private Boolean CallIP(Map<String, Object> inputMap, Map<String, Object> outputMap, Map<String, Object> options) {
        List<Object> argumentObjects = (List<Object>)inputMap.get('arguments');
        
        String PlaceId = (String) argumentObjects[0];

        String procedureName = 'GoogleMaps_Geocode';
        Map<String, Object> ipInput = new Map<String, Object> ();
        Map<String, Object> ipOutput = new Map<String, Object> ();
        Map<String, Object> ipOptions = new Map<String, Object> ();
        
        ipInput.put('PlaceId', PlaceId);
        
        /* Call the IP via runIntegrationService, and save the output to ipOutput */
        ipOutput = (Map<String, Object>) omnistudio.IntegrationProcedureService.runIntegrationService(procedureName, ipInput, ipOptions);
        
        outputMap.put('result',ipOutput);
        
        return true;
    }
}