import { getCart } from "@/server/cartActions";
import CartMain from "./_components/cart-main";

export default async function Cart() {
  const cart = await getCart();

  return <CartMain cart={cart} />;
}
