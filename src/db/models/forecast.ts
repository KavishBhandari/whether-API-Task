'use strict';

import { forecast } from "../../interfaces/forecast";

import { Model, DataTypes, Sequelize, Optional } from "sequelize";
import { library } from "../../utils/library";

class ForecastModel extends Model<forecast> implements forecast {
  id: number;
  cityId: number;
  temperature: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  deleted_at: Date;

  static initModel(sequelize: Sequelize): void {
    ForecastModel.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        cityId: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        temperature: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "forecast",
        tableName: "forecast",
      }
    );
  };

  static associateModel(): void {
    ForecastModel.belongsTo(library.db.city, {
      foreignKey: "cityId",
    });
  };
};
export default ForecastModel;