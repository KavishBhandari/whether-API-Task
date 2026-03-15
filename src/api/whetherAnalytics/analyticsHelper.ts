import { Op, Sequelize } from "sequelize";
import { DBHelper } from "../../helper/dbHelper";
import { library } from "../../utils/library";

import axios from "axios";
import { ApiError } from "../../utils/apiError";
import { messages, statusCode } from "../../utils/constant";

const API_KEY = process.env.WEATHER_API_KEY || "15227dc3540e0836f908983a67a9cd6f";

class WhetherAnalyticsHelper {

    fetchForecast = async (city: string) => {

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        console.log(response)

        return response.data.list;
    };

    addCityAndForecastData = async (cities: string[]) => {
        await Promise.all(
            cities.map(async (cityName: string) => {

                const [city] = await library.db.city.findOrCreate({
                    where: { name: cityName }
                });

                const apiForecast = await this.fetchForecast(cityName);

                const daily = apiForecast.filter((f: any) =>
                    f.dt_txt.includes("12:00:00")
                );

                const forecastData = daily.map((f: any) => ({
                    cityId: city.getDataValue("id"),
                    date: f.dt_txt.split(" ")[0],
                    temperature: f.main.temp
                }));

                await library.db.forecast.bulkCreate(forecastData, {
                    ignoreDuplicates: true
                });

            })
        );
    };

    getCityInfo = async () => {

        const avg = await DBHelper.getData(
            library.db.forecast,
            [[Sequelize.fn("AVG", Sequelize.col("temperature")), "averageTemperature"]],
            { where: { deleted_at: null } },
            true,
        );

        const highest = await DBHelper.getData(
            library.db.forecast,
            ["temperature"],
            {
                where: { deleted_at: null },
                include: [{ model: library.db.city, attributes: ["name"] }],
            },
            true,
            ["temperature", "DESC"]
        );

        const lowest = await DBHelper.getData(
            library.db.forecast,
            ["temperature"],
            {
                where: { deleted_at: null },
                include: [{ model: library.db.city, attributes: ["name"] }],
            },
            true,
            ["temperature", "ASC"]
        );

        const hotCities = await DBHelper.getData(
            library.db.forecast,
            ["temperature"],
            {
                where: { deleted_at: null, temperature: { [Op.gt]: 30 } },
                include: [{ model: library.db.city, attributes: ["name"] }],
            },
            false,
            ["temperature", "ASC"]
        );
        const hotCityNames = [...new Set(hotCities.map((c: any) => c.city.name))];

        return {
            averageTemperature: avg?.averageTemperature || avg?.dataValues?.averageTemperature,
            highestTemperature: {
                city: highest?.city?.name,
                temp: highest?.temperature
            },
            lowestTemperature: {
                city: lowest?.city?.name,
                temp: lowest?.temperature
            },
            hotCities: hotCityNames
        };
    };

    singleCityAnalytics = async (cityName: string) => {
        const cityAnalyticsData = await DBHelper.getData(
            library.db.city,
            ["id", "name"],
            {
                where: { deleted_at: null, name: cityName },
                include: [{ model: library.db.forecast, attributes: ["id", "cityId", "date", "temperature"], where: { deleted_at: null } }],
            },
            true
        );


        if(!cityAnalyticsData){
            throw new ApiError(statusCode.BAD_REQUEST, messages.CITY_NOT_FOUND);
        }

        const temps = cityAnalyticsData.forecasts.map((f: any) => f.temperature);

        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);

        const currentTemp = temps[temps.length - 1];

        const warning =
            currentTemp > 35 ? "Temperature above 35°C" : null;

        return {
            city: cityName,
            currentTemperature: currentTemp,
            forecastMin: minTemp,
            forecastMax: maxTemp,
            warning
        };

    };
};

export default new WhetherAnalyticsHelper();