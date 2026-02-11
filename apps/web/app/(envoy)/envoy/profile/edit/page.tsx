"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { EditProfilePage } from "@envoysjobs/ui";
import { useApi } from "@/lib/useApi";
import { API_BASE_URL } from "@/lib/api";

export default function Page() {
  const router = useRouter();
  const api = useApi();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api<any>("/me");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });

  const profileQuery = useQuery({
    queryKey: ["envoy-profile"],
    queryFn: async () => {
      const res = await api<any>("/envoy/profile");
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });

  const initialData = useMemo(() => {
    const user = meQuery.data;
    const profile = profileQuery.data;
    return {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      location: profile?.location ?? "",
      bio: profile?.bio ?? "",
      selectedSkills: profile?.skills ? String(profile.skills).split(",").map((item: string) => item.trim()).filter(Boolean) : [],
      portfolio: profile?.portfolioLinks ?? "",
      linkedIn: "",
      twitter: "",
      github: "",
      yearsOfExperience: "",
      hourlyRate: "",
      availability: profile?.availability ?? "",
      openToRemote: true,
      willingToRelocate: false
    };
  }, [meQuery.data, profileQuery.data]);

  const handleSave = async (data: any) => {
    const profileRes = await api("/envoy/profile", {
      method: "PUT",
      body: JSON.stringify({
        bio: data.bio,
        location: data.location,
        availability: data.availability,
        portfolioLinks: data.portfolio,
        skills: data.selectedSkills?.join(", ") ?? ""
      })
    });

    if (profileRes.error) {
      alert("Failed to save profile.");
      return;
    }

    const userRes = await api("/me", {
      method: "PUT",
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone
      })
    });

    if (userRes.error) {
      alert("Failed to save user details.");
      return;
    }

    router.push("/envoy/profile");
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api<{ imageUrl: string }>("/me/avatar", {
      method: "POST",
      body: formData
    });
    if (res.error) {
      alert("Failed to upload image.");
      return;
    }
    return `${API_BASE_URL}${res.data.imageUrl}`;
  };

  if (meQuery.isLoading || profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center text-foreground-secondary">
        Loading profile...
      </div>
    );
  }

  return (
    <EditProfilePage
      initialData={initialData}
      profileImageUrl={meQuery.data?.imageUrl ? `${API_BASE_URL}${meQuery.data.imageUrl}` : null}
      onImageUpload={handleImageUpload}
      onSave={handleSave}
      onCancel={() => router.push("/envoy/profile")}
    />
  );
}
