const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fetch = require("node-fetch");
const app = express();
const port = process.env.PORT || 3001; // Use Vercel's assigned port or 3001 locally

app.use(cors()); // Enable CORS for all origins (adjust for specific origins in production if needed)
app.use(express.json()); // Enable parsing of JSON request bodies

// --- Recipe and Health Conditions Data ---
// NOTE: For a real application with hundreds of recipes, you would typically load this
// from a large JSON file (e.g., 'const allRecipesData = require('./recipes_data.json');')
// after generating it with your Python script.
// For this self-contained example, a representative sample is embedded directly.

function generateRecipeData(
  meal_name,
  category,
  area,
  instructions,
  tags,
  ingredients,
  total_time
) {
  const thumb_url = `https://placehold.co/600x400/B2DFDB/004D40?text=${meal_name.replace(
    / /g,
    "+"
  )}`;
  return {
    strMeal: meal_name,
    strCategory: category,
    strArea: area,
    strInstructions: instructions,
    strMealThumb: thumb_url,
    strTags: tags,
    ingredients: ingredients,
    totalTime: total_time,
  };
}

const healthConditionsData = {
  diabetes: {
    keywords: [
      "diabetes",
      "diabetic",
      "blood sugar",
      "insulin",
      "low-sugar",
      "sugar-free",
      "low-carb",
    ],
    clarification:
      "To help me suggest the best recipe, could you tell me if you have any other dietary restrictions or allergies, and what kind of cuisine you prefer? (e.g., low-carb, no added sugar, vegetarian, Asian, Mediterranean)",
    recipes: [
      generateRecipeData(
        "Berry Chia Pudding",
        "Breakfast",
        "Healthy",
        "Combine chia seeds, unsweetened almond milk, and mixed berries in a jar. Stir well. Refrigerate overnight. Top with a few nuts before serving.",
        "Healthy,Low-Carb,Diabetes-Friendly,Breakfast",
        [
          { ingredient: "Chia Seeds", measure: "3 tbsp" },
          { ingredient: "Unsweetened Almond Milk", measure: "1 cup" },
          { ingredient: "Mixed Berries", measure: "1/2 cup" },
          { ingredient: "Optional: Nuts", measure: "1 tbsp" },
        ],
        "5 mins prep + overnight chill"
      ),
      generateRecipeData(
        "Lentil Salad with Feta and Veggies",
        "Salad",
        "Mediterranean",
        "Cook lentils according to package directions. Mix with chopped cucumber, bell peppers, cherry tomatoes, red onion, and crumbled feta cheese. Dress with lemon-herb vinaigrette.",
        "Healthy,Diabetes-Friendly,Vegetarian,Lunch",
        [
          { ingredient: "Cooked Lentils", measure: "1 cup" },
          { ingredient: "Cucumber", measure: "1/2 chopped" },
          { ingredient: "Bell Peppers", measure: "1/2 cup chopped" },
          { ingredient: "Cherry Tomatoes", measure: "1/2 cup halved" },
          { ingredient: "Red Onion", measure: "1/4 chopped" },
          { ingredient: "Feta Cheese", measure: "1/4 cup crumbled" },
          { ingredient: "Lemon-Herb Vinaigrette", measure: "2 tbsp" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Baked Salmon with Roasted Asparagus",
        "Seafood",
        "Healthy",
        "Preheat oven to 400°F (200°C). Place salmon fillets and asparagus on a baking sheet. Drizzle with olive oil, season with salt, pepper, and lemon juice. Bake for 12-15 minutes.",
        "Healthy,Low-Carb,Diabetes-Friendly,Fish",
        [
          { ingredient: "Salmon Fillets", measure: "2 (6oz each)" },
          { ingredient: "Asparagus", measure: "1 bunch" },
          { ingredient: "Olive Oil", measure: "2 tbsp" },
          { ingredient: "Lemon", measure: "1/2" },
          { ingredient: "Salt", measure: "to taste" },
          { ingredient: "Black Pepper", measure: "to taste" },
        ],
        "25 mins"
      ),
      generateRecipeData(
        "Chicken & Veggie Skewers",
        "Chicken",
        "Grill",
        "Cut chicken breast and various non-starchy vegetables (bell peppers, zucchini, cherry tomatoes) into chunks. Thread onto skewers. Marinate in a sugar-free herb marinade. Grill until cooked through.",
        "Healthy,Low-Carb,Diabetes-Friendly,Grill",
        [
          { ingredient: "Chicken Breast", measure: "1 lb" },
          { ingredient: "Bell Peppers", measure: "1" },
          { ingredient: "Zucchini", measure: "1" },
          { ingredient: "Cherry Tomatoes", measure: "1 cup" },
          { ingredient: "Sugar-Free Marinade", measure: "1/4 cup" },
        ],
        "35 mins"
      ),
      generateRecipeData(
        "Spinach and Mushroom Omelette",
        "Breakfast",
        "Vegetarian",
        "Whisk eggs with a splash of milk (dairy-free if preferred). Sauté spinach and mushrooms. Pour eggs over veggies in a non-stick pan. Cook until set.",
        "Healthy,Low-Carb,Diabetes-Friendly,Breakfast,Vegetarian",
        [
          { ingredient: "Eggs", measure: "3" },
          { ingredient: "Fresh Spinach", measure: "1 cup" },
          { ingredient: "Mushrooms", measure: "1/2 cup sliced" },
          { ingredient: "Milk (or almond milk)", measure: "1 tbsp" },
          { ingredient: "Olive Oil", measure: "1 tsp" },
        ],
        "15 mins"
      ),
      generateRecipeData(
        "Spanish Omelet",
        "Breakfast",
        "General",
        "A tasty dish with a healthy array of vegetables, suitable for breakfast, brunch, or any meal. Serve with fresh fruit salad and a whole grain dinner roll.",
        "Diabetes-Friendly,Low-Sodium,Heart-Healthy",
        [
          {
            ingredient: "Small Potatoes",
            measure: "5, peeled and sliced (about 1 1/4 lb)",
          },
          { ingredient: "Vegetable Cooking Spray", measure: "as needed" },
          { ingredient: "Medium Onion", measure: "1/2, minced" },
          { ingredient: "Small Zucchini", measure: "1, sliced" },
          {
            ingredient: "Green/Red Peppers",
            measure: "1 1/2 cups, sliced thin",
          },
          { ingredient: "Medium Mushrooms", measure: "5, sliced" },
          { ingredient: "Whole Eggs", measure: "3, beaten" },
          { ingredient: "Egg Whites", measure: "5, beaten" },
          { ingredient: "Pepper", measure: "to taste" },
          { ingredient: "Garlic Salt with Herbs", measure: "to taste" },
          {
            ingredient: "Part-Skim Mozzarella Cheese",
            measure: "3 ounces, shredded",
          },
          { ingredient: "Reduced-Fat Parmesan Cheese", measure: "1 Tbsp" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Caribbean Fiesta",
        "Appetizer",
        "Caribbean",
        "Offers a lower sodium alternative for tortilla lovers using blue corn tortilla chips. Enjoy the crispy texture, fresh vegetables, and delicious cheese.",
        "Diabetes-Friendly,Low-Sodium",
        [
          { ingredient: "Olive Oil", measure: "1 tablespoon" },
          {
            ingredient: "Chicken Tender",
            measure: "1, cut into bite-sized pieces (approx. 2 oz)",
          },
          {
            ingredient: "Seasonings (Curry, Allspice, Scotch Bonnet)",
            measure: "dash, optional",
          },
          { ingredient: "Blue or Yellow Corn Tortilla Chips", measure: "8" },
          {
            ingredient: "Pinto and/or Black Beans",
            measure: "1/4 cup, rinsed and drained",
          },
          { ingredient: "Grape Tomatoes", measure: "4, chopped" },
          {
            ingredient: "Orange Bell Pepper",
            measure: "1/2, seeded and diced",
          },
          { ingredient: "Green Onion", measure: "1/3, peeled and chopped" },
          {
            ingredient: "Reduced-Fat Shredded Cheddar Jack Cheese",
            measure: "1 ounce",
          },
        ],
        "15 mins"
      ),
      generateRecipeData(
        "Turkey Stew",
        "Main Dish",
        "General",
        "Goes nicely with a green leaf lettuce and cucumber salad and a dinner roll. Plantains or corn can be used in place of the potatoes.",
        "Diabetes-Friendly,Low-Sodium",
        [
          { ingredient: "Turkey Breast", measure: "1 pound, cut into cubes" },
          { ingredient: "Whole Wheat Flour", measure: "2 Tbsp" },
          { ingredient: "Salt", measure: "1/4 tsp, optional" },
          { ingredient: "Pepper", measure: "1/4 tsp" },
          { ingredient: "Cumin", measure: "1/4 tsp" },
          { ingredient: "Olive Oil", measure: "1 1/2 Tbsp" },
          { ingredient: "Garlic", measure: "2 cloves, minced" },
          { ingredient: "Medium Onions", measure: "2, sliced" },
          { ingredient: "Celery Stalks", measure: "2, sliced" },
          { ingredient: "Red/Green Bell Pepper", measure: "1 medium, sliced" },
          { ingredient: "Medium Tomato", measure: "1, finely minced" },
          {
            ingredient: "Low-Sodium Beef or Turkey Broth",
            measure: "5 cups, fat removed",
          },
          { ingredient: "Small Potatoes", measure: "5, peeled and cubed" },
          { ingredient: "Small Carrots", measure: "12, cut into large chunks" },
          { ingredient: "Green Peas", measure: "1 1/4 cups" },
        ],
        "45 mins"
      ),
      generateRecipeData(
        "Caribbean Red Snapper",
        "Main Dish",
        "Caribbean",
        "Fish served on top of vegetables with whole grain rice, garnished with parsley. Salmon or chicken breast can be used in place of red snapper.",
        "Diabetes-Friendly,Low-Sodium,Heart-Healthy",
        [
          { ingredient: "Olive Oil", measure: "2 Tbsp" },
          { ingredient: "Medium Onion", measure: "1, chopped" },
          { ingredient: "Red Pepper", measure: "1/2 cup, chopped" },
          { ingredient: "Carrots", measure: "1/2 cup, cut into strips" },
          { ingredient: "Garlic", measure: "1 clove, minced" },
          { ingredient: "Dry White Wine", measure: "1/2 cup" },
          { ingredient: "Red Snapper Fillet", measure: "3/4 pound" },
          { ingredient: "Large Tomato", measure: "1, chopped" },
          { ingredient: "Pitted Ripe Olives", measure: "2 Tbsp, chopped" },
          {
            ingredient: "Low-Fat Feta or Ricotta Cheese",
            measure: "2 Tbsp, crumbled",
          },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Two Cheese Pizza",
        "Main Dish",
        "Italian",
        "Serve with fresh fruit and a mixed green salad garnished with red beans to balance the meal.",
        "Diabetes-Friendly,Low-Sodium",
        [
          { ingredient: "Whole Wheat Flour", measure: "2 Tbsp" },
          {
            ingredient: "Refrigerated Pizza Crust",
            measure: "1 can (13.8 ounces)",
          },
          { ingredient: "Vegetable Cooking Spray", measure: "as needed" },
          { ingredient: "Olive Oil", measure: "2 Tbsp" },
          { ingredient: "Low-Fat Ricotta Cheese", measure: "1/2 cup" },
          { ingredient: "Dried Basil", measure: "1/2 tsp" },
          { ingredient: "Small Onion", measure: "1, minced" },
          { ingredient: "Garlic", measure: "2 cloves, minced" },
          { ingredient: "Salt", measure: "1/4 tsp, optional" },
          {
            ingredient: "Part-Skim Mozzarella Cheese",
            measure: "4 ounces, shredded",
          },
          { ingredient: "Mushrooms", measure: "2 cups, chopped" },
          { ingredient: "Large Red Pepper", measure: "1, cut into strips" },
        ],
        "40 mins"
      ),
    ],
  },
  "high blood pressure": {
    keywords: [
      "high blood pressure",
      "hypertension",
      "low-sodium",
      "heart-healthy",
    ],
    clarification:
      "Understood. To provide the best low-sodium recipe, could you specify if you have any other dietary needs or cuisine preferences?",
    recipes: [
      generateRecipeData(
        "Chicken and Vegetable Stir-fry",
        "Chicken",
        "Asian",
        "Slice chicken breast and various vegetables (broccoli, carrots, snap peas). Stir-fry in a wok with a low-sodium soy sauce or coconut aminos, garlic, and ginger. Serve over brown rice (optional).",
        "Healthy,Low-Sodium,Heart-Healthy,Chicken",
        [
          { ingredient: "Chicken Breast", measure: "1 lb" },
          { ingredient: "Broccoli florets", measure: "1 cup" },
          { ingredient: "Carrots", measure: "1/2 cup sliced" },
          { ingredient: "Snap Peas", measure: "1/2 cup" },
          { ingredient: "Low-Sodium Soy Sauce", measure: "3 tbsp" },
          { ingredient: "Garlic", measure: "2 cloves minced" },
          { ingredient: "Ginger", measure: "1 tsp grated" },
          { ingredient: "Sesame Oil", measure: "1 tsp" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Apple Slices with Almond Butter",
        "Snack",
        "Healthy",
        "Slice an apple and serve with a dollop of unsalted almond butter.",
        "Healthy,Low-Sodium,Snack,Fruit",
        [
          { ingredient: "Apple", measure: "1" },
          { ingredient: "Unsalted Almond Butter", measure: "2 tbsp" },
        ],
        "5 mins"
      ),
      generateRecipeData(
        "Mediterranean Quinoa Bowl",
        "Grain Bowl",
        "Mediterranean",
        "Combine cooked quinoa with cucumber, tomatoes, olives, bell peppers, and chickpeas. Dress with olive oil and lemon juice. Top with fresh parsley.",
        "Healthy,Low-Sodium,Heart-Healthy,Vegetarian,Mediterranean",
        [
          { ingredient: "Cooked Quinoa", measure: "1 cup" },
          { ingredient: "Cucumber", measure: "1/2 diced" },
          { ingredient: "Tomatoes", measure: "1/2 cup diced" },
          { ingredient: "Kalamata Olives", measure: "1/4 cup sliced" },
          { ingredient: "Bell Pepper", measure: "1/2 diced" },
          { ingredient: "Chickpeas", measure: "1/2 cup" },
          { ingredient: "Olive Oil", measure: "2 tbsp" },
          { ingredient: "Lemon Juice", measure: "1 tbsp" },
          { ingredient: "Fresh Parsley", measure: "for garnish" },
        ],
        "20 mins"
      ),
      generateRecipeData(
        "Baked Cod with Steamed Green Beans",
        "Seafood",
        "Simple",
        "Season cod fillets with herbs (dill, parsley), lemon, and pepper (no salt). Bake until flaky. Steam green beans until tender-crisp.",
        "Healthy,Low-Sodium,Heart-Healthy,Fish",
        [
          { ingredient: "Cod Fillets", measure: "2 (6oz each)" },
          { ingredient: "Green Beans", measure: "1 cup" },
          { ingredient: "Lemon", measure: "1/2" },
          { ingredient: "Dried Dill", measure: "1 tsp" },
          { ingredient: "Black Pepper", measure: "to taste" },
        ],
        "25 mins"
      ),
      generateRecipeData(
        "Berry Smoothie with Spinach",
        "Smoothie",
        "Healthy",
        "Blend mixed berries, spinach, unsweetened almond milk, and a scoop of protein powder (optional) until smooth.",
        "Healthy,Low-Sodium,Heart-Healthy,Breakfast,Snack",
        [
          { ingredient: "Mixed Berries", measure: "1 cup" },
          { ingredient: "Fresh Spinach", measure: "1 cup" },
          { ingredient: "Unsweetened Almond Milk", measure: "1 cup" },
          { ingredient: "Protein Powder (optional)", measure: "1 scoop" },
        ],
        "5 mins"
      ),
      generateRecipeData(
        "Strawberry & Yogurt Parfait",
        "Snack",
        "General",
        "Combines fresh fruit, strained yogurt, and crunchy granola for an easy breakfast, packable in a Mason jar.",
        "High-Blood-Pressure-Friendly,Heart-Healthy,Low-Sodium",
        [
          { ingredient: "Fresh Strawberries", measure: "1/2 cup" },
          { ingredient: "Strained Yogurt", measure: "1/2 cup" },
          { ingredient: "Low-Sodium Granola", measure: "1/4 cup" },
        ],
        "5 mins"
      ),
      generateRecipeData(
        "Raspberry-Kefir Power Smoothie",
        "Beverage",
        "General",
        "Uses frozen bananas, kefir, peanut butter, and flaxmeal for a healthy smoothie with protein, probiotics, and healthy fats.",
        "High-Blood-Pressure-Friendly,Heart-Healthy,Low-Sodium",
        [
          { ingredient: "Frozen Bananas", measure: "1" },
          { ingredient: "Kefir", measure: "1 cup" },
          { ingredient: "Peanut Butter", measure: "1 Tbsp" },
          { ingredient: "Flaxmeal", measure: "1 Tbsp" },
        ],
        "5 mins"
      ),
      generateRecipeData(
        "Spinach & Egg Sweet Potato Toast",
        "Breakfast",
        "General",
        "Gluten-free sweet potato toast topped with spinach, egg, and hot sauce, a delicious alternative to eggs Benedict.",
        "High-Blood-Pressure-Friendly,Heart-Healthy,Low-Sodium,Gluten-Free",
        [
          { ingredient: "Sweet Potato", measure: "1 slice" },
          { ingredient: "Spinach", measure: "1/2 cup" },
          { ingredient: "Egg", measure: "1" },
          { ingredient: "Hot Sauce", measure: "to taste" },
        ],
        "15 mins"
      ),
      generateRecipeData(
        "Kale Chips",
        "Snack",
        "General",
        "Crispy baked kale chips to convert kale skeptics, best when not overcrowding baking pans.",
        "High-Blood-Pressure-Friendly,Heart-Healthy,Low-Sodium",
        [
          { ingredient: "Kale", measure: "1 bunch" },
          { ingredient: "Olive Oil", measure: "1 Tbsp" },
          { ingredient: "Pepper", measure: "to taste" },
        ],
        "20 mins"
      ),
      generateRecipeData(
        "Strawberry-Banana Green Smoothie",
        "Beverage",
        "General",
        "Sweetened only with fruit, gets omega-3s from flaxseeds.",
        "High-Blood-Pressure-Friendly,Heart-Healthy,Low-Sodium",
        [
          { ingredient: "Strawberries", measure: "1/2 cup" },
          { ingredient: "Banana", measure: "1" },
          { ingredient: "Flaxseeds", measure: "1 Tbsp" },
          { ingredient: "Water or Unsweetened Almond Milk", measure: "1 cup" },
        ],
        "5 mins"
      ),
    ],
  },
  "high cholesterol": {
    keywords: ["high cholesterol", "cholesterol", "low-fat", "fiber-rich"],
    clarification:
      "Understood. To suggest the best cholesterol-friendly recipe, could you specify your preferences regarding ingredients (e.g., plant-based, lean meats) or cuisine type?",
    recipes: [
      generateRecipeData(
        "Black Bean Burgers",
        "Vegan",
        "American",
        "Mash cooked black beans with breadcrumbs, spices (cumin, chili powder), and finely diced onion/bell pepper. Form into patties and bake or pan-fry until golden. Serve on whole-wheat buns with plenty of veggies.",
        "Healthy,Low-Cholesterol,Fiber-Rich,Vegan",
        [
          {
            ingredient: "Canned Black Beans",
            measure: "1 can (drained & rinsed)",
          },
          { ingredient: "Breadcrumbs", measure: "1/2 cup" },
          { ingredient: "Onion", measure: "1/4 chopped" },
          { ingredient: "Bell Pepper", measure: "1/4 chopped" },
          { ingredient: "Cumin", measure: "1 tsp" },
          { ingredient: "Chili Powder", measure: "1 tsp" },
        ],
        "40 mins"
      ),
      generateRecipeData(
        "Oatmeal with Berries and Nuts",
        "Breakfast",
        "Healthy",
        "Cook rolled oats with water or unsweetened plant-based milk. Top with fresh berries, a sprinkle of nuts (like walnuts), and a dash of cinnamon.",
        "Healthy,Low-Cholesterol,Fiber-Rich,Breakfast",
        [
          { ingredient: "Rolled Oats", measure: "1/2 cup" },
          { ingredient: "Water or Plant Milk", measure: "1 cup" },
          { ingredient: "Fresh Berries", measure: "1/2 cup" },
          { ingredient: "Walnuts", measure: "1 tbsp chopped" },
          { ingredient: "Cinnamon", measure: "1/2 tsp" },
        ],
        "10 mins"
      ),
      generateRecipeData(
        "Vegetable & Chickpea Curry",
        "Curry",
        "Indian",
        "Sauté onions, garlic, and ginger. Add curry powder, turmeric, and diced vegetables (potatoes, carrots, bell peppers). Stir in canned diced tomatoes and chickpeas. Simmer until vegetables are tender. Serve with brown rice.",
        "Healthy,Low-Cholesterol,Fiber-Rich,Vegan,Indian",
        [
          { ingredient: "Onion", measure: "1 chopped" },
          { ingredient: "Garlic", measure: "2 cloves minced" },
          { ingredient: "Ginger", measure: "1 tsp grated" },
          { ingredient: "Curry Powder", measure: "1 tbsp" },
          { ingredient: "Turmeric", measure: "1/2 tsp" },
          { ingredient: "Potatoes", measure: "1 diced" },
          { ingredient: "Carrots", measure: "2 sliced" },
          { ingredient: "Bell Pepper", measure: "1 diced" },
          { ingredient: "Canned Diced Tomatoes", measure: "1 (14.5 oz) can" },
          { ingredient: "Canned Chickpeas", measure: "1 (15 oz) can" },
        ],
        "45 mins"
      ),
      generateRecipeData(
        "Broccoli and White Bean Soup",
        "Soup",
        "Vegetarian",
        "Sauté onion and garlic. Add vegetable broth, chopped broccoli, and cannellini beans. Simmer until broccoli is tender. Blend a portion of the soup for creaminess. Season with herbs.",
        "Healthy,Low-Cholesterol,Fiber-Rich,Vegetarian,Soup",
        [
          { ingredient: "Onion", measure: "1/2 chopped" },
          { ingredient: "Garlic", measure: "2 cloves minced" },
          { ingredient: "Vegetable Broth", measure: "4 cups" },
          { ingredient: "Broccoli Florets", measure: "3 cups" },
          {
            ingredient: "Canned Cannellini Beans",
            measure: "1 can (drained & rinsed)",
          },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Quinoa Salad with Roasted Vegetables",
        "Salad",
        "Mediterranean",
        "Roast a mix of vegetables like zucchini, bell peppers, and eggplant. Combine with cooked quinoa, a light lemon-tahini dressing, and fresh herbs.",
        "Healthy,Low-Cholesterol,Fiber-Rich,Vegetarian",
        [
          { ingredient: "Cooked Quinoa", measure: "1 cup" },
          { ingredient: "Zucchini", measure: "1 diced" },
          { ingredient: "Bell Peppers", measure: "1 diced" },
          { ingredient: "Eggplant", measure: "1/2 diced" },
          { ingredient: "Olive Oil", measure: "2 tbsp" },
          { ingredient: "Lemon Juice", measure: "1 tbsp" },
          { ingredient: "Tahini", measure: "1 tbsp" },
        ],
        "45 mins"
      ),
      generateRecipeData(
        "Sheet-Pan Chicken with Lemons and Green Olives",
        "Main Dish",
        "Mediterranean",
        "A tasty and easy sheet pan dinner featuring chicken, lemons, and green olives, adding flavor and promoting heart health.",
        "Low-Cholesterol,Heart-Healthy",
        [
          { ingredient: "Chicken Breast", measure: "1 lb" },
          { ingredient: "Lemons", measure: "2, sliced" },
          { ingredient: "Green Olives", measure: "1/2 cup" },
          { ingredient: "Olive Oil", measure: "2 Tbsp" },
        ],
        "35 mins"
      ),
      generateRecipeData(
        "Kale Falafel Salad with Toasted Pine Nuts",
        "Salad",
        "Mediterranean",
        "Incorporates fresh parsley, onion, and toasted pine nuts, all with cholesterol-lowering properties, for a heart-healthy salad.",
        "Low-Cholesterol,Heart-Healthy,Vegetarian",
        [
          { ingredient: "Kale", measure: "2 cups" },
          { ingredient: "Falafel", measure: "4 pieces" },
          { ingredient: "Fresh Parsley", measure: "1/4 cup" },
          { ingredient: "Onion", measure: "1/4, chopped" },
          { ingredient: "Toasted Pine Nuts", measure: "2 Tbsp" },
          { ingredient: "Hummus", measure: "2 Tbsp" },
        ],
        "20 mins"
      ),
      generateRecipeData(
        "Chilaquiles Breakfast Casserole",
        "Breakfast",
        "Mexican",
        "A zesty Mexican casserole topped with eggs, featuring garlic and onion, suitable for low-cholesterol diets.",
        "Low-Cholesterol,Heart-Healthy",
        [
          { ingredient: "Eggs", measure: "4" },
          { ingredient: "Garlic", measure: "2 cloves, minced" },
          { ingredient: "Onion", measure: "1/2, chopped" },
          { ingredient: "Corn Tortillas", measure: "6, cut into strips" },
          { ingredient: "Tomato Salsa", measure: "1 cup" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Beef and Broccoli",
        "Main Dish",
        "Asian",
        "Uses sliced flank steak low in saturated fat, with broccoli to lower LDL and boost HDL cholesterol, ideal for slow cooking.",
        "Low-Cholesterol,Heart-Healthy",
        [
          { ingredient: "Flank Steak", measure: "1 lb, sliced" },
          { ingredient: "Broccoli", measure: "2 cups" },
          { ingredient: "Low-Sodium Soy Sauce", measure: "1/4 cup" },
          { ingredient: "Garlic", measure: "2 cloves, minced" },
        ],
        "45 mins"
      ),
      generateRecipeData(
        "Roasted Salmon and Broccoli",
        "Main Dish",
        "General",
        "Features salmon rich in omega-3 fats, with broccoli, garlic, and tomatoes for additional cholesterol-fighting power.",
        "Low-Cholesterol,Heart-Healthy",
        [
          { ingredient: "Salmon Fillets", measure: "2 (6 oz each)" },
          { ingredient: "Broccoli", measure: "2 cups" },
          { ingredient: "Garlic", measure: "2 cloves, minced" },
          { ingredient: "Tomatoes", measure: "1 cup, chopped" },
        ],
        "30 mins"
      ),
    ],
  },
  "celiac disease": {
    keywords: ["celiac", "gluten-free", "no gluten", "wheat allergy"],
    clarification:
      "Absolutely! To ensure the recipe meets all your needs, do you have any other allergies or specific cuisine preferences?",
    recipes: [
      generateRecipeData(
        "Gluten-Free Pasta with Pesto and Cherry Tomatoes",
        "Pasta",
        "Italian",
        "Cook gluten-free pasta according to package directions. Toss with pre-made gluten-free pesto and halved cherry tomatoes. Garnish with fresh basil.",
        "Gluten-Free,Vegetarian,Italian",
        [
          { ingredient: "Gluten-Free Pasta", measure: "200g" },
          { ingredient: "Gluten-Free Pesto", measure: "1/2 cup" },
          { ingredient: "Cherry Tomatoes", measure: "1 cup halved" },
          { ingredient: "Fresh Basil", measure: "for garnish" },
        ],
        "20 mins"
      ),
      generateRecipeData(
        "Flourless Chocolate Cake",
        "Dessert",
        "Baking",
        "Melt chocolate and butter. Whisk eggs with sugar. Combine mixtures. Pour into a greased pan and bake until set. Dust with cocoa powder.",
        "Gluten-Free,Dessert,Chocolate",
        [
          { ingredient: "Dark Chocolate", measure: "8 oz" },
          { ingredient: "Unsalted Butter", measure: "1/2 cup" },
          { ingredient: "Eggs", measure: "3" },
          { ingredient: "Granulated Sugar", measure: "1/2 cup" },
          { ingredient: "Cocoa Powder", measure: "for dusting" },
        ],
        "50 mins"
      ),
      generateRecipeData(
        "Chicken and Rice Soup",
        "Soup",
        "Comfort Food",
        "Sauté chicken pieces with carrots, celery, and onion. Add chicken broth and cooked rice. Simmer until chicken is tender. Season with salt and pepper.",
        "Gluten-Free,ComfortFood,Chicken,Soup",
        [
          { ingredient: "Chicken Breast", measure: "1 lb diced" },
          { ingredient: "Carrots", measure: "2 chopped" },
          { ingredient: "Celery Stalks", measure: "2 chopped" },
          { ingredient: "Onion", measure: "1 chopped" },
          { ingredient: "Chicken Broth", measure: "6 cups" },
          { ingredient: "Cooked Rice", measure: "1 cup" },
        ],
        "45 mins"
      ),
      generateRecipeData(
        "Corn Tortilla Tacos with Ground Beef",
        "Mexican",
        "Tacos",
        "Cook ground beef with taco seasoning. Warm corn tortillas. Assemble tacos with beef, shredded lettuce, diced tomatoes, and salsa.",
        "Gluten-Free,Mexican,Tacos,Beef",
        [
          { ingredient: "Ground Beef", measure: "1 lb" },
          { ingredient: "Taco Seasoning (GF)", measure: "1 packet" },
          { ingredient: "Corn Tortillas", measure: "12" },
          { ingredient: "Lettuce", measure: "shredded" },
          { ingredient: "Tomatoes", measure: "diced" },
          { ingredient: "Salsa", measure: "1/2 cup" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Baked Sweet Potato Fries",
        "Side Dish",
        "Healthy Snack",
        "Cut sweet potatoes into fries. Toss with olive oil, paprika, and garlic powder. Bake at 400°F (200°C) until crispy.",
        "Gluten-Free,Healthy,Snack,Vegetarian",
        [
          { ingredient: "Sweet Potatoes", measure: "2 large" },
          { ingredient: "Olive Oil", measure: "2 tbsp" },
          { ingredient: "Paprika", measure: "1 tsp" },
          { ingredient: "Garlic Powder", measure: "1/2 tsp" },
        ],
        "30 mins"
      ),
    ],
  },
  "lactose intolerance": {
    keywords: ["lactose intolerant", "dairy-free", "no dairy", "milk allergy"],
    clarification:
      "No problem! To give you the best dairy-free suggestion, are there any other dietary restrictions or cuisine styles you prefer?",
    recipes: [
      generateRecipeData(
        "Creamy Tomato Basil Soup (Dairy-Free)",
        "Soup",
        "Italian",
        "Sauté onion and garlic. Add canned crushed tomatoes, vegetable broth, and basil. Simmer. Stir in full-fat coconut milk for creaminess. Blend until smooth if desired.",
        "Dairy-Free,Vegetarian,Soup,Italian",
        [
          { ingredient: "Onion", measure: "1 chopped" },
          { ingredient: "Garlic", measure: "2 cloves minced" },
          { ingredient: "Crushed Tomatoes", measure: "1 (28 oz) can" },
          { ingredient: "Vegetable Broth", measure: "4 cups" },
          { ingredient: "Fresh Basil", measure: "1/4 cup chopped" },
          { ingredient: "Full-Fat Coconut Milk", measure: "1/2 cup" },
        ],
        "35 mins"
      ),
      generateRecipeData(
        "Oatmeal with Plant-Based Milk and Fruit",
        "Breakfast",
        "Healthy",
        "Cook rolled oats with almond milk (or other plant-based milk). Top with your favorite fruit like sliced banana or berries.",
        "Dairy-Free,Vegetarian,Breakfast,Healthy",
        [
          { ingredient: "Rolled Oats", measure: "1/2 cup" },
          { ingredient: "Almond Milk", measure: "1 cup" },
          { ingredient: "Banana", measure: "1/2 sliced" },
          { ingredient: "Berries", measure: "1/4 cup" },
        ],
        "10 mins"
      ),
      generateRecipeData(
        "Vegan Mac and Cheese",
        "Pasta",
        "Vegan",
        "Cook pasta. For sauce, blend boiled potatoes, carrots, nutritional yeast, plant-based milk, and spices (garlic powder, onion powder) until creamy. Combine with pasta.",
        "Dairy-Free,Vegan,ComfortFood",
        [
          { ingredient: "Elbow Macaroni", measure: "2 cups" },
          { ingredient: "Potatoes", measure: "1 large, chopped" },
          { ingredient: "Carrots", measure: "2 medium, chopped" },
          { ingredient: "Nutritional Yeast", measure: "1/2 cup" },
          { ingredient: "Unsweetened Plant Milk", measure: "1 cup" },
          { ingredient: "Garlic Powder", measure: "1 tsp" },
          { ingredient: "Onion Powder", measure: "1 tsp" },
        ],
        "40 mins"
      ),
      generateRecipeData(
        "Chocolate Avocado Mousse",
        "Dessert",
        "Vegan",
        "Blend ripe avocados, cocoa powder, maple syrup, vanilla extract, and a splash of plant milk until smooth and creamy. Chill before serving.",
        "Dairy-Free,Vegan,Dessert,Healthy",
        [
          { ingredient: "Ripe Avocados", measure: "2" },
          { ingredient: "Cocoa Powder", measure: "1/4 cup" },
          { ingredient: "Maple Syrup", measure: "1/4 cup" },
          { ingredient: "Vanilla Extract", measure: "1 tsp" },
          { ingredient: "Almond Milk", measure: "2 tbsp" },
        ],
        "10 mins prep + 30 mins chill"
      ),
    ],
  },
  "weight management": {
    keywords: [
      "lose weight",
      "weight loss",
      "low-calorie",
      "light meal",
      "high-protein",
      "lean",
    ],
    clarification:
      "To help me suggest the perfect recipe for weight management, could you share if you have any specific dietary needs (e.g., vegetarian, keto-friendly) or preferred cuisine?",
    recipes: [
      generateRecipeData(
        "Large Chicken Salad with Vinaigrette",
        "Salad",
        "Healthy",
        "Combine mixed greens, grilled chicken breast slices, cucumber, cherry tomatoes, bell peppers, and a light vinaigrette dressing. Add a sprinkle of seeds for crunch.",
        "Healthy,Low-Calorie,High-Protein,Chicken,Salad",
        [
          { ingredient: "Mixed Greens", measure: "2 cups" },
          { ingredient: "Grilled Chicken Breast", measure: "4 oz sliced" },
          { ingredient: "Cucumber", measure: "1/2 chopped" },
          { ingredient: "Cherry Tomatoes", measure: "1/2 cup halved" },
          { ingredient: "Bell Peppers", measure: "1/2 cup chopped" },
          { ingredient: "Light Vinaigrette", measure: "2 tbsp" },
          { ingredient: "Pumpkin Seeds", measure: "1 tbsp" },
        ],
        "20 mins"
      ),
      generateRecipeData(
        "Cucumber Slices with Hummus",
        "Snack",
        "Healthy",
        "Slice a cucumber and serve with a portion of hummus.",
        "Healthy,Low-Calorie,Snack,Vegetarian",
        [
          { ingredient: "Cucumber", measure: "1" },
          { ingredient: "Hummus", measure: "2 tbsp" },
        ],
        "5 mins"
      ),
      generateRecipeData(
        "Turkey and Veggie Lettuce Wraps",
        "Wraps",
        "Healthy",
        "Sauté ground turkey with diced carrots, water chestnuts, and a low-sodium stir-fry sauce. Serve mixture in large lettuce cups.",
        "Healthy,Low-Calorie,High-Protein,Chicken/Turkey",
        [
          { ingredient: "Ground Turkey", measure: "1 lb" },
          { ingredient: "Carrots", measure: "1/2 cup shredded" },
          { ingredient: "Water Chestnuts", measure: "1/2 cup diced" },
          { ingredient: "Low-Sodium Stir-fry Sauce", measure: "1/4 cup" },
          { ingredient: "Large Lettuce Leaves", measure: "8" },
        ],
        "25 mins"
      ),
      generateRecipeData(
        "Egg Muffins with Spinach and Feta",
        "Breakfast",
        "Healthy",
        "Whisk eggs with spinach and a small amount of crumbled feta. Pour into greased muffin tins and bake until set.",
        "Healthy,Low-Calorie,High-Protein,Breakfast",
        [
          { ingredient: "Eggs", measure: "6" },
          { ingredient: "Fresh Spinach", measure: "1 cup chopped" },
          { ingredient: "Feta Cheese", measure: "2 tbsp crumbled" },
        ],
        "25 mins"
      ),
    ],
  },
  "kidney disease": {
    keywords: ["kidney disease", "renal diet", "kidney-friendly"],
    clarification:
      "Given the specific dietary needs for kidney disease, could you please confirm if you have any other restrictions (e.g., fluid intake, specific mineral limits) or food preferences?",
    recipes: [
      generateRecipeData(
        "White Rice with Roasted Chicken Breast and Green Beans",
        "Chicken",
        "Simple",
        "Bake chicken breast seasoned with herbs and pepper (no salt). Steam or boil green beans. Serve with plain white rice.",
        "Kidney-Friendly,Low-Sodium,Low-Potassium,Chicken",
        [
          { ingredient: "Chicken Breast", measure: "1 (6oz)" },
          { ingredient: "White Rice (cooked)", measure: "1 cup" },
          { ingredient: "Green Beans", measure: "1 cup" },
          { ingredient: "Dried Herbs", measure: "1 tsp" },
          { ingredient: "Black Pepper", measure: "to taste" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Homemade Tuna Salad (Low-Sodium)",
        "Salad",
        "Lunch",
        "Mix drained canned tuna (in water, no salt added) with celery, onion, and a small amount of low-sodium mayonnaise or plain yogurt. Serve on crackers (low sodium) or lettuce cups.",
        "Kidney-Friendly,Low-Sodium,Low-Potassium,Fish",
        [
          { ingredient: "Canned Tuna (no salt added)", measure: "1 (5oz) can" },
          { ingredient: "Celery", measure: "1 stalk diced" },
          { ingredient: "Red Onion", measure: "2 tbsp minced" },
          { ingredient: "Low-Sodium Mayonnaise", measure: "2 tbsp" },
          { ingredient: "Black Pepper", measure: "to taste" },
        ],
        "15 mins"
      ),
    ],
  },
  "digestive issues": {
    keywords: [
      "IBS",
      "digestive issues",
      "low FODMAP",
      "sensitive stomach",
      "easy to digest",
    ],
    clarification:
      "To help me suggest the best recipe for digestive issues, could you specify what kind of issues you experience (e.g., bloating, gas, acidity) and if there are specific foods you need to avoid?",
    recipes: [
      generateRecipeData(
        "Salmon with Quinoa and Steamed Carrots",
        "Seafood",
        "Simple",
        "Bake or pan-fry salmon. Cook quinoa. Steam carrots until tender. Simple seasoning with olive oil, salt (if tolerated) and pepper. This is a low FODMAP friendly meal.",
        "Healthy,Low-FODMAP,Easy-Digest,Fish",
        [
          { ingredient: "Salmon Fillet", measure: "1 (6oz)" },
          { ingredient: "Quinoa (cooked)", measure: "1 cup" },
          { ingredient: "Carrots", measure: "1 cup sliced" },
          { ingredient: "Olive Oil", measure: "1 tbsp" },
          { ingredient: "Salt", measure: "to taste" },
          { ingredient: "Black Pepper", measure: "to taste" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Plain Chicken Breast with Mashed Potato",
        "Comfort Food",
        "Simple",
        "Boil chicken breast until cooked, shred or slice. Boil potatoes until tender, then mash with a little chicken broth and a small amount of lactose-free milk (if tolerated). Serve simply.",
        "Easy-Digest,Bland,Comfort Food,Chicken",
        [
          { ingredient: "Chicken Breast", measure: "1 (6oz)" },
          { ingredient: "Potatoes", measure: "2 medium" },
          { ingredient: "Chicken Broth", measure: "1/4 cup" },
          { ingredient: "Lactose-Free Milk (optional)", measure: "1 tbsp" },
        ],
        "40 mins"
      ),
    ],
  },
  allergies: {
    keywords: ["allergy", "allergic to", "avoid", "free"],
    clarification:
      "Could you please specify which ingredients you need to avoid? This will help me suggest the perfect safe recipe for you.",
    recipes: {
      peanut: generateRecipeData(
        "Apple Slices with Sunflower Seed Butter",
        "Snack",
        "Healthy",
        "Slice an apple and serve with sunflower seed butter (SunButter is a popular brand).",
        "Peanut-Free,Nut-Free,Snack,Fruit",
        [
          { ingredient: "Apple", measure: "1" },
          { ingredient: "Sunflower Seed Butter", measure: "2 tbsp" },
        ],
        "5 mins"
      ),
      shellfish: generateRecipeData(
        "Roasted Chicken with Root Vegetables",
        "Chicken",
        "Comfort Food",
        "Toss chicken pieces with chopped root vegetables (carrots, potatoes, parsnips), olive oil, and herbs. Roast until chicken is cooked through and vegetables are tender.",
        "Shellfish-Free,Chicken,ComfortFood",
        [
          { ingredient: "Chicken Thighs or Breast", measure: "1 lb" },
          { ingredient: "Carrots", measure: "2 chopped" },
          { ingredient: "Potatoes", measure: "2 chopped" },
          { ingredient: "Parsnips", measure: "1 chopped" },
          { ingredient: "Olive Oil", measure: "2 tbsp" },
          { ingredient: "Rosemary", measure: "1 tsp dried" },
          { ingredient: "Thyme", measure: "1 tsp dried" },
        ],
        "50 mins"
      ),
      nut: generateRecipeData(
        "Baked Chicken with Steamed Broccoli",
        "Chicken",
        "Simple",
        "Bake chicken breast seasoned with salt and pepper. Steam broccoli florets until tender-crisp. A simple, nut-free meal.",
        "Nut-Free,Chicken,Healthy,Simple",
        [
          { ingredient: "Chicken Breast", measure: "1 (6oz)" },
          { ingredient: "Broccoli Florets", measure: "1.5 cups" },
          { ingredient: "Olive Oil", measure: "1 tbsp" },
          { ingredient: "Salt", measure: "to taste" },
          { ingredient: "Black Pepper", measure: "to taste" },
        ],
        "30 mins"
      ),
      soy: generateRecipeData(
        "Beef Stir-fry with Rice Noodles (Soy-Free)",
        "Beef",
        "Asian",
        "Stir-fry sliced beef with bell peppers, snow peas, and carrots. Use a soy-free sauce alternative like tamari (if gluten-free) or coconut aminos. Serve with rice noodles.",
        "Soy-Free,Beef,Asian",
        [
          { ingredient: "Beef Sirloin", measure: "1/2 lb sliced" },
          { ingredient: "Bell Peppers", measure: "1 sliced" },
          { ingredient: "Snow Peas", measure: "1 cup" },
          { ingredient: "Carrots", measure: "1 cup julienned" },
          { ingredient: "Coconut Aminos", measure: "1/4 cup" },
          { ingredient: "Rice Noodles", measure: "4 oz" },
        ],
        "35 mins"
      ),
      egg: generateRecipeData(
        "Tofu Scramble with Spinach",
        "Breakfast",
        "Vegan",
        "Crumble firm tofu and sauté with spinach, turmeric (for color), and black salt (kala namak for eggy flavor). Serve with toast (if not gluten-free).",
        "Egg-Free,Vegan,Breakfast",
        [
          { ingredient: "Firm Tofu", measure: "1 block (14 oz)" },
          { ingredient: "Fresh Spinach", measure: "2 cups" },
          { ingredient: "Turmeric Powder", measure: "1/2 tsp" },
          { ingredient: "Black Salt (Kala Namak)", measure: "1/4 tsp" },
          { ingredient: "Nutritional Yeast (optional)", measure: "1 tbsp" },
        ],
        "20 mins"
      ),
    },
  },
  "general healthy": {
    keywords: ["healthy", "nutritious", "balanced meal", "clean eating"],
    clarification:
      "Great! To help me suggest the perfect healthy recipe, could you tell me if you have any specific dietary preferences (e.g., vegetarian, high protein, low fat) or cuisine types you enjoy?",
    recipes: [
      generateRecipeData(
        "Chicken and Vegetable Soup",
        "Soup",
        "Comfort Food",
        "Dice chicken breast and various vegetables (carrots, celery, peas). Simmer in chicken broth with herbs until cooked through. A wholesome and comforting meal.",
        "Healthy,Comfort Food,Chicken,Soup",
        [
          { ingredient: "Chicken Breast", measure: "1 lb diced" },
          { ingredient: "Carrots", measure: "1 cup chopped" },
          { ingredient: "Celery Stalks", measure: "1 cup chopped" },
          { ingredient: "Frozen Peas", measure: "1/2 cup" },
          { ingredient: "Chicken Broth", measure: "6 cups" },
          { ingredient: "Bay Leaf", measure: "1" },
          { ingredient: "Thyme", measure: "1/2 tsp" },
        ],
        "45 mins"
      ),
      generateRecipeData(
        "Sheet Pan Sausage and Veggies",
        "Dinner",
        "One-Pan",
        "Chop sausage (chicken/turkey for leaner) and sturdy vegetables like bell peppers, zucchini, and onions. Toss with olive oil and Italian seasoning. Roast on a sheet pan until tender and browned.",
        "Healthy,Easy,One-Pan,Dinner",
        [
          { ingredient: "Chicken Sausage", measure: "4 links, sliced" },
          { ingredient: "Bell Peppers", measure: "2 chopped" },
          { ingredient: "Zucchini", measure: "1 chopped" },
          { ingredient: "Red Onion", measure: "1 chopped" },
          { ingredient: "Olive Oil", measure: "2 tbsp" },
          { ingredient: "Italian Seasoning", measure: "1 tbsp" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Caprese Salad with Balsamic Glaze",
        "Salad",
        "Italian",
        "Layer sliced fresh mozzarella, ripe tomatoes, and fresh basil leaves. Drizzle with balsamic glaze. Season with salt and pepper.",
        "Healthy,Vegetarian,Italian,Salad",
        [
          { ingredient: "Fresh Mozzarella", measure: "8 oz sliced" },
          { ingredient: "Ripe Tomatoes", measure: "2 sliced" },
          { ingredient: "Fresh Basil Leaves", measure: "1/2 cup" },
          { ingredient: "Balsamic Glaze", measure: "2 tbsp" },
          { ingredient: "Salt", measure: "to taste" },
          { ingredient: "Black Pepper", measure: "to taste" },
        ],
        "10 mins"
      ),
      generateRecipeData(
        "Turkey Chili (Bean-Free option)",
        "Chili",
        "American",
        "Brown ground turkey with diced onions and bell peppers. Add crushed tomatoes, chili powder, cumin, and broth. Simmer until flavors meld. (Optional: omit beans for lower carb)",
        "Healthy,High-Protein,ComfortFood,Turkey",
        [
          { ingredient: "Ground Turkey", measure: "1.5 lbs" },
          { ingredient: "Onion", measure: "1 chopped" },
          { ingredient: "Bell Peppers", measure: "1 chopped" },
          { ingredient: "Crushed Tomatoes", measure: "1 (28 oz) can" },
          { ingredient: "Chicken Broth", measure: "1 cup" },
          { ingredient: "Chili Powder", measure: "2 tbsp" },
          { ingredient: "Cumin", measure: "1 tbsp" },
        ],
        "50 mins"
      ),
      generateRecipeData(
        "Chicken and Vegetable Soup",
        "Soup",
        "Comfort Food",
        "Dice chicken breast and various vegetables (carrots, celery, peas). Simmer in chicken broth with herbs until cooked through. A wholesome and comforting meal.",
        "Healthy,Comfort Food,Chicken,Soup",
        [
          { ingredient: "Chicken Breast", measure: "1 lb diced" },
          { ingredient: "Carrots", measure: "1 cup chopped" },
          { ingredient: "Celery Stalks", measure: "1 cup chopped" },
          { ingredient: "Frozen Peas", measure: "1/2 cup" },
          { ingredient: "Chicken Broth", measure: "6 cups" },
          { ingredient: "Bay Leaf", measure: "1" },
          { ingredient: "Thyme", measure: "1/2 tsp" },
        ],
        "45 mins"
      ),
      generateRecipeData(
        "Sheet Pan Sausage and Veggies",
        "Dinner",
        "One-Pan",
        "Chop sausage (chicken/turkey for leaner) and sturdy vegetables like bell peppers, zucchini, and onions. Toss with olive oil and Italian seasoning. Roast on a sheet pan until tender and browned.",
        "Healthy,Easy,One-Pan,Dinner",
        [
          { ingredient: "Chicken Sausage", measure: "4 links, sliced" },
          { ingredient: "Bell Peppers", measure: "2 chopped" },
          { ingredient: "Zucchini", measure: "1 chopped" },
          { ingredient: "Red Onion", measure: "1 chopped" },
          { ingredient: "Olive Oil", measure: "2 tbsp" },
          { ingredient: "Italian Seasoning", measure: "1 tbsp" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Chicken and Vegetable Soup",
        "Soup",
        "Comfort Food",
        "Dice chicken breast, carrots, celery, and peas, then simmer in chicken broth with herbs. This wholesome soup is packed with protein and vitamins, perfect for a cozy meal. Serve with a side of whole-grain bread for added fiber.",
        "Healthy,Comfort Food,Chicken,Soup,High-Protein",
        [
          { ingredient: "Chicken Breast", measure: "1 lb diced" },
          { ingredient: "Carrots", measure: "1 cup chopped" },
          { ingredient: "Celery Stalks", measure: "1 cup chopped" },
          { ingredient: "Frozen Peas", measure: "1/2 cup" },
          { ingredient: "Chicken Broth", measure: "6 cups" },
          { ingredient: "Bay Leaf", measure: "1" },
          { ingredient: "Thyme", measure: "1/2 tsp" },
        ],
        "45 mins"
      ),
      generateRecipeData(
        "Sheet Pan Sausage and Veggies",
        "Dinner",
        "One-Pan",
        "Toss chicken sausage with bell peppers, zucchini, and onions in olive oil and Italian seasoning. Roast on a sheet pan for a quick, nutrient-rich dinner. This meal is high in fiber and protein, ideal for busy evenings.",
        "Healthy,Easy,One-Pan,Dinner,High-Protein",
        [
          { ingredient: "Chicken Sausage", measure: "4 links, sliced" },
          { ingredient: "Bell Peppers", measure: "2 chopped" },
          { ingredient: "Zucchini", measure: "1 chopped" },
          { ingredient: "Red Onion", measure: "1 chopped" },
          { ingredient: "Olive Oil", measure: "2 tbsp" },
          { ingredient: "Italian Seasoning", measure: "1 tbsp" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Caprese Salad with Balsamic Glaze",
        "Salad",
        "Italian",
        "Layer fresh mozzarella, ripe tomatoes, and basil, then drizzle with balsamic glaze. This light salad is rich in antioxidants and healthy fats. Season with salt and pepper for a refreshing side dish.",
        "Healthy,Vegetarian,Italian,Salad,Low-Calorie",
        [
          { ingredient: "Fresh Mozzarella", measure: "8 oz sliced" },
          { ingredient: "Ripe Tomatoes", measure: "2 sliced" },
          { ingredient: "Fresh Basil Leaves", measure: "1/2 cup" },
          { ingredient: "Balsamic Glaze", measure: "2 tbsp" },
          { ingredient: "Salt", measure: "to taste" },
          { ingredient: "Black Pepper", measure: "to taste" },
        ],
        "10 mins"
      ),
      generateRecipeData(
        "Turkey Chili (Bean-Free option)",
        "Chili",
        "American",
        "Brown ground turkey with onions and bell peppers, then simmer with crushed tomatoes and spices. This hearty chili is high in protein and can be made bean-free for lower carbs. Perfect for a comforting dinner.",
        "Healthy,High-Protein,ComfortFood,Turkey",
        [
          { ingredient: "Ground Turkey", measure: "1.5 lbs" },
          { ingredient: "Onion", measure: "1 chopped" },
          { ingredient: "Bell Peppers", measure: "1 chopped" },
          { ingredient: "Crushed Tomatoes", measure: "1 (28 oz) can" },
          { ingredient: "Chicken Broth", measure: "1 cup" },
          { ingredient: "Chili Powder", measure: "2 tbsp" },
          { ingredient: "Cumin", measure: "1 tbsp" },
        ],
        "50 mins"
      ),
      // New recipes from Healthline
      generateRecipeData(
        "Basic Banana Overnight Oats",
        "Breakfast",
        "American",
        "Mix oats with oat milk, mashed banana, chia seeds, and cinnamon, then refrigerate overnight. This no-cook breakfast is fiber-rich, aiding cholesterol management. Enjoy it cold or warmed up for a quick start.",
        "Healthy,Breakfast,Quick,Fiber-Rich,Vegetarian,No-Cook",
        [
          { ingredient: "Old-fashioned rolled oats", measure: "2 cups" },
          { ingredient: "Oat milk", measure: "4 cups" },
          { ingredient: "Ripe banana", measure: "1, mashed" },
          { ingredient: "Chia seeds", measure: "2 Tbsp" },
          { ingredient: "Ground cinnamon", measure: "2 tsp" },
          { ingredient: "Kosher sea salt", measure: "pinch" },
        ],
        "10 mins prep + overnight"
      ),
      generateRecipeData(
        "Loaded Avocado Toast",
        "Breakfast",
        "American",
        "Toast whole grain bread and top with mashed avocado and a poached egg. Season with salt and pepper for a nutrient-dense breakfast. Avocados provide healthy fats, while eggs add protein.",
        "Healthy,Breakfast,Quick,High-Protein",
        [
          { ingredient: "Whole grain bread", measure: "1 slice" },
          { ingredient: "Avocado", measure: "1/2, mashed" },
          { ingredient: "Egg", measure: "1, poached" },
          { ingredient: "Salt", measure: "to taste" },
          { ingredient: "Black Pepper", measure: "to taste" },
        ],
        "10 mins"
      ),
      generateRecipeData(
        "Broccoli and Cheese Egg Bake",
        "Breakfast",
        "American",
        "Combine eggs with broccoli and cheese, then bake for a protein-packed dish. Ideal for meal prep, it serves multiple portions and is customizable with veggies. This breakfast supports a balanced diet.",
        "Healthy,Breakfast,High-Protein,Make-Ahead",
        [
          { ingredient: "Eggs", measure: "12" },
          { ingredient: "Broccoli", measure: "2 cups, chopped" },
          { ingredient: "Cheese", measure: "1 cup, shredded" },
          { ingredient: "Milk", measure: "1/2 cup" },
          { ingredient: "Salt", measure: "to taste" },
          { ingredient: "Black Pepper", measure: "to taste" },
        ],
        "1 hour"
      ),
      generateRecipeData(
        "Yogurt and Fruit Parfaits",
        "Breakfast",
        "General",
        "Layer plain yogurt with berries, bananas, and granola for a quick, calcium-rich breakfast. This parfait is perfect for busy mornings and keeps added sugars low. Customize with your favorite fruits.",
        "Healthy,Breakfast,Quick,Vegetarian,Low-Sugar",
        [
          { ingredient: "Plain yogurt", measure: "1 cup" },
          { ingredient: "Mixed berries", measure: "1/2 cup" },
          { ingredient: "Banana", measure: "1/2, sliced" },
          { ingredient: "Granola", measure: "1/4 cup" },
        ],
        "5 mins"
      ),
      generateRecipeData(
        "Chocolate Cherry Chia Pudding",
        "Breakfast",
        "General",
        "Mix chia seeds with cocoa powder, cherries, and milk, then chill for a sweet breakfast. This antioxidant-rich pudding is filling and easy to prepare. Perfect for a nutritious start to the day.",
        "Healthy,Breakfast,Quick,Vegetarian,Antioxidant-Rich",
        [
          { ingredient: "Chia seeds", measure: "1/4 cup" },
          { ingredient: "Cocoa powder", measure: "1 tbsp" },
          { ingredient: "Cherries", measure: "1/2 cup, pitted" },
          { ingredient: "Milk (or almond milk)", measure: "1 cup" },
          { ingredient: "Honey", measure: "1 tsp, optional" },
        ],
        "5 mins prep + 4 hours chill"
      ),
      generateRecipeData(
        "Bell Pepper Egg Cups",
        "Breakfast",
        "General",
        "Bake eggs in bell pepper halves with spinach and cheese for a veggie-packed breakfast. These cups are rich in vitamins A and C, supporting immunity. They're portable and great for meal prep.",
        "Healthy,Breakfast,Quick,High-Protein,Vegetarian",
        [
          { ingredient: "Bell peppers", measure: "2, halved" },
          { ingredient: "Eggs", measure: "4" },
          { ingredient: "Spinach", measure: "1 cup, chopped" },
          { ingredient: "Cheese", measure: "1/2 cup, shredded" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Peanut Butter Granola Bars",
        "Snack",
        "General",
        "Combine oats, peanut butter, and honey to make homemade granola bars. These vegan-friendly bars are high in fiber and perfect for a quick snack. They may also help manage cholesterol levels.",
        "Healthy,Snack,Vegan,High-Fiber",
        [
          { ingredient: "Oats", measure: "1 cup" },
          { ingredient: "Peanut butter", measure: "1/2 cup" },
          { ingredient: "Honey", measure: "1/4 cup" },
          { ingredient: "Nuts", measure: "1/4 cup, chopped" },
        ],
        "15 mins prep + 30 mins chill"
      ),
      generateRecipeData(
        "Italian Pasta Salad",
        "Lunch",
        "Italian",
        "Toss whole wheat pasta with cherry tomatoes, cucumber, and olives in a balsamic dressing. This fiber-rich salad is perfect for a quick, heart-healthy lunch. Add protein like chicken or beans if desired.",
        "Healthy,Lunch,Vegetarian,High-Fiber",
        [
          { ingredient: "Whole wheat pasta", measure: "2 cups, cooked" },
          { ingredient: "Cherry tomatoes", measure: "1 cup, halved" },
          { ingredient: "Cucumber", measure: "1, diced" },
          { ingredient: "Olives", measure: "1/4 cup" },
          { ingredient: "Olive oil", measure: "2 tbsp" },
          { ingredient: "Balsamic vinegar", measure: "1 tbsp" },
        ],
        "20 mins"
      ),
      generateRecipeData(
        "Slow Cooker Lentil Soup",
        "Lunch",
        "General",
        "Combine lentils, carrots, celery, and vegetable broth in a slow cooker for a hearty soup. This plant-based dish is rich in protein and fiber, ideal for meal prep. It's a comforting, nutritious lunch option.",
        "Healthy,Lunch,Vegetarian,High-Protein,High-Fiber",
        [
          { ingredient: "Lentils", measure: "1 cup" },
          { ingredient: "Carrots", measure: "2, chopped" },
          { ingredient: "Celery", measure: "2 stalks, chopped" },
          { ingredient: "Onion", measure: "1, chopped" },
          { ingredient: "Vegetable broth", measure: "4 cups" },
        ],
        "8 hours"
      ),
      generateRecipeData(
        "Peanut Butter and Banana Roll-ups",
        "Lunch",
        "General",
        "Spread peanut butter on whole wheat tortillas, add banana slices, and roll up for a quick lunch. This kid-friendly meal is rich in potassium and healthy fats. Perfect for a portable, nutritious bite.",
        "Healthy,Lunch,Kid-Friendly,Vegetarian",
        [
          { ingredient: "Whole wheat tortillas", measure: "2" },
          { ingredient: "Peanut butter", measure: "2 tbsp" },
          { ingredient: "Banana", measure: "1, sliced" },
        ],
        "5 mins"
      ),
      generateRecipeData(
        "Sweet Potato Black Bean Meal Prep Bowls",
        "Lunch",
        "General",
        "Roast sweet potatoes and combine with black beans, quinoa, and avocado lime dressing. These bowls are nutrient-dense and perfect for meal prep. They're rich in fiber and healthy fats.",
        "Healthy,Lunch,Vegetarian,High-Fiber,Meal-Prep",
        [
          { ingredient: "Sweet potatoes", measure: "2, cubed" },
          { ingredient: "Black beans", measure: "1 can, drained" },
          { ingredient: "Quinoa", measure: "1 cup, cooked" },
          { ingredient: "Avocado", measure: "1, sliced" },
          { ingredient: "Lime dressing", measure: "2 tbsp" },
        ],
        "45 mins"
      ),
      generateRecipeData(
        "Healthy Tuna Salad with Cranberries",
        "Lunch",
        "American",
        "Mix canned tuna with Greek yogurt and cranberries for a protein-packed salad. Serve on bread or lettuce for a budget-friendly, healthy lunch. The cranberries add a sweet, antioxidant-rich twist.",
        "Healthy,Lunch,High-Protein,Quick",
        [
          { ingredient: "Canned tuna", measure: "1 can, drained" },
          { ingredient: "Greek yogurt", measure: "2 tbsp" },
          { ingredient: "Cranberries", measure: "1/4 cup" },
          { ingredient: "Celery", measure: "1 stalk, chopped" },
          { ingredient: "Salt", measure: "to taste" },
          { ingredient: "Black Pepper", measure: "to taste" },
        ],
        "10 mins"
      ),
      generateRecipeData(
        "Veggie Quesadillas",
        "Lunch",
        "Mexican",
        "Fill whole wheat tortillas with bell peppers, onions, spinach, and cheese, then cook until crispy. These quesadillas boost veggie intake and are linked to lower disease risk. Serve with salsa for extra flavor.",
        "Healthy,Lunch,Vegetarian,Quick",
        [
          { ingredient: "Whole wheat tortillas", measure: "2" },
          { ingredient: "Bell peppers", measure: "1, sliced" },
          { ingredient: "Onion", measure: "1/2, sliced" },
          { ingredient: "Spinach", measure: "1 cup" },
          { ingredient: "Cheese", measure: "1/2 cup, shredded" },
        ],
        "15 mins"
      ),
      generateRecipeData(
        "Fridge/Freezer Stir-Fry",
        "Dinner",
        "Asian",
        "Use mixed vegetables and a protein like chicken or tofu for a quick stir-fry. Serve over brown rice for a balanced, budget-friendly dinner. This dish is versatile and nutrient-rich.",
        "Healthy,Dinner,Quick,Budget-Friendly",
        [
          { ingredient: "Mixed vegetables", measure: "2 cups" },
          { ingredient: "Protein (chicken, tofu)", measure: "1 cup" },
          { ingredient: "Soy sauce", measure: "2 tbsp" },
          { ingredient: "Garlic", measure: "2 cloves, minced" },
          { ingredient: "Brown rice", measure: "1 cup, cooked" },
        ],
        "20 mins"
      ),
      generateRecipeData(
        "Baked Potato Bar",
        "Dinner",
        "American",
        "Bake potatoes and top with Greek yogurt, broccoli, and beans for a nutritious meal. This dish is rich in potassium, magnesium, and vitamins B6 and C. It's affordable and customizable.",
        "Healthy,Dinner,Vegetarian,Budget-Friendly",
        [
          { ingredient: "Potatoes", measure: "4" },
          { ingredient: "Greek yogurt", measure: "1/2 cup" },
          { ingredient: "Broccoli", measure: "1 cup, steamed" },
          { ingredient: "Beans", measure: "1/2 cup, canned" },
          { ingredient: "Cheese", measure: "1/2 cup, shredded, optional" },
        ],
        "1 hour"
      ),
      generateRecipeData(
        "Caprese Chicken Breasts",
        "Dinner",
        "Italian",
        "Top chicken breasts with tomatoes, mozzarella, and basil, then bake for a flavorful meal. This dish is high in protein and includes heart-healthy tomatoes. Serve with whole wheat pasta for added fiber.",
        "Healthy,Dinner,Quick,High-Protein",
        [
          { ingredient: "Chicken breasts", measure: "2" },
          { ingredient: "Tomatoes", measure: "1 cup, sliced" },
          { ingredient: "Mozzarella", measure: "1/2 cup, sliced" },
          { ingredient: "Fresh basil", measure: "1/4 cup" },
          { ingredient: "Olive oil", measure: "1 tbsp" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Caprese Salad with Balsamic Glaze",
        "Salad",
        "Italian",
        "Layer sliced fresh mozzarella, ripe tomatoes, and fresh basil leaves. Drizzle with balsamic glaze. Season with salt and pepper.",
        "Healthy,Vegetarian,Italian,Salad",
        [
          { ingredient: "Fresh Mozzarella", measure: "8 oz sliced" },
          { ingredient: "Ripe Tomatoes", measure: "2 sliced" },
          { ingredient: "Fresh Basil Leaves", measure: "1/2 cup" },
          { ingredient: "Balsamic Glaze", measure: "2 tbsp" },
          { ingredient: "Salt", measure: "to taste" },
          { ingredient: "Black Pepper", measure: "to taste" },
        ],
        "10 mins"
      ),
      generateRecipeData(
        "Turkey Chili (Bean-Free option)",
        "Chili",
        "American",
        "Brown ground turkey with diced onions and bell peppers. Add crushed tomatoes, chili powder, cumin, and broth. Simmer until flavors meld. (Optional: omit beans for lower carb)",
        "Healthy,High-Protein,ComfortFood,Turkey",
        [
          { ingredient: "Ground Turkey", measure: "1.5 lbs" },
          { ingredient: "Onion", measure: "1 chopped" },
          { ingredient: "Bell Peppers", measure: "1 chopped" },
          { ingredient: "Crushed Tomatoes", measure: "1 (28 oz) can" },
          { ingredient: "Chicken Broth", measure: "1 cup" },
          { ingredient: "Chili Powder", measure: "2 tbsp" },
          { ingredient: "Cumin", measure: "1 tbsp" },
        ],
        "50 mins"
      ),
      // New recipes from Verywell Fit
      generateRecipeData(
        "Steamed Halibut with Broccoli and Brown Rice",
        "Dinner",
        "General",
        "Steam halibut and broccoli, serve with brown rice for a balanced, nutrient-rich meal.",
        "Healthy,High-Protein,Fish",
        [
          { ingredient: "Halibut", measure: "4 oz" },
          { ingredient: "Broccoli", measure: "1 cup, steamed" },
          { ingredient: "Brown Rice", measure: "1 cup, cooked" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Sirloin Steak with Roasted Sweet Potato and Vegetables",
        "Dinner",
        "General",
        "Grill sirloin steak and serve with roasted sweet potato, spinach, and green beans.",
        "Healthy,High-Protein",
        [
          { ingredient: "Sirloin Steak", measure: "5 oz" },
          { ingredient: "Sweet Potato", measure: "1, roasted" },
          { ingredient: "Spinach", measure: "1 cup, cooked" },
          { ingredient: "Green Beans", measure: "1 cup" },
          { ingredient: "Olive Oil", measure: "2 tsp" },
        ],
        "45 mins"
      ),
      generateRecipeData(
        "Turkey Burger with Veggies",
        "Dinner",
        "American",
        "Serve a turkey burger on a whole wheat English muffin with tomato, lettuce, and onion.",
        "Healthy,High-Protein",
        [
          { ingredient: "Turkey Burger", measure: "5 oz" },
          { ingredient: "Whole Wheat English Muffin", measure: "1" },
          { ingredient: "Tomato", measure: "1 slice" },
          { ingredient: "Lettuce", measure: "2 leaves" },
          { ingredient: "Onion", measure: "1 slice" },
          { ingredient: "Ketchup", measure: "2 tbsp" },
        ],
        "20 mins"
      ),
      generateRecipeData(
        "Whole Wheat Pasta with Tomato Sauce and Salad",
        "Dinner",
        "Italian",
        "Toss whole wheat pasta with tomato sauce, served with a small garden salad.",
        "Healthy,Vegetarian,Italian",
        [
          { ingredient: "Whole Wheat Pasta", measure: "1.5 cups, cooked" },
          { ingredient: "Tomato Sauce", measure: "1 cup" },
          { ingredient: "Mixed Greens", measure: "1 cup" },
          { ingredient: "Cherry Tomatoes", measure: "1/2 cup" },
          { ingredient: "Balsamic Vinaigrette", measure: "1 tbsp" },
        ],
        "25 mins"
      ),
      generateRecipeData(
        "Trout with Green Beans and Brown Rice",
        "Dinner",
        "General",
        "Bake trout and serve with steamed green beans and brown rice.",
        "Healthy,High-Protein,Fish",
        [
          { ingredient: "Trout Filet", measure: "4 oz" },
          { ingredient: "Green Beans", measure: "1 cup, steamed" },
          { ingredient: "Brown Rice", measure: "1 cup, cooked" },
          { ingredient: "Salad Dressing", measure: "1 tbsp" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Pork Loin with Sweet Potato and Asparagus",
        "Dinner",
        "General",
        "Roast pork loin with a side of baked sweet potato and asparagus spears.",
        "Healthy,High-Protein",
        [
          { ingredient: "Pork Loin", measure: "5 oz" },
          { ingredient: "Sweet Potato", measure: "1, baked" },
          { ingredient: "Asparagus", measure: "5 spears" },
          { ingredient: "Vinaigrette", measure: "1 tbsp" },
        ],
        "40 mins"
      ),
      generateRecipeData(
        "Salmon with Brown Rice and Asparagus",
        "Dinner",
        "General",
        "Bake or grill salmon, serve with brown rice and asparagus for a balanced meal.",
        "Healthy,High-Protein,Fish",
        [
          { ingredient: "Salmon", measure: "4 oz" },
          { ingredient: "Brown Rice", measure: "1 cup, cooked" },
          { ingredient: "Asparagus", measure: "5 spears" },
        ],
        "30 mins"
      ),
      // New recipes from Healthline
      generateRecipeData(
        "Italian Pasta Salad",
        "Salad",
        "Italian",
        "A refreshing salad with cooked pasta, non-starchy vegetables, and protein options like chicken, mozzarella, or white beans.",
        "Healthy,Vegetarian,Italian",
        [
          { ingredient: "Cooked Pasta (100% whole wheat)", measure: "2 cups" },
          {
            ingredient:
              "Non-starchy Vegetables (e.g., bell peppers, cucumbers, tomatoes)",
            measure: "1 cup",
          },
          {
            ingredient: "Protein (chicken, mozzarella, white beans)",
            measure: "1/2 cup",
          },
          { ingredient: "Olive Oil", measure: "1 tbsp" },
          { ingredient: "Balsamic Vinegar", measure: "1 tbsp" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Slow Cooker Lentil Soup",
        "Soup",
        "General",
        "A hearty soup made with lentils, vegetables, and pantry spices, perfect for a comforting meal.",
        "Healthy,Vegetarian,Soup",
        [
          { ingredient: "Lentils", measure: "1 cup" },
          {
            ingredient: "Mixed Vegetables (carrots, celery, onions)",
            measure: "2 cups",
          },
          { ingredient: "Vegetable Broth", measure: "4 cups" },
          {
            ingredient: "Spices (e.g., cumin, paprika)",
            measure: "1 tsp each",
          },
        ],
        "4 hours"
      ),
      generateRecipeData(
        "Sweet Potato Black Bean Meal Prep Bowls",
        "Dinner",
        "General",
        "Bowls filled with roasted sweet potatoes, black beans, and avocado lime dressing.",
        "Healthy,Vegetarian,Meal Prep",
        [
          { ingredient: "Sweet Potatoes", measure: "2, cubed" },
          { ingredient: "Black Beans", measure: "1 can, drained" },
          { ingredient: "Avocado", measure: "1, mashed" },
          { ingredient: "Lime Juice", measure: "2 tbsp" },
          { ingredient: "Olive Oil", measure: "1 tbsp" },
        ],
        "45 mins"
      ),
      generateRecipeData(
        "Caprese Chicken Breasts",
        "Dinner",
        "Italian",
        "Chicken breasts topped with tomatoes, mozzarella, and basil, baked to perfection.",
        "Healthy,Protein-Rich,Italian",
        [
          { ingredient: "Chicken Breasts", measure: "2" },
          { ingredient: "Tomatoes", measure: "1 cup, sliced" },
          { ingredient: "Mozzarella Cheese", measure: "1/2 cup, sliced" },
          { ingredient: "Fresh Basil", measure: "1/4 cup" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Sheet Pan Pork Chops and Sweet Potatoes",
        "Dinner",
        "General",
        "Pork chops, sweet potatoes, onions, and apples roasted together on a sheet pan.",
        "Healthy,Protein-Rich,One-Pan",
        [
          { ingredient: "Pork Chops", measure: "4" },
          { ingredient: "Sweet Potatoes", measure: "2, cubed" },
          { ingredient: "Onion", measure: "1, sliced" },
          { ingredient: "Apple", measure: "1, sliced" },
          { ingredient: "Olive Oil", measure: "2 tbsp" },
        ],
        "45 mins"
      ),
      generateRecipeData(
        "Healthy Mac and Cheese with Veggies",
        "Dinner",
        "American",
        "Whole grain pasta with zucchini, cauliflower, and a cheesy sauce.",
        "Healthy,Vegetarian,Comfort Food",
        [
          { ingredient: "Whole Grain Pasta", measure: "2 cups" },
          { ingredient: "Zucchini", measure: "1, diced" },
          { ingredient: "Cauliflower", measure: "1 cup, florets" },
          { ingredient: "Cheese", measure: "1 cup, shredded" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "One-Pot Teriyaki Chicken Zoodles",
        "Dinner",
        "Asian",
        "Chicken and zucchini noodles cooked in a teriyaki sauce, all in one pot.",
        "Healthy,Low-Carb,Asian",
        [
          { ingredient: "Chicken Breasts", measure: "2, sliced" },
          { ingredient: "Zucchini", measure: "2, spiralized" },
          { ingredient: "Pineapple", measure: "1/2 cup, chunks" },
          { ingredient: "Teriyaki Sauce", measure: "1/4 cup" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Salmon Burgers with Slaw",
        "Dinner",
        "General",
        "Burgers made from canned salmon, served with a fresh cabbage slaw.",
        "Healthy,Protein-Rich,Fish",
        [
          { ingredient: "Canned Salmon", measure: "1 can" },
          { ingredient: "Breadcrumbs", measure: "1/4 cup" },
          { ingredient: "Egg", measure: "1" },
          { ingredient: "Cabbage", measure: "1 cup, shredded" },
          { ingredient: "Carrot", measure: "1, grated" },
        ],
        "30 mins"
      ),
      generateRecipeData(
        "Lentil Bolognese",
        "Dinner",
        "Italian",
        "A meatless bolognese sauce made with lentils, served over pasta.",
        "Healthy,Vegetarian,Italian",
        [
          { ingredient: "Lentils", measure: "1 cup" },
          { ingredient: "Tomato Sauce", measure: "2 cups" },
          { ingredient: "Onion", measure: "1, diced" },
          { ingredient: "Garlic", measure: "2 cloves, minced" },
          { ingredient: "Whole Wheat Pasta", measure: "2 cups" },
        ],
        "45 mins"
      ),
      generateRecipeData(
        "Easy Black Bean and Rice Skillet",
        "Dinner",
        "Mexican",
        "A simple skillet meal with black beans, brown rice, cheese, and vegetables.",
        "Healthy,Vegetarian,Mexican",
        [
          { ingredient: "Black Beans", measure: "1 can, drained" },
          { ingredient: "Brown Rice", measure: "1 cup, cooked" },
          { ingredient: "Cheese", measure: "1/2 cup, shredded" },
          { ingredient: "Bell Peppers", measure: "1, diced" },
          { ingredient: "Onion", measure: "1, diced" },
        ],
        "30 mins"
      ),
    ],
  },
  "heart disease": {
    keywords: [
      "heart disease",
      "cardiovascular disease",
      "heart health",
      "cholesterol",
      "triglycerides",
      "atherosclerosis",
      "coronary artery disease",
    ],
    clarification:
      "To help me suggest the best recipe for heart health, could you tell me if you have any other dietary restrictions or preferences, such as vegetarian, low-sodium, or specific cuisine types?",
    recipes: [
      generateRecipeData(
        "Fresh Fruit Kebabs with Lemon-Lime Dip",
        "Snack",
        "General",
        "Skewered fresh fruits served with a tangy lemon-lime dip, perfect for a light, heart-healthy snack.",
        "Heart-Healthy,Low-Sodium,Low-Fat,Vegetarian",
        [
          { ingredient: "Strawberries", measure: "1 cup" },
          { ingredient: "Pineapple", measure: "1 cup, cubed" },
          { ingredient: "Lemon Juice", measure: "2 tbsp" },
          { ingredient: "Lime Juice", measure: "2 tbsp" },
          { ingredient: "Honey", measure: "1 tsp" },
        ],
        "15 mins"
      ),
      generateRecipeData(
        "Green Smoothie",
        "Beverage",
        "General",
        "A refreshing smoothie made with green vegetables and fruits, packed with nutrients for heart health.",
        "Heart-Healthy,Low-Sodium,Vegetarian",
        [
          { ingredient: "Spinach", measure: "1 cup" },
          { ingredient: "Kale", measure: "1 cup" },
          { ingredient: "Banana", measure: "1" },
          { ingredient: "Apple", measure: "1, chopped" },
          { ingredient: "Water", measure: "1 cup" },
        ],
        "5 mins"
      ),
      generateRecipeData(
        "Baked Salmon with Southeast Asian Marinade",
        "Main Dish",
        "Asian",
        "Baked salmon marinated with Southeast Asian flavors, rich in omega-3s for heart health.",
        "Heart-Healthy,Low-Sodium,Fish",
        [
          { ingredient: "Salmon Fillets", measure: "2 (6 oz each)" },
          { ingredient: "Low-Sodium Soy Sauce", measure: "2 tbsp" },
          { ingredient: "Ginger", measure: "1 tsp, grated" },
          { ingredient: "Garlic", measure: "1 clove, minced" },
          { ingredient: "Lime Juice", measure: "1 tbsp" },
        ],
        "25 mins"
      ),
      generateRecipeData(
        "Spinach Berry Salad",
        "Salad",
        "General",
        "A salad combining spinach with fresh berries and a light dressing, high in antioxidants.",
        "Heart-Healthy,Low-Sodium,Vegetarian",
        [
          { ingredient: "Spinach", measure: "2 cups" },
          { ingredient: "Strawberries", measure: "1/2 cup, sliced" },
          { ingredient: "Blueberries", measure: "1/2 cup" },
          { ingredient: "Almonds", measure: "2 tbsp, sliced" },
          { ingredient: "Olive Oil", measure: "1 tbsp" },
          { ingredient: "Balsamic Vinegar", measure: "1 tbsp" },
        ],
        "10 mins"
      ),
      generateRecipeData(
        "Quinoa Salad",
        "Salad",
        "Mediterranean",
        "A hearty salad made with quinoa and vegetables, supporting heart health with fiber and nutrients.",
        "Heart-Healthy,Low-Sodium,Vegetarian",
        [
          { ingredient: "Quinoa", measure: "1 cup, cooked" },
          { ingredient: "Bell Peppers", measure: "1/2 cup, diced" },
          { ingredient: "Cucumbers", measure: "1/2 cup, diced" },
          { ingredient: "Cherry Tomatoes", measure: "1/2 cup, halved" },
          { ingredient: "Olive Oil", measure: "1 tbsp" },
          { ingredient: "Lemon Juice", measure: "1 tbsp" },
        ],
        "20 mins"
      ),
    ],
  },
  osteoporosis: {
    keywords: [
      "osteoporosis",
      "bone health",
      "calcium",
      "vitamin D",
      "bone density",
    ],
    clarification:
      "To help me suggest the best recipe for bone health, could you tell me if you have any other dietary restrictions or preferences, such as lactose intolerance, or specific cuisine types?",
    recipes: [
      generateRecipeData(
        "Skyr Yogurt Panna cotta with Raspberries, Flax Seed, Peppermint & Cocoa Powder",
        "Dessert",
        "General",
        "A creamy dessert made with skyr yogurt, topped with raspberries and healthy toppings for bone health.",
        "Bone-Healthy,High-Calcium,Vegetarian",
        [
          { ingredient: "Skyr Yogurt", measure: "1 cup" },
          { ingredient: "Raspberries", measure: "1/2 cup" },
          { ingredient: "Flax Seed", measure: "1 tbsp" },
          { ingredient: "Peppermint", measure: "1 tsp, chopped" },
          { ingredient: "Cocoa Powder", measure: "1 tsp" },
        ],
        "20 mins prep + 2 hours chill"
      ),
      generateRecipeData(
        "Harri's Sardine Sandwich with Mustard & Yogurt Butter",
        "Lunch",
        "General",
        "A sandwich featuring sardines with a tangy mustard and yogurt spread, rich in calcium and vitamin D.",
        "Bone-Healthy,High-Calcium,Fish",
        [
          { ingredient: "Sardines", measure: "1 can (4 oz), drained" },
          { ingredient: "Mustard", measure: "1 tsp" },
          { ingredient: "Yogurt", measure: "2 tbsp" },
          { ingredient: "Whole-Grain Bread", measure: "2 slices" },
        ],
        "10 mins"
      ),
      generateRecipeData(
        "Lamb Tangine with Prunes, Almonds, Sesame Seeds & Yogurt Sauce",
        "Main Dish",
        "Moroccan",
        "A flavorful Moroccan dish with lamb, prunes, and a yogurt sauce, supporting bone health with calcium-rich ingredients.",
        "Bone-Healthy,High-Calcium",
        [
          { ingredient: "Lamb", measure: "1 lb, cubed" },
          { ingredient: "Prunes", measure: "1/2 cup" },
          { ingredient: "Almonds", measure: "1/4 cup" },
          { ingredient: "Sesame Seeds", measure: "1 tbsp" },
          { ingredient: "Yogurt", measure: "1/2 cup" },
        ],
        "1 hour"
      ),
      generateRecipeData(
        "Smoked Gouda Alaskan King Crab Mac 'n Cheese",
        "Main Dish",
        "American",
        "A comforting dish with smoked gouda and Alaskan king crab, high in calcium for bone health.",
        "Bone-Healthy,High-Calcium",
        [
          { ingredient: "Smoked Gouda", measure: "1 cup, shredded" },
          { ingredient: "Alaskan King Crab", measure: "1/2 lb" },
          { ingredient: "Whole-Grain Pasta", measure: "2 cups, cooked" },
        ],
        "40 mins"
      ),
      generateRecipeData(
        "Spinach and Ricotta Cannelloni",
        "Main Dish",
        "Italian",
        "Pasta tubes filled with spinach and ricotta cheese, baked with a tomato sauce, rich in calcium.",
        "Bone-Healthy,High-Calcium,Vegetarian",
        [
          { ingredient: "Spinach", measure: "2 cups, chopped" },
          { ingredient: "Ricotta Cheese", measure: "1 cup" },
          { ingredient: "Whole-Grain Pasta", measure: "8 tubes" },
          { ingredient: "Tomato Sauce", measure: "1 cup" },
        ],
        "45 mins"
      ),
    ],
  },
};

// Flatten all recipes into a single array for easier ingredient searching
const allRecipesFlat = [];
for (const conditionKey in healthConditionsData) {
  const conditionInfo = healthConditionsData[conditionKey];
  if (conditionKey === "allergies") {
    for (const allergenType in conditionInfo.recipes) {
      // Corrected: Directly push the recipe object, not spread it, as it's not an array of recipes here.
      allRecipesFlat.push(conditionInfo.recipes[allergenType]);
    }
  } else {
    allRecipesFlat.push(...conditionInfo.recipes);
  }
}
const YOUTUBE_API_KEY = "AIzaSyBYVpzKZP_bIKCNo5U-IB3hjZ9M7sF3eTs";
const YOUTUBE_SEARCH_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

async function searchYouTubeVideos(query, maxResults = 3) {
  try {
    const response = await fetch(
      `${YOUTUBE_SEARCH_BASE_URL}?key=${YOUTUBE_API_KEY}&q=${encodeURIComponent(
        query
      )}&part=snippet&type=video&maxResults=${maxResults}`
    );
    console.log("YouTube API Response:", response);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("YouTube API Error:", errorText);
      return [];
    }

    const data = await response.json();

    return data.items.map(
      (item) => `https://www.youtube.com/watch?v=${item.id.videoId}`
    );
  } catch (err) {
    console.error("Error fetching from YouTube:", err);
    return [];
  }
}

// API Endpoint
app.post("/api/suggest-recipe", async (req, res) => {
  const userPrompt = req.body.prompt ? req.body.prompt.toLowerCase() : "";

  if (!userPrompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  const promptKeywords = new Set(
    userPrompt.split(/\s+/).filter((word) => word.length > 2)
  );

  let suggestedRecipe = null;
  let clarificationMessage = null;
  let matchedByCondition = false;

  // 1. Match Health Condition
  for (const conditionKey in healthConditionsData) {
    const conditionInfo = healthConditionsData[conditionKey];
    if (conditionInfo.keywords.some((keyword) => promptKeywords.has(keyword))) {
      matchedByCondition = true;

      if (conditionKey === "allergies") {
        let foundAllergen = null;
        for (const allergenType in conditionInfo.recipes) {
          if (promptKeywords.has(allergenType)) {
            foundAllergen = allergenType;
            break;
          }
        }

        if (foundAllergen) {
          suggestedRecipe =
            conditionInfo.recipes[foundAllergen][
              Math.floor(Math.random() * conditionInfo.recipes[foundAllergen].length)
            ];
          clarificationMessage = conditionInfo.clarification.replace(
            "which ingredients you need to avoid?",
            `any other restrictions for ${foundAllergen} or cuisine preferences?`
          );
        } else {
          clarificationMessage = conditionInfo.clarification;
        }
      } else {
        suggestedRecipe =
          conditionInfo.recipes[
            Math.floor(Math.random() * conditionInfo.recipes.length)
          ];
        clarificationMessage = conditionInfo.clarification;
      }
      break;
    }
  }

  // 2. Match by Ingredients
  if (!matchedByCondition) {
    const potentialIngredients = Array.from(promptKeywords);
    let bestIngredientMatchRecipe = null;
    let maxMatchedIngredients = 0;

    for (const recipe of allRecipesFlat) {
      const recipeIngredients = new Set(
        recipe.ingredients.map((item) => item.ingredient.toLowerCase())
      );
      let currentMatchedIngredients = 0;

      for (const potentialIng of potentialIngredients) {
        if (recipeIngredients.has(potentialIng)) {
          currentMatchedIngredients++;
        } else if (
          Array.from(recipeIngredients).some((rIng) =>
            rIng.includes(potentialIng)
          )
        ) {
          currentMatchedIngredients++;
        }
      }

      if (currentMatchedIngredients > maxMatchedIngredients) {
        maxMatchedIngredients = currentMatchedIngredients;
        bestIngredientMatchRecipe = recipe;
      }
    }

    if (maxMatchedIngredients > 0) {
      suggestedRecipe = bestIngredientMatchRecipe;
      clarificationMessage =
        "Based on the ingredients you mentioned, here's a recipe. Let me know if you have other dietary needs!";
    }
  }

  // 3. Fallback General Healthy
  if (!suggestedRecipe) {
    const generalHealthyInfo = healthConditionsData["general healthy"];
    suggestedRecipe =
      generalHealthyInfo.recipes[
        Math.floor(Math.random() * generalHealthyInfo.recipes.length)
      ];
    clarificationMessage =
      "I couldn't find a specific match for your request, but here's a general healthy suggestion. Could you clarify your needs or ingredients further?";
  }

  // 4. YouTube Search
  let videoLinks = [];
  if (suggestedRecipe?.strMeal || suggestedRecipe?.name) {
    const recipeName = suggestedRecipe.strMeal || suggestedRecipe.name;
    const query = `${recipeName} recipe`;
    const maxResults = 3;

    try {
      const response = await fetch(
        `${YOUTUBE_SEARCH_BASE_URL}?key=${YOUTUBE_API_KEY}&q=${encodeURIComponent(
          query
        )}&part=snippet&type=video&maxResults=${maxResults}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("YouTube API Error:", errorText);
      } else {
        const data = await response.json();
        console.log("YouTube API Result:", data);
        videoLinks = data.items
          .filter((item) => item.id && item.id.videoId)
          .map((item) => `https://www.youtube.com/watch?v=${item.id.videoId}`);
      }
    } catch (err) {
      console.error("Error fetching from YouTube:", err);
    }
  }

  // 5. Respond
  res.json({
    clarification: clarificationMessage,
    recipe: suggestedRecipe,
    videoLinks: videoLinks,
  });
});

// Export the app for Vercel serverless deployment
module.exports = app;
