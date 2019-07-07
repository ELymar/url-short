# URL Shortener
## About
- Generates short URL codes (3 chars) supporting up to 65535 codes. 
- Persistance with mongodb 


## How to use:
0. Set up a mongo db instance 
1. Set the following environment variables: 
```
MONGO_CONNECTION_STRING=<your mongodb connection string>
MONGO_DB_NAME=<your dbName e.g. "shortener">
BASE_URL=<your base url e.g. "example.com" >
```
2. Run: 
```
git clone https://github.com/ELymar/url-short.git
cd url-short
npm install
npm start
```

