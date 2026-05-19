import styles from "./Analytics.module.css";
import Chart from "../../components/shared-components/Charts/Chart";
import { useState, useEffect } from "react";
import useAnalyticStore from "../../stores/Analytic";
import dropDownStyles from "../../components/shared-components/Select/RHFselect.module.css";

export default function Analytics() {
  const analyticsEvent = useAnalyticStore((state) => state.analyticsEvent);
  const analyticsData = useAnalyticStore((state) => state.analyticsData);
  const getData = useAnalyticStore((state) => state.getData);
  const [range, setRange] = useState("all");

  useEffect(() => {
    getData(range);
  }, [analyticsEvent, range]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setRange(selectedValue);
  };

  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <h2>{analyticsEvent}</h2>
       <div>
         <select
          value={range}
          onChange={handleChange}
          className={` ${styles.analyticDropdown} ${dropDownStyles.select}`}
        >
          <option className={styles.option} value="all">
            All
          </option>
          <option className={styles.option} value="7">
            Past 7 Days
          </option>
          <option className={styles.option} value="30">
            Past 30 Days
          </option>
          <option className={styles.option} value="90">
            Past 90 Days
          </option>
          <option className={styles.option} value="365">
            Past 365 Days
          </option>
        </select>
       </div>
      </div>

      <Chart data={analyticsData} />
    </div>
  );
}
