import { Oval } from "react-loader-spinner";

export default function Spinner() {
  return (
    <Oval
      height={23}
      width={23}
      color="white"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="white"
      strokeWidth={4}
      strokeWidthSecondary={2}
    />
  );
}
