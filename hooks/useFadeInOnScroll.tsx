import { useEffect } from 'react';

const useFadeInOnScroll = () => {
  useEffect(() => {
    const fadeInElements = document.querySelectorAll('.fade-in');
    
    const options = {
      threshold: 0.1, // Start triggering when 10% of the element is in view
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          observer.unobserve(entry.target); // Stop observing after it fades in
        }
      });
    }, options);
    
    fadeInElements.forEach(element => {
      observer.observe(element);
    });

    // Cleanup observer on component unmount
    return () => {
      fadeInElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);
};

export default useFadeInOnScroll;
