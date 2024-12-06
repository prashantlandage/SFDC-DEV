import { LightningElement, track, api, wire } from 'lwc';
import LeadMarketingIcon from "@salesforce/resourceUrl/LeadMarketingIcon";
import LeadCustomerInfoIcon from "@salesforce/resourceUrl/LeadCustomerInfoIcon";
import LeadCustomerReqIcon from "@salesforce/resourceUrl/LeadCustomerReqIcon";
import LeadRecordInfoIcon from "@salesforce/resourceUrl/LeadRecordInfoIcon";
import LeadSourceIcon from "@salesforce/resourceUrl/LeadSourceIcon";
import LeadStatusIcon from "@salesforce/resourceUrl/LeadStatusIcon";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { deleteRecord } from "lightning/uiRecordApi";


import getQuote from "@salesforce/apex/QuoteController.getQuote";
import getQuoteStageActivities from "@salesforce/apex/QuoteController.getQuoteStageActivities";
import getQuoteAmenities from "@salesforce/apex/QuoteController.getQuoteAmenities";
import getQuoteComments from "@salesforce/apex/QuoteController.getQuoteComments";
import getQuoteHistory from "@salesforce/apex/QuoteController.getQuoteHistory";
import getApprovalProcessData from "@salesforce/apex/ApprovalProcessController.getApprovalProcessData";


export default class VerticalNavigationQuoteView extends NavigationMixin(LightningElement)
{
   
   //@api recordId = '0Q0Bh0000000kIzKAI';
   //@api recordId ='0Q0HF0000001Pu10AE';
   @api recordId='0Q0Bh0000000iAjKAI';
   record;
   quoteName;
   oppName;
   prjtName;
   quoteNo;
   quoteDate;
   formattedQDate;
   version;
   status;
   leadStage;
   edit = false;
   loading = true;

   //Action buttons in hightlight pannel
   @track showActions = true;
   //@track showPayButton = true;
   @track showCreateAmendmentButton = true;
   @track showCreateTempSwapQuoteButton = true;
   @track showReviseQuoteButton = true;
   @track showCreateBookingButton = false;
   @track showQuotePdfButton = true;

   //Inserting Screen flow in LWC Buttons

  // inputVariables;
   @track isReviseQuoteVisible = false;
   reviseQuoteFlowApiName = 'Revise_Quote';

   @track isStatusAccepted = false;
   @track isCreateBookingVisible = false;
   createBookingFlowApiName = 'New_Booking';

   @track isCreateTempSwapQuoteVisible = false;
   CreateTempSwapQuoteFlowApiName = 'Create_Temp_Swap_Quote';

   @track isCreateAmendmentQuoteVisible = false;
   

   isStageAccepted= false;

    @track leftPanelW = 94; 
    @track rightPanelW = 0;
    startX = 0;
    @track error;

    //Retaled tabs record datas
    @track quoteActivityData = [];
    @track quoteAmenityData =[];
    @track quoteCommentsData = [];
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
          label: "Quote Information",
          key: "QuoteInformation",
          src: LeadMarketingIcon,
          edit: true,
          fields: [
            { label: "Quote Name", fieldApiName :"Name", value: "" },
            { label: "Quote Number", fieldApiName :"QuoteNumber", value: "" },
            { label: "Version", fieldApiName :"Version__c", value: "" },
            { label: "Quote Date", fieldApiName :"Quote_Date__c", value: "" },
            { label: "Stage", fieldApiName :"Stage__c", value: "" },
            { label: "Opportunity Name",fieldApiName :"OpportunityId" , value: "" },
            { label: "Project", fieldApiName :"Project__c", value: "" },
            { label: "Phase", fieldApiName :"Phase__c", value: "" },
            { label: "Block", fieldApiName :"Block__c", value: "" },
            { label: "Floor", fieldApiName :"Floor__c", value: "" },
            { label: "Unit", fieldApiName :"Unit__c", value: "" },
            { label: "Status", fieldApiName :"Status", value: "" }
          ]
        },
        {
            label: "Quote Details",
            key: "QuoteDetails",
            icon: "standard:resource_preference",
            src: LeadCustomerReqIcon,
            edit: true,
            fields: [
                { label: "Offer", fieldApiName :"Offer__c",value: "" },
                { label: "Offered Price", fieldApiName :"Offered_Price__c", value: ""},
                { label: "Quote Price Incl. Amenities", fieldApiName :"Quote_Price_Incl_Amenities__c", value: "" },
                { label: "Discount Pct", fieldApiName :"Discount_Pct__c", value: "" },
                { label: "Discount Amount", fieldApiName :"Discount_Amount__c", value: "" },
                { label: "GST Pct", fieldApiName :"GST_Pct__c", value: "" },
                { label: "GST Amount", fieldApiName :"GST_Amount__c", value: "" },
                { label: "Discount Reason", fieldApiName :"Discount_Reason__c", value: "" },
                { label: "PMAY Applicable", fieldApiName :"PMAY_Applicable__c", value: "", checkbox: true },
                { label: "PMAY Amount", fieldApiName :"PMAY_Amount__c", value: ""},
                { label: "PMAY Pct", fieldApiName :"PMAY_Pct__c", value: ""},
                { label: "Total Amenity Cost", fieldApiName :"Total_Amenity_Cost__c", value: "" },
                { label: "Quote Price", fieldApiName :"Quote_Price__c", value: "" },
                { label: "Offered Price Incl. Amenities", fieldApiName :"Offered_Price_Incl_Amenities__c", value: "" },
                { label: "SBUA (Sqft)", fieldApiName :"SBUA_IN_Sqft__c", value: "" },
                { label: "Carpet Area (Sqft)", fieldApiName :"Carpet_Area_IN_Sqft__c", value: "" },
                { label: "Basic Unit Cost", fieldApiName :"Basic_Unit_Cost__c", value: "" },
                { label: "Unit Cost After Discount", fieldApiName :"Unit_Cost_After_Discount__c", value: "" },
                { label: "Charges Added", fieldApiName :"Charges_Added__c", value: "" },
                { label: "Total Unit Cost After Discount", fieldApiName :"Total_Unit_Cost_After_Discount__c", value: "" },
                { label: "Total Unit Cost", fieldApiName :"Total_Unit_Cost__c", value: "" },
                { label: "Maintenance Charges", fieldApiName :"Maintenance_Charges__c", value: "" },
                { label: "Grand Total Incl. Maintenance", fieldApiName :"Grand_Total_Incl_Maintenance__c", value: "" },
                { label: "Grand Total", fieldApiName :"Grand_Total__c", value: "" }               
            ]
          },
          {
            label: "Unit Information",
            key: "UnitInformation",
            icon: "standard:resource_preference",
            src: LeadSourceIcon,
            edit: true,
            fields: [
                { label: "Calculation Based On", fieldApiName :"Calculation_Based_On__c", value: ""},
                { label: "SBUA (Sqft)", fieldApiName :"SBUA_IN_Sqft__c", value: "" },
                { label: "Carpet Area (Sqft)", fieldApiName :"Carpet_Area_IN_Sqft__c", value: "" },
                { label: "Number Of Car Pakings", fieldApiName :"Number_Of_Car_Pakings__c", value: "" }, 
                { label: "Additional Car Parking (In No.)", fieldApiName :"No_Of_Additional_Car_Parking__c", value: "" },
                { label: "Total No. Of Car Parkings", fieldApiName :"Total_No_Of_Car_Parkings__c", value: "" },
                { label: "Car Parking Charges", fieldApiName :"Car_Parking_Charges__c", value: "" },
                { label: "Total Car Parking Charges", fieldApiName :"Total_Car_Parking_Charges__c", value: "" }
            ]
          },
          {
            label: "Overall Approval Information",
            key: "SystemInformation",
            icon: "standard:resource_preference",
            src: LeadStatusIcon,
            edit: true,
            fields: [
                //{ label: "Approval Criteria",fieldApiName : "Approval_Criteria__c", value: "" },
                { label: "Approval Status", fieldApiName :"Approval_Status__c", value: ""},
                { label: "Approval Level Type", fieldApiName :"Approval_Level_Type__c", value: ""}, 
                { label: "SH Approval", fieldApiName :"SH_Approval__c", value: "",checkbox: true },
                { label: "SH Approver", fieldApiName :"SH_Approver__c", value: "" },
                { label: "VP Approval", fieldApiName :"VP_Approval__c", value: "",checkbox: true },
                { label: "VP Approver", fieldApiName :"VP_Approver__c", value: "" },
                { label: "Admin Approval", fieldApiName :"Admin_Approval__c", value: "", checkbox: true },
                { label: "Admin Approver", fieldApiName :"Admin_Approver__c", value: ""}  
            ]
          },
          {
            label: "System Information",
            key: "SystemInformation",
            icon: "standard:resource_preference",
            src: LeadRecordInfoIcon,
            edit: true,
            fields: [
                { label: "Created By",fieldApiName : "CreatedById", value: "" },
                { label: "Creation Date", fieldApiName: "CreatedDate", value: "" },
                { label: "Last Modified By", fieldApiName :"LastModifiedById", value: ""},
                { label: "Modified Date", fieldApiName: "LastModifiedDate", value: "" }             
            ]
          }     
      ];


// 1.2. Display field value : Iterate through each section
  updateSectionsWithRecordValues() {
    for (let section of this.sections) {
      for (let field of section.fields) {
        if (this.record[field.fieldApiName] !== undefined) {
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


  @wire(getQuote, { quoteId: "$recordId" })
  wiredQuote({ error, data }) {
    if (data) {
      this.record = data;
      this.quoteName = this.record.Name.value;
      //this.quoteDate = this.record.Quote_Date__c.value;
      //this.formattedQDate = new Date(this.record.Quote_Date__c.value).toISOString().split('T')[0]; // Format date but it shows the previous day date
      let date = new Date(this.record.Quote_Date__c.value);
      this.quoteDate = date.toLocaleDateString(); // Format date to local date string
      //this.record.Quote_Date__c.value = this.quoteDate;
     // console.log('Raw date string from server:', quoteDate); // Log the date string
      if (this.record.QuoteNumber != undefined) {
        this.quoteNo = this.record.QuoteNumber.value;
      }
      
      if (this.record.Version__c != undefined) {
        this.version = this.record.Version__c.value;
      }
      if (this.record.OpportunityId != undefined) {
        this.oppName = this.record.OpportunityId.value;
      }
      if (this.record.Status != undefined) {
        this.status = this.record.Status.value;
      }
      if (this.record.Status != undefined) {
        this.leadStage = this.record.Status.value;
        if (
           this.record.Status.value == "Accepted"
        ) {
          this.showCreateBookingButton = true;
          this.isStatusAccepted=true;
          
        }
        
      } 
       if (
           this.record.Stage__c.value == "Accepted"
        ) {
          
          this.isStageAccepted = true;
        }
      console.log(this.record);
      this.updateSectionsWithRecordValues();
      this.loading = false;
    } else if (error) {
      this.loading = false;
    }
  }




      //Display records in datatable with actions in related tabs
      //1. Quote Stage Activity Datatable
      @track quoteActivityactions = [{ label: "View", name: "view" }];

      @track quoteActivityColumns = [
        {label: "Current Stage",fieldName: "Current_Stage__c",wrapText: true},
        {label: "Start",fieldName: "Activity_Start_Date__c",wrapText: true,type: "date",typeAttributes: {year: "numeric",month: "long",day: "2-digit",hour: "2-digit",minute: "2-digit"}},
        {label: "End",fieldName: "Activity_End_Date__c",wrapText: true,type: "date",typeAttributes: {year: "numeric",month: "long",day: "2-digit",hour: "2-digit",minute: "2-digit"}},
        {label: "Activity TAT", fieldName: "Activity_TAT__c", wrapText: true },
        {label: "Activity By", fieldName: "ActivityBy", wrapText: true },
        {type: "action",typeAttributes: {rowActions: this.quoteActivityactions}}];
           
        @wire(getQuoteStageActivities,{recId: "$recordId"})
        wiredQuoteActivity({ error, data }){ 
          if (data) {
            console.log('getQuoteStageActivities--->',JSON.stringify(this.data));
          this.quoteActivityData = JSON.parse(data);
          for (let field of this.quoteActivityData) {
            if (field.Activity_By__c != null) {
              field["ActivityBy"] = field.Activity_By__r.Name;
            }
          }
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

        @track quoteAmenityColumns = [
          {label: "Quote Amenity :AmenityHead",fieldName: "AmenityHead",wrapText: true},
          {label: "Quote Amenity : Base Value", fieldName: "Base_Value__c", wrapText: true },
          {label: "Quote Amenity : Type", fieldName: "Type__c", wrapText: true },
          {type: "action",typeAttributes: {rowActions: this.quoteAmenityactions}}];

          @wire(getQuoteAmenities,{recId: "$recordId"})
          wiredQuoteAmenity({ error, data }){ 
            console.log('rec Id',this.recordId);
            if (data) {
              console.log('getQuoteAmenities--->',JSON.stringify(this.data));
            this.quoteAmenityData = JSON.parse(data);
            for (let field of this.quoteAmenityData) {
              if (field.Amenity_Head__c != null) {
                field["AmenityHead"] = field.Amenity_Head__r.Name;
              }
            }
          } else if (error) {
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

         @track quoteCommentsColumns = [
           {label: "Quote Comments Name",fieldName: "QuoteCommentsName",wrapText: true},
           {label: "Version", fieldName: "Version__c", wrapText: true },
           {label: "Created Date", fieldName: "CreatedDate", wrapText: true, type: "date",typeAttributes: {year: "numeric",month: "long",day: "2-digit",hour: "2-digit",minute: "2-digit"} },
           {label: "Comments", fieldName: "Comments__c", wrapText: true },
           
           {type: "action",typeAttributes: {rowActions: this.quoteCommentactions}}];
 
           @wire(getQuoteComments,{recId: "$recordId"})
           wiredQuoteComments({ error, data }){ 
             if (data) {
               console.log('getQuoteComments--->',JSON.stringify(this.data));
             this.quoteCommentsData = JSON.parse(data);
             for (let field of this.quoteCommentsData) {
               if (field.Name != null) {
                 field["QuoteCommentsName"] = field.Name;
               }
             }
           } else if (error) {
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

         //4. Quote History Datatable : 
        @track quoteHistoryRowAction = [{ label: "View", name: "view" },{ label: "Delete", name: "delete" } ];

        @track quoteHistoryColumns = [
          {label: "Quote History Name",fieldName: "Name",wrapText: true},
          {label: "Quote Name", fieldName: "QuoteName", wrapText: true },
          {label: "Version", fieldName: "Version__c", wrapText: true },
          {label: "Quote No", fieldName: "Quote_No__c", wrapText: true },
          {label: "Quote Date",fieldName: "Quote_Date__c",wrapText: true },
          {label: "Project", fieldName: "ProjectName", wrapText: true },
          {label: "Phase", fieldName: "PhaseName", wrapText: true },
          {label: "Unit", fieldName: "UnitName", wrapText: true },
          {label: "Quote Price", fieldName: "Quote_Price__c", wrapText: true },
          {label: "Offered Price", fieldName: "Offered_Price__c", wrapText: true },
        
          {type: "action",typeAttributes: {rowActions: this.quoteHistoryRowAction}}];

          @wire(getQuoteHistory,{recId: "$recordId"})
          wiredQuoteHistory({ error, data }){ 
            if (data) {
            this.quoteHistoryData = JSON.parse(data);
            console.log('getQuoteHistory-->',JSON.stringify(this.data));
            for (let field of this.quoteHistoryData) {
               if (field.Quote_Date__c != null) {
                //field["Qdate"] = field.Quote_Date__c;
                let Qdate = String(field.Quote_Date__c).slice(0, 10);
                field["Quote_Date__c"] = Qdate.split("-").reverse().join("-");
              } 
              if (field.Quote__c != null) {
                field["QuoteName"] = field.Quote__r.Name;
              }
              if (field.Project__c != null) {
                field["ProjectName"] = field.Project__r.Name;
              }
              if (field.Phase__c != null) {
                field["PhaseName"] = field.Phase__r.Name;
            }
            if (field.Unit__c != null) {
                field["UnitName"] = field.Unit__r.Name;
            }
            }
          } else if (error) {
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
 
        //5. Quote Approval Process Datatable : 
        @track quoteApprovalProcessactions = [{ label: "View", name: "view"}];

        @track quoteApprovalProcessColumns = [
          { label: 'Step Name', fieldName: 'StepName', type: 'text' },
          { label: 'Status', fieldName: 'Status', type: 'text' },
          { label: 'Assigned To', fieldName: 'AssignedTo', type: 'text' },
          { label: 'Date', fieldName: 'CreatedDate', type: 'date', typeAttributes: {year: "numeric",month: "long",day: "2-digit",hour: "2-digit",minute: "2-digit"}  },
          
          {type: "action",typeAttributes: {rowActions: this.quoteApprovalProcessactions}}];

        @wire(getApprovalProcessData,{quoteId: "$recordId"})
          wiredQuoteApprovalHistory({ error, data }){ 
            if (data) {
              console.log('getApprovalProcessData-->',JSON.stringify(this.data));
            this.quoteApprovalProcessData = JSON.parse(data);
            this.error = undefined;
            /* for (let field of this.quoteApprovalProcessData) {
              if (field.StepName != null) {
                field["StepNames"] = field.StepName;
              }
            } */
          } else if (error) {
            this.error = error;
          this.quoteApprovalProcessData = undefined;
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

  //Create Amendment Quote
   handleCreateAmendmentButtonClick()
   {
   this.isCreateAmendmentQuoteVisible = true;
   }
   /*handleCreateAmendmentCloseButtonClick() 
   {
   this.isCreateAmendmentQuoteVisible = false;
   }*/
  handleCreateTempSwapQuoteButtonClick()
  {
    this.isCreateTempSwapQuoteVisible=true;
  }
  handleTempSwapCloseButtonClick() {
  this.isCreateTempSwapQuoteVisible = false;
  }

  //Create Booking : Flow
  handleCreateBookingButtonClick()
  {
    this.isStatusAccepted=true;
     this.isCreateBookingVisible = true;
    //  this[NavigationMixin.Navigate]({
    //   type: "standard__objectPage",
    //   attributes: {
    //     objectApiName: "Booking__c",
    //     actionName: "new",
    //   }
    // });
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
        alert('edit');
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
      
}