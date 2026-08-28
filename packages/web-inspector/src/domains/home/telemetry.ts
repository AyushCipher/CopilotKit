import {
  trackHomeCtaClicked,
  trackHomePromptCopied,
  trackHomeStoryBeatSelected,
  trackHomeViewed,
} from "../../shared/telemetry/privacy.js";
import type {
  IntelligencePromptCopyOutcome,
  IntelligenceStoryBeat,
} from "./intelligence-state.js";
import type { HomeHeroAction } from "./model.js";

export function trackHomeView(telemetryDisabled: boolean): void {
  if (!telemetryDisabled) trackHomeViewed();
}

export function trackHomeAction(
  action: HomeHeroAction,
  telemetryDisabled: boolean,
): void {
  if (!telemetryDisabled) {
    trackHomeCtaClicked({ action_kind: action.kind });
  }
}

export function trackHomePromptCopy(
  runId: string,
  outcome: IntelligencePromptCopyOutcome,
  telemetryDisabled: boolean,
): void {
  if (!telemetryDisabled) {
    trackHomePromptCopied({ onboarding_run_id: runId, outcome });
  }
}

export function trackHomeStorySelection(
  beat: IntelligenceStoryBeat,
  index: number,
  telemetryDisabled: boolean,
): void {
  if (!telemetryDisabled) {
    trackHomeStoryBeatSelected({ beat: beat.id, beat_index: index });
  }
}
