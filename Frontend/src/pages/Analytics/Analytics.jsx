import styles from "./Analytics.module.css";
import { lazy, Suspense } from "react";
import { useState, useEffect } from "react";
import useAnalyticStore from "../../stores/Analytic";
import dropDownStyles from "../../components/shared-components/Select/RHFselect.module.css";
import Spinner from "../../components/shared-components/Loaders/Spinner";

const Chart = lazy(() => import("../../components/shared-components/Charts/Chart"));

export default function Analytics() {
  const analyticsEvent = useAnalyticStore((s) => s.analyticsEvent);
  const analyticsData = useAnalyticStore((s) => s.analyticsData);
  const getData = useAnalyticStore((s) => s.getData);
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

      <Suspense fallback={<Spinner height={60} width={60} />}>
        <Chart data={analyticsData} />
      </Suspense>
    </div>
  );
}
