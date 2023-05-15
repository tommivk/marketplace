import { useState, useCallback, useEffect } from "react";

type Props = {
  words: string[];
  className?: string;
};

const TypeWriter = ({ words, className }: Props) => {
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
      className={`animate-typewriter w-0 text-transparent max-w-fit bg-clip-text ${className}`}
    >
      {words[index]}
    </h1>
  );
};

export default TypeWriter;
