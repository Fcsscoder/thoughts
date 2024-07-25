const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
const path = require("path");

const app = express();

// Models
const User = require("./models/User");
const Thought = require("./models/Thought");

// Import Routes
const thoughtsRoutes = require("./routes/thoughtsRoutes");
const authRoutes = require("./routes/authRoutes");

// Import Controllers
const ThoughtController = require("./controllers/ThoughtController");

// Banco de Dados
const conn = require("./db/conn");

// Handlebars

app.engine(
  "handlebars",
  exphbs.engine({
    layoutsDir: path.join(__dirname, "views", "layouts"),
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares básicos

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de Sessão
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: path.join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
    },
  })
);

// Middleware de Mensagens Flash

app.use(flash());

// Configurar Sessão no Response
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }
  next();
});

// Rotas
app.use("/pensamentos", thoughtsRoutes);
app.use("/", authRoutes);

app.get("/", ThoughtController.showThoughts);

conn
  .sync()
  // .sync({force: true})
  .then(() => app.listen(process.env.PORT || 3000))
  .catch((err) => console.log(err));
