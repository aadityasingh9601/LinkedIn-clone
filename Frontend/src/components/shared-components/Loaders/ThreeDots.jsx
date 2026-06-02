import { ThreeDots } from "react-loader-spinner";

export default function Spinner({ height = 80, width = 80 }) {
  return (
    <ThreeDots
      visible={true}
      height={height}
      width={width}
      color="#4fa94d"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
}
