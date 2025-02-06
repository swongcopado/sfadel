/**
* This class is used by the CSVUtils class to parse and process a CSV file.  
* This class was adapted from https://nicocrm.wordpress.com/2011/03/06/parse-csv-file-in-salesforce-apex/
*
* Author Jeremy Blankenship (jblankenship@salesforce.com)
* @version 1.0
*/
public class SSSCsvReader {
    private String delim = ',';
    // the input data
    private String[] buffer;

    public SSSCsvReader(String data){
        this.buffer = data.split('\n');
    }
    
    public SSSCsvReader(String data, String delim){
        this.buffer = data.split('\n');
        this.delim = delim;
    }

    /**
    * Read and parse next available line. Return null if end of stream.
    */
    public String[] readLine(){
        if(buffer.size() == 0)
        return null;
        String line = this.buffer.remove(0);
        String[] parts = new String[] {};
        while(line != ''){
            Integer next = 0;
            if(line.startsWith('"')){
                line = line.substring(1); // strip initial
                Integer quoteIndex = findQuote(line, 0);
                while(quoteIndex == -1){
                    if(buffer.size() == 0){
                    // EOT!
                        quoteIndex = line.length();
                    } else {
                        // grab the next line
                        Integer skip = line.length();
                        line += '\n' + this.buffer.remove(0);
                        quoteIndex = findQuote(line, skip);
                    }
                }
                // advance to comma
                next = quoteIndex + 1;
                parts.add(line.substring(0, quoteIndex).replace('""', '"'));
            } else {
                next = line.indexOf(this.delim, next);
                if(next == -1)
                    next = line.length();
                // NB in Substring, "endindex" is the index of the character AFTER the last index to get
                //JB - Added to replace any line feeds from CSV
                parts.add(line.substring(0, next).replace('\r',''));
            }
            if(next == line.length() - 1)
                // case of a terminating comma.
                parts.add('');
                line = next < line.length() ? line.substring(next+1) : '';
            }
            if(parts.size() == 0)
                // empty string - we still want to return something...
                parts.add('');
                return parts;
            }
    
            static private Pattern quotePattern = Pattern.compile('(?<!")"(?!")');
            /**
            * Find next quote in the line
            */
            private Integer findQuote(String line, Integer skip){
                Matcher m = quotePattern.matcher(line);
                m.region(skip, m.regionEnd());
                if(!m.find())
                return -1;
                return m.start();
            }
}