import './index.css';
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
