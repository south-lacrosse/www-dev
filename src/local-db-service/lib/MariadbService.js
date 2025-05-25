"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LocalMain = __importStar(require("@getflywheel/local/main"));
const path_1 = __importDefault(require("path"));
const slash_1 = __importDefault(require("slash"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const delay_1 = __importDefault(require("delay"));
// todo - update to implement LocalMain.LightningDBService next time we bump the minimum Local version on the services
class MariadbService extends LocalMain.LightningService {
    constructor() {
        super(...arguments);
        this.serviceName = 'mariadb';
        this.binVersion = '10.11.10';
    }
    get configTemplatePath() {
        return path_1.default.join(__dirname, '../conf');
    }
    get bins() {
        return {
            [LocalMain.LightningServicePlatform.Darwin]: {
                mysql: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Darwin], 'mysql'),
                mysqld: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Darwin], 'mysqld'),
                mysqladmin: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Darwin], 'mysqladmin'),
                mysqldump: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Darwin], 'mysqldump'),
                mysql_install_db: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Darwin], 'mysql_install_db'),
                mysqlcheck: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Darwin], 'mysqlcheck'),
            },
            [LocalMain.LightningServicePlatform.Linux]: {
                mysql: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Linux], 'mysql'),
                mysqld: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Linux], 'mysqld'),
                mysqladmin: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Linux], 'mysqladmin'),
                mysqldump: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Linux], 'mysqldump'),
                mysql_install_db: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Linux], 'mysql_install_db'),
                mysqlcheck: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Linux], 'mysqlcheck'),
            },
            [LocalMain.LightningServicePlatform.Win32x64]: {
                mysql: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Win32x64], 'mysql.exe'),
                mysqld: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Win32x64], 'mysqld.exe'),
                mysqladmin: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Win32x64], 'mysqladmin.exe'),
                mysqldump: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Win32x64], 'mysqldump.exe'),
                mysql_install_db: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Win32x64], 'mysql_install_db.exe'),
                mysqlcheck: path_1.default.join(this.$PATHs[LocalMain.LightningServicePlatform.Win32x64], 'mysqlcheck.exe'),
            }
        };
    }
    get requiredPorts() {
        return {
            MYSQL: 1,
        };
    }
    get $PATHs() {
        return {
            [LocalMain.LightningServicePlatform.Darwin]: path_1.default.join(__dirname, '../bin', 'darwin', 'bin'),
            [LocalMain.LightningServicePlatform.Win32x64]: path_1.default.join(__dirname, '../bin', 'win64', 'bin'),
            [LocalMain.LightningServicePlatform.Linux]: path_1.default.join(__dirname, '../bin', 'linux', 'bin'),
        };
    }
    get socket() {
        return path_1.default.join(this.runPath, 'mysqld.sock');
    }
    get dataPath() {
        return (0, slash_1.default)(path_1.default.join(this.runPath, 'data'));
    }
    preprovision() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupMysqlDatadir();
        });
    }
    provision() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupMysqlUser();
            yield this.setupDatabase();
        });
    }
    setupMysqlDatadir() {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info('Initializing MySQL datadir...', { dataPath: this.dataPath });
            yield fs_extra_1.default.ensureDir(this.dataPath);
            /**
             * MariaDB does not support --initialize so we have to use mysql_install_db.exe which differs even from
             * mysql_install_db.
             */
            yield LocalMain.execFilePromise(this.bin.mysql_install_db, [
                `--datadir=${this.dataPath}`,
                `--port=${this.port}`,
                `--socket=${this.socket}`,
                `--password=root`,
                `--default-user=root`,
            ]);
        });
    }
    setupMysqlUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info('Setting up MySQL user...');
            yield this.waitForDB(true);
            try {
                yield LocalMain.execFilePromise(this.bin.mysql, [
                    '--password=',
                    '-e',
                    `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';`
                ], {
                    env: {
                        MYSQL_HOME: this.configPath,
                    }
                });
            }
            catch (e) {
                this._logger.error('Error setting up MySQL user', { stack: e.stack });
            }
        });
    }
    waitForDB(noPassword = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let latestError;
            const maxTries = 5;
            const baseDelay = 1000;
            const maxDelay = 10000;
            for (let i = 0; i < maxTries; i++) {
                try {
                    yield LocalMain.execFilePromise(this.bin.mysqladmin, [
                        ...noPassword ? ['--password='] : [],
                        'ping'
                    ], {
                        env: {
                            MYSQL_HOME: this.configPath,
                        }
                    });
                    this._logger.debug('Database responded to ping.');
                    return true;
                }
                catch (e) {
                    const delayMs = Math.min(maxDelay, baseDelay * Math.pow(2, i));
                    this._logger.info(`Database connection attempt ${i + 1} failed. Retrying in ${delayMs} ms.`);
                    yield (0, delay_1.default)(delayMs);
                    latestError = e;
                }
            }
            this._logger.error(`Database did NOT respond to ping after ${maxTries} tries.`, { stack: latestError.stack });
            throw latestError;
        });
    }
    setupDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info('Creating MySQL database...');
            try {
                yield LocalMain.execFilePromise(this.bin.mysql, [
                    '-e',
                    `CREATE DATABASE local;`
                ], {
                    env: {
                        MYSQL_HOME: this.configPath,
                    }
                });
            }
            catch (e) {
                this._logger.error('Error creating database.', { stack: e.stack });
                throw e;
            }
        });
    }
    get configVariables() {
        return {
            datadir: this.dataPath,
            port: this.port,
            socket: this.socket.replace('\\', '\\\\'),
            clientAddress: '127.0.0.1',
            bindAddress: '127.0.0.1',
        };
    }
    start() {
        fs_extra_1.default.ensureDirSync(this.runPath);
        return [
            {
                name: 'mariadb',
                binPath: this.bin.mysqld,
                args: [`--defaults-file=${(0, slash_1.default)(path_1.default.join(this.configPath, `my.cnf`))}`],
            }
        ];
    }
}
exports.default = MariadbService;
