import styles from "./ProfileHeadForm.module.css";
import { useForm } from "react-hook-form";
import Button from "../shared-components/Buttons/Button";
import RHFInput from "../shared-components/Inputs/RHFInput";
import { ProfileHeadDataSchema } from "../../zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "../shared-components/Forms/FormWrapper";
import Pen from "../shared-components/Icons/Pen";

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
    // const data = {
    //   name: profileData.name,
    //   headline: profileData.headline,
    //   location: profileData.location,
    //   contactInfo: {
    //     email: profileData.contactInfo?.email,
    //     phone: profileData.contactInfo?.phone,
    //   },
    //   profileImage: profileData.profileImage?.[0],
    //   bannerImage: profileData.bannerImage?.[0],
    // };
    //createProfile(data);
  };

  return (
    <div className={styles.profileHeadForm}>
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <RHFInput
          label="Name"
          placeholder="Enter your name"
          name="name"
          register={register}
          errors={errors}
        />

        <div className={styles.imagesWrapper}>
          <div className={styles.previewImage}>
            <img src={profile.profileImage?.url} alt="" />
            <label htmlFor="profileImage">
              <Button variant="sm" btnText={<div><Pen/> Edit</div>} />
            </label>
            <RHFInput id="profileImage" customClass={styles.hidden} type="file" register={register} name="profileImage" />
          </div>

          <div className={styles.previewImage}>
            <img src={profile.bannerImage?.url} alt="" />
            <label htmlFor="bannerImage">
              <Button variant="sm" btnText={<div><Pen/> Edit</div>} />
            </label>
            <RHFInput id="bannerImage" type="file" customClass={styles.hidden} name="bannerImage" register={register} />
          </div>
        </div>
        <RHFInput
          label="Headline"
          type="text"
          placeholder="Enter your headline"
          name="headline"
          register={register}
        />

        <RHFInput
          label="Location"
          type="text"
          placeholder="Enter your location"
          name="location"
          register={register}
          errors={errors}
        />

        <RHFInput
          placeholder="Enter your email"
          type="email"
          register={register}
          name="contactInfo[email]"
          label="Email"
          errors={errors}
        />

        <RHFInput
          label="Phone number"
          placeholder="Enter your phone"
          register={register}
          name="contactInfo[phone]"
          errors={errors}
        />

        <div className={styles.buttonWrapper}>
          <Button variant="sm" btnText="Save Changes" />
        </div>
      </FormWrapper>
    </div>
  );
}
