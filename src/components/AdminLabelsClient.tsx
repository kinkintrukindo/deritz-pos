'use client';

import { useState } from 'react';
import type { ProductLabel } from '@/lib/types';

interface AdminLabelsClientProps {
  initialLabels: ProductLabel[];
}

export function AdminLabelsClient({ initialLabels }: AdminLabelsClientProps) {
  const [labels, setLabels] = useState<ProductLabel[]>(initialLabels);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', color: '#000000' });
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!formData.name.trim()) {
      alert('Label name is required');
      return;
    }

    setLoading(true);
    try {
      if (editing) {
        // Update existing label
        const res = await fetch('/api/admin/labels', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editing,
            name: formData.name.trim(),
            color: formData.color,
          }),
        });

        if (!res.ok) throw new Error('Failed to update label');
        const updated = await res.json();

        setLabels(labels.map(l => l.id === editing ? updated : l));
        setEditing(null);
      } else {
        // Create new label
        const res = await fetch('/api/admin/labels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            color: formData.color,
            sortOrder: labels.length,
          }),
        });

        if (!res.ok) throw new Error('Failed to create label');
        const newLabel = await res.json();

        setLabels([...labels, newLabel]);
        setShowForm(false);
      }

      setFormData({ name: '', color: '#000000' });
    } catch (error) {
      console.error('Error saving label:', error);
      alert('Failed to save label');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this label?')) return;

    try {
      const res = await fetch(`/api/admin/labels/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete label');

      setLabels(labels.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting label:', error);
      alert('Failed to delete label');
    }
  }

  function startEdit(label: ProductLabel) {
    setEditing(label.id);
    setFormData({ name: label.name, color: label.color });
    setShowForm(true);
  }

  function cancelEdit() {
    setEditing(null);
    setShowForm(false);
    setFormData({ name: '', color: '#000000' });
  }

  return (
    <div className="space-y-6">
      {/* Labels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {labels.map(label => (
          <div key={label.id} className="border border-mist p-4 bg-paper">
            <div className="flex items-center justify-between mb-3">
              <span
                className="inline-block px-3 py-1 text-xs font-medium text-white rounded"
                style={{
                  backgroundColor: label.color,
                  fontFamily: 'var(--font-trajan)',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.3), -1px -1px 0 rgba(255,255,255,0.3)',
                }}
              >
                {label.name}
              </span>
              <span className="text-xs text-graphite">{label.color}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => startEdit(label)}
                className="flex-1 text-xs tracking-wide-label uppercase px-2 py-1 border border-ink text-ink hover:bg-ink hover:text-white transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(label.id)}
                className="flex-1 text-xs tracking-wide-label uppercase px-2 py-1 border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Add New Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="border-2 border-dashed border-mist p-4 bg-paper hover:border-ink transition-colors text-center"
          >
            <p className="text-sm font-medium text-graphite hover:text-ink">+ Add Label</p>
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="border border-mist p-6 bg-paper max-w-md">
          <h3 className="font-medium text-ink mb-4">
            {editing ? 'Edit Label' : 'New Label'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs tracking-wide-label uppercase text-graphite mb-2">
                Label Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., New, Sale, Featured"
                className="w-full px-3 py-2 border border-mist text-sm focus:outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="block text-xs tracking-wide-label uppercase text-graphite mb-2">
                Color
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-10 border border-mist cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-mist text-sm focus:outline-none focus:border-ink font-mono"
                />
              </div>
            </div>

            <div>
              <p className="text-xs text-graphite mb-2">Preview:</p>
              <span
                className="inline-block px-3 py-1 text-xs font-medium text-white rounded"
                style={{
                  backgroundColor: formData.color,
                  fontFamily: 'var(--font-trajan)',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.3), -1px -1px 0 rgba(255,255,255,0.3)',
                }}
              >
                {formData.name || 'Preview'}
              </span>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={cancelEdit}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-mist text-ink hover:bg-surface transition-colors disabled:opacity-50 text-xs tracking-wide-label uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-ink text-white hover:bg-graphite transition-colors disabled:opacity-50 text-xs tracking-wide-label uppercase"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
