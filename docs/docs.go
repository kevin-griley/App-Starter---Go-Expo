// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/auth/login": {
            "post": {
                "description": "Retrive token for bearer authentication",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Retrive token for bearer authentication",
                "parameters": [
                    {
                        "description": "Login Request",
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.PostAuthRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Token Response",
                        "schema": {
                            "$ref": "#/definitions/handlers.PostAuthResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/handlers.ApiError"
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "$ref": "#/definitions/handlers.ApiError"
                        }
                    }
                }
            }
        },
        "/auth/logout": {
            "delete": {
                "description": "Removes HttpOnly cookie from client",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Removes HttpOnly cookie from client",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/auth/reset/confirm": {
            "post": {
                "description": "Confirms a password reset",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Confirms a password reset",
                "parameters": [
                    {
                        "description": "Reset Confirm",
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.PostAuthResetConfirm"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User",
                        "schema": {
                            "$ref": "#/definitions/data.User"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/handlers.ApiError"
                        }
                    }
                }
            }
        },
        "/auth/reset/request": {
            "post": {
                "description": "Requests a password reset",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Requests a password reset",
                "parameters": [
                    {
                        "description": "Reset Request",
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.PostAuthResetRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User",
                        "schema": {
                            "$ref": "#/definitions/data.User"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/handlers.ApiError"
                        }
                    }
                }
            }
        },
        "/organization": {
            "post": {
                "description": "Create a new organization",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Organization"
                ],
                "summary": "Create a new organization",
                "parameters": [
                    {
                        "description": "Create Organization Request",
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.PostOrganizationRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Organization",
                        "schema": {
                            "$ref": "#/definitions/data.Organization"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/handlers.ApiError"
                        }
                    }
                }
            }
        },
        "/organization/{id}": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get organization by ID",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Organization"
                ],
                "summary": "Get organization by ID",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Organization ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Organization",
                        "schema": {
                            "$ref": "#/definitions/data.Organization"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/handlers.ApiError"
                        }
                    }
                }
            },
            "patch": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Patch organization by ID",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Organization"
                ],
                "summary": "Patch organization by ID",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Organization ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "Patch Organization Request",
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.PatchOrganizationRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Organization",
                        "schema": {
                            "$ref": "#/definitions/data.Organization"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/handlers.ApiError"
                        }
                    }
                }
            }
        },
        "/user": {
            "post": {
                "description": "Create a new user",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "User"
                ],
                "summary": "Create a new user",
                "parameters": [
                    {
                        "description": "Create User Request",
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.PostUserRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User",
                        "schema": {
                            "$ref": "#/definitions/data.User"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/handlers.ApiError"
                        }
                    }
                }
            }
        },
        "/user/me": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get user by apiKey",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "User"
                ],
                "summary": "Get user by apiKey",
                "responses": {
                    "200": {
                        "description": "User",
                        "schema": {
                            "$ref": "#/definitions/data.User"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/handlers.ApiError"
                        }
                    }
                }
            },
            "patch": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Patch user by apiKey",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "User"
                ],
                "summary": "Patch user by apiKey",
                "parameters": [
                    {
                        "description": "Patch User Request",
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.PatchUserRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User",
                        "schema": {
                            "$ref": "#/definitions/data.User"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/handlers.ApiError"
                        }
                    }
                }
            }
        },
        "/user_associations/me": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get associations by apiKey",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "User Associations"
                ],
                "summary": "Get associations by apiKey",
                "parameters": [
                    {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "collectionFormat": "csv",
                        "description": "Allowed: ['organizations']",
                        "name": "expand",
                        "in": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Associations",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/data.Association"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/handlers.ApiError"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "data.Association": {
            "type": "object",
            "properties": {
                "created_at": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "organization": {
                    "$ref": "#/definitions/data.Organization"
                },
                "organization_id": {
                    "type": "string"
                },
                "permissions": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/data.PermissionsEnum"
                    }
                },
                "status": {
                    "$ref": "#/definitions/data.OrganizationStatus"
                },
                "updated_at": {
                    "type": "string"
                },
                "user_id": {
                    "type": "string"
                }
            }
        },
        "data.Organization": {
            "type": "object",
            "properties": {
                "address": {
                    "type": "string"
                },
                "contact_info": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "is_deleted": {
                    "type": "boolean"
                },
                "name": {
                    "type": "string"
                },
                "organization_type": {
                    "$ref": "#/definitions/data.OrganizationType"
                },
                "unique_url": {
                    "type": "string"
                },
                "updated_at": {
                    "type": "string"
                }
            }
        },
        "data.OrganizationStatus": {
            "type": "string",
            "enum": [
                "pending",
                "active",
                "inactive"
            ],
            "x-enum-varnames": [
                "Pending",
                "Active",
                "Inactive"
            ]
        },
        "data.OrganizationType": {
            "type": "string",
            "enum": [
                "airline",
                "carrier",
                "warehouse"
            ],
            "x-enum-varnames": [
                "Airline",
                "Carrier",
                "Warehouse"
            ]
        },
        "data.PermissionsEnum": {
            "type": "string",
            "enum": [
                "user.read",
                "user.write",
                "organization.read",
                "organization.write",
                "manifest.read",
                "manifest.write",
                "uld.read",
                "uld.write"
            ],
            "x-enum-varnames": [
                "ReadUserPermissions",
                "WriteUserPermissions",
                "ReadOrganizationPermissions",
                "WriteOrganizationPermissions",
                "ReadManifestPermissions",
                "WriteManifestPermissions",
                "ReadUldPermissions",
                "WriteUldPermissions"
            ]
        },
        "data.User": {
            "type": "object",
            "properties": {
                "created_at": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "updated_at": {
                    "type": "string"
                },
                "user_name": {
                    "type": "string"
                }
            }
        },
        "handlers.ApiError": {
            "type": "object",
            "properties": {
                "error": {
                    "type": "string"
                },
                "status": {
                    "type": "integer"
                }
            }
        },
        "handlers.PatchOrganizationRequest": {
            "type": "object"
        },
        "handlers.PatchUserRequest": {
            "type": "object",
            "properties": {
                "password": {
                    "type": "string"
                },
                "user_name": {
                    "type": "string"
                }
            }
        },
        "handlers.PostAuthRequest": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
            }
        },
        "handlers.PostAuthResetConfirm": {
            "type": "object",
            "properties": {
                "confirm_code": {
                    "type": "string"
                },
                "new_password": {
                    "type": "string"
                }
            }
        },
        "handlers.PostAuthResetRequest": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                }
            }
        },
        "handlers.PostAuthResponse": {
            "type": "object",
            "properties": {
                "token": {
                    "type": "string"
                }
            }
        },
        "handlers.PostOrganizationRequest": {
            "type": "object",
            "properties": {
                "address": {
                    "type": "string"
                },
                "contact_info": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "organization_type": {
                    "$ref": "#/definitions/data.OrganizationType"
                }
            }
        },
        "handlers.PostUserRequest": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
            }
        }
    },
    "securityDefinitions": {
        "Bearer Authentication": {
            "description": "A valid JWT token with Bearer prefix",
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "",
	BasePath:         "/",
	Schemes:          []string{},
	Title:            "Rest API",
	Description:      "API for the ULD Management System",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
