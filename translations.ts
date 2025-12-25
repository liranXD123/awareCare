
import { Language } from './types';

export const translations: Record<string, Record<Language, string>> = {
  appName: { he: 'awareCare', en: 'awareCare' },
  greeting: { he: 'שלום למשפחה', en: 'Hello Family' },
  subtitle: { he: 'בואו נעקוב ביחד אחרי המצב היום', en: 'Let\'s track the status together today' },
  
  // Menu Items
  quickView: { he: 'מבט מהיר', en: 'Quick View' },
  myDoctor: { he: 'הרופא שלי', en: 'My Doctor' },
  liveMedicalFile: { he: 'תיק רפואי חי', en: 'Live Medical File' },
  statusAssessment: { he: 'שאלון הערכת מצב', en: 'Status Assessment' },
  tutorial: { he: 'הדרכה', en: 'Tutorial' },
  contactUs: { he: 'צור קשר', en: 'Contact Us' },
  infoAndGuidance: { he: 'מידע רלוונטי', en: 'Relevant Information' }, // Changed

  // Medical File Sub-sections
  uploadDocs: { he: 'העלאת מסמכים', en: 'Upload Documents' },
  medications: { he: 'תרופות ומרשמים', en: 'Meds & Prescriptions' },
  visitSummaries: { he: 'סיכומי ביקור והפניות', en: 'Summaries & Referrals' },
  medHistory: { he: 'היסטוריית תרופות', en: 'Medication History' },
  questHistory: { he: 'היסטוריית שאלונים', en: 'Questionnaire History' },
  sensitivities: { he: 'רגישות לתרופות', en: 'Drug Sensitivities' },

  // Mock Data Content
  activeMeds: { he: 'תרופות פעילות', en: 'Active Medications' },
  morning: { he: 'בוקר', en: 'Morning' },
  evening: { he: 'ערב', en: 'Evening' },
  daily: { he: 'פעם ביום', en: 'Once daily' },
  pill: { he: 'כדור', en: 'Pill' },
  mg: { he: 'מ"ג', en: 'mg' },
  memorit: { he: 'ממוריט', en: 'Memorit' },
  cipralex: { he: 'ציפרלקס', en: 'Cipralex' },
  aspirin: { he: 'אספירין', en: 'Aspirin' },
  stoppedMeds: { he: 'תרופות שהופסקו', en: 'Discontinued Meds' },
  reasonStopped: { he: 'סיבת הפסקה: תופעות לוואי', en: 'Reason: Side effects' },
  date: { he: 'תאריך', en: 'Date' },
  doctorSummary: { he: 'סיכום ביקור', en: 'Visit Summary' },
  psychogeriatrician: { he: 'פסיכוגריאטר', en: 'Psychogeriatrician' },
  familyDoctor: { he: 'רופא משפחה', en: 'Family Doctor' },
  summaryText1: { he: 'ביקור מעקב שגרתי. נצפתה יציבות קוגניטיבית. אין שינוי במינון תרופתי. מומלץ להמשיך מעקב לחץ דם בבית.', en: 'Routine follow-up. Cognitive stability observed. No change in medication dosage. Continue home blood pressure monitoring recommended.' },
  summaryText2: { he: 'תלונה על נדודי שינה. הומלץ על שינוי סביבת השינה והפחתת קפאין בערב.', en: 'Complaint of insomnia. Recommended changing sleep environment and reducing caffeine in the evening.' },
  sensitivityTitle: { he: 'רגישויות ידועות', en: 'Known Sensitivities' },
  penicillin: { he: 'פניצילין', en: 'Penicillin' },
  reactionRash: { he: 'תגובה: פריחה עורית וקוצר נשימה', en: 'Reaction: Skin rash and shortness of breath' },
  sulfa: { he: 'סולפה', en: 'Sulfa' },
  reactionNausea: { he: 'תגובה: בחילות והקאות חריפות', en: 'Reaction: Severe nausea and vomiting' },
  uploadBtn: { he: 'בחר קובץ להעלאה', en: 'Choose file to upload' },
  uploadInstruction: { he: 'ניתן להעלות סיכומי ביקור, תוצאות בדיקות דם או מרשמים סרוקים (PDF/JPG)', en: 'Upload visit summaries, blood test results, or scanned prescriptions (PDF/JPG)' },

  // General & Existing
  statusSnapshot: { he: 'תיאור מצב יומי', en: 'Daily Status Report' },
  appointments: { he: 'זימון תור וביקורים', en: 'Appointments' },
  generalInfo: { he: 'מידע רלוונטי', en: 'Relevant Information' }, // Changed
  doctorMessages: { he: 'הודעות מהצוות', en: 'Staff Messages' },
  exportPdf: { he: 'ייצוא PDF לרופא', en: 'Export PDF' },
  contact: { he: 'צור קשר', en: 'Contact Us' },
  home: { he: 'בית', en: 'Home' },
  personalArea: { he: 'אזור אישי', en: 'Personal Area' },
  patientProfile: { he: 'פרופיל המטופל/ת', en: 'Patient Profile' },
  save: { he: 'שמור', en: 'Save' },
  next: { he: 'הבא', en: 'Next' },
  confirmAndNext: { he: 'אישור ומעבר לשאלה הבאה', en: 'Confirm & Next' }, // New
  back: { he: 'חזור', en: 'Back' },
  finish: { he: 'סיום', en: 'Finish' },
  languageBtn: { he: 'English', en: 'עברית' },
  vibeQuestion: { he: 'איך המטופל/ת מרגיש/ה היום?', en: 'How is the patient feeling today?' },
  vibeGood: { he: 'מצוין, אין שינוי', en: 'Great, no change' },
  vibeNotGood: { he: 'לא כל כך טוב...', en: 'Not so good...' },
  doctorFeedback: { he: 'תגובת פסיכוגריאטר', en: 'Psychogeriatrician Response' },
  videoCall: { he: 'שיחת וידאו דחופה', en: 'Urgent Video Call' },
  expedite: { he: 'זירוז תור קיים', en: 'Expedite Appointment' },
  noMessages: { he: 'אין הודעות חדשות מהצוות.', en: 'No new messages from the staff.' },
  noData: { he: 'טרם הוזנו נתונים.', en: 'No data entered yet.' },
  reportNormal: { he: 'דיווח תקין', en: 'Status: Normal' },
  reportFull: { he: 'דיווח מפורט', en: 'Full Report' },
  analyzing: { he: 'מנתח נתונים בבינה מלאכותית...', en: 'AI is analyzing clinical data...' },
  medicalInfoTitle: { he: 'מידע למטופל ולמשפחה', en: 'Patient & Family Information' },
  medicalInfoSubtitle: { he: 'לחיות לצד דמנציה ואלצהיימר', en: 'Living with Dementia & Alzheimer\'s' },
  
  // New Pages Content
  recentActivity: { he: 'פעילות אחרונה במערכת', en: 'Recent System Activity' },
  doctorName: { he: 'ד"ר כהן - פסיכוגריאטר', en: 'Dr. Cohen - Psychogeriatrician' },
  clinicHours: { he: 'שעות קבלה: א-ה, 08:00-14:00', en: 'Hours: Sun-Thu, 08:00-14:00' },
  callClinic: { he: 'התקשר למרפאה', en: 'Call Clinic' },
  videoTutorial: { he: 'סרטון הדרכה לשימוש באפליקציה', en: 'App Usage Tutorial Video' },
  playVideo: { he: 'נגן סרטון', en: 'Play Video' },
  supportCenter: { he: 'מוקד תמיכה טלפוני', en: 'Phone Support Center' },
  available247: { he: 'זמין 24/7 לכל שאלה', en: 'Available 24/7 for any question' },
  dialNow: { he: 'חייג עכשיו', en: 'Dial Now' },
  
  // Medical Content Sections
  infoWhatIsTitle: { he: 'מהי דמנציה ומהו אלצהיימר?', en: 'What is Dementia and Alzheimer\'s?' },
  infoWhatIsContent: { 
    he: 'דמנציה היא תסמונת נוירולוגית המתבטאת בירידה הדרגתית ביכולות הזיכרון, החשיבה, ההתמצאות וההתנהגות, ומשפיעה על היכולת לתפקד באופן עצמאי בחיי היום־יום. מדובר בקבוצת תסמינים ולא במחלה אחת. אלצהיימר הוא הסוג הנפוץ ביותר, אך חשוב להבין שלא כל אדם עם דמנציה סובל מאלצהיימר. הבנה ברורה של ההבחנה מסייעת להתמודדות רגועה יותר ולתכנון נכון של המשך הדרך.',
    en: 'Dementia is a neurological syndrome characterized by a gradual decline in memory, thinking, orientation, and behavior, affecting the ability to function independently in daily life. It refers to a group of symptoms rather than a single disease. Alzheimer\'s is the most common type, but it is important to understand that not every person with dementia has Alzheimer\'s. A clear understanding of the distinction helps in calmer coping and proper planning for the road ahead.'
  },
  infoTypesTitle: { he: 'סוגי דמנציה', en: 'Types of Dementia' },
  infoTypesContent: {
    he: 'קיימים מספר סוגים של דמנציה, שלכל אחד מהם מאפיינים ייחודיים. דמנציה מסוג אלצהיימר מתבטאת בעיקר בפגיעה בזיכרון ובהחמרה הדרגתית, דמנציה וסקולרית קשורה לפגיעות בכלי הדם ולעיתים מאופיינת בשינויים חדים בתפקוד, דמנציה עם גופיפי לואי כוללת הזיות ושינויים בערנות, דמנציה פרונטו־טמפורלית מתבטאת בשינויים בהתנהגות ובאישיות, ודמנציה משולבת משלבת מאפיינים של יותר מסוג אחד.',
    en: 'There are several types of dementia, each with unique characteristics. Alzheimer\'s dementia is mainly expressed in memory impairment and gradual worsening; vascular dementia is related to damage to blood vessels and is sometimes characterized by sharp changes in functioning; dementia with Lewy bodies includes hallucinations and changes in alertness; frontotemporal dementia is expressed in changes in behavior and personality; and mixed dementia combines characteristics of more than one type.'
  },
  infoSymptomsTitle: { he: 'תסמינים ומהלך המחלה', en: 'Symptoms & Disease Progression' },
  infoSymptomsContent: {
    he: 'התסמינים בדמנציה כוללים ירידה בזיכרון, בלבול, חוסר התמצאות בזמן ובמקום, קושי בדיבור ובהבנה, שינויים במצב הרוח ובהתנהגות, ופגיעה ביכולת לבצע פעולות יומיומיות. המחלה לרוב מתקדמת עם הזמן, אך קצב ההחמרה משתנה מאדם לאדם. מעקב אחר שינויים תפקודיים לאורך זמן מאפשר לזהות החמרה מוקדמת ולהתאים את ההתנהלות בהתאם.',
    en: 'Symptoms of dementia include memory loss, confusion, disorientation in time and place, difficulty in speaking and understanding, changes in mood and behavior, and impairment in the ability to perform daily activities. The disease usually progresses over time, but the rate of decline varies from person to person. Monitoring functional changes over time allows for early identification of deterioration and adaptation of management accordingly.'
  },
  infoDisorientationTitle: { he: 'חוסר התמצאות במרחב', en: 'Spatial Disorientation' },
  infoDisorientationContent: {
    he: 'חוסר התמצאות במרחב הוא תסמין שכיח בדמנציה, העלול לגרום לאיבוד דרך גם בסביבה מוכרת. מצב זה עלול להוביל ליציאה לא מבוקרת מהבית ולמצבי סיכון. שמירה על סביבה קבועה, הימנעות משינויים מיותרים וסימון ברור של חדרים מסייעים להפחתת בלבול.',
    en: 'Spatial disorientation is a common symptom in dementia, which can cause getting lost even in familiar environments. This situation can lead to uncontrolled departure from the home and risky situations. Maintaining a constant environment, avoiding unnecessary changes, and clear marking of rooms help reduce confusion.'
  },
  infoDiagnosisTitle: { he: 'אבחון וטיפול', en: 'Diagnosis & Treatment' },
  infoDiagnosisContent: {
    he: 'אבחון דמנציה נעשה על ידי רופא וכולל הערכה קוגניטיבית, תשאול רפואי ולעיתים גם בדיקות דם והדמיה. כיום אין ריפוי מלא לדמנציה, אך קיימים טיפולים שמטרתם להאט את קצב ההחמרה ולשפר את איכות החיים. הקפדה על מעקב רפואי רציף ויישום ההמלצות הטיפוליות תורמים ליציבות המצב לאורך זמן.',
    en: 'Dementia is diagnosed by a doctor and includes cognitive evaluation, medical history, and sometimes blood tests and imaging. Currently, there is no full cure for dementia, but treatments exist to slow the rate of deterioration and improve quality of life. Strict adherence to continuous medical follow-up and implementation of treatment recommendations contribute to long-term stability.'
  },
  infoCommunicationTitle: { he: 'תקשורת', en: 'Communication' },
  infoCommunicationContent: {
    he: 'בדמנציה נפגעת היכולת להבין מידע מורכב, אך הרגישות לטון דיבור, שפת גוף ורגש נשמרת. תקשורת רגועה, איטית וברורה משפיעה ישירות על תחושת הביטחון. שימוש במשפטים קצרים, קשר עין והימנעות מוויכוחים מסייעים למניעת תסכול.',
    en: 'In dementia, the ability to understand complex information is impaired, but sensitivity to tone of voice, body language, and emotion remains. Calm, slow, and clear communication directly affects the sense of security. Using short sentences, maintaining eye contact, and avoiding arguments help prevent frustration.'
  },
  infoOutburstsTitle: { he: 'מצבי התפרצות', en: 'Outbursts & Agitation' },
  infoOutburstsContent: {
    he: 'מצבי אי־שקט, פחד, כעס או תוקפנות נובעים לרוב ממצוקה פנימית, עומס חושי או בלבול. התמודדות רגועה, הפחתת רעש וגירויים, תאורה נעימה ושימוש במוזיקה מוכרת יכולים להרגיע את המצב ולמנוע החמרה.',
    en: 'Situations of restlessness, fear, anger, or aggression usually stem from internal distress, sensory overload, or confusion. Calm handling, reduction of noise and stimuli, pleasant lighting, and the use of familiar music can calm the situation and prevent escalation.'
  },
  infoSafetyTitle: { he: 'בטיחות', en: 'Safety' },
  infoSafetyContent: {
    he: 'הפגיעה הקוגניטיבית והפיזית בדמנציה מעלה את הסיכון לנפילות ולפציעות. התאמת הבית באמצעות תאורה טובה, מאחזים, הסרת מכשולים והפחתת סכנות נסתרות מאפשרת סביבה בטוחה יותר להתנהלות יומיומית.',
    en: 'Cognitive and physical impairment in dementia increases the risk of falls and injuries. Adapting the home with good lighting, handrails, removing obstacles, and reducing hidden hazards allows for a safer environment for daily living.'
  },
  infoSuddenChangesTitle: { he: 'שינויים פתאומיים', en: 'Sudden Changes' },
  infoSuddenChangesContent: {
    he: 'שינויים חדים בהתנהגות אינם תמיד חלק מהמהלך הטבעי של המחלה. לעיתים הם נובעים מגורמים פיזיים כמו כאב, רעב, עייפות או זיהום. בדיקה של גורמים אלו יכולה להביא להקלה מהירה ולמנוע פרשנות שגויה.',
    en: 'Sharp changes in behavior are not always part of the natural progression of the disease. Sometimes they stem from physical factors such as pain, hunger, fatigue, or infection. Checking for these factors can lead to rapid relief and prevent misinterpretation.'
  },
  infoWhenToSeekTitle: { he: 'מתי לפנות לעזרה?', en: 'When to Seek Help?' },
  infoWhenToSeekContent: {
    he: 'במקרים של החמרה פתאומית, התפרצויות חוזרות, סכנה בטיחותית או תחושת הצפה מתמשכת, חשוב לפנות לעזרה מקצועית. התערבות מוקדמת יכולה למנוע מצבי חירום ולשפר את איכות החיים של כל המעורבים.',
    en: 'In cases of sudden deterioration, recurring outbursts, safety hazards, or a continuous sense of overwhelm, it is important to seek professional help. Early intervention can prevent emergencies and improve the quality of life for everyone involved.'
  }
};
