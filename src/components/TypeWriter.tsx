import React, { useRef } from "react";
import { useState, useCallback, useEffect } from "react";

type Props = {
  words: string[];
  className?: string;
};

const TypeWriter = ({ words }: Props) => {
  const [index, setIndex] = useState(0);

  const animationRef = useRef<number>();
  const previousSecondRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const handleUpdate = useCallback(
    (time: number) => {
      const second = Math.floor(time / 1000);

      if (!startTimeRef.current) {
        startTimeRef.current = second + 1;
      }

      if (
        previousSecondRef.current !== second &&
        second >= 5 &&
        (second - startTimeRef.current) % 5 === 0
      ) {
        if (index + 1 < words.length) {
          setIndex(index + 1);
        } else {
          setIndex(0);
        }
      }

      previousSecondRef.current = second;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      const animation = requestAnimationFrame(handleUpdate);
      animationRef.current = animation;
    },
    [index, words]
  );

  useEffect(() => {
    const animation = requestAnimationFrame(handleUpdate);
    animationRef.current = animation;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
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

export default React.memo(TypeWriter);
