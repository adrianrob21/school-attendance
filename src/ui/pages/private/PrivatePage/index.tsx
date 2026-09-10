import { useNavigate, type NavigateFunction } from "react-router";

const goBack = (navigate: NavigateFunction) => {
  navigate(-1);
};

const PrivatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col mt-4 w-full items-center gap-4">
      <h1 className="text-center text-2xl">Private Page</h1>
      <button onClick={goBack.bind(null, navigate)} type="button">
        Back
      </button>
    </div>
  );
};

export default PrivatePage;
