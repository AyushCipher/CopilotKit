import { trackHomeCtaClicked, trackHomeViewed } from "../../lib/telemetry.js";
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
