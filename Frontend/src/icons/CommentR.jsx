export default function CommentR({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        className="fa-regular fa-comment"
        style={{ display: "inline-block", ...styles }}
        onClick={onClick}
      ></i>
    </div>
  );
}
