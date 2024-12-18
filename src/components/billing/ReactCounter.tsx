"use client";

import React, { useState, useEffect } from 'react';

const CountUp = ({ value } : {value : any}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const targetValue = Math.max(0, Number(value) || 0);
    if (targetValue === 0) {
      setCount(0);
      return;
    }

    const duration = 1500; 
    const stepTime = 50; 
    const steps = duration / stepTime;
    const increment = Math.ceil(targetValue / steps);

    const counter = setInterval(() => {
      setCount(prevCount => {
        const nextCount = prevCount + increment;
        
        if (nextCount >= targetValue) {
          clearInterval(counter);
          return targetValue;
        }
        
        return nextCount;
      });
    }, stepTime);

    return () => clearInterval(counter);
  }, [value]);

  const formattedCount = count.toLocaleString();

  return (
    <div>
      {formattedCount}
    </div>
  );
};

export default CountUp;
