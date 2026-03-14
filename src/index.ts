import { library } from "./utils/library";

import indexRoutes from "./api/apiIndexRoute"

import DatabaseConnection from "./db/index";

const { express, app, dotenv } = library;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(library.path.join(__dirname, "../public")));
app.use("/", indexRoutes);
app.use((req, res, next) => {
  res.status(404).send({
    success: false,
    message: "Route Not Found",
  });
});
(async function () {
  const dbConnect: boolean = await DatabaseConnection.load();
  if (dbConnect) {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Date : ${new Date()}`);
    });
  }
})();