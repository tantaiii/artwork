import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize({
  dialect: "mssql",
  host: process.env.SQLSERVER_HOST || "127.0.0.1", // Đổi 'localhost' thành '127.0.0.1' để tránh lỗi resolve IPv6 (::1)
  port: Number(process.env.SQLSERVER_PORT) || 1433,
  database: process.env.SQLSERVER_DB || "ArtHubDB",
  username: process.env.SQLSERVER_USER || "sa",
  password: process.env.SQLSERVER_PASSWORD || "Badjnh123@",
  dialectOptions: {
    options: {
      encrypt: false,               // Bắt buộc set false khi chạy local
      trustServerCertificate: true, // Bắt buộc set true để qua mặt SSL Certificate
      enableArithAbort: true,
    },
  },
  logging: false,
  define: {
    timestamps: false,
  },
});

let isConnected = false;

export const connectSqlDB = async (): Promise<void> => {
  if (isConnected) return;
  try {
    const { initSqlModels } = await import("../models/sql");
    initSqlModels(sequelize);

    await sequelize.authenticate();
    isConnected = true;
    console.log("[SQL Server] Connected successfully to", process.env.SQLSERVER_DB || "ArtHubDB");
  } catch (error) {
    console.error("[SQL Server] Connection failed:", error);
    process.exit(1);
  }
};