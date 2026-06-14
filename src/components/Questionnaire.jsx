import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./Questionnaire.css"

function Questionnaire() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    targetWeight: "",
    activityLevel: "",
    proteinPriority: "",
    dietType: "",
    cuisine: "",
    foodsEnjoy: "",
    foodsAvoid: "",
    allergies: [],
    medicalConditions: [],
    budget: "",
    cookingTime: "",
    mealsPerDay: "",
    optimizationPreference: "",
    waterIntake: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }))
  }

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.age)) {
      alert("Please fill Name and Age before continuing")
      return
    }
    if (step === 2 && !formData.goal) {
      alert("Please select your Primary Goal before continuing")
      return
    }
    if (step === 4 &&  (
    formData.allergies.length === 0 ||
    formData.medicalConditions.length === 0
  )
) {
  alert("Please complete all required fields");
  return;
}
    setStep(prev => prev + 1)
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {

  try {

    localStorage.setItem(
      "userprofile",
      JSON.stringify(formData)
    );

    if (!formData.waterIntake) {
  alert("Please complete all required fields");
  return;
}

    await addDoc(
      collection(db, "users"),
      formData
    );

    navigate("/dashboard");

  } catch (error) {

    console.error(error);

  }
};

  return (
    <div className="questionnaire-container">

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${(step / 7) * 100}%` }}></div>
      </div>
      <p className="progress-text">Step {step} of 7</p>

      {/* Section 1 */}
      {step === 1 && (
        <div className="section">
          <div className="section-header">

  <div>

    <h2 className="section-title">
      Personal Information
    </h2>
  </div>

  <p className="section-subtitle">
    Fill in to personalize your plan
  </p>

</div>

          <div className="form-grid">

  <div className="question">
    <label>Name</label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="Your name"
    />
  </div>

  <div className="question">
    <label>Age</label>
    <input
      type="number"
      name="age"
      value={formData.age}
      onChange={handleChange}
      placeholder="e.g. 28"
    />
  </div>

  <div className="question">
    <label>Height (cm)</label>
    <input
      type="number"
      name="height"
      value={formData.height}
      onChange={handleChange}
      placeholder="e.g. 165"
    />
  </div>

  <div className="question">
    <label>Weight (kg)</label>
    <input
      type="number"
      name="weight"
      value={formData.weight}
      onChange={handleChange}
      placeholder="e.g. 62"
    />
  </div>

  <div className="question full-width">
    <label>Gender</label>

    <div className="checkbox-group">
      {["Male","Female","Other"].map(option => (
        <label
          key={option}
          className={
            formData.gender === option
              ? "selected"
              : ""
          }
        >
          <input
            type="radio"
            name="gender"
            value={option}
            checked={formData.gender === option}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  </div>

</div>
        </div>
      )}
      {/* Section 2 */}
      {step === 2 && (

  <div className="section">

<div className="section-header">
  <div>
    <h2 className="section-title">Fitness Goals</h2>
  </div>
</div>

<div className="form-grid">

  <div className="question full-width">
    <label>Primary Goal</label>

    <div className="radio-group">
      {["Weight Loss", "Muscle Gain", "Maintenance", "General Health"].map(option => (
        <label
          key={option}
          className={formData.goal === option ? "selected" : ""}
        >
          <input
            type="radio"
            name="goal"
            value={option}
            checked={formData.goal === option}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  </div>

  <div className="question">
    <label>Target Weight (kg)</label>
    <input
      type="number"
      name="targetWeight"
      value={formData.targetWeight}
      onChange={handleChange}
      placeholder="e.g. 55"
    />
  </div>

  <div className="question">
    <label>Protein Priority</label>

    <div className="radio-group">
      {["High Protein", "Balanced Nutrition", "No Preference"].map(option => (
        <label
          key={option}
          className={formData.proteinPriority === option ? "selected" : ""}
        >
          <input
            type="radio"
            name="proteinPriority"
            value={option}
            checked={formData.proteinPriority === option}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  </div>

  <div className="question full-width">
    <label>Activity Level</label>

    <div className="radio-group">
      {["Sedentary", "Lightly Active", "Moderately Active", "Very Active"].map(option => (
        <label
          key={option}
          className={formData.activityLevel === option ? "selected" : ""}
        >
          <input
            type="radio"
            name="activityLevel"
            value={option}
            checked={formData.activityLevel === option}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  </div>

</div>

  </div>
)}

      {/* Section 3 */}
      {step === 3 && (

  <div className="section">

<div className="section-header">
  <div>
    <h2 className="section-title">Dietary Preferences</h2>
  </div>
</div>

<div className="form-grid">

  <div className="question full-width">
    <label>Diet Type *</label>

    <div className="radio-group">
      {["Vegetarian", "Non-Vegetarian", "Vegan", "Jain"].map(option => (
        <label
          key={option}
          className={formData.dietType === option ? "selected" : ""}
        >
          <input
            type="radio"
            name="dietType"
            value={option}
            checked={formData.dietType === option}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  </div>

  <div className="question full-width">
    <label>Preferred Cuisine *</label>

    <div className="radio-group">
      {["Marathi", "North Indian", "South Indian", "Gujarati", "Punjabi", "Jain", "No Preference"].map(option => (
        <label
          key={option}
          className={formData.cuisine === option ? "selected" : ""}
        >
          <input
            type="radio"
            name="cuisine"
            value={option}
            checked={formData.cuisine === option}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  </div>

  <div className="question">
    <label>Foods You Enjoy (Optional)</label>
    <textarea
      name="foodsEnjoy"
      value={formData.foodsEnjoy}
      onChange={handleChange}
      placeholder="e.g. Paneer, Dosa, Rajma"
      rows={4}
    />
  </div>

  <div className="question">
    <label>Foods To Avoid (Optional)</label>
    <textarea
      name="foodsAvoid"
      value={formData.foodsAvoid}
      onChange={handleChange}
      placeholder="e.g. Mushrooms, Eggs, Spicy food"
      rows={4}
    />
  </div>

</div>

  </div>
)}


      {/* Section 4 */}
      {step === 4 &&
       (

  <div className="section">

<div className="section-header">
  <div>
    <h2 className="section-title">Allergies & Restrictions</h2>
  </div>
</div>

<div className="form-grid">

  <div className="question full-width">
    <label>Food Allergies *</label>

    <div className="checkbox-group">
      {["Peanuts", "Dairy", "Gluten", "Soy", "Seafood", "None"].map(option => (
        <label
          key={option}
          className={
            formData.allergies.includes(option)
              ? "selected"
              : ""
          }
        >
          <input
            type="checkbox"
            checked={formData.allergies.includes(option)}
            onChange={() =>
              handleCheckbox("allergies", option)
            }
          />
          {option}
        </label>
      ))}
    </div>
  </div>

  <div className="question full-width">
    <label>Medical Conditions *</label>

    <div className="checkbox-group">
      {["Diabetes", "Hypertension", "Thyroid", "PCOS", "None"].map(option => (
        <label
          key={option}
          className={
            formData.medicalConditions.includes(option)
              ? "selected"
              : ""
          }
        >
          <input
            type="checkbox"
            checked={formData.medicalConditions.includes(option)}
            onChange={() =>
              handleCheckbox("medicalConditions", option)
            }
          />
          
          {option}
        </label>
      ))}
    </div>
  </div>

</div>

  </div>
)}


      {/* Section 5 */}
      {step === 5 && (

  <div className="section">
<div className="section-header">
  <div>
    <span className="step-label">STEP 5 OF 7</span>
    <h2 className="section-title">Budget & Lifestyle</h2>
  </div>
</div>

<div className="form-grid">

  <div className="question full-width">
    <label>Monthly Food Budget *</label>

    <div className="radio-group">
      {[
        "Less than ₹2000",
        "₹2000 – ₹4000",
        "₹4000 – ₹6000",
        "More than ₹6000"
      ].map(option => (
        <label
          key={option}
          className={formData.budget === option ? "selected" : ""}
        >
          <input
            type="radio"
            name="budget"
            value={option}
            checked={formData.budget === option}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  </div>

  <div className="question">
    <label>Daily Cooking Time *</label>

    <div className="radio-group">
      {[
        "Less than 15 minutes",
        "15–30 minutes",
        "30–60 minutes",
        "More than 60 minutes"
      ].map(option => (
        <label
          key={option}
          className={formData.cookingTime === option ? "selected" : ""}
        >
          <input
            type="radio"
            name="cookingTime"
            value={option}
            checked={formData.cookingTime === option}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  </div>

  <div className="question">
    <label>Meals Per Day *</label>

    <div className="radio-group">
      {["3 Meals", "4 Meals", "5 Meals"].map(option => (
        <label
          key={option}
          className={formData.mealsPerDay === option ? "selected" : ""}
        >
          <input
            type="radio"
            name="mealsPerDay"
            value={option}
            checked={formData.mealsPerDay === option}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  </div>

</div>

  </div>
)}


      {/* Section 6 */}
      {step === 6 && (

  <div className="section">

<div className="section-header">
  <div>
    <span className="step-label">STEP 6 OF 7</span>
    <h2 className="section-title">Optimization Preference</h2>
  </div>
</div>

<div className="form-grid">

  <div className="question full-width">
    <label>What should NutriAI prioritize? *</label>

    <div className="radio-group">
      {[
        "Budget Optimized",
        "Nutrition Optimized",
        "Balanced Approach"
      ].map(option => (
        <label
          key={option}
          className={
            formData.optimizationPreference === option
              ? "selected"
              : ""
          }
        >
          <input
            type="radio"
            name="optimizationPreference"
            value={option}
            checked={
              formData.optimizationPreference === option
            }
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  </div>

</div>
  </div>
)}


      {/* Section 7 */}
      {step === 7 && (

  <div className="section">

<div className="section-header">
  <div>
    <span className="step-label">STEP 7 OF 7</span>
    <h2 className="section-title">Lifestyle Information</h2>
  </div>
</div>

<div className="form-grid">

  <div className="question full-width">
    <label>Daily Water Intake *</label>

    <div className="radio-group">
      {[
        "Less than 1L",
        "1–2L",
        "2–3L",
        "More than 3L"
      ].map(option => (
        <label
          key={option}
          className={
            formData.waterIntake === option
              ? "selected"
              : ""
          }
        >
          <input
            type="radio"
            name="waterIntake"
            value={option}
            checked={
              formData.waterIntake === option
            }
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  </div>

</div>
  </div>
)}


      {/* Navigation Buttons */}
      <div className="btn-row">
        {step > 1 && (
          <button className="back-btn" onClick={handleBack}>← Back</button>
        )}
        {step < 7 && (
          <button className="next-btn" onClick={handleNext}>Next →</button>
        )}
        {step === 7 && (
          <button className="submit-btn" onClick={handleSubmit}>
            Submit & Generate My Plan →
          </button>
        )}
        
      </div>

    </div>
  )
}

export default Questionnaire