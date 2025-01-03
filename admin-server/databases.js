// database.js (예시, ESM)
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // process.env.* 읽어옴

const sequelize = new Sequelize(
  process.env.DB_NAME, // 예: "my_database"
  process.env.DB_USER, // 예: "root"
  process.env.DB_PASSWORD, // 예: "password"
  {
    host: process.env.DB_HOST, // 예: "localhost"
    dialect: "mysql",
    logging: false,
  }
);

// -- 모델 정의 --
const Reservation = sequelize.define(
  "Reservation", // 모델명 (관습적으로 단수 + 첫 글자 대문자로)
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    concert_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seat: {
      type: DataTypes.STRING(50), // VARCHAR(50)
      allowNull: false,
    },
  },
  {
    tableName: "reservations", // 실제 테이블 이름
    timestamps: false, // createdAt, updatedAt 자동 컬럼 X
  }
);

const Concert = sequelize.define(
  "Concert",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "concerts", // DB에서 실제 사용하는 테이블 이름
    timestamps: false,
  }
);

// DB 테이블 동기화
sequelize.sync({ force: false });

// ESM에서는 export 문으로 내보내기
export { sequelize, Reservation, Concert };
