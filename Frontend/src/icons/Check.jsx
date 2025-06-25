export default function Check({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i class="fa-solid fa-check" style={{ ...styles }} onClick={onClick}></i>
    </div>
  );
}
