import { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { recordAttendance, signOut } from '../services/api';
import { toast } from 'sonner';
import { 
  Camera, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  LogOut,
  LayoutDashboard,
  Users,
  QrCode
} from 'lucide-react';

interface ScanResult {
  status: 'success' | 'not_solvente' | 'not_found' | 'error';
  student?: any;
  message: string;
}

export default function ScannerView() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop().catch(console.error);
      }
    };
  }, [scanner]);

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      setScanner(html5QrCode);

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanError
      );

      setIsScanning(true);
      toast.success('Cámara activada');
    } catch (error) {
      console.error('Error starting scanner:', error);
      toast.error('Error al activar la cámara. Verifica los permisos.');
    }
  };

  const stopScanning = async () => {
    if (scanner) {
      try {
        await scanner.stop();
        setIsScanning(false);
        setScanner(null);
        toast.info('Cámara desactivada');
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    if (!user) return;

    // Stop scanner temporarily to prevent multiple scans
    if (scanner) {
      await scanner.pause(true);
    }

    try {
      const result = await recordAttendance(user.access_token, decodedText);

      if (result.ok && result.status === 'success') {
        setLastScanResult({
          status: 'success',
          student: result.student,
          message: `¡Asistencia registrada para ${result.student.nombre}!`,
        });
        setRecentScans((prev) => [
          { ...result.student, timestamp: new Date().toISOString(), status: 'success' },
          ...prev.slice(0, 9),
        ]);
        toast.success(`✓ ${result.student.nombre} - Asistencia registrada`);
      } else if (result.status === 'not_solvente') {
        setLastScanResult({
          status: 'not_solvente',
          student: result.student,
          message: `${result.student.nombre} está en MORA. No se registró asistencia.`,
        });
        toast.error(`✗ ${result.student.nombre} - Pago pendiente`);
      } else {
        setLastScanResult({
          status: 'not_found',
          message: 'Alumno no encontrado en el sistema',
        });
        toast.error('Alumno no encontrado');
      }
    } catch (error: any) {
      console.error('Error recording attendance:', error);
      setLastScanResult({
        status: 'error',
        message: 'Error al procesar el código QR',
      });
      toast.error('Error al procesar el código');
    }

    // Resume scanning after 2 seconds
    setTimeout(() => {
      if (scanner && isScanning) {
        scanner.resume();
      }
    }, 2000);
  };

  const onScanError = (error: any) => {
    // Ignore scan errors (they happen frequently when no QR is visible)
  };

  const handleLogout = async () => {
    if (scanner) {
      await scanner.stop();
    }
    
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
              <Camera className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Escáner QR - Asistencia</h1>
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
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <QrCode className="w-6 h-6" />
                Escanear Código QR
              </h2>

              {/* Scanner Container */}
              <div className="mb-6">
                <div
                  id="qr-reader"
                  className={`w-full ${isScanning ? 'block' : 'hidden'} rounded-lg overflow-hidden`}
                ></div>

                {!isScanning && (
                  <div className="bg-gray-100 rounded-lg p-12 text-center">
                    <Camera className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">
                      Activa la cámara para comenzar a escanear códigos QR
                    </p>
                    <button
                      onClick={startScanning}
                      className="px-8 py-4 bg-[#001f3f] text-white rounded-lg hover:bg-[#003366] transition-colors font-semibold text-lg"
                    >
                      Activar Cámara
                    </button>
                  </div>
                )}
              </div>

              {isScanning && (
                <button
                  onClick={stopScanning}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Detener Escáner
                </button>
              )}

              {/* Last Scan Result */}
              {lastScanResult && (
                <div
                  className={`mt-6 p-6 rounded-lg border-2 ${
                    lastScanResult.status === 'success'
                      ? 'bg-green-50 border-green-500'
                      : lastScanResult.status === 'not_solvente'
                      ? 'bg-red-50 border-red-500'
                      : 'bg-yellow-50 border-yellow-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {lastScanResult.status === 'success' ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                    ) : lastScanResult.status === 'not_solvente' ? (
                      <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-bold mb-1 ${
                          lastScanResult.status === 'success'
                            ? 'text-green-900'
                            : lastScanResult.status === 'not_solvente'
                            ? 'text-red-900'
                            : 'text-yellow-900'
                        }`}
                      >
                        {lastScanResult.message}
                      </h3>
                      {lastScanResult.student && (
                        <p
                          className={
                            lastScanResult.status === 'success'
                              ? 'text-green-700'
                              : 'text-red-700'
                          }
                        >
                          {lastScanResult.student.grado} - Sección {lastScanResult.student.seccion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Scans */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Registros Recientes ({recentScans.length})
              </h2>

              {recentScans.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No hay registros aún. Comienza escaneando códigos QR.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentScans.map((scan, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">
                          {scan.nombre}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {scan.grado} - Sección {scan.seccion}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {new Date(scan.timestamp).toLocaleTimeString('es', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">Instrucciones:</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Activa la cámara y permite el acceso cuando el navegador lo solicite</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Centra el código QR del alumno dentro del recuadro</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Si el alumno está solvente, la asistencia se registrará automáticamente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Si el alumno está en mora, aparecerá una alerta roja y NO se registrará</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
