import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Navigation } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

const SwiperButton = ({
  leftButton,
  id,
}: {
  leftButton?: boolean;
  id: number;
}) => {
  return (
    <button
      className={`
                ${leftButton ? `button-prev-${id}` : `button-next-${id}`}
                ${leftButton ? "left-[-50px]" : "right-[-50px]"}
                absolute top-[90px] cursor-pointer
                text-[50px] text-slate-200 disabled:pointer-events-none disabled:text-zinc-800
              `}
    >
      {leftButton ? "<" : ">"}
    </button>
  );
};

const Carousel = ({ slides, id }: { slides?: JSX.Element[]; id: number }) => {
  return (
    <div className="relative m-auto select-none">
      <Swiper
        className="inherit"
        slidesPerView={5}
        modules={[Virtual, Navigation]}
        virtual
        navigation={{
          nextEl: `.button-next-${id}`,
          prevEl: `.button-prev-${id}`,
        }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {slides?.map((element, index) => (
          <SwiperSlide key={index} virtualIndex={index}>
            {element}
          </SwiperSlide>
        ))}
      </Swiper>
      <SwiperButton id={id} leftButton />
      <SwiperButton id={id} />
    </div>
  );
};

export default Carousel;
