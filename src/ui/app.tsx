import * as ReactDOM from 'react-dom/client';

function render() {
  const root = ReactDOM.createRoot(document.getElementById('root')!);

  root.render(
    <div>
      <nav data-bs-theme="dark" className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Budge</span>
        </div>
      </nav>
      <div className='container-fluid'>
        d
      </div>
    </div>
  );
}

render();
