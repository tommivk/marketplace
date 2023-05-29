import Image from "next/image";

const BASE_URL = process.env.IMGIX_BASE_URL;

const NotFound = () => {
  const loader = ({ src }: { src: string }) => {
    return src;
  };
  return (
    <div className="select-none text-gray-400">
      <Image src={`${BASE_URL}/404.gif`} alt="Not found" fill loader={loader} />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <h1 className="text-[100px] font-semibold leading-none md:text-[350px]">
          404
        </h1>
        <p className="mt-3 text-xl font-semibold">Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;
