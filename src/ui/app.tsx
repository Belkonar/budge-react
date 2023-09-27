import * as ReactDOM from 'react-dom/client';

function render() {
  const root = ReactDOM.createRoot(document.getElementById('root')!);

  root.render(<div>Hello World</div>);
}

render();
