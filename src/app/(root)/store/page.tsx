import StoreBanner from "./_components/store-banner";
import { ProductsSection } from "./_components/products-section";
import { AllProductsSection } from "./_components/all-products-section";
import { getCart } from "@/server/cartActions";

export default async function Store() {
  try {
    const cart = await getCart();

    return (
      <>
        <div className="flex min-h-screen flex-col w-full">
          <StoreBanner />
          <ProductsSection cart={cart} />
          <AllProductsSection cart={cart} />
        </div>
      </>
    );
  } catch (error) {
    return (
      <>
        <div className="flex min-h-screen flex-col w-full">
          Some Error Occured
        </div>
      </>
    );
  }
}
