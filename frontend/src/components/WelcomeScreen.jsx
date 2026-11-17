import React, { useState } from 'react';

export default function WelcomeScreen({ userName, setUserName, onContinue }) {
  const [inputVal, setInputVal] = useState(userName || '');
  const [showError, setShowError] = useState(false);

  const handleContinue = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) {
      setShowError(true);
      setTimeout(() => setShowError(false), 1500);
    } else {
      setUserName(trimmed);
      onContinue(trimmed);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full py-10 flex flex-col items-center justify-center">
        {/* Subtle ambient glow background */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#b4eee6]/30 blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute top-48 right-10 w-72 h-72 rounded-full bg-[#ffdbc9]/30 blur-3xl -z-10 pointer-events-none"></div>

        {/* Editorial Titles */}
        <div className="text-center max-w-2xl mb-8 px-4">
          <span className="block text-xs uppercase tracking-widest font-bold text-[#0e4d48] mb-2">SAHAAYAK</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#141d1c] tracking-tight mb-3">
            A little help, whenever you need it.
          </h1>
        </div>

        {/* Name Input Card */}
        <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#dbe5e2]/80 mb-12 relative overflow-hidden">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-xl font-bold text-gray-900 mb-1" htmlFor="userNameInput">
                What should we call you?
              </label>
              <span className="block text-sm text-[#404947] mb-4">
                You can use your nickname, family title, or full name.
              </span>
              <div className="relative">
                <input
                  id="userNameInput"
                  type="text"
                  autoComplete="name"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                  placeholder="Your name"
                  className={`w-full h-16 px-5 pr-28 rounded-2xl bg-[#f2fbf9] text-[#141d1c] text-xl border-2 ${
                    showError ? 'border-[#fc934f] ring-4 ring-[#fc934f]/30' : 'border-[#0e4d48]'
                  } focus:border-[#003531] focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-200 transition-all placeholder:text-[#707977] font-medium`}
                />
              </div>
            </div>

            {/* Voice Feedback indicator */}
            {isListening && (
              <div
                id="listeningFeedback"
                className="flex items-center justify-between p-4 bg-[#ffdbc9]/60 border border-[#fc934f]/30 rounded-2xl animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#994703] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#994703]"></span>
                  </div>
                  <span className="text-sm font-semibold text-[#753400]">Listening... say your name clearly</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-5 bg-[#994703] rounded-full animate-bounce"></div>
                  <div className="w-1 h-8 bg-[#994703] rounded-full animate-bounce [animation-delay:0.15s]"></div>
                  <div className="w-1 h-6 bg-[#994703] rounded-full animate-bounce [animation-delay:0.3s]"></div>
                </div>
              </div>
            )}

            {/* Continue Primary Button */}
            <button
              type="button"
              id="continueBtn"
              onClick={handleContinue}
              className="w-full py-4 px-6 rounded-2xl bg-[#0E4D48] text-white font-bold text-lg flex items-center justify-center gap-2 shadow-md hover:bg-[#003531] active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-teal-200 cursor-pointer"
            >
              <span>Continue to Sahaayak</span>
              <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
            </button>
          </div>

        </div>

        {/* Feature Cards Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white border border-[#dbe5e2] hover:border-teal-300 hover:shadow-md transition-all duration-200 rounded-2xl p-5 flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-[#ecf6f4] text-[#003531] flex items-center justify-center shrink-0 mb-4">
                <span className="material-symbols-outlined text-[26px]">record_voice_over</span>
              </div>
              <h2 className="text-lg font-bold text-[#003531] mb-2 leading-snug">Instant voice help</h2>
              <p class="text-sm text-[#404947] leading-relaxed">
                Just talk naturally. Sahaayak reads out news, timings, and answers every question clearly.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[#994703] font-semibold text-xs pt-4 mt-2 border-t border-gray-50">
              <span>Always listening</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#dbe5e2] hover:border-teal-300 hover:shadow-md transition-all duration-200 rounded-2xl p-5 flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-[#ffdbc9] text-[#753400] flex items-center justify-center shrink-0 mb-4">
                <span className="material-symbols-outlined text-[26px]">call</span>
              </div>
              <h2 className="text-lg font-bold text-[#003531] mb-2 leading-snug">One-tap family calls</h2>
              <p className="text-sm text-[#404947] leading-relaxed">
                Large colorful contact cards for children, doctors, and neighbors. No phonebook scrolling.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[#994703] font-semibold text-xs pt-4 mt-2 border-t border-gray-50">
              <span>Speed dials saved</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#dbe5e2] hover:border-teal-300 hover:shadow-md transition-all duration-200 rounded-2xl p-5 flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-[#b4eee6] text-[#003531] flex items-center justify-center shrink-0 mb-4">
                <span className="material-symbols-outlined text-[26px]">medication</span>
              </div>
              <h2 className="text-lg font-bold text-[#003531] mb-2 leading-snug">Medicine &amp; visits</h2>
              <p className="text-sm text-[#404947] leading-relaxed">
                Gentle chime reminders before meals and for doctor consultations so nothing is forgotten.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[#994703] font-semibold text-xs pt-4 mt-2 border-t border-gray-50">
              <span>Visual schedule</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[#404947] text-sm font-medium py-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003531] text-[20px]">verified_user</span>
            <span>Private &amp; secure</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-[#bfc8c6]"></span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003531] text-[20px]">hearing</span>
            <span>Built for clear hearing</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-[#bfc8c6]"></span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003531] text-[20px]">contrast</span>
            <span>High-contrast display</span>
          </div>
        </div>
      </div>
    </div>
  );
}
