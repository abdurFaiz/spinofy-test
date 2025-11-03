import { SpecialOfferCard } from "./SpecialOfferCard";
import type { SpecialOffer } from "@/types/SpecialOffer";

interface SpecialOffersSectionProps {
    offers: SpecialOffer[];
    onAddOffer: (offerId: string) => void;
}

export function SpecialOffersSection({ offers, onAddOffer }: SpecialOffersSectionProps) {
    return (
        <div className="py-4 bg-gradient-to-b from-white via-white/60 to-primary-orange/20 flex flex-col gap-4">
            <h2 className="text-lg font-rubik font-medium capitalize px-4">
                Special <span className="text-primary-orange">Spinocaforyou,</span> <span className="text-title-black">Hanya Hari Ini!</span>
            </h2>
            <div className="overflow-x-auto -mx-4 px-4">
                <div className="flex gap-6 pb-2">
                    {offers.map((offer) => (
                        <SpecialOfferCard
                            key={offer.id}
                            offer={offer}
                            onAdd={() => onAddOffer(offer.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}