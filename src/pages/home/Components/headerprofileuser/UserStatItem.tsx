interface UserStatItemProps {
    icon: string;
    value: number;
    label?: string;
}

export function UserStatItem({ icon, value, label }: UserStatItemProps) {
    return (
        <div className="flex items-center gap-2 px-2 py-2 rounded-full bg-white">
            <img src={icon} alt="" className="size-5" />
            <span className="text-sm font-medium text-title-black font-rubik">{value}</span>
            {label && <span className="text-xs text-gray-500">{label}</span>}
        </div>
    );
}
