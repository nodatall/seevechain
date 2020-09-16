# [seevechain](https://seevechain.com/)

A realtime VeChain visualizer

## Run locally

### .env file

Make a file called `.env` in the `seevechain` directory.
The contents of the file should be:

```
DATABASE_URL=postgresql://localhost/seevechain
PORT=1337
TIME_DIFFERENCE=9
NODE_ENV=development
```


### Database
You must have postgresql installed and running. On Mac:

```
brew install postgresql
brew start postgresql
```

Set up the database with:

```
./scripts/db-setup
```

### Start server

```
npm run start:dev
```

Use a browser to navigate to `http://localhost:1337/`
