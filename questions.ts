
import { Question } from './types';

export const DAILY_QUESTIONS: Question[] = [
  // 1. שלב המחלה
  {
    id: 'disease_stage',
    section: '1. שלב המחלה',
    type: 'choice',
    title: { he: 'באיזה שלב נמצאת המחלה?', en: 'Stage of the disease' },
    options: [
      { value: 'early', label: { he: 'שלב מוקדם', en: 'Early' } },
      { value: 'moderate', label: { he: 'שלב בינוני', en: 'Moderate' } },
      { value: 'advanced', label: { he: 'שלב מתקדם', en: 'Advanced' } }
    ]
  },
  // 2. מצב קוגניטיבי
  {
    id: 'cognitive_worsening',
    section: '2. מצב קוגניטיבי והתמצאות',
    type: 'choice',
    title: { he: 'האם חלה החמרה לאחרונה?', en: 'Has there been a recent worsening?' },
    options: [
      { value: 'no', label: { he: 'לא', en: 'No' } },
      { value: 'yes', label: { he: 'כן', en: 'Yes' } }
    ]
  },
  {
    id: 'cognitive_severity',
    section: '2. מצב קוגניטיבי והתמצאות',
    type: 'scale',
    min: 1,
    max: 5,
    title: { he: 'דרגי את חומרת ההחמרה (1-5)', en: 'Rate severity (1-5)' },
    dependsOn: { id: 'cognitive_worsening', value: 'yes' }
  },
  {
    id: 'cognitive_symptoms',
    section: '2. מצב קוגניטיבי והתמצאות',
    type: 'multi-choice',
    title: { he: 'מה בלט בהחמרה?', en: 'What stood out?' },
    options: [
      { value: 'names', label: { he: 'שכחת שמות', en: 'Forgotten names' } },
      { value: 'repeating', label: { he: 'חזרה על שאלות', en: 'Repeated questions' } },
      { value: 'confusion', label: { he: 'בלבול בזמן/מקום', en: 'Confused about time/place' } },
      { value: 'recognition', label: { he: 'אי זיהוי בני משפחה', en: 'Not recognizing family' } }
    ],
    dependsOn: { id: 'cognitive_worsening', value: 'yes' }
  },
  // 3. תקשורת
  {
    id: 'comm_level',
    section: '3. תקשורת ושיתוף פעולה',
    type: 'choice',
    title: { he: 'רמת תקשורת', en: 'Level of communication' },
    options: [
      { value: 'normal', label: { he: 'תקינה יחסית', en: 'Relatively normal' } },
      { value: 'low_understanding', label: { he: 'ירידה בהבנה', en: 'Decreased understanding' } },
      { value: 'expression_diff', label: { he: 'קושי בביטוי', en: 'Difficulty expressing' } },
      { value: 'no_comm', label: { he: 'היעדר תקשורת', en: 'Lack of communication' } }
    ]
  },
  {
    id: 'cooperation_level',
    section: '3. תקשורת ושיתוף פעולה',
    type: 'choice',
    title: { he: 'רמת שיתוף פעולה בטיפול', en: 'Level of cooperation in treatment' },
    options: [
      { value: 'cooperates', label: { he: 'משתף/ת פעולה', en: 'Cooperates' } },
      { value: 'partial', label: { he: 'משתף/ת חלקית', en: 'Partially cooperates' } },
      { value: 'verbal_resist', label: { he: 'מתנגד/ת מילולית', en: 'Verbally resists' } },
      { value: 'physical_resist', label: { he: 'מתנגד/ת פיזית', en: 'Physically resists' } }
    ]
  },
  // 4. התנהגות
  {
    id: 'behavioral_signs',
    section: '4. התנהגות ומצב רגשי',
    type: 'multi-choice',
    title: { he: 'סימנים שהופיעו', en: 'Signs of what appeared' },
    options: [
      { value: 'unrest', label: { he: 'אי שקט', en: 'Restlessness' } },
      { value: 'anxiety', label: { he: 'חרדה', en: 'Anxiety' } },
      { value: 'verbal_agg', label: { he: 'תוקפנות מילולית', en: 'Verbal aggression' } },
      { value: 'physical_agg', label: { he: 'תוקפנות פיזית', en: 'Physical aggression' } }
    ]
  },
  {
    id: 'general_severity',
    section: '4. התנהגות ומצב רגשי',
    type: 'scale',
    min: 1,
    max: 5,
    title: { he: 'דרגת חומרה כללית (1-5)', en: 'General severity scale 1-5' }
  },
  {
    id: 'evening_worsening',
    section: '4. התנהגות ומצב רגשי',
    type: 'choice',
    title: { he: 'האם יש החמרה בשעות הערב?', en: 'Is there a worsening in the evening?' },
    options: [
      { value: 'no', label: { he: 'לא', en: 'No' } },
      { value: 'yes', label: { he: 'כן', en: 'Yes' } }
    ]
  },
  // 5. שינה
  {
    id: 'sleep_hours',
    section: '5. שינה',
    type: 'number',
    min: 0,
    max: 12,
    title: { he: 'שעות שינה בלילה (מספר)', en: 'Hours of sleep at night' }
  },
  {
    id: 'waking_up',
    section: '5. שינה',
    type: 'choice',
    title: { he: 'האם היו יקיצות?', en: 'Waking up' },
    options: [
      { value: 'no', label: { he: 'לא', en: 'No' } },
      { value: 'yes', label: { he: 'כן', en: 'Yes' } }
    ]
  },
  {
    id: 'waking_times',
    section: '5. שינה',
    type: 'number',
    min: 0,
    max: 12,
    title: { he: 'כמה פעמים?', en: 'How many times?' },
    dependsOn: { id: 'waking_up', value: 'yes' }
  },
  // 6. מדדים פיזיים
  {
    id: 'eating_habit',
    section: '6. מדדים פיזיים - אכילה, שתייה ולחץ דם',
    type: 'choice',
    title: { he: 'אכילה', en: 'Eating' },
    options: [
      { value: 'normal', label: { he: 'כרגיל', en: 'As usual' } },
      { value: 'slight_dec', label: { he: 'ירידה קלה', en: 'Slight decrease' } },
      { value: 'sig_dec', label: { he: 'ירידה משמעותית', en: 'Significant decrease' } },
      { value: 'refusal', label: { he: 'סירוב אכילה', en: 'Refusal to eat' } }
    ]
  },
  {
    id: 'meals_count',
    section: '6. מדדים פיזיים - אכילה, שתייה ולחץ דם',
    type: 'number',
    title: { he: 'מספר ארוחות היום', en: 'Number of meals per day' }
  },
  {
    id: 'needs_assistance',
    section: '6. מדדים פיזיים - אכילה, שתייה ולחץ דם',
    type: 'choice',
    title: { he: 'נדרש סיוע באכילה?', en: 'Required assistance' },
    options: [
      { value: 'no', label: { he: 'לא', en: 'No' } },
      { value: 'yes', label: { he: 'כן', en: 'Yes' } }
    ]
  },
  {
    id: 'drinking_habit',
    section: '6. מדדים פיזיים - אכילה, שתייה ולחץ דם',
    type: 'choice',
    title: { he: 'שתייה', en: 'Drinking' },
    options: [
      { value: 'normal', label: { he: 'כרגיל', en: 'As usual' } },
      { value: 'less', label: { he: 'פחות מהרגיל', en: 'Less than usual' } },
      { value: 'none', label: { he: 'כמעט ולא', en: 'Almost none' } }
    ]
  },
  {
    id: 'water_amount',
    section: '6. מדדים פיזיים - אכילה, שתייה ולחץ דם',
    type: 'number',
    title: { he: 'כמות משוערת (כוסות)', en: 'Approximate amount (glasses)' }
  },
  {
    id: 'dehydration_signs',
    section: '6. מדדים פיזיים - אכילה, שתייה ולחץ דם',
    type: 'multi-choice',
    title: { he: 'סימני התייבשות', en: 'Signs of dehydration' },
    options: [
      { value: 'dry_mouth', label: { he: 'יובש בפה', en: 'Dry mouth' } },
      { value: 'low_urine', label: { he: 'מיעוט שתן', en: 'Low urine output' } },
      { value: 'confusion', label: { he: 'בלבול מוגבר', en: 'Increased confusion' } }
    ]
  },
  {
    id: 'bp_measured',
    section: '6. מדדים פיזיים - אכילה, שתייה ולחץ דם',
    type: 'choice',
    title: { he: 'לחץ דם נמדד היום?', en: 'Blood pressure measured' },
    options: [
      { value: 'no', label: { he: 'לא', en: 'No' } },
      { value: 'yes', label: { he: 'כן', en: 'Yes' } }
    ]
  },
  {
    id: 'bp_normal',
    section: '6. מדדים פיזיים - אכילה, שתייה ולחץ דם',
    type: 'choice',
    title: { he: 'האם תקין ביחס לשגרה?', en: 'Is it normal compared to normal' },
    options: [
      { value: 'yes', label: { he: 'כן', en: 'Yes' } },
      { value: 'no', label: { he: 'לא', en: 'No' } }
    ],
    dependsOn: { id: 'bp_measured', value: 'yes' }
  },
  {
    id: 'bp_systolic',
    section: '6. מדדים פיזיים - אכילה, שתייה ולחץ דם',
    type: 'number',
    title: { he: 'לחץ דם סיסטולי', en: 'Systolic' },
    dependsOn: { id: 'bp_measured', value: 'yes' }
  },
  {
    id: 'bp_diastolic',
    section: '6. מדדים פיזיים - אכילה, שתייה ולחץ דם',
    type: 'number',
    title: { he: 'לחץ דם דיאסטולי', en: 'Diastolic' },
    dependsOn: { id: 'bp_measured', value: 'yes' }
  },
  {
    id: 'associated_symptoms',
    section: '6. מדדים פיזיים - אכילה, שתייה ולחץ דם',
    type: 'multi-choice',
    title: { he: 'תסמינים נלווים', en: 'Associated symptoms' },
    options: [
      { value: 'dizziness', label: { he: 'סחרחורת', en: 'Dizziness' } },
      { value: 'fatigue', label: { he: 'עייפות חריגה', en: 'Unusual fatigue' } },
      { value: 'headache', label: { he: 'כאב ראש', en: 'Headache' } }
    ]
  },
  // 7. תרופות
  {
    id: 'med_change',
    section: '7. תרופות',
    type: 'choice',
    title: { he: 'האם בוצע שינוי תרופתי לאחרונה?', en: 'Recent medication change?' },
    options: [
      { value: 'no', label: { he: 'לא', en: 'No' } },
      { value: 'yes', label: { he: 'כן', en: 'Yes' } }
    ]
  },
  {
    id: 'med_change_days',
    section: '7. תרופות',
    type: 'number',
    title: { he: 'לפני כמה ימים?', en: 'A few days ago...' },
    dependsOn: { id: 'med_change', value: 'yes' }
  },
  {
    id: 'new_med_signs',
    section: '7. תרופות',
    type: 'multi-choice',
    title: { he: 'האם הופיעו סימנים חדשים מאז?', en: 'Have new signs appeared since?' },
    options: [
      { value: 'cog_det', label: { he: 'החמרה קוגניטיבית', en: 'Cognitive deterioration' } },
      { value: 'sleepy', label: { he: 'ישנוניות', en: 'Sleepiness' } },
      { value: 'unrest', label: { he: 'אי שקט', en: 'Restlessness' } },
      { value: 'behavior', label: { he: 'שינוי התנהגותי', en: 'Behavioral change' } }
    ],
    dependsOn: { id: 'med_change', value: 'yes' }
  },
  // 8. אירוע חריג
  {
    id: 'unusual_event',
    section: '8. אירוע חריג',
    type: 'choice',
    title: { he: 'האם קרה אירוע חריג היום?', en: 'Unusual event' },
    options: [
      { value: 'no', label: { he: 'לא', en: 'No' } },
      { value: 'yes', label: { he: 'כן', en: 'Yes' } }
    ]
  },
  {
    id: 'unusual_event_desc',
    section: '8. אירוע חריג',
    type: 'text',
    title: { he: 'תיאור קצר של האירוע', en: 'Short description' },
    dependsOn: { id: 'unusual_event', value: 'yes' }
  },
  // 9. הערכת משפחה
  {
    id: 'family_assessment',
    section: '9. הערכת המשפחה',
    type: 'scale',
    min: 1,
    max: 10,
    title: { he: 'עד כמה המצב חריג ביחס לשגרה? (1-10)', en: 'How unusual is the situation (1-10)?' }
  }
];
