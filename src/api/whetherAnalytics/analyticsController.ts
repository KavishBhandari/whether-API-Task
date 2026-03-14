import { ResponseHelper } from "../../helper/responseHelper";
import { messages, statusCode } from "../../utils/constant";
import {
    Request,
    Response,
} from "../../utils/library";

import analyticsHelper from "./analyticsHelper";

class WhetherAnalyticsController {
    citiesAnalytics = async (req: Request, res: Response) => {

        const { cities } = req.body;
        
        await analyticsHelper.addCityAndForecastData(cities);

        const data = await analyticsHelper.getCityInfo();

        ResponseHelper.sendSuccessRes(
            res,
            messages.SUCCESS,
            statusCode.SUCCESS,
            data
        );
    };

    singleCityAnalytics = async (req: Request, res: Response) => {

        const singleCityAnalyticsData = await analyticsHelper.singleCityAnalytics(req.params.name  as string);

        ResponseHelper.sendSuccessRes(
            res,
            messages.SUCCESS,
            statusCode.SUCCESS,
            singleCityAnalyticsData
        );
    };
};

export default new WhetherAnalyticsController();