"use client";

import React, { useState } from 'react';
import { Camera, Save, X } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';

type EditProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  selectedSkills: string[];
  portfolio: string;
  linkedIn: string;
  twitter: string;
  github: string;
  yearsOfExperience: string;
  hourlyRate: string;
  availability: string;
  openToRemote: boolean;
  willingToRelocate: boolean;
};

interface EditProfilePageProps {
  initialData?: Partial<EditProfileFormData>;
  onSave?: (data: EditProfileFormData) => void;
  onCancel?: () => void;
}

const skills = [
  'Web Development', 'Mobile Development', 'UI/UX Design', 'Graphic Design',
  'Content Writing', 'Copywriting', 'Digital Marketing', 'Social Media Management',
  'Photography', 'Videography', 'Video Editing', 'Animation',
  'Accounting', 'Bookkeeping', 'Project Management', 'Customer Service'
];

export function EditProfilePage({ initialData, onSave, onCancel }: EditProfilePageProps) {
  const [formData, setFormData] = useState<EditProfileFormData>(() => {
    const base = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+234 XXX XXX XXXX',
      location: 'Lagos, Nigeria',
      bio: 'Experienced web developer with 5+ years building modern applications.',
      selectedSkills: ['Web Development', 'UI/UX Design'],
      portfolio: 'https://johndoe.com',
      linkedIn: '',
      twitter: '',
      github: '',
      yearsOfExperience: '5-10',
      hourlyRate: '5000',
      availability: 'full-time',
      openToRemote: true,
      willingToRelocate: false
    };
    const merged = { ...base, ...(initialData ?? {}) };
    return {
      ...merged,
      selectedSkills: initialData?.selectedSkills ?? base.selectedSkills
    };
  });

  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : prev.selectedSkills.length < 10
        ? [...prev.selectedSkills, skill]
        : prev.selectedSkills
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave?.(formData);
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl">Edit Profile</h1>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSave}>
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Photo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl mb-4">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-deep-blue to-emerald-green flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-semibold text-3xl">
                    {formData.firstName.charAt(0)}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-green rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-green-dark transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <div>
              <p className="text-foreground-secondary text-sm mb-2">
                Upload a professional photo. Square images work best.
              </p>
              <p className="text-foreground-tertiary text-xs">
                Max size: 5MB. Formats: JPG, PNG
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl mb-6">Basic Information</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl mb-6">Professional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell hirers about yourself, your experience, and what makes you unique..."
                rows={5}
                className="w-full px-4 py-3 bg-input-background border border-input-border rounded-lg focus:border-deep-blue focus:outline-none resize-none"
                maxLength={500}
              />
              <p className="text-xs text-foreground-tertiary mt-1">{formData.bio.length}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Skills <span className="text-foreground-tertiary font-normal">(Max 10)</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.selectedSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-deep-blue text-white rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => toggleSkill(skill)}
                      className="hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowSkillsModal(true)}>
                {formData.selectedSkills.length === 0 ? 'Add Skills' : 'Edit Skills'}
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Years of Experience</label>
                <select
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-input-border rounded-lg focus:border-deep-blue focus:outline-none"
                >
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <Input
                label="Hourly Rate (₦)"
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Availability</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['full-time', 'part-time', 'freelance', 'any'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, availability: type })}
                    className={`p-3 rounded-lg capitalize transition-all ${
                      formData.availability === type
                        ? 'bg-emerald-green text-white'
                        : 'bg-background-secondary hover:bg-background-tertiary'
                    }`}
                  >
                    {type === 'any' ? 'Any' : type.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 bg-background-secondary rounded-lg cursor-pointer hover:bg-background-tertiary transition-colors">
                <input
                  type="checkbox"
                  checked={formData.openToRemote}
                  onChange={(e) => setFormData({ ...formData, openToRemote: e.target.checked })}
                  className="w-5 h-5 rounded border-input-border text-emerald-green focus:ring-emerald-green"
                />
                <div>
                  <div className="font-medium">Open to Remote Work</div>
                  <div className="text-sm text-foreground-secondary">Work from anywhere</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-background-secondary rounded-lg cursor-pointer hover:bg-background-tertiary transition-colors">
                <input
                  type="checkbox"
                  checked={formData.willingToRelocate}
                  onChange={(e) => setFormData({ ...formData, willingToRelocate: e.target.checked })}
                  className="w-5 h-5 rounded border-input-border text-emerald-green focus:ring-emerald-green"
                />
                <div>
                  <div className="font-medium">Willing to Relocate</div>
                  <div className="text-sm text-foreground-secondary">Move for the right opportunity</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Links & Portfolio */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl mb-6">Links & Portfolio</h2>
          <div className="space-y-4">
            <Input
              label="Portfolio Website"
              type="url"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              placeholder="https://yourportfolio.com"
            />

            <Input
              label="LinkedIn"
              type="url"
              value={formData.linkedIn}
              onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
              placeholder="https://linkedin.com/in/yourprofile"
            />

            <Input
              label="GitHub"
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              placeholder="https://github.com/yourusername"
            />

            <Input
              label="Twitter"
              type="url"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              placeholder="https://twitter.com/yourusername"
            />
          </div>
        </div>

        {/* Save Button - Mobile */}
        <div className="sm:hidden sticky bottom-4">
          <Button variant="success" size="lg" className="w-full" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Skills Modal */}
      {showSkillsModal && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl">Select Skills</h3>
                <p className="text-sm text-foreground-secondary mt-1">
                  Choose up to 10 skills • Selected: {formData.selectedSkills.length}/10
                </p>
              </div>
              <button onClick={() => setShowSkillsModal(false)}>
                <X className="w-6 h-6 text-foreground-secondary hover:text-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {skills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  disabled={!formData.selectedSkills.includes(skill) && formData.selectedSkills.length >= 10}
                  className={`p-3 rounded-lg text-sm transition-all ${
                    formData.selectedSkills.includes(skill)
                      ? 'bg-deep-blue text-white'
                      : 'bg-background-secondary hover:bg-background-tertiary'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setShowSkillsModal(false)}>
                Cancel
              </Button>
              <Button variant="success" className="flex-1" onClick={() => setShowSkillsModal(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
