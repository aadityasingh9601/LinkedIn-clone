import PDF from "./Pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Spinner from "../shared-components/Loaders/Spinner";

export default function PDFDownloadButton({ profile }) {
  return (
    <PDFDownloadLink document={<PDF user={profile} />} fileName="Profile.pdf">
      {({ loading }) =>
        loading ? <Spinner height={17} width={17} /> : "Download PDF"
      }
    </PDFDownloadLink>
  );
}
