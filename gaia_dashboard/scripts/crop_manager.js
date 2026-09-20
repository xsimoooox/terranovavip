function updatePageTerminology() {
    const cropId = getSelectedCrop();
    const config = CROP_CONFIG[cropId];
    if (!config) return;
    
    // Select all elements that might contain crop names
    const elementsToUpdate = document.querySelectorAll('h1, h2, h3, h4, p, span, div, button, li, a, .nav-text, .metric-label, .metric-note, .ref-value, .gaia-text, .eye-text');
    
    const replacements = [
        { from: /🌳/g, to: config.icon },
        { from: /FRUITS DE L'ARGANIER/g, to: config.terroir.toUpperCase() },
        { from: /Fruits de l'Arganier/gi, to: config.terroir },
        { from: /l'Arganeraie/g, to: config.id === 'majhoul' ? "la " + config.terroir : "l'Arganeraie" },
        { from: /l'arganeraie/g, to: config.id === 'majhoul' ? "la " + config.terroir.toLowerCase() : "l'arganeraie" },
        { from: /l'Arganier/g, to: config.id === 'majhoul' ? "le " + config.display : "l'Arganier" },
        { from: /l'arganier/g, to: config.id === 'majhoul' ? "le " + config.display.toLowerCase() : "l'arganier" },
        { from: /d'Arganier/g, to: config.id === 'majhoul' ? "du " + config.display : "d'Arganier" },
        { from: /d'arganier/g, to: config.id === 'majhoul' ? "du " + config.display.toLowerCase() : "d'arganier" },
        { from: /d'Argan/g, to: config.id === 'majhoul' ? "de " + config.name : "d'Argan" },
        { from: /d'argan/g, to: config.id === 'majhoul' ? "de " + config.name.toLowerCase() : "d'argan" },
        { from: /ARGANERAIE/g, to: config.terroir.toUpperCase() },
        { from: /Arganeraie/g, to: config.terroir },
        { from: /arganeraie/g, to: config.terroir.toLowerCase() },
        { from: /ARGANIER/g, to: config.display.toUpperCase() },
        { from: /Arganier/g, to: config.display },
        { from: /arganier/g, to: config.display.toLowerCase() },
        { from: /ARGAN/g, to: config.name.toUpperCase() },
        { from: /Argan/g, to: config.name },
        { from: /argan/g, to: config.name.toLowerCase() },
        { from: /Solanum tuberosum L. cv. 'Désirée'/g, to: config.botanical }
    ];

    elementsToUpdate.forEach(el => {
        if (el.id === 'crop-select' || el.closest('.crop-selector-container')) return;

        if (el.children.length === 0 || 
            el.classList.contains('nav-text') || 
            el.classList.contains('ref-value') ||
            el.classList.contains('gaia-text') ||
            el.classList.contains('eye-text') ||
            el.classList.contains('metric-label')) {
            
            let html = el.innerHTML;
            let originalHtml = html;
            
            replacements.forEach(rep => {
                html = html.replace(rep.from, rep.to);
            });
            
            if (html !== originalHtml) {
                el.innerHTML = html;
            }
        }
        
        if (el.hasAttribute('data-tooltip')) {
            let tooltip = el.getAttribute('data-tooltip');
            let originalTooltip = tooltip;
            replacements.forEach(rep => {
                tooltip = tooltip.replace(rep.from, rep.to);
            });
            if (tooltip !== originalTooltip) {
                el.setAttribute('data-tooltip', tooltip);
            }
        }
    });

    // Icons in nav
    document.querySelectorAll('.nav-item').forEach(item => {
        const icon = item.querySelector('.nav-icon');
        const text = item.querySelector('.nav-text');
        if (text && (text.innerText.includes(config.display) || text.innerText.includes('Argan'))) {
            if (icon) icon.innerText = config.icon;
        }
    });
    
    if (document.title.includes('Argan')) {
        document.title = document.title.replace(/Arganier/g, config.display).replace(/Argan/g, config.name);
    }

    const hero = document.querySelector('.vineyard-hero');
    if (hero) {
        let style = document.getElementById('crop-style-override');
        if (!style) {
            style = document.createElement('style');
            style.id = 'crop-style-override';
            document.head.appendChild(style);
        }
        style.innerHTML = `.vineyard-hero::before { content: '${config.icon}' !important; }`;
    }

    // Swap Arganier images for Palmier when Medjool / Majhol is selected
    if (config.id === 'medjool') {
        document.querySelectorAll('img[src*="arganier"]').forEach(img => {
            img.src = img.src.replace('arganier', 'palmier');
            if (!img.alt || img.alt.toLowerCase().includes('argan')) {
                img.alt = 'Palmier dattier';
            }
        });
    }

    // Update main hero title on plan page to follow the selected crop/terroir
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const img = heroTitle.querySelector('img');
        const iconHtml = img ? img.outerHTML + ' ' : '';
        heroTitle.innerHTML = `${iconHtml}PLAN PARFAIT - ${config.terroir.toUpperCase()}`;
    }

    // Switcher Buttons
    document.querySelectorAll('.switcher-btn, [id^="quick-access-"]').forEach(btn => {
        const btnText = btn.innerText.toLowerCase();
        const isArganBtn = btnText.includes('argan');
        const isMedjoolBtn = btnText.includes('medjool') || btnText.includes('majhol');
        
        if ((config.id === 'argan' && isArganBtn) || (config.id === 'medjool' && isMedjoolBtn)) {
            btn.classList.add('active');
            if (btn.id && btn.id.includes('quick-access')) {
                btn.style.border = '2px solid gold';
                btn.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.4)';
            }
        } else {
            btn.classList.remove('active');
            if (btn.id && btn.id.includes('quick-access')) {
                btn.style.border = 'none';
                btn.style.boxShadow = 'none';
            }
        }
    });

    // SCORE & REFERENCE (Dynamic Dashboard)
    const scoreText = document.getElementById('matching-score-text');
    const scoreCircle = document.getElementById('circle-score');
    if (scoreText && config.score) scoreText.innerText = config.score + "%";
    if (scoreCircle && config.score) {
        const circ = 439.82;
        const offset = circ - (config.score / 100 * circ);
        setTimeout(() => { scoreCircle.style.strokeDashoffset = offset; }, 300);
    }

    const scoreDesc = document.getElementById('matching-score-desc');
    if (scoreDesc) scoreDesc.innerText = `Conformité globale du terrain avec le terroir de ${config.terroir}`;

    const refId = document.getElementById('ref-id');
    const refClient = document.getElementById('ref-client');
    const refCulture = document.getElementById('ref-culture');
    const refIA = document.getElementById('ref-ia');
    const refModule = document.getElementById('ref-module');

    if (refId && config.reference) refId.innerText = config.reference.ref;
    if (refClient && config.reference) refClient.innerText = config.reference.client;
    if (refCulture) refCulture.innerText = config.botanical;
    if (refIA && config.reference) refIA.innerText = config.reference.ia_model;
    if (refModule && config.reference) refModule.innerText = config.reference.module;

    const refBadge = document.getElementById('ref-system-badge');
    if (refBadge && config.reference) {
        refBadge.innerText = config.reference.ref.split('/')[1] || config.reference.ref;
    }

    const planCard = document.getElementById('crop-plan-card');
    const planTitle = document.getElementById('crop-plan-title');
    const planDesc = document.getElementById('crop-plan-desc');
    if (planCard) planCard.style.display = 'block';
    if (planTitle) planTitle.innerText = `${config.icon} PLAN PARFAIT : ${config.terroir.toUpperCase()}`;
    if (planDesc) {
        const mode = (new URLSearchParams(window.location.search).get('mode') === 'advanced') ? 140 : 93;
        planDesc.innerText = `Une analyse agro-spatiale complète (${mode} jours) est disponible pour cette parcelle.`;
    }
}

window.addEventListener('load', updatePageTerminology);
