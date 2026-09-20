// lang-system.js

const LANG_KEY = 'terranova_lang';

function getSavedLang() {
    return localStorage.getItem(LANG_KEY) || 'fr';
}

function saveLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
}

function applyLanguage(lang) {
    if (typeof langData === 'undefined' || !langData[lang]) {
        console.warn('Language data not found for:', lang);
        // Fallback to simple RTL/LTR if data is missing
        const isAr = lang === 'ar';
        document.body.classList.toggle('rtl-mode', isAr);
        document.documentElement.dir = isAr ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        return;
    }

    // Save language preference
    saveLang(lang);

    // Apply fade-out
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0';

    setTimeout(() => {
        // Update active button state globally on the page
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Toggle RTL class on body or main components
        const isAr = lang === 'ar';
        document.body.classList.toggle('rtl-mode', isAr);
        document.documentElement.dir = isAr ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        // Apply translations using data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = langData[lang][key];
            if (translation) {
                // Try to find a child with class 'nav-text' or 'text-content' to preserve icons
                const textEl = el.querySelector('.nav-text') || el.querySelector('.text-content');
                if (textEl) {
                    textEl.textContent = translation;
                } else {
                    // If no specific text container, update if it doesn't have multiple complicated children
                    // or if it's a simple span/button/h1...
                    el.textContent = translation;
                }
            }
        });


        // Apply translations to placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (langData[lang][key]) {
                el.placeholder = langData[lang][key];
            }
        });

        // Apply translations to tooltips
        document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
            const key = el.getAttribute('data-i18n-tooltip');
            if (langData[lang][key]) {
                el.setAttribute('data-tooltip', langData[lang][key]);
            }
        });

        // Dispatch global event so local page scripts can react
        window.dispatchEvent(new CustomEvent('terranovaLanguageChanged', { detail: lang }));

        // Apply fade-in
        document.body.style.opacity = '1';
    }, 300);
}


function switchLanguage(lang) {
    applyLanguage(lang);
}

// Initial application
document.addEventListener('DOMContentLoaded', () => {
    // Inject global switch language logic if needed by page
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.currentTarget.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });

    // Apply saved or default language
    applyLanguage(getSavedLang());
});

// Sync language across tabs
window.addEventListener('storage', (e) => {
    if (e.key === LANG_KEY) {
        applyLanguage(e.newValue);
    }
});


function t(key) {
    const lang = getSavedLang();
    if (langData[lang] && langData[lang][key]) {
        return langData[lang][key];
    }
    return key;
}
