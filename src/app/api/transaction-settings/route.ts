import { getTransactionSettings } from "@/lib/transaction-settings";

export async function GET() {
  try {
    const settings = await getTransactionSettings();
    return Response.json(settings);
  } catch (error) {
    console.error("Failed to fetch transaction settings:", error);
    return Response.json(
      { error: "Failed to fetch transaction settings" },
      { status: 500 }
    );
  }
}
