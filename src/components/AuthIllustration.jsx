import React from 'react';

export default function AuthIllustration({ className = "w-full h-full" }) {
  return (
    <svg
      viewBox="0 0 520 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Vibrant Fluid Wave Gradient */}
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="60%" stopColor="#0369A1" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>

        {/* Soft Drop Shadows */}
        <filter id="deskShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.18" />
        </filter>
        <filter id="characterShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.22" />
        </filter>
        <filter id="chairShadow" x="-15%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.25" />
        </filter>

        {/* Plant leaf gradients */}
        <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>
        <linearGradient id="leafGradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* 1. FLUID ORGANIC BLUE CURVE BACKGROUND */}
      <path
        d="M 0 0 L 320 0 C 370 40, 395 120, 370 190 C 340 270, 260 360, 180 430 C 140 460, 60 460, 0 460 Z"
        fill="url(#waveGrad)"
      />

      {/* 2. BACKGROUND BOTANICAL LEAF (RIGHT) */}
      <g opacity="0.95">
        <path
          d="M 370 240 C 400 230, 420 280, 410 330 C 400 370, 375 390, 360 400 C 350 370, 355 310, 370 240 Z"
          fill="url(#leafGradBlue)"
        />
        <path
          d="M 360 270 C 390 280, 400 340, 380 390 C 365 370, 360 320, 360 270 Z"
          fill="#0284C7"
        />
        <path
          d="M 350 300 C 370 310, 380 370, 360 420 C 345 390, 345 350, 350 300 Z"
          fill="#34D399"
        />
      </g>

      {/* 3. POTTED PLANT ON THE LEFT */}
      <g filter="url(#deskShadow)">
        {/* Pot */}
        <path d="M 85 320 L 115 320 L 110 365 L 90 365 Z" fill="#292D32" />
        <ellipse cx="100" cy="320" rx="15" ry="3.5" fill="#3A3F47" />

        {/* Large Botanical Leaves */}
        <path
          d="M 100 320 C 65 305, 50 250, 80 210 C 95 240, 100 280, 100 320 Z"
          fill="url(#leafGrad1)"
        />
        <path
          d="M 100 320 C 85 285, 90 230, 115 190 C 125 230, 115 280, 100 320 Z"
          fill="url(#leafGrad2)"
        />
        <path
          d="M 100 320 C 115 295, 140 260, 150 220 C 145 260, 125 300, 100 320 Z"
          fill="url(#leafGrad1)"
        />
        <path
          d="M 100 320 C 80 310, 60 290, 65 265 C 75 285, 90 305, 100 320 Z"
          fill="#059669"
        />
      </g>

      {/* 4. OFFICE CHAIR (BACKREST & BASE) */}
      <g filter="url(#chairShadow)">
        {/* Curved Ergonomic Backrest */}
        <path
          d="M 230 185 C 220 200, 215 260, 235 295 C 255 315, 275 315, 290 305 C 280 270, 275 220, 265 185 Z"
          fill="#1E232A"
        />
        {/* Chair Seat Cushion */}
        <path
          d="M 230 285 C 240 280, 300 280, 310 295 C 310 310, 250 320, 230 305 Z"
          fill="#2B323D"
        />
        {/* Metal Gas Lift Stem */}
        <rect x="268" y="310" width="8" height="50" rx="2" fill="#94A3B8" />
        {/* Chair Base Wheels */}
        <path d="M 245 360 L 272 355 L 298 360" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
        <circle cx="245" cy="365" r="3.5" fill="#1E293B" />
        <circle cx="272" cy="365" r="3.5" fill="#1E293B" />
        <circle cx="298" cy="365" r="3.5" fill="#1E293B" />
      </g>

      {/* 5. DEVELOPER CHARACTER (BODY, HEAD, CLOTHING) */}
      <g filter="url(#characterShadow)">
        {/* Legs / Blue Trousers */}
        <path
          d="M 255 295 C 270 295, 305 300, 320 330 C 330 350, 335 390, 335 410 L 315 415 C 310 380, 305 345, 290 330 C 275 320, 255 310, 250 305 Z"
          fill="#2563EB"
        />
        <path
          d="M 270 305 C 285 305, 315 315, 330 345 C 340 365, 348 400, 345 420 L 328 423 C 325 390, 318 360, 305 340 Z"
          fill="#1D4ED8"
        />

        {/* Shoes */}
        <path d="M 315 410 L 342 410 C 347 410, 348 418, 342 422 L 315 422 Z" fill="#1E293B" />
        <path d="M 326 420 L 354 420 C 359 420, 360 428, 354 432 L 326 432 Z" fill="#0F172A" />

        {/* Torso / White Collared Shirt */}
        <path
          d="M 248 195 C 265 190, 295 190, 305 205 C 315 220, 310 280, 300 295 C 285 300, 255 295, 245 280 C 240 260, 240 215, 248 195 Z"
          fill="#F8FAFC"
        />
        {/* Shirt Collar Detail */}
        <polygon points="280,188 288,202 274,202" fill="#E2E8F0" />
        <polygon points="288,188 296,202 282,202" fill="#CBD5E1" />
        {/* Emerald Green Tie */}
        <polygon points="283,200 288,200 290,260 285,268 281,260" fill="#10B981" />

        {/* Left Arm holding Desk / Mug */}
        <path
          d="M 265 205 C 280 210, 295 240, 315 242 C 325 242, 335 240, 345 240"
          stroke="#F8FAFC"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Coffee Mug in Hand (Red/Orange) */}
        <rect x="338" y="228" width="16" height="20" rx="3" fill="#EF4444" />
        <path d="M 354 233 C 360 233, 360 243, 354 243" stroke="#EF4444" strokeWidth="2.5" fill="none" />
        <ellipse cx="346" cy="228" rx="8" ry="2.5" fill="#DC2626" />
        {/* Steam */}
        <path d="M 344 222 C 342 216, 346 212, 344 206" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

        {/* Head & Neck */}
        <rect x="278" y="175" width="12" height="15" fill="#FBD5BD" />
        <circle cx="285" cy="168" r="14" fill="#FBD5BD" />
        {/* Stylish Modern Dark Hair */}
        <path
          d="M 271 165 C 271 152, 280 148, 294 150 C 302 152, 305 160, 301 168 C 298 162, 290 157, 280 158 C 274 159, 271 162, 271 165 Z"
          fill="#1E293B"
        />
        {/* Ear */}
        <circle cx="277" cy="169" r="2.5" fill="#F5C3A5" />
      </g>

      {/* 6. MODERN WORK DESK & COMPUTER SETUP */}
      <g filter="url(#deskShadow)">
        {/* Desk Tabletop */}
        <rect x="280" y="240" width="180" height="12" rx="3" fill="#6B5344" />
        <rect x="280" y="248" width="180" height="4" fill="#523F33" />

        {/* Desk Drawer Cabinet on Right */}
        <rect x="390" y="252" width="60" height="110" rx="2" fill="#5D473A" />
        <line x1="395" y1="285" x2="445" y2="285" stroke="#48372D" strokeWidth="2" />
        <line x1="395" y1="320" x2="445" y2="320" stroke="#48372D" strokeWidth="2" />
        {/* Drawer Handles */}
        <rect x="415" y="266" width="18" height="3" rx="1.5" fill="#CBD5E1" />
        <rect x="415" y="300" width="18" height="3" rx="1.5" fill="#CBD5E1" />
        <rect x="415" y="335" width="18" height="3" rx="1.5" fill="#CBD5E1" />

        {/* Desk Left Metal Leg */}
        <rect x="295" y="252" width="6" height="140" fill="#94A3B8" />

        {/* Computer Monitor */}
        {/* Stand */}
        <rect x="415" y="215" width="6" height="25" fill="#334155" />
        <ellipse cx="418" cy="240" rx="16" ry="3" fill="#1E293B" />
        {/* Screen Bezel */}
        <rect x="380" y="160" width="76" height="55" rx="5" fill="#1E293B" />
        {/* Screen Display (Glowing Dark Slate) */}
        <rect x="384" y="164" width="68" height="47" rx="3" fill="#0F172A" />
        {/* Subtle Code IDE Lines on Screen */}
        <line x1="390" y1="172" x2="420" y2="172" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <line x1="395" y1="178" x2="435" y2="178" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <line x1="395" y1="184" x2="415" y2="184" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <line x1="390" y1="190" x2="430" y2="190" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <line x1="395" y1="196" x2="425" y2="196" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />

        {/* Keyboard on Desk */}
        <rect x="330" y="242" width="45" height="3" rx="1" fill="#1E293B" />
      </g>
    </svg>
  );
}
