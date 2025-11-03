import { ProductCard } from "@/components/ProductItem";
import { BottomNav } from "@/components/MenuBar";
import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import { SubHeader } from "@/components/SubHeader";
import MenuSection from "./Components/MenuSection";
import { RecommendationProductContainer } from "./Components/RecomendationProductContainer";
import { UserPointsCard } from "./Components/headerprofileuser/UserPointsCard";
import Slideshow from "./Components/HeroCarousel";
import { CartSummaryBar } from "@/components/CartSummaryBar";
import { CartBottomSheet } from "@/components/CartBottomSheet";
import { useHomePage } from "@/hooks/Home/useHomePage";
import { useOutletNavigation } from "@/hooks/useOutletNavigation";
import { DynamicCategorySection } from "./Components/DynamicCategorySection";
import EmptyProductSection from "./Components/EmptyProductSection";
import { HomeLoadingSkeleton } from "./Components/HomeLoadingSkeleton";

export default function Index() {
  const { navigateToCheckout, navigateToRewardPoin } = useOutletNavigation();
  const {
    userData,
    products,
    categories,
    isCartBottomSheetOpen,
    isLoading,
    error,
    totalItems,
    totalPrice,
    isCartVisible,
    handleCartClick,
    handleCloseCartBottomSheet,
    handleProductClick,
  } = useHomePage();

  if (isLoading) {
    return (
      <ScreenWrapper>
        <HomeLoadingSkeleton />
        <BottomNav />
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Slideshow />

      <UserPointsCard
        name={userData?.name || "User"}
        vouchers={userData?.vouchers || 0}
        points={userData?.points || 0}
        onClickRedeem={navigateToRewardPoin}
      />
      <div className="flex flex-col gap-10 mt-9">
        <div className="px-4 flex flex-col gap-4 ">
          <SubHeader title="Recommended for You" link="Lihat Semua" />
          <RecommendationProductContainer>
            {products.recommendations.length > 0 ? (
              products.recommendations.map((product, index) => (
                <ProductCard
                  key={product.id || index}
                  variant="horizontal"
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  description={product.description}
                  onAddToCart={() =>
                    handleProductClick(product.id)
                  }
                />
              ))
            ) : (
              <EmptyProductSection
                title="Recommendations"
                type="recommendations"
                message="Try selecting a different outlet to see recommended products"
              />
            )}
          </RecommendationProductContainer>
        </div>
        <div className="flex flex-col gap-10 mb-44">
          <MenuSection />
          {/* Dynamic Category Sections */}
          {categories && categories.length > 0 ? (
            [...categories]
              .sort((a, b) => a.position - b.position)
              .map((category) => {
                // Use the same key format as DynamicProductOrganizer
                const categoryKey = category.name
                  .toLowerCase()
                  .replaceAll(/\s+/g, '')
                  .replaceAll(/[^a-z0-9]/g, '');

                const categoryProducts = products[categoryKey] || [];

                return (
                  <DynamicCategorySection
                    key={category.id}
                    category={category}
                    products={categoryProducts}
                    onProductClick={handleProductClick}
                  />
                );
              })
          ) : (
            <EmptyProductSection
              title="Categories"
              type="general"
              message="No categories available"
            />
          )}
        </div>
      </div>
      <CartSummaryBar
        itemCount={totalItems}
        total={`Rp ${totalPrice.toLocaleString("id-ID")}`}
        onCheckout={navigateToCheckout}
        onCartClick={handleCartClick}
        isVisible={isCartVisible}
      />

      <CartBottomSheet
        isOpen={isCartBottomSheetOpen}
        onClose={handleCloseCartBottomSheet}
      />

      <BottomNav />
    </ScreenWrapper>
  );
}