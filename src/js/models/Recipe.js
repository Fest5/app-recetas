import axios from 'axios'
import {key} from '../config'


export default class Recipe {
    constructor(id) {
        this.id = id
    }

    async getRecipe() {
        try {
            const res = await axios(`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}`)
            this.title = res.data.title
            this.author = res.data.sourceName
            this.img = res.data.image
            this.url = res.data.sourceUrl
            this.ingredients = res.data.extendedIngredients
            this.time = res.data.readyInMinutes
            this.servings = res.data.servings
            
        }
        catch(error) {
            console.log(error)
            alert('Something went wrong')
        }
    }

    calcServings() {
        
    }

    parseIngredients() {

        const newIngredients = this.ingredients.map(el => {
            let unit = el.unit
            let unitShort = el.measures.us.unitShort
            let allUnits = [unitShort, 'tbsps', 'tbsp', 'kg', 'g']

            // 1) uniform units
            let ingredient = el.original
            ingredient = ingredient.replace(unit, unitShort)
            ingredient = ingredient.toLowerCase()

            // 2) Remove parentheses

            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ')

            // 2) parse ingredients into count, unit and ingredient

            const arrIng = ingredient.split(' ')
            const unitIndex = arrIng.findIndex(el2 => allUnits.includes(el2))


            let objIng;
            if (unitIndex > -1) {
                // There is a Unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2]. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'))
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            }         
            else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but the first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } 
            else if (unitIndex === -1) {
                // There is no unit
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
            }
            }

            return objIng

        })
        this.ingredients = newIngredients
    }

    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings)
        });


        this.servings = newServings

    }
}