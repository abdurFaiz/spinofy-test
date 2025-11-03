import type { SpecialOffer } from "@/types/SpecialOffer";
import { Card } from "./WrapperCard";
import { AddButton } from "./AddButton";
import { CardImage } from "./CardImage";
import { CardInfo } from "./CardInfo";
import { CardPrice } from "./CardPrice";

interface SpecialOfferCardProps {
    offer: SpecialOffer;
    onAdd: () => void;
}

export function SpecialOfferCard({ offer, onAdd }: SpecialOfferCardProps) {
    return (
        <Card className="flex-shrink-0 w-[342px] flex gap-3">
            <CardImage src={offer.image} alt={offer.name} />

            <div className="flex flex-col gap-5 flex-1">
                <CardInfo name={offer.name} description={offer.description} />

                <div className="flex justify-between items-center mt-auto">
                    <CardPrice price={offer.price} />
                    <AddButton onClick={onAdd} aria-label={`Add ${offer.name} to cart`} />
                </div>
            </div>
        </Card>
    );
}