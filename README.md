# URL Shortener
## About
- Generates short URL codes (3 chars) supporting up to 65535 codes. 
- Persistence with mongodb 


## How to use:
0. Set up a mongo db instance 
1. Set the following environment variables: 
```
MONGO_CONNECTION_STRING=<e.g. "mongodb://localhost:27017">
MONGO_DB_NAME=<e.g. "shortener">
BASE_URL=<e.g. "example.com">
```
2. Run: 
```
git clone https://github.com/ELymar/url-short.git
cd url-short
npm install
npm start
```

