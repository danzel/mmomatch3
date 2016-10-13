import crypto = require('crypto');


interface User {
	provider: string;
	providerId: string;
};

class UserTokenProvider {
	private users: {[token: string]: User} = {};

	getTokenForUser(user: User): string {
		let token = crypto.randomBytes(16).toString('hex');
		this.users[token] = user;
		return token;
	}

	getUserForToken(token: string): User {
		return this.users[token];
	}
};

export = UserTokenProvider;