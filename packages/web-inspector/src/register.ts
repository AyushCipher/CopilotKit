import { CpkMemoryList } from "./domains/learning/memory-list.js";
import {
  CpkThreadInspector,
  ɵCpkThreadDetails,
} from "./domains/threads/detail/thread-inspector.js";
import { CpkThreadList } from "./domains/threads/list/thread-list.js";
import { WebInspectorElement } from "./shell/web-inspector-element.js";
import {
  INSPECTOR_COPY_BUTTON_TAG,
  InspectorCopyButtonElement,
} from "./ui/copy-button/copy-button.js";
import {
  INSPECTOR_JSON_VIEWER_TAG,
  InspectorJsonViewerElement,
} from "./ui/json-viewer/json-viewer.js";

export const WEB_INSPECTOR_TAG = "cpk-web-inspector" as const;
export const THREAD_INSPECTOR_TAG = "cpk-thread-inspector" as const;

function defineElementOnce(
  registry: CustomElementRegistry,
  tag: string,
  ctor: CustomElementConstructor,
): void {
  if (!registry.get(tag)) registry.define(tag, ctor);
}

// Resolve the global registry at call time so an SSR import can be retried in
// a browser and pop-out windows can supply their own registry.
export function defineWebInspector(
  registry: CustomElementRegistry | undefined = globalThis.customElements,
): void {
  if (!registry) return;

  defineElementOnce(
    registry,
    INSPECTOR_COPY_BUTTON_TAG,
    InspectorCopyButtonElement,
  );
  defineElementOnce(
    registry,
    INSPECTOR_JSON_VIEWER_TAG,
    InspectorJsonViewerElement,
  );
  defineElementOnce(registry, "cpk-thread-list", CpkThreadList);
  defineElementOnce(registry, THREAD_INSPECTOR_TAG, CpkThreadInspector);
  defineElementOnce(registry, "cpk-thread-details", ɵCpkThreadDetails);
  defineElementOnce(registry, "cpk-memory-list", CpkMemoryList);
  defineElementOnce(registry, WEB_INSPECTOR_TAG, WebInspectorElement);
}
