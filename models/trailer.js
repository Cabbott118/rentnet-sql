'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trailer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    }
    // When sending JSON response to client, id and user_id is hidden
    toJSON() {
      return { ...this.get(), id: undefined, user_id: undefined };
    }
  }
  Trailer.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      available: {
        type: DataTypes.ENUM,
        values: ['yes', 'no'],
        defaultValue: 'yes',
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'trailers',
      modelName: 'Trailer',
    }
  );
  return Trailer;
};
