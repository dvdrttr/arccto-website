// ==========================================
// OS AUTO-DETECT THEME LOGIC
// ==========================================
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Core function to apply the theme across the page and agent
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    
    // Ping the iframe to update its theme (if the agent widget exists on this page)
    const iframe = document.getElementById('mca-iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'THEME_UPDATE', theme: theme }, '*');
    }
}

// 1. Initial Load: Set based on OS System Preference
applyTheme(prefersDarkScheme.matches ? "dark" : "light");

// 2. Real-Time OS Listener: Auto-switch if the user changes their device settings
prefersDarkScheme.addEventListener("change", (e) => {
    applyTheme(e.matches ? "dark" : "light");
});


// ==========================================
// DYNAMIC HTML INJECTION (NAV, FOOTER, MODAL)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Inject Navigation
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        fetch(`${window.location.origin}/nav.html`)
            .then(response => {
                if (!response.ok) throw new Error("Nav fetch failed");
                return response.text();
            })
            .then(data => {
                navPlaceholder.innerHTML = data;
            })
            .catch(error => console.error('Error loading nav:', error));
    }

    // 2. Inject Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch(`${window.location.origin}/footer.html`)
            .then(response => {
                if (!response.ok) throw new Error("Footer fetch failed");
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error('Error loading footer:', error));
    }

    // 3. Inject Booking Modal
    const modalPlaceholder = document.getElementById('modal-placeholder');
    if (modalPlaceholder) {
        fetch(`${window.location.origin}/modal.html`)
            .then(response => {
                if (!response.ok) throw new Error("Modal fetch failed");
                return response.text();
            })
            .then(data => {
                modalPlaceholder.innerHTML = data;
            })
            .catch(error => console.error('Error loading modal:', error));
    }
});


// ==========================================
// MCA AGENT WIDGET LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById('mca-chat-window');
    const btn = document.getElementById('mca-toggle-btn');
    const iframe = document.getElementById('mca-iframe');
    const teaser = document.getElementById('mca-teaser');
    const baseUrl = "https://genai-app-arc-mca-1-1784411599583-16289276837.us-central1.run.app/?key=SRbrQXbSDX4Tr6BPvAg1N4sYSIjp96Kc";
    let teaserDismissed = false;

    // FAILSAFE: Only run this logic if the widget actually exists on the page
    if (btn && chatWindow && iframe) {
        
        window.toggleMcaChat = function(intent = null) {
            if (intent && typeof intent === 'string') { 
                iframe.src = `${baseUrl}&intent=${intent}`; 
            }
            if (typeof window.dismissTeaser === 'function') {
                window.dismissTeaser();
            }
            
            const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: 'THEME_UPDATE', theme: currentTheme }, '*');
                iframe.contentWindow.postMessage({ type: 'FOCUS_INPUT' }, '*');
            }
            
            const iconChat = document.getElementById('mca-icon-chat');
            const iconClose = document.getElementById('mca-icon-close');

            if (!chatWindow.classList.contains('active')) {
                chatWindow.classList.add('active');
                chatWindow.classList.remove('hidden');
                chatWindow.style.display = 'block';
                btn.classList.add('active');
                // Swap to the Close 'X' icon (keeping the +45deg upright rotation)
                if (iconChat) iconChat.classList.add('hidden');
                if (iconClose) iconClose.classList.remove('hidden');
            } else {
                chatWindow.classList.remove('active');
                chatWindow.classList.add('hidden');
                chatWindow.style.display = 'none';
                btn.classList.remove('active');
                // Swap back to the Speech Bubble icon
                if (iconChat) iconChat.classList.remove('hidden');
                if (iconClose) iconClose.classList.add('hidden');
            }
        };

        window.dismissTeaser = function() {
            if (!teaser) return;
            teaserDismissed = true;
            teaser.classList.remove('teaser-enter');
            teaser.classList.add('teaser-exit');
            setTimeout(() => teaser.classList.add('hidden'), 500);
        };

        // Auto-trigger the teaser after 60 seconds
        setTimeout(() => {
            if (teaser && !chatWindow.classList.contains('active') && !teaserDismissed) {
                teaser.classList.remove('hidden');
                setTimeout(() => {
                    teaser.classList.remove('teaser-exit');
                    teaser.classList.add('teaser-enter');
                }, 50);
            }
        }, 60000); 
    }
});

// ==========================================
// GLOBAL ANALYTICS INJECTION (Statcounter)
// ==========================================
function injectAnalytics() {
    // 1. Inject the configuration variables
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.innerHTML = `
        var sc_project=13336855; 
        var sc_invisible=1; 
        var sc_security="73022e84"; 
    `;
    document.body.appendChild(configScript);

    // 2. Inject the external Statcounter script
    const externalScript = document.createElement('script');
    externalScript.type = 'text/javascript';
    externalScript.src = 'https://www.statcounter.com/counter/counter.js';
    externalScript.async = true;
    document.body.appendChild(externalScript);

    // 3. Inject the noscript fallback (for browsers with JS disabled)
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<div class="statcounter"><a title="Web Analytics Made Easy - Statcounter" href="https://statcounter.com/" target="_blank"><img class="statcounter" src="https://c.statcounter.com/13336855/0/73022e84/1/" alt="Web Analytics Made Easy - Statcounter" referrerPolicy="no-referrer-when-downgrade"></a></div>`;
    document.body.appendChild(noscript);
}

// Ensure it runs as soon as the page loads
document.addEventListener("DOMContentLoaded", () => {
    injectAnalytics();
});


// ==========================================
// GLOBAL BOOKING MODAL LOGIC
// ==========================================
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyxnK1SIf8w3nnRKk0ziB5cx8TjJVh6EEcYlzYVR92K0TPRLJDWv8V5MXUulx6rLEpv/exec';

window.openBookingModal = function() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    }
};

window.closeBookingModal = function() {
    const modal = document.getElementById('booking-modal');
    const form = document.getElementById('booking-form');
    const statusText = document.getElementById('booking-status');
    const submitBtn = document.getElementById('submit-btn');
    
    if (modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            if (form) form.reset();
            if (statusText) statusText.classList.add('hidden');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Request Strategy Session &rarr;';
                submitBtn.style.display = 'block';
            }
        }, 300);
    }
};

window.submitBooking = async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const statusText = document.getElementById('booking-status');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'SENDING REQUEST...';
    
    statusText.classList.remove('hidden', 'text-red-500', 'text-green-500');
    statusText.classList.add('text-gray-400');
    statusText.innerText = "Securing your calendar spot...";

    const dateVal = document.getElementById('book-date').value;
    const timeVal = document.getElementById('book-time').value;
    const nameVal = document.getElementById('book-name').value;
    const channelVal = document.getElementById('book-channel').value;
    
    const startDateTime = new Date(`${dateVal}T${timeVal}:00-04:00`);
    
    // Updated to correctly calculate 30 minutes instead of 1 hour
    const endDateTime = new Date(startDateTime.getTime() + (30 * 60 * 1000)); 

    const payload = {
        action: 'bookCalendar',
        clientEmail: document.getElementById('book-email').value,
        summary: `ARC Discovery Session: ${nameVal} [${channelVal}]`,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString()
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Conflict Handling
        if (result.status === 'CONFLICT') {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Try Different Time &rarr;';
            statusText.classList.remove('hidden', 'text-gray-400', 'text-[#DC2626]');
            statusText.classList.add('text-red-500');
            statusText.innerText = "TIME SLOT UNAVAILABLE. PLEASE SELECT ANOTHER TIME.";
            return; 
        }

        // Success Handling
        submitBtn.style.display = 'none';
        statusText.classList.remove('hidden', 'text-red-500');
        statusText.classList.add('text-[#DC2626]');
        statusText.innerText = "REQUEST RECEIVED. CHECK YOUR INBOX FOR CONFIRMATION.";
        setTimeout(window.closeBookingModal, 4000);

    } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Request Strategy Session &rarr;';
        statusText.classList.remove('hidden');
        statusText.classList.add('text-red-500');
        statusText.innerText = "COULD NOT SEND REQUEST. PLEASE TRY AGAIN.";
    }
};
