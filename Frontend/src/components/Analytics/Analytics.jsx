import "./Analytics.css";
import Chart from "./Chart";
import { useState, useEffect } from "react";
import useAnalyticStore from "../../stores/Analytic";

export default function Analytics() {
  const analyticsEvent = useAnalyticStore((state) => state.analyticsEvent);
  const analyticsData = useAnalyticStore((state) => state.analyticsData);
  const fetchData = useAnalyticStore((state) => state.fetchData);
  const [range, setRange] = useState("all");

  useEffect(() => {
    fetchData();
  }, [analyticsEvent, range]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setRange(selectedValue);
  };

  return (
    <div className="analytics">
      <div>
        <h2>{analyticsEvent}</h2>
        <select
          value={range}
          onChange={handleChange}
          className="analyticDropdown"
        >
          <option value="all">All</option>
          <option value="7">Past 7 Days</option>
          <option value="30">Past 30 Days</option>
          <option value="90">Past 90 Days</option>
          <option value="365">Past 365 Days</option>
        </select>
      </div>

      <Chart data={analyticsData} />
    </div>
  );
}
