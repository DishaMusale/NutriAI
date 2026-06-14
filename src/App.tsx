import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, Lock, Mail, Printer, RefreshCcw, ShieldCheck, Sparkles, Zap,
  CheckCircle2, Download, X, Plus, Flame, Trophy, Moon, Sun,
  ChevronLeft, ChevronRight, BookOpen, Clock, AlertCircle
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import AnalyticsChart from './components/AnalyticsChart';
import DashboardCard from './components/DashboardCard';
import MealCard from './components/MealCard';
import Navbar from './components/Navbar';
import ShoppingList from './components/ShoppingList';
import Sidebar from './components/Sidebar';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Profile {
  name: string; age: string; gender: string; height: string; weight: string;
  goal: string; preference: string; cuisine: string; allergies: string[];
  cookingTime: string; activity: string; medicalConditions: string[];
  mealsPerDay: string; budget: string; foodsToAvoid: string;
}

interface ShoppingItemType { name: string; checked: boolean; qty: number; unit: string; }
interface ShoppingCategoryType { title: string; aisle: string; items: ShoppingItemType[]; }

// ─── Constants ────────────────────────────────────────────────────────────────
const steps = [
  { title: 'Personal Info' }, { title: 'Fitness Goals' },
  { title: 'Dietary Preferences' }, { title: 'Allergies' },
  { title: 'Budget' }, { title: 'Health' }
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const weeklyMealPlan: Record<string, { label: string; description: string; calories: number; protein: number; carbs: number; fat: number; recipe: { ingredients: string[]; steps: string[]; time: string } }[]> = {
  Monday: [
    { label: 'Breakfast', description: 'Poha with peanuts & veggies', calories: 350, protein: 10, carbs: 58, fat: 9,
      recipe: { time: '15 min', ingredients: ['2 cups flattened rice (poha)', '2 tbsp peanuts', '1 onion', '1 tsp mustard seeds', '½ tsp turmeric', 'Curry leaves', 'Salt to taste', 'Lemon juice'], steps: ['Rinse poha, drain and keep aside for 5 min', 'Heat oil, add mustard seeds until they splutter', 'Add curry leaves, onion, sauté until golden', 'Add peanuts, roast for 2 min', 'Add turmeric, mix in poha', 'Season with salt and lemon juice, serve hot'] } },
    { label: 'Lunch', description: 'Dal tadka with jeera rice', calories: 520, protein: 22, carbs: 78, fat: 12,
      recipe: { time: '30 min', ingredients: ['1 cup toor dal', '2 cups rice', '1 tomato', '1 onion', '2 garlic cloves', 'Ghee', 'Cumin seeds', 'Red chilli', 'Coriander'], steps: ['Pressure cook dal with turmeric for 3 whistles', 'In a pan, heat ghee, add cumin, garlic, chilli', 'Add tomato, cook until mushy', 'Mix tadka into dal, simmer 5 min', 'Cook jeera rice separately', 'Garnish with coriander and serve'] } },
    { label: 'Dinner', description: 'Paneer bhurji with whole wheat roti', calories: 480, protein: 24, carbs: 52, fat: 18,
      recipe: { time: '20 min', ingredients: ['200g paneer', '2 onions', '2 tomatoes', '1 capsicum', '1 tsp cumin', '1 tsp garam masala', 'Salt', 'Whole wheat flour for roti'], steps: ['Heat oil, add cumin, sauté onions until golden', 'Add tomatoes and capsicum, cook 5 min', 'Crumble paneer in, mix well', 'Add spices, cook 3 min', 'Knead dough for roti, roll and cook on tawa', 'Serve bhurji with hot rotis'] } }
  ],
  Tuesday: [
    { label: 'Breakfast', description: 'Oats upma with mixed vegetables', calories: 320, protein: 8, carbs: 52, fat: 7,
      recipe: { time: '15 min', ingredients: ['1 cup rolled oats', '½ cup mixed veg', '1 onion', 'Mustard seeds', 'Curry leaves', 'Green chilli', 'Salt'], steps: ['Dry roast oats until golden, set aside', 'Heat oil, add mustard seeds, curry leaves', 'Sauté onion and chilli', 'Add vegetables, cook 3 min', 'Add oats + 1.5 cups water', 'Stir continuously until thick, serve hot'] } },
    { label: 'Lunch', description: 'Rajma chawal with onion salad', calories: 580, protein: 20, carbs: 88, fat: 10,
      recipe: { time: '40 min', ingredients: ['1 cup kidney beans (soaked overnight)', '2 cups basmati rice', '2 tomatoes', '2 onions', 'Ginger garlic paste', 'Rajma masala', 'Cream optional'], steps: ['Pressure cook kidney beans for 5 whistles', 'Make thick gravy with onion-tomato-spices', 'Add cooked beans, simmer 15 min', 'Cook rice separately with bay leaf', 'Prepare onion salad with lemon', 'Serve hot with papad'] } },
    { label: 'Dinner', description: 'Vegetable khichdi with curd', calories: 420, protein: 16, carbs: 68, fat: 8,
      recipe: { time: '25 min', ingredients: ['½ cup rice', '½ cup moong dal', '1 carrot', '1 cup peas', 'Ghee', 'Cumin', 'Asafoetida', 'Turmeric', 'Curd'], steps: ['Wash and soak rice & dal for 20 min', 'Heat ghee, add cumin and asafoetida', 'Add vegetables, sauté briefly', 'Add rice-dal, water (3:1), turmeric', 'Pressure cook 3 whistles', 'Temper with ghee, serve with curd'] } }
  ],
  Wednesday: [
    { label: 'Breakfast', description: 'Idli with sambar and green chutney', calories: 380, protein: 12, carbs: 64, fat: 6,
      recipe: { time: '20 min (with ready batter)', ingredients: ['Idli batter', 'Toor dal', 'Mixed veg for sambar', 'Tamarind', 'Sambar powder', 'Fresh coriander + coconut for chutney'], steps: ['Steam idlis for 12 min in idli mould', 'Cook sambar: dal + tamarind + veg + sambar powder', 'Blend chutney with coconut, coriander, chilli', 'Temper sambar with mustard and curry leaves', 'Arrange idlis, pour sambar, serve with chutney'] } },
    { label: 'Lunch', description: 'Aloo gobi sabzi with roti & raita', calories: 490, protein: 14, carbs: 72, fat: 14,
      recipe: { time: '25 min', ingredients: ['2 potatoes', '½ cauliflower', '2 tomatoes', '1 tsp cumin', 'Coriander powder', 'Turmeric', 'Amchur', 'Curd for raita'], steps: ['Heat oil, add cumin, then onion-tomato masala', 'Add parboiled potato and cauliflower', 'Spice with coriander, turmeric, amchur', 'Cover and cook until tender', 'Whisk curd with cucumber and mint for raita', 'Serve with fresh rotis'] } },
    { label: 'Dinner', description: 'Moong dal chilla with mint chutney', calories: 360, protein: 18, carbs: 44, fat: 10,
      recipe: { time: '20 min', ingredients: ['1 cup moong dal (soaked 4 hrs)', 'Ginger', 'Green chilli', 'Cumin', 'Salt', 'Mint leaves', 'Coriander', 'Lemon for chutney'], steps: ['Blend soaked dal with ginger, chilli, cumin', 'Make thin batter consistency', 'Pour on hot greased tawa, spread thin', 'Cook until edges crisp, flip and cook', 'Blend mint, coriander, lemon for chutney', 'Serve chillas hot with chutney'] } }
  ],
  Thursday: [
    { label: 'Breakfast', description: 'Sprouts salad with lemon & chaat masala', calories: 280, protein: 14, carbs: 38, fat: 4,
      recipe: { time: '10 min', ingredients: ['1 cup mixed sprouts', '1 tomato', '1 cucumber', '1 onion', 'Chaat masala', 'Lemon juice', 'Coriander leaves', 'Optional: pomegranate seeds'], steps: ['Rinse and steam sprouts lightly (optional)', 'Dice tomato, cucumber, onion fine', 'Mix all in a bowl', 'Add chaat masala, lemon juice', 'Garnish with coriander and pomegranate', 'Serve immediately'] } },
    { label: 'Lunch', description: 'Chole bhature (1 portion) with salad', calories: 620, protein: 18, carbs: 86, fat: 20,
      recipe: { time: '45 min', ingredients: ['1 cup chickpeas (soaked overnight)', '2 onions', '3 tomatoes', 'Chole masala', 'Maida + curd for bhatura', 'Ginger garlic paste'], steps: ['Pressure cook chickpeas 6 whistles', 'Brown onions, add ginger-garlic, tomatoes', 'Add chole masala, cook until oil separates', 'Mix chickpeas, simmer 20 min', 'Knead bhatura dough with maida, curd, salt', 'Deep fry bhaturas, serve with chole & onions'] } },
    { label: 'Dinner', description: 'Palak soup with multigrain bread', calories: 290, protein: 10, carbs: 34, fat: 8,
      recipe: { time: '20 min', ingredients: ['2 bunches spinach', '1 onion', '3 garlic cloves', '½ cup milk or cream', 'Black pepper', 'Nutmeg', 'Multigrain bread slices'], steps: ['Blanch spinach in boiling water 2 min, shock in ice water', 'Sauté onion and garlic in butter', 'Blend spinach with onion-garlic smooth', 'Return to pan, add milk, season', 'Simmer 5 min, add pepper and nutmeg', 'Toast bread, serve with soup'] } }
  ],
  Friday: [
    { label: 'Breakfast', description: 'Banana & peanut butter smoothie bowl', calories: 410, protein: 16, carbs: 56, fat: 14,
      recipe: { time: '10 min', ingredients: ['2 ripe bananas', '2 tbsp peanut butter', '1 cup Greek yogurt', 'Granola', 'Chia seeds', 'Honey', 'Mixed berries'], steps: ['Blend 1.5 bananas with peanut butter and yogurt', 'Pour into a bowl (thicker than a drink)', 'Top with granola, chia seeds', 'Slice remaining banana on top', 'Drizzle honey, add berries', 'Serve immediately'] } },
    { label: 'Lunch', description: 'Mixed veg pulao with raita & papad', calories: 510, protein: 12, carbs: 80, fat: 12,
      recipe: { time: '30 min', ingredients: ['2 cups basmati rice', '1 cup mixed vegetables', 'Whole spices (bay leaf, cardamom, clove)', 'Fried onions', 'Mint leaves', 'Saffron (optional)', 'Curd for raita'], steps: ['Wash and soak rice 20 min', 'Fry onions until golden and crisp', 'Sauté veg with whole spices', 'Add rice, water (1:1.75), salt', 'Cook covered on low heat 15 min', 'Fluff with fork, garnish with mint and fried onions'] } },
    { label: 'Dinner', description: 'Tofu bhurji with quinoa', calories: 440, protein: 26, carbs: 46, fat: 16,
      recipe: { time: '25 min', ingredients: ['250g firm tofu', '1 cup quinoa', '2 onions', '2 tomatoes', '1 capsicum', 'Cumin', 'Garam masala', 'Kasuri methi'], steps: ['Rinse quinoa, cook in 2 cups water until absorbed', 'Press tofu dry, crumble into pieces', 'Sauté onion until golden, add ginger-garlic', 'Add tomato, capsicum, cook until soft', 'Add tofu crumbles, all spices', 'Finish with kasuri methi, serve over quinoa'] } }
  ],
  Saturday: [
    { label: 'Breakfast', description: 'Methi paratha with curd and pickle', calories: 420, protein: 12, carbs: 60, fat: 14,
      recipe: { time: '25 min', ingredients: ['2 cups whole wheat flour', '1 cup fresh fenugreek leaves', 'Ajwain', 'Red chilli', 'Garam masala', 'Oil', 'Curd', 'Pickle'], steps: ['Mix flour, washed methi leaves, ajwain, spices', 'Add water, knead soft dough', 'Divide into balls, roll thin parathas', 'Cook on hot tawa with ghee both sides', 'Serve hot with cold curd', 'Add pickle on the side'] } },
    { label: 'Lunch', description: 'Kadhi pakoda with steamed rice', calories: 540, protein: 14, carbs: 76, fat: 18,
      recipe: { time: '40 min', ingredients: ['1 cup besan', '2 cups curd', '½ cup spinach for pakodas', 'Mustard seeds', 'Curry leaves', 'Red chilli', 'Turmeric', 'Steamed rice'], steps: ['Make thin batter from curd + besan + spices', 'Cook kadhi on low heat 20 min until thick', 'Prepare pakoda batter, add spinach', 'Deep fry small pakodas', 'Add pakodas to hot kadhi', 'Temper with mustard, curry leaves, red chilli in ghee'] } },
    { label: 'Dinner', description: 'Grilled paneer tikka with mint sauce', calories: 380, protein: 22, carbs: 20, fat: 22,
      recipe: { time: '30 min', ingredients: ['300g paneer cubes', '1 cup curd', 'Tikka masala', 'Bell peppers', 'Onion rings', 'Lemon', 'Mint leaves', 'Coriander for sauce'], steps: ['Marinate paneer in curd + tikka masala 30 min', 'Thread on skewers with peppers and onion', 'Grill or cook in oven 200°C 15 min, flip once', 'Blend mint + coriander + garlic + lemon for sauce', 'Squeeze lemon on tikka before serving', 'Serve with onion rings and mint sauce'] } }
  ],
  Sunday: [
    { label: 'Breakfast', description: 'Masala dosa with coconut chutney', calories: 440, protein: 10, carbs: 74, fat: 14,
      recipe: { time: '20 min (with ready batter)', ingredients: ['Dosa batter', '2 boiled potatoes', '1 onion', 'Mustard seeds', 'Turmeric', 'Green chilli', 'Fresh coconut', 'Roasted chana dal for chutney'], steps: ['Make potato masala: temper mustard, add onion, potato, turmeric', 'Spread thin dosa batter on hot tawa in a circle', 'Drizzle oil on edges, cook until crisp', 'Add potato filling in centre, fold over', 'Blend coconut + chana dal + green chilli + ginger for chutney', 'Serve hot with chutney and sambar'] } },
    { label: 'Lunch', description: 'Mutton/Soya curry with rice (special)', calories: 680, protein: 36, carbs: 72, fat: 22,
      recipe: { time: '50 min', ingredients: ['500g soya chunks or mutton', '3 onions', '3 tomatoes', 'Ginger garlic paste', 'Whole spices', 'Yogurt', 'Coriander + mint', 'Basmati rice'], steps: ['Brown onions well in oil with whole spices', 'Add ginger-garlic paste, cook 3 min', 'Add tomatoes, cook until oil separates', 'Add marinated protein (yogurt + spices)', 'Pressure cook 4 whistles', 'Garnish with coriander, serve with rice'] } },
    { label: 'Dinner', description: 'Light vegetable soup with toast', calories: 240, protein: 8, carbs: 36, fat: 5,
      recipe: { time: '20 min', ingredients: ['1 carrot', '2 tomatoes', '½ cup peas', '1 cup corn', 'Vegetable stock', 'Black pepper', 'Mixed herbs', 'Multigrain toast'], steps: ['Sauté vegetables in olive oil lightly', 'Add stock, bring to boil', 'Simmer 15 min until veg tender', 'Blend half the soup for thickness', 'Season with pepper and herbs', 'Toast bread, serve with soup'] } }
  ]
};

const shoppingCategories: ShoppingCategoryType[] = [
  { title: 'Vegetables', aisle: 'Produce', items: [{ name: 'Spinach', checked: true, qty: 2, unit: 'bunch' }, { name: 'Broccoli', checked: false, qty: 1, unit: 'head' }, { name: 'Bell Peppers', checked: true, qty: 3, unit: 'nos' }, { name: 'Cauliflower', checked: false, qty: 1, unit: 'head' }, { name: 'Tomatoes', checked: true, qty: 500, unit: 'g' }] },
  { title: 'Proteins', aisle: 'Dairy & Proteins', items: [{ name: 'Paneer', checked: true, qty: 400, unit: 'g' }, { name: 'Tofu', checked: false, qty: 250, unit: 'g' }, { name: 'Moong Dal', checked: true, qty: 500, unit: 'g' }, { name: 'Rajma', checked: false, qty: 250, unit: 'g' }] },
  { title: 'Dairy', aisle: 'Dairy & Proteins', items: [{ name: 'Greek Yogurt', checked: true, qty: 400, unit: 'g' }, { name: 'Milk', checked: true, qty: 1, unit: 'L' }, { name: 'Ghee', checked: false, qty: 200, unit: 'g' }] },
  { title: 'Grains & Cereals', aisle: 'Dry Goods', items: [{ name: 'Quinoa', checked: true, qty: 500, unit: 'g' }, { name: 'Brown Rice', checked: false, qty: 1, unit: 'kg' }, { name: 'Oats', checked: true, qty: 500, unit: 'g' }, { name: 'Whole Wheat Flour', checked: true, qty: 1, unit: 'kg' }] }
];

const analyticsData = [
  { name: 'Mon', value: 1800 }, { name: 'Tue', value: 2100 }, { name: 'Wed', value: 1950 },
  { name: 'Thu', value: 2200 }, { name: 'Fri', value: 2050 }, { name: 'Sat', value: 2250 }, { name: 'Sun', value: 1900 }
];
const proteinData = [
  { name: 'Mon', value: 95 }, { name: 'Tue', value: 110 }, { name: 'Wed', value: 88 },
  { name: 'Thu', value: 120 }, { name: 'Fri', value: 104 }, { name: 'Sat', value: 115 }, { name: 'Sun', value: 92 }
];

const aiSteps = ['User Profile', 'Retrieval Agent', 'Constraint Validator', 'Meal Optimizer', 'Generation Agent', 'Explainability Agent'];

// ─── BMR / TDEE Calculation ───────────────────────────────────────────────────
function calcNutrition(profile: Profile) {
  const age = parseInt(profile.age) || 25;
  const height = parseInt(profile.height) || 165;
  const weight = parseInt(profile.weight) || 65;
  const isMale = profile.gender === 'Male';
  const bmr = isMale
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const activityMap: Record<string, number> = { 'Sedentary': 1.2, 'Lightly Active': 1.375, 'Moderately Active': 1.55, 'Very Active': 1.725 };
  const multiplier = activityMap[profile.activity] ?? 1.375;
  let tdee = Math.round(bmr * multiplier);
  if (profile.goal === 'Weight Loss') tdee = Math.round(tdee * 0.85);
  if (profile.goal === 'Muscle Gain') tdee = Math.round(tdee * 1.1);
  const protein = Math.round(weight * (profile.goal === 'Muscle Gain' ? 2.2 : 1.6));
  const fat = Math.round((tdee * 0.28) / 9);
  const carbs = Math.round((tdee - protein * 4 - fat * 9) / 4);
  return { calories: tdee, protein, carbs, fat };
}

// ─── Streak helpers ───────────────────────────────────────────────────────────
function getStreak(): number { return parseInt(localStorage.getItem('nutriai_streak') || '0'); }
function setStreak(n: number) { localStorage.setItem('nutriai_streak', String(n)); }
function getStreakDate(): string { return localStorage.getItem('nutriai_streak_date') || ''; }
function setStreakDate(d: string) { localStorage.setItem('nutriai_streak_date', d); }

// ─── Water helpers ────────────────────────────────────────────────────────────
function getWaterToday(): number {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('nutriai_water');
  if (!stored) return 0;
  const parsed = JSON.parse(stored);
  return parsed.date === today ? parsed.glasses : 0;
}
function setWaterToday(n: number) {
  localStorage.setItem('nutriai_water', JSON.stringify({ date: new Date().toDateString(), glasses: n }));
}

// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [stage, setStage] = useState<number>(1);
  const [questionStep, setQuestionStep] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [recipeModal, setRecipeModal] = useState<{ day: string; mealLabel: string } | null>(null);
  const [water, setWater] = useState<number>(getWaterToday);
  const [streak, setStreakState] = useState<number>(getStreak);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiCurrentStep, setAiCurrentStep] = useState(-1);
  const [profileEditing, setProfileEditing] = useState(false);
  const [shoppingItems, setShoppingItems] = useState<ShoppingCategoryType[]>(shoppingCategories);
  const [swappedMeals, setSwappedMeals] = useState<Record<string, number>>({});
  const aiTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [profile, setProfile] = useState<Profile>({
    name: '', age: '', gender: '', height: '', weight: '',
    goal: '', preference: '', cuisine: '', allergies: [],
    cookingTime: '', activity: '', medicalConditions: [], mealsPerDay: '3',
    budget: '2000-4000', foodsToAvoid: ''
  });

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Streak check on mount
  useEffect(() => {
    const today = new Date().toDateString();
    if (getStreakDate() !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (getStreakDate() === yesterday.toDateString()) {
        const newStreak = getStreak() + 1;
        setStreak(newStreak);
        setStreakDate(today);
        setStreakState(newStreak);
      } else if (getStreak() === 0) {
        setStreak(1);
        setStreakDate(today);
        setStreakState(1);
      }
    }
  }, []);

  const macros = useMemo(() => calcNutrition(profile), [profile]);

  const handleSelect = (field: keyof Profile, value: string, multi = false) => {
    if (multi) {
      setProfile(prev => {
        const arr = prev[field] as string[];
        return { ...prev, [field]: arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value] };
      });
    } else {
      setProfile(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (questionStep < steps.length - 1) setQuestionStep(questionStep + 1);
    else setStage(4);
  };

  const handlePrevStep = () => { if (questionStep > 0) setQuestionStep(questionStep - 1); };

  const startProcessing = () => {
    setStage(4);
    setAiProgress(0);
    setAiCurrentStep(-1);
    let step = 0;
    let progress = 0;
    aiTimerRef.current = setInterval(() => {
      progress += 2;
      setAiProgress(progress);
      const newStep = Math.floor((progress / 100) * aiSteps.length);
      if (newStep !== step) { step = newStep; setAiCurrentStep(newStep - 1); }
      if (progress >= 100) {
        clearInterval(aiTimerRef.current!);
        setAiCurrentStep(aiSteps.length - 1);
        setTimeout(() => setStage(5), 600);
      }
    }, 60);
  };

  const addWater = () => {
    const next = Math.min(water + 1, 12);
    setWater(next);
    setWaterToday(next);
  };

  const handleSwapMeal = (day: string, mealIdx: number) => {
    const key = `${day}-${mealIdx}`;
    setSwappedMeals(prev => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
  };

  const getRecipeMeal = () => {
    if (!recipeModal) return null;
    const meals = weeklyMealPlan[recipeModal.day];
    return meals?.find(m => m.label === recipeModal.mealLabel) ?? null;
  };

  const navigate = (id: number) => { setStage(id); setMobileMenuOpen(false); };

  const isSelected = (field: keyof Profile, value: string) => {
    const val = profile[field];
    return Array.isArray(val) ? val.includes(value) : val === value;
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const selBtn = (field: keyof Profile, value: string, multi = false, extra = '') => (
    <button
      key={value}
      type="button"
      onClick={() => handleSelect(field, value, multi)}
      className={`w-full rounded-3xl border px-5 py-4 text-left text-sm font-medium transition
        ${isSelected(field, value)
          ? 'border-primary bg-primary text-white shadow-soft'
          : 'border-primary/20 bg-white/90 text-text hover:border-primary/80 hover:bg-primary/10'
        } ${extra}`}
    >
      {multi && isSelected(field, value) && <CheckCircle2 className="mr-2 inline h-4 w-4" />}
      {value}
    </button>
  );

  const currentMeals = weeklyMealPlan[DAYS[selectedDay]] ?? [];

  // ── WATER RING ─────────────────────────────────────────────────────────────
  const waterPct = (water / 8) * 100;
  const waterCirc = 2 * Math.PI * 45;
  const waterDash = (waterPct / 100) * waterCirc;

  // ── RECIPE MODAL ──────────────────────────────────────────────────────────
  const recipeMeal = getRecipeMeal();

  return (
    <div className={`min-h-screen bg-background text-text transition-colors duration-300`}>
      {/* Recipe Modal */}
      <AnimatePresence>
        {recipeModal && recipeMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
            onClick={() => setRecipeModal(null)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-card w-full max-w-lg rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-soft max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-text/50">{recipeModal.day} · {recipeModal.mealLabel}</p>
                  <h3 className="mt-1 text-xl font-semibold text-text">{recipeMeal.description}</h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-text/60">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{recipeMeal.recipe.time}</span>
                    <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5" />{recipeMeal.calories} kcal</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" />{recipeMeal.protein}g protein</span>
                  </div>
                </div>
                <button onClick={() => setRecipeModal(null)} className="rounded-full bg-white border border-primary/20 p-2 text-text/70 hover:text-text">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-text/50 mb-3">Ingredients</p>
                <ul className="space-y-1.5">
                  {recipeMeal.recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text/80">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-text/50 mb-3">Steps</p>
                <ol className="space-y-3">
                  {recipeMeal.recipe.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text/80">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primaryDark">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ── STAGE 1: LOGIN ─────────────────────────────────────────────────── */}
        {stage === 1 && (
          <motion.main key="login" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.45 }}
            className="grid min-h-screen place-items-center px-4 py-10">
            <div className="glass-card w-full max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-10 shadow-soft">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[2rem] bg-primary text-white shadow-glow text-lg font-bold">NA</div>
                <h1 className="text-3xl font-semibold">NutriAI</h1>
                <p className="mt-3 text-sm text-text/70">Your personalized AI nutrition companion.</p>
              </div>
              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-text/70">Email</span>
                  <div className="flex items-center gap-3 rounded-3xl border border-primary/20 bg-white px-4 py-3 shadow-sm">
                    <Mail className="h-5 w-5 text-primaryDark" />
                    <input className="w-full bg-transparent outline-none" type="email" placeholder="hello@nutriai.com" />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-text/70">Password</span>
                  <div className="flex items-center gap-3 rounded-3xl border border-primary/20 bg-white px-4 py-3 shadow-sm">
                    <Lock className="h-5 w-5 text-primaryDark" />
                    <input className="w-full bg-transparent outline-none" type="password" placeholder="••••••••" />
                  </div>
                </label>
              </div>
              <div className="mt-8 space-y-4">
                <button onClick={() => setStage(2)} className="inline-flex w-full items-center justify-center gap-3 rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark">
                  Login <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => setStage(2)} className="w-full rounded-3xl border border-primary/20 bg-white px-6 py-3 text-sm font-semibold text-primaryDark transition hover:bg-primary/10">
                  Sign Up
                </button>
              </div>
            </div>
          </motion.main>
        )}

        {/* ── STAGE 2: QUESTIONNAIRE ──────────────────────────────────────────── */}
        {stage === 2 && (
          <motion.main key="questionnaire" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.45 }}
            className="min-h-screen bg-background px-4 py-10">
            <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-soft">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-text/50">Step {questionStep + 1} of {steps.length}</p>
                  <h2 className="mt-3 text-3xl font-semibold text-text">{steps[questionStep].title}</h2>
                </div>
                <p className="text-sm text-text/60">Fill in to personalize your plan</p>
              </div>

              <div className="mb-10 overflow-hidden rounded-[2rem] bg-background/40 p-2">
                <div className="grid grid-cols-6 gap-2">
                  {steps.map((step, index) => (
                    <div key={step.title} className={`h-2 rounded-full transition-all duration-500 ${index <= questionStep ? 'bg-primary' : 'bg-white/60'}`} />
                  ))}
                </div>
              </div>

              <div className="space-y-8 p-4 sm:p-6">
                {questionStep === 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(['name', 'age', 'height', 'weight'] as const).map((field) => (
                      <label key={field} className="block">
                        <span className="mb-2 block text-sm font-medium text-text/70 capitalize">{field === 'height' ? 'Height (cm)' : field === 'weight' ? 'Weight (kg)' : field.charAt(0).toUpperCase() + field.slice(1)}</span>
                        <input value={profile[field]} onChange={e => handleInputChange(field, e.target.value)}
                          className="w-full rounded-3xl border border-primary/20 bg-white/90 px-4 py-3 outline-none focus:border-primary transition"
                          placeholder={field === 'name' ? 'Your name' : field === 'age' ? 'e.g. 28' : field === 'height' ? 'e.g. 165' : 'e.g. 62'} />
                      </label>
                    ))}
                    <div className="block sm:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-text/70">Gender</span>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {['Male', 'Female', 'Other'].map(g => selBtn('gender', g))}
                      </div>
                    </div>
                  </div>
                )}

                {questionStep === 1 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text/60">Primary Goal</p>
                      {['Weight Loss', 'Muscle Gain', 'Maintenance', 'General Health'].map(g => selBtn('goal', g))}
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text/60">Activity Level</p>
                      {['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'].map(l => selBtn('activity', l))}
                    </div>
                  </div>
                )}

                {questionStep === 2 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text/60">Diet Type</p>
                      {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain'].map(t => selBtn('preference', t))}
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text/60">Preferred Cuisine</p>
                      {['Marathi', 'North Indian', 'South Indian', 'Gujarati', 'Punjabi', 'Bengali'].map(c => selBtn('cuisine', c))}
                    </div>
                  </div>
                )}

                {questionStep === 3 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text/60">Food Allergies <span className="normal-case font-normal text-text/40">(select all that apply)</span></p>
                      {['Peanuts', 'Dairy', 'Gluten', 'Soy', 'None'].map(a => selBtn('allergies', a, true))}
                    </div>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-text/70">Foods to Avoid</span>
                      <textarea value={profile.foodsToAvoid} onChange={e => handleInputChange('foodsToAvoid', e.target.value)}
                        className="w-full rounded-3xl border border-primary/20 bg-white/90 px-4 py-3 outline-none focus:border-primary transition h-32 resize-none"
                        placeholder="e.g. bitter gourd, mushrooms..." />
                    </label>
                  </div>
                )}

                {questionStep === 4 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text/60">Monthly Food Budget (₹)</p>
                      {['<2000', '2000-4000', '4000-6000', '>6000'].map(r => selBtn('budget', r))}
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text/60">Daily Cooking Time</p>
                      {['<15 min', '15-30 min', '30-60 min', '>60 min'].map(t => selBtn('cookingTime', t))}
                    </div>
                  </div>
                )}

                {questionStep === 5 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text/60">Medical Conditions <span className="normal-case font-normal text-text/40">(select all)</span></p>
                      {['Diabetes', 'Hypertension', 'Thyroid', 'PCOS', 'None'].map(c => selBtn('medicalConditions', c, true))}
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text/60">Meals Per Day</p>
                      {['3', '4', '5'].map(m => selBtn('mealsPerDay', m))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
                <button onClick={handlePrevStep} disabled={questionStep === 0}
                  className="rounded-3xl border border-primary/20 bg-white/90 px-6 py-3 text-sm font-semibold text-text transition hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40">
                  Previous
                </button>
                <button onClick={handleNextStep}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark">
                  {questionStep < steps.length - 1 ? 'Next' : 'Generate My Plan'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.main>
        )}

        {/* ── STAGE 4: AI PROCESSING ──────────────────────────────────────────── */}
        {stage === 4 && (
          <motion.main key="processing" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
            className="grid min-h-screen place-items-center px-4 py-10">
            <div className="glass-card w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/90 p-10 shadow-soft">
              <div className="text-center mb-8">
                <p className="text-sm uppercase tracking-[0.32em] text-text/50">AI Processing</p>
                <h2 className="mt-3 text-3xl font-semibold text-text">Crafting your personalized plan</h2>
                <p className="mt-2 text-sm text-text/60">Each agent validates your preferences and optimizes every meal.</p>
              </div>

              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm text-text/60 mb-2">
                  <span>{aiCurrentStep >= 0 ? aiSteps[aiCurrentStep] : 'Initializing...'}</span>
                  <span>{aiProgress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-primary/10">
                  <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${aiProgress}%` }} transition={{ duration: 0.3, ease: 'linear' }} />
                </div>
              </div>

              {/* Steps grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                {aiSteps.map((step, index) => {
                  const done = index <= aiCurrentStep;
                  const active = index === aiCurrentStep + 1 && aiProgress > 0 && aiProgress < 100;
                  return (
                    <div key={step} className={`flex items-center gap-3 rounded-3xl border px-4 py-3 transition-all duration-500
                      ${done ? 'border-primary/30 bg-primary/5' : active ? 'border-primary/40 bg-primary/10' : 'border-white/60 bg-white/50'}`}>
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300
                        ${done ? 'bg-primary text-white' : active ? 'bg-primary/20 text-primaryDark animate-pulse' : 'bg-white/60 text-text/30'}`}>
                        {done ? <CheckCircle2 className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                      </div>
                      <p className={`text-sm font-medium ${done ? 'text-primaryDark' : active ? 'text-text' : 'text-text/40'}`}>{step}</p>
                    </div>
                  );
                })}
              </div>

              {aiProgress === 0 && (
                <div className="mt-8 text-center">
                  <button onClick={startProcessing} className="inline-flex items-center gap-2 rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primaryDark">
                    Start Processing <RefreshCcw className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.main>
        )}

        {/* ── STAGES 3, 5–8: MAIN APP ─────────────────────────────────────────── */}
        {[3, 5, 6, 7, 8].includes(stage) && (
          <div className="min-h-screen bg-background pb-10">
            <Navbar onNavigate={navigate} activeSection={stage} darkMode={darkMode} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            {/* Mobile menu overlay */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div initial={{ opacity: 0, x: -240 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -240 }} transition={{ duration: 0.25 }}
                  className="fixed inset-0 z-30 xl:hidden">
                  <div className="absolute inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)} />
                  <aside className="absolute left-0 top-0 h-full w-72 glass-card border-r border-white/60 bg-white/95 p-5 shadow-soft flex flex-col gap-4">
                    <div className="flex items-center justify-between mt-16">
                      <h2 className="text-xl font-semibold text-text">NutriAI</h2>
                      <button onClick={() => setMobileMenuOpen(false)} className="rounded-full border border-primary/20 p-2"><X className="h-4 w-4" /></button>
                    </div>
                    <nav className="mt-4 flex flex-col gap-2">
                      {[{ label: 'Dashboard', id: 3 }, { label: 'Meal Plan', id: 5 }, { label: 'Shopping List', id: 6 }, { label: 'Profile', id: 7 }, { label: 'Settings', id: 8 }].map(item => (
                        <button key={item.id} onClick={() => navigate(item.id)}
                          className={`rounded-3xl px-4 py-3 text-left text-sm font-medium transition ${stage === item.id ? 'bg-primary text-white' : 'bg-white/80 text-text hover:bg-primary/10'}`}>
                          {item.label}
                        </button>
                      ))}
                    </nav>
                  </aside>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mx-auto grid max-w-7xl gap-6 px-4 pt-6 xl:grid-cols-[280px_1fr]">
              <Sidebar active={stage} onSelect={navigate} />
              <main className="space-y-6 min-w-0">

                {/* ── DASHBOARD (3) ────────────────────────────────────────────── */}
                {stage === 3 && (
                  <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Header */}
                    <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-soft">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.32em] text-text/50">Personalized Plan</p>
                          <h2 className="mt-2 text-3xl font-semibold text-text">Welcome back, {profile.name || 'there'} 👋</h2>
                          <p className="mt-1 text-sm text-text/70">Your AI-powered nutrition dashboard</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {[{ label: 'Goal', value: profile.goal || 'Not set' }, { label: 'Budget', value: profile.budget ? `₹${profile.budget}/mo` : 'Not set' }].map(item => (
                            <div key={item.label} className="rounded-3xl border border-primary/10 bg-primary/5 px-5 py-4">
                              <p className="text-sm text-text/60">{item.label}</p>
                              <p className="mt-1 text-lg font-semibold text-text">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Macro cards — from real profile */}
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                      <DashboardCard title="Daily Calories" value={`${macros.calories} kcal`} detail={`Target for ${profile.goal || 'your goal'}`} icon={<Sparkles className="h-5 w-5" />} accent="bg-[#E8F5E9] text-primaryDark" />
                      <DashboardCard title="Protein" value={`${macros.protein} g`} detail="Muscle repair & growth" icon={<ShieldCheck className="h-5 w-5" />} accent="bg-[#E8F5E9] text-primaryDark" />
                      <DashboardCard title="Carbs" value={`${macros.carbs} g`} detail="Your energy fuel" icon={<Zap className="h-5 w-5" />} accent="bg-[#E8F5E9] text-primaryDark" />
                      <DashboardCard title="Fat" value={`${macros.fat} g`} detail="Healthy hormones" icon={<CheckCircle2 className="h-5 w-5" />} accent="bg-[#E8F5E9] text-primaryDark" />
                    </div>

                    {/* Streak + Water row */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Streak */}
                      <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-soft flex items-center gap-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-orange-600 flex-shrink-0">
                          <Trophy className="h-8 w-8" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-text/50">Meal Streak</p>
                          <p className="mt-1 text-4xl font-bold text-text">{streak}<span className="text-lg font-normal text-text/60 ml-1">days</span></p>
                          <p className="mt-1 text-xs text-text/60">{streak >= 7 ? '🔥 On fire! Keep it up!' : streak >= 3 ? '⭐ Great consistency!' : 'Track meals daily to build streak'}</p>
                        </div>
                        <button onClick={() => { const n = streak + 1; setStreak(n); setStreakDate(new Date().toDateString()); setStreakState(n); }}
                          className="ml-auto rounded-3xl border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primaryDark hover:bg-primary/10 transition whitespace-nowrap">
                          + Log today
                        </button>
                      </div>

                      {/* Water tracker */}
                      <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-soft flex items-center gap-5">
                        <div className="relative flex-shrink-0">
                          <svg width="100" height="100" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#E8F5E9" strokeWidth="8" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#2E7D1F" strokeWidth="8"
                              strokeDasharray={`${waterDash} ${waterCirc}`}
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"
                              style={{ transition: 'stroke-dasharray 0.5s ease' }}
                            />
                            <text x="50" y="54" textAnchor="middle" dominantBaseline="middle" className="fill-text font-bold" style={{ fontSize: 22, fontFamily: 'inherit', fill: '#1a1a1a', fontWeight: 700 }}>
                              {water}
                            </text>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-widest text-text/50">Hydration</p>
                          <p className="mt-1 text-xl font-semibold text-text">{water * 250} ml <span className="text-sm font-normal text-text/50">/ 2000 ml</span></p>
                          <p className="text-xs text-text/60 mt-1">{water >= 8 ? '✅ Daily goal reached!' : `${8 - water} more glasses to go`}</p>
                          <button onClick={addWater}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-3xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primaryDark transition">
                            <Plus className="h-3.5 w-3.5" /> Add glass (250ml)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preview meal plan */}
                    <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm uppercase tracking-[0.32em] text-text/50">Preview</p>
                            <h3 className="mt-1 text-2xl font-semibold text-text">This week's meals</h3>
                          </div>
                          <button onClick={() => setStage(5)} className="rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark">View full plan</button>
                        </div>
                        <div className="grid gap-5 lg:grid-cols-2">
                          {DAYS.slice(0, 2).map(day => (
                            <MealCard key={day} day={day} meals={weeklyMealPlan[day].slice(0, 3).map(m => ({ label: m.label, description: m.description }))} />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <AnalyticsChart title="Calories" data={analyticsData.map((d, i) => ({ ...d, value: i === 0 ? macros.calories - 200 : i === 3 ? macros.calories + 150 : macros.calories - 50 + i * 30 }))} color="#2E7D1F" />
                        <AnalyticsChart title="Protein Intake" data={proteinData.map((d, i) => ({ ...d, value: macros.protein - 15 + i * 3 }))} color="#005A00" />
                      </div>
                    </div>

                    {/* Explainability */}
                    <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-soft">
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <div>
                          <p className="text-sm uppercase tracking-[0.32em] text-text/50">Why These Meals?</p>
                          <h3 className="mt-1 text-2xl font-semibold text-text">Explainability</h3>
                        </div>
                        <div className="rounded-3xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primaryDark">AI rationale</div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {[
                          { name: 'Paneer Bhurji', features: ['High Protein', 'Vegetarian Friendly', 'Budget Friendly', 'Easy To Prepare'] },
                          { name: 'Dal Tadka', features: ['Complete Amino Acids', 'High Fiber', 'Gut-Friendly', 'Traditional Indian'] },
                          { name: 'Quinoa Salad', features: ['Low Glycemic', 'Supports Recovery', 'Seasonal Ingredients', 'Rich in Antioxidants'] }
                        ].map(item => (
                          <div key={item.name} className="rounded-3xl border border-primary/10 bg-primary/5 p-5">
                            <p className="font-semibold text-text">{item.name}</p>
                            <ul className="mt-4 space-y-2 text-sm text-text/70">
                              {item.features.map(f => (
                                <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primaryDark flex-shrink-0" />{f}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* ── MEAL PLAN (5) ─────────────────────────────────────────────── */}
                {stage === 5 && (
                  <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-soft">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.32em] text-text/50">Generated Plan</p>
                          <h2 className="mt-2 text-3xl font-semibold text-text">7-Day Diet Plan</h2>
                          <p className="text-sm text-text/60 mt-1">Tailored to your {profile.goal || 'goals'} · {profile.preference || 'All diets'}</p>
                        </div>
                        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark">
                          <Download className="h-4 w-4" /> Download Plan
                        </button>
                      </div>
                    </div>

                    {/* Day tab switcher */}
                    <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-soft">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedDay(d => Math.max(0, d - 1))} className="rounded-full border border-primary/20 p-2 hover:bg-primary/10 transition flex-shrink-0">
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="flex-1 overflow-x-auto">
                          <div className="flex gap-2 min-w-max px-1">
                            {DAYS.map((day, i) => (
                              <button key={day} onClick={() => setSelectedDay(i)}
                                className={`rounded-3xl px-4 py-2 text-sm font-medium transition whitespace-nowrap
                                  ${selectedDay === i ? 'bg-primary text-white shadow-soft' : 'bg-white/80 text-text/70 hover:text-text border border-primary/20'}`}>
                                {day.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => setSelectedDay(d => Math.min(6, d + 1))} className="rounded-full border border-primary/20 p-2 hover:bg-primary/10 transition flex-shrink-0">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Meals for selected day */}
                    <AnimatePresence mode="wait">
                      <motion.div key={selectedDay} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                        className="grid gap-6 sm:grid-cols-3">
                        {currentMeals.map((meal, mealIdx) => {
                          const swapKey = `${DAYS[selectedDay]}-${mealIdx}`;
                          const swapCount = swappedMeals[swapKey] ?? 0;
                          const isSwapped = swapCount % 2 === 1;
                          return (
                            <div key={meal.label} className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-soft flex flex-col gap-4">
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs uppercase tracking-widest text-text/50">{DAYS[selectedDay]}</span>
                                  <span className="rounded-3xl bg-primary/10 px-3 py-1 text-xs font-semibold text-primaryDark">{meal.label}</span>
                                </div>
                                <h3 className="mt-2 text-lg font-semibold text-text">{isSwapped ? `Alt: ${meal.description.split(' ').reverse().join(' ')}` : meal.description}</h3>
                                {isSwapped && <p className="text-xs text-orange-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />Swapped meal</p>}
                              </div>
                              <div className="rounded-3xl border border-primary/10 bg-white/60 p-4 text-sm text-text/70 space-y-1.5 flex-1">
                                {[['Calories', `${meal.calories} kcal`], ['Protein', `${meal.protein} g`], ['Carbs', `${meal.carbs} g`], ['Fat', `${meal.fat} g`]].map(([k, v]) => (
                                  <div key={k} className="flex items-center justify-between"><span>{k}</span><strong className="text-text">{v}</strong></div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleSwapMeal(DAYS[selectedDay], mealIdx)}
                                  className="flex-1 rounded-3xl border border-primary/20 px-3 py-2 text-xs font-semibold text-primaryDark hover:bg-primary/10 transition flex items-center justify-center gap-1">
                                  <RefreshCcw className="h-3.5 w-3.5" /> Swap
                                </button>
                                <button onClick={() => setRecipeModal({ day: DAYS[selectedDay], mealLabel: meal.label })}
                                  className="flex-1 rounded-3xl bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primaryDark transition flex items-center justify-center gap-1">
                                  <BookOpen className="h-3.5 w-3.5" /> Recipe
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    </AnimatePresence>

                    {/* Day total */}
                    <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-soft">
                      <p className="text-sm font-semibold text-text/60 mb-3">Day Total · {DAYS[selectedDay]}</p>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        {[
                          ['Calories', currentMeals.reduce((s, m) => s + m.calories, 0), 'kcal'],
                          ['Protein', currentMeals.reduce((s, m) => s + m.protein, 0), 'g'],
                          ['Carbs', currentMeals.reduce((s, m) => s + m.carbs, 0), 'g'],
                          ['Fat', currentMeals.reduce((s, m) => s + m.fat, 0), 'g']
                        ].map(([label, val, unit]) => (
                          <div key={label as string} className="rounded-3xl bg-primary/5 p-3">
                            <p className="text-xs text-text/50">{label}</p>
                            <p className="text-xl font-bold text-text mt-1">{val}<span className="text-xs font-normal text-text/50 ml-1">{unit}</span></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* ── SHOPPING LIST (6) ─────────────────────────────────────────── */}
                {stage === 6 && (
                  <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-soft">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.32em] text-text/50">Shopping List</p>
                          <h2 className="mt-2 text-3xl font-semibold text-text">Grocery Essentials</h2>
                          <p className="text-sm text-text/60 mt-1">
                            {shoppingItems.flatMap(c => c.items).filter(i => i.checked).length} of {shoppingItems.flatMap(c => c.items).length} items checked
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-3xl border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primaryDark transition hover:bg-primary/10">
                            <Printer className="h-4 w-4" /> Print
                          </button>
                          <button onClick={() => {
                            const text = shoppingItems.map(c => `${c.title} (${c.aisle})\n` + c.items.map(i => `  - ${i.name} x${i.qty}${i.unit}`).join('\n')).join('\n\n');
                            const blob = new Blob([text], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a'); a.href = url; a.download = 'NutriAI-shopping-list.txt'; a.click();
                          }} className="inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark">
                            <Download className="h-4 w-4" /> Download List
                          </button>
                        </div>
                      </div>
                    </div>
                    <ShoppingList categories={shoppingItems} onChange={setShoppingItems} />
                  </motion.section>
                )}

                {/* ── PROFILE (7) ──────────────────────────────────────────────── */}
                {stage === 7 && (
                  <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-soft">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.32em] text-text/50">Profile</p>
                          <h2 className="mt-2 text-3xl font-semibold text-text">Your Nutrition Profile</h2>
                        </div>
                        <button onClick={() => setProfileEditing(!profileEditing)}
                          className="rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark">
                          {profileEditing ? 'Save Profile' : 'Edit Profile'}
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-6 xl:grid-cols-2">
                      <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-soft">
                        <h3 className="text-xl font-semibold text-text">Personal Information</h3>
                        <div className="mt-6 space-y-4">
                          {(['name', 'age', 'gender', 'height', 'weight'] as const).map(field => (
                            <div key={field} className="flex items-center justify-between border-b border-primary/10 pb-3 gap-4">
                              <span className="text-sm text-text/60 capitalize">{field === 'height' ? 'Height (cm)' : field === 'weight' ? 'Weight (kg)' : field}</span>
                              {profileEditing && field !== 'gender' ? (
                                <input value={profile[field]} onChange={e => handleInputChange(field, e.target.value)}
                                  className="rounded-2xl border border-primary/20 bg-white px-3 py-1.5 text-sm text-text outline-none focus:border-primary text-right w-36" />
                              ) : (
                                <strong className="text-sm text-text">{profile[field] || '—'}{field === 'height' ? ' cm' : field === 'weight' ? ' kg' : ''}</strong>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-soft">
                        <h3 className="text-xl font-semibold text-text">Preferences & Goals</h3>
                        <div className="mt-6 space-y-4">
                          {([['Fitness Goal', 'goal'], ['Diet Type', 'preference'], ['Cuisine', 'cuisine'], ['Cooking Time', 'cookingTime'], ['Budget', 'budget']] as const).map(([label, field]) => (
                            <div key={field} className="flex items-center justify-between border-b border-primary/10 pb-3 gap-4">
                              <span className="text-sm text-text/60">{label}</span>
                              {profileEditing ? (
                                <input value={profile[field] as string} onChange={e => handleInputChange(field, e.target.value)}
                                  className="rounded-2xl border border-primary/20 bg-white px-3 py-1.5 text-sm text-text outline-none focus:border-primary text-right w-36" />
                              ) : (
                                <strong className="text-sm text-text">{(profile[field] as string) || '—'}</strong>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-soft xl:col-span-2">
                        <h3 className="text-xl font-semibold text-text">Calculated Macros</h3>
                        <p className="text-sm text-text/60 mt-1">Based on Mifflin-St Jeor formula with TDEE adjustment</p>
                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                          {[['Daily Calories', `${macros.calories} kcal`], ['Protein', `${macros.protein} g/day`], ['Carbs', `${macros.carbs} g/day`], ['Fat', `${macros.fat} g/day`]].map(([l, v]) => (
                            <div key={l} className="rounded-3xl border border-primary/10 bg-primary/5 p-4 text-center">
                              <p className="text-xs text-text/50">{l}</p>
                              <p className="text-xl font-bold text-primaryDark mt-1">{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* ── SETTINGS (8) ─────────────────────────────────────────────── */}
                {stage === 8 && (
                  <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-soft">
                      <div>
                        <p className="text-sm uppercase tracking-[0.32em] text-text/50">Settings</p>
                        <h2 className="mt-2 text-3xl font-semibold text-text">Workspace Preferences</h2>
                      </div>
                    </div>
                    <div className="grid gap-6 xl:grid-cols-2">
                      <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-soft">
                        <h3 className="text-xl font-semibold text-text">Appearance</h3>
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                            <div>
                              <span className="text-sm font-medium text-text">Dark Mode</span>
                              <p className="text-xs text-text/50 mt-0.5">Switch to dark theme</p>
                            </div>
                            <button onClick={() => setDarkMode(!darkMode)}
                              className={`relative h-8 w-14 rounded-full transition-colors duration-300 ${darkMode ? 'bg-primary' : 'bg-text/20'}`}>
                              <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all duration-300 flex items-center justify-center ${darkMode ? 'left-7' : 'left-1'}`}>
                                {darkMode ? <Moon className="h-3 w-3 text-primaryDark" /> : <Sun className="h-3 w-3 text-text/60" />}
                              </span>
                            </button>
                          </div>
                          <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                            <div>
                              <span className="text-sm font-medium text-text">Notification Emails</span>
                              <p className="text-xs text-text/50 mt-0.5">Daily meal reminders</p>
                            </div>
                            <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primaryDark">Enabled</span>
                          </div>
                        </div>
                      </div>
                      <div className="glass-card rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-soft">
                        <h3 className="text-xl font-semibold text-text">Plan Settings</h3>
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                            <span className="text-sm text-text/70">Weekly summary</span>
                            <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primaryDark">Weekly</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                            <span className="text-sm text-text/70">Favorites locked</span>
                            <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primaryDark">Yes</span>
                          </div>
                          <div className="flex items-center justify-between pb-4">
                            <div>
                              <span className="text-sm font-medium text-text">Reset Progress</span>
                              <p className="text-xs text-text/50 mt-0.5">Clear streak & water data</p>
                            </div>
                            <button onClick={() => { setStreak(0); setStreakDate(''); setStreakState(0); setWater(0); setWaterToday(0); }}
                              className="rounded-full bg-red-50 border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition">
                              Reset
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}
              </main>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
