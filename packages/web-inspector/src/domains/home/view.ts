import { html, nothing } from "lit";
import type { TemplateResult } from "lit";
import type { DirectiveResult } from "lit/directive.js";

import type {
  HomeHeroAction,
  HomeModel,
  HomeRuntimeHealthTone,
} from "./model.js";

export type HomeViewActions = Readonly<{
  openHeroAction: (action: HomeHeroAction) => void;
  openLastEvent: (eventId: string, agentId?: string) => void;
}>;

export type HomeViewOptions = Readonly<{
  announcementPreview?: TemplateResult | typeof nothing;
  appendRefParam: (href: string, ref: string) => string;
  renderIcon: (
    name: "ArrowRight" | "ArrowUpRight",
  ) => TemplateResult | DirectiveResult | typeof nothing;
}>;

function formatTimestamp(timestamp: number): string {
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

function formatRelativeTimestamp(timestamp: number): string {
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

function renderIntelligence(
  model: HomeModel,
  actions: HomeViewActions,
  options: HomeViewOptions,
) {
  const project = model.project;
  const connected = model.hero.connection === "connected";
  const action = model.hero.action;
  const renewing = action?.kind === "renew";
  const renderAction = (value: HomeHeroAction, className: string) => html`
    <a
      class=${className}
      data-inspector-home-intelligence-action=${value.kind}
      href=${value.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="${value.label} (opens in a new tab)"
      @click=${() => actions.openHeroAction(value)}
    >
      ${value.label} ${options.renderIcon("ArrowUpRight")}
    </a>
  `;
  return html`
    <section
      class="inspector-home-section inspector-intelligence-hud"
      data-inspector-home-card="intelligence"
      data-state=${connected ? "connected" : "disconnected"}
      aria-label="Intelligence ${
        connected ? "connected" : renewing ? "plan expired" : "not enabled"
      }"
    >
      <header class="inspector-intelligence-hud-header">
        <div class="inspector-intelligence-hud-heading">
          <h2 class="inspector-home-section-title">
            ${connected ? "Intelligence" : model.hero.title}
          </h2>
          ${
            connected
              ? nothing
              : html`<p class="inspector-intelligence-hud-description">
                ${model.hero.body}
              </p>`
          }
        </div>
        <div class="inspector-intelligence-hud-header-actions">
          ${
            connected || renewing
              ? html`<span
                class="inspector-intelligence-hud-state"
                data-tone=${connected ? "success" : "checking"}
              >
                <span aria-hidden="true"></span>
                ${connected ? "Connected" : "Plan expired"}
              </span>`
              : nothing
          }
          ${
            !connected && action
              ? renderAction(
                  action,
                  "inspector-intelligence-hud-action inspector-intelligence-hud-connect-action",
                )
              : nothing
          }
        </div>
      </header>
      ${
        connected
          ? html`<div
            class="inspector-intelligence-hud-details"
            role="group"
            aria-label="Intelligence account details"
          >
            <section
              class="inspector-intelligence-hud-project"
              data-inspector-metadata=${
                model.projectLinked && project ? "identity" : nothing
              }
              aria-label=${
                model.projectLinked && project
                  ? "Inspector account details"
                  : nothing
              }
            >
              <span class="inspector-intelligence-hud-detail-label">Project</span>
              <strong class="inspector-intelligence-hud-detail-value">
                ${
                  model.projectLinked && project
                    ? html`<span>${project.projectName}</span>`
                    : "Not linked"
                }
              </strong>
              ${
                model.projectLinked && project
                  ? html`<span class="inspector-intelligence-hud-detail-subvalue">
                    ${project.organizationName}
                  </span>`
                  : nothing
              }
            </section>
            <section class="inspector-intelligence-hud-plan">
              <div class="inspector-intelligence-hud-plan-summary">
                <span class="inspector-intelligence-hud-detail-label">Plan</span>
                <strong class="inspector-intelligence-hud-detail-value">
                  ${
                    project?.planLabel
                      ? html`<span data-inspector-metadata="plan"
                        >${project.planLabel}</span
                      >`
                      : "No plan"
                  }
                </strong>
                ${
                  project
                    ? html`<span
                      class="inspector-intelligence-hud-detail-subvalue"
                    >
                      License ${project.license}
                    </span>`
                    : nothing
                }
                ${
                  action
                    ? renderAction(
                        action,
                        "inspector-intelligence-hud-action inspector-intelligence-hud-plan-action",
                      )
                    : nothing
                }
              </div>
              <div
                class="inspector-intelligence-hud-usage"
                role="group"
                aria-label="Threads usage"
              >
                <span class="inspector-intelligence-hud-detail-label"
                  >Threads usage</span
                >
                <strong class="inspector-intelligence-hud-detail-value">
                  ${project?.usage?.limitLabel ?? "Unavailable"}
                </strong>
                ${
                  project?.usage?.ratio !== undefined
                    ? html`<span class="inspector-home-usage-bar" aria-hidden="true"
                      ><span
                        style="width:${Math.min(
                          100,
                          Math.round(project.usage.ratio * 100),
                        )}%"
                      ></span
                    ></span>`
                    : nothing
                }
              </div>
            </section>
          </div>`
          : nothing
      }
    </section>
  `;
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
  return html`
    <section
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
    </section>
  `;
}

function renderFeatures(model: HomeModel, options: HomeViewOptions) {
  const enabled = model.services.filter((service) => service.enabled);
  const disabled = model.services.filter((service) => !service.enabled);
  const renderService = (service: HomeModel["services"][number]) => html`
    <a
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
    </a>
  `;
  const renderGroup = (
    state: "active" | "available",
    services: HomeModel["services"],
  ) => html`
    <section
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
    </section>
  `;
  return html`
    <section
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
            ${renderGroup("active", enabled)}${renderGroup(
              "available",
              disabled,
            )}
          </div>`
      }
    </section>
  `;
}

export function renderHomeView(
  model: HomeModel,
  actions: HomeViewActions,
  options: HomeViewOptions,
) {
  return html`
    <div
      class="inspector-home"
      data-inspector-home
      data-inspector-home-state=${model.hero.connection}
    >
      ${options.announcementPreview ?? nothing}
      ${renderSystemHealth(model, actions)}
      ${renderIntelligence(model, actions, options)}
      ${renderFeatures(model, options)}
    </div>
  `;
}
