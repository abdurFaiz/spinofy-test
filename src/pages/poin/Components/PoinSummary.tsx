interface PointsSummaryProps {
    points: number;
    message?: string;
}

export const PointsSummary = ({ points, message = "Total poin yang berhasil kamu kumpulkan. Hebat!" }: PointsSummaryProps) => {
    return (
        <div className="flex flex-col gap-6 p-4 bg-gradient-to-r from-white to-primary-orange/80 border-2 border-primary-orange/80 rounded-3xl mt-6">
            <div className="flex flex-row gap-3 items-center p-1 rounded-full bg-primary-orange w-fit">
                <img src="/icons/icon-poin.svg" alt="icon poin" className="size-8 ml-1" />
                <div className="px-2 p-1 rounded-full bg-white">
                    <span className="text-xl font-medium font-rubik text-primary-orange">{points} Poin</span>
                </div>
            </div>
            <p className="font-medium text-base font-rubik leading-tight">{message}</p>
        </div>
    );
};
