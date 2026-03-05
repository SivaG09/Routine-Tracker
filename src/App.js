import React, { useState, useEffect, useCallback, useRef } from "react";

// ============== DEFAULT MASTER LIBRARY ==============
const DEFAULT_LIBRARY = {
  routine: [
    { id: "r1", label: "Morning Abs Workout", icon: "🔥", slot: "morning" },
    { id: "r2", label: "Face Wash / Cleanser", icon: "🧴", slot: "morning" },
    { id: "r3", label: "Moisturizer + Sunscreen", icon: "☀️", slot: "morning" },
    { id: "r4", label: "Black Coffee + 4 Eggs", icon: "☕", slot: "morning" },
    { id: "r5", label: "1L Water before 11 AM", icon: "💧", slot: "morning" },
    { id: "r6", label: "Proper Lunch", icon: "🍱", slot: "afternoon" },
    { id: "r7", label: "30 Min Table Tennis", icon: "🏓", slot: "afternoon" },
    { id: "r8", label: "1L Water before 3 PM", icon: "💧", slot: "afternoon" },
    { id: "r9", label: "Black Coffee (Evening)", icon: "☕", slot: "evening" },
    { id: "r10", label: "3L Water before 6 PM", icon: "💧", slot: "evening" },
    { id: "r11", label: "Dinner – Protein + Shake", icon: "🥩", slot: "night" },
    { id: "r12", label: "Daily Updates", icon: "📋", slot: "night" },
    { id: "r13", label: "New Learning – STM", icon: "📘", slot: "night" },
    { id: "r14", label: "New Learning – Govt Exams", icon: "📕", slot: "night" },
    { id: "r15", label: "Beard Wash / Oil", icon: "🧔", slot: "night" },
    { id: "r16", label: "Beard Comb & Shape", icon: "✂️", slot: "night" },
    { id: "r17", label: "Night Face Wash + Serum", icon: "🌙", slot: "night" },
  ],
  workout: [
    { id: "w1", label: "Treadmill Run – 30 min", icon: "🏃", slot: "morning" },
    { id: "w2", label: "Plank – 45 seconds", icon: "💪", slot: "morning" },
    { id: "w3", label: "Leg raises – 15 reps", icon: "💪", slot: "morning" },
    { id: "w4", label: "Russian twists – 20 reps", icon: "💪", slot: "morning" },
    { id: "w5", label: "Mountain climbers – 30 sec", icon: "💪", slot: "morning" },
    { id: "w6", label: "Squats – 4×8", icon: "🦵", slot: "evening" },
    { id: "w7", label: "Leg press – 3×10", icon: "🦵", slot: "evening" },
    { id: "w8", label: "Walking lunges – 3×12", icon: "🦵", slot: "evening" },
    { id: "w9", label: "Calf raises – 4×15", icon: "🦵", slot: "evening" },
    { id: "w10", label: "Face pulls – 3×15", icon: "🏋️", slot: "evening" },
    { id: "w11", label: "Lateral raises – 3×12", icon: "🏋️", slot: "evening" },
    { id: "w12", label: "Band external rotation – 3×15", icon: "🏋️", slot: "evening" },
    { id: "w13", label: "Barbell curls – 4×10", icon: "💪", slot: "evening" },
    { id: "w14", label: "Hammer curls – 3×12", icon: "💪", slot: "evening" },
    { id: "w15", label: "Cable triceps pushdown – 4×10", icon: "💪", slot: "evening" },
    { id: "w16", label: "Triceps kickback – 3×12", icon: "💪", slot: "evening" },
    { id: "w17", label: "Sprint intervals – 20 min", icon: "⚡", slot: "evening" },
    { id: "w18", label: "Jump squats – 3×12", icon: "⚡", slot: "evening" },
    { id: "w19", label: "Burpees – 3×10", icon: "⚡", slot: "evening" },
    { id: "w20", label: "Machine chest press – 4×10", icon: "🏋️", slot: "evening" },
    { id: "w21", label: "Incline dumbbell press – 3×10", icon: "🏋️", slot: "evening" },
    { id: "w22", label: "Chest fly – 3×12", icon: "🏋️", slot: "evening" },
    { id: "w23", label: "Triceps rope pushdown – 3×12", icon: "🏋️", slot: "evening" },
    { id: "w24", label: "Lat pulldown – 4×10", icon: "🏋️", slot: "evening" },
    { id: "w25", label: "Seated row – 3×10", icon: "🏋️", slot: "evening" },
    { id: "w26", label: "Dumbbell row – 3×10", icon: "🏋️", slot: "evening" },
    { id: "w27", label: "Foam rolling / mobility", icon: "🧘", slot: "evening" },
    { id: "w28", label: "Wall slides – 3×12", icon: "🏋️", slot: "evening" },
    { id: "w29", label: "Doorway chest stretch – 30s×3", icon: "🏋️", slot: "evening" },
  ],
  diet: [
    { id: "d1", label: "Breakfast: 3–4 eggs + oats/chapati", icon: "🍳", slot: "morning" },
    { id: "d2", label: "Lunch: rice/chapati + chicken/paneer + veg", icon: "🍱", slot: "afternoon" },
    { id: "d3", label: "Snack: fruit + peanuts/sprouts", icon: "🥜", slot: "afternoon" },
    { id: "d4", label: "Post-workout: egg whites or whey", icon: "🥤", slot: "evening" },
    { id: "d5", label: "Dinner: protein + veg + 1 chapati", icon: "🥗", slot: "night" },
  ],
};

// ============== DEFAULT TEMPLATES ==============
const DEFAULT_TEMPLATES = [
  { id: "t1", name: "🦵 Leg Day", taskIds: ["r1","r2","r3","r4","r5","w1","w2","w3","w4","w5","r6","r7","r8","r9","r10","w6","w7","w8","w9","w12","w28","w29","d1","d2","d3","d4","d5","r11","r12","r13","r14","r15","r16","r17"] },
  { id: "t2", name: "💪 Arm Day", taskIds: ["r1","r2","r3","r4","r5","w1","w2","w3","w4","w5","r6","r7","r8","r9","r10","w13","w14","w15","w16","w12","w28","w29","d1","d2","d3","d4","d5","r11","r12","r13","r14","r15","r16","r17"] },
  { id: "t3", name: "🏋️ Chest + Triceps", taskIds: ["r1","r2","r3","r4","r5","w1","w2","w3","w4","w5","r6","r7","r8","r9","r10","w20","w21","w22","w23","w12","w28","w29","d1","d2","d3","d4","d5","r11","r12","r13","r14","r15","r16","r17"] },
  { id: "t4", name: "🏋️ Back + Biceps", taskIds: ["r1","r2","r3","r4","r5","w1","w2","w3","w4","w5","r6","r7","r8","r9","r10","w24","w25","w26","w13","w12","w28","w29","d1","d2","d3","d4","d5","r11","r12","r13","r14","r15","r16","r17"] },
  { id: "t5", name: "🏃 Football Conditioning", taskIds: ["r1","r2","r3","r4","r5","w1","w2","w3","w4","w5","r6","r7","r8","r9","r10","w17","w18","w19","w12","w28","w29","d1","d2","d3","d4","d5","r11","r12","r13","r14","r15","r16","r17"] },
  { id: "t6", name: "🩹 Shoulder Rehab", taskIds: ["r1","r2","r3","r4","r5","r6","r7","r8","r9","r10","w10","w11","w12","w28","w29","d1","d2","d3","d4","d5","r11","r12","r13","r14","r15","r16","r17"] },
  { id: "t7", name: "😴 Rest Day", taskIds: ["r1","r2","r3","r4","r5","r6","r7","r8","r9","r10","w27","d1","d2","d3","d5","r11","r12","r13","r14","r15","r16","r17"] },
  { id: "t8", name: "📋 Routine Only", taskIds: ["r1","r2","r3","r4","r5","r6","r7","r8","r9","r10","r11","r12","r13","r14","r15","r16","r17"] },
];

const ICONS = ["🔥","💪","🧴","☀️","☕","💧","🍱","🏓","🏋️","🥩","📋","📘","📕","🧔","✂️","🌙","🍳","🥜","🥤","🥗","⚡","🎯","🏃","🧘","💊","🫀","🧠","📝","💤","🚿","🦷","👔","📱","🎧","🌿","❤️","🦵","🏊","⚽","🎾","🚴","🥊","🧹","💻","📖"];
const SLOTS = { morning: { label: "Morning", color: "#ff9800", bg: "rgba(255,183,77,0.10)", border: "#ffb74d" }, afternoon: { label: "Afternoon", color: "#4caf50", bg: "rgba(129,199,132,0.10)", border: "#81c784" }, evening: { label: "Evening", color: "#ff5722", bg: "rgba(255,138,101,0.10)", border: "#ff8a65" }, night: { label: "Night", color: "#7e57c2", bg: "rgba(149,117,205,0.10)", border: "#9575cd" } };
const CATS = { routine: { label: "Daily Routine", color: "#6366f1" }, workout: { label: "Workouts", color: "#f59e0b" }, diet: { label: "Diet & Nutrition", color: "#10b981" } };

const STORE = { lib: "rt-library-v5", templates: "rt-templates-v5", days: "rt-days-v5", checked: "rt-checked-v5", notif: "rt-notif-v5" };

function load(key, fallback) { try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; } }
function save(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error(e); } }
function uid() { return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }
function dateKey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }

function App() {
  const today = new Date(); today.setHours(0,0,0,0);
  const todayKey = dateKey(today);

  const [library, setLibrary] = useState(() => load(STORE.lib, DEFAULT_LIBRARY));
  const [templates, setTemplates] = useState(() => load(STORE.templates, DEFAULT_TEMPLATES));
  const [dayPlans, setDayPlans] = useState(() => load(STORE.days, {}));
  const [checked, setChecked] = useState(() => load(STORE.checked, {}));
  const [notifEnabled, setNotifEnabled] = useState(() => load(STORE.notif, false));

  const [view, setView] = useState("today");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerCat, setPickerCat] = useState("routine");
  const [editModal, setEditModal] = useState(null);
  const [editText, setEditText] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editSlot, setEditSlot] = useState("morning");
  const [showIconPick, setShowIconPick] = useState(false);
  const [libEditMode, setLibEditMode] = useState(false);
  const [addingToLib, setAddingToLib] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [templateEdit, setTemplateEdit] = useState(null);

  useEffect(() => { save(STORE.lib, library); }, [library]);
  useEffect(() => { save(STORE.templates, templates); }, [templates]);
  useEffect(() => { save(STORE.days, dayPlans); }, [dayPlans]);
  useEffect(() => { save(STORE.checked, checked); }, [checked]);
  useEffect(() => { save(STORE.notif, notifEnabled); }, [notifEnabled]);

  // 8 AM notification
  useEffect(() => {
    if (!notifEnabled) return;
    const checkTime = () => {
      const now = new Date();
      if (now.getHours() === 8 && now.getMinutes() === 0) {
        if ("Notification" in window && Notification.permission === "granted") {
          const dk = dateKey(now);
          if (!dayPlans[dk] || dayPlans[dk].length === 0) {
            new Notification("🎯 Plan Your Day!", { body: "Set up your to-do list for today", icon: "/icon-192.png" });
          }
        }
      }
    };
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [notifEnabled, dayPlans]);

  const enableNotif = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        setNotifEnabled(true);
        new Notification("✅ Reminders enabled!", { body: "You'll get a reminder at 8 AM daily to plan your day" });
      }
    }
  };

  // All library tasks flat
  const allTasks = [...(library.routine || []), ...(library.workout || []), ...(library.diet || [])];
  const getTask = (id) => allTasks.find(t => t.id === id);

  // Day plan operations
  const todayPlan = dayPlans[selectedDate] || [];
  const setTodayPlan = (plan) => setDayPlans({ ...dayPlans, [selectedDate]: plan });

  const addToPlan = (taskId) => {
    if (!todayPlan.includes(taskId)) setTodayPlan([...todayPlan, taskId]);
  };
  const removeFromPlan = (taskId) => setTodayPlan(todayPlan.filter(id => id !== taskId));
  const applyTemplate = (tpl) => {
    const validIds = tpl.taskIds.filter(id => getTask(id));
    setTodayPlan([...new Set([...todayPlan, ...validIds])]);
  };
  const clearPlan = () => { if (window.confirm("Clear all tasks for this day?")) setTodayPlan([]); };

  const toggleCheck = (taskId) => {
    const key = `${selectedDate}:${taskId}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const isChecked = (taskId) => !!checked[`${selectedDate}:${taskId}`];

  const getCompletion = (dk) => {
    const plan = dayPlans[dk] || [];
    if (!plan.length) return -1;
    const done = plan.filter(id => checked[`${dk}:${id}`]).length;
    return Math.round((done / plan.length) * 100);
  };

  // Library operations
  const addToLibrary = (cat, task) => {
    setLibrary({ ...library, [cat]: [...(library[cat] || []), { id: uid(), ...task }] });
  };
  const updateInLibrary = (cat, id, updates) => {
    setLibrary({ ...library, [cat]: library[cat].map(t => t.id === id ? { ...t, ...updates } : t) });
  };
  const deleteFromLibrary = (cat, id) => {
    if (window.confirm("Delete this task from library?")) {
      setLibrary({ ...library, [cat]: library[cat].filter(t => t.id !== id) });
    }
  };

  // Week nav
  const getWeekDays = () => {
    const base = new Date(today); base.setDate(base.getDate() + weekOffset * 7);
    const start = new Date(base); const dow = start.getDay();
    start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1));
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
  };
  const weekDays = getWeekDays();
  const weekLabel = (() => {
    const ms = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const f = weekDays[0], l = weekDays[6];
    return f.getMonth() === l.getMonth() ? `${ms[f.getMonth()]} ${f.getFullYear()}` : `${ms[f.getMonth()].slice(0,3)} – ${ms[l.getMonth()].slice(0,3)} ${l.getFullYear()}`;
  })();

  const getStreak = () => {
    let s = 0; const d = new Date(today);
    while (true) {
      const comp = getCompletion(dateKey(d));
      if (comp === 100) { s++; d.setDate(d.getDate() - 1); } else break;
    }
    return s;
  };

  const completion = getCompletion(selectedDate);
  const isToday = selectedDate === todayKey;
  const selDate = new Date(selectedDate + "T00:00:00");

  const formatD = (d) => {
    const ms = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const ws = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    return `${ws[d.getDay()]}, ${ms[d.getMonth()]} ${d.getDate()}`;
  };

  // ============== RENDER ==============
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(165deg,#0a0a0f 0%,#0d1117 40%,#111827 100%)", color: "#e2e8f0", fontFamily: "'DM Sans','Segoe UI',sans-serif", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", top: "-200px", right: "-200px", width: "600px", height: "600px", background: "radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Edit Modal */}
      {editModal && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setEditModal(null)}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#1a1a2e", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{editModal.mode === "add" ? "Add New Task" : "Edit Task"}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Icon</div>
          <button onClick={() => setShowIconPick(!showIconPick)} style={{ fontSize: 28, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px", cursor: "pointer", marginBottom: 8 }}>{editIcon}</button>
          {showIconPick && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12, padding: 8, background: "rgba(255,255,255,0.03)", borderRadius: 10, maxHeight: 120, overflowY: "auto" }}>
            {ICONS.map(ic => <button key={ic} onClick={() => { setEditIcon(ic); setShowIconPick(false); }} style={{ fontSize: 20, background: editIcon === ic ? "rgba(99,102,241,0.3)" : "transparent", border: "none", borderRadius: 6, padding: 3, cursor: "pointer" }}>{ic}</button>)}
          </div>}
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Task Name</div>
          <input value={editText} onChange={e => setEditText(e.target.value)} style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} autoFocus />
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Time Slot</div>
          <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
            {Object.entries(SLOTS).map(([k, v]) => <button key={k} onClick={() => setEditSlot(k)} style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", background: editSlot === k ? `${v.color}30` : "rgba(255,255,255,0.03)", color: editSlot === k ? v.color : "#64748b" }}>{v.label}</button>)}
          </div>
          {editModal.mode === "add" && <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Category</div>
            <div style={{ display: "flex", gap: 4 }}>
              {Object.entries(CATS).map(([k, v]) => <button key={k} onClick={() => setAddingToLib(k)} style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", background: addingToLib === k ? `${v.color}30` : "rgba(255,255,255,0.03)", color: addingToLib === k ? v.color : "#64748b" }}>{v.label}</button>)}
            </div>
          </div>}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setEditModal(null)} style={{ flex: 1, padding: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => {
              if (!editText.trim()) return;
              if (editModal.mode === "add") {
                addToLibrary(addingToLib || "routine", { label: editText.trim(), icon: editIcon, slot: editSlot });
              } else {
                updateInLibrary(editModal.cat, editModal.id, { label: editText.trim(), icon: editIcon, slot: editSlot });
              }
              setEditModal(null);
            }} style={{ flex: 1, padding: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {editModal.mode === "add" ? "Add" : "Save"}
            </button>
          </div>
        </div>
      </div>}

      {/* Task Picker Drawer */}
      {showPicker && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 150 }} onClick={() => setShowPicker(false)}>
        <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 0, left: 0, right: 0, maxHeight: "80vh", background: "#13131f", borderRadius: "20px 20px 0 0", padding: "20px 16px", overflowY: "auto", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Add Tasks</div>
            <button onClick={() => setShowPicker(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 20, cursor: "pointer" }}>✕</button>
          </div>

          {/* Templates */}
          <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Quick Templates</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {templates.map(tpl => <button key={tpl.id} onClick={() => { applyTemplate(tpl); }} style={{ padding: "6px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#a5b4fc", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{tpl.name}</button>)}
          </div>

          {/* Search */}
          <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search tasks..." style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            {Object.entries(CATS).map(([k, v]) => <button key={k} onClick={() => setPickerCat(k)} style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", background: pickerCat === k ? `${v.color}25` : "rgba(255,255,255,0.03)", color: pickerCat === k ? v.color : "#64748b" }}>{v.label}</button>)}
          </div>

          {/* Task list */}
          {(library[pickerCat] || []).filter(t => !searchText || t.label.toLowerCase().includes(searchText.toLowerCase())).map(task => {
            const inPlan = todayPlan.includes(task.id);
            return (
              <div key={task.id} onClick={() => inPlan ? removeFromPlan(task.id) : addToPlan(task.id)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 3, borderRadius: 10, cursor: "pointer",
                background: inPlan ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${inPlan ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.04)"}`,
              }}>
                <div style={{ width: 22, height: 22, borderRadius: 7, border: inPlan ? "none" : "2px solid rgba(255,255,255,0.15)", background: inPlan ? "#10b981" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>{inPlan ? "✓" : ""}</div>
                <span style={{ fontSize: 15 }}>{task.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0", flex: 1 }}>{task.label}</span>
                <span style={{ fontSize: 9, color: SLOTS[task.slot]?.color || "#64748b", background: `${SLOTS[task.slot]?.color || "#64748b"}20`, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>{SLOTS[task.slot]?.label}</span>
              </div>
            );
          })}
        </div>
      </div>}

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px 100px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 4, color: "#6366f1", textTransform: "uppercase", marginBottom: 6 }}>Daily Discipline</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 2px", background: "linear-gradient(135deg,#e2e8f0,#94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>My Routine Tracker</h1>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            {isToday ? "Today" : formatD(selDate)}
            {todayPlan.length > 0 && <span style={{ color: "#10b981", marginLeft: 8 }}>• {todayPlan.length} tasks</span>}
            {todayPlan.length === 0 && <span style={{ color: "#f59e0b", marginLeft: 8 }}>• No plan set</span>}
          </div>
        </div>

        {/* Week Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, padding: "0 4px" }}>
          <button onClick={() => setWeekOffset(w => w - 1)} style={{ background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, width: 32, height: 32, color: "#94a3b8", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{weekLabel}</span>
            {weekOffset !== 0 && <button onClick={() => { setWeekOffset(0); setSelectedDate(todayKey); }} style={{ background: "rgba(99,102,241,0.15)", border: "none", borderRadius: 6, padding: "3px 8px", color: "#a5b4fc", cursor: "pointer", fontSize: 10, fontWeight: 600 }}>Today</button>}
          </div>
          <button onClick={() => setWeekOffset(w => w + 1)} style={{ background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, width: 32, height: 32, color: "#94a3b8", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        </div>

        {/* Week Selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 18 }}>
          {weekDays.map(d => {
            const dk = dateKey(d); const dNames = ["M","T","W","T","F","S","S"];
            const dow = d.getDay(); const comp = getCompletion(dk);
            const isAct = dk === selectedDate; const isTD = dk === todayKey;
            return (
              <button key={dk} onClick={() => setSelectedDate(dk)} style={{
                border: "none", borderRadius: 12, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, padding: "8px 0", transition: "all 0.2s", position: "relative",
                background: isAct ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : comp === 100 ? "rgba(16,185,129,0.12)" : comp >= 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.01)",
                color: isAct ? "#fff" : "#94a3b8", boxShadow: isAct ? "0 4px 15px rgba(99,102,241,0.25)" : "none",
              }}>
                <span style={{ fontSize: 9, fontWeight: 500, opacity: 0.7 }}>{dNames[dow === 0 ? 6 : dow - 1]}</span>
                <span style={{ fontSize: 16, fontWeight: isAct ? 700 : 500 }}>{d.getDate()}</span>
                {isTD && !isAct && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#6366f1", position: "absolute", bottom: 4 }} />}
                {comp === 100 && !isAct && <span style={{ fontSize: 8, color: "#10b981" }}>✓</span>}
                {comp > 0 && comp < 100 && <div style={{ width: 16, height: 2, borderRadius: 1, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}><div style={{ width: `${comp}%`, height: "100%", background: isAct ? "#fff" : "#6366f1", borderRadius: 1 }} /></div>}
                {comp === -1 && !isAct && <span style={{ fontSize: 7, color: "#475569" }}>—</span>}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 22, fontWeight: 700, color: "#f59e0b" }}>🔥 {getStreak()}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>Streak</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ position: "relative", width: 48, height: 48, margin: "0 auto" }}>
              <svg viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}><circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" /><circle cx="24" cy="24" r="20" fill="none" stroke={completion === 100 ? "#10b981" : completion >= 0 ? "#6366f1" : "#333"} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${Math.max(0, completion) * 1.256} 125.6`} style={{ transition: "stroke-dasharray 0.5s" }} /></svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono'", fontSize: 11, fontWeight: 700, color: completion === 100 ? "#10b981" : "#e2e8f0" }}>{completion >= 0 ? `${completion}%` : "—"}</div>
            </div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>Progress</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 22, fontWeight: 700, color: "#c084fc" }}>{todayPlan.filter(id => isChecked(id)).length}/{todayPlan.length}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>Done</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {[{ k: "today", l: "Today's Plan" }, { k: "library", l: "Task Library" }, { k: "settings", l: "Settings" }].map(t => (
            <button key={t.k} onClick={() => setView(t.k)} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 600, background: view === t.k ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)", color: view === t.k ? "#a5b4fc" : "#64748b", borderBottom: view === t.k ? "2px solid #6366f1" : "2px solid transparent" }}>{t.l}</button>
          ))}
        </div>

        {/* ===== TODAY'S PLAN ===== */}
        {view === "today" && <div>
          {/* Action buttons */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            <button onClick={() => setShowPicker(true)} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>+ Add Tasks</button>
            {todayPlan.length > 0 && <button onClick={clearPlan} style={{ padding: "12px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, color: "#f87171", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Clear</button>}
          </div>

          {todayPlan.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: "#64748b" }}>No tasks planned yet</div>
            <div style={{ fontSize: 12 }}>Tap "Add Tasks" to pick from your library or use a template</div>
          </div>}

          {/* Grouped by time slot */}
          {todayPlan.length > 0 && ["morning", "afternoon", "evening", "night"].map(slot => {
            const slotTasks = todayPlan.map(id => getTask(id)).filter(t => t && t.slot === slot);
            if (!slotTasks.length) return null;
            const s = SLOTS[slot];
            const doneCount = slotTasks.filter(t => isChecked(t.id)).length;
            return (
              <div key={slot} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, paddingLeft: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, color: s.color }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>{doneCount}/{slotTasks.length}</div>
                </div>
                <div style={{ background: s.bg, borderRadius: 14, border: `1px solid ${s.border}22`, overflow: "hidden" }}>
                  {slotTasks.map((task, idx) => {
                    const done = isChecked(task.id);
                    return (
                      <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: idx < slotTasks.length - 1 ? `1px solid ${s.border}15` : "none", opacity: done ? 0.45 : 1, transition: "all 0.15s" }}>
                        <div onClick={() => toggleCheck(task.id)} style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, border: done ? "none" : `2px solid ${s.border}55`, background: done ? s.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, color: "#fff" }}>{done ? "✓" : ""}</div>
                        <span style={{ fontSize: 17, flexShrink: 0 }}>{task.icon}</span>
                        <span onClick={() => toggleCheck(task.id)} style={{ fontSize: 14, fontWeight: 500, textDecoration: done ? "line-through" : "none", color: done ? "#64748b" : "#e2e8f0", cursor: "pointer", flex: 1 }}>{task.label}</span>
                        <button onClick={() => removeFromPlan(task.id)} style={{ background: "none", border: "none", color: "#475569", fontSize: 14, cursor: "pointer", padding: 4, flexShrink: 0 }}>✕</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>}

        {/* ===== TASK LIBRARY ===== */}
        {view === "library" && <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <button onClick={() => { setEditModal({ mode: "add" }); setEditText(""); setEditIcon("📝"); setEditSlot("morning"); setAddingToLib("routine"); setShowIconPick(false); }} style={{ padding: "10px 16px", background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 10, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ New Task</button>
            <button onClick={() => setLibEditMode(!libEditMode)} style={{ padding: "8px 14px", background: libEditMode ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)", border: libEditMode ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: libEditMode ? "#a5b4fc" : "#94a3b8", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>{libEditMode ? "✓ Done" : "✏️ Edit"}</button>
          </div>

          {Object.entries(CATS).map(([cat, info]) => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: info.color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, paddingLeft: 4 }}>
                {info.label} ({(library[cat] || []).length})
              </div>
              {(library[cat] || []).map(task => (
                <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 3, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  {libEditMode && <button onClick={() => deleteFromLibrary(cat, task.id)} style={{ background: "rgba(239,68,68,0.15)", border: "none", borderRadius: 6, width: 20, height: 20, color: "#f87171", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>}
                  <span style={{ fontSize: 16 }}>{task.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0", flex: 1 }}>{task.label}</span>
                  <span style={{ fontSize: 9, color: SLOTS[task.slot]?.color, background: `${SLOTS[task.slot]?.color}20`, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>{SLOTS[task.slot]?.label}</span>
                  {libEditMode && <button onClick={() => { setEditModal({ mode: "edit", cat, id: task.id }); setEditText(task.label); setEditIcon(task.icon); setEditSlot(task.slot); setShowIconPick(false); }} style={{ background: "none", border: "none", color: "#6366f1", fontSize: 12, cursor: "pointer" }}>✏️</button>}
                </div>
              ))}
            </div>
          ))}

          <button onClick={() => {
            if (window.confirm("Reset library to defaults? This won't affect your daily plans.")) {
              setLibrary(DEFAULT_LIBRARY); setTemplates(DEFAULT_TEMPLATES);
            }
          }} style={{ width: "100%", padding: 12, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 10, color: "#f87171", fontSize: 12, cursor: "pointer", fontWeight: 500, marginTop: 10 }}>Reset Library to Defaults</button>
        </div>}

        {/* ===== SETTINGS ===== */}
        {view === "settings" && <div>
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.05)", padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>🔔 Daily Reminder</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>Get a notification at 8 AM to set your daily plan</div>
            <button onClick={notifEnabled ? () => setNotifEnabled(false) : enableNotif} style={{
              padding: "10px 20px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
              background: notifEnabled ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: notifEnabled ? "#10b981" : "#fff",
            }}>{notifEnabled ? "✓ Enabled — Tap to Disable" : "Enable Notifications"}</button>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.05)", padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>📋 Templates</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>Quick presets to load tasks for the day</div>
            {templates.map(tpl => (
              <div key={tpl.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{tpl.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{tpl.taskIds.length} tasks</div>
                </div>
                <button onClick={() => applyTemplate(tpl)} style={{ padding: "6px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#a5b4fc", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Apply Today</button>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.05)", padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>💡 How It Works</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.8 }}>
              <strong style={{ color: "#a5b4fc" }}>Task Library</strong> — Your master collection of all tasks. Add workouts, habits, meals — anything.<br/>
              <strong style={{ color: "#a5b4fc" }}>Today's Plan</strong> — Each day, pick tasks from the library or use a template. Check them off as you go.<br/>
              <strong style={{ color: "#a5b4fc" }}>Templates</strong> — One-tap presets like "Leg Day" or "Rest Day" that add a bunch of tasks at once.<br/>
              <strong style={{ color: "#a5b4fc" }}>Reminder</strong> — Get a 8 AM notification to plan your day.
            </div>
          </div>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 11, color: "#374151" }}>
            My Routine Tracker v2.0 • Built with ❤️
          </div>
        </div>}
      </div>
    </div>
  );
}

export default App;