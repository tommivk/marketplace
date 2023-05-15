import { useState, useCallback, useEffect } from "react";

type Props = {
  words: string[];
  className?: string;
};

const TypeWriter = ({ words }: Props) => {
  const [index, setIndex] = useState(0);

  const handleUpdate = useCallback(() => {
    if (index + 1 < words.length) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }, [words, index]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleUpdate();
    }, 5000);
    return () => clearInterval(interval);
  }, [handleUpdate]);

  return (
    <h1
      key={index}
      className={`animate-typewriter w-0 text-transparent max-w-fit text-4xl text-center font-extrabold m-auto sm:ml-0
                  bg-clip-text bg-gradient-to-r from-fuchsia-700 to-blue-400
                `}
    >
      {words[index]}
    </h1>
  );
};

export default TypeWriter;
