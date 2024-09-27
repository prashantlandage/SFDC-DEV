public with sharing class IMDBController
 {
   @AuraEnabled(cacheable=true)
   public static string getmovies( String searchtext){
    String responseBody;
        try {
            // Set the endpoint URL (replace with actual API URL)
            String endpoint = 'https://api.collectapi.com/imdb/imdbSearchByName?query='+searchtext;

            // Create HTTP request
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('GET');
            req.setHeader('authorization', 'apikey 4FfuNPRK6aC62ulHbLQodU:5PLfRRKvpJPA73KG3zeof6');  // Set your API key

            // Create HTTP client
            Http http = new Http();
            HttpResponse res = http.send(req);

            // Check for a successful response
            if (res.getStatusCode() == 200) {
                responseBody = res.getBody();  // JSON response
            } else {
                // Handle error responses
                responseBody = 'Error: ' + res.getStatusCode() + ' - ' + res.getStatus();
            }

        } catch (Exception e) {
            // Handle any exceptions
            responseBody = 'Exception: ' + e.getMessage();
        }
        return responseBody;
   }
}