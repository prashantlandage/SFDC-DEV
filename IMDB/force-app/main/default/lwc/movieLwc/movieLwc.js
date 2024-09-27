import { LightningElement,api,wire,track } from 'lwc';
import getmovies from '@salesforce/apex/IMDBController.getmovies';
export default class MovieLwc extends LightningElement
{
    entertext='';
    searchtext='';
    showtext='Please Enter valid Movie Name';
    movies=[];
    handlechange(event)
    {
        this.entertext=event.target.value;
        
    }

    handleclick(event)
    {

        this.searchtext=this.entertext;
       

    }
   
    @wire(getmovies,{searchtext:'$searchtext'})
    fetchmovies(result)
    {
        if(result.data)
        {

            let data = JSON.parse(result.data);
            console.log('@@@data',data);

            if(data.success)
                {
                    this.movies=data.result;
                    this.showtext='';
                    console.log('@@@movie',JSON.stringify(this.movies));
                }
                else
                {
                    this.movies=[]
                    this.showtext='please enter the valid movie name'
                }

        }
        else if(result.error)
        {
            console.log('Error occured while searching movies'+ result.error)
            this.showtext='Error occured while searching movies'+ result.error
        }
        

    }
}