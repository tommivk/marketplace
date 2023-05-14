import Image from "next/image";

const BASE_URL = process.env.IMGIX_BASE_URL;

const NotFound = () => {
  const loader = ({ src }: { src: string }) => {
    return src;
  };
  return (
    <div className="text-gray-400 select-none">
      <Image src={`${BASE_URL}/404.gif`} alt="Not found" fill loader={loader} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <h1 className="text-[100px] md:text-[350px] font-semibold leading-none">
          404
        </h1>
        <p className="text-xl font-semibold mt-3">Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;
