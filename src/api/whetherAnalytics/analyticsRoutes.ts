
import catchAsync from "../../utils/catchAsync";

import { library } from "../../utils/library";

import analyticsController from "./analyticsController";

const whetherAnalyticsRoutes = library.express.Router();

whetherAnalyticsRoutes.post("/analytics/cities", catchAsync(analyticsController.citiesAnalytics));

whetherAnalyticsRoutes.get("/analytics/city/:name", catchAsync(analyticsController.singleCityAnalytics));

export default whetherAnalyticsRoutes;