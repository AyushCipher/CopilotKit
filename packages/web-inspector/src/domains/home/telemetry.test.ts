import { beforeEach, describe, expect, it, vi } from "vitest";

const telemetry = vi.hoisted(() => ({
  action: vi.fn(),
  viewed: vi.fn(),
}));

vi.mock("../../shared/telemetry/privacy.js", () => ({
  trackHomeCtaClicked: telemetry.action,
  trackHomeViewed: telemetry.viewed,
}));

import { trackHomeAction, trackHomeView } from "./telemetry.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Home telemetry", () => {
  it("preserves the Home event calls", () => {
    trackHomeView(false);
    trackHomeAction(
      {
        kind: "manage_plan",
        url: "https://cloud.copilotkit.ai/settings/billing",
        label: "Manage plan",
      },
      false,
    );

    expect(telemetry.viewed).toHaveBeenCalledOnce();
    expect(telemetry.action).toHaveBeenCalledWith({
      action_kind: "manage_plan",
    });
  });

  it("does not emit after telemetry opt-out", () => {
    trackHomeView(true);
    trackHomeAction(
      {
        kind: "renew",
        url: "https://cloud.copilotkit.ai/settings/billing",
        label: "Renew plan",
      },
      true,
    );

    expect(telemetry.viewed).not.toHaveBeenCalled();
    expect(telemetry.action).not.toHaveBeenCalled();
  });
});
