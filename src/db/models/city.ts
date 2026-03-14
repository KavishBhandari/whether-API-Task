"use strict";

import { city } from "../../interfaces/city";

import { Model, DataTypes, Sequelize, Optional } from "sequelize";
import { library } from "../../utils/library";

class CityModel extends Model<city> implements city {
  name: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deleted_at: Date;
  static initModel(sequelize: Sequelize): void {
    CityModel.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          unique: true,
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
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "city",
        tableName: "city",
      },
    );
  }

  static associateModel(): void {
    CityModel.hasMany(library.db.forecast, {
      foreignKey: "cityId",
    });
  }
}

export default CityModel;
