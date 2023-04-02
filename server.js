const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const jwt = require("jsonwebtoken");
const { createUser, getUserByUsername, users } = require("./users");
const { authMiddleware } = require('./middlewares');
const cors = require('@koa/cors');
const bcrypt = require('bcrypt');

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(cors());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

router.post("/register", async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { error: "Please provide both username and password" };
    return;
  }

  const userExists = getUserByUsername(username);
  if (userExists) {
    ctx.status = 409;
    ctx.body = { error: "User already exists" };
    return;
  }

  const user = await createUser(username, password);

  const token = jwt.sign({ id: user.id }, "secret_key", { expiresIn: "1d" });

  ctx.status = 201;
  ctx.body = { token };
});

router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { error: 'Please provide both username and password' };
    return;
  }

  const user = getUserByUsername(username);

  if (!user) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid credentials' };
    return;
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid credentials' };
    return;
  }

  const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1d' });

  ctx.status = 200;
  ctx.body = { token };
});


router.get('/users', authMiddleware, async (ctx) => {
  const usersToResponse = users.map((user) => ({ id: user.id, username: user.username }));
  ctx.body = { users: usersToResponse };
});

