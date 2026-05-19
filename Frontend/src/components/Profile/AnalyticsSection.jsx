import indexStyles from "./index.module.css";
import styles from "./AnalyticsSection.module.css";
import useAnalyticStore from "../../stores/Analytic";
import { useNavigate } from "react-router-dom";

export default function AnalyticsSection() {
  const navigate = useNavigate();
  const setAnalyticsEvent = useAnalyticStore(
    (state) => state.setAnalyticsEvent,
  );

  const showAnalytics = (e) => {
    let value = e.target.innerText;
    setAnalyticsEvent(value);
    navigate("/analytics");
  };
  return (
    <div className={indexStyles.profileSection}>
      <div className={indexStyles.head}>
        <div className={indexStyles.title}>Analytics</div>
      </div>
      <div className={styles.analyticsSection}>
        <div className={styles.analyticBox} onClick={showAnalytics}>
          Followers
        </div>
        <div className={styles.analyticBox} onClick={showAnalytics}>
          Post Impressions
        </div>
        <div className={styles.analyticBox} onClick={showAnalytics}>
          Profile Views
        </div>
        <div className={styles.analyticBox} onClick={showAnalytics}>
          Search Appearances
        </div>
      </div>
    </div>
  );
}
