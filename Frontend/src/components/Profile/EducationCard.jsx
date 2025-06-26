import EducationForm from "./EducationForm";
import ProfileSectionCard from "./ProfileSectionCard";

export default function EducationCard({
  education,
  editProfile,
  deleteProfile,
  styles = {},
}) {
  return (
    <ProfileSectionCard
      styles={styles}
      data={education}
      section="education"
      editProfile={editProfile}
      deleteProfile={deleteProfile}
      imageUrl="https://tse4.mm.bing.net/th?id=OIP.YzgkSxKcApsL8s0r-6cnkwHaHa&pid=Api&P=0&h=180"
      FormComponent={EducationForm}
      fields={{
        titleKey: "institution",
        subtitleKey: "degree",
        startKey: "started",
        endKey: "ended",
        descriptionKey: "description",
      }}
    />
  );
}
