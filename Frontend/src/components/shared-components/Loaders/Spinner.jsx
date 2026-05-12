import { Oval } from "react-loader-spinner";

export default function Spinner({height=23,width=23}) {
  return (
    <Oval
      height={height}
      width={width}
      color="white"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="white"
      strokeWidth={5}
      strokeWidthSecondary={2}
    />
  );
}
