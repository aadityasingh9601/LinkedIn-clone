import { z, coerce } from "zod";

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
  media: z.any().optional(), //After fixing functionalities & stuff, come back & fix it's types too.
  postType: z.enum(["Everyone", "Connections only"]),
  date: z
    .string()
    .regex(
      /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
      "Date must be in DD-MM-YYYY format",
    )
    .optional(),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM 24hr format")
    .optional(),
});

export const PollDataSchema = z.object({
  question: z.string("Required!").min(10, "Too short!").max(200, "Too long!"),
  options: z.array({
    value: z.string().min(1, "Required!"),
  }),
  pollDuration: z.string("Required!"),
});

export const JobDataSchema = z.object({
  title: z.string("Title is required!").min(5, "Too Short!"),
  company: z.string("Required!").min(5, "Too short!").max(25, "Too long!"),
  companyLogo: z.string(),
  companyDescription: z
    .string("Required!")
    .min(100, "Too short!")
    .max(300, "Too long!"),
  location: z.string("Required!").min(5, "Too short!").max(20, "Too long!"),
  jobType: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  jobMode: z.enum(["On-site", "Remote"]),
  salary: z.coerce
    .number("Please enter a valid amount!")
    .gte(1000, "Too short!")
    .lte(9999999, "Too long!"),
  qualifications: z
    .string("Required!")
    .min(100, "Too short!")
    .max(300, "Too long!"),
  skills: z.array(z.string().min(5, "Too short!")).min(1, "Required!"),
  jobDescription: z
    .string("Required!")
    .min(100, "Too short!")
    .max(300, "Too long!"),
});

export const EducationDataSchema = z.object({
  institution: z.string().min(5, "Must be atleast 5 characters long!"),
  degree: z.string().min(3, "Must be atleast 3 characters long!"),
  description: z
    .string("Description is required!")
    .min(50, "Too short!")
    .max(200, "Too long!"),
  started: z
    .string()
    .regex(
      /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
      "Date must be in DD-MM-YYYY format",
    ),
  ended: z
    .string()
    .regex(
      /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
      "Date must be in DD-MM-YYYY format",
    ),
});

export const ExperienceDataSchema = z.object({
  companyName: z
    .string("Company name is required!")
    .min(5, "Too short!")
    .max(20, "Too long!"),
  jobTitle: z
    .string("Job title is required!")
    .min(5, "Too short!")
    .max(25, "Too long!"),
  description: z
    .string("Description is required!")
    .min(50, "Too short!")
    .max(200, "Too long!"),
  started: z
    .string()
    .regex(
      /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
      "Date must be in DD-MM-YYYY format",
    ),
  ended: z
    .string()
    .regex(
      /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
      "Date must be in DD-MM-YYYY format",
    ),
});

export const ProfileHeaderDataSchema = z.object({
  name: z
    .string("Name can't be empty!")
    .min(1, "Too short!")
    .max(15, "Too long!"),
  headline: z.string(),
  location: z.string(),
  contactInfo: z.object({
    email: z.email("Please enter a valid email!"),
    phone: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce
        .number("Please enter a valid phone number!")
        .gte(10000000, "Too short!")
        .lte(9999999999, "Too long!")
        .optional(),
    ),
  }),
  profileImage: z.any().optional(), //After fixing functionalities & stuff, come back & fix it's types too.
  bannerImage: z.any().optional(),
});

export const JobApplicationDataSchema = z.object({
  answers: z.array(
    z.string("Required!").min(10, "Too short!").max(200, "Too long!"),
  ),
  //Resume validation is being done directly in the backend route.
});
