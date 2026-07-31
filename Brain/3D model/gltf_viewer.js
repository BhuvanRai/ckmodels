/**
 * BioPulse 3D — GLTF Splanchnology Viewer Engine
 * Loads real Z-Anatomy Splanchnology GLTF model, applies per-material neon colors,
 * adds CSS2D floating labels with arrows for every tissue group, and enables
 * hover tooltips + click-to-info dossier integration.
 */

// ─── Module State ────────────────────────────────────────────────────────────
let gScene, gCamera, gRenderer, gControls;
let gLabelRenderer = null;
let gModel = null;
let gClock = new THREE.Clock();
let gRaycaster = new THREE.Raycaster();
let gMouse = new THREE.Vector2();
let gHoveredMesh = null;
let gAnimFrameId = null;
let gLabelsVisible = true;

// Map from material index → label CSS2DObject
let gLabelObjects = {};
// Map from material name → array of THREE.Mesh objects
let gMaterialMeshGroups = {};
// Map from material name → original emissive hex (for reset)
let gOriginalEmissives = {};

// ─── Material → Anatomy Data Mapping ─────────────────────────────────────────
// Each material in the GLTF maps to a real anatomical structure.
// This drives label text, neon color, and the data key for the right-panel dossier.
const MATERIAL_CONFIG = {
    'Bone': {
        label:     'Skeletal Framework',
        subLabel:  'Bone & Vertebrae',
        color:     0xf0e68c,   // warm ivory
        emissive:  0x4a3d00,
        dataKey:   'splanchnology_bone',
        opacity:   1.0,
        icon:      '🦴'
    },
    'Bronchi.001': {
        label:     'Bronchial Tree',
        subLabel:  'Airways & Bronchi',
        color:     0x00bfff,   // deep sky blue
        emissive:  0x003d5c,
        dataKey:   'splanchnology_bronchi',
        opacity:   1.0,
        icon:      '💨'
    },
    'Cartilage': {
        label:     'Cartilage',
        subLabel:  'Tracheal Rings',
        color:     0x7fffd4,   // aquamarine
        emissive:  0x003d30,
        dataKey:   'splanchnology_cartilage',
        opacity:   0.85,
        icon:      '🫁'
    },
    'Cartilage.001': {
        label:     'Laryngeal Cartilage',
        subLabel:  'Larynx & Throat',
        color:     0x48d1cc,   // medium turquoise
        emissive:  0x003030,
        dataKey:   'splanchnology_larynx',
        opacity:   0.85,
        icon:      '🗣️'
    },
    'Default.001': {
        label:     'Connective Tissue',
        subLabel:  'Fibrous Stroma',
        color:     0xcd853f,   // peru brown
        emissive:  0x3d1a00,
        dataKey:   'splanchnology_connective',
        opacity:   1.0,
        icon:      '🔗'
    },
    'Ductus.001': {
        label:     'Bile & Hepatic Ducts',
        subLabel:  'Ductal System',
        color:     0xffd700,   // gold
        emissive:  0x4a3800,
        dataKey:   'splanchnology_ducts',
        opacity:   1.0,
        icon:      '🌊'
    },
    'Gland.001': {
        label:     'Endocrine Glands',
        subLabel:  'Thyroid & Adrenal',
        color:     0xff6347,   // tomato orange-red
        emissive:  0x4d1300,
        dataKey:   'splanchnology_glands',
        opacity:   1.0,
        icon:      '⚗️'
    },
    'Intestine.001': {
        label:     'Intestinal Tract',
        subLabel:  'Small & Large Intestine',
        color:     0xff4500,   // orange-red
        emissive:  0x4d1000,
        dataKey:   'splanchnology_intestine',
        opacity:   1.0,
        icon:      '🫀'
    },
    'Ligament.001': {
        label:     'Peritoneal Ligaments',
        subLabel:  'Mesentery & Omentum',
        color:     0x90ee90,   // light green
        emissive:  0x003d00,
        dataKey:   'splanchnology_ligament',
        opacity:   0.55,
        icon:      '🕸️'
    },
    'Lung.001': {
        label:     'Lung Parenchyma',
        subLabel:  'Left & Right Lungs',
        color:     0xff69b4,   // hot pink
        emissive:  0x4d0020,
        dataKey:   'splanchnology_lungs',
        opacity:   0.75,
        icon:      '🫁'
    },
    'Mucosa.001': {
        label:     'Mucosal Lining',
        subLabel:  'Gastric & Intestinal Mucosa',
        color:     0xda70d6,   // orchid
        emissive:  0x3d003d,
        dataKey:   'splanchnology_mucosa',
        opacity:   0.9,
        icon:      '🔬'
    },
    'Muscles.001': {
        label:     'Smooth Muscle',
        subLabel:  'Visceral Musculature',
        color:     0xc0c0c0,   // silver
        emissive:  0x202020,
        dataKey:   'splanchnology_muscles',
        opacity:   1.0,
        icon:      '💪'
    },
    'Organ.001': {
        label:     'Solid Organs',
        subLabel:  'Liver · Spleen · Kidneys',
        color:     0x8b0000,   // dark red (maroon)
        emissive:  0x3d0000,
        dataKey:   'splanchnology_organs',
        opacity:   1.0,
        icon:      '🏥'
    },
    'Peritoneum.001': {
        label:     'Peritoneum',
        subLabel:  'Serous Membrane Lining',
        color:     0xadff2f,   // green-yellow
        emissive:  0x1e3d00,
        dataKey:   'splanchnology_peritoneum',
        opacity:   0.35,
        icon:      '🫧'
    },
    'Suture': {
        label:     'Cranial Sutures',
        subLabel:  'Fibrous Joints',
        color:     0xb0c4de,   // light steel blue
        emissive:  0x101828,
        dataKey:   'splanchnology_suture',
        opacity:   1.0,
        icon:      '🧵'
    },
    'Teeth': {
        label:     'Dentition',
        subLabel:  'Upper & Lower Teeth',
        color:     0xfffaf0,   // floral white
        emissive:  0x1a1a10,
        dataKey:   'splanchnology_teeth',
        opacity:   1.0,
        icon:      '🦷'
    }
};

// ─── Initialization ───────────────────────────────────────────────────────────
function initGLTFEngine() {
    const container = document.getElementById('gltf-container');
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    // 1. Scene
    gScene = new THREE.Scene();

    // 2. Camera
    gCamera = new THREE.PerspectiveCamera(42, W / H, 0.01, 100);
    gCamera.position.set(0, 1.2, 3.5);

    // 3. WebGL Renderer
    gRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    gRenderer.setSize(W, H);
    gRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gRenderer.shadowMap.enabled = true;
    gRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    gRenderer.outputEncoding = THREE.sRGBEncoding;
    gRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    gRenderer.toneMappingExposure = 1.1;
    container.appendChild(gRenderer.domElement);

    // 4. CSS2DRenderer for floating labels
    if (typeof THREE.CSS2DRenderer !== 'undefined') {
        gLabelRenderer = new THREE.CSS2DRenderer();
        gLabelRenderer.setSize(W, H);
        gLabelRenderer.domElement.style.position = 'absolute';
        gLabelRenderer.domElement.style.top = '0';
        gLabelRenderer.domElement.style.left = '0';
        gLabelRenderer.domElement.style.pointerEvents = 'none';
        container.appendChild(gLabelRenderer.domElement);
    }

    // 5. OrbitControls
    gControls = new THREE.OrbitControls(gCamera, gRenderer.domElement);
    gControls.enableDamping = true;
    gControls.dampingFactor = 0.07;
    gControls.target.set(0, 1.1, 0);
    gControls.minDistance = 0.8;
    gControls.maxDistance = 8;
    gControls.update();

    // 6. Lighting
    setupGLTFLighting();

    // 7. Load GLTF Model
    loadSplanchnologyModel();

    // 8. Window Resize
    window.addEventListener('resize', onGLTFResize);
    container.addEventListener('mousemove', onGLTFMouseMove);
    container.addEventListener('click', onGLTFClick);

    // 9. Start render loop
    animateGLTF();
}

// ─── Lighting Setup ────────────────────────────────────────────────────────────
function setupGLTFLighting() {
    // Rich ambient
    const ambient = new THREE.AmbientLight(0x101828, 2.5);
    gScene.add(ambient);

    // Key light – warm white front
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(2, 4, 4);
    keyLight.castShadow = true;
    gScene.add(keyLight);

    // Cyan rim left
    const rimCyan = new THREE.DirectionalLight(0x00f5d4, 1.4);
    rimCyan.position.set(-4, 1, -2);
    gScene.add(rimCyan);

    // Warm fill right
    const rimWarm = new THREE.DirectionalLight(0xffb703, 0.8);
    rimWarm.position.set(4, 0, -2);
    gScene.add(rimWarm);

    // Bottom bounce
    const bounce = new THREE.DirectionalLight(0x004488, 0.6);
    bounce.position.set(0, -4, 2);
    gScene.add(bounce);
}

// ─── GLTF Model Loading ────────────────────────────────────────────────────────
function loadSplanchnologyModel() {
    const loader = new THREE.GLTFLoader();

    // Show loading overlay
    const overlay = document.getElementById('gltf-loading-overlay');
    if (overlay) overlay.style.display = 'flex';

    loader.load(
        'splanchnology/scene.gltf',
        function onLoaded(gltf) {
            gModel = gltf.scene;

            // Centre & scale model to fit viewport
            const box = new THREE.Box3().setFromObject(gModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2.2 / maxDim;

            gModel.scale.setScalar(scale);
            gModel.position.sub(center.multiplyScalar(scale));
            // Shift up slightly so centroid is near view target
            const box2 = new THREE.Box3().setFromObject(gModel);
            const center2 = box2.getCenter(new THREE.Vector3());
            gModel.position.y -= center2.y - 1.1;

            // Apply neon material overrides & collect mesh groups
            applyNeonMaterials(gModel);

            gScene.add(gModel);

            // Create CSS2D floating labels after materials are mapped
            createFloatingLabels();

            // Hide loading overlay
            if (overlay) overlay.style.display = 'none';

            // Update orbit target to model center
            gControls.target.set(0, 1.1, 0);
            gControls.update();

            console.log('✅ Splanchnology GLTF loaded. Meshes:', Object.keys(gMaterialMeshGroups).length, 'material groups.');
        },
        function onProgress(xhr) {
            const pct = Math.round((xhr.loaded / xhr.total) * 100);
            const bar = document.getElementById('gltf-load-bar');
            const txt = document.getElementById('gltf-load-pct');
            if (bar) bar.style.width = pct + '%';
            if (txt) txt.textContent = pct + '%';
        },
        function onError(err) {
            console.error('GLTF load error:', err);
            const overlay = document.getElementById('gltf-loading-overlay');
            if (overlay) {
                overlay.innerHTML = `
                    <div class="gltf-load-error">
                        <i class="ri-error-warning-line" style="font-size:2rem;color:#ff0055;"></i>
                        <p>Could not load 3D model.</p>
                        <p style="font-size:0.75rem;color:#64748b;">Serve via HTTP server (not file://).<br>Try: <code>python -m http.server 8080</code></p>
                    </div>`;
            }
        }
    );
}

// ─── Neon Material Application ─────────────────────────────────────────────────
function applyNeonMaterials(model) {
    model.traverse(function(child) {
        if (!child.isMesh) return;

        // Get the material(s) — could be array or single
        const mats = Array.isArray(child.material) ? child.material : [child.material];

        mats.forEach(function(mat) {
            if (!mat || !mat.name) return;
            const cfg = MATERIAL_CONFIG[mat.name];
            if (!cfg) return;

            // Clone so we don't mutate shared material
            const newMat = new THREE.MeshStandardMaterial({
                color: cfg.color,
                emissive: cfg.emissive,
                emissiveIntensity: 0.35,
                roughness: 0.55,
                metalness: 0.05,
                transparent: cfg.opacity < 1.0,
                opacity: cfg.opacity,
                side: THREE.DoubleSide,
                depthWrite: cfg.opacity >= 0.9
            });
            newMat.name = mat.name; // preserve name
            child.material = newMat;

            // Group mesh under material name
            if (!gMaterialMeshGroups[mat.name]) {
                gMaterialMeshGroups[mat.name] = [];
            }
            gMaterialMeshGroups[mat.name].push(child);
        });
    });
}

// ─── Floating CSS2D Labels ─────────────────────────────────────────────────────
function createFloatingLabels() {
    Object.entries(gMaterialMeshGroups).forEach(([matName, meshes]) => {
        const cfg = MATERIAL_CONFIG[matName];
        if (!cfg || !meshes.length) return;

        // Compute centroid of all meshes in this material group
        const box = new THREE.Box3();
        meshes.forEach(m => box.expandByObject(m));
        const center = box.getCenter(new THREE.Vector3());

        // Create HTML label element
        const labelDiv = document.createElement('div');
        labelDiv.className = 'gltf-label';
        labelDiv.setAttribute('data-mat', matName);
        labelDiv.setAttribute('data-key', cfg.dataKey);

        const hexColor = '#' + cfg.color.toString(16).padStart(6, '0');

        labelDiv.innerHTML = `
            <div class="gltf-label-inner" style="--lc: ${hexColor}">
                <span class="gltf-label-icon">${cfg.icon}</span>
                <div class="gltf-label-text">
                    <strong>${cfg.label}</strong>
                    <span>${cfg.subLabel}</span>
                </div>
            </div>
            <div class="gltf-label-line" style="background: ${hexColor};"></div>
            <div class="gltf-label-dot" style="background: ${hexColor}; box-shadow: 0 0 6px ${hexColor};"></div>
        `;

        // Cursor pointer for clickable labels
        labelDiv.style.cursor = 'pointer';
        labelDiv.addEventListener('click', function(e) {
            e.stopPropagation();
            openGLTFDossier(cfg.dataKey);
            pulseHighlightGroup(matName);
            if (window.playUIBeep) window.playUIBeep('open');
        });

        const labelObj = new THREE.CSS2DObject(labelDiv);
        labelObj.position.copy(center);
        // Offset label to the side so they don't overlap the model
        labelObj.position.x += center.x >= 0 ? 0.4 : -0.4;

        gScene.add(labelObj);
        gLabelObjects[matName] = labelObj;
    });
}

// ─── Hover & Click Interaction ─────────────────────────────────────────────────
function onGLTFMouseMove(event) {
    const container = document.getElementById('gltf-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    gMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    gMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    gRaycaster.setFromCamera(gMouse, gCamera);

    // Get all mesh children in the model
    const allMeshes = [];
    if (gModel) gModel.traverse(c => { if (c.isMesh) allMeshes.push(c); });

    const intersects = gRaycaster.intersectObjects(allMeshes, false);

    const tooltip = document.getElementById('gltf-hover-tooltip');

    if (intersects.length > 0) {
        const hit = intersects[0].object;
        const matName = hit.material && hit.material.name;
        const cfg = matName && MATERIAL_CONFIG[matName];

        if (cfg && hit !== gHoveredMesh) {
            // Reset previous hover
            if (gHoveredMesh && gHoveredMesh.material) {
                gHoveredMesh.material.emissiveIntensity = 0.35;
            }
            gHoveredMesh = hit;
            hit.material.emissiveIntensity = 1.2;

            if (tooltip) {
                const hexColor = '#' + cfg.color.toString(16).padStart(6, '0');
                tooltip.innerHTML = `
                    <div class="gltf-tip-icon">${cfg.icon}</div>
                    <div class="gltf-tip-content">
                        <strong style="color:${hexColor}">${cfg.label}</strong>
                        <span>${cfg.subLabel}</span>
                        <em>Click for anatomy info →</em>
                    </div>
                `;
                tooltip.style.left = (event.clientX - document.getElementById('gltf-container').getBoundingClientRect().left + 14) + 'px';
                tooltip.style.top  = (event.clientY - document.getElementById('gltf-container').getBoundingClientRect().top - 10) + 'px';
                tooltip.classList.add('visible');
            }
            document.body.style.cursor = 'pointer';
        }
    } else {
        if (gHoveredMesh && gHoveredMesh.material) {
            gHoveredMesh.material.emissiveIntensity = 0.35;
            gHoveredMesh = null;
        }
        if (tooltip) tooltip.classList.remove('visible');
        document.body.style.cursor = '';
    }
}

function onGLTFClick(event) {
    const container = document.getElementById('gltf-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    gMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    gMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    gRaycaster.setFromCamera(gMouse, gCamera);

    const allMeshes = [];
    if (gModel) gModel.traverse(c => { if (c.isMesh) allMeshes.push(c); });

    const intersects = gRaycaster.intersectObjects(allMeshes, false);
    if (intersects.length > 0) {
        const hit = intersects[0].object;
        const matName = hit.material && hit.material.name;
        const cfg = matName && MATERIAL_CONFIG[matName];
        if (cfg) {
            openGLTFDossier(cfg.dataKey);
            pulseHighlightGroup(matName);
            if (window.playUIBeep) window.playUIBeep('open');
        }
    }
}

// ─── Dossier Integration ───────────────────────────────────────────────────────
function openGLTFDossier(dataKey) {
    if (window.openMedicalDossier) {
        window.openMedicalDossier(dataKey);
    }
}

// ─── Pulse Highlight a Material Group ─────────────────────────────────────────
function pulseHighlightGroup(matName) {
    const meshes = gMaterialMeshGroups[matName];
    if (!meshes) return;

    meshes.forEach(m => { if (m.material) m.material.emissiveIntensity = 2.5; });

    setTimeout(() => {
        meshes.forEach(m => { if (m.material) m.material.emissiveIntensity = 0.35; });
    }, 600);
}

// ─── Label Visibility Toggle ───────────────────────────────────────────────────
function toggleGLTFLabels(visible) {
    gLabelsVisible = visible;
    Object.values(gLabelObjects).forEach(obj => {
        if (obj.element) obj.element.style.display = visible ? 'block' : 'none';
    });
}

// ─── Material Group Visibility ─────────────────────────────────────────────────
function setGLTFGroupVisible(matName, visible) {
    const meshes = gMaterialMeshGroups[matName];
    if (!meshes) return;
    meshes.forEach(m => { m.visible = visible; });
    const labelObj = gLabelObjects[matName];
    if (labelObj && labelObj.element) {
        labelObj.element.style.display = (visible && gLabelsVisible) ? 'block' : 'none';
    }
}

// Show/hide all material groups
function setAllGLTFGroupsVisible(visible) {
    Object.keys(MATERIAL_CONFIG).forEach(name => setGLTFGroupVisible(name, visible));
}

// ─── Camera Focus ──────────────────────────────────────────────────────────────
function focusGLTFOnGroup(matName) {
    const meshes = gMaterialMeshGroups[matName];
    if (!meshes || !meshes.length) return;

    const box = new THREE.Box3();
    meshes.forEach(m => box.expandByObject(m));
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    const dist   = Math.max(size.x, size.y, size.z) * 1.8;

    // Animate camera to focus
    const startPos = gCamera.position.clone();
    const startTarget = gControls.target.clone();
    const endPos = center.clone().add(new THREE.Vector3(0, size.y * 0.3, dist));
    const endTarget = center.clone();

    let t = 0;
    const dur = 60; // frames
    function animCam() {
        t++;
        const p = Math.min(t / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3); // cubic ease-out
        gCamera.position.lerpVectors(startPos, endPos, ease);
        gControls.target.lerpVectors(startTarget, endTarget, ease);
        gControls.update();
        if (t < dur) requestAnimationFrame(animCam);
    }
    animCam();
}

function resetGLTFCamera() {
    const startPos = gCamera.position.clone();
    const startTarget = gControls.target.clone();
    const endPos = new THREE.Vector3(0, 1.2, 3.5);
    const endTarget = new THREE.Vector3(0, 1.1, 0);

    let t = 0;
    const dur = 50;
    function animCam() {
        t++;
        const p = Math.min(t / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        gCamera.position.lerpVectors(startPos, endPos, ease);
        gControls.target.lerpVectors(startTarget, endTarget, ease);
        gControls.update();
        if (t < dur) requestAnimationFrame(animCam);
    }
    animCam();
}

// ─── Render Loop ───────────────────────────────────────────────────────────────
function animateGLTF() {
    gAnimFrameId = requestAnimationFrame(animateGLTF);
    const delta = gClock.getDelta();

    // Subtle breathing pulse on emissives
    const pulse = 0.35 + Math.sin(gClock.getElapsedTime() * 1.2) * 0.06;
    Object.values(gMaterialMeshGroups).forEach(meshes => {
        meshes.forEach(m => {
            if (m.material && m !== gHoveredMesh && m.material.emissiveIntensity < 0.8) {
                m.material.emissiveIntensity = pulse;
            }
        });
    });

    gControls.update();
    gRenderer.render(gScene, gCamera);
    if (gLabelRenderer) gLabelRenderer.render(gScene, gCamera);
}

// ─── Resize Handler ────────────────────────────────────────────────────────────
function onGLTFResize() {
    const container = document.getElementById('gltf-container');
    if (!container || !gRenderer) return;
    const W = container.clientWidth;
    const H = container.clientHeight;
    gCamera.aspect = W / H;
    gCamera.updateProjectionMatrix();
    gRenderer.setSize(W, H);
    if (gLabelRenderer) gLabelRenderer.setSize(W, H);
}

// ─── Stop/Start Engine ─────────────────────────────────────────────────────────
function stopGLTFEngine() {
    if (gAnimFrameId) {
        cancelAnimationFrame(gAnimFrameId);
        gAnimFrameId = null;
    }
}

function startGLTFEngine() {
    if (!gAnimFrameId) animateGLTF();
}

// ─── Expose Globals ────────────────────────────────────────────────────────────
window.initGLTFEngine      = initGLTFEngine;
window.stopGLTFEngine      = stopGLTFEngine;
window.startGLTFEngine     = startGLTFEngine;
window.toggleGLTFLabels    = toggleGLTFLabels;
window.focusGLTFOnGroup    = focusGLTFOnGroup;
window.resetGLTFCamera     = resetGLTFCamera;
window.setGLTFGroupVisible = setGLTFGroupVisible;
window.setAllGLTFGroupsVisible = setAllGLTFGroupsVisible;
window.MATERIAL_CONFIG     = MATERIAL_CONFIG;
