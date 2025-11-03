interface ProductContainerProps {
    children: React.ReactNode;
    id?: string
}

export const ProductContainer = ({ children, id }: ProductContainerProps) => {
    return (
        <section id={id} className="px-4 flex flex-col gap-6">
            {children}
        </section>
    )
}