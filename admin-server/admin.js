import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";

import { sequelize, Reservation, Concert } from "./databases.js";

// AdminJS에 Sequelize 어댑터 연결
AdminJS.registerAdapter({
  Database: AdminJSSequelize.Database,
  Resource: AdminJSSequelize.Resource,
});

const adminJsOptions = {
  resources: [{ resource: Reservation }, { resource: Concert }],
  branding: {
    companyName: "My Admin Dashboard",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    softwareBrothers: false, // AdminJS 하단 로고 제거
  },
};

const adminJs = new AdminJS(adminJsOptions);
const router = AdminJSExpress.buildRouter(adminJs);

export { adminJs, router };