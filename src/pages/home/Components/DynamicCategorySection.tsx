import { ProductCard } from "@/components/ProductItem";
import { Separator } from "@/components/Separator";
import { SubHeader } from "@/components/SubHeader";
import { ProductContainer } from "./product/ProductContainer";
import { ProductList } from "./product/ProductList";
import EmptyProductSection from "./EmptyProductSection";
import type { HomeProduct } from "@/services/outlet/outletProductService";
import type { Category } from "@/types/Product";

interface DynamicCategorySectionProps {
    category: Category;
    products: HomeProduct[];
    onProductClick: (productId: string) => void;
}

export function DynamicCategorySection({
    category,
    products,
    onProductClick
}: DynamicCategorySectionProps) {
    // Create section ID for scroll navigation
    const sectionId = category.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    return (
        <>
            <ProductContainer id={sectionId}>
                <SubHeader
                    title={category.name}
                    totalItems={products.length}
                />
                <ProductList>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <ProductCard
                                key={product.id || index}
                                name={product.name}
                                price={product.price}
                                image={product.image}
                                onAddToCart={() => onProductClick(product.id)}
                            />
                        ))
                    ) : (
                        <EmptyProductSection
                            title={category.name}
                            type="category"
                        />
                    )}
                </ProductList>
            </ProductContainer>
            <Separator />
        </>
    );
}