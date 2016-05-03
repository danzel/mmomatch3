declare module "raven-js" {
	interface RavenOptions {
		logger?: string;
		release?: string;
		serverName?: string;
		tags?: any;
		whitelistUrls?: Array<string>;
		ignoreErrors?: Array<string>;
		ignoreUrls?: Array<string>;
		includePaths?: Array<string>;
		dataCallback?: (data: any) => void;
		shouldSendCallback?: (data: any) => boolean;
		maxMessageLength?: number;
		transport?: ({ url: string, data: any, auth: { sentry_version: string, sentry_cilent: string, sentry_key: string }, onSuccess: Function, onFailure: Function });
		allowSecretKey?: boolean;
	}
	class Raven {

		static config(dsn: string, options?: RavenOptions): Raven;
		install(): void;

		static captureException(e: Error): void;
		static context(func: Function): void;
		static setUserContext(data: any): void;
		static wrap(func: Function): Function;
	}
	export = Raven;
}