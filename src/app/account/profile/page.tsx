'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    address: '',
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 lg:px-10 py-24 text-center">
        <p className="text-graphite">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Save profile data to backend
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 lg:px-10 py-16">
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/account/profile"
          className="text-lg font-medium text-ink hover:text-gold transition-colors"
        >
          Profile
        </Link>
        <span className="text-graphite">/</span>
        <Link
          href="/account/orders"
          className="text-lg font-medium text-graphite hover:text-ink transition-colors"
        >
          Orders
        </Link>
      </div>

      <div className="border border-mist p-8 space-y-6">
        <h1 className="text-3xl font-medium tracking-tight text-ink">Your Profile</h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-xs tracking-wide-label uppercase text-graphite mb-2">
              Profile Picture
            </label>
            <div className="flex items-end gap-4">
              <div className="relative w-20 h-20 bg-surface rounded overflow-hidden">
                {profilePicture ? (
                  <Image
                    src={profilePicture}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-graphite text-xs">
                    No image
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="text-xs"
              />
            </div>
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-xs tracking-wide-label uppercase text-graphite mb-1">
              Email
            </label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full border border-mist px-3 py-2.5 text-sm bg-surface opacity-60"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs tracking-wide-label uppercase text-graphite mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="w-full border border-mist px-3 py-2.5 text-sm focus:outline-none focus:border-ink"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs tracking-wide-label uppercase text-graphite mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full border border-mist px-3 py-2.5 text-sm focus:outline-none focus:border-ink"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs tracking-wide-label uppercase text-graphite mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full border border-mist px-3 py-2.5 text-sm focus:outline-none focus:border-ink bg-white"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-xs tracking-wide-label uppercase text-graphite mb-1">
              Marital Status
            </label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              className="w-full border border-mist px-3 py-2.5 text-sm focus:outline-none focus:border-ink bg-white"
            >
              <option value="">Select marital status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs tracking-wide-label uppercase text-graphite mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your full address"
              rows={3}
              className="w-full border border-mist px-3 py-2.5 text-sm focus:outline-none focus:border-ink"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-3.5 hover:bg-gold transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
