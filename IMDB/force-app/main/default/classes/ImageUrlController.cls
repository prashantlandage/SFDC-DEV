public class ImageUrlController 
{
    

    private static final String RECEIPE_API = 'https://api.spoonacular.com';
    private static final String API_KEY = 'b891273357254e74a3956e08dfcd6a3d';
    @AuraEnabled
    public Static String getImage(){

        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(RECEIPE_API+'/recipes/random?apiKey='+API_KEY);
        request.setMethod('GET');
        
        HttpResponse response = http.send(request);


        if (response.getStatusCode() == 200) {
            Blob image = response.getBodyAsBlob();
            String base64Image = EncodingUtil.base64Encode(image);
            
            // Return the image as a base64-encoded data URL
            return 'data:image/jpeg;base64,' + base64Image;
        } else {
            // Log error and return empty string if the response is invalid
            System.debug('Error: ' + response.getStatus());
            return '';
        }
    
    }

}