import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuth } from '@/hooks/Auth/auth.hooks';
import { CheckCircle, ArrowRight } from 'lucide-react';

function RegistrationSuccess() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleContinue = () => {
    navigate('/dashboard', { replace: true });
  };

  const handleStartOrdering = () => {
    navigate('/menu', { replace: true });
  };

  if (!user) return null;

  return (
    <ScreenWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 -mt-20">
        <div className="flex flex-col items-center gap-8 max-w-md mx-auto w-full text-center">
          {/* Success Icon */}
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-50">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>

          {/* Success Message */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-title-black leading-tight font-rubik">
              Selamat Datang, {user.name}!
            </h1>
            <p className="text-base text-body-grey leading-normal">
              Akun Anda telah berhasil dibuat dan siap digunakan.
              Sekarang Anda dapat menikmati kemudahan memesan makanan
              dan minuman favorit Anda.
            </p>
          </div>

          {/* User Info Card */}
          <div className="w-full p-6 bg-primary-orange/5 border border-primary-orange/20 rounded-2xl">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-body-grey">Nama:</span>
                <span className="text-sm font-medium text-title-black">{user.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-body-grey">WhatsApp:</span>
                <span className="text-sm font-medium text-title-black">{user.phone}</span>
              </div>
              {user.customer_profile.job && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-body-grey">Pekerjaan:</span>
                  <span className="text-sm font-medium text-title-black capitalize">
                    {user.customer_profile.job}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 w-full">
            <button
              onClick={handleStartOrdering}
              className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-primary-orange hover:bg-primary-orange/90 transition-colors rounded-[32px] text-white font-medium text-base"
            >
              <span>Mulai Pesan Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleContinue}
              className="flex items-center justify-center gap-3 w-full py-4 px-6 border-2 border-primary-orange hover:bg-primary-orange/5 transition-colors rounded-[32px] text-primary-orange font-medium text-base"
            >
              Jelajahi Dashboard
            </button>
          </div>

          {/* Features Preview */}
          <div className="w-full mt-6">
            <h3 className="text-lg font-semibold text-title-black mb-4">
              Apa yang bisa Anda lakukan?
            </h3>
            <div className="grid gap-4">
              <div className="flex items-start gap-3 text-left">
                <div className="w-2 h-2 bg-primary-orange rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-title-black">Scan & Pesan</p>
                  <p className="text-xs text-body-grey">
                    Scan QR code di meja untuk langsung melihat menu
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <div className="w-2 h-2 bg-primary-orange rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-title-black">Pembayaran Mudah</p>
                  <p className="text-xs text-body-grey">
                    Bayar langsung melalui aplikasi dengan berbagai metode
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <div className="w-2 h-2 bg-primary-orange rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-title-black">Lacak Pesanan</p>
                  <p className="text-xs text-body-grey">
                    Pantau status pesanan Anda secara real-time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
}

export default RegistrationSuccess;
