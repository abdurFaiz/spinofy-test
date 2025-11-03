interface ProductInfoProps {
    title: string;
    description: string;
    price: number;
}

export function ProductInfo({ title, description, price }: ProductInfoProps) {
    return (
        <div className="flex flex-col gap-3">
            <div>
                <h1 className="text-2xl font-medium font-rubik text-title capitalize">
                    {title}
                </h1>
                <p className="text-base text-body-grey font-rubik leading-normal">
                    {description}
                </p>
            </div>
            <span className="text-xl font-rubik font-medium text-primary-orange">
                Rp {price.toLocaleString("id-ID")}
            </span>
        </div>
    );
}
