# Document Share Server
A simple API to support the Document sharer web app. The repo contain basic API's, User authentication, CRUD on documents and document share. The aim of this is just showcase the document share functionality.


## Run locally
1. Add environment variables to `ecosystem.config.js`. Fields for the variables
```
"SMTP_HOST": <SMTP_HOST>,
"SMTP_PORT": <PORT>,
"SMTP_USER": <USER>,
"SMTP_PASS": <PASS>,
"SMTP_FROM": <FROM>,
"MONGOLAB_SILVER_URI": <LOGS_DB_URI>,
"MONGODB_URI": <MAIN_DB_URI>,
"TOKEN_SECRET" <TOKEN_SECRET>:
```
2.
```
npm install
npm start
```

## Future Scope
We can add access level control on the users, (CAN EDIT, READ ONLY, OWNER). Add server monitoring using PM2 exporter (Prometheus), Database monitoring. Can use PMM an open source tool for monitoring.

## Tools Used
I have used PM2 for launching the APP as PM2 enables you to keep applications alive forever, reloads them without downtime, helps you to manage application logging, monitoring, and clustering.
```
PM2
mongoose
NodeJs: v10.0.0,
Npm: 6.x
winston Logger: 2.3.1
winston-mongodb: 2.0.8
Morgan Logger
```

## Licence
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

