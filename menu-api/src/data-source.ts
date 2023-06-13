import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "qlrcp",
    synchronize: true,//true: tu tao database dua theo entity da tao
    logging: true,
    entities: ["./src/entity/*.ts"],//cac entity|muon duyetv all ["./src/entity/*.ts"]
    subscribers: [],
    migrations: [],
    //ssl:true
})

//3306 1433

