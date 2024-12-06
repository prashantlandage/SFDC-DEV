import { LightningElement, track, wire } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import UNIT_OBJECT from "@salesforce/schema/Unit__c";
import OWNERSHIPTYPE_FIELD from "@salesforce/schema/Unit__c.Ownership_Type__c";
import BOOKINGTYPE_FIELD from "@salesforce/schema/Unit__c.Booking_Status__c";
import getProjectRecords from "@salesforce/apex/unitAvailabilityController.getProjectRecords";
import getPhaseRecords from "@salesforce/apex/unitAvailabilityController.getPhaseRecords";
import getBlockRecords from "@salesforce/apex/unitAvailabilityController.getBlockRecords";
import getFloorRecords from "@salesforce/apex/unitcheck.getFloorDetails";
import getUniqueSBUARecords from "@salesforce/apex/unitAvailabilityController.getUniqueSBUARecords";
import getOwnershipGroupRecords from "@salesforce/apex/unitAvailabilityController.getOwnershipGroupRecords";
import getUniqueFacingRecords from "@salesforce/apex/unitAvailabilityController.getUniqueFacingRecords";
import getUnitRecordsByFilter from "@salesforce/apex/unitcheck.getFilteredUnitRecords";

const columns = [
  { label: "Flat No.", fieldName: "Name", type: "text" },
  { label: "Ownership Type", fieldName: "Ownership_Type__c", type: "text" },
  { label: "Booking Status", fieldName: "Booking_Status__c", type: "text" },
  {
    label: "Ownership Group Name",
    fieldName: "Ownership_Group__r.Name",
    type: "text"
  }
];

///const projectListOptions = this.mapOptions(data, includeAllOption, 'All Projects', 'None');
export default class UnitAvailabilityPage extends LightningElement {
  columns = columns;
  popoverContent = {}; // Initialize the popoverContent property
  @track floorWrapperList = [];
  @track floorsWithUnits = [];
  @track filteredUnitsSBUA = [];
  @track projectListOptions = [];
  @track selectedProject = "";
  @track phaseListOptions = [];
  @track selectedPhase = "";
  @track blockListOptions = [];
  @track selectedBlock = "";
  @track floorListOptions = [];
  @track selectedFloor = "";
  @track ownershipTypeOptions = [];
  @track selectedOwnershipType = "";
  @track bookingstatusoptions = [];
  @track selectedbookingstatus = "";
  @track ownershipGroup = [];
  @track selectedOwnershipGroup = "";
  @track SBUAListOptions = [];
  @track selectedSBUA = "";
  @track FacingTypeOptions = [];
  @track selectedFacingValue = "";
  @track filteredUnitRecords = [];
  @track showRecords = false; //Track if the "Show" button has been clicked
  @track blockLevelRecords = [];
  @track FloorLevelRecords = false;
  @track selectedOwnershipGroupName = "";
  //Trackable Properties for showing Unit modal popup
  @track ShowUnitDetails = false;
  @track unitId = "";
  @track left;
  @track top;

  // showButtonClicked = false;

  showLegendEntry = true;
  prevSelectedProject = ""; // Add this property

  @wire(getProjectRecords)
  wiredProjectRecord({ error, data }) {
    if (data) {
      this.projectListOptions = this.mapOptions(data);
    } else if (error) {
      console.error("Error fetching records", error);
    }
  }

  connectedCallback() {
    this.template.addEventListener(
      "change",
      this.handleProjectChange.bind(this)
    );
  }
  handleProjectChange(event) {
    const comboboxId = event.target.dataset.id;
    const newValue = event.detail.value;

    if (comboboxId === "projectCombobox") {
      if (newValue !== this.selectedProject) {
        this.shouldShowFloorName = false; // Set to false when "Project" changes
        this.showLegendEntry = false;
        this.blockListOptions = " ";
        this.floorListOptions = " ";
        this.floorWrapperList = []; // clear the current Display of floors & its units
      }
      this.selectedProject = newValue;
    }
  }

  @wire(getPhaseRecords, { phase: "$selectedProject" })
  wiredPhaseOptions({ error, data }) {
    if (data) {
      this.phaseListOptions = this.mapOptions(data);
      this.floorListOptions = "";
    } else if (error) {
      console.error("Error fetching records", error);
    }
  }
  @wire(getBlockRecords, { block: "$selectedPhase" })
  wiredBlockRecord({ error, data }) {
    if (data) {
      this.blockListOptions = this.mapOptions(data);
    } else if (error) {
      console.error("Error fetching records", error);
    }
  }

  handlePhaseChange(event) {
    this.selectedPhase = event.detail.value;
    this.showLegendEntry = false;
    this.shouldShowFloorName = false;
    this.blockListOptions = "";
    this.floorListOptions = "";
    this.selectedOwnershipType = ""; // Clear the selected ownership type
    this.selectedbookingstatus = ""; // Clear the selected booking status
    this.selectedOwnershipGroup = "";
    this.selectedFacingValue = "";
    this.selectedBlock = "";
    this.selectedFloor = "";

    this.selectedSBUA = ""; // Clear the selected ownership group
    this.floorWrapperList = []; // clear the current Display of floors & its units
  }

  //JS CODE a new method to check if a floor has associated units based on the selected block://
  @wire(getFloorRecords, {
    blockId: "$selectedBlock"
  })
  //floorWrapperList;
  wiredFloorRecord({ error, data }) {
    if (data) {
      //this.floorListOptions = this.mapOptions(data);
      this.floorListOptions = [
        { label: "All", value: "" }, // Add "All" option
        ...data.map((item) => ({
          label: item.Name,
          value: item.Id
        }))
      ];
    } else if (error) {
      console.error("Error fetching records Floor Records", error);
    }
  }
  handleBlockChange(event) {
    this.selectedBlock = event.detail.value;
    // this.floorListOptions = [];
    this.selectedFloor = "";
    this.floorWrapperList = [];
    //  this.floorsWithUnits = [];
    // Clear the floorsWithUnits
    this.selectedOwnershipType = ""; // Clear the selected ownership type
    this.selectedbookingstatus = ""; // Clear the selected booking status
    this.selectedOwnershipGroup = ""; // Clear the selected ownership group
    this.selectedFacingValue = "";
    this.selectedSBUA = "";
  }
  //Method to handle OwnershipType, Booking Status Picklist values
  @wire(getObjectInfo, { objectApiName: UNIT_OBJECT })
  objectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: OWNERSHIPTYPE_FIELD
  })
  wiredOwnershipTypeRecord({ error, data }) {
    if (data) {
      /* this.ownershipTypeOptions = data.values.map((item) => ({
        label: item.label,
        value: item.value
      }));*/
      this.ownershipTypeOptions = [
        { label: "All", value: "" }, // Add "All" option
        ...data.values.map((item) => ({
          label: item.label,
          value: item.value
        }))
      ];
    } else if (error) {
      console.error("Error fetching records", error);
    }
  }
  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: BOOKINGTYPE_FIELD
  })
  wiredBookingStatuseRecord({ error, data }) {
    if (data) {
      /* this.bookingstatusoptions = data.values.map((item) => ({
        label: item.label,
        value: item.value
      }));*/
      this.bookingstatusoptions = [
        { label: "All", value: "" }, // Add "All" option
        ...data.values.map((item) => ({
          label: item.label,
          value: item.value
        }))
      ];
    } else if (error) {
      console.error("Error fetching records", error);
    }
  }

  @wire(getOwnershipGroupRecords, {
    ownershiptypename: "$selectedOwnershipType"
  })
  wiredOwnershipGroupRecord({ error, data }) {
    if (data) {
      this.ownershipGroup = this.mapOptions(data);
    } else if (error) {
      console.error("Error fetching records", error);
    }
  }

  @wire(getUniqueFacingRecords, {
    blockId: "$selectedBlock",
    floorId: "$selectedFloor"
  })
  wiredFacingRecords({ error, data }) {
    if (data) {
      this.FacingTypeOptions = [
        { label: "All", value: "" }, // Add "All" option
        ...data.map((facing) => ({
          label: facing,
          value: facing
        }))
      ];
    } else if (error) {
      console.error("Error fetching Facing records", error);
    }
  }
  @wire(getUniqueSBUARecords, {
    blockId: "$selectedBlock",
    floorId: "$selectedFloor"
  })
  wiredUnitSBUARecords({ error, data }) {
    if (data) {
      // Convert the list to a set to remove duplicates
      this.SBUAListOptions = [
        { label: "All", value: "" }, // Add "All" option
        ...[...new Set(data)].map((item) => ({
          label: item.toString(),
          value: item.toString()
        }))
      ];
    } else if (error) {
      console.error("Error fetching Facing records", error);
    }
  }

  mapOptions(data) {
    return data.map((record) => ({ label: record.Name, value: record.Id }));
  }
  /*  mapOptions(
    data,
    includeAllOption = false,
    allLabel = "All",
    noneLabel = "None"
  ) {
    const options = includeAllOption ? [{ label: allLabel, value: "" }] : [];

    options.push(
      ...data.map((record) => ({ label: record.Name, value: record.Id }))
    );

    if (noneLabel) {
      options.push({ label: noneLabel, value: "" });
    }

    return options;
  }
*/
  @wire(getUnitRecordsByFilter, {
    blockId: "$selectedBlock",
    floorId: "$selectedFloor",
    ownershiptype: "$selectedOwnershipType",
    ownershipgroupname: "$selectedOwnershipGroup",
    bookingstatus: "$selectedbookingstatus",
    facing: "$selectedFacingValue",
    sbua: "$selectedSBUA"
  })
  wiredUnitsFilterRecords({ error, data }) {
    console.log("Booking Status Inside wire ==> ", this.selectedbookingstatus);
    if (data) {
      this.floorWrapperList = data;
      this.floorWrapperList = data.map((floor) => ({
        ...floor,
        floorCode: floor.FloorCodes__c,
        uniqueUnits: floor.uniqueUnits.map((record) => ({
          ...record,
          iconClass: this.getIconClasses(record),
          popoverContent: `Unit Name: ${record.Name}, Ownership Type: ${record.Ownership_Type__c}, Booking Status: ${record.Booking_Status__c}`
        }))
      }));
    }
    console.log("getting Floorcodes" + this.floorWrapperList);
    this.blockLevelRecords = this.floorWrapperList;
    if (this.selectedFloor) {
      this.floorWrapperList = this.blockLevelRecords.filter(
        (floorWrapper) => floorWrapper.floor.Id === this.selectedFloor
      );
    }
    // Handle error if needed
    else if (error) {
      this.error = error;
      console.log("getUnitRecordsByFilter error", this.error);
      this.data = undefined;
    }
  }

  updateIconClasses() {
    this.floorWrapperList = this.floorWrapperList.map((floor) => {
      return {
        ...floor,
        uniqueUnits: floor.uniqueUnits.map((record) => {
          return {
            ...record,
            iconClass: this.getIconClasses(record)
          };
        })
      };
    });
  }

  getIconClasses(record) {
    // Return dynamic CSS class based on record conditions

    switch (`${record.BookingStatus}_${record.ownerType}`) {
      //Condition Set for Owner Type - BUILDER
      case "Available_Builder":
        return "builder-available";

      case "Booked_Builder":
        return "builder-booked";

      case "Blocked_Builder":
        return "builder-blocked";

      case "Mortgage_Builder":
        return "builder-mortgage";

      case "Mortgage and Block_Builder":
        return "builder-mortgageblock";

      case "Not Open_Builder":
        return "builder-notopen";

      //Condition Set for Owner Type - Land Owner

      case "Available_Land Owner":
        return "landowner-available";

      case "Booked_Land Owner":
        return "landowner-booked";

      case "Blocked_Land Owner":
        return "landowner-blocked";

      case "Mortgage_Land Owner":
        return "landowner-mortgage";

      case "Mortgage and Block_Land Owner":
        return "landowner-mortgageblock";

      case "Not Open_Land Owner":
        return "landowner-notopen";

      //Condition Set for Owner Type - Third Party
      case "Available_Third Party":
        return "thirdparty-available";

      case "Booked_Third Party":
        return "thirdparty-booked";

      case "Blocked_Third Party":
        return "thirdparty-blocked";

      case "Mortgage_Third Party":
        return "thirdparty-mortgage";

      case "Mortgage and Block_Third Party":
        return "thirdparty-mortgageblock";

      case "Not Open_Third Party":
        return "thirdparty-notopen";

      case "other_other":
        return "other-other";

      default:
        return "default-style";
    }
  }

  handleFloorChange(event) {
    this.selectedFloor = event.detail.value;
    if (this.selectedFloor === "All") {
      // Handle the "All" option selection
      this.selectedFloor = " ";
    }

    /*
      this.showRecords = true;
      console.log('Showing Records', +this.floorWrapperList);*/
    this.selectedOwnershipType = ""; // Clear the selected ownership type
    this.selectedbookingstatus = ""; // Clear the selected booking status
    this.selectedOwnershipGroup = ""; // Clear the selected ownership group
    this.selectedOwnershipType = ""; // Clear the selected ownership type
    this.selectedFacingValue = "";
    this.selectedSBUA = "";
  }

  handleOwernshipTypeChange(event) {
    this.selectedOwnershipGroup = "";
    this.selectedOwnershipType = event.detail.value;

    if (this.selectedOwnershipType === "All") {
      // Handle the "All" option selection
      this.selectedOwnershipType = "";
      this.selectedOwnershipGroup = "";
    }
  }
  handleBookingStatusChange(event) {
    console.log("Booking Status ==>", event.detail.value);

    if (event.detail.value === "All") this.selectedbookingstatus = "";
    else this.selectedbookingstatus = event.detail.value;
  }
  handleOwnershipGroupChange(event) {
    this.selectedOwnershipGroup = event.detail.value;
  }
  handleSBUAChange(event) {
    this.selectedSBUA = event.detail.value;
    console.log(typeof this.selectedSBUA);
  }
  handleFacingChange(event) {
    this.selectedFacingValue = event.detail.value;
  }

  /* FROM here  unit Availability pop-up modal*/
  get boxClass() {
    // return `background-color:white; top:${this.top - 280}px; left:${this.left}px`;
    var a =
      "background-color:white;position:absolute; top:" +
      this.top +
      "px;left:" +
      this.left +
      "px";
    console.log("a==>", a);
    return a;
  }
  showModal(event) {
    console.log("Unit Id ", event.target.getAttribute("data-id"));

    const x = event.pageX;
    const y = event.pageY;
    this.top = y - 460;
    this.left = x - 10;

    this.unitId = event.target.getAttribute("data-id");
    if (
      event.target.getAttribute("data-id") != null &&
      event.target.getAttribute("data-id") !== "" &&
      event.target.getAttribute("data-id") !== undefined
    ) {
      this.ShowUnitDetails = true;
    } else this.ShowUnitDetails = false;
  }

  hideModal(event) {
    this.ShowUnitDetails = false;
  }
}