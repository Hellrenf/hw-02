document.addEventListener('DOMContentLoaded', function() {
  // Get all elements needed for the mobile menu
  const burgerMenu = document.querySelector('.burger-menu');
  const closeMenu = document.querySelector('.close-menu');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const body = document.body;
  
  // Function to open menu with improved animation
  function openMenu() {
    // First make the menu visible but fully transparent
    mobileMenu.style.display = 'block';
    
    // Force reflow to ensure the transition works
    void mobileMenu.offsetWidth;
    
    // Then add the open class which triggers the transition
    mobileMenu.classList.add('open');
    body.classList.add('menu-open'); // Use class instead of inline style
    
    // Focus handling for accessibility
    setTimeout(() => {
      closeMenu.focus();
    }, 100);
  }

  // Function to close menu with improved animation
  function closeMenuFunc() {
    // First remove the open class to trigger the closing transition
    mobileMenu.classList.remove('open');
    body.classList.remove('menu-open');
    
    // Wait for the transition to complete before hiding the menu completely
    setTimeout(() => {
      if (!mobileMenu.classList.contains('open')) {
        mobileMenu.style.display = 'none';
      }
    }, 400); // Match this to your CSS transition time
  }

  // Open menu when clicking the burger icon
  burgerMenu.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle burger icon animation
    burgerMenu.classList.add('active');
    openMenu();
  });

  // Close menu when clicking the close button
  closeMenu.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset burger icon
    burgerMenu.classList.remove('active');
    closeMenuFunc();
  });

  // Close menu when clicking navigation links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Add subtle feedback when clicking a link
      this.classList.add('clicked');
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 300);
      
      // If it's an anchor link, handle smooth scrolling
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#') && targetId.length > 1) {
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Close the menu first
          burgerMenu.classList.remove('active');
          closeMenuFunc();
          
          // Wait for menu close animation, then scroll
          setTimeout(() => {
            const headerHeight = document.querySelector('header').offsetHeight + 20;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Scroll smoothly to the target section
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            
            // Update URL without scrolling (modern browsers only)
            if (history.pushState) {
              history.pushState(null, null, targetId);
            } else {
              // Fallback for older browsers
              location.hash = targetId;
            }
        
            mobileNavLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
          }, 400);
        }
      } else {
        // Regular link behavior, close menu
        burgerMenu.classList.remove('active');
        closeMenuFunc();
      }
    });
  });

  // Add smooth scrolling to desktop nav links too
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#') && targetId.length > 1) {
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.querySelector('header').offsetHeight + 20;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          // Scroll smoothly to the target section
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without scrolling
          if (history.pushState) {
            history.pushState(null, null, targetId);
          } else {
            location.hash = targetId;
          }
          
          navLinks.forEach(navLink => navLink.classList.remove('active'));
          this.classList.add('active');
        }
      }
    });
  });

  // Close menu when pressing Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      burgerMenu.classList.remove('active');
      closeMenuFunc();
    }
  });

  // Close menu when resizing window
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
      burgerMenu.classList.remove('active');
      closeMenuFunc();
    }
  });

  // Prevent clicks on the menu from closing it
  mobileMenu.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && e.target !== burgerMenu) {
      burgerMenu.classList.remove('active');
      closeMenuFunc();
    }
  });
  
  // Check if there's a hash in the URL on page load
  if (window.location.hash) {
    // Wait for the page to fully load
    setTimeout(() => {
      const targetId = window.location.hash;
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight + 20;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        // Scroll to the element
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Add active class to the corresponding navigation link
        const activeLink = document.querySelector(`a[href="${targetId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    }, 300); 
  }
});