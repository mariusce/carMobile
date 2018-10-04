import {
    GET_USERS
} from '../actions/users';

import {FLUSH_STATE} from '../constants';

const INITIAL_STATE = {
  data: null,
  isFetching: false
};

let dummies = [
  {
    "_id": "5b97e3f904211d2e8b5f52ae",
    "roles": [],
    "firstName": "Mircea1",
    "lastName": "Badea1",
    "email": "badea1@c-scale.ro",
    "phone": "40727760121",
    "clients": [],
    "providers": [],
    "products": [],
    "awards": [],
    "createdAt": "2018-09-11T15:49:13.262Z",
    "updatedAt": "2018-09-11T15:49:13.262Z",
    "__v": 0
  },
  {
    "_id": "5b97e3f904211d2e8b5f52ae",
    "roles": [],
    "firstName": "Mircea2",
    "lastName": "Badea2",
    "email": "badea2@c-scale.ro",
    "phone": "40727760122",
    "clients": [],
    "providers": [],
    "products": [],
    "awards": [],
    "createdAt": "2018-09-11T15:49:13.262Z",
    "updatedAt": "2018-09-11T15:49:13.262Z",
    "__v": 0
  },
  {
    "_id": "5b97e3f904211d2e8b5f52ae",
    "roles": [],
    "firstName": "Mircea3",
    "lastName": "Badea3",
    "email": "badea3@c-scale.ro",
    "phone": "40727760123",
    "clients": [],
    "providers": [],
    "products": [],
    "awards": [],
    "createdAt": "2018-09-11T15:49:13.262Z",
    "updatedAt": "2018-09-11T15:49:13.262Z",
    "__v": 0
  },
  {
    "_id": "5b97e3f904211d2e8b5f52ae",
    "roles": [],
    "firstName": "Mircea4",
    "lastName": "Badea4",
    "email": "badea4@c-scale.ro",
    "phone": "40727760124",
    "clients": [],
    "providers": [],
    "products": [],
    "awards": [],
    "createdAt": "2018-09-11T15:49:13.262Z",
    "updatedAt": "2018-09-11T15:49:13.262Z",
    "__v": 0
  },
  {
    "_id": "5b97e3f904211d2e8b5f52ae",
    "roles": [],
    "firstName": "Mircea5",
    "lastName": "Badea5",
    "email": "badea5@c-scale.ro",
    "phone": "40727760125",
    "clients": [],
    "providers": [],
    "products": [],
    "awards": [],
    "createdAt": "2018-09-11T15:49:13.262Z",
    "updatedAt": "2018-09-11T15:49:13.262Z",
    "__v": 0
  },
  {
    "_id": "5b97e3f904211d2e8b5f52ae",
    "roles": [],
    "firstName": "Mircea6",
    "lastName": "Badea6",
    "email": "badea6@c-scale.ro",
    "phone": "40727760123",
    "clients": [],
    "providers": [],
    "products": [],
    "awards": [],
    "createdAt": "2018-09-11T15:49:13.262Z",
    "updatedAt": "2018-09-11T15:49:13.262Z",
    "__v": 0
  },
];

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_USERS:
      return Object.assign({}, state, {
        data: dummies,
//      data: action.value && action.value.data || [],
        isFetching: false
      });
    case FLUSH_STATE:
      return Object.assign({}, state, INITIAL_STATE);
    default:
      return state;
  }
}
