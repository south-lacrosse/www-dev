"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("@getflywheel/local/main");
const MariadbService_1 = __importDefault(require("./MariadbService"));
function default_1() {
    main_1.registerLightningService(MariadbService_1.default, 'mariadb', '10.11.10');
}
exports.default = default_1;
