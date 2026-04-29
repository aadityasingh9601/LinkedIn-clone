import "./ProfileHeadForm.css";
import { useForm } from "react-hook-form";
import Button from "../Button.";
import RHFInput from "../RHFInput";
import { ProfileHeadDataSchema } from "../../../../common/src";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ProfileHeadForm({
  profile,
  createProfile,
  currUserId,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProfileHeadDataSchema),
    defaultValues: profile,
  });

  const onSubmit = (profileData) => {
    console.log(profileData);
    //We should extract and select only the fields we want for the current form to edit,not all of the complete
    //profile object directly as it can cause issues, and some unwanted fields will get overriden too.
    const data = {
      name: profileData.name,
      headline: profileData.headline,
      location: profileData.location,
      contactInfo: {
        email: profileData.contactInfo?.email,
        phone: profileData.contactInfo?.phone,
      },
      profileImage: profileData.profileImage?.[0], // optional chaining just in case
      bannerImage: profileData.bannerImage?.[0],
    };
    createProfile(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="profileHeadForm">
      <RHFInput
        placeholder="Enter your name"
        name="name"
        register={register}
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

      <RHFInput
        type="text"
        placeholder="Enter your location"
        name="location"
        register={register}
        errors={errors}
      />

      <RHFInput
        placeholder="Enter your email"
        register={register}
        name="contactInfo[email]"
      />

      <RHFInput
        placeholder="Enter your phone"
        register={register}
        name="contactInfo[phone]"
      />

      <Button btnText="Save Changes" />
    </form>
  );
}
