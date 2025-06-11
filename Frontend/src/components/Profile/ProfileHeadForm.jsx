import "./ProfileHeadForm.css";
import { useForm } from "react-hook-form";
import Button from "../Button.";
import RHFInput from "../RHFinput";

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
      <RHFInput
        placeholder="Enter your name"
        name="name"
        register={register}
        rules={{
          required: "Name cannot be empty",
        }}
        errors={errors}
      />
      <br></br>

      <div className="headFormImages">
        <div className="profileImg">
          <span>Current Profile Image</span> <br></br>
          <img src={profile.profileImage?.url} alt="" />
          <RHFInput type="file" register={register} name="profileImage" />
        </div>

        <div className="bannerImg">
          <span>Current Banner Image</span> <br></br>
          <img src={profile.bannerImage?.url} alt="" />
          <RHFInput type="file" name="bannerImage" register={register} />
        </div>
      </div>
      <RHFInput
        type="text"
        placeholder="Enter your headline"
        name="headline"
        register={register}
      />
      <br></br>
      <RHFInput
        type="text"
        placeholder="Enter your location"
        name="location"
        register={register}
        rules={{
          required: "Location can't be empty",
          minLength: {
            value: 5,
            message: "Location should be at least 5 characters",
          },
        }}
        errors={errors}
      />

      {errors.location && <p>{errors.location.message}</p>}
      <br></br>
      <RHFInput
        placeholder="Enter your email"
        register={register}
        name="contactInfo[email]"
      />
      <br></br>
      <RHFInput
        placeholder="Enter your phone"
        register={register}
        name="contactInfo[phone]"
      />
      <br></br>
      <Button btnText="Save Changes" />
    </form>
  );
}
