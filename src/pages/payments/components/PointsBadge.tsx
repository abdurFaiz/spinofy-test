interface PointsBadgeProps {
    points: number;
}

export function PointsBadge({ points }: PointsBadgeProps) {
    return (
        <div className="mx-4 px-4 py-3 rounded-xl bg-primary-orange/20 flex items-center gap-1">
            <div className="flex items-center gap-1">
                <img src="/icons/icon-poin.svg" alt="Points Badge" className="w-6 h-6" />
                <span className="text-sm font-rubik font-medium text-primary-orange">Dapatkan {points} Poin</span>
            </div>
            <span className="text-sm font-rubik capitalize">dari pesanan ini</span>
        </div>
    );
}