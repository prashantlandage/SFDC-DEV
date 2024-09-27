import { LightningElement,api } from 'lwc';

export default class FileUploadLWC extends LightningElement 
{
    @api recordId;
    filedata;
    fileupload(event)
    {

        const file = event.target.files[0];
        //console.log(file);

        var reader = new FileReader();

        reader.onload = () => {
        var base64 = reader.result;
        this.filedata = {
        'filename': file.name,
        'base64': base64,
        'recordId': this.recordId  // Changed to camelCase
       };
    console.log(this.filedata.filename);
    //console.log(this.filedata.base64);
    console.log(recordId);
};

reader.readAsDataURL(file);

    }
}