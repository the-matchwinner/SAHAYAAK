import React, { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const USER_ID = 1;

async function fetchApi(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.status === 204 ? null : response.json();
}

export default function DashboardScreen({ userName, onNavigate }) {
  const displayName = userName ? userName.trim() : 'Dadaji';

  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [remindersError, setRemindersError] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactsError, setContactsError] = useState('');
  const [memories, setMemories] = useState([]);
  const [loadingMemories, setLoadingMemories] = useState(true);
  const [memoriesError, setMemoriesError] = useState('');
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [savingReminder, setSavingReminder] = useState(false);
  const [reminderFormError, setReminderFormError] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [savingContact, setSavingContact] = useState(false);
  const [contactFormError, setContactFormError] = useState('');
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [savingMemory, setSavingMemory] = useState(false);
  const [memoryFormError, setMemoryFormError] = useState('');
  const [activeMemoryId, setActiveMemoryId] = useState(null);

  const formatReminderTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = Number(hours);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const mapReminder = (item) => ({
    id: item.id,
    title: item.medicineName,
    rawTime: item.reminderTime?.slice(0, 5) || '',
    time: formatReminderTime(item.reminderTime),
    note: item.dosage,
    subtitle: item.frequency,
    icon: 'medication',
    active: item.status === 'ACTIVE',
  });

  const refreshDashboardData = async (isCurrent = () => true) => {
    setLoadingReminders(true);
    setLoadingContacts(true);
    setLoadingMemories(true);
    setRemindersError('');
    setContactsError('');
    setMemoriesError('');

    const results = await Promise.allSettled([
      fetchApi(`/reminders/user/${USER_ID}`),
      fetchApi(`/contacts/user/${USER_ID}`),
      fetchApi(`/memories/user/${USER_ID}`),
    ]);

    if (isCurrent()) {
      if (results[0].status === 'fulfilled') setReminders(results[0].value.map(mapReminder));
      else {
        console.error('Failed to load reminders:', results[0].reason);
        setRemindersError('Could not load reminders. Check the backend connection, then retry.');
      }
      if (results[1].status === 'fulfilled') setContacts(results[1].value);
      else {
        console.error('Failed to load contacts:', results[1].reason);
        setContactsError('Could not load contacts. Check the backend connection, then retry.');
      }
      if (results[2].status === 'fulfilled') setMemories(results[2].value);
      else {
        console.error('Failed to load memories:', results[2].reason);
        setMemoriesError('Could not load memories. Check the backend connection, then retry.');
      }
      setLoadingReminders(false);
      setLoadingContacts(false);
      setLoadingMemories(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    refreshDashboardData(() => isMounted);
    return () => { isMounted = false; };
  }, []);

  // State for voice note audio simulation
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeMusic, setActiveMusic] = useState(null);

  const memoryPhotoUrl = "https://lh3.googleusercontent.com/aida/AEtjO1Xml2rYMlSnOrELQis8hvmelm7otQsUOPimJ8szKoCGGu4P12tbrYMQwQN8qI1-pXTcHBw-JRJQPNHsN86Y1ALbpx5jUfd-Asy7VBMy83-Ic5bAY_G7Xf24P4AhKyvbnBFxf-8xeklgfYZhDeoizwINjf1qquprIpQ8vTU4zWiUF-1HSdTEK6dRG566VvKheRvYZInD3avPYPcIXbSNYSYItFpBj6a8a9YFZ3w1Jj11D_n-g8tYsnnXmxc";
  const featuredMemory = memories[0];
  const featuredPhotoUrl = featuredMemory?.imageUrl || memoryPhotoUrl;
  const selectedMemory = memories.find((memory) => memory.id === activeMemoryId) || featuredMemory;
  const selectedMemoryPhotoUrl = selectedMemory?.imageUrl || memoryPhotoUrl;

const toggleReminder = async (id) => {
  const reminder = reminders.find((item) => item.id === id);

  if (!reminder) return;

  const newStatus = reminder.active ? 'INACTIVE' : 'ACTIVE';

  try {
    await fetchApi(`/reminders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

    setReminders((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, active: !item.active }
          : item
      )
    );
  } catch (error) {
    console.error('Failed to update reminder status:', error);
    setRemindersError('Could not update this reminder. Please try again.');
  }
};

const saveReminder = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  setSavingReminder(true);
  setReminderFormError('');

  try {
    const savedReminder = await fetchApi(
      editingReminder ? `/reminders/${editingReminder.id}` : '/reminders',
      {
      method: editingReminder ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: USER_ID,
        medicineName: formData.get('medicineName').trim(),
        dosage: formData.get('dosage').trim(),
        reminderTime: formData.get('reminderTime'),
        frequency: formData.get('frequency'),
      }),
      }
    );
    setReminders((current) => editingReminder
      ? current.map((item) => item.id === savedReminder.id ? mapReminder(savedReminder) : item)
      : [...current, mapReminder(savedReminder)]);
    form.reset();
    setShowReminderForm(false);
    setEditingReminder(null);
  } catch (error) {
    console.error('Failed to create reminder:', error);
    setReminderFormError('Could not save the reminder. Check the backend connection and try again.');
  } finally {
    setSavingReminder(false);
  }
};

const deleteReminder = async (reminder) => {
  if (!window.confirm(`Delete the reminder for ${reminder.title}?`)) return;
  try {
    await fetchApi(`/reminders/${reminder.id}`, { method: 'DELETE' });
    setReminders((current) => current.filter((item) => item.id !== reminder.id));
  } catch (error) {
    console.error('Failed to delete reminder:', error);
    setRemindersError('Could not delete this reminder. Please try again.');
  }
};

const saveContact = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  setSavingContact(true);
  setContactFormError('');
  const request = {
    userId: USER_ID,
    name: formData.get('name').trim(),
    relationship: formData.get('relationship').trim(),
    phone: formData.get('phone').trim(),
    emergency: formData.get('emergency') === 'on',
  };

  try {
    const saved = await fetchApi(
      editingContact ? `/contacts/${editingContact.id}` : '/contacts',
      {
        method: editingContact ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      }
    );
    setContacts((current) => editingContact
      ? current.map((contact) => contact.id === saved.id ? saved : contact)
      : [...current, saved]);
    form.reset();
    setShowContactForm(false);
    setEditingContact(null);
  } catch (error) {
    console.error('Failed to save contact:', error);
    setContactFormError('Could not save the contact. Check the backend connection and try again.');
  } finally {
    setSavingContact(false);
  }
};

const deleteContact = async (contact) => {
  if (!window.confirm(`Delete ${contact.name} from contacts?`)) return;
  try {
    await fetchApi(`/contacts/${contact.id}`, { method: 'DELETE' });
    setContacts((current) => current.filter((item) => item.id !== contact.id));
  } catch (error) {
    console.error('Failed to delete contact:', error);
    setContactsError('Could not delete this contact. Please try again.');
  }
};

const saveMemory = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  setSavingMemory(true);
  setMemoryFormError('');
  const request = {
    userId: USER_ID,
    title: formData.get('title').trim(),
    description: formData.get('description').trim(),
    memoryDate: formData.get('memoryDate') || null,
    imageUrl: formData.get('imageUrl').trim() || null,
  };

  try {
    const saved = await fetchApi(
      editingMemory ? `/memories/${editingMemory.id}` : '/memories',
      {
        method: editingMemory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      }
    );
    setMemories((current) => editingMemory
      ? current.map((memory) => memory.id === saved.id ? saved : memory)
      : [saved, ...current]);
    setActiveMemoryId(saved.id);
    form.reset();
    setShowMemoryForm(false);
    setEditingMemory(null);
  } catch (error) {
    console.error('Failed to save memory:', error);
    setMemoryFormError('Could not save the memory. Check the backend connection and try again.');
  } finally {
    setSavingMemory(false);
  }
};

const deleteMemory = async (memory) => {
  if (!window.confirm(`Delete “${memory.title}” from your memories?`)) return;
  try {
    await fetchApi(`/memories/${memory.id}`, { method: 'DELETE' });
    setMemories((current) => {
      const remaining = current.filter((item) => item.id !== memory.id);
      setActiveMemoryId(remaining[0]?.id ?? null);
      return remaining;
    });
  } catch (error) {
    console.error('Failed to delete memory:', error);
    setMemoriesError('Could not delete this memory. Please try again.');
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
                  <h2 className="font-bold text-2xl text-[#003531]">Medicine Reminders</h2>
                  <span className="text-base text-[#404947]">{reminders.filter((reminder) => reminder.active).length} active reminders</span>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#fc934f]/20 text-[#994703] font-bold text-xs">
                Recurring schedule
              </span>
              <button
                type="button"
                onClick={() => refreshDashboardData()}
                disabled={loadingReminders || loadingContacts || loadingMemories}
                className="h-10 px-4 rounded-full bg-[#e6f0ee] text-[#003531] text-sm font-bold disabled:opacity-60"
              >
                {loadingReminders || loadingContacts || loadingMemories ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {loadingReminders && <p className="text-base text-[#404947]">Loading reminders…</p>}
              {remindersError && <p role="alert" className="text-base text-red-700">{remindersError}</p>}
              {!loadingReminders && !remindersError && reminders.length === 0 && (
                <p className="text-base text-[#404947]">No medicine reminders have been saved yet.</p>
              )}
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    !rem.active
                      ? 'bg-[#f2fbf9] border-[#dbe5e2] opacity-75'
                      : rem.id === 1
                      ? 'bg-[#ecf6f4] border-[#fc934f] shadow-sm'
                      : 'bg-[#ecf6f4] border-[#dbe5e2]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-14 w-14 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                        !rem.active ? 'bg-gray-200 text-gray-500' : 'bg-[#994703] text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[30px]">{rem.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-bold text-lg ${!rem.active ? 'text-gray-500' : 'text-[#994703]'}`}>
                          {rem.time}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm font-semibold text-[#404947]">{rem.subtitle}</span>
                      </div>
                      <h3 className={`font-bold text-xl ${!rem.active ? 'text-gray-500' : 'text-[#003531]'}`}>
                        {rem.title}
                      </h3>
                      <p className="text-base text-[#404947]">{rem.note}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleReminder(rem.id)}
                      className={`h-12 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                        !rem.active
                          ? 'bg-[#e6f0ee] text-[#707977]'
                          : 'bg-[#003531] text-white hover:bg-[#0e4d48] active:scale-95'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {rem.active ? 'toggle_on' : 'toggle_off'}
                      </span>
                      <span>{rem.active ? 'Disable' : 'Enable'}</span>
                    </button>
                    <button type="button" onClick={() => { setEditingReminder(rem); setReminderFormError(''); setShowReminderForm(true); }} className="h-12 px-4 rounded-full bg-[#e6f0ee] text-[#003531] font-semibold text-sm">Edit</button>
                    <button type="button" onClick={() => deleteReminder(rem)} className="h-12 px-4 rounded-full bg-red-50 text-red-800 font-semibold text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setReminderFormError('');
                if (showReminderForm) {
                  setShowReminderForm(false);
                  setEditingReminder(null);
                } else {
                  setEditingReminder(null);
                  setShowReminderForm(true);
                }
              }}
              className="mt-6 w-full h-16 rounded-full bg-[#ecf6f4] hover:bg-[#e6f0ee] text-[#003531] font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-sm active:scale-95 cursor-pointer border border-[#bfc8c6]/40"
            >
              <span className="material-symbols-outlined text-[28px] text-[#994703]">add_circle</span>
              <span>{showReminderForm ? 'Cancel' : 'Add a Medicine Reminder'}</span>
            </button>

            {showReminderForm && (
              <form key={editingReminder?.id || 'new-reminder'} onSubmit={saveReminder} className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-[#dbe5e2] bg-[#f2fbf9] p-5">
                <h3 className="sm:col-span-2 text-lg font-bold text-[#003531]">{editingReminder ? 'Edit medicine reminder' : 'Add medicine reminder'}</h3>
                <label className="flex flex-col gap-1 text-sm font-semibold text-[#003531]">
                  Medicine name
                  <input name="medicineName" required maxLength="100" defaultValue={editingReminder?.title || ''} className="h-12 rounded-xl border border-[#bfc8c6] bg-white px-3 text-base" />
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold text-[#003531]">
                  Dosage
                  <input name="dosage" required maxLength="100" defaultValue={editingReminder?.note || ''} placeholder="e.g. 1 tablet" className="h-12 rounded-xl border border-[#bfc8c6] bg-white px-3 text-base" />
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold text-[#003531]">
                  Reminder time
                  <input name="reminderTime" type="time" required defaultValue={editingReminder?.rawTime || ''} className="h-12 rounded-xl border border-[#bfc8c6] bg-white px-3 text-base" />
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold text-[#003531]">
                  Frequency
                  <select name="frequency" defaultValue={editingReminder?.subtitle || 'DAILY'} className="h-12 rounded-xl border border-[#bfc8c6] bg-white px-3 text-base">
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="AS_NEEDED">As needed</option>
                  </select>
                </label>
                {reminderFormError && <p role="alert" className="sm:col-span-2 text-sm text-red-700">{reminderFormError}</p>}
                <button type="submit" disabled={savingReminder} className="sm:col-span-2 h-12 rounded-full bg-[#003531] text-white font-bold disabled:opacity-60">
                  {savingReminder ? 'Saving…' : editingReminder ? 'Save Changes' : 'Save Reminder'}
                </button>
              </form>
            )}
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
              <button
                type="button"
                onClick={() => {
                  if (showContactForm) {
                    setShowContactForm(false);
                    setEditingContact(null);
                  } else {
                    setEditingContact(null);
                    setContactFormError('');
                    setShowContactForm(true);
                  }
                }}
                className="h-12 px-5 rounded-full bg-[#003531] text-white font-bold text-sm"
              >
                {showContactForm ? 'Cancel' : 'Add Contact'}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {loadingContacts && <p className="text-base text-[#404947]">Loading contacts…</p>}
              {contactsError && <p role="alert" className="text-base text-red-700">{contactsError}</p>}
              {!loadingContacts && !contactsError && contacts.length === 0 && (
                <p className="text-base text-[#404947]">No contacts have been saved yet.</p>
              )}
              {contacts.map((contact) => (
                <div key={contact.id} className="p-5 rounded-2xl bg-[#ecf6f4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-[#dbe5e2]">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-[#ffdbc9] text-[#321200] flex items-center justify-center font-bold text-2xl shadow-sm">
                      {contact.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-[#003531]">{contact.name}</h3>
                      <p className="text-base text-[#404947]">
                        {contact.relationship}{contact.emergency ? ' • Emergency contact' : ''}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    onClick={() => speakText(`Calling ${contact.name}`)}
                    className="h-14 px-6 rounded-full bg-[#003531] text-white font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#0e4d48] active:scale-95 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[24px]">call</span>
                    <span>Call {contact.phone}</span>
                  </a>
                  <button type="button" onClick={() => { setEditingContact(contact); setContactFormError(''); setShowContactForm(true); }} className="h-12 px-4 rounded-full bg-white text-[#003531] font-semibold text-sm">Edit</button>
                  <button type="button" onClick={() => deleteContact(contact)} className="h-12 px-4 rounded-full bg-red-50 text-red-800 font-semibold text-sm">Delete</button>
                </div>
              ))}
            </div>

            {showContactForm && (
              <form key={editingContact?.id || 'new-contact'} onSubmit={saveContact} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-[#dbe5e2] bg-[#f2fbf9] p-5">
                <h3 className="sm:col-span-2 text-lg font-bold text-[#003531]">{editingContact ? 'Edit contact' : 'Add a contact'}</h3>
                <label className="flex flex-col gap-1 text-sm font-semibold text-[#003531]">
                  Name
                  <input name="name" required maxLength="100" defaultValue={editingContact?.name || ''} className="h-12 rounded-xl border border-[#bfc8c6] bg-white px-3 text-base" />
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold text-[#003531]">
                  Relationship
                  <input name="relationship" required maxLength="50" defaultValue={editingContact?.relationship || ''} placeholder="e.g. Daughter, Doctor" className="h-12 rounded-xl border border-[#bfc8c6] bg-white px-3 text-base" />
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold text-[#003531]">
                  Phone number
                  <input name="phone" type="tel" required maxLength="15" defaultValue={editingContact?.phone || ''} className="h-12 rounded-xl border border-[#bfc8c6] bg-white px-3 text-base" />
                </label>
                <label className="flex items-center gap-3 text-sm font-semibold text-[#003531]">
                  <input name="emergency" type="checkbox" defaultChecked={editingContact?.emergency || false} className="h-5 w-5 accent-[#003531]" />
                  Emergency contact
                </label>
                {contactFormError && <p role="alert" className="sm:col-span-2 text-sm text-red-700">{contactFormError}</p>}
                <button type="submit" disabled={savingContact} className="sm:col-span-2 h-12 rounded-full bg-[#003531] text-white font-bold disabled:opacity-60">
                  {savingContact ? 'Saving…' : editingContact ? 'Save Changes' : 'Save Contact'}
                </button>
              </form>
            )}
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
              onClick={() => { setActiveMemoryId(featuredMemory?.id ?? null); setShowPhotoModal(true); }}
            >
              <img
                src={featuredPhotoUrl}
                onError={(event) => { event.currentTarget.src = memoryPhotoUrl; }}
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
                <span className="text-xs text-[#84bdb6] block font-medium">
                  {featuredMemory?.memoryDate || 'Photo Album'}
                </span>
                <p className="text-xl font-bold text-white leading-snug">
                  {featuredMemory?.title || (loadingMemories ? 'Loading memories…' : 'Family Moments & Memories')}
                </p>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <p className="text-base text-[#404947] leading-relaxed">
                {memoriesError || featuredMemory?.description || (loadingMemories ? 'Loading memories…' : 'No saved memories yet. Add a memory to start your family album.')}
              </p>
              {memoriesError && <p role="alert" className="text-sm text-red-700">{memoriesError}</p>}
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
                  onClick={() => { setActiveMemoryId(featuredMemory?.id ?? null); setShowPhotoModal(true); }}
                  className="w-full h-14 rounded-full bg-[#e6f0ee] hover:bg-[#dbe5e2] active:scale-95 text-[#003531] font-semibold text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">photo_library</span>
                  <span>View Family Album</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => { setEditingMemory(null); setMemoryFormError(''); setShowMemoryForm((visible) => !visible); }} className="h-11 px-4 rounded-full bg-[#003531] text-white font-semibold text-sm">
                  {showMemoryForm && !editingMemory ? 'Cancel' : 'Add Memory'}
                </button>
                {featuredMemory && (
                  <>
                    <button type="button" onClick={() => { setEditingMemory(featuredMemory); setMemoryFormError(''); setShowMemoryForm(true); }} className="h-11 px-4 rounded-full bg-[#e6f0ee] text-[#003531] font-semibold text-sm">Edit Featured</button>
                    <button type="button" onClick={() => deleteMemory(featuredMemory)} className="h-11 px-4 rounded-full bg-red-50 text-red-800 font-semibold text-sm">Delete Featured</button>
                  </>
                )}
              </div>
              {showMemoryForm && (
                <form key={editingMemory?.id || 'new-memory'} onSubmit={saveMemory} className="grid grid-cols-1 gap-4 rounded-2xl border border-[#dbe5e2] bg-[#f2fbf9] p-5">
                  <h3 className="text-lg font-bold text-[#003531]">{editingMemory ? 'Edit memory' : 'Add a family memory'}</h3>
                  <label className="flex flex-col gap-1 text-sm font-semibold text-[#003531]">
                    Title
                    <input name="title" required maxLength="200" defaultValue={editingMemory?.title || ''} className="h-12 rounded-xl border border-[#bfc8c6] bg-white px-3 text-base" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-semibold text-[#003531]">
                    Description
                    <textarea name="description" rows="3" defaultValue={editingMemory?.description || ''} className="rounded-xl border border-[#bfc8c6] bg-white p-3 text-base" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-semibold text-[#003531]">
                    Date
                    <input name="memoryDate" type="date" defaultValue={editingMemory?.memoryDate || ''} className="h-12 rounded-xl border border-[#bfc8c6] bg-white px-3 text-base" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-semibold text-[#003531]">
                    Photo URL
                    <input name="imageUrl" type="url" maxLength="2000" placeholder="https://…" defaultValue={editingMemory?.imageUrl || ''} className="h-12 rounded-xl border border-[#bfc8c6] bg-white px-3 text-base" />
                  </label>
                  {memoryFormError && <p role="alert" className="text-sm text-red-700">{memoryFormError}</p>}
                  <button type="submit" disabled={savingMemory} className="h-12 rounded-full bg-[#003531] text-white font-bold disabled:opacity-60">
                    {savingMemory ? 'Saving…' : editingMemory ? 'Save Changes' : 'Save Memory'}
                  </button>
                </form>
              )}
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
            {selectedMemory ? (
              <>
                <img
                  src={selectedMemoryPhotoUrl}
                  onError={(event) => { event.currentTarget.src = memoryPhotoUrl; }}
                  alt={selectedMemory.title}
                  className="w-full max-h-[50vh] object-contain rounded-2xl"
                />
                <div className="text-center">
                  <h4 className="text-xl font-bold text-[#003531]">{selectedMemory.title}</h4>
                  {selectedMemory.memoryDate && <p className="text-sm text-[#707977]">{selectedMemory.memoryDate}</p>}
                  {selectedMemory.description && <p className="mt-2 text-[#404947]">{selectedMemory.description}</p>}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button type="button" onClick={() => { setEditingMemory(selectedMemory); setMemoryFormError(''); setShowMemoryForm(true); setShowPhotoModal(false); }} className="h-11 px-4 rounded-full bg-[#e6f0ee] text-[#003531] font-semibold text-sm">Edit Memory</button>
                  <button type="button" onClick={() => deleteMemory(selectedMemory)} className="h-11 px-4 rounded-full bg-red-50 text-red-800 font-semibold text-sm">Delete Memory</button>
                </div>
              </>
            ) : (
              <p className="text-center text-[#404947]">No saved memories yet. Add one from the Memory Lane card.</p>
            )}
            {memories.length > 0 && (
              <div className="grid w-full grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                {memories.map((memory) => (
                  <button key={memory.id} type="button" onClick={() => setActiveMemoryId(memory.id)} aria-pressed={selectedMemory?.id === memory.id} className={`rounded-xl border-2 p-2 text-left ${selectedMemory?.id === memory.id ? 'border-[#003531] bg-[#ecf6f4]' : 'border-[#dbe5e2] bg-white'}`}>
                    <img src={memory.imageUrl || memoryPhotoUrl} onError={(event) => { event.currentTarget.src = memoryPhotoUrl; }} alt="" className="h-20 w-full rounded-lg object-cover" />
                    <span className="mt-1 block truncate text-sm font-semibold text-[#003531]">{memory.title}</span>
                  </button>
                ))}
              </div>
            )}
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
