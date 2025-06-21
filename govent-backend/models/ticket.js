import { DataTypes } from 'sequelize'
export default async function (sequelize) {
  return sequelize.define(
    'ticket',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ticket_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      event_option_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      holding_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'ticket', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
