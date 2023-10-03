// import 'bootstrap/dist/css/bootstrap.min.css';

import './index.scss';
import './ui/app'

declare global {
  interface Window {
    dataApi: DataApi;
  }
}


window.dataApi.insertOne("hi", { 'name': 'bob' }).then((result) => {
  console.log(result);
})
