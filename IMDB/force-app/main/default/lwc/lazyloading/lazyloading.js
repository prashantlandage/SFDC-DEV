import { LightningElement,track,wire } from 'lwc';
import getAccounts from '@salesforce/apex/lazyloadingController.getaccounts';


const COLUMNS=[
    {label:'Id',fieldName:'Id',Type:'text'},
    {label:'Account Name',fieldName:'Name',Type:'text'},
    {label:'Account Rating',fieldName:'Rating',Type:'text'}
]

export default class Lazyloading extends LightningElement
 {
    accounts=[];
    error;
    columns=COLUMNS;
    rowLimit=5;
    rowoffset=0;

    connectedCallback()
    {
        this.loadData();
    }

    loadData()
    {
        return getAccounts({LimitSize:this.rowLimit,Offset:this.rowoffset})
        .then(result=>{
            let updatedrecords=[...this.accounts, ...result];
            this.accounts=updatedrecords;
            console.log('accounts--->',JSON.stringify(this.accounts));
            console.log('updated accounts--->',JSON.stringify(this.updatedrecords));

            this.error=undefined;
        })
        .catch(error=>{
            this.error=error;
            this.accounts=undefined;
        })
    }

    loadmoreData(event)
    {
        const currentrecord=this.accounts;
        const {target} = event;
        this.isloading=true;

        this.rowoffset=this.rowoffset + this.rowLimit;
        
        this.loadData()
        .then(()=>{
            target.isloading=false;
        });
    }

 }