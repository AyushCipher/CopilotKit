import { css, unsafeCSS } from "lit";

import { LAUNCHER_SIGNAL_COLORS } from "./tokens.js";

export const shellChromeStyles = css`
      /* ── Launcher HUD: hover menu, quieter than the error island ── */
      .console-button-wrapper[data-cpk-hud="open"] .cpk-launcher-hud {
        pointer-events: auto;
        opacity: 1;
        transform: none;
        visibility: visible;
      }

      .cpk-launcher-hud {
        --hud-fill: var(--cpk-inspector-surface-dark);
        --hud-line: rgb(190 194 255 / 0.5);
        --hud-blur: blur(12px) saturate(1.2);
        position: absolute;
        top: 0;
        z-index: 4;
        padding-right: 14px;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transform: translateX(8px);
        transition:
          opacity 160ms ease,
          transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .cpk-launcher-hud[data-cpk-hud-side="left"] {
        right: 100%;
        padding-right: 14px;
        padding-left: 0;
      }

      .cpk-launcher-hud[data-cpk-hud-side="right"] {
        left: 100%;
        right: auto;
        padding-right: 0;
        padding-left: 14px;
        transform: translateX(-8px);
      }

      .console-button-wrapper[data-cpk-hud="open"]
        .cpk-launcher-hud[data-cpk-hud-side="right"] {
        transform: none;
      }

      .cpk-launcher-hud__card {
        position: relative;
        width: 228px;
        padding: 4px;
        border: 1px dotted var(--hud-line);
        border-radius: var(--cpk-inspector-shell-radius);
        background: var(--hud-fill);
        color: #fff;
        backdrop-filter: var(--hud-blur);
        -webkit-backdrop-filter: var(--hud-blur);
        box-shadow: 0 8px 20px rgb(1 5 7 / 0.18);
      }

      .cpk-launcher-hud[data-color-scheme="light"] {
        --hud-fill: #fff;
        --hud-line: #d8d8e8;
      }

      .cpk-launcher-hud[data-color-scheme="light"] .cpk-launcher-hud__card {
        color: #010507;
      }

      .cpk-launcher-hud__arrow {
        position: absolute;
        top: calc(var(--cpk-launcher-size) / 2);
        z-index: 1;
        width: 10px;
        height: 10px;
        border: 0;
        /* The card frosts the page behind it, so it reads lighter than the
           raw fill. Mix a little white so the arrow matches the glass card
           without going lighter than the HUD. */
        background: color-mix(in srgb, var(--hud-fill) 88%, white 12%);
        transform: translateY(-50%) rotate(45deg);
      }

      .cpk-launcher-hud[data-cpk-hud-side="left"] .cpk-launcher-hud__arrow {
        right: 9px;
      }

      .cpk-launcher-hud[data-cpk-hud-side="right"] .cpk-launcher-hud__arrow {
        left: 9px;
      }

      .cpk-launcher-hud__list {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .cpk-launcher-hud__list + .cpk-launcher-hud__list {
        margin-top: 4px;
        padding-top: 4px;
        border-top: 1px dotted var(--hud-line);
      }

      .cpk-launcher-hud__row {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 28px;
        align-items: start;
        border-radius: 7px;
        cursor: pointer;
      }

      .cpk-launcher-hud__row + .cpk-launcher-hud__row {
        margin-top: 1px;
      }

      .cpk-launcher-hud__row:hover,
      .cpk-launcher-hud__row:focus-within,
      .cpk-launcher-hud__row[data-cpk-hud-help="open"] {
        background: rgb(255 255 255 / 0.06);
      }

      .cpk-launcher-hud[data-color-scheme="light"] .cpk-launcher-hud__row:hover,
      .cpk-launcher-hud[data-color-scheme="light"]
        .cpk-launcher-hud__row:focus-within,
      .cpk-launcher-hud[data-color-scheme="light"]
        .cpk-launcher-hud__row[data-cpk-hud-help="open"] {
        background: #f0f0f4;
      }

      .cpk-launcher-hud__action {
        display: flex;
        gap: 8px;
        min-height: 32px;
        align-items: center;
        padding: 6px 8px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #fff;
        font-family: inherit;
        font-size: 12px;
        font-weight: 600;
        text-align: start;
        cursor: pointer;
      }

      .cpk-launcher-hud[data-color-scheme="light"] .cpk-launcher-hud__action {
        color: #010507;
      }

      /* Stretch the row action over the whole tab, including the detail
         copy. The help mark sits above this layer. */
      .cpk-launcher-hud__action::after {
        content: "";
        position: absolute;
        inset: 0;
      }

      .cpk-launcher-hud__check {
        flex: none;
        width: 14px;
        height: 14px;
        color: #34d399;
      }

      .cpk-launcher-hud__help {
        position: relative;
        z-index: 1;
        display: inline-flex;
        width: 28px;
        height: 32px;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: 0;
        background: transparent;
        color: rgb(255 255 255 / 0.78);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
      }

      .cpk-launcher-hud__help span {
        display: inline-flex;
        width: 16px;
        height: 16px;
        align-items: center;
        justify-content: center;
        border: 1px dotted rgb(190 194 255 / 0.55);
        border-radius: 50%;
        line-height: 1;
      }

      .cpk-launcher-hud[data-color-scheme="light"] .cpk-launcher-hud__help {
        color: #68686e;
      }

      .cpk-launcher-hud__help:focus-visible,
      .cpk-launcher-hud__action:focus-visible {
        outline: 2px solid #bec2ff;
        outline-offset: 1px;
      }

      .cpk-launcher-hud__detail {
        grid-column: 1 / -1;
        max-height: 0;
        margin: 0;
        padding: 0 8px;
        overflow: hidden;
        color: rgb(255 255 255 / 0.78);
        font-size: 11px;
        font-weight: 400;
        line-height: 1.4;
        opacity: 0;
        pointer-events: none;
        transform: translateY(-6px);
        transition:
          max-height 200ms cubic-bezier(0.16, 1, 0.3, 1),
          opacity 150ms ease-out,
          transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
          padding-bottom 200ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .cpk-launcher-hud[data-color-scheme="light"] .cpk-launcher-hud__detail {
        color: #68686e;
      }

      .cpk-launcher-hud__row:hover .cpk-launcher-hud__detail,
      .cpk-launcher-hud__row:focus-within .cpk-launcher-hud__detail,
      .cpk-launcher-hud__row[data-cpk-hud-help="open"]
        .cpk-launcher-hud__detail {
        max-height: 72px;
        padding: 0 8px 7px;
        opacity: 1;
        transform: none;
      }

      @media (prefers-reduced-motion: reduce) {
        .cpk-launcher-hud,
        .cpk-launcher-hud__detail {
          transition: none;
        }
      }

      /*
       * On mount, borrow the hover HUD for one short introduction. The card
       * establishes the destination first; its rows then resolve in order so
       * the eye can count the available features instead of receiving one
       * undifferentiated block. Only opacity and transform move.
       */
      @keyframes cpk-launcher-hud-intro {
        0% {
          opacity: 0;
          transform: translateX(8px);
        }
        8%,
        88% {
          opacity: 1;
          transform: none;
        }
        100% {
          opacity: 0;
          transform: translateX(4px);
        }
      }

      @keyframes cpk-launcher-hud-intro-right {
        0% {
          opacity: 0;
          transform: translateX(-8px);
        }
        8%,
        88% {
          opacity: 1;
          transform: none;
        }
        100% {
          opacity: 0;
          transform: translateX(-4px);
        }
      }

      @keyframes cpk-launcher-hud-row-online {
        from {
          opacity: 0;
          transform: translateY(4px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }

      @keyframes cpk-launcher-hud-check-online {
        from {
          opacity: 0;
          transform: scale(0.65);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .cpk-launcher-hud[data-cpk-hud-intro="true"] {
        animation: cpk-launcher-hud-intro var(--cpk-launcher-hud-intro-duration)
          cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      .cpk-launcher-hud[data-cpk-hud-intro="true"][data-cpk-hud-side="right"] {
        animation-name: cpk-launcher-hud-intro-right;
      }

      .cpk-launcher-hud[data-cpk-hud-intro="true"] .cpk-launcher-hud__row {
        animation: cpk-launcher-hud-row-online
          var(--cpk-launcher-hud-row-duration) cubic-bezier(0.16, 1, 0.3, 1)
          both;
        animation-delay: var(--cpk-hud-row-delay);
      }

      .cpk-launcher-hud[data-cpk-hud-intro="true"] .cpk-launcher-hud__check {
        animation: cpk-launcher-hud-check-online 220ms
          cubic-bezier(0.16, 1, 0.3, 1) both;
        animation-delay: calc(var(--cpk-hud-row-delay) + 90ms);
      }

      @media (prefers-reduced-motion: reduce) {
        .cpk-launcher-hud[data-cpk-hud-intro="true"],
        .cpk-launcher-hud[data-cpk-hud-intro="true"] .cpk-launcher-hud__row,
        .cpk-launcher-hud[data-cpk-hud-intro="true"] .cpk-launcher-hud__check {
          animation: none !important;
          opacity: 1;
          transform: none;
        }
      }

      /*
       * Marker on the navigation entry, which is what keeps a signal alive
       * once the panel is open and the launcher is hidden. Static by design:
       * the beat belongs to the launcher, and movement here would compete with
       * the live event stream a developer is actually watching.
       *
       * Tone-selected rather than tone-agnostic, because the marker has to
       * agree with the dot that sent the reader here. Same shape, same
       * placement, one declaration different — as on the launcher, where the
       * treatment is shared and only the injected colour changes.
       */
      .inspector-nav-signal-dot {
        display: inline-block;
        flex: none;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${unsafeCSS(LAUNCHER_SIGNAL_COLORS.news)};
      }
      .inspector-nav-signal-dot[data-cpk-signal-tone="error"] {
        background: ${unsafeCSS(LAUNCHER_SIGNAL_COLORS.error)};
      }

      /* ── Inspector window ────────────────────────────────────────── */
      .inspector-window {
        border: 1px solid #d8d8e8 !important;
        border-radius: var(--cpk-inspector-shell-radius) !important;
        box-shadow: none !important;
      }

      /* ── Header drag area ────────────────────────────────────────── */
      .drag-handle {
        border-bottom-color: #d8d8e8 !important;
        background-color: #f7f6fd !important;
      }

      .inspector-account-strip {
        background: linear-gradient(
          90deg,
          #ffffff 0%,
          #f3f1ff 58%,
          #eefbf7 100%
        ) !important;
        color: #010507 !important;
      }

      /* ── Tab buttons ─────────────────────────────────────────────── */
      /*
       * Named classes owned by this component — no Tailwind conflict.
       * Active: brand surface/surfaceContainerActive (lilac tint) +
       *         border/borderActionEnabled underline.
       * Dark fill is for primary action buttons only, not nav tabs.
       */
      .cpk-tab-active {
        background-color: rgba(190, 194, 255, 0.18);
        color: #010507;
        font-weight: 600;
      }
      .cpk-tab-icon {
        display: inline-flex;
        flex-shrink: 0;
        align-items: center;
      }
      .cpk-tab-active .cpk-tab-icon {
        color: #5558b2;
      }
      .cpk-tab-inactive {
        background-color: transparent;
        color: #2b2b2b;
      }
      .cpk-tab-inactive .cpk-tab-icon {
        color: #68686e;
      }
      .cpk-tab-inactive:hover {
        background-color: rgba(190, 194, 255, 0.08);
        color: #010507;
        cursor: pointer;
      }
      .cpk-tab-active {
        cursor: pointer;
      }
      /* ── Header controls on the branded account strip ──────────── */
      .drag-handle > div[data-inspector-account-strip] button {
        color: #57575b !important;
        cursor: pointer;
      }
      .drag-handle > div[data-inspector-account-strip] button,
      .inspector-nav-control,
      [data-inspector-thread-cta] {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }
      .drag-handle > div[data-inspector-account-strip] button:hover {
        background-color: rgba(100, 48, 171, 0.09) !important;
        color: #3f176f !important;
      }
      .drag-handle > div[data-inspector-account-strip] button:focus-visible {
        outline: 2px solid #bec2ff !important;
        outline-offset: 2px;
      }
      .inspector-nav-control:focus-visible,
      [data-inspector-thread-cta]:focus-visible,
      [data-inspector-action-placement="threads-footer"]:focus-visible {
        outline: 2px solid #6430ab !important;
        outline-offset: 2px;
      }
      .inspector-sidebar .inspector-nav-control,
      .inspector-sidebar .inspector-sidebar-control,
      .inspector-sidebar .inspector-sidebar-label {
        display: flex !important;
        justify-content: flex-start !important;
        text-align: left !important;
        outline-offset: -2px;
      }
      .inspector-sidebar[data-icon-rail="true"] .inspector-nav-control,
      .inspector-sidebar[data-icon-rail="true"] .inspector-sidebar-control,
      .inspector-sidebar[data-icon-rail="true"] .inspector-sidebar-toggle {
        box-sizing: border-box !important;
        width: 36px !important;
        height: 36px !important;
        min-width: 36px !important;
        min-height: 36px !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
      }
      .inspector-sidebar[data-icon-rail="true"] .inspector-nav-icon,
      .inspector-sidebar[data-icon-rail="true"] .inspector-nav-icon svg,
      .inspector-sidebar[data-icon-rail="true"]
        .inspector-context-dropdown-icon,
      .inspector-sidebar[data-icon-rail="true"]
        .inspector-context-dropdown-icon
        svg,
      .inspector-sidebar[data-icon-rail="true"]
        .inspector-agent-placeholder
        svg {
        width: 18px !important;
        height: 18px !important;
        overflow: visible !important;
      }
      .inspector-sidebar[data-icon-rail="true"]
        .inspector-agent-selector
        > [data-context-dropdown-root="true"] {
        display: flex !important;
        flex: none !important;
        width: 36px !important;
        min-width: 36px !important;
        max-width: 36px !important;
        justify-content: center !important;
        align-items: center !important;
      }
      .inspector-sidebar[data-icon-rail="true"]
        .inspector-agent-selector
        > [data-context-dropdown-root="true"]
        > button,
      .inspector-sidebar[data-icon-rail="true"] .inspector-agent-placeholder {
        display: flex !important;
        width: 36px !important;
        height: 36px !important;
        min-width: 36px !important;
        min-height: 36px !important;
        max-width: 36px !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0 !important;
        padding: 0 !important;
        transition:
          background-color 180ms ease,
          border-color 180ms ease,
          color 180ms ease !important;
      }
      .inspector-sidebar[data-icon-rail="true"]
        .inspector-context-dropdown-label,
      .inspector-sidebar[data-icon-rail="true"]
        .inspector-context-dropdown-chevron {
        display: none !important;
        width: 0 !important;
        min-width: 0 !important;
        flex: none !important;
        overflow: hidden !important;
      }
      .inspector-sidebar[data-icon-rail="true"] .inspector-nav-label,
      .inspector-sidebar[data-icon-rail="true"] .inspector-sidebar-label {
        display: none !important;
      }
      .inspector-sidebar .inspector-nav-control:focus-visible,
      .inspector-sidebar .inspector-sidebar-label:focus-visible,
      .inspector-sidebar .inspector-sidebar-toggle:focus-visible {
        outline-offset: -2px !important;
      }

      /* ── Agent/context dropdown ──────────────────────────────────── */
      [data-context-dropdown-root="true"] > button {
        border-color: #dbdbe5 !important;
        color: #010507 !important;
      }
      [data-context-dropdown-root="true"] > button:hover {
        border-color: #bec2ff !important;
        background-color: #f7f7f9 !important;
      }
      [data-context-dropdown-root="true"] > button > span:last-child {
        color: #68686e !important;
      }
      [data-context-dropdown-root="true"] > div {
        border-color: #dbdbe5 !important;
        box-shadow: 0 4px 12px rgba(1, 5, 7, 0.08) !important;
      }
      [data-context-dropdown-root="true"] > div button:hover,
      [data-context-dropdown-root="true"] > div button:focus {
        background-color: #eceafa !important;
        color: #2f1664 !important;
      }
      .inspector-sidebar
        .inspector-agent-selector
        > [data-context-dropdown-root="true"]
        > button {
        border-color: #d8d8e8 !important;
        background-color: rgba(255, 255, 255, 0.7) !important;
        color: #010507 !important;
      }
      .inspector-sidebar
        .inspector-agent-selector
        > [data-context-dropdown-root="true"]
        > button:hover {
        border-color: #a5a9ee !important;
        background-color: #ffffff !important;
      }
      .inspector-sidebar
        .inspector-agent-selector
        > [data-context-dropdown-root="true"]
        > button
        > span:last-child {
        color: #68686e !important;
      }

      /* ── Resize handle ───────────────────────────────────────────── */
      .resize-handle {
        color: #68686e !important;
      }
      .resize-handle:hover {
        color: #57575b !important;
      }

      /* ── AG-UI Events tab ────────────────────────────────────────── */
      /* Row hover: replace blue tint with brand lilac */
      tr:hover td {
        background-color: rgba(190, 194, 255, 0.08) !important;
      }
      /* Reset/dark action button */
      button[class*="bg-gray-900"] {
        background-color: #010507 !important;
      }
      button[class*="bg-gray-800"] {
        background-color: #2b2b2b !important;
      }
      /* Copy "copied" state: generic green → brand mint */
      button[class*="bg-green-100"] {
        background-color: rgba(133, 236, 206, 0.2) !important;
        color: #087653 !important;
      }

      /* ── Agents tab ──────────────────────────────────────────────── */
      /* Agent icon bubble: blue → lilac */
      span[class*="bg-blue-100"]:not([class*="text-blue-800"]) {
        background-color: rgba(190, 194, 255, 0.15) !important;
      }
      span[class*="text-blue-600"] {
        color: #5558b2 !important;
      }
      /* Running badge: emerald → mint */
      span[class*="bg-emerald-50"] {
        background-color: rgba(133, 236, 206, 0.15) !important;
      }
      span[class*="text-emerald-700"] {
        color: #087653 !important;
      }
      /* Running status dot */
      span[class*="bg-emerald-500"] {
        background-color: #85ecce !important;
      }
      /* Idle dot */
      span[class*="bg-gray-400"] {
        background-color: #afafb7 !important;
      }
      /* User role badge (blue → lilac) */
      span[class*="bg-blue-100"][class*="text-blue-800"] {
        background-color: rgba(190, 194, 255, 0.22) !important;
        border: 1px solid rgba(190, 194, 255, 0.45) !important;
        color: #57575b !important;
      }
      /* Assistant role badge (green → mint) */
      span[class*="bg-green-100"][class*="text-green-800"] {
        background-color: rgba(133, 236, 206, 0.18) !important;
        border: 1px solid rgba(133, 236, 206, 0.4) !important;
        color: #087653 !important;
      }
      /* Tool role badge (amber → orange brand) */
      span[class*="bg-amber-100"][class*="text-amber-800"] {
        background-color: rgba(255, 172, 77, 0.15) !important;
        color: #57575b !important;
      }

      /* ── Frontend Tools tab ──────────────────────────────────────── */
      /* Handler badge (blue → lilac) */
      span[class*="bg-blue-50"][class*="text-blue-700"] {
        background-color: rgba(190, 194, 255, 0.12) !important;
        border-color: rgba(190, 194, 255, 0.3) !important;
        color: #010507 !important;
      }
      /* Renderer badge (purple → lilac-adjacent) */
      span[class*="bg-purple-50"][class*="text-purple-700"] {
        background-color: rgba(190, 194, 255, 0.12) !important;
        border-color: rgba(190, 194, 255, 0.3) !important;
        color: #57575b !important;
      }
      /* Required badge (rose → brand red) */
      span[class*="bg-rose-50"][class*="text-rose-700"] {
        background-color: rgba(250, 95, 103, 0.1) !important;
        border-color: rgba(250, 95, 103, 0.25) !important;
        color: #fa5f67 !important;
      }
      /* Code/default value blocks */
      code[class*="bg-gray-100"],
      span[class*="bg-gray-100"] {
        background-color: #f0f0f4 !important;
      }

      /* ── Connected status bar: match threads header mint (#5BE4BB) ──── */
      /* Outer strip bg + top border + text when connected badge is present */
      .inspector-window
        > div
        > div:last-child
        > div:last-child:has(div[class*="bg-emerald-50"]) {
        background-color: rgba(91, 228, 187, 0.08) !important;
        border-top-color: rgba(91, 228, 187, 0.3) !important;
        color: #087653 !important;
      }
      /* Inner badge — slightly more opaque on the mint bg */
      div[class*="bg-emerald-50"][class*="border-emerald-200"] {
        background-color: rgba(91, 228, 187, 0.12) !important;
        border-color: rgba(91, 228, 187, 0.4) !important;
        color: #087653 !important;
      }
      div[class*="bg-emerald-50"][class*="border-emerald-200"]
        span[class*="opacity-80"] {
        opacity: 1 !important;
      }
      /* Icon bubble inside connected badge → mint tint */
      div[class*="bg-emerald-50"] span[class*="bg-white"] {
        background-color: rgba(91, 228, 187, 0.3) !important;
      }

      /* ── Announcement panel ──────────────────────────────────────── */
      div[class*="border-slate-200"][class*="bg-white"] {
        border-color: #dbdbe5 !important;
      }
      /* Announcement icon bubble: black → brand light lavender + lilac icon */
      span[class*="bg-slate-900"],
      div[class*="bg-slate-900"] {
        background-color: #eee6fe !important;
        color: #5558b2 !important;
      }
      span[class*="text-slate-800"],
      div[class*="text-slate-800"] {
        color: #010507 !important;
      }
`;
