/**
 * This Class HTML Encodes a string.  Used for temporary Google Maps fix
 * 
 * @author Jeremy Blankenship (jblankenship@salesforce.com)
 * @version 1.0
 * 
 * History
 * =======
 * v1.0 - 09-26-2023 - Initial Version
 * 
 */
 global with sharing class PSSHTMLEncode implements Callable {
 
    public Object call(String action, Map<String, Object> args) {

        Map<String, Object> input = (Map<String, Object>)args.get('input');
        Map<String, Object> output = (Map<String, Object>)args.get('output');
        Map<String, Object> options = (Map<String, Object>)args.get('options');

        return invokeMethod(action, input, output, options);
    }
 
    global Boolean invokeMethod(String methodName, Map<String, Object> inputMap, Map<String, Object> outputMap, Map<String, Object> options) {

        if (methodName == 'encode') return encode(inputMap, outputMap, options);  
        
        return false;
    }
    
   
    private Boolean encode(Map<String, Object> inputMap, Map<String, Object> outputMap, Map<String, Object> options) {
        System.debug('Inside encode method');
        
        
        String InputString = (String) inputMap.get('InputString');
        
        System.debug('InputString is ' + InputString);
       
        String OutputString = EncodingUtil.URLENCODE(InputString,'UTF-8');
        
        outputMap.put('EncodedURL',OutputString);
        
        return true;
    }
    
    



 }