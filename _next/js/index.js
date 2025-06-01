        // Initialize Supabase
        const supabaseUrl = 'https://ueahhrzajajynrojqlzo.supabase.co'
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlYWhocnphamFqeW5yb2pxbHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3Mzg4MzksImV4cCI6MjA2NDMxNDgzOX0.qr1gtILnbsbqxECNE19TV0tQl_UykFoqlZS-ZTTGmJQ'
        const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

        // Global variables
        let currentPlan = 'silver';
        let currentPaymentMethod = null;
        let selectedSessionType = '';

        // Check auth state on page load
        document.addEventListener('DOMContentLoaded', () => {
            checkAuthState();
            
            // Mobile menu functionality
            setupMobileMenu();
            
            // Contact form submission
            document.getElementById('contactForm').addEventListener('submit', function(e) {
                e.preventDefault();
                document.getElementById('successMessage').classList.remove('hidden');
                this.reset();
            });
        });

        // Check authentication state
        async function checkAuthState() {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                // User is logged in
                document.getElementById('loginButton').classList.add('hidden');
                document.getElementById('logoutButton').classList.remove('hidden');
                document.getElementById('mobileLoginButton').classList.add('hidden');
                document.getElementById('mobileLogoutButton').classList.remove('hidden');
                document.getElementById('adminLink').classList.remove('hidden');
            } else {
                // User is not logged in
                document.getElementById('loginButton').classList.remove('hidden');
                document.getElementById('logoutButton').classList.add('hidden');
                document.getElementById('mobileLoginButton').classList.remove('hidden');
                document.getElementById('mobileLogoutButton').classList.add('hidden');
                document.getElementById('adminLink').classList.add('hidden');
            }
        }

        // Show login modal
        function showLoginModal() {
            document.getElementById('loginModal').classList.remove('hidden');
        }

        // Hide login modal
        function hideLoginModal() {
            document.getElementById('loginModal').classList.add('hidden');
        }

        // Login function
        async function loginAdmin() {
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            if (!email || !password) {
                alert('Please enter both email and password');
                return;
            }

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                alert('Login failed: ' + error.message);
                return;
            }

            hideLoginModal();
            checkAuthState();
        }

        // Logout function
        async function logout() {
            const { error } = await supabaseClient.auth.signOut();
            if (error) {
                alert('Logout failed: ' + error.message);
                return;
            }
            checkAuthState();
        }

        // Setup event listeners
        //document.getElementById('loginButton').addEventListener('click', showLoginModal);
        //document.getElementById('mobileLoginButton').addEventListener('click', showLoginModal);
       // document.getElementById('logoutButton').addEventListener('click', logout);
        //document.getElementById('mobileLogoutButton').addEventListener('click', logout);

        // Mobile menu setup
        function setupMobileMenu() {
            const mobileMenuButton = document.getElementById('mobileMenuButton');
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuPanel = document.getElementById('mobileMenuPanel');
            const closeMobileMenu = document.getElementById('closeMobileMenu');

            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.remove('hidden');
                setTimeout(() => {
                    mobileMenuPanel.classList.remove('-translate-x-full');
                }, 10);
            });

            function closeMenuAnimated() {
                mobileMenuPanel.classList.add('-translate-x-full');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            }

            closeMobileMenu.addEventListener('click', closeMenuAnimated);
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    closeMenuAnimated();
                }
            });

            document.querySelectorAll('.mobile-menu-link').forEach(link => {
                link.addEventListener('click', closeMenuAnimated);
            });
        }

        // Scroll to membership section
        function scrollToMembership() {
            document.getElementById('membership').scrollIntoView({ behavior: 'smooth' });
        }

        // Copy to clipboard utility
        function copyToClipboard(elementId) {
            const text = document.getElementById(elementId).textContent;
            navigator.clipboard.writeText(text).then(() => {
                alert('Copied to clipboard!');
            });
        }

        // Payment Modal Functions
        function showPaymentOptions(plan) {
            currentPlan = plan;
            currentPaymentMethod = null;
            document.getElementById('paymentModal').classList.remove('hidden');

            // Set plan title and price
            let planTitle = '';
            let planPrice = '';
            if (plan === 'bronze') {
                planTitle = 'Bronze Membership';
                planPrice = '€453.32';
            } else if (plan === 'silver') {
                planTitle = 'Silver Membership';
                planPrice = '€649.99';
            } else if (plan === 'gold') {
                planTitle = 'Gold Membership';
                planPrice = '€999.99';
            }
            document.getElementById('selectedPlanTitle').textContent = planTitle;
            document.getElementById('selectedPlanPrice').textContent = planPrice;

            // Hide payment details
            document.getElementById('paymentDetails').classList.add('hidden');
            document.getElementById('paypalDetails').classList.add('hidden');
            document.getElementById('cryptoDetails').classList.add('hidden');
            document.getElementById('giftcardDetails').classList.add('hidden');
        }

        function hidePaymentOptions() {
            document.getElementById('paymentModal').classList.add('hidden');
            document.getElementById('paymentDetails').classList.add('hidden');
            //document.getElementById('paypalDetails').classList.add('hidden');
            document.getElementById('cryptoDetails').classList.add('hidden');
            document.getElementById('giftcardDetails').classList.add('hidden');
            currentPaymentMethod = null;
        }

        function selectPaymentMethod(method) {
            currentPaymentMethod = method;
            document.getElementById('paymentDetails').classList.remove('hidden');
            //document.getElementById('paypalDetails').classList.add('hidden');
            document.getElementById('cryptoDetails').classList.add('hidden');
            document.getElementById('giftcardDetails').classList.add('hidden');

            if (method === 'paypal') {
                document.getElementById('paypalDetails').classList.remove('hidden');
            } else if (method === 'crypto') {
                document.getElementById('cryptoDetails').classList.remove('hidden');
            } else if (method === 'giftcard') {
                document.getElementById('giftcardDetails').classList.remove('hidden');
            }
        }

        // Submit PayPal payment
        async function submitPaypalPayment() {
            const transactionId = document.getElementById('paypalTransactionId').value.trim();
            const email = document.getElementById('paypalEmail').value.trim();
            
            if (!transactionId || !email) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            try {
                // Get membership ID based on current plan
                const { data: membership, error: membershipError } = await supabase
                    .from('memberships')
                    .select('id')
                    .eq('type', currentPlan)
                    .single();

                if (membershipError) throw membershipError;

                // Insert payment record
                const { data: payment, error: paymentError } = await supabase
                    .from('payments')
                    .insert([{
                        membership_id: membership.id,
                        user_email: email,
                        payment_method: 'paypal',
                        transaction_id: transactionId,
                        status: 'pending'
                    }])
                    .select();

                if (paymentError) throw paymentError;

                // Show success message
                document.getElementById('successModal').classList.remove('hidden');
                
                // Reset form
                document.getElementById('paypalTransactionId').value = '';
                document.getElementById('paypalEmail').value = '';
                
                // Hide payment modal after 2 seconds
                setTimeout(() => {
                    hidePaymentOptions();
                }, 2000);
            } catch (error) {
                console.error('Payment submission error:', error);
                alert('There was an error processing your payment. Please try again.');
            }
        }

        // Submit Crypto payment
        async function submitCryptoPayment() {
            const transactionHash = document.getElementById('cryptoTransactionHash').value.trim();
            const email = document.getElementById('cryptoEmail').value.trim();
            
            if (!transactionHash || !email) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            try {
                // Get membership ID based on current plan
                const { data: membership, error: membershipError } = await supabaseClient
                    .from('memberships')
                    .select('id')
                    .eq('type', currentPlan)
                    .single();

                if (membershipError) throw membershipError;

                // Insert payment record
                const { data: payment, error: paymentError } = await supabaseClient
                    .from('payments')
                    .insert([{
                        membership_id: membership.id,
                        user_email: email,
                        payment_method: 'crypto',
                        transaction_id: transactionHash,
                        status: 'pending'
                    }])
                    .select();

                if (paymentError) throw paymentError;

                // Show success message
                document.getElementById('successModal').classList.remove('hidden');
                
                // Reset form
                document.getElementById('cryptoTransactionHash').value = '';
                document.getElementById('cryptoEmail').value = '';
                
                // Hide payment modal after 2 seconds
                setTimeout(() => {
                    hidePaymentOptions();
                }, 2000);
            } catch (error) {
                console.error('Payment submission error:', error);
                alert('There was an error processing your payment. Please try again.');
            }
        }

        // Submit Gift Card payment
async function submitGiftCardPayment() {
    const code = document.getElementById('giftCardCode').value.trim();
    const pin = document.getElementById('giftCardPin').value.trim();
    const email = document.getElementById('giftCardEmail').value.trim();
    const imageInput = document.getElementById('giftCardImage');
    const file = imageInput.files[0];
    
    if (!code || !email) {
        alert('Please fill in all required fields.');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Validate file if provided
    if (file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        
        if (file.size > maxSize) {
            alert('Image file must be less than 5MB.');
            return;
        }
        
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPEG, PNG, or WebP).');
            return;
        }
    }

    let uploadedFilePath = null;

    try {
        // First, get membership ID
        const { data: membership, error: membershipError } = await supabaseClient
            .from('memberships')
            .select('id')
            .eq('type', currentPlan)
            .single();

        if (membershipError) {
            console.error('Membership error:', membershipError);
            throw new Error('Unable to find membership plan. Please try again.');
        }

        let imageUrl = null;
        
        // Upload image if provided
        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `giftcards/${fileName}`;
            uploadedFilePath = filePath; // Store for cleanup if needed

            console.log('Uploading file:', filePath);
            
            const { data: uploadData, error: uploadError } = await supabaseClient
                .storage
                .from('giftcards')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });
            
            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw new Error('Failed to upload image. Please try again.');
            }
            
            console.log('Upload successful:', uploadData);
            
            // Get public URL
            const { data: { publicUrl } } = supabaseClient
                .storage
                .from('giftcards')
                .getPublicUrl(filePath);
            
            imageUrl = publicUrl;
            console.log('Public URL:', imageUrl);
        }

        // Prepare payment data
        const paymentData = {
            membership_id: membership.id,
            user_email: email,
            payment_method: 'giftcard',
            transaction_id: code,
            gift_card_pin: pin || null,
            gift_card_image_url: imageUrl,
            status: 'pending',
            created_at: new Date().toISOString()
        };

        console.log('Inserting payment data:', paymentData);

        // Insert payment record
        const { data: payment, error: paymentError } = await supabaseClient
            .from('payments')
            .insert([paymentData])
            .select();

        if (paymentError) {
            console.error('Payment insert error:', paymentError);
            
            // Clean up uploaded file if database insert fails
            if (uploadedFilePath) {
                try {
                    await supabaseClient
                        .storage
                        .from('giftcards')
                        .remove([uploadedFilePath]);
                    console.log('Cleaned up uploaded file after database error');
                } catch (cleanupError) {
                    console.error('Failed to cleanup uploaded file:', cleanupError);
                }
            }
            
            throw new Error('Failed to process payment. Please check your details and try again.');
        }

        console.log('Payment inserted successfully:', payment);

        // Show success message
        document.getElementById('successModal').classList.remove('hidden');
        
        // Reset form
        document.getElementById('giftCardCode').value = '';
        document.getElementById('giftCardPin').value = '';
        document.getElementById('giftCardEmail').value = '';
        document.getElementById('giftCardImage').value = '';
        
        // Hide payment modal after 2 seconds
        setTimeout(() => {
            hidePaymentOptions();
        }, 2000);

    } catch (error) {
        console.error('Payment submission error:', error);
        
        // Show user-friendly error message
        if (error.message) {
            alert(error.message);
        } else {
            alert('There was an error processing your payment. Please try again.');
        }
    }
}
        // Hide success modal
        function hideSuccessModal() {
            document.getElementById('successModal').classList.add('hidden');
        }

        // Meet & Greet Functions
        function showMeetGreetModal() {
            document.getElementById('meetGreetModal').classList.remove('hidden');
            resetMeetGreetForm();
        }

        function hideMeetGreetModal() {
            document.getElementById('meetGreetModal').classList.add('hidden');
        }

        function hideMeetGreetSuccessModal() {
            document.getElementById('meetGreetSuccessModal').classList.add('hidden');
            hideMeetGreetModal();
        }

        function selectSessionOption(type) {
            selectedSessionType = type;
            
            // Update UI
            const options = document.querySelectorAll('.session-option');
            options.forEach(option => {
                option.classList.remove('border-purple-600', 'bg-purple-50');
            });
            
            const radios = document.querySelectorAll('.session-radio > div');
            radios.forEach(radio => {
                radio.classList.add('hidden');
            });
            
            const selectedOption = event.currentTarget;
            selectedOption.classList.add('border-purple-600', 'bg-purple-50');
            selectedOption.querySelector('.session-radio > div').classList.remove('hidden');
            
            // Show form
            document.getElementById('meetGreetForm').classList.remove('hidden');
            
            // Scroll to form
            setTimeout(() => {
                document.getElementById('meetGreetForm').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }

        function resetMeetGreetForm() {
            selectedSessionType = '';
            document.getElementById('meetGreetEmail').value = '';
            document.getElementById('meetGreetReason').value = '';
            document.getElementById('meetGreetForm').classList.add('hidden');
            
            const options = document.querySelectorAll('.session-option');
            options.forEach(option => {
                option.classList.remove('border-purple-600', 'bg-purple-50');
            });
            
            const radios = document.querySelectorAll('.session-radio > div');
            radios.forEach(radio => {
                radio.classList.add('hidden');
            });
        }

        async function submitMeetGreetRequest() {
            const email = document.getElementById('meetGreetEmail').value.trim();
            const reason = document.getElementById('meetGreetReason').value.trim();
            
            if (!email || !reason || !selectedSessionType) {
                alert('Please fill in all required fields and select a session type.');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            try {
                const { data, error } = await supabaseClient
                    .from('meet_greet_requests')
                    .insert([{
                        user_email: email,
                        session_type: selectedSessionType,
                        reason: reason,
                        status: 'pending'
                    }])
                    .select();
                
                if (error) throw error;
                
                document.getElementById('meetGreetSuccessModal').classList.remove('hidden');
                resetMeetGreetForm();
            } catch (error) {
                console.error('Meet & Greet submission error:', error);
                alert('There was an error submitting your request. Please try again later.');
            }
        }

        // Helper functions
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }