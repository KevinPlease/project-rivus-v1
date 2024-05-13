const CONFIG = {
	"apiLogging": "",
	"development": {
		"PORT": 5000,
		"protocol": "http",
		"URL": "localhost",
		"DOMAIN_NAME": "localhost"
	},
	"testing": {
		"PORT": 3000,
		"protocol": "https",
		"URL": "51.38.98.185",
		"DOMAIN_NAME": "ubrix.io"
	},
	"production": {
		"PORT": 443,
		"protocol": "https",
		"URL": "ubrix.io",
		"DOMAIN_NAME": "ubrix.io"
	}
};

export default CONFIG;
