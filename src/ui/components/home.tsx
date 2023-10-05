import { useNavigate } from 'react-router-dom';

export default function Home() {
  const nav = useNavigate();

  const handleClick = () => {
    nav('/a');
  }

  return <>
    <button className="btn btn-primary btn-sm" onClick={handleClick}>Hi</button>
  </>
}
