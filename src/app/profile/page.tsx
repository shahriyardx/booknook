import type { Metadata } from "next";
import { ProfileCard } from "./profile-card";

export const metadata: Metadata = { title: "My Profile" };

export default function ProfilePage() {
  return <ProfileCard />;
}
