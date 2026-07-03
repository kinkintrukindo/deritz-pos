"use client";

export function OrderDeleteButton({
  orderId,
  action,
}: {
  orderId: string;
  action: (formData: FormData) => Promise<void>;
}) {
  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm(`Delete order ${orderId}? This cannot be undone.`)) {
      e.preventDefault();
      return;
    }
    const formData = new FormData(e.currentTarget);
    await action(formData);
  }

  return (
    <form onSubmit={handleDelete}>
      <button className="text-xs tracking-wide-label uppercase text-graphite hover:text-red-600 underline">
        Delete Order
      </button>
    </form>
  );
}
