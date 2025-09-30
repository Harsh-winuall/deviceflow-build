"use client";

import { StoreDevice } from "@/server/deviceActions";
import { Cart, DeviceWithQty } from "@/server/cartActions";
import { StoreDeviceCard } from "./store-device-card";
import { useMemo } from "react";
import StoreProductIcons from "@/icons/StoreProductIcons";

export const ProductSlider = ({
  data,
  cart,
}: {
  data: StoreDevice[];
  cart: Cart;
}) => {
  // const router = useRouter();

  // const [cart, setCart] = useState<Cart>();

  // useEffect(() => {
  //   const fetch = async () => {
  //     const res = await getCart();
  //     setCart(res);
  //   };
  //   fetch();
  // }, []);

  const slideLeft = () => {
    const slider = document.getElementById("slider");
    slider!.scrollLeft -= 300;
  };

  const slideRight = () => {
    const slider = document.getElementById("slider");
    slider!.scrollLeft += 300;
  };

  const itemQuantities = useMemo(() => {
    const quantities: Record<string, number> = {};
    if (cart?.items?.length > 0) {
      cart.items.forEach((item: DeviceWithQty) => {
        quantities[item?._id!] = item.quantity || 0;
      });
    }
    return quantities;
  }, [cart.items]);

  // const findItemQuantityById = (itemId: string) => {
  //   if (cart?.items?.length > 0) {
  //     //@ts-ignore
  //     return cart.items.reduce((acc: number, item: DeviceWithQty) => {
  //       return item._id === itemId ? acc + (item.quantity || 0) : acc;
  //     }, 0);
  //   }
  //   return 0; // Return 0 if there are no items in the cart
  // };

  return (
    <div className="w-full flex justify-center items-center my-8 flex-col">
      {/* Slider */}
      <div className="relative group w-full">
        {/* Left Arrow */}
        <button
          className="absolute top-[30%] -left-7  z-10"
          onClick={slideLeft}
        >
          <StoreProductIcons.product_card_left_arrow />
        </button>

        {/* Product Cards Container */}
        <div
          id="slider"
          className="flex gap-6 overflow-x-scroll hide-scrollbar scrollbar-hide scroll-smooth w-[1063px]"
        >
          {/* 
          
          data.length < 0
            ? [1, 2, 3, 4, 4].map((prod) => (
                <div
                  key={prod}
                  className="relative bg-white w-[350px] h-[400px]"
                >
                  <div className="w-60 h-40 animate-pulse bg-muted rounded-3xl py-20 px-5"></div>
                  <div className="animate-pulse bg-muted w-32 h-10"></div>
                  <div className="animate-pulse bg-muted w-56 h-20"></div>
                </div>
              ))
            : 
            
          */}
          {data.map((product) => (
            <StoreDeviceCard
              key={product._id}
              product={product}
              res={itemQuantities[product?._id ?? ""]}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute top-[30%] -right-7  z-10"
          onClick={slideRight}
        >
          <StoreProductIcons.product_card_right_arrow />
        </button>
      </div>
    </div>
  );
};
