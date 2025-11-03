import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import { authAPI } from "@/api/auth.api";
import { useAuthContext } from "@/contexts/AuthContext";
import { OutletSelection } from "@/components/OutletSelection";

function Welcome() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthContext();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showOutletSelection, setShowOutletSelection] = useState(false);

  // Wait for auth context to initialize before checking authentication
  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);

  // Check if we should show outlet selection for authenticated users
  useEffect(() => {
    if (isInitialized && isAuthenticated && !isLoading) {
      setShowOutletSelection(true);
    }
  }, [isAuthenticated, isLoading, isInitialized, navigate]);

  const handleGoogleClick = async () => {
    try {
      // Use the API method to initiate Google login
      await authAPI.loginWithGoogle();
    } catch (error) {
      console.error('Error during Google login:', error);
      // You can add error handling here (show toast, etc.)
    }
  };

  const handleGuestClick = () => {
    setShowOutletSelection(true);
  };

  const handleOutletSelect = (outletSlug: string) => {
    navigate(`/${outletSlug}/home`);
  };
  // Show outlet selection if authenticated or guest clicked
  if (showOutletSelection) {
    return (
      <ScreenWrapper>
        <div className="flex-1 flex flex-col justify-center px-4 py-8">
          <div className="max-w-md mx-auto w-full">
            <OutletSelection onOutletSelect={handleOutletSelect} />

            {/* Back button */}
            <button
              onClick={() => setShowOutletSelection(false)}
              className="mt-6 w-full text-body-grey text-center py-2"
            >
              ← Back to login
            </button>
          </div>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      {/* Hero Image Section */}
      <div className="relative w-full ">
        <img
          src="/images/welcome-image.png"
          alt="Woman using phone in cafe"
          className="w-full h-full object-cover rounded-b-[28px]"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between -mt-10 z-20 px-4">
        <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
          {/* Text Content */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-title-black leading-tight font-rubik">
              Pesan Semudah Chatting!
            </h1>
            <p className="text-base text-body-grey leading-normal">
              Scan QR di mejamu, pilih menu, dan pesan langsung dari HP kamu.
              Praktis!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            {/* Google Button */}
            <button
              onClick={handleGoogleClick}
              className="flex items-center cursor-pointer justify-center gap-3 w-full py-4 px-6 bg-white border-2 border-title-black transition-colors rounded-[32px] text-title-black font-medium text-base"
            >
              <img
                src="/icons/icon-google.svg"
                alt="Google Icon"
                className="w-6 h-6"
                width={24}
                height={24}
              />
              <span>Lanjutkan dengan Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-body-grey"></div>
              <span className="text-xs text-bg-body-grey">Atau</span>
              <div className="flex-1 h-px bg-body-grey"></div>
            </div>

            {/* Guest Link */}
            <button
              onClick={handleGuestClick}
              className="text-base font-medium cursor-pointer text-body-grey text-center hover:text-body-grey/80 transition-colors py-2"
            >
              Lanjutkan sebagai tamu
            </button>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
}

export default Welcome;