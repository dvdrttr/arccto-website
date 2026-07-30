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
// DYNAMIC HTML INJECTION (NAV & FOOTER)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Inject Navigation
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        fetch('/nav.html')
            .then(response => response.text())
            .then(data => {
                navPlaceholder.innerHTML = data;
            })
            .catch(error => console.error('Error loading nav:', error));
    }

    // 2. Inject Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error('Error loading footer:', error));
    }
});


// ==========================================
// MCA AGENT WIDGET LOGIC
// ==========================================
const chatWindow = document.getElementById('mca-chat-window');
const btn = document.getElementById('mca-toggle-btn');
const iframe = document.getElementById('mca-iframe');
const teaser = document.getElementById('mca-teaser');
const baseUrl = "https://genai-app-arc-mca-1-1784411599583-16289276837.us-central1.run.app/?key=SRbrQXbSDX4Tr6BPvAg1N4sYSIjp96Kc";
let teaserDismissed = false;

// FAILSAFE: Only run this logic if the widget actually exists on the page
if (btn && chatWindow && iframe) {
    
    window.toggleMcaChat = function(intent) {
        if (intent) { iframe.src = baseUrl + "&intent=" + intent; }
        dismissTeaser();
        
        const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
        iframe.contentWindow.postMessage({ type: 'THEME_UPDATE', theme: currentTheme }, '*');
        iframe.contentWindow.postMessage({ type: 'FOCUS_INPUT' }, '*');
        
        const iconChat = document.getElementById('mca-icon-chat');
        const iconClose = document.getElementById('mca-icon-close');

        if (!chatWindow.classList.contains('active')) {
            chatWindow.classList.add('active');
            btn.classList.add('active');
            // Swap to the Close 'X' icon (keeping the +45deg upright rotation)
            if (iconChat) iconChat.classList.add('hidden');
            if (iconClose) iconClose.classList.remove('hidden');
        } else {
            chatWindow.classList.remove('active');
            btn.classList.remove('active');
            // Swap back to the Speech Bubble icon
            if (iconChat) iconChat.classList.remove('hidden');
            if (iconClose) iconClose.classList.add('hidden');
        }

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
