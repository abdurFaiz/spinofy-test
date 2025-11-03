import { Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import '@/index.css'
import { useState } from "react";
import emptyProductImage from '@/../public/images/empty-product.svg';

interface ProductCardProps {
    name: string;
    price: number;
    image: string;
    onAddToCart?: () => void;
    onToggleFavorite?: () => void;
    isFavorite?: boolean;
    variant?: "horizontal" | "vertical";
    description?: string;
}

export function ProductCard({
    name,
    price,
    image,
    onAddToCart,
    onToggleFavorite,
    isFavorite = false,
    variant = "vertical",
    description,
}: Readonly<ProductCardProps>) {
    const [imageError, setImageError] = useState(false);
    const displayImage = !image || imageError ? emptyProductImage : image;
    if (variant === "horizontal") {
        return (
            <div className="flex gap-3 p-3 rounded-3xl border border-gray-200/50 bg-white shadow-sm min-w-[400px] overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden ">
                    <img
                        src={displayImage}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                </div>
                <div className="flex flex-col flex-1 gap-5">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium text-black font-rubik capitalize">{name}</h3>
                        {description && (
                            <p className="text-xs text-gray-500 font-rubik leading-relaxed capitalize line-clamp-2">
                                {description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-black">Rp {price.toLocaleString('id-ID')}</span>
                        <button
                            onClick={onAddToCart}
                            className="cursor-pointer p-1 rounded-full bg-primary-orange hover:bg-primary-orange/90 transition-colors"
                        >
                            <Plus className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-2 rounded-[20px] border border-gray-200/30 bg-white shadow-md w-full">
            <div className="relative h-44 rounded-2xl overflow-hidden">
                <img
                    src={displayImage}
                    alt={name}
                    className="w-full h-full object-cover scale-110"
                    onError={() => setImageError(true)}
                />
                <button
                    onClick={onToggleFavorite}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white"
                >
                    <Heart
                        className={cn("w-5 h-5", isFavorite ? "fill-primary text-dark-red" : "text-gray-500")}
                    />
                </button>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-4">
                    <h3 className="text-base font-medium font-rubik text-black capitalize">{name}</h3>
                    <span className="text-base font-medium font-rubik text-black">Rp {price.toLocaleString('id-ID')}</span>
                </div>
                <button
                    onClick={onAddToCart}
                    className="w-full py-2 px-6 rounded-3xl border border-primary-orange bg-white text-primary-orange text-sm font-medium hover:bg-primary-orange/5 transition-colors capitalize"
                >
                    Tambah
                </button>
            </div>
        </div>
    );
}
