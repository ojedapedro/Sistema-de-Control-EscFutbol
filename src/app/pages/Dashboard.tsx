import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { getAttendanceStats, getAttendance, signOut } from '../services/api';
import { toast } from 'sonner';
import { 
  LayoutDashboard,
  LogOut,
  Users,
  Camera,
  Calendar,
  TrendingUp,
  Download,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [selectedDate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, attendanceData] = await Promise.all([
        getAttendanceStats(user!.access_token, selectedDate),
        getAttendance(user!.access_token, selectedDate),
      ]);
      
      setStats(statsData.stats);
      setAttendance(attendanceData.attendance);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      navigate('/');
      toast.success('Sesión cerrada');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const exportToCSV = () => {
    if (attendance.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const headers = ['Nombre', 'Grado', 'Sección', 'Hora de Entrada'];
    const rows = attendance.map((a) => [
      a.studentName,
      a.grado,
      a.seccion,
      new Date(a.timestamp).toLocaleTimeString('es', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `asistencia-${selectedDate}.csv`;
    link.click();
    
    toast.success('Archivo CSV descargado');
  };

  const pieData = stats ? [
    { name: 'Presentes', value: stats.present, color: '#10b981' },
    { name: 'Ausentes', value: stats.absent, color: '#ef4444' },
  ] : [];

  const gradeData = stats ? Object.entries(stats.byGrade).map(([grade, data]: [string, any]) => ({
    grado: grade,
    presentes: data.present,
    ausentes: data.absent,
    total: data.total,
  })) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#001f3f] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Dashboard de Asistencia</h1>
                <p className="text-blue-200 text-sm">{user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5" />
                  Admin
                </button>
              )}
              <button
                onClick={() => navigate('/scanner')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Camera className="w-5 h-5" />
                Escáner
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Date Selector */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calendar className="w-6 h-6 text-gray-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-3 bg-[#001f3f] text-white rounded-lg hover:bg-[#003366] transition-colors font-semibold"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#001f3f]"></div>
          </div>
        ) : !stats ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <p className="text-gray-500">Error al cargar datos</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Alumnos</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Presentes</p>
                    <p className="text-3xl font-bold text-green-600">{stats.present}</p>
                  </div>
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Ausentes</p>
                    <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                  </div>
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Porcentaje</p>
                    <p className="text-3xl font-bold text-[#001f3f]">{stats.percentage}%</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-[#001f3f]" />
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Pie Chart */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Distribución General</h2>
                {stats.total > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No hay alumnos registrados
                  </div>
                )}
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Asistencia por Grado</h2>
                {gradeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={gradeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grado" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="presentes" fill="#10b981" name="Presentes" />
                      <Bar dataKey="ausentes" fill="#ef4444" name="Ausentes" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No hay datos por grado
                  </div>
                )}
              </div>
            </div>

            {/* Attendance List */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Lista de Asistencia ({attendance.length} registros)
              </h2>

              {attendance.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay registros de asistencia para esta fecha</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Grado</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Sección</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Hora de Entrada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((record) => (
                        <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{record.studentName}</td>
                          <td className="py-3 px-4 text-gray-600">{record.grado}</td>
                          <td className="py-3 px-4 text-gray-600">{record.seccion}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(record.timestamp).toLocaleTimeString('es', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
