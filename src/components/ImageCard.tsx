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
      <div className="relative m-2 w-[200px] rounded-md bg-zinc-900 duration-100 hover:-translate-y-1">
        {price && (
          <p className="absolute right-0 z-10 m-1 rounded-md bg-zinc-800 px-1 text-right text-sm font-bold">
            {price}€
          </p>
        )}

        <div className="relative h-40">
          <Image
            className="rounded-se-md rounded-ss-md object-cover"
            alt={title}
            src={`${imageURL}?w=340`}
            priority={true}
            fill
          />
        </div>

        <div className="h-28 px-4 py-2">
          <h2 className="mb-1 line-clamp-1 text-left text-base font-medium text-slate-200">
            {title}
          </h2>
          <p className="line-clamp-2 break-words text-sm text-slate-200">
            {content}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ImageCard;
