'use client';

import { useState, useEffect } from 'react';
import type { ProductLabel } from '@/lib/types';

interface ProductLabelSelectorProps {
  defaultLabelIds?: string[];
  onChange?: (labelIds: string[]) => void;
}

export function ProductLabelSelector({
  defaultLabelIds = [],
  onChange,
}: ProductLabelSelectorProps) {
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultLabelIds);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLabels() {
      try {
        const res = await fetch('/api/admin/labels/available');
        if (!res.ok) throw new Error('Failed to load labels');
        const data = await res.json();
        setLabels(data);
      } catch (error) {
        console.error('Error loading labels:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLabels();
  }, []);

  function toggleLabel(labelId: string) {
    const newIds = selectedIds.includes(labelId)
      ? selectedIds.filter(id => id !== labelId)
      : [...selectedIds, labelId];

    setSelectedIds(newIds);
    onChange?.(newIds);
  }

  if (loading) {
    return <p className="text-xs text-graphite">Loading labels...</p>;
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs tracking-wide-label uppercase text-graphite">
        Product Labels
      </label>

      {labels.length === 0 ? (
        <p className="text-xs text-graphite italic">No labels available</p>
      ) : (
        <div className="space-y-2">
          {labels.map(label => (
            <label key={label.id} className="flex items-center gap-3 text-sm text-graphite">
              <input
                type="checkbox"
                checked={selectedIds.includes(label.id)}
                onChange={() => toggleLabel(label.id)}
              />
              <span
                className="inline-block px-2 py-1 text-xs font-medium text-white rounded"
                style={{
                  backgroundColor: label.color,
                  fontFamily: 'var(--font-trajan)',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.3), -1px -1px 0 rgba(255,255,255,0.3)',
                }}
              >
                {label.name}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* Hidden input to submit selected IDs */}
      <input type="hidden" name="labelIds" value={selectedIds.join(',')} />
    </div>
  );
}
