import React, { useState, useEffect, useCallback } from "react";

const DEFAULT_WORKOUT_CYCLE = [
  { evening: "Leg Day", exercises: ["Squats – 4×8", "Leg press – 3×10", "Walking lunges – 3×12", "Calf raises – 4×15"] },
  { evening: "Shoulder Rehab + Light Delts", exercises: ["Face pulls – 3×15", "Lateral raises – 3×12", "Band external rotation – 3×15"] },
  { evening: "Arms Focus", exercises: ["Barbell curls – 4×10", "Hammer curls – 3×12", "Cable triceps pushdown – 4×10", "Triceps kickback – 3×12"] },
  { evening: "Football Conditioning", exercises: ["Treadmill sprint intervals – 20 min", "Jump squats – 3×12", "Burpees – 3×10"] },
  { evening: "Rest Day", exercises: ["Foam rolling or mobility work"], rest: true },
  { evening: "Chest + Triceps", exercises: ["Machine chest press – 4×10", "Incline dumbbell press – 3×10", "Chest fly – 3×12", "Triceps rope pushdown – 3×12"] },
  { evening: "Back + Biceps", exercises: ["Lat pulldown – 4×10", "Seated row – 3×10", "Dumbbell row – 3×10", "Barbell curls – 4×10"] },
];

const DEFAULT_ROUTINE = [
  { id: "abs", label: "Morning Abs Workout", icon: "🔥", category: "morning" },
  { id: "skin_cleanse", label: "Face Wash / Cleanser", icon: "🧴", category: "morning" },
  { id: "skin_moist", label: "Moisturizer + Sunscreen", icon: "☀️", category: "morning" },
  { id: "coffee1", label: "Black Coffee + 4 Eggs", icon: "☕", category: "morning" },
  { id: "water1", label: "1L Water before 11 AM", icon: "💧", category: "morning" },
  { id: "lunch", label: "Proper Lunch", icon: "🍱", category: "afternoon" },
  { id: "tt", label: "30 Min Table Tennis", icon: "🏓", category: "afternoon" },
  { id: "water2", label: "1L Water before 3 PM", icon: "💧", category: "afternoon" },
  { id: "coffee2", label: "Black Coffee (Evening)", icon: "☕", category: "evening" },
  { id: "water3", label: "3L Water before 6 PM", icon: "💧", category: "evening" },
  { id: "gym", label: "GYM + Cardio", icon: "🏋️", category: "evening" },
  { id: "dinner", label: "Dinner – Protein + Shake", icon: "🥩", category: "night" },
  { id: "updates", label: "Daily Updates", icon: "📋", category: "night" },
  { id: "stm", label: "New Learning – STM", icon: "📘", category: "night" },
  { id: "govt", label: "New Learning – Govt Exams", icon: "📕", category: "night" },
  { id: "beard_wash", label: "Beard Wash / Oil", icon: "🧔", category: "night" },
  { id: "beard_comb", label: "Beard Comb & Shape", icon: "✂️", category: "night" },
  { id: "skin_night", label: "Night Face Wash + Serum", icon: "🌙", category: "night" },
];

const DEFAULT_SHOULDER = ["Band external rotation – 3×15", "Wall slides – 3×12", "Doorway chest stretch – 30s × 3"];
const DEFAULT_CORE = ["Plank – 45 seconds", "Leg raises – 15 reps", "Russian twists – 20 reps", "Mountain climbers – 30 seconds"];
const DEFAULT_MEALS = [
  { id: "meal1", label: "Breakfast: 3–4 eggs + oats or chapati", icon: "🍳" },
  { id: "meal2", label: "Lunch: rice/chapati + chicken/fish/paneer + veg", icon: "🍱" },
  { id: "meal3", label: "Snack: fruit + peanuts or sprouts", icon: "🥜" },
  { id: "meal4", label: "Post-workout: egg whites or whey protein", icon: "🥤" },
  { id: "meal5", label: "Dinner: protein + veg + 1 chapati", icon: "🥗" },
];

const ICON_OPTIONS = ["🔥","💪","🧴","☀️","☕","💧","🍱","🏓","🏋️","🥩","📋","📘","📕","🧔","✂️","🌙","🍳","🥜","🥤","🥗","⚡","🎯","🏃","🧘","💊","🫀","🧠","📝","💤","🚿","🦷","👔","📱","🎧","🌿","❤️"];

const STORAGE_KEY = "fitness-tracker-permanent-v4";
const CUSTOM_KEY = "fitness-tracker-custom-v4";
const START_DATE = new Date(2025, 2, 4);

function getDateForDay(n) { const d = new Date(START_DATE); d.setDate(d.getDate() + n - 1); return d; }
function getDayNum(date) { return Math.floor((date - START_DATE) / 864e5) + 1; }
function formatDate(d) {
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const w = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return `${w[d.getDay()]}, ${m[d.getMonth()]} ${d.getDate()}`;
}

function loadJSON(key, fallback) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; }
}
function saveJSON(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error(e); }
}

function App() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayNum = getDayNum(today);

  const [currentDay, setCurrentDay] = useState(todayNum);
  const [view, setView] = useState("today");
  const [weekOffset, setWeekOffset] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [addingTo, setAddingTo] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskIcon, setNewTaskIcon] = useState("📝");

  const [checked, setChecked] = useState(() => loadJSON(STORAGE_KEY, {}));
  const [routine, setRoutine] = useState(() => loadJSON(CUSTOM_KEY + "-routine", DEFAULT_ROUTINE));
  const [workouts, setWorkouts] = useState(() => loadJSON(CUSTOM_KEY + "-workouts", DEFAULT_WORKOUT_CYCLE));
  const [coreCircuit, setCoreCircuit] = useState(() => loadJSON(CUSTOM_KEY + "-core", DEFAULT_CORE));
  const [shoulderCare, setShoulderCare] = useState(() => loadJSON(CUSTOM_KEY + "-shoulder", DEFAULT_SHOULDER));
  const [meals, setMeals] = useState(() => loadJSON(CUSTOM_KEY + "-meals", DEFAULT_MEALS));

  useEffect(() => { saveJSON(STORAGE_KEY, checked); }, [checked]);
  useEffect(() => { saveJSON(CUSTOM_KEY + "-routine", routine); }, [routine]);
  useEffect(() => { saveJSON(CUSTOM_KEY + "-workouts", workouts); }, [workouts]);
  useEffect(() => { saveJSON(CUSTOM_KEY + "-core", coreCircuit); }, [coreCircuit]);
  useEffect(() => { saveJSON(CUSTOM_KEY + "-shoulder", shoulderCare); }, [shoulderCare]);
  useEffect(() => { saveJSON(CUSTOM_KEY + "-meals", meals); }, [meals]);

  const toggleCheck = (dayKey, itemId) => {
    const key = `${dayKey}:${itemId}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const isChecked = (dayKey, itemId) => !!checked[`${dayKey}:${itemId}`];

  const getWorkout = (dayNum) => workouts[((dayNum - 1) % 7)];

  const getAllItemIds = (dayNum) => {
    const plan = getWorkout(dayNum);
    const ids = routine.map(r => r.id);
    if (!plan.rest) { ids.push("cardio"); coreCircuit.forEach((_, i) => ids.push(`core${i}`)); }
    plan.exercises.forEach((_, i) => ids.push(`ex${i}`));
    shoulderCare.forEach((_, i) => ids.push(`sc${i}`));
    return ids;
  };

  const getCompletion = (dayNum) => {
    const prefix = `day${dayNum}:`;
    const allIds = getAllItemIds(dayNum);
    if (!allIds.length) return 0;
    return Math.round((allIds.filter(id => checked[`${prefix}${id}`]).length / allIds.length) * 100);
  };

  const resetDay = (dayNum) => {
    const prefix = `day${dayNum}:`;
    const newC = { ...checked };
    Object.keys(newC).forEach(k => { if (k.startsWith(prefix)) delete newC[k]; });
    setChecked(newC);
  };

  // Edit handlers
  const startEdit = (type, index, currentText, currentIcon) => {
    setEditingItem({ type, index });
    setEditText(currentText);
    setEditIcon(currentIcon || "");
    setShowIconPicker(false);
  };

  const saveEdit = () => {
    if (!editingItem || !editText.trim()) return;
    const { type, index } = editingItem;
    if (type === "routine") {
      const n = [...routine]; n[index] = { ...n[index], label: editText.trim(), icon: editIcon || n[index].icon }; setRoutine(n);
    } else if (type === "core") {
      const n = [...coreCircuit]; n[index] = editText.trim(); setCoreCircuit(n);
    } else if (type === "shoulder") {
      const n = [...shoulderCare]; n[index] = editText.trim(); setShoulderCare(n);
    } else if (type === "meal") {
      const n = [...meals]; n[index] = { ...n[index], label: editText.trim(), icon: editIcon || n[index].icon }; setMeals(n);
    } else if (type === "exercise") {
      const { dayIdx, exIdx } = editingItem;
      const n = [...workouts]; n[dayIdx] = { ...n[dayIdx], exercises: [...n[dayIdx].exercises] }; n[dayIdx].exercises[exIdx] = editText.trim(); setWorkouts(n);
    } else if (type === "workout_title") {
      const n = [...workouts]; n[index] = { ...n[index], evening: editText.trim() }; setWorkouts(n);
    }
    setEditingItem(null); setEditText(""); setEditIcon("");
  };

  const deleteItem = (type, index) => {
    if (type === "routine") { setRoutine(routine.filter((_, i) => i !== index)); }
    else if (type === "core") { setCoreCircuit(coreCircuit.filter((_, i) => i !== index)); }
    else if (type === "shoulder") { setShoulderCare(shoulderCare.filter((_, i) => i !== index)); }
    else if (type === "meal") { setMeals(meals.filter((_, i) => i !== index)); }
    else if (type === "exercise") {
      const { dayIdx, exIdx } = index;
      const n = [...workouts]; n[dayIdx] = { ...n[dayIdx], exercises: n[dayIdx].exercises.filter((_, i) => i !== exIdx) }; setWorkouts(n);
    }
  };

  const addTask = (type, category) => {
    if (!newTaskText.trim()) return;
    if (type === "routine") {
      const newId = `custom_${Date.now()}`;
      setRoutine([...routine, { id: newId, label: newTaskText.trim(), icon: newTaskIcon, category }]);
    } else if (type === "core") {
      setCoreCircuit([...coreCircuit, newTaskText.trim()]);
    } else if (type === "shoulder") {
      setShoulderCare([...shoulderCare, newTaskText.trim()]);
    } else if (type === "meal") {
      setMeals([...meals, { id: `meal_${Date.now()}`, label: newTaskText.trim(), icon: newTaskIcon }]);
    } else if (type === "exercise") {
      const n = [...workouts]; n[category] = { ...n[category], exercises: [...n[category].exercises, newTaskText.trim()] }; setWorkouts(n);
    }
    setNewTaskText(""); setNewTaskIcon("📝"); setAddingTo(null);
  };

  const resetAllCustom = () => {
    if (window.confirm("Reset all tasks to defaults? Your check history will be kept.")) {
      setRoutine(DEFAULT_ROUTINE); setWorkouts(DEFAULT_WORKOUT_CYCLE);
      setCoreCircuit(DEFAULT_CORE); setShoulderCare(DEFAULT_SHOULDER); setMeals(DEFAULT_MEALS);
    }
  };

  const workout = getWorkout(currentDay);
  const dayKey = `day${currentDay}`;
  const completion = getCompletion(currentDay);
  const currentDate = getDateForDay(currentDay);
  const isToday = currentDay === todayNum;
  const dayInPlan = currentDay >= 1 && currentDay <= 30;
  const workoutDayIdx = (currentDay - 1) % 7;

  const getWeekDays = () => {
    const base = new Date(today); base.setDate(base.getDate() + weekOffset * 7);
    const start = new Date(base); const dow = start.getDay();
    start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1));
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return { date: d, dayNum: getDayNum(d) }; });
  };
  const weekDays = getWeekDays();
  const weekLabel = (() => {
    const ms = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const f = weekDays[0].date, l = weekDays[6].date;
    return f.getMonth() === l.getMonth() ? `${ms[f.getMonth()]} ${f.getFullYear()}` : `${ms[f.getMonth()].slice(0,3)} – ${ms[l.getMonth()].slice(0,3)} ${l.getFullYear()}`;
  })();

  const catLabels = { morning: "Morning", afternoon: "Afternoon", evening: "Evening", night: "Night" };
  const catColors = {
    morning: { bg: "rgba(255,183,77,0.10)", border: "#ffb74d", accent: "#ff9800" },
    afternoon: { bg: "rgba(129,199,132,0.10)", border: "#81c784", accent: "#4caf50" },
    evening: { bg: "rgba(255,138,101,0.10)", border: "#ff8a65", accent: "#ff5722" },
    night: { bg: "rgba(149,117,205,0.10)", border: "#9575cd", accent: "#7e57c2" },
  };

  const getStreak = () => { let s = 0, d = todayNum; while (d >= 1 && getCompletion(d) === 100) { s++; d--; } return s; };

  // Shared styles
  const S = {
    page: { minHeight: "100vh", background: "linear-gradient(165deg,#0a0a0f 0%,#0d1117 40%,#111827 100%)", color: "#e2e8f0", fontFamily: "'DM Sans','Segoe UI',sans-serif", position: "relative", overflow: "hidden" },
    glow1: { position: "fixed", top: "-200px", right: "-200px", width: "600px", height: "600px", background: "radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 },
    glow2: { position: "fixed", bottom: "-150px", left: "-150px", width: "500px", height: "500px", background: "radial-gradient(circle,rgba(16,185,129,0.05) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 },
    wrap: { maxWidth: 520, margin: "0 auto", padding: "20px 16px 100px", position: "relative", zIndex: 1 },
    navBtn: { background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, width: 32, height: 32, color: "#94a3b8", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" },
  };

  // Edit modal
  const EditModal = () => {
    if (!editingItem) return null;
    const hasIcon = editingItem.type === "routine" || editingItem.type === "meal";
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setEditingItem(null)}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#1a1a2e", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#e2e8f0" }}>Edit Task</div>
          {hasIcon && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Icon</div>
              <button onClick={() => setShowIconPicker(!showIconPicker)} style={{ fontSize: 28, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px", cursor: "pointer" }}>
                {editIcon || "📝"}
              </button>
              {showIconPicker && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, padding: 8, background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                  {ICON_OPTIONS.map(ic => (
                    <button key={ic} onClick={() => { setEditIcon(ic); setShowIconPicker(false); }} style={{ fontSize: 22, background: editIcon === ic ? "rgba(99,102,241,0.3)" : "transparent", border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}>{ic}</button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Task Name</div>
          <input value={editText} onChange={e => setEditText(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEdit()}
            style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            autoFocus
          />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => setEditingItem(null)} style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button onClick={saveEdit} style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  // Add task modal
  const AddModal = () => {
    if (!addingTo) return null;
    const hasIcon = addingTo.type === "routine" || addingTo.type === "meal";
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setAddingTo(null)}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#1a1a2e", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#e2e8f0" }}>Add New Task</div>
          {hasIcon && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Pick an Icon</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 8, background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                {ICON_OPTIONS.map(ic => (
                  <button key={ic} onClick={() => setNewTaskIcon(ic)} style={{ fontSize: 22, background: newTaskIcon === ic ? "rgba(99,102,241,0.3)" : "transparent", border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}>{ic}</button>
                ))}
              </div>
            </div>
          )}
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Task Name</div>
          <input value={newTaskText} onChange={e => setNewTaskText(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask(addingTo.type, addingTo.category)}
            placeholder="Enter task name..."
            style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            autoFocus
          />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => setAddingTo(null)} style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => addTask(addingTo.type, addingTo.category)} style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={S.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <div style={S.glow1}/><div style={S.glow2}/>
      <EditModal /><AddModal />

      <div style={S.wrap}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 4, color: "#6366f1", textTransform: "uppercase", marginBottom: 6 }}>Daily Discipline</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 2px", background: "linear-gradient(135deg,#e2e8f0,#94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>My Routine Tracker</h1>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            {isToday ? "Today" : formatDate(currentDate)}
            {dayInPlan && <span style={{ color: "#6366f1", marginLeft: 8 }}>• Day {currentDay}/30</span>}
            {!dayInPlan && currentDay > 30 && <span style={{ color: "#10b981", marginLeft: 8 }}>• Ongoing</span>}
          </div>
        </div>

        {/* Week Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, padding: "0 4px" }}>
          <button onClick={() => setWeekOffset(w => w - 1)} style={S.navBtn}>‹</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{weekLabel}</span>
            {weekOffset !== 0 && <button onClick={() => { setWeekOffset(0); setCurrentDay(todayNum); }} style={{ background: "rgba(99,102,241,0.15)", border: "none", borderRadius: 6, padding: "3px 8px", color: "#a5b4fc", cursor: "pointer", fontSize: 10, fontWeight: 600 }}>Today</button>}
          </div>
          <button onClick={() => setWeekOffset(w => w + 1)} style={S.navBtn}>›</button>
        </div>

        {/* Week Selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 18, padding: "0 2px" }}>
          {weekDays.map(({ date, dayNum: dn }) => {
            const dNames = ["M","T","W","T","F","S","S"];
            const dow = date.getDay();
            const comp = getCompletion(dn);
            const isAct = dn === currentDay;
            const isTD = dn === todayNum;
            return (
              <button key={dn} onClick={() => setCurrentDay(dn)} style={{
                border: "none", borderRadius: 12, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, padding: "8px 0", transition: "all 0.2s", position: "relative",
                background: isAct ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : comp === 100 ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.02)",
                color: isAct ? "#fff" : dn > todayNum ? "#475569" : "#94a3b8",
                boxShadow: isAct ? "0 4px 15px rgba(99,102,241,0.25)" : "none",
              }}>
                <span style={{ fontSize: 9, fontWeight: 500, opacity: 0.7 }}>{dNames[dow === 0 ? 6 : dow - 1]}</span>
                <span style={{ fontSize: 16, fontWeight: isAct ? 700 : 500 }}>{date.getDate()}</span>
                {isTD && !isAct && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#6366f1", position: "absolute", bottom: 4 }} />}
                {comp === 100 && !isAct && <span style={{ fontSize: 8, color: "#10b981" }}>✓</span>}
                {comp > 0 && comp < 100 && <div style={{ width: 16, height: 2, borderRadius: 1, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}><div style={{ width: `${comp}%`, height: "100%", background: isAct ? "#fff" : "#6366f1", borderRadius: 1 }} /></div>}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
          <StatBox><div style={{ fontFamily: "'Space Mono'", fontSize: 22, fontWeight: 700, color: "#f59e0b" }}>🔥 {getStreak()}</div><div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>Streak</div></StatBox>
          <StatBox>
            <div style={{ position: "relative", width: 48, height: 48, margin: "0 auto" }}>
              <svg viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}><circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" /><circle cx="24" cy="24" r="20" fill="none" stroke={completion === 100 ? "#10b981" : "#6366f1"} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${completion * 1.256} 125.6`} style={{ transition: "stroke-dasharray 0.5s" }} /></svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono'", fontSize: 11, fontWeight: 700, color: completion === 100 ? "#10b981" : "#e2e8f0" }}>{completion}%</div>
            </div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>Today</div>
          </StatBox>
          <StatBox><div style={{ fontFamily: "'Space Mono'", fontSize: 22, fontWeight: 700, color: workout.rest ? "#10b981" : "#c084fc" }}>{workout.rest ? "😴" : "💪"}</div><div style={{ fontSize: 10, color: "#64748b", marginTop: 2, lineHeight: 1.3 }}>{workout.evening}</div></StatBox>
        </div>

        {/* Action row */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setEditMode(!editMode)} style={{
              background: editMode ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
              border: editMode ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, padding: "5px 12px", color: editMode ? "#a5b4fc" : "#94a3b8", fontSize: 11, cursor: "pointer", fontWeight: 600,
            }}>{editMode ? "✓ Done Editing" : "✏️ Edit Tasks"}</button>
            {editMode && <button onClick={resetAllCustom} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, padding: "5px 10px", color: "#f87171", fontSize: 11, cursor: "pointer", fontWeight: 500 }}>Reset Defaults</button>}
          </div>
          <button onClick={() => resetDay(currentDay)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, padding: "5px 12px", color: "#f87171", fontSize: 11, cursor: "pointer", fontWeight: 500 }}>Reset Day</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {[{ key: "today", label: "My Routine" }, { key: "workout", label: "Workout" }, { key: "diet", label: "Diet & Care" }].map(tab => (
            <button key={tab.key} onClick={() => setView(tab.key)} style={{
              flex: 1, padding: "10px 0", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
              background: view === tab.key ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)",
              color: view === tab.key ? "#a5b4fc" : "#64748b",
              borderBottom: view === tab.key ? "2px solid #6366f1" : "2px solid transparent",
            }}>{tab.label}</button>
          ))}
        </div>

        {/* ===== MY ROUTINE ===== */}
        {view === "today" && <div>
          {["morning", "afternoon", "evening", "night"].map(cat => {
            const items = routine.filter(r => r.category === cat);
            const c = catColors[cat];
            const doneCount = items.filter(it => isChecked(dayKey, it.id)).length;
            return (
              <div key={cat} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, paddingLeft: 4, paddingRight: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, color: c.accent }}>{catLabels[cat]}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 10, color: "#64748b" }}>{doneCount}/{items.length}</div>
                    {editMode && <button onClick={() => { setAddingTo({ type: "routine", category: cat }); setNewTaskText(""); setNewTaskIcon("📝"); }} style={{ background: "rgba(16,185,129,0.15)", border: "none", borderRadius: 6, padding: "2px 8px", color: "#10b981", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>+ Add</button>}
                  </div>
                </div>
                <div style={{ background: c.bg, borderRadius: 14, border: `1px solid ${c.border}22`, overflow: "hidden" }}>
                  {items.map((item, idx) => {
                    const done = isChecked(dayKey, item.id);
                    const globalIdx = routine.indexOf(item);
                    return (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: idx < items.length - 1 ? `1px solid ${c.border}15` : "none", transition: "all 0.15s", opacity: done && !editMode ? 0.45 : 1 }}>
                        {!editMode && <div onClick={() => toggleCheck(dayKey, item.id)} style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, border: done ? "none" : `2px solid ${c.border}55`, background: done ? c.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", fontSize: 12, color: "#fff" }}>{done ? "✓" : ""}</div>}
                        {editMode && <button onClick={() => deleteItem("routine", globalIdx)} style={{ background: "rgba(239,68,68,0.15)", border: "none", borderRadius: 6, width: 22, height: 22, color: "#f87171", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>}
                        <span style={{ fontSize: 17, flexShrink: 0, cursor: editMode ? "pointer" : "default" }} onClick={() => editMode && startEdit("routine", globalIdx, item.label, item.icon)}>{item.icon}</span>
                        <span onClick={() => editMode ? startEdit("routine", globalIdx, item.label, item.icon) : toggleCheck(dayKey, item.id)} style={{ fontSize: 14, fontWeight: 500, textDecoration: done && !editMode ? "line-through" : "none", color: done && !editMode ? "#64748b" : "#e2e8f0", cursor: "pointer", flex: 1 }}>{item.label}</span>
                        {editMode && <span style={{ fontSize: 10, color: "#6366f1", cursor: "pointer", flexShrink: 0 }} onClick={() => startEdit("routine", globalIdx, item.label, item.icon)}>✏️</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>}

        {/* ===== WORKOUT ===== */}
        {view === "workout" && workout && <div>
          {!workout.rest && <>
            <SH title="Morning Cardio" sub="30 min treadmill run" color="#38bdf8" edit={editMode} />
            <WC dayKey={dayKey} itemId="cardio" label="Treadmill – 5 walk / 20 run / 5 cool" checked={isChecked(dayKey, "cardio")} onToggle={() => toggleCheck(dayKey, "cardio")} color="#38bdf8" editMode={editMode} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SH title="Core Circuit × 3 Rounds" sub="" color="#f59e0b" edit={editMode} />
              {editMode && <button onClick={() => { setAddingTo({ type: "core" }); setNewTaskText(""); }} style={{ background: "rgba(16,185,129,0.15)", border: "none", borderRadius: 6, padding: "2px 8px", color: "#10b981", fontSize: 11, cursor: "pointer", fontWeight: 700, marginTop: 12 }}>+ Add</button>}
            </div>
            {coreCircuit.map((ex, i) => (
              <WC key={i} dayKey={dayKey} itemId={`core${i}`} label={ex} checked={isChecked(dayKey, `core${i}`)} onToggle={() => toggleCheck(dayKey, `core${i}`)} color="#f59e0b"
                editMode={editMode} onEdit={() => startEdit("core", i, ex)} onDelete={() => deleteItem("core", i)} />
            ))}
          </>}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <SH title={`Evening – ${workout.evening}`} sub={workout.rest ? "Take it easy" : ""} color={workout.rest ? "#10b981" : "#c084fc"} edit={editMode} onEdit={() => startEdit("workout_title", workoutDayIdx, workout.evening)} />
            {editMode && <button onClick={() => { setAddingTo({ type: "exercise", category: workoutDayIdx }); setNewTaskText(""); }} style={{ background: "rgba(16,185,129,0.15)", border: "none", borderRadius: 6, padding: "2px 8px", color: "#10b981", fontSize: 11, cursor: "pointer", fontWeight: 700, marginTop: 12 }}>+ Add</button>}
          </div>
          {workout.exercises.map((ex, i) => (
            <WC key={i} dayKey={dayKey} itemId={`ex${i}`} label={ex} checked={isChecked(dayKey, `ex${i}`)} onToggle={() => toggleCheck(dayKey, `ex${i}`)} color={workout.rest ? "#10b981" : "#c084fc"}
              editMode={editMode} onEdit={() => startEdit("exercise", 0, ex, null, workoutDayIdx, i)} onDelete={() => deleteItem("exercise", { dayIdx: workoutDayIdx, exIdx: i })} />
          ))}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <SH title="Shoulder Care" sub="Do daily" color="#fb7185" edit={editMode} />
            {editMode && <button onClick={() => { setAddingTo({ type: "shoulder" }); setNewTaskText(""); }} style={{ background: "rgba(16,185,129,0.15)", border: "none", borderRadius: 6, padding: "2px 8px", color: "#10b981", fontSize: 11, cursor: "pointer", fontWeight: 700, marginTop: 12 }}>+ Add</button>}
          </div>
          {shoulderCare.map((ex, i) => (
            <WC key={i} dayKey={dayKey} itemId={`sc${i}`} label={ex} checked={isChecked(dayKey, `sc${i}`)} onToggle={() => toggleCheck(dayKey, `sc${i}`)} color="#fb7185"
              editMode={editMode} onEdit={() => startEdit("shoulder", i, ex)} onDelete={() => deleteItem("shoulder", i)} />
          ))}
        </div>}

        {/* ===== DIET ===== */}
        {view === "diet" && <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <SH title="Diet Plan" sub="120–130g protein" color="#10b981" edit={editMode} />
            {editMode && <button onClick={() => { setAddingTo({ type: "meal" }); setNewTaskText(""); setNewTaskIcon("🍽️"); }} style={{ background: "rgba(16,185,129,0.15)", border: "none", borderRadius: 6, padding: "2px 8px", color: "#10b981", fontSize: 11, cursor: "pointer", fontWeight: 700, marginTop: 12 }}>+ Add</button>}
          </div>
          {meals.map((m, i) => (
            <WC key={m.id} dayKey={dayKey} itemId={m.id} label={`${m.icon} ${m.label}`} checked={isChecked(dayKey, m.id)} onToggle={() => toggleCheck(dayKey, m.id)} color="#10b981"
              editMode={editMode} onEdit={() => startEdit("meal", i, m.label, m.icon)} onDelete={() => deleteItem("meal", i)} />
          ))}

          <SH title="Hydration" sub="3–4 liters daily" color="#38bdf8" />
          <div style={{ background: "rgba(56,189,248,0.06)", borderRadius: 14, padding: 16, border: "1px solid rgba(56,189,248,0.08)", marginBottom: 16 }}>
            {["1L before 11 AM", "1L before 3 PM", "3L before 6 PM"].map((w, i) => (
              <div key={i} onClick={() => toggleCheck(dayKey, `water_d${i}`)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", cursor: "pointer", borderBottom: i < 2 ? "1px solid rgba(56,189,248,0.06)" : "none" }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: isChecked(dayKey, `water_d${i}`) ? "#38bdf8" : "transparent", border: isChecked(dayKey, `water_d${i}`) ? "none" : "2px solid rgba(56,189,248,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }}>{isChecked(dayKey, `water_d${i}`) ? "✓" : ""}</div>
                <span style={{ fontSize: 14, color: "#e2e8f0" }}>💧 {w}</span>
              </div>
            ))}
          </div>

          <SH title="Shoulder Rehab" sub="" color="#fb7185" />
          <div style={{ background: "rgba(251,113,133,0.05)", borderRadius: 14, padding: 16, border: "1px solid rgba(251,113,133,0.08)", fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
            <div style={{ marginBottom: 6, color: "#fb7185", fontWeight: 600, fontSize: 12 }}>⚠️ Avoid:</div>
            Painful pushups, pullups, heavy overhead pressing
            <div style={{ marginTop: 10, color: "#64748b", fontSize: 12 }}>Sleep: 7–8 hrs | Water: 3–4L | Protein: 120–130g</div>
          </div>
        </div>}
      </div>
    </div>
  );
}

function StatBox({ children }) {
  return <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.04)" }}>{children}</div>;
}

function SH({ title, sub, color, edit, onEdit }) {
  return (
    <div style={{ marginBottom: 10, marginTop: 20, paddingLeft: 4, display: "flex", alignItems: "center", gap: 8 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color, letterSpacing: 0.5 }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{sub}</div>}
      </div>
      {edit && onEdit && <span onClick={onEdit} style={{ fontSize: 11, cursor: "pointer", color: "#6366f1" }}>✏️</span>}
    </div>
  );
}

function WC({ dayKey, itemId, label, checked, onToggle, color, editMode, onEdit, onDelete }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
      background: checked && !editMode ? `${color}08` : "rgba(255,255,255,0.02)",
      borderRadius: 10, marginBottom: 4, border: `1px solid ${checked && !editMode ? color + "20" : "rgba(255,255,255,0.04)"}`,
      transition: "all 0.15s", opacity: checked && !editMode ? 0.5 : 1,
    }}>
      {!editMode && <div onClick={onToggle} style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: checked ? "none" : `2px solid ${color}45`, background: checked ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", cursor: "pointer", transition: "all 0.2s" }}>{checked ? "✓" : ""}</div>}
      {editMode && onDelete && <button onClick={onDelete} style={{ background: "rgba(239,68,68,0.15)", border: "none", borderRadius: 6, width: 20, height: 20, color: "#f87171", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>}
      <span onClick={editMode ? onEdit : onToggle} style={{ fontSize: 13, fontWeight: 500, textDecoration: checked && !editMode ? "line-through" : "none", color: checked && !editMode ? "#64748b" : "#e2e8f0", cursor: "pointer", flex: 1 }}>{label}</span>
      {editMode && onEdit && <span onClick={onEdit} style={{ fontSize: 10, cursor: "pointer", color: "#6366f1", flexShrink: 0 }}>✏️</span>}
    </div>
  );
}

export default App;
