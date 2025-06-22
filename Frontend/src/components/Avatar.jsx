import "./Avatar.css";

export default function Avatar({ url, height = {}, width = {} }) {
  return (
    <div className="avatar">
      <img src={url} alt="" />
    </div>
  );
}
