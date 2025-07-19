import { useState, useEffect } from 'react';

export default function useAnimatedCounter(targetValue, duration = 2000, delay = 0) {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating) return;
    
    let startTime;
    let animationFrame;
    
    const startValue = 0;
    const difference = targetValue - startValue;
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic bezier easing function for more professional animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      // Calculate current value based on easing
      const currentValue = Math.floor(startValue + difference * easeOutCubic);
      
      setCount(currentValue);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(targetValue); // Ensure we end at exactly the target value
      }
    };
    
    const delayTimeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(step);
    }, delay);
    
    return () => {
      clearTimeout(delayTimeout);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration, delay, isAnimating]);

  const startAnimation = () => setIsAnimating(true);
  
  return { count, startAnimation };
}
