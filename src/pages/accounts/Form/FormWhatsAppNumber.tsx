import HeaderBar from "@/components/HeaderBar";
import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import Button from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/Auth/auth.hooks";
import { useUpdateProfile } from "@/services/auth";
import { genderToString } from "@/types/Auth";
import { formSchema } from "@/schemas";

// Extract only phone validation from formSchema
const phoneSchema = formSchema.pick({ phone: true });

export default function FormWhatsAppNumber() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();

  const form = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = (data: z.infer<typeof phoneSchema>) => {
    console.log("Form submitted:", data);

    // Check if user data is available
    if (!user?.customer_profile) {
      console.error("User data not available");
      return;
    }

    // Prepare full profile data with updated phone number
    const profileData = {
      name: user.name,
      phone: data.phone,
      date_birth: user.customer_profile.date_birth || "",
      gender: genderToString(user.customer_profile.gender ?? null),
      job: user.customer_profile.job || "",
    };

    // Call update profile API
    updateProfileMutation.mutate(profileData, {
      onSuccess: () => {
        console.log("Phone number updated successfully");
        navigate("/account", { replace: true });
      },
      onError: (error: any) => {
        console.error("Update phone number failed:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
      },
    });
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "N/A";
    // Format: +62 812-3456-7890
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("62")) {
      const number = cleaned.substring(2);
      if (number.length >= 3) {
        const part1 = number.substring(0, 3);
        const part2 = number.substring(3, 7);
        const part3 = number.substring(7);
        return `+62 ${part1}${part2 ? `-${part2}` : ""}${part3 ? `-${part3}` : ""}`;
      }
      return `+62 ${number}`;
    }
    return phone;
  };

  return (
    <ScreenWrapper>
      <HeaderBar
        title="Nomor WhatsApp"
        showBack
        onBack={() => navigate("/account")}
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 px-4 pt-8">
          <p className="text-base font-rubik text-body-grey">
            Nomor WhatsApp Anda Saat Ini
          </p>
          <h1 className="text-lg font-rubik text-title-black font-medium">
            {user ? formatPhoneNumber(user.phone) : "Loading..."}
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <p className="px-4 text-base font-medium font-rubik text-title-black">
            Nomor WhatsApp Baru <span className="text-dark-red">*</span>{" "}
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-[440px] px-4"
            >
              <div className="flex flex-col gap-4">
                {/* Nomor WhatsApp */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="tel"
                          className="text-primary-orange"
                          placeholder="Contoh: 081234567890"
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
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </ScreenWrapper>
  );
}
