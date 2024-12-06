import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateleadmergerequestRecord from '@salesforce/apex/LeadMergeReqController.updateleadmergerequestRecord';
import getmergerequests from '@salesforce/apex/LeadMergeReqController.getmergerequests';
import myStaticStyles from '@salesforce/resourceUrl/txtareacss';
import { loadStyle } from 'lightning/platformResourceLoader';
import { refreshApex } from '@salesforce/apex';

export default class Viewleadmergerequest extends LightningElement {
    @track leadMergeRecord = {
        MergeWithFirstName: '',
        MergeFromFirstName: '',
        MergeFromLastName: '',
        MergeWithLastName: '',

        MergeFromPhone: '',
        MergeWithPhone: '',
        MergeFromEmail: '',
        MergeWithEmail: '',
        MergeStatus: '',
        MergeReason: '',
        RequestBy: '',
        RequestDate: '',
        Approvedby: '',
        ApprovedDate: '',
        RejectedBy: '',
        RejectedDate: '',
        RejectedReason: '',
        MergeFromOwnerName: '', // New field for owner of the Merge From Lead
        MergeWithOwnerName: '',  // New field for owner of the Merge With Lead
        MergeFromSourceName: '',
        MergeWithSourceName: '',
    };

    @api recordId;
    ApprovalStatus;
    rejectreason;
    ApprovedSection;
    RejectedSection;
    isRejected;
    value = '';
    wiredMergeRequest;
    mergeFromId;
    mergeWithId;
    mergeFromName;
    mergeWithName;

    fromLeadLink;
    withLeadLink;
    mergestatus;
    Name = 'Lead Merge Request';

    get options() {
        return [
            { label: 'Approved', value: 'Approved' },
            { label: 'Rejected', value: 'Rejected' },
        ];
    }
    
    connectedCallback() {
        loadStyle(this, myStaticStyles); 
        
    }

    handleRequiredActions(event) {
        this.ApprovalStatus = event.detail.value;
        this.value = this.ApprovalStatus;
        console.log('selectedoption', this.ApprovalStatus);
        if (this.ApprovalStatus == 'Approved') {
           // this.isRequiredAction = true;
            //this.isShowModal=false;
            this.isRejected=false;
        }
        else if (this.ApprovalStatus == 'Rejected') {
            //this.isRequiredAction = true;
            this.isRejected=true;

        }

    }
    handlsave() {
        if (this.isInputValid()) {

            updateleadmergerequestRecord({ recId: this.recordId, Approvalstatus: this.ApprovalStatus, rejectreason: this.rejectreason })
            .then((result) => {
        
                console.log('approved',result);
                if(result=='Approved'){
                    const toastEvent = new ShowToastEvent({
                        title: 'Success!',
                        message: 'Merge request has been approved',
                        variant: 'success'
                    });
                    this.dispatchEvent(toastEvent);
                }
              else if(result=='Rejected'){
                const toastEvent = new ShowToastEvent({
                    title: 'Success!',
                    message: 'Merge request has been rejected',
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);
              }
              
                window.console.log('result', result);
                return refreshApex(this.wiredMergeRequest);
            })
       .catch((error) => {
        const toastEvent = new ShowToastEvent({
            title: 'Error!',
            message: error.message,
            variant: 'ERROR'
        });
        this.dispatchEvent(toastEvent);
 
       });
       
    }


}

handleCancel(){
    console.log('close');
    this.value = undefined;
    this.ApprovalStatus = undefined;
    this.rejectreason = null;
    this.isRejected = false;
    this.leadMergeRecord.RejectedReason = '';
    
}
    @wire(getmergerequests, { recID: '$recordId' })
    wiredMergeRequest(result) {
        this.wiredMergeRequest = result;
        if (result.data) {
            if (result.data.MergeWithFirstName) {
                this.leadMergeRecord.MergeWithFirstName = result.data.MergeWithFirstName;

            }
            if (result.data.MergeFromFirstName) {
                this.leadMergeRecord.MergeFromFirstName = result.data.MergeFromFirstName;
            }

            if (result.data.MergeFromLastName) {
                this.leadMergeRecord.MergeFromLastName = result.data.MergeFromLastName;
            }

            if (result.data.MergeWithLastName) {
                this.leadMergeRecord.MergeWithLastName = result.data.MergeWithLastName;
            }

            if (result.data.MergeFromPhone) {
                this.leadMergeRecord.MergeFromPhone = result.data.MergeFromPhone;
            }
            if (result.data.MergeWithPhone) {
                this.leadMergeRecord.MergeWithPhone = result.data.MergeWithPhone;
            }

            if (result.data.MergeFromEmail) {
                this.leadMergeRecord.MergeFromEmail = result.data.MergeFromEmail;
            }


            if (result.data.MergeWithEmail) {
                this.leadMergeRecord.MergeWithEmail = result.data.MergeWithEmail;
            }

            if (result.data.MergeStatus) {
                
                this.leadMergeRecord.MergeStatus = result.data.MergeStatus;
               if(this.leadMergeRecord.MergeStatus=='Pending'){
                    this.isPending=true;
               }
               else if(this.leadMergeRecord.MergeStatus=='Approved'){
                this.isPending=false;
                this.ApprovedSection=true;
           }
           else if(this.leadMergeRecord.MergeStatus=='Rejected'){
            this.isRejected = false;
            this.isPending=false;
            this.RejectedSection=true;
            
       }
            }

            if (result.data.MergeReason) {
                this.leadMergeRecord.MergeReason = result.data.MergeReason;
            }

            if(result.data.RequestBy){
                this.leadMergeRecord.RequestBy = result.data.RequestBy;
            }
            if(result.data.RequestDate){
                this.leadMergeRecord.RequestDate = result.data.RequestDate.slice(0, 10);
            }
            if(result.data.Approvedby){
                this.leadMergeRecord.Approvedby = result.data.Approvedby;
            }
            if(result.data.ApprovedDate){
                this.leadMergeRecord.ApprovedDate = result.data.ApprovedDate.slice(0, 10);
            }
            if(result.data.RejectedBy){
                this.leadMergeRecord.RejectedBy = result.data.RejectedBy;
            }
            if(result.data.RejectedDate){
                this.leadMergeRecord.RejectedDate = result.data.RejectedDate.slice(0, 10);
            }
            if(result.data.RejectedReason){
                this.leadMergeRecord.RejectedReason = result.data.RejectedReason;
            }

            if (result.data.MergeFromOwnerName) {
                this.leadMergeRecord.MergeFromOwnerName = result.data.MergeFromOwnerName; // New field for owner of the Merge From Lead
            }
            if (result.data.MergeWithOwnerName) {
                this.leadMergeRecord.MergeWithOwnerName = result.data.MergeWithOwnerName; // New field for owner of the Merge With Lead
            }
            if (result.data.MergeFromSourceName) {
                this.leadMergeRecord.MergeFromSourceName = result.data.MergeFromSourceName; // New field for owner of the Merge From Lead
            }
            if (result.data.MergeWithSourceName) {
                this.leadMergeRecord.MergeWithSourceName = result.data.MergeWithSourceName; // New field for owner of the Merge With Lead
            }

            if(result.data.MergeFromId)
                this.mergeFromId = result.data.MergeFromId
            if(result.data.MergeWithId)
                this.mergeWithId = result.data.MergeWithId   

                this.fromLeadLink = '/'+this.mergeFromId;
                this.withLeadLink = '/'+this.mergeWithId;
                this.mergeFromName = result.data.MergeFromName;
                this.mergeWithName = result.data.MergeWithName;
                this.mergestatus = result.data.MergeStatus;

            console.log('leadMergeRecord---->',JSON.stringify(this.leadMergeRecord));
            console.log('wiredMergeRequest---->',JSON.stringify(this.wiredMergeRequest));
            console.log('MergeWithOwnerName---->',this.MergeWithOwnerName);
            console.log('MergeFromOwnerName--->',this.MergeFromOwnerName);
            console.log('MergeFromSourceName--->',this.MergeFromSourceName);
            console.log('MergeWithSourceName--->',this.MergeWithSourceName);

        }
        else if (result.error) {
            console.log(result.error);
        }
    }

    isInputValid() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll(".form");


        console.log('Input Fields ==>', inputFields.length);
        inputFields.forEach((inputField) => {
            console.log('Inside');
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
                return isValid;
            }

        });


        console.log('Valid ==', isValid);
        return isValid;
    }
   
    handleRejectedReason(event) {
        this.leadMergeRecord.RejectedReason = event.target.value;
        this.rejectreason = event.target.value;
        console.log('Reason',event.target.value);
    }
    
  

}