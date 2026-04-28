import { z } from "zod";

export const SignupDataSchema = z.object({
  name: z
    .string()
    .min(1, "Name can't be empty!")
    .max(12, "Can't exceed length 12"),
  email: z.email("Please enter a valid email!"),
  password: z
    .string()
    .min(6, "Must be atleast 6 characters!")
    .max(12, "Must be atmost 12 characters!"),
});

export const LoginDataSchema = z.object({
  email: z.email("Please enter a valid email!"),
  password: z
    .string()
    .min(6, "Must be atleast 6 characters!")
    .max(12, "Must be atmost 12 characters!"),
});

export const PostDataSchema = z.object({
  content: z
    .string()
    .min(30, "Content must be atleast 30 characters long!")
    .max(1000, "Content limit reached!"),
  media: z.any(), //After fixing functionalities & stuff, come back & fix it's types too.
  postType: z.enum(["Everyone", "Connections only"]),
  date: z
    .string()
    .regex(
      /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
      "Date must be in DD-MM-YYYY format",
    ),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM 24hr format"),
});

export const PollDataSchema = z.object({
  question: z
    .string("Question is required!")
    .min(10, "Question should be atleast 10 characters long!")
    .max(200, "Question should be under 200 characters!"),
  options: z.array({
    value: z.string().min(1, "Can't be empty!"),
  }),
  pollDuration: z.string("Poll duration is required!"),
});
