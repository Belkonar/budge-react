import { useNavigate } from 'react-router-dom';

export default function Nav() {
  const nav = useNavigate();

  return <div className="col-md-3">
    <div className="card">
      <div className='card-body'>
        <ul data-bs-theme="dark" className="nav flex-column ">
          <li className="nav-item">
            <span className="nav-link" onClick={() => nav('/')}>Active</span>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Link</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Link</a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" aria-disabled="true">Disabled</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
}
