import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createClient } from "@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-34a21b05/health", (c) => {
  return c.json({ status: "ok" });
});

// ============= AUTH ROUTES =============

// Sign up (Admin only - should be created manually first time)
app.post("/make-server-34a21b05/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: role || 'profesor' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Sign up error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Sign up exception: ${error}`);
    return c.json({ error: 'Error creating user' }, 500);
  }
});

// Get current user info
app.get("/make-server-34a21b05/me", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Get user error: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        role: user.user_metadata?.role || 'profesor'
      }
    });
  } catch (error) {
    console.log(`Get user exception: ${error}`);
    return c.json({ error: 'Error getting user info' }, 500);
  }
});

// ============= STUDENT ROUTES =============

// Get all students
app.get("/make-server-34a21b05/students", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const students = await kv.getByPrefix('student:');
    return c.json({ students });
  } catch (error) {
    console.log(`Get students error: ${error}`);
    return c.json({ error: 'Error retrieving students' }, 500);
  }
});

// Get student by ID
app.get("/make-server-34a21b05/students/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const student = await kv.get(`student:${id}`);
    
    if (!student) {
      return c.json({ error: 'Student not found' }, 404);
    }

    return c.json({ student });
  } catch (error) {
    console.log(`Get student error: ${error}`);
    return c.json({ error: 'Error retrieving student' }, 500);
  }
});

// Create student (Admin only)
app.post("/make-server-34a21b05/students", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Unauthorized - Admin only' }, 403);
    }

    const { nombre, grado, seccion } = await c.req.json();
    
    // Generate unique ID
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const student = {
      id,
      nombre,
      grado,
      seccion,
      solvente: true,
      createdAt: new Date().toISOString()
    };

    await kv.set(`student:${id}`, student);
    
    return c.json({ student });
  } catch (error) {
    console.log(`Create student error: ${error}`);
    return c.json({ error: 'Error creating student' }, 500);
  }
});

// Update student (Admin only)
app.put("/make-server-34a21b05/students/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Unauthorized - Admin only' }, 403);
    }

    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`student:${id}`);
    if (!existing) {
      return c.json({ error: 'Student not found' }, 404);
    }

    const student = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    await kv.set(`student:${id}`, student);
    
    return c.json({ student });
  } catch (error) {
    console.log(`Update student error: ${error}`);
    return c.json({ error: 'Error updating student' }, 500);
  }
});

// Delete student (Admin only)
app.delete("/make-server-34a21b05/students/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user || user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Unauthorized - Admin only' }, 403);
    }

    const id = c.req.param('id');
    await kv.del(`student:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete student error: ${error}`);
    return c.json({ error: 'Error deleting student' }, 500);
  }
});

// ============= ATTENDANCE ROUTES =============

// Record attendance
app.post("/make-server-34a21b05/attendance", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { studentId } = await c.req.json();
    
    // Check if student exists
    const student = await kv.get(`student:${studentId}`);
    if (!student) {
      return c.json({ error: 'Student not found', status: 'not_found' }, 404);
    }

    // Check if student is solvente
    if (!student.solvente) {
      return c.json({ 
        error: 'Student is not solvente', 
        status: 'not_solvente',
        student 
      }, 403);
    }

    // Record attendance
    const attendanceId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const attendance = {
      id: attendanceId,
      studentId,
      studentName: student.nombre,
      grado: student.grado,
      seccion: student.seccion,
      timestamp: new Date().toISOString(),
      date: today,
      recordedBy: user.id
    };

    await kv.set(`attendance:${attendanceId}`, attendance);
    
    return c.json({ attendance, student, status: 'success' });
  } catch (error) {
    console.log(`Record attendance error: ${error}`);
    return c.json({ error: 'Error recording attendance' }, 500);
  }
});

// Get attendance for a specific date
app.get("/make-server-34a21b05/attendance/:date", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const date = c.req.param('date');
    const allAttendance = await kv.getByPrefix('attendance:');
    
    // Filter by date
    const attendanceForDate = allAttendance.filter((a: any) => a.date === date);
    
    return c.json({ attendance: attendanceForDate, date });
  } catch (error) {
    console.log(`Get attendance error: ${error}`);
    return c.json({ error: 'Error retrieving attendance' }, 500);
  }
});

// Get attendance statistics
app.get("/make-server-34a21b05/attendance/stats/:date", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const date = c.req.param('date');
    const allAttendance = await kv.getByPrefix('attendance:');
    const allStudents = await kv.getByPrefix('student:');
    
    // Filter by date
    const attendanceForDate = allAttendance.filter((a: any) => a.date === date);
    
    const stats = {
      total: allStudents.length,
      present: attendanceForDate.length,
      absent: allStudents.length - attendanceForDate.length,
      percentage: allStudents.length > 0 
        ? Math.round((attendanceForDate.length / allStudents.length) * 100) 
        : 0,
      byGrade: {} as Record<string, any>
    };

    // Calculate by grade
    allStudents.forEach((student: any) => {
      const key = `${student.grado}${student.seccion || ''}`;
      if (!stats.byGrade[key]) {
        stats.byGrade[key] = { total: 0, present: 0, absent: 0 };
      }
      stats.byGrade[key].total++;
      
      const attended = attendanceForDate.some((a: any) => a.studentId === student.id);
      if (attended) {
        stats.byGrade[key].present++;
      } else {
        stats.byGrade[key].absent++;
      }
    });

    return c.json({ stats, date });
  } catch (error) {
    console.log(`Get attendance stats error: ${error}`);
    return c.json({ error: 'Error retrieving attendance statistics' }, 500);
  }
});

Deno.serve(app.fetch);