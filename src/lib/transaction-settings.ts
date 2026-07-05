import { SUPABASE_KEYS } from "@/lib/constants";
import { readJson, writeJson } from "@/lib/store";
import type { TransactionSettings, ShippingConfig, TransactionFeeConfig } from "@/lib/types-settings";
import { DEFAULT_SETTINGS } from "@/lib/types-settings";

const SETTINGS_KEY = "transaction_settings";

export async function getTransactionSettings(): Promise<TransactionSettings> {
  try {
    const settings = await readJson<TransactionSettings>(SETTINGS_KEY, null);
    if (!settings) {
      return DEFAULT_SETTINGS;
    }
    return settings;
  } catch (error) {
    console.error("Failed to read transaction settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateShippingConfig(config: ShippingConfig): Promise<void> {
  const settings = await getTransactionSettings();
  settings.shipping = config;
  settings.lastUpdated = new Date().toISOString();
  await writeJson(SETTINGS_KEY, settings);
}

export async function updateTransactionFeeConfig(config: TransactionFeeConfig): Promise<void> {
  const settings = await getTransactionSettings();
  settings.transactionFee = config;
  settings.lastUpdated = new Date().toISOString();
  await writeJson(SETTINGS_KEY, settings);
}

export async function updateTransactionSettings(
  settings: TransactionSettings,
  updatedBy: string
): Promise<void> {
  settings.lastUpdated = new Date().toISOString();
  settings.updatedBy = updatedBy;
  await writeJson(SETTINGS_KEY, settings);
}
