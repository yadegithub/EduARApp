import { Haptics, ImpactStyle } from "@capacitor/haptics";

const runSafely = async (callback: () => Promise<void>) => {
  try {
    await callback();
  } catch {
    // Ignore unsupported platforms so web and emulator flows stay smooth.
  }
};

export const triggerSelectionHaptic = async (enabled: boolean) => {
  if (!enabled) {
    return;
  }

  await runSafely(() => Haptics.selectionChanged());
};

export const triggerImpactHaptic = async (
  enabled: boolean,
  style: ImpactStyle = ImpactStyle.Light,
) => {
  if (!enabled) {
    return;
  }

  await runSafely(() => Haptics.impact({ style }));
};
