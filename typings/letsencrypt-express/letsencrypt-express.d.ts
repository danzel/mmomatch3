/// <reference path="../node/node.d.ts" />

declare module "letsencrypt-express" {
	import * as http from "http";
	import * as https from "https";

	interface ApprovalOptions {
		domains: Array<string>;
		email: string;
		agreeTos: boolean;
	}

	interface LexOptions {
		server: string,
		email: string,
		agreeTos: boolean,
		approveDomains: Array<string>;
	}

	class LEX {

		static debug: boolean;
		static testing(): LEX;

		static create(options: LexOptions): LEX.LetsEncryptExpress;

		static createAcmeResponder(lex: LEX.LetsEncryptExpress, redirectHttps: (req: http.IncomingMessage, res: http.ServerResponse) => void): (req: http.IncomingMessage, res: http.ServerResponse) => void;
	}

	module LEX {
		class LetsEncryptExpress {
			//onRequest, listen

			httpsOptions: https.ServerOptions;

			middleware(childListener?: (request: http.IncomingMessage, response: http.ServerResponse) => void): (request: http.IncomingMessage, response: http.ServerResponse) => void;
		}
	}

	export = LEX;
}