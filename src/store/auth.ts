import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/supabaseClient";
import type { ProfileWithPcu } from "@/types/models";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const profile = ref<ProfileWithPcu | null>(null);

  async function fetchSession(): Promise<void> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      user.value = session.user;
      await fetchProfile(user.value.id);
    }
  }

  async function fetchProfile(userId: string): Promise<void> {
    const { data, error } = await supabase
      .from("profiles_drugcupsabot")
      .select("*, pcus_drugcupsabot(name), status")
      .eq("id", userId)
      .single();
    if (error) console.error("Error fetching profile:", error);
    else profile.value = data as unknown as ProfileWithPcu;
  }

  async function login(email: string, password: string): Promise<void> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    await fetchProfile(data.user.id);

    if (profile.value && profile.value.status !== "approved") {
      const status = profile.value.status;

      await logout();

      if (status === "pending") {
        throw new Error("บัญชีของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ");
      } else if (status === "rejected") {
        throw new Error("คำขอลงทะเบียนของคุณถูกปฏิเสธโดยผู้ดูแลระบบ");
      } else {
        throw new Error("บัญชีของคุณยังไม่ถูกเปิดใช้งาน กรุณาติดต่อผู้ดูแล");
      }
    }

    user.value = data.user;
  }

  async function logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase signOut error:", error.message);
      }
    } catch (e) {
      console.error("Unexpected error during logout:", e);
    } finally {
      user.value = null;
      profile.value = null;
    }
  }

  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => profile.value?.role === "admin");
  const userPcuName = computed(
    () => profile.value?.pcus_drugcupsabot?.name || "N/A",
  );
  const userPcuId = computed(() => profile.value?.pcu_id || null);
  const userProfile = computed(() => profile.value);

  return {
    user,
    profile,
    fetchSession,
    login,
    logout,
    isLoggedIn,
    isAdmin,
    userPcuName,
    userPcuId,
    userProfile,
  };
});
