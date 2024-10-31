import { ColorRing } from "react-loader-spinner";

const Loader = () => {
  return (
    <div>
      <ColorRing
        visible={true}
        height={1000}
        width={500}
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    </div>
  );
};
export default Loader;
