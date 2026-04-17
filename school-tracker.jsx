import { useState, useEffect, useRef } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SCHOOLS = [
  { id: "s1", name: "Delhi Public School", code: "DPS2024", password: "dps123" },
  { id: "s2", name: "Kendriya Vidyalaya", code: "KV2024", password: "kv123" },
];

const TEACHERS = [
  { id: "t1", name: "Mrs. Priya Sharma", subject: "Mathematics", classId: "c1", schoolId: "s1", password: "teacher1" },
  { id: "t2", name: "Mr. Rajan Verma", subject: "Science", classId: "c2", schoolId: "s1", password: "teacher2" },
];

const CLASSES = [
  { id: "c1", name: "Class 5A", grade: "5", section: "A", schoolId: "s1", teacherId: "t1" },
  { id: "c2", name: "Class 6B", grade: "6", section: "B", schoolId: "s1", teacherId: "t2" },
];

const STUDENTS_INIT = [
  { id: "st1", name: "Aarav Gupta", rollNo: "01", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 88, science: 92, english: 79, hindi: 85, avg: 86 },
    attendance: 94, parentId: "p1" },
  { id: "st2", name: "Diya Sharma", rollNo: "02", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 95, science: 88, english: 91, hindi: 90, avg: 91 },
    attendance: 98, parentId: "p2" },
  { id: "st3", name: "Rohan Patel", rollNo: "03", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 72, science: 68, english: 75, hindi: 70, avg: 71 },
    attendance: 87, parentId: "p3" },
  { id: "st4", name: "Ananya Singh", rollNo: "04", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 83, science: 90, english: 87, hindi: 88, avg: 87 },
    attendance: 96, parentId: "p4" },
  { id: "st5", name: "Kabir Mehta", rollNo: "05", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 65, science: 70, english: 68, hindi: 72, avg: 69 },
    attendance: 82, parentId: "p5" },
  { id: "st6", name: "Sneha Joshi", rollNo: "06", classId: "c2", schoolId: "s1", photo: null,
    performance: { math: 91, science: 94, english: 89, hindi: 93, avg: 92 },
    attendance: 99, parentId: "p6" },
];

const PARENTS_INIT = [
  { id: "p1", name: "Mr. Vikram Gupta", studentId: "st1", phone: "9876543210", password: "parent1" },
  { id: "p2", name: "Mrs. Kavya Sharma", studentId: "st2", phone: "9876543211", password: "parent2" },
  { id: "p3", name: "Mr. Suresh Patel", studentId: "st3", phone: "9876543212", password: "parent3" },
  { id: "p4", name: "Mrs. Priya Singh", studentId: "st4", phone: "9876543213", password: "parent4" },
  { id: "p5", name: "Mr. Ajay Mehta", studentId: "st5", phone: "9876543214", password: "parent5" },
  { id: "p6", name: "Mrs. Neha Joshi", studentId: "st6", phone: "9876543215", password: "parent6" },
];

const STAFF_INIT = [
  { id: "sf1", name: "Mr. Deepak Rao",      role: "Vice Principal",    dept: "Administration", schoolId: "s1", password: "staff1" },
  { id: "sf2", name: "Mrs. Sunita Kumari",  role: "Lab Assistant",     dept: "Science",        schoolId: "s1", password: "staff2" },
  { id: "sf3", name: "Mr. Ramesh Gupta",    role: "Office Clerk",      dept: "Administration", schoolId: "s1", password: "staff3" },
  { id: "sf4", name: "Mrs. Anita Devi",     role: "Librarian",         dept: "Library",        schoolId: "s1", password: "staff4" },
  { id: "sf5", name: "Mr. Sunil Sharma",    role: "Peon",              dept: "Support",        schoolId: "s1", password: "staff5" },
  { id: "sf6", name: "Mrs. Kavita Singh",   role: "Nurse",             dept: "Medical",        schoolId: "s1", password: "staff6" },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
const now = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const today = () => new Date().toLocaleDateString("en-IN");

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    school: "🏫", teacher: "👩‍🏫", parent: "👨‍👩‍👧", student: "👦",
    check: "✓", x: "✗", bell: "🔔", chat: "💬", camera: "📷",
    home: "🏠", list: "📋", chart: "📊", logout: "🚪", send: "📤",
    in: "🟢", out: "🔴", eye: "👁", edit: "✏️", star: "⭐",
    warning: "⚠️", ok: "✅", absent: "❌", back: "←", user: "👤",
    msg: "✉️", plus: "＋", calendar: "📅", grade: "🎓"
  };
  return <span style={{ fontSize: size }}>{icons[name] || "•"}</span>;
};

// ─── Color Helpers ────────────────────────────────────────────────────────────
const scoreColor = (v) => v >= 90 ? "#22c55e" : v >= 75 ? "#3b82f6" : v >= 60 ? "#f59e0b" : "#ef4444";
const attendColor = (v) => v >= 95 ? "#22c55e" : v >= 85 ? "#f59e0b" : "#ef4444";

// ─── Mini Bar ─────────────────────────────────────────────────────────────────
const MiniBar = ({ value, max = 100, color }) => (
  <div style={{ background: "#1e293b", borderRadius: 4, height: 6, width: "100%", overflow: "hidden" }}>
    <div style={{ width: `${(value / max) * 100}%`, background: color || scoreColor(value), height: "100%", borderRadius: 4, transition: "width .6s ease" }} />
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SchoolApp() {
  const [screen, setScreen] = useState("login"); // login | teacher | parent
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState(STUDENTS_INIT);
  const [parents] = useState(PARENTS_INIT);
  const [attendance, setAttendance] = useState({});   // { date: { studentId: {status, inTime, outTime, remark} } }
  const [messages, setMessages] = useState({});        // { studentId: [{from, text, time, image}] }
  const [notifications, setNotifications] = useState([]); // [{parentId, text, time}]
  const [classImages, setClassImages] = useState([]);  // [{url, caption, time, uploadedBy}]
  const [savedDates, setSavedDates] = useState({});    // { 'DD/MM/YYYY': { savedAt, presentCount, absentCount } }
  const [staffAttendance, setStaffAttendance] = useState({}); // { date: { staffId: {status,inTime,outTime} } }

  const handleLogin = (role, data) => { setUser({ role, ...data }); setScreen(role); };
  const handleLogout = () => { setUser(null); setScreen("login"); };

  const markAttendance = (studentId, field, value) => {
    const d = today();
    setAttendance(prev => {
      const day = prev[d] || {};
      const rec = day[studentId] || { status: "present", inTime: null, outTime: null, remark: "" };
      const updated = { ...rec, [field]: value };
      // Auto-set inTime when marked present
      if (field === "status" && value === "in" && !rec.inTime) updated.inTime = now();
      if (field === "status" && value === "out") updated.outTime = now();
      const newState = { ...prev, [d]: { ...day, [studentId]: updated } };
      // Fire notification
      if (field === "status") {
        const st = students.find(s => s.id === studentId);
        const notif = { parentId: st.parentId, studentId, text: `${st.name} marked ${value === "in" ? "ARRIVED" : value === "out" ? "DEPARTED" : "ABSENT"} at ${now()} on ${d}`, time: now() };
        setNotifications(n => [notif, ...n.slice(0, 49)]);
      }
      return newState;
    });
  };

  const sendMessage = (studentId, from, text, image = null) => {
    const msg = { from, text, time: now(), image, date: today() };
    setMessages(prev => ({ ...prev, [studentId]: [...(prev[studentId] || []), msg] }));
    if (from === "parent") {
      const st = students.find(s => s.id === studentId);
      setNotifications(n => [{ teacherId: CLASSES.find(c => c.id === st.classId)?.teacherId, studentId, text: `Parent message for ${st.name}: "${text.slice(0, 40)}..."`, time: now(), type: "parentMsg" }, ...n.slice(0, 49)]);
    }
  };

  const addRemark = (studentId, remark, remarkPhoto = null) => {
    const d = today();
    setAttendance(prev => {
      const day = prev[d] || {};
      const rec = day[studentId] || {};
      return { ...prev, [d]: { ...day, [studentId]: { ...rec, remark, remarkPhoto } } };
    });
  };

  const saveAttendance = (classStudents) => {
    const d = today();
    const dayRec = attendance[d] || {};
    const presentCount = classStudents.filter(s => dayRec[s.id]?.status === "in").length;
    const absentCount  = classStudents.filter(s => dayRec[s.id]?.status === "absent").length;
    const outCount     = classStudents.filter(s => dayRec[s.id]?.status === "out").length;
    const savedAt = now();
    // Record save
    setSavedDates(prev => ({ ...prev, [d]: { savedAt, presentCount, absentCount, outCount, total: classStudents.length } }));
    // Fire one notification per parent
    const newNotifs = classStudents.map(s => {
      const rec = dayRec[s.id];
      const statusLabel = rec?.status === "in" ? "✅ Present" : rec?.status === "absent" ? "❌ Absent" : rec?.status === "out" ? "🔴 Departed" : "⏳ Not Marked";
      return {
        parentId: s.parentId,
        studentId: s.id,
        text: `Attendance saved for ${d}: ${s.name} — ${statusLabel}${rec?.inTime ? ` (In: ${rec.inTime})` : ""}${rec?.outTime ? `, Out: ${rec.outTime}` : ""}${rec?.remark ? ` | Note: ${rec.remark}` : ""}`,
        time: savedAt,
        type: "attendanceSave",
        date: d,
      };
    });
    setNotifications(prev => [...newNotifs, ...prev.slice(0, 49)]);
  };

  const markStaffAttendance = (staffId, status) => {
    const d = today();
    const t = now();
    setStaffAttendance(prev => {
      const day = prev[d] || {};
      const rec = day[staffId] || {};
      const updated = { ...rec, status };
      if (status === "in" && !rec.inTime) updated.inTime = t;
      if (status === "out") updated.outTime = t;
      return { ...prev, [d]: { ...day, [staffId]: updated } };
    });
  };

  const todayStaffRecord = (staffId) => staffAttendance[today()]?.[staffId] || null;
  const todayRecord = (studentId) => attendance[today()]?.[studentId] || null;

  if (screen === "login") return <LoginScreen onLogin={handleLogin} />;
  if (screen === "teacher") return (
    <TeacherApp user={user} students={students} setStudents={setStudents} classes={CLASSES}
      parents={parents} messages={messages} notifications={notifications} setNotifications={setNotifications}
      markAttendance={markAttendance} addRemark={addRemark} todayRecord={todayRecord}
      saveAttendance={saveAttendance} savedDates={savedDates}
      sendMessage={sendMessage} classImages={classImages} setClassImages={setClassImages}
      staffAttendance={staffAttendance} markStaffAttendance={markStaffAttendance} todayStaffRecord={todayStaffRecord}
      onLogout={handleLogout} />
  );
  if (screen === "parent") return (
    <ParentApp user={user} students={students} messages={messages}
      notifications={notifications} todayRecord={todayRecord}
      sendMessage={sendMessage} onLogout={handleLogout} />
  );
  if (screen === "school") return (
    <SchoolAdminApp user={user} students={students} classes={CLASSES}
      teachers={TEACHERS} staff={STAFF_INIT}
      attendance={attendance} staffAttendance={staffAttendance}
      savedDates={savedDates} todayRecord={todayRecord} todayStaffRecord={todayStaffRecord}
      onLogout={handleLogout} />
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [tab, setTab] = useState("teacher"); // teacher | parent | school
  const [form, setForm] = useState({ code: "", password: "" });
  const [err, setErr] = useState("");

  const handleSubmit = () => {
    setErr("");
    if (tab === "teacher") {
      const t = TEACHERS.find(t => t.id === form.code && t.password === form.password);
      if (t) { onLogin("teacher", t); return; }
      setErr("Invalid teacher ID or password. Try: t1 / teacher1");
    } else if (tab === "staff") {
      const sf = STAFF_INIT.find(s => s.id === form.code && s.password === form.password);
      if (sf) { onLogin("teacher", { ...sf, isStaff: true }); return; }
      setErr("Invalid staff ID or password. Try: sf1 / staff1");
    } else if (tab === "parent") {
      const p = PARENTS_INIT.find(p => p.id === form.code && p.password === form.password);
      if (p) { onLogin("parent", p); return; }
      setErr("Invalid parent ID or password. Try: p1 / parent1");
    } else {
      const s = SCHOOLS.find(s => s.code === form.code && s.password === form.password);
      if (s) { onLogin("school", s); return; }
      setErr("Invalid school code or password. Try: DPS2024 / dps123");
    }
  };

  const loginBackground = "/login-background.jpg";
  const demos = {
    teacher: ["ID: t1", "Pass: teacher1"],
    staff:   ["ID: sf1", "Pass: staff1"],
    parent:  ["ID: p1", "Pass: parent1"],
    school:  ["Code: DPS2024", "Pass: dps123"]
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", backgroundImage: `url(${loginBackground})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.75)" }} />
      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🏫</div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Bluebells International</h1>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: "6px 0 0" }}>Smart School Management Platform</p>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderRadius: 20, padding: 32, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 3, background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 4, marginBottom: 28, flexWrap: "wrap" }}>
            {[["teacher", "👩‍🏫", "Teacher"], ["staff", "🧑‍💼", "Staff"], ["parent", "👨‍👩‍👧", "Parent"], ["school", "🏫", "Admin"]].map(([k, icon, label]) => (
              <button key={k} onClick={() => { setTab(k); setForm({ code: "", password: "" }); setErr(""); }}
                style={{ flex: "1 1 40%", padding: "9px 4px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, transition: "all .2s",
                  background: tab === k ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
                  color: tab === k ? "#fff" : "#94a3b8" }}>
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>{tab === "school" ? "SCHOOL CODE" : tab === "staff" ? "STAFF ID" : "LOGIN ID"}</label>
            <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
              placeholder={demos[tab][0]} onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>PASSWORD</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder={demos[tab][1]} onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>

          {err && <p style={{ color: "#f87171", fontSize: 12, margin: "8px 0", background: "rgba(239,68,68,0.1)", padding: "8px 12px", borderRadius: 8 }}>{err}</p>}

          <div style={{ background: "rgba(99,102,241,0.1)", borderRadius: 8, padding: "8px 12px", marginBottom: 20, marginTop: 8 }}>
            <p style={{ color: "#a5b4fc", fontSize: 11, margin: 0 }}>Demo: {demos[tab][0]} &nbsp;|&nbsp; {demos[tab][1]}</p>
          </div>

          <button onClick={handleSubmit}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3 }}>
            Sign In →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TEACHER APP ──────────────────────────────────────────────────────────────
function TeacherApp({ user, students, setStudents, classes, parents, messages, notifications, setNotifications, markAttendance, addRemark, todayRecord, saveAttendance, savedDates, staffAttendance, markStaffAttendance, todayStaffRecord, sendMessage, classImages, setClassImages, onLogout }) {
  const [tab, setTab] = useState("dashboard"); // dashboard | attendance | students | student | chat | gallery
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const myClass = classes.find(c => c.id === user.classId);
  const myStudents = students.filter(s => s.classId === user.classId);
  const teacherNotifs = notifications.filter(n => n.type === "parentMsg" && n.teacherId === user.id);
  const unread = teacherNotifs.length;

  const viewStudent = (st) => { setSelectedStudent(st); setTab("student"); };

  const isStaff = user.isStaff;
  const tabs = isStaff ? [
    { id: "myattendance", label: "My Attendance", icon: "check" },
  ] : [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "attendance", label: "Attendance", icon: "check" },
    { id: "students", label: "Students", icon: "list" },
    { id: "chat", label: "Messages", icon: "chat" },
    { id: "gallery", label: "Gallery", icon: "camera" },
    { id: "myattendance", label: "My Attend.", icon: "check" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'Segoe UI', sans-serif", color: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "rgba(99,102,241,0.15)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏫</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Bluebells International</div>
            <div style={{ color: "#94a3b8", fontSize: 11 }}>{myClass?.name} · {user.name}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <button onClick={() => setNotifOpen(o => !o)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: "6px 10px", color: "#fff", cursor: "pointer", fontSize: 16 }}>🔔</button>
            {unread > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{unread}</span>}
            {notifOpen && (
              <div style={{ position: "absolute", right: 0, top: 40, width: 300, background: "#1e293b", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", zIndex: 200, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontWeight: 600, fontSize: 13 }}>Parent Messages</div>
                {teacherNotifs.length === 0 ? <div style={{ padding: 16, color: "#64748b", fontSize: 13 }}>No new messages</div> :
                  teacherNotifs.slice(0, 5).map((n, i) => (
                    <div key={i} style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12, color: "#cbd5e1" }}>
                      <div style={{ color: "#a5b4fc", fontWeight: 600, marginBottom: 2 }}>{n.time}</div>
                      {n.text}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <button onClick={onLogout} style={{ background: "rgba(239,68,68,0.2)", border: "none", borderRadius: 8, padding: "6px 12px", color: "#fca5a5", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Logout</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 16px" }}>
        {tab === "myattendance" && <SelfAttendancePage user={user} todayStaffRecord={todayStaffRecord} markStaffAttendance={markStaffAttendance} staffAttendance={staffAttendance} isTeacher={!isStaff} />}
        {tab === "dashboard" && !isStaff && <TeacherDashboard myStudents={myStudents} myClass={myClass} todayRecord={todayRecord} viewStudent={viewStudent} notifications={notifications} />}
        {tab === "attendance" && !isStaff && <AttendancePage myStudents={myStudents} todayRecord={todayRecord} markAttendance={markAttendance} addRemark={addRemark} saveAttendance={saveAttendance} savedDates={savedDates} />}
        {tab === "students" && !isStaff && <AllStudentsPage myStudents={myStudents} todayRecord={todayRecord} viewStudent={viewStudent} />}
        {tab === "student" && selectedStudent && !isStaff && <StudentDetailPage student={selectedStudent} todayRecord={todayRecord} messages={messages[selectedStudent.id] || []} sendMessage={sendMessage} onBack={() => setTab("students")} user={user} savedDates={savedDates} markAttendance={markAttendance} setNotifications={setNotifications} />}
        {tab === "chat" && !isStaff && <TeacherChatPage myStudents={myStudents} messages={messages} sendMessage={sendMessage} parents={parents} />}
        {tab === "gallery" && !isStaff && <GalleryPage classImages={classImages} setClassImages={setClassImages} user={user} myClass={myClass} />}
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", padding: "8px 0" }}>
        {tabs.map(t => {
          const iconMap = { dashboard:"🏠", attendance:"✅", students:"📋", chat:"💬", gallery:"📷", myattendance:"🕐" };
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, border: "none", background: "none", cursor: "pointer", padding: "8px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                color: tab === t.id ? "#818cf8" : "#475569" }}>
              <span style={{ fontSize: 18 }}>{iconMap[t.id] || "•"}</span>
              <span style={{ fontSize: 10, fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── TEACHER DASHBOARD ────────────────────────────────────────────────────────
function TeacherDashboard({ myStudents, myClass, todayRecord, viewStudent, notifications }) {
  const present = myStudents.filter(s => todayRecord(s.id)?.status === "in").length;
  const absent = myStudents.filter(s => todayRecord(s.id)?.status === "absent").length;
  const notMarked = myStudents.length - present - absent;
  const avgPerf = Math.round(myStudents.reduce((a, s) => a + s.performance.avg, 0) / myStudents.length);

  const stats = [
    { label: "Total Students", value: myStudents.length, color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
    { label: "Present Today", value: present, color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
    { label: "Absent Today", value: absent, color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
    { label: "Avg Performance", value: `${avgPerf}%`, color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Good {new Date().getHours() < 12 ? "Morning" : "Afternoon"} 👋</h2>
        <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>{myClass?.name} · {today()}</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 14, padding: "16px 14px" }}>
            <div style={{ color: s.color, fontSize: 28, fontWeight: 800 }}>{s.value}</div>
            <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Today's Attendance Progress</span>
          <span style={{ color: "#94a3b8", fontSize: 12 }}>{present + absent}/{myStudents.length} marked</span>
        </div>
        <MiniBar value={present + absent} max={myStudents.length} color="#6366f1" />
        {notMarked > 0 && <p style={{ color: "#f59e0b", fontSize: 12, margin: "8px 0 0" }}>⚠️ {notMarked} student(s) not yet marked</p>}
      </div>

      {/* Quick Student List */}
      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 12, letterSpacing: 1 }}>STUDENTS AT A GLANCE</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {myStudents.map(s => {
          const rec = todayRecord(s.id);
          return (
            <div key={s.id} onClick={() => viewStudent(s)}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: `hsl(${s.id.charCodeAt(2) * 37},50%,35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                {s.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>Roll #{s.rollNo} · Avg {s.performance.avg}%</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, fontWeight: 600,
                  background: rec?.status === "in" ? "rgba(34,197,94,0.2)" : rec?.status === "absent" ? "rgba(239,68,68,0.2)" : "rgba(100,116,139,0.2)",
                  color: rec?.status === "in" ? "#86efac" : rec?.status === "absent" ? "#fca5a5" : "#94a3b8" }}>
                  {rec?.status === "in" ? "In" : rec?.status === "absent" ? "Absent" : rec?.status === "out" ? "Out" : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ATTENDANCE PAGE ──────────────────────────────────────────────────────────
function AttendancePage({ myStudents, todayRecord, markAttendance, addRemark, saveAttendance, savedDates }) {
  const [editRemark, setEditRemark] = useState(null);
  const [remarkText, setRemarkText] = useState("");
  const [remarkPhoto, setRemarkPhoto] = useState(null);
  const [photoSource, setPhotoSource] = useState(null);
  const [saveState, setSaveState] = useState("idle"); // idle | confirming | saving | saved
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const d = today();
  const isSavedToday = !!savedDates[d];
  const present = myStudents.filter(s => todayRecord(s.id)?.status === "in").length;

  const openRemarkPanel = (s) => {
    const rec = todayRecord(s.id);
    setEditRemark(s.id);
    setRemarkText(rec?.remark || "");
    setRemarkPhoto(rec?.remarkPhoto || null);
    setPhotoSource(null);
  };

  const closeRemarkPanel = () => {
    setEditRemark(null);
    setRemarkText("");
    setRemarkPhoto(null);
    setPhotoSource(null);
  };

  const handleFileRead = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setRemarkPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const saveRemark = (studentId) => {
    addRemark(studentId, remarkText, remarkPhoto);
    closeRemarkPanel();
  };

  const markedCount = myStudents.filter(s => todayRecord(s.id)?.status).length;
  const absentCount = myStudents.filter(s => todayRecord(s.id)?.status === "absent").length;
  const notMarked = myStudents.filter(s => !todayRecord(s.id)?.status);
  const allMarked = notMarked.length === 0;

  const handleSaveClick = () => {
    if (isSavedToday) return; // already saved, no re-save
    setSaveState("confirming");
  };

  const confirmSave = () => {
    setSaveState("saving");
    setTimeout(() => {
      saveAttendance(myStudents);
      setSaveState("saved");
    }, 900);
  };

  return (
    <div>
      {/* Confirm Modal */}
      {saveState === "confirming" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#1e293b", borderRadius: 20, padding: 28, maxWidth: 340, width: "100%", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ fontSize: 40, textAlign: "center", marginBottom: 14 }}>📤</div>
            <h3 style={{ textAlign: "center", margin: "0 0 8px", fontSize: 18, fontWeight: 800 }}>Send Attendance to Parents?</h3>
            <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", margin: "0 0 20px", lineHeight: 1.6 }}>
              This will notify all <strong style={{ color: "#fff" }}>{myStudents.length} parents</strong> with today's attendance data. This action cannot be undone.
            </p>
            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
              {[
                { label: "Present", val: present, color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
                { label: "Absent", val: absentCount, color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
                { label: "Not Marked", val: notMarked.length, color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                  <div style={{ color: s.color, fontWeight: 800, fontSize: 22 }}>{s.val}</div>
                  <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {notMarked.length > 0 && (
              <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: "10px 12px", marginBottom: 16, fontSize: 12, color: "#fde68a" }}>
                ⚠️ <strong>{notMarked.length} student(s)</strong> not yet marked: {notMarked.map(s => s.name).join(", ")}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setSaveState("idle")}
                style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#94a3b8", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={confirmSave}
                style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                ✅ Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saving overlay */}
      {saveState === "saving" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, border: "4px solid rgba(99,102,241,0.3)", borderTop: "4px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Sending to all parents...</div>
          <div style={{ color: "#64748b", fontSize: 13 }}>Notifying {myStudents.length} parents</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Attendance</h2>
          <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 13 }}>{today()} · {present}/{myStudents.length} present</p>
        </div>
        <div style={{ background: "rgba(99,102,241,0.2)", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700, color: "#a5b4fc" }}>
          {Math.round((present / myStudents.length) * 100)}%
        </div>
      </div>

      {/* Saved banner */}
      {(isSavedToday || saveState === "saved") && (
        <div style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.35)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontWeight: 700, color: "#86efac", fontSize: 14 }}>Attendance Saved & Sent</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>
              Notified all {myStudents.length} parents at {savedDates[d]?.savedAt || now()} — {savedDates[d]?.presentCount ?? present} present, {savedDates[d]?.absentCount ?? absentCount} absent
            </div>
          </div>
        </div>
      )}

      {isSavedToday && (
        <div style={{ marginBottom: 16, padding: 14, background: "rgba(148,163,184,0.1)", borderRadius: 12, border: "1px solid rgba(148,163,184,0.3)", color: "#cbd5e1", fontSize: 13 }}>
          Today's attendance has already been submitted. Any status corrections should be made from the student profile page with password confirmation.
        </div>
      )}
      {/* Quick All-In / All-Out */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => myStudents.forEach(s => markAttendance(s.id, "status", "in"))} disabled={isSavedToday}
          style={{ flex: 1, padding: "10px", background: isSavedToday ? "rgba(255,255,255,0.03)" : "rgba(34,197,94,0.15)", border: `1px solid ${isSavedToday ? "rgba(255,255,255,0.06)" : "rgba(34,197,94,0.3)"}`, borderRadius: 10, color: isSavedToday ? "#334155" : "#86efac", fontWeight: 600, fontSize: 13, cursor: isSavedToday ? "not-allowed" : "pointer" }}>
          ✅ Mark All In
        </button>
        <button onClick={() => myStudents.forEach(s => markAttendance(s.id, "status", "absent"))} disabled={isSavedToday}
          style={{ flex: 1, padding: "10px", background: isSavedToday ? "rgba(255,255,255,0.03)" : "rgba(239,68,68,0.1)", border: `1px solid ${isSavedToday ? "rgba(255,255,255,0.06)" : "rgba(239,68,68,0.25)"}`, borderRadius: 10, color: isSavedToday ? "#334155" : "#fca5a5", fontWeight: 600, fontSize: 13, cursor: isSavedToday ? "not-allowed" : "pointer" }}>
          ❌ Mark All Absent
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
          <span style={{ color: "#94a3b8" }}>Marking progress</span>
          <span style={{ color: allMarked ? "#22c55e" : "#f59e0b", fontWeight: 600 }}>{markedCount}/{myStudents.length} marked {allMarked ? "✓" : ""}</span>
        </div>
        <MiniBar value={markedCount} max={myStudents.length} color={allMarked ? "#22c55e" : "#f59e0b"} />
      </div>

      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => { handleFileRead(e.target.files[0]); e.target.value = ""; }} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }}
        onChange={e => { handleFileRead(e.target.files[0]); e.target.value = ""; }} />

      {/* Student Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {myStudents.map(s => {
          const rec = todayRecord(s.id);
          const status = rec?.status;
          const isEditing = editRemark === s.id;

          return (
            <div key={s.id} style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${isEditing ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 14, padding: 14,
              transition: "border-color .2s",
              boxShadow: isEditing ? "0 0 0 3px rgba(99,102,241,0.12)" : "none"
            }}>
              {/* Student row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `hsl(${s.id.charCodeAt(2) * 37},50%,35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>
                  {s.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div style={{ color: "#64748b", fontSize: 11 }}>Roll #{s.rollNo}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {rec?.inTime && <div style={{ fontSize: 10, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "2px 6px", borderRadius: 5 }}>In {rec.inTime}</div>}
                  {rec?.outTime && <div style={{ fontSize: 10, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "2px 6px", borderRadius: 5 }}>Out {rec.outTime}</div>}
                </div>
              </div>

              {/* Status Buttons */}
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {[["in", "🟢 In", "#22c55e"], ["out", "🔴 Out", "#f59e0b"], ["absent", "❌ Absent", "#ef4444"]].map(([val, label, color]) => (
                  <button key={val} onClick={() => markAttendance(s.id, "status", val)}
                    style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `1px solid ${status === val ? color : "rgba(255,255,255,0.1)"}`,
                      background: status === val ? `${color}25` : "transparent",
                      color: status === val ? color : "#64748b", fontWeight: status === val ? 700 : 400,
                      fontSize: 12, cursor: "pointer", transition: "all .15s" }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* ── REMARK SECTION ── */}
              {!isEditing ? (
                /* Collapsed view */
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "center", overflow: "hidden" }}>
                    {rec?.remarkPhoto && (
                      <img src={rec.remarkPhoto} alt="remark"
                        style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover", border: "1px solid rgba(99,102,241,0.4)", flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: 12, color: rec?.remark ? "#a5b4fc" : "#475569", fontStyle: rec?.remark ? "normal" : "italic",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {rec?.remark || "No remark yet"}
                    </span>
                  </div>
                  <button onClick={() => openRemarkPanel(s)}
                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 7, color: "#a5b4fc", cursor: "pointer", fontSize: 11, padding: "5px 10px", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                    ✏️ {rec?.remark || rec?.remarkPhoto ? "Edit" : "Add"} Remark
                  </button>
                </div>
              ) : (
                /* Expanded remark editor */
                <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>📝 Remark for Parents</span>
                    <button onClick={closeRemarkPanel} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
                  </div>

                  {/* Text area */}
                  <textarea value={remarkText} onChange={e => setRemarkText(e.target.value)}
                    placeholder="Write a remark visible to parents — progress, behaviour, improvement notes..."
                    rows={3}
                    style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9, color: "#fff", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.5, marginBottom: 10 }} />

                  {/* Photo source chooser */}
                  {!photoSource && !remarkPhoto && (
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <button onClick={() => { setPhotoSource("camera"); cameraInputRef.current?.click(); }}
                        style={{ flex: 1, padding: "9px 8px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 9, color: "#6ee7b7", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                        📸 Take Photo
                      </button>
                      <button onClick={() => { setPhotoSource("gallery"); fileInputRef.current?.click(); }}
                        style={{ flex: 1, padding: "9px 8px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 9, color: "#a5b4fc", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                        🖼️ Upload Photo
                      </button>
                    </div>
                  )}

                  {/* Photo preview */}
                  {remarkPhoto && (
                    <div style={{ position: "relative", marginBottom: 10, display: "inline-block" }}>
                      <img src={remarkPhoto} alt="remark attachment"
                        style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 10, objectFit: "cover", border: "2px solid rgba(99,102,241,0.4)", display: "block" }} />
                      <button onClick={() => { setRemarkPhoto(null); setPhotoSource(null); }}
                        style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: "rgba(239,68,68,0.85)", border: "none", color: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, lineHeight: 1 }}>
                        ×
                      </button>
                      <div style={{ marginTop: 4, display: "flex", gap: 6 }}>
                        <button onClick={() => { setRemarkPhoto(null); setPhotoSource(null); cameraInputRef.current?.click(); }}
                          style={{ fontSize: 10, padding: "3px 8px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 5, color: "#6ee7b7", cursor: "pointer" }}>
                          📸 Retake
                        </button>
                        <button onClick={() => { setRemarkPhoto(null); setPhotoSource(null); fileInputRef.current?.click(); }}
                          style={{ fontSize: 10, padding: "3px 8px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 5, color: "#a5b4fc", cursor: "pointer" }}>
                          🖼️ Change
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Save / Cancel */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={closeRemarkPanel}
                      style={{ flex: 1, padding: "9px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                      Cancel
                    </button>
                    <button onClick={() => saveRemark(s.id)}
                      style={{ flex: 2, padding: "9px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 9, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                      💾 Save Remark {remarkPhoto ? "& Photo" : ""}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── SAVE & DISPATCH BUTTON ── */}
      <div style={{ position: "sticky", bottom: 0, left: 0, right: 0, padding: "16px 0 8px", background: "linear-gradient(to top, #0f172a 70%, transparent)", marginTop: 20 }}>
        {isSavedToday ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 14, color: "#86efac", fontSize: 14, fontWeight: 700 }}>
            ✅ Attendance saved & sent to all parents
          </div>
        ) : (
          <button onClick={handleSaveClick}
            style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 800, letterSpacing: 0.3,
              background: allMarked ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "linear-gradient(135deg,#1e3a5f,#1e3a5f)",
              color: allMarked ? "#fff" : "#475569",
              boxShadow: allMarked ? "0 4px 20px rgba(99,102,241,0.45)" : "none",
              transition: "all .2s" }}>
            {allMarked ? "📤 Save & Send to All Parents" : `📤 Save & Send  (${notMarked.length} student${notMarked.length !== 1 ? "s" : ""} unmarked)`}
          </button>
        )}
        {!allMarked && !isSavedToday && (
          <p style={{ textAlign: "center", color: "#475569", fontSize: 11, margin: "6px 0 0" }}>
            You can still send with unmarked students — they'll show as "Not Marked"
          </p>
        )}
      </div>
    </div>
  );
}

// ─── ALL STUDENTS PAGE ────────────────────────────────────────────────────────
function AllStudentsPage({ myStudents, todayRecord, viewStudent }) {
  const [sort, setSort] = useState("name");
  const sorted = [...myStudents].sort((a, b) => {
    if (sort === "perf") return b.performance.avg - a.performance.avg;
    if (sort === "attend") return b.attendance - a.attendance;
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>All Students</h2>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", padding: "6px 10px", fontSize: 12 }}>
          <option value="name">By Name</option>
          <option value="perf">By Performance</option>
          <option value="attend">By Attendance</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map((s, idx) => {
          const rec = todayRecord(s.id);
          return (
            <div key={s.id} onClick={() => viewStudent(s)}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ background: `hsl(${s.id.charCodeAt(2) * 37},50%,35%)`, width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {s.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>Roll #{s.rollNo}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: scoreColor(s.performance.avg), fontWeight: 700, fontSize: 15 }}>{s.performance.avg}%</div>
                  <div style={{ color: "#64748b", fontSize: 11 }}>Avg Score</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div>
                  <div style={{ color: "#64748b", fontSize: 10, marginBottom: 4 }}>ATTENDANCE</div>
                  <MiniBar value={s.attendance} color={attendColor(s.attendance)} />
                  <div style={{ color: attendColor(s.attendance), fontSize: 11, marginTop: 2, fontWeight: 600 }}>{s.attendance}%</div>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: 10, marginBottom: 4 }}>PERFORMANCE</div>
                  <MiniBar value={s.performance.avg} />
                  <div style={{ color: scoreColor(s.performance.avg), fontSize: 11, marginTop: 2, fontWeight: 600 }}>{s.performance.avg}%</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#64748b", fontSize: 10, marginBottom: 4 }}>TODAY</div>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 600,
                    background: rec?.status === "in" ? "rgba(34,197,94,0.2)" : rec?.status === "absent" ? "rgba(239,68,68,0.2)" : "rgba(100,116,139,0.2)",
                    color: rec?.status === "in" ? "#86efac" : rec?.status === "absent" ? "#fca5a5" : "#94a3b8" }}>
                    {rec?.status || "—"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── STUDENT DETAIL PAGE ──────────────────────────────────────────────────────
function StudentDetailPage({ student, todayRecord, messages, sendMessage, onBack, user, savedDates, markAttendance, setNotifications }) {
  const [msgText, setMsgText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("in");
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitPassword, setSubmitPassword] = useState("");
  const [submitError, setSubmitError] = useState("");
  const rec = todayRecord(student.id);
  const chatRef = useRef(null);
  const isSavedToday = !!savedDates[today()];

  useEffect(() => {
    if (rec?.status) setSelectedStatus(rec.status);
  }, [rec?.status]);

  const saveSingleAttendance = () => {
    if (submitPassword !== user.password) {
      setSubmitError("Incorrect password.");
      return;
    }
    if (!rec) {
      setSubmitError("No attendance record exists for today.");
      return;
    }
    if (selectedStatus === rec.status) {
      setSubmitError("Choose a different status before submitting a correction.");
      return;
    }

    setSubmitError("");
    markAttendance(student.id, "status", selectedStatus);
    const d = today();
    const t = now();
    const statusLabel = selectedStatus === "in" ? "Present" : selectedStatus === "out" ? "Departed" : "Absent";
    const text = `Attendance corrected for ${student.name}: ${statusLabel} on ${d} at ${t}${selectedStatus === "in" ? ` (In: ${t})` : selectedStatus === "out" ? ` (Out: ${t})` : ""}.`;
    sendMessage(student.id, "teacher", text);
    setNotifications(n => [{ parentId: student.parentId, studentId: student.id, text, time: t, type: "attendanceCorrection", date: d }, ...n.slice(0, 49)]);
    setShowSubmit(false);
    setSubmitPassword("");
  };

  useEffect(() => {
    if (rec?.status) setSelectedStatus(rec.status);
  }, [rec?.status]);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

  const subjects = [
    { name: "Mathematics", key: "math", icon: "➕" },
    { name: "Science", key: "science", icon: "🔬" },
    { name: "English", key: "english", icon: "📖" },
    { name: "Hindi", key: "hindi", icon: "हि" },
  ];

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
        ← Back to Students
      </button>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))", borderRadius: 16, padding: 20, marginBottom: 16, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `hsl(${student.id.charCodeAt(2) * 37},50%,35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, border: "3px solid rgba(99,102,241,0.5)", flexShrink: 0 }}>
          {student.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{student.name}</h2>
          <div style={{ color: "#94a3b8", fontSize: 13 }}>Roll #{student.rollNo}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <span style={{ background: "rgba(34,197,94,0.2)", color: "#86efac", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>📊 Avg: {student.performance.avg}%</span>
            <span style={{ background: `rgba(${student.attendance > 90 ? "34,197,94" : "245,158,11"},0.2)`, color: student.attendance > 90 ? "#86efac" : "#fde68a", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>📅 {student.attendance}%</span>
          </div>
        </div>
      </div>

      {/* Today */}
      {rec && (
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 8 }}>TODAY'S STATUS</div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}><span style={{ color: "#64748b", fontSize: 12 }}>Status: </span><span style={{ color: rec.status === "in" ? "#22c55e" : rec.status === "out" ? "#f59e0b" : "#ef4444", fontWeight: 700, textTransform: "capitalize" }}>{rec.status || "Not Marked"}</span></div>
            {rec.inTime && <div><span style={{ color: "#64748b", fontSize: 12 }}>In: </span><span style={{ color: "#22c55e", fontSize: 12 }}>{rec.inTime}</span></div>}
            {rec.outTime && <div><span style={{ color: "#64748b", fontSize: 12 }}>Out: </span><span style={{ color: "#f59e0b", fontSize: 12 }}>{rec.outTime}</span></div>}
          </div>
          {rec.remark && <div style={{ marginTop: 8, background: "rgba(99,102,241,0.1)", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#a5b4fc" }}>📝 {rec.remark}</div>}
          {rec.remarkPhoto && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>📎 Attached photo</div>
              <img src={rec.remarkPhoto} alt="remark" style={{ maxWidth: "100%", maxHeight: 140, borderRadius: 8, objectFit: "cover", border: "1px solid rgba(99,102,241,0.3)" }} />
            </div>
          )}
        </div>
      )}

      {isSavedToday && rec && (
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 12 }}>CORRECT ATTENDANCE</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {[["in", "🟢 Present", "#22c55e"], ["out", "🔴 Departed", "#f59e0b"], ["absent", "❌ Absent", "#ef4444"]].map(([val, label, color]) => (
              <button key={val} onClick={() => setSelectedStatus(val)}
                style={{ flex: 1, minWidth: 100, padding: "10px 12px", borderRadius: 10, border: `1px solid ${selectedStatus === val ? color : "rgba(148,163,184,0.3)"}`, background: selectedStatus === val ? `${color}22` : "rgba(255,255,255,0.03)", color: selectedStatus === val ? color : "#cbd5e1", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, flex: 1 }}>Selected correction: <strong>{selectedStatus === "in" ? "Present" : selectedStatus === "out" ? "Departed" : "Absent"}</strong></div>
            <button onClick={() => setShowSubmit(true)}
              style={{ padding: "12px 18px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontWeight: 700 }}>
              Submit Correction</button>
          </div>
          {selectedStatus === rec.status && <div style={{ marginTop: 10, color: "#fbbf24", fontSize: 12 }}>Pick a different status from the current value to send a correction.</div>}
          <div style={{ marginTop: 12, color: "#64748b", fontSize: 12 }}>This change will be confirmed with your teacher login password and notify parents with the corrected timestamp.</div>
        </div>
      )}

      {!isSavedToday && (
        <div style={{ marginBottom: 16, padding: 14, background: "rgba(148,163,184,0.1)", borderRadius: 12, border: "1px solid rgba(148,163,184,0.3)", color: "#cbd5e1", fontSize: 13 }}>
          Today's attendance has not been formally submitted yet. Use the Attendance page first; corrections can be sent from this student profile after submission.
        </div>
      )}

      {/* Subjects */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 10 }}>SUBJECT PERFORMANCE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {subjects.map(sub => (
            <div key={sub.key} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>{sub.icon} {sub.name}</span>
                <span style={{ fontWeight: 700, color: scoreColor(student.performance[sub.key]) }}>{student.performance[sub.key]}%</span>
              </div>
              <MiniBar value={student.performance[sub.key]} />
            </div>
          ))}
        </div>
      </div>

      {/* Chat with Parent */}
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontWeight: 600, fontSize: 13 }}>💬 Parent Communication</div>
        <div ref={chatRef} style={{ height: 200, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", color: "#475569", fontSize: 13, paddingTop: 40 }}>No messages yet</div>
          ) : messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "teacher" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "75%", padding: "8px 12px", borderRadius: m.from === "teacher" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                background: m.from === "teacher" ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)", fontSize: 13 }}>
                <div>{m.text}</div>
                <div style={{ color: "#64748b", fontSize: 10, marginTop: 3, textAlign: "right" }}>{m.from === "teacher" ? "Teacher" : "Parent"} · {m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8 }}>
          <input value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Message to parent..."
            onKeyDown={e => { if (e.key === "Enter" && msgText.trim()) { sendMessage(student.id, "teacher", msgText.trim()); setMsgText(""); } }}
            style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
          <button onClick={() => { if (msgText.trim()) { sendMessage(student.id, "teacher", msgText.trim()); setMsgText(""); } }}
            style={{ padding: "8px 14px", background: "#6366f1", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600 }}>Send</button>
        </div>
      </div>

      {showSubmit && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#1e293b", borderRadius: 20, padding: 28, maxWidth: 360, width: "100%", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ fontSize: 40, textAlign: "center", marginBottom: 14 }}>📤</div>
            <h3 style={{ textAlign: "center", margin: "0 0 8px", fontSize: 18, fontWeight: 800 }}>Confirm Correction for {student.name}?</h3>
            <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", margin: "0 0 20px", lineHeight: 1.6 }}>
              Enter your login password to notify the parent with the corrected attendance status and timestamp.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Teacher password</label>
              <input type="password" value={submitPassword} onChange={e => setSubmitPassword(e.target.value)}
                placeholder="Enter password" onKeyDown={e => e.key === "Enter" && saveSingleAttendance()}
                style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.07)", border: `1px solid ${submitError ? "#ef4444" : "rgba(255,255,255,0.12)"}`, borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              {submitError && <p style={{ color: "#f87171", fontSize: 12, margin: "6px 0 0" }}>{submitError}</p>}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setShowSubmit(false); setSubmitPassword(""); setSubmitError(""); }}
                style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#94a3b8", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={saveSingleAttendance}
                style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                ✅ Notify Parent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TEACHER CHAT PAGE ────────────────────────────────────────────────────────
function TeacherChatPage({ myStudents, messages, sendMessage, parents }) {
  const [selected, setSelected] = useState(null);
  const [msgText, setMsgText] = useState("");
  const chatRef = useRef(null);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages, selected]);

  const msgs = selected ? (messages[selected] || []) : [];
  const unreadCounts = {};
  myStudents.forEach(s => { unreadCounts[s.id] = (messages[s.id] || []).filter(m => m.from === "parent").length; });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", gap: 0 }}>
      <h2 style={{ margin: "0 0 14px", fontSize: 20, fontWeight: 800 }}>Parent Messages</h2>
      {!selected ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {myStudents.map(s => {
            const parent = parents.find(p => p.id === s.parentId);
            const msgCount = (messages[s.id] || []).length;
            const last = (messages[s.id] || []).slice(-1)[0];
            return (
              <div key={s.id} onClick={() => setSelected(s.id)}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `hsl(${s.id.charCodeAt(2) * 37},50%,35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {s.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div style={{ color: "#64748b", fontSize: 11 }}>Parent: {parent?.name || "—"}</div>
                  {last && <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>{last.text.slice(0, 35)}...</div>}
                </div>
                {msgCount > 0 && <span style={{ background: "#6366f1", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{msgCount}</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, textAlign: "left", marginBottom: 12, fontWeight: 600 }}>← Back</button>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>
            {myStudents.find(s => s.id === selected)?.name} — Parent Chat
          </div>
          <div ref={chatRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 12, maxHeight: 360 }}>
            {msgs.length === 0 ? <div style={{ color: "#475569", textAlign: "center", paddingTop: 40, fontSize: 13 }}>No messages yet</div> :
              msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "teacher" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "75%", padding: "8px 12px", borderRadius: m.from === "teacher" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    background: m.from === "teacher" ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)", fontSize: 13 }}>
                    {m.text}
                    <div style={{ color: "#64748b", fontSize: 10, marginTop: 2 }}>{m.from === "teacher" ? "You" : "Parent"} · {m.time}</div>
                  </div>
                </div>
              ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Reply to parent..."
              onKeyDown={e => { if (e.key === "Enter" && msgText.trim()) { sendMessage(selected, "teacher", msgText.trim()); setMsgText(""); } }}
              style={{ flex: 1, padding: "10px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 13, outline: "none" }} />
            <button onClick={() => { if (msgText.trim()) { sendMessage(selected, "teacher", msgText.trim()); setMsgText(""); } }}
              style={{ padding: "10px 16px", background: "#6366f1", border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontWeight: 700 }}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GALLERY PAGE ─────────────────────────────────────────────────────────────
function GalleryPage({ classImages, setClassImages, user, myClass }) {
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const upload = () => {
    if (!preview) return;
    setClassImages(imgs => [{ url: preview, caption, time: now(), date: today(), uploadedBy: user.name, classId: user.classId }, ...imgs]);
    setPreview(null);
    setCaption("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>Class Gallery</h2>
      <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>{myClass?.name} · Share moments with parents</p>

      {/* Upload */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 14, padding: 20, marginBottom: 20, textAlign: "center" }}>
        {preview ? (
          <div>
            <img src={preview} alt="preview" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 10, marginBottom: 10, objectFit: "cover" }} />
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a caption..."
              style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setPreview(null); setCaption(""); }} style={{ flex: 1, padding: 10, background: "rgba(239,68,68,0.15)", border: "none", borderRadius: 8, color: "#fca5a5", cursor: "pointer" }}>Cancel</button>
              <button onClick={upload} style={{ flex: 1, padding: 10, background: "#6366f1", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer" }}>📤 Share with Parents</button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📷</div>
            <p style={{ color: "#64748b", margin: "0 0 14px", fontSize: 13 }}>Upload class photos to share with parents</p>
            <button onClick={() => fileRef.current?.click()} style={{ padding: "10px 24px", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 10, color: "#a5b4fc", cursor: "pointer", fontWeight: 600 }}>Choose Photo</button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </div>
        )}
      </div>

      {/* Gallery */}
      {classImages.length === 0 ? (
        <div style={{ textAlign: "center", color: "#475569", padding: 40, fontSize: 13 }}>No photos shared yet</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {classImages.map((img, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, overflow: "hidden" }}>
              <img src={img.url} alt={img.caption} style={{ width: "100%", height: 120, objectFit: "cover" }} />
              <div style={{ padding: 8 }}>
                {img.caption && <div style={{ fontSize: 12, marginBottom: 4 }}>{img.caption}</div>}
                <div style={{ fontSize: 10, color: "#475569" }}>{img.uploadedBy} · {img.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PARENT APP ───────────────────────────────────────────────────────────────
function ParentApp({ user, students, messages, notifications, todayRecord, sendMessage, onLogout }) {
  const [tab, setTab] = useState("home");
  const [msgText, setMsgText] = useState("");
  const chatRef = useRef(null);

  const student = students.find(s => s.id === user.studentId);
  if (!student) return <div style={{ padding: 40, color: "#fff", textAlign: "center" }}>Student not found</div>;

  const rec = todayRecord(student.id);
  const myMsgs = messages[student.id] || [];
  const myNotifs = notifications.filter(n => n.parentId === user.id || n.studentId === user.studentId);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [myMsgs, tab]);

  const subjects = [
    { name: "Math", key: "math", icon: "➕" },
    { name: "Science", key: "science", icon: "🔬" },
    { name: "English", key: "english", icon: "📖" },
    { name: "Hindi", key: "hindi", icon: "हि" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'Segoe UI', sans-serif", color: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "rgba(16,185,129,0.15)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>👨‍👩‍👧</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Parent Portal</div>
            <div style={{ color: "#94a3b8", fontSize: 11 }}>{user.name}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {myNotifs.length > 0 && (
            <div style={{ background: "rgba(16,185,129,0.2)", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "#6ee7b7" }}>
              🔔 {myNotifs.length} updates
            </div>
          )}
          <button onClick={onLogout} style={{ background: "rgba(239,68,68,0.2)", border: "none", borderRadius: 8, padding: "6px 12px", color: "#fca5a5", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Logout</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 16px" }}>
        {tab === "home" && (
          <div>
            {/* Student card */}
            <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 18, padding: 20, marginBottom: 20, display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: `hsl(${student.id.charCodeAt(2) * 37},50%,35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, border: "3px solid rgba(16,185,129,0.4)", flexShrink: 0 }}>
                {student.name.charAt(0)}
              </div>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{student.name}</h2>
                <div style={{ color: "#94a3b8", fontSize: 13 }}>Roll #{student.rollNo}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(34,197,94,0.2)", color: "#86efac", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>📊 {student.performance.avg}% Avg</span>
                  <span style={{ background: "rgba(16,185,129,0.2)", color: "#6ee7b7", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>📅 {student.attendance}% Att.</span>
                </div>
              </div>
            </div>

            {/* Today Status */}
            <div style={{ background: rec ? (rec.status === "in" ? "rgba(34,197,94,0.1)" : rec.status === "absent" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)") : "rgba(255,255,255,0.04)", border: `1px solid ${rec?.status === "in" ? "rgba(34,197,94,0.3)" : rec?.status === "absent" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 8 }}>TODAY'S STATUS · {today()}</div>
              {rec ? (
                <div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 24 }}>{rec.status === "in" ? "🟢" : rec.status === "absent" ? "❌" : "🟡"}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: rec.status === "in" ? "#22c55e" : rec.status === "absent" ? "#ef4444" : "#f59e0b", textTransform: "capitalize" }}>
                        {rec.status === "in" ? "Present - Arrived" : rec.status === "absent" ? "Absent" : "Departed"}
                      </div>
                      {rec.inTime && <div style={{ color: "#94a3b8", fontSize: 12 }}>Arrived at {rec.inTime}</div>}
                      {rec.outTime && <div style={{ color: "#94a3b8", fontSize: 12 }}>Departed at {rec.outTime}</div>}
                    </div>
                  </div>
                  {rec.remark && <div style={{ marginTop: 10, background: "rgba(99,102,241,0.15)", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#c4b5fd" }}>📝 Teacher's Note: {rec.remark}</div>}
                  {rec.remarkPhoto && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>📎 Photo from teacher</div>
                      <img src={rec.remarkPhoto} alt="teacher remark" style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 10, objectFit: "cover", border: "2px solid rgba(99,102,241,0.3)" }} />
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ color: "#64748b", fontSize: 14 }}>Attendance not marked yet for today</div>
              )}
            </div>

            {/* Notifications */}
            {myNotifs.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 8 }}>RECENT UPDATES FROM SCHOOL</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {myNotifs.slice(0, 6).map((n, i) => {
                    const isSave = n.type === "attendanceSave";
                    const isPresent = n.text.includes("Present");
                    const isAbsent = n.text.includes("Absent");
                    const dotColor = isPresent ? "#22c55e" : isAbsent ? "#ef4444" : "#f59e0b";
                    const bg = isSave
                      ? (isPresent ? "rgba(34,197,94,0.1)" : isAbsent ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)")
                      : "rgba(16,185,129,0.08)";
                    const border = isSave
                      ? (isPresent ? "1px solid rgba(34,197,94,0.3)" : isAbsent ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(245,158,11,0.25)")
                      : "1px solid rgba(16,185,129,0.15)";
                    return (
                      <div key={i} style={{ background: bg, border, borderRadius: 12, padding: "12px 14px" }}>
                        {isSave ? (
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, display: "inline-block", flexShrink: 0 }} />
                              <span style={{ fontWeight: 700, fontSize: 13, color: dotColor }}>
                                {isPresent ? "✅ Your child is Present" : isAbsent ? "❌ Your child is Absent" : "🔴 Your child has Departed"}
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{n.text.split(": ").slice(1).join(": ")}</div>
                            <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>Sent by teacher at {n.time}</div>
                          </div>
                        ) : (
                          <div style={{ fontSize: 13, color: "#d1fae5" }}>🔔 {n.text}
                            <div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>{n.time}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Performance */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 10 }}>SUBJECT PERFORMANCE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {subjects.map(sub => (
                  <div key={sub.key} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{sub.icon} {sub.name}</div>
                    <div style={{ fontWeight: 700, fontSize: 20, color: scoreColor(student.performance[sub.key]) }}>{student.performance[sub.key]}%</div>
                    <MiniBar value={student.performance[sub.key]} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Chart */}
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 10 }}>ATTENDANCE & PERFORMANCE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span>Attendance</span><span style={{ color: attendColor(student.attendance) }}>{student.attendance}%</span>
                  </div>
                  <MiniBar value={student.attendance} color={attendColor(student.attendance)} />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span>Overall Performance</span><span style={{ color: scoreColor(student.performance.avg) }}>{student.performance.avg}%</span>
                  </div>
                  <MiniBar value={student.performance.avg} />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 200px)" }}>
            <h2 style={{ margin: "0 0 14px", fontSize: 20, fontWeight: 800 }}>Message Teacher</h2>
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {myMsgs.length === 0 ? (
                <div style={{ textAlign: "center", color: "#475569", paddingTop: 60, fontSize: 13 }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
                  Send a message to {student.name}'s teacher
                </div>
              ) : myMsgs.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "parent" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: m.from === "parent" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                    background: m.from === "parent" ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.08)", fontSize: 13, lineHeight: 1.4 }}>
                    {m.text}
                    <div style={{ color: "#64748b", fontSize: 10, marginTop: 3 }}>{m.from === "parent" ? "You" : "Teacher"} · {m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Message class teacher..."
                onKeyDown={e => { if (e.key === "Enter" && msgText.trim()) { sendMessage(student.id, "parent", msgText.trim()); setMsgText(""); } }}
                style={{ flex: 1, padding: "12px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", fontSize: 13, outline: "none" }} />
              <button onClick={() => { if (msgText.trim()) { sendMessage(student.id, "parent", msgText.trim()); setMsgText(""); } }}
                style={{ padding: "12px 18px", background: "#10b981", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>📤</button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "rgba(15,23,42,0.95)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", padding: "8px 0" }}>
        {[["home", "🏠", "Home"], ["chat", "💬", "Teacher Chat"]].map(([t, icon, label]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, border: "none", background: "none", cursor: "pointer", padding: "8px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              color: tab === t ? "#10b981" : "#475569" }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 11, fontWeight: tab === t ? 700 : 400 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SELF ATTENDANCE PAGE (Teacher / Staff) ───────────────────────────────────
function SelfAttendancePage({ user, todayStaffRecord, markStaffAttendance, staffAttendance, isTeacher }) {
  const d = today();
  const rec = todayStaffRecord(user.id);

  // Build history from staffAttendance
  const history = Object.entries(staffAttendance)
    .filter(([date, day]) => day[user.id])
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 14)
    .map(([date, day]) => ({ date, ...day[user.id] }));

  const presentDays = history.filter(h => h.status === "in" || h.status === "out").length;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>My Attendance</h2>
        <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>{user.name} · {user.role || user.subject} · {d}</p>
      </div>

      {/* Today card */}
      <div style={{ background: rec
        ? (rec.status === "in" ? "rgba(34,197,94,0.12)" : rec.status === "out" ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.1)")
        : "rgba(99,102,241,0.1)",
        border: `1px solid ${rec ? (rec.status === "in" ? "rgba(34,197,94,0.35)" : rec.status === "out" ? "rgba(245,158,11,0.35)" : "rgba(239,68,68,0.3)") : "rgba(99,102,241,0.3)"}`,
        borderRadius: 18, padding: 22, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 14, letterSpacing: 1 }}>TODAY'S STATUS</div>

        {rec ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 44 }}>{rec.status === "in" ? "🟢" : rec.status === "out" ? "🔴" : "❌"}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 20, color: rec.status === "in" ? "#22c55e" : rec.status === "out" ? "#f59e0b" : "#ef4444" }}>
                  {rec.status === "in" ? "Signed In" : rec.status === "out" ? "Signed Out" : "Marked Absent"}
                </div>
                <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>
                  {rec.inTime && `Arrived: ${rec.inTime}`}
                  {rec.outTime && `  ·  Departed: ${rec.outTime}`}
                </div>
              </div>
            </div>
            {/* Buttons to update */}
            <div style={{ display: "flex", gap: 8 }}>
              {rec.status === "in" && (
                <button onClick={() => markStaffAttendance(user.id, "out")}
                  style={{ flex: 1, padding: "12px", background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 12, color: "#fde68a", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  🔴 Sign Out
                </button>
              )}
              {rec.status === "out" && (
                <div style={{ color: "#64748b", fontSize: 13, padding: "12px 0" }}>✅ Attendance for today is complete.</div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: "#94a3b8", fontSize: 14, margin: "0 0 18px", lineHeight: 1.6 }}>
              You have not submitted your attendance yet today.<br />
              Please mark your arrival to proceed.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => markStaffAttendance(user.id, "in")}
                style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg,#22c55e,#16a34a)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(34,197,94,0.35)" }}>
                🟢 Sign In
              </button>
              <button onClick={() => markStaffAttendance(user.id, "absent")}
                style={{ flex: 1, padding: "14px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, color: "#fca5a5", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                ❌ Mark Absent
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 22 }}>
        {[
          { label: "Days Present", val: presentDays, color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
          { label: "Days Absent", val: history.filter(h => h.status === "absent").length, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
          { label: "This Month", val: history.length, color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* History */}
      <h3 style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>RECENT HISTORY</h3>
      {history.length === 0 ? (
        <div style={{ color: "#475569", fontSize: 13, textAlign: "center", padding: 30 }}>No attendance records yet</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {history.map((h, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>{h.status === "in" || h.status === "out" ? "🟢" : "❌"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{h.date}</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>
                  {h.inTime ? `In: ${h.inTime}` : ""}
                  {h.outTime ? `  Out: ${h.outTime}` : ""}
                  {!h.inTime && !h.outTime ? "Absent" : ""}
                </div>
              </div>
              <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, fontWeight: 600,
                background: h.status === "absent" ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)",
                color: h.status === "absent" ? "#fca5a5" : "#86efac" }}>
                {h.status === "absent" ? "Absent" : h.status === "out" ? "Full Day" : "Present"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SCHOOL ADMIN APP ─────────────────────────────────────────────────────────
function SchoolAdminApp({ user, students, classes, teachers, staff, attendance, staffAttendance, savedDates, todayRecord, todayStaffRecord, onLogout }) {
  const [tab, setTab] = useState("overview"); // overview | classes | staff | teachers

  const d = today();
  const schoolClasses = classes.filter(c => c.schoolId === user.id);
  const schoolTeachers = teachers.filter(t => t.schoolId === user.id);
  const schoolStaff = staff.filter(s => s.schoolId === user.id);
  const allPersonnel = [...schoolTeachers, ...schoolStaff];

  // Aggregate today's student attendance per class
  const classStats = schoolClasses.map(cls => {
    const clsStudents = students.filter(s => s.classId === cls.id);
    const present = clsStudents.filter(s => todayRecord(s.id)?.status === "in").length;
    const absent = clsStudents.filter(s => todayRecord(s.id)?.status === "absent").length;
    const saved = !!savedDates[d];
    const teacher = schoolTeachers.find(t => t.id === cls.teacherId);
    return { ...cls, total: clsStudents.length, present, absent, notMarked: clsStudents.length - present - absent, saved, teacher };
  });

  // Total student stats
  const totalStudents = students.filter(s => classes.some(c => c.id === s.classId && c.schoolId === user.id)).length;
  const totalPresent = classStats.reduce((a, c) => a + c.present, 0);
  const totalAbsent = classStats.reduce((a, c) => a + c.absent, 0);

  // Personnel attendance
  const personnelStats = allPersonnel.map(p => {
    const rec = todayStaffRecord(p.id);
    return { ...p, rec, statusLabel: rec?.status === "in" ? "In" : rec?.status === "out" ? "Out" : rec?.status === "absent" ? "Absent" : "Not Marked" };
  });
  const staffPresent = personnelStats.filter(p => p.rec?.status === "in" || p.rec?.status === "out").length;
  const staffAbsent = personnelStats.filter(p => p.rec?.status === "absent").length;
  const staffNotMarked = personnelStats.filter(p => !p.rec?.status).length;

  const tabs = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "classes", label: "Classes", icon: "📋" },
    { id: "teachers", label: "Teachers", icon: "👩‍🏫" },
    { id: "staff", label: "Staff", icon: "🧑‍💼" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'Segoe UI', sans-serif", color: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "rgba(245,158,11,0.12)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏫</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{user.name}</div>
            <div style={{ color: "#94a3b8", fontSize: 11 }}>School Admin · {d}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ background: "rgba(239,68,68,0.2)", border: "none", borderRadius: 8, padding: "6px 12px", color: "#fca5a5", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Logout</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 16px" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>School Dashboard</h2>
            <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>{d} · Live attendance overview</p>

            {/* Big stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Students Present", val: totalPresent, total: totalStudents, color: "#22c55e", bg: "rgba(34,197,94,0.12)", icon: "🟢" },
                { label: "Students Absent", val: totalAbsent, total: totalStudents, color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: "❌" },
                { label: "Staff/Teachers In", val: staffPresent, total: allPersonnel.length, color: "#6366f1", bg: "rgba(99,102,241,0.12)", icon: "👩‍🏫" },
                { label: "Not Yet Marked", val: staffNotMarked + (totalStudents - totalPresent - totalAbsent), total: totalStudents + allPersonnel.length, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: "⏳" },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}25`, borderRadius: 14, padding: "14px 12px" }}>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>{s.icon} {s.label}</div>
                  <div style={{ fontWeight: 800, fontSize: 26, color: s.color }}>{s.val}</div>
                  <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>of {s.total}</div>
                  <MiniBar value={s.val} max={s.total || 1} color={s.color} />
                </div>
              ))}
            </div>

            {/* Class quick strip */}
            <h3 style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>CLASS-WISE TODAY</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {classStats.map(cls => (
                <div key={cls.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#a5b4fc", flexShrink: 0 }}>
                    {cls.grade}{cls.section}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{cls.name}</div>
                    <div style={{ color: "#64748b", fontSize: 11 }}>{cls.teacher?.name || "No teacher"}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "#86efac" }}>✅ {cls.present}</span>
                      <span style={{ fontSize: 11, color: "#fca5a5" }}>❌ {cls.absent}</span>
                      {cls.notMarked > 0 && <span style={{ fontSize: 11, color: "#f59e0b" }}>⏳ {cls.notMarked}</span>}
                    </div>
                    {cls.saved ? (
                      <span style={{ fontSize: 10, background: "rgba(34,197,94,0.2)", color: "#86efac", padding: "2px 7px", borderRadius: 5, fontWeight: 600 }}>Saved ✓</span>
                    ) : (
                      <span style={{ fontSize: 10, background: "rgba(245,158,11,0.15)", color: "#fde68a", padding: "2px 7px", borderRadius: 5 }}>Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Personnel quick strip */}
            <h3 style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>PERSONNEL TODAY</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "Present", val: staffPresent, color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
                { label: "Absent", val: staffAbsent, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
                { label: "Not Marked", val: staffNotMarked, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CLASSES TAB ── */}
        {tab === "classes" && (
          <div>
            <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 800 }}>Class Attendance · {d}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {classStats.map(cls => {
                const clsStudents = students.filter(s => s.classId === cls.id);
                return (
                  <div key={cls.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
                    {/* Class header */}
                    <div style={{ background: "rgba(99,102,241,0.12)", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{cls.name}</div>
                        <div style={{ color: "#94a3b8", fontSize: 12 }}>Teacher: {cls.teacher?.name || "—"} · {cls.teacher?.subject || ""}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <span style={{ fontSize: 12, color: "#86efac", fontWeight: 700 }}>✅ {cls.present}</span>
                          <span style={{ fontSize: 12, color: "#fca5a5", fontWeight: 700 }}>❌ {cls.absent}</span>
                          {cls.notMarked > 0 && <span style={{ fontSize: 12, color: "#fde68a" }}>⏳ {cls.notMarked}</span>}
                        </div>
                        {cls.saved
                          ? <span style={{ fontSize: 10, color: "#86efac" }}>Saved & Sent ✓</span>
                          : <span style={{ fontSize: 10, color: "#f59e0b" }}>Not yet saved</span>}
                      </div>
                    </div>
                    {/* Student list */}
                    <div style={{ padding: "10px 14px" }}>
                      {clsStudents.map(st => {
                        const rec = todayRecord(st.id);
                        return (
                          <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `hsl(${st.id.charCodeAt(2) * 37},45%,33%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{st.name.charAt(0)}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{st.name}</div>
                              <div style={{ fontSize: 10, color: "#475569" }}>Roll #{st.rollNo}</div>
                            </div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                              {rec?.inTime && <span style={{ fontSize: 10, color: "#22c55e" }}>In {rec.inTime}</span>}
                              {rec?.outTime && <span style={{ fontSize: 10, color: "#f59e0b" }}>Out {rec.outTime}</span>}
                              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, fontWeight: 600,
                                background: rec?.status === "in" ? "rgba(34,197,94,0.2)" : rec?.status === "absent" ? "rgba(239,68,68,0.2)" : rec?.status === "out" ? "rgba(245,158,11,0.2)" : "rgba(100,116,139,0.2)",
                                color: rec?.status === "in" ? "#86efac" : rec?.status === "absent" ? "#fca5a5" : rec?.status === "out" ? "#fde68a" : "#94a3b8" }}>
                                {rec?.status === "in" ? "Present" : rec?.status === "absent" ? "Absent" : rec?.status === "out" ? "Departed" : "—"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TEACHERS TAB ── */}
        {tab === "teachers" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>Teachers Attendance · {d}</h2>
            <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 16px" }}>{staffPresent}/{schoolTeachers.length} teachers signed in today</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {schoolTeachers.map(t => {
                const rec = todayStaffRecord(t.id);
                const cls = classes.find(c => c.id === t.classId);
                return (
                  <div key={t.id} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${rec?.status === "in" || rec?.status === "out" ? "rgba(34,197,94,0.2)" : rec?.status === "absent" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: 14, padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: `hsl(${t.id.charCodeAt(1)*40},45%,32%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{t.name.charAt(0)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                        <div style={{ color: "#64748b", fontSize: 12 }}>{t.subject} · {cls?.name || "No class"}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          {rec?.inTime && <span style={{ fontSize: 10, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "2px 6px", borderRadius: 4 }}>In {rec.inTime}</span>}
                          {rec?.outTime && <span style={{ fontSize: 10, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "2px 6px", borderRadius: 4 }}>Out {rec.outTime}</span>}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 8, fontWeight: 700,
                          background: rec?.status === "in" ? "rgba(34,197,94,0.2)" : rec?.status === "out" ? "rgba(245,158,11,0.2)" : rec?.status === "absent" ? "rgba(239,68,68,0.2)" : "rgba(100,116,139,0.15)",
                          color: rec?.status === "in" ? "#86efac" : rec?.status === "out" ? "#fde68a" : rec?.status === "absent" ? "#fca5a5" : "#64748b" }}>
                          {rec?.status === "in" ? "✅ In" : rec?.status === "out" ? "🔴 Out" : rec?.status === "absent" ? "❌ Absent" : "⏳ Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STAFF TAB ── */}
        {tab === "staff" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>Supporting Staff · {d}</h2>
            <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 16px" }}>{schoolStaff.filter(s => { const r = todayStaffRecord(s.id); return r?.status === "in" || r?.status === "out"; }).length}/{schoolStaff.length} staff signed in today</p>

            {/* Dept summary */}
            <div style={{ marginBottom: 16 }}>
              {[...new Set(schoolStaff.map(s => s.dept))].map(dept => {
                const deptStaff = schoolStaff.filter(s => s.dept === dept);
                const deptIn = deptStaff.filter(s => { const r = todayStaffRecord(s.id); return r?.status === "in" || r?.status === "out"; }).length;
                return (
                  <div key={dept} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{dept}</span>
                    <span style={{ fontSize: 12, color: deptIn === deptStaff.length ? "#86efac" : "#f59e0b" }}>{deptIn}/{deptStaff.length} present</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {schoolStaff.map(sf => {
                const rec = todayStaffRecord(sf.id);
                return (
                  <div key={sf.id} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${rec?.status === "in" || rec?.status === "out" ? "rgba(34,197,94,0.2)" : rec?.status === "absent" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: 14, padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: `hsl(${sf.id.charCodeAt(2)*50},40%,30%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{sf.name.charAt(0)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{sf.name}</div>
                        <div style={{ color: "#64748b", fontSize: 12 }}>{sf.role} · {sf.dept}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          {rec?.inTime && <span style={{ fontSize: 10, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "2px 6px", borderRadius: 4 }}>In {rec.inTime}</span>}
                          {rec?.outTime && <span style={{ fontSize: 10, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "2px 6px", borderRadius: 4 }}>Out {rec.outTime}</span>}
                        </div>
                      </div>
                      <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 8, fontWeight: 700,
                        background: rec?.status === "in" ? "rgba(34,197,94,0.2)" : rec?.status === "out" ? "rgba(245,158,11,0.2)" : rec?.status === "absent" ? "rgba(239,68,68,0.2)" : "rgba(100,116,139,0.15)",
                        color: rec?.status === "in" ? "#86efac" : rec?.status === "out" ? "#fde68a" : rec?.status === "absent" ? "#fca5a5" : "#64748b" }}>
                        {rec?.status === "in" ? "✅ In" : rec?.status === "out" ? "🔴 Out" : rec?.status === "absent" ? "❌ Absent" : "⏳ Pending"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Nav */}
      <div style={{ background: "rgba(15,23,42,0.95)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", padding: "8px 0" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, border: "none", background: "none", cursor: "pointer", padding: "8px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: tab === t.id ? "#f59e0b" : "#475569" }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
