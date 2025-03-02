import React from "react";
import "./Analytics.css";
import Chart from "./Chart";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useAnalyticStore from "../../stores/Analytic";

export default function Analytics() {
  const [analyticsData, setanalyticsData] = useState([]);
  const analyticsEvent = useAnalyticStore((state) => state.analyticsEvent);
  const [range, setRange] = useState("all");
  // console.log(analyticsEvent);

  async function fetchData() {
    try {
      const response = await axios.get(
        `http://localhost:8000/analytics?q1=${analyticsEvent}&q2=${range}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setanalyticsData(response.data);
    } catch (e) {
      console.log(e);
      return toast.error(e.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, [analyticsEvent, range]);

  // Default to "All"

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    //console.log(selectedValue);
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
