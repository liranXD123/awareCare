import React, { useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { Language, QuestionnaireResponse, Patient } from "./types";
import { translations } from "./translations";
import { DAILY_QUESTIONS } from "./questions";
import { analyzePatientState } from "./services/geminiService";

// --- Assets & Constants ---

const Logo: React.FC<{ className?: string }> = ({
  className = "w-16 h-16",
}) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    {/* Heart Outline - Navy Blue */}
    <path
      d="M100 185C100 185 25 125 25 70C25 40 50 20 75 20C90 20 95 30 100 40C105 30 110 20 125 20C150 20 175 40 175 70C175 125 100 185 100 185Z"
      stroke="#172A3A"
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="white"
    />

    {/* Brain Left Hemisphere - Teal Outline / Light Fill */}
    <path
      d="M96 145C60 140 40 115 40 75C40 45 60 40 96 55"
      stroke="#508991"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#D6F3F4"
    />

    {/* Brain Right Hemisphere - Teal Outline / Light Fill */}
    <path
      d="M104 145C140 140 160 115 160 75C160 45 140 40 104 55"
      stroke="#508991"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#D6F3F4"
    />

    {/* Brain Details / Convolutions */}
    <path
      d="M60 70C55 80 55 100 65 110"
      stroke="#508991"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M140 70C145 80 145 100 135 110"
      stroke="#508991"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M78 65C85 75 75 95 82 105"
      stroke="#508991"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M122 65C115 75 125 95 118 105"
      stroke="#508991"
      strokeWidth="8"
      strokeLinecap="round"
    />
  </svg>
);

// --- Components ---

const SideMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}> = ({ isOpen, onClose, lang }) => {
  const t = (key: string) => translations[key]?.[lang] || key;
  const navigate = useNavigate();

  const menuItems = [
    { label: t("quickView"), path: "/quick-view", icon: "👁️" },
    { label: t("myDoctor"), path: "/doctor", icon: "👨‍⚕️" },
    { label: t("liveMedicalFile"), path: "/medical-file", icon: "📁" },
    { label: t("journal"), path: "/journal", icon: "📅" },
    { label: t("statusAssessment"), path: "/wizard", icon: "📝" },
    { label: t("tutorial"), path: "/tutorial", icon: "🎓" },
    { label: t("contactUs"), path: "/contact", icon: "📞" },
    { label: t("infoAndGuidance"), path: "/info", icon: "💡" },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-[#172A3A]/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 ${
          lang === "he" ? "right-0" : "left-0"
        } h-full w-80 bg-white z-[70] shadow-2xl drawer-transition ${
          isOpen
            ? "translate-x-0"
            : lang === "he"
            ? "translate-x-full"
            : "-translate-x-full"
        }`}
      >
        <div className="p-10 pt-16 space-y-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <Logo className="w-24 h-24" />
            <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
              awareCare
            </h2>
          </div>
          <nav className="space-y-3">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className="w-full flex items-center gap-5 p-4 hover:bg-[#D6F3F4] rounded-[24px] transition-all font-bold text-[#172A3A] group active:scale-95"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className={lang === "he" ? "text-right" : "text-left"}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

const CloudBubble: React.FC<{
  label: string;
  onClick: () => void;
  size?: string;
  variant?: "primary" | "secondary";
}> = ({ label, onClick, size = "w-36 h-36", variant = "secondary" }) => (
  <button
    onClick={onClick}
    className={`cloud-bubble flex flex-col items-center justify-center text-center p-4 font-extrabold transition-all active:scale-90 ${size} ${
      variant === "primary"
        ? "bg-[#508991] text-white border-none shadow-xl shadow-[#508991]/30"
        : "bg-[#D6F3F4] text-[#172A3A] border-2 border-[#74B3CE]/20 shadow-lg shadow-[#508991]/5 hover:bg-[#C2EBF0]"
    }`}
  >
    <span className="text-sm leading-tight px-2">{label}</span>
  </button>
);

// --- New Pages ---

const QuickView: React.FC<{ lang: Language }> = ({ lang }) => {
  const navigate = useNavigate();
  const t = (key: string) => translations[key]?.[lang] || key;
  const isHe = lang === "he";

  const activeMeds = buildActiveMeds(lang);
  const stoppedMeds = buildStoppedMeds(lang);

  const formatTodayLocal = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const parseTimesLocal = (timeStr: string) =>
    (timeStr || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .filter((t) => /^\d{2}:\d{2}$/.test(t));

  const todayStr = formatTodayLocal();
  const nowStr = `${String(new Date().getHours()).padStart(2, "0")}:${String(
    new Date().getMinutes()
  ).padStart(2, "0")}`;

  const todaySchedule = activeMeds
    .flatMap((m) =>
      parseTimesLocal(m.time).map((time) => ({
        time,
        title: `${m.name} ${m.dose}`,
        notes: m.freq,
      }))
    )
    .sort((a, b) => a.time.localeCompare(b.time));

  const nextDose =
    todaySchedule.find((e) => e.time >= nowStr) || todaySchedule[0] || null;

  // Dementia-specific believable data
  const feedItems = [
    {
      id: 1,
      date: "24/07/2025",
      title: { he: "אריספט (Donepezil) 10mg", en: "Aricept (Donepezil) 10mg" },
      sub: { he: "נטילת תרופה - ערב", en: "Medication Intake - Evening" },
      type: "med",
      status: { he: "מרשם בתוקף", en: "Active Prescription" },
    },
    {
      id: 2,
      date: "21/07/2025",
      title: { he: "ד״ר אורי גרינברג", en: "Dr. Uri Greenberg" },
      sub: {
        he: "מעקב פסיכוגריאטרי - מרפאת זיכרון",
        en: "Psychogeriatric Follow-up - Memory Clinic",
      },
      type: "appointment",
      status: { he: "תור עתידי", en: "Upcoming Appointment" },
    },
    {
      id: 3,
      date: "15/07/2025",
      title: { he: "בדיקת דם תקופתית", en: "Routine Blood Test" },
      sub: { he: "מעבדה - רמת ויטמין B12", en: "Lab - B12 Levels" },
      type: "lab",
      hasAttachment: true,
      status: { he: "תוצאה תקינה", en: "Normal Result" },
    },
  ];

  return (
    <div className="px-6 pt-10 pb-32 min-h-screen bg-white ac-page">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="p-3 bg-[#D6F3F4] rounded-full shadow-sm text-[#172A3A] hover:bg-[#C2EBF0]"
        >
          <svg
            className="w-6 h-6 rtl-flip"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
          {t("quickView")}
        </h2>
      </div>

      {/* Top Summary Card (AwareCare Original Style) */}
      <div className="bg-[#172A3A] text-white p-8 rounded-[40px] shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-black text-xl mb-2 text-[#D6F3F4]">
            {t("clinicalSummary")}
          </h3>
          <p className="text-xs opacity-80 leading-relaxed max-w-[80%]">
            {isHe
              ? "יציבות קוגניטיבית נשמרת. מומלץ להקפיד על שתייה מרובה בשעות הבוקר עקב ערכי לחץ דם נמוכים שנמדדו."
              : "Cognitive stability maintained. Recommended to ensure high fluid intake in the morning due to low BP readings."}
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Logo className="w-32 h-32" />
        </div>
      </div>

      {/* Medication Snapshot (Synced with Meds & Prescriptions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="ac-card bg-[#D6F3F4] rounded-[32px] p-6 border border-[#74B3CE]/20 shadow-sm ac-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-[#172A3A] font-black tracking-tight">
                {isHe ? "תרופות (נלקחות כיום)" : "Active Medications"}
              </h4>
              <p className="text-xs text-slate-500 font-bold mt-1">
                {isHe
                  ? `${activeMeds.length} תרופות פעילות • ${stoppedMeds.length} הופסקו`
                  : `${activeMeds.length} active • ${stoppedMeds.length} stopped`}
              </p>
            </div>
            <button
              onClick={() => navigate("/medical-file/meds")}
              className="text-xs font-black px-4 py-2 rounded-full bg-white text-[#508991] hover:bg-[#C2EBF0] transition"
            >
              {isHe ? "לפרטים" : "Details"}
            </button>
          </div>

          <div className="mt-4">
            <div className="text-xs text-slate-500 font-bold mb-2">
              {isHe ? "המנה הבאה" : "Next dose"}
            </div>
            {nextDose ? (
              <div className="flex items-center justify-between gap-3">
                <span className="px-3 py-1 rounded-full bg-white text-[#508991] text-xs font-black">
                  {nextDose.time}
                </span>
                <span className="text-sm font-black text-[#172A3A] truncate">
                  {nextDose.title}
                </span>
              </div>
            ) : (
              <div className="text-sm font-black text-[#172A3A]">
                {isHe ? "אין זמני נטילה היום" : "No scheduled doses today"}
              </div>
            )}
          </div>
        </div>

        <div className="ac-card bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm ac-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-[#172A3A] font-black tracking-tight">
                {isHe ? "יומן" : "Journal"}
              </h4>
              <p className="text-xs text-slate-500 font-bold mt-1">
                {isHe
                  ? "תזכורות נטילה • התחלת תרופה • מעקב לרופא"
                  : "Dose reminders • New med start • Doctor sync"}
              </p>
            </div>
            <button
              onClick={() => navigate("/journal")}
              className="text-xs font-black px-4 py-2 rounded-full bg-[#D6F3F4] text-[#508991] hover:bg-[#C2EBF0] transition"
            >
              {isHe ? "פתח יומן" : "Open"}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-sm font-black text-[#172A3A]">
              {isHe ? "עודכן" : "Updated"}
            </div>
            <div className="text-xs font-bold text-slate-500">{todayStr}</div>
          </div>

          <div className="mt-3 text-xs text-slate-500 font-bold">
            {isHe
              ? "שיתוף עם הרופא זמין דרך ייצוא ליומן (ICS)"
              : "Doctor sync available via calendar export (ICS)"}
          </div>
        </div>
      </div>

      {/* Timeline Feed (Inspired by provided images) */}
      <div className="space-y-0 relative">
        {feedItems.map((item, idx) => (
          <div
            key={item.id}
            className="relative flex group ac-fade-up"
            style={{ animationDelay: `${idx * 70}ms` }}
          >
            {/* Vertical Timeline Line and Dot */}
            <div
              className={`absolute ${
                isHe ? "right-0" : "left-0"
              } top-0 bottom-0 w-[2px] bg-rose-100`}
            >
              <div className="absolute top-8 -translate-x-1/2 left-1/2 w-3 h-3 bg-rose-300 rounded-full border-2 border-white shadow-sm z-10" />
            </div>

            {/* Content Card */}
            <div
              className={`flex-1 ${
                isHe ? "mr-8" : "ml-8"
              } py-6 border-b border-slate-100 flex justify-between items-start active:bg-slate-50 transition-colors rounded-xl px-2`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {item.hasAttachment && (
                    <span className="text-slate-400 text-sm">📎</span>
                  )}
                  <p className="font-black text-lg text-[#172A3A] leading-tight">
                    {item.title[lang]}
                  </p>
                </div>
                <p className="text-sm font-bold text-[#508991]">
                  {item.sub[lang]}
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {item.status[lang]}
                </p>
              </div>

              <div className="text-right flex flex-col items-end gap-4">
                <span className="text-xs font-black text-slate-400 whitespace-nowrap">
                  {item.date}
                </span>
                <span className="text-[#D6F3F4] group-hover:text-[#508991] transition-colors">
                  {isHe ? "〈" : "〉"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button (As seen in the image) */}
      <button className="fixed bottom-32 left-8 right-8 bg-[#172A3A] text-white p-5 rounded-[32px] font-black shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform z-50">
        <span className="text-2xl">+</span>
        <span>{isHe ? "פעולות מהירות" : "Quick Actions"}</span>
      </button>
    </div>
  );
};

const DoctorContact: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (key: string) => translations[key]?.[lang] || key;
  return (
    <div className="px-6 pt-10 pb-32 min-h-screen bg-white ac-page">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => window.history.back()}
          className="p-3 bg-[#D6F3F4] rounded-full shadow-sm text-[#172A3A] hover:bg-[#C2EBF0]"
        >
          <svg
            className="w-6 h-6 rtl-flip"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
          {t("myDoctor")}
        </h2>
      </div>
      <div className="bg-[#D6F3F4] p-10 rounded-[48px] border border-[#74B3CE]/20 text-center space-y-6">
        <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center text-4xl shadow-sm">
          👨‍⚕️
        </div>
        <h3 className="text-2xl font-black text-[#172A3A]">
          {t("doctorName")}
        </h3>
        <p className="text-[#508991] font-bold">{t("clinicHours")}</p>
        <a
          href="tel:*"
          className="block w-full p-4 bg-[#508991] text-white rounded-[24px] font-black shadow-lg active:scale-95 transition-transform"
        >
          {t("callClinic")}
        </a>
      </div>
    </div>
  );
};

// --- Medical File Views with Dummy Data ---

type ActiveMedication = {
  name: string;
  dose: string;
  time: string; // e.g. "08:00, 18:00"
  freq: string;
  type: string;
};

type MedicationHistoryItem = {
  name: string;
  dose: string;
  stopDate: string;
  reason: string;
};

const buildActiveMeds = (lang: Language): ActiveMedication[] => {
  const isHe = lang === "he";
  return [
    {
      name: isHe ? "נקסיום" : "Nexium",
      dose: isHe ? "20 מ״ג" : "20mg",
      time: "08:00, 18:00",
      freq: isHe ? "2 ביום" : "Twice daily",
      type: isHe ? "כדור" : "Pill",
    },
    {
      name: isHe ? "טריטייס" : "Tritace",
      dose: isHe ? "5 מ״ג" : "5mg",
      time: "08:00",
      freq: isHe ? "1 ביום" : "Once daily",
      type: isHe ? "כדור" : "Pill",
    },
    {
      name: isHe ? "אומניק אוקאס" : "Omnic Ocas",
      dose: isHe ? "0.4 מ״ג" : "0.4mg",
      time: "08:00",
      freq: isHe ? "1 ביום" : "Once daily",
      type: isHe ? "כדור" : "Pill",
    },
    {
      name: isHe ? "אנברל" : "Enbrel",
      dose: isHe ? "50 מ״ג" : "50mg",
      time: isHe ? "יום קבוע" : "Fixed day",
      freq: isHe ? "זריקה פעם בשבוע" : "Weekly injection",
      type: isHe ? "זריקה" : "Injection",
    },
    {
      name: isHe ? "חומצה פולית" : "Folic Acid",
      dose: isHe ? "—" : "—",
      time: "08:00",
      freq: isHe ? "1 ביום" : "Once daily",
      type: isHe ? "תוסף" : "Supplement",
    },
    {
      name: isHe ? "פלאביקס" : "Plavix",
      dose: isHe ? "75 מ״ג" : "75mg",
      time: "08:00",
      freq: isHe ? "1 ביום" : "Once daily",
      type: isHe ? "כדור" : "Pill",
    },
    {
      name: isHe ? "פנרגן" : "Phenergan",
      dose: isHe ? "—" : "—",
      time: "08:00, 13:00, 18:00",
      freq: isHe ? "3 ביום" : "3 times daily",
      type: isHe ? "כדור" : "Pill",
    },
    {
      name: isHe ? "קלופיקסול" : "Clopixol",
      dose: isHe ? "200 מ״ל" : "200ml",
      time: isHe ? "תאריך קבוע" : "Scheduled",
      freq: isHe ? "זריקה פעם בחודש" : "Monthly injection",
      type: isHe ? "זריקה" : "Injection",
    },
    {
      name: isHe ? "ארטן" : "Artane",
      dose: isHe ? "—" : "—",
      time: "08:00, 13:00",
      freq: isHe ? "2 ביום" : "Twice daily",
      type: isHe ? "כדור" : "Pill",
    },
  ];
};

const buildStoppedMeds = (lang: Language): MedicationHistoryItem[] => {
  const isHe = lang === "he";
  return [
    {
      name: isHe ? "ריספרדל" : "Risperdal",
      dose: isHe ? "0.25 מ״ג" : "0.25mg",
      stopDate: "—",
      reason: isHe ? "הופסק • מחמיר מצב רוח" : "Stopped • Worsens mood",
    },
    {
      name: isHe ? "ובן" : "Ben",
      dose: isHe ? "10 מ״ג" : "10mg",
      stopDate: "—",
      reason: isHe ? "הופסק • מחמיר מצב רוח" : "Stopped • Worsens mood",
    },
    {
      name: isHe ? "דונפזיל" : "Donepezil",
      dose: isHe ? "5 מ״ג" : "5mg",
      stopDate: "—",
      reason: isHe ? "הופסק • השפעה קצרה" : "Stopped • Short effect",
    },
    {
      name: isHe ? "מירטזפין" : "Mirtazapine",
      dose: isHe ? "30 מ״ג" : "30mg",
      stopDate: "—",
      reason: isHe ? "הופסק • השפעה קצרה" : "Stopped • Short effect",
    },
    {
      name: isHe ? "ציפרלקס" : "Cipralex",
      dose: isHe ? "10 מ״ג" : "10mg",
      stopDate: "—",
      reason: isHe ? "הופסק • תמה ההשפעה" : "Stopped • Effect ended",
    },
    {
      name: isHe ? "פוסאבנס" : "Fosavance",
      dose: isHe ? "70 מ״ג" : "70mg",
      stopDate: "—",
      reason: isHe ? "הופסק • תמה ההשפעה" : "Stopped • Effect ended",
    },
    {
      name: isHe ? "יו־לקטין פורטה" : "U‑Lactin Forte",
      dose: isHe ? "—" : "—",
      stopDate: "—",
      reason: isHe ? "הופסק" : "Stopped",
    },
  ];
};

type CalendarEventType = "NEW_MED_START" | "MED_TIME" | "APPOINTMENT";
type CalendarEvent = {
  id: string;
  type: CalendarEventType;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  notes?: string;
};

const CALENDAR_STORAGE_KEY = "awarecare_calendar_events_v1";

type Doctor = {
  id: string;
  nameHe: string;
  nameEn: string;
  specialtyHe: string;
  specialtyEn: string;
  clinicHe: string;
  clinicEn: string;
  addressHe: string;
  addressEn: string;
  phone: string;
};

type Appointment = {
  id: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  reason: string;
};

const APPOINTMENTS_STORAGE_KEY = "awarecare_appointments_v1";

const FAKE_DOCTORS: Doctor[] = [
  {
    id: "d1",
    nameHe: 'ד"ר מרים לוי',
    nameEn: "Dr. Miriam Levi",
    specialtyHe: "רפואת משפחה",
    specialtyEn: "Family Medicine",
    clinicHe: "מרפאת העיר",
    clinicEn: "City Clinic",
    addressHe: "רח׳ הרקפת 12, מרכז העיר",
    addressEn: "12 HaRakefet St., City Center",
    phone: "03-555-0192",
  },
  {
    id: "d2",
    nameHe: 'ד"ר יונתן כהן',
    nameEn: "Dr. Yonatan Cohen",
    specialtyHe: "נוירולוגיה",
    specialtyEn: "Neurology",
    clinicHe: "מרפאת מומחים – קומה 3",
    clinicEn: "Specialists Clinic – Floor 3",
    addressHe: "שד׳ הים 48, בניין B",
    addressEn: "48 HaYam Blvd., Building B",
    phone: "03-555-0137",
  },
  {
    id: "d3",
    nameHe: 'ד"ר נועה בן־דוד',
    nameEn: "Dr. Noa Ben‑David",
    specialtyHe: "פסיכיאטריה",
    specialtyEn: "Psychiatry",
    clinicHe: "מרכז בריאות הנפש",
    clinicEn: "Mental Health Center",
    addressHe: "רח׳ הדקל 7, קומה 2",
    addressEn: "7 HaDekel St., Floor 2",
    phone: "03-555-0110",
  },
  {
    id: "d4",
    nameHe: 'ד"ר דניאל רוזן',
    nameEn: "Dr. Daniel Rosen",
    specialtyHe: "ראומטולוגיה",
    specialtyEn: "Rheumatology",
    clinicHe: "מרפאת מפרקים",
    clinicEn: "Joint & Rheum Clinic",
    addressHe: "רח׳ הנגב 22, אגף מערבי",
    addressEn: "22 HaNegev St., West Wing",
    phone: "03-555-0178",
  },
];

const pad2 = (n: number) => String(n).padStart(2, "0");

const addDays = (base: Date, days: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};

const toYmd = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
};

const formatDayLabel = (lang: Language, d: Date) => {
  const weekdayHe = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
  const weekdayEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const wd = d.getDay();
  const day = d.getDate();
  return lang === "he" ? `${weekdayHe[wd]} ${day}` : `${weekdayEn[wd]} ${day}`;
};

const generateSlotsForDoctor = (doctorId: string, date: string) => {
  // Pseudo-realistic availability: different patterns per doctor + some gaps
  const base =
    doctorId === "d1"
      ? ["09:00", "09:30", "10:30", "11:00", "16:00", "16:30"]
      : doctorId === "d2"
      ? ["08:30", "09:30", "10:00", "12:00", "15:00"]
      : doctorId === "d3"
      ? ["10:00", "11:00", "13:00", "14:00", "18:00"]
      : ["09:00", "10:00", "11:30", "12:30", "17:00"];

  // Add deterministic "busy" gaps by hashing date string
  const hash = Array.from(date).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const removeIdx = hash % base.length;
  return base.filter((_, i) => i !== removeIdx);
};

const formatToday = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const parseTimes = (timeField: string): string[] => {
  // expected "08:00, 18:00" -> ["08:00","18:00"]
  return (timeField || "")
    .split(",")
    .map((t) => t.trim())
    .filter((t) => /^\d{2}:\d{2}$/.test(t));
};

const downloadIcs = (lang: Language, events: CalendarEvent[]) => {
  const isHe = lang === "he";
  const header = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AwareCare//Journal//EN",
    "CALSCALE:GREGORIAN",
  ];

  const lines: string[] = [...header];

  for (const e of events) {
    const uid = e.id.replace(/\s+/g, "-");
    const dt = e.time
      ? `${e.date.replaceAll("-", "")}T${e.time.replace(":", "")}00`
      : `${e.date.replaceAll("-", "")}T090000`;

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid}@awarecare`);
    lines.push(`DTSTART:${dt}`);
    lines.push(`SUMMARY:${e.title}`);
    if (e.notes) lines.push(`DESCRIPTION:${e.notes}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  const blob = new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = isHe ? "awarecare_יומן.ics" : "awarecare_journal.ics";
  a.click();
  URL.revokeObjectURL(url);
};

const JournalView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (key: string) => translations[key]?.[lang] || key;
  const isHe = lang === "he";

  const activeMeds = buildActiveMeds(lang);
  const todayStr = formatToday();

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const raw = localStorage.getItem(CALENDAR_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CalendarEvent[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftType, setDraftType] = useState<CalendarEventType>("MED_TIME");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDate, setDraftDate] = useState(todayStr);
  const [draftTime, setDraftTime] = useState("08:00");
  const [draftNotes, setDraftNotes] = useState("");

  const scheduledToday: CalendarEvent[] = activeMeds
    .flatMap((m) => {
      const times = parseTimes(m.time);
      return times.map((time) => ({
        id: `${m.name}-${todayStr}-${time}`,
        type: "MED_TIME" as const,
        title: `${m.name} ${m.dose}`,
        date: todayStr,
        time,
        notes: m.freq,
      }));
    })
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  const customToday = events
    .filter((e) => e.date === todayStr)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  const allToday = [...scheduledToday, ...customToday].sort((a, b) =>
    (a.time || "").localeCompare(b.time || "")
  );

  const openModal = (type: CalendarEventType) => {
    setDraftType(type);
    setDraftTitle("");
    setDraftDate(todayStr);
    setDraftTime("08:00");
    setDraftNotes("");
    setIsModalOpen(true);
  };

  const saveEvent = () => {
    if (!draftTitle.trim()) return;

    const id = `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const newEvent: CalendarEvent = {
      id,
      type: draftType,
      title: draftTitle.trim(),
      date: draftDate,
      time: draftType === "MED_TIME" ? draftTime : undefined,
      notes: draftNotes.trim() || undefined,
    };
    setEvents((prev) => [newEvent, ...prev]);
    setIsModalOpen(false);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="px-10 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#172A3A]">{t("journal")}</h2>
          <p className="text-slate-500 font-medium mt-1">
            {isHe
              ? "מעקב אחר התחלת תרופות וזמני נטילה (ניתן לשתף עם הרופא)"
              : "Track new medications and intake times (shareable with your doctor)"}
          </p>
        </div>

        <button
          onClick={() => downloadIcs(lang, [...events, ...scheduledToday])}
          className="px-5 py-3 rounded-full bg-[#74B3CE] text-white font-bold shadow-sm hover:opacity-95 transition"
        >
          {isHe ? "סנכרון עם הרופא (יומן)" : "Sync with Doctor (Calendar)"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="p-6 bg-white rounded-[32px] border border-[#74B3CE]/20 shadow-sm ac-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#172A3A]">
                {isHe ? "לוח זמנים להיום" : "Today's Schedule"}
              </h3>
              <span className="text-sm font-bold text-slate-400">
                {todayStr}
              </span>
            </div>

            <div className="space-y-3">
              {allToday.length === 0 ? (
                <div className="text-slate-400 font-medium">
                  {isHe ? "אין אירועים להיום" : "No events for today"}
                </div>
              ) : (
                allToday.map((e) => (
                  <div
                    key={e.id}
                    className="p-5 bg-[#D6F3F4] rounded-[28px] border border-[#74B3CE]/20 shadow-sm flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="text-[#172A3A] font-extrabold">
                        {e.title}
                      </div>
                      {e.notes ? (
                        <div className="text-slate-500 font-semibold text-sm mt-1">
                          {e.notes}
                        </div>
                      ) : null}
                      <div className="text-xs font-bold text-[#508991] mt-2">
                        {e.type === "NEW_MED_START"
                          ? isHe
                            ? "התחלת תרופה חדשה"
                            : "New medication start"
                          : e.type === "APPOINTMENT"
                          ? isHe
                            ? "זימון תור"
                            : "Appointment"
                          : isHe
                          ? "זמן קבלת תרופות"
                          : "Medication time"}
                      </div>
                    </div>

                    <div className="min-w-[150px] flex flex-col items-end text-right">
                      <span className="block px-3 py-1 bg-white rounded-full text-xs font-bold text-[#508991] leading-none">
                        {e.time || (isHe ? "כל היום" : "All day")}
                      </span>

                      {/* Delete only custom events */}
                      {events.some((x) => x.id === e.id) ? (
                        <button
                          onClick={() => deleteEvent(e.id)}
                          className="text-xs font-bold text-slate-400 mt-2 hover:text-red-500 transition"
                        >
                          {isHe ? "מחיקה" : "Delete"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="p-6 bg-white rounded-[32px] border border-[#74B3CE]/20 shadow-sm ac-card">
            <h3 className="text-lg font-bold text-[#172A3A] mb-4">
              {isHe ? "הוספת אירוע" : "Add Event"}
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => openModal("NEW_MED_START")}
                className="w-full px-5 py-4 rounded-[24px] bg-[#74B3CE] text-white font-extrabold shadow-sm hover:opacity-95 transition"
              >
                {isHe ? "התחלת תרופה חדשה" : "New Medication Start"}
              </button>

              <button
                onClick={() => openModal("MED_TIME")}
                className="w-full px-5 py-4 rounded-[24px] bg-[#508991] text-white font-extrabold shadow-sm hover:opacity-95 transition"
              >
                {isHe ? "זמן קבלת תרופות" : "Medication Intake Time"}
              </button>

              <div className="pt-3 text-sm text-slate-500 font-medium">
                {isHe
                  ? "טיפ: הוסף אירועים חריגים (שינוי מינון, התחלה/הפסקה) כדי שהרופא יראה תמונה מלאה."
                  : "Tip: Add changes (new meds, dose changes) for a complete doctor view."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-[80] bg-[#172A3A]/50 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-[#74B3CE]/20 p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-[#172A3A]">
                  {draftType === "NEW_MED_START"
                    ? isHe
                      ? "התחלת תרופה חדשה"
                      : "New Medication Start"
                    : isHe
                    ? "זמן קבלת תרופות"
                    : "Medication Intake Time"}
                </h3>
                <p className="text-slate-500 font-medium mt-1">
                  {isHe
                    ? "מלא פרטים כדי להוסיף ליומן."
                    : "Fill details to add to the journal."}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-100 font-bold text-slate-500 hover:bg-slate-200 transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">
                  {isHe ? "כותרת" : "Title"}
                </label>
                <input
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder={
                    draftType === "NEW_MED_START"
                      ? isHe
                        ? "לדוגמה: התחלת נקסיום"
                        : "e.g., Start Nexium"
                      : isHe
                      ? "לדוגמה: נטילת פלאביקס"
                      : "e.g., Take Plavix"
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#74B3CE]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">
                    {isHe ? "תאריך" : "Date"}
                  </label>
                  <input
                    type="date"
                    value={draftDate}
                    onChange={(e) => setDraftDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#74B3CE]/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">
                    {isHe ? "שעה" : "Time"}
                  </label>
                  <input
                    type="time"
                    value={draftTime}
                    onChange={(e) => setDraftTime(e.target.value)}
                    disabled={draftType !== "MED_TIME"}
                    className={`w-full px-4 py-3 rounded-2xl border border-slate-200 font-semibold outline-none focus:ring-2 focus:ring-[#74B3CE]/30 ${
                      draftType !== "MED_TIME"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-slate-50"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">
                  {isHe ? "הערות" : "Notes"}
                </label>
                <textarea
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  placeholder={
                    isHe
                      ? "לדוגמה: תופעות לוואי, שינוי מינון, הערה לרופא..."
                      : "e.g., side effects, dose changes, note for doctor..."
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-[#74B3CE]/30 min-h-[110px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-full bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  {isHe ? "ביטול" : "Cancel"}
                </button>
                <button
                  onClick={saveEvent}
                  className="px-5 py-3 rounded-full bg-[#74B3CE] text-white font-bold shadow-sm hover:opacity-95 transition"
                >
                  {isHe ? "שמירה" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const MedicationsView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (key: string) => translations[key]?.[lang] || key;
  const meds = buildActiveMeds(lang);

  return (
    <div className="px-6 pt-10 pb-32 min-h-screen bg-white ac-page">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => window.history.back()}
          className="p-3 bg-[#D6F3F4] rounded-full shadow-sm text-[#172A3A] hover:bg-[#C2EBF0]"
        >
          <svg
            className="w-6 h-6 rtl-flip"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
          {t("medications")}
        </h2>
      </div>
      <div className="space-y-4">
        <h3 className="text-[#508991] font-black px-2">{t("activeMeds")}</h3>
        {meds.map((m, i) => (
          <div
            key={i}
            className="p-6 bg-[#D6F3F4] rounded-[32px] border border-[#74B3CE]/20 shadow-sm ac-card flex items-start justify-between gap-4"
          >
            <div>
              <p className="font-black text-xl text-[#172A3A]">{m.name}</p>
              <p className="text-sm font-bold text-slate-500">
                {m.dose} • {m.type}
              </p>
            </div>
            <div className="min-w-[160px] flex flex-col items-end text-right">
              <span className="block px-3 py-1 bg-white rounded-full text-xs font-bold text-[#508991] leading-none">
                {m.time}
              </span>
              <span className="text-xs text-slate-400 font-bold leading-snug">
                {m.freq}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MedicationHistoryView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (key: string) => translations[key]?.[lang] || key;
  const historyMeds = buildStoppedMeds(lang);

  return (
    <div className="px-6 pt-10 pb-32 min-h-screen bg-white ac-page">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => window.history.back()}
          className="p-3 bg-[#D6F3F4] rounded-full shadow-sm text-[#172A3A] hover:bg-[#C2EBF0]"
        >
          <svg
            className="w-6 h-6 rtl-flip"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
          {t("medHistory")}
        </h2>
      </div>
      <div className="space-y-4">
        <h3 className="text-[#508991] font-black px-2">{t("stoppedMeds")}</h3>
        {historyMeds.map((m, i) => (
          <div
            key={i}
            className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col gap-2 opacity-80"
          >
            <p className="font-black text-xl text-slate-700 decoration-slate-400 decoration-2 line-through">
              {m.name}
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm font-bold text-slate-400">
              <span className="truncate">{m.dose}</span>
              <span className="text-right">
                {t("date")}: {m.stopDate}
              </span>
            </div>
            <p className="text-xs text-rose-400 font-bold bg-rose-50 p-2 rounded-xl mt-1">
              {m.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const VisitSummariesView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (key: string) => translations[key]?.[lang] || key;
  const visits = [
    {
      date: "15/01/2024",
      doctor: t("psychogeriatrician"),
      summary: t("summaryText1"),
    },
    {
      date: "02/12/2023",
      doctor: t("familyDoctor"),
      summary: t("summaryText2"),
    },
  ];

  return (
    <div className="px-6 pt-10 pb-32 min-h-screen bg-white ac-page">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => window.history.back()}
          className="p-3 bg-[#D6F3F4] rounded-full shadow-sm text-[#172A3A] hover:bg-[#C2EBF0]"
        >
          <svg
            className="w-6 h-6 rtl-flip"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
          {t("visitSummaries")}
        </h2>
      </div>
      <div className="space-y-6">
        {visits.map((v, i) => (
          <div
            key={i}
            className="p-8 bg-[#D6F3F4] rounded-[40px] border border-[#74B3CE]/20 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-center border-b border-[#508991]/20 pb-3">
              <span className="font-black text-[#172A3A] text-lg">
                {v.date}
              </span>
              <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-[#508991]">
                {v.doctor}
              </span>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed text-sm">
              {v.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SensitivitiesView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (key: string) => translations[key]?.[lang] || key;
  const allergies = [
    { name: t("penicillin"), reaction: t("reactionRash") },
    { name: t("sulfa"), reaction: t("reactionNausea") },
  ];

  return (
    <div className="px-6 pt-10 pb-32 min-h-screen bg-white ac-page">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => window.history.back()}
          className="p-3 bg-[#D6F3F4] rounded-full shadow-sm text-[#172A3A] hover:bg-[#C2EBF0]"
        >
          <svg
            className="w-6 h-6 rtl-flip"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
          {t("sensitivities")}
        </h2>
      </div>
      <div className="space-y-4">
        <h3 className="text-rose-500 font-black px-2 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {t("sensitivityTitle")}
        </h3>
        {allergies.map((a, i) => (
          <div
            key={i}
            className="p-6 bg-rose-50 rounded-[32px] border border-rose-100 shadow-sm ac-card"
          >
            <p className="font-black text-xl text-rose-800 mb-1">{a.name}</p>
            <p className="text-sm font-bold text-rose-600/80">{a.reaction}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const UploadDocsView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (key: string) => translations[key]?.[lang] || key;
  return (
    <div className="px-6 pt-10 pb-32 min-h-screen bg-white ac-page">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => window.history.back()}
          className="p-3 bg-[#D6F3F4] rounded-full shadow-sm text-[#172A3A] hover:bg-[#C2EBF0]"
        >
          <svg
            className="w-6 h-6 rtl-flip"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
          {t("uploadDocs")}
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center p-10 bg-[#D6F3F4] rounded-[48px] border-2 border-dashed border-[#74B3CE] text-center gap-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm">
          <svg
            className="w-10 h-10 text-[#508991]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="font-black text-[#172A3A] text-lg">{t("uploadBtn")}</p>
          <p className="text-sm text-slate-500 font-medium px-4">
            {t("uploadInstruction")}
          </p>
        </div>
        <button className="px-8 py-3 bg-[#508991] text-white rounded-2xl font-black shadow-lg active:scale-95 transition-transform">
          {t("uploadDocs")}
        </button>
      </div>
    </div>
  );
};

const MedicalFileDashboard: React.FC<{ lang: Language }> = ({ lang }) => {
  const navigate = useNavigate();
  const t = (key: string) => translations[key]?.[lang] || key;

  const items = [
    {
      label: t("uploadDocs"),
      icon: "📤",
      action: () => navigate("/medical-file/upload"),
    },
    {
      label: t("medications"),
      icon: "💊",
      action: () => navigate("/medical-file/meds"),
    },
    {
      label: t("visitSummaries"),
      icon: "📋",
      action: () => navigate("/medical-file/summaries"),
    },
    {
      label: t("medHistory"),
      icon: "📜",
      action: () => navigate("/medical-file/history"),
    },
    {
      label: t("questHistory"),
      icon: "📊",
      action: () => navigate("/history"),
      highlight: true,
    }, // Most important
    {
      label: t("sensitivities"),
      icon: "⚠️",
      action: () => navigate("/medical-file/sensitivities"),
    },
  ];

  return (
    <div className="px-6 pt-10 pb-32 min-h-screen bg-white ac-page">
      <div className="flex items-center gap-4 mb-10">
        {/* Explicitly navigate to home to fix back button issue */}
        <button
          onClick={() => navigate("/")}
          className="p-3 bg-[#D6F3F4] rounded-full shadow-sm text-[#172A3A] hover:bg-[#C2EBF0]"
        >
          <svg
            className="w-6 h-6 rtl-flip"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
          {t("liveMedicalFile")}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className={`p-6 rounded-[32px] border-2 flex items-center gap-4 transition-all active:scale-95 text-left rtl:text-right ${
              item.highlight
                ? "bg-[#172A3A] border-[#172A3A] text-white shadow-xl"
                : "bg-[#D6F3F4] border-[#74B3CE]/20 text-[#172A3A] hover:bg-[#C2EBF0]"
            }`}
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="font-bold text-lg">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const QuestionnaireHistory: React.FC<{ lang: Language }> = ({ lang }) => {
  const [history, setHistory] = useState<any[]>([]);
  const t = (key: string) => translations[key]?.[lang] || key;

  useEffect(() => {
    const h = localStorage.getItem("awareCareHistory");
    if (h) setHistory(JSON.parse(h));
  }, []);

  return (
    <div className="px-6 pt-10 pb-32 min-h-screen bg-white ac-page">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => window.history.back()}
          className="p-3 bg-[#D6F3F4] rounded-full shadow-sm text-[#172A3A] hover:bg-[#C2EBF0]"
        >
          <svg
            className="w-6 h-6 rtl-flip"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
          {t("questHistory")}
        </h2>
      </div>
      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-center py-20 text-slate-400 font-bold">
            {translations.noData[lang]}
          </p>
        ) : (
          history.map((h, i) => (
            <div
              key={i}
              className="p-8 bg-[#D6F3F4] rounded-[40px] border border-[#74B3CE]/20 flex justify-between items-center shadow-sm"
            >
              <div className="space-y-1">
                <p className="font-black text-xl text-[#172A3A]">
                  {new Date(h.timestamp).toLocaleDateString(
                    lang === "he" ? "he-IL" : "en-US"
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      h.quickLog ? "bg-emerald-500" : "bg-[#508991]"
                    }`}
                  ></span>
                  <p className="text-xs text-slate-400 font-black uppercase tracking-wider">
                    {h.quickLog
                      ? translations.reportNormal[lang]
                      : translations.reportFull[lang]}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-2xl">
                <svg
                  className="w-5 h-5 text-[#508991]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Tutorial: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (key: string) => translations[key]?.[lang] || key;
  return (
    <div className="px-6 pt-10 pb-32 min-h-screen bg-white ac-page">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => window.history.back()}
          className="p-3 bg-[#D6F3F4] rounded-full shadow-sm text-[#172A3A] hover:bg-[#C2EBF0]"
        >
          <svg
            className="w-6 h-6 rtl-flip"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
          {t("tutorial")}
        </h2>
      </div>
      <div className="bg-[#172A3A] text-white p-10 rounded-[48px] shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-black mb-2">{t("videoTutorial")}</h3>
          <p className="text-[#D6F3F4]">{t("playVideo")}</p>
        </div>
      </div>
    </div>
  );
};

const ContactUs: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (key: string) => translations[key]?.[lang] || key;
  return (
    <div className="px-6 pt-10 pb-32 min-h-screen bg-white ac-page">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => window.history.back()}
          className="p-3 bg-[#D6F3F4] rounded-full shadow-sm text-[#172A3A] hover:bg-[#C2EBF0]"
        >
          <svg
            className="w-6 h-6 rtl-flip"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
          {t("contactUs")}
        </h2>
      </div>
      <div className="bg-[#508991] text-white p-10 rounded-[48px] shadow-xl text-center space-y-8">
        <h3 className="text-2xl font-black">{t("supportCenter")}</h3>
        <p className="text-[#D6F3F4] text-lg font-bold">{t("available247")}</p>
        <a
          href="tel:*"
          className="block w-full p-6 bg-white text-[#172A3A] rounded-[32px] font-black text-xl shadow-lg active:scale-95 transition-transform"
        >
          {t("dialNow")}
        </a>
      </div>
    </div>
  );
};

const Home: React.FC<{
  lang: Language;
  onOpenMenu: () => void;
  onToggleLang: () => void;
}> = ({ lang, onOpenMenu, onToggleLang }) => {
  const t = (key: string) => translations[key]?.[lang] || key;
  const navigate = useNavigate();

  const [apptOpen, setApptOpen] = useState(false);
  const [apptDoctorId, setApptDoctorId] = useState<string>(
    FAKE_DOCTORS[0]?.id || "d1"
  );
  const [apptDate, setApptDate] = useState<string>(() => toYmd(new Date()));
  const [apptTime, setApptTime] = useState<string>("");
  const [apptReason, setApptReason] = useState<string>("");

  const isHe = lang === "he";

  const [savedAppointments, setSavedAppointments] = useState<Appointment[]>(
    () => {
      try {
        const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Appointment[]) : [];
      } catch {
        return [];
      }
    }
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        APPOINTMENTS_STORAGE_KEY,
        JSON.stringify(savedAppointments)
      );
    } catch {}
  }, [savedAppointments]);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const selectedDoctor =
    FAKE_DOCTORS.find((d) => d.id === apptDoctorId) || FAKE_DOCTORS[0];
  const availableSlots = generateSlotsForDoctor(apptDoctorId, apptDate).filter(
    (t) => {
      // prevent double-booking
      return !savedAppointments.some(
        (a) =>
          a.doctorId === apptDoctorId && a.date === apptDate && a.time === t
      );
    }
  );

  const closeAppt = () => {
    setApptOpen(false);
    setApptTime("");
    setApptReason("");
  };

  const bookAppointment = () => {
    if (!apptTime) return;
    const id = `appt_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const newAppt: Appointment = {
      id,
      doctorId: apptDoctorId,
      date: apptDate,
      time: apptTime,
      reason: apptReason.trim() || (isHe ? "ביקורת כללית" : "General checkup"),
    };
    setSavedAppointments((prev) => [newAppt, ...prev]);

    // Also add to Journal calendar so everything feels synced
    try {
      const raw = localStorage.getItem(CALENDAR_STORAGE_KEY);
      const calendarEvents: CalendarEvent[] = raw ? JSON.parse(raw) : [];
      const title = isHe
        ? `תור אצל ${selectedDoctor?.nameHe} (${selectedDoctor?.specialtyHe})`
        : `Appointment with ${selectedDoctor?.nameEn} (${selectedDoctor?.specialtyEn})`;
      const notes = isHe
        ? `${selectedDoctor?.clinicHe} • ${selectedDoctor?.addressHe} • ${selectedDoctor?.phone}`
        : `${selectedDoctor?.clinicEn} • ${selectedDoctor?.addressEn} • ${selectedDoctor?.phone}`;
      const apptEvent: CalendarEvent = {
        id: `cal_${id}`,
        type: "APPOINTMENT",
        title,
        date: apptDate,
        time: apptTime,
        notes,
      };
      localStorage.setItem(
        CALENDAR_STORAGE_KEY,
        JSON.stringify([apptEvent, ...calendarEvents])
      );
    } catch {}

    closeAppt();
  };

  return (
    <>
      {" "}
      {/* 1. This opening fragment is the key */}
      <div className="px-6 pt-10 pb-32 min-h-screen bg-white overflow-x-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={onOpenMenu}
            className="p-3 bg-[#D6F3F4] rounded-2xl text-[#172A3A] shadow-sm hover:bg-[#C2EBF0] transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <Logo className="w-14 h-14" />
            <span className="text-[10px] font-black text-[#172A3A] tracking-widest mt-1">
              AWARECARE
            </span>
          </div>
          <button
            onClick={onToggleLang}
            className="px-4 py-2 bg-[#D6F3F4] rounded-2xl text-[#172A3A] shadow-sm font-black text-xs uppercase tracking-tighter hover:bg-[#C2EBF0] transition-colors"
          >
            {t("languageBtn")}
          </button>
        </div>

        <div className="text-center mb-12 space-y-2">
          <h1 className="text-3xl font-black text-[#172A3A] tracking-tighter">
            {t("greeting")}
          </h1>
          <p className="text-[#508991] font-bold text-sm">{t("subtitle")}</p>
        </div>

        {/* Symmetric Cloud Layout */}
        <div className="flex flex-col items-center gap-6">
          <CloudBubble
            label={t("statusSnapshot")}
            onClick={() => navigate("/wizard")}
            size="w-48 h-48"
            variant="primary"
          />
          <div className="flex justify-center gap-6 w-full max-sm:gap-4 max-w-sm">
            <CloudBubble
              label={t("liveMedicalFile")}
              onClick={() => navigate("/medical-file")}
              size="w-36 h-36"
            />
            <CloudBubble
              label={t("generalInfo")}
              onClick={() => navigate("/info")}
              size="w-36 h-36"
            />
          </div>
          <div className="flex justify-center gap-6 w-full max-sm:gap-4 max-w-sm">
            <CloudBubble
              label={t("doctorMessages")}
              onClick={() => navigate("/personal")}
              size="w-32 h-32"
            />
            <CloudBubble
              label={t("appointments")}
              onClick={() => setApptOpen(true)}
              size="w-32 h-32"
            />
          </div>
        </div>
      </div>
      {/* Appointment Modal Logic */}
      {apptOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeAppt}
          />
          <div
            className={`relative w-full max-w-xl bg-white rounded-[40px] border border-[#74B3CE]/30 shadow-2xl p-8 overflow-y-auto max-h-[90vh] ${
              lang === "he" ? "text-right" : "text-left"
            }`}
            style={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-[#172A3A] tracking-tighter">
                  {isHe ? "זימון תור" : "Book an Appointment"}
                </h3>
                <p className="text-sm font-bold text-[#508991]">
                  {isHe
                    ? "בחר רופא, תאריך ושעה פנויה — המידע פיקטיבי"
                    : "Choose a doctor, date and slot — Demo data"}
                </p>
              </div>
              <button
                onClick={closeAppt}
                className="p-3 rounded-2xl bg-[#D6F3F4] text-[#172A3A] font-black"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#D6F3F4] rounded-[28px] p-5 border border-[#74B3CE]/20">
              <label className="block text-xs font-black text-[#172A3A] mb-2 uppercase tracking-wider">
                {isHe ? "רופא רלוונטי" : "Relevant doctor"}
              </label>
              <select
                value={apptDoctorId}
                onChange={(e) => {
                  setApptDoctorId(e.target.value);
                  setApptTime("");
                }}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#74B3CE]/20 font-bold text-[#172A3A] outline-none"
              >
                {FAKE_DOCTORS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {isHe
                      ? `${d.nameHe} • ${d.specialtyHe}`
                      : `${d.nameEn} • ${d.specialtyEn}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Date picker */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-[#172A3A] uppercase">
                  {isHe ? "בחירת תאריך" : "Pick a date"}
                </span>
                <span className="text-xs font-bold text-[#508991] bg-white px-2 py-1 rounded-lg">
                  {apptDate}
                </span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((d) => {
                  const ymd = toYmd(d);
                  return (
                    <button
                      key={ymd}
                      onClick={() => {
                        setApptDate(ymd);
                        setApptTime("");
                      }}
                      className={`py-3 rounded-xl border font-black text-xs transition-all ${
                        ymd === apptDate
                          ? "bg-[#508991] text-white"
                          : "bg-white text-[#172A3A]"
                      }`}
                    >
                      {formatDayLabel(lang, d)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            <div className="mt-6">
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((t) => (
                  <button
                    key={t}
                    onClick={() => setApptTime(t)}
                    className={`py-3 rounded-xl border font-black text-sm transition-all ${
                      t === apptTime
                        ? "bg-[#172A3A] text-white"
                        : "bg-white text-[#172A3A]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={closeAppt}
                className="flex-1 py-4 rounded-2xl bg-[#D6F3F4] text-[#172A3A] font-black"
              >
                {isHe ? "ביטול" : "Cancel"}
              </button>
              <button
                onClick={bookAppointment}
                disabled={!apptTime}
                className={`flex-1 py-4 rounded-2xl font-black ${
                  apptTime
                    ? "bg-[#508991] text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {isHe ? "קבע תור" : "Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </> // 2. This closing fragment matches the one at the top
  );
};

const InfoSection: React.FC<{
  title: string;
  content: string;
  lang: Language;
}> = ({ title, content, lang }) => (
  <div className="bg-[#D6F3F4] rounded-[40px] p-8 border border-[#74B3CE]/20 shadow-sm hover:shadow-md transition-shadow">
    <h3
      className={`text-xl font-black text-[#172A3A] mb-4 border-${
        lang === "he" ? "r" : "l"
      }-4 border-[#508991] ${lang === "he" ? "pr-3" : "pl-3"}`}
    >
      {title}
    </h3>
    <p
      className={`text-slate-600 leading-relaxed font-medium text-sm whitespace-pre-line ${
        lang === "he" ? "text-right" : "text-left"
      }`}
    >
      {content}
    </p>
  </div>
);

const InfoGuidance: React.FC<{ lang: Language }> = ({ lang }) => {
  const navigate = useNavigate();
  const t = (key: string) => translations[key]?.[lang] || key;

  const sections = [
    {
      title: t("infoWhatIsTitle"),
      content: translations["infoWhatIsContent"][lang],
    },
    {
      title: t("infoTypesTitle"),
      content: translations["infoTypesContent"][lang],
    },
    {
      title: t("infoSymptomsTitle"),
      content: translations["infoSymptomsContent"][lang],
    },
    {
      title: t("infoDisorientationTitle"),
      content: translations["infoDisorientationContent"][lang],
    },
    {
      title: t("infoDiagnosisTitle"),
      content: translations["infoDiagnosisContent"][lang],
    },
    {
      title: t("infoCommunicationTitle"),
      content: translations["infoCommunicationContent"][lang],
    },
    {
      title: t("infoOutburstsTitle"),
      content: translations["infoOutburstsContent"][lang],
    },
    {
      title: t("infoSafetyTitle"),
      content: translations["infoSafetyContent"][lang],
    },
    {
      title: t("infoSuddenChangesTitle"),
      content: translations["infoSuddenChangesContent"][lang],
    },
    {
      title: t("infoWhenToSeekTitle"),
      content: translations["infoWhenToSeekContent"][lang],
    },
  ];

  return (
    <div className="px-6 pb-32 pt-10 bg-white min-h-screen overflow-y-auto">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate("/")}
          className="p-3 bg-[#D6F3F4] rounded-full text-[#172A3A] shadow-sm active:scale-90 transition-transform hover:bg-[#C2EBF0]"
        >
          <svg
            className="w-6 h-6 rtl-flip"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
          {t("generalInfo")}
        </h2>
      </div>

      <div className="space-y-6">
        <div className="bg-[#172A3A] text-white p-8 rounded-[48px] shadow-xl text-center">
          <h3 className="text-2xl font-black mb-3">{t("medicalInfoTitle")}</h3>
          <p className="text-[#D6F3F4] text-sm font-bold opacity-80 uppercase tracking-widest">
            {t("medicalInfoSubtitle")}
          </p>
        </div>

        {sections.map((section, idx) => (
          <InfoSection
            key={idx}
            title={section.title}
            content={section.content}
            lang={lang}
          />
        ))}
      </div>
    </div>
  );
};

const Wizard: React.FC<{ lang: Language; onSubmit: (data: any) => void }> = ({
  lang,
  onSubmit,
}) => {
  const [vibeCheck, setVibeCheck] = useState<boolean | null>(null);
  const [showSuccess, setShowSuccess] = useState(false); // New state for the success message
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const navigate = useNavigate();
  const t = (key: string) => translations[key]?.[lang] || key;

  // Dynamically calculate visible questions based on current formData
  const visibleQuestions = DAILY_QUESTIONS.filter((q) => {
    if (!q.dependsOn) return true;
    return formData[q.dependsOn.id] === q.dependsOn.value;
  });

  // --- NEW: Success Message View ---
  if (showSuccess) {
    return (
      <div className="p-10 h-screen flex flex-col items-center justify-center text-center space-y-8 bg-white animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-[#D6F3F4] rounded-full flex items-center justify-center shadow-inner">
          <svg
            className="w-12 h-12 text-[#508991]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-[#172A3A] tracking-tighter">
            {t("vibeSuccessTitle")}
          </h2>
          <p className="text-[#508991] font-bold text-lg leading-relaxed px-4">
            {t("vibeSuccessMessage")}
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="w-full max-w-xs p-6 bg-[#172A3A] text-white rounded-[32px] font-black shadow-xl active:scale-95 transition-transform"
        >
          {t("backToHome")}
        </button>
      </div>
    );
  }

  // --- Initial Vibe Check ---
  if (vibeCheck === null) {
    return (
      <div className="p-10 pb-32 h-screen flex flex-col items-center justify-center text-center space-y-12 bg-white">
        <div className="animate-pulse">
          <Logo className="w-32 h-32" />
        </div>
        <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter leading-tight">
          {t("vibeQuestion")}
        </h2>
        <div className="space-y-4 w-full max-w-xs">
          <button
            onClick={() => {
              setVibeCheck(true);
              onSubmit({
                quickLog: "good",
                timestamp: new Date().toISOString(),
              });
              setShowSuccess(true); // Trigger the success message instead of immediate navigate
            }}
            className="w-full p-6 bg-[#D6F3F4] text-[#172A3A] rounded-[32px] font-black shadow-sm ac-card transition-transform active:scale-95 border-2 border-[#74B3CE]/20 hover:bg-[#C2EBF0]"
          >
            {t("vibeGood")}
          </button>
          <button
            onClick={() => setVibeCheck(false)}
            className="w-full p-6 bg-rose-50 text-rose-700 rounded-[32px] font-black shadow-sm ac-card transition-transform active:scale-95 border-2 border-rose-100 hover:bg-rose-100"
          >
            {t("vibeNotGood")}
          </button>
        </div>
      </div>
    );
  }

  // Ensure step is within bounds of visibleQuestions (important if questions disappear)
  const currentStepIndex = Math.min(step, visibleQuestions.length - 1);
  const q = visibleQuestions[currentStepIndex];

  const isStepValid = () => {
    if (!q) return false;

    if (q.type === "number") {
      const val = formData[q.id];
      // Check if value exists and is within bounds
      if (val === undefined || val === "") return false;
      const num = parseFloat(val);
      if (isNaN(num)) return false;
      if (q.min !== undefined && num < q.min) return false;
      if (q.max !== undefined && num > q.max) return false;
      return true;
    }
    // For Scale, it has a default visual value, but we need to ensure it's captured if user just clicks next
    // Actually, we can just treat it as always valid because we'll default it in handleNext if missing
    if (q.type === "scale") return true;

    // For other types, check if answered
    const val = formData[q.id];
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== "";
  };

  const handleNext = () => {
    if (!isStepValid()) return;

    // Ensure scale default is saved if not interacted with
    if (q.type === "scale" && formData[q.id] === undefined) {
      formData[q.id] = q.min || 1;
    }

    if (currentStepIndex < visibleQuestions.length - 1) {
      setStep(currentStepIndex + 1);
    } else {
      onSubmit({ ...formData, timestamp: new Date().toISOString() });
      navigate("/personal");
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setStep(currentStepIndex - 1);
    } else {
      setVibeCheck(null);
    }
  };

  return (
    <div className="p-8 pb-40 h-screen bg-white flex flex-col justify-between overflow-y-auto">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="text-slate-500 p-2 bg-[#D6F3F4] rounded-full transition-colors active:scale-90 hover:bg-[#C2EBF0]"
          >
            <svg
              className="w-6 h-6 rtl-flip"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="px-4 py-1.5 bg-[#D6F3F4] rounded-full text-[10px] font-black text-[#172A3A] tracking-widest shadow-sm">
            {currentStepIndex + 1} / {visibleQuestions.length}
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[11px] font-black text-[#508991] uppercase tracking-[0.2em]">
            {q.section}
          </span>
          <h2
            className={`text-2xl font-black text-[#172A3A] leading-tight tracking-tight ${
              lang === "he" ? "text-right" : "text-left"
            }`}
          >
            {q.title[lang]}
          </h2>
          {q.help && (
            <div className="bg-[#D6F3F4]/50 p-4 rounded-2xl border-l-4 border-[#508991]">
              <p className="text-sm font-bold text-[#508991] leading-relaxed italic">
                {q.help[lang]}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-3">
          {q.type === "choice" &&
            q.options?.map((opt) => {
              const isSelected = formData[q.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setFormData({ ...formData, [q.id]: opt.value });
                    setTimeout(handleNext, 300);
                  }}
                  className={`w-full p-6 ${
                    lang === "he" ? "text-right" : "text-left"
                  } rounded-[32px] border-2 transition-all font-bold shadow-sm ac-card ${
                    isSelected
                      ? "border-[#508991] bg-[#508991] text-white shadow-md"
                      : "border-[#D6F3F4] bg-white text-slate-500 hover:bg-[#D6F3F4]"
                  }`}
                >
                  {opt.label[lang]}
                </button>
              );
            })}
          {q.type === "multi-choice" &&
            q.options?.map((opt) => {
              const selected = formData[q.id] || [];
              const isSelected = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    const newSelection = isSelected
                      ? selected.filter((v: string) => v !== opt.value)
                      : [...selected, opt.value];
                    setFormData({ ...formData, [q.id]: newSelection });
                  }}
                  className={`w-full p-6 ${
                    lang === "he" ? "text-right" : "text-left"
                  } rounded-[32px] border-2 transition-all font-bold shadow-sm ac-card ${
                    isSelected
                      ? "border-[#508991] bg-[#508991] text-white"
                      : "border-[#D6F3F4] bg-white text-slate-500 hover:bg-[#D6F3F4]"
                  }`}
                >
                  {opt.label[lang]}
                </button>
              );
            })}
          {q.type === "scale" && (
            <div className="p-10 bg-[#D6F3F4] rounded-[48px] border border-white/20 shadow-sm space-y-6">
              <input
                type="range"
                min={q.min}
                max={q.max}
                value={formData[q.id] || q.min}
                onChange={(e) =>
                  setFormData({ ...formData, [q.id]: parseInt(e.target.value) })
                }
                className="w-full accent-[#508991] h-3 bg-white/50 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-400">
                  {q.min}
                </span>
                <span className="text-7xl font-black text-[#172A3A] tabular-nums tracking-tighter">
                  {formData[q.id] || q.min}
                </span>
                <span className="text-xs font-black text-slate-400">
                  {q.max}
                </span>
              </div>
            </div>
          )}
          {q.type === "number" && (
            <input
              type="number"
              value={formData[q.id] || ""}
              min={q.min}
              max={q.max}
              onChange={(e) => {
                const val = e.target.value;
                // Allow empty string for backspace
                if (val === "") {
                  setFormData({ ...formData, [q.id]: "" });
                  return;
                }
                const num = parseFloat(val);
                // Strict validation preventing invalid input
                if (q.min !== undefined && num < q.min) return;
                if (q.max !== undefined && num > q.max) return;

                setFormData({ ...formData, [q.id]: val });
              }}
              className="w-full p-10 bg-[#D6F3F4] rounded-[40px] text-6xl font-black tabular-nums border-none text-center focus:ring-4 focus:ring-[#508991]/20 outline-none shadow-sm"
              placeholder="0"
            />
          )}
          {q.type === "text" && (
            <textarea
              value={formData[q.id] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [q.id]: e.target.value })
              }
              className="w-full p-6 bg-[#D6F3F4] rounded-[32px] border-none font-bold text-[#172A3A] h-40 focus:ring-4 focus:ring-[#508991]/20 outline-none shadow-sm ac-card"
              placeholder={
                lang === "he"
                  ? "פרט כאן על האירוע..."
                  : "Describe the event here..."
              }
            />
          )}
        </div>
      </div>
      {/* Fallback Next Button at bottom just in case */}
      <button
        onClick={handleNext}
        disabled={!isStepValid()}
        className={`w-full p-6 rounded-[32px] font-black text-xl shadow-2xl transition-all mt-8 mb-4 ${
          isStepValid()
            ? "bg-[#508991] text-white active:scale-95"
            : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-70 shadow-none"
        }`}
      >
        {currentStepIndex === visibleQuestions.length - 1
          ? t("finish")
          : t("next")}
      </button>
    </div>
  );
};

// --- App Root ---

export default function App() {
  const [lang, setLang] = useState<Language>("he");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const h = localStorage.getItem("awareCareHistory");
    if (h) setHistory(JSON.parse(h));
  }, []);

  useEffect(() => {
    localStorage.setItem("awareCareHistory", JSON.stringify(history));
    if (history.length > 0 && !history[0].quickLog) {
      const analyze = async () => {
        setLoading(true);
        const res = await analyzePatientState(history, lang);
        setAnalysis(res);
        setLoading(false);
      };
      analyze();
    }
  }, [history, lang]);

  const toggleLang = () => setLang((prev) => (prev === "he" ? "en" : "he"));

  return (
    <HashRouter>
      <div
        className={`min-h-screen bg-white selection:bg-[#74B3CE]/30 ${
          lang === "he" ? "rtl" : "ltr"
        }`}
        dir={lang === "he" ? "rtl" : "ltr"}
      >
        <style>{`
          @keyframes acPageIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes acFadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .ac-page { animation: acPageIn 360ms ease both; }
          .ac-fade-up { opacity: 0; animation: acFadeUp 420ms ease both; }
          .ac-card { transition: transform 180ms ease, box-shadow 180ms ease; }
          .ac-card:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(23, 42, 58, 0.08); }
          .ac-press { transition: transform 120ms ease; }
          .ac-press:active { transform: scale(0.98); }
        `}</style>
        <SideMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          lang={lang}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                lang={lang}
                onOpenMenu={() => setIsMenuOpen(true)}
                onToggleLang={toggleLang}
              />
            }
          />
          <Route
            path="/wizard"
            element={
              <Wizard
                lang={lang}
                onSubmit={(r) => setHistory([r, ...history])}
              />
            }
          />
          <Route path="/info" element={<InfoGuidance lang={lang} />} />
          <Route path="/quick-view" element={<QuickView lang={lang} />} />
          <Route path="/doctor" element={<DoctorContact lang={lang} />} />
          <Route
            path="/medical-file"
            element={<MedicalFileDashboard lang={lang} />}
          />
          <Route path="/journal" element={<JournalView lang={lang} />} />
          <Route
            path="/medical-file/meds"
            element={<MedicationsView lang={lang} />}
          />
          <Route
            path="/medical-file/history"
            element={<MedicationHistoryView lang={lang} />}
          />
          <Route
            path="/medical-file/summaries"
            element={<VisitSummariesView lang={lang} />}
          />
          <Route
            path="/medical-file/sensitivities"
            element={<SensitivitiesView lang={lang} />}
          />
          <Route
            path="/medical-file/upload"
            element={<UploadDocsView lang={lang} />}
          />
          <Route
            path="/history"
            element={<QuestionnaireHistory lang={lang} />}
          />
          <Route path="/tutorial" element={<Tutorial lang={lang} />} />
          <Route path="/contact" element={<ContactUs lang={lang} />} />

          <Route
            path="/personal"
            element={
              <div className="px-6 pt-10 pb-32 space-y-10 min-h-screen">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => window.history.back()}
                    className="p-3 bg-[#D6F3F4] rounded-full shadow-sm text-[#172A3A] hover:bg-[#C2EBF0]"
                  >
                    <svg
                      className="w-6 h-6 rtl-flip"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <h2 className="text-3xl font-black text-[#172A3A] tracking-tighter">
                    {translations.personalArea[lang]}
                  </h2>
                </div>

                {analysis ? (
                  <div className="bg-[#D6F3F4] p-10 rounded-[56px] shadow-xl border-2 border-[#74B3CE]/20 space-y-6 relative overflow-hidden">
                    <div
                      className={`absolute top-0 ${
                        lang === "he" ? "right-0" : "left-0"
                      } p-4 opacity-10`}
                    >
                      <Logo className="w-32 h-32" />
                    </div>
                    <h3 className="font-black text-2xl text-[#508991] flex items-center gap-3">
                      <span className="w-3 h-3 bg-[#508991] rounded-full animate-pulse"></span>
                      {translations.doctorFeedback[lang]}
                    </h3>
                    <div
                      className={`text-slate-600 font-bold leading-relaxed prose prose-sm max-w-none ${
                        lang === "he" ? "text-right" : "text-left"
                      }`}
                    >
                      {analysis}
                    </div>
                    <div className="pt-6 flex flex-col gap-4">
                      <button className="p-6 bg-[#508991] text-white rounded-[32px] font-black text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                        {translations.videoCall[lang]}
                      </button>
                      <button className="p-6 bg-white border-2 border-[#508991] text-[#508991] rounded-[32px] font-black text-lg active:scale-95 transition-all">
                        {translations.expedite[lang]}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 opacity-40">
                    <div className="grayscale">
                      <Logo className="w-24 h-24" />
                    </div>
                    <p className="font-bold text-[#172A3A] text-lg">
                      {translations.noMessages[lang]}
                    </p>
                  </div>
                )}
              </div>
            }
          />

          <Route
            path="/record"
            element={<MedicalFileDashboard lang={lang} />}
          />
        </Routes>

        {/* Bottom Nav Bar - Balanced & Polished */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl px-10 py-8 flex justify-between items-center rounded-t-[56px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-[#D6F3F4] z-50">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `p-3 rounded-[24px] transition-all duration-300 ${
                isActive
                  ? "text-[#508991] bg-[#D6F3F4] shadow-inner scale-110"
                  : "text-slate-300 hover:text-[#74B3CE]"
              }`
            }
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </NavLink>
          <NavLink
            to="/wizard"
            className={({ isActive }) =>
              `p-3 rounded-[24px] transition-all duration-300 ${
                isActive
                  ? "text-[#508991] bg-[#D6F3F4] shadow-inner scale-110"
                  : "text-slate-300 hover:text-[#74B3CE]"
              }`
            }
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </NavLink>
          <NavLink
            to="/personal"
            className={({ isActive }) =>
              `p-3 rounded-[24px] transition-all duration-300 ${
                isActive
                  ? "text-[#508991] bg-[#D6F3F4] shadow-inner scale-110"
                  : "text-slate-300 hover:text-[#74B3CE]"
              }`
            }
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </NavLink>
        </nav>

        {loading && (
          <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center gap-8">
            <div className="w-32 h-32 animate-bounce duration-1000">
              <Logo className="w-full h-full" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="font-black text-[#172A3A] text-2xl tracking-tighter animate-pulse">
                {translations.analyzing[lang]}
              </p>
              <div className="w-48 h-1 bg-[#D6F3F4] rounded-full overflow-hidden">
                <div className="h-full bg-[#508991] animate-progress-ind"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </HashRouter>
  );
}
