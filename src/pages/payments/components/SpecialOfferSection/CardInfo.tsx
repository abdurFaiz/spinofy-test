interface CardInfoProps {
    name: string;
    description: string;
}

export function CardInfo({ name, description }: CardInfoProps) {
    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-sm font-rubik font-medium capitalize">{name}</h3>
            <p className="text-xs font-rubik text-body capitalize leading-[150%]">
                {description}
            </p>
        </div>
    );
}