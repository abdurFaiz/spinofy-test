import { ChevronRight } from "lucide-react";
import { UserHeaderTop } from "./UserHeaderTop";
import { useOutletNavigation } from "@/hooks/useOutletNavigation";

interface UserPointsCardProps {
    name: string;
    vouchers: number;
    points: number;
    onClickRedeem?: () => void;
}

export function UserPointsCard({
    name,
    vouchers,
    points,
}: UserPointsCardProps) {
    const { navigateToRewardPoin } = useOutletNavigation();
    return (
        <div className="px-4 -mt-16 relative z-10">
            <div className="p-4 rounded-3xl border border-body-grey/5 bg-white shadow-lg">

                <UserHeaderTop name={name} vouchers={vouchers} points={points} />

                <button
                    onClick={navigateToRewardPoin}
                    className="flex cursor-pointer items-center justify-between w-full pt-5"
                >
                    <span className="text-sm font-medium text-title-black font-rubik">
                        Tukarkan poinmu dengan tawaran menarik
                    </span>
                    <ChevronRight className="w-5 h-5 text-title-black font-rubik" />
                </button>
            </div>
        </div>
    );
}