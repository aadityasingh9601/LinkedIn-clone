export default function UserAvatarIcon({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        className="fa-solid fa-circle-user"
        style={{...styles }}
        onClick={onClick}
      ></i>
    </div>
  );
}
