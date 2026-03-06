import type { ProjectConfig } from '../types';

export function generateOpenAPISpec(config: ProjectConfig): string {
  const paths = generatePathsFromConfig(config);
  const schemas = (paths as any).__schemas || {};
  
  const spec = {
    openapi: '3.0.0',
    info: {
      title: `${config.projectName} API`,
      description: config.description,
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http' as const,
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message',
            },
            code: {
              type: 'string',
              example: 'ERROR_CODE',
            },
          },
          required: ['error'],
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
          required: ['id', 'email', 'name'],
        },
        ...schemas,
      },
    },
    paths,
  };

  // Remove the __schemas property from paths
  delete (paths as any).__schemas;

  return JSON.stringify(spec, null, 2);
}

function generatePathsFromConfig(config: ProjectConfig): Record<string, any> {
  const paths: Record<string, any> = {};
  const schemas: Record<string, any> = {};

  // Auth endpoints
  if (config.auth) {
    paths['/auth/register'] = {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/User' },
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid input or email already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    };

    paths['/auth/login'] = {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/User' },
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    };

    paths['/auth/me'] = {
      get: {
        tags: ['Authentication'],
        summary: 'Get current user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Current user data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    };
  }

  // Generate paths from domain entities
  if (config.domainEntities && config.domainEntities.length > 0) {
    config.domainEntities.forEach((entity) => {
      const entityNameLower = entity.name.toLowerCase();
      const pluralName = `${entityNameLower}s`;

      paths[`/api/${pluralName}`] = {
        get: {
          tags: [entity.name],
          summary: `List all ${entity.name.toLowerCase()}s`,
          security: config.auth ? [{ bearerAuth: [] }] : undefined,
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Page number',
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 },
              description: 'Items per page',
            },
          ],
          responses: {
            '200': {
              description: `List of ${entity.name.toLowerCase()}s`,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: `#/components/schemas/${entity.name}` },
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: [entity.name],
          summary: `Create a new ${entity.name.toLowerCase()}`,
          security: config.auth ? [{ bearerAuth: [] }] : undefined,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${entity.name}Create`,
                },
              },
            },
          },
          responses: {
            '201': {
              description: `${entity.name} created successfully`,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { $ref: `#/components/schemas/${entity.name}` },
                    },
                  },
                },
              },
            },
          },
        },
      };

      paths[`/api/${pluralName}/{id}`] = {
        get: {
          tags: [entity.name],
          summary: `Get ${entity.name.toLowerCase()} by ID`,
          security: config.auth ? [{ bearerAuth: [] }] : undefined,
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
            },
          ],
          responses: {
            '200': {
              description: `${entity.name} data`,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { $ref: `#/components/schemas/${entity.name}` },
                    },
                  },
                },
              },
            },
            '404': {
              description: `${entity.name} not found`,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        put: {
          tags: [entity.name],
          summary: `Update ${entity.name.toLowerCase()}`,
          security: config.auth ? [{ bearerAuth: [] }] : undefined,
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${entity.name}Update`,
                },
              },
            },
          },
          responses: {
            '200': {
              description: `${entity.name} updated successfully`,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { $ref: `#/components/schemas/${entity.name}` },
                    },
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: [entity.name],
          summary: `Delete ${entity.name.toLowerCase()}`,
          security: config.auth ? [{ bearerAuth: [] }] : undefined,
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
            },
          ],
          responses: {
            '204': {
              description: `${entity.name} deleted successfully`,
            },
          },
        },
      };

      // Add schemas for this entity
      schemas[entity.name] = {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          ...entity.fields.reduce((acc, field) => {
            acc[field.name] = {
              type: getOpenAPIType(field.type),
            };
            return acc;
          }, {} as Record<string, any>),
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', ...entity.fields.filter(f => f.required).map(f => f.name)],
      };

      schemas[`${entity.name}Create`] = {
        type: 'object',
        properties: entity.fields.reduce((acc, field) => {
          if (field.required) {
            acc[field.name] = {
              type: getOpenAPIType(field.type),
            };
          }
          return acc;
        }, {} as Record<string, any>),
        required: entity.fields.filter(f => f.required).map(f => f.name),
      };

      schemas[`${entity.name}Update`] = {
        type: 'object',
        properties: entity.fields.reduce((acc, field) => {
          acc[field.name] = {
            type: getOpenAPIType(field.type),
          };
          return acc;
        }, {} as Record<string, any>),
      };
    });
  }

  // Health check endpoint
  paths['/health'] = {
    get: {
      tags: ['Health'],
      summary: 'Health check',
      responses: {
        '200': {
          description: 'Service is healthy',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'ok' },
                  timestamp: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
      },
    },
  };

  // Attach schemas to paths for return
  (paths as any).__schemas = schemas;

  return paths;
}

function getOpenAPIType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    string: 'string',
    number: 'integer',
    boolean: 'boolean',
    date: 'string',
    email: 'string',
    text: 'string',
    json: 'object',
  };
  return typeMap[fieldType] || 'string';
}

export function generateSwaggerUI(config: ProjectConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.projectName} - API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
      });
    };
  </script>
</body>
</html>
`;
}
