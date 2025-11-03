import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenWrapper } from "./components/layout/ScreenWrapper";
import Button from "./components/ui/button";

export default function NotFound() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/NotFound', { replace: true });
        globalThis.history.pushState(null, '', globalThis.location.href);
        globalThis.onpopstate = function () {
            navigate('/NotFound', { replace: true });
        };
    }, [navigate]);

    return (
        <ScreenWrapper>
            <div className="flex flex-col gap-6 items-center justify-center p-4 my-auto">
                <img src="/images/404.svg" alt="" className="w-full" />
                <div className="flex flex-col gap-4 px-6">
                    <h1 className="text-2xl text-center font-rubik text-primary-orange font-medium">
                        Sistem Tidak Mengerti Permintaan Ini
                    </h1>
                    <p className="text-base text-center font-rubik text-body-grey">
                        Mungkin link-nya salah atau sudah nggak tersedia. Yuk pilih halaman yang jelas-jelas ada.
                    </p>
                    <Button onClick={() => navigate('/onboard', { replace: true })} variant="primary" size="xl">
                        Kembali Ke Beranda
                    </Button>
                </div>
            </div>
        </ScreenWrapper>
    );
}
