import "./JobFitStats.css";

export default function JobFitStats({ jobFitStats, jobSkills }) {
  const matchedScore = jobFitStats?.matchedScore;
  return (
    <div className="jobfitstats">
      <div
        style={{
          backgroundColor: "rgb(218, 235, 209)",
        }}
      >
        📊Match score: {matchedScore}%
      </div>

      <div
        style={{
          backgroundColor: "rgb(232,232,232)",
        }}
      >
        {jobFitStats?.matchedSkills?.length} out of {jobSkills?.length} skills
        matched:
        {jobFitStats?.matchedSkills?.map((s) => {
          return "✅" + s + " ";
        })}
      </div>

      <div
        style={{
          backgroundColor: "#fddcdc",
        }}
      >
        You're missing:
        {jobFitStats?.missingSkills?.map((s) => {
          return "❌" + s + " ";
        })}
      </div>

      <div
        style={{
          backgroundColor: "#fef9c3",
        }}
      >
        💡Suggested actions:
        {jobFitStats?.missingSkills?.map((s) => {
          return "[ Learn " + s + " ]";
        })}
        [ Apply anyway ].
      </div>

      <div
        style={{
          backgroundColor: " #e0f2fe",
        }}
      >
        📌Recommended resources to learn{" "}
      </div>

      <div>
        {matchedScore >= 80
          ? "🎯 You’re highly likely to be a great fit for this job!"
          : matchedScore >= 60 && matchedScore < 80
          ? "💪 You meet most requirements – consider applying!"
          : matchedScore >= 40 && matchedScore < 60
          ? "⚠️ You match some skills - try upskilling or apply with a strong case."
          : "🌱 You currently lack many of the required skills - learning them can help a lot!"}
      </div>

      <div className="note">
        <span style={{ fontWeight: "bold" }}>ℹ️ Note:</span> This is just an
        automated estimate. Actual job success depends on various factors like
        experience, portfolio, and communication skills too.
      </div>
    </div>
  );
}
