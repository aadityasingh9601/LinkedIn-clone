import styles from "./ProfileHeaderForm.module.css";
import { useForm } from "react-hook-form";
import Button from "../shared-components/Buttons/Button";
import RHFInput from "../shared-components/Inputs/RHFInput";
import { ProfileHeaderDataSchema } from "../../zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "../shared-components/Forms/FormWrapper";

export default function ProfileHeaderForm({
  profile,
  createProfile,
  currUserId,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProfileHeaderDataSchema),
    defaultValues: profile,
  });

  const onSubmit = (data) => {
    console.log(data);
    const profileData = {
      ...data,
      profileImage:data.profileImage?.url,
      bannerImage: data.bannerImage?.url
    }
    //createProfile(profileData);
  };

  return (
    <div className={styles.profileHeaderForm}>
      <div className={styles.header}>
        <div>Edit intro</div>
      </div>
     <div className={styles.body}>
       <FormWrapper onSubmit={handleSubmit(onSubmit)} id="form">
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
            <RHFInput  type="file" register={register} name="profileImage" />
          </div>

          <div className={styles.previewImage}>
            <img src={profile.bannerImage?.url} alt="" />
            <RHFInput  type="file"  name="bannerImage" register={register} />
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

        
      </FormWrapper>
     </div>
      <div className={styles.footer} >
          <Button form="form" type="submit" variant="sm" btnText="Save Changes" />
        </div>
    </div>
  );
}
