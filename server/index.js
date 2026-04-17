const express = require("express");
const cors    = require("cors");
const path    = require("path");
const { query, insertGetId } = require("./db");
const seed    = require("./seed");
require("dotenv").config();

const app  = express();
const PROD = process.env.NODE_ENV === "production";

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

// Serve built React app in production (same origin → no CORS, no env vars needed)
if (PROD) {
  const dist = path.join(__dirname, "../dist");
  app.use(express.static(dist));
}

// ─── Row mappers ──────────────────────────────────────────────────────────────
const mapT  = t => ({ id: t.id, name: t.name, subject: t.subject,  classId: t.class_id,  schoolId: t.school_id, password: t.password });
const mapS  = s => ({ id: s.id, name: s.name, role: s.role, dept: s.dept, schoolId: s.school_id, password: s.password });
const mapSt = s => ({
  id: s.id, name: s.name, rollNo: s.roll_no,
  classId: s.class_id, schoolId: s.school_id, parentId: s.parent_id,
  photo: s.photo,
  performance: { math: s.math_score, science: s.science_score, english: s.english_score, hindi: s.hindi_score, avg: s.avg_score },
  attendance: s.attendance_pct,
});
const mapP  = p => ({ id: p.id, name: p.name, studentId: p.student_id, phone: p.phone, password: p.password });
const mapC  = c => ({ id: c.id, name: c.name, grade: c.grade, section: c.section, schoolId: c.school_id, teacherId: c.teacher_id });

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  const { role, id, password } = req.body;
  try {
    if (role === "teacher") {
      const rows = await query("SELECT * FROM teachers WHERE id = ? AND password = ?", [id, password]);
      if (rows.length) return res.json({ success: true, user: mapT(rows[0]) });
      const srows = await query("SELECT * FROM staff WHERE id = ? AND password = ?", [id, password]);
      if (srows.length) return res.json({ success: true, user: { ...mapS(srows[0]), isStaff: true } });
      return res.json({ success: false, error: "Invalid ID or password" });
    }
    if (role === "parent") {
      const rows = await query("SELECT * FROM parents WHERE id = ? AND password = ?", [id, password]);
      if (rows.length) return res.json({ success: true, user: mapP(rows[0]) });
      return res.json({ success: false, error: "Invalid ID or password" });
    }
    if (role === "school") {
      const rows = await query("SELECT * FROM schools WHERE code = ? AND password = ?", [id, password]);
      if (rows.length) return res.json({ success: true, user: rows[0] });
      return res.json({ success: false, error: "Invalid school code or password" });
    }
    res.json({ success: false, error: "Unknown role" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── FETCH ALL REFERENCE DATA ─────────────────────────────────────────────────
app.get("/api/data", async (req, res) => {
  try {
    const [teachers, staff, students, parents, classes, schools] = await Promise.all([
      query("SELECT * FROM teachers ORDER BY name"),
      query("SELECT * FROM staff    ORDER BY name"),
      query("SELECT * FROM students ORDER BY name"),
      query("SELECT * FROM parents  ORDER BY name"),
      query("SELECT * FROM classes  ORDER BY name"),
      query("SELECT * FROM schools  ORDER BY name"),
    ]);
    res.json({ teachers: teachers.map(mapT), staff: staff.map(mapS), students: students.map(mapSt), parents: parents.map(mapP), classes: classes.map(mapC), schools });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ─── ADMIN CRUD HELPER ────────────────────────────────────────────────────────
function crud(entity, table, mapper, insertSql, updateSql, insertParams, updateParams) {
  app.post(`/api/admin/${entity}`, async (req, res) => {
    try {
      await query(insertSql, insertParams(req.body));
      const rows = await query(`SELECT * FROM ${table} WHERE id = ?`, [req.body.id]);
      res.json({ success: true, data: mapper(rows[0]) });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  app.put(`/api/admin/${entity}/:id`, async (req, res) => {
    try {
      await query(updateSql, [...updateParams(req.body), req.params.id]);
      const rows = await query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
      res.json({ success: true, data: mapper(rows[0]) });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  app.delete(`/api/admin/${entity}/:id`, async (req, res) => {
    try {
      await query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
}

crud("teachers", "teachers", mapT,
  "INSERT INTO teachers (id,name,subject,class_id,school_id,password) VALUES (?,?,?,?,?,?)",
  "UPDATE teachers SET name=?,subject=?,class_id=?,school_id=?,password=? WHERE id=?",
  b => [b.id, b.name, b.subject||null, b.classId||null, b.schoolId, b.password],
  b => [b.name, b.subject||null, b.classId||null, b.schoolId, b.password]
);
crud("staff", "staff", mapS,
  "INSERT INTO staff (id,name,role,dept,school_id,password) VALUES (?,?,?,?,?,?)",
  "UPDATE staff SET name=?,role=?,dept=?,school_id=?,password=? WHERE id=?",
  b => [b.id, b.name, b.role||null, b.dept||null, b.schoolId, b.password],
  b => [b.name, b.role||null, b.dept||null, b.schoolId, b.password]
);
crud("students", "students", mapSt,
  "INSERT INTO students (id,name,roll_no,class_id,school_id,parent_id) VALUES (?,?,?,?,?,?)",
  "UPDATE students SET name=?,roll_no=?,class_id=?,school_id=?,parent_id=? WHERE id=?",
  b => [b.id, b.name, b.rollNo||null, b.classId||null, b.schoolId, b.parentId||null],
  b => [b.name, b.rollNo||null, b.classId||null, b.schoolId, b.parentId||null]
);
crud("parents", "parents", mapP,
  "INSERT INTO parents (id,name,student_id,phone,password) VALUES (?,?,?,?,?)",
  "UPDATE parents SET name=?,student_id=?,phone=?,password=? WHERE id=?",
  b => [b.id, b.name, b.studentId||null, b.phone||null, b.password],
  b => [b.name, b.studentId||null, b.phone||null, b.password]
);
crud("classes", "classes", mapC,
  "INSERT INTO classes (id,name,grade,section,school_id,teacher_id) VALUES (?,?,?,?,?,?)",
  "UPDATE classes SET name=?,grade=?,section=?,school_id=?,teacher_id=? WHERE id=?",
  b => [b.id, b.name, b.grade||null, b.section||null, b.schoolId, b.teacherId||null],
  b => [b.name, b.grade||null, b.section||null, b.schoolId, b.teacherId||null]
);

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
app.get("/api/attendance", async (_, res) => {
  try {
    const rows = await query("SELECT * FROM attendance");
    const out = {};
    rows.forEach(r => {
      if (!out[r.date]) out[r.date] = {};
      out[r.date][r.student_id] = { status: r.status, inTime: r.in_time, outTime: r.out_time, remark: r.remark, remarkPhoto: r.remark_photo };
    });
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/attendance", async (req, res) => {
  const { studentId, date, status, inTime, outTime, remark, remarkPhoto } = req.body;
  try {
    const ex = await query("SELECT 1 FROM attendance WHERE student_id=? AND date=?", [studentId, date]);
    if (ex.length) {
      await query("UPDATE attendance SET status=?,in_time=?,out_time=?,remark=?,remark_photo=? WHERE student_id=? AND date=?",
        [status||null, inTime||null, outTime||null, remark||null, remarkPhoto||null, studentId, date]);
    } else {
      await query("INSERT INTO attendance (student_id,date,status,in_time,out_time,remark,remark_photo) VALUES (?,?,?,?,?,?,?)",
        [studentId, date, status||null, inTime||null, outTime||null, remark||null, remarkPhoto||null]);
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── STAFF ATTENDANCE ─────────────────────────────────────────────────────────
app.get("/api/staff-attendance", async (_, res) => {
  try {
    const rows = await query("SELECT * FROM staff_attendance");
    const out = {};
    rows.forEach(r => {
      if (!out[r.date]) out[r.date] = {};
      out[r.date][r.staff_id] = { status: r.status, inTime: r.in_time, outTime: r.out_time };
    });
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/staff-attendance", async (req, res) => {
  const { staffId, date, status, inTime, outTime } = req.body;
  try {
    const ex = await query("SELECT 1 FROM staff_attendance WHERE staff_id=? AND date=?", [staffId, date]);
    if (ex.length) {
      await query("UPDATE staff_attendance SET status=?,in_time=?,out_time=? WHERE staff_id=? AND date=?",
        [status, inTime||null, outTime||null, staffId, date]);
    } else {
      await query("INSERT INTO staff_attendance (staff_id,date,status,in_time,out_time) VALUES (?,?,?,?,?)",
        [staffId, date, status, inTime||null, outTime||null]);
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── SAVED DATES ──────────────────────────────────────────────────────────────
app.get("/api/saved-dates", async (_, res) => {
  try {
    const rows = await query("SELECT * FROM saved_dates");
    const out = {};
    rows.forEach(r => { out[r.date] = { savedAt: r.saved_at, presentCount: r.present_count, absentCount: r.absent_count, outCount: r.out_count, total: r.total }; });
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/saved-dates", async (req, res) => {
  const { date, savedAt, presentCount, absentCount, outCount, total } = req.body;
  try {
    const ex = await query("SELECT 1 FROM saved_dates WHERE date=?", [date]);
    if (ex.length) {
      await query("UPDATE saved_dates SET saved_at=?,present_count=?,absent_count=?,out_count=?,total=? WHERE date=?",
        [savedAt, presentCount, absentCount, outCount, total, date]);
    } else {
      await query("INSERT INTO saved_dates (date,saved_at,present_count,absent_count,out_count,total) VALUES (?,?,?,?,?,?)",
        [date, savedAt, presentCount, absentCount, outCount, total]);
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// Reset attendance for a list of students on a date, and remove the saved-date entry
app.post("/api/attendance/reset", async (req, res) => {
  const { date, studentIds } = req.body;
  try {
    for (const sid of studentIds) {
      await query("DELETE FROM attendance WHERE student_id=? AND date=?", [sid, date]);
    }
    await query("DELETE FROM saved_dates WHERE date=?", [date]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
app.get("/api/notifications", async (_, res) => {
  try {
    const rows = await query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 300");
    res.json(rows.map(r => ({ parentId: r.parent_id, studentId: r.student_id, teacherId: r.teacher_id, text: r.text, time: r.time, type: r.type, date: r.date })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/notifications", async (req, res) => {
  const list = Array.isArray(req.body) ? req.body : [req.body];
  try {
    for (const n of list) {
      await query("INSERT INTO notifications (parent_id,student_id,teacher_id,text,time,type,date) VALUES (?,?,?,?,?,?,?)",
        [n.parentId||null, n.studentId||null, n.teacherId||null, n.text, n.time, n.type||null, n.date||null]);
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
app.get("/api/messages", async (_, res) => {
  try {
    const rows = await query("SELECT * FROM messages ORDER BY created_at ASC");
    const out = {};
    rows.forEach(r => {
      if (!out[r.student_id]) out[r.student_id] = [];
      out[r.student_id].push({ from: r.from_role, text: r.text, time: r.time, image: r.image, date: r.date });
    });
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/messages", async (req, res) => {
  const { studentId, from, text, time, image, date } = req.body;
  try {
    await query("INSERT INTO messages (student_id,from_role,text,time,image,date) VALUES (?,?,?,?,?,?)",
      [studentId, from, text, time, image||null, date]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── CLASS IMAGES ─────────────────────────────────────────────────────────────
app.get("/api/class-images", async (_, res) => {
  try {
    const rows = await query("SELECT id,class_id,url,caption,date,time,uploaded_by FROM class_images ORDER BY created_at DESC");
    res.json(rows.map(r => ({ id: r.id, classId: r.class_id, url: r.url, caption: r.caption, date: r.date, time: r.time, uploadedBy: r.uploaded_by })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/class-images", async (req, res) => {
  const { classId, url, caption, date, time, uploadedBy } = req.body;
  try {
    const id = await insertGetId("INSERT INTO class_images (class_id,url,caption,date,time,uploaded_by) VALUES (?,?,?,?,?,?)",
      [classId, url, caption||null, date, time, uploadedBy]);
    res.json({ success: true, id });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.patch("/api/class-images/:id", async (req, res) => {
  try {
    await query("UPDATE class_images SET caption=? WHERE id=?", [req.body.caption, req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete("/api/class-images/:id", async (req, res) => {
  try {
    await query("DELETE FROM class_images WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ ok: true }));

// ─── Catch-all: serve React app (production) ──────────────────────────────────
if (PROD) {
  app.get("*", (_, res) => res.sendFile(path.join(__dirname, "../dist/index.html")));
}

const PORT = process.env.PORT || 3001;
seed().then(() => {
  app.listen(PORT, () => console.log(`Server → http://localhost:${PORT} [${PROD ? "production" : "development"}]`));
});
