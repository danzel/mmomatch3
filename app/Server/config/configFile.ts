import ServerConfig = require('./serverConfig');
import SocketServerConfig = require('./socketServerConfig');

interface ConfigFile {
	server: ServerConfig;
	socketServer: SocketServerConfig;
}

export = ConfigFile;