/**
 * BioPulse 3D - Three.js Holographic Anatomy & Organ Visualizer
 * Procedural 3D Human Model Engine with Dynamic Problem Highlight & Raycasting
 */

let scene, camera, renderer, controls;
let humanGroup = new THREE.Group();
let organMeshes = {};
let bodyMeshes = {};
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let hoveredMesh = null;
let selectedMeshId = null;
let clock = new THREE.Clock();

// Annotation & Label References
let labelRenderer = null;
let annotationObjects = {};

// Material References for animation and opacity control
let torsoMaterials = [];
let organMaterials = {};

// Initialize 3D Engine on load
window.addEventListener('DOMContentLoaded', () => {
    init3DEngine();
    animate();
});

function init3DEngine() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    scene = new THREE.Scene();

    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 22);

    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3b. CSS2DRenderer Setup for Holographic Annotations & Arrows
    if (typeof THREE.CSS2DRenderer !== 'undefined') {
        labelRenderer = new THREE.CSS2DRenderer();
        labelRenderer.setSize(width, height);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        labelRenderer.domElement.style.left = '0px';
        labelRenderer.domElement.style.pointerEvents = 'none';
        container.appendChild(labelRenderer.domElement);
    }

    // 4. Orbit Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 2, 0);
    controls.minDistance = 5;
    controls.maxDistance = 35;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't go too far below feet
    controls.update();

    // 5. Studio Lighting Architecture
    setupLighting();

    // 6. Build Procedural Holographic Human Model with Distinct Colors & Arrows
    buildHumanAnatomy();
    scene.add(humanGroup);

    // 7. Event Listeners for Interaction
    window.addEventListener('resize', onWindowResize);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onMouseClick);
}

/**
 * Lighting Architecture
 */
function setupLighting() {
    // Soft ambient fill
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    // Main frontal key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(10, 15, 15);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Neon Cyan Rim Light (Left)
    const rimCyan = new THREE.DirectionalLight(0x00f5d4, 1.5);
    rimCyan.position.set(-15, 5, -5);
    scene.add(rimCyan);

    // Electric Blue / Coral Rim Light (Right)
    const rimCoral = new THREE.DirectionalLight(0x4361ee, 1.5);
    rimCoral.position.set(15, -5, -5);
    scene.add(rimCoral);

    // Bottom soft fill
    const bottomFill = new THREE.DirectionalLight(0x00a8e8, 0.6);
    bottomFill.position.set(0, -15, 5);
    scene.add(bottomFill);
}

/**
 * Procedural Holographic Anatomy Builder
 * Creates anatomical exterior segments and interior organs
 */
/**
 * Helper to generate distinct colored holographic material & wireframe pair
 */
/**
 * Helper to generate distinct colored holographic material & wireframe pair
 */
function createSegmentMaterials(colorHex, emissiveHex, wireHex, opacity = 0.35) {
    const bodyMat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        emissive: emissiveHex,
        emissiveIntensity: 0.22,
        transparent: true,
        opacity: opacity,
        roughness: 0.2,
        metalness: 0.15,
        transmission: 0.45,
        depthWrite: false
    });
    torsoMaterials.push(bodyMat);

    const wireMat = new THREE.MeshBasicMaterial({
        color: wireHex,
        wireframe: true,
        transparent: true,
        opacity: 0.18
    });
    torsoMaterials.push(wireMat);

    return { bodyMat, wireMat };
}

// ============================================================================
// HYPER-REALISTIC PROCEDURAL ANATOMY SCULPTING HELPERS
// Generates cinema-grade anatomical shapes via vertex manipulation & curves!
// ============================================================================

/**
 * 1. Sculpted Human Cranium & Facial Profile (Head & Neck)
 */
function createRealisticHeadGeom() {
    const geom = new THREE.SphereGeometry(1.2, 32, 32);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // General cranial proportions
        y *= 1.25;
        z *= 1.06;

        // Temporal flattening on sides of head
        if (Math.abs(x) > 0.6) {
            x *= 0.88;
        }

        // Jawline & chin sculpting (anterior-inferior)
        if (y < -0.2 && z > 0) {
            y -= (y + 0.2) * 0.25; // Pull jaw down
            x *= 0.78; // Taper jaw inward
            if (y > -0.8 && y < -0.3) {
                z += 0.18; // Chin protrusion
            }
        }

        // Brow ridge and nasal bridge projection (anterior-mid)
        if (z > 0.3 && y > -0.2 && y < 0.35 && Math.abs(x) < 0.35) {
            z += 0.22 * (1.0 - Math.abs(x) / 0.35);
        }

        // Occipital rounding (posterior cranium)
        if (z < -0.4 && y > 0) {
            z *= 1.08;
        }

        pos.setXYZ(i, x, y, z);
    }
    geom.computeVertexNormals();
    return geom;
}

/**
 * 2. Sculpted Thoracic Torso with Pectorals & Rib Arch Contours
 */
function createRealisticChestGeom() {
    const geom = new THREE.CylinderGeometry(1.85, 1.5, 3.4, 32, 24);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Shoulders & Clavicle widening at top
        if (y > 1.0) {
            const factor = (y - 1.0) / 0.7;
            x *= 1.0 + factor * 0.18;
            z *= 1.0 - factor * 0.12;
        }

        // Pectorals & Anterior Ribcage projection
        if (y > -0.5 && y <= 1.0 && z > 0) {
            z *= 1.22; // Chest forward arch
            if (Math.abs(x) < 1.2) {
                z += 0.1 * Math.cos(x * 1.5); // Muscle fullness
            }
        }

        // Posterior spinal groove indentation
        if (z < 0 && Math.abs(x) < 0.4) {
            z += 0.18 * (1.0 - Math.abs(x) / 0.4);
        }

        // Solar plexus / diaphragm taper at bottom
        if (y < -0.8) {
            x *= 0.92;
            z *= 0.92;
        }

        pos.setXYZ(i, x, y, z);
    }
    geom.computeVertexNormals();
    return geom;
}

/**
 * 2b. Procedural Holographic Ribcage Bones (6 Curved Rib Pairs inside Thorax)
 */
function createHolographicRibcage(wireHex) {
    const ribGroup = new THREE.Group();
    const ribMat = new THREE.MeshBasicMaterial({ color: wireHex, transparent: true, opacity: 0.45 });
    
    for (let r = 0; r < 6; r++) {
        const yPos = 1.2 - r * 0.42;
        const radiusX = 1.45 - r * 0.05;
        const radiusZ = 1.05 - r * 0.04;
        
        // Create curved rib torus segment
        const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusZ, -Math.PI * 0.75, Math.PI * 0.75, false, 0);
        const points = curve.getPoints(20);
        const points3D = points.map(p => new THREE.Vector3(p.x, yPos - Math.abs(p.x) * 0.1, p.y));
        
        const path = new THREE.CatmullRomCurve3(points3D);
        const ribGeom = new THREE.TubeGeometry(path, 20, 0.035, 6, false);
        const ribMesh = new THREE.Mesh(ribGeom, ribMat);
        ribGroup.add(ribMesh);
    }
    return ribGroup;
}

/**
 * 3. Sculpted Abdomen & Pelvis (Waist Taper, Abs, Iliac Crests)
 */
function createRealisticAbdomenGeom() {
    const geom = new THREE.CylinderGeometry(1.5, 1.4, 2.8, 32, 20);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Waistline indentation (mid-upper abdomen)
        if (y > 0.2 && y <= 1.2) {
            const taper = 1.0 - 0.12 * Math.sin((y - 0.2) * Math.PI / 1.0);
            x *= taper;
            z *= taper;
        }

        // Anterior Rectus Abdominis (Abs) contour
        if (z > 0 && Math.abs(x) < 0.65) {
            z += 0.12 * Math.cos(x * 2.0) * Math.cos(y * 2.5);
        }

        // Pelvic flare / Iliac Crests at bottom
        if (y < -0.4) {
            const flare = (Math.abs(y) - 0.4) / 1.0;
            x *= 1.0 + flare * 0.22;
            if (z < 0) z *= 1.15; // Gluteal posterior contour
        }

        pos.setXYZ(i, x, y, z);
    }
    geom.computeVertexNormals();
    return geom;
}

/**
 * 4. Articulated Muscular Arm Geometry (Deltoid, Biceps, Elbow joint, Forearm, Hand)
 */
function createRealisticArmGeom() {
    const geom = new THREE.CylinderGeometry(0.4, 0.22, 4.8, 24, 24);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Shoulder / Deltoid mass at top
        if (y > 1.4) {
            x *= 1.35;
            z *= 1.2;
        }
        // Biceps & Triceps muscle bulge
        else if (y > 0.3 && y <= 1.4) {
            if (z > 0) z *= 1.25; // Anterior biceps
            if (z < 0) z *= 1.15; // Posterior triceps
        }
        // Elbow joint narrowing
        else if (y > -0.3 && y <= 0.3) {
            x *= 0.82;
            z *= 0.85;
        }
        // Forearm / Brachioradialis muscle bulge
        else if (y > -1.6 && y <= -0.3) {
            const bulge = Math.sin((y + 1.6) / 1.3 * Math.PI);
            x *= 1.0 + bulge * 0.3;
            z *= 1.0 + bulge * 0.18;
        }
        // Wrist taper & Hand palm/fingers expansion
        else if (y <= -1.6) {
            if (y > -2.0) {
                x *= 0.75; // Slender wrist
                z *= 0.7;
            } else {
                x *= 1.25; // Hand palm width
                z *= 0.45; // Hand thickness flattening
            }
        }

        pos.setXYZ(i, x, y, z);
    }
    geom.computeVertexNormals();
    return geom;
}

/**
 * 5. Articulated Muscular Leg Geometry (Quads, Patella Kneecap, Calf, Ankle, Foot Arch)
 */
function createRealisticLegGeom() {
    const geom = new THREE.CylinderGeometry(0.55, 0.26, 5.8, 24, 26);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Upper Thigh / Quadriceps & Gluteal bulk
        if (y > 0.8) {
            x *= 1.25;
            z *= 1.3;
        }
        // Knee joint & Patella (Kneecap anterior protrusion)
        else if (y > -0.4 && y <= 0.8) {
            if (Math.abs(y) < 0.3 && z > 0) {
                z *= 1.28; // Kneecap protrusion
            }
            if (Math.abs(y) < 0.2) {
                x *= 0.88; // Joint medial narrowing
            }
        }
        // Calf / Gastrocnemius posterior bulge
        else if (y > -1.9 && y <= -0.4) {
            const bulge = Math.sin((y + 1.9) / 1.5 * Math.PI);
            if (z < 0) z *= 1.0 + bulge * 0.45; // Posterior calf muscle
            x *= 1.0 + bulge * 0.22;
        }
        // Slender Ankle & Achilles Tendon
        else if (y > -2.4 && y <= -1.9) {
            x *= 0.72;
            z *= 0.72;
        }
        // Foot Instep, Arch & Toes (Anterior projection)
        else if (y <= -2.4) {
            if (z > 0) z += 0.75; // Extend forward for foot length
            x *= 1.15; // Foot width
            z *= 1.1;
        }

        pos.setXYZ(i, x, y, z);
    }
    geom.computeVertexNormals();
    return geom;
}

/**
 * 6. Realistic 4-Chamber Heart with Aortic Arch & Blood Vessels
 */
function createRealisticHeartGroup(mat) {
    const group = new THREE.Group();

    // Main Ventricles & Atria body (Conical, asymmetric human apex)
    const bodyGeom = new THREE.SphereGeometry(0.7, 28, 28);
    const pos = bodyGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Taper apex downwards and tilt to the left
        if (y < 0) {
            const factor = Math.abs(y) / 0.7;
            x += factor * 0.28; // Tilt left
            z += factor * 0.15; // Anterior tilt
            x *= (1.0 - factor * 0.4); // Conical taper
            z *= (1.0 - factor * 0.35);
        } else {
            // Upper auricles / atria expansion
            x *= 1.18;
            z *= 1.1;
            // Interventricular sulcus (surface groove)
            if (Math.abs(x) < 0.2 && z > 0) {
                z -= 0.12;
            }
        }
        pos.setXYZ(i, x, y, z);
    }
    bodyGeom.computeVertexNormals();
    const bodyMesh = new THREE.Mesh(bodyGeom, mat);
    group.add(bodyMesh);

    // Aortic Arch (Curved vascular tube emerging from superior base)
    const aortaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.1, 0.5, 0.1),
        new THREE.Vector3(0.15, 0.95, 0.05),
        new THREE.Vector3(-0.15, 1.1, -0.1),
        new THREE.Vector3(-0.35, 0.85, -0.25)
    ]);
    const aortaGeom = new THREE.TubeGeometry(aortaCurve, 20, 0.16, 12, false);
    const aortaMesh = new THREE.Mesh(aortaGeom, mat);
    group.add(aortaMesh);

    // Vena Cava / Pulmonary trunk vessel
    const venaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.25, 0.4, 0.15),
        new THREE.Vector3(-0.35, 0.85, 0.2),
        new THREE.Vector3(-0.45, 1.15, 0.1)
    ]);
    const venaGeom = new THREE.TubeGeometry(venaCurve, 16, 0.14, 12, false);
    const venaMesh = new THREE.Mesh(venaGeom, mat);
    group.add(venaMesh);

    return group;
}

/**
 * 7. Anatomical Lobed Lung with Diaphragm Base & Cardiac Notch
 */
function createRealisticLungGeom(isLeft) {
    const geom = new THREE.SphereGeometry(0.9, 28, 28);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Elongate vertically
        y *= 1.75;
        z *= 0.78;

        // Apex taper under collarbone
        if (y > 0.6) {
            const taper = 1.0 - (y - 0.6) / 1.0 * 0.65;
            x *= taper;
            z *= taper;
        }

        // Concave inferior diaphragm base
        if (y < -0.7) {
            x *= 1.15; // Broad lower lobes
            z *= 1.1;
            if (Math.sqrt(x * x + z * z) < 0.6) {
                y += 0.25 * (0.6 - Math.sqrt(x * x + z * z)); // Diaphragm concavity
            }
        }

        // Medial Cardiac Notch (space where heart sits)
        const medialFacing = isLeft ? (x > -0.2) : (x < 0.2);
        if (medialFacing && Math.abs(y) < 0.8 && z > -0.4) {
            const notchDepth = isLeft ? 0.42 : 0.22; // Left lung has deeper cardiac notch
            x = isLeft ? Math.min(x, x * (1.0 - notchDepth)) : Math.max(x, x * (1.0 - notchDepth));
        }

        // Pulmonary lobule surface texture
        const ripple = Math.sin(y * 8.0) * Math.cos(x * 8.0) * 0.025;
        x += ripple * (x / 0.9);
        z += ripple * (z / 0.9);

        pos.setXYZ(i, x, y, z);
    }
    geom.computeVertexNormals();
    return geom;
}

/**
 * 8. Anatomical Wrinkled Brain (Hemispheres, Longitudinal Fissure, Cerebellum & Brainstem)
 */
function createRealisticBrainGroup(mat) {
    const group = new THREE.Group();

    // Cerebral Hemispheres with Cortical Folds (Gyri/Sulci)
    const cerebrumGeom = new THREE.SphereGeometry(0.92, 36, 36);
    const pos = cerebrumGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Cranial proportions (elongated front-to-back)
        x *= 0.94;
        y *= 0.84;
        z *= 1.18;

        // Deep Sagittal Longitudinal Fissure separating left/right hemispheres
        if (Math.abs(x) < 0.22 && y > -0.3) {
            const fissure = (0.22 - Math.abs(x)) / 0.22;
            y -= fissure * 0.18;
            if (z > -0.5 && z < 0.7) {
                z *= 0.92;
            }
        }

        // Procedural Cortical Gyri & Sulci (Surface Wrinkles)
        const wrinkle = Math.sin(x * 16.0 + y * 14.0) * Math.cos(y * 14.0 + z * 16.0) * 0.035;
        x += wrinkle * (x / 0.9);
        y += wrinkle * (y / 0.8);
        z += wrinkle * (z / 1.1);

        pos.setXYZ(i, x, y, z);
    }
    cerebrumGeom.computeVertexNormals();
    const cerebrumMesh = new THREE.Mesh(cerebrumGeom, mat);
    group.add(cerebrumMesh);

    // Cerebellum (Tucked under posterior occipital lobe)
    const cerebGeom = new THREE.SphereGeometry(0.45, 24, 24);
    cerebGeom.scale(1.3, 0.75, 0.85);
    const cerebMesh = new THREE.Mesh(cerebGeom, mat);
    cerebMesh.position.set(0, -0.45, -0.55);
    group.add(cerebMesh);

    // Brainstem / Medulla Oblongata column extending downwards
    const stemGeom = new THREE.CylinderGeometry(0.18, 0.14, 0.7, 16);
    const stemMesh = new THREE.Mesh(stemGeom, mat);
    stemMesh.position.set(0, -0.75, -0.15);
    stemMesh.rotation.x = 0.2;
    group.add(stemMesh);

    return group;
}

/**
 * 9. Anatomical J-Shaped Stomach Pouch
 */
function createRealisticStomachGeom() {
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.25, 0.7, 0.1),   // Esophageal sphincter junction
        new THREE.Vector3(-0.55, 0.45, 0.25), // Fundus superior dome
        new THREE.Vector3(-0.45, -0.1, 0.35), // Body (greater curvature)
        new THREE.Vector3(0.15, -0.45, 0.2),  // Antrum sweeping right
        new THREE.Vector3(0.45, -0.25, 0.0)   // Pyloric canal
    ]);
    
    // Custom tubular mesh with varying radius along J-curve
    const geom = new THREE.TubeGeometry(curve, 32, 0.42, 16, false);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Expand fundus and body, taper pylorus
        if (y > 0.2) {
            x *= 1.25; // Fundus expansion
            z *= 1.25;
        } else if (x > 0.2) {
            const taper = Math.max(0.45, 1.0 - (x - 0.2) * 1.5);
            y *= taper; // Pylorus narrowing
            z *= taper;
        }
        pos.setXYZ(i, x, y, z);
    }
    geom.computeVertexNormals();
    return geom;
}

/**
 * 10. Anatomical Right-Dominant Wedge Liver
 */
function createRealisticLiverGeom() {
    const geom = new THREE.SphereGeometry(0.78, 28, 28);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        if (x > 0) {
            // Thick, rounded Right Lobe occupying right hypochondrium
            x *= 1.45;
            y *= 1.15;
            z *= 0.95;
        } else {
            // Thin, tapered Left Lobe extending across epigastrium
            x *= 1.25;
            const taper = Math.max(0.3, 1.0 - Math.abs(x) * 0.7);
            y *= taper;
            z *= taper;
        }

        // Visceral inferior concavity (resting over kidney/stomach)
        if (y < 0 && z < 0.2) {
            y += Math.abs(x) * 0.18;
        }

        pos.setXYZ(i, x, y, z);
    }
    geom.computeVertexNormals();
    return geom;
}

/**
 * 11. Anatomical Bean-Shaped Kidney with Medial Hilum Indentation
 */
function createRealisticKidneyGeom(isLeft) {
    const geom = new THREE.SphereGeometry(0.42, 24, 24);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Vertical elongation and flattening
        y *= 1.42;
        z *= 0.68;

        // Medial Hilum indentation (where renal vessels enter)
        const medialSide = isLeft ? (x < 0) : (x > 0);
        if (medialSide && Math.abs(y) < 0.45) {
            const indent = (0.45 - Math.abs(y)) / 0.45;
            x = isLeft ? x + indent * 0.18 : x - indent * 0.18;
            z *= 0.85;
        }

        pos.setXYZ(i, x, y, z);
    }
    geom.computeVertexNormals();
    return geom;
}

// ============================================================================
// MAIN PROCEDURAL HOLOGRAPHIC ANATOMY BUILDER
// Preserves 100% of part namings, IDs, icons, dossiers, and arrows!
// ============================================================================

/**
 * Procedural Holographic Anatomy Builder
 * Highlights EVERY part with a unique, vibrant color palette and marks names with arrows!
 */
function buildHumanAnatomy() {
    // ==========================================
    // 1. EXTERIOR ANATOMY WITH DISTINCT COLORS
    // ==========================================

    // HEAD & NECK - Amethyst Purple (0x9d4edd)
    const headMats = createSegmentMaterials(0x9d4edd, 0x5a189a, 0xc77dff, 0.4);
    const headGroup = new THREE.Group();
    const headGeom = createRealisticHeadGeom();
    const headMesh = createAnatomyMesh(headGeom, headMats.bodyMat, headMats.wireMat, "head");
    headGroup.add(headMesh);
    headGroup.position.set(0, 7.5, 0);
    humanGroup.add(headGroup);
    bodyMeshes["head"] = headMesh;

    const neckGeom = new THREE.CylinderGeometry(0.48, 0.62, 1.1, 20);
    const neckMesh = new THREE.Mesh(neckGeom, headMats.bodyMat);
    neckMesh.position.set(0, 6.0, 0);
    humanGroup.add(neckMesh);

    // THORACIC CAVITY (CHEST & RIBCAGE) - Sapphire Blue (0x0077b6)
    const chestMats = createSegmentMaterials(0x0077b6, 0x0096c7, 0x48cae4, 0.35);
    const chestGeom = createRealisticChestGeom();
    const chestMesh = createAnatomyMesh(chestGeom, chestMats.bodyMat, chestMats.wireMat, "chest");
    chestMesh.position.set(0, 3.8, 0);
    
    // Add glowing holographic ribcage bones inside thorax for medical realism!
    const ribsGroup = createHolographicRibcage(0x48cae4);
    ribsGroup.position.set(0, 0, 0);
    chestMesh.add(ribsGroup);
    
    humanGroup.add(chestMesh);
    bodyMeshes["chest"] = chestMesh;

    // ABDOMEN & PELVIS - Emerald Teal (0x0a9396)
    const abdMats = createSegmentMaterials(0x0a9396, 0x0081a7, 0x00f5d4, 0.35);
    const abdGeom = createRealisticAbdomenGeom();
    const abdMesh = createAnatomyMesh(abdGeom, abdMats.bodyMat, abdMats.wireMat, "abdomen");
    abdMesh.position.set(0, 0.7, 0);
    humanGroup.add(abdMesh);
    bodyMeshes["abdomen"] = abdMesh;

    // LEFT ARM (Deltoid, Biceps, Elbow, Forearm, Hand) - Electric Aqua (0x00f5d4)
    const leftArmMats = createSegmentMaterials(0x00f5d4, 0x00b4d8, 0x90e0ef, 0.4);
    const leftArmGroup = createLimb("left_arm", 2.4, 3.2, 0, leftArmMats.bodyMat, leftArmMats.wireMat, true);
    humanGroup.add(leftArmGroup);
    bodyMeshes["left_arm"] = leftArmGroup.children[0];

    // RIGHT ARM (Deltoid, Biceps, Elbow, Forearm, Hand) - Cobalt Indigo (0x4361ee)
    const rightArmMats = createSegmentMaterials(0x4361ee, 0x3a0ca3, 0x4cc9f0, 0.4);
    const rightArmGroup = createLimb("right_arm", -2.4, 3.2, 0, rightArmMats.bodyMat, rightArmMats.wireMat, false);
    humanGroup.add(rightArmGroup);
    bodyMeshes["right_arm"] = rightArmGroup.children[0];

    // LEFT LEG (Quads, Patella, Calf, Ankle, Foot Arch) - Lavender Violet (0x7209b7)
    const leftLegMats = createSegmentMaterials(0x7209b7, 0x560bad, 0xb5179e, 0.4);
    const leftLegGroup = createLeg("left_leg", 0.85, -2.4, 0, leftLegMats.bodyMat, leftLegMats.wireMat, true);
    humanGroup.add(leftLegGroup);
    bodyMeshes["left_leg"] = leftLegGroup.children[0];

    // RIGHT LEG (Quads, Patella, Calf, Ankle, Foot Arch) - Cerulean Sky (0x48cae4)
    const rightLegMats = createSegmentMaterials(0x48cae4, 0x0077b6, 0x00b4d8, 0.4);
    const rightLegGroup = createLeg("right_leg", -0.85, -2.4, 0, rightLegMats.bodyMat, rightLegMats.wireMat, false);
    humanGroup.add(rightLegGroup);
    bodyMeshes["right_leg"] = rightLegGroup.children[0];

    // ==========================================
    // 2. INTERNAL ORGANS WITH UNIQUE COLORS
    // ==========================================

    // ❤️ HEART (With Problem - Crimson Red 0xff0055)
    const heartMat = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.2
    });
    const heartGroup = createRealisticHeartGroup(heartMat);
    // Reference main ventricle mesh for raycasting and dossier selection
    const heartMesh = heartGroup.children[0];
    heartMesh.userData = { id: "heart", name: MEDICAL_DATA["heart"].name, isOrgan: true };
    
    const heartLight = new THREE.PointLight(0xff0055, 1.8, 7);
    heartGroup.add(heartLight);
    heartGroup.position.set(0.45, 4.2, 0.35);
    humanGroup.add(heartGroup);
    organMeshes["heart"] = heartMesh;
    organMaterials["heart"] = heartMat;

    // 🫁 LUNGS (With Problem - Glowing Amber 0xff8c00)
    const lungsGroup = new THREE.Group();
    const lungMat = new THREE.MeshStandardMaterial({
        color: 0xff8c00,
        emissive: 0xff8c00,
        emissiveIntensity: 0.5,
        roughness: 0.35,
        transparent: true,
        opacity: 0.88
    });
    const leftLungGeom = createRealisticLungGeom(true);
    const leftLung = new THREE.Mesh(leftLungGeom, lungMat);
    leftLung.position.set(0.95, 4.3, 0.1);
    leftLung.userData = { id: "lungs", name: MEDICAL_DATA["lungs"].name, isOrgan: true };

    const rightLungGeom = createRealisticLungGeom(false);
    const rightLung = new THREE.Mesh(rightLungGeom, lungMat);
    rightLung.position.set(-0.95, 4.3, 0.1);
    rightLung.userData = { id: "lungs", name: MEDICAL_DATA["lungs"].name, isOrgan: true };

    lungsGroup.add(leftLung);
    lungsGroup.add(rightLung);
    humanGroup.add(lungsGroup);
    organMeshes["lungs"] = leftLung;
    organMeshes["lungs_right"] = rightLung;
    organMaterials["lungs"] = lungMat;

    // 🤢 STOMACH (With Problem - Rose Ruby 0xd90429)
    const stomachGeom = createRealisticStomachGeom();
    const stomachMat = new THREE.MeshStandardMaterial({
        color: 0xd90429,
        emissive: 0xd90429,
        emissiveIntensity: 0.5,
        roughness: 0.28
    });
    const stomachMesh = new THREE.Mesh(stomachGeom, stomachMat);
    stomachMesh.position.set(0.65, 2.3, 0.3);
    stomachMesh.rotation.z = -0.2;
    stomachMesh.userData = { id: "stomach", name: MEDICAL_DATA["stomach"].name, isOrgan: true };
    humanGroup.add(stomachMesh);
    organMeshes["stomach"] = stomachMesh;
    organMaterials["stomach"] = stomachMat;

    // 🫘 RIGHT KIDNEY (With Problem - Sunny Gold 0xffb703)
    const rtKidneyGeom = createRealisticKidneyGeom(false);
    const rtKidneyMat = new THREE.MeshStandardMaterial({
        color: 0xffb703,
        emissive: 0xffb703,
        emissiveIntensity: 0.6,
        roughness: 0.3
    });
    const rtKidneyMesh = new THREE.Mesh(rtKidneyGeom, rtKidneyMat);
    rtKidneyMesh.position.set(-0.75, 1.5, -0.4);
    rtKidneyMesh.userData = { id: "right_kidney", name: MEDICAL_DATA["right_kidney"].name, isOrgan: true };
    humanGroup.add(rtKidneyMesh);
    organMeshes["right_kidney"] = rtKidneyMesh;
    organMaterials["right_kidney"] = rtKidneyMat;

    // 🧠 BRAIN - Neon Magenta (0xf72585)
    const brainMat = new THREE.MeshStandardMaterial({
        color: 0xf72585,
        emissive: 0xb5179e,
        emissiveIntensity: 0.45,
        roughness: 0.3,
        transparent: true,
        opacity: 0.9
    });
    const brainGroup = createRealisticBrainGroup(brainMat);
    const brainMesh = brainGroup.children[0]; // Cerebrum reference for raycasting
    brainMesh.userData = { id: "brain", name: MEDICAL_DATA["brain"].name, isOrgan: true };
    brainGroup.position.set(0, 7.8, 0);
    humanGroup.add(brainGroup);
    organMeshes["brain"] = brainMesh;
    organMaterials["brain"] = brainMat;

    // 🍷 LIVER - Warm Amber Gold (0xf4a261)
    const liverMat = new THREE.MeshStandardMaterial({
        color: 0xf4a261,
        emissive: 0xe76f51,
        emissiveIntensity: 0.42,
        roughness: 0.32,
        transparent: true,
        opacity: 0.9
    });
    const liverGeom = createRealisticLiverGeom();
    const liverMesh = new THREE.Mesh(liverGeom, liverMat);
    liverMesh.position.set(-0.65, 2.6, 0.25);
    liverMesh.rotation.z = 0.15;
    liverMesh.userData = { id: "liver", name: MEDICAL_DATA["liver"].name, isOrgan: true };
    humanGroup.add(liverMesh);
    organMeshes["liver"] = liverMesh;
    organMaterials["liver"] = liverMat;

    // 🫘 LEFT KIDNEY - Spring Lime (0x70e000)
    const ltKidneyGeom = createRealisticKidneyGeom(true);
    const ltKidneyMat = new THREE.MeshStandardMaterial({
        color: 0x70e000,
        emissive: 0x38b000,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        transparent: true,
        opacity: 0.9
    });
    const ltKidneyMesh = new THREE.Mesh(ltKidneyGeom, ltKidneyMat);
    ltKidneyMesh.position.set(0.75, 1.5, -0.4);
    ltKidneyMesh.userData = { id: "left_kidney", name: MEDICAL_DATA["left_kidney"].name, isOrgan: true };
    humanGroup.add(ltKidneyMesh);
    organMeshes["left_kidney"] = ltKidneyMesh;
    organMaterials["left_kidney"] = ltKidneyMat;

    // 3. GENERATE ALL 3D ARROW ANNOTATIONS & NAME LABELS
    createAllAnnotations();

    // Show ALL organs and body parts by default as requested ("mark all the parts present in that 3d model")!
    applyOrganVisibilityFilter('all');
}

/**
 * Helper to construct body segment with wireframe overlay
 */
function createAnatomyMesh(geometry, mat, wireMat, id) {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.userData = { id: id, name: MEDICAL_DATA[id].name, isOrgan: false };
    
    const wire = new THREE.Mesh(geometry, wireMat);
    wire.userData = { id: id, name: MEDICAL_DATA[id].name, isOrgan: false };
    
    group.add(mesh);
    group.add(wire);
    return group;
}

/**
 * Construct Articulated Muscular Arm Limb
 */
function createLimb(id, x, y, z, bodyMat, wireMat, isLeft) {
    const group = new THREE.Group();
    const geom = createRealisticArmGeom();
    
    const mesh = new THREE.Mesh(geom, bodyMat);
    mesh.userData = { id: id, name: MEDICAL_DATA[id].name, isOrgan: false };
    const wire = new THREE.Mesh(geom, wireMat);
    wire.userData = { id: id, name: MEDICAL_DATA[id].name, isOrgan: false };
    
    group.add(mesh);
    group.add(wire);
    group.position.set(x, y - 0.5, z);
    if (!isLeft) {
        group.scale.x = -1; // Mirror right arm horizontally
    }
    return group;
}

/**
 * Construct Articulated Muscular Leg Limb
 */
function createLeg(id, x, y, z, bodyMat, wireMat, isLeft) {
    const group = new THREE.Group();
    const geom = createRealisticLegGeom();
    
    const mesh = new THREE.Mesh(geom, bodyMat);
    mesh.userData = { id: id, name: MEDICAL_DATA[id].name, isOrgan: false };
    const wire = new THREE.Mesh(geom, wireMat);
    wire.userData = { id: id, name: MEDICAL_DATA[id].name, isOrgan: false };
    
    group.add(mesh);
    group.add(wire);
    group.position.set(x, y - 1.2, z);
    if (!isLeft) {
        group.scale.x = -1; // Mirror right leg horizontally
    }
    return group;
}

/**
 * Organ Visibility Filter
 */
function applyOrganVisibilityFilter(mode) {
    const labelsCheckbox = document.getElementById('toggle-labels-checkbox');
    const showLabels = labelsCheckbox ? labelsCheckbox.checked : true;

    for (const key in organMeshes) {
        const mesh = organMeshes[key];
        const dataKey = mesh.userData.id;
        const organData = MEDICAL_DATA[dataKey];

        let isVisible = true;
        if (mode === 'problem') {
            isVisible = organData && organData.hasProblem === true;
        } else if (mode === 'all') {
            isVisible = true;
        }
        mesh.visible = isVisible;

        // Synchronize annotation arrow and label visibility
        if (annotationObjects[dataKey]) {
            annotationObjects[dataKey].arrow.visible = isVisible && showLabels;
            annotationObjects[dataKey].label.visible = isVisible && showLabels;
        }
    }
}

/**
 * Outer Torso Opacity Slider Adjustment
 */
function setTorsoOpacity(opacityValue) {
    const normOpacity = opacityValue / 100;
    torsoMaterials.forEach(mat => {
        if (mat.wireframe) {
            mat.opacity = Math.max(0.05, normOpacity * 0.4);
        } else {
            mat.opacity = normOpacity;
        }
    });
}

/**
 * Animation & Organ Pulsing Loop
 */
function animate(time) {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // 1. Update Tween.js for camera animations
    TWEEN.update();

    // 2. Orbit Controls update
    controls.update();

    // 3. Dynamic Organ Animations
    if (organMeshes["heart"] && organMeshes["heart"].visible) {
        // Double beat cardiac simulation
        const beat = Math.sin(elapsed * 6) * Math.pow(Math.sin(elapsed * 3), 2);
        const scale = 1 + beat * 0.12;
        organMeshes["heart"].scale.set(scale, scale * 1.05, scale);
        if (organMaterials["heart"]) {
            organMaterials["heart"].emissiveIntensity = 0.5 + beat * 0.4;
        }
    }

    if (organMeshes["lungs"] && organMeshes["lungs"].visible) {
        // Respiratory breathing expansion
        const breath = Math.sin(elapsed * 2) * 0.06;
        organMeshes["lungs"].scale.set(1 + breath, 1 + breath * 0.5, 1 + breath);
        if (organMeshes["lungs_right"]) {
            organMeshes["lungs_right"].scale.set(1 + breath, 1 + breath * 0.5, 1 + breath);
        }
    }

    if (organMeshes["stomach"] && organMeshes["stomach"].visible) {
        // Subtle warning pulse
        const pulse = Math.sin(elapsed * 4) * 0.05;
        organMeshes["stomach"].scale.set(1 + pulse, 1, 1 + pulse);
    }

    if (organMeshes["right_kidney"] && organMeshes["right_kidney"].visible) {
        // Alert warning glow pulse
        const glow = Math.sin(elapsed * 5) * 0.3;
        if (organMaterials["right_kidney"]) {
            organMaterials["right_kidney"].emissiveIntensity = 0.5 + glow;
        }
    }

    renderer.render(scene, camera);
    if (labelRenderer) {
        labelRenderer.render(scene, camera);
    }
}

/**
 * Raycasting & Interaction Handlers
 */
function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Collect all visible meshes in humanGroup
    const intersectable = [];
    humanGroup.traverse(child => {
        if (child.isMesh && child.visible && child.userData && child.userData.id) {
            intersectable.push(child);
        }
    });

    const intersects = raycaster.intersectObjects(intersectable, false);

    const tooltip = document.getElementById('hover-tooltip');
    const tooltipTitle = document.getElementById('tooltip-title');
    const tooltipStatus = document.getElementById('tooltip-status');
    const tooltipIcon = document.getElementById('tooltip-icon');

    if (intersects.length > 0) {
        // Find closest object
        const hit = intersects[0].object;
        const id = hit.userData.id;
        const data = MEDICAL_DATA[id];

        if (data) {
            // Update tooltip position & content
            tooltip.style.left = (event.clientX - rect.left + 20) + 'px';
            tooltip.style.top = (event.clientY - rect.top + 20) + 'px';
            tooltipTitle.textContent = data.name;
            tooltipStatus.textContent = `Status: ${data.status} • Click for history`;
            tooltipIcon.className = data.icon || 'ri-pulse-line';
            tooltipIcon.style.color = data.statusColor || '#00f5d4';
            tooltip.classList.remove('hidden');

            // Highlight hover effect
            if (hoveredMesh !== hit) {
                resetHoverEffect();
                hoveredMesh = hit;
                if (hit.material && hit.material.emissive) {
                    hit.currentEmissive = hit.material.emissiveIntensity;
                    hit.material.emissiveIntensity += 0.4;
                }
            }
            document.body.style.cursor = 'pointer';
            return;
        }
    }

    // No intersection
    tooltip.classList.add('hidden');
    resetHoverEffect();
    document.body.style.cursor = 'default';
}

function resetHoverEffect() {
    if (hoveredMesh && hoveredMesh.material && hoveredMesh.currentEmissive !== undefined) {
        hoveredMesh.material.emissiveIntensity = hoveredMesh.currentEmissive;
        hoveredMesh = null;
    }
}

function onMouseClick(event) {
    if (!hoveredMesh || !hoveredMesh.userData || !hoveredMesh.userData.id) return;

    const id = hoveredMesh.userData.id;
    focusCameraOnPart(id);

    // Trigger UI open in app.js
    if (window.openMedicalDossier) {
        window.openMedicalDossier(id);
    }
}

/**
 * Camera Tween Focus on selected Anatomy Part
 */
function focusCameraOnPart(partId) {
    selectedMeshId = partId;
    let targetPos = new THREE.Vector3(0, 2, 0);
    let camOffset = new THREE.Vector3(0, 2, 16);

    switch (partId) {
        case 'head':
        case 'brain':
            targetPos.set(0, 7.5, 0);
            camOffset.set(0, 7.5, 7);
            break;
        case 'chest':
        case 'heart':
        case 'lungs':
            targetPos.set(0, 4.2, 0);
            camOffset.set(0, 4.2, 9);
            break;
        case 'stomach':
        case 'liver':
            targetPos.set(0, 2.5, 0);
            camOffset.set(0, 2.5, 9);
            break;
        case 'abdomen':
        case 'right_kidney':
        case 'left_kidney':
            targetPos.set(0, 1.2, 0);
            camOffset.set(0, 1.2, 9);
            break;
        case 'left_arm':
            targetPos.set(2.4, 3.2, 0);
            camOffset.set(4, 3.2, 9);
            break;
        case 'right_arm':
            targetPos.set(-2.4, 3.2, 0);
            camOffset.set(-4, 3.2, 9);
            break;
        case 'left_leg':
            targetPos.set(0.85, -2.4, 0);
            camOffset.set(1.5, -2.4, 11);
            break;
        case 'right_leg':
            targetPos.set(-0.85, -2.4, 0);
            camOffset.set(-1.5, -2.4, 11);
            break;
    }

    // Smooth tween for controls target
    new TWEEN.Tween(controls.target)
        .to(targetPos, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

    // Smooth tween for camera position
    new TWEEN.Tween(camera.position)
        .to(camOffset, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(() => {
            controls.update();
        })
        .start();
}

/**
 * Reset Camera View to Full Body
 */
function resetCameraView() {
    selectedMeshId = null;
    new TWEEN.Tween(controls.target)
        .to({ x: 0, y: 2, z: 0 }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

    new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 3, z: 22 }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(() => {
            controls.update();
        })
        .start();
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    if (labelRenderer) {
        labelRenderer.setSize(width, height);
    }
}

/**
 * Create 3D Arrow Annotations & Holographic Name Labels for ALL 14 Parts
 */
function createAllAnnotations() {
    if (typeof THREE.CSS2DObject === 'undefined') return;

    const annotationsData = [
        // EXTERNAL ANATOMY
        { id: "head", target: [0, 7.5, 0], label: [3.8, 8.4, 0], colorStr: "#9d4edd", colorNum: 0x9d4edd, isOrgan: false },
        { id: "chest", target: [0, 3.8, 0], label: [4.6, 5.0, 0], colorStr: "#0077b6", colorNum: 0x0077b6, isOrgan: false },
        { id: "abdomen", target: [0, 0.7, 0], label: [-4.6, 0.2, 0], colorStr: "#0a9396", colorNum: 0x0a9396, isOrgan: false },
        { id: "left_arm", target: [2.4, 2.7, 0], label: [5.4, 2.7, 0], colorStr: "#00f5d4", colorNum: 0x00f5d4, isOrgan: false },
        { id: "right_arm", target: [-2.4, 2.7, 0], label: [-5.4, 2.7, 0], colorStr: "#4361ee", colorNum: 0x4361ee, isOrgan: false },
        { id: "left_leg", target: [0.85, -3.6, 0], label: [3.8, -3.6, 0], colorStr: "#7209b7", colorNum: 0x7209b7, isOrgan: false },
        { id: "right_leg", target: [-0.85, -3.6, 0], label: [-3.8, -3.6, 0], colorStr: "#48cae4", colorNum: 0x48cae4, isOrgan: false },

        // INTERNAL ORGANS
        { id: "brain", target: [0, 7.8, 0], label: [-3.8, 8.6, 0], colorStr: "#f72585", colorNum: 0xf72585, isOrgan: true },
        { id: "heart", target: [0.45, 4.2, 0.35], label: [3.6, 3.2, 2.2], colorStr: "#ff0055", colorNum: 0xff0055, isOrgan: true },
        { id: "lungs", target: [-0.95, 4.3, 0.1], label: [-4.2, 4.8, 1.8], colorStr: "#ff8c00", colorNum: 0xff8c00, isOrgan: true },
        { id: "stomach", target: [0.65, 2.3, 0.3], label: [4.2, 1.6, 2.0], colorStr: "#d90429", colorNum: 0xd90429, isOrgan: true },
        { id: "liver", target: [-0.65, 2.6, 0.25], label: [-4.2, 2.6, 2.0], colorStr: "#f4a261", colorNum: 0xf4a261, isOrgan: true },
        { id: "right_kidney", target: [-0.75, 1.5, -0.4], label: [-4.0, 0.8, -2.2], colorStr: "#ffb703", colorNum: 0xffb703, isOrgan: true },
        { id: "left_kidney", target: [0.75, 1.5, -0.4], label: [4.0, 0.6, -2.2], colorStr: "#70e000", colorNum: 0x70e000, isOrgan: true }
    ];

    annotationsData.forEach(item => {
        const targetVec = new THREE.Vector3(...item.target);
        const labelVec = new THREE.Vector3(...item.label);
        
        // 1. Create 3D Arrow pointing FROM label position TO target position
        const dir = new THREE.Vector3().subVectors(targetVec, labelVec).normalize();
        const dist = targetVec.distanceTo(labelVec);
        
        const arrowGroup = new THREE.Group();
        const arrowHelper = new THREE.ArrowHelper(dir, labelVec, dist, item.colorNum, 0.55, 0.3);
        if (arrowHelper.line && arrowHelper.line.material) {
            arrowHelper.line.material = new THREE.LineBasicMaterial({ color: item.colorNum, linewidth: 2, transparent: true, opacity: 0.9 });
        }
        if (arrowHelper.cone && arrowHelper.cone.material) {
            arrowHelper.cone.material = new THREE.MeshBasicMaterial({ color: item.colorNum });
        }
        arrowGroup.add(arrowHelper);
        humanGroup.add(arrowGroup);

        // 2. Create CSS2D HTML Label Badge
        const div = document.createElement('div');
        div.className = 'annotation-label';
        div.style.borderColor = item.colorStr;
        div.style.boxShadow = `0 6px 20px rgba(0,0,0,0.6), 0 0 16px ${item.colorStr}50`;

        const medData = MEDICAL_DATA[item.id];
        const icon = medData ? medData.icon : 'ri-focus-3-line';
        const name = medData ? medData.name.split(' (')[0] : item.id;
        const status = medData ? medData.status : 'Healthy';

        div.innerHTML = `
            <div class="annot-header" style="color: ${item.colorStr};">
                <i class="${icon}"></i>
                <span>${name}</span>
            </div>
            <div class="annot-sub">${status}</div>
            <div class="annot-arrow-indicator" style="color: ${item.colorStr};"><i class="ri-arrow-down-line"></i></div>
        `;

        div.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.focusCameraOnPart) window.focusCameraOnPart(item.id);
            if (window.openMedicalDossier) window.openMedicalDossier(item.id);
        });

        const labelObj = new THREE.CSS2DObject(div);
        labelObj.position.copy(labelVec);
        humanGroup.add(labelObj);

        annotationObjects[item.id] = {
            arrow: arrowGroup,
            label: labelObj,
            isOrgan: item.isOrgan
        };
    });
}

/**
 * Toggle visibility of all annotation labels & arrow marks
 */
function toggleAllAnnotations(show) {
    for (const key in annotationObjects) {
        const item = annotationObjects[key];
        if (item.isOrgan) {
            const mesh = organMeshes[key] || organMeshes[key === 'lungs' ? 'lungs' : key];
            const isMeshVisible = mesh ? mesh.visible : true;
            item.arrow.visible = show && isMeshVisible;
            item.label.visible = show && isMeshVisible;
        } else {
            item.arrow.visible = show;
            item.label.visible = show;
        }
    }
}

window.toggleAllAnnotations = toggleAllAnnotations;

