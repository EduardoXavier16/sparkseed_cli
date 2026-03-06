import type { ProjectConfig, SupportedLanguage } from '../types';

export function generateApiDoc(config: ProjectConfig): string {
  const language: SupportedLanguage = config.cliLanguage ?? 'en';
  const endpoints = config.apiEndpoints || [];

  const hasCustomEndpoints = endpoints.length > 0;

  if (language === 'pt') {
    const lines: string[] = [
      '# Documentação da API',
      '',
      '## URL Base',
      '',
      '```',
      'Desenvolvimento: http://localhost:3000/api',
      'Produção: https://api.yoursite.com/api',
      '```',
      '',
      '## Autenticação',
      '',
      'A API utiliza JWT para autenticação. Inclua o token no cabeçalho Authorization:',
      '',
      '```',
      'Authorization: Bearer <token>',
      '```',
      '',
    ];

    if (hasCustomEndpoints) {
      lines.push('## Endpoints', '');

      // Group endpoints by method
      const grouped = endpoints.reduce((acc, ep) => {
        if (!acc[ep.method]) acc[ep.method] = [];
        acc[ep.method].push(ep);
        return acc;
      }, {} as Record<string, typeof endpoints>);

      Object.entries(grouped).forEach(([method, eps]) => {
        lines.push(`### ${method}`, '');
        eps.forEach((ep) => {
          lines.push(`#### ${ep.method} ${ep.path}`, '');
          lines.push(ep.description, '');
          if (ep.authRequired) {
            lines.push('**Autenticação:** Requerida', '');
          } else {
            lines.push('**Autenticação:** Não requerida', '');
          }
          lines.push('');
        });
      });
    } else {
      lines.push(
        '## Endpoints',
        '',
        '### Auth',
        '',
        '#### POST /auth/register',
        '```json',
        '{',
        '  "name": "John Doe",',
        '  "email": "john@example.com",',
        '  "password": "securepassword"',
        '}',
        '```',
        '',
        '#### POST /auth/login',
        '```json',
        '{',
        '  "email": "john@example.com",',
        '  "password": "securepassword"',
        '}',
        '```',
        '',
        '#### GET /auth/me',
        'Requer autenticação.',
        '',
        '### Users',
        '',
        '#### GET /users/profile',
        'Requer autenticação.',
        '',
        '#### PUT /users/profile',
        'Requer autenticação.',
        ''
      );
    }

    lines.push(
      '## Códigos de Status',
      '',
      '- `200` - Sucesso',
      '- `201` - Criado',
      '- `400` - Requisição inválida',
      '- `401` - Não autorizado',
      '- `404` - Não encontrado',
      '- `500` - Erro interno do servidor',
      ''
    );

    return lines.join('\n');
  }

  if (language === 'es') {
    const lines: string[] = [
      '# Documentación de la API',
      '',
      '## URL Base',
      '',
      '```',
      'Desarrollo: http://localhost:3000/api',
      'Producción: https://api.yoursite.com/api',
      '```',
      '',
      '## Autenticación',
      '',
      'La API utiliza JWT para autenticación. Incluye el token en el encabezado Authorization:',
      '',
      '```',
      'Authorization: Bearer <token>',
      '```',
      '',
    ];

    if (hasCustomEndpoints) {
      lines.push('## Endpoints', '');

      const grouped = endpoints.reduce((acc, ep) => {
        if (!acc[ep.method]) acc[ep.method] = [];
        acc[ep.method].push(ep);
        return acc;
      }, {} as Record<string, typeof endpoints>);

      Object.entries(grouped).forEach(([method, eps]) => {
        lines.push(`### ${method}`, '');
        eps.forEach((ep) => {
          lines.push(`#### ${ep.method} ${ep.path}`, '');
          lines.push(ep.description, '');
          if (ep.authRequired) {
            lines.push('**Autenticación:** Requerida', '');
          } else {
            lines.push('**Autenticación:** No requerida', '');
          }
          lines.push('');
        });
      });
    } else {
      lines.push(
        '## Endpoints',
        '',
        '### Auth',
        '',
        '#### POST /auth/register',
        '```json',
        '{',
        '  "name": "John Doe",',
        '  "email": "john@example.com",',
        '  "password": "securepassword"',
        '}',
        '```',
        '',
        '#### POST /auth/login',
        '```json',
        '{',
        '  "email": "john@example.com",',
        '  "password": "securepassword"',
        '}',
        '```',
        '',
        '#### GET /auth/me',
        'Requiere autenticación.',
        '',
        '### Users',
        '',
        '#### GET /users/profile',
        'Requiere autenticación.',
        '',
        '#### PUT /users/profile',
        'Requiere autenticación.',
        ''
      );
    }

    lines.push(
      '## Códigos de Estado',
      '',
      '- `200` - Éxito',
      '- `201` - Creado',
      '- `400` - Solicitud inválida',
      '- `401` - No autorizado',
      '- `404` - No encontrado',
      '- `500` - Error interno del servidor',
      ''
    );

    return lines.join('\n');
  }

  const lines: string[] = [
    '# API Documentation',
    '',
    '## Base URL',
    '',
    '```',
    'Development: http://localhost:3000/api',
    'Production: https://api.yoursite.com/api',
    '```',
    '',
    '## Authentication',
    '',
    'The API uses JWT for authentication. Include the token in the Authorization header:',
    '',
    '```',
    'Authorization: Bearer <token>',
    '```',
    '',
  ];

  if (hasCustomEndpoints) {
    lines.push('## Endpoints', '');

    const grouped = endpoints.reduce((acc, ep) => {
      if (!acc[ep.method]) acc[ep.method] = [];
      acc[ep.method].push(ep);
      return acc;
    }, {} as Record<string, typeof endpoints>);

    Object.entries(grouped).forEach(([method, eps]) => {
      lines.push(`### ${method}`, '');
      eps.forEach((ep) => {
        lines.push(`#### ${ep.method} ${ep.path}`, '');
        lines.push(ep.description, '');
        if (ep.authRequired) {
          lines.push('**Authentication:** Required', '');
        } else {
          lines.push('**Authentication:** Not required', '');
        }
        lines.push('');
      });
    });
  } else {
    lines.push(
      '## Endpoints',
      '',
      '### Auth',
      '',
      '#### POST /auth/register',
      '```json',
      '{',
      '  "name": "John Doe",',
      '  "email": "john@example.com",',
      '  "password": "securepassword"',
      '}',
      '```',
      '',
      '#### POST /auth/login',
      '```json',
      '{',
      '  "email": "john@example.com",',
      '  "password": "securepassword"',
      '}',
      '```',
      '',
      '#### GET /auth/me',
      'Requires authentication.',
      '',
      '### Users',
      '',
      '#### GET /users/profile',
      'Requires authentication.',
      '',
      '#### PUT /users/profile',
      'Requires authentication.',
      ''
    );
  }

  lines.push(
    '## Status Codes',
    '',
    '- `200` - Success',
    '- `201` - Created',
    '- `400` - Bad Request',
    '- `401` - Unauthorized',
    '- `404` - Not Found',
    '- `500` - Internal Server Error',
    ''
  );

  return lines.join('\n');
}
