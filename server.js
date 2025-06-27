const express = require('express');
const cors = require('cors');
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
    const thumb_url = `https://placehold.co/600x400/B2DFDB/004D40?text=${meal_name.replace(/ /g, '+')}`;
    return {
        strMeal: meal_name,
        strCategory: category,
        strArea: area,
        strInstructions: instructions,
        strMealThumb: thumb_url,
        strTags: tags,
        ingredients: ingredients,
        totalTime: total_time
    };
}

const healthConditionsData = {
    "diabetes": {
        "keywords": ["diabetes", "diabetic", "blood sugar", "insulin", "low-sugar", "sugar-free", "low-carb"],
        "clarification": "To help me suggest the best recipe, could you tell me if you have any other dietary restrictions or allergies, and what kind of cuisine you prefer? (e.g., low-carb, no added sugar, vegetarian, Asian, Mediterranean)",
        "recipes": [
            generateRecipeData(
                "Berry Chia Pudding", "Breakfast", "Healthy",
                "Combine chia seeds, unsweetened almond milk, and mixed berries in a jar. Stir well. Refrigerate overnight. Top with a few nuts before serving.",
                "Healthy,Low-Carb,Diabetes-Friendly,Breakfast",
                [{"ingredient": "Chia Seeds", "measure": "3 tbsp"}, {"ingredient": "Unsweetened Almond Milk", "measure": "1 cup"}, {"ingredient": "Mixed Berries", "measure": "1/2 cup"}, {"ingredient": "Optional: Nuts", "measure": "1 tbsp"}],
                "5 mins prep + overnight chill"
            ),
            generateRecipeData(
                "Lentil Salad with Feta and Veggies", "Salad", "Mediterranean",
                "Cook lentils according to package directions. Mix with chopped cucumber, bell peppers, cherry tomatoes, red onion, and crumbled feta cheese. Dress with lemon-herb vinaigrette.",
                "Healthy,Diabetes-Friendly,Vegetarian,Lunch",
                [{"ingredient": "Cooked Lentils", "measure": "1 cup"}, {"ingredient": "Cucumber", "measure": "1/2 chopped"}, {"ingredient": "Bell Peppers", "measure": "1/2 cup chopped"}, {"ingredient": "Cherry Tomatoes", "measure": "1/2 cup halved"}, {"ingredient": "Red Onion", "measure": "1/4 chopped"}, {"ingredient": "Feta Cheese", "measure": "1/4 cup crumbled"}, {"ingredient": "Lemon-Herb Vinaigrette", "measure": "2 tbsp"}],
                "30 mins"
            ),
            generateRecipeData(
                "Baked Salmon with Roasted Asparagus", "Seafood", "Healthy",
                "Preheat oven to 400°F (200°C). Place salmon fillets and asparagus on a baking sheet. Drizzle with olive oil, season with salt, pepper, and lemon juice. Bake for 12-15 minutes.",
                "Healthy,Low-Carb,Diabetes-Friendly,Fish",
                [{"ingredient": "Salmon Fillets", "measure": "2 (6oz each)"}, {"ingredient": "Asparagus", "measure": "1 bunch"}, {"ingredient": "Olive Oil", "measure": "2 tbsp"}, {"ingredient": "Lemon", "measure": "1/2"}, {"ingredient": "Salt", "measure": "to taste"}, {"ingredient": "Black Pepper", "measure": "to taste"}],
                "25 mins"
            ),
            generateRecipeData(
                "Chicken & Veggie Skewers", "Chicken", "Grill",
                "Cut chicken breast and various non-starchy vegetables (bell peppers, zucchini, cherry tomatoes) into chunks. Thread onto skewers. Marinate in a sugar-free herb marinade. Grill until cooked through.",
                "Healthy,Low-Carb,Diabetes-Friendly,Grill",
                [{"ingredient": "Chicken Breast", "measure": "1 lb"}, {"ingredient": "Bell Peppers", "measure": "1"}, {"ingredient": "Zucchini", "measure": "1"}, {"ingredient": "Cherry Tomatoes", "measure": "1 cup"}, {"ingredient": "Sugar-Free Marinade", "measure": "1/4 cup"}],
                "35 mins"
            ),
            generateRecipeData(
                "Spinach and Mushroom Omelette", "Breakfast", "Vegetarian",
                "Whisk eggs with a splash of milk (dairy-free if preferred). Sauté spinach and mushrooms. Pour eggs over veggies in a non-stick pan. Cook until set.",
                "Healthy,Low-Carb,Diabetes-Friendly,Breakfast,Vegetarian",
                [{"ingredient": "Eggs", "measure": "3"}, {"ingredient": "Fresh Spinach", "measure": "1 cup"}, {"ingredient": "Mushrooms", "measure": "1/2 cup sliced"}, {"ingredient": "Milk (or almond milk)", "measure": "1 tbsp"}, {"ingredient": "Olive Oil", "measure": "1 tsp"}],
                "15 mins"
            ),
        ]
    },
    "high blood pressure": {
        "keywords": ["high blood pressure", "hypertension", "low-sodium", "heart-healthy"],
        "clarification": "Understood. To provide the best low-sodium recipe, could you specify if you have any other dietary needs or cuisine preferences?",
        "recipes": [
            generateRecipeData(
                "Chicken and Vegetable Stir-fry", "Chicken", "Asian",
                "Slice chicken breast and various vegetables (broccoli, carrots, snap peas). Stir-fry in a wok with a low-sodium soy sauce or coconut aminos, garlic, and ginger. Serve over brown rice (optional).",
                "Healthy,Low-Sodium,Heart-Healthy,Chicken",
                [{"ingredient": "Chicken Breast", "measure": "1 lb"}, {"ingredient": "Broccoli florets", "measure": "1 cup"}, {"ingredient": "Carrots", "measure": "1/2 cup sliced"}, {"ingredient": "Snap Peas", "measure": "1/2 cup"}, {"ingredient": "Low-Sodium Soy Sauce", "measure": "3 tbsp"}, {"ingredient": "Garlic", "measure": "2 cloves minced"}, {"ingredient": "Ginger", "measure": "1 tsp grated"}, {"ingredient": "Sesame Oil", "measure": "1 tsp"}],
                "30 mins"
            ),
            generateRecipeData(
                "Apple Slices with Almond Butter", "Snack", "Healthy",
                "Slice an apple and serve with a dollop of unsalted almond butter.",
                "Healthy,Low-Sodium,Snack,Fruit",
                [{"ingredient": "Apple", "measure": "1"}, {"ingredient": "Unsalted Almond Butter", "measure": "2 tbsp"}],
                "5 mins"
            ),
            generateRecipeData(
                "Mediterranean Quinoa Bowl", "Grain Bowl", "Mediterranean",
                "Combine cooked quinoa with cucumber, tomatoes, olives, bell peppers, and chickpeas. Dress with olive oil and lemon juice. Top with fresh parsley.",
                "Healthy,Low-Sodium,Heart-Healthy,Vegetarian,Mediterranean",
                [{"ingredient": "Cooked Quinoa", "measure": "1 cup"}, {"ingredient": "Cucumber", "measure": "1/2 diced"}, {"ingredient": "Tomatoes", "measure": "1/2 cup diced"}, {"ingredient": "Kalamata Olives", "measure": "1/4 cup sliced"}, {"ingredient": "Bell Pepper", "measure": "1/2 diced"}, {"ingredient": "Chickpeas", "measure": "1/2 cup"}, {"ingredient": "Olive Oil", "measure": "2 tbsp"}, {"ingredient": "Lemon Juice", "measure": "1 tbsp"}, {"ingredient": "Fresh Parsley", "measure": "for garnish"}],
                "20 mins"
            ),
            generateRecipeData(
                "Baked Cod with Steamed Green Beans", "Seafood", "Simple",
                "Season cod fillets with herbs (dill, parsley), lemon, and pepper (no salt). Bake until flaky. Steam green beans until tender-crisp.",
                "Healthy,Low-Sodium,Heart-Healthy,Fish",
                [{"ingredient": "Cod Fillets", "measure": "2 (6oz each)"}, {"ingredient": "Green Beans", "measure": "1 cup"}, {"ingredient": "Lemon", "measure": "1/2"}, {"ingredient": "Dried Dill", "measure": "1 tsp"}, {"ingredient": "Black Pepper", "measure": "to taste"}],
                "25 mins"
            ),
            generateRecipeData(
                "Berry Smoothie with Spinach", "Smoothie", "Healthy",
                "Blend mixed berries, spinach, unsweetened almond milk, and a scoop of protein powder (optional) until smooth.",
                "Healthy,Low-Sodium,Heart-Healthy,Breakfast,Snack",
                [{"ingredient": "Mixed Berries", "measure": "1 cup"}, {"ingredient": "Fresh Spinach", "measure": "1 cup"}, {"ingredient": "Unsweetened Almond Milk", "measure": "1 cup"}, {"ingredient": "Protein Powder (optional)", "measure": "1 scoop"}],
                "5 mins"
            ),
        ]
    },
    "high cholesterol": {
        "keywords": ["high cholesterol", "cholesterol", "low-fat", "fiber-rich"],
        "clarification": "Understood. To suggest the best cholesterol-friendly recipe, could you specify your preferences regarding ingredients (e.g., plant-based, lean meats) or cuisine type?",
        "recipes": [
            generateRecipeData(
                "Black Bean Burgers", "Vegan", "American",
                "Mash cooked black beans with breadcrumbs, spices (cumin, chili powder), and finely diced onion/bell pepper. Form into patties and bake or pan-fry until golden. Serve on whole-wheat buns with plenty of veggies.",
                "Healthy,Low-Cholesterol,Fiber-Rich,Vegan",
                [{"ingredient": "Canned Black Beans", "measure": "1 can (drained & rinsed)"}, {"ingredient": "Breadcrumbs", "measure": "1/2 cup"}, {"ingredient": "Onion", "measure": "1/4 chopped"}, {"ingredient": "Bell Pepper", "measure": "1/4 chopped"}, {"ingredient": "Cumin", "measure": "1 tsp"}, {"ingredient": "Chili Powder", "measure": "1 tsp"}],
                "40 mins"
            ),
            generateRecipeData(
                "Oatmeal with Berries and Nuts", "Breakfast", "Healthy",
                "Cook rolled oats with water or unsweetened plant-based milk. Top with fresh berries, a sprinkle of nuts (like walnuts), and a dash of cinnamon.",
                "Healthy,Low-Cholesterol,Fiber-Rich,Breakfast",
                [{"ingredient": "Rolled Oats", "measure": "1/2 cup"}, {"ingredient": "Water or Plant Milk", "measure": "1 cup"}, {"ingredient": "Fresh Berries", "measure": "1/2 cup"}, {"ingredient": "Walnuts", "measure": "1 tbsp chopped"}, {"ingredient": "Cinnamon", "measure": "1/2 tsp"}],
                "10 mins"
            ),
            generateRecipeData(
                "Vegetable & Chickpea Curry", "Curry", "Indian",
                "Sauté onions, garlic, and ginger. Add curry powder, turmeric, and diced vegetables (potatoes, carrots, bell peppers). Stir in canned diced tomatoes and chickpeas. Simmer until vegetables are tender. Serve with brown rice.",
                "Healthy,Low-Cholesterol,Fiber-Rich,Vegan,Indian",
                [{"ingredient": "Onion", "measure": "1 chopped"}, {"ingredient": "Garlic", "measure": "2 cloves minced"}, {"ingredient": "Ginger", "measure": "1 tsp grated"}, {"ingredient": "Curry Powder", "measure": "1 tbsp"}, {"ingredient": "Turmeric", "measure": "1/2 tsp"}, {"ingredient": "Potatoes", "measure": "1 diced"}, {"ingredient": "Carrots", "measure": "2 sliced"}, {"ingredient": "Bell Pepper", "measure": "1 diced"}, {"ingredient": "Canned Diced Tomatoes", "measure": "1 (14.5 oz) can"}, {"ingredient": "Canned Chickpeas", "measure": "1 (15 oz) can"}],
                "45 mins"
            ),
            generateRecipeData(
                "Broccoli and White Bean Soup", "Soup", "Vegetarian",
                "Sauté onion and garlic. Add vegetable broth, chopped broccoli, and cannellini beans. Simmer until broccoli is tender. Blend a portion of the soup for creaminess. Season with herbs.",
                "Healthy,Low-Cholesterol,Fiber-Rich,Vegetarian,Soup",
                [{"ingredient": "Onion", "measure": "1/2 chopped"}, {"ingredient": "Garlic", "measure": "2 cloves minced"}, {"ingredient": "Vegetable Broth", "measure": "4 cups"}, {"ingredient": "Broccoli Florets", "measure": "3 cups"}, {"ingredient": "Canned Cannellini Beans", "measure": "1 can (drained & rinsed)"}],
                "30 mins"
            ),
            generateRecipeData(
                "Quinoa Salad with Roasted Vegetables", "Salad", "Mediterranean",
                "Roast a mix of vegetables like zucchini, bell peppers, and eggplant. Combine with cooked quinoa, a light lemon-tahini dressing, and fresh herbs.",
                "Healthy,Low-Cholesterol,Fiber-Rich,Vegetarian",
                [{"ingredient": "Cooked Quinoa", "measure": "1 cup"}, {"ingredient": "Zucchini", "measure": "1 diced"}, {"ingredient": "Bell Peppers", "measure": "1 diced"}, {"ingredient": "Eggplant", "measure": "1/2 diced"}, {"ingredient": "Olive Oil", "measure": "2 tbsp"}, {"ingredient": "Lemon Juice", "measure": "1 tbsp"}, {"ingredient": "Tahini", "measure": "1 tbsp"}],
                "45 mins"
            ),
        ]
    },
    "celiac disease": {
        "keywords": ["celiac", "gluten-free", "no gluten", "wheat allergy"],
        "clarification": "Absolutely! To ensure the recipe meets all your needs, do you have any other allergies or specific cuisine preferences?",
        "recipes": [
            generateRecipeData(
                "Gluten-Free Pasta with Pesto and Cherry Tomatoes", "Pasta", "Italian",
                "Cook gluten-free pasta according to package directions. Toss with pre-made gluten-free pesto and halved cherry tomatoes. Garnish with fresh basil.",
                "Gluten-Free,Vegetarian,Italian",
                [{"ingredient": "Gluten-Free Pasta", "measure": "200g"}, {"ingredient": "Gluten-Free Pesto", "measure": "1/2 cup"}, {"ingredient": "Cherry Tomatoes", "measure": "1 cup halved"}, {"ingredient": "Fresh Basil", "measure": "for garnish"}],
                "20 mins"
            ),
            generateRecipeData(
                "Flourless Chocolate Cake", "Dessert", "Baking",
                "Melt chocolate and butter. Whisk eggs with sugar. Combine mixtures. Pour into a greased pan and bake until set. Dust with cocoa powder.",
                "Gluten-Free,Dessert,Chocolate",
                [{"ingredient": "Dark Chocolate", "measure": "8 oz"}, {"ingredient": "Unsalted Butter", "measure": "1/2 cup"}, {"ingredient": "Eggs", "measure": "3"}, {"ingredient": "Granulated Sugar", "measure": "1/2 cup"}, {"ingredient": "Cocoa Powder", "measure": "for dusting"}],
                "50 mins"
            ),
            generateRecipeData(
                "Chicken and Rice Soup", "Soup", "Comfort Food",
                "Sauté chicken pieces with carrots, celery, and onion. Add chicken broth and cooked rice. Simmer until chicken is tender. Season with salt and pepper.",
                "Gluten-Free,ComfortFood,Chicken,Soup",
                [{"ingredient": "Chicken Breast", "measure": "1 lb diced"}, {"ingredient": "Carrots", "measure": "2 chopped"}, {"ingredient": "Celery Stalks", "measure": "2 chopped"}, {"ingredient": "Onion", "measure": "1 chopped"}, {"ingredient": "Chicken Broth", "measure": "6 cups"}, {"ingredient": "Cooked Rice", "measure": "1 cup"}],
                "45 mins"
            ),
            generateRecipeData(
                "Corn Tortilla Tacos with Ground Beef", "Mexican", "Tacos",
                "Cook ground beef with taco seasoning. Warm corn tortillas. Assemble tacos with beef, shredded lettuce, diced tomatoes, and salsa.",
                "Gluten-Free,Mexican,Tacos,Beef",
                [{"ingredient": "Ground Beef", "measure": "1 lb"}, {"ingredient": "Taco Seasoning (GF)", "measure": "1 packet"}, {"ingredient": "Corn Tortillas", "measure": "12"}, {"ingredient": "Lettuce", "measure": "shredded"}, {"ingredient": "Tomatoes", "measure": "diced"}, {"ingredient": "Salsa", "measure": "1/2 cup"}],
                "30 mins"
            ),
            generateRecipeData(
                "Baked Sweet Potato Fries", "Side Dish", "Healthy Snack",
                "Cut sweet potatoes into fries. Toss with olive oil, paprika, and garlic powder. Bake at 400°F (200°C) until crispy.",
                "Gluten-Free,Healthy,Snack,Vegetarian",
                [{"ingredient": "Sweet Potatoes", "measure": "2 large"}, {"ingredient": "Olive Oil", "measure": "2 tbsp"}, {"ingredient": "Paprika", "measure": "1 tsp"}, {"ingredient": "Garlic Powder", "measure": "1/2 tsp"}],
                "30 mins"
            ),
        ]
    },
    "lactose intolerance": {
        "keywords": ["lactose intolerant", "dairy-free", "no dairy", "milk allergy"],
        "clarification": "No problem! To give you the best dairy-free suggestion, are there any other dietary restrictions or cuisine styles you prefer?",
        "recipes": [
            generateRecipeData(
                "Creamy Tomato Basil Soup (Dairy-Free)", "Soup", "Italian",
                "Sauté onion and garlic. Add canned crushed tomatoes, vegetable broth, and basil. Simmer. Stir in full-fat coconut milk for creaminess. Blend until smooth if desired.",
                "Dairy-Free,Vegetarian,Soup,Italian",
                [{"ingredient": "Onion", "measure": "1 chopped"}, {"ingredient": "Garlic", "measure": "2 cloves minced"}, {"ingredient": "Crushed Tomatoes", "measure": "1 (28 oz) can"}, {"ingredient": "Vegetable Broth", "measure": "4 cups"}, {"ingredient": "Fresh Basil", "measure": "1/4 cup chopped"}, {"ingredient": "Full-Fat Coconut Milk", "measure": "1/2 cup"}],
                "35 mins"
            ),
            generateRecipeData(
                "Oatmeal with Plant-Based Milk and Fruit", "Breakfast", "Healthy",
                "Cook rolled oats with almond milk (or other plant-based milk). Top with your favorite fruit like sliced banana or berries.",
                "Dairy-Free,Vegetarian,Breakfast,Healthy",
                [{"ingredient": "Rolled Oats", "measure": "1/2 cup"}, {"ingredient": "Almond Milk", "measure": "1 cup"}, {"ingredient": "Banana", "measure": "1/2 sliced"}, {"ingredient": "Berries", "measure": "1/4 cup"}],
                "10 mins"
            ),
            generateRecipeData(
                "Vegan Mac and Cheese", "Pasta", "Vegan",
                "Cook pasta. For sauce, blend boiled potatoes, carrots, nutritional yeast, plant-based milk, and spices (garlic powder, onion powder) until creamy. Combine with pasta.",
                "Dairy-Free,Vegan,ComfortFood",
                [{"ingredient": "Elbow Macaroni", "measure": "2 cups"}, {"ingredient": "Potatoes", "measure": "1 large, chopped"}, {"ingredient": "Carrots", "measure": "2 medium, chopped"}, {"ingredient": "Nutritional Yeast", "measure": "1/2 cup"}, {"ingredient": "Unsweetened Plant Milk", "measure": "1 cup"}, {"ingredient": "Garlic Powder", "measure": "1 tsp"}, {"ingredient": "Onion Powder", "measure": "1 tsp"}],
                "40 mins"
            ),
            generateRecipeData(
                "Chocolate Avocado Mousse", "Dessert", "Vegan",
                "Blend ripe avocados, cocoa powder, maple syrup, vanilla extract, and a splash of plant milk until smooth and creamy. Chill before serving.",
                "Dairy-Free,Vegan,Dessert,Healthy",
                [{"ingredient": "Ripe Avocados", "measure": "2"}, {"ingredient": "Cocoa Powder", "measure": "1/4 cup"}, {"ingredient": "Maple Syrup", "measure": "1/4 cup"}, {"ingredient": "Vanilla Extract", "measure": "1 tsp"}, {"ingredient": "Almond Milk", "measure": "2 tbsp"}],
                "10 mins prep + 30 mins chill"
            ),
        ]
    },
    "weight management": {
        "keywords": ["lose weight", "weight loss", "low-calorie", "light meal", "high-protein", "lean"],
        "clarification": "To help me suggest the perfect recipe for weight management, could you share if you have any specific dietary needs (e.g., vegetarian, keto-friendly) or preferred cuisine?",
        "recipes": [
            generateRecipeData(
                "Large Chicken Salad with Vinaigrette", "Salad", "Healthy",
                "Combine mixed greens, grilled chicken breast slices, cucumber, cherry tomatoes, bell peppers, and a light vinaigrette dressing. Add a sprinkle of seeds for crunch.",
                "Healthy,Low-Calorie,High-Protein,Chicken,Salad",
                [{"ingredient": "Mixed Greens", "measure": "2 cups"}, {"ingredient": "Grilled Chicken Breast", "measure": "4 oz sliced"}, {"ingredient": "Cucumber", "measure": "1/2 chopped"}, {"ingredient": "Cherry Tomatoes", "measure": "1/2 cup halved"}, {"ingredient": "Bell Peppers", "measure": "1/2 cup chopped"}, {"ingredient": "Light Vinaigrette", "measure": "2 tbsp"}, {"ingredient": "Pumpkin Seeds", "measure": "1 tbsp"}],
                "20 mins"
            ),
            generateRecipeData(
                "Cucumber Slices with Hummus", "Snack", "Healthy",
                "Slice a cucumber and serve with a portion of hummus.",
                "Healthy,Low-Calorie,Snack,Vegetarian",
                [{"ingredient": "Cucumber", "measure": "1"}, {"ingredient": "Hummus", "measure": "2 tbsp"}],
                "5 mins"
            ),
            generateRecipeData(
                "Turkey and Veggie Lettuce Wraps", "Wraps", "Healthy",
                "Sauté ground turkey with diced carrots, water chestnuts, and a low-sodium stir-fry sauce. Serve mixture in large lettuce cups.",
                "Healthy,Low-Calorie,High-Protein,Chicken/Turkey",
                [{"ingredient": "Ground Turkey", "measure": "1 lb"}, {"ingredient": "Carrots", "measure": "1/2 cup shredded"}, {"ingredient": "Water Chestnuts", "measure": "1/2 cup diced"}, {"ingredient": "Low-Sodium Stir-fry Sauce", "measure": "1/4 cup"}, {"ingredient": "Large Lettuce Leaves", "measure": "8"}],
                "25 mins"
            ),
            generateRecipeData(
                "Egg Muffins with Spinach and Feta", "Breakfast", "Healthy",
                "Whisk eggs with spinach and a small amount of crumbled feta. Pour into greased muffin tins and bake until set.",
                "Healthy,Low-Calorie,High-Protein,Breakfast",
                [{"ingredient": "Eggs", "measure": "6"}, {"ingredient": "Fresh Spinach", "measure": "1 cup chopped"}, {"ingredient": "Feta Cheese", "measure": "2 tbsp crumbled"}],
                "25 mins"
            ),
        ]
    },
    "kidney disease": {
        "keywords": ["kidney disease", "renal diet", "kidney-friendly"],
        "clarification": "Given the specific dietary needs for kidney disease, could you please confirm if you have any other restrictions (e.g., fluid intake, specific mineral limits) or food preferences?",
        "recipes": [
            generateRecipeData(
                "White Rice with Roasted Chicken Breast and Green Beans", "Chicken", "Simple",
                "Bake chicken breast seasoned with herbs and pepper (no salt). Steam or boil green beans. Serve with plain white rice.",
                "Kidney-Friendly,Low-Sodium,Low-Potassium,Chicken",
                [{"ingredient": "Chicken Breast", "measure": "1 (6oz)"}, {"ingredient": "White Rice (cooked)", "measure": "1 cup"}, {"ingredient": "Green Beans", "measure": "1 cup"}, {"ingredient": "Dried Herbs", "measure": "1 tsp"}, {"ingredient": "Black Pepper", "measure": "to taste"}],
                "30 mins"
            ),
            generateRecipeData(
                "Homemade Tuna Salad (Low-Sodium)", "Salad", "Lunch",
                "Mix drained canned tuna (in water, no salt added) with celery, onion, and a small amount of low-sodium mayonnaise or plain yogurt. Serve on crackers (low sodium) or lettuce cups.",
                "Kidney-Friendly,Low-Sodium,Low-Potassium,Fish",
                [{"ingredient": "Canned Tuna (no salt added)", "measure": "1 (5oz) can"}, {"ingredient": "Celery", "measure": "1 stalk diced"}, {"ingredient": "Red Onion", "measure": "2 tbsp minced"}, {"ingredient": "Low-Sodium Mayonnaise", "measure": "2 tbsp"}, {"ingredient": "Black Pepper", "measure": "to taste"}],
                "15 mins"
            ),
        ]
    },
    "digestive issues": {
        "keywords": ["IBS", "digestive issues", "low FODMAP", "sensitive stomach", "easy to digest"],
        "clarification": "To help me suggest the best recipe for digestive issues, could you specify what kind of issues you experience (e.g., bloating, gas, acidity) and if there are specific foods you need to avoid?",
        "recipes": [
            generateRecipeData(
                "Salmon with Quinoa and Steamed Carrots", "Seafood", "Simple",
                "Bake or pan-fry salmon. Cook quinoa. Steam carrots until tender. Simple seasoning with olive oil, salt (if tolerated) and pepper. This is a low FODMAP friendly meal.",
                "Healthy,Low-FODMAP,Easy-Digest,Fish",
                [{"ingredient": "Salmon Fillet", "measure": "1 (6oz)"}, {"ingredient": "Quinoa (cooked)", "measure": "1 cup"}, {"ingredient": "Carrots", "measure": "1 cup sliced"}, {"ingredient": "Olive Oil", "measure": "1 tbsp"}, {"ingredient": "Salt", "measure": "to taste"}, {"ingredient": "Black Pepper", "measure": "to taste"}],
                "30 mins"
            ),
            generateRecipeData(
                "Plain Chicken Breast with Mashed Potato", "Comfort Food", "Simple",
                "Boil chicken breast until cooked, shred or slice. Boil potatoes until tender, then mash with a little chicken broth and a small amount of lactose-free milk (if tolerated). Serve simply.",
                "Easy-Digest,Bland,Comfort Food,Chicken",
                [{"ingredient": "Chicken Breast", "measure": "1 (6oz)"}, {"ingredient": "Potatoes", "measure": "2 medium"}, {"ingredient": "Chicken Broth", "measure": "1/4 cup"}, {"ingredient": "Lactose-Free Milk (optional)", "measure": "1 tbsp"}],
                "40 mins"
            ),
        ]
    },
    "allergies": {
        "keywords": ["allergy", "allergic to", "avoid", "free"],
        "clarification": "Could you please specify which ingredients you need to avoid? This will help me suggest the perfect safe recipe for you.",
        "recipes": {
            "peanut": generateRecipeData(
                "Apple Slices with Sunflower Seed Butter", "Snack", "Healthy",
                "Slice an apple and serve with sunflower seed butter (SunButter is a popular brand).",
                "Peanut-Free,Nut-Free,Snack,Fruit",
                [{"ingredient": "Apple", "measure": "1"}, {"ingredient": "Sunflower Seed Butter", "measure": "2 tbsp"}],
                "5 mins"
            ),
            "shellfish": generateRecipeData(
                "Roasted Chicken with Root Vegetables", "Chicken", "Comfort Food",
                "Toss chicken pieces with chopped root vegetables (carrots, potatoes, parsnips), olive oil, and herbs. Roast until chicken is cooked through and vegetables are tender.",
                "Shellfish-Free,Chicken,ComfortFood",
                [{"ingredient": "Chicken Thighs or Breast", "measure": "1 lb"}, {"ingredient": "Carrots", "measure": "2 chopped"}, {"ingredient": "Potatoes", "measure": "2 chopped"}, {"ingredient": "Parsnips", "measure": "1 chopped"}, {"ingredient": "Olive Oil", "measure": "2 tbsp"}, {"ingredient": "Rosemary", "measure": "1 tsp dried"}, {"ingredient": "Thyme", "measure": "1 tsp dried"}],
                "50 mins"
            ),
            "nut": generateRecipeData(
                "Baked Chicken with Steamed Broccoli", "Chicken", "Simple",
                "Bake chicken breast seasoned with salt and pepper. Steam broccoli florets until tender-crisp. A simple, nut-free meal.",
                "Nut-Free,Chicken,Healthy,Simple",
                [{"ingredient": "Chicken Breast", "measure": "1 (6oz)"}, {"ingredient": "Broccoli Florets", "measure": "1.5 cups"}, {"ingredient": "Olive Oil", "measure": "1 tbsp"}, {"ingredient": "Salt", "measure": "to taste"}, {"ingredient": "Black Pepper", "measure": "to taste"}],
                "30 mins"
            ),
            "soy": generateRecipeData(
                "Beef Stir-fry with Rice Noodles (Soy-Free)", "Beef", "Asian",
                "Stir-fry sliced beef with bell peppers, snow peas, and carrots. Use a soy-free sauce alternative like tamari (if gluten-free) or coconut aminos. Serve with rice noodles.",
                "Soy-Free,Beef,Asian",
                [{"ingredient": "Beef Sirloin", "measure": "1/2 lb sliced"}, {"ingredient": "Bell Peppers", "measure": "1 sliced"}, {"ingredient": "Snow Peas", "measure": "1 cup"}, {"ingredient": "Carrots", "measure": "1 cup julienned"}, {"ingredient": "Coconut Aminos", "measure": "1/4 cup"}, {"ingredient": "Rice Noodles", "measure": "4 oz"}],
                "35 mins"
            ),
            "egg": generateRecipeData(
                "Tofu Scramble with Spinach", "Breakfast", "Vegan",
                "Crumble firm tofu and sauté with spinach, turmeric (for color), and black salt (kala namak for eggy flavor). Serve with toast (if not gluten-free).",
                "Egg-Free,Vegan,Breakfast",
                [{"ingredient": "Firm Tofu", "measure": "1 block (14 oz)"}, {"ingredient": "Fresh Spinach", "measure": "2 cups"}, {"ingredient": "Turmeric Powder", "measure": "1/2 tsp"}, {"ingredient": "Black Salt (Kala Namak)", "measure": "1/4 tsp"}, {"ingredient": "Nutritional Yeast (optional)", "measure": "1 tbsp"}],
                "20 mins"
            ),
        }
    },
    "general healthy": {
        "keywords": ["healthy", "nutritious", "balanced meal", "clean eating"],
        "clarification": "Great! To help me suggest the perfect healthy recipe, could you tell me if you have any specific dietary preferences (e.g., vegetarian, high protein, low fat) or cuisine types you enjoy?",
        "recipes": [
            generateRecipeData(
                "Chicken and Vegetable Soup", "Soup", "Comfort Food",
                "Dice chicken breast and various vegetables (carrots, celery, peas). Simmer in chicken broth with herbs until cooked through. A wholesome and comforting meal.",
                "Healthy,Comfort Food,Chicken,Soup",
                [{"ingredient": "Chicken Breast", "measure": "1 lb diced"}, {"ingredient": "Carrots", "measure": "1 cup chopped"}, {"ingredient": "Celery Stalks", "measure": "1 cup chopped"}, {"ingredient": "Frozen Peas", "measure": "1/2 cup"}, {"ingredient": "Chicken Broth", "measure": "6 cups"}, {"ingredient": "Bay Leaf", "measure": "1"}, {"ingredient": "Thyme", "measure": "1/2 tsp"}],
                "45 mins"
            ),
            generateRecipeData(
                "Sheet Pan Sausage and Veggies", "Dinner", "One-Pan",
                "Chop sausage (chicken/turkey for leaner) and sturdy vegetables like bell peppers, zucchini, and onions. Toss with olive oil and Italian seasoning. Roast on a sheet pan until tender and browned.",
                "Healthy,Easy,One-Pan,Dinner",
                [{"ingredient": "Chicken Sausage", "measure": "4 links, sliced"}, {"ingredient": "Bell Peppers", "measure": "2 chopped"}, {"ingredient": "Zucchini", "measure": "1 chopped"}, {"ingredient": "Red Onion", "measure": "1 chopped"}, {"ingredient": "Olive Oil", "measure": "2 tbsp"}, {"ingredient": "Italian Seasoning", "measure": "1 tbsp"}],
                "30 mins"
            ),
            generateRecipeData(
                "Caprese Salad with Balsamic Glaze", "Salad", "Italian",
                "Layer sliced fresh mozzarella, ripe tomatoes, and fresh basil leaves. Drizzle with balsamic glaze. Season with salt and pepper.",
                "Healthy,Vegetarian,Italian,Salad",
                [{"ingredient": "Fresh Mozzarella", "measure": "8 oz sliced"}, {"ingredient": "Ripe Tomatoes", "measure": "2 sliced"}, {"ingredient": "Fresh Basil Leaves", "measure": "1/2 cup"}, {"ingredient": "Balsamic Glaze", "measure": "2 tbsp"}, {"ingredient": "Salt", "measure": "to taste"}, {"ingredient": "Black Pepper", "measure": "to taste"}],
                "10 mins"
            ),
            generateRecipeData(
                "Turkey Chili (Bean-Free option)", "Chili", "American",
                "Brown ground turkey with diced onions and bell peppers. Add crushed tomatoes, chili powder, cumin, and broth. Simmer until flavors meld. (Optional: omit beans for lower carb)",
                "Healthy,High-Protein,ComfortFood,Turkey",
                [{"ingredient": "Ground Turkey", "measure": "1.5 lbs"}, {"ingredient": "Onion", "measure": "1 chopped"}, {"ingredient": "Bell Peppers", "measure": "1 chopped"}, {"ingredient": "Crushed Tomatoes", "measure": "1 (28 oz) can"}, {"ingredient": "Chicken Broth", "measure": "1 cup"}, {"ingredient": "Chili Powder", "measure": "2 tbsp"}, {"ingredient": "Cumin", "measure": "1 tbsp"}],
                "50 mins"
            ),
        ]
    }
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


// API Endpoint
app.post('/api/suggest-recipe', (req, res) => {
    const userPrompt = req.body.prompt ? req.body.prompt.toLowerCase() : '';

    if (!userPrompt) {
        return res.status(400).json({ error: "No prompt provided" });
    }

    const promptKeywords = new Set(userPrompt.split(/\s+/).filter(word => word.length > 2)); // Filter out short words

    let suggestedRecipe = null;
    let clarificationMessage = null;
    let matchedByCondition = false;

    // 1. Try to find a matching health condition/dietary need
    for (const conditionKey in healthConditionsData) {
        const conditionInfo = healthConditionsData[conditionKey];
        if (conditionInfo.keywords.some(keyword => promptKeywords.has(keyword))) {
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
                    suggestedRecipe = conditionInfo.recipes[foundAllergen][Math.floor(Math.random() * conditionInfo.recipes[foundAllergen].length)];
                    clarificationMessage = conditionInfo.clarification.replace("which ingredients you need to avoid?", `any other restrictions for ${foundAllergen} or cuisine preferences?`);
                } else {
                    clarificationMessage = conditionInfo.clarification;
                }
            } else {
                suggestedRecipe = conditionInfo.recipes[Math.floor(Math.random() * conditionInfo.recipes.length)];
                clarificationMessage = conditionInfo.clarification;
            }
            break; // Found a condition match, prioritize it
        }
    }

    // 2. If no specific health condition, try to match by ingredients
    if (!matchedByCondition) {
        // Extract potential ingredient keywords from the prompt (could be improved with NLP)
        const potentialIngredients = Array.from(promptKeywords);

        let bestIngredientMatchRecipe = null;
        let maxMatchedIngredients = 0;

        for (const recipe of allRecipesFlat) {
            const recipeIngredients = new Set(recipe.ingredients.map(item => item.ingredient.toLowerCase()));
            let currentMatchedIngredients = 0;

            for (const potentialIng of potentialIngredients) {
                if (recipeIngredients.has(potentialIng)) {
                    currentMatchedIngredients++;
                } else {
                    // Also check if any ingredient in the recipe contains the potential ingredient keyword
                    // This provides a partial match, e.g., 'chicken' matches 'Grilled Chicken Breast'
                    if (Array.from(recipeIngredients).some(rIng => rIng.includes(potentialIng))) {
                        currentMatchedIngredients++;
                    }
                }
            }

            if (currentMatchedIngredients > maxMatchedIngredients) {
                maxMatchedIngredients = currentMatchedIngredients;
                bestIngredientMatchRecipe = recipe;
            }
        }

        if (maxMatchedIngredients > 0) { // If at least one ingredient matched
            suggestedRecipe = bestIngredientMatchRecipe;
            clarificationMessage = "Based on the ingredients you mentioned, here's a recipe. Let me know if you have other dietary needs!";
        }
    }

    // 3. If still no specific match, suggest a general healthy recipe
    if (!suggestedRecipe) {
        const generalHealthyInfo = healthConditionsData["general healthy"];
        suggestedRecipe = generalHealthyInfo.recipes[Math.floor(Math.random() * generalHealthyInfo.recipes.length)];
        clarificationMessage = "I couldn't find a specific match for your request, but here's a general healthy suggestion. Could you clarify your needs or ingredients further?";
    }

    res.json({
        clarification: clarificationMessage,
        recipe: suggestedRecipe
    });
});

// For Vercel, listen on the port provided by the environment, or a default for local testing
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

// Export the app for Vercel serverless deployment
module.exports = app;
