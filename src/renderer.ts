// import 'bootstrap/dist/css/bootstrap.min.css';

import './index.scss';
import './ui/app'

declare global {
  interface Window {
    dataApi: {
      query: () => Promise<string>;
      exec: () => Promise<string>;
    };
  }
}


window.dataApi.exec().then((result) => {
  console.log(result);
})
