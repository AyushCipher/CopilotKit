import { html, nothing } from "lit";
import type { TemplateResult } from "lit";
import type { DirectiveResult } from "lit/directive.js";

import { renderHomeIntelligence } from "./intelligence-view.js";
import type {
  HomeIntelligenceIconName,
  HomeIntelligenceViewActions,
  HomeIntelligenceViewOptions,
} from "./intelligence-view.js";
import type { HomeModel, HomeRuntimeHealthTone } from "./model.js";

export type HomeViewActions = HomeIntelligenceViewActions &
  Readonly<{
    openLastEvent: (eventId: string, agentId?: string) => void;
  }>;

export type HomeViewOptions = HomeIntelligenceViewOptions &
  Readonly<{
    announcementPreview?: TemplateResult | typeof nothing;
    appendRefParam: (href: string, ref: string) => string;
    renderIcon: (
      name: HomeIntelligenceIconName,
    ) => TemplateResult | DirectiveResult | typeof nothing;
  }>;

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
  return `${date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })}.${milliseconds}`;
}

function formatRelativeTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  const elapsedSeconds = Math.max(
    1,
    Math.floor((Date.now() - date.getTime()) / 1_000),
  );
  if (elapsedSeconds < 60) {
    return `${elapsedSeconds} ${elapsedSeconds === 1 ? "second" : "seconds"} ago`;
  }
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  return `${elapsedMinutes} ${elapsedMinutes === 1 ? "minute" : "minutes"} ago`;
}

function renderSystemHealth(model: HomeModel, actions: HomeViewActions) {
  const runtime = model.runtime;
  const health = runtime.health;
  const runtimeDetail = runtime.url ?? "Runtime URL not configured";
  const connectionDetail =
    health.liveUpdates.tone === "success"
      ? "New events will appear here."
      : health.lastEvent.timestamp !== undefined
        ? `Last activity at ${formatTimestamp(health.lastEvent.timestamp)}`
        : "Waiting for a connection";
  const signals: Array<{
    id: "runtime" | "connection" | "last-event";
    label: string;
    value: string;
    detail: string;
    tone: HomeRuntimeHealthTone;
    eventId?: string;
    agentId?: string;
  }> = [
    {
      id: "runtime",
      label: "Runtime",
      value: health.runtime.label,
      detail: runtimeDetail,
      tone: health.runtime.tone,
    },
    {
      id: "connection",
      label: "Live updates",
      value: health.liveUpdates.label,
      detail: connectionDetail,
      tone: health.liveUpdates.tone,
    },
    {
      id: "last-event",
      label: "Recent activity",
      value: health.lastEvent.type ?? health.lastEvent.label,
      detail:
        health.lastEvent.timestamp === undefined
          ? "Waiting for an agent to run."
          : formatRelativeTimestamp(health.lastEvent.timestamp),
      tone: health.lastEvent.tone,
      eventId: health.lastEvent.id,
      agentId: health.lastEvent.agentId,
    },
  ];

  return html`<section
    class="inspector-home-section inspector-system-health-section"
    data-inspector-home-band="health"
  >
    <header
      class="inspector-home-section-header inspector-system-health-header"
    >
      <div class="inspector-system-health-heading">
        <h1 class="inspector-home-section-title">System Health</h1>
      </div>
      <span
        class="inspector-system-health-state"
        data-tone=${health.state === "healthy" ? "success" : health.state}
      >
        <span aria-hidden="true"></span>${health.label}
      </span>
    </header>
    <dl
      class="inspector-system-health"
      aria-label="System Health"
      data-inspector-home-card="runtime"
      data-health-state=${health.state}
    >
      ${signals.map(
        (signal) => html`<div
          class="inspector-system-health-signal"
          data-runtime-health-signal=${signal.id}
          data-tone=${signal.tone}
        >
          <span class="inspector-system-health-copy">
            <dt>${signal.label}</dt>
            <dd title=${signal.value}>
              ${
                signal.eventId
                  ? html`<button
                    type="button"
                    class="inspector-system-health-event-link"
                    aria-label="View ${signal.value.toLowerCase()} in AG-UI Events"
                    @click=${() => {
                      if (signal.eventId) {
                        actions.openLastEvent(signal.eventId, signal.agentId);
                      }
                    }}
                  >
                    <span class="inspector-system-health-event-type"
                      >${signal.value}</span
                    >
                    <small class="inspector-system-health-event-meta">
                      <span>${signal.detail}</span>
                      <strong>View event</strong>
                    </small>
                  </button>`
                  : signal.value
              }
            </dd>
            ${
              signal.eventId
                ? nothing
                : signal.id === "runtime"
                  ? html`<small
                    class="inspector-system-health-url"
                    data-full-value=${runtime.url ?? signal.detail}
                    aria-label=${signal.detail}
                    title=${signal.detail}
                    tabindex="0"
                  >
                    <span>${signal.detail}</span>
                  </small>`
                  : html`<small
                    class="inspector-system-health-detail"
                    title=${signal.detail}
                    >${signal.detail}</small
                  >`
            }
          </span>
        </div>`,
      )}
    </dl>
  </section>`;
}

function renderFeatures(model: HomeModel, options: HomeViewOptions) {
  const enabled = model.services.filter((service) => service.enabled);
  const disabled = model.services.filter((service) => !service.enabled);
  const renderService = (service: HomeModel["services"][number]) => html`<a
    class="inspector-home-feature"
    data-inspector-service=${service.id}
    data-state=${service.enabled ? "on" : "off"}
    href=${options.appendRefParam(service.docsUrl, "cpk-inspector-home")}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Learn more about ${service.label}, currently ${
      service.enabled ? "on" : "off"
    }"
  >
    <span>${service.label}</span><small
      >${service.enabled ? "On" : "Off"}</small
    >
    <span class="inspector-home-feature-arrow" aria-hidden="true">
      ${options.renderIcon("ArrowUpRight")}
    </span>
  </a>`;
  const renderGroup = (
    state: "active" | "available",
    services: HomeModel["services"],
  ) => html`<section
    class="inspector-home-feature-group"
    data-feature-state-group=${state}
    aria-label="${state === "active" ? "Active" : "Available"} features"
  >
    <header class="inspector-home-feature-group-header">
      <strong>${state === "active" ? "Active" : "Available"}</strong>
      <span>${services.length}</span>
    </header>
    <div class="inspector-home-feature-list">
      ${
        services.length > 0
          ? services.map(renderService)
          : html`<p class="inspector-home-feature-group-empty">
            ${state === "active" ? "None enabled" : "Everything is active"}
          </p>`
      }
    </div>
  </section>`;

  return html`<section
    class="inspector-home-section inspector-home-features"
    data-inspector-home-card="services"
  >
    <header class="inspector-home-section-header">
      <h2 class="inspector-home-section-title">Features</h2>
      <span>${enabled.length} active, ${disabled.length} off</span>
    </header>
    ${
      model.services.length === 0
        ? html`
            <p class="inspector-home-features-empty">
              Feature availability is unavailable for this runtime.
            </p>
          `
        : html`<div class="inspector-home-feature-groups">
          ${renderGroup("active", enabled)}${renderGroup("available", disabled)}
        </div>`
    }
  </section>`;
}

export function renderHomeView(
  model: HomeModel,
  actions: HomeViewActions,
  options: HomeViewOptions,
) {
  return html`<div
    class="inspector-home"
    data-inspector-home
    data-inspector-home-state=${model.hero.connection}
  >
    ${options.announcementPreview ?? nothing}
    ${renderSystemHealth(model, actions)}
    ${renderHomeIntelligence(model, actions, options)}
    ${renderFeatures(model, options)}
  </div>`;
}
