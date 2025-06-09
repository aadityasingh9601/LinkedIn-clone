export default function Ellipsis({ onClick = {} }) {
  return (
    <div>
      <i class="fa-solid fa-ellipsis" onClick={onClick}></i>
    </div>
  );
}
