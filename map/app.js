const API_BASE_URL = 'http://127.0.0.1:5001';
const API_URL = `${API_BASE_URL}/api/analyze`;

let currentIndicator = 'NDVI';
let currentCoords = null;
const map = L.map('map', {
    zoomControl: false
}).setView([20, 0], 3);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri'
}).addTo(map);

L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png', {
    attribution: 'Map tiles by Stamen Design, CC BY 3.0 -- Map data &copy; OpenStreetMap',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
}).addTo(map);

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
    draw: {
        polygon: false,
        polyline: false,
        circle: false,
        marker: false,
        circlemarker: false,
        rectangle: {
            shapeOptions: {
                color: '#4ade80',
                weight: 2
            }
        }
    },
    edit: {
        featureGroup: drawnItems,
        remove: true
    }
});
map.addControl(drawControl);

// Convert extra controls to a native Leaflet control for perfect vertical alignment
const extraControls = document.querySelector('.map-extra-controls');
if (extraControls) {
    const CustomExtraControl = L.Control.extend({
        options: { position: 'topleft' },
        onAdd: function () {
            extraControls.style.position = 'relative';
            extraControls.style.setProperty('top', '0', 'important');
            extraControls.style.setProperty('left', '0', 'important');
            extraControls.style.marginTop = '10px';
            extraControls.style.pointerEvents = 'auto';
            L.DomEvent.disableClickPropagation(extraControls);
            L.DomEvent.disableScrollPropagation(extraControls);
            return extraControls;
        }
    });
    map.addControl(new CustomExtraControl());
}

let currentLayer = null;
let lastSelectionMethod = 'standard'; // Default to standard (rectangle)


const START_YEAR = 2021;
const startEpoch = new Date(START_YEAR, 0, 1); const today = new Date();

const totalMonths = (today.getFullYear() - START_YEAR) * 12 + today.getMonth();

const timeSlider = document.getElementById('time-slider');
if (timeSlider) {
    timeSlider.min = 0;
    timeSlider.max = totalMonths;
    timeSlider.value = totalMonths;
}

let selectedDate = new Date(today.getFullYear(), today.getMonth(), 1);

function updateDateFromSlider() {
    if (!timeSlider) return;

    const monthsSinceStart = parseInt(timeSlider.value);
    const date = new Date(startEpoch);
    date.setMonth(startEpoch.getMonth() + monthsSinceStart);
    selectedDate = date;

    const display = document.getElementById('date-display');
    if (display) {
        const lang = localStorage.getItem('terranova_lang') || 'fr';
        const locale = lang === 'ar' ? 'ar-MA' : 'fr-FR';
        display.textContent = date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    }

    if (currentCoords) {
        fetchAnalysis();
    }
}

if (timeSlider) {
    timeSlider.addEventListener('input', updateDateFromSlider);
}

const prevBtn = document.getElementById('prev-month');
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (timeSlider && timeSlider.value > 0) {
            timeSlider.value = parseInt(timeSlider.value) - 1;
            updateDateFromSlider();
        }
    });
}

const nextBtn = document.getElementById('next-month');
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (timeSlider && timeSlider.value < timeSlider.max) {
            timeSlider.value = parseInt(timeSlider.value) + 1;
            updateDateFromSlider();
        }
    });
}

updateDateFromSlider();


// --- UX Button Logic (Relocated) ---

// --- UX Button Logic (Relocated) ---

// My Location Custom
document.getElementById('my-location-custom').addEventListener('click', () => {
    updateStatus('map_status_locating');
    const statusMsg = document.getElementById('status-msg');
    if (statusMsg) statusMsg.className = 'status-text loading';
    
    // Forced destination: Université Euro Méditerranéenne de Fès
    const targetPos = [34.04501, -5.06529];
    map.flyTo(targetPos, 16);
    
    setTimeout(() => {
        updateStatus('map_status_found');
        if (statusMsg) statusMsg.className = 'status-text success';
    }, 1500);
});

// Camera Focus & Capturer l'Analyse (Merged)
document.getElementById('camera-focus').addEventListener('click', () => {
    // 1. Focus on the area if it exists
    if (currentCoords) {
        const bounds = L.latLngBounds([currentCoords.south, currentCoords.west], [currentCoords.north, currentCoords.east]);
        map.fitBounds(bounds, { padding: [50, 50] });
    }

    // 2. Export logic
    const statusMsg = document.getElementById('status-msg');
    if (statusMsg) updateStatus('analysis_gen_hd');

    // Capture the entire visual area (including the bottom line)
    html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
    }).then(canvas => {
        const ctx = canvas.getContext('2d');
        const now = new Date();
        const dateStr = now.toLocaleDateString('fr-FR');

        // Draw the black line extension if not captured perfectly
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

        // Write "GaiaEye" and "Date" on the black line (small, professional)
        ctx.fillStyle = "rgba(74, 222, 128, 0.8)"; // Subtle GAIA Green
        ctx.font = "10px Orbitron, sans-serif";
        ctx.fillText("GaiaEye Intelligence Support System", 20, canvas.height - 7);

        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = "10px Inter, sans-serif";
        ctx.fillText(`Export: ${dateStr}`, canvas.width - 120, canvas.height - 7);

        // Download
        const link = document.createElement('a');
        link.download = `gaia_eye_report_${now.getTime()}.png`;
        link.href = canvas.toDataURL();
        link.click();

        if (statusMsg) updateStatus('analysis_capture_done');
    });
});

// --- Custom Polygon Drawing Tool ---
let isCustomDrawing = false;
let customPoints = [];
let tempMarkers = [];
let tempPolygon = null;

document.getElementById('draw-zone-custom').addEventListener('click', function () {
    isCustomDrawing = !isCustomDrawing;
    const btn = this;
    const statusMsg = document.getElementById('status-msg');

    if (isCustomDrawing) {
        btn.classList.add('active'); // Style for active state
        btn.style.color = "#4ade80";
        btn.style.backgroundColor = "rgba(74, 222, 128, 0.1)";
        if (statusMsg) updateStatus('analysis_draw_mode');
        map.getContainer().style.cursor = 'crosshair';
        customPoints = [];
        clearTempDrawing();
    } else {
        btn.classList.remove('active');
        btn.style.color = "";
        btn.style.backgroundColor = "";
        map.getContainer().style.cursor = '';
        if (customPoints.length > 2) {
            finalizeCustomZone();
        } else {
            if (statusMsg) updateStatus('analysis_draw_cancel');
            clearTempDrawing();
        }
    }
});

function clearTempDrawing() {
    tempMarkers.forEach(m => map.removeLayer(m));
    tempMarkers = [];
    if (tempPolygon) {
        map.removeLayer(tempPolygon);
        tempPolygon = null;
    }
}

map.on('click', function (e) {
    if (!isCustomDrawing) return;

    const latlng = e.latlng;
    customPoints.push(latlng);

    // Add marker
    const marker = L.circleMarker(latlng, {
        radius: 4,
        color: '#4ade80',
        fillColor: '#000',
        fillOpacity: 1,
        weight: 2
    }).addTo(map);
    tempMarkers.push(marker);

    // Update dynamic polygon
    if (customPoints.length > 1) {
        if (tempPolygon) map.removeLayer(tempPolygon);
        tempPolygon = L.polygon(customPoints, {
            color: '#4ade80',
            weight: 2,
            fillColor: '#4ade80',
            fillOpacity: 0.2,
            dashArray: '5, 10'
        }).addTo(map);
    }
});

function finalizeCustomZone() {
    drawnItems.clearLayers();
    if (currentLayer) map.removeLayer(currentLayer);

    const finalPolygon = L.polygon(customPoints, {
        color: '#4ade80',
        weight: 2,
        fillColor: '#4ade80',
        fillOpacity: 0.3
    }).addTo(drawnItems);

    const bounds = finalPolygon.getBounds();
    currentCoords = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
    };

    clearTempDrawing();

    // Calculate area and show overlay
    lastSelectionMethod = 'advanced'; // Freehand selection triggers advanced mode
    const areaInSquareMeters = calculateArea(bounds);
    showAnalysisOverlay(areaInSquareMeters);
}

map.on('locationfound', (e) => {
    if (statusMsg) {
        updateStatus('map_status_found');
        statusMsg.className = 'status-text success';
    }
});

map.on('locationerror', (e) => {
    if (statusMsg) {
        updateStatus('analysis_error_loc');
        statusMsg.className = 'status-text error';
    }
    alert(t('analysis_error_loc_detail'));
});

// Detailed Guide Overlay Logic
const guideOverlay = document.getElementById('guide-overlay');
const openGuideBtn = document.getElementById('open-guide');
const closeGuideBtn = document.querySelector('.close-guide');

if (openGuideBtn) {
    openGuideBtn.addEventListener('click', () => {
        guideOverlay.classList.remove('hidden');
    });
}

if (closeGuideBtn) {
    closeGuideBtn.addEventListener('click', () => {
        guideOverlay.classList.add('hidden');
    });
}

// Close on outside click
guideOverlay.addEventListener('click', (e) => {
    if (e.target === guideOverlay) {
        guideOverlay.classList.add('hidden');
    }
});

// --- Drawing Event ---
map.on(L.Draw.Event.CREATED, function (e) {
    const layer = e.layer;
    drawnItems.clearLayers();
    if (currentLayer) map.removeLayer(currentLayer);
    drawnItems.addLayer(layer);

    const bounds = layer.getBounds();
    currentCoords = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
    };

    // Calculate area in square meters
    lastSelectionMethod = 'standard'; // Rectangle selection triggers standard mode
    const areaInSquareMeters = calculateArea(bounds);

    // Show analysis overlay with area
    showAnalysisOverlay(areaInSquareMeters);
});

async function fetchAnalysis() {
    if (!currentCoords) return;

    const statusMsg = document.getElementById('status-msg');

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const formatDate = (d) => {
        const offset = d.getTimezoneOffset();
        const adjustedDate = new Date(d.getTime() - (offset * 60 * 1000));
        return adjustedDate.toISOString().split('T')[0];
    };

    const payload = {
        ...currentCoords,
        date_start: formatDate(firstDay),
        date_end: formatDate(lastDay),
        indicator: currentIndicator
    };

    if (statusMsg) {
        statusMsg.className = 'status-text loading';
        updateStatus('map_status_analyzing');
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Erreur d\'analyse');

        if (data.success && data.tile_url) {
            updateLayer(data.tile_url);
            if (statusMsg) {
                statusMsg.className = 'status-text success';
                updateStatus('analysis_ready');
            }
        } else {
            throw new Error('Réponse invalide');
        }

    } catch (error) {
        console.error('Error:', error);
        if (statusMsg) {
            statusMsg.className = 'status-text loading';
            updateStatus('analysis_error');
        }
    }
}

function updateLayer(tileUrlFormat) {
    if (currentLayer) {
        map.removeLayer(currentLayer);
    }

    currentLayer = L.tileLayer(tileUrlFormat, {
        attribution: `Gaia Eye Intelligence`,
        opacity: 0.8
    }).addTo(map);
}

// Calculate area in square meters using Haversine formula
function calculateArea(bounds) {
    const north = bounds.getNorth();
    const south = bounds.getSouth();
    const east = bounds.getEast();
    const west = bounds.getWest();

    // Calculate width and height in meters
    const R = 6371000; // Earth's radius in meters

    // Width (longitude difference)
    const latRad = (north + south) / 2 * Math.PI / 180;
    const dLon = (east - west) * Math.PI / 180;
    const width = R * dLon * Math.cos(latRad);

    // Height (latitude difference)
    const dLat = (north - south) * Math.PI / 180;
    const height = R * dLat;

    // Area in square meters
    const area = Math.abs(width * height);

    return area;
}

// Show analysis overlay with area information
function showAnalysisOverlay(areaInSquareMeters) {
    const overlay = document.getElementById('analysis-overlay');
    const areaDisplay = document.getElementById('analysis-area-display');

    if (overlay && areaDisplay) {
        // Format area with appropriate units
        let displayText;
        if (areaInSquareMeters >= 1000000) {
            displayText = (areaInSquareMeters / 1000000).toFixed(2) + ' km²';
        } else if (areaInSquareMeters >= 10000) {
            displayText = (areaInSquareMeters / 10000).toFixed(2) + ' ha';
        } else {
            displayText = areaInSquareMeters.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' m²';
        }

        areaDisplay.textContent = displayText;
        overlay.classList.remove('hidden');
    }
}

// Handle start analysis button click - Show loading animation then redirect
const startAnalysisBtn = document.getElementById('start-analysis-btn');
if (startAnalysisBtn) {
    startAnalysisBtn.addEventListener('click', () => {
        const selectedItem = document.querySelector('.crop-item.selected');
        if (!selectedItem) return;

        const selectedCrop = selectedItem.getAttribute('data-crop');
        const statusMsg = document.getElementById('status-msg');

        // Hide the area overlay
        const analysisOverlay = document.getElementById('analysis-overlay');
        if (analysisOverlay) analysisOverlay.classList.add('hidden');

        // Show loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');

        // Get area from overlay
        let areaHa = 2;
        const areaEl = document.getElementById('analysis-area-display');
        if (areaEl) {
            const txt = areaEl.textContent;
            const match = txt.match(/[\d.,]+/);
            if (match) {
                const numStr = match[0].replace(',', '.');
                const num = parseFloat(numStr);
                if (!isNaN(num)) {
                    if (txt.includes('km²')) areaHa = num * 100;
                    else if (txt.includes('ha')) areaHa = num;
                    else if (txt.includes('m²')) areaHa = num / 10000;
                }
            }
        }

        const mode = lastSelectionMethod;
        const targetFile = 'index.html';

        // Pass selected date to dashboard so all plans match timeline
        let dateParam = '';
        if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
            dateParam = selectedDate.toISOString().split('T')[0];
        }

        // Wait 2 seconds as requested
        setTimeout(() => {
            const dateQuery = dateParam ? `&date=${encodeURIComponent(dateParam)}` : '';
            window.location.href = `../gaia_dashboard/${targetFile}?crop=${selectedCrop}&area=${areaHa}&mode=${mode}${dateQuery}`;
        }, 2000);
    });
}

// Handle crop selection
const cropItems = document.querySelectorAll('.crop-item');
cropItems.forEach(item => {
    item.addEventListener('click', () => {
        // Clear previous selection
        cropItems.forEach(i => i.classList.remove('selected'));
        // Add current selection
        item.classList.add('selected');

        // Show "Commencer l'Analyse" button
        const startBtn = document.getElementById('start-analysis-btn');
        if (startBtn) {
            startBtn.classList.remove('hidden');
            // Auto-scroll to the button
            startBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    });
});

let lastStatusKey = 'map_status_ready';
let lastStatusExtra = '';

function updateStatus(key, extra = "") {
    lastStatusKey = key;
    lastStatusExtra = extra;
    const statusMsg = document.getElementById('status-msg');
    if (!statusMsg) return;
    
    const lang = localStorage.getItem('terranova_lang') || 'fr';
    let text = (langData[lang] && langData[lang][key]) ? langData[lang][key] : key;
    if (extra) text += " " + extra;
    
    statusMsg.textContent = text;
}

// Global lang system listener
window.addEventListener('terranovaLanguageChanged', (e) => {
    updateStatus(lastStatusKey, lastStatusExtra);
});

document.addEventListener('DOMContentLoaded', () => {
    updateStatus('map_status_ready');
});

