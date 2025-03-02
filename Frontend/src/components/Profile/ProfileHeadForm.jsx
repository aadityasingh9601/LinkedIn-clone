import "./ProfileHeadForm.css";
import { useForm } from "react-hook-form";
import Button from "../Button.";

export default function ProfileHeadForm({ profile, createProfile }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: profile.name,
      headline: profile.headline,
      location: profile.location,
      contactInfo: {
        email: profile.contactInfo?.email,
        phone: profile.contactInfo?.phone,
      },
    },
  });

  const onSubmit = (profileData) => {
    console.log(profileData);
    const data = {
      ...profileData,
      profileImage: profileData.profileImage[0],
      bannerImage: profileData.bannerImage[0],
    };
    createProfile(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="profileHeadForm">
      <input
        placeholder="Enter your name"
        {...register("name", {
          required: "Name cannot be empty",
        })}
      />
      {errors.name && errors.name.message}
      <br></br>

      <div className="headFormImages">
        <div className="profileImg">
          <span>Current Profile Image</span> <br></br>
          <img src={profile.profileImage?.url} alt="" />
          <input type="file" {...register("profileImage")} />
        </div>

        <div className="bannerImg">
          <span>Current Banner Image</span> <br></br>
          <img src={profile.bannerImage?.url} alt="" />
          <input type="file" {...register("bannerImage")} />
        </div>
      </div>

      <input
        type="text"
        placeholder="Enter your headline"
        {...register("headline")}
      />
      <br></br>
      <input
        type="text"
        placeholder="Enter your location"
        {...register("location", {
          required: "Location can't be empty",
          minLength: {
            value: 5,
            message: "Location should be at least 5 characters",
          },
        })}
      />
      {errors.location && <p>{errors.location.message}</p>}
      <br></br>
      <input
        placeholder="Enter your email"
        {...register("contactInfo[email]")}
      />
      <br></br>
      <input
        placeholder="Enter your phone"
        {...register("contactInfo[phone]")}
      />
      <br></br>
      <Button btnText="Save Changes" />
    </form>
  );
}
