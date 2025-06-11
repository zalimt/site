document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("kIeoTy28ws4-_jR-1");

    // Modal Elements
    const modal = document.getElementById('bookingModal');
    const closeModal = document.querySelector('.close-modal');
    const bookNowButtons = document.querySelectorAll('.book-now-btn');
    const customizeTripBtn = document.querySelector('.customize-trip-btn');
    const bookingForm = document.getElementById('bookingForm');
    const hotelSelect = document.getElementById('hotel');

    // Form validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 50
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        country: {
            required: true,
            minLength: 2
        },
        hotel: {
            required: true
        },
        travelers: {
            required: true,
            min: 1,
            max: 10
        }
    };

    // Validate form field
    function validateField(field) {
        const value = field.value.trim();
        const rules = validationRules[field.name];
        
        // If no validation rules exist for this field, consider it valid
        if (!rules) {
            return '';
        }

        let error = '';

        if (rules.required && !value) {
            error = 'This field is required';
        } else if (rules.minLength && value.length < rules.minLength) {
            error = `Minimum length is ${rules.minLength} characters`;
        } else if (rules.maxLength && value.length > rules.maxLength) {
            error = `Maximum length is ${rules.maxLength} characters`;
        } else if (rules.pattern && !rules.pattern.test(value)) {
            error = 'Please enter a valid value';
        } else if (rules.min && parseInt(value) < rules.min) {
            error = `Minimum value is ${rules.min}`;
        } else if (rules.max && parseInt(value) > rules.max) {
            error = `Maximum value is ${rules.max}`;
        }

        return error;
    }

    // Show field error
    function showFieldError(field, error) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = error;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorElement);
        }
        
        field.classList.add('error');
    }

    // Clear field error
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.classList.remove('error');
    }

    // Validate entire form
    function validateForm() {
        let isValid = true;
        const fields = bookingForm.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            // Only validate fields that have validation rules
            if (validationRules[field.name]) {
                const error = validateField(field);
                if (error) {
                    showFieldError(field, error);
                    isValid = false;
                } else {
                    clearFieldError(field);
                }
            }
        });
        
        return isValid;
    }

    // Real-time validation
    bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
        // Only add validation listeners to fields that have validation rules
        if (validationRules[field.name]) {
            field.addEventListener('blur', () => {
                const error = validateField(field);
                if (error) {
                    showFieldError(field, error);
                } else {
                    clearFieldError(field);
                }
            });

            field.addEventListener('input', () => {
                clearFieldError(field);
            });
        }
    });

    // Form submission handler
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submission started');
        
        if (!validateForm()) {
            showErrorMessage('Please correct the errors in the form');
            return;
        }
        
        // Show loading state
        const submitButton = bookingForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<div class="loading-spinner"></div> Sending...';
        submitButton.disabled = true;

        try {
            // Get form data
            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());

            // Prepare email template parameters
            const templateParams = {
                to_email: 'zalim.tsorion@gmail.com',
                from_name: data.name,
                from_email: data.email,
                country: data.country,
                hotel: data.hotel,
                travelers: data.travelers,
                notes: data.notes || 'No additional notes provided',
                reply_to: data.email,
                submission_date: new Date().toLocaleString()
            };

            console.log('Sending email with params:', templateParams);

            // Send email using EmailJS
            const response = await emailjs.send(
                'beonix_to_infomm',
                'template_avdejhd',
                templateParams
            );

            console.log('Email sent successfully:', response);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            bookingForm.reset();
            
            // Close modal after a delay
            setTimeout(closeModalFunc, 2000);
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorMessage('Failed to send your request. Please try again or contact us directly via WhatsApp.');
        } finally {
            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });

    // Success Message
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <h3>Thank you for your booking request!</h3>
            <p>We've received your request and will contact you shortly via WhatsApp or Email to confirm your booking.</p>
            <p>In the meantime, feel free to contact us directly if you have any questions.</p>
        `;
        
        const formContainer = bookingForm.parentElement;
        formContainer.appendChild(successDiv);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Error Message
    function showErrorMessage(message = 'Something went wrong. Please try again or contact us directly via WhatsApp.') {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <h3>Oops!</h3>
            <p>${message}</p>
        `;
        
        const formContainer = bookingForm.parentElement;
        formContainer.appendChild(errorDiv);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Open Modal Function
    function openModal(hotel = '') {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        if (hotel) {
            hotelSelect.value = hotel;
        }
    }

    // Close Modal Function
    function closeModalFunc() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Event Listeners
    bookNowButtons.forEach(button => {
        button.addEventListener('click', () => {
            const hotel = button.getAttribute('data-hotel');
            openModal(hotel);
        });
    });

    customizeTripBtn.addEventListener('click', () => {
        openModal();
    });

    closeModal.addEventListener('click', closeModalFunc);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

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