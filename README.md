# api

> Api for Eventsapp

## API documentation

#Auth Token

All endpoints includes an auth token.
How to take a token?
1) create an account (POST /users)
2) Go to /authentication (support only POST)
And pass {
  "email": "your@mail.ru",
  "password": "qwerty",
  "strategy": "local"
}
Response {
    "accessToken": "YOUR TOKEN"
}

#users

uri /users
```
GET
Request params {}
Response {
  "total": 1,
  "limit": 10,
  "skip": 0,
  "data": [
    {
      "id": 1,
      "email": "mamaev-ali@inbox.ru",
      "name": "First",
      "city": "last",
      "phone": 1231231,
      "auth0Id": null,
      "facebookId": null,
      "createdAt": "2018-12-03T16:26:25.489Z",
      "updatedAt": "2018-12-03T16:26:25.489Z"
    }
  ]
}

Post
Request params {
  "email": "mamaev-ali3@inbox.ru", String
  "password": "somePassword",      String
  "name": "First",                 String
  "city": "last",                  String
  "phone": "1231231"               Number
}
Respone {
  "id": 3,
  "email": "mamaev-ali3@inbox.ru",
  "name": "First",
  "city": "last",
  "phone": 1231231,
  "updatedAt": "2018-12-03T18:58:33.043Z",
  "createdAt": "2018-12-03T18:58:33.043Z",
  "auth0Id": null,
  "facebookId": null
}
For getting data by GET methods, you must be you)
GET /users/{id}
Request {
  token
}
Response {
    "id": 1,
    "email": "mamaev-ali@inbox.ru",
    "name": "nwe",
    "city": "last",
    "phone": 1231231,
    "auth0Id": null,
    "facebookId": null,
    "createdAt": "2018-12-03T16:26:25.489Z",
    "updatedAt": "2018-12-08T16:23:19.371Z",
    "friends": [
        {
            "id": 2,
            "name": "changed",
            "city": "last",
            "phone": 1231231,
            "createdAt": "2018-12-03T16:26:37.563Z",
            "user_followers": {
                "id": 2
            }
        }
    ],
    "events": [
        {
            "id": 1,
            "title": "event title",
            "description": "event description",
            "city": "event city",
            "hashtags": [
                "some",
                "tags"
            ],
            "startEvent": "2020-01-01T00:00:00.000Z",
            "endEvent": "2020-01-02T00:00:00.000Z",
            "createdAt": "2018-12-03T17:18:40.834Z",
            "updatedAt": "2018-12-03T17:18:40.834Z",
            "createdBy": 2,
            "event_followers": {
                "id": 1
            },
            "author": {
                "id": 2,
                "name": "changed",
                "city": "last",
                "phone": 1231231,
                "createdAt": "2018-12-03T16:26:37.563Z"
            }
        }
    ],
    "groups": [
        {
            "id": 1,
            "title": "first g",
            "createdAt": "2018-12-03T16:27:37.447Z",
            "updatedAt": "2018-12-03T16:27:37.447Z",
            "user_group": {
                "id": 1
            }
        }
    ]
}
Same for POST PATCH /users/{id}
```

#events

uri /events
```
GET (FIND all events where startEvent >= now and if hashtags passed - check some includes for hashtags)
Request params {
  token,
  // hashtags[]: 'one',
  // hashtags[]: 'two'
}
Response{
    "total": 1,
    "limit": 10,
    "skip": 0,
    "data": [
        {
            "id": 1,
            "title": "event title",
            "description": "event description",
            "city": "event city",
            "hashtags": [
                "some",
                "tags"
            ],
            "startEvent": "2020-01-01T00:00:00.000Z",
            "endEvent": "2020-01-02T00:00:00.000Z",
            "createdAt": "2018-12-03T17:18:40.834Z",
            "updatedAt": "2018-12-03T17:18:40.834Z",
            "createdBy": 2,
            "followers": [
                {
                    "id": 1,
                    "name": "nwe",
                    "city": "last",
                    "phone": 1231231,
                    "createdAt": "2018-12-03T16:26:25.489Z"
                }
            ],
            "author": {
                "id": 2,
                "name": "changed",
                "city": "last",
                "phone": 1231231,
                "createdAt": "2018-12-03T16:26:37.563Z"
            }
        }
    ]
}

POST
Request params {
  "title": "event title",             String
  "description": "event description", String
  "city": "event city",               String
  "hashtags": ["some", "tags"],       [String]
  "startEvent": "2020-01-01",         Date
  "endEvent": "2020-01-02"            Date
  //"createdBy": "1"                  Get automaticly by a token
}
Response {
    "id": 1,
    "title": "event title",
    "description": "event description",
    "city": "event city",
    "hashtags": [
        "some",
        "tags"
    ],
    "startEvent": "2020-01-01T00:00:00.000Z",
    "endEvent": "2020-01-02T00:00:00.000Z",
    "createdBy": 2,
    "updatedAt": "2018-12-03T17:18:40.834Z",
    "createdAt": "2018-12-03T17:18:40.834Z"
}
GET /events/{id} - make an internal create call to event-followers service in sub-to-group hook
POST PATCH /events/{id}
```
uri event-messages
```
For getting any data by GET, FIND methods, you must be associated with a current event
GET
Request params {
  token
  "groupId": "eventId"
}
Response {
    "total": 2,
    "limit": 10,
    "skip": 0,
    "data": [
        {
            "id": 1,
            "text": "MSG text",
            "createdAt": "2018-12-03T18:47:57.469Z",
            "updatedAt": "2018-12-03T18:47:57.469Z",
            "eventId": 1,
            "userId": 2,
            "event": {
                "id": 1
            },
            "user": {
                "id": "2",
                "name": "changed"
            }
        },
        {
            "id": 17,
            "text": "some",
            "createdAt": "2018-12-08T16:07:11.834Z",
            "updatedAt": "2018-12-08T16:07:11.834Z",
            "eventId": 1,
            "userId": 1,
            "event": {
                "id": 1
            },
            "user": {
                "id": "1",
                "name": "nwe"
            }
        }
    ]
}

POST
Request params {
  token
  "text": "MSG text", String
  "eventId": "1"      EventId
  //"userId": "1"     Get automaticly by a token
}
Response {
  "id": 1,
  "text": "MSG text",
  "eventId": 1,
  "userId": 2,
  "updatedAt": "2018-12-03T18:47:57.469Z",
  "createdAt": "2018-12-03T18:47:57.469Z"
}
GET POST PATCH /event-messages/{id}
```

#groups (like a DM)

uri /groups
```
GET Give you only following groups
Request params {
  token
}
Response {
    "id": 1,
    "title": "first g",
    "createdAt": "2018-12-03T16:27:37.447Z",
    "updatedAt": "2018-12-03T16:27:37.447Z",
    "users": [
        {
            "id": 1,
            "name": "nwe",
            "city": "last",
            "phone": 1231231,
            "createdAt": "2018-12-03T16:26:25.489Z"
        }
    ],
    "messages": [
        {
            "id": 1,
            "text": "f g m",
            "createdAt": "2018-12-03T16:27:52.266Z",
            "updatedAt": "2018-12-03T16:27:52.266Z",
            "groupId": 1,
            "userId": 1,
            "user": {
                "id": 1,
                "name": "nwe"
            }
        }
    ]
}

Post
Request params {
  "title": "Some title" String
}
Response {
  "id": 2,
  "title": "Some title",
  "updatedAt": "2018-12-03T18:54:27.069Z",
  "createdAt": "2018-12-03T18:54:27.069Z"
}
GET /groups/{id} - For accessing group info, creator of the current group must associate you with this group.(user-group)
DELETE POST PATCH /groups/{id}
```
uri /group-messages
```
GET
Request params {
  token
  "groupId": "groupId"
}
Respone {
    "total": 1,
    "limit": 10,
    "skip": 0,
    "data": [
        {
            "id": 1,
            "text": "f g m",
            "createdAt": "2018-12-03T16:27:52.266Z",
            "updatedAt": "2018-12-03T16:27:52.266Z",
            "groupId": 1,
            "userId": 1,
            "group": {
                "id": 1
            },
            "user": {
                "id": "1",
                "name": "nwe"
            }
        }
    ]
}
Post
Request params {
  "text": "some", String
  "groupId": "1", GroupId
  //"userId": "1" Get automaticly by a token
}
Response {
  "id": 2,
  "text": "some",
  "groupId": 1,
  "userId": 2,
  "updatedAt": "2018-12-03T19:05:17.356Z",
  "createdAt": "2018-12-03T19:05:17.356Z"
}
GET /group-messages/{id} Doesn't support
Patch Delete /group-messages/{id} - For accessing this, you must be author of current message
```

## Association

For adding association user-to-user:
```
uri /user-followers
Request params {
  followingId: "UserId"
}
```

For user-to-event
```
uri /event-followers
Request params {
  followingId: "EventId"
}
```

For user-to-group
```
uri /user-group
Request params {
  followerId: 'UserId',
  followingId: "GroupId"
}
For adding association with this group, you must be a creator of it.
Delete /user-group/{id} You must be a creator of current group or your id must be equal to followerId
```


## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/), [yarn](https://yarnpkg.com/lang/en/) and [postgresql](https://www.postgresql.org) installed.
2. Install your dependencies

    ```
    git clone https://github.com/netScaP/Eventsapp;
    cd Eventsapp/api;
    yarn
    ```

3. Edit field "postgres" in default.json for accessing to DB

4. Start your app

    ```
    yarn start
    ```
    or
    ```
    yarn run dev
    ```

## Testing

Make sure that you have a `eventsapi_test` postgresql db and set the connection string in `config/test.json`.

Simply run `yarn test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

How to pass hashtags like an array? (At least in Postman)
```
Request params {
  hashtags[]: 'one',
  hashtags[]: 'two'
}
```

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Changelog

__1.0.0__

- Initial release

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
