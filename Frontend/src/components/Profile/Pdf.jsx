import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  section: { marginBottom: 20 },
  subSection: { marginBottom: 15 },
  name: { fontSize: 30, marginBottom: 10, fontWeight: "bold" },
  title: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  text: { fontSize: 13 },
});

const PDF = ({ user }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.text}>{user?.headline}</Text>
        <Text style={styles.text}>{user?.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Summary</Text>
        <Text style={styles.text}>{user?.about}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Skills</Text>
        {user?.skills?.map((s) => {
          return <Text style={styles.text}>-- {s}</Text>;
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Experience</Text>
        {user?.experience?.map((ex) => {
          return (
            <View style={styles.subSection}>
              <Text style={styles.text}>{ex.companyName}</Text>
              <Text style={styles.text}>{ex.jobTitle}</Text>
              <Text style={styles.text}>{ex.description}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Education</Text>
        {user?.education?.map((ed) => {
          return (
            <View style={styles.subSection}>
              <Text style={styles.text}>{ed.institution}</Text>
              <Text style={styles.text}>{ed.degree}</Text>
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);

export default PDF;
