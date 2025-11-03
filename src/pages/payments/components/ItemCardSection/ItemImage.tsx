import { useState } from "react";
import emptyProductImage from '@/../public/images/empty-product.svg';

interface ItemImageProps {
    src: string;
    alt: string;
    className?: string; // Allow custom sizing
}

export function ItemImage({
    src,
    alt,
    className = "w-[93px] h-[139px]"
}: ItemImageProps) {
    const [imageError, setImageError] = useState(false);
    const displayImage = !src || imageError ? emptyProductImage : src;

    return (
        <div className="rounded-2xl overflow-hidden">
            <img
                src={displayImage}
                alt={alt}
                className={`${className} object-cover`}
                onError={() => setImageError(true)}
            />
        </div>
    );
}