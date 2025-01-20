### Structure
server - express application
web - nextjs application

### How to run
1. Run the following to start a postgres container
```bash
docker run --name dropbox-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres -c log_statement=all

docker exec -it dropbox-postgres psql -U postgres -c "CREATE DATABASE dropbox"
```

2. Run the following to start the server
```bash
cd server 
npm install
npm run prisma:migrate
npm run prisma:gen
npm start
```

3. Run the following to start the web client
```bash
cd ../web
npm install
npm run dev
```

4. Open http://localhost:3001 in your browser
