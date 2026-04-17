const express = require("express");
const cors    = require("cors");
const path    = require("path");
const { query } = require("./db");
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

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ ok: true }));

// ─── Catch-all: serve React app (production) ──────────────────────────────────
if (PROD) {
  app.get("*", (_, res) => res.sendFile(path.join(__dirname, "../dist/index.html")));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server → http://localhost:${PORT} [${PROD ? "production" : "development"}]`));
