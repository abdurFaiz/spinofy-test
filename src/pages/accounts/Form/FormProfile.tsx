/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { formSchema } from "@/schemas";
import { useRegister, useUpdateProfile } from "@/services/auth";
import { useAuth } from "@/hooks/Auth/auth.hooks";
import { genderToString } from "@/types/Auth";
import HeaderBar from "@/components/HeaderBar";
import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { FormValues } from "@/schemas/auth.schemas";

export default function FormProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const registerMutation = useRegister();
  const updateProfileMutation = useUpdateProfile();

  // Determine if this is update mode (user is logged in with profile data)
  const isUpdateMode = isAuthenticated && user?.customer_profile;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      date_birth: "",
      gender: "",
      job: "",
    },
  });

  // Populate form with existing data when in update mode
  useEffect(() => {
    if (isUpdateMode && user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        date_birth: user.customer_profile?.date_birth || "",
        gender: genderToString(user.customer_profile?.gender ?? null),
        job: user.customer_profile?.job || "",
      });
    }
  }, [isUpdateMode, user, form]);

  const onSubmit = (data: FormValues) => {
    console.log("Form data being submitted:", data);

    if (isUpdateMode) {
      // Update existing profile
      updateProfileMutation.mutate(data, {
        onSuccess: () => {
          console.log("Profile updated successfully");
          navigate("/account", { replace: true });
        },
        onError: (error: any) => {
          console.error("Update profile failed:", error);
          console.error("Error response:", error.response?.data);
          console.error("Error status:", error.response?.status);
        },
      });
    } else {
      // Register new user
      registerMutation.mutate(data, {
        onSuccess: () => {
          console.log("Registration successful");
          navigate("/onboard", { replace: true });
        },
        onError: (error: any) => {
          console.error("Registration failed:", error);
          console.error("Error response:", error.response?.data);
          console.error("Error status:", error.response?.status);
        },
      });
    }
  };

  const isSubmitting = registerMutation.isPending || updateProfileMutation.isPending;

  // Button text based on mode and loading state
  const getButtonText = () => {
    if (isSubmitting) {
      return isUpdateMode ? "Menyimpan..." : "Mendaftar...";
    }
    return isUpdateMode ? "Simpan Perubahan" : "Daftar Sekarang";
  };

  return (
    <ScreenWrapper>
      <HeaderBar showBack onBack={() => navigate(-1)}
        title={isUpdateMode ? "Edit Data Diri" : "Lengkapi Data Diri"}
        subtitle="Pastikan semua datanya benar ya, biar nggak keliru."
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-60 px-4 mt-8"
        >
          <div className="flex flex-col gap-4">
            {/* Nama Lengkap */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      className="text-primary-orange"
                      placeholder="Nama Lengkap*"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nomor WhatsApp */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="tel"
                      className="text-primary-orange bg-gray-50"
                      placeholder="Nomor WhatsApp*"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal Lahir */}
            <FormField
              control={form.control}
              name="date_birth"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="Tanggal Lahir*"
                      className="text-primary-orange icon-calendar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Jenis Kelamin */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-primary-orange">
                        <SelectValue placeholder="Jenis Kelamin*" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pekerjaan */}
            <FormField
              control={form.control}
              name="job"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      className="text-primary-orange"
                      placeholder="Pekerjaan*"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            variant="primary"
            size="xl"
            type="submit"
            disabled={isSubmitting}
          >
            {getButtonText()}
          </Button>
        </form>
      </Form>
    </ScreenWrapper>
  );
}