import ExperienceForm from "./ExperienceForm";
import ProfileSectionCard from "../ProfileSectionCard";

export default function ExpCard({ experience, editProfile, deleteProfile }) {
  return (
    <ProfileSectionCard
      data={experience}
      section="experience"
      editProfile={editProfile}
      deleteProfile={deleteProfile}
      imageUrl="https://tse1.mm.bing.net/th?id=OIP.8stsJDHh7WoOTlUsaX-ObwHaHa&pid=Api&P=0&h=180"
      FormComponent={ExperienceForm}
      fields={{
        titleKey: "jobTitle",
        subtitleKey: "companyName",
        startKey: "started",
        endKey: "ended",
        descriptionKey: "description",
      }}
    />
  );
}
