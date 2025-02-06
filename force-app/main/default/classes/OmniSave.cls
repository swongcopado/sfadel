global class OmniSave implements Callable {

    public Object call(String action, Map<String,Object> args)
    {
        Map<String,Object> input = (Map<String,Object>) args.get('input');
        Map<String,Object> output = (Map<String,Object>) args.get('output');
        Map<String,Object> options = (Map<String,Object>) args.get('options');

        invokeMethod(input, output, options);
        return null;
    }

    public Boolean invokeMethod(Map<String,Object> input, Map<String,Object> output, Map<String,Object> options){
      PublicSectrSltn.AssessmentResponses.storeResponses(input,output,options);
      return true;
    }
}