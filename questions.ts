import { Question } from "./types";

export const DAILY_QUESTIONS: Question[] = [
  // 1. שלב המחלה
  {
    id: "disease_stage",
    section: "1. שלב המחלה",
    type: "choice",
    title: { he: "באיזה שלב נמצאת המחלה?", en: "Stage of the disease" },
    help: {
      he: "זה עוזר להבין את רמת התפקוד הכללית ולהתאים את ההמלצות והמעקב.",
      en: "Helps estimate overall functioning and tailor follow-up and recommendations.",
    },
    options: [
      { value: "early", label: { he: "שלב מוקדם", en: "Early" } },
      { value: "moderate", label: { he: "שלב בינוני", en: "Moderate" } },
      { value: "advanced", label: { he: "שלב מתקדם", en: "Advanced" } },
    ],
  },

  // 2. מצב קוגניטיבי
  {
    id: "cognitive_worsening",
    section: "2. מצב קוגניטיבי והתמצאות",
    type: "choice",
    title: {
      he: "האם חלה החמרה לאחרונה?",
      en: "Has there been a recent worsening?",
    },
    help: {
      he: "מטרת השאלה לזהות שינוי חדש לעומת השגרה (ימים/שבועות אחרונים).",
      en: "This checks for a new change compared to baseline (last days/weeks).",
    },
    options: [
      { value: "no", label: { he: "לא", en: "No" } },
      { value: "yes", label: { he: "כן", en: "Yes" } },
    ],
  },
  {
    id: "cognitive_severity",
    section: "2. מצב קוגניטיבי והתמצאות",
    type: "scale",
    min: 1,
    max: 5,
    title: { he: "דרגי את חומרת ההחמרה (1-5)", en: "Rate severity (1-5)" },
    help: {
      he: "1 = שינוי קטן, 5 = שינוי משמעותי שמפריע לתפקוד היומי.",
      en: "1 = mild change, 5 = major change affecting daily functioning.",
    },
    dependsOn: { id: "cognitive_worsening", value: "yes" },
  },
  {
    id: "cognitive_symptoms",
    section: "2. מצב קוגניטיבי והתמצאות",
    type: "multi-choice",
    title: { he: "מה בלט בהחמרה?", en: "What stood out?" },
    help: {
      he: "בחר/י את הסימנים הבולטים ביותר שנראו לאחרונה.",
      en: "Select the most noticeable symptoms observed recently.",
    },
    options: [
      { value: "names", label: { he: "שכחת שמות", en: "Forgotten names" } },
      {
        value: "repeating",
        label: { he: "חזרה על שאלות", en: "Repeated questions" },
      },
      {
        value: "confusion",
        label: { he: "בלבול בזמן/מקום", en: "Confused about time/place" },
      },
      {
        value: "recognition",
        label: { he: "אי זיהוי בני משפחה", en: "Not recognizing family" },
      },
    ],
    dependsOn: { id: "cognitive_worsening", value: "yes" },
  },

  // 3. תקשורת
  {
    id: "comm_level",
    section: "3. תקשורת ושיתוף פעולה",
    type: "choice",
    title: { he: "רמת תקשורת", en: "Level of communication" },
    help: {
      he: "מסייע להבין עד כמה המטופל מבין/מביע את עצמו וכמה קל לתקשר איתו.",
      en: "Helps assess understanding/expression and how easy communication is.",
    },
    options: [
      {
        value: "normal",
        label: { he: "תקינה יחסית", en: "Relatively normal" },
      },
      {
        value: "low_understanding",
        label: { he: "ירידה בהבנה", en: "Decreased understanding" },
      },
      {
        value: "expression_diff",
        label: { he: "קושי בביטוי", en: "Difficulty expressing" },
      },
      {
        value: "no_comm",
        label: { he: "היעדר תקשורת", en: "Lack of communication" },
      },
    ],
  },
  {
    id: "cooperation_level",
    section: "3. תקשורת ושיתוף פעולה",
    type: "choice",
    title: {
      he: "רמת שיתוף פעולה בטיפול",
      en: "Level of cooperation in treatment",
    },
    help: {
      he: "שיתוף פעולה משפיע על נטילת תרופות, רחצה, בדיקות וטיפול יומיומי.",
      en: "Cooperation impacts meds intake, hygiene, tests and daily care.",
    },
    options: [
      { value: "cooperates", label: { he: "משתף/ת פעולה", en: "Cooperates" } },
      {
        value: "partial",
        label: { he: "משתף/ת חלקית", en: "Partially cooperates" },
      },
      {
        value: "verbal_resist",
        label: { he: "מתנגד/ת מילולית", en: "Verbally resists" },
      },
      {
        value: "physical_resist",
        label: { he: "מתנגד/ת פיזית", en: "Physically resists" },
      },
    ],
  },

  // 4. התנהגות
  {
    id: "behavioral_signs",
    section: "4. התנהגות ומצב רגשי",
    type: "multi-choice",
    title: { he: "סימנים שהופיעו", en: "Signs of what appeared" },
    help: {
      he: "בחר/י את מה שנצפה היום/לאחרונה — זה עוזר להבין טריגרים וסיכון.",
      en: "Select what appeared today/recently—helps identify triggers and risk.",
    },
    options: [
      { value: "unrest", label: { he: "אי שקט", en: "Restlessness" } },
      { value: "anxiety", label: { he: "חרדה", en: "Anxiety" } },
      {
        value: "verbal_agg",
        label: { he: "תוקפנות מילולית", en: "Verbal aggression" },
      },
      {
        value: "physical_agg",
        label: { he: "תוקפנות פיזית", en: "Physical aggression" },
      },
    ],
  },
  {
    id: "general_severity",
    section: "4. התנהגות ומצב רגשי",
    type: "scale",
    min: 1,
    max: 5,
    title: { he: "דרגת חומרה כללית (1-5)", en: "General severity scale 1-5" },
    help: {
      he: "הערכה כללית של כמה זה קשה/מסוכן לעומת שגרה. 1 קל, 5 חמור.",
      en: "Overall severity compared to baseline. 1 mild, 5 severe.",
    },
  },
  {
    id: "evening_worsening",
    section: "4. התנהגות ומצב רגשי",
    type: "choice",
    title: {
      he: "האם יש החמרה בשעות הערב?",
      en: "Is there a worsening in the evening?",
    },
    help: {
      he: "החמרה בערב (“שקיעה”) שכיחה בדמנציה ועוזרת להתאים שגרה ותמיכה.",
      en: "Evening worsening (“sundowning”) is common and helps tailor routines/support.",
    },
    options: [
      { value: "no", label: { he: "לא", en: "No" } },
      { value: "yes", label: { he: "כן", en: "Yes" } },
    ],
  },

  // 5. שינה
  {
    id: "sleep_hours",
    section: "5. שינה",
    type: "number",
    min: 0,
    max: 12,
    title: { he: "שעות שינה בלילה (מספר)", en: "Hours of sleep at night" },
    help: {
      he: "שינה משפיעה על מצב רוח, בלבול ועייפות. העריכו את הלילה האחרון.",
      en: "Sleep affects mood, confusion and fatigue. Estimate last night.",
    },
  },
  {
    id: "waking_up",
    section: "5. שינה",
    type: "choice",
    title: { he: "האם היו יקיצות?", en: "Waking up" },
    help: {
      he: "יקיצות מרובות יכולות להעיד על כאב, צורך לשירותים, חרדה או אי־שקט.",
      en: "Frequent wake-ups can indicate pain, bathroom needs, anxiety or restlessness.",
    },
    options: [
      { value: "no", label: { he: "לא", en: "No" } },
      { value: "yes", label: { he: "כן", en: "Yes" } },
    ],
  },
  {
    id: "waking_times",
    section: "5. שינה",
    type: "number",
    min: 0,
    max: 12,
    title: { he: "כמה פעמים?", en: "How many times?" },
    help: {
      he: "מספר היקיצות נותן תמונה על איכות השינה והאם יש שינוי לעומת שגרה.",
      en: "Number of wake-ups reflects sleep quality and changes vs baseline.",
    },
    dependsOn: { id: "waking_up", value: "yes" },
  },

  // 6. מדדים פיזיים
  {
    id: "eating_habit",
    section: "6. מדדים פיזיים - אכילה, שתייה ולחץ דם",
    type: "choice",
    title: { he: "אכילה", en: "Eating" },
    help: {
      he: "ירידה באכילה יכולה להצביע על כאב, בחילה, דיכאון או שינוי רפואי.",
      en: "Reduced eating may suggest pain, nausea, depression, or medical changes.",
    },
    options: [
      { value: "normal", label: { he: "כרגיל", en: "As usual" } },
      {
        value: "slight_dec",
        label: { he: "ירידה קלה", en: "Slight decrease" },
      },
      {
        value: "sig_dec",
        label: { he: "ירידה משמעותית", en: "Significant decrease" },
      },
      { value: "refusal", label: { he: "סירוב אכילה", en: "Refusal to eat" } },
    ],
  },
  {
    id: "meals_count",
    section: "6. מדדים פיזיים - אכילה, שתייה ולחץ דם",
    type: "number",
    min: 0,
    max: 10,
    title: { he: "מספר ארוחות היום", en: "Number of meals per day" },
    help: {
      he: "מספר הארוחות משקף אם היה יום רגיל או ירידה בתפקוד/תיאבון.",
      en: "Meal count helps indicate whether the day was normal or reduced intake.",
    },
  },
  {
    id: "needs_assistance",
    section: "6. מדדים פיזיים - אכילה, שתייה ולחץ דם",
    type: "choice",
    title: { he: "נדרש סיוע באכילה?", en: "Required assistance" },
    help: {
      he: "שינוי בצורך בסיוע יכול להעיד על ירידה תפקודית או חולשה זמנית.",
      en: "Needing help may reflect functional decline or temporary weakness.",
    },
    options: [
      { value: "no", label: { he: "לא", en: "No" } },
      { value: "yes", label: { he: "כן", en: "Yes" } },
    ],
  },
  {
    id: "drinking_habit",
    section: "6. מדדים פיזיים - אכילה, שתייה ולחץ דם",
    type: "choice",
    title: { he: "שתייה", en: "Drinking" },
    help: {
      he: "שתייה נמוכה מעלה סיכון להתייבשות, בלבול, חולשה ועצירות.",
      en: "Low fluids increase dehydration risk, confusion, weakness, and constipation.",
    },
    options: [
      { value: "normal", label: { he: "כרגיל", en: "As usual" } },
      { value: "less", label: { he: "פחות מהרגיל", en: "Less than usual" } },
      { value: "none", label: { he: "כמעט ולא", en: "Almost none" } },
    ],
  },
  {
    id: "water_amount",
    section: "6. מדדים פיזיים - אכילה, שתייה ולחץ דם",
    type: "number",
    min: 0,
    max: 20,
    title: { he: "כמות משוערת (כוסות)", en: "Approximate amount (glasses)" },
    help: {
      he: "לא חייב מדויק — הערכה גסה עוזרת להבין אם יש סיכון להתייבשות.",
      en: "Doesn’t need to be exact—rough estimate helps detect dehydration risk.",
    },
  },
  {
    id: "dehydration_signs",
    section: "6. מדדים פיזיים - אכילה, שתייה ולחץ דם",
    type: "multi-choice",
    title: { he: "סימני התייבשות", en: "Signs of dehydration" },
    help: {
      he: "בחר/י אם הופיעו סימנים שיכולים להסביר בלבול/עייפות/חולשה.",
      en: "Select signs that may explain confusion, fatigue or weakness.",
    },
    options: [
      { value: "dry_mouth", label: { he: "יובש בפה", en: "Dry mouth" } },
      {
        value: "low_urine",
        label: { he: "מיעוט שתן", en: "Low urine output" },
      },
      {
        value: "confusion",
        label: { he: "בלבול מוגבר", en: "Increased confusion" },
      },
    ],
  },
  {
    id: "bp_measured",
    section: "6. מדדים פיזיים - אכילה, שתייה ולחץ דם",
    type: "choice",
    title: { he: "לחץ דם נמדד היום?", en: "Blood pressure measured?" },
    help: {
      he: "אם יש סחרחורת/חולשה/נפילה — מדידת לחץ דם יכולה לעזור להבין את המצב.",
      en: "If dizziness/weakness/fall occurred, BP can help explain what’s going on.",
    },
    options: [
      { value: "no", label: { he: "לא", en: "No" } },
      { value: "yes", label: { he: "כן", en: "Yes" } },
    ],
  },
  {
    id: "bp_normal",
    section: "6. מדדים פיזיים - אכילה, שתייה ולחץ דם",
    type: "choice",
    title: {
      he: "האם תקין ביחס לשגרה?",
      en: "Is it normal compared to baseline?",
    },
    help: {
      he: "השוואה לשגרה חשובה: גם ערך 'רגיל' יכול להיות חריג למטופל מסוים.",
      en: "Baseline matters: a “normal” value may still be unusual for this patient.",
    },
    options: [
      { value: "yes", label: { he: "כן", en: "Yes" } },
      { value: "no", label: { he: "לא", en: "No" } },
    ],
    dependsOn: { id: "bp_measured", value: "yes" },
  },
  {
    id: "bp_systolic",
    section: "6. מדדים פיזיים - אכילה, שתייה ולחץ דם",
    type: "number",
    min: 70,
    max: 220,
    title: { he: "לחץ דם סיסטולי", en: "Systolic" },
    help: {
      he: "המספר העליון. ערך נמוך/גבוה ביחס לשגרה יכול להסביר סחרחורת/חולשה.",
      en: "Top number. Low/high vs baseline can explain dizziness or weakness.",
    },
    dependsOn: { id: "bp_measured", value: "yes" },
  },
  {
    id: "bp_diastolic",
    section: "6. מדדים פיזיים - אכילה, שתייה ולחץ דם",
    type: "number",
    min: 40,
    max: 140,
    title: { he: "לחץ דם דיאסטולי", en: "Diastolic" },
    help: {
      he: "המספר התחתון. חשוב במיוחד כשיש עייפות, כאבי ראש או סחרחורת.",
      en: "Bottom number. Useful when fatigue, headache, or dizziness occurs.",
    },
    dependsOn: { id: "bp_measured", value: "yes" },
  },
  {
    id: "associated_symptoms",
    section: "6. מדדים פיזיים - אכילה, שתייה ולחץ דם",
    type: "multi-choice",
    title: { he: "תסמינים נלווים", en: "Associated symptoms" },
    help: {
      he: "תסמינים נלווים עוזרים להבין אם מדובר בעומס/התייבשות/לחץ דם/בעיה אחרת.",
      en: "These help interpret whether it’s stress, dehydration, BP or another issue.",
    },
    options: [
      { value: "dizziness", label: { he: "סחרחורת", en: "Dizziness" } },
      {
        value: "fatigue",
        label: { he: "עייפות חריגה", en: "Unusual fatigue" },
      },
      { value: "headache", label: { he: "כאב ראש", en: "Headache" } },
    ],
  },

  // 7. תרופות
  {
    id: "med_change",
    section: "7. תרופות",
    type: "choice",
    title: {
      he: "האם בוצע שינוי תרופתי לאחרונה?",
      en: "Recent medication change?",
    },
    help: {
      he: "שינויים בתרופות יכולים לגרום לישנוניות, בלבול, אי־שקט או שינוי התנהגות.",
      en: "Medication changes can cause sleepiness, confusion, restlessness or behavior changes.",
    },
    options: [
      { value: "no", label: { he: "לא", en: "No" } },
      { value: "yes", label: { he: "כן", en: "Yes" } },
    ],
  },
  {
    id: "med_change_days",
    section: "7. תרופות",
    type: "number",
    min: 0,
    max: 60,
    title: { he: "לפני כמה ימים?", en: "How many days ago?" },
    help: {
      he: "עוזר לקשר בין השינוי בתרופה לבין סימנים חדשים שהופיעו לאחר מכן.",
      en: "Helps connect the change timing to new symptoms that appeared afterward.",
    },
    dependsOn: { id: "med_change", value: "yes" },
  },
  {
    id: "new_med_signs",
    section: "7. תרופות",
    type: "multi-choice",
    title: {
      he: "האם הופיעו סימנים חדשים מאז?",
      en: "Have new signs appeared since?",
    },
    help: {
      he: "בחר/י מה הופיע מאז השינוי — כך אפשר להבין אם זה תופעת לוואי אפשרית.",
      en: "Select what appeared after the change—helps identify possible side effects.",
    },
    options: [
      {
        value: "cog_det",
        label: { he: "החמרה קוגניטיבית", en: "Cognitive deterioration" },
      },
      { value: "sleepy", label: { he: "ישנוניות", en: "Sleepiness" } },
      { value: "unrest", label: { he: "אי שקט", en: "Restlessness" } },
      {
        value: "behavior",
        label: { he: "שינוי התנהגותי", en: "Behavioral change" },
      },
    ],
    dependsOn: { id: "med_change", value: "yes" },
  },

  // 8. אירוע חריג
  {
    id: "unusual_event",
    section: "8. אירוע חריג",
    type: "choice",
    title: { he: "האם קרה אירוע חריג היום?", en: "Unusual event today?" },
    help: {
      he: "אירוע חריג יכול להסביר שינוי פתאומי: נפילה, ויכוח, יציאה מהבית, חום וכו'.",
      en: "Unusual events can explain sudden changes: fall, argument, wandering, fever, etc.",
    },
    options: [
      { value: "no", label: { he: "לא", en: "No" } },
      { value: "yes", label: { he: "כן", en: "Yes" } },
    ],
  },
  {
    id: "unusual_event_desc",
    section: "8. אירוע חריג",
    type: "text",
    title: { he: "תיאור קצר של האירוע", en: "Short description of the event" },
    help: {
      he: "כתבו 1–2 משפטים: מה קרה, מתי, ומה הייתה התגובה של המטופל.",
      en: "Write 1–2 sentences: what happened, when, and how the patient reacted.",
    },
    dependsOn: { id: "unusual_event", value: "yes" },
  },

  // 9. הערכת משפחה
  {
    id: "family_assessment",
    section: "9. הערכת המשפחה",
    type: "scale",
    min: 1,
    max: 10,
    title: {
      he: "עד כמה המצב חריג ביחס לשגרה? (1-10)",
      en: "How unusual is the situation (1-10)?",
    },
    help: {
      he: "זה מדד סובייקטיבי חשוב: 1 = כמעט כרגיל, 10 = חריג מאוד/מדאיג.",
      en: "A useful subjective indicator: 1 = almost normal, 10 = very unusual/worrying.",
    },
  },
];
