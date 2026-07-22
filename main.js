// ==========================================
// DYNAMIC HTML INJECTION (FOOTER)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
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
// THEME TOGGLE & OS AUTO-DETECT LOGIC
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Core function to apply the theme across the page and agent
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    
    // Update the button text if the button exists on this page
    if (themeToggleBtn) {
        themeToggleBtn.innerText = theme === "dark" ? "[ LIGHT ]" : "[ DARK ]";
    }
    
    // Ping the iframe to update its theme (if the agent widget exists on this page)
    const iframe = document.getElementById('mca-iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'THEME_UPDATE', theme: theme }, '*');
    }
}

// 1. Initial Load: Check Local Storage first, fallback to OS System Preference
const currentStoredTheme = localStorage.getItem("theme");
if (currentStoredTheme) {
    applyTheme(currentStoredTheme);
} else {
    applyTheme(prefersDarkScheme.matches ? "dark" : "light");
}

// 2. Real-Time OS Listener: Auto-switch if the user changes their device settings
prefersDarkScheme.addEventListener("change", (e) => {
    // Only auto-switch if the user hasn't manually clicked the toggle button
    if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light");
    }
});

// 3. Manual Override: When the user clicks the toggle button
if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function() {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        applyTheme(newTheme);
        
        // Save their manual choice so the OS doesn't override it later
        localStorage.setItem("theme", newTheme); 
    });
}


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
        
        if (!chatWindow.classList.contains('active')) {
            chatWindow.classList.add('active');
            btn.classList.add('active');
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
        } else {
            chatWindow.classList.remove('active');
            btn.classList.remove('active');
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
        }
    };

    window.dismissTeaser = function() {
        if (!teaser) return;
        teaserDismissed = true;
        teaser.classList.remove('teaser-enter');
        teaser.classList.add('teaser-exit');
        setTimeout(() => teaser.classList.add('hidden'), 500);
    };

    // Auto-trigger the teaser after 15 seconds
    setTimeout(() => {
        if (teaser && !chatWindow.classList.contains('active') && !teaserDismissed) {
            teaser.classList.remove('hidden');
            setTimeout(() => {
                teaser.classList.remove('teaser-exit');
                teaser.classList.add('teaser-enter');
            }, 50);
        }
    }, 15000); 
}
