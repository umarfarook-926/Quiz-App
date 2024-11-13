import "./index.css";

const Header = props => {
  const { timerDetails} =props
  const{timerSec}=timerDetails
  return (
    <div className="Header">
      <h1 className="title"> Quiz Application</h1>
      <p className="timer">
        Time Left: <span>{timerSec}</span> Sec
      </p>
    </div>
  );
};

export default Header;
