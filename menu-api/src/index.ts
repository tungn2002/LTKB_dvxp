/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { itemsRouter } from "./items/items.router";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";



dotenv.config();
/**
 * App Variables
 */
if (!process.env.PORT) {
    process.exit(1);
 }
 
 const PORT: number = parseInt(process.env.PORT as string, 10);
 
 const app = express();
/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.urlencoded())//khi dung post chuyen sang json
app.use(express.json());
app.use("/api/menu/items", itemsRouter);//duongdan+ ten hamxl
app.set("view engine","ejs");//set view engine
app.set("views","./src/views");//chi ra thu muc chua view
app.use('/',express.static('public'));//ket noi css trong file public

//
//app.use(errorHandler);
//app.use(notFoundHandler);

/**
 * Server Activation
 */
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });