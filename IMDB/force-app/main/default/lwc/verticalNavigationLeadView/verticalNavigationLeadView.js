/* eslint-disable no-unused-vars */
import { LightningElement, api, track, wire } from "lwc";
import getLeads from "@salesforce/apex/LeadPageController.getLeads";
import getSiteVisits from "@salesforce/apex/SiteVisitsController.getSiteVisitList";
import getMergedLeads from "@salesforce/apex/LeadMergeReqController.getLeadMergeRequests";
import getSecLeads from "@salesforce/apex/LeadController.getSecondaryLeadList";
import getDupLeads from "@salesforce/apex/LeadController.getDuplicateLeadList";
import getleadActivities from "@salesforce/apex/LeadController.getStageActivities";
import getWalkInList from "@salesforce/apex/WalkInController.getWalkInList";
import LeadMarketingIcon from "@salesforce/resourceUrl/LeadMarketingIcon";
import LeadCustomerInfoIcon from "@salesforce/resourceUrl/LeadCustomerInfoIcon";
import LeadCustomerReqIcon from "@salesforce/resourceUrl/LeadCustomerReqIcon";
import LeadRecordInfoIcon from "@salesforce/resourceUrl/LeadRecordInfoIcon";
import LeadSourceIcon from "@salesforce/resourceUrl/LeadSourceIcon";
import LeadStatusIcon from "@salesforce/resourceUrl/LeadStatusIcon";
import lockLeadEligibility from "@salesforce/apex/LeadController.lockLeadEligibility";
import sendpricesheetpdf from "@salesforce/apex/sendemailwithattachment.sendDocuAttach";
import getfiledata from "@salesforce/apex/pricesheetcontroller.getPricesheetpdfdata";
import getRelatedSiteVisits from "@salesforce/apex/LeadController.getRelatedSiteVisits";
import sendwalkinform from "@salesforce/apex/walkinformcontroller.sendwalkinformlink";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import LightningConfirm from "lightning/confirm";
import { refreshApex } from '@salesforce/apex';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
export default class LeadView extends NavigationMixin(LightningElement) {
  image;
  wiredLeadResult; // Stores the result to use with refreshApex
  @api recordId;
  projectId;

  record;
  edit = false;
  relatedEdit = false;
  relatedId;
  relatedObject;
  related = true;
  dragging = false;
  startX = 0;
  LeadRecId;
  leadClassification;
  leadName;
  leadPhone;
  leadEmail;
  leadProject;
  leadSource;
  siteAction = true;
  siteCompleteAction = true;
  leadStatus;
  lead;
  loading = true;
  mergeLead = false;
  changeOwner = false;
  eligibilityModal = false;
  siteVisitModal = false;
  @track showModal;
  @track cancelSiteVisitModal;
  @track completeSiteVisitModal;
  @track invoiceSiteVisitModal;
  @track rescheduleSiteVisitModal;
  @track reassignSiteVisitModal;
  @track rescheduleSiteVisitModal;
  siteVisitId;
  showActions = false; //To show actions dropdown
  sendPriceSheet = false; //To show the Send Price Sheet Button
  ContentDocuId = "";
  ContentVersId = "";

  @track siteVisitData = [];
  @track secLeadData = [];
  @track dupLeadData = [];
  @track mergeLeadData = [];
  @track leadActivityData = [];
  @track walkInData = [];
  @track valueMap = [];
  @track leftPanelW = 94;
  @track rightPanelW = 0;
  @track fields = [];
  fieldlablename = 'Source';


  @track relatedFields = [];

  @track sitevisitactions = [
    { label: "View", name: "view" },
    { label: "Edit", name: "edit" },
    { label: "Reassign", name: "reassign" },
    // { label: "Mark as Complete", name: "complete" },
    { label: "Reschedule", name: "reschedule" },
    { label: "Update Invoice Details", name: "updateinvoice" },
    { label: "Cancel", name: "cancel" }
  ];

  @track walkInActions = [{ label: "View", name: "view" }];

  @track mergeleadactions = [{ label: "View", name: "view" }];

  @track secleadactions = [{ label: "View", name: "view" }];

  @track dupleadactions = [{ label: "View", name: "view" }];

  @track leadactivityactions = [{ label: "View", name: "view" }];

  @track siteVisitColumns = [
    { label: "Project Name", fieldName: "projectName", wrapText: true },
    { label: "Sales Manager", fieldName: "SM", wrapText: true },
    { label: "Visit Date & Time", fieldName: "VisitDateTime", wrapText: true },
    {
      label: "Transport & Pickup Details",
      fieldName: "TransportDetails",
      wrapText: true,
      initialWidth: 200
    },
    { label: "Status", fieldName: "Status__c" },
    {
      type: "action",
      typeAttributes: {
        rowActions: this.sitevisitactions
      }
    }
  ];

  @track walkInColumns = [
    { label: "Name", fieldName: "Name", wrapText: true },
    {
      label: "Details",
      fieldName: "Detail",
      wrapText: true,
      initialWidth: 150
    },
    {
      label: "Walkin Type",
      fieldName: "Walkin_Type__c",
      wrapText: true,
      initialWidth: 150
    },
    {
      label: "Created Dated",
      fieldName: "CreatedDate",
      wrapText: true,
      type: "date",
      typeAttributes: {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }
    },
    {
      type: "action",
      typeAttributes: {
        rowActions: this.walkInActions
      }
    }
  ];

  @track secLeadColumns = [
    { label: "Name", fieldName: "Name", wrapText: true },
    {
      label: "Details",
      fieldName: "Detail",
      wrapText: true,
      initialWidth: 200
    },
    {
      label: "Campaign",
      fieldName: "Campaign",
      wrapText: true,
      initialWidth: 140
    },
    { label: "Status", fieldName: "Status", wrapText: true },
    {
      type: "action",
      typeAttributes: {
        rowActions: this.secleadactions
      }
    }
  ];

  @track dupLeadColumns = [
    { label: "Name", fieldName: "Name", wrapText: true },
    {
      label: "Details",
      fieldName: "Detail",
      wrapText: true,
      initialWidth: 150
    },
    {
      label: "Campaign",
      fieldName: "Campaign",
      wrapText: true,
      initialWidth: 150
    },
    { label: "Status", fieldName: "Status", wrapText: true },
    {
      type: "action",
      typeAttributes: {
        rowActions: this.dupleadactions
      }
    }
  ];

  @track leadActivityColumns = [
    {
      label: "Current Stage",
      fieldName: "Current_Lead_Stage__c",
      wrapText: true
    },
    {
      label: "Start",
      fieldName: "Activity_Start_Date__c",
      wrapText: true,
      type: "date",
      typeAttributes: {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }
    },
    {
      label: "End",
      fieldName: "Activity_End_Date__c",
      wrapText: true,
      type: "date",
      typeAttributes: {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }
    },
    { label: "Activity TAT", fieldName: "Activity_TAT__c", wrapText: true },
    { label: "Activity By", fieldName: "ActivityBy", wrapText: true },
    {
      type: "action",
      typeAttributes: {
        rowActions: this.leadactivityactions
      },
      cellAttributes: {
        class: 'last-column',
        alignment: 'center',
        "data-id": "actionColumn"
    }
    }
  ];

  @track mergeLeadColumns = [
    { label: "Lead Name", fieldName: "MergeWithFirstName", wrapText: true },
    { label: "Status", fieldName: "Merge_Status__c", wrapText: true },
    { label: "Requested By", fieldName: "RequestBy", wrapText: true },
    { label: "Approved/Rejected By", fieldName: "ActionBy", wrapText: true },
    {
      type: "action",
      typeAttributes: {
        rowActions: this.mergeleadactions
      }
    }
  ];

 

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
  get sendCall() {
    return "tel:" + this.leadPhone;
  }

  get sendEmail() {
    return "mailto:" + this.leadEmail;
  }

  get showSecondaryLeadsTab() {
    return this.leadClassification !== "Secondary";
  }

  get showDuplicateLeadsTab() {
    return this.leadClassification !== "Duplicate";
  }

  @wire(getLeads, { leadId: "$recordId" })
  wiredLead(result)
   {
    this.wiredLeadResult = result; // Store the result for refresh
      const { data, error } = result;
      console.log('recordI',this.recordId);
    if (data) {
      this.record = data;
      this.LeadRecId = this.record.Lead_ID__c.value;
      this.leadClassification = this.record.Lead_Classification__c.value;
      this.fieldlablename = this.record.Campaign_Channel__c ? this.record.Campaign_Channel__c.value : 'Source';
      console.log('source Name--->',this.fieldlablename);
      if (this.record.Name != undefined) {
        this.leadName = this.record.Name.value;
        if (this.record.Salutation != undefined) {
          this.leadName = this.record.Salutation.value + this.leadName;
        }
      }
      if (this.record.MobilePhone != undefined) {
        this.leadPhone = this.record.MobilePhone.value;
      }
      if (this.record.Email != undefined) {
        this.leadEmail = this.record.Email.value;
      }

      if (this.record.LeadSource != undefined) {
        this.leadSource = this.record.LeadSource.value;
      }
      if (this.record.Campaign_Channel__c != undefined) {
        this.leadSource = this.record.Campaign_Channel__c.value;
      }
      if (this.record.Status != undefined) {
        this.leadStatus = this.record.Status.value;
        if (
          this.record.Lead_Classification__c != undefined &&
          (this.record.Lead_Classification__c.value == "Primary" ||
            this.record.Lead_Classification__c.value == "Secondary") &&
          (this.leadStatus == "New" ||
            this.leadStatus == "Working" ||
            this.leadStatus == "Qualified/Working") &&
          this.record.Is_Merged_Locked__c.value == "false"
        )
        {
          this.showActions = true;
        }
        //For Price Sheet
        // if (
        //   this.record.Lead_Classification__c != undefined &&
        //   (this.record.Lead_Classification__c.value === "Primary" ||
        //     this.record.Lead_Classification__c.value === "Secondary") &&
        //   (this.leadStatus === "Working" ||
        //     this.leadStatus === "Qualified/Working") &&
        //   this.record.Is_Merged_Locked__c.value === "false"
        // ) {
        //   this.sendPriceSheet = true;
        // }
      }

      if (this.record.Project__c != undefined) {
        this.leadProject = this.record.Project__c.value;
        this.projectId = this.record.Project__c.Id;
      }
      getRecordNotifyChange([{ recordId: this.recordId }]);
      console.log(this.record);
      this.updateSectionsWithRecordValues();

      this.loading = false;
    } else if (error) {
      this.loading = false;
    }
    
    console.log('699---->',this.fieldlablename);
  }
  

@track sections = [
  {
    label: "Customer Info",
    key: "CustomerInfo",
    icon: "standard:user",
    src: LeadCustomerInfoIcon,
    edit: true,
    fields: [
      { label: "Salutation", fieldApiName: "Salutation", value: "" },
      { label: "First Name", fieldApiName: "FirstName", value: "" },
      { label: "Middle Name", fieldApiName: "MiddleName", value: "" },
      { label: "Last Name", fieldApiName: "LastName", value: "" },
      { label: "Mobile No", fieldApiName: "MobilePhone", value: "" },
      {
        label: "Alternate Phone",
        fieldApiName: "Alternate_Phone__c",
        value: ""
      },
      { label: "Whatsapp No", fieldApiName: "WhatsApp_No__c", value: "" },
      { label: "Office No", fieldApiName: "Office_No__c", value: "" },
      { label: "Email", fieldApiName: "Email", value: "" },
      {
        label: "Additional Email",
        fieldApiName: "Additional_Email__c",
        value: ""
      },
      { label: "Office Email", fieldApiName: "Office_Email__c", value: "" },
      { label: "City", fieldApiName: "City__c", value: "" },
      { label: "State", fieldApiName: "State__c", value: "" },
      { label: "Country", fieldApiName: "Country__c", value: "" },
      { label: "Pincode", fieldApiName: "Pincode__c", value: "" },
      { label: "Company Name", fieldApiName: "Company", value: "" },
      //{ label: 'Do not call', fieldApiName: 'DoNotCall', value: '', checkbox: true },
      {
        label: "Customer Description",
        fieldApiName: "Customer_Description__c",
        value: ""
      },
      {
        label: "Current Location",
        fieldApiName: "Current_Location__c",
        value: ""
      },
      {
        label: "Lead Owner",
        fieldApiName: "OwnerId",
        type: "user",
        value: ""
      },
      { label: "Industry", fieldApiName: "Industry__c", value: "" },
      { label: "Department", fieldApiName: "Department__c", value: "" },
      { label: "Designation", fieldApiName: "Designation__c", value: "" },
      { label: "Age Group", fieldApiName: "Age_Group__c", value: "" },
      { label: "Gender", fieldApiName: "Gender__c", value: "" },
      {
        label: "Working Location",
        fieldApiName: "Working_Location__c",
        value: ""
      }
    ]
  },
  {
    label: "Customer Requirements",
    key: "CustomerRequirements",
    icon: "standard:channel_programs",
    src: LeadCustomerReqIcon,
    edit: true,
    fields: [
      {
        label: "Preferred House Type",
        fieldApiName: "Preferred_House_Type__c",
        value: ""
      },
      {
        label: "Preferred Budget Range",
        fieldApiName: "Preferred_Budget_Range__c",
        value: ""
      },
      {
        label: "Preferred Floor",
        fieldApiName: "Preferred_Floor__c",
        value: ""
      },
      {
        label: "Preferred Timeframe To Purchase",
        fieldApiName: "Preferred_Timeframe_To_Purchase__c",
        value: ""
      },
      {
        label: "Preferred Location",
        fieldApiName: "Preferred_Location__c",
        value: ""
      },
      {
        label: "Purpose Of Purchase",
        fieldApiName: "Purpose_Of_Purchase__c",
        value: ""
      },
      {
        label: "Preferred Flat Area",
        fieldApiName: "Preferred_Flat_Area__c",
        value: ""
      },
      {
        label: "Preferred Unit Facing",
        fieldApiName: "Preferred_Unit_Facing__c",
        value: ""
      },
      {
        label: "Preferred Vastu Compliance",
        fieldApiName: "Preferred_Vastu_Compliance__c",
        value: "",
        checkbox: true
      },
      {
        label: "Commercial Area",
        fieldApiName: "Commercial_Area__c",
        value: ""
      },
      {
        label: "Commercial Requirement Type",
        fieldApiName: "Commercial_Requirement_Type__c",
        value: ""
      }
    ]
  },
  {
    label: "Lead Source Details",
    key: "LeadSourceDetails",
    icon: "standard:funding_requirement",
    src: LeadSourceIcon,
    edit: true,
    fields: [
      {
        label: "Campaign Vertical",
        fieldApiName: "CampaignVertical__c",
        value: ""
      },
      {
        label: "Campaign Channel",
        fieldApiName: "Campaign_Channel__c",
        value: ""
      },
      { label: "Sub Campaign", fieldApiName: "SubCampaign__c", value: "" },
      { label: "Employee Id", fieldApiName: "Employee_Id__c", value: "" },
      { label: "Project", fieldApiName: "Project__c", value: "" },
      {
        label: "Project Location",
        fieldApiName: "ProjectLocation__c",
        value: ""
      },
      {
        label: "Residing In Project",
        fieldApiName: "Residing_In_Project__c",
        value: ""
      },
      {
        label: "Residing In Unit",
        fieldApiName: "Residing_in_Unit__c",
        value: ""
      },
      { label: " Source name", fieldApiName: "Source_Name__c", value: "" },
      { label: "Source Email", fieldApiName: "Source_Email__c", value: "" },
      {
        label: "Source Mobile No",
        fieldApiName: "Source_Mobile_No__c",
        value: ""
      },
      {
        label: "Source Company Name",
        fieldApiName: "Source_Company_Name__c",
        value: ""
      },
      {
        label:  "RERA No",
        fieldApiName: "Source_RERA_No__c",
        value: ""
      },
      {
        label: " Source Comments",
        fieldApiName: "Source_Comments__c",
        value: ""
      },
      {
        label: "Reactived Source",
        fieldApiName: "Reactived_Source__c",
        value: ""
      }
    ]
  },
  {
    label: "Marketing Info",
    key: "MarketingInfo",
    icon: "standard:resource_preference",
    src: LeadMarketingIcon,
    edit: true,
    fields: [
      { label: "GCLID", fieldApiName: "GCLID__c", value: "" },
      { label: "Utm Source", fieldApiName: "Utm_Source__c", value: "" },
      { label: "Utm Medium", fieldApiName: "Utm_Medium__c", value: "" },
      { label: "Utm Campaign", fieldApiName: "Utm_Campaign__c", value: "" },
      { label: "Utm Term", fieldApiName: "Utm_Term__c", value: "" },
      { label: "Live Chat Url", fieldApiName: "Live_Chat_Url__c", value: "" },
      {
        label: "Raw Transcript Url",
        fieldApiName: "Raw_Transcript_Url__c",
        value: ""
      },
      { label: "Website Url", fieldApiName: "Website_Url__c", value: "" },
      {
        label: "Website Subject",
        fieldApiName: "Website_Subject__c",
        value: ""
      }
    ]
  },
  {
    label: "Lead Status & Lead Classification",
    key: "LeadStatus",
    icon: "standard:category",
    src: LeadStatusIcon,
    edit: true,
    fields: [
      { label: "Lead Status", fieldApiName: "Status", value: "" },
      {
        label: "Lead Sub Status",
        fieldApiName: "Lead_Sub_Status__c",
        value: ""
      },
      { label: "Reason", fieldApiName: "Reason__c", value: "" },
      {
        label: "Lead Classification",
        fieldApiName: "Lead_Classification__c",
        value: ""
      },
      { label: "Parent Lead", fieldApiName: "Parent_Lead__c", value: "" },
      {
        label: "Is Merged",
        fieldApiName: "Is_Merged__c",
        value: "",
        checkbox: true
      },
      {
        label: "Is Merged Locked",
        fieldApiName: "Is_Merged_Locked__c",
        value: "",
        checkbox: true
      },
      {
        label: "Is Shared",
        fieldApiName: "Is_Shared__c",
        value: "",
        checkbox: true
      },
      {
        label: "Is Cross Sale",
        fieldApiName: "Is_Cross_Sale__c",
        value: "",
        checkbox: true
      },
      {
        label: "Is Sales Lead",
        fieldApiName: "Is_Sales_Lead__c",
        value: "",
        checkbox: true
      },
      {
        label: "Is Eligibility Locked",
        fieldApiName: "Is_Eligibility_Locked__c",
        value: "",
        checkbox: true
      },
      {
        label: "Is Eligible for referral",
        fieldApiName: "Is_Eligible__c",
        value: "",
        checkbox: true
      },
      {
        label: "Referral Eligibility Comment",
        fieldApiName: "Eligible_Comment__c",
        value: ""
      }
    ]
  },
  {
    label: "Record Info",
    key: "RecordInfo",
    icon: "standard:report",
    src: LeadRecordInfoIcon,
    fields: [
      {
        label: "Registered Date",
        fieldApiName: "Registered_Date__c",
        value: ""
      },
      {
        label: "Assignment Date",
        fieldApiName: "Assignment_Date__c",
        value: ""
      },
      {
        label: "Created By",
        fieldApiName: "CreatedById",
        type: "user",
        value: ""
      },
      { label: "Creation Date", fieldApiName: "CreatedDate", value: "" },
      {
        label: "Last Modified By",
        fieldApiName: "LastModifiedById",
        type: "user",
        value: ""
      },
      { label: "Modified Date", fieldApiName: "LastModifiedDate", value: "" },
      {
        label: "Reactivated Date",
        fieldApiName: "Reactivated_Date__c",
        value: ""
      },
      {
        label: "First Activity Date",
        fieldApiName: "First_Activity_Date__c",
        value: ""
      },
      {
        label: "First Task Date",
        fieldApiName: "First_Task_Date__c",
        value: ""
      },
      {
        label: "Last Activity Date",
        fieldApiName: "Last_Activity_Date__c",
        value: ""
      },
      {
        label: "Last Activity Number Of Days",
        fieldApiName: "Last_Activity_Number_Of_Days__c",
        value: ""
      },
      {
        label: "Last Task Comments",
        fieldApiName: "Last_Task_Comments__c",
        value: ""
      },
      {
        label: "Last Task Date",
        fieldApiName: "Last_Task_Date__c",
        value: ""
      },
      {
        label: "Lead Aging Till Today",
        fieldApiName: "Lead_Aging_Till_Today__c",
        value: ""
      },
      { label: "Minutes Aging", fieldApiName: "Minutes_Aging__c", value: "" }
    ]
  }
];
// updateSectionsWithRecordValues() {

//   this.sections.forEach(section => {
//     section.fields.forEach(field => {
//       field.value = this.record[field.fieldApiName] ? this.record[field.fieldApiName].value : "";
//       console.log('field values ---->',this.field.value);
//     });
//   });
// }
  @wire(getSiteVisits, { leadId: "$recordId" })
  wiredSiteVisits({ error, data }) {
    if (data) {
      let obj = JSON.parse(data);
      this.siteVisitData = obj;
      for (let field of this.siteVisitData) {
        if (field["Status__c"] == "Completed") {
          this.siteAction = false;
          this.siteCompleteAction = false;
        } else if (
          field["Status__c"] == "Scheduled" ||
          field["Status__c"] == "Rescheduled"
        ) {
          this.siteAction = false;
        }
        field["projectName"] = field.Project__r.Name;
        field["SM"] = field.Assigned_Sales_Manager__r.Name;
        field["VisitDateTime"] =
          "Time: \n" +
          field.Time_Preferred__c +
          "\nDate: \n" +
          field.Visit_Date__c.split("-").reverse().join("-");
        if (field.Transport_Type__c == "Company") {
          if (field.Pickup_Point__c == null) {
            field.Pickup_Point__c = "";
          }
          if (field.Pickup_Time__c == null) {
            field.Pickup_Time__c = "";
          } else {
            let timeParts = field.Pickup_Time__c.split(":");
            let hours = parseInt(timeParts[0]);
            let minutes = parseInt(timeParts[1]);

            let period = hours >= 12 ? "PM" : "AM";

            hours = hours % 12;
            hours = hours ? hours : 12;
            field.Pickup_Time__c =
              hours.toString().padStart(2, "0") +
              ":" +
              minutes.toString().padStart(2, "0") +
              " " +
              period;
          }
          if (field.Pickup_Driver_Mobile_No__c == null) {
            field.Pickup_Driver_Mobile_No__c = "";
          }
          console.log(field.Pickup_Time__c);
          field["TransportDetails"] =
            field.Transport_Type__c +
            "\nPickup Point: " +
            field.Pickup_Point__c +
            "\nPickup Time: " +
            field.Pickup_Time__c +
            "\nMobile Number: " +
            field.Pickup_Driver_Mobile_No__c;
        } else {
          field["TransportDetails"] = "Own";
        }
      }
    } else if (error) {
    }
  }

  @wire(getWalkInList, { leadId: "$recordId" })
  wiredWalkIn({ error, data }) {
    if (data) {
      this.walkInData = JSON.parse(data);
      for (let field of this.walkInData) {
        if (field.Mobile_No__c == null) {
          field.Mobile_No__c = "";
        }
        if (field.Email__c == null) {
          field.Email__c = "";
        }
        field["Detail"] =
          "Mobile Number: " + field.Mobile_No__c + "\nEmail: " + field.Email__c;
      }
    } else if (error) {
      console.log(error);
    }
  }

  get recordIdForSecLeads() {
    if(this.leadClassification === "Duplicate") {
      return this.record && this.record.Parent_Lead__c && this.record.Parent_Lead__c.Id;
    }
    return this.recordId;
  }

  @wire(getSecLeads, { recId: "$recordIdForSecLeads" })
  wiredSecLeads({ error, data }) {
    if (data) {
      this.secLeadData = JSON.parse(data);
      for (let field of this.secLeadData) {
        if (field.MobilePhone == null) {
          field.MobilePhone = "";
        }
        if (field.Email == null) {
          field.Email = "";
        }
        if (field.Project__c == null) {
          field.Project__r.Name = "";
        }
        field["Detail"] =
          "Mobile Number: " +
          field.MobilePhone +
          "\nEmail: " +
          field.Email +
          "\nProject: " +
          field.Project__r.Name;
        field["Status"] = field["Status"] + "\nOwner: " + field.Owner.Name;
        if (field.Registered_Date__c != null) {
          let date = String(field.Registered_Date__c).slice(0, 10);
          field["Registered_Date__c"] = date.split("-").reverse().join("-");
        } else {
          field["Registered_Date__c"] = "";
        }

        if (field["Campaign_Channel__c"] != null) {
          field["Campaign"] =
            "Campaign: \n" +
            field.Campaign_Channel__r.Name +
            "\nRegistered Date: \n" +
            field["Registered_Date__c"];
        } else {
          field["Campaign"] =
            "Campaign: " +
            "\nRegistered Date: \n" +
            field["Registered_Date__c"];
        }
      }
    } else if (error) {
    }
  }

  @wire(getDupLeads, { recId: "$recordId" })
  wiredDupLeads({ error, data }) {
    if (data) {
      this.dupLeadData = JSON.parse(data);
      console.log('recId-->',this.recId);
      console.log('wiredDupLeads-->',JSON.stringify(this.dupLeadData));
      for (let field of this.dupLeadData) {
        if (field.MobilePhone == null) {
          field.MobilePhone = "";
        }
        if (field.Email == null) {
          field.Email = "";
        }
        if (field.Project__c == null) {
          field.Project__r.Name = "";
        }
        field["Detail"] =
          "Mobile Number: " +
          field.MobilePhone +
          "\nEmail: " +
          field.Email +
          "\nProject: " +
          field.Project__r.Name;
        field["Status"] = field["Status"] + "\nOwner: " + field.Owner.Name;
        if (field.Registered_Date__c != null) {
          let date = String(field.Registered_Date__c).slice(0, 10);
          field["Registered_Date__c"] = date.split("-").reverse().join("-");
        } else {
          field["Registered_Date__c"] = "";
        }

        if (field["Campaign_Channel__c"] != null) {
          field["Campaign"] =
            "Campaign: \n" +
            field.Campaign_Channel__r.Name +
            "\nRegistered Date: \n" +
            field["Registered_Date__c"];
        } else {
          field["Campaign"] =
            "Campaign: " +
            "\nRegistered Date: \n" +
            field["Registered_Date__c"];
        }
      }
    } else if (error) {
    }
  }

  @wire(getleadActivities, { recId: "$recordId" })
  wiredLeadsActivity({ error, data }) {
    if (data) {
      this.leadActivityData = JSON.parse(data);
      for (let field of this.leadActivityData) {
        if (field.Activity_By__c != null) {
          field["ActivityBy"] = field.Activity_By__r.Name;
        }
      }
    } else if (error) {
    }
  }

  @wire(getMergedLeads, { leadId: "$recordId" })
  wiredMergedLeads({ error, data }) {
    if (data) {
      this.mergeLeadData = JSON.parse(data);
      for (let field of this.mergeLeadData) {
        field["MergeWithFirstName"] = field.Merge_With_Lead__r.Name;
        field["RequestBy"] = field.Requested_By__r.Name;
        if (field.Merge_Status__c == "Approved") {
          field["ActionBy"] = field.Approved_By__r.Name;
        } else if (field.Merge_Status__c == "Rejected") {
          field["ActionBy"] = field.Rejected_By__r.Name;
        }
      }
    } else if (error) {
    }
  }

  // Iterate through each section
  updateSectionsWithRecordValues() {
    for (let section of this.sections) {
      console.log('section-->'+JSON.stringify(section))
      for (let field of section.fields) {
        
        console.log('--1285',JSON.stringify(field.fieldApiName));
        
          if (field.fieldApiName === 'Source_Name__c'&& (this.fieldlablename !=='Expo')) {
           
            field.label = this.fieldlablename + " Name";
           
        } 
        if (field.fieldApiName === 'Source_Email__c' && (this.fieldlablename !=='Expo')) {
            
            field.label = this.fieldlablename + " Email";
            
        } 
        if (field.fieldApiName === 'Source_Mobile_No__c' && (this.fieldlablename !=='Expo')) {
            
            field.label = this.fieldlablename + " Mobile No";
            
        }
        if (field.fieldApiName === 'Source_Company_Name__c' && (this.fieldlablename==='Channel Partner' || this.fieldlablename==='Vendor Reference') && (this.fieldlablename !=='Expo')) 
          {
            
            field.label = this.fieldlablename + " Company Name";
            
        }
        if (field.fieldApiName === 'Source_RERA_No__c' && (this.fieldlablename==='Channel Partner' || this.fieldlablename==='Vendor Reference'||this.fieldlablename==='Management Reference')&& (this.fieldlablename !=='Expo')) {
           
            field.label = this.fieldlablename + " RERA No";
            
        }
        if (field.fieldApiName === 'Source_Comments__c'&& (this.fieldlablename !=='Channel Partner')&& (this.fieldlablename !=='Expo')) {
            
            field.label = this.fieldlablename + " Comments";
            
        }
        if (this.record[field.fieldApiName] !== undefined && this.record[field.fieldApiName] !== null) {
          

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

  newSiteVisit() {
    this.siteVisitModal = true;
  }

  closenewSiteVisit() {
    this.siteVisitModal = false;
  }

  handleSiteRowAction(event) {
    let action = event.detail.action;
    let row = event.detail.row;
    switch (action.name) {
      case "view":
        this[NavigationMixin.GenerateUrl]({
          type: "standard__recordPage",
          attributes: {
            recordId: row.Id,
            objectApiName: "Site_Visit__c",
            actionName: "view"
          }
        }).then((generatedUrl) => {
          window.open(generatedUrl);
        });
        break;
      case "edit":
        this.relatedId = row.Id;
        this.relatedEdit = true;
        this.relatedObject = "Site_Visit__c";
        this.relatedFields = [
          "Visit_Date__c",
          "Time_Preferred__c",
          "Transport_Type__c",
          "Pickup_And_Drop_Type__c",
          "Pickup_Cab__c",
          "Pickup_Cab_No__c",
          "Pickup_Driver_Name__c",
          "Pickup_Driver_Mobile_No__c",
          "Pickup_Point__c",
          "Pickup_Time__c",
          "Drop_Cab__c",
          "Drop_Cab_No__c",
          "Drop_Driver_Name__c",
          "Drop_Driver_Mobile_No__c",
          "Drop_Point__c",
          "Priority__c"
        ];
        break;
      case "cancel":
        if (row.Status__c == "Completed") {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error!!",
              message: "You cannot cancel a completed site visit",
              variant: "error"
            })
          );
          break;
        }
        this.cancelSiteVisitModal = true;
        this.siteVisitId = row.Id;
        break;
      case "reassign":
        if (row.Status__c == "Completed" || row.Status__c == "Cancelled") {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error!!",
              message: "You cannot reassign a completed site visit",
              variant: "error"
            })
          );
          break;
        }
        this.reassignSiteVisitModal = true;
        this.siteVisitId = row.Id;
        break;
      case "complete":
        if (this.siteCompleteAction == false) {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error!!",
              message: "A Completed site visit already exists.",
              variant: "error"
            })
          );
          break;
        }
        if (row.Status__c == "Cancelled") {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error!!",
              message: "You cannot complete a cancelled site visit",
              variant: "error"
            })
          );
          break;
        }
        this.completeSiteVisitModal = true;
        this.siteVisitId = row.Id;
        break;
      case "updateinvoice":
        if (row.Status__c != "Completed") {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error!!",
              message:
                "Please mark the site visit completed before updating invoice details",
              variant: "error"
            })
          );
          break;
        }
        let index;
        let siteTransport =
          this.siteVisitData[
            this.siteVisitData.findIndex((record) => record.Id == row.Id)
          ].Transport_Type__c;
        if (siteTransport == "Own") {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error!!",
              message: "Invoice cannot be updated for Own transport",
              variant: "error"
            })
          );
          break;
        }
        this.invoiceSiteVisitModal = true;
        this.siteVisitId = row.Id;
        break;
      case "reschedule":
        this.rescheduleSiteVisitModal = true;
        this.siteVisitId = row.Id;
        break;
    }
  }

  handleRelatedEditCancel() {
    this.relatedId = "";
    this.relatedEdit = false;
    this.relatedObject = "";
    this.relatedFields = [];
  }

  handleCloseCancelSiteVisit() {
    this.cancelSiteVisitModal = false;
  }

  handleCloseCompleteSiteVisit() {
    this.completeSiteVisitModal = false;
  }

  handleCloseInvoiceSiteVisit() {
    this.invoiceSiteVisitModal = false;
  }
  handleCloseRescheduleSiteVisit() {
    this.rescheduleSiteVisitModal = false;
  }
  handleClosereassignSiteVisit() {
    this.reassignSiteVisitModal = false;
  }

  handleWalkInRowAction(event) {
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
    }
  }

  handleSecRowAction(event) {
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
    }
  }

  handleDupRowAction(event) {
    let action = event.detail.action;
    let row = event.detail.row;
    console.log('action--->',this.action);
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
    }
  }

  handleActivityRowAction(event) {
    let action = event.detail.action;
    let row = event.detail.row;

    console.log('row Id--->',row.Id);
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
    }
  
  }

 
  handleMergeRowAction(event) {
    let action = event.detail.action;
    let row = event.detail.row;
    switch (action.name) {
      case "view":
        this[NavigationMixin.GenerateUrl]({
          type: "standard__recordPage",
          attributes: {
            recordId: row.Id,
            objectApiName: "Lead_Merge_Request__c",
            actionName: "view"
          }
        }).then((generatedUrl) => {
          window.open(generatedUrl);
        });
        break;
    }
  }

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
  handleValueChange(event) {
    const currfield = event.currentTarget.dataset.field;
    this.valueMap[currfield] = event.currentTarget.value;
  }

  handleEdit(event) {
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

  handleCancel(event) {
    const currsection = event.currentTarget.dataset.id;
    for (let section of this.sections) {
      if (section.key === currsection) {
        for (let field of section.fields) {
          this.fields.push(field.fieldApiName);
        }
      }
    }
  }

  handleEditCancel() {
    this.edit = false;
    this.fields = [];
  }

  handleRelatedEditCancel() {
    this.relatedEdit = false;
    this.relatedFields = [];
  }

  handleSubmit() {
    this.loading = true;
    getLeads({ leadId: this.recordId })
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

  handleMergeRequest() {
    this.mergeLead = true;
  }

  closeMergeRequest() {
    this.mergeLead = false;
  }

  handleOwnerRequest() {
    this.changeOwner = true;
  }

  closeOwnerChange() {
    this.changeOwner = false;
  }

  handleEligibilityChange() {
    if (
      this.record.Is_Eligible__c.value == "true" &&
      this.record.Is_Eligibility_Locked__c.value == "false"
    ) {
      this.eligibilityModal = true;
    } else {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error!!",
          message:
            "Transfer of Referral Bonus for this Lead is not applicable!",
          variant: "error"
        })
      );
    }
  }

  closeEligibilityChange() {
    this.eligibilityModal = false;
  }
  //to lock lead eligibility
  async handleLockLeadEligibility() {
    // confirm("Are you sure you want to lock lead eligibility?");

    if (this.record.Is_Eligibility_Locked__c.value === "true") {
      // this.leadIsEligibilityLocked = this.record.Is_Eligibility_Locked__c.value;
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error!!",
          message: " Eligibility is already Locked for this Lead!!",
          variant: "error"
        })
      );
      return;
    }

    const confirmation = await LightningConfirm.open({
      message: "Are you sure you want to lock lead eligibility?",
      variant: "header",
      label: "Confirmation"
    });
    if (confirmation) {
      lockLeadEligibility({ recordId: this.recordId })
        .then((result) => {
          // Show success messsage
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success!!",
              message: "Lead Locked Successfully!!",
              variant: "success"
            })
          );
          this.loading = true;
          window.setTimeout(() => {
            window.location.reload(true);
          }, 500);
        })
        .catch((error) => {
          console.log("Error==>", error);
          this.error = error;
        });
    }
  }
  handleCloseModal() {
    this.showModal = false;
  }
  //For File Preview
  handleClick(event) {
    console.log(event.target.dataset.id);
    //Preview Button clicked
    if (event.detail.status === "confirm") {
      this[NavigationMixin.Navigate]({
        type: "standard__namedPage",
        attributes: {
          pageName: "filePreview"
        },
        state: {
          selectedRecordId: this.ContentDocuId
        }
      });
    } else if (event.detail.status === "cancel") {
      //Send Button clicked
      sendpricesheetpdf({ leadId: this.recordId })
        .then((result) => {
          // Show success messsage
          this.showModal = false;
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success!!",
              message: "Price Sheet sent to customer successfully!!",
              variant: "success"
            })
          );
        })
        .catch((error) => {
          console.log("Error==>", error);
          this.error = error;
          this.showModal = false;
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error!!",
              message: "Price Sheet not sent",
              variant: "error"
            })
          );
        });
    }
  }

  //Handle Send Price Sheet
  handleSendPriceSheet(event) {
    getfiledata({ projId: this.projectId })
      .then((result) => {
        // Show success messsage
        if (result.PriceSheetId === "") {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error!!",
              message: "No Price Sheet record for this project",
              variant: "error"
            })
          );
        } else if (result.ContentDocId === "" || result.ContentVerId === "") {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error!!",
              message: "Price Sheet Pdf is not uploaded",
              variant: "error"
            })
          );
        } else {
          this.showModal = true;
          this.ContentDocuId = result.ContentDocId;
          this.isDialogVisible = true;
          this.originalMessage = "Preview / Send";
        }
      })
      .catch((error) => {
        console.log("Error==>", error);
        this.error = error;
        this.showModal = false;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error!!",
            message: "Price Sheet not sent",
            variant: "error"
          })
        );
      });
  }
  //walkinform
  siteVisitId;
  @wire(getRelatedSiteVisits, { leadRecordId: "$recordId" })
  wiredSiteVisitRecords({ error, data }) {
    if (data) {
      // Data has been received from the Apex method
      let parsedData = JSON.parse(data);
      console.log("Parsed data:", parsedData);
      if (parsedData.length > 0) {
        // Assuming each element in parsedData has an Id property
        this.siteVisitId = parsedData[0].Id;
        console.log("Site Visit Id:", this.siteVisitId);
      } else {
        console.error("Invalid data structure:", parsedData);
        console.log("error");
        this.disableButton();
      }
    } else if (error) {
      // An error occurred while fetching data
      console.error("Error fetching site visits:", error);
      console.error("Invalid data structure:", data);
    }
  }
  handleVirtualWalkinForm() {
    console.log("this.siteVisitId", this.siteVisitId);
    const baseURl =
      "https://fun-energy-41633--uat.sandbox.my.site.com/walkinform";
    const url = baseURl + "?siteVisitId=" + this.siteVisitId;
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: url
      }
    });
  }
  handleSendWalkinForm() {
    sendwalkinform({ leadId: this.recordId, sitevisitId: this.siteVisitId })
      .then((result) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success!!",
            message: "Walkin Form link is sent to the customer successfully!!",
            variant: "success"
          })
        );
      })
      .catch((error) => {
        console.log("Error==>", error);
        this.error = error;
        this.showModal = false;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error!!",
            message: "Walkin Form Link not sent",
            variant: "error"
          })
        );
      });
  }

  @track isButtonEnabled = true;
  get buttonClass() {
    return this.isButtonEnabled ? "action" : "action disabled";
  }
  disableButton() {
    console.log("disableButton");
    this.isButtonEnabled = false;
    console.log("asa");
  }
}