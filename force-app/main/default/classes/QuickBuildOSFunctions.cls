global class QuickBuildOSFunctions implements Callable
{
    /*
        inputs - arguments - List<Object> of passed in arguments
        output - result - The result of the Function being called. Supports single Object values, List<Object> or Map<String, Object>
    */
    
    public Object call(String action, Map<String, Object> args) {

        Map<String, Object> input = (Map<String, Object>)args.get('input');
        Map<String, Object> output = (Map<String, Object>)args.get('output');
        Map<String, Object> options = (Map<String, Object>)args.get('options');

        return invokeMethod(action, input, output, options);
    }
    
    global Boolean invokeMethod(String methodName, Map<String, Object> inputs, Map<String, Object> output, Map<String, Object> options)
    {
        if (methodName == 'formatOptions')
        {
            String finalResult = '';
            List<Object> argumentObjects = (List<Object>)inputs.get('arguments');
            if ((argumentObjects != null) && (argumentObjects.size() ==1)) {
                    
                String arguments = (String) argumentObjects[0];
                if (arguments != null) {
                    finalResult = finalResult + formatOptions(arguments);
                }
            }
            output.put('result', finalResult);
        }
        return true;
    }
 
    String formatOptions(String arguments)
    {
        String result = '';
        //system.debug('In here');
        String s = arguments;
        //system.debug('arguments ' + arguments);
        //system.debug('In here 2');
        List<String> filterLogicSplittedbySpace = s.split('\\|');
        Boolean FirstTime = true;
        for (String str : filterLogicSplittedbySpace){
            if (!FirstTime)
            {
                result = result + ',';
            }
            else
            {
                FirstTime = false;
            }
            result = result + '{"name":"'+str+'","value":"'+str+'","autoAdv":null}';
        }
        //system.debug('result ' + result);
        return result;
    }
}