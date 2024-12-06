/* eslint-disable no-useless-return */
/* eslint-disable no-alert */
import { LightningElement, track, wire } from "lwc";

import { ShowToastEvent } from "lightning/platformShowToastEvent";
import savewalkinRecord from "@salesforce/apex/walkinformcontroller.savewalkinRecord";
import salesRepProjectWise from "@salesforce/apex/walkinformcontroller.getSaleRep";
import sumadhuraImage2 from "@salesforce/resourceUrl/FormstackFolium";

import captchaBG from "@salesforce/resourceUrl/Sumadhura_New_Logo";
//import pageUrl from "@salesforce/resourceUrl/recaptcha2";
import getleaddetails from "@salesforce/apex/walkinformcontroller.getleaddetails";

import getPicklistValues from "@salesforce/apex/PicklistValuesController.getPicklistValues";

export default class Virtualwalkinformlwc extends LightningElement {
  @track error;
  @track happiness = [];
  @track stopping = [];
  @track requirement = [];
  @track prjOptions = [];
  @track salesOptions = [];
  @track navigateTo;
  @track ProjectSelected;
  @track selectedProject;
  @track directwalkin = false;
  @track IsDisable = false;
  @track walkintype;

  @track industryOptions = [];
  @track ageGroupOptions = [];
  @track designationOptions = [];

  value = "";
  captchaWindow = null;
  captcha = false;
  myCustomSettings = true;
  siteVisitId;

  @track ue;
  @track wc;
  @track vc;
  @track am;
  @track se;

  connectedCallback() {
    console.log("sdsdd");
    const currentPageUrl = window.location.href;
    console.log("sitevisit id ", this.siteVisitId);
    if (currentPageUrl.includes("siteVisitId")) {
      const queryParams = currentPageUrl.split("?")[1];
      const keyValuePairs = queryParams.split("&");
      keyValuePairs.forEach((pair) => {
        const [key, value] = pair.split("=");
        if (key === "siteVisitId") {
          this.siteVisitId = value;
        }
      });
    }
    console.log("Site Visit ID:", this.siteVisitId);
  }
  // captcha = true;

  constructor() {
    super();
  //  this.navigateTo = pageUrl;
  }
  get captchaBack() {
    return `background:url(${captchaBG});
        background-size: 22%;
        background-position: center;
        background-repeat: no-repeat;
        background-position-y: 36%;`;
  }

 /* captchaLoaded(evt) {
    var e = evt;
    console.log(e.target.getAttribute("src") + " loaded");
    if (e.target.getAttribute("src") == pageUrl) {
      this.captchaWindow = e.target.contentWindow;
    }
  }*/

  captchaCheck() {
    this.captchaWindow.postMessage("getRecaptchaResponse", "*");
    window.addEventListener("message", (event) => {
      if (event.data.type === "recaptchaResponseLength") {
        const recaptchaResponseLength = event.data.recaptchaResponseLength;
        if (recaptchaResponseLength === 0) {
          alert("Please complete the reCaptcha");
        } else {
          console.log("reCAPTCHA completed");
          this.captcha = true;
          this.page1 = true;
        }
      }
    });
  }
  Thankimage = sumadhuraImage2;

  value = "";
  curstep = "1";
  valuehome = "";
  valuefirst = "";
  valueconfig = "";
  valuehappy = "";
  valuestopping = "";
  valueProject = "";

  page1 = true;
  page2 = false;
  page3 = false;
  page4 = false;

  submitted = false;
  loading = false;
  buttonclicked;
  allowSubmit;

  get homeoptions() {
    return [
      { label: "Self", value: "Self" },
      { label: "Investment", value: "Investment" }
    ];
  }

  get firstpurchaseoptions() {
    return [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" }
    ];
  }

  get walkintypeoptions() {
    return [
      { label: "Scheduled", value: "Scheduled" },
      { label: "Direct", value: "Direct" }
    ];
  }
  @track configoptions = [
    { Id: "0", label: "1-BHK", value: "1-BHK", selected: false },
    { Id: "1", label: "2-BHK", value: "2-BHK", selected: false },
    { Id: "2", label: "2.5-BHK", value: "2.5-BHK", selected: false },
    { Id: "3", label: "3-BHK", value: "3-BHK", selected: false },
    { Id: "4", label: "3.5-BHK", value: "3.5-BHK", selected: false },
    { Id: "5", label: "4-BHK", value: "4-BHK", selected: false },
    { Id: "6", label: "4.5-BHK", value: "4.5-BHK", selected: false },
    { Id: "7", label: "Sky Villa", value: "Sky Villa", selected: false }
  ];

  get ratingName() {
    return [
      { label: "Unit Efficiency/Design", value: "ue" },
      { label: "Well Connected Location", value: "wc" },
      { label: "Vastu Compliance", value: "vc" },
      { label: "Amenities", value: "am" },
      { label: "Sustainable/Environment Friendly", value: "se" }
    ];
  }

  @track happinessoptions = [
    {
      Id: "0",
      label: "Better social life",
      value: "Better social life",
      selected: false
    },
    {
      Id: "1",
      label: "Healthy Living",
      value: "Healthy Living",
      selected: false
    },
    {
      Id: "2",
      label: "Well rounded and secure environment for the family",
      value: "Well rounded and secure environment for the family",
      selected: false
    },
    {
      Id: "3",
      label: "Immersive environment for kids",
      value: "Immersive environment for kids",
      selected: false
    },
    {
      Id: "4",
      label: "Pride/Prestige of owning a own home",
      value: "Pride/Prestige of owning a own home",
      selected: false
    },
    {
      Id: "5",
      label: "Creating asset for your family",
      value: "Creating asset for your family",
      selected: false
    }
  ];

  @track stoppingoptions = [
    {
      Id: "0",
      label: "Builder's delivery track record",
      value: "Builder's delivery track record",
      selected: false
    },
    {
      Id: "1",
      label: "Quality of the product",
      value: "Quality of the product",
      selected: false
    },
    {
      Id: "2",
      label: "Knowing if I am paying the right price",
      value: "Knowing if I am paying the right price",
      selected: false
    },
    {
      Id: "3",
      label: "Concerns on legal clearance of the project",
      value: "Concerns on legal clearance of the project",
      selected: false
    },
    {
      Id: "4",
      label: "My financial commitments",
      value: "My financial commitments",
      selected: false
    },
    {
      Id: "5",
      label: "Correct time to take the decision",
      value: "Correct time to take the decision",
      selected: false
    }
  ];
  //Walk-In Record
  @track walkinrec = {
    Lead__c: "",
    Name__c: "",
    Mobile_No__c: "",
    Email__c: "",
    Location__c: "",
    Industry__c: "",
    Company__c: "",
    Designation__c: "",
    Age__c: "",
    Project__c: "",
    Source__c: "",
    Lead_Owner__c: "",
    Purpose__c: "",
    First_Purchase__c: "",
    Configuration__c: "",
    Efficiency_Design__c: "",
    Well_Connected_Location__c: "",
    Vastu_Compliance__c: "",
    Amenities__c: "",
    Sustainable_Environment_Friendly__c: "",
    Happiness_Quotient__c: "",
    Stopping_You__c: "",
    Walkin_Type__c: "",
    Site_Visit__c: ""
  };

  handleRadioChange(event) {
    window.console.log("Home Serve=>" + event.detail.value);
    window.console.log("Home Serve=>" + event.target.value);
    this.walkinrec.Purpose__c = event.detail.value;
    this.valuehome = event.detail.value;
    window.console.log("Home Serve=>" + this.walkinrec.Purpose__c);
  }
  handletypechange(event) {
    this.walkinrec.Walkin_Type__c = event.target.value;
    console.log("Walk In Type =>" + this.walkinrec.Walkin_Type__c);
    if (this.walkinrec.Walkin_Type__c === "Direct") this.directwalkin = true;
    else this.directwalkin = false;
  }
  handlefirstpurchaseChange(event) {
    if (event.target.value == "Yes") this.walkinrec.First_Purchase__c = true;
    else if (event.target.value == "No")
      this.walkinrec.First_Purchase__c = false;
    window.console.log("First Purchase=>" + this.walkinrec.First_Purchase__c);
    this.valuefirst = event.target.value;
  }
  handleNameChange(event) {
    this.walkinrec.Name__c = event.target.value;
    window.console.log("Name=>" + this.walkinrec.Name__c);
  }
  handleMobileChange(event) {
    this.walkinrec.Mobile_No__c = event.target.value;
    window.console.log("Mobile==>" + this.walkinrec.Mobile_No__c);
  }
  handleEmailChange(event) {
    this.walkinrec.Email__c = event.target.value;
    window.console.log("Email==>" + this.walkinrec.Email);
  }
  handleLocationChange(event) {
    this.walkinrec.Location__c = event.target.value;
    window.console.log("Location==>" + this.walkinrec.Location__c);
  }
  handleIndustryChange(event) {
    this.walkinrec.Industry__c = event.target.value;
    window.console.log("Industry==>" + this.walkinrec.Industry__c);
  }
  handleCompanyChange(event) {
    this.walkinrec.Company__c = event.target.value;
    window.console.log("Company==>" + this.walkinrec.Company__c);
  }
  handleDesignationChange(event) {
    this.walkinrec.Designation__c = event.target.value;
    window.console.log("Designation==>" + this.walkinrec.Designation__c);
  }
  handleAgeChange(event) {
    this.walkinrec.Age__c = event.target.value;
    window.console.log("Age__c ==> " + this.walkinrec.Age__c);
  }
  handleSourceChange(event) {
    this.walkinrec.Source__c = event.target.value;
    // this.walkinrec.Source_Description__c = event.target.value;
    // this.walkinrec.SourceBackEnd__c = event.target.value;
    window.console.log("Source_Channel__c ==> " + this.walkinrec.Source__c);
  }

  handleInterestedProjectChange(event) {
    if (event.detail.id !== undefined) {
      // console.log("Inside Project Change");
      this.selectedProject = event.detail.id;
      //console.log("Inside Project Change");
      this.walkinrec.Project__c = this.selectedProject;
      this.ProjectSelected = true;
      console.log("Inside Project Change");
      salesRepProjectWise({ projId: this.selectedProject })
        .then((result) => {
          console.log("Sales Rep Result ==>", result);
          this.salesOptions = result;
        })
        .catch((error) => {
          this.error = error;
          console.log("Sales Rep Error ==>", this, error);
        });
    }
  }
  handleclearvalue() {
    // this.selectedProject = null;
    this.walkinrec.Project__c = null;
    // this.ProjectSelected = false;
  }
  handlePhclearvalue() {
    this.walkinrec.Phase__c = null;
  }
  handlecampclearvalue() {
    this.walkinrec.Source__c = null;
  }
  handlePhaseChange(event) {
    if (event.detail.id !== undefined) {
      this.walkinrec.Phase__c = event.detail.id;

      window.console.log("Phase =>" + this.walkinrec.Phase__c);
    }
  }
  handleCampaignChange(event) {
    if (event.detail.id !== undefined) {
      this.walkinrec.Source__c = event.detail.id;

      window.console.log("Source =>" + this.walkinrec.Source__c);
    }
  }
  handleSaleschange(event) {
    this.walkinrec.Lead_Owner__c = event.target.value;

    window.console.log("Sales Rep=>" + this.walkinrec.Lead_Owner__c);
  }

  addHappiness(event) {
    var select = event.currentTarget.dataset.select;

    if (select === "false") {
      if (this.happiness.length <= 2) {
        const nvalue = event.currentTarget.dataset.value;
        this.happiness.push(nvalue);
        const id = event.currentTarget.dataset.pos;

        this.happinessoptions[id].selected = true;
      }
      console.log(this.happiness);
    } else if (select === "true") {
      const nvalue = event.currentTarget.dataset.value;
      const word = nvalue;
      const index = this.happiness.indexOf(word);
      this.happiness.splice(index, 1);
      const id = event.currentTarget.dataset.pos;
      this.happinessoptions[id].selected = false;
      console.log(this.happiness);
    }
  }

  addStopping(event) {
    var select = event.currentTarget.dataset.select;

    if (select === "false") {
      if (this.stopping.length <= 2) {
        const nvalue = event.currentTarget.dataset.value;
        this.stopping.push(nvalue);
        const id = event.currentTarget.dataset.pos;

        this.stoppingoptions[id].selected = true;
      }
      console.log(this.stopping);
    } else if (select == "true") {
      const nvalue = event.currentTarget.dataset.value;
      const word = nvalue;
      const index = this.stopping.indexOf(word);
      this.stopping.splice(index, 1);
      const id = event.currentTarget.dataset.pos;
      this.stoppingoptions[id].selected = false;
      console.log(this.stopping);
    }
  }
  addrequirement(event) {
    var select = event.currentTarget.dataset.select;

    if (select == "false") {
      const nvalue = event.currentTarget.dataset.value;
      this.requirement.push(nvalue);
      const id = event.currentTarget.dataset.pos;

      this.configoptions[id].selected = true;
      console.log(this.requirement);
    } else if (select == "true") {
      const nvalue = event.currentTarget.dataset.value;
      const word = nvalue;
      const index = this.requirement.indexOf(word);
      this.requirement.splice(index, 1);
      const id = event.currentTarget.dataset.pos;
      this.configoptions[id].selected = false;
      console.log(this.requirement);
    }
  }

  handlestarchange(event) {
    console.log(event.detail.name);
    if (event.detail.name === "ue") {
      this.ue = event.detail.starvalue;
      this.walkinrec.Efficiency_Design__c = event.detail.starvalue;
      console.log(this.walkinrec.Efficiency_Design__c);
    }
    if (event.detail.name === "wc") {
      this.wc = event.detail.starvalue;
      this.walkinrec.Well_Connected_Location__c = event.detail.starvalue;
    }
    if (event.detail.name === "vc") {
      this.vc = event.detail.starvalue;
      this.walkinrec.Vastu_Compliance__c = event.detail.starvalue;
      console.log(this.walkinrec.Vastu_Compliance__c);
    }
    if (event.detail.name === "am") {
      this.am = event.detail.starvalue;
      this.walkinrec.Amenities__c = event.detail.starvalue;
    }
    if (event.detail.name === "se") {
      this.se = event.detail.starvalue;
      this.walkinrec.Sustainable_Environment_Friendly__c =
        event.detail.starvalue;
    }
  }
  //for picklist
  /*  @wire(getObjectInfo, { objectApiName: Lead_OBJECT })
  objectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: Age_Field
  })
  AgePicklistValues;

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: Source_Field
  })
  SourcePicklistValues;

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: Lead_Industry
  })
  IndustryPicklistValues;

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: Lead_Designation
  })
  DesignationPicklistValues;
*/
  @wire(getPicklistValues, {
    objectName: "Lead",
    fieldName: "Industry"
  })
  Industrypicklistval({ error, data }) {
    console.log("Result==>", data);
    if (data) {
      this.industryOptions = data.map((option) => {
        return {
          label: option.label,
          value: option.value
        };
      });
    }
    console.log("Industry Options==>", this.industryOptions);
  }

  @wire(getPicklistValues, {
    objectName: "Lead",
    fieldName: "Designation__c"
  })
  desigpicklistval({ error, data }) {
    console.log("Result==>", data);
    if (data) {
      this.designationOptions = data.map((option) => {
        return {
          label: option.label,
          value: option.value
        };
      });
    }
    console.log("Designation Options==>", this.designationOptions);
  }
  @wire(getPicklistValues, {
    objectName: "Lead",
    fieldName: "Age_Group__c"
  })
  ageGrouppicklistval({ error, data }) {
    console.log("Result==>", data);
    if (data) {
      this.ageGroupOptions = data.map((option) => {
        return {
          label: option.label,
          value: option.value
        };
      });
    }
    console.log("Age Group Options==>", this.ageGroupOptions);
  }

  handleCaptchaReceived(event) {
    console.log("received message from child");
    console.log("childMessage", JSON.stringify(event.detail));
    if (event.detail.data === true) {
      this.allowSubmit = true;
    }
  }

  handleSave() {
    if (
      this.walkinrec.Name__c == "" ||
      this.walkinrec.Company__c == "" ||
      this.walkinrec.Mobile_No__c == "" ||
      this.walkinrec.Designation__c == "" ||
      this.walkinrec.Age__c == "" ||
      this.walkinrec.Email__c == "" ||
      this.walkinrec.Location__c == ""
    ) {
      console.log(this.walkinrec);
      alert("Please fill all required fields!!");
      return;
    } else {
      if (
        this.walkinrec.Walkin_Type__c === "Direct" &&
        (this.walkinrec.Project__c === "" ||
          this.walkinrec.Lead_Owner__c === "")
      ) {
        alert("Please fill all required fields!!");
        return;
      } else {
        this.loading = true;
        this.walkinrec.Configuration__c = this.requirement.toString();
        this.walkinrec.Configuration__c =
          this.walkinrec.Configuration__c.replaceAll(",", ";");
        window.console.log("Configuration=>" + this.walkinrec.Configuration__c);

        this.walkinrec.Happiness_Quotient__c = this.happiness.toString();
        this.walkinrec.Happiness_Quotient__c =
          this.walkinrec.Happiness_Quotient__c.replaceAll(",", ";");
        window.console.log(
          "Happiness=>" + this.walkinrec.Happiness_Quotient__c
        );

        this.walkinrec.Stopping_You__c = this.stopping.toString();
        this.walkinrec.Stopping_You__c =
          this.walkinrec.Stopping_You__c.replaceAll(",", ";");
        window.console.log("Stopping You=>" + this.walkinrec.Stopping_You__c);
        window.console.log("Lead Id=>" + this.walkinrec.Lead__c);

        //console.log("debug lead");

        savewalkinRecord({ objwalkin: this.walkinrec })
          .then((result) => {
            // Clear the user enter values
            console.log("result ===> " + result);
            // Show success messsage
            this.dispatchEvent(
              new ShowToastEvent({
                title: "Success!!",
                message: "Walk In Record Created Successfully!!",
                variant: "success"
              })
            );
            this.submitted = true;
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            console.log("Error ===> " + JSON.stringify(error));
            var errmsg = error.body.message;
            this.dispatchEvent(
              new ShowToastEvent({
                title: "Error!!",
                message: errmsg,
                variant: "Error"
              })
            );
            //alert("Error: " + JSON.stringify(error));
          });
      }
    }
  }

  topage1() {
    this.page4 = false;
    this.page3 = false;
    this.page2 = false;
    this.page1 = true;
    this.curstep = "1";
    // console.log("page 1");
  }
  topage2() {
    // console.log("Requirement", this.requirement.toString());
    if (this.valuehome === "") {
      alert("Please fill all the details !!!");
      return;
    }
    if (this.valuefirst === "") {
      alert("Please fill all the details !!!");
      return;
    }

    if (this.requirement.toString() === "") {
      alert("Please fill all the details !!!");
      return;
    }
    this.page4 = false;
    this.page3 = false;
    this.page2 = true;
    this.page1 = false;
    this.curstep = "2";
    // console.log("page2");
  }
  topage3() {
    if (this.walkinrec.Well_Connected_Location__c === "") {
      alert("Please give your rate !!!");
      return;
    }
    if (this.walkinrec.Vastu_Compliance__c === "") {
      alert("Please give your rate !!!");
      return;
    }

    if (this.walkinrec.Amenities__c === "") {
      alert("Please give your rate !!!");
      return;
    }
    if (this.walkinrec.Sustainable_Environment_Friendly__c === "") {
      alert("Please give your rate !!!");
      return;
    }

    this.page4 = false;
    this.page3 = true;
    this.page2 = false;
    this.page1 = false;
    this.curstep = "3";
    // console.log("page 3");
  }
  topage4() {
    if (this.happiness.toString() === "") {
      alert("Please fill all the details !!!");
      return;
    }
    if (this.stopping.toString() === "") {
      alert("Please fill all the details !!!");
      return;
    }
    this.page4 = true;
    this.page3 = false;
    this.page2 = false;
    this.page1 = false;
    this.curstep = "4";
    this.IsDisable = false;
    this.walkintype = this.siteVisitId;
    console.log("page 4");
    if (this.walkintype === "" || this.walkintype === undefined) {
      console.log("directory not found");
      this.value = "Direct";
      this.directwalkin = true;
      this.walkinrec.Walkin_Type__c = "Direct";
    } else {
      console.log("type@@@@");
      this.value = "Scheduled";
      this.walkinrec.Walkin_Type__c = "Scheduled";
    }
    this.IsDisable = true;
    if (this.walkintype !== " ") {
      console.log("walkinType");
      console.log("this.walkintype", this.walkintype);
      getleaddetails({ sitevisitId: this.walkintype })
        .then((result) => {
          console.log("is@@@@", this.walkintype);
          console.log(result);
          const myArr = JSON.parse(result);
          console.log("Record ", myArr.Name);
          console.log("Age ", myArr.Age_Group__c);
          console.log("Id ", myArr.Id);
          this.walkinrec.Lead__c = myArr.Id;
          this.walkinrec.Name__c = myArr.Name;

          this.walkinrec.Email__c = myArr.Email;
          this.walkinrec.Project__c = myArr.Project__c;
          this.walkinrec.Mobile_No__c = myArr.MobilePhone;
          this.walkinrec.Source__c = myArr.Campaign_Channel__c;
          this.walkinrec.Industry__c = myArr.Industry__r.Name;
          this.walkinrec.Designation__c = myArr.Designation__c;
          this.walkinrec.Company__c = myArr.Company;
          this.walkinrec.Location__c = myArr.Current_Location__c;
          this.walkinrec.Age__c = myArr.Age_Group__c;

          this.error = undefined;
        })
        .catch((error) => {
          this.error = error;
          console.log("error", this.error);
          this.accounts = undefined;
        });
    } //if
  }
  get thankBack() {
    return `background-image:url(${sumadhuraImage2});
        width: 100vw;
        height: 100vh;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-position-y: -190px;`;
  }
}