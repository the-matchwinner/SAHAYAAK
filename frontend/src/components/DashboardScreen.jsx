import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:8080';
const USER_ID = 1;

export default function DashboardScreen({ userName, onNavigate }) {
  const displayName = userName ? userName.trim() : 'Dadaji';

  // State for reminders checklist
 const [reminders, setReminders] = useState([]);
const [loadingReminders, setLoadingReminders] = useState(true);


const formatReminderTime = (time) => {
  if (!time) return '';

  const [hours, minutes] = time.split(':');
  const hour = Number(hours);
  const displayHour = hour % 12 || 12;
  const period = hour >= 12 ? 'PM' : 'AM';

  return `${displayHour}:${minutes} ${period}`;
};

const mapReminder = (item) => ({
  id: item.id,
  title: item.medicineName,
  time: formatReminderTime(item.reminderTime),
  note: item.dosage,
  subtitle: item.frequency,
  icon: 'medication',
  taken: item.status === 'INACTIVE',
});
  useEffect(() => {
  const loadReminders = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reminders/user/${USER_ID}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      setReminders(data.map(mapReminder));
    } catch (error) {
      console.error('Failed to load reminders:', error);
    } finally {
      setLoadingReminders(false);
    }
  };

  loadReminders();
}, []);

  // State for voice note audio simulation
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeMusic, setActiveMusic] = useState(null);

  const memoryPhotoUrl = "https://lh3.googleusercontent.com/aida/AEtjO1Xml2rYMlSnOrELQis8hvmelm7otQsUOPimJ8szKoCGGu4P12tbrYMQwQN8qI1-pXTcHBw-JRJQPNHsN86Y1ALbpx5jUfd-Asy7VBMy83-Ic5bAY_G7Xf24P4AhKyvbnBFxf-8xeklgfYZhDeoizwINjf1qquprIpQ8vTU4zWiUF-1HSdTEK6dRG566VvKheRvYZInD3avPYPcIXbSNYSYItFpBj6a8a9YFZ3w1Jj11D_n-g8tYsnnXmxc";

const toggleReminder = async (id) => {
  const reminder = reminders.find((item) => item.id === id);

  if (!reminder) return;

  const newStatus = reminder.taken ? 'ACTIVE' : 'INACTIVE';

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/reminders/${id}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    setReminders((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, taken: !item.taken }
          : item
      )
    );
  } catch (error) {
    console.error('Failed to update reminder status:', error);
  }
};

  const speakText = (phrase) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakSuggestion = (text) => {
    const cleanText = text.replace(/[\u201C\u201D"]/g, '').trim();
    speakText(`Sahaayak is looking for: ${cleanText}`);
  };

  const promptVoiceReminder = () => {
    speakText(`Namaste ${displayName}, I am listening. Please speak your reminder.`);
  };

  const toggleVoiceNote = () => {
    if (!voicePlaying) {
      setVoicePlaying(true);
      speakText(`Playing voice note from family: Namaste ${displayName}, hoping you have a peaceful and beautiful day today!`);
    } else {
      setVoicePlaying(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const toggleMusic = (trackName) => {
    if (activeMusic === trackName) {
      setActiveMusic(null);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setActiveMusic(trackName);
      speakText(`Now playing ${trackName} for ${displayName}`);
    }
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* GREETING & VOICE HERO */}
      <section className="w-full mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
          <div>
            <h1 className="font-bold text-3xl sm:text-4xl text-[#141d1c] tracking-tight mb-1">
              Good morning, {displayName}.
            </h1>
            <p className="text-lg text-gray-600">How can Sahaayak assist you today?</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[#404947] font-semibold text-sm bg-[#ecf6f4] border border-[#bfc8c6]/40 px-4 py-2 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[#994703] text-[20px]">schedule</span>
            <span>Assistance Ready • Tap or Speak</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-[#0e4d48] text-white p-6 sm:p-8 shadow-xl">
          <div className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-[#fc934f]/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-12 -bottom-12 w-80 h-80 rounded-full bg-[#003531]/40 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[#84bdb6] font-semibold text-sm sm:text-base mb-2">
                <span className="material-symbols-outlined text-[22px] text-[#fc934f]">graphic_eq</span>
                <span>Always Listening • Speak in Hindi or English</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight tracking-tight">
                Talk to Sahaayak
              </h2>
              <p className="text-base sm:text-lg text-[#84bdb6] leading-relaxed">
                Tap the large orange microphone or say <span className="font-bold text-white">“Hey Sahaayak”</span> anytime to set reminders, make calls, or play music.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2.5 shrink-0">
              <div className="relative flex items-center justify-center">
                <span className="absolute h-24 w-24 rounded-full bg-[#fc934f]/30 animate-ping pointer-events-none"></span>
                <span className="absolute h-20 w-20 rounded-full bg-[#D97736]/40 animate-pulse pointer-events-none"></span>
                <button
                  type="button"
                  id="voiceHeroMicBtn"
                  aria-label="Activate Sahaayak Voice Assistant"
                  onClick={promptVoiceReminder}
                  className="relative h-[76px] w-[76px] rounded-full bg-[#D97736] hover:bg-[#E08746] active:scale-95 transition-all text-white shadow-xl flex items-center justify-center cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#D97736]/50"
                >
                  <span className="material-symbols-outlined text-[40px]">mic</span>
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#fc934f] text-[18px]">sound_detection_loud_sound</span>
                <span className="text-sm font-bold tracking-wide text-white text-center">Tap &amp; Speak</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-5 border-t border-white/15">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="block text-xs uppercase tracking-wider text-[#84bdb6] font-bold">Quick voice suggestions:</span>
              <span className="text-xs text-[#84bdb6] hidden sm:inline">Click any pill to try</span>
            </div>
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {[
                { icon: 'call', label: '“Call my daughter”' },
                { icon: 'event_upcoming', label: '“Read today’s reminders”' },
                { icon: 'music_note', label: '“Play morning music”' },
                { icon: 'photo_library', label: '“Show my family photos”' },
              ].map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => speakSuggestion(s.label)}
                  className="bg-white/15 hover:bg-white/25 active:bg-white/35 hover:scale-105 border border-white/25 rounded-full px-5 py-2.5 text-sm sm:text-base font-semibold transition-all cursor-pointer flex items-center gap-2.5 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <span className="material-symbols-outlined text-[#fc934f] text-[22px]">{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ASYMMETRIC CONTENT COMPOSITION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (7 Cols): Reminders & One-Touch Communication */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Schedule & Medicine Card */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col border border-[#dbe5e2]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#ffdbc9] flex items-center justify-center text-[#321200] shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">schedule</span>
                </div>
                <div>
                  <h2 className="font-bold text-2xl text-[#003531]">Today’s Schedule &amp; Medicine</h2>
                  <span className="text-base text-[#404947]">{reminders.filter(r => !r.taken).length} important items remaining</span>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#fc934f]/20 text-[#994703] font-bold text-xs">
                Today • Active
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    rem.taken
                      ? 'bg-[#f2fbf9] border-[#dbe5e2] opacity-75'
                      : rem.id === 1
                      ? 'bg-[#ecf6f4] border-[#fc934f] shadow-sm'
                      : 'bg-[#ecf6f4] border-[#dbe5e2]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-14 w-14 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                        rem.taken ? 'bg-gray-200 text-gray-500' : 'bg-[#994703] text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[30px]">{rem.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-bold text-lg ${rem.taken ? 'text-gray-500' : 'text-[#994703]'}`}>
                          {rem.time}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm font-semibold text-[#404947]">{rem.subtitle}</span>
                      </div>
                      <h3 className={`font-bold text-xl ${rem.taken ? 'line-through text-gray-500' : 'text-[#003531]'}`}>
                        {rem.title}
                      </h3>
                      <p className="text-base text-[#404947]">{rem.note}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleReminder(rem.id)}
                    className={`h-14 px-5 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm ${
                      rem.taken
                        ? 'bg-[#e6f0ee] text-[#707977]'
                        : 'bg-[#003531] text-white hover:bg-[#0e4d48] active:scale-95'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {rem.taken ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    <span>{rem.taken ? 'Completed' : 'Mark as Taken'}</span>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={promptVoiceReminder}
              className="mt-6 w-full h-16 rounded-full bg-[#ecf6f4] hover:bg-[#e6f0ee] text-[#003531] font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-sm active:scale-95 cursor-pointer border border-[#bfc8c6]/40"
            >
              <span className="material-symbols-outlined text-[28px] text-[#994703]">add_circle</span>
              <span>Add a Reminder with Voice</span>
            </button>
          </section>

          {/* Quick Call Family & Doctors Card */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-[#dbe5e2]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#b4eee6] flex items-center justify-center text-[#00201d] shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">contacts</span>
                </div>
                <div>
                  <h2 className="font-bold text-2xl text-[#003531]">Quick Call Family &amp; Doctors</h2>
                  <span className="text-base text-[#404947]">Single tap for instant connect</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Daughter */}
              <div className="p-5 rounded-2xl bg-[#ecf6f4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-[#dbe5e2]">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-[#ffdbc9] text-[#321200] flex items-center justify-center font-bold text-2xl shadow-sm">
                      D
                    </div>
                    <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-600 ring-2 ring-white"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[#003531]">Priya (Daughter)</h3>
                    <p className="text-base text-[#404947]">Family Member • Active Now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <a
                    href="tel:112"
                    onClick={() => speakText(`Initiating video call to Priya`)}
                    className="h-14 px-5 rounded-full bg-[#003531] text-white font-semibold text-base flex items-center gap-2 hover:bg-[#0e4d48] active:scale-95 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[24px]">videocam</span>
                    <span>Video Call</span>
                  </a>
                  <a
                    href="tel:112"
                    onClick={() => speakText(`Calling Priya`)}
                    className="h-14 px-5 rounded-full bg-[#e6f0ee] text-[#003531] font-semibold text-base flex items-center gap-2 hover:bg-[#dbe5e2] active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[24px] text-[#994703]">call</span>
                    <span>Audio Call</span>
                  </a>
                </div>
              </div>

              {/* Son */}
              <div className="p-5 rounded-2xl bg-[#ecf6f4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-[#dbe5e2]">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-[#b4eee6] text-[#00201d] flex items-center justify-center font-bold text-2xl shadow-sm">
                      R
                    </div>
                    <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-600 ring-2 ring-white"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xl text-[#003531]">Rohan (Son)</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-white text-[#003531] text-xs font-semibold">
                        Available
                      </span>
                    </div>
                    <p className="text-base text-[#404947]">Family Contact • Home</p>
                  </div>
                </div>
                <a
                  href="tel:112"
                  onClick={() => speakText(`Calling Rohan`)}
                  className="h-14 px-6 rounded-full bg-[#003531] text-white font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#0e4d48] active:scale-95 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[24px]">call</span>
                  <span>Call Direct</span>
                </a>
              </div>

              {/* Doctor / Clinic */}
              <div className="p-5 rounded-2xl bg-[#ecf6f4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-[#dbe5e2]">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-[#e6f0ee] flex items-center justify-center font-bold text-2xl text-[#994703] shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">local_hospital</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[#003531]">Dr. Sharma (Primary Clinic)</h3>
                    <p className="text-base text-[#404947]">Healthcare Clinic • Primary Care</p>
                  </div>
                </div>
                <a
                  href="tel:112"
                  onClick={() => speakText(`Calling Dr. Sharma Clinic`)}
                  className="h-14 px-6 rounded-full bg-[#e6f0ee] text-[#003531] font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#dbe5e2] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[24px] text-[#994703]">call</span>
                  <span>Call Clinic</span>
                </a>
              </div>
            </div>
          </section>

          {/* Easy App Launches */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-[#dbe5e2]">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-[#e6f0ee] flex items-center justify-center text-[#003531] shadow-sm">
                <span className="material-symbols-outlined text-[28px]">apps</span>
              </div>
              <div>
                <h2 className="font-bold text-2xl text-[#003531]">Easy App Launches</h2>
                <span className="text-base text-[#404947]">Big friendly buttons for your daily apps</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => speakText("Opening WhatsApp Family Chat")}
                className="h-20 px-4 rounded-2xl bg-[#ecf6f4] hover:bg-[#e6f0ee] hover:scale-105 active:scale-95 flex items-center gap-3 transition-all shadow-sm group border border-[#bfc8c6]/40 cursor-pointer"
              >
                <div className="h-12 w-12 rounded-full bg-[#003531] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">chat</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-lg text-[#003531] leading-tight">WhatsApp</span>
                  <span className="text-xs text-[#404947]">Family Chat</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => speakText("Opening Facebook")}
                className="h-20 px-4 rounded-2xl bg-[#ecf6f4] hover:bg-[#e6f0ee] hover:scale-105 active:scale-95 flex items-center gap-3 transition-all shadow-sm group border border-[#bfc8c6]/40 cursor-pointer"
              >
                <div className="h-12 w-12 rounded-full bg-[#994703] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">groups</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-lg text-[#003531] leading-tight">Facebook</span>
                  <span className="text-xs text-[#404947]">See Friends</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => speakText("Opening Phone Keypad")}
                className="h-20 px-4 rounded-2xl bg-[#ecf6f4] hover:bg-[#e6f0ee] hover:scale-105 active:scale-95 flex items-center gap-3 transition-all shadow-sm group border border-[#bfc8c6]/40 cursor-pointer"
              >
                <div className="h-12 w-12 rounded-full bg-[#0e4d48] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">dialpad</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-lg text-[#003531] leading-tight">Dial Phone</span>
                  <span className="text-xs text-[#404947]">Keypad</span>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (5 Cols): Memory Lane & Serenity */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Memory of the Day Section */}
          <section className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#dbe5e2]">
            <div
              className="relative w-full aspect-[4/3] overflow-hidden bg-[#e6f0ee] group cursor-pointer"
              onClick={() => setShowPhotoModal(true)}
            >
              <img
                src={memoryPhotoUrl}
                alt="Grandmother and granddaughter laughing warmly while browsing antique photo album"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003531]/80 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#003531] font-semibold text-sm shadow-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#994703] text-[20px]">auto_awesome</span>
                  <span>Memory of the Day</span>
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs text-[#84bdb6] block font-medium">Sunday • Photo Album</span>
                <p className="text-xl font-bold text-white leading-snug">Family Moments &amp; Memories</p>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <p className="text-base text-[#404947] leading-relaxed">
                “A cherished afternoon spent together sharing stories and reminiscing over family photo albums.”
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={toggleVoiceNote}
                  className={`w-full h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    voicePlaying
                      ? 'bg-[#994703] text-white'
                      : 'bg-[#ffdbc9] text-[#321200] hover:bg-[#ffb68c] active:scale-95'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {voicePlaying ? 'pause_circle' : 'volume_up'}
                  </span>
                  <span>{voicePlaying ? 'Pause Voice Note' : 'Play Voice Note (1:14 min)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="w-full h-14 rounded-full bg-[#e6f0ee] hover:bg-[#dbe5e2] active:scale-95 text-[#003531] font-semibold text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">photo_library</span>
                  <span>View Family Album</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>

          {/* Entertainment & Serenity Section */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col gap-4 border border-[#dbe5e2]">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-12 w-12 rounded-full bg-[#e6f0ee] flex items-center justify-center text-[#003531] shadow-sm">
                <span className="material-symbols-outlined text-[28px]">self_improvement</span>
              </div>
              <div>
                <h2 className="font-bold text-2xl text-[#003531]">Entertainment &amp; Serenity</h2>
                <span className="text-base text-[#404947]">Peaceful listening &amp; mind games</span>
              </div>
            </div>

            {/* Track 1 */}
            <div className="p-4 rounded-2xl bg-[#ecf6f4] hover:bg-[#e6f0ee] flex items-center justify-between gap-4 transition-all shadow-sm border border-[#dbe5e2]">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-14 w-14 rounded-full bg-[#994703] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[30px]">spa</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg text-[#003531] truncate">Morning Music &amp; Bhajans</h3>
                  <p className="text-sm text-[#404947] truncate">Peaceful devotional melodies</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Play morning music"
                onClick={() => toggleMusic('Morning Music')}
                className="h-14 w-14 rounded-full bg-[#003531] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[32px]">
                  {activeMusic === 'Morning Music' ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>

            {/* Track 2 */}
            <div className="p-4 rounded-2xl bg-[#ecf6f4] hover:bg-[#e6f0ee] flex items-center justify-between gap-4 transition-all shadow-sm border border-[#dbe5e2]">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-14 w-14 rounded-full bg-[#0e4d48] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[30px]">radio</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg text-[#003531] truncate">Radio Broadcasts</h3>
                  <p className="text-sm text-[#404947] truncate">National Radio • Live Stream</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Play live radio"
                onClick={() => toggleMusic('Radio Broadcasts')}
                className="h-14 w-14 rounded-full bg-[#e6f0ee] text-[#003531] hover:bg-[#dbe5e2] active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[30px] text-[#994703]">
                  {activeMusic === 'Radio Broadcasts' ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>

            {/* Track 3 */}
            <div className="p-4 rounded-2xl bg-[#ecf6f4] hover:bg-[#e6f0ee] flex items-center justify-between gap-4 transition-all shadow-sm border border-[#dbe5e2]">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-14 w-14 rounded-full bg-[#e6f0ee] text-[#003531] flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[30px]">extension</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg text-[#003531] truncate">Daily Mind Games</h3>
                  <p className="text-sm text-[#404947] truncate">Sudoku &amp; Simple Word Match</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Play daily puzzle"
                onClick={() => speakText("Opening Sudoku and Mind Puzzle")}
                className="h-14 px-5 rounded-full bg-[#e6f0ee] text-[#003531] hover:bg-[#dbe5e2] active:scale-95 font-semibold text-base flex items-center gap-1 transition-all shrink-0 cursor-pointer"
              >
                <span>Play</span>
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </section>

          {/* Status Bar */}
          <div className="p-4 rounded-xl bg-[#ecf6f4] flex items-center justify-between text-[#404947] border border-[#dbe5e2]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#994703] text-[24px]">wifi</span>
              <span className="text-sm font-semibold">Home Wi-Fi Strong</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003531] text-[24px]">battery_charging_full</span>
              <span className="text-sm font-semibold">Tablet 92% Charged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Album Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full flex flex-col items-center gap-4 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-4 right-4 h-12 w-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[28px]">close</span>
            </button>
            <h3 className="font-bold text-2xl text-[#003531]">Family Photo Album</h3>
            <img
              src={memoryPhotoUrl}
              alt="Expanded view of family memory"
              className="w-full max-h-[60vh] object-contain rounded-2xl"
            />
            <p className="text-center text-[#404947] text-base font-medium">
              “Sharing old stories and precious moments with family.”
            </p>
            <button
              type="button"
              onClick={() => setShowPhotoModal(false)}
              className="px-8 py-3 rounded-full bg-[#003531] text-white font-bold text-base hover:bg-[#0e4d48] cursor-pointer"
            >
              Close Album
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
