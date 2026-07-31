/**
 * BioPulse 3D - Patient Medical History Database
 * Patient: Alex Mercer (ID: BIO-88492)
 * Age: 34 | Gender: Male | Blood Type: O+
 */

const PATIENT_METADATA = {
    name: "Alex Mercer",
    id: "BIO-88492",
    age: 34,
    gender: "Male",
    bloodType: "O+",
    height: "182 cm",
    weight: "78 kg",
    lastUpdated: "2026-07-25",
    overallStatus: "Attention Required",
    healthScore: 74,
    allergies: ["Penicillin", "Dust Mites", "Pollen"],
    primaryPhysician: "Dr. Elena Rostova, MD (Cardiology & Internal Medicine)"
};

/**
 * Anatomical & Organ Data
 * Each entry represents a selectable 3D mesh in the human model.
 * isInternal: boolean indicating if it's inside the body cavity.
 * hasProblem: boolean indicating if there is an active medical condition.
 * Per user requirements: For internal organs, if hasProblem === false, they are hidden by default!
 */
const MEDICAL_DATA = {
    // ==========================================
    // INTERNAL ORGANS WITH PROBLEMS (VISIBLE)
    // ==========================================
    "heart": {
        name: "Heart (Cardiac System)",
        category: "Internal Organ",
        isInternal: true,
        hasProblem: true,
        status: "Critical Attention",
        statusColor: "#ff0055",
        icon: "ri-heart-pulse-fill",
        vitals: [
            { label: "Resting Heart Rate", value: "88 BPM", status: "Elevated", norm: "60-80 BPM" },
            { label: "Blood Pressure", value: "138/88 mmHg", status: "Stage 1 HTN", norm: "120/80 mmHg" },
            { label: "Ejection Fraction", value: "54%", status: "Borderline", norm: "55-70%" },
            { label: "Rhythm", value: "Paroxysmal Afib", status: "Irregular", norm: "Normal Sinus" }
        ],
        summary: "Patient diagnosed with Paroxysmal Atrial Fibrillation (Afib) and Stage 1 Essential Hypertension in late 2024. Experiencing intermittent palpitations during high-stress periods.",
        timeline: [
            {
                date: "15 Oct 2025",
                title: "Cardiology Follow-up & Holter Monitor",
                doctor: "Dr. Elena Rostova",
                description: "48-hour Holter monitor revealed 3 short episodes of asymptomatic atrial fibrillation lasting < 4 minutes each. Adjusted Metoprolol dosage to 50mg daily.",
                type: "Checkup",
                badge: "Diagnostic"
            },
            {
                date: "12 Jan 2025",
                title: "Echocardiogram Scan",
                doctor: "Dr. Marcus Vance",
                description: "Left ventricular structure normal. Mild left atrial enlargement noted (4.1 cm). No significant valvular regurgitation.",
                type: "Scan",
                badge: "Imaging"
            },
            {
                date: "03 Nov 2024",
                title: "Initial ER Visit - Acute Palpitations",
                doctor: "St. Jude Emergency Dept",
                description: "Presented with rapid heart rate (142 BPM) and mild dizziness after strenuous workout and caffeine intake. ECG confirmed Afib. Converted spontaneously in ER.",
                type: "Emergency",
                badge: "Critical"
            }
        ],
        medications: [
            { name: "Metoprolol Succinate", dose: "50 mg once daily", purpose: "Heart rate & rhythm control" },
            { name: "Apixaban (Eliquis)", dose: "5 mg twice daily", purpose: "Thromboembolism prevention" }
        ],
        aiNotes: "AI Risk Analysis: Moderate risk for recurrent arrhythmia. Recommend monitoring potassium/magnesium levels and avoiding excessive stimulants (>200mg caffeine/day)."
    },

    "lungs": {
        name: "Lungs (Respiratory System)",
        category: "Internal Organ",
        isInternal: true,
        hasProblem: true,
        status: "Moderate Warning",
        statusColor: "#ff8c00",
        icon: "ri-lungs-fill",
        vitals: [
            { label: "SpO2 (Oxygen Sat.)", value: "95%", status: "Normal", norm: "95-100%" },
            { label: "FEV1 / FVC Ratio", value: "72%", status: "Mild Obstruction", norm: "> 75%" },
            { label: "Resp. Rate", value: "18 /min", status: "Normal", norm: "12-20 /min" },
            { label: "Peak Flow", value: "480 L/min", status: "Reduced", norm: "520-600 L/min" }
        ],
        summary: "Chronic Asthmatic Bronchitis with allergic airway hyperresponsiveness. Triggered primarily by seasonal pollen and cold, dry air.",
        timeline: [
            {
                date: "10 Apr 2026",
                title: "Pulmonary Function Test (PFT)",
                doctor: "Dr. Sarah Lin (Pulmonology)",
                description: "Spirometry indicates mild reversible airflow obstruction. 15% improvement in FEV1 post-bronchodilator administration.",
                type: "Test",
                badge: "Lab Result"
            },
            {
                date: "22 Nov 2025",
                title: "Winter Asthma Exacerbation",
                doctor: "Urgent Care Clinic",
                description: "Treated for acute wheezing and persistent cough following upper respiratory viral infection. Prescribed 5-day Prednisone taper and increased Albuterol use.",
                type: "Treatment",
                badge: "Intervention"
            },
            {
                date: "14 May 2023",
                title: "Comprehensive Allergy Panel",
                doctor: "Dr. Arthur Pendelton",
                description: "Skin prick test confirmed high sensitivity to Timothy grass pollen, ragweed, and dust mites. Initiated daily antihistamine therapy.",
                type: "Test",
                badge: "Diagnostic"
            }
        ],
        medications: [
            { name: "Fluticasone/Salmeterol (Advair)", dose: "250/50 mcg twice daily", purpose: "Maintenance steroid/bronchodilator" },
            { name: "Albuterol Sulfate Inhaler", dose: "90 mcg 1-2 puffs PRN", purpose: "Rescue inhaler for acute wheezing" }
        ],
        aiNotes: "AI Air Quality Alert: Current seasonal pollen count is HIGH in patient's region. Ensure Advair compliance and recommend HEPA air filtration at home."
    },

    "stomach": {
        name: "Stomach (Gastric & Digestive)",
        category: "Internal Organ",
        isInternal: true,
        hasProblem: true,
        status: "Moderate Warning",
        statusColor: "#d90429",
        icon: "ri-capsule-fill",
        vitals: [
            { label: "Gastric pH", value: "3.8", status: "Controlled", norm: "1.5 - 3.5" },
            { label: "H. Pylori Status", value: "Negative", status: "Eradicated", norm: "Negative" },
            { label: "Symptom Score", value: "3 / 10", status: "Mild Reflux", norm: "0 / 10" },
            { label: "Appetite Status", value: "Normal", status: "Stable", norm: "Normal" }
        ],
        summary: "History of Prepyloric Gastric Ulcer (diagnosed early 2025) and chronic Gastroesophageal Reflux Disease (GERD). Ulcer is currently healing under PPI therapy.",
        timeline: [
            {
                date: "18 Feb 2026",
                title: "Follow-up Upper Endoscopy (EGD)",
                doctor: "Dr. Kenji Sato (Gastroenterology)",
                description: "Previous 8mm prepyloric ulcer is now completely re-epithelialized with minimal residual scarring. Mild Grade A esophagitis still present in distal esophagus.",
                type: "Procedure",
                badge: "Imaging"
            },
            {
                date: "05 Jan 2025",
                title: "Diagnostic Endoscopy & Biopsy",
                doctor: "Dr. Kenji Sato",
                description: "Performed EGD due to persistent epigastric burning and nausea. Identified 8mm benign ulcer with active inflammation. Biopsy positive for Helicobacter pylori.",
                type: "Procedure",
                badge: "Critical"
            },
            {
                date: "06 Jan 2025",
                title: "H. Pylori Triple Therapy Regimen",
                doctor: "Dr. Kenji Sato",
                description: "Completed 14-day course of Amoxicillin, Clarithromycin, and high-dose Esomeprazole. Subsequent breath test in March confirmed eradication.",
                type: "Treatment",
                badge: "Intervention"
            }
        ],
        medications: [
            { name: "Omeprazole", dose: "20 mg daily before breakfast", purpose: "Proton Pump Inhibitor for GERD" },
            { name: "Famotidine", dose: "20 mg at bedtime PRN", purpose: "Nocturnal acid suppression" }
        ],
        aiNotes: "AI Dietary Recommendation: Avoid NSAIDs (ibuprofen, aspirin), late-night meals within 3 hours of sleep, and acidic triggers (citrus, tomato, alcohol) to maintain ulcer remission."
    },

    "right_kidney": {
        name: "Right Kidney (Renal System)",
        category: "Internal Organ",
        isInternal: true,
        hasProblem: true,
        status: "Attention Required",
        statusColor: "#ffb703",
        icon: "ri-water-flash-fill",
        vitals: [
            { label: "eGFR", value: "92 mL/min", status: "Normal", norm: "> 90 mL/min" },
            { label: "Serum Creatinine", value: "1.05 mg/dL", status: "Normal", norm: "0.74 - 1.35 mg/dL" },
            { label: "Calculus Size", value: "3.2 mm", status: "Non-obstructive", norm: "0 mm" },
            { label: "Hydration Status", value: "Sub-optimal", status: "Needs Intake", norm: "> 2.5 L/day" }
        ],
        summary: "Non-obstructive 3.2mm calcium oxalate calculus (kidney stone) located in the lower pole of the right kidney. Currently asymptomatic without hematuria.",
        timeline: [
            {
                date: "14 Mar 2026",
                title: "Renal & Bladder Ultrasound (KUB)",
                doctor: "Dr. Anita Desai (Urology)",
                description: "Ultrasound demonstrates stable 3.2mm echogenic focus with acoustic shadowing in right renal lower pole. No hydronephrosis or ureteral dilation observed.",
                type: "Scan",
                badge: "Imaging"
            },
            {
                date: "20 Aug 2025",
                title: "Urinalysis & 24-Hour Urine Collection",
                doctor: "Dr. Anita Desai",
                description: "24-hour urine showed mild hypocitraturia and low total urine volume (1.4L/day). Serum uric acid and calcium levels normal.",
                type: "Test",
                badge: "Lab Result"
            }
        ],
        medications: [
            { name: "Potassium Citrate", dose: "10 mEq twice daily", purpose: "Urine alkalization & stone prevention" }
        ],
        aiNotes: "AI Hydration Alert: Patient's recorded fluid intake is below target. Strongly advise increasing water intake to 3.0 Liters daily to promote spontaneous stone clearance and prevent enlargement."
    },

    // ==========================================
    // INTERNAL ORGANS WITHOUT PROBLEMS (HIDDEN BY DEFAULT)
    // ==========================================
    "brain": {
        name: "Brain & CNS (Neurological)",
        category: "Internal Organ",
        isInternal: true,
        hasProblem: false,
        status: "Healthy / Clear",
        statusColor: "#00f5d4",
        icon: "ri-brain-line",
        vitals: [
            { label: "Neurological Exam", value: "Intact", status: "Normal", norm: "Intact" },
            { label: "Cognitive Score", value: "30 / 30", status: "Optimal", norm: "28 - 30" },
            { label: "Sleep Duration", value: "7.2 hrs/night", status: "Healthy", norm: "7 - 9 hrs" },
            { label: "Stress Index", value: "Moderate", status: "Manageable", norm: "Low-Mod" }
        ],
        summary: "No active neurological pathology or structural abnormalities. History of occasional tension headaches related to prolonged screen exposure and eye strain.",
        timeline: [
            {
                date: "11 Sep 2025",
                title: "Routine Neurological Screening",
                doctor: "Dr. Viktor Vance",
                description: "Cranial nerves I-XII intact. Reflexes symmetric 2+ throughout. No cerebellar deficits or sensory abnormalities reported.",
                type: "Checkup",
                badge: "Routine"
            },
            {
                date: "04 May 2022",
                title: "Brain MRI with Contrast (Historical)",
                doctor: "Metro Diagnostics Center",
                description: "MRI performed to rule out organic causes for persistent tension headaches. Brain parenchyma normal, ventricles normal caliber. No aneurysms or demyelinating plaques.",
                type: "Scan",
                badge: "Historical"
            }
        ],
        medications: [
            { name: "Acetaminophen", dose: "500 mg PRN", purpose: "Occasional tension headache relief" }
        ],
        aiNotes: "AI Neurological Assessment: Brain health score is 98%. Maintain 20-20-20 eye rest rule during digital work to prevent headache triggers."
    },

    "liver": {
        name: "Liver & Biliary (Hepatic System)",
        category: "Internal Organ",
        isInternal: true,
        hasProblem: false,
        status: "Healthy / Clear",
        statusColor: "#00f5d4",
        icon: "ri-drop-line",
        vitals: [
            { label: "ALT / SGPT", value: "24 U/L", status: "Normal", norm: "7 - 56 U/L" },
            { label: "AST / SGOT", value: "21 U/L", status: "Normal", norm: "10 - 40 U/L" },
            { label: "Total Bilirubin", value: "0.8 mg/dL", status: "Normal", norm: "0.2 - 1.2 mg/dL" },
            { label: "Hepatic Fat Index", value: "< 5%", status: "Optimal", norm: "< 5%" }
        ],
        summary: "Hepatic function panel completely within normal limits. No evidence of fatty liver disease (NAFLD) or hepatomegaly.",
        timeline: [
            {
                date: "20 Jan 2026",
                title: "Comprehensive Metabolic Panel (CMP)",
                doctor: "Dr. Elena Rostova",
                description: "All liver enzymes (ALT, AST, ALP) and synthetic function markers (Albumin, Prothrombin time) are excellent. No hepatic inflammation.",
                type: "Test",
                badge: "Lab Result"
            }
        ],
        medications: [],
        aiNotes: "AI Hepatic Summary: Excellent metabolic clearance. Alcohol consumption reported as minimal (1-2 drinks/week), which supports sustained liver longevity."
    },

    "left_kidney": {
        name: "Left Kidney (Renal System)",
        category: "Internal Organ",
        isInternal: true,
        hasProblem: false,
        status: "Healthy / Clear",
        statusColor: "#00f5d4",
        icon: "ri-water-flash-line",
        vitals: [
            { label: "Morphology", value: "Normal", status: "Normal", norm: "Normal" },
            { label: "Cortical Thickness", value: "1.8 cm", status: "Normal", norm: "1.5 - 2.0 cm" },
            { label: "Blood Flow", value: "Normal Doppler", status: "Optimal", norm: "Normal" }
        ],
        summary: "Left kidney is anatomically normal, well-perfused, and free of nephrolithiasis (stones) or cysts.",
        timeline: [
            {
                date: "14 Mar 2026",
                title: "Bilateral Renal Ultrasound",
                doctor: "Dr. Anita Desai",
                description: "Left kidney measures 11.4 cm in longitudinal axis. Normal echogenicity and corticomedullary differentiation. No calculi or hydronephrosis.",
                type: "Scan",
                badge: "Imaging"
            }
        ],
        medications: [],
        aiNotes: "AI Renal Note: Left kidney is compensating well for right-sided calculus. Continue recommended 3L daily hydration."
    },

    // ==========================================
    // EXTERNAL BODY PARTS (ALWAYS VISIBLE OR CLICKABLE)
    // ==========================================
    "head": {
        name: "Head, Cranium & Neck",
        category: "External Anatomy",
        isInternal: false,
        hasProblem: false,
        status: "Healthy / Clear",
        statusColor: "#00f5d4",
        icon: "ri-user-smile-line",
        vitals: [
            { label: "Visual Acuity", value: "20/20", status: "Normal", norm: "20/20 corrected" },
            { label: "Hearing (Audiometry)", value: "Normal bilateral", status: "Intact", norm: "0 - 20 dB" },
            { label: "TMJ Joint", value: "No click", status: "Smooth", norm: "Normal" },
            { label: "Lymph Nodes", value: "Non-palpable", status: "Clear", norm: "Non-palpable" }
        ],
        summary: "Craniofacial structures intact. No cervical spine tenderness or lymphadenopathy. Optometry exam in 2025 confirmed mild astigmatism corrected with glasses.",
        timeline: [
            {
                date: "18 Oct 2025",
                title: "Annual Eye Examination",
                doctor: "Dr. Chloe Vance (Optometry)",
                description: "Prescription updated: OD -0.50, OS -0.75 with slight cylinder correction. Retina and intraocular pressure (IOP: 14 mmHg bilateral) completely normal.",
                type: "Checkup",
                badge: "Routine"
            },
            {
                date: "10 Jul 2024",
                title: "Dental Hygiene & Panoramic X-Ray",
                doctor: "Apex Dental Studio",
                description: "No active caries or periodontal disease. Wisdom teeth (3rd molars) surgically extracted in 2016 without complications.",
                type: "Checkup",
                badge: "Dental"
            }
        ],
        medications: [],
        aiNotes: "AI Head & Neck Summary: No structural or inflammatory issues detected. Ensure ergonomic monitor positioning to prevent cervical neck tension."
    },

    "chest": {
        name: "Thoracic Cavity & Ribcage (Chest)",
        category: "External Anatomy",
        isInternal: false,
        hasProblem: false,
        status: "Healthy / Clear",
        statusColor: "#00f5d4",
        icon: "ri-shield-user-line",
        vitals: [
            { label: "Chest Wall Symmetry", value: "Symmetric", status: "Normal", norm: "Symmetric" },
            { label: "Musculoskeletal", value: "No tenderness", status: "Normal", norm: "Normal" },
            { label: "Skin Integrity", value: "Clear", status: "Normal", norm: "Intact" }
        ],
        summary: "External thoracic structure normal. Ribcage intact without history of fractures or costochondritis. Note: Protects internal cardiac and pulmonary systems.",
        timeline: [
            {
                date: "20 Jan 2026",
                title: "Annual Physical Examination",
                doctor: "Dr. Elena Rostova",
                description: "Chest expansion symmetric during respiration. No costochondral joint tenderness on palpation. Heart and lung auscultation noted separately under internal organs.",
                type: "Checkup",
                badge: "Routine"
            },
            {
                date: "15 Aug 2021",
                title: "Chest X-Ray (PA & Lateral)",
                doctor: "Metro Diagnostics",
                description: "Performed during athletic clearance. Normal cardiac silhouette, clear costophrenic angles, intact bony thorax without fractures.",
                type: "Scan",
                badge: "Historical"
            }
        ],
        medications: [],
        aiNotes: "AI Thoracic Overview: Musculoskeletal chest wall is healthy. Refer to internal Heart and Lung modules for active internal diagnoses."
    },

    "abdomen": {
        name: "Abdominal & Pelvic Wall",
        category: "External Anatomy",
        isInternal: false,
        hasProblem: false,
        status: "Healthy / Clear",
        statusColor: "#00f5d4",
        icon: "ri-body-scan-line",
        vitals: [
            { label: "Palpation", value: "Soft, non-tender", status: "Normal", norm: "Soft" },
            { label: "Bowel Sounds", value: "Normoactive", status: "Normal", norm: "Active" },
            { label: "Surgical Scars", value: "RLQ Appendectomy", status: "Healed", norm: "N/A" },
            { label: "Hernia Check", value: "Negative", status: "Intact", norm: "None" }
        ],
        summary: "Abdominal musculature soft and non-tender without guarding or rebound tenderness. Well-healed 4cm surgical scar in right lower quadrant from laparoscopic appendectomy in 2018.",
        timeline: [
            {
                date: "20 Jan 2026",
                title: "Abdominal Clinical Palpation",
                doctor: "Dr. Elena Rostova",
                description: "No hepatosplenomegaly or palpable abdominal masses. Hernia screening (inguinal and umbilical) negative.",
                type: "Checkup",
                badge: "Routine"
            },
            {
                date: "12 Jun 2018",
                title: "Laparoscopic Appendectomy (Historical)",
                doctor: "Dr. Robert Thorne (General Surgery)",
                description: "Emergency laparoscopic removal of acutely inflamed, non-perforated appendix. Uncomplicated post-operative recovery. Complete tissue healing.",
                type: "Surgery",
                badge: "Surgical Scar"
            }
        ],
        medications: [],
        aiNotes: "AI Abdominal Wall Note: Appendectomy scar is fully matured with no signs of incisional hernia. Abdominal wall stability is excellent."
    },

    "left_arm": {
        name: "Left Arm & Shoulder",
        category: "External Anatomy",
        isInternal: false,
        hasProblem: false,
        status: "Healthy / Clear (Rehabilitated)",
        statusColor: "#00f5d4",
        icon: "ri-hand-coin-line",
        vitals: [
            { label: "Shoulder ROM", value: "95% Full", status: "Functional", norm: "100%" },
            { label: "Grip Strength", value: "42 kg", status: "Normal", norm: "40 - 55 kg" },
            { label: "Reflexes (Biceps/Triceps)", value: "2+ Symmetric", status: "Normal", norm: "2+" },
            { label: "Radial Pulse", value: "Strong & Regular", status: "Normal", norm: "2+" }
        ],
        summary: "History of mild left supraspinatus (rotator cuff) tendinopathy incurred during recreational tennis in 2024. Successfully rehabilitated via physical therapy.",
        timeline: [
            {
                date: "30 Nov 2024",
                title: "Physical Therapy Discharge",
                doctor: "ProMotion Physical Therapy",
                description: "Completed 8-week rehabilitation protocol for left rotator cuff strain. Patient achieved 95% pain-free range of motion and full internal/external rotation strength.",
                type: "Rehab",
                badge: "Recovery"
            },
            {
                date: "04 Sep 2024",
                title: "Shoulder Ultrasound & Ortho Consult",
                doctor: "Dr. Greg Sterling (Orthopedics)",
                description: "Ultrasound showed mild thickening and fluid around the supraspinatus tendon without full-thickness tear. Recommended conservative PT management.",
                type: "Scan",
                badge: "Injury"
            }
        ],
        medications: [
            { name: "Topical Diclofenac Gel 1%", dose: "Apply to left shoulder PRN after intense sport", purpose: "Local anti-inflammatory" }
        ],
        aiNotes: "AI Musculoskeletal Note: Left shoulder rehabilitation successful. Advise continuing rotator cuff strengthening exercises with light resistance bands before racket sports."
    },

    "right_arm": {
        name: "Right Arm & Hand (Dominant)",
        category: "External Anatomy",
        isInternal: false,
        hasProblem: false,
        status: "Healthy / Clear",
        statusColor: "#00f5d4",
        icon: "ri-hand-heart-line",
        vitals: [
            { label: "Grip Strength", value: "48 kg", status: "Optimal", norm: "45 - 60 kg" },
            { label: "Elbow / Wrist ROM", value: "100% Full", status: "Normal", norm: "100%" },
            { label: "Tinel's / Phalen's Test", value: "Negative", status: "No Carpal Tunnel", norm: "Negative" },
            { label: "Radial Pulse", value: "Strong (2+)", status: "Normal", norm: "2+" }
        ],
        summary: "Dominant right upper extremity is structurally intact with full range of motion, normal neurological sensation, and no history of fractures or repetitive strain injuries.",
        timeline: [
            {
                date: "20 Jan 2026",
                title: "Upper Extremity Functional Screening",
                doctor: "Dr. Elena Rostova",
                description: "Normal muscle bulk and tone. No epicondylitis (tennis/golfer's elbow) tenderness. Peripheral vascular perfusion brisk with capillary refill < 2 seconds.",
                type: "Checkup",
                badge: "Routine"
            }
        ],
        medications: [],
        aiNotes: "AI Extremity Summary: Dominant right arm is in peak musculoskeletal condition. No interventions needed."
    },

    "left_leg": {
        name: "Left Leg, Knee & Foot",
        category: "External Anatomy",
        isInternal: false,
        hasProblem: false,
        status: "Healthy / Clear (Reconstructed ACL)",
        statusColor: "#00f5d4",
        icon: "ri-walk-line",
        vitals: [
            { label: "Knee Stability (Lachman)", value: "Grade 0 (Firm)", status: "Stable", norm: "Stable" },
            { label: "Quadriceps Strength", value: "5 / 5", status: "Optimal", norm: "5 / 5" },
            { label: "Ankle ROM", value: "Normal", status: "Normal", norm: "Normal" },
            { label: "Pedal Pulses (DP/PT)", value: "2+ Palpable", status: "Normal", norm: "2+" }
        ],
        summary: "History of left Anterior Cruciate Ligament (ACL) reconstruction (patellar tendon autograft) in May 2021 following a skiing accident. Joint is fully stable with excellent biomechanical function.",
        timeline: [
            {
                date: "12 May 2024",
                title: "3-Year Post-Op Orthopedic Checkup",
                doctor: "Dr. Greg Sterling",
                description: "Lachman and anterior drawer tests demonstrate rock-solid ACL graft stability. No joint effusion or patellofemoral crepitus. Patient cleared for all high-impact sports.",
                type: "Checkup",
                badge: "Surgical Clearance"
            },
            {
                date: "18 May 2021",
                title: "Arthroscopic ACL Reconstruction",
                doctor: "Dr. Greg Sterling (St. Jude Ortho)",
                description: "Successful arthroscopic reconstruction of complete left ACL tear using bone-patellar tendon-bone autograft. Minor lateral meniscal fraying trimmed. Uncomplicated 9-month rehab.",
                type: "Surgery",
                badge: "Major Surgery"
            }
        ],
        medications: [],
        aiNotes: "AI Biomechanical Assessment: Left knee ACL graft has reached full biological maturation. Joint function is equivalent to uninjured contralateral leg."
    },

    "right_leg": {
        name: "Right Leg, Knee & Foot",
        category: "External Anatomy",
        isInternal: false,
        hasProblem: false,
        status: "Healthy / Clear",
        statusColor: "#00f5d4",
        icon: "ri-run-line",
        vitals: [
            { label: "Joint Stability", value: "Intact", status: "Normal", norm: "Intact" },
            { label: "Hamstring/Quad Strength", value: "5 / 5", status: "Optimal", norm: "5 / 5" },
            { label: "Gait Analysis", value: "Symmetric", status: "Normal", norm: "Symmetric" },
            { label: "Pedal Pulses", value: "2+ Palpable", status: "Normal", norm: "2+" }
        ],
        summary: "Right lower extremity is anatomically normal without history of ligamentous injury, deep vein thrombosis (DVT), or joint degeneration.",
        timeline: [
            {
                date: "20 Jan 2026",
                title: "Lower Extremity Vascular & Neuro Exam",
                doctor: "Dr. Elena Rostova",
                description: "Normal peripheral arterial circulation, no varicose veins or peripheral edema. Reflexes (patellar and Achilles) 2+ bilateral. Normal plantar flexion.",
                type: "Checkup",
                badge: "Routine"
            }
        ],
        medications: [],
        aiNotes: "AI Biomechanical Summary: Right leg demonstrates flawless musculoskeletal health and symmetric weight distribution."
    },

    // ==========================================
    // SPLANCHNOLOGY — REAL GLTF MODEL ENTRIES
    // ==========================================

    "splanchnology_bone": {
        name: "Skeletal Framework",
        category: "Musculoskeletal System",
        isInternal: true,
        hasProblem: false,
        status: "Structurally Normal",
        statusColor: "#10b981",
        icon: "ri-building-line",
        vitals: [
            { label: "Bone Mineral Density", value: "1.12 g/cm²", status: "Normal", norm: "≥1.0 g/cm²" },
            { label: "T-Score (DEXA)", value: "+0.4", status: "Normal", norm: "> −1.0" },
            { label: "Cortical Thickness", value: "6.2 mm", status: "Normal", norm: "5–8 mm" },
            { label: "Calcium (Serum)", value: "9.4 mg/dL", status: "Normal", norm: "8.5–10.5 mg/dL" }
        ],
        summary: "The skeletal framework visible in this splanchnology model includes the thoracic cage (ribs, sternum) and vertebral column. Bone serves as structural support, mineral reservoir (calcium/phosphate), and houses hematopoietic marrow. No evidence of osteoporosis, pathological fracture, or neoplastic invasion. Cortical density and trabecular architecture appear intact.",
        timeline: [
            { date: "10 Mar 2026", title: "DEXA Bone Density Scan", doctor: "Dr. Priya Nair (Endocrinology)", description: "Lumbar L1-L4 and femoral neck scanned. T-score +0.4 indicates above-average bone mineral density for age. No intervention required.", type: "Scan", badge: "Imaging" },
            { date: "15 Jun 2025", title: "Annual Physical — Skeletal Review", doctor: "Dr. Elena Rostova", description: "No bony tenderness on palpation. Full range of spinal motion. No crepitus at costovertebral joints.", type: "Checkup", badge: "Routine" }
        ],
        medications: [],
        aiNotes: "AI Skeletal Analysis: Bone density is above age-matched reference. Adequate calcium intake (estimated 1100 mg/day). No risk factors for fragility fracture. Vitamin D levels should be confirmed at next visit."
    },

    "splanchnology_bronchi": {
        name: "Bronchial Tree",
        category: "Respiratory System",
        isInternal: true,
        hasProblem: true,
        status: "Mild Obstruction",
        statusColor: "#ffb703",
        icon: "ri-windy-line",
        vitals: [
            { label: "FEV1 / FVC Ratio", value: "0.71", status: "Borderline", norm: ">0.75" },
            { label: "FEV1 (% Predicted)", value: "79%", status: "Mildly Reduced", norm: "≥80%" },
            { label: "Peak Expiratory Flow", value: "480 L/min", status: "Borderline", norm: "500–650 L/min" },
            { label: "Airway Resistance", value: "2.8 cmH₂O/L/s", status: "Elevated", norm: "<2.5 cmH₂O/L/s" }
        ],
        summary: "The bronchial tree comprises the left and right main bronchi bifurcating at the carina (T4 level), dividing into lobar and segmental bronchi. In the context of the patient's known asthmatic bronchitis, mild mucosal edema and increased mucous secretion reduce luminal diameter in medium-caliber bronchi. CT showed no bronchiectasis or endobronchial lesions.",
        timeline: [
            { date: "22 Apr 2026", title: "Pulmonary Function Test (Spirometry)", doctor: "Dr. Kwame Asante (Pulmonology)", description: "Mild obstructive pattern with post-bronchodilator improvement of 14% in FEV1 confirming reversible airway obstruction consistent with asthma. DLCO within normal range.", type: "Test", badge: "Diagnostic" },
            { date: "11 Dec 2025", title: "HRCT Chest", doctor: "Radiology Dept", description: "No bronchiectasis, consolidation, or central airway narrowing. Mild air-trapping on expiratory phase. No mediastinal lymphadenopathy.", type: "Scan", badge: "Imaging" }
        ],
        medications: [
            { name: "Salbutamol MDI", dose: "100 mcg PRN (up to 4×/day)", purpose: "Acute bronchospasm relief" },
            { name: "Budesonide/Formoterol", dose: "160/4.5 mcg — 1 puff BID", purpose: "Maintenance airway control" }
        ],
        aiNotes: "AI Respiratory Analysis: Mild obstructive ventilatory defect with bronchodilator reversibility consistent with mild persistent asthma. Recommend FeNO testing and allergy skin prick panel to optimize controller therapy."
    },

    "splanchnology_cartilage": {
        name: "Tracheal Cartilage",
        category: "Respiratory Framework",
        isInternal: true,
        hasProblem: false,
        status: "Structurally Normal",
        statusColor: "#10b981",
        icon: "ri-record-circle-line",
        vitals: [
            { label: "Tracheal Diameter", value: "17 mm", status: "Normal", norm: "14–22 mm" },
            { label: "Ring Integrity", value: "C-shaped, Intact", status: "Normal", norm: "Complete rings" },
            { label: "Calcification", value: "Absent", status: "Normal", norm: "None (age <40)" },
            { label: "Tracheal Deviation", value: "Midline", status: "Normal", norm: "Midline" }
        ],
        summary: "The tracheal cartilaginous rings (16–20 C-shaped hyaline cartilage rings) maintain airway patency between the larynx and the carina. They prevent airway collapse during respiratory cycle. No evidence of tracheomalacia, stenosis, or extrinsic compression from adjacent structures.",
        timeline: [
            { date: "11 Dec 2025", title: "CT Airway Reconstruction", doctor: "Radiology Dept", description: "3D airway rendering shows patent tracheal lumen with intact C-shaped cartilage rings throughout cervical and thoracic segments. Normal tracheal bifurcation angle.", type: "Scan", badge: "Imaging" }
        ],
        medications: [],
        aiNotes: "AI Airway Analysis: Tracheal caliber and cartilaginous support are within normal limits. No dynamic collapse on virtual bronchoscopy reconstruction."
    },

    "splanchnology_larynx": {
        name: "Laryngeal Cartilage",
        category: "Upper Respiratory Tract",
        isInternal: true,
        hasProblem: false,
        status: "Normal Function",
        statusColor: "#10b981",
        icon: "ri-mic-2-line",
        vitals: [
            { label: "Vocal Cord Motion", value: "Symmetric", status: "Normal", norm: "Bilateral mobile" },
            { label: "Glottic Opening", value: "8 mm (rest)", status: "Normal", norm: "5–12 mm" },
            { label: "Thyroid Cartilage", value: "Intact", status: "Normal", norm: "Intact" },
            { label: "Cricoid Pressure Point", value: "Non-tender", status: "Normal", norm: "Non-tender" }
        ],
        summary: "The laryngeal cartilaginous skeleton — thyroid, cricoid, epiglottis, and arytenoids — protects the lower airway and facilitates phonation. Flexible laryngoscopy performed as part of ENT review following occasional hoarseness reported by patient shows bilateral vocal fold mobility without evidence of paresis or mucosal lesion.",
        timeline: [
            { date: "05 Feb 2026", title: "Flexible Nasolaryngoscopy", doctor: "Dr. Sara Kim (ENT)", description: "Normal laryngeal anatomy. Bilateral true vocal fold mobility preserved. Minimal posterior glottic erythema consistent with laryngopharyngeal reflux (LPR). Advised dietary modifications.", type: "Procedure", badge: "Diagnostic" }
        ],
        medications: [
            { name: "Pantoprazole", dose: "40 mg before breakfast", purpose: "LPR / acid reflux management" }
        ],
        aiNotes: "AI ENT Analysis: Laryngeal structure intact. Mild LPR-related mucosal irritation. No polyps or granulomas detected. Recommend dietary reflux precautions and follow-up laryngoscopy in 6 months if hoarseness persists."
    },

    "splanchnology_connective": {
        name: "Connective Tissue",
        category: "Supporting Framework",
        isInternal: true,
        hasProblem: false,
        status: "Normal",
        statusColor: "#10b981",
        icon: "ri-node-tree",
        vitals: [
            { label: "Collagen Synthesis", value: "Normal", status: "Normal", norm: "Normal" },
            { label: "ANA Screen", value: "Negative", status: "Normal", norm: "Negative" },
            { label: "CRP (Inflammatory)", value: "3.1 mg/L", status: "Normal", norm: "<5 mg/L" },
            { label: "Fibrinogen", value: "2.8 g/L", status: "Normal", norm: "2–4 g/L" }
        ],
        summary: "Connective tissue forms the structural stroma of all organs, comprising collagen, elastin fibers, ground substance, and fibroblasts. It provides mechanical support, tissue cohesion, and vascular conduits. No evidence of connective tissue disorder (e.g., Marfan syndrome, Ehlers-Danlos), autoimmune disease, or systemic fibrosis.",
        timeline: [
            { date: "18 Jan 2026", title: "Autoimmune & Rheumatology Screen", doctor: "Dr. Farida Malik (Rheumatology)", description: "ANA, anti-dsDNA, ANCA, RF all negative. ESR 11 mm/hr. No clinical features of systemic connective tissue disease.", type: "Test", badge: "Routine" }
        ],
        medications: [],
        aiNotes: "AI Analysis: No markers of connective tissue disease. Normal inflammatory profile. Continue annual screening given family history awareness."
    },

    "splanchnology_ducts": {
        name: "Bile & Hepatic Ducts",
        category: "Hepatobiliary System",
        isInternal: true,
        hasProblem: false,
        status: "Patent & Normal",
        statusColor: "#10b981",
        icon: "ri-flow-chart",
        vitals: [
            { label: "Common Bile Duct Diameter", value: "4.1 mm", status: "Normal", norm: "<6 mm" },
            { label: "ALT (Liver Enzyme)", value: "28 U/L", status: "Normal", norm: "7–56 U/L" },
            { label: "Bilirubin (Total)", value: "0.8 mg/dL", status: "Normal", norm: "<1.2 mg/dL" },
            { label: "Alkaline Phosphatase", value: "72 U/L", status: "Normal", norm: "44–147 U/L" }
        ],
        summary: "The biliary ductal system — comprising intrahepatic bile ducts, left/right hepatic ducts, common hepatic duct, cystic duct and common bile duct (CBD) — transports bile from hepatocytes to the duodenum. No gallstones, biliary sludge, stricture, or dilation noted on abdominal ultrasound. Sphincter of Oddi function presumed intact given normal post-prandial biliary pressure.",
        timeline: [
            { date: "02 Mar 2026", title: "Upper Abdominal Ultrasound", doctor: "Radiology", description: "Gallbladder appears normal without wall thickening or sludge. CBD measures 4.1 mm. No intrahepatic ductal dilation. Normal flow in portal vein on Doppler.", type: "Scan", badge: "Imaging" }
        ],
        medications: [],
        aiNotes: "AI Hepatobiliary Analysis: Biliary tree is patent without obstruction or dilation. Liver function tests within normal range. Gallbladder appears healthy."
    },

    "splanchnology_glands": {
        name: "Endocrine Glands",
        category: "Endocrine System",
        isInternal: true,
        hasProblem: false,
        status: "Hormonal Balance Normal",
        statusColor: "#10b981",
        icon: "ri-test-tube-line",
        vitals: [
            { label: "TSH (Thyroid)", value: "1.8 mIU/L", status: "Normal", norm: "0.5–4.5 mIU/L" },
            { label: "Free T4", value: "1.2 ng/dL", status: "Normal", norm: "0.8–1.8 ng/dL" },
            { label: "Cortisol (AM)", value: "16.4 μg/dL", status: "Normal", norm: "10–20 μg/dL" },
            { label: "Thyroid Volume", value: "11 mL", status: "Normal", norm: "7–15 mL" }
        ],
        summary: "Visible glandular structures include the thyroid gland (bilobed, anterior neck) and adrenal glands (suprarenal). The thyroid regulates metabolic rate via T3/T4; adrenal glands produce cortisol (stress response) and aldosterone (fluid homeostasis). Thyroid ultrasound shows no nodules >5 mm. Adrenal glands are not enlarged.",
        timeline: [
            { date: "14 Feb 2026", title: "Thyroid Function Panel & US", doctor: "Dr. Priya Nair", description: "TSH and free T4 both normal. Thyroid ultrasound: no nodules, normal echogenicity, no vascular abnormality. No cervical lymphadenopathy.", type: "Test", badge: "Routine" }
        ],
        medications: [],
        aiNotes: "AI Endocrine Analysis: Thyroid and adrenal function are optimal. No evidence of hypo/hyperthyroidism or adrenal insufficiency. Recommend continued annual TSH monitoring."
    },

    "splanchnology_intestine": {
        name: "Intestinal Tract",
        category: "Gastrointestinal System",
        isInternal: true,
        hasProblem: true,
        status: "Chronic Inflammation",
        statusColor: "#ff8c00",
        icon: "ri-loader-4-line",
        vitals: [
            { label: "Transit Time (Total)", value: "28 hrs", status: "Normal", norm: "24–72 hrs" },
            { label: "Calprotectin (Stool)", value: "88 mg/kg", status: "Elevated", norm: "<50 mg/kg" },
            { label: "Haemoglobin", value: "13.9 g/dL", status: "Normal", norm: "13.5–17.5 g/dL" },
            { label: "Vitamin B12", value: "310 pg/mL", status: "Normal", norm: "200–900 pg/mL" }
        ],
        summary: "The small intestine (duodenum, jejunum, ileum — ~6 m) performs digestion and nutrient absorption; the large intestine (caecum, colon, rectum — ~1.5 m) handles water reabsorption and stool formation. Mild elevation in fecal calprotectin suggests subclinical mucosal inflammation. Colonoscopy in 2025 showed mild sigmoid diverticulosis without active bleeding or polyposis.",
        timeline: [
            { date: "08 Sep 2025", title: "Colonoscopy & Ileoscopy", doctor: "Dr. Lila Okonkwo (Gastroenterology)", description: "3 small sigmoid diverticula (5–7 mm) without inflammation. Terminal ileum appears normal. No polyps. Biopsies from colon wall: mild chronic non-specific inflammation.", type: "Procedure", badge: "Diagnostic" },
            { date: "22 Jun 2025", title: "Stool & Microbiology Panel", doctor: "Gastroenterology Lab", description: "Fecal calprotectin 88 mg/kg (slightly elevated). No pathogens on stool culture. H. pylori breath test negative.", type: "Test", badge: "Diagnostic" }
        ],
        medications: [
            { name: "Psyllium Husk (Isabgol)", dose: "5 g once daily with water", purpose: "Diverticulosis — dietary fiber supplementation" }
        ],
        aiNotes: "AI GI Analysis: Mild sigmoid diverticulosis with borderline fecal inflammatory marker. High-fiber diet and adequate hydration recommended. Colonoscopy surveillance in 5 years or earlier if symptoms arise."
    },

    "splanchnology_ligament": {
        name: "Peritoneal Ligaments & Mesentery",
        category: "Abdominal Suspensory Structures",
        isInternal: true,
        hasProblem: false,
        status: "Intact",
        statusColor: "#10b981",
        icon: "ri-links-line",
        vitals: [
            { label: "Mesenteric Vascularity", value: "Normal Flow", status: "Normal", norm: "Normal Doppler" },
            { label: "Omentum Thickness", value: "8 mm", status: "Normal", norm: "<12 mm" },
            { label: "Peritoneal Fat", value: "Normal", status: "Normal", norm: "No omental cake" },
            { label: "Free Fluid (Abdomen)", value: "None", status: "Normal", norm: "None" }
        ],
        summary: "Peritoneal ligaments (falciform, gastrosplenic, hepatoduodenal, etc.) and the mesentery suspend and anchor the abdominal organs, conveying neurovascular supply. The greater omentum acts as an immune and inflammatory sentinel. No evidence of mesenteric lymphadenitis, retractile mesenteritis, or free peritoneal fluid on imaging.",
        timeline: [
            { date: "02 Mar 2026", title: "Abdominal CT with Contrast", doctor: "Radiology Dept", description: "Mesentery shows normal fat density without thickening or 'misty mesentery' sign. No lymphadenopathy. Omentum is normal in thickness and attenuation.", type: "Scan", badge: "Imaging" }
        ],
        medications: [],
        aiNotes: "AI Peritoneal Analysis: Mesenteric and ligamentous structures appear normal. No ascites or inflammation. Adequate vascular supply to all bowel loops confirmed on Doppler."
    },

    "splanchnology_lungs": {
        name: "Lung Parenchyma",
        category: "Respiratory System",
        isInternal: true,
        hasProblem: true,
        status: "Asthmatic Bronchitis",
        statusColor: "#ff8c00",
        icon: "ri-lungs-line",
        vitals: [
            { label: "SpO₂ (Rest)", value: "97%", status: "Normal", norm: "≥95%" },
            { label: "SpO₂ (Exertion)", value: "94%", status: "Borderline", norm: "≥95%" },
            { label: "Respiratory Rate", value: "16 breaths/min", status: "Normal", norm: "12–20/min" },
            { label: "DLCO (Diffusion)", value: "78% predicted", status: "Borderline", norm: "≥80%" }
        ],
        summary: "The lungs — right (3 lobes) and left (2 lobes) — perform gas exchange via ~300 million alveoli. Total lung surface area ~70 m². In this patient, mild persistent asthma causes episodic bronchospasm and mucus hypersecretion. HRCT shows no bronchiectasis, nodules, or interstitial lung disease. Slight reduction in exercise SpO₂ warrants monitoring.",
        timeline: [
            { date: "22 Apr 2026", title: "Complete PFTs + DLCO", doctor: "Dr. Kwame Asante", description: "TLC and RV are at upper limit of normal (mild hyperinflation). FEV1/FVC 0.71 post-BD. DLCO 78% — borderline. No restrictive pattern.", type: "Test", badge: "Diagnostic" },
            { date: "11 Dec 2025", title: "HRCT Chest", doctor: "Radiology Dept", description: "Bilateral lung parenchyma within normal limits. No fibrosis, emphysema, or ground-glass opacity. Mild bronchial wall thickening bilaterally consistent with asthmatic changes.", type: "Scan", badge: "Imaging" }
        ],
        medications: [
            { name: "Budesonide/Formoterol (Symbicort)", dose: "160/4.5 mcg — 1 puff BID", purpose: "Inhaled corticosteroid + LABA for asthma control" },
            { name: "Salbutamol (Ventolin)", dose: "100 mcg PRN", purpose: "Rescue bronchodilator" }
        ],
        aiNotes: "AI Pulmonary Analysis: Mild persistent asthma with borderline exercise desaturation. Consider pulmonary rehabilitation and spirometry quarterly. Exercise-induced bronchoconstriction protocol recommended for gym sessions."
    },

    "splanchnology_mucosa": {
        name: "Mucosal Lining",
        category: "Gastrointestinal System",
        isInternal: true,
        hasProblem: true,
        status: "GERD — Chronic Irritation",
        statusColor: "#ffb703",
        icon: "ri-contrast-drop-line",
        vitals: [
            { label: "Esophageal pH (24h)", value: "DeMeester 16.8", status: "Borderline", norm: "<14.7" },
            { label: "Pepsin (Saliva)", value: "Positive", status: "Elevated", norm: "Negative" },
            { label: "H. pylori Breath Test", value: "Negative", status: "Normal", norm: "Negative" },
            { label: "Gastric Mucosa Grade", value: "Grade A Erosions", status: "Mild", norm: "Normal" }
        ],
        summary: "The mucosal lining of the gastrointestinal tract — gastric mucosa, intestinal villi, colonic mucosa — provides a protective epithelial barrier and absorptive surface. Upper GI endoscopy revealed Grade A erosive esophagitis (Los Angeles Classification) and mild antral gastritis. H. pylori negative. Findings consistent with GERD and the patient's known prepyloric ulcer history.",
        timeline: [
            { date: "14 Jan 2026", title: "Upper GI Endoscopy (OGD)", doctor: "Dr. Lila Okonkwo", description: "Grade A erosive esophagitis at Z-line. Antral mucosa mildly erythematous. No active peptic ulcer or Barrett's metaplasia. Biopsies taken — pathology confirms chronic gastritis, H. pylori negative.", type: "Procedure", badge: "Diagnostic" }
        ],
        medications: [
            { name: "Pantoprazole", dose: "40 mg once daily before meals", purpose: "PPI — acid suppression for GERD/erosions" },
            { name: "Sucralfate", dose: "1 g TID before meals", purpose: "Mucosal cytoprotectant" }
        ],
        aiNotes: "AI GI Mucosa Analysis: Active Grade A erosive esophagitis requiring ongoing PPI therapy. Recommend lifestyle modifications (weight management, head-of-bed elevation, avoiding late meals). Repeat OGD in 8–12 weeks to confirm healing."
    },

    "splanchnology_muscles": {
        name: "Smooth Visceral Muscle",
        category: "Musculovisceral System",
        isInternal: true,
        hasProblem: false,
        status: "Normal Tone",
        statusColor: "#10b981",
        icon: "ri-fitness-line",
        vitals: [
            { label: "Bowel Peristalsis", value: "Active (3–5/min)", status: "Normal", norm: "3–5 sounds/min" },
            { label: "Esophageal Motility", value: "Normal Peristalsis", status: "Normal", norm: "Normal" },
            { label: "Bladder Detrusor", value: "Normotonic", status: "Normal", norm: "Normotonic" },
            { label: "CK-MM (Serum)", value: "88 U/L", status: "Normal", norm: "38–174 U/L" }
        ],
        summary: "Smooth (involuntary) muscle within the walls of hollow viscera — gastrointestinal tract, bladder, uterus, vascular walls — generates the peristaltic and tonic contractions that propel luminal contents. High-resolution esophageal manometry and anorectal manometry are normal. No evidence of achalasia, intestinal dysmotility, or detrusor instability.",
        timeline: [
            { date: "30 Nov 2025", title: "High-Resolution Esophageal Manometry", doctor: "Dr. Lila Okonkwo", description: "Integrated relaxation pressure 9 mmHg (normal). Peristalsis 90% intact swallows. No spasm or aperistalsis. Chicago Classification v4.0: Normal.", type: "Test", badge: "Diagnostic" }
        ],
        medications: [],
        aiNotes: "AI Motility Analysis: Gastrointestinal smooth muscle motility is intact. No evidence of dysmotility syndrome. Maintain adequate hydration and dietary fiber for optimal peristaltic function."
    },

    "splanchnology_organs": {
        name: "Solid Organs",
        category: "Hepatosplenic & Renal System",
        isInternal: true,
        hasProblem: true,
        status: "Renal Calculus — Monitored",
        statusColor: "#ffb703",
        icon: "ri-water-flash-line",
        vitals: [
            { label: "Liver Size", value: "14.2 cm (span)", status: "Normal", norm: "10–15 cm" },
            { label: "Spleen Size", value: "9.8 cm", status: "Normal", norm: "<12 cm" },
            { label: "Renal Calculus (Rt.)", value: "3.2 mm", status: "Monitored", norm: "None" },
            { label: "GFR (eGFR)", value: "91 mL/min/1.73m²", status: "Normal", norm: "≥90 mL/min" }
        ],
        summary: "Solid parenchymal organs in this model group include the liver (detoxification, protein synthesis, bile production), spleen (immune filtration, erythrocyte recycling), and kidneys (filtration, osmoregulation). A 3.2 mm calcium oxalate calculus in the right renal collecting system is being monitored. Hepatic and splenic architecture appear normal. eGFR is preserved.",
        timeline: [
            { date: "28 Feb 2026", title: "Renal Ultrasound — Stone Follow-up", doctor: "Dr. Aditya Shenoy (Urology)", description: "Right kidney: 3.2 mm calculus at mid-pole calyx — stable size (no growth from 2025 scan). No hydronephrosis. Left kidney normal. Recommend increased fluid intake (>3L/day).", type: "Scan", badge: "Imaging" },
            { date: "12 Oct 2025", title: "CT KUB — Initial Stone Detection", doctor: "Radiology Dept", description: "Non-contrast CT detected 3.2 mm calculus right renal pelvis. Density ~900 HU consistent with calcium oxalate composition. No ureteric obstruction.", type: "Scan", badge: "Diagnostic" }
        ],
        medications: [
            { name: "Potassium Citrate", dose: "10 mEq BID", purpose: "Alkalinize urine to inhibit calcium oxalate stone growth" }
        ],
        aiNotes: "AI Renal Analysis: Small right-sided renal calculus remains stable. eGFR normal. Maintain >3L fluid intake daily and restrict oxalate-rich foods (spinach, nuts, chocolate). Low-dose thiazide may be considered if stone grows >5 mm."
    },

    "splanchnology_peritoneum": {
        name: "Peritoneum",
        category: "Serosal Membranes",
        isInternal: true,
        hasProblem: false,
        status: "Intact & Normal",
        statusColor: "#10b981",
        icon: "ri-shield-line",
        vitals: [
            { label: "Peritoneal Fluid", value: "None detected", status: "Normal", norm: "None / trace" },
            { label: "CA-125 (Tumor Marker)", value: "12 U/mL", status: "Normal", norm: "<35 U/mL" },
            { label: "Albumin (Serum)", value: "4.1 g/dL", status: "Normal", norm: "3.5–5.0 g/dL" },
            { label: "SAAG (if ascites)", value: "N/A", status: "Not applicable", norm: ">1.1 = portal HTN" }
        ],
        summary: "The peritoneum is a bi-layered serous membrane lining the abdominal cavity (parietal peritoneum) and covering most abdominal organs (visceral peritoneum). It secretes serous fluid for lubrication and facilitates immune defense. No ascites, peritonitis, or peritoneal carcinomatosis is identified. Normal serum albumin indicates intact protein synthesis.",
        timeline: [
            { date: "02 Mar 2026", title: "Abdominal CT with IV Contrast", doctor: "Radiology Dept", description: "No free peritoneal fluid. Peritoneal surfaces smooth and enhancing normally. No evidence of thickening or implants. Retroperitoneum unremarkable.", type: "Scan", badge: "Imaging" }
        ],
        medications: [],
        aiNotes: "AI Peritoneal Analysis: No ascites or peritoneal disease identified. Normal peritoneal enhancement pattern. Ongoing hepatic function monitoring recommended to detect early portal hypertension."
    },

    "splanchnology_suture": {
        name: "Cranial Sutures",
        category: "Craniofacial Anatomy",
        isInternal: false,
        hasProblem: false,
        status: "Normal",
        statusColor: "#10b981",
        icon: "ri-artboard-line",
        vitals: [
            { label: "Coronal Suture", value: "Patent", status: "Normal", norm: "Patent (adult)" },
            { label: "Sagittal Suture", value: "Patent", status: "Normal", norm: "Patent" },
            { label: "Lambdoid Suture", value: "Patent", status: "Normal", norm: "Patent" },
            { label: "ICP (Estimated)", value: "Normal range", status: "Normal", norm: "<15 mmHg" }
        ],
        summary: "Cranial sutures are fibrous joints between cranial bones (frontal, parietal, temporal, occipital). In adults, sutures become progressively fused (synostosis) but remain partially patent until mid-adulthood. They accommodate minor degrees of intracranial pressure change. No evidence of premature synostosis, diastasis, or intracranial hypertension.",
        timeline: [
            { date: "05 Jan 2026", title: "CT Head (No Contrast)", doctor: "Dr. Arjun Mehta (Neurology)", description: "Cranial sutures age-appropriately patent. No sutural diastasis or ridging. Normal grey-white differentiation. No midline shift. Ventricles normal size.", type: "Scan", badge: "Imaging" }
        ],
        medications: [],
        aiNotes: "AI Craniofacial Analysis: Cranial suture pattern is normal for patient's age. No neurosurgical findings. Continue monitoring for any signs of increased ICP if headaches recur."
    },

    "splanchnology_teeth": {
        name: "Dentition",
        category: "Dental & Oral Health",
        isInternal: false,
        hasProblem: false,
        status: "Good Oral Health",
        statusColor: "#10b981",
        icon: "ri-contrast-drop-2-line",
        vitals: [
            { label: "Teeth Present", value: "28 / 32", status: "Normal", norm: "28–32 (w/o wisdom)" },
            { label: "Periodontal Depth", value: "2.5 mm avg.", status: "Normal", norm: "<3 mm" },
            { label: "Dental Caries", value: "2 filled (stable)", status: "Normal", norm: "No active caries" },
            { label: "Plaque Index", value: "0.8 (low)", status: "Normal", norm: "<1.0 = good" }
        ],
        summary: "Dentition includes 28 permanent teeth (4 wisdom teeth extracted at age 22). Dental radiographs show 2 amalgam restorations (lower molars), no active caries, no periapical abscess, and no alveolar bone loss. Periodontal probing depths are within normal limits. Excellent daily oral hygiene practice with electric toothbrush and water flosser.",
        timeline: [
            { date: "10 Apr 2026", title: "Routine Dental Check & Scale/Polish", doctor: "Dr. R. Desai (Dentistry)", description: "No new caries. Existing fillings stable. Mild calculus posterior lower teeth removed. OPG X-ray normal — no periapical changes. Fluoride varnish applied.", type: "Checkup", badge: "Routine" }
        ],
        medications: [],
        aiNotes: "AI Dental Analysis: Excellent oral health maintained. Low caries risk. Recommend continued twice-daily brushing with fluoride toothpaste and interdental cleaning. Next OPG in 2 years."
    }
};

if (typeof module !== 'undefined') {
    module.exports = { PATIENT_METADATA, MEDICAL_DATA };
}
