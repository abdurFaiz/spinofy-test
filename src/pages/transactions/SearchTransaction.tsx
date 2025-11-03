import HeaderSearchBar from "@/components/HeadSearchBar";
import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import { useNavigate } from "react-router-dom";

export default function SearchTransaction() {
    const navigate = useNavigate();
    return (
        <ScreenWrapper>
            <HeaderSearchBar placeholder="Cari berdasarkan item atau nama Cafe" onBack={() => navigate('/transactions')} />
        </ScreenWrapper>
    )
}