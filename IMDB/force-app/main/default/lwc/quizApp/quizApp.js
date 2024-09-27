import Name from '@salesforce/schema/Account.Name';
import { LightningElement,wire } from 'lwc';
import getquestion from '@salesforce/apex/questionsData.getquestions';
export default class QuizApp extends LightningElement 
{
    isstarted=false;
    submitted = false;
    allQuestions;
    @wire(getquestion)
    questionHandle({data,error})
    {

        if(data)
        {
            console.log('&&',JSON.stringify(data));
            this.allQuestions=data;
        }
        if(error)
        {
            console.log(error);
        }
    }
        /*allQuestions =[
            {
                id:'1',
                question :'what is capital of maharashtra',
                options:{
                    a: 'Mumbai',
                    b:'delhi',
                    c:'Hyderabad'
                },
                answer :'a'

            },

            {
                id:'2',
                question :'How many records of the solution can be imported using the import wizard?',
                options:{
                    a: '5000',
                    b:'500',
                    c:'50000'
                },
                answer :'c'

            },

            {
                id:'3',
                question :' What is Salesforce?',
                options:{
                    a: 'An RCM system',
                    b:'A CRM system',
                    c:'A Chrome extension'
                },
                answer :'b'

            },

            {
                id:'4',
                question :'When a field is taken out of the page layout, is it also taken out of the Object?',
                options:{
                    a: 'No',
                    b:'Yes',
                    c:'None of these'
                    
                },
                answer :'b'

            },

            
        ]*/

    selectedValue={};
    correctAnswer=0;
    handleradio(event)
    {
         
        const name=event.target.name;
        const value=event.target.value;
      //  console.log(event.target.name);
       // console.log(event.target.value);
        
        this.selectedValue={...this.selectedValue,[name]:value}
       // console.log(this.selectedValue);
    }

    handleSubmit(event)
    {

        let newarray= this.allQuestions.filter(item => this.selectedValue[item.Name] === item.answer__c);
        //console.log('newarray.length',newarray.length);
        this.correctAnswer=newarray.length;
        //console.log('this.correctAnswer',this.correctAnswer);
        if(this.correctAnswer>0)
        {
            this.submitted=true;
        }
        
    }

    handleReset(event)
    {
        this.selectedValue={};
        this.correctAnswer=0;
        this.template.querySelectorAll('input[type="radio"]').forEach(curreitem=>{
            curreitem.checked=false;
        })
        this.submitted=false;
    }
    startquiz()
    {
        this.isstarted=true;
    }
    closequiz()
    {
        this.isstarted=false;
    }
}