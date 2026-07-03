import { verifyPasscode } from "@/app/admin/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-6 py-28">
      <p className="text-xs tracking-wide-label uppercase text-graphite mb-3 text-center">
        De Ritz Atelier
      </p>
      <h1 className="text-3xl font-medium tracking-tight text-ink mb-8 text-center">Staff Access</h1>

      <form action={verifyPasscode} className="space-y-4">
        <input
          type="password"
          name="passcode"
          placeholder="Passcode"
          autoFocus
          className="w-full border border-mist px-4 py-3 text-center text-lg tracking-[0.3em] bg-paper focus:outline-none focus:border-ink"
        />
        {error && (
          <p className="text-xs text-red-600 text-center">Incorrect passcode. Try again.</p>
        )}
        <button
          type="submit"
          className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-3.5 hover:bg-gold transition-colors"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
