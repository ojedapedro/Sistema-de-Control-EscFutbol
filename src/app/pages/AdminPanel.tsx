import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { getStudents, createStudent, updateStudent, deleteStudent, signOut } from '../services/api';
import { toast } from 'sonner';
import { 
  Plus, 
  Download, 
  Edit, 
  Trash2, 
  LogOut, 
  QrCode, 
  Users, 
  LayoutDashboard,
  Camera,
  X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface Student {
  id: string;
  nombre: string;
  grado: string;
  seccion: string;
  solvente: boolean;
}

export default function AdminPanel() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showQRModal, setShowQRModal] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    grado: '',
    seccion: '',
  });
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const { students: data } = await getStudents(user!.access_token);
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Error al cargar alumnos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStudent) {
        await updateStudent(user!.access_token, editingStudent.id, formData);
        toast.success('Alumno actualizado');
      } else {
        await createStudent(user!.access_token, formData);
        toast.success('Alumno creado');
      }
      
      setShowModal(false);
      setEditingStudent(null);
      setFormData({ nombre: '', grado: '', seccion: '' });
      loadStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('Error al guardar alumno');
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      nombre: student.nombre,
      grado: student.grado,
      seccion: student.seccion,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este alumno?')) return;
    
    try {
      await deleteStudent(user!.access_token, id);
      toast.success('Alumno eliminado');
      loadStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Error al eliminar alumno');
    }
  };

  const handleToggleSolvente = async (student: Student) => {
    try {
      await updateStudent(user!.access_token, student.id, {
        solvente: !student.solvente,
      });
      toast.success(student.solvente ? 'Marcado en mora' : 'Marcado como solvente');
      loadStudents();
    } catch (error) {
      console.error('Error updating student status:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current || !showQRModal) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-${showQRModal.nombre.replace(/\s/g, '_')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#001f3f] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                <p className="text-blue-200 text-sm">{user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
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
        {/* Actions Bar */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Gestión de Alumnos ({students.length})
          </h2>
          <button
            onClick={() => {
              setEditingStudent(null);
              setFormData({ nombre: '', grado: '', seccion: '' });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#001f3f] text-white rounded-lg hover:bg-[#003366] transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Nuevo Alumno
          </button>
        </div>

        {/* Students Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#001f3f]"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay alumnos registrados</h3>
            <p className="text-gray-500">Comienza agregando tu primer alumno</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {student.nombre}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {student.grado} - Sección {student.seccion}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowQRModal(student)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Ver QR"
                  >
                    <QrCode className="w-5 h-5 text-[#001f3f]" />
                  </button>
                </div>

                {/* Status Toggle */}
                <div className="mb-4">
                  <button
                    onClick={() => handleToggleSolvente(student)}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                      student.solvente
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {student.solvente ? '✓ Solvente' : '✗ En Mora'}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingStudent ? 'Editar Alumno' : 'Nuevo Alumno'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent outline-none"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grado
                  </label>
                  <select
                    value={formData.grado}
                    onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Seleccionar grado</option>
                    {['1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°', '10°', '11°'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sección
                  </label>
                  <input
                    type="text"
                    value={formData.seccion}
                    onChange={(e) => setFormData({ ...formData, seccion: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent outline-none"
                    placeholder="A"
                    required
                    maxLength={2}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#001f3f] text-white rounded-lg hover:bg-[#003366] transition-colors font-semibold"
                  >
                    {editingStudent ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Código QR</h2>
                <button
                  onClick={() => setShowQRModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {showQRModal.nombre}
                </h3>
                <p className="text-gray-600 mb-6">
                  {showQRModal.grado} - Sección {showQRModal.seccion}
                </p>

                <div ref={qrRef} className="flex justify-center mb-6 bg-white p-8 rounded-lg">
                  <QRCodeSVG
                    value={showQRModal.id}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <button
                  onClick={handleDownloadQR}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#001f3f] text-white rounded-lg hover:bg-[#003366] transition-colors font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Descargar QR
                </button>

                <p className="mt-4 text-sm text-gray-500">
                  ID: {showQRModal.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
