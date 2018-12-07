import * as merge from "webpack-merge";
import common from "./env/common";

function getConfig(env: string = "development") {
    let envConfig = null;
    
    switch (env) {
        case "development":
            envConfig = require("./env/debug").default;
            break;

        case "production":
            envConfig = require("./env/release").default;
            break;

        default:
            throw new Error("Invalid env type");
    }

    return merge.smart(common, envConfig);
}

export default getConfig;
