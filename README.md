A little learning project based on https://www.youtube.com/watch?v=IUw_TgRhTBE

- A /backend/.env file with mongoDB credentials is required, see example below
```dotenv
PART1STRING=mongodb+srv://
MONGO_USER=myusername
MONGO_PASSWORD=mypassword
MONGO_CLUSTER=@cluster0.1myzm.mongodb.net/
MONGO_DBNAME=mydbname
PART2STRING=?retryWrites=true&w=majority
```
- Backend and client are own services that can be run on their own with `npm start`