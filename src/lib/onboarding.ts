const KEY = "liveplace:onboarded";

export function hasOnboarded() {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return true;
  }
}

export function completeOnboarding(name?: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, "1");
    if (name) window.localStorage.setItem("liveplace:name", name);
  } catch {
    /* storage unavailable */
  }
}
