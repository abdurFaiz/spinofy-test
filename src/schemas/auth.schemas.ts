import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .min(3, "Nama lengkap minimal 3 karakter"),

  phone: z
    .string()
    .min(1, "Nomor WhatsApp wajib diisi")
    .regex(/^[0-9]+$/, "Nomor WhatsApp hanya boleh berisi angka")
    .min(8, "Nomor WhatsApp minimal 8 digit")
    .max(13, "Nomor WhatsApp maksimal 12 digit"),

  date_birth: z
    .string()
    .min(1, "Tanggal lahir wajib diisi")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid"),

  gender: z
    .string()
    .min(1, "Jenis kelamin wajib dipilih")
    .refine((val) => ["male", "female"].includes(val), {
      message: "Jenis kelamin tidak valid",
    }),

  job: z.string().min(1, "Pekerjaan wajib diisi"),
});

const emailSchema = z.object({
  email: z
    .string("Email wajib diisi")
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
})

type FormValues = z.infer<typeof formSchema>;
export { formSchema, emailSchema, type FormValues };
