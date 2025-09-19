document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed'); // Debug log to check if JavaScript is loading
    // Initialize EmailJS
    emailjs.init("kIeoTy28ws4-_jR-1");

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target) && mobileMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Package Modal Buttons
    document.querySelectorAll('.package-modal-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    });

    // Close package modals when clicking the close button
    document.querySelectorAll('.modal .close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close package modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });



    // Package Selection - Only scroll to hotels (for old buttons)
    document.querySelectorAll('.package-select-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('hotels').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            return false;
        });
    });

    // Modal Elements
    const modal = document.getElementById('bookingModal');
    const thankYouModal = document.getElementById('thankYouModal');
    const closeModal = document.querySelector('.close-modal');
    const closeThankYou = document.getElementById('closeThankYou');
    const closeThankYouBtn = document.getElementById('closeThankYouBtn');
    const bookNowButtons = document.querySelectorAll('.book-now-btn');
    const customizeTripBtn = document.querySelector('.customize-trip-btn');
    const bookingForm = document.getElementById('bookingForm');
    const hotelSelect = document.getElementById('hotel');

    console.log('Modal elements found:', {
        modal: !!modal,
        thankYouModal: !!thankYouModal,
        closeModal: !!closeModal,
        bookingForm: !!bookingForm,
        hotelSelect: !!hotelSelect
    });

    // Test: Add a simple click handler to the submit button
    setTimeout(() => {
        const submitBtn = document.querySelector('#bookingForm button[type="submit"]');
        console.log('Submit button found:', !!submitBtn);
        if (submitBtn) {
            submitBtn.addEventListener('click', function() {
                console.log('Submit button clicked!');
            });
        }
    }, 1000); // Wait 1 second to ensure DOM is ready

    // Header BOOK NOW button - scroll to hotels section
    const headerBookNowBtn = document.querySelector('.nav-desktop .btn-primary');
    if (headerBookNowBtn) {
        headerBookNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const hotelsSection = document.getElementById('hotels');
            if (hotelsSection) {
                hotelsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Mobile menu BOOK NOW button - also scroll to hotels
    const mobileBookNowBtn = document.querySelector('.mobile-menu a[href="#booking"]');
    if (mobileBookNowBtn) {
        mobileBookNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const hotelsSection = document.getElementById('hotels');
            if (hotelsSection) {
                hotelsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // All other BOOK NOW buttons - open modal
    const allBookNowButtons = document.querySelectorAll('.btn-primary:not(.nav-desktop .btn-primary):not(.book-direct-btn):not(.stripe-link), .package-select-btn, .booking-btn');
    allBookNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const hotel = button.getAttribute('data-hotel');
            openModal(hotel);
        });
    });

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
        phone: {
            required: true,
            minLength: 8,
            pattern: /^[\+]?[1-9][\d]{0,15}$/
        },
        package: {
            required: true
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

    // Close modal when clicking the close button
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Book Now buttons
    bookNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const hotelName = this.getAttribute('data-hotel');
            const packageType = this.getAttribute('data-package');
            const packagePrice = this.getAttribute('data-price');
            
            modal.style.display = 'flex';
            
            // Set the selected hotel in the dropdown
            if (hotelSelect && hotelName) {
                hotelSelect.value = hotelName;
            }
            
            // Store package information for form submission
            if (packageType) {
                modal.setAttribute('data-selected-package', packageType);
                modal.setAttribute('data-selected-price', packagePrice);
            }
        });
    });

    // Customize Trip button
    if (customizeTripBtn) {
        customizeTripBtn.addEventListener('click', function() {
            modal.style.display = 'flex';
            // Don't pre-select any hotel for customize trip
            if (hotelSelect) {
                hotelSelect.value = '';
            }
        });
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
    const packageCards = document.querySelectorAll('.package-card');
    const selectedPackageName = document.getElementById('selectedPackageName');
    const selectedPackageDesc = document.getElementById('selectedPackageDesc');
    const selectedPackagePrice = document.getElementById('selectedPackagePrice');

    // Set default package
    const premiumPackage = document.getElementById('premiumPackage');
    if (premiumPackage) {
        premiumPackage.classList.add('selected');
    }
    const premiumPackageBtn = document.querySelector('[data-package="premium"]');
    if (premiumPackageBtn) {
        premiumPackageBtn.classList.remove('btn-secondary');
        premiumPackageBtn.classList.add('btn-primary');
    }

    packageCards.forEach(card => {
        card.addEventListener('click', () => {
            // Reset all package cards and buttons
            packageCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Update booking information
            const packageType = card.getAttribute('data-package');
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

    // Form submission handler - using click instead of submit
    if (bookingForm) {
        const submitButton = bookingForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', async (e) => {
                e.preventDefault();
                
                // Validate required fields
                const name = bookingForm.querySelector('#name').value.trim();
                const email = bookingForm.querySelector('#email').value.trim();
                const phone = bookingForm.querySelector('#phone').value.trim();
                const package = bookingForm.querySelector('#package').value.trim();
                const hotel = bookingForm.querySelector('#hotel').value.trim();
                const travelers = bookingForm.querySelector('#travelers').value.trim();
                
                if (!name || !email || !phone || !package || !hotel || !travelers) {
                    alert('Please fill in all required fields.');
                    return;
                }
                
                // Show loading state
                const originalButtonText = submitButton.innerHTML;
                submitButton.innerHTML = '<div class="loading-spinner"></div> Sending...';
                submitButton.disabled = true;

                try {
                    // Get form data
                    const formData = new FormData(bookingForm);
                    const data = Object.fromEntries(formData.entries());

                    // Get package information from modal
                    const selectedPackage = modal.getAttribute('data-selected-package') || 'Not selected';
                    const selectedPrice = modal.getAttribute('data-selected-price') || 'Not specified';
                    
                    // Prepare email template parameters
                    const templateParams = {
                        to_email: 'zalim.tsorion@gmail.com',
                        from_name: data.name,
                        from_email: data.email,
                        phone: data.phone,
                        package: data.package,
                        hotel: data.hotel || 'Not selected',
                        travelers: data.travelers,
                        notes: data.notes || 'No additional notes',
                        subject: 'New BEONIX Festival 2025 Booking Request'
                    };

                    // Send email using EmailJS
                    await emailjs.send(
                        'beonix_to_infomm',
                        'template_avdejhd',
                        templateParams
                    );

                    // Show success message
                    thankYouModal.style.display = 'flex';
                    
                    // Reset form and close modal
                    bookingForm.reset();
                    modal.style.display = 'none';
                    
                } catch (error) {
                    console.error('Error sending email:', error);
                    alert('Failed to send booking request. Please try again or contact us directly.');
                } finally {
                    // Reset button state
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }
            });
        }
    }

    // Close thank you modal
    closeThankYou.addEventListener('click', () => {
        thankYouModal.style.display = 'none';
    });

    closeThankYouBtn.addEventListener('click', () => {
        thankYouModal.style.display = 'none';
    });

    // Close thank you modal when clicking outside
    thankYouModal.addEventListener('click', (e) => {
        if (e.target === thankYouModal) {
            thankYouModal.style.display = 'none';
        }
    });

    // Shuttle Tabs Functionality
    console.log('Initializing shuttle functionality...');
    
    const shuttleTabs = document.querySelectorAll('.shuttle-tab');
    const shuttleContents = document.querySelectorAll('.shuttle-content');
    
    console.log('Found shuttle tabs:', shuttleTabs.length);
    console.log('Found shuttle contents:', shuttleContents.length);

    if (shuttleTabs.length > 0 && shuttleContents.length > 0) {
        shuttleTabs.forEach((tab, index) => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Shuttle tab clicked:', this.getAttribute('data-tab'));
                
                const targetTab = this.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                shuttleTabs.forEach(t => t.classList.remove('active'));
                shuttleContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding content
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                    console.log('Activated content:', targetTab);
                } else {
                    console.error('Target content not found:', targetTab);
                }
            });
        });
    } else {
        console.error('Shuttle tabs or contents not found!');
    }

    // Make stop names clickable for Google Maps links
    setTimeout(() => {
        const stopItems = document.querySelectorAll('.stop-item');
        console.log('Found stop items:', stopItems.length);
        
        stopItems.forEach((stopItem, index) => {
            stopItem.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Stop item clicked:', index);
                
                const stopNameElement = this.querySelector('.stop-name');
                const stopName = stopNameElement ? stopNameElement.textContent : 'Unknown';
                const mapsUrl = this.getAttribute('data-maps-url');
                
                console.log('Stop name:', stopName);
                console.log('Maps URL:', mapsUrl);
                
                if (mapsUrl && mapsUrl.trim() !== '') {
                    // Open Google Maps link in new tab
                    try {
                        window.open(mapsUrl, '_blank');
                        console.log('Opened maps URL:', mapsUrl);
                    } catch (error) {
                        console.error('Error opening maps URL:', error);
                    }
                } else {
                    // Show a visual feedback that the stop is clickable
                    this.style.background = 'rgba(255, 102, 51, 0.1)';
                    setTimeout(() => {
                        this.style.background = '';
                    }, 200);
                    console.log(`Clicked on: ${stopName} (No maps URL configured yet)`);
                }
            });
        });
    }, 1000); // Wait 1 second to ensure all content is loaded
});