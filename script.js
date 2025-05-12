document.addEventListener('DOMContentLoaded', function() {
  // Initialize Accordion Functionality
  initAccordion();

  // Initialize Swiper Slider
  initSwiper();

  // Initialize Sticky Header
  initStickyHeader();
  
  // Initialize Modal
  initModal();
  
  // Initialize Contact Form Validation
  initContactForm();
  
  // Initialize Modal Form Validation
  initModalForm();
  
  // Initialize Truncated Text Toggle
  initTruncatedText();

  initSmoothScrollToTop();
});

function initAccordion() {
  const accordionContainer = document.querySelector('.accordion-container');
  if (!accordionContainer) return;
  
  const accordionButtons = document.querySelectorAll('.accordion-button');
  
  // Add expand/collapse all controls
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'accordion-controls';
  controlsDiv.innerHTML = `
    <button class="accordion-control-btn expand-all-btn">Розгорнути все</button>
    <button class="accordion-control-btn collapse-all-btn">Згорнути все</button>
  `;
  accordionContainer.insertBefore(controlsDiv, accordionContainer.firstChild);
  
  // Set up expand/collapse all functionality
  const expandAllBtn = document.querySelector('.expand-all-btn');
  const collapseAllBtn = document.querySelector('.collapse-all-btn');
  
  expandAllBtn.addEventListener('click', function() {
    accordionButtons.forEach(button => {
      if (!button.classList.contains('active')) {
        openAccordion(button);
      }
    });
  });
  
  collapseAllBtn.addEventListener('click', function() {
    accordionButtons.forEach(button => {
      if (button.classList.contains('active')) {
        closeAccordion(button);
      }
    });
  });
  
  // Initialize accordions with proper ARIA attributes
  accordionButtons.forEach(button => {
    const content = button.nextElementSibling;
    const id = 'accordion-content-' + Math.random().toString(36).substr(2, 9);
    
    content.id = id;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', id);
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    
    // Add click event
    button.addEventListener('click', function() {
      toggleAccordion(this);
    });
    
    // Add keyboard support
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion(this);
      }
    });
  });
}

function toggleAccordion(button) {
  const isExpanded = button.classList.contains('active');
  const content = button.nextElementSibling;
  
  if (isExpanded) {
    closeAccordion(button);
  } else {
    openAccordion(button);
  }
}

function openAccordion(button) {
  const content = button.nextElementSibling;
  
  button.classList.add('active');
  button.setAttribute('aria-expanded', 'true');
  
  // Set initial height for smoother animation
  content.style.display = 'block';
  const height = content.scrollHeight;
  content.style.maxHeight = '0';
  
  // Force reflow
  void content.offsetWidth;
  
  // Animate opening
  content.style.maxHeight = height + 'px';
  
  // Ensure content is fully visible after animation
  content.addEventListener('transitionend', function setFinalHeight() {
    if (button.classList.contains('active')) {
      content.style.maxHeight = 'none'; // Allow content to expand if more content is added dynamically
    }
    content.removeEventListener('transitionend', setFinalHeight);
  });
}

function closeAccordion(button) {
  const content = button.nextElementSibling;
  
  button.classList.remove('active');
  button.setAttribute('aria-expanded', 'false');
  
  // Get the current height before closing
  const height = content.scrollHeight;
  content.style.maxHeight = height + 'px';
  
  // Force reflow
  void content.offsetWidth;
  
  // Animate closing
  content.style.maxHeight = '0';
}

function initSwiper() {
  const swiperContainer = document.querySelector('.swiper');
  if (!swiperContainer) return;
  
  new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    grabCursor: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 640px
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      // when window width is >= 1024px
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  });
}

function initStickyHeader() {
  const header = document.querySelector('header');
  const body = document.body;
  if (!header) return;
  
  function throttle(callback, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = new Date().getTime();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback(...args);
      }
    };
  }
  
  function handleScroll() {
    if (window.scrollY > 50) { 
      header.classList.add('scrolled');
      body.classList.add('scrolled-body');
    } else {
      header.classList.remove('scrolled');
      body.classList.remove('scrolled-body');
    }
    
    highlightCurrentSection();
  }
  
  window.addEventListener('scroll', throttle(handleScroll, 10));
  
  handleScroll();
  
  window.addEventListener('resize', throttle(handleScroll, 100));
}

function highlightCurrentSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  if (!sections.length || !navLinks.length) return;
  
  const scrollPosition = window.scrollY + 100; 
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150; 
    const sectionHeight = section.offsetHeight;
    const sectionId = '#' + section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = sectionId;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentSection) {
      link.classList.add('active');
    }
  });
}

function initModal() {
  const modal = document.getElementById('modalWindow');
  const openModalBtn = document.getElementById('openModalBtn');
  const openModalBtnMobile = document.getElementById('openModalBtnMobile');
  const closeModalBtn = document.querySelector('.close-modal');
  
  if (!modal || !closeModalBtn) return;
  
  // Open modal function
  function openModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      modal.querySelector('.modal-content').style.opacity = '1';
      modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
  }
  
  // Close modal function
  function closeModal() {
    modal.querySelector('.modal-content').style.opacity = '0';
    modal.querySelector('.modal-content').style.transform = 'translateY(-50px)';
    setTimeout(() => {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }, 300);
  }
  
  // Event listeners
  if (openModalBtn) {
    openModalBtn.addEventListener('click', openModal);
  }
  
  if (openModalBtnMobile) {
    openModalBtnMobile.addEventListener('click', openModal);
  }
  
  closeModalBtn.addEventListener('click', closeModal);
  
  // Close when clicking outside modal content
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });
  
  // Close modal when property buttons are clicked
  const propertyButtons = document.querySelectorAll('.property-btn');
  propertyButtons.forEach(button => {
    button.addEventListener('click', openModal);
  });
}

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset previous errors
    const errorElements = contactForm.querySelectorAll('.input-error');
    errorElements.forEach(el => el.classList.remove('input-error'));
    
    // Check for empty fields
    let hasEmptyFields = false;
    const formData = {};
    
    const requiredFields = contactForm.querySelectorAll('input, select, textarea');
    requiredFields.forEach(field => {
      if (field.type === 'checkbox') {
        formData[field.name] = field.checked;
        if (field.name === 'terms' && !field.checked) {
          field.classList.add('input-error');
          hasEmptyFields = true;
        }
      } else {
        formData[field.name] = field.value.trim();
        if (field.value.trim() === '') {
          field.classList.add('input-error');
          hasEmptyFields = true;
        }
      }
    });
    
    if (hasEmptyFields) {
      alert('Будь ласка, заповніть всі обов\'язкові поля форми.');
      return;
    }
    
    // Get form data in an object
    console.log('Form data:', formData);
    
    // Save to localStorage
    saveFormDataToLocalStorage(formData);
    
    // Reset form
    contactForm.reset();
    
    // Show success message
    alert('Дякуємо! Ваше повідомлення успішно надіслано.');
  });
}

function initModalForm() {
  const modalForm = document.getElementById('contactModalForm');
  if (!modalForm) return;
  
  modalForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset previous errors
    const errorElements = modalForm.querySelectorAll('.input-error');
    errorElements.forEach(el => el.classList.remove('input-error'));
    
    // Check for empty fields
    let hasEmptyFields = false;
    const formData = {};
    
    const requiredFields = modalForm.querySelectorAll('input, select, textarea');
    requiredFields.forEach(field => {
      formData[field.name] = field.value.trim();
      if (field.value.trim() === '') {
        field.classList.add('input-error');
        hasEmptyFields = true;
      }
    });
    
    if (hasEmptyFields) {
      alert('Будь ласка, заповніть всі поля форми.');
      return;
    }
    
    // Get form data in an object
    console.log('Modal form data:', formData);
    
    // Save to localStorage
    saveFormDataToLocalStorage(formData);
    
    // Reset form
    modalForm.reset();
    
    // Close modal
    const modal = document.getElementById('modalWindow');
    modal.querySelector('.close-modal').click();
    
    // Show success message
    alert('Дякуємо! Вашу заявку прийнято.');
  });
}

function saveFormDataToLocalStorage(formData) {
  // Get existing data from localStorage
  let storedData = localStorage.getItem('formSubmissions');
  let formSubmissions = storedData ? JSON.parse(storedData) : [];
  
  // Add timestamp to track submission time
  formData.submittedAt = new Date().toISOString();
  
  // Add new submission
  formSubmissions.push(formData);
  
  // Save back to localStorage
  localStorage.setItem('formSubmissions', JSON.stringify(formSubmissions));
}

function initTruncatedText() {
  const truncatedText = document.getElementById('truncatedText');
  const toggleBtn = document.getElementById('toggleTextBtn');
  
  if (!truncatedText || !toggleBtn) return;
  
  toggleBtn.addEventListener('click', function() {
    truncatedText.classList.toggle('expanded');
    
    if (truncatedText.classList.contains('expanded')) {
      toggleBtn.textContent = 'Згорнути';
    } else {
      toggleBtn.textContent = 'Показати більше';
    }
  });
}

function initSmoothScrollToTop() {
  const logo = document.querySelector('.logo-link');
  if (!logo) return;
  
  logo.addEventListener('click', function(e) {
    e.preventDefault();
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
      
    if (history.pushState) {
      history.pushState(null, null, '/');
    }
  });
}