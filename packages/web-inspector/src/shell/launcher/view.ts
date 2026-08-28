import { html, nothing } from "lit";
import type { TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";

import inspectorLogoKiteUrl from "../../assets/inspector-logo-kite.svg";
import type { InspectorColorScheme } from "../contracts.js";
import { LAUNCHER_SIGNAL_COLORS } from "../styles.js";
import type { LauncherController } from "./controller.js";
import {
  ERROR_GESTURE_MS,
  HUD_COPY,
  LAUNCHER_BASE_LABEL,
  LAUNCHER_HUD_INTRO_MS,
  LAUNCHER_SIGNALS,
  NEWS_SIGNAL_ID,
  PILL_SUBLINE_LABEL,
} from "./model.js";
import type { LauncherHudRowId } from "./model.js";

export type LauncherHudAvailability = Readonly<{
  threads: boolean;
  intelligence: boolean;
  learning: boolean;
}>;

export type LauncherViewOptions = Readonly<{
  controller: LauncherController;
  colorScheme: InspectorColorScheme;
  isDragging: boolean;
  pointerContextIsButton: boolean;
  getHudAvailability: () => LauncherHudAvailability;
  onPointerDown: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
  onPointerUp: (event: PointerEvent) => void;
  onPointerCancel: (event: PointerEvent) => void;
  onClick: (event: Event) => void;
}>;

export function renderLauncherView(
  options: LauncherViewOptions,
): TemplateResult {
  // Tailwind scan tokens retained for generated-sheet stability: ease-in-out
  // ease-out
  const { controller } = options;
  const { state } = controller;
  const activeSignal = controller.activeSignal;
  const signal = activeSignal ? LAUNCHER_SIGNALS[activeSignal] : null;
  const signalStyles = signal
    ? {
        "--cpk-launcher-signal": LAUNCHER_SIGNAL_COLORS[signal.tone],
        "--cpk-launcher-cadence": `${signal.cadence}ms`,
      }
    : {};
  const buttonClasses = [
    "console-button",
    "group",
    "relative",
    "pointer-events-auto",
    "inline-flex",
    "h-9",
    "w-9",
    "items-center",
    "justify-center",
    "rounded-full",
    "border",
    "text-xs",
    "font-medium",
    "text-white",
    "focus-visible:outline",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-[#BEC2FF]",
    "touch-none",
    "select-none",
    options.isDragging ? "cursor-grabbing" : "cursor-pointer",
  ].join(" ");

  return html`
    <div
      class="console-button-wrapper"
      data-cpk-hud=${state.hudOpen ? "open" : "closed"}
      @pointerenter=${controller.handleHudEnter}
      @pointerleave=${controller.handleHudLeave}
      @focusin=${controller.handleHudFocusIn}
      @focusout=${controller.handleHudFocusOut}
      @keydown=${controller.handleHudKeydown}
    >
      ${renderLauncherPill(controller)}
      <button
        class=${buttonClasses}
        type="button"
        aria-expanded=${state.hudOpen ? "true" : "false"}
        aria-controls=${state.hudOpen ? "cpk-launcher-hud" : nothing}
        aria-label=${
          signal?.tone === "error"
            ? `${LAUNCHER_BASE_LABEL}, ${signal.accessibleLabel}`
            : activeSignal === NEWS_SIGNAL_ID
              ? `${LAUNCHER_BASE_LABEL}, What's new unread`
              : LAUNCHER_BASE_LABEL
        }
        title=${
          activeSignal === NEWS_SIGNAL_ID ? "What's new — unread" : nothing
        }
        data-drag-context="button"
        data-cpk-signal=${signal ? signal.tone : nothing}
        data-cpk-signal-pulsing=${
          activeSignal !== null && state.pulsingSignal === activeSignal
            ? "true"
            : nothing
        }
        style=${styleMap(signalStyles)}
        data-dragging=${
          options.isDragging && options.pointerContextIsButton
            ? "true"
            : "false"
        }
        @pointerdown=${options.onPointerDown}
        @pointermove=${options.onPointerMove}
        @pointerup=${options.onPointerUp}
        @pointercancel=${options.onPointerCancel}
        @click=${options.onClick}
      >
        <img
          src=${inspectorLogoKiteUrl}
          alt="Inspector logo"
          class="cpk-launcher-mark h-6 w-auto"
          loading="lazy"
        />
        ${
          activeSignal !== null
            ? html`<span
                class="cpk-launcher-signal-wash"
                aria-hidden="true"
              ></span>
              <span
                class="cpk-launcher-signal-dot"
                data-cpk-signal-dot=${activeSignal}
                aria-hidden="true"
              ></span>`
            : nothing
        }
      </button>
      <span
        class="sr-only"
        data-cpk-launcher-announcement
        role="status"
        aria-live="polite"
        >${controller.gestureLabel ?? ""}</span
      >
      ${renderLauncherHud(options)}
    </div>
  `;
}

function renderLauncherPill(
  controller: LauncherController,
): TemplateResult | typeof nothing {
  const { state } = controller;
  const key = state.gestureSignal;
  if (key === null || state.pillPhase === null) return nothing;
  const signal = LAUNCHER_SIGNALS[key];
  const label = signal.pillLabel;
  if (label === undefined) return nothing;
  return html`
    <span
      class="cpk-launcher-pill"
      data-cpk-launcher-pill=${key}
      data-cpk-pill-phase=${state.pillPhase}
      data-cpk-pill-direction=${state.pillDirection ?? "left"}
      style=${styleMap({
        "--cpk-launcher-signal": LAUNCHER_SIGNAL_COLORS[signal.tone],
        "--cpk-launcher-pill-open": `${ERROR_GESTURE_MS.open}ms`,
        "--cpk-launcher-pill-close": `${ERROR_GESTURE_MS.close}ms`,
      })}
      aria-hidden="true"
      @click=${controller.handlePillClick}
    >
      <span class="cpk-launcher-pill__heading" data-cpk-pill-heading
        >${label}</span
      >
      <span class="cpk-launcher-pill__subline" data-cpk-pill-subline
        >${PILL_SUBLINE_LABEL}</span
      >
    </span>
  `;
}

function renderHudCheck(): TemplateResult {
  return html`
    <svg
      class="cpk-launcher-hud__check"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      data-cpk-hud-check
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 8.5 6.5 12 13 4.5"
      />
    </svg>
  `;
}

function renderHudRow(
  controller: LauncherController,
  args: Readonly<{
    id: LauncherHudRowId;
    label: string;
    detail: string;
    connected?: boolean;
    introIndex: number;
  }>,
): TemplateResult {
  const helpOpen = controller.state.hudHelp === args.id;
  const detailId = `cpk-hud-detail-${args.id}`;
  return html`
    <li
      class="cpk-launcher-hud__row"
      data-cpk-hud-row=${args.id}
      data-cpk-hud-help=${helpOpen ? "open" : nothing}
      style=${styleMap({
        "--cpk-hud-row-index": `${args.introIndex}`,
        "--cpk-hud-row-delay": `${
          LAUNCHER_HUD_INTRO_MS.rowStart +
          args.introIndex * LAUNCHER_HUD_INTRO_MS.rowStagger
        }ms`,
      })}
      @click=${(event: Event) => controller.handleHudRowClick(event, args.id)}
    >
      <button
        type="button"
        class="cpk-launcher-hud__action"
        data-cpk-hud-action
        aria-describedby=${detailId}
        @click=${(event: Event) =>
          controller.handleHudActionClick(event, args.id)}
        @pointerdown=${(event: Event) => event.stopPropagation()}
      >
        ${args.connected ? renderHudCheck() : nothing}${args.label}
      </button>
      <button
        type="button"
        class="cpk-launcher-hud__help"
        aria-expanded=${helpOpen ? "true" : "false"}
        aria-controls=${detailId}
        aria-label=${`About ${args.label}`}
        @click=${(event: Event) =>
          controller.handleHudHelpClick(event, args.id)}
        @pointerdown=${(event: Event) => event.stopPropagation()}
      >
        <span aria-hidden="true">?</span>
      </button>
      <p class="cpk-launcher-hud__detail" id=${detailId}>${args.detail}</p>
    </li>
  `;
}

function renderLauncherHud(
  options: LauncherViewOptions,
): TemplateResult | typeof nothing {
  const { controller } = options;
  const { state } = controller;
  if (!state.hudOpen) return nothing;
  const availability = options.getHudAvailability();
  return html`
    <div
      class="cpk-launcher-hud"
      id="cpk-launcher-hud"
      data-cpk-launcher-hud
      data-cpk-hud-side=${state.hudSide}
      data-cpk-hud-intro=${state.hudIntro ? "true" : nothing}
      data-color-scheme=${options.colorScheme}
      style=${styleMap({
        "--cpk-launcher-hud-intro-duration": `${LAUNCHER_HUD_INTRO_MS.duration}ms`,
        "--cpk-launcher-hud-row-duration": `${LAUNCHER_HUD_INTRO_MS.rowDuration}ms`,
      })}
    >
      <span class="cpk-launcher-hud__arrow" aria-hidden="true"></span>
      <div class="cpk-launcher-hud__card">
        <ul class="cpk-launcher-hud__list" role="list">
          ${renderHudRow(controller, {
            id: "inspector",
            label: HUD_COPY.inspector.label,
            detail: HUD_COPY.inspector.detail,
            introIndex: 0,
          })}
        </ul>
        <ul class="cpk-launcher-hud__list" role="list">
          ${renderHudRow(controller, {
            id: "threads",
            label: availability.threads
              ? HUD_COPY.threads.onLabel
              : HUD_COPY.threads.offLabel,
            detail: availability.threads
              ? HUD_COPY.threads.onDetail
              : HUD_COPY.threads.offDetail,
            connected: availability.threads,
            introIndex: 1,
          })}
          ${renderHudRow(controller, {
            id: "intelligence",
            label: availability.intelligence
              ? HUD_COPY.intelligence.onLabel
              : HUD_COPY.intelligence.offLabel,
            detail: availability.intelligence
              ? HUD_COPY.intelligence.onDetail
              : HUD_COPY.intelligence.offDetail,
            connected: availability.intelligence,
            introIndex: 2,
          })}
          ${renderHudRow(controller, {
            id: "learning",
            label: availability.learning
              ? HUD_COPY.learning.onLabel
              : HUD_COPY.learning.offLabel,
            detail: availability.learning
              ? HUD_COPY.learning.onDetail
              : HUD_COPY.learning.offDetail,
            connected: availability.learning,
            introIndex: 3,
          })}
        </ul>
      </div>
    </div>
  `;
}
