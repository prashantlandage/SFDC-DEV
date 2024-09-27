import { LightningElement,wire,track,api } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import Account_obj from '@salesforce/schema/Account';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import country_field from '@salesforce/schema/Account.Country__c';
import state_field from '@salesforce/schema/Account.State__c';


export default class NormalDependentPick extends LightningElement 
{
    statedata;

    isdisabled=true;
    @wire(getObjectInfo,{objectApiName:Account_obj})
    accountinfo
    @track countryoptions
    @track stateoptions 

    @wire(getPicklistValues,{recordTypeId:'$accountinfo.data.defaultRecordTypeId',fieldApiName:state_field})
    statefieldInfo({data,error})
    {
        if(data)
        {
            this.statedata=data.values;
            //console.log(JSON.stringify(this.statedata),'---->');
        }
    }

    @wire(getPicklistValues,{recordTypeId:'$accountinfo.data.defaultRecordTypeId',fieldApiName:country_field})
    countryfieldInfo({data,error})
    {
        if(data)
        {
            this.countryoptions=data.values;
            //console.log(JSON.stringify(this.countryoptions),'---->');
        }
    }

    handlecountrychange(event)
    {
        this.isdisabled=true;
        console.log('----->',event.target.value);
        console.log('----->',JSON.stringify(this.statedata));
        let key = this.statedata.controllerValues[event.target.value];
        console.log('----->',JSON.stringify(this.key));
        this.stateoptions=this.statedata
        console.log('----->',JSON.stringify(this.statedata));
       
    }
    
    
    
}