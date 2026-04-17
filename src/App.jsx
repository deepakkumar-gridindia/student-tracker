import { useState, useEffect, useRef } from "react";

const API = "";

// ─── Fallback / seed data (used when API is unreachable) ─────────────────────
const SCHOOLS = [
  { id: "s1", name: "Delhi Public School", code: "DPS2024", password: "dps123" },
  { id: "s2", name: "Kendriya Vidyalaya", code: "KV2024", password: "kv123" },
];

const TEACHERS = [
  { id: "GSood", name: "Gurpreet Sood", subject: "Mathematics", classId: "c1", schoolId: "s1", password: "GSood" },
  { id: "t2", name: "Mr. Rajan Verma", subject: "Science", classId: "c2", schoolId: "s1", password: "teacher2" },
];

const CLASSES = [
  { id: "c1", name: "Nursery-B", grade: "Nursery", section: "B", schoolId: "s1", teacherId: "GSood" },
  { id: "c2", name: "Class 6B", grade: "6", section: "B", schoolId: "s1", teacherId: "t2" },
];

const STUDENTS_INIT = [
  { id: "st1", name: "Agastya Kashyap", rollNo: "01", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p1" },
  { id: "st2", name: "Agastya Goyal", rollNo: "02", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p2" },
  { id: "st3", name: "Anaisha Chaudhary", rollNo: "03", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p3" },
  { id: "st4", name: "Ananta Deepshi Krishna", rollNo: "04", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p4" },
  { id: "st5", name: "Ananya Joshi", rollNo: "05", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p5" },
  { id: "st6", name: "Dhruvika Sinha", rollNo: "06", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p6" },
  { id: "st7", name: "Florina Sinha Mondal", rollNo: "07", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p7" },
  { id: "st8", name: "Hriday Dev Rastogi", rollNo: "08", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p8" },
  { id: "st9", name: "Ira Sambyal Rathi", rollNo: "09", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p9" },
  { id: "st10", name: "Ivaan Dev Mukherjee", rollNo: "10", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p10" },
  { id: "st11", name: "Jia Saluja", rollNo: "11", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p11" },
  { id: "st12", name: "Kamran Bhadra Sharma", rollNo: "12", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p12" },
  { id: "st13", name: "Meera Sukhija", rollNo: "13", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p13" },
  { id: "st14", name: "Mehr Singh", rollNo: "14", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p14" },
  { id: "st15", name: "Navya Sharma", rollNo: "15", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p15" },
  { id: "st16", name: "Nia Loomba", rollNo: "16", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p16" },
  { id: "st17", name: "Pakhi Chakrabarty", rollNo: "17", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p17" },
  { id: "st18", name: "Rashmika Rahul Morankar", rollNo: "18", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p18" },
  { id: "st19", name: "Samar Condoo", rollNo: "19", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p19" },
  { id: "st20", name: "Samrat Kubba", rollNo: "20", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p20" },
  { id: "st21", name: "Shanaya Ghosh", rollNo: "21", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p21" },
  { id: "st22", name: "Shaurya Arora", rollNo: "22", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p22" },
  { id: "st23", name: "Taarini Banerjee", rollNo: "23", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p23" },
  { id: "st24", name: "Varnika Sharma", rollNo: "24", classId: "c1", schoolId: "s1", photo: null,
    performance: { math: 85, science: 85, english: 85, hindi: 85, avg: 85 },
    attendance: 90, parentId: "p24" },
];

const PARENTS_INIT = [
  { id: "Agastya Kashyap_Parent", name: "Parent of Agastya Kashyap", studentId: "st1", phone: "9876543210", password: "Student@2026" },
  { id: "Agastya Goyal_Parent", name: "Parent of Agastya Goyal", studentId: "st2", phone: "9876543211", password: "Student@2026" },
  { id: "Anaisha Chaudhary_Parent", name: "Parent of Anaisha Chaudhary", studentId: "st3", phone: "9876543212", password: "Student@2026" },
  { id: "Ananta Deepshi Krishna_Parent", name: "Parent of Ananta Deepshi Krishna", studentId: "st4", phone: "9876543213", password: "Student@2026" },
  { id: "Ananya Joshi_Parent", name: "Parent of Ananya Joshi", studentId: "st5", phone: "9876543214", password: "Student@2026" },
  { id: "Dhruvika Sinha_Parent", name: "Parent of Dhruvika Sinha", studentId: "st6", phone: "9876543215", password: "Student@2026" },
  { id: "Florina Sinha Mondal_Parent", name: "Parent of Florina Sinha Mondal", studentId: "st7", phone: "9876543216", password: "Kailash@2026" },
  { id: "Hriday Dev Rastogi_Parent", name: "Parent of Hriday Dev Rastogi", studentId: "st8", phone: "9876543217", password: "Kailash@2026" },
  { id: "Ira Sambyal Rathi_Parent", name: "Parent of Ira Sambyal Rathi", studentId: "st9", phone: "9876543218", password: "Kailash@2026" },
  { id: "Ivaan Dev Mukherjee_Parent", name: "Parent of Ivaan Dev Mukherjee", studentId: "st10", phone: "9876543219", password: "Kailash@2026" },
  { id: "Jia Saluja_Parent", name: "Parent of Jia Saluja", studentId: "st11", phone: "9876543220", password: "Kailash@2026" },
  { id: "Kamran Bhadra Sharma_Parent", name: "Parent of Kamran Bhadra Sharma", studentId: "st12", phone: "9876543221", password: "Kailash@2026" },
  { id: "Meera Sukhija_Parent", name: "Parent of Meera Sukhija", studentId: "st13", phone: "9876543222", password: "Kailash@2026" },
  { id: "Mehr Singh_Parent", name: "Parent of Mehr Singh", studentId: "st14", phone: "9876543223", password: "Kailash@2026" },
  { id: "Navya Sharma_Parent", name: "Parent of Navya Sharma", studentId: "st15", phone: "9876543224", password: "Kailash@2026" },
  { id: "Nia Loomba_Parent", name: "Parent of Nia Loomba", studentId: "st16", phone: "9876543225", password: "Kailash@2026" },
  { id: "Pakhi Chakrabarty_Parent", name: "Parent of Pakhi Chakrabarty", studentId: "st17", phone: "9876543226", password: "Kailash@2026" },
  { id: "Rashmika Rahul Morankar_Parent", name: "Parent of Rashmika Rahul Morankar", studentId: "st18", phone: "9876543227", password: "Kailash@2026" },
  { id: "Samar Condoo_Parent", name: "Parent of Samar Condoo", studentId: "st19", phone: "9876543228", password: "Kailash@2026" },
  { id: "Samrat Kubba_Parent", name: "Parent of Samrat Kubba", studentId: "st20", phone: "9876543229", password: "Kailash@2026" },
  { id: "Shanaya Ghosh_Parent", name: "Parent of Shanaya Ghosh", studentId: "st21", phone: "9876543230", password: "Kailash@2026" },
  { id: "Shaurya Arora_Parent", name: "Parent of Shaurya Arora", studentId: "st22", phone: "9876543231", password: "Kailash@2026" },
  { id: "Taarini Banerjee_Parent", name: "Parent of Taarini Banerjee", studentId: "st23", phone: "9876543232", password: "Kailash@2026" },
  { id: "Varnika Sharma_Parent", name: "Parent of Varnika Sharma", studentId: "st24", phone: "9876543233", password: "Kailash@2026" },
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

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function AppFooter({ dark = true }) {
  return (
    <div style={{
      textAlign: "center", padding: "8px 12px",
      background: dark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.06)",
      borderTop: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.06)",
    }}>
      <span style={{
        fontSize: 14, fontWeight: 700, letterSpacing: 0.5,
        background: "linear-gradient(90deg, #a78bfa, #38bdf8, #a78bfa)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundSize: "200% auto", animation: "shimmer 3s linear infinite",
      }}>
        ✦ An Initiative by Deepshi's Proud Parents ✦
      </span>
      <style>{`@keyframes shimmer { to { background-position: 200% center; } }`}</style>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SchoolApp() {
  const ls = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };

  // Persist session across refresh
  const [screen, setScreen] = useState(() => ls("screen", "login"));
  const [user, setUser] = useState(() => ls("user", null));
  const [students, setStudents] = useState(STUDENTS_INIT);
  const [parents, setParents]   = useState(PARENTS_INIT);
  const [teachers, setTeachers] = useState(TEACHERS);
  const [classes, setClasses]   = useState(CLASSES);
  const [staff, setStaff]       = useState(STAFF_INIT);
  // Dynamic shared data — lives in DB, not localStorage
  const [attendance, setAttendance] = useState({});
  const [messages, setMessages] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [classImages, setClassImages] = useState([]);
  const [savedDates, setSavedDates] = useState({});
  const [staffAttendance, setStaffAttendance] = useState({});

  // Session persists across refresh (only non-shared data)
  useEffect(() => { localStorage.setItem("screen", JSON.stringify(screen)); }, [screen]);
  useEffect(() => { if (user) localStorage.setItem("user", JSON.stringify(user)); else localStorage.removeItem("user"); }, [user]);

  // Poll DB every 8 seconds — all clients stay in sync automatically
  useEffect(() => {
    const load = () => Promise.all([
      fetch("/api/attendance").then(r => r.json()).then(setAttendance).catch(() => {}),
      fetch("/api/notifications").then(r => r.json()).then(setNotifications).catch(() => {}),
      fetch("/api/messages").then(r => r.json()).then(setMessages).catch(() => {}),
      fetch("/api/class-images").then(r => r.json()).then(setClassImages).catch(() => {}),
      fetch("/api/saved-dates").then(r => r.json()).then(setSavedDates).catch(() => {}),
      fetch("/api/staff-attendance").then(r => r.json()).then(setStaffAttendance).catch(() => {}),
    ]);
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, []);

  // Fetch reference data from MySQL via API (falls back to hardcoded if unavailable)
  useEffect(() => {
    fetch(`${API}/api/data`)
      .then(r => r.json())
      .then(d => {
        if (d.teachers?.length) setTeachers(d.teachers);
        if (d.staff?.length)    setStaff(d.staff);
        if (d.students?.length) setStudents(d.students);
        if (d.parents?.length)  setParents(d.parents);
        if (d.classes?.length)  setClasses(d.classes);
      })
      .catch(() => {});
  }, []);

  // API login — falls back to local data check if server unreachable
  const apiLogin = async (role, id, password) => {
    try {
      const res  = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, id, password }),
      });
      return await res.json();
    } catch {
      return { success: false, error: "server_unavailable" };
    }
  };

  const handleLogin = (role, data) => { setUser({ role, ...data }); setScreen(role); };
  const handleLogout = () => { setUser(null); setScreen("login"); localStorage.removeItem("user"); localStorage.setItem("screen", JSON.stringify("login")); };

  const post = (url, body) => fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => {});

  const markAttendance = (studentId, field, value) => {
    const d = today(); const t = now();
    const rec = { ...(attendance[d]?.[studentId] || { status: null, inTime: null, outTime: null, remark: "", remarkPhoto: null }), [field]: value };
    if (field === "status" && value === "in"  && !attendance[d]?.[studentId]?.inTime) rec.inTime = t;
    if (field === "status" && value === "out") rec.outTime = t;
    setAttendance(prev => ({ ...prev, [d]: { ...(prev[d] || {}), [studentId]: rec } }));
    post("/api/attendance", { studentId, date: d, status: rec.status, inTime: rec.inTime, outTime: rec.outTime, remark: rec.remark, remarkPhoto: rec.remarkPhoto });
    if (field === "status") {
      const st = students.find(s => s.id === studentId);
      if (st) {
        const notif = { parentId: st.parentId, studentId, text: `${st.name} marked ${value === "in" ? "ARRIVED" : value === "out" ? "DEPARTED" : "ABSENT"} at ${t} on ${d}`, time: t, type: "attendance", date: d };
        setNotifications(n => [notif, ...n]);
        post("/api/notifications", [notif]);
      }
    }
  };

  const addRemark = (studentId, remark, remarkPhoto = null) => {
    const d = today();
    const rec = { ...(attendance[d]?.[studentId] || {}), remark, remarkPhoto };
    setAttendance(prev => ({ ...prev, [d]: { ...(prev[d] || {}), [studentId]: rec } }));
    post("/api/attendance", { studentId, date: d, status: rec.status, inTime: rec.inTime, outTime: rec.outTime, remark, remarkPhoto });
  };

  const saveAttendance = (classStudents) => {
    const d = today(); const savedAt = now();
    const dayRec = attendance[d] || {};
    const presentCount = classStudents.filter(s => dayRec[s.id]?.status === "in").length;
    const absentCount  = classStudents.filter(s => dayRec[s.id]?.status === "absent").length;
    const outCount     = classStudents.filter(s => dayRec[s.id]?.status === "out").length;
    setSavedDates(prev => ({ ...prev, [d]: { savedAt, presentCount, absentCount, outCount, total: classStudents.length } }));
    post("/api/saved-dates", { date: d, savedAt, presentCount, absentCount, outCount, total: classStudents.length });
    const newNotifs = classStudents.map(s => {
      const rec = dayRec[s.id];
      const statusLabel = rec?.status === "in" ? "✅ Present" : rec?.status === "absent" ? "❌ Absent" : rec?.status === "out" ? "🔴 Departed" : "⏳ Not Marked";
      return { parentId: s.parentId, studentId: s.id, text: `Attendance saved for ${d}: ${s.name} — ${statusLabel}${rec?.inTime ? ` (In: ${rec.inTime})` : ""}${rec?.outTime ? `, Out: ${rec.outTime}` : ""}${rec?.remark ? ` | Note: ${rec.remark}` : ""}`, time: savedAt, type: "attendanceSave", date: d };
    });
    setNotifications(prev => [...newNotifs, ...prev]);
    post("/api/notifications", newNotifs);
  };

  const resetAttendance = (classStudents) => {
    const d = today();
    setAttendance(prev => {
      const next = { ...prev };
      if (next[d]) {
        next[d] = { ...next[d] };
        classStudents.forEach(s => { delete next[d][s.id]; });
      }
      return next;
    });
    setSavedDates(prev => { const next = { ...prev }; delete next[d]; return next; });
    post("/api/attendance/reset", { date: d, studentIds: classStudents.map(s => s.id) });
  };

  const sendMessage = (studentId, from, text, image = null) => {
    const t = now(); const d = today();
    const msg = { from, text, time: t, image, date: d };
    setMessages(prev => ({ ...prev, [studentId]: [...(prev[studentId] || []), msg] }));
    post("/api/messages", { studentId, from, text, time: t, image, date: d });
    if (from === "parent") {
      const st = students.find(s => s.id === studentId);
      const notif = { teacherId: classes.find(c => c.id === st?.classId)?.teacherId, studentId, text: `Parent message for ${st?.name}: "${text.slice(0, 40)}..."`, time: t, type: "parentMsg" };
      setNotifications(n => [notif, ...n]);
      post("/api/notifications", [notif]);
    }
  };

  const markStaffAttendance = (staffId, status) => {
    const d = today(); const t = now();
    const rec = { ...(staffAttendance[d]?.[staffId] || {}), status };
    if (status === "in"  && !staffAttendance[d]?.[staffId]?.inTime) rec.inTime = t;
    if (status === "out") rec.outTime = t;
    setStaffAttendance(prev => ({ ...prev, [d]: { ...(prev[d] || {}), [staffId]: rec } }));
    post("/api/staff-attendance", { staffId, date: d, status, inTime: rec.inTime || null, outTime: rec.outTime || null });
  };

  const addClassImage = (img) => {
    post("/api/class-images", img).then(r => r?.json()).then(json => {
      if (json?.id) setClassImages(prev => [{ ...img, id: json.id }, ...prev]);
    }).catch(() => setClassImages(prev => [img, ...prev]));
  };

  const todayStaffRecord = (staffId) => staffAttendance[today()]?.[staffId] || null;
  const todayRecord = (studentId) => attendance[today()]?.[studentId] || null;

  if (screen === "login") return <LoginScreen onLogin={handleLogin} apiLogin={apiLogin}
    teachers={teachers} staff={staff} parents={parents} schools={SCHOOLS} />;
  if (screen === "teacher") return (
    <TeacherApp user={user} students={students} setStudents={setStudents} classes={classes}
      parents={parents} messages={messages} notifications={notifications} setNotifications={setNotifications}
      markAttendance={markAttendance} addRemark={addRemark} todayRecord={todayRecord}
      saveAttendance={saveAttendance} resetAttendance={resetAttendance} savedDates={savedDates}
      sendMessage={sendMessage} classImages={classImages} setClassImages={setClassImages} addClassImage={addClassImage}
      staffAttendance={staffAttendance} markStaffAttendance={markStaffAttendance} todayStaffRecord={todayStaffRecord}
      onLogout={handleLogout} />
  );
  if (screen === "parent") return (
    <ParentApp user={user} students={students} messages={messages}
      notifications={notifications} todayRecord={todayRecord}
      sendMessage={sendMessage} classImages={classImages} classes={classes}
      onLogout={handleLogout} />
  );
  if (screen === "school") return (
    <SchoolAdminApp user={user}
      students={students} setStudents={setStudents}
      classes={classes}   setClasses={setClasses}
      teachers={teachers} setTeachers={setTeachers}
      staff={staff}       setStaff={setStaff}
      parents={parents}   setParents={setParents}
      attendance={attendance} staffAttendance={staffAttendance}
      savedDates={savedDates} todayRecord={todayRecord} todayStaffRecord={todayStaffRecord}
      onLogout={handleLogout} />
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, apiLogin, teachers, staff, parents, schools }) {
  const [tab, setTab] = useState("teacher");
  const [form, setForm] = useState({ code: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErr(""); setLoading(true);
    const { code, password } = form;

    // Try API first
    const apiRole = tab === "staff" ? "teacher" : tab;
    const result = await apiLogin(apiRole, code, password);

    if (result.success) {
      setLoading(false);
      onLogin(apiRole, result.user);
      return;
    }

    // API unavailable — fall back to local data
    if (result.error === "server_unavailable") {
      if (tab === "teacher") {
        const t = teachers.find(t => t.id === code && t.password === password);
        if (t) { setLoading(false); onLogin("teacher", t); return; }
      } else if (tab === "staff") {
        const sf = staff.find(s => s.id === code && s.password === password);
        if (sf) { setLoading(false); onLogin("teacher", { ...sf, isStaff: true }); return; }
      } else if (tab === "parent") {
        const p = parents.find(p => p.id === code && p.password === password);
        if (p) { setLoading(false); onLogin("parent", p); return; }
      } else {
        const s = schools.find(s => s.code === code && s.password === password);
        if (s) { setLoading(false); onLogin("school", s); return; }
      }
    }

    setLoading(false);
    setErr(result.error && result.error !== "server_unavailable" ? result.error : "Invalid credentials");
  };

  const demos = {
    teacher: ["ID: GSood", "Pass: GSood"],
    staff:   ["ID: sf1", "Pass: staff1"],
    parent:  ["ID: Agastya Kashyap_Parent", "Pass: Student@2026"],
    school:  ["Code: BIS2024", "Pass: admin123"]
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", padding: 20, overflow: "hidden" }}>
      <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}>
        <source src="/GlowingFireFlies.mp4" type="video/mp4" />
      </video>
      <div style={{ position: "absolute", inset: 0, background: "rgba(5,10,25,0.55)", zIndex: 1 }} />
      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 2 }}>
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

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer", letterSpacing: 0.3, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </div>
        <div style={{ marginTop: 20 }}><AppFooter dark={false} /></div>
      </div>
    </div>
  );
}

// ─── TEACHER APP ──────────────────────────────────────────────────────────────
function TeacherApp({ user, students, setStudents, classes, parents, messages, notifications, setNotifications, markAttendance, addRemark, todayRecord, saveAttendance, resetAttendance, savedDates, staffAttendance, markStaffAttendance, todayStaffRecord, sendMessage, classImages, setClassImages, onLogout }) {
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
        {tab === "attendance" && !isStaff && <AttendancePage myStudents={myStudents} todayRecord={todayRecord} markAttendance={markAttendance} addRemark={addRemark} saveAttendance={saveAttendance} resetAttendance={resetAttendance} savedDates={savedDates} user={user} />}
        {tab === "students" && !isStaff && <AllStudentsPage myStudents={myStudents} todayRecord={todayRecord} viewStudent={viewStudent} />}
        {tab === "student" && selectedStudent && !isStaff && <StudentDetailPage student={selectedStudent} todayRecord={todayRecord} messages={messages[selectedStudent.id] || []} sendMessage={sendMessage} onBack={() => setTab("students")} user={user} savedDates={savedDates} markAttendance={markAttendance} setNotifications={setNotifications} />}
        {tab === "chat" && !isStaff && <TeacherChatPage myStudents={myStudents} messages={messages} sendMessage={sendMessage} parents={parents} />}
        {tab === "gallery" && !isStaff && <GalleryPage classImages={classImages} setClassImages={setClassImages} user={user} myClass={myClass} />}
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", padding: "8px 0" }}>
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
        <AppFooter />
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
// ─── CAMERA MODAL ─────────────────────────────────────────────────────────────
function CameraModal({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [facingMode, setFacingMode] = useState("environment");

  useEffect(() => {
    let active = true;
    const start = async () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setReady(false);
      setError("");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
        setReady(true);
      } catch {
        if (active) setError("Camera access denied. Please allow camera permission in your browser and try again.");
      }
    };
    start();
    return () => { active = false; if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); };
  }, [facingMode]);

  const capture = () => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    onCapture(c.toDataURL("image/jpeg", 0.88));
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>📸 Take Photo</div>
          <button onClick={onClose} style={{ background: "rgba(239,68,68,0.2)", border: "none", borderRadius: 8, padding: "6px 14px", color: "#fca5a5", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>✕ Close</button>
        </div>

        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#000", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", display: ready ? "block" : "none" }} />
          {!ready && !error && <div style={{ color: "#64748b", fontSize: 14 }}>Starting camera…</div>}
          {error && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 24, textAlign: "center" }}>
              <span style={{ fontSize: 40 }}>📷</span>
              <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>{error}</p>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button onClick={() => setFacingMode(f => f === "environment" ? "user" : "environment")}
            style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "#cbd5e1", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            🔄 Flip
          </button>
          <button onClick={capture} disabled={!ready}
            style={{ flex: 2, padding: "14px", background: ready ? "linear-gradient(135deg,#22c55e,#16a34a)" : "rgba(255,255,255,0.05)", border: "none", borderRadius: 12, color: ready ? "#fff" : "#475569", cursor: ready ? "pointer" : "not-allowed", fontSize: 15, fontWeight: 800, boxShadow: ready ? "0 4px 16px rgba(34,197,94,0.4)" : "none" }}>
            📸 Capture
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ATTENDANCE PAGE ───────────────────────────────────────────────────────────
function AttendancePage({ myStudents, todayRecord, markAttendance, addRemark, saveAttendance, resetAttendance, savedDates, user }) {
  const [editRemark, setEditRemark] = useState(null);
  const [remarkText, setRemarkText] = useState("");
  const [remarkPhoto, setRemarkPhoto] = useState(null);
  const [photoSource, setPhotoSource] = useState(null);
  const [saveState, setSaveState] = useState("idle"); // idle | confirming | saving | saved
  const [resetState, setResetState] = useState("idle"); // idle | confirming | resetting
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);

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
    setConfirmPassword("");
    setPasswordError("");
    setSaveState("confirming");
  };

  const confirmSave = () => {
    if (confirmPassword !== user.password) {
      setPasswordError("Incorrect password. Please try again.");
      return;
    }
    setPasswordError("");
    setSaveState("saving");
    setTimeout(() => {
      saveAttendance(myStudents);
      setSaveState("saved");
    }, 900);
  };

  const handleResetClick = () => {
    setConfirmPassword("");
    setPasswordError("");
    setResetState("confirming");
  };

  const confirmReset = () => {
    if (confirmPassword !== user.password) {
      setPasswordError("Incorrect password. Please try again.");
      return;
    }
    setPasswordError("");
    setResetState("resetting");
    setTimeout(() => {
      resetAttendance(myStudents);
      setSaveState("idle");
      setResetState("idle");
    }, 700);
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
            {/* Password Input */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Enter Your Password to Confirm</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Teacher password" onKeyDown={e => e.key === "Enter" && confirmSave()}
                style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.07)", border: `1px solid ${passwordError ? "#ef4444" : "rgba(255,255,255,0.12)"}`, borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              {passwordError && <p style={{ color: "#f87171", fontSize: 12, margin: "6px 0 0" }}>{passwordError}</p>}
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

      {/* Reset Confirm Modal */}
      {resetState === "confirming" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#1e293b", borderRadius: 20, padding: 28, maxWidth: 340, width: "100%", border: "1px solid rgba(239,68,68,0.3)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ fontSize: 40, textAlign: "center", marginBottom: 14 }}>🔄</div>
            <h3 style={{ textAlign: "center", margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#fca5a5" }}>Reset Today's Attendance?</h3>
            <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", margin: "0 0 20px", lineHeight: 1.6 }}>
              This will <strong style={{ color: "#f87171" }}>clear all {myStudents.length} attendance records</strong> for today and allow you to re-submit. Parents will not be re-notified until you save again.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Enter Your Password to Confirm Reset</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Teacher password" onKeyDown={e => e.key === "Enter" && confirmReset()}
                style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.07)", border: `1px solid ${passwordError ? "#ef4444" : "rgba(255,255,255,0.12)"}`, borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              {passwordError && <p style={{ color: "#f87171", fontSize: 12, margin: "6px 0 0" }}>{passwordError}</p>}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setResetState("idle")}
                style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#94a3b8", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={confirmReset}
                style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg,#ef4444,#dc2626)", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                🔄 Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resetting overlay */}
      {resetState === "resetting" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, border: "4px solid rgba(239,68,68,0.3)", borderTop: "4px solid #ef4444", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Resetting attendance...</div>
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
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: "#86efac", fontSize: 14 }}>Attendance Saved & Sent</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>
              Notified all {myStudents.length} parents at {savedDates[d]?.savedAt || now()} — {savedDates[d]?.presentCount ?? present} present, {savedDates[d]?.absentCount ?? absentCount} absent
            </div>
          </div>
          <button onClick={handleResetClick}
            style={{ flexShrink: 0, padding: "8px 14px", background: "rgba(239,68,68,0.18)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 10, color: "#fca5a5", cursor: "pointer", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
            🔄 Reset
          </button>
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

      {/* Hidden file input for gallery uploads */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => { handleFileRead(e.target.files[0]); e.target.value = ""; }} />

      {/* Camera modal */}
      {showCamera && (
        <CameraModal
          onCapture={url => { setRemarkPhoto(url); setPhotoSource("camera"); setShowCamera(false); }}
          onClose={() => setShowCamera(false)}
        />
      )}

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
                  <button key={val} onClick={() => !isSavedToday && markAttendance(s.id, "status", val)}
                    disabled={isSavedToday}
                    style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `1px solid ${status === val ? color : "rgba(255,255,255,0.1)"}`,
                      background: status === val ? `${color}25` : "transparent",
                      color: status === val ? color : "#64748b", fontWeight: status === val ? 700 : 400,
                      fontSize: 12, cursor: isSavedToday ? "not-allowed" : "pointer", transition: "all .15s",
                      opacity: isSavedToday ? 0.45 : 1 }}>
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
                      <button onClick={() => setShowCamera(true)}
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
                        <button onClick={() => { setRemarkPhoto(null); setPhotoSource(null); setShowCamera(true); }}
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
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{student.name}</h2>
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
            <div style={{ flex: 1 }}><span style={{ color: "#64748b", fontSize: 12 }}>Status: </span><span style={{ color: rec.status === "in" ? "#22c55e" : "#ef4444", fontWeight: 700, textTransform: "capitalize" }}>{rec.status || "Not Marked"}</span></div>
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

      {/* ── CORRECTION PANEL (after attendance is saved) ── */}
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
            <div style={{ color: "#94a3b8", fontSize: 13, flex: 1 }}>Selected: <strong style={{ color: "#fff" }}>{selectedStatus === "in" ? "Present" : selectedStatus === "out" ? "Departed" : "Absent"}</strong></div>
            <button onClick={() => setShowSubmit(true)}
              style={{ padding: "12px 18px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontWeight: 700 }}>
              Submit Correction
            </button>
          </div>
          {selectedStatus === rec.status && (
            <div style={{ marginTop: 10, color: "#fbbf24", fontSize: 12 }}>Choose a different status from the current one to submit a correction.</div>
          )}
          <div style={{ marginTop: 10, color: "#64748b", fontSize: 12 }}>Requires your teacher password. The corrected status with timestamp will be sent to the parent.</div>
        </div>
      )}

      {!isSavedToday && (
        <div style={{ marginBottom: 16, padding: 14, background: "rgba(148,163,184,0.1)", borderRadius: 12, border: "1px solid rgba(148,163,184,0.3)", color: "#cbd5e1", fontSize: 13 }}>
          Today's attendance has not been submitted yet. Use the Attendance page to mark and save. Corrections can be made from this page after submission.
        </div>
      )}

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

      {/* Confirm Correction Popup */}
      {showSubmit && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#1e293b", borderRadius: 20, padding: 28, maxWidth: 360, width: "100%", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ fontSize: 40, textAlign: "center", marginBottom: 14 }}>🔐</div>
            <h3 style={{ textAlign: "center", margin: "0 0 8px", fontSize: 18, fontWeight: 800 }}>Confirm Correction for {student.name}?</h3>
            <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", margin: "0 0 8px", lineHeight: 1.6 }}>
              Status will be corrected to <strong style={{ color: selectedStatus === "in" ? "#22c55e" : selectedStatus === "out" ? "#f59e0b" : "#ef4444" }}>
                {selectedStatus === "in" ? "Present" : selectedStatus === "out" ? "Departed" : "Absent"}
              </strong> with the current timestamp and the parent will be notified.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Teacher Password</label>
              <input type="password" value={submitPassword} onChange={e => setSubmitPassword(e.target.value)}
                placeholder="Enter your login password" onKeyDown={e => e.key === "Enter" && saveSingleAttendance()}
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
    </div>  );
}

// ─── GALLERY PAGE ─────────────────────────────────────────────────────────────
function GalleryPage({ classImages, setClassImages, addClassImage, user, myClass }) {
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [lightbox, setLightbox] = useState(null); // img object
  const fileRef = useRef(null);

  const myImages = classImages.filter(img => img.classId === user.classId);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const upload = () => {
    if (!preview) return;
    addClassImage({ url: preview, caption, time: now(), date: today(), uploadedBy: user.name, classId: user.classId });
    setPreview(null);
    setCaption("");
  };

  const saveEditCaption = (img) => {
    setClassImages(imgs => imgs.map(i => i.id === img.id ? { ...i, caption: editCaption } : i));
    fetch(`/api/class-images/${img.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caption: editCaption }) }).catch(() => {});
    setEditId(null);
    if (lightbox?.id === img.id) setLightbox({ ...lightbox, caption: editCaption });
  };

  const deleteImage = (img) => {
    setClassImages(imgs => imgs.filter(i => i.id !== img.id));
    fetch(`/api/class-images/${img.id}`, { method: "DELETE" }).catch(() => {});
    setLightbox(null);
  };

  // Group by date
  const byDate = {};
  myImages.forEach(img => {
    if (!byDate[img.date]) byDate[img.date] = [];
    byDate[img.date].push(img);
  });
  const sortedDates = Object.keys(byDate).sort((a, b) => {
    const parse = d => { const [dd, mm, yyyy] = d.split("/"); return new Date(yyyy, mm - 1, dd); };
    return parse(b) - parse(a);
  });

  return (
    <div>
      {showCamera && (
        <CameraModal
          onCapture={url => { setPreview(url); setShowCamera(false); }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", zIndex: 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <img src={lightbox.url} alt={lightbox.caption} onClick={e => e.stopPropagation()} style={{ maxWidth: "100%", maxHeight: "65vh", borderRadius: 14, objectFit: "contain" }} />
          <div onClick={e => e.stopPropagation()} style={{ marginTop: 14, width: "100%", maxWidth: 480 }}>
            {editId === lightbox.id ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input value={editCaption} onChange={e => setEditCaption(e.target.value)} autoFocus
                  style={{ flex: 1, padding: "9px 12px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 9, color: "#fff", fontSize: 13, outline: "none" }} />
                <button onClick={() => saveEditCaption(lightbox)} style={{ padding: "9px 14px", background: "#6366f1", border: "none", borderRadius: 9, color: "#fff", cursor: "pointer", fontWeight: 700 }}>Save</button>
                <button onClick={() => setEditId(null)} style={{ padding: "9px 12px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 9, color: "#94a3b8", cursor: "pointer" }}>✕</button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div>
                  {lightbox.caption ? <div style={{ color: "#e2e8f0", fontSize: 14, marginBottom: 4 }}>{lightbox.caption}</div> : <div style={{ color: "#475569", fontSize: 13, fontStyle: "italic" }}>No remark added</div>}
                  <div style={{ color: "#64748b", fontSize: 11 }}>{lightbox.uploadedBy} · {lightbox.date} · {lightbox.time}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => { setEditId(lightbox.id); setEditCaption(lightbox.caption || ""); }} style={{ padding: "6px 12px", background: "rgba(99,102,241,0.25)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 8, color: "#a5b4fc", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✏️ Edit</button>
                  <button onClick={() => deleteImage(lightbox)} style={{ padding: "6px 10px", background: "rgba(239,68,68,0.2)", border: "none", borderRadius: 8, color: "#fca5a5", cursor: "pointer", fontSize: 12 }}>🗑️</button>
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setLightbox(null)} style={{ marginTop: 18, padding: "8px 24px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>Close</button>
        </div>
      )}

      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>Class Gallery</h2>
      <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>{myClass?.name} · {myImages.length} photo{myImages.length !== 1 ? "s" : ""} shared with parents</p>

      {/* Upload panel */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 14, padding: 20, marginBottom: 24 }}>
        {preview ? (
          <div>
            <img src={preview} alt="preview" style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 12, marginBottom: 12, objectFit: "cover", display: "block" }} />
            <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a remark or caption for parents… (optional)"
              rows={2}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9, color: "#fff", fontSize: 13, outline: "none", resize: "none", marginBottom: 12, boxSizing: "border-box", lineHeight: 1.5 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setPreview(null); setCaption(""); }} style={{ flex: 1, padding: "10px", background: "rgba(239,68,68,0.15)", border: "none", borderRadius: 10, color: "#fca5a5", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={upload} style={{ flex: 2, padding: "10px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer" }}>📤 Share with Parents</button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📷</div>
            <p style={{ color: "#64748b", margin: "0 0 16px", fontSize: 13 }}>Capture or upload class photos to share with parents</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setShowCamera(true)}
                style={{ padding: "10px 20px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 10, color: "#6ee7b7", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                📸 Take Photo
              </button>
              <button onClick={() => fileRef.current?.click()}
                style={{ padding: "10px 20px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)", borderRadius: 10, color: "#a5b4fc", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                🖼️ Upload Photo
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </div>
        )}
      </div>

      {/* Gallery — date-wise */}
      {myImages.length === 0 ? (
        <div style={{ textAlign: "center", color: "#475569", padding: 40, fontSize: 13 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🖼️</div>
          No photos shared yet
        </div>
      ) : (
        <div>
          {sortedDates.map(date => (
            <div key={date} style={{ marginBottom: 28 }}>
              {/* Date header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.35)", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#a5b4fc" }}>
                  📅 {date}
                </div>
                <div style={{ color: "#334155", fontSize: 11 }}>{byDate[date].length} photo{byDate[date].length !== 1 ? "s" : ""}</div>
              </div>

              {/* Photo grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {byDate[date].map(img => (
                  <div key={img.id} onClick={() => { setLightbox(img); setEditId(null); }}
                    style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, overflow: "hidden", cursor: "pointer", border: "1px solid rgba(255,255,255,0.07)", transition: "border-color .2s" }}>
                    <div style={{ position: "relative" }}>
                      <img src={img.url} alt={img.caption} style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
                    </div>
                    <div style={{ padding: "8px 10px" }}>
                      {img.caption
                        ? <div style={{ fontSize: 12, color: "#e2e8f0", marginBottom: 3, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.caption}</div>
                        : <div style={{ fontSize: 11, color: "#475569", fontStyle: "italic", marginBottom: 3 }}>No remark</div>
                      }
                      <div style={{ fontSize: 10, color: "#475569" }}>{img.time} · {img.uploadedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PARENT APP ───────────────────────────────────────────────────────────────
function ParentApp({ user, students, messages, notifications, todayRecord, sendMessage, classImages, classes, onLogout }) {
  const [tab, setTab] = useState("home");
  const [msgText, setMsgText] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const chatRef = useRef(null);

  const student = students.find(s => s.id === user.studentId);
  if (!student) return <div style={{ padding: 40, color: "#fff", textAlign: "center" }}>Student not found</div>;

  const rec = todayRecord(student.id);
  const myMsgs = messages[student.id] || [];
  const myNotifs = notifications.filter(n => n.parentId === user.id || n.studentId === user.studentId);

  // Gallery — only photos from the student's class
  const myClassImages = (classImages || []).filter(img => img.classId === student.classId);
  const galleryByDate = {};
  myClassImages.forEach(img => {
    if (!galleryByDate[img.date]) galleryByDate[img.date] = [];
    galleryByDate[img.date].push(img);
  });
  const galleryDates = Object.keys(galleryByDate).sort((a, b) => {
    const parse = d => { const [dd, mm, yyyy] = d.split("/"); return new Date(yyyy, mm - 1, dd); };
    return parse(b) - parse(a);
  });

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
              <div style={{ flex: 1 }}>
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
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>📎 Photo from teacher</div>
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

        {tab === "gallery" && (
          <div>
            {/* Lightbox */}
            {lightbox !== null && (() => {
              const img = lightbox;
              return (
                <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.94)", zIndex: 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
                  <img src={img.url} alt={img.caption} onClick={e => e.stopPropagation()} style={{ maxWidth: "100%", maxHeight: "68vh", borderRadius: 14, objectFit: "contain" }} />
                  <div onClick={e => e.stopPropagation()} style={{ marginTop: 14, width: "100%", maxWidth: 480 }}>
                    {img.caption
                      ? <div style={{ color: "#e2e8f0", fontSize: 14, marginBottom: 6, lineHeight: 1.5 }}>{img.caption}</div>
                      : <div style={{ color: "#475569", fontSize: 13, fontStyle: "italic", marginBottom: 6 }}>No remark added</div>}
                    <div style={{ color: "#64748b", fontSize: 11 }}>📅 {img.date} · 🕐 {img.time} · {img.uploadedBy}</div>
                  </div>
                  <button onClick={() => setLightbox(null)} style={{ marginTop: 18, padding: "8px 24px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>Close</button>
                </div>
              );
            })()}

            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>Class Gallery</h2>
            <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>Photos shared by your child's teacher</p>

            {myClassImages.length === 0 ? (
              <div style={{ textAlign: "center", color: "#475569", padding: 60, fontSize: 13 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
                No photos have been shared yet
              </div>
            ) : (
              galleryDates.map(date => (
                <div key={date} style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#6ee7b7" }}>
                      📅 {date}
                    </div>
                    <div style={{ color: "#334155", fontSize: 11 }}>{galleryByDate[date].length} photo{galleryByDate[date].length !== 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {galleryByDate[date].map((img, i) => (
                      <div key={i} onClick={() => setLightbox(img)}
                        style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, overflow: "hidden", cursor: "pointer", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ position: "relative" }}>
                          <img src={img.url} alt={img.caption} style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }} />
                        </div>
                        <div style={{ padding: "8px 10px" }}>
                          {img.caption
                            ? <div style={{ fontSize: 12, color: "#e2e8f0", marginBottom: 3, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.caption}</div>
                            : <div style={{ fontSize: 11, color: "#475569", fontStyle: "italic", marginBottom: 3 }}>No remark</div>}
                          <div style={{ fontSize: 10, color: "#475569" }}>{img.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "rgba(15,23,42,0.95)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", padding: "8px 0" }}>
          {[["home", "🏠", "Home"], ["gallery", "🖼️", "Gallery"], ["chat", "💬", "Chat"]].map(([t, icon, label]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, border: "none", background: "none", cursor: "pointer", padding: "8px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                color: tab === t ? "#10b981" : "#475569" }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontSize: 11, fontWeight: tab === t ? 700 : 400 }}>{label}</span>
            </button>
          ))}
        </div>
        <AppFooter />
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

// ─── MANAGE PANEL (Admin CRUD) ────────────────────────────────────────────────
function ManagePanel({ schoolId, students, setStudents, classes, setClasses, teachers, setTeachers, staff, setStaff, parents, setParents }) {
  const [entity, setEntity] = useState("teachers");
  const [modal, setModal]   = useState(null); // null | { mode:"add"|"edit", data:{} }
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState("");

  const inp = (style = {}) => ({
    width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff",
    fontSize: 13, outline: "none", boxSizing: "border-box", ...style,
  });
  const lbl = { color: "#94a3b8", fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4, marginTop: 10 };

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  // ── SAVE (add or edit) ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!modal) return;
    setSaving(true);
    const { mode, data } = modal;
    const isEdit = mode === "edit";
    const url  = `${API}/api/admin/${entity}${isEdit ? "/" + data.id : ""}`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      // Update local state
      const record = json.data;
      if (entity === "teachers") setTeachers(prev => isEdit ? prev.map(r => r.id === record.id ? record : r) : [...prev, record]);
      if (entity === "staff")    setStaff(prev    => isEdit ? prev.map(r => r.id === record.id ? record : r) : [...prev, record]);
      if (entity === "students") setStudents(prev => isEdit ? prev.map(r => r.id === record.id ? record : r) : [...prev, record]);
      if (entity === "parents")  setParents(prev  => isEdit ? prev.map(r => r.id === record.id ? record : r) : [...prev, record]);
      if (entity === "classes")  setClasses(prev  => isEdit ? prev.map(r => r.id === record.id ? record : r) : [...prev, record]);

      flash(isEdit ? "Updated successfully ✓" : "Added successfully ✓");
      setModal(null);
    } catch (e) {
      flash("Error: " + e.message);
    } finally { setSaving(false); }
  };

  // ── DELETE ──────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;
    try {
      const res  = await fetch(`${API}/api/admin/${entity}/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      if (entity === "teachers") setTeachers(prev => prev.filter(r => r.id !== id));
      if (entity === "staff")    setStaff(prev    => prev.filter(r => r.id !== id));
      if (entity === "students") setStudents(prev => prev.filter(r => r.id !== id));
      if (entity === "parents")  setParents(prev  => prev.filter(r => r.id !== id));
      if (entity === "classes")  setClasses(prev  => prev.filter(r => r.id !== id));
      flash("Deleted ✓");
    } catch (e) { flash("Error: " + e.message); }
  };

  // ── Default empty forms ─────────────────────────────────────────────────────
  const emptyForm = {
    teachers: { id: "", name: "", subject: "", classId: "", schoolId, password: "" },
    staff:    { id: "", name: "", role: "", dept: "", schoolId, password: "" },
    students: { id: "", name: "", rollNo: "", classId: "", schoolId, parentId: "" },
    parents:  { id: "", name: "", studentId: "", phone: "", password: "" },
    classes:  { id: "", name: "", grade: "", section: "", schoolId, teacherId: "" },
  };

  // ── Current records list ─────────────────────────────────────────────────────
  const records = {
    teachers: teachers.filter(t => t.schoolId === schoolId),
    staff:    staff.filter(s => s.schoolId === schoolId),
    students: students.filter(s => s.schoolId === schoolId),
    parents,
    classes:  classes.filter(c => c.schoolId === schoolId),
  }[entity];

  // ── Column definitions ───────────────────────────────────────────────────────
  const cols = {
    teachers: ["id", "name", "subject", "classId", "password"],
    staff:    ["id", "name", "role", "dept", "password"],
    students: ["id", "name", "rollNo", "classId", "parentId"],
    parents:  ["id", "name", "studentId", "phone", "password"],
    classes:  ["id", "name", "grade", "section", "teacherId"],
  }[entity];

  // ── Modal form fields ────────────────────────────────────────────────────────
  const renderFields = () => {
    const d = modal?.data || {};
    const set = (k, v) => setModal(m => ({ ...m, data: { ...m.data, [k]: v } }));
    const isEdit = modal?.mode === "edit";

    const Field = ({ label, k, type = "text", placeholder = "" }) => (
      <div>
        <label style={lbl}>{label}</label>
        <input type={type} value={d[k] || ""} onChange={e => set(k, e.target.value)}
          placeholder={placeholder} style={inp()} disabled={isEdit && k === "id"} />
      </div>
    );
    const Select = ({ label, k, options }) => (
      <div>
        <label style={lbl}>{label}</label>
        <select value={d[k] || ""} onChange={e => set(k, e.target.value)}
          style={{ ...inp(), appearance: "none" }}>
          <option value="">— none —</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    );

    if (entity === "teachers") return <>
      <Field label="LOGIN ID *" k="id" placeholder="e.g. GSood" />
      <Field label="FULL NAME *" k="name" />
      <Field label="SUBJECT" k="subject" placeholder="e.g. Mathematics" />
      <Select label="ASSIGNED CLASS" k="classId" options={classes.filter(c => c.schoolId === schoolId).map(c => ({ value: c.id, label: c.name }))} />
      <Field label="PASSWORD *" k="password" type="password" />
    </>;
    if (entity === "staff") return <>
      <Field label="LOGIN ID *" k="id" placeholder="e.g. sf7" />
      <Field label="FULL NAME *" k="name" />
      <Field label="ROLE / DESIGNATION" k="role" placeholder="e.g. Librarian" />
      <Field label="DEPARTMENT" k="dept" placeholder="e.g. Administration" />
      <Field label="PASSWORD *" k="password" type="password" />
    </>;
    if (entity === "students") return <>
      <Field label="STUDENT ID *" k="id" placeholder="e.g. st25" />
      <Field label="FULL NAME *" k="name" />
      <Field label="ROLL NUMBER" k="rollNo" placeholder="e.g. 25" />
      <Select label="CLASS *" k="classId" options={classes.filter(c => c.schoolId === schoolId).map(c => ({ value: c.id, label: c.name }))} />
      <Select label="LINKED PARENT" k="parentId" options={parents.map(p => ({ value: p.id, label: `${p.name} (${p.id})` }))} />
    </>;
    if (entity === "parents") return <>
      <Field label="LOGIN ID *" k="id" placeholder="e.g. StudentName_Parent" />
      <Field label="FULL NAME *" k="name" />
      <Field label="PHONE" k="phone" placeholder="e.g. 9876543210" />
      <Select label="LINKED STUDENT" k="studentId" options={students.filter(s => s.schoolId === schoolId).map(s => ({ value: s.id, label: `${s.name} (${s.id})` }))} />
      <Field label="PASSWORD *" k="password" type="password" />
    </>;
    if (entity === "classes") return <>
      <Field label="CLASS ID *" k="id" placeholder="e.g. c3" />
      <Field label="CLASS NAME *" k="name" placeholder="e.g. Class 5A" />
      <Field label="GRADE" k="grade" placeholder="e.g. 5" />
      <Field label="SECTION" k="section" placeholder="e.g. A" />
      <Select label="CLASS TEACHER" k="teacherId" options={teachers.filter(t => t.schoolId === schoolId).map(t => ({ value: t.id, label: t.name }))} />
    </>;
    return null;
  };

  const entityLabels = { teachers: "Teachers", staff: "Staff", students: "Students", parents: "Parents", classes: "Classes" };
  const btnStyle = (active) => ({
    padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
    background: active ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.06)",
    color: active ? "#fbbf24" : "#94a3b8",
  });

  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>Manage School Data</h2>
      <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 16px" }}>Add, edit, or remove teachers, students, parents, staff and classes</p>

      {msg && <div style={{ background: msg.startsWith("Error") ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", border: `1px solid ${msg.startsWith("Error") ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.3)"}`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: msg.startsWith("Error") ? "#fca5a5" : "#86efac" }}>{msg}</div>}

      {/* Entity tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {["teachers", "staff", "students", "parents", "classes"].map(e => (
          <button key={e} style={btnStyle(entity === e)} onClick={() => setEntity(e)}>
            {entityLabels[e]}
          </button>
        ))}
      </div>

      {/* Add button */}
      <button onClick={() => setModal({ mode: "add", data: { ...emptyForm[entity] } })}
        style={{ marginBottom: 14, padding: "9px 18px", background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10, color: "#fbbf24", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
        + Add {entityLabels[entity].slice(0, -1)}
      </button>

      {/* Records table */}
      {records.length === 0 ? (
        <div style={{ textAlign: "center", color: "#475569", padding: 40, fontSize: 13 }}>No {entityLabels[entity].toLowerCase()} found</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {records.map(r => (
            <div key={r.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{r.name}</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>
                  {cols.filter(k => k !== "name" && k !== "password").map(k => r[k] ? `${k}: ${r[k]}` : null).filter(Boolean).join("  ·  ")}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button onClick={() => setModal({ mode: "edit", data: { ...r } })}
                  style={{ padding: "5px 12px", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, color: "#a5b4fc", cursor: "pointer", fontSize: 12 }}>Edit</button>
                <button onClick={() => handleDelete(r.id)}
                  style={{ padding: "5px 12px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#fca5a5", cursor: "pointer", fontSize: 12 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={() => setModal(null)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#1e293b", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 500, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>{modal.mode === "add" ? "Add" : "Edit"} {entityLabels[entity].slice(0, -1)}</h3>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", color: "#64748b", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            {renderFields()}
            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button onClick={handleSave} disabled={saving}
                style={{ flex: 1, padding: 13, background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 14, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving…" : modal.mode === "add" ? "Add Record" : "Save Changes"}
              </button>
              <button onClick={() => setModal(null)}
                style={{ padding: "13px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCHOOL ADMIN APP ─────────────────────────────────────────────────────────
function SchoolAdminApp({ user, students, setStudents, classes, setClasses, teachers, setTeachers, staff, setStaff, parents, setParents, attendance, staffAttendance, savedDates, todayRecord, todayStaffRecord, onLogout }) {
  const [tab, setTab] = useState("overview"); // overview | classes | teachers | staff | manage

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
    { id: "classes",  label: "Classes",  icon: "📋" },
    { id: "teachers", label: "Teachers", icon: "👩‍🏫" },
    { id: "staff",    label: "Staff",    icon: "🧑‍💼" },
    { id: "manage",   label: "Manage",   icon: "⚙️" },
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
                    <div style={{ color: "#64748b", fontSize: 12 }}>{cls.teacher?.name || "No teacher"}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <span style={{ fontSize: 11, color: "#86efac" }}>✅ {cls.present}</span>
                      <span style={{ fontSize: 11, color: "#fca5a5" }}>❌ {cls.absent}</span>                      {cls.notMarked > 0 && <span style={{ fontSize: 11, color: "#f59e0b" }}>⏳ {cls.notMarked}</span>}
                    </div>
                    {cls.saved ? (
                      <span style={{ fontSize: 10, color: "#86efac" }}>Saved ✓</span>
                    ) : (
                      <span style={{ fontSize: 10, color: "#f59e0b" }}>Pending</span>
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

        {/* ── MANAGE TAB ── */}
        {tab === "manage" && (
          <ManagePanel
            schoolId={user.id}
            students={students} setStudents={setStudents}
            classes={classes}   setClasses={setClasses}
            teachers={teachers} setTeachers={setTeachers}
            staff={staff}       setStaff={setStaff}
            parents={parents}   setParents={setParents}
          />
        )}

      </div>

      {/* Bottom Nav */}
      <div style={{ background: "rgba(15,23,42,0.95)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", padding: "8px 0" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, border: "none", background: "none", cursor: "pointer", padding: "6px 2px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: tab === t.id ? "#f59e0b" : "#475569" }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span style={{ fontSize: 9, fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
            </button>
          ))}
        </div>
        <AppFooter />
      </div>
    </div>
  );
}