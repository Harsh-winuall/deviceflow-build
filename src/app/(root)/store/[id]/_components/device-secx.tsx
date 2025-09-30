import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { StoreDevice } from "@/server/deviceActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RatingStarComp } from "./rating-stars";
import {
  addItemToCart,
  Cart,
  DeviceWithQty,
  updateCartItemQuantity,
} from "@/server/cartActions";
import { Minus, MoveLeft, Plus } from "lucide-react";
import { BackBtn } from "../../cart/checkout/_components/back-btn";
import { useAlert } from "@/hooks/useAlert";
import LeftArrowIcon from "@/icons/LeftArrowIcon";
import RightArrowIcon from "@/icons/RightArrowIcon";
import StoreProductIcons from "@/icons/StoreProductIcons";

export const DeviceSecx = ({
  data,
  cart,
}: {
  data: StoreDevice;
  cart: Cart;
}) => {
  const router = useRouter();
  const { showAlert } = useAlert();

  // const findItemById = (itemId: string) => {
  //   if (cart?.items?.length > 0) {
  //     return cart?.items?.filter((item: StoreDevice) => item._id === itemId)
  //       ? cart?.items?.filter((item: StoreDevice) => item._id === itemId).length
  //       : 0;
  //   }
  // };
  const findItemQuantityById = (itemId: string) => {
    if (cart?.items?.length > 0) {
      //@ts-ignore
      return cart.items.reduce((acc: number, item: DeviceWithQty) => {
        return item._id === itemId ? acc + (item.quantity || 0) : acc;
      }, 0);
    }
    return 0; // Return 0 if there are no items in the cart
  };

  const [quantity, setQuantity] = useState<number>(
    // @ts-ignore
    findItemQuantityById(data?._id ?? "")
  );

  // const findItemById = (itemId: string) => {
  //   return cart.items.find((item: StoreDevice) => item._id === itemId);
  // };

  const handleAddToCart = async () => {
    await addItemToCart(data?._id!, 1);
    setQuantity(1);
    router.refresh();
  };

  const handleIncrease = async (device: StoreDevice) => {
    const availableQty = data?.qty ? data.qty : 0; // Get available quantity from API
    const newQuantity = quantity + 1; // Calculate new quantity

    // Check if the new quantity exceeds available quantity
    if (newQuantity > availableQty) {
      // Optionally, you can show a message to the user
      showAlert({
        isFailure: true,
        title: "Failed to add to cart",
        description: "Cannot increase quantity beyond available stock.",
        key: "stock-error",
      });
      return; // Stop execution if the new quantity exceeds available quantity
    }

    setQuantity(newQuantity); // Update local quantity
    await updateCartItemQuantity(device?._id ?? "", newQuantity); // Call API to update quantity
    router.refresh(); // Refresh the router
  };

  const handleDecrease = async (device: StoreDevice) => {
    const newQuantity: number = quantity > 1 ? quantity - 1 : 0;
    setQuantity(newQuantity); // Update local quantity first
    await updateCartItemQuantity(device?._id ?? "", newQuantity); // Call API to update quantity
    router.refresh();
  };
  const icons = [
    {
      key: "screen",
      icon: <StoreProductIcons.screen_size />,
    },
    {
      key: "processor",
      icon: <StoreProductIcons.processor />,
    },
    {
      key: "generation",
      icon: <StoreProductIcons.processor_generation />,
    },
    {
      key: "ram",
      icon: <StoreProductIcons.camera_main />,
    },
    {
      key: "touch",
      icon: <StoreProductIcons.camera_front />,
    },
    {
      key: "storage",
      icon: <StoreProductIcons.battery_capacity />,
    },
  ];

  const config = [
    {
      key: "Screen size",
      value: `6.7"`,
    },
    {
      key: "Processor ",
      value: "Apple A16",
    },
    {
      key: "Generation",
      value: "6",
    },
    {
      key: "Ram",
      value: "12GB",
    },
    {
      key: "Touch (if any)",
      value: "No",
    },
    {
      key: "Storage",
      value: "512",
    },
  ];


  const deviceConfig =
    data?.config && data?.config?.length === 6 ? data?.config : config;

  // const modifiedConfig = []
  const modifiedConfig = deviceConfig.map((item) => {
    // Find a matching icon based on the key
    const matchingIcon = icons.find((icon) =>
      item.key.toLowerCase().includes(icon.key.toLowerCase())
    );

    // Return the object with icon, key, and value
    return {
      icon: matchingIcon ? matchingIcon.icon : <StoreProductIcons.screen_size />,
      key: item.key,
      value: item.value,
    };
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const deviceImages =
    data?.image && data?.image.length === 4
      ? data?.image
      : [
          { url: "/media/store-item/dell1.png" },
          { url: "/media/store-item/dell2.png" },
          { url: "/media/store-item/dell3.png" },
          { url: "/media/store-item/dell4.png" },
        ];

  const handlePrev = () => {
    setCurrentIdx((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : deviceImages!.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIdx((prevIndex) =>
      prevIndex < deviceImages!.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <section className="flex flex-col px-8 mt-1 gap-y-6 text-[#17183B]">
      {/* {JSON.stringify(data)} */}
      <div className="flex flex-col md:flex-row justify-between w-[99%]">
        <div className="w-[48%] flex flex-col">
          <div className="flex gap-x-4 pb-5 text-base 2xl:text-lg">
            <BackBtn>
              <MoveLeft className="size-5 cursor-pointer" />
            </BackBtn>
            {/* <span className="text-[#A2A3B1] cursor-pointer font-gilroyMedium">
              Windows
            </span>
            <span className="font-gilroySemiBold">/</span>
            <span className="font-gilroyMedium">{data?.device_name ?? ""}</span> */}
          </div>

          <div className="flex gap-0.5 items-end">
            <span className="font-gilroyBold text-xl 2xl:text-2xl">
              {String(currentIdx + 1).padStart(2, "0")}
            </span>
            <div className="flex gap-1 text-[#A2A3B1] text-base 2xl:text-lg font-gilroySemiBold">
              <span>/</span>
              <span>{String(deviceImages?.length).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="flex justify-center items-center py-4">
            <img
              className="object-contain select-none flex-shrink-0 w-[404px] h-[278px]"
              src={deviceImages?.[currentIdx]?.url ?? ""}
              alt={data?.device_name ?? "device"}
            />
          </div>

          <div className="flex pl-2 gap-x-10 py-3 items-center">
            <LeftArrowIcon onClick={handlePrev} className="cursor-pointer" />
            <RightArrowIcon
              onClick={handleNext}
              className="cursor-pointer"
            />
          </div>

          <div className="flex justify-between pl-4 pr-3 gap-x-4 pt-2 pb-5 items-center">
            {deviceImages.map(({ url: src }, i) => (
              <div
                key={src}
                className={cn(
                  "md:size-16 lg:size-[4.5rem]  flex justify-center items-center  xl:size-20 xl:w-[6rem] rounded ring-2 ",
                  currentIdx === i ? "ring-black" : "ring-[#D1D1D8]"
                )}
                onClick={() => setCurrentIdx(i)}
              >
                <img
                  src={src ?? ""}
                  alt={data?.device_name ?? `device-${i + 1}`}
                  className="w-[80px] select-none h-[54px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="w-[48%] flex flex-col">
          <h2 className="pt-3.5 2xl:pt-1.5 pb-1  font-gilroySemiBold text-[1.3rem] 2xl:text-[2.8rem]">
            {data?.device_name ?? ""}
          </h2>

          <div className="flex items-center py-1 justify-between ">
            <div className="font-gilroyBold text-2xl 2xl:text-4xl flex items-baseline gap-x-1.5">
              {`₹${data?.payable ?? ""}`}{" "}
              <span className="text-base font-gilroyMedium 2xl:text-lg line-through">{`₹${data.purchase_value}`}</span>
              {/* <span className="py-0.5 mx-1 -mt-2 px-2 text-xs font-gilroyMedium bg-green-100 text-green-600 rounded-full">
                50% off
              </span> */}
              <span>
                {data?.qty ? (
                  <div className="py-0.5 mx-1 -mt-2 px-2 text-xs font-gilroyMedium bg-green-100 text-green-600 rounded-full">{`In stock - ${data?.qty}`}</div>
                ) : (
                  <div className="py-0.5 mx-1 -mt-2 px-2 text-xs font-gilroyMedium bg-red-100 text-red-600 rounded-full">
                    Out of stock
                  </div>
                )}
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="-mt-0.5">
                <RatingStarComp
                  rating={data?.overallRating ?? ""}
                  className="size-4"
                />
              </div>
              <div className="font-gilroyMedium ">
                {data?.overallRating ? data?.overallRating : "0.0"} / 5.0{" "}
                <span className="text-[#A2A3B1]">
                  ({data?.overallReviews ?? ""})
                </span>
              </div>
            </div>
          </div>

          {/* <div className="flex gap-x-3 pb-2 pt-4">
            <div className="font-gilroyMedium">Select color:</div>
            <div className="flex items-center gap-x-1.5">
              {["#000000"].map((v) => (
                <div
                  key={v}
                  style={{ backgroundColor: v }}
                  className={cn(
                    "size-4 rounded-full ring ring-[#17183B]",
                    v === "#000000" ? "ring-opacity-15" : "ring-opacity-0"
                  )}
                />
              ))}
            </div>
          </div> */}

          <div className="flex gap-x-3 py-2 items-center">
            {data?.storage?.map((v) => (
              <div
                key={v}
                className={cn(
                  "rounded font-gilroySemiBold text-sm 2xl:text-lg w-28 h-12 flex justify-center items-center border",
                  " border-black text-black"
                )}
              >
                {v}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 grid-rows-2 w-full gap-4 py-3">
            {modifiedConfig.map((v) => (
              <div
                key={v.key}
                className="w-full h-[4.5rem] 2xl:w-48 2xl:h-20 bg-[#F4F4F4] rounded flex-1 flex justify-center items-center"
              >
                <div className="flex justify-center gap-x-1 items-center w-full">
                  <div className="w-[25%] flex items-center justify-center">
                    {v.icon}
                  </div>
                  <div className="flex w-[55%] flex-col text-sm 2xl:text-base">
                    <span className="text-[#A7A7A7]">{v.key}</span>
                    <span className="text-[#4E4E4E] font-gilroySemiBold">
                      {v.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex py-2 justify-between items-center font-gilroySemiBold">
            {quantity > 0 ? (
              <div className="flex justify-between items-center rounded-[4px] border border-black px-8 h-12 gap-10 w-[48%]">
                <Minus
                  className="size-5 text-black cursor-pointer"
                  onClick={() => {
                    handleDecrease(data);
                  }}
                />

                <div className="text-xl select-none text-black font-gilroySemiBold text-center focus:outline-none">
                  {quantity}
                </div>

                <Plus
                  className="cursor-pointer size-5 text-black"
                  onClick={() => {
                    handleIncrease(data);
                  }}
                />
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-[48%]  h-12 rounded-sm flex justify-center items-center  hover:bg-black hover:text-white text-black bg-white ring-1 ring-black"
              >
                Add to Cart
              </button>
            )}

            <button
              onClick={() => {
                if (quantity > 0) {
                  router.push("/store/cart/checkout");
                } else {
                  addItemToCart(data?._id ?? "", 1);
                  router.push("/store/cart/checkout");
                }
              }}
              className="w-[48%] h-12 bg-black text-white hover:text-black ring-1 ring-black hover:bg-white  hover:ring-black rounded-sm flex justify-center items-center"
            >
              BUY NOW
            </button>
          </div>

          <div className="flex py-2 gap-1 items-center">
            <div>
              <StoreProductIcons.share_telegram />
            </div>
            <div className="font-gilroySemiBold text-base 2xl:text-lg py-1">
              Recommend to employee
            </div>
          </div>

          <div className="font-gilroyMedium text-sm justify-start gap-x-5 w-full flex items-center">
            <span>Free 3-5 day shipping</span> <span>•</span>{" "}
            <span>All Product Warranty</span> <span>•</span>{" "}
            <span>Best after sale service</span>
          </div>
        </div>
      </div>
    </section>
  );
};
