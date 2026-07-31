/**
 * BioPulse 3D - UI Controller & Dual Engine Management
 * Handles Sketchfab Pro Anatomy integration, Three.js Holographic Twin switcher,
 * interactive medical dossier drawer, filtering HUD, audio feedback, and timeline rendering
 */

let audioCtx = null;
let soundEnabled = true;
let currentEngine = 'three'; // Default to Three.js Hologram model
let sketchfabApi = null;
let gltfEngineInitialized = false;

window.addEventListener('DOMContentLoaded', () => {
    initUIControls();
    initAudioSystem();
    initSketchfabViewer();

    // Auto-open Heart dossier after a brief delay to demonstrate UI capability immediately!
    setTimeout(() => {
        if (window.openMedicalDossier) {
            window.openMedicalDossier('heart');
            if (currentEngine === 'three' && typeof focusCameraOnPart === 'function') {
                focusCameraOnPart('heart');
            }
        }
    }, 1000);
});

/**
 * Initialize Sketchfab Viewer API
 */
function initSketchfabViewer() {
    const iframe = document.getElementById('api-frame');
    if (!iframe || typeof Sketchfab === 'undefined') return;

    const client = new Sketchfab(iframe);

    client.init('9b0b079953b840bc9a13f524b60041e4', {
        success: function(api) {
            sketchfabApi = api;
            api.start();
            api.addEventListener('viewerready', function() {
                console.log('Sketchfab Animated Anatomy Model is ready!');
                
                // Add click listener to Sketchfab 3D meshes
                api.addEventListener('click', function(info) {
                    if (info && info.instanceID) {
                        playUIBeep('click');
                        // If user clicks anything on the full anatomy model without a specific diagnostic target,
                        // we can either open the general torso/chest view or let them use the diagnostic cards
                        console.log('Sketchfab node clicked:', info);
                    }
                }, { pick: 'fast' });
            });
        },
        error: function(err) {
            console.error('Sketchfab API Error:', err);
        },
        autostart: 1,
        ui_controls: 1,
        ui_infos: 0,
        ui_inspector: 1,
        ui_stop: 0,
        ui_watermark: 1,
        camera: 0
    });
}

/**
 * Initialize all DOM event listeners & Engine Switcher
 */
function initUIControls() {
    // 0. 3D Engine Switcher (Sketchfab / Three.js / GLTF)
    const btnSketchfab   = document.getElementById('btn-engine-sketchfab');
    const btnThree       = document.getElementById('btn-engine-three');
    const btnGLTF        = document.getElementById('btn-engine-gltf');
    const containerSketchfab = document.getElementById('sketchfab-container');
    const containerThree     = document.getElementById('canvas-container');
    const containerGLTF      = document.getElementById('gltf-container');
    const panelSketchfabInfo = document.getElementById('panel-sketchfab-info');
    const panelHologramFilters = document.getElementById('panel-hologram-filters');
    const panelGLTFInfo      = document.getElementById('panel-gltf-info');

    if (btnSketchfab && btnThree) {
        btnSketchfab.addEventListener('click', () => {
            if (currentEngine === 'sketchfab') return;
            currentEngine = 'sketchfab';
            [btnSketchfab, btnThree, btnGLTF].forEach(b => b && b.classList.remove('active'));
            btnSketchfab.classList.add('active');

            containerSketchfab.classList.add('active'); containerSketchfab.classList.remove('hidden');
            containerThree.classList.add('hidden');     containerThree.classList.remove('active');
            containerGLTF && containerGLTF.classList.add('hidden'); containerGLTF && containerGLTF.classList.remove('active');

            panelSketchfabInfo && panelSketchfabInfo.classList.add('active');
            panelHologramFilters && panelHologramFilters.classList.remove('active');
            panelGLTFInfo && panelGLTFInfo.classList.remove('active');

            if (typeof stopGLTFEngine === 'function') stopGLTFEngine();
            playUIBeep('switch');
        });

        btnThree.addEventListener('click', () => {
            if (currentEngine === 'three') return;
            currentEngine = 'three';
            [btnSketchfab, btnThree, btnGLTF].forEach(b => b && b.classList.remove('active'));
            btnThree.classList.add('active');

            containerThree.classList.add('active');     containerThree.classList.remove('hidden');
            containerSketchfab.classList.add('hidden'); containerSketchfab.classList.remove('active');
            containerGLTF && containerGLTF.classList.add('hidden'); containerGLTF && containerGLTF.classList.remove('active');

            panelHologramFilters && panelHologramFilters.classList.add('active');
            panelSketchfabInfo && panelSketchfabInfo.classList.remove('active');
            panelGLTFInfo && panelGLTFInfo.classList.remove('active');

            if (typeof stopGLTFEngine === 'function') stopGLTFEngine();
            if (typeof onWindowResize === 'function') onWindowResize();
            playUIBeep('switch');
        });
    }

    // GLTF Engine Button
    if (btnGLTF) {
        btnGLTF.addEventListener('click', () => {
            if (currentEngine === 'gltf') return;
            currentEngine = 'gltf';
            [btnSketchfab, btnThree, btnGLTF].forEach(b => b && b.classList.remove('active'));
            btnGLTF.classList.add('active');

            containerGLTF.classList.add('active');      containerGLTF.classList.remove('hidden');
            containerThree.classList.add('hidden');     containerThree.classList.remove('active');
            containerSketchfab.classList.add('hidden'); containerSketchfab.classList.remove('active');

            panelGLTFInfo && panelGLTFInfo.classList.add('active');
            panelHologramFilters && panelHologramFilters.classList.remove('active');
            panelSketchfabInfo && panelSketchfabInfo.classList.remove('active');

            // Init GLTF engine on first activation
            if (!gltfEngineInitialized) {
                gltfEngineInitialized = true;
                if (typeof initGLTFEngine === 'function') initGLTFEngine();
                buildGLTFLegend();
            } else {
                if (typeof startGLTFEngine === 'function') startGLTFEngine();
                if (typeof onGLTFResize === 'function') onGLTFResize();
            }
            playUIBeep('switch');
        });
    }

    // 1. Organ Filter Toggle Radios
    const filterRadios = document.querySelectorAll('input[name="organ-filter"]');
    filterRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const mode = e.target.value;
            document.querySelectorAll('input[name="organ-filter"]').forEach(r => r.closest('.toggle-card').classList.remove('active'));
            e.target.closest('.toggle-card').classList.add('active');

            if (typeof applyOrganVisibilityFilter === 'function') {
                applyOrganVisibilityFilter(mode);
            }
            playUIBeep('switch');
        });
    });

    // 1b. Label & Arrow Visibility Toggle
    const labelsCheckbox = document.getElementById('toggle-labels-checkbox');
    const labelsCard = document.getElementById('toggle-labels-card');
    if (labelsCheckbox && labelsCard) {
        labelsCard.addEventListener('click', (e) => {
            if (e.target !== labelsCheckbox) {
                labelsCheckbox.checked = !labelsCheckbox.checked;
            }
            if (labelsCheckbox.checked) {
                labelsCard.classList.add('active');
            } else {
                labelsCard.classList.remove('active');
            }
            if (typeof toggleAllAnnotations === 'function') {
                toggleAllAnnotations(labelsCheckbox.checked);
            }
            playUIBeep('switch');
        });
    }

    // 2. Torso Opacity Slider
    const opacitySlider = document.getElementById('torso-opacity-slider');
    const opacityVal = document.getElementById('opacity-val');
    if (opacitySlider) {
        opacitySlider.addEventListener('input', (e) => {
            const val = e.target.value;
            opacityVal.textContent = `${val}%`;
            if (typeof setTorsoOpacity === 'function') {
                setTorsoOpacity(val);
            }
        });
    }

    // 3. Reset View Button
    const btnReset = document.getElementById('btn-reset-cam');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (currentEngine === 'three' && typeof resetCameraView === 'function') {
                resetCameraView();
            } else if (currentEngine === 'sketchfab' && sketchfabApi) {
                sketchfabApi.recenterCamera();
            } else if (currentEngine === 'gltf' && typeof resetGLTFCamera === 'function') {
                resetGLTFCamera();
            }
            closeMedicalDossier();
            playUIBeep('click');
        });
    }

    // 4. Sound Toggle Button
    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
        btnSound.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            const icon = btnSound.querySelector('i');
            if (soundEnabled) {
                icon.className = 'ri-volume-up-line text-cyan';
                btnSound.title = 'Sound Effects Enabled';
                playUIBeep('click');
            } else {
                icon.className = 'ri-volume-mute-line text-muted';
                btnSound.title = 'Sound Effects Muted';
            }
        });
    }

    // 5. Active Problem Sidebar Cards
    const problemItems = document.querySelectorAll('.problem-item');
    problemItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            if (target) {
                if (currentEngine === 'three' && typeof focusCameraOnPart === 'function') {
                    focusCameraOnPart(target);
                }
                openMedicalDossier(target);
                playUIBeep('alert');
            }
        });
    });

    // 6. Bottom Quick Focus Buttons
    const focusButtons = document.querySelectorAll('.focus-btn');
    focusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-focus');
            if (target) {
                if (currentEngine === 'three' && typeof focusCameraOnPart === 'function') {
                    focusCameraOnPart(target);
                }
                openMedicalDossier(target);
                playUIBeep('click');
            }
        });
    });

    // 7. Close Drawer Button
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    if (btnCloseDrawer) {
        btnCloseDrawer.addEventListener('click', () => {
            closeMedicalDossier();
            if (currentEngine === 'three' && typeof resetCameraView === 'function') {
                resetCameraView();
            }
            playUIBeep('close');
        });
    }
}

/**
 * Open Medical Dossier Panel (Right Sidebar)
 * Populates data dynamically from MEDICAL_DATA
 */
function openMedicalDossier(partId) {
    const data = MEDICAL_DATA[partId];
    if (!data) return;

    const drawer = document.getElementById('medical-drawer');
    const categoryEl = document.getElementById('drawer-category');
    const titleEl = document.getElementById('drawer-title');
    const bannerEl = document.getElementById('drawer-status-banner');
    const statusTextEl = document.getElementById('drawer-status-text');
    const vitalsGridEl = document.getElementById('drawer-vitals-grid');
    const summaryEl = document.getElementById('drawer-summary');
    const medsSectionEl = document.getElementById('section-medications');
    const medsListEl = document.getElementById('drawer-meds-list');
    const timelineEl = document.getElementById('drawer-timeline');
    const aiNotesEl = document.getElementById('ai-notes-text');

    // 1. Title & Category
    categoryEl.textContent = data.category || 'Anatomy Element';
    titleEl.textContent = data.name;

    // 2. Status Banner Color Coding
    statusTextEl.textContent = `Status: ${data.status}`;
    const color = data.statusColor || '#00f5d4';
    bannerEl.style.color = color;
    bannerEl.style.borderColor = color;
    bannerEl.style.background = hexToRgbA(color, 0.12);

    // 3. Populate Vitals Grid
    vitalsGridEl.innerHTML = '';
    if (data.vitals && data.vitals.length > 0) {
        data.vitals.forEach(v => {
            let badgeBg = 'rgba(255, 255, 255, 0.08)';
            let badgeColor = '#94a3b8';
            if (v.status.includes('Normal') || v.status.includes('Optimal') || v.status.includes('Intact') || v.status.includes('Stable') || v.status.includes('Controlled')) {
                badgeBg = 'rgba(16, 185, 129, 0.15)';
                badgeColor = '#10b981';
            } else if (v.status.includes('Elevated') || v.status.includes('HTN') || v.status.includes('Irregular') || v.status.includes('Obstruction') || v.status.includes('Needs')) {
                badgeBg = 'rgba(255, 0, 85, 0.15)';
                badgeColor = '#ff0055';
            } else {
                badgeBg = 'rgba(255, 183, 3, 0.15)';
                badgeColor = '#ffb703';
            }

            const card = document.createElement('div');
            card.className = 'vital-card';
            card.innerHTML = `
                <span class="vital-label">${v.label}</span>
                <div class="vital-value">${v.value}</div>
                <span class="vital-status" style="background: ${badgeBg}; color: ${badgeColor};">${v.status}</span>
            `;
            vitalsGridEl.appendChild(card);
        });
    }

    // 4. Clinical Summary
    summaryEl.textContent = data.summary || 'No clinical records available for this anatomy element.';

    // 5. Medications Section
    if (data.medications && data.medications.length > 0) {
        medsSectionEl.style.display = 'block';
        medsListEl.innerHTML = '';
        data.medications.forEach(med => {
            const medEl = document.createElement('div');
            medEl.className = 'med-item';
            medEl.innerHTML = `
                <div class="med-item-info">
                    <strong>${med.name}</strong>
                    <span><i class="ri-dose-line"></i> ${med.dose}</span>
                </div>
                <div class="med-purpose">${med.purpose}</div>
            `;
            medsListEl.appendChild(medEl);
        });
    } else {
        medsSectionEl.style.display = 'none';
    }

    // 6. Medical History Timeline
    timelineEl.innerHTML = '';
    if (data.timeline && data.timeline.length > 0) {
        data.timeline.forEach((item, index) => {
            let badgeStyle = 'background: rgba(0, 245, 212, 0.15); color: #00f5d4; border-color: rgba(0, 245, 212, 0.3);';
            if (item.badge.includes('Critical') || item.badge.includes('Emergency') || item.badge.includes('Injury')) {
                badgeStyle = 'background: rgba(255, 0, 85, 0.15); color: #ff0055; border-color: rgba(255, 0, 85, 0.3);';
            } else if (item.badge.includes('Surgery') || item.badge.includes('Intervention')) {
                badgeStyle = 'background: rgba(255, 183, 3, 0.15); color: #ffb703; border-color: rgba(255, 183, 3, 0.3);';
            }

            const timeItem = document.createElement('div');
            timeItem.className = 'timeline-item';
            timeItem.innerHTML = `
                <div class="timeline-dot" style="border-color: ${color}; box-shadow: 0 0 8px ${color};"></div>
                <div class="timeline-date-badge">
                    <span class="timeline-date">${item.date}</span>
                    <span class="badge" style="${badgeStyle}">${item.badge}</span>
                </div>
                <h4 class="timeline-title">${item.title}</h4>
                <div class="timeline-doctor"><i class="ri-user-star-line"></i> ${item.doctor}</div>
                <p class="timeline-desc">${item.description}</p>
            `;
            timelineEl.appendChild(timeItem);
        });
    } else {
        timelineEl.innerHTML = `<p style="color: var(--text-muted); font-size: 0.8rem;">No historical events recorded.</p>`;
    }

    // 7. AI Clinical Notes
    aiNotesEl.textContent = data.aiNotes || 'AI Analysis: Structural parameters within expected physiological limits.';

    // 8. Reveal Drawer
    drawer.classList.remove('hidden');

    if (data.hasProblem) {
        playUIBeep('alert');
    } else {
        playUIBeep('open');
    }
}

/**
 * Close Dossier Drawer
 */
function closeMedicalDossier() {
    const drawer = document.getElementById('medical-drawer');
    if (drawer && !drawer.classList.contains('hidden')) {
        drawer.classList.add('hidden');
    }
}

/**
 * Utility: Convert Hex Color to RGBA with alpha
 */
function hexToRgbA(hex, alpha) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    return 'rgba(0, 245, 212, ' + alpha + ')';
}

/**
 * Web Audio API Futuristic UI Synthesizer
 */
function initAudioSystem() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    } catch (e) {
        console.warn('Web Audio API not supported in this browser');
    }
}

function playUIBeep(type) {
    if (!soundEnabled || !audioCtx) return;

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click' || type === 'switch') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'open') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
    } else if (type === 'close') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
    } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.setValueAtTime(440, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
    }
}

// Make functions globally accessible for inline handlers or 3D engine calls
window.openMedicalDossier  = openMedicalDossier;
window.closeMedicalDossier = closeMedicalDossier;
window.focusCameraOnPart   = focusCameraOnPart;

/**
 * Build GLTF Tissue Legend in left sidebar from MATERIAL_CONFIG
 */
function buildGLTFLegend() {
    const legend = document.getElementById('gltf-legend');
    if (!legend || typeof MATERIAL_CONFIG === 'undefined') return;
    legend.innerHTML = '';

    Object.entries(MATERIAL_CONFIG).forEach(([name, cfg]) => {
        const hexColor = '#' + cfg.color.toString(16).padStart(6, '0');
        const item = document.createElement('div');
        item.className = 'gltf-legend-item';
        item.title = cfg.label;
        item.innerHTML = `
            <div class="gltf-legend-dot" style="background:${hexColor}; box-shadow: 0 0 6px ${hexColor}60;"></div>
            <div class="gltf-legend-text">
                <span class="gltf-legend-name">${cfg.label}</span>
                <span class="gltf-legend-sub">${cfg.subLabel}</span>
            </div>
        `;
        item.addEventListener('click', () => {
            if (typeof focusGLTFOnGroup === 'function') focusGLTFOnGroup(name);
            if (window.openMedicalDossier) openMedicalDossier(cfg.dataKey);
            playUIBeep('click');
        });
        legend.appendChild(item);
    });

    // Wire up GLTF label toggle
    const labelsCheckbox = document.getElementById('toggle-gltf-labels-checkbox');
    const labelsCard     = document.getElementById('toggle-gltf-labels-card');
    if (labelsCheckbox && labelsCard) {
        labelsCard.addEventListener('click', (e) => {
            if (e.target !== labelsCheckbox) labelsCheckbox.checked = !labelsCheckbox.checked;
            labelsCard.classList.toggle('active', labelsCheckbox.checked);
            if (typeof toggleGLTFLabels === 'function') toggleGLTFLabels(labelsCheckbox.checked);
            playUIBeep('switch');
        });
    }
}
