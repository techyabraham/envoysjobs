import React, { useState } from 'react';
import { 
  Camera, Mail, Phone, MapPin, Briefcase, Award, 
  Edit, Save, X, Plus 
} from 'lucide-react';
import { Card } from '@/app/components/Card';
import { Badge } from '@/app/components/Badge';
import { Button } from '@/app/components/Button';
import { Input } from '@/app/components/Input';

interface ProfilePageProps {
  userName: string;
  userEmail: string;
}

export function ProfilePage({ userName, userEmail }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: userName,
    lastName: 'Doe',
    email: userEmail,
    phone: '+234 800 000 0000',
    location: 'Lagos, Nigeria',
    bio: 'Experienced web developer passionate about creating impactful solutions for the Envoys community.',
    skills: ['Web Development', 'React', 'Node.js', 'UI/UX Design'],
    experience: [
      {
        title: 'Senior Developer',
        company: 'Tech Solutions Ltd',
        duration: '2020 - Present',
        description: 'Leading development of web applications'
      },
      {
        title: 'Full Stack Developer',
        company: 'Creative Agency',
        duration: '2018 - 2020',
        description: 'Built and maintained multiple client projects'
      }
    ]
  });

  const handleSave = () => {
    setIsEditing(false);
    // In real app, this would save to backend
    console.log('Saving profile:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
  };

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">Profile</h1>
            <p className="text-foreground-secondary">Manage your account information</p>
          </div>
          {!isEditing ? (
            <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button variant="success" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          )}
        </div>

        {/* Profile Header Card */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-deep-blue to-emerald-green flex items-center justify-center text-white text-3xl font-bold">
                {userName.charAt(0)}
              </div>
              {isEditing && (
                <button className="absolute inset-0 bg-foreground/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    />
                    <Input
                      label="Last Name"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-foreground mb-1">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="gold">
                      <Award className="w-3 h-3" />
                      Verified Member
                    </Badge>
                    <Badge variant="success">Active</Badge>
                  </div>
                </>
              )}

              <div className="space-y-2">
                {isEditing ? (
                  <>
                    <Input
                      label="Email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                    <Input
                      label="Location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-foreground-secondary">
                      <Mail className="w-4 h-4 mr-2" />
                      {profileData.email}
                    </div>
                    <div className="flex items-center text-foreground-secondary">
                      <Phone className="w-4 h-4 mr-2" />
                      {profileData.phone}
                    </div>
                    <div className="flex items-center text-foreground-secondary">
                      <MapPin className="w-4 h-4 mr-2" />
                      {profileData.location}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* About/Bio */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">About</h3>
            </div>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-background-secondary border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-blue focus:border-transparent transition-all resize-none"
              />
            ) : (
              <p className="text-foreground-secondary leading-relaxed">
                {profileData.bio}
              </p>
            )}
          </div>
        </Card>

        {/* Skills */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Skills</h3>
              {isEditing && (
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4" />
                  Add Skill
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <Badge key={index} variant="default" className="text-sm">
                  {skill}
                  {isEditing && (
                    <button className="ml-2 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Experience */}
        <Card>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Experience</h3>
              {isEditing && (
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4" />
                  Add Experience
                </Button>
              )}
            </div>
            <div className="space-y-6">
              {profileData.experience.map((exp, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-deep-blue/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6 text-deep-blue" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{exp.title}</h4>
                    <p className="text-sm text-foreground-secondary mb-1">{exp.company}</p>
                    <p className="text-xs text-foreground-tertiary mb-2">{exp.duration}</p>
                    <p className="text-sm text-foreground-secondary">{exp.description}</p>
                    {isEditing && (
                      <div className="flex gap-2 mt-3">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                          <X className="w-3 h-3" />
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Account Stats */}
        <Card>
          <h3 className="text-lg font-semibold text-foreground mb-4">Account Statistics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">75%</div>
              <div className="text-sm text-foreground-secondary">Profile Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">12</div>
              <div className="text-sm text-foreground-secondary">Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">48</div>
              <div className="text-sm text-foreground-secondary">Profile Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">4.9</div>
              <div className="text-sm text-foreground-secondary">Rating</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
