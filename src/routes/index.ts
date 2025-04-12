import { generateAuthRouter } from "./auth-routes";
import { generateIngredientRouter } from "./ingredient-routes";
import { generateUserRouter } from "./user-routes";



export const AppRoutes = {
    auth: generateAuthRouter,
    users: generateUserRouter,
    ingredients: generateIngredientRouter
}