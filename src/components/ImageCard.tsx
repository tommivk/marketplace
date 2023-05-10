import Link from "next/link";
import Image from "next/image";

type Props = {
  link: string;
  imageURL: string;
  price?: number;
  content: string;
  title: string;
};

const ImageCard = ({ link, imageURL, price, title, content }: Props) => {
  return (
    <Link href={link}>
      <div className="bg-zinc-900 rounded-md w-[200px] m-2 relative hover:-translate-y-1 duration-100">
        {price && (
          <p className="absolute font-bold text-right bg-zinc-800 px-1 text-sm rounded-md mt-1 ml-1 right-0 z-10">
            {price}€
          </p>
        )}

        <div className="h-40 relative">
          <Image
            className="rounded-ss-md rounded-se-md object-cover"
            alt={title}
            src={`${imageURL}?w=340`}
            priority={true}
            fill
          />
        </div>

        <div className="h-28 py-2 px-4 ">
          <h2 className="text-left font-medium text-base text-slate-200 mb-1">
            {title}
          </h2>
          <p className="text-sm text-slate-200 break-words line-clamp-2">
            {content}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ImageCard;
