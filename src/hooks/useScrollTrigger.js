import { useState, useEffect, useRef } from 'react';

export default function useScrollTrigger(options = {}) {
  const { 
    threshold = 0.1, 
    root = null, 
    rootMargin = '0px', 
    triggerOnce = true 
  } = options;
  
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const currentRef = ref.current;
    
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // If triggerOnce is true, disconnect the observer after it's triggered
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );
    
    observer.observe(currentRef);
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, root, rootMargin, triggerOnce]);
  
  return { ref, isVisible };
}
