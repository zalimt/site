document.addEventListener('DOMContentLoaded', function() {
    // Modal Elements
    const modal = document.getElementById('bookingModal');
    const closeModal = document.querySelector('.close-modal');
    const bookNowButtons = document.querySelectorAll('.book-now-btn');
    const customizeTripBtn = document.querySelector('.customize-trip-btn');
    const bookingForm = document.getElementById('bookingForm');
    const hotelSelect = document.getElementById('hotel');

    // Open Modal Function
    function openModal(hotelName = '') {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // If hotel name is provided, set it in the select
        if (hotelName) {
            hotelSelect.value = hotelName;
        }
    }

    // Close Modal Function
    function closeModalFunc() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Event Listeners for Modal
    bookNowButtons.forEach(button => {
        button.addEventListener('click', () => {
            const hotelName = button.getAttribute('data-hotel');
            openModal(hotelName);
        });
    });

    customizeTripBtn.addEventListener('click', () => {
        openModal();
    });

    closeModal.addEventListener('click', closeModalFunc);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    // Form Submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData.entries());

        try {
            // Here you would typically send the data to your server
            // For now, we'll just show a success message
            showSuccessMessage();
            
            // Reset form
            bookingForm.reset();
            
            // Close modal after a delay
            setTimeout(closeModalFunc, 2000);
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorMessage();
        }
    });

    // Success Message
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <h3>Thank you!</h3>
            <p>We'll contact you shortly via WhatsApp or Email.</p>
        `;
        
        const formContainer = bookingForm.parentElement;
        formContainer.appendChild(successDiv);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Error Message
    function showErrorMessage() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <h3>Oops!</h3>
            <p>Something went wrong. Please try again or contact us directly via WhatsApp.</p>
        `;
        
        const formContainer = bookingForm.parentElement;
        formContainer.appendChild(errorDiv);
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Add hover effect to hotel cards
    const hotelCards = document.querySelectorAll('.hotel-card');
    hotelCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 0 20px rgba(255, 62, 62, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });

    // Package Selection
    const packageButtons = document.querySelectorAll('.package-select-btn');
    const packageCards = document.querySelectorAll('.package-card');
    const selectedPackageName = document.getElementById('selectedPackageName');
    const selectedPackageDesc = document.getElementById('selectedPackageDesc');
    const selectedPackagePrice = document.getElementById('selectedPackagePrice');

    // Set default package
    document.getElementById('premiumPackage').classList.add('selected');
    document.querySelector('[data-package="premium"]').classList.remove('btn-secondary');
    document.querySelector('[data-package="premium"]').classList.add('btn-primary');

    packageButtons.forEach(button => {
      button.addEventListener('click', () => {
        const packageType = button.getAttribute('data-package');
        
        // Reset all package cards and buttons
        packageCards.forEach(card => card.classList.remove('selected'));
        packageButtons.forEach(btn => {
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-secondary');
        });
        
        // Set the selected package
        document.getElementById(`${packageType}Package`).classList.add('selected');
        button.classList.remove('btn-secondary');
        button.classList.add('btn-primary');
        
        // Update booking information
        if (packageType === 'standard') {
          selectedPackageName.textContent = 'GENERAL ADMISSION';
          selectedPackageDesc.textContent = 'Full Pass (19-21 Sep)';
          selectedPackagePrice.textContent = '€190';
        } else if (packageType === 'premium') {
          selectedPackageName.textContent = 'VIP STANDING';
          selectedPackageDesc.textContent = 'All-Days Pass (19-21 Sep)';
          selectedPackagePrice.textContent = '€480';
        } else if (packageType === 'luxury') {
          selectedPackageName.textContent = 'VIP BACKSTAGE';
          selectedPackageDesc.textContent = 'All-Days Pass (19-21 Sep)';
          selectedPackagePrice.textContent = '€750';
        }
        
        // Scroll to booking section
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
      });
    });
});