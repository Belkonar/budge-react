// import 'bootstrap/dist/css/bootstrap.min.css';

import './index.scss';
import './ui/app'
import { dataService } from './ui/data-service';

const request: IpcRequest = {
  kind: 'insertOne',
  collection: 'movies',
  obj: {
    title: 'Star Wars',
    year: 1977,
  },
};

dataService.insertOne('movies', {
  title: 'Star fWars',
  year: 1977,
});
