const ROUTES = {
	"delete": {
		"user": {
			"actionName": "Remove User"
		}
	},

	"get": {
		"auth/user": {
			"actionName": "Public Action",
			"needsAuth": false
		},

		"user": {
			"actionName": "Get User"
		},
		"draft/user": {
			"actionName": "Get User"
		},
		"users": {
			"actionName": "Get Users"
		},
		"form/user": {
			"actionName": "Get Form Details"
		},
		"image/user/:id?": {
			"actionName": "Public Action",
			"needsAuth": false
		}
	},

	"post": {
		"auth/user": {
			"actionName": "Public Action",
			"needsAuth": false
		},

		"user": {
			"actionName": "Add User"
		},
		"images/user": {
			"actionName": "Add User Images"
		}
	},

	"put": {
		"auth/user": {
			"actionName": "Edit Own User"
		},
		
		"user": {
			"actionName": "Edit User"
		}
	}
};

export default ROUTES; 
