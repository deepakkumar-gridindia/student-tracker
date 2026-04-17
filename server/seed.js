const { query, isPG } = require("./db");

const ins = (sql, values) =>
  isPG
    ? `${sql} ON CONFLICT DO NOTHING`
    : sql.replace("INSERT INTO", "INSERT IGNORE INTO");

async function seed() {
  try {
    // ── Create tables ─────────────────────────────────────────────────────────
    await query(`CREATE TABLE IF NOT EXISTS schools (
      id VARCHAR(50) PRIMARY KEY, name VARCHAR(200) NOT NULL,
      code VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(200) NOT NULL)`);

    await query(`CREATE TABLE IF NOT EXISTS classes (
      id VARCHAR(50) PRIMARY KEY, name VARCHAR(100) NOT NULL,
      grade VARCHAR(50), section VARCHAR(10),
      school_id VARCHAR(50), teacher_id VARCHAR(50))`);

    await query(`CREATE TABLE IF NOT EXISTS teachers (
      id VARCHAR(50) PRIMARY KEY, name VARCHAR(200) NOT NULL,
      subject VARCHAR(100), class_id VARCHAR(50),
      school_id VARCHAR(50) NOT NULL, password VARCHAR(200) NOT NULL)`);

    await query(`CREATE TABLE IF NOT EXISTS staff (
      id VARCHAR(50) PRIMARY KEY, name VARCHAR(200) NOT NULL,
      role VARCHAR(100), dept VARCHAR(100),
      school_id VARCHAR(50) NOT NULL, password VARCHAR(200) NOT NULL)`);

    await query(`CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(50) PRIMARY KEY, name VARCHAR(200) NOT NULL,
      roll_no VARCHAR(20), class_id VARCHAR(50), school_id VARCHAR(50),
      parent_id VARCHAR(50), photo TEXT,
      attendance_pct INT DEFAULT 90, math_score INT DEFAULT 85,
      science_score INT DEFAULT 85, english_score INT DEFAULT 85,
      hindi_score INT DEFAULT 85, avg_score INT DEFAULT 85)`);

    await query(`CREATE TABLE IF NOT EXISTS parents (
      id VARCHAR(50) PRIMARY KEY, name VARCHAR(200) NOT NULL,
      student_id VARCHAR(50), phone VARCHAR(20), password VARCHAR(200) NOT NULL)`);

    // ── Seed rows (safe: skips if already exist) ───────────────────────────────
    const exec = (sql) => query(ins(sql));

    await exec(`INSERT INTO schools VALUES
      ('s1','Bluebells International','BIS2024','admin123'),
      ('s2','Kendriya Vidyalaya','KV2024','kv123')`);

    await exec(`INSERT INTO classes VALUES
      ('c1','Nursery-B','Nursery','B','s1','GSood'),
      ('c2','Class 6B','6','B','s1','t2')`);

    await exec(`INSERT INTO teachers VALUES
      ('GSood','Gurpreet Sood','Mathematics','c1','s1','GSood'),
      ('t2','Mr. Rajan Verma','Science','c2','s1','teacher2')`);

    await exec(`INSERT INTO staff VALUES
      ('sf1','Mr. Deepak Rao','Vice Principal','Administration','s1','staff1'),
      ('sf2','Mrs. Sunita Kumari','Lab Assistant','Science','s1','staff2'),
      ('sf3','Mr. Ramesh Gupta','Office Clerk','Administration','s1','staff3'),
      ('sf4','Mrs. Anita Devi','Librarian','Library','s1','staff4'),
      ('sf5','Mr. Sunil Sharma','Peon','Support','s1','staff5'),
      ('sf6','Mrs. Kavita Singh','Nurse','Medical','s1','staff6')`);

    await exec(`INSERT INTO students (id,name,roll_no,class_id,school_id,parent_id) VALUES
      ('st1','Agastya Kashyap','01','c1','s1','Agastya Kashyap_Parent'),
      ('st2','Agastya Goyal','02','c1','s1','Agastya Goyal_Parent'),
      ('st3','Anaisha Chaudhary','03','c1','s1','Anaisha Chaudhary_Parent'),
      ('st4','Ananta Deepshi Krishna','04','c1','s1','Ananta Deepshi Krishna_Parent'),
      ('st5','Ananya Joshi','05','c1','s1','Ananya Joshi_Parent'),
      ('st6','Dhruvika Sinha','06','c1','s1','Dhruvika Sinha_Parent'),
      ('st7','Florina Sinha Mondal','07','c1','s1','Florina Sinha Mondal_Parent'),
      ('st8','Hriday Dev Rastogi','08','c1','s1','Hriday Dev Rastogi_Parent'),
      ('st9','Ira Sambyal Rathi','09','c1','s1','Ira Sambyal Rathi_Parent'),
      ('st10','Ivaan Dev Mukherjee','10','c1','s1','Ivaan Dev Mukherjee_Parent'),
      ('st11','Jia Saluja','11','c1','s1','Jia Saluja_Parent'),
      ('st12','Kamran Bhadra Sharma','12','c1','s1','Kamran Bhadra Sharma_Parent'),
      ('st13','Meera Sukhija','13','c1','s1','Meera Sukhija_Parent'),
      ('st14','Mehr Singh','14','c1','s1','Mehr Singh_Parent'),
      ('st15','Navya Sharma','15','c1','s1','Navya Sharma_Parent'),
      ('st16','Nia Loomba','16','c1','s1','Nia Loomba_Parent'),
      ('st17','Pakhi Chakrabarty','17','c1','s1','Pakhi Chakrabarty_Parent'),
      ('st18','Rashmika Rahul Morankar','18','c1','s1','Rashmika Rahul Morankar_Parent'),
      ('st19','Samar Condoo','19','c1','s1','Samar Condoo_Parent'),
      ('st20','Samrat Kubba','20','c1','s1','Samrat Kubba_Parent'),
      ('st21','Shanaya Ghosh','21','c1','s1','Shanaya Ghosh_Parent'),
      ('st22','Shaurya Arora','22','c1','s1','Shaurya Arora_Parent'),
      ('st23','Taarini Banerjee','23','c1','s1','Taarini Banerjee_Parent'),
      ('st24','Varnika Sharma','24','c1','s1','Varnika Sharma_Parent')`);

    await exec(`INSERT INTO parents (id,name,student_id,phone,password) VALUES
      ('Agastya Kashyap_Parent','Parent of Agastya Kashyap','st1','9876543210','Student@2026'),
      ('Agastya Goyal_Parent','Parent of Agastya Goyal','st2','9876543211','Student@2026'),
      ('Anaisha Chaudhary_Parent','Parent of Anaisha Chaudhary','st3','9876543212','Student@2026'),
      ('Ananta Deepshi Krishna_Parent','Parent of Ananta Deepshi Krishna','st4','9876543213','Student@2026'),
      ('Ananya Joshi_Parent','Parent of Ananya Joshi','st5','9876543214','Student@2026'),
      ('Dhruvika Sinha_Parent','Parent of Dhruvika Sinha','st6','9876543215','Student@2026'),
      ('Florina Sinha Mondal_Parent','Parent of Florina Sinha Mondal','st7','9876543216','Student@2026'),
      ('Hriday Dev Rastogi_Parent','Parent of Hriday Dev Rastogi','st8','9876543217','Student@2026'),
      ('Ira Sambyal Rathi_Parent','Parent of Ira Sambyal Rathi','st9','9876543218','Student@2026'),
      ('Ivaan Dev Mukherjee_Parent','Parent of Ivaan Dev Mukherjee','st10','9876543219','Student@2026'),
      ('Jia Saluja_Parent','Parent of Jia Saluja','st11','9876543220','Student@2026'),
      ('Kamran Bhadra Sharma_Parent','Parent of Kamran Bhadra Sharma','st12','9876543221','Student@2026'),
      ('Meera Sukhija_Parent','Parent of Meera Sukhija','st13','9876543222','Student@2026'),
      ('Mehr Singh_Parent','Parent of Mehr Singh','st14','9876543223','Student@2026'),
      ('Navya Sharma_Parent','Parent of Navya Sharma','st15','9876543224','Student@2026'),
      ('Nia Loomba_Parent','Parent of Nia Loomba','st16','9876543225','Student@2026'),
      ('Pakhi Chakrabarty_Parent','Parent of Pakhi Chakrabarty','st17','9876543226','Student@2026'),
      ('Rashmika Rahul Morankar_Parent','Parent of Rashmika Rahul Morankar','st18','9876543227','Student@2026'),
      ('Samar Condoo_Parent','Parent of Samar Condoo','st19','9876543228','Student@2026'),
      ('Samrat Kubba_Parent','Parent of Samrat Kubba','st20','9876543229','Student@2026'),
      ('Shanaya Ghosh_Parent','Parent of Shanaya Ghosh','st21','9876543230','Student@2026'),
      ('Shaurya Arora_Parent','Parent of Shaurya Arora','st22','9876543231','Student@2026'),
      ('Taarini Banerjee_Parent','Parent of Taarini Banerjee','st23','9876543232','Student@2026'),
      ('Varnika Sharma_Parent','Parent of Varnika Sharma','st24','9876543233','Student@2026')`);

    console.log("✓ Database tables ready and seeded");
  } catch (err) {
    console.error("Seed error:", err.message);
  }
}

module.exports = seed;
