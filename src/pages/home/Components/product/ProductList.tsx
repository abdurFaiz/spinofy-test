interface ProductListProps {
    children: React.ReactNode;
}
export const ProductList = ({ children }: ProductListProps) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {children}
        </div>
    )
}