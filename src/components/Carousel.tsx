import { AppRouter } from "@/server/root";
import { inferRouterOutputs } from "@trpc/server";
import "swiper/css";
import "swiper/css/navigation";
import ImageCard from "./ImageCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Navigation } from "swiper";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Item = RouterOutput["items"]["getNewest"][number];

const SwiperButton = ({ leftButton }: { leftButton?: boolean }) => {
  return (
    <button
      className={`
                ${leftButton ? "button-prev" : "button-next"}
                ${leftButton ? "left-[-50px]" : "right-[-50px]"}
                disabled:text-zinc-800 disabled:pointer-events-none text-[50px] text-slate-200 z-50 absolute top-[90px] cursor-pointer
              `}
    >
      {leftButton ? "<" : ">"}
    </button>
  );
};

const SwiperButtonLeft = () => {
  return (
    <button className="button-prev disabled:text-zinc-800 disabled:pointer-events-none  text-[50px] w-20 h-20 text-slate-200 z-50 absolute left-[-60px] top-[90px] cursor-pointer">
      {"<"}
    </button>
  );
};

const Carousel = ({ items }: { items?: Item[] }) => {
  return (
    <div className="m-auto w-[220px] sm:w-[420px] md:w-[640px] lg:w-[860px] xl:w-[1080px] relative">
      <Swiper
        className="inherit"
        slidesPerView={5}
        modules={[Virtual, Navigation]}
        virtual
        navigation={{
          nextEl: ".button-next",
          prevEl: ".button-prev",
        }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {items?.map(
          ({ id, title, description, price, image: { imageURL } }, index) => (
            <SwiperSlide key={id} virtualIndex={index}>
              <ImageCard
                link={`/items/${id}`}
                imageURL={imageURL}
                title={title}
                content={description}
                price={price}
              />
            </SwiperSlide>
          )
        )}
      </Swiper>
      <SwiperButton leftButton />
      <SwiperButton />
    </div>
  );
};

export default Carousel;
