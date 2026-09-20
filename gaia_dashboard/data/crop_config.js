const CROP_CONFIG = {
    argan: {
        name: "Argan",
        display: "Arganier",
        terroir: "Fruits de l'Arganier",
        production: "Fruits de l'Arganier",
        botanical: "Argania spinosa",
        icon: "🌳",
        id: "argan",
        score: 67,
        reference: {
            ref: "TN/ARG-2024/789654-V.A",
            client: "Coopérative Souss-Massa",
            ia_model: "TERRANOVA-DeepArgan v1.2",
            module: "HARMONIA-Argan v4.1"
        }
    }
};

const TERMINOLOGY_MAP = {
    argan: {
        "Argan": "Argan",
        "Arganier": "Arganier",
        "Arganeraie": "Arganeraie",
        "Production d'Argan": "Production d'Argan"
    }
};

function getSelectedCrop() {
    const urlParams = new URLSearchParams(window.location.search);
    let crop = urlParams.get('crop');
    
    if (crop) {
        // Standardize IDs — Arganier is the only available culture
        if (crop === 'arganier') crop = 'argan';
        if (crop !== 'argan') crop = 'argan';
        localStorage.setItem('selectedCrop', crop);
        return crop;
    }

    const stored = localStorage.getItem('selectedCrop');
    if (stored && stored !== 'argan' && stored !== 'arganier') {
        localStorage.setItem('selectedCrop', 'argan');
        return 'argan';
    }
    return stored === 'arganier' ? 'argan' : (stored || 'argan');
}

function setSelectedCrop(cropId) {
    localStorage.setItem('selectedCrop', 'argan');
}
