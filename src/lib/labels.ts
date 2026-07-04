import { supabase } from './supabase';
import type { ProductLabel } from './types';

export async function getProductLabels(): Promise<ProductLabel[]> {
  const { data, error } = await supabase
    .from('product_labels')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching labels:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    color: row.color,
    style: row.style || 'emboss',
    sortOrder: row.sort_order,
    active: row.active,
  }));
}

export async function createProductLabel(label: Omit<ProductLabel, 'id'>): Promise<ProductLabel | null> {
  const { data, error } = await supabase
    .from('product_labels')
    .insert({
      name: label.name,
      color: label.color,
      style: label.style || 'emboss',
      sort_order: label.sortOrder,
      active: label.active,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating label:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    color: data.color,
    style: data.style,
    sortOrder: data.sort_order,
    active: data.active,
  };
}

export async function updateProductLabel(
  id: string,
  updates: Partial<Omit<ProductLabel, 'id'>>
): Promise<ProductLabel | null> {
  const updateData: any = {};
  if (updates.name) updateData.name = updates.name;
  if (updates.color) updateData.color = updates.color;
  if (updates.style) updateData.style = updates.style;
  if (updates.sortOrder !== undefined) updateData.sort_order = updates.sortOrder;
  if (updates.active !== undefined) updateData.active = updates.active;

  const { data, error } = await supabase
    .from('product_labels')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating label:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    color: data.color,
    style: data.style,
    sortOrder: data.sort_order,
    active: data.active,
  };
}

export async function deleteProductLabel(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('product_labels')
    .update({ active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deleting label:', error);
    return false;
  }

  return true;
}

// Get labels for a specific product
export async function getProductLabelsForProduct(productId: string): Promise<ProductLabel[]> {
  const { data, error } = await supabase
    .from('product_label_assignments')
    .select('product_labels (*)')
    .eq('product_id', productId)
    .eq('product_labels.active', true);

  if (error) {
    console.error('Error fetching product labels:', error);
    return [];
  }

  return (data || [])
    .map((row: any) => row.product_labels)
    .filter(Boolean)
    .map((label: any) => ({
      id: label.id,
      name: label.name,
      color: label.color,
      style: label.style || 'emboss',
      sortOrder: label.sort_order,
      active: label.active,
    }));
}

// Assign label to product
export async function assignLabelToProduct(productId: string, labelId: string): Promise<boolean> {
  const { error } = await supabase
    .from('product_label_assignments')
    .insert({ product_id: productId, label_id: labelId });

  if (error) {
    console.error('Error assigning label:', error);
    return false;
  }

  return true;
}

// Remove label from product
export async function removeLabelFromProduct(productId: string, labelId: string): Promise<boolean> {
  const { error } = await supabase
    .from('product_label_assignments')
    .delete()
    .eq('product_id', productId)
    .eq('label_id', labelId);

  if (error) {
    console.error('Error removing label:', error);
    return false;
  }

  return true;
}
