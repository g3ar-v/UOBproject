import * as Msal from 'msal';
import React, { Component } from "react";
import { AuthProvider } from './authContext';

let redirectUri = 'https://trackatt.azurewebsites.net/callback';
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
	redirectUri = "http://" + window.location.host + '/callback'; 
}

let msalConfig = {
  	auth: {
		clientId: '809f7675-ba92-4140-b46f-0f2dbdeedde6',
		authority: 'https://login.microsoftonline.com/b0dbbbe6-b552-4cb0-a0a4-ceed818533b1',
		redirectUri: redirectUri
  	},
	  cache: {
		  cacheLocation: "localStorage",//keeps login token across sites
		  storeAuthStateInCookie: true //stores the auth state in your cache
	  }
}

class Auth extends Component {
	msalInstance = new Msal.UserAgentApplication(msalConfig)

	//get token from the cache first
	componentDidMount() {
		this.initiateLoginIfCached();
	}

	state = {
		authenticated: false,
		user: {
			role: "visitor"
		},
		accessToken: ""
	};

	//get token from cache and login if possible
	initiateLoginIfCached = () => {
		let loginRequest = {
			scopes: ["user.read"]
		}
		this.msalInstance.acquireTokenSilent(loginRequest).then(
			res => {
				this.setSession(res.idToken)
			}).catch(
				err => {
					console.log(err)
				}
			)
	}
	//try to get token from the cache & if fails prompts the user to login
	initiateLogin = () => {
		let loginRequest = {
			scopes: ["user.read"]
		};
		this.msalInstance.acquireTokenSilent(loginRequest).then(res => {
			this.setSession(res.idToken)
		}).catch(
			err => {
				this.msalInstance.loginPopup(loginRequest).then(res => {
					this.setSession(res.idToken)
				}).catch(err => {
					console.log(err)
				})	
			})
	}	

	//clear cached token and sets state to logged out
	logout = () => {
		this.setState({
			authenticated: false,
			user: {
				role: "visitor"
			},
			accessToken: ""
		});
		this.msalInstance.clearCache(); 
		//this.msalInstance.logout(); - this will fully log them out of their microsoft account if you're using localstorage for SSO.
	}

	 //used when the callback receives a token & returen information
	handleAuthentication = (hash) => {
		console.log('handling auth?')
		console.log(this.msalInstance.deserializeHash(hash))
	}

	//attaches the user data to the Auth component for reuse & sets the bearer token for our api
	setSession(idToken) {
		let roles = []
		if (idToken.claims.roles) {
			roles = idToken.claims.roles
		}
		const user = {
			id: idToken,
			name: idToken.claims.name,
			roles: roles
		};
		this.setState({
			authenticated: true,
			idToken: idToken.rawIdToken,//this is the raw token that you want to pass as your bearer token.
			user: user
		})
	}

	render() {
		const authProviderValue = {
			...this.state,
			initiateLogin: this.initiateLogin,
			handleAuthentication: this.handleAuthentication,
			logout: this.logout
		};
		return (
			<AuthProvider value={authProviderValue}>
				{this.props.children}
			</AuthProvider>
		);
	}
}

export default Auth;