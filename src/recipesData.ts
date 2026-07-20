import { Recipe } from './types';

export const RECIPES_DATABASE: Recipe[] = [
  // --- ITALIAN ---
  {
    id: 'it-1',
    title: 'Garlic Spinach Fettuccine',
    cuisine: 'Italian',
    type: 'zero-waste',
    prepTime: '5 min',
    cookTime: '12 min',
    calories: 420,
    macros: { protein: '14g', carbs: '68g', fat: '9g' },
    ingredientsNeeded: ['Pasta', 'Spinach', 'Garlic', 'Olive Oil'],
    hologramColor: '#00f0ff',
    hologramDesign: 'concentric',
    steps: [
      { text: 'Bring a pot of salted water to boil. Cook pasta until al dente.', duration: '8 mins', temp: 'High Heat' },
      { text: 'In a pan, gently warm olive oil and sauté minced garlic until fragrant.', duration: '2 mins', temp: 'Medium-Low' },
      { text: 'Add fresh spinach, tossing until wilted and seasoned with a pinch of salt.', duration: '2 mins', temp: 'Medium' },
      { text: 'Drain pasta and toss immediately in the garlic oil with spinach.', duration: '1 min', temp: 'Off Heat' }
    ]
  },
  {
    id: 'it-2',
    title: 'Tuscan Spinach Egg Scramble',
    cuisine: 'Italian',
    type: 'zero-waste',
    prepTime: '4 min',
    cookTime: '6 min',
    calories: 280,
    macros: { protein: '18g', carbs: '6g', fat: '20g' },
    ingredientsNeeded: ['Eggs', 'Tomato', 'Spinach', 'Olive Oil', 'Garlic'],
    hologramColor: '#ff007f',
    hologramDesign: 'nodes',
    steps: [
      { text: 'Sauté chopped tomatoes and minced garlic in olive oil until softened.', duration: '3 mins', temp: 'Medium' },
      { text: 'Add spinach and let it wilt completely.', duration: '1 min', temp: 'Medium' },
      { text: 'Whisk eggs, pour into the pan, and fold gently until warm and fluffy.', duration: '2 mins', temp: 'Low Heat' }
    ]
  },
  {
    id: 'it-3',
    title: 'Truffle & Parmesan Chicken Penne',
    cuisine: 'Italian',
    type: 'upgrade',
    missingIngredient: 'Parmesan Cheese',
    prepTime: '10 min',
    cookTime: '15 min',
    calories: 590,
    macros: { protein: '38g', carbs: '62g', fat: '18g' },
    ingredientsNeeded: ['Chicken Breast', 'Pasta', 'Garlic', 'Olive Oil', 'Spinach', 'Parmesan Cheese'],
    hologramColor: '#39ff14',
    hologramDesign: 'layers',
    steps: [
      { text: 'Sear chicken breast cubes in olive oil with minced garlic until golden brown and cooked through.', duration: '7 mins', temp: 'Medium-High' },
      { text: 'Boil pasta and reserve 1/4 cup of the starchy cooking water.', duration: '8 mins', temp: 'High' },
      { text: 'Toss chicken, pasta, fresh spinach, and the starchy water in the pan.', duration: '2 mins', temp: 'Medium' },
      { text: 'Grate freshly scanned premium Parmesan Cheese generously over the hot pasta to form a glossy sauce.', duration: '1 min', temp: 'Off Heat' }
    ]
  },

  // --- VIETNAMESE ---
  {
    id: 'vn-1',
    title: 'Sautéed Ginger Spinach with Steamed Rice',
    cuisine: 'Vietnamese',
    type: 'zero-waste',
    prepTime: '5 min',
    cookTime: '10 min',
    calories: 310,
    macros: { protein: '6g', carbs: '64g', fat: '4g' },
    ingredientsNeeded: ['Rice', 'Spinach', 'Garlic', 'Soy Sauce'],
    hologramColor: '#00f0ff',
    hologramDesign: 'spiral',
    steps: [
      { text: 'Rinse rice and cook in your steamer or pot until fluffy.', duration: '15 mins', temp: 'Simmer' },
      { text: 'Sauté minced garlic in a hot wok with oil until slightly brown.', duration: '1 min', temp: 'High' },
      { text: 'Add spinach, splash soy sauce, and stir-fry rapidly.', duration: '2 mins', temp: 'High' },
      { text: 'Serve hot stir-fry alongside a perfect dome of steamed white rice.', duration: '1 min', temp: 'Off Heat' }
    ]
  },
  {
    id: 'vn-2',
    title: 'Vietnamese Soft-Scrambled Tomatoes',
    cuisine: 'Vietnamese',
    type: 'zero-waste',
    prepTime: '5 min',
    cookTime: '8 min',
    calories: 240,
    macros: { protein: '13g', carbs: '12g', fat: '16g' },
    ingredientsNeeded: ['Eggs', 'Tomato', 'Garlic', 'Soy Sauce'],
    hologramColor: '#ff007f',
    hologramDesign: 'nodes',
    steps: [
      { text: 'Sauté chopped tomatoes with garlic and a splash of soy sauce until a rich gravy forms.', duration: '4 mins', temp: 'Medium' },
      { text: 'Whisk eggs and slowly pour them in. Let them set slightly.', duration: '1 min', temp: 'Medium-Low' },
      { text: 'Stir gently to create large, delicate ribbons of tomato-infused egg.', duration: '2 mins', temp: 'Low Heat' }
    ]
  },
  {
    id: 'vn-3',
    title: 'Lemongrass Gochujang Salmon Bowl',
    cuisine: 'Vietnamese',
    type: 'upgrade',
    missingIngredient: 'Gochujang Paste',
    prepTime: '8 min',
    cookTime: '12 min',
    calories: 520,
    macros: { protein: '34g', carbs: '55g', fat: '19g' },
    ingredientsNeeded: ['Salmon', 'Rice', 'Garlic', 'Soy Sauce', 'Spinach', 'Gochujang Paste'],
    hologramColor: '#39ff14',
    hologramDesign: 'layers',
    steps: [
      { text: 'Pan-sear salmon skin-side down until crispy, then flip.', duration: '8 mins', temp: 'Medium' },
      { text: 'Glaze salmon with a spicy mix of Gochujang Paste, soy sauce, and minced garlic.', duration: '2 mins', temp: 'Low' },
      { text: 'Wilt spinach in the same pan to pick up the residual glaze.', duration: '1 min', temp: 'Medium' },
      { text: 'Assemble bowl with steamed rice, wilted greens, and the glazed salmon.', duration: '1 min', temp: 'Off Heat' }
    ]
  },

  // --- ASIAN ---
  {
    id: 'as-1',
    title: 'Garlic Egg Fried Rice',
    cuisine: 'Asian',
    type: 'zero-waste',
    prepTime: '5 min',
    cookTime: '7 min',
    calories: 390,
    macros: { protein: '12g', carbs: '62g', fat: '10g' },
    ingredientsNeeded: ['Rice', 'Eggs', 'Garlic', 'Soy Sauce'],
    hologramColor: '#00f0ff',
    hologramDesign: 'concentric',
    steps: [
      { text: 'Heat oil in a wok. Fry minced garlic until golden and aromatic.', duration: '1 min', temp: 'High Heat' },
      { text: 'Crack eggs directly into wok and scramble until almost dry.', duration: '1 min', temp: 'High Heat' },
      { text: 'Add pre-cooked cold rice, tossing vigorously to break up clumps.', duration: '3 mins', temp: 'High Heat' },
      { text: 'Drizzle soy sauce around the sides of the wok and toss for wok-hei smoke.', duration: '2 mins', temp: 'High Heat' }
    ]
  },
  {
    id: 'as-2',
    title: 'Soy-Garlic Glazed Crispy Salmon',
    cuisine: 'Asian',
    type: 'zero-waste',
    prepTime: '6 min',
    cookTime: '10 min',
    calories: 440,
    macros: { protein: '32g', carbs: '14g', fat: '28g' },
    ingredientsNeeded: ['Salmon', 'Garlic', 'Soy Sauce', 'Spinach', 'Olive Oil'],
    hologramColor: '#ff007f',
    hologramDesign: 'nodes',
    steps: [
      { text: 'Sear seasoned salmon fillets in olive oil until skin is deeply crispy.', duration: '5 mins', temp: 'Medium-High' },
      { text: 'Add minced garlic and a reduction of soy sauce with a teaspoon of oil to glaze.', duration: '2 mins', temp: 'Low Heat' },
      { text: 'Remove salmon; toss spinach into hot pan to absorb garlic-soy glaze.', duration: '2 mins', temp: 'Medium' }
    ]
  },
  {
    id: 'as-3',
    title: 'Korean Gochujang Glazed Chicken Bowl',
    cuisine: 'Asian',
    type: 'upgrade',
    missingIngredient: 'Gochujang Paste',
    prepTime: '8 min',
    cookTime: '12 min',
    calories: 510,
    macros: { protein: '36g', carbs: '58g', fat: '14g' },
    ingredientsNeeded: ['Chicken Breast', 'Rice', 'Soy Sauce', 'Garlic', 'Gochujang Paste', 'Spinach'],
    hologramColor: '#39ff14',
    hologramDesign: 'spiral',
    steps: [
      { text: 'Cook rice and set aside.', duration: '15 mins', temp: 'Low Heat' },
      { text: 'Sauté cubed chicken breast and garlic in a pan until thoroughly cooked.', duration: '6 mins', temp: 'Medium-High' },
      { text: 'Stir in 1 tbsp Gochujang Paste, soy sauce, and a splash of water to form a sticky crimson glaze.', duration: '3 mins', temp: 'Medium' },
      { text: 'Serve chicken over rice with a ring of quick-steamed spinach.', duration: '1 min', temp: 'Off Heat' }
    ]
  },

  // --- HEALTHY ---
  {
    id: 'he-1',
    title: 'Poached Eggs over Wilted Garlic Greens',
    cuisine: 'Healthy',
    type: 'zero-waste',
    prepTime: '5 min',
    cookTime: '6 min',
    calories: 210,
    macros: { protein: '14g', carbs: '4g', fat: '15g' },
    ingredientsNeeded: ['Eggs', 'Spinach', 'Garlic', 'Olive Oil'],
    hologramColor: '#39ff14',
    hologramDesign: 'nodes',
    steps: [
      { text: 'Sauté garlic in a drizzle of olive oil, then add spinach and wilt gently.', duration: '3 mins', temp: 'Low Heat' },
      { text: 'Bring water with a splash of vinegar to a bare simmer. Poach eggs until whites are set but yolks remain runny.', duration: '3 mins', temp: 'Simmer' },
      { text: 'Layer poached eggs atop the bed of warm garlic spinach and crack fresh black pepper.', duration: '1 min', temp: 'Off Heat' }
    ]
  },
  {
    id: 'he-2',
    title: 'Seared Tomato & Salmon Warm Salad',
    cuisine: 'Healthy',
    type: 'zero-waste',
    prepTime: '5 min',
    cookTime: '10 min',
    calories: 390,
    macros: { protein: '29g', carbs: '8g', fat: '27g' },
    ingredientsNeeded: ['Salmon', 'Tomato', 'Spinach', 'Olive Oil'],
    hologramColor: '#00f0ff',
    hologramDesign: 'concentric',
    steps: [
      { text: 'Rub salmon with sea salt and sear in olive oil.', duration: '4 mins per side', temp: 'Medium' },
      { text: 'In the final minutes, throw halved cherry tomatoes into the pan to blister them.', duration: '3 mins', temp: 'Medium' },
      { text: 'Place fresh raw spinach in a plate, top with hot blistered tomatoes, warm juices, and the seared salmon.', duration: '1 min', temp: 'Off Heat' }
    ]
  },
  {
    id: 'he-3',
    title: 'Zesty Parmesan-Crusted Baked Salmon',
    cuisine: 'Healthy',
    type: 'upgrade',
    missingIngredient: 'Parmesan Cheese',
    prepTime: '6 min',
    cookTime: '14 min',
    calories: 460,
    macros: { protein: '34g', carbs: '6g', fat: '32g' },
    ingredientsNeeded: ['Salmon', 'Spinach', 'Olive Oil', 'Garlic', 'Parmesan Cheese'],
    hologramColor: '#ff007f',
    hologramDesign: 'layers',
    steps: [
      { text: 'Preheat oven or airfryer to 400°F (204°C).', duration: '5 mins', temp: 'Preheat' },
      { text: 'Top salmon filet with a mixture of grated Parmesan Cheese, minced garlic, and a drop of olive oil.', duration: '2 mins', temp: 'Prep' },
      { text: 'Bake salmon until the Parmesan forms a sizzling golden-brown crust.', duration: '12 mins', temp: 'High Heat' },
      { text: 'Serve with a clean, low-fat side of garlic spinach.', duration: '2 mins', temp: 'Medium' }
    ]
  },

  // --- US ---
  {
    id: 'us-1',
    title: 'Classic Sunny Eggs & Garlic Sauté',
    cuisine: 'US',
    type: 'zero-waste',
    prepTime: '3 min',
    cookTime: '5 min',
    calories: 220,
    macros: { protein: '13g', carbs: '3g', fat: '17g' },
    ingredientsNeeded: ['Eggs', 'Garlic', 'Spinach', 'Olive Oil'],
    hologramColor: '#00f0ff',
    hologramDesign: 'concentric',
    steps: [
      { text: 'Fry minced garlic in olive oil, then toss spinach until fully wilted.', duration: '2 mins', temp: 'Medium' },
      { text: 'In a separate non-stick pan, fry eggs sunny-side up until whites are cooked but yolks are fluid.', duration: '3 mins', temp: 'Medium-Low' },
      { text: 'Plate the fried eggs adjacent to the garlic spinach bed.', duration: '1 min', temp: 'Off Heat' }
    ]
  },
  {
    id: 'us-2',
    title: 'Simple Rice & Egg Skillet Fry',
    cuisine: 'US',
    type: 'zero-waste',
    prepTime: '4 min',
    cookTime: '8 min',
    calories: 350,
    macros: { protein: '11g', carbs: '50g', fat: '11g' },
    ingredientsNeeded: ['Rice', 'Eggs', 'Tomato', 'Olive Oil'],
    hologramColor: '#ff007f',
    hologramDesign: 'spiral',
    steps: [
      { text: 'Warm cooked rice in a pan with olive oil.', duration: '2 mins', temp: 'Medium' },
      { text: 'Push rice to the side, scramble eggs in the empty space, then combine.', duration: '3 mins', temp: 'Medium' },
      { text: 'Toss chopped tomatoes into the mixture until warm and slightly cooked.', duration: '3 mins', temp: 'Medium' }
    ]
  },
  {
    id: 'us-3',
    title: 'Parmesan Crisped Chicken Breast & Veggies',
    cuisine: 'US',
    type: 'upgrade',
    missingIngredient: 'Parmesan Cheese',
    prepTime: '8 min',
    cookTime: '14 min',
    calories: 510,
    macros: { protein: '42g', carbs: '12g', fat: '20g' },
    ingredientsNeeded: ['Chicken Breast', 'Spinach', 'Tomato', 'Garlic', 'Olive Oil', 'Parmesan Cheese'],
    hologramColor: '#39ff14',
    hologramDesign: 'layers',
    steps: [
      { text: 'Slice chicken breast into thin cutlets. Season with salt, pepper, and garlic.', duration: '3 mins', temp: 'Prep' },
      { text: 'Dredge chicken cutlets in finely grated Parmesan Cheese, pressing down so it adheres.', duration: '2 mins', temp: 'Prep' },
      { text: 'Pan-fry chicken in olive oil on medium heat until the Parmesan creates a rich, crispy golden jacket.', duration: '8 mins', temp: 'Medium' },
      { text: 'Serve next to a light, warm garlic-spinach and blistered tomato salad.', duration: '2 mins', temp: 'Off Heat' }
    ]
  },

  // --- FAST FOOD ---
  {
    id: 'ff-1',
    title: 'Quick Garlic Bread & Wilted Greens',
    cuisine: 'Fast Food',
    type: 'zero-waste',
    prepTime: '3 min',
    cookTime: '6 min',
    calories: 340,
    macros: { protein: '8g', carbs: '46g', fat: '14g' },
    ingredientsNeeded: ['Pasta', 'Garlic', 'Olive Oil', 'Spinach'],
    hologramColor: '#ff007f',
    hologramDesign: 'nodes',
    steps: [
      { text: 'Toast cooked pasta or rice in garlic-infused oil to create crispy textures.', duration: '4 mins', temp: 'Medium-High' },
      { text: 'Flash-wilt spinach in the same skillet for quick dietary fiber.', duration: '2 mins', temp: 'High' }
    ]
  },
  {
    id: 'ff-2',
    title: 'Quick Tomato Egg Fried Rice',
    cuisine: 'Fast Food',
    type: 'zero-waste',
    prepTime: '2 min',
    cookTime: '6 min',
    calories: 410,
    macros: { protein: '12g', carbs: '64g', fat: '12g' },
    ingredientsNeeded: ['Rice', 'Eggs', 'Tomato', 'Soy Sauce'],
    hologramColor: '#00f0ff',
    hologramDesign: 'concentric',
    steps: [
      { text: 'Sauté chopped tomatoes in oil on super high heat until juicy.', duration: '2 mins', temp: 'High' },
      { text: 'Pour beaten eggs, let them puff, then throw in rice and soy sauce.', duration: '3 mins', temp: 'High' },
      { text: 'Toss vigorously until dry, savory, and fully steamed.', duration: '1 min', temp: 'High' }
    ]
  },
  {
    id: 'ff-3',
    title: 'Cheesy Garlic Parmesan Chicken Melt',
    cuisine: 'Fast Food',
    type: 'upgrade',
    missingIngredient: 'Parmesan Cheese',
    prepTime: '5 min',
    cookTime: '10 min',
    calories: 540,
    macros: { protein: '44g', carbs: '14g', fat: '24g' },
    ingredientsNeeded: ['Chicken Breast', 'Tomato', 'Garlic', 'Olive Oil', 'Parmesan Cheese'],
    hologramColor: '#39ff14',
    hologramDesign: 'layers',
    steps: [
      { text: 'Pan-sear chicken strips in oil with chopped garlic.', duration: '6 mins', temp: 'High' },
      { text: 'Top chicken with fresh tomato slices and a heavy carpet of Parmesan Cheese.', duration: '1 min', temp: 'Medium' },
      { text: 'Cover the skillet with a lid so the steam melts the Parmesan into a bubbling cheesy shroud.', duration: '3 mins', temp: 'Low' }
    ]
  },

  // --- BREAKFAST ---
  {
    id: 'bf-1',
    title: 'Spinach & Garlic Egg White Frittata',
    cuisine: 'Breakfast',
    type: 'zero-waste',
    prepTime: '4 min',
    cookTime: '7 min',
    calories: 190,
    macros: { protein: '15g', carbs: '4g', fat: '12g' },
    ingredientsNeeded: ['Eggs', 'Spinach', 'Garlic', 'Olive Oil'],
    hologramColor: '#39ff14',
    hologramDesign: 'concentric',
    steps: [
      { text: 'Whisk eggs with a small pinch of salt and pepper.', duration: '1 min', temp: 'Prep' },
      { text: 'Sauté garlic and spinach in a skillet until fully wilted.', duration: '2 mins', temp: 'Medium' },
      { text: 'Pour in the whisked eggs, cover, and let set over low heat into a fluffy pancake shape.', duration: '4 mins', temp: 'Low' }
    ]
  },
  {
    id: 'bf-2',
    title: 'Garlic Butter Fried Rice & Sunny Egg',
    cuisine: 'Breakfast',
    type: 'zero-waste',
    prepTime: '5 min',
    cookTime: '8 min',
    calories: 380,
    macros: { protein: '11g', carbs: '58g', fat: '11g' },
    ingredientsNeeded: ['Rice', 'Eggs', 'Garlic', 'Soy Sauce', 'Olive Oil'],
    hologramColor: '#00f0ff',
    hologramDesign: 'spiral',
    steps: [
      { text: 'Sauté heaps of garlic in olive oil until golden brown.', duration: '2 mins', temp: 'Medium' },
      { text: 'Toss rice and soy sauce in, cooking until fragrant and crispy.', duration: '4 mins', temp: 'High' },
      { text: 'Fry an egg sunny side up on the side and slide it on top of the rice.', duration: '2 mins', temp: 'Medium' }
    ]
  },
  {
    id: 'bf-3',
    title: 'Crispy Toast with Parmesan Fried Egg',
    cuisine: 'Breakfast',
    type: 'upgrade',
    missingIngredient: 'Parmesan Cheese',
    prepTime: '4 min',
    cookTime: '6 min',
    calories: 340,
    macros: { protein: '16g', carbs: '28g', fat: '18g' },
    ingredientsNeeded: ['Eggs', 'Garlic', 'Olive Oil', 'Parmesan Cheese', 'Spinach'],
    hologramColor: '#ff007f',
    hologramDesign: 'nodes',
    steps: [
      { text: 'Scatter grated Parmesan Cheese in a circular shape directly on a cold nonstick skillet.', duration: '1 min', temp: 'Prep' },
      { text: 'Turn heat to medium, crack egg directly in the center of the melting cheese ring.', duration: '3 mins', temp: 'Medium' },
      { text: 'The cheese will fry into a gorgeous lace-like crispy disk beneath the egg.', duration: '2 mins', temp: 'Medium' },
      { text: 'Serve over wilted greens and garlic.', duration: '1 min', temp: 'Off Heat' }
    ]
  },

  // --- LIGHT SNACK ---
  {
    id: 'ls-1',
    title: 'Sautéed Garlic Greens Cups',
    cuisine: 'Light Snack',
    type: 'zero-waste',
    prepTime: '3 min',
    cookTime: '4 min',
    calories: 120,
    macros: { protein: '4g', carbs: '5g', fat: '9g' },
    ingredientsNeeded: ['Spinach', 'Garlic', 'Olive Oil'],
    hologramColor: '#00f0ff',
    hologramDesign: 'spiral',
    steps: [
      { text: 'Mince garlic finely.', duration: '1 min', temp: 'Prep' },
      { text: 'Sauté in hot olive oil until sweet and fragrant.', duration: '1 min', temp: 'Medium-High' },
      { text: 'Add spinach, season with sea salt, and collapse instantly under heat.', duration: '2 mins', temp: 'High' }
    ]
  },
  {
    id: 'ls-2',
    title: 'Tomato and Hard-Boiled Egg Bites',
    cuisine: 'Light Snack',
    type: 'zero-waste',
    prepTime: '5 min',
    cookTime: '5 min',
    calories: 160,
    macros: { protein: '11g', carbs: '4g', fat: '10g' },
    ingredientsNeeded: ['Eggs', 'Tomato', 'Olive Oil'],
    hologramColor: '#ff007f',
    hologramDesign: 'concentric',
    steps: [
      { text: 'Boil eggs to medium-hard consistency.', duration: '6 mins', temp: 'High' },
      { text: 'Slice tomato and boiled eggs into bite-sized medallions.', duration: '2 mins', temp: 'Prep' },
      { text: 'Arrange on a saucer, drizzle with raw cold olive oil, flaky salt and ground pepper.', duration: '1 min', temp: 'Off Heat' }
    ]
  },
  {
    id: 'ls-3',
    title: 'Crisp Rice Squares with Spicy Gochujang',
    cuisine: 'Light Snack',
    type: 'upgrade',
    missingIngredient: 'Gochujang Paste',
    prepTime: '6 min',
    cookTime: '8 min',
    calories: 260,
    macros: { protein: '5g', carbs: '38g', fat: '10g' },
    ingredientsNeeded: ['Rice', 'Garlic', 'Olive Oil', 'Gochujang Paste'],
    hologramColor: '#39ff14',
    hologramDesign: 'nodes',
    steps: [
      { text: 'Press cooked rice into flat, compact squares.', duration: '3 mins', temp: 'Prep' },
      { text: 'Pan-fry in olive oil with garlic until a crunchy golden skin forms on both sides.', duration: '4 mins', temp: 'Medium-High' },
      { text: 'Drizzle a thin, fiery reduction of Gochujang Paste with warm water and oil over the squares.', duration: '1 min', temp: 'Low' }
    ]
  }
];

// List of scanning items that are available pre-populated
export const FRIDGE_PREPOPULATED: { name: string; quantity: string; icon: string }[] = [
  { name: 'Eggs', quantity: '4 pieces', icon: '🥚' },
  { name: 'Spinach', quantity: '150g fresh', icon: '🥬' },
  { name: 'Chicken Breast', quantity: '350g fresh', icon: '🍗' },
  { name: 'Salmon', quantity: '2 fillets', icon: '🐟' },
  { name: 'Tomato', quantity: '2 ripe', icon: '🍅' }
];

export const PANTRY_PREPOPULATED: { name: string; quantity: string; icon: string }[] = [
  { name: 'Pasta', quantity: '500g Penne', icon: '🍝' },
  { name: 'Rice', quantity: '1kg Jasmine', icon: '🌾' },
  { name: 'Soy Sauce', quantity: '250ml', icon: '🍾' },
  { name: 'Olive Oil', quantity: '500ml EVOO', icon: '🫒' },
  { name: 'Garlic', quantity: '1 bulb', icon: '🧄' }
];
