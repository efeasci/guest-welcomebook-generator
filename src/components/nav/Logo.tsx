import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="font-semibold text-lg cursor-pointer" 
      onClick={() => navigate("/")}
    >
      Welcome Wizard
    </div>
  );
};

export default Logo;