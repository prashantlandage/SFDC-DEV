import { LightningElement, track, api, wire } from 'lwc';
import LeadMarketingIcon from "@salesforce/resourceUrl/LeadMarketingIcon";
import LeadCustomerInfoIcon from "@salesforce/resourceUrl/LeadCustomerInfoIcon";
import LeadCustomerReqIcon from "@salesforce/resourceUrl/LeadCustomerReqIcon";
import LeadRecordInfoIcon from "@salesforce/resourceUrl/LeadRecordInfoIcon";
import LeadSourceIcon from "@salesforce/resourceUrl/LeadSourceIcon";
import LeadStatusIcon from "@salesforce/resourceUrl/LeadStatusIcon";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getOpportunity from "@salesforce/apex/opportunityNavigationController.getOpportunity";
import getQuote from "@salesforce/apex/opportunityNavigationController.getQuote";
import getRevisits from "@salesforce/apex/opportunityNavigationController.getRevisits";

import getOpportunityComments from "@salesforce/apex/opportunityNavigationController.getOpportunityComments";

import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
import { RefreshEvent } from 'lightning/refresh';

export default class VerticalNavigationOpportunityViewNew extends NavigationMixin(LightningElement) {
   
    //@api recordId = '0Q0Bh0000000kIzKAI';
    //@api recordId ='0Q0HF0000001Pu10AE';
    @api recordId;
    record;
    accountName;
    oppName;
    closeDate;
    quoteNo;
    quoteDate;
    formattedQDate;
    version;
    status;
    leadStage;
    edit = false;
    loading = true;
    oppStage;
    @track leadid;
    //Action buttons in hightlight pannel
    @track showActions = true;
    //@track showPayButton = true;
    @track showFeedBackButton = true;
    @track showCreateQuoteButton = true;
    @track showScheduleRevisitButton = true;
    @track showUpdateStageButton = true;
    @track showAddCommentButton = true;

    openAddCommentBox = false;
 
    //Inserting Screen flow in LWC Buttons
 
   // inputVariables;
    @track isReviseQuoteVisible = false;
    
    reviseQuoteFlowApiName = 'Revise_Quote';
 
    //@track isStatusAccepted = false;
    @track isCreateBookingVisible = false;
    createBookingFlowApiName = 'Create_Booking';

    @track isCreateQuoteVisible = false;
    CreateQuoteFlowApiName ='Create_Quote';

    @track isUpdateStageVisible = false;
    updateStageFlowApiName ='Update_Opportunity_Stage';

    @track isFeedBackFormVisible = false;
    
 
     @track leftPanelW = 94; 
     @track rightPanelW = 0;
     startX = 0;
     @track error;
 
     //Retaled tabs record datas
     @track quoteData = [];
     @track revisitData =[];
     @track opportunityCommentsData = [];
     @track quoteHistoryData = [];
     @track quoteApprovalProcessData = [];
     @track fields = [];
 
 
     //For getting flow inside lwc
     get inputVariables() {
       return [
         {
           // Match with the input variable name declared in the flow.
           name: "recordId",
           type: "String",
           value: this.recordId,
         },
       ];
    }
 
 //Detail page : Displaying Label and values in detail page
 //1.1 Display Label, value with section label in Detail page 
     @track sections = [
         {
           label: "Opportunity Information",
           key: "OpportunityInformation",
           src: LeadMarketingIcon,
           edit: true,
           fields: [
             { label: "Opportunity Name", fieldApiName :"Name", value: "" },
             
             { label: "Close Date", fieldApiName :"CloseDate", value: "" },
             { label: "Stage", fieldApiName :"StageName", value: "" },
             { label: "Probability (%)", fieldApiName :"Probability", value: "" },
             { label: "Opportunity Owner",fieldApiName :"OwnerId" , value: "" },
             { label: "Opportunity Id", fieldApiName :"Opportunity_Id__c", value: "" },
             { label: "Account Name", fieldApiName :"AccountId", value: "" },
             { label: "Sales Head", fieldApiName :"Sales_Head__c", value: "" },
             { label: "Description", fieldApiName :"Description", value: "" },
             { label: "Closed Won Date", fieldApiName :"Closed_Won_Date__c", value: "" },
             { label: "Opportunity Age", fieldApiName :"Opportunity_Age__c", value: "" },
             { label: "Email", fieldApiName :"Email__c", value: "" },
             { label: "Alternate Email", fieldApiName :"Alternate_Email__c", value: "" },
             { label: "Phone No", fieldApiName :"Phone_No__c", value: "" },
             { label: "Alternate Phone No", fieldApiName :"Alternate_Phone_No__c", value: "" },
             { label: "Tele Caller Name", fieldApiName :"Tele_Caller_Name__c", value: "" },
             { label: "Internal Reference", fieldApiName :"Internal_Reference__c", value: "" },
             
             { label: "Is Walkin Lead", fieldApiName :"Is_Walkin_Lead__c", value: "" },
             { label: "Referral Eligible", fieldApiName :"Referral_Eligible__c", value: "" },
             { label: "Referral Name", fieldApiName :"Referral_Name__c", value: "" },
             { label: "Referral Percentage", fieldApiName :"Referral_Percentage__c", value: "" },
             { label: "Referral Invoice Amount", fieldApiName :"Referral_Invoice_Amount__c", value: "" },
             { label: "Project", fieldApiName :"Project__c", value: "" },
             { label: "Phase", fieldApiName :"Phase__c", value: "" },
             { label: "EmployeeId", fieldApiName :"EmployeeId__c", value: "" },
             { label: "Residing In Project", fieldApiName :"Residing_In_Project__c", value: "" },
             { label: "Residing In Unit", fieldApiName :"Residing_In_Unit__c", value: "" },
             { label: "Source Name", fieldApiName :"Source_Name__c", value: "" },
             { label: "Source Email", fieldApiName :"Source_Email__c", value: "" },
             { label: "Source Mobile No", fieldApiName :"Source_Mobile_No__c", value: "" },
             { label: "Source Company Name", fieldApiName :"Source_Company_Name__c", value: "" },
             { label: "Source RERA No", fieldApiName :"Source_RERA_No__c", value: "" },
             { label: "Walkin Form", fieldApiName :"Walkin_Form__c", value: "" },
             { label: "Campaign Channel", fieldApiName :"Campaign_Channel__c", value: "" },
             { label: "Campaign Vertical", fieldApiName :"Campaign_Vertical__c", value: "" },
             { label: "CampaignChannel", fieldApiName :"CampaignId", value: "" },
             { label: "CampaignVertical", fieldApiName :"CampaignVertical__c", value: "" },
             { label: "Mobile No", fieldApiName :"Mobile_No__c", value: "" },
             
             
           ]
         },
         {
             label: "Lead Information",
             key: "LeadInformation",
             icon: "standard:resource_preference",
             src: LeadCustomerReqIcon,
             edit: true,
             fields: [
              { label: "Converted From Lead", fieldApiName :"Converted_From_Lead__c", value: "" },
              { label: "Lead", fieldApiName :"Lead__c", value: "" },
              { label: "Lead Creation Date", fieldApiName :"Lead_Creation_Date__c", value: "" },
              { label: "Lead Source", fieldApiName :"LeadSource", value: "" }, 
             ]
           },
           {
             label: "Site Visit Information",
             key: "SiteVisitInformation",
             icon: "standard:resource_preference",
             src: LeadSourceIcon,
             edit: true,
             fields: [
              { label: "Site Visit", fieldApiName :"Site_Visit__c", value: "" },
              { label: "Site Visit Date", fieldApiName :"Site_Visit_Date__c", value: "" },
             ]
           },
           {
             label: "Channel Partner Information",
             key: "ChannelPartnerInformation",
             icon: "standard:resource_preference",
             src: LeadStatusIcon,
             edit: true,
             fields: [
              { label: "Channel Partner Eligible", fieldApiName :"Channel_Partner_Eligible__c", value: "" },
              { label: "Channel Partner Name", fieldApiName :"Channel_Partner_Name__c", value: "" },
              { label: "Channel Partner Percentage", fieldApiName :"Channel_Partner_Percentage__c", value: "" },
              { label: "Channel Partner Invoice Amount", fieldApiName :"Channel_Partner_Invoice_Amount__c", value: "" },
             ]
           },
           {
             label: "EOI Information",
             key: "EOIInformation",
             icon: "standard:resource_preference",
             src: LeadRecordInfoIcon,
             edit: true,
             fields: [
              { label: "EOI", fieldApiName :"EOI__c", value: "" },
              { label: "EOI Amount", fieldApiName :"EOI_Amount__c", value: "" },
              { label: "EOI Cheque No", fieldApiName :"EOI_Cheque_No__c", value: "" },   
              { label: "EOI Date", fieldApiName :"EOI_Date__c", value: "" },
              
             ]
           }
             
       ];
 
 
 // 1.2. Display field value : Iterate through each section
   updateSectionsWithRecordValues() {
     for (let section of this.sections) {
      console.log('section-->'+JSON.stringify(section));
       for (let field of section.fields) {
         if (this.record[field.fieldApiName] !== undefined) {
          console.log(this.record[field.fieldApiName],'-->',this.record[field.fieldApiName].value);
           if (
             this.record[field.fieldApiName].value == "false" &&
             this.record[field.fieldApiName].type == "check"
           ) {
             field.value = false;
             continue;
           }
           field.value = this.record[field.fieldApiName].value;
           if (this.record[field.fieldApiName].Id !== undefined) {
             field.Id = this.record[field.fieldApiName].Id;
             field.lookup = true;
           }
         }
       }
     }
   }
 
 
   @wire(getOpportunity, { opportunityId: "$recordId" })
   wiredOpportunity({ error, data }) {
     if (data) {
       this.record = data;
       console.log('opportunityRecord'+JSON.stringify(this.record));
       console.log('lead Id-->',this.record.Lead__c);
       console.log('telecaller-->',this.record.Tele_Caller_Name__c)

       this.leadid=this.record.Lead__c.Id;
       this.oppName = this.record.Name.value;
       if (this.record.AccountId != undefined) {
        this.accountName = this.record.AccountId.value;
      }
      let date = new Date(this.record.CloseDate.value);
      this.closeDate = date.toLocaleDateString();
      this.oppStage = this.record.StageName.value;
      this.updateSectionsWithRecordValues();
      this.loading = false;
     } else if (error) {
       this.loading = false;
     }
   }
 
       //Display records in datatable with actions in related tabs
       //1. Quote Stage Activity Datatable
       @track quoteActivityactions = [{ label: "View", name: "view" }];
 
       @track quoteColumns = [
         
         {label: "Quote Number",fieldName: "QuoteNumber",wrapText: true},
         //{label: "End",fieldName: "Activity_End_Date__c",wrapText: true,type: "date",typeAttributes: {year: "numeric",month: "long",day: "2-digit",hour: "2-digit",minute: "2-digit"}},
         //{label: "Activity TAT", fieldName: "Activity_TAT__c", wrapText: true },
         {label: "Project", fieldName: "Project", wrapText: true },
         {label: "Unit", fieldName: "Unit", wrapText: true },
         {label: "Offered Price", fieldName: "Offered_Price__c", wrapText: true },
         {label: "Version", fieldName: "Version__c", wrapText: true },
         {label: "Stage", fieldName: "Stage__c", wrapText: true },
         {type: "action",typeAttributes: {rowActions: this.quoteActivityactions}}];
            
         @wire(getQuote,{oppId: "$recordId"})
         wiredQuoteActivity({ error, data }){ 
           if (data) {
           this.quoteData = JSON.parse(data);
           
           for (let field of this.quoteData) {
             if (field.Project__c != null) {
               field["Project"] = field.Project__r.Name;
             }
             if (field.Unit__c != null) {
              field["Unit"] = field.Unit__r.Name;
            }
           }
           console.log('Quote Data For Related List:- '+ this.quoteData);
         } else if (error) {
         }
       }
         
         handleQuoteActivityRowAction(event) {
             let action = event.detail.action;
             let row = event.detail.row;
             switch (action.name) {
               case "view":
                 this[NavigationMixin.GenerateUrl]({
                   type: "standard__recordPage",
                   attributes: {
                     recordId: row.Id,
                     objectApiName: "Lead",
                     actionName: "view"
                   }
                 }).then((generatedUrl) => {
                   window.open(generatedUrl);
                 });
                 break;
 
                 /* case "delete": //Step-3.5 Dealing the delete
             this.deleteQuoteRelatedRecords(row.Id); //STEP-3.6 this.deleteRow will delete the entire object records. To delete a row hav to pass row as parameter
             break;
             default:
            break; */
             }
           }
           
           //2. Quote Amenity Datatable : 
         @track quoteAmenityactions = [{ label: "View", name: "view" }];
 
         @track revisitColumns = [
           {label: " Revisit Name",fieldName: "Name",wrapText: true},
           {label: "Project", fieldName: "Project__c", wrapText: true },
           {label: "Preferred Visit Date and Time", fieldName: "Preferred_Visit_Date_and_Time__c", wrapText: true ,type: "date",typeAttributes: {year: "numeric",month: "long",day: "2-digit",hour: "2-digit",minute: "2-digit"}},
           {label: "Revisit Type", fieldName: "Revisit_Type__c", wrapText: true },
           {label: "Transport Type", fieldName: "Transport_Type__c", wrapText: true },
           {label: "Status", fieldName: "Status__c", wrapText: true },
           {type: "action",typeAttributes: {rowActions: this.quoteAmenityactions}}];
 
           @wire(getRevisits,{oppId: "$recordId"})
           wiredQuoteAmenity({ error, data }){ 
             if (data) {
             this.revisitData = JSON.parse(data);
             console.log('revisitData For Related List:- '+ this.revisitData);
             /*for (let field of this.quoteAmenityData) {
               if (field.Amenity_Head__c != null) {
                 field["AmenityHead"] = field.Amenity_Head__r.Name;
               }
             }*/
           } else if (error) {
            console.log('Error => '+ JSON.stringify(error));
           }
         }
 
         handleQuoteAmenityRowAction(event) {
           let action = event.detail.action;
           let row = event.detail.row;
           switch (action.name) {
             case "view":
               this[NavigationMixin.GenerateUrl]({
                 type: "standard__recordPage",
                 attributes: {
                   recordId: row.Id,
                   objectApiName: "Lead",
                   actionName: "view"
                 }
               }).then((generatedUrl) => {
                 window.open(generatedUrl);
               });
               break;
 
               /* case "delete": //Step-3.5 Dealing the delete
             this.deleteQuoteRelatedRecords(row.Id); //STEP-3.6 this.deleteRow will delete the entire object records. To delete a row hav to pass row as parameter
             break;
             default:
            break; */
           }
         }
 
          //3. Quote Comments Datatable : 
          @track quoteCommentactions = [{ label: "View", name: "view" }];
 
          @track opportunityCommentsColumns = [
            {label: "Opportunity Comments Name",fieldName: "Name",wrapText: true},
            {label: "Comments", fieldName: "Comments__c", wrapText: true },
            {label: "Created Date", fieldName: "CreatedDate", wrapText: true, type: "date",typeAttributes: {year: "numeric",month: "long",day: "2-digit",hour: "2-digit",minute: "2-digit"} },
            {type: "action",typeAttributes: {rowActions: this.quoteCommentactions}}];
  
            @wire(getOpportunityComments,{oppId: "$recordId"})
            wiredQuoteComments({ error, data }){ 
              if (data) {
              this.opportunityCommentsData = JSON.parse(data);
              console.log('this.opportunityCommentsData => '+ this.opportunityCommentsData);
              /*for (let field of this.opportunityCommentsData) {
                if (field.Name != null) {
                  field["QuoteCommentsName"] = field.Name;
                }
              }*/
            } else if (error) {
              console.log('Error => '+ JSON.stringify(error));
            }
          }
         
           /*  @wire(getQuoteComments,{recId: "$recordId"})
            wiredQuoteComments({ error, data }){ 
              if (data) {
              this.quoteCommentsData = JSON.parse(data);
              for (let field of this.quoteCommentsData) {
                if (field.Name != null) {
                  field["QuoteCommentsName"] = field.Name;
                }
              }
            } else if (error) {
            }
          } */
  
          handlequoteCommentsRowAction(event) {
            let action = event.detail.action;
            let row = event.detail.row;
            switch (action.name) {
              case "view":
                this[NavigationMixin.GenerateUrl]({
                  type: "standard__recordPage",
                  attributes: {
                    recordId: row.Id,
                    objectApiName: "Lead",
                    actionName: "view"
                  }
                }).then((generatedUrl) => {
                  window.open(generatedUrl);
                });
                break;
                
               /*  
                case "delete": //Step-3.5 Dealing the delete
                this.deleteQuoteRelatedRecords(row.Id); //STEP-3.6 this.deleteRow will delete the entire object records. To delete a row hav to pass row as parameter
                break;
                default:
               break; */
                
            }
          }
 
          
         
 
         handlequoteHistoryRowAction(event) {
           let action = event.detail.action;
           let row = event.detail.row;
           switch (action.name) {
             case "view":
               this[NavigationMixin.GenerateUrl]({
                 type: "standard__recordPage",
                 attributes: {
                   recordId: row.Id,
                   objectApiName: "Quote_History__c",
                   actionName: "view"
                 }
               }).then((generatedUrl) => {
                 window.open(generatedUrl);
               });
               break;
             
           /* case "delete": //Step-3.5 Dealing the delete
             this.deleteQuoteRelatedRecords(row.Id); //STEP-3.6 this.deleteRow will delete the entire object records. To delete a row hav to pass row as parameter
             break;
             default:
            break; */
           }
         }
  
         
 
       
         handlequoteApprovalProcessRowAction(event) {
           const actionName = event.detail.action.name;
           const row = event.detail.row;
   
           if (actionName === 'view') {
               this.viewProcessInstance(row);
           }
       }
         viewProcessInstance(row) {
           // Assuming you have a processInstanceId in your row data (you might need to adjust this part)
           const processInstanceStepId  = row.ProcessInstanceStepId; // Adjust field name accordingly
           this[NavigationMixin.Navigate]({
               type: 'standard__recordPage',
               attributes: {
                   recordId: processInstanceStepId,
                   objectApiName: 'ProcessInstance',
                   actionName: 'view'
               }
           });
       } 
        
   
       /*   handlequoteApprovalProcessRowAction(event) {
           let action = event.detail.action;
           let row = event.detail.row;
           switch (action.name) {
             case "view":
               this[NavigationMixin.Navigate]({
                 type: "standard__recordPage",
                 attributes: {
                   recordId: row.Id,
                   objectApiName: "ProcessInstance",
                   actionName: "view"
                 }
               });
               break;
           }
         } */
   
  /* 
 
         //delete action
   deleteQuoteRelatedRecords(currentRow) {
     deleteRecord(currentRow)
       .then(() => {
         this.dispatchEvent(
           new ShowToastEvent({
             title: "Success",
             message: "Quote related record deleted successfully",
             variant: "success"
           })
         ); 
         setTimeout(() => {
           document.location.reload();
         }, 3000);
          
       })
       .catch((error) => {
         this.dispatchEvent(
           new ShowToastEvent({
             title: "Error deleting booking applicant",
             message: error.body.message,
             variant: "error"
           })
         );
       });
   }
  */
   
 
   //ACTION button dropdown
 
   handleActionMenuSelect(event) {
     const selectedAction = event.detail.value;
 
     switch (selectedAction) {
         case 'reviseQuote':
             this.handleReviseQuoteButtonClick();
             break;
         case 'createBooking':
             this.handleCreateBookingButtonClick();
             break;
         default:
             break;
     }
 }
 
 handleReviseQuoteButtonClick(){
   this.isReviseQuoteVisible = true;
 }
 handleCreateQuoteButtonClick(){
  this.isCreateQuoteVisible = true;
}
handleUpdateStageButtonClick(){
  this.isUpdateStageVisible = true;
}
handleFeedBackFormButtonClick(){
  this.isFeedBackFormVisible = true;
}

 handleCloseButtonClick() {
   this.isCreateQuoteVisible = false;
   this.isUpdateStageVisible = false;
   this.isFeedBackFormVisible = false
 }
 handleStatusChange(event) 
 {
 if (event.detail.status === 'FINISHED') 
 {
   this.isReviseQuoteVisible = false;
   window.setTimeout(() => {
     window.location.reload(true);
   }, 800);
 }
 
 }
  
 /* 
 //Revise Quote : Flow
     handleReviseQuoteButtonClick(){
             this.isReviseQuoteVisible = true;
         }
 
     handleCloseButtonClick() {
           this.isReviseQuoteVisible = false;
       }
 
     handleStatusChange(event) 
     {
       if (event.detail.status === 'FINISHED') 
         {
           this.isReviseQuoteVisible = false;
           window.setTimeout(() => {
             window.location.reload(true);
           }, 800);
       }
       
   }
  */
 
   //Create Booking : Flow
   handleCreateBookingButtonClick()
   {
     this.isCreateBookingVisible = true;
   }
   handleCreateBookingChange(event) {
     if (event.detail.status === 'FINISHED') {
         //this.isReviseQuoteVisible = false;
         this.isCreateBookingVisible = false;
     }
 
 } 
 
 //Quote PDF VF Page:
 
 handleQuotePdfButtonClick() {
   const url = `/apex/QuoteVfPage?id=${this.recordId}`;
         window.open(url, '_blank');
 }
 
           
         
 
 //Lookup fields in screen - navigation to the respective object
       navigateToRecord(event) {
         let objectapi = event.currentTarget.dataset.object;
         if (event.currentTarget.dataset.type == "user") {
           objectapi = "user";
         }
         this[NavigationMixin.Navigate]({
           type: "standard__recordPage",
           attributes: {
             recordId: event.currentTarget.dataset.lookupid,
             objectApiName: objectapi,
             actionName: "view"
           }
         });
       }
       
 //Screen width and scroll
       get leftPanelWidth() {
         let w = "width:" + this.leftPanelW + "%";
         return w;
       }
     
       get rightPanelWidth() {
         let w = "width:" + this.rightPanelW + "%";
         if (this.rightPanelW <= 2) {
           return "display:none";
         }
         return w;
       }
 
       handleScrollClick(event) {
         const spot = '[data-view="' + event.currentTarget.dataset.section + '"]';
         const topDiv = this.template.querySelector(spot);
         topDiv.scrollIntoView({
           behavior: "smooth",
           block: "start",
           inline: "nearest"
         });
       }
 
       relatedHandlerExpand() {
         this.rightPanelW = 100;
       }
     
       relatedHandlerContract() {
         this.leftPanelW = 100;
         this.rightPanelW = 0;
       }
 
       handleMouseDown(event) {
         this.startX = event.clientX;
         this.addEventListener("mousemove", this.handleMouseMove);
         this.addEventListener("mouseup", this.handleMouseUp);
       }
     
       handleMouseMove(event) {
         const diff = (100 * (event.clientX - this.startX)) / 800;
         this.leftPanelW += diff;
         this.rightPanelW -= diff;
         this.startX = event.clientX;
       }
     
       handleMouseUp() {
         this.removeEventListener("mousemove", this.handleMouseMove);
         this.removeEventListener("mouseup", this.handleMouseUp);
       }
 
 
  //Edit each fields inside field section of detail page:
       handleEdit(event) {
         //alert('edit');
         const currsection = event.currentTarget.dataset.id;
         for (let section of this.sections) {
           if (section.key === currsection) {
             for (let field of section.fields) {
               this.fields.push(field.fieldApiName);
             }
           }
         }
         this.edit = true;
       }   
 
       handleEditCancel() {
         this.edit = false;
         this.fields = [];
       }
 
       handleSubmit() {
         this.loading = true;
         getQuote({ quoteId: this.recordId })
           .then((result) => {
             this.record = result;
             this.updateSectionsWithRecordValues();
           })
           .catch((error) => {});
         this.handleEditCancel();
         this.dispatchEvent(
           new ShowToastEvent({
             title: "Success!!",
             message: "Record Updated Successfully!!",
             variant: "success"
           })
         );
         window.setTimeout(() => {
           window.location.reload(true);
         }, 800);
       }
       handleScheduleRevisitButtonClick() {
        const defaultValues = encodeDefaultFieldValues({
          Opportunity_Id__c: this.recordId,
          
        });

        //this.openRevisitModalBox=true;
        this[NavigationMixin.Navigate]({
          type: 'standard__objectPage',
          attributes: {
              objectApiName: 'Revisit__c',
              actionName: 'new'                
          },
          state : {
              
              defaultFieldValues:defaultValues
          }
        });
      }
      handleAddCommentButtonClick(){
        this.openAddCommentBox = true;
        
      }
      handleOppSubmit(event) {
        console.log('onsubmit event recordEditForm'+ event.detail.fields);
        const fields = event.detail.fields;
        fields.Opportunity__c = this.recordId;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
        this.dispatchEvent(new RefreshEvent());
        this.openAddCommentBox = false;
      }
      handleSuccess(event) {
        const evt = new ShowToastEvent({
          title: 'Success',
          message: 'Comment Added Successfully!',
          variant: 'success'

      });
      
      this.dispatchEvent(evt);
          this.openAddCommentBox = false;
      }
    handlenewClose(){
      this.openAddCommentBox = false;
    }
    handleError(event){
      let message = event.detail.detail;
      this.dispatchEvent(
        new ShowToastEvent({
            title: 'ERROR',
            message: message,
            variant: 'ERROR'
        }),
      );
    }
    handleOppCommentSubmit(event){
    event.preventDefault();
    const fields = event.detail.fields;
    this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
       
 }