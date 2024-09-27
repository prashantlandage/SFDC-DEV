import { LightningElement, wire, track , api } from 'lwc';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
 
export default class DependedPickListLWC extends LightningElement {
     
    @api objectApiName;
    @api objectRecordTypeId;
    @api controllerFieldApiName;
    @api controllerFieldLabel;
    @api dependentFieldApiName;
    @api dependentFieldLabel;
     
    @track controllerValue;
    @track dependentValue;
 
    controllingPicklist=[];
    dependentPicklist;
    @track finalDependentVal=[];
    @track selectedControlling="--None--";
  
    showpicklist = false;
    dependentDisabled=true;
    showdependent = false;
    @wire(getPicklistValuesByRecordType, { objectApiName: '$objectApiName', recordTypeId: '$objectRecordTypeId' })
    fetchPicklist({error,data}){
         
        if(data && data.picklistFieldValues){
            let optionsValue = {}
            optionsValue["label"] = "--None--";
            optionsValue["value"] = "";
            this.controllingPicklist.push(optionsValue);
            data.picklistFieldValues[this.controllerFieldApiName].values.forEach(optionData => {
                this.controllingPicklist.push({label : optionData.label, value : optionData.value});
            });
 
            this.dependentPicklist = data.picklistFieldValues[this.dependentFieldApiName];
            this.showpicklist = true;
        } else if(error){
            console.log(error);
        }
    }
 
    fetchDependentValue(event){
        console.log(event.target.value);
        this.dependentDisabled = true;
        this.finalDependentVal=[];
        this.showdependent = false;
        const selectedVal = event.target.value;
        this.controllerValue = selectedVal;
        this.finalDependentVal.push({label : "--None--", value : ""})
        let controllerValues = this.dependentPicklist.controllerValues;
        this.dependentPicklist.values.forEach(depVal => {
            depVal.validFor.forEach(depKey =>{
                if(depKey === controllerValues[selectedVal]){
                    this.dependentDisabled = false;
                    this.showdependent = true;
                    this.finalDependentVal.push({label : depVal.label, value : depVal.value});
                }
            });
              
        });
    }
 
    handleDependentPicklist(event){
        this.dependentValue = event.target.value;
        // send this to parent 
        let paramData = {controllerValue : this.controllerValue, dependentValue : this.dependentValue};
        let ev = new CustomEvent('childmethod', 
                                 {detail : paramData}
                                );
        this.dispatchEvent(ev); 
    }
}