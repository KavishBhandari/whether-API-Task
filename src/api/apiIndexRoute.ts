import { library } from "../utils/library";

import analyticsRoutes from "./whetherAnalytics/analyticsRoutes";

const apiIndexRoutes = library.express.Router();

apiIndexRoutes.use("/", analyticsRoutes);


export default apiIndexRoutes;