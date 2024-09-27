import { LightningElement,wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import Account_obj from '@salesforce/schema/Account';

export default class GlobalPickListLWC extends LightningElement {
    controllerValue;
    dependentValue;
    
    accountRecordTypeId;
    

    @wire(getObjectInfo, { objectApiName: Account_obj })
    Function({error,data}){
       if(data){
        let objArray  = data.recordTypeInfos;
        for (let i in objArray){
            if(objArray[i].name =="Account")
            this.accountRecordTypeId = objArray[i].recordTypeId
        }
       }else if(error){
        console.log(JSON.stringify(error))
          
        }
     }; 

    callFromChild(event){
        this.controllerValue = event.detail.controllerValue;
        this.dependentValue = event.detail.dependentValue
        alert(this.controllerValue + '----' + this.dependentValue);
        console.log(JSON.stringify(event.detail));
    }
}