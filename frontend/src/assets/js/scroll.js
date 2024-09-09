document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav');
    
    function updateBackgroundOpacity() {
      const scrollPosition = window.scrollY;
      const maxScroll = 200;
      
      const opacity = Math.min(scrollPosition / maxScroll, 0.8);
      
      nav.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
    }
    
    window.addEventListener('scroll', updateBackgroundOpacity);
    updateBackgroundOpacity();
  });