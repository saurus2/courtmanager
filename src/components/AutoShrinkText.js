import React, { useRef, useLayoutEffect, useState } from 'react';

const AutoShrinkText = ({ text, isSelected }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(18); // 초기 폰트 크기

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;
    if (!container || !textElement) return;

    let newFontSize = 18;
    textElement.style.fontSize = `${newFontSize}px`;

    while (
      (textElement.scrollWidth > container.clientWidth - 8 || textElement.scrollHeight > container.clientHeight) &&
      newFontSize > 10
    ) {
      newFontSize -= 1;
      textElement.style.fontSize = `${newFontSize}px`;
    }

    setFontSize(newFontSize);
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex items-center justify-center ${isSelected ? 'font-bold border-2 border-white bg-white bg-opacity-20' : ''
        }`}
      style={{
        height: '40px',
        padding: '4px',
        overflow: 'hidden',
        borderRadius: '6px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <span
        ref={textRef}
        style={{
          fontSize: `${fontSize}px`,
          color: 'white',
          whiteSpace: 'nowrap',
          lineHeight: 1.1,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default AutoShrinkText;
