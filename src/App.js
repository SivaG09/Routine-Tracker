import React, { useState, useEffect, useCallback } from "react";

const WORKOUT_PLAN_CYCLE = [
  { evening: "Leg Day", exercises: ["Squats – 4×8", "Leg press – 3×10", "Walking lunges – 3×12", "Calf raises – 4×15"] },
  { evening: "Shoulder Rehab + Light Delts", exercises: ["Face pulls – 3×15", "Lateral raises – 3×12", "Band external rotation – 3×15"] },
  { evening: "Arms Focus", exercises: ["Barbell curls – 4×10", "Hammer curls – 3×12", "Cable triceps pushdown – 4×10", "Triceps kickback – 3×12"] },
  { evening: "Football Conditioning", exercises: ["Treadmill sprint intervals – 20 min", "Jump squats – 3×12", "Burpees – 3×10"] },
  { evening: "Rest Day", exercises: ["Foam rolling or mobility work"], rest: true },
  { evening: "Chest + Triceps", exercises: ["Machine chest press – 4×10", "Incline dumbbell press – 3×10", "Chest fly – 3×12", "Triceps rope pushdown – 3×12"] },
  { evening: "Back + Biceps", exercises: ["Lat pulldown – 4×10", "Seated row – 3×10", "Dumbbell row – 3×10", "Barbell curls – 4×10"] },
];

const START_DATE = new Date(2025, 2, 4);

function getDateForDay(dayNum) {
  const d = new Date(START_DATE);
  d.setDate(d.getDate() + dayNum - 1);
  return d;
}

function getDayNum(date) {
  const diff = Math.floor((date - START_DATE) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

function formatDate(d) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

function getWorkoutForDay(dayNum) {
  return WORKOUT_PLAN_CYCLE[((dayNum - 1) % 7)];
}

const PERSONAL_ROUTINE = [
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

const SHOULDER_CARE = ["Band external rotation – 3×15", "Wall slides – 3×12", "Doorway chest stretch – 30s × 3"];
const CORE_CIRCUIT = ["Plank – 45 seconds", "Leg raises – 15 reps", "Russian twists – 20 reps", "Mountain climbers – 30 seconds"];
const STORAGE_KEY = "fitness-tracker-permanent-v3";

function loadState() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { checked: {} };
  } catch { return { checked: {} }; }
}

function App() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayNum = getDayNum(today);

  const [currentDay, setCurrentDay] = useState(todayNum);
  const [view, setView] = useState("today");
  const [state, setState] = useState(loadState);
  const [weekOffset, setWeekOffset] = useState(0);

  const persist = useCallback((newState) => {
    setState(newState);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newState)); } catch (e) { console.error(e); }
  }, []);

  const toggleCheck = (dayKey, itemId) => {
    const key = `${dayKey}:${itemId}`;
    persist({ ...state, checked: { ...state.checked, [key]: !state.checked[key] } });
  };

  const isChecked = (dayKey, itemId) => !!state.checked[`${dayKey}:${itemId}`];

  const getAllItemIds = (dayNum) => {
    const plan = getWorkoutForDay(dayNum);
    const ids = PERSONAL_ROUTINE.map(r => r.id);
    if (!plan.rest) { ids.push("cardio"); CORE_CIRCUIT.forEach((_, i) => ids.push(`core${i}`)); }
    plan.exercises.forEach((_, i) => ids.push(`ex${i}`));
    SHOULDER_CARE.forEach((_, i) => ids.push(`sc${i}`));
    return ids;
  };

  const getCompletionForDay = (dayNum) => {
    const prefix = `day${dayNum}:`;
    const allIds = getAllItemIds(dayNum);
    if (!allIds.length) return 0;
    const done = allIds.filter(id => state.checked[`${prefix}${id}`]).length;
    return Math.round((done / allIds.length) * 100);
  };

  const resetDay = (dayNum) => {
    const prefix = `day${dayNum}:`;
    const newChecked = { ...state.checked };
    Object.keys(newChecked).forEach(k => { if (k.startsWith(prefix)) delete newChecked[k]; });
    persist({ ...state, checked: newChecked });
  };

  const workout = getWorkoutForDay(currentDay);
  const dayKey = `day${currentDay}`;
  const completion = getCompletionForDay(currentDay);
  const currentDate = getDateForDay(currentDay);
  const isToday = currentDay === todayNum;
  const dayInPlan = currentDay >= 1 && currentDay <= 30;

  const getWeekDays = () => {
    const baseDate = new Date(today);
    baseDate.setDate(baseDate.getDate() + (weekOffset * 7));
    const startOfWeek = new Date(baseDate);
    const dow = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - (dow === 0 ? 6 : dow - 1));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek); d.setDate(d.getDate() + i);
      return { date: d, dayNum: getDayNum(d) };
    });
  };

  const weekDays = getWeekDays();
  const weekMonthLabel = (() => {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const f = weekDays[0].date, l = weekDays[6].date;
    if (f.getMonth() === l.getMonth()) return `${months[f.getMonth()]} ${f.getFullYear()}`;
    return `${months[f.getMonth()].slice(0,3)} – ${months[l.getMonth()].slice(0,3)} ${l.getFullYear()}`;
  })();

  const catLabels = { morning: "Morning", afternoon: "Afternoon", evening: "Evening", night: "Night" };
  const catColors = {
    morning: { bg: "rgba(255,183,77,0.10)", border: "#ffb74d", accent: "#ff9800" },
    afternoon: { bg: "rgba(129,199,132,0.10)", border: "#81c784", accent: "#4caf50" },
    evening: { bg: "rgba(255,138,101,0.10)", border: "#ff8a65", accent: "#ff5722" },
    night: { bg: "rgba(149,117,205,0.10)", border: "#9575cd", accent: "#7e57c2" },
  };

  const getStreak = () => {
    let streak = 0, d = todayNum;
    while (d >= 1) { if (getCompletionForDay(d) === 100) { streak++; d--; } else break; }
    return streak;
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(165deg,#0a0a0f 0%,#0d1117 40%,#111827 100%)", color:"#e2e8f0", fontFamily:"'DM Sans','Segoe UI',sans-serif", position:"relative", overflow:"hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <div style={{position:"fixed",top:"-200px",right:"-200px",width:"600px",height:"600px",background:"radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:"-150px",left:"-150px",width:"500px",height:"500px",background:"radial-gradient(circle,rgba(16,185,129,0.05) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      <div style={{maxWidth:520,margin:"0 auto",padding:"20px 16px 100px",position:"relative",zIndex:1}}>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:4,color:"#6366f1",textTransform:"uppercase",marginBottom:6}}>Daily Discipline</div>
          <h1 style={{fontSize:26,fontWeight:700,margin:"0 0 2px",background:"linear-gradient(135deg,#e2e8f0,#94a3b8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>My Routine Tracker</h1>
          <div style={{fontSize:12,color:"#64748b",marginTop:4}}>
            {isToday?"Today":formatDate(currentDate)}
            {dayInPlan&&<span style={{color:"#6366f1",marginLeft:8}}>• Day {currentDay}/30 Plan</span>}
            {!dayInPlan&&currentDay>30&&<span style={{color:"#10b981",marginLeft:8}}>• Ongoing Routine</span>}
          </div>
        </div>

        {/* Week Nav */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6,padding:"0 4px"}}>
          <button onClick={()=>setWeekOffset(w=>w-1)} style={{background:"rgba(255,255,255,0.05)",border:"none",borderRadius:8,width:32,height:32,color:"#94a3b8",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{weekMonthLabel}</span>
            {weekOffset!==0&&<button onClick={()=>{setWeekOffset(0);setCurrentDay(todayNum)}} style={{background:"rgba(99,102,241,0.15)",border:"none",borderRadius:6,padding:"3px 8px",color:"#a5b4fc",cursor:"pointer",fontSize:10,fontWeight:600}}>Today</button>}
          </div>
          <button onClick={()=>setWeekOffset(w=>w+1)} style={{background:"rgba(255,255,255,0.05)",border:"none",borderRadius:8,width:32,height:32,color:"#94a3b8",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
        </div>

        {/* Week Selector */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:18,padding:"0 2px"}}>
          {weekDays.map(({date,dayNum})=>{
            const dayNames=["M","T","W","T","F","S","S"];
            const dow=date.getDay();
            const dayLabel=dayNames[dow===0?6:dow-1];
            const comp=getCompletionForDay(dayNum);
            const isActive=dayNum===currentDay;
            const isTodayDot=dayNum===todayNum;
            const isFuture=dayNum>todayNum;
            return(
              <button key={dayNum} onClick={()=>setCurrentDay(dayNum)} style={{
                border:"none",borderRadius:12,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"8px 0",transition:"all 0.2s",position:"relative",
                background:isActive?"linear-gradient(135deg,#6366f1,#8b5cf6)":comp===100?"rgba(16,185,129,0.12)":"rgba(255,255,255,0.02)",
                color:isActive?"#fff":isFuture?"#475569":"#94a3b8",boxShadow:isActive?"0 4px 15px rgba(99,102,241,0.25)":"none",
              }}>
                <span style={{fontSize:9,fontWeight:500,opacity:0.7}}>{dayLabel}</span>
                <span style={{fontSize:16,fontWeight:isActive?700:500}}>{date.getDate()}</span>
                {isTodayDot&&!isActive&&<div style={{width:4,height:4,borderRadius:"50%",background:"#6366f1",position:"absolute",bottom:4}}/>}
                {comp===100&&!isActive&&<span style={{fontSize:8,color:"#10b981"}}>✓</span>}
                {comp>0&&comp<100&&<div style={{width:16,height:2,borderRadius:1,background:"rgba(255,255,255,0.08)",overflow:"hidden"}}><div style={{width:`${comp}%`,height:"100%",background:isActive?"#fff":"#6366f1",borderRadius:1}}/></div>}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
          <div style={{background:"rgba(255,255,255,0.02)",borderRadius:12,padding:"12px 10px",textAlign:"center",border:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{fontFamily:"'Space Mono'",fontSize:22,fontWeight:700,color:"#f59e0b"}}>🔥 {getStreak()}</div>
            <div style={{fontSize:10,color:"#64748b",marginTop:2}}>Day Streak</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.02)",borderRadius:12,padding:"12px 10px",textAlign:"center",border:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{position:"relative",width:48,height:48,margin:"0 auto"}}>
              <svg viewBox="0 0 48 48" style={{transform:"rotate(-90deg)"}}>
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4"/>
                <circle cx="24" cy="24" r="20" fill="none" stroke={completion===100?"#10b981":"#6366f1"} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${completion*1.256} 125.6`} style={{transition:"stroke-dasharray 0.5s ease"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Mono'",fontSize:11,fontWeight:700,color:completion===100?"#10b981":"#e2e8f0"}}>{completion}%</div>
            </div>
            <div style={{fontSize:10,color:"#64748b",marginTop:2}}>Today</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.02)",borderRadius:12,padding:"12px 10px",textAlign:"center",border:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{fontFamily:"'Space Mono'",fontSize:22,fontWeight:700,color:workout.rest?"#10b981":"#c084fc"}}>{workout.rest?"😴":"💪"}</div>
            <div style={{fontSize:10,color:"#64748b",marginTop:2,lineHeight:1.3}}>{workout.evening}</div>
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
          <button onClick={()=>resetDay(currentDay)} style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:8,padding:"5px 12px",color:"#f87171",fontSize:11,cursor:"pointer",fontWeight:500}}>Reset Day</button>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:18}}>
          {[{key:"today",label:"My Routine"},{key:"workout",label:"Workout"},{key:"diet",label:"Diet & Care"}].map(tab=>(
            <button key={tab.key} onClick={()=>setView(tab.key)} style={{
              flex:1,padding:"10px 0",border:"none",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:600,transition:"all 0.2s",
              background:view===tab.key?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.02)",
              color:view===tab.key?"#a5b4fc":"#64748b",
              borderBottom:view===tab.key?"2px solid #6366f1":"2px solid transparent",
            }}>{tab.label}</button>
          ))}
        </div>

        {/* MY ROUTINE */}
        {view==="today"&&<div>
          {["morning","afternoon","evening","night"].map(cat=>{
            const items=PERSONAL_ROUTINE.filter(r=>r.category===cat);
            const c=catColors[cat];
            const doneCount=items.filter(it=>isChecked(dayKey,it.id)).length;
            return(<div key={cat} style={{marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,paddingLeft:4,paddingRight:4}}>
                <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:2,color:c.accent}}>{catLabels[cat]}</div>
                <div style={{fontSize:10,color:"#64748b"}}>{doneCount}/{items.length}</div>
              </div>
              <div style={{background:c.bg,borderRadius:14,border:`1px solid ${c.border}22`,overflow:"hidden"}}>
                {items.map((item,idx)=>{
                  const done=isChecked(dayKey,item.id);
                  return(<div key={item.id} onClick={()=>toggleCheck(dayKey,item.id)} style={{
                    display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer",
                    borderBottom:idx<items.length-1?`1px solid ${c.border}15`:"none",
                    transition:"all 0.15s",opacity:done?0.45:1,
                  }}>
                    <div style={{width:22,height:22,borderRadius:7,flexShrink:0,border:done?"none":`2px solid ${c.border}55`,background:done?c.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",fontSize:12,color:"#fff"}}>{done?"✓":""}</div>
                    <span style={{fontSize:17,flexShrink:0}}>{item.icon}</span>
                    <span style={{fontSize:14,fontWeight:500,textDecoration:done?"line-through":"none",color:done?"#64748b":"#e2e8f0"}}>{item.label}</span>
                  </div>);
                })}
              </div>
            </div>);
          })}
        </div>}

        {/* WORKOUT */}
        {view==="workout"&&workout&&<div>
          {!workout.rest&&<>
            <SH title="Morning Cardio" sub="30 min treadmill run" color="#38bdf8"/>
            <CC dk={dayKey} id="cardio" label="Treadmill – 5 walk / 20 run / 5 cool" c={isChecked(dayKey,"cardio")} t={()=>toggleCheck(dayKey,"cardio")} color="#38bdf8"/>
            <SH title="Core Circuit × 3 Rounds" sub="" color="#f59e0b"/>
            {CORE_CIRCUIT.map((ex,i)=><CC key={i} dk={dayKey} id={`core${i}`} label={ex} c={isChecked(dayKey,`core${i}`)} t={()=>toggleCheck(dayKey,`core${i}`)} color="#f59e0b"/>)}
          </>}
          <SH title={`Evening – ${workout.evening}`} sub={workout.rest?"Take it easy today":""} color={workout.rest?"#10b981":"#c084fc"}/>
          {workout.exercises.map((ex,i)=><CC key={i} dk={dayKey} id={`ex${i}`} label={ex} c={isChecked(dayKey,`ex${i}`)} t={()=>toggleCheck(dayKey,`ex${i}`)} color={workout.rest?"#10b981":"#c084fc"}/>)}
          <SH title="Shoulder Care" sub="Do daily" color="#fb7185"/>
          {SHOULDER_CARE.map((ex,i)=><CC key={i} dk={dayKey} id={`sc${i}`} label={ex} c={isChecked(dayKey,`sc${i}`)} t={()=>toggleCheck(dayKey,`sc${i}`)} color="#fb7185"/>)}
        </div>}

        {/* DIET */}
        {view==="diet"&&<div>
          <SH title="Diet Plan" sub="120–130g protein target" color="#10b981"/>
          {[{id:"meal1",label:"🍳 Breakfast: 3–4 eggs + oats or chapati"},{id:"meal2",label:"🍱 Lunch: rice/chapati + chicken/fish/paneer + veg"},{id:"meal3",label:"🥜 Snack: fruit + peanuts or sprouts"},{id:"meal4",label:"🥤 Post-workout: egg whites or whey protein"},{id:"meal5",label:"🥗 Dinner: protein + veg + 1 chapati"}].map(m=>
            <CC key={m.id} dk={dayKey} id={m.id} label={m.label} c={isChecked(dayKey,m.id)} t={()=>toggleCheck(dayKey,m.id)} color="#10b981"/>
          )}
          <SH title="Hydration" sub="3–4 liters daily" color="#38bdf8"/>
          <div style={{background:"rgba(56,189,248,0.06)",borderRadius:14,padding:16,border:"1px solid rgba(56,189,248,0.08)",marginBottom:16}}>
            {["1L before 11 AM","1L before 3 PM","3L before 6 PM"].map((w,i)=>
              <div key={i} onClick={()=>toggleCheck(dayKey,`water_d${i}`)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",cursor:"pointer",borderBottom:i<2?"1px solid rgba(56,189,248,0.06)":"none"}}>
                <div style={{width:20,height:20,borderRadius:6,background:isChecked(dayKey,`water_d${i}`)?"#38bdf8":"transparent",border:isChecked(dayKey,`water_d${i}`)?"none":"2px solid rgba(56,189,248,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff"}}>{isChecked(dayKey,`water_d${i}`)?"✓":""}</div>
                <span style={{fontSize:14,color:"#e2e8f0"}}>💧 {w}</span>
              </div>
            )}
          </div>
          <SH title="Shoulder Rehab Reminder" sub="" color="#fb7185"/>
          <div style={{background:"rgba(251,113,133,0.05)",borderRadius:14,padding:16,border:"1px solid rgba(251,113,133,0.08)",fontSize:13,color:"#94a3b8",lineHeight:1.7}}>
            <div style={{marginBottom:6,color:"#fb7185",fontWeight:600,fontSize:12}}>⚠️ Avoid:</div>
            Painful pushups, pullups, heavy overhead pressing
            <div style={{marginTop:10,color:"#64748b",fontSize:12}}>Sleep: 7–8 hrs | Water: 3–4L | Protein: 120–130g</div>
          </div>
        </div>}
      </div>
    </div>
  );
}

function SH({title,sub,color}){
  return(<div style={{marginBottom:10,marginTop:20,paddingLeft:4}}>
    <div style={{fontSize:13,fontWeight:700,color,letterSpacing:0.5}}>{title}</div>
    {sub&&<div style={{fontSize:11,color:"#64748b",marginTop:2}}>{sub}</div>}
  </div>);
}

function CC({dk,id,label,c,t,color}){
  return(<div onClick={t} style={{
    display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
    background:c?`${color}08`:"rgba(255,255,255,0.02)",borderRadius:10,marginBottom:4,cursor:"pointer",
    border:`1px solid ${c?color+"20":"rgba(255,255,255,0.04)"}`,transition:"all 0.15s",opacity:c?0.5:1,
  }}>
    <div style={{width:20,height:20,borderRadius:6,flexShrink:0,border:c?"none":`2px solid ${color}45`,background:c?color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",transition:"all 0.2s"}}>{c?"✓":""}</div>
    <span style={{fontSize:13,fontWeight:500,textDecoration:c?"line-through":"none",color:c?"#64748b":"#e2e8f0"}}>{label}</span>
  </div>);
}

export default App;
