import { UserStatItem } from "./UserStatItem";

interface UserHeaderTopProps {
    name: string;
    vouchers: number;
    points: number;
}

export function UserHeaderTop({ name, vouchers, points }: UserHeaderTopProps) {
    return (
        <div className="flex items-center justify-between pb-5 border-b border-body-grey/25">
            <h2 className="text-base font-medium text-title-black font-rubik">Hi, {name} 👋</h2>
            <div className="flex items-center gap-1 px-1 py-1 rounded-full bg-body-grey/15">
                <UserStatItem icon="/icons/icon-voucher.svg" value={vouchers} />
                <UserStatItem icon="/icons/icon-poin.svg" value={points} label="Poin" />
            </div>
        </div>
    );
}
