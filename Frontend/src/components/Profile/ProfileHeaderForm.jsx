import styles from "./ProfileHeaderForm.module.css";
import { useForm } from "react-hook-form";
import Button from "../shared-components/Buttons/Button";
import RHFInput from "../shared-components/Inputs/RHFInput";
import { ProfileHeaderDataSchema } from "../../zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "../shared-components/Forms/FormWrapper";
import useProfileStore from "../../stores/Profile";
import { useState } from "react";
import Spinner from "../shared-components/Loaders/Spinner";

export default function ProfileHeaderForm({ profile }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProfileHeaderDataSchema),
    defaultValues: {
      name: profile.name,
      headline: profile.headline,
      location: profile.location,
      contactInfo: profile.contactInfo,
      profileImage: profile.profileImage.url,
      bannerImage: profile.bannerImage.url,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const updateProfileHeader = useProfileStore((s) => s.updateProfileHeader);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newBannerImage, setNewBannerImage] = useState(null);
  // Watch for file changes
  const file1 = watch("profileImage");
  const file2 = watch("bannerImage");

  //New Profile Image.
  if (file1 && file1[0] instanceof File && file1.length > 0) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProfileImage(reader.result);
    };
    reader.readAsDataURL(file1[0]); // Convert first file to Base64
  }
  //New Banner Image
  if (file2 && file2[0] instanceof File && file2.length > 0) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewBannerImage(reader.result);
    };
    reader.readAsDataURL(file2[0]); // Convert first file to Base64
  }

  const onSubmit = (data) => {
    console.log(data);
    const profileData = {
      ...data,
      profileImage: data.profileImage[0],
      bannerImage: data.bannerImage[0],
    };
    updateProfileHeader(profileData, setIsLoading);
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
              <img
                src={
                  newProfileImage ? newProfileImage : profile.profileImage?.url
                }
                alt=""
              />
              <RHFInput type="file" register={register} name="profileImage" />
            </div>

            <div className={styles.previewImage}>
              <img
                src={newBannerImage ? newBannerImage : profile.bannerImage?.url}
                alt=""
              />
              <RHFInput type="file" name="bannerImage" register={register} />
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
      <div className={styles.footer}>
        <Button
          form="form"
          type="submit"
          variant="sm"
          btnText={
            isLoading ? <Spinner height={17} width={17} /> : "Save Changes"
          }
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
