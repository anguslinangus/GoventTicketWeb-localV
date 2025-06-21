import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'user_order',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'LINE Pay, 信用卡',
      },
      total: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      order_info: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      coupon_discount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      points_discount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      points_rebate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      LinePay_returnData: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'user_order', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
