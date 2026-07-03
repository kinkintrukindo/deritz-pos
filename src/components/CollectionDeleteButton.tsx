"use client";

import { deleteCollectionAction } from "@/app/admin/actions";

export function CollectionDeleteButton({
  collectionId,
  collectionName,
}: {
  collectionId: string;
  collectionName: string;
}) {
  return (
    <form action={deleteCollectionAction.bind(null, collectionId)}>
      <button
        type="submit"
        className="text-xs tracking-wide-label uppercase text-graphite hover:text-red-600 underline"
        onClick={(e) => {
          if (
            !confirm(
              `Delete "${collectionName}"? Products in this collection will still exist but be unorganized.`
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        Delete
      </button>
    </form>
  );
}
