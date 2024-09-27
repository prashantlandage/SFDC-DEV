import { LightningElement,api,track } from "lwc";
import getRecipe from "@salesforce/apex/Spoonacular.getRecipe";
import getImageUrl  from "@salesforce/apex/ImageUrlController.getImage"
export default class Receipe extends LightningElement {
  @track imageUrl;
  @api title;
  @api price;
  @api time;
  @api summary;
  @api recipeId;
  @api image;
  @api
  set dishTypes(data) {
    this.dishList = data && data.join();
  }
  get dishTypes() {
    return this.dishList;
  }
  @api
  set diets(data) {
    this.dietList = data && data.join();
  }
  get diets() {
    return this.dietList;
  }
  dishList;
  dietList;

//   connectedCallback() {
//     // Fetch image URL when component loads
//     this.fetchImage();
//   }
//   fetchImage() {
//     getImageUrl()
//         .then((data) => {
//             this.imageUrl = data; 
//             console.log('Image URL:', this.imageUrl);  // Check if the data URL is valid
//         })
//         .catch((error) => {
//             console.error('Error fetching image URL:', error);
//         });
// }

  fetchRecipe() {
    getRecipe({ recipeId: this.recipeId })
      .then((data) => {
        console.log(data);
        const recipe = JSON.parse(data);
        console.log(this.recipe);
        if (recipe) {
          this.image = recipe;
          this.price = recipe.pricePerServing;
          this.time = recipe.readyInMinutes;
          this.summary = recipe.summary;
          this.dishList = recipe.dishTypes && recipe.dishTypes.join();
          this.dietList = recipe.diets && recipe.diets.join();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

 
  get hasDetails() {
    return this.summary ? true : false;
  }
}