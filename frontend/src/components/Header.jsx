import React from 'react';

export default function Header({ currentScreen, onNavigate, fontSizeScale, onFontScaleChange }) {
  const logoUrl = "https://lh3.googleusercontent.com/aida/AEtjO1VxA9X_yqnE-NJ-cpyClswvzqXOHw2a3Bms2B8MRppIHCK4RPpMyRbkmWVPX8XHd8-y3_Qw1LzwDHhB9Z7942iaHWjseDUBTocwgXjWl5UngGb_PI42uUn94hTxVDhF7-u9er8aGKMimtCwhcSD6zAUA0CSSn5SC5G2fo7E5ZLoomBQ_Rkpi18jzmqBKj_ICj-zFGlIGzmMXUzy0uFJMjt_VK4f8m5i7-wg1I6K-n5jbWeD0FbOlAYLhA";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f2fbf9]/95 backdrop-blur-xl border-b border-[#dbe5e2]/80 shadow-[0_4px_20px_rgba(20,29,28,0.05)]">
      <div className="h-20 max-w-[1240px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onNavigate('welcome')}>
          <img
            src={logoUrl}
            alt="Sahaayak Logo"
            className="h-10 w-10 rounded-xl object-contain shadow-sm"
          />
          <div className="flex flex-col">
            <span className="font-bold text-xl text-[#003531] leading-tight tracking-tight">Sahaayak</span>
            <span className="text-xs text-gray-500 font-medium">Your everyday companion</span>
          </div>
        </div>

        {/* Center: Navigation Pills & Voice Indicator */}
        <div className="hidden md:flex items-center gap-3">
          <nav className="flex items-center bg-[#e6f0ee] p-1.5 rounded-full">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              aria-current={currentScreen === 'dashboard' ? 'page' : undefined}
              className={`px-5 py-2 font-semibold rounded-full text-sm transition-all cursor-pointer ${
                currentScreen === 'dashboard'
                  ? 'bg-[#003531] text-white shadow-sm'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigate('welcome')}
              aria-current={currentScreen === 'welcome' ? 'page' : undefined}
              className={`px-5 py-2 font-semibold rounded-full text-sm transition-all cursor-pointer ${
                currentScreen === 'welcome'
                  ? 'bg-[#003531] text-white shadow-sm'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Welcome
            </button>
          </nav>

        </div>

        {/* Right: Accessibility Controls & SOS */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center bg-[#e6f0ee] rounded-full p-1 shadow-sm">
            <button
              type="button"
              aria-label="Decrease font size"
              onClick={() => onFontScaleChange(-0.1)}
              className="h-10 w-10 flex items-center justify-center rounded-full text-[#141d1c] font-bold text-sm hover:bg-white transition-colors cursor-pointer"
            >
              A-
            </button>
            <div className="w-px h-5 bg-[#bfc8c6]"></div>
            <button
              type="button"
              aria-label="Increase font size"
              onClick={() => onFontScaleChange(0.1)}
              className="h-10 w-10 flex items-center justify-center rounded-full text-[#141d1c] font-bold text-sm hover:bg-white transition-colors cursor-pointer"
            >
              A+
            </button>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            onClick={() => alert("Notifications: 2 reminders active today.")}
            className="relative h-11 w-11 flex items-center justify-center rounded-full bg-[#e6f0ee] text-gray-700 hover:bg-[#dbe5e2] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#fc934f] text-white text-[10px] font-bold">
              2
            </span>
          </button>

          <a
            href="tel:112"
            className="h-11 px-4 sm:px-5 flex items-center gap-2 rounded-full bg-[#991B1B] text-white font-bold text-sm shadow-sm hover:bg-red-800 transition-colors focus:outline-none focus:ring-4 focus:ring-red-200 shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">emergency</span>
            <span className="whitespace-nowrap">Emergency / SOS</span>
          </a>
        </div>
      </div>
    </header>
  );
}
