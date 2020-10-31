import axios from 'axios'
import {key} from '../config'
export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=${this.query}&addRecipeInformation=${true}&sort=popularity`)
            this.result = res.data.results
            //console.log(this.result)
        } catch(err) {
            alert(err)
        }
        
        
    }
}

//a
// 9841af41888f449f9e2555e046f538af
// https://api.spoonacular.com/recipes/complexSearch