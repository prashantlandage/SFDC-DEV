import { LightningElement, api, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getUnitDetails from "@salesforce/apex/unitcheck.getUnitDetails";
import vmimg from "@salesforce/resourceUrl/viewmoreimg";

export default class Unitdetpopup extends NavigationMixin(LightningElement) {
  @api unitId;
  @track unitdata;
  @track unitidval;
  @track allunitdata;
  @track partialdata;
  @track showall = false;
  imageURL = vmimg;
  columns = [
    {
      label: "Description",
      fieldName: "Name",
      type: "text",
      wrapText: true,
      hideDefaultActions: true,
      cellAttributes: { class: "first-column-bold" }
    },
    {
      label: "Value",
      fieldName: "Value",
      type: "text",
      wrapText: true,
      hideDefaultActions: true
    }
  ];

  @wire(getUnitDetails, { UnitId: "$unitId" })
  wiredUnitRecord({ error, data }) {
    if (data) {
      //this.unitdata = data;
      this.allunitdata = data;
      this.unitdata = data.slice(0, 7);
      this.partialdata = data.slice(0, 7);
      this.unitidval = this.unitId;
      this.columndata = this.columns;
      console.log("Unit Id ==>", this.unitId);
      console.log("Unit Details ==>", this.unitdata);
    } else if (error) {
      console.error("Error Fetching Unit Record", error);
    }
  }
  showalldata(event) {
    this.showall = !this.showall;
    console.log("Show All ==> ", this.showall);
    if (this.showall === true) this.unitdata = this.allunitdata;
    else this.unitdata = this.partialdata;
  }

  closeModal(event) {
    //dispatch event
    const closebtnevent = new CustomEvent("closeevent");

    this.dispatchEvent(closebtnevent);
  }

  handleView(event) {
    //Navigate to Unit View Page
    console.log("Unit Id in View ==>", this.unitId);
    console.log("Unit Record Id in View ==>", this.unitidval);
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.unitId,
        objectApiName: "Unit__c",
        actionName: "view"
      }
    });
  }
}