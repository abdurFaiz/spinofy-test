interface CardImageProps {
    src: string;
    alt: string;
}

export function CardImage({ src, alt }: CardImageProps) {
    return (
        <div className="rounded-2xl overflow-hidden flex-shrink-0">
            <img
                src={src}
                alt={alt}
                className="w-[121px] h-[140px] object-cover"
            />
        </div>
    );
}