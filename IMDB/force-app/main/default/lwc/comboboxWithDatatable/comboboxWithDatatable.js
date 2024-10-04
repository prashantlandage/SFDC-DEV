import { LightningElement, track, api } from 'lwc';
import getaccounts from '@salesforce/apex/ComboboxWithDatable.getaccount';
import getcontacts from '@salesforce/apex/ComboboxWithDatable.getcontacts';

const COLUMNS = [
    { label: 'Contact Name', fieldName: 'Name' },
    { label: 'Contact Email', fieldName: 'Email' }
];

export default class ComboboxWithDatatable extends LightningElement {
    @track value = '';         
    @track optionsarray = [];  
    @track cardvisible = false; 
    @track data = [];          
    @track columns = COLUMNS;  

    
    get options() {
        return this.optionsarray;
    }

    
    connectedCallback() {
        getaccounts()
            .then(result => {
                let arr = [];
                for (var i = 0; i < result.length; i++) {
                    arr.push({ label: result[i].Name, value: result[i].Id });
                }
                this.optionsarray = arr;
            })
            .catch(error => {
                console.error('Error fetching accounts: ', error);
            });
    }

    
    handlechangevalue(event) {
        this.cardvisible = true;
        this.value = event.detail.value;
        console.log('Selected account ID: ', this.value);

        
        getcontacts({ selectedAccountId: this.value })
            .then(result => {
                this.data = result;
            })
            .catch(error => {
                console.error('Error fetching contacts: ', error);
                window.alert('Error occurred: ' + JSON.stringify(error));
            });
    }
}
