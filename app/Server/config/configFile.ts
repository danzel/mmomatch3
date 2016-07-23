import ServerConfig = require('./serverConfig');
import SocketServerConfig = require('./socketServerConfig');

interface ConfigFile {
	server: ServerConfig;
	socketServer: SocketServerConfig;

	sqlite3StorageFilename: string;
}

export = ConfigFile;