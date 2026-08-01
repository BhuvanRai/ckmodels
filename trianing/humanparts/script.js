/**
 * Human Anatomy Explorer - Dual Mode Viewer
 * 
 * Mode 1: Step-by-step cumulative accumulation (13 detailed stages)
 * Mode 2: 4 Key Frames (Isolated views where previous frame is cleared):
 *   - Frame 1: Bone Structure (Skeleton only)
 *   - Frame 2: Internal Organs (Organs only)
 *   - Frame 3: Muscular System (Muscles only)
 *   - Frame 4: Full Body (Skin overlay only)
 */

const DETAILED_STAGES = [
    {
        stage: 1,
        id: 'skeleton',
        name: 'Skeleton Structure',
        file: 'human_body_parts/human_skeleton.png',
        type: 'full-body',
        zIndex: 1,
        color: '#38bdf8',
        emoji: '🦴',
        description: 'Group 1: Completely isolated full skeleton view.'
    },
    {
        stage: 2,
        id: 'circulatory',
        name: 'Circulatory System',
        file: 'human_body_parts/human_circulatory_system.png',
        type: 'full-body',
        zIndex: 2,
        color: '#ef4444',
        emoji: '🩸',
        description: 'Group 2: Completely isolated circulatory system view.'
    },
    {
        stage: 3,
        id: 'urinary',
        name: 'Urinary System',
        file: 'human_body_parts/human_urinary_system.png',
        type: 'organ',
        zIndex: 3,
        color: '#f97316',
        emoji: '🫘',
        position: { top: '38%', left: '50%', width: '28%', transform: 'translateX(-50%)' },
        description: 'Group 3 (Internal Organs): Start of organ group accumulation (Stage 3).'
    },
    {
        stage: 4,
        id: 'digestive',
        name: 'Digestive System',
        file: 'human_body_parts/human_digestive_system.png',
        type: 'organ',
        zIndex: 4,
        color: '#f59e0b',
        emoji: '🫄',
        position: { top: '27%', left: '50%', width: '30%', transform: 'translateX(-50%)' },
        description: 'Group 3 (Internal Organs): Accumulating organ group members (Stage 3-4).'
    },
    {
        stage: 5,
        id: 'gallbladder',
        name: 'Gallbladder',
        file: 'human_body_parts/human_Gallbladder.png',
        type: 'organ',
        zIndex: 5,
        color: '#84cc16',
        emoji: '🟢',
        position: { top: '34%', left: '42%', width: '10%', transform: 'translateX(-50%)' },
        description: 'Group 3 (Internal Organs): Accumulating organ group members (Stage 3-5).'
    },
    {
        stage: 6,
        id: 'liver',
        name: 'Liver',
        file: 'human_body_parts/human_liver.png',
        type: 'organ',
        zIndex: 6,
        color: '#dc2626',
        emoji: '🫁',
        position: { top: '30%', left: '49%', width: '20%', transform: 'translateX(-50%)' },
        description: 'Group 3 (Internal Organs): Accumulating organ group members (Stage 3-6).'
    },
    {
        stage: 7,
        id: 'diaphragm',
        name: 'Diaphragm',
        file: 'human_body_parts/human_diafragma.png',
        type: 'organ',
        zIndex: 7,
        color: '#a855f7',
        emoji: '🫧',
        position: { top: '30%', left: '50%', width: '28%', transform: 'translateX(-50%)' },
        description: 'Group 3 (Internal Organs): Accumulating organ group members (Stage 3-7).'
    },
    {
        stage: 8,
        id: 'heart',
        name: 'Heart',
        file: 'human_body_parts/human_heart.png',
        type: 'organ',
        zIndex: 8,
        color: '#e11d48',
        emoji: '❤️',
        position: { top: '22%', left: '51%', width: '14%', transform: 'translateX(-50%)' },
        description: 'Group 3 (Internal Organs): Accumulating organ group members (Stage 3-8).'
    },
    {
        stage: 9,
        id: 'lungs',
        name: 'Lungs',
        file: 'human_body_parts/human_lungs.png',
        type: 'organ',
        zIndex: 9,
        color: '#fb7185',
        emoji: '🫁',
        position: { top: '18.5%', left: '50%', width: '50%', transform: 'translateX(-50%)' },
        description: 'Group 3 (Internal Organs): Complete set of internal organs (Stage 3-9).'
    },
    {
        stage: 10,
        id: 'brain',
        name: 'Brain',
        file: 'human_body_parts/human_brain.png',
        type: 'organ',
        zIndex: 10,
        color: '#ec4899',
        emoji: '🧠',
        position: { top: '4.2%', left: '50%', width: '16%', transform: 'translateX(-50%)' },
        description: 'Group 3 (Internal Organs & Head): Accumulating organ & brain group members (Stage 3-10).'
    },
    {
        stage: 11,
        id: 'eyes',
        name: 'Eyes',
        file: 'human_body_parts/human_eye.png',
        type: 'organ',
        zIndex: 11,
        color: '#06b6d4',
        emoji: '👁️',
        positions: [
            { top: '12%', left: '46.8%', width: '4.5%', transform: 'translateX(-50%)' },
            { top: '12%', left: '53.2%', width: '4.5%', transform: 'translateX(-50%)' }
        ],
        description: 'Group 3 (Internal Organs & Head): Complete set of organs, brain, and eyes (Stage 3-11).'
    },
    {
        stage: 12,
        id: 'muscles',
        name: 'Muscular System',
        file: 'human_body_parts/human_muscles_body.png',
        type: 'full-body',
        zIndex: 12,
        color: '#ea580c',
        emoji: '💪',
        description: 'Group 4: Completely isolated muscular system view.'
    },
    {
        stage: 13,
        id: 'skin',
        name: 'Full Body (Skin)',
        file: 'human_body_parts/human_skin_body.png',
        type: 'full-body',
        zIndex: 13,
        color: '#f59e0b',
        emoji: '🧑',
        description: 'Group 5 (Stage 13): Completely isolated full body skin cover.'
    }
];

const KEYFRAME_STAGES = [
    {
        stage: 1,
        name: 'Frame 1: Bone Structure',
        color: '#38bdf8',
        emoji: '🦴',
        description: 'Isolated view of the skeletal system without muscles or skin.',
        layers: ['skeleton']
    },
    {
        stage: 2,
        name: 'Frame 2: Neural & Circulatory System',
        color: '#ef4444',
        emoji: '🩸',
        description: 'Isolated view of the circulatory blood vessel & neural pathway network.',
        layers: ['circulatory']
    },
    {
        stage: 3,
        name: 'Frame 3: Internal Organs',
        color: '#e11d48',
        emoji: '🫀',
        description: 'Isolated view of major internal organs (Heart, Lungs, Brain, Eyes, Digestive, Liver, Urinary, Diaphragm).',
        layers: ['brain', 'eyes', 'lungs', 'heart', 'liver', 'gallbladder', 'digestive', 'urinary', 'diaphragm']
    },
    {
        stage: 4,
        name: 'Frame 4: Muscular System',
        color: '#ea580c',
        emoji: '💪',
        description: 'Isolated view of the muscular system responsible for movement.',
        layers: ['muscles']
    },
    {
        stage: 5,
        name: 'Frame 5: Full Body',
        color: '#f59e0b',
        emoji: '🧑',
        description: 'Isolated view of the complete human body skin surface.',
        layers: ['skin']
    }
];

// ============================================================
// State
// ============================================================
let currentMode = 'detailed'; // 'detailed' | 'keyframe'
let currentStage = 1;
let autoPlayTimer = null;
let isPlaying = false;

// ============================================================
// DOM References
// ============================================================
const viewerContainer = document.getElementById('viewerContainer');
const partTooltip = document.getElementById('partTooltip');
const tabModeDetailed = document.getElementById('tabModeDetailed');
const tabModeKeyframe = document.getElementById('tabModeKeyframe');
const panelTitle = document.getElementById('panelTitle');
const panelDesc = document.getElementById('panelDesc');
const anatomySlider = document.getElementById('anatomySlider');
const sliderTrackFill = document.getElementById('sliderTrackFill');
const sliderMinLabel = document.getElementById('sliderMinLabel');
const sliderMaxLabel = document.getElementById('sliderMaxLabel');
const activeStageCard = document.getElementById('activeStageCard');
const stageBadge = document.getElementById('stageBadge');
const stageIcon = document.getElementById('stageIcon');
const stageTitle = document.getElementById('stageTitle');
const stageDescription = document.getElementById('stageDescription');
const stagesTimeline = document.getElementById('stagesTimeline');
const btnPrevStage = document.getElementById('btnPrevStage');
const btnNextStage = document.getElementById('btnNextStage');
const btnAutoPlay = document.getElementById('btnAutoPlay');

// ============================================================
// Initialize
// ============================================================
function init() {
    createBackgroundParticles();
    createBodyLayers();
    setupEventListeners();
    setMode('detailed');
}

// ============================================================
// Background Particles
// ============================================================
function createBackgroundParticles() {
    const container = document.getElementById('bgParticles');
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981'];

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 20 + 15}s;
            animation-delay: ${Math.random() * 10}s;
        `;
        container.appendChild(particle);
    }
}

// ============================================================
// Create Body Layer Images in the Viewer
// ============================================================
function createBodyLayers() {
    viewerContainer.innerHTML = '';

    DETAILED_STAGES.forEach(stageItem => {
        const positions = stageItem.positions || (stageItem.position ? [stageItem.position] : [null]);

        positions.forEach((pos, idx) => {
            const img = document.createElement('img');
            img.src = stageItem.file;
            img.alt = stageItem.name;
            img.id = positions.length > 1 ? `layer-${stageItem.id}-${idx}` : `layer-${stageItem.id}`;
            img.dataset.stage = stageItem.stage;
            img.dataset.layerGroup = stageItem.id;
            img.className = `body-layer ${stageItem.type === 'full-body' ? 'full-body' : 'organ'}`;
            img.style.zIndex = stageItem.zIndex;
            img.draggable = false;

            if (stageItem.type === 'organ' && pos) {
                img.style.top = pos.top;
                img.style.left = pos.left;
                img.style.width = pos.width;
                if (pos.transform) {
                    img.style.transform = pos.transform;
                }
                if (pos.height) {
                    img.style.height = pos.height;
                }
            }

            // Hover tooltip for organs/layers
            const labelText = positions.length > 1 ? `${stageItem.name} (${idx === 0 ? 'Left' : 'Right'})` : stageItem.name;
            img.addEventListener('mouseenter', (e) => {
                if (!img.classList.contains('hidden')) {
                    showTooltip(e, `${stageItem.emoji} ${labelText}`);
                    img.classList.add('glow');
                }
            });
            img.addEventListener('mousemove', (e) => {
                if (!img.classList.contains('hidden')) {
                    moveTooltip(e);
                }
            });
            img.addEventListener('mouseleave', () => {
                hideTooltip();
                img.classList.remove('glow');
            });

            viewerContainer.appendChild(img);
        });
    });
}

// ============================================================
// Switch Viewer Modes
// ============================================================
function setMode(mode) {
    stopAutoPlay();
    currentMode = mode;

    if (mode === 'detailed') {
        tabModeDetailed.classList.add('active');
        tabModeKeyframe.classList.remove('active');
        panelTitle.textContent = 'Detailed System Slider';
        panelDesc.textContent = 'Slide to see parts accumulated within their anatomical groups.';
        anatomySlider.min = '1';
        anatomySlider.max = '13';
        sliderMinLabel.textContent = '🦴 Skeleton';
        sliderMaxLabel.textContent = '🧑 Full Body';
    } else {
        tabModeKeyframe.classList.add('active');
        tabModeDetailed.classList.remove('active');
        panelTitle.textContent = '5 Key Frames Slider';
        panelDesc.textContent = 'Slide through 5 distinct frames: Bone, Neural/Circulatory, Organs, Muscle, and Full Body.';
        anatomySlider.min = '1';
        anatomySlider.max = '5';
        sliderMinLabel.textContent = '🦴 Bone';
        sliderMaxLabel.textContent = '🧑 Full Body';
    }

    createStagesTimeline();
    setStage(1);
}

// ============================================================
// Timeline Stages Creation
// ============================================================
function createStagesTimeline() {
    stagesTimeline.innerHTML = '';
    const activeList = currentMode === 'detailed' ? DETAILED_STAGES : KEYFRAME_STAGES;

    activeList.forEach(stageItem => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.id = `timeline-item-${stageItem.stage}`;

        timelineItem.innerHTML = `
            <div class="timeline-num" style="--stage-color: ${stageItem.color}">${stageItem.stage}</div>
            <div class="timeline-content">
                <span class="timeline-title">${stageItem.emoji} ${stageItem.name}</span>
            </div>
            <span class="timeline-status"></span>
        `;

        timelineItem.addEventListener('click', () => {
            stopAutoPlay();
            setStage(stageItem.stage);
        });

        stagesTimeline.appendChild(timelineItem);
    });
}

// ============================================================
// Event Listeners
// ============================================================
function setupEventListeners() {
    tabModeDetailed.addEventListener('click', () => setMode('detailed'));
    tabModeKeyframe.addEventListener('click', () => setMode('keyframe'));

    anatomySlider.addEventListener('input', (e) => {
        stopAutoPlay();
        setStage(parseInt(e.target.value, 10));
    });

    btnPrevStage.addEventListener('click', () => {
        stopAutoPlay();
        if (currentStage > 1) {
            setStage(currentStage - 1);
        }
    });

    btnNextStage.addEventListener('click', () => {
        stopAutoPlay();
        const maxStages = currentMode === 'detailed' ? DETAILED_STAGES.length : KEYFRAME_STAGES.length;
        if (currentStage < maxStages) {
            setStage(currentStage + 1);
        }
    });

    btnAutoPlay.addEventListener('click', () => {
        if (isPlaying) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
}

// ============================================================
// Stage Updating Core Logic
// ============================================================
function setStage(stageNum) {
    const activeList = currentMode === 'detailed' ? DETAILED_STAGES : KEYFRAME_STAGES;
    const maxStages = activeList.length;
    currentStage = Math.max(1, Math.min(maxStages, stageNum));
    const activeStage = activeList.find(s => s.stage === currentStage);

    // Update Slider UI
    anatomySlider.value = currentStage;
    const progressPercent = ((currentStage - 1) / (maxStages - 1)) * 100;
    sliderTrackFill.style.width = `${progressPercent}%`;

    // Update Active Card Information
    stageBadge.textContent = `Frame ${currentStage} of ${maxStages}`;
    stageIcon.textContent = activeStage.emoji;
    stageTitle.textContent = activeStage.name;
    stageDescription.textContent = activeStage.description;
    activeStageCard.style.setProperty('--active-stage-color', activeStage.color);

    // Update Stage Buttons
    btnPrevStage.disabled = currentStage === 1;
    btnNextStage.disabled = currentStage === maxStages;

    // Apply Layer Visibility
    if (currentMode === 'detailed') {
        /**
         * Group Isolation Logic for 13-Stage Mode:
         * - Group 1 (Stage 1): Skeleton isolated (Stage 1 only)
         * - Group 2 (Stage 2): Circulatory isolated (Stage 2 only)
         * - Group 3 (Stages 3..11): Internal Organs, Brain & Eyes (accumulates stages 3..currentStage from Group 3 ONLY)
         * - Group 4 (Stage 12): Muscular System isolated (Stage 12 only)
         * - Group 5 (Stage 13): Full Body Skin isolated (Stage 13 only)
         */
        DETAILED_STAGES.forEach(stageItem => {
            const elements = document.querySelectorAll(`[data-stage="${stageItem.stage}"]`);
            let isVisible = false;

            if (currentStage === 1) {
                isVisible = stageItem.stage === 1;
            } else if (currentStage === 2) {
                isVisible = stageItem.stage === 2;
            } else if (currentStage >= 3 && currentStage <= 11) {
                // Group 3: Organs, Brain & Eyes (stages 3 to 11). Show members of this group up to currentStage
                isVisible = stageItem.stage >= 3 && stageItem.stage <= currentStage;
            } else if (currentStage === 12) {
                // Group 4: Muscular system isolated
                isVisible = stageItem.stage === 12;
            } else if (currentStage === 13) {
                // Group 5: Full Body Skin isolated
                isVisible = stageItem.stage === 13;
            }

            elements.forEach(elem => {
                if (isVisible) {
                    elem.classList.remove('hidden');
                    if (stageItem.stage === currentStage) {
                        elem.classList.add('newly-added');
                        setTimeout(() => elem.classList.remove('newly-added'), 600);
                    }
                } else {
                    elem.classList.add('hidden');
                }
            });
        });
    } else {
        // 4 Key Frame Mode: ONLY layers in active keyframe stage are shown (previous frame NOT shown)
        const allowedLayerGroups = new Set(activeStage.layers);

        DETAILED_STAGES.forEach(stageItem => {
            const elements = document.querySelectorAll(`[data-layer-group="${stageItem.id}"]`);
            const isVisible = allowedLayerGroups.has(stageItem.id);

            elements.forEach(elem => {
                if (isVisible) {
                    elem.classList.remove('hidden');
                    elem.classList.add('newly-added');
                    setTimeout(() => elem.classList.remove('newly-added'), 600);
                } else {
                    elem.classList.add('hidden');
                }
            });
        });
    }

    // Update Timeline Item UI
    activeList.forEach(stageItem => {
        const timelineItem = document.getElementById(`timeline-item-${stageItem.stage}`);
        if (timelineItem) {
            timelineItem.classList.remove('active', 'passed');
            if (stageItem.stage === currentStage) {
                timelineItem.classList.add('active');
                timelineItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else if (stageItem.stage < currentStage) {
                timelineItem.classList.add('passed');
            }
        }
    });
}

// ============================================================
// Auto Play Journey Feature
// ============================================================
function startAutoPlay() {
    isPlaying = true;
    btnAutoPlay.textContent = '⏸ Pause';
    btnAutoPlay.classList.add('playing');

    const maxStages = currentMode === 'detailed' ? DETAILED_STAGES.length : KEYFRAME_STAGES.length;

    if (currentStage >= maxStages) {
        setStage(1);
    }

    autoPlayTimer = setInterval(() => {
        const maxLimit = currentMode === 'detailed' ? DETAILED_STAGES.length : KEYFRAME_STAGES.length;
        if (currentStage < maxLimit) {
            setStage(currentStage + 1);
        } else {
            stopAutoPlay();
        }
    }, 1800);
}

function stopAutoPlay() {
    isPlaying = false;
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
    }
    btnAutoPlay.textContent = '▶ Auto Play';
    btnAutoPlay.classList.remove('playing');
}

// ============================================================
// Tooltip Handlers
// ============================================================
function showTooltip(e, text) {
    partTooltip.textContent = text;
    partTooltip.classList.add('visible');
    moveTooltip(e);
}

function moveTooltip(e) {
    partTooltip.style.left = (e.clientX + 16) + 'px';
    partTooltip.style.top = (e.clientY - 10) + 'px';
}

function hideTooltip() {
    partTooltip.classList.remove('visible');
}

// Boot
document.addEventListener('DOMContentLoaded', init);
