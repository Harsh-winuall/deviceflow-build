"use client";
import React, { useState } from "react";
import { Trash } from "lucide-react"; // Icons for slider and cart
import { StoreDevice } from "@/server/deviceActions";
import { addItemToCart, removeItemFromCart } from "@/server/cartActions";
import { useRouter } from "next/navigation";

import { memo } from "react";
import ProductReviewStars from "@/icons/ProductReviewStars";
import ProductCardCart from "@/icons/ProductCardCart";
import StoreProductIcons from "@/icons/StoreProductIcons";

const StoreDeviceCard = memo(
  ({ product, res }: { product: StoreDevice; res: number }) => {
    const router = useRouter();

    const [quantity, setQuantity] = useState<number>(res);

    const handleAddToCart = async () => {
      await addItemToCart(product?._id!, 1);
      setQuantity(1);
      router.refresh();
    };

    const handleRemoveToCart = async () => {
      await removeItemFromCart(product?._id!);
      setQuantity(0);
      router.refresh();
    };
    return (
      <div className="h-[53vh] w-[17vw]">
        <div
          className="py-14 overflow-x-hidden cursor-pointer px-2 w-full flex justify-center items-center bg-[#F7F7F7] rounded-3xl"
          onClick={() => router.push(`/store/${product._id}`)}
        >
          {product.image ? (
            <img
              src={product?.image?.[0]?.url || "/media/mac.jpeg"}
              alt="product"
              className="w-60 min-w-64 h-36 object-contain"
            />
          ) : (
            <StoreProductIcons.product_card_image className="w-60 h-36" />
          )}
        </div>

        <div className="flex flex-col gap-3 pt-4 px-2">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg whitespace-nowrap font-gilroySemiBold ">
              {product.device_name.length > 16
                ? product.device_name.slice(0, 16) + "..."
                : product.device_name}{" "}
            </h2>
            <h2 className="flex items-center gap-1 justify-center">
              <ProductReviewStars.review_star className="size-4" />
              <div className="flex items-end gap-1">
                <span className="text-sm font-gilroyMedium">4.6</span>
                <span className="text-[#A2A3B1] text-xs font-gilroyMedium">
                  (556)
                </span>
              </div>
            </h2>
          </div>
          <p className="text-[#7F7F7F] text-xs font-gilroyMedium text-pretty  h-[7vh]">
            {product?.description && product.description.length > 140
              ? product.description.slice(0, 137) + "..."
              : product.description ??
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis amet commodi pr onsecte tur adipisicing elit. Debitis amet co"}
          </p>

          <div className="flex items-center justify-between pr-1 ">
            <span className="text-xl flex items-center justify-center font-gilroyBold ">
              ₹{product?.payable}
            </span>
            {quantity >= 1 ? (
              <div className="size-7 hover:bg-[#F7F7F7] justify-center items-center mb-0.5 flex rounded-lg ">
                <Trash
                  className="size-[1.1rem] text-black  cursor-pointer"
                  onClick={() => {
                    handleRemoveToCart();
                  }}
                />
              </div>
            ) : (
              <div className="size-7 hover:bg-[#F7F7F7] justify-center items-center mb-0.5 flex rounded-lg ">
                <ProductCardCart
                  className="size-[1.35rem] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

StoreDeviceCard.displayName = "StoreDeviceCard";

export { StoreDeviceCard };

// export const StoreDeviceCard = ({
//   product,
//   res,
// }: {
//   product: StoreDevice;
//   res: number;
// }) => {
//   const router = useRouter();

//   const [quantity, setQuantity] = useState<number>(res);

//   const handleAddToCart = async () => {
//     await addItemToCart(product?._id!, 1);
//     setQuantity(1);
//     router.refresh();
//   };

//   const handleRemoveToCart = async () => {
//     await removeItemFromCart(product?._id!);
//     setQuantity(0);
//     router.refresh();
//   };

//   return (
//     <>
//       <div>
//         <div
//           className="py-14 cursor-pointer px-2 w-full flex justify-center items-center bg-[#F7F7F7] rounded-3xl"
//           onClick={() => router.push(`/store/${product._id}`)}
//         >
//           {product.image ? (
//             <img
//               src={product?.image[0].url ?? "/media/mac.jpeg"}
//               alt="product"
//               className="w-60 min-w-64 h-36 object-contain"
//             />
//           ) : (
//             <Icons.product_card_image className="w-60 h-36" />
//           )}
//         </div>

//         <div className="flex flex-col gap-3 pt-4 px-2">
//           <div className="flex items-center justify-between w-full">
//             <h2 className="text-lg whitespace-nowrap font-gilroySemiBold ">
//               {product.device_name.length > 16
//                 ? product.device_name.slice(0, 16) + "..."
//                 : product.device_name}{" "}
//             </h2>
//             <h2 className="flex items-center gap-1 justify-center">
//               <ProductReviewStars.review_star className="size-4" />
//               <div className="flex items-end gap-1">
//                 <span className="text-sm font-gilroyMedium">4.6</span>
//                 <span className="text-[#A2A3B1] text-xs font-gilroyMedium">
//                   (556)
//                 </span>
//               </div>
//             </h2>
//           </div>
//           <p className="text-[#7F7F7F] text-xs font-gilroyMedium text-pretty  h-[7vh]">
//             {product?.description && product.description.length > 140
//               ? product.description.slice(0, 137) + "..."
//               : product.description ??
//                 "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis amet commodi pr onsecte tur adipisicing elit. Debitis amet co"}
//           </p>

//           <div className="flex items-center justify-between pr-1 ">
//             <span className="text-xl flex items-center justify-center font-gilroyBold ">
//               ₹{product?.payable}
//             </span>
//             {quantity >= 1 ? (
//               <div className="size-7 hover:bg-[#F7F7F7] justify-center items-center mb-0.5 flex rounded-lg ">
//                 <Trash
//                   className="size-[1.1rem] text-black  cursor-pointer"
//                   onClick={() => {
//                     handleRemoveToCart();
//                   }}
//                 />
//               </div>
//             ) : (
//               <div className="size-7 hover:bg-[#F7F7F7] justify-center items-center mb-0.5 flex rounded-lg ">
//                 <ProductCardCart 
//                   className="size-[1.35rem] cursor-pointer"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleAddToCart();
//                   }}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
