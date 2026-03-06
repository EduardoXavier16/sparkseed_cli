import type { ProjectConfig } from '../types';

export interface Plugin {
  name: string;
  version: string;
  description: string;
  dependencies: Record<string, string>;
  files: PluginFile[];
  config?: Record<string, any>;
}

export interface PluginFile {
  path: string;
  content: string;
}

export function generatePluginConfig(config: ProjectConfig): string {
  return JSON.stringify(
    {
      name: config.projectName,
      version: '1.0.0',
      plugins: {
        enabled: [],
        options: {},
      },
    },
    null,
    2
  );
}

export function generateGraphQLPlugin(): Plugin {
  return {
    name: '@sparkseed/plugin-graphql',
    version: '1.0.0',
    description: 'GraphQL support for your API',
    dependencies: {
      '@apollo/server': '^4.9.0',
      'graphql': '^16.8.0',
      '@graphql-tools/schema': '^10.0.0',
    },
    files: [
      {
        path: 'src/graphql/schema.ts',
        content: `import { makeExecutableSchema } from '@graphql-tools/schema';

const typeDefs = \`#graphql
  type Query {
    hello: String
  }

  type Mutation {
    greet(name: String!): String
  }
\`;

const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!',
  },
  Mutation: {
    greet: (_: any, { name }: { name: string }) => \`Hello, \${name}!\`,
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
`,
      },
      {
        path: 'src/graphql/apollo-server.ts',
        content: `import { ApolloServer } from '@apollo/server';
import { schema } from './schema';

export const apolloServer = new ApolloServer({
  schema,
});
`,
      },
    ],
    config: {
      graphqlPath: '/graphql',
      playground: true,
    },
  };
}

export function generateWebSocketPlugin(): Plugin {
  return {
    name: '@sparkseed/plugin-websocket',
    version: '1.0.0',
    description: 'WebSocket support for real-time features',
    dependencies: {
      'ws': '^8.14.0',
      'socket.io': '^4.7.0',
    },
    files: [
      {
        path: 'src/websocket/server.ts',
        content: `import { Server } from 'socket.io';
import http from 'http';

export function setupWebSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('message', (data) => {
      console.log('Message received:', data);
      io.emit('message', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
`,
      },
      {
        path: 'src/websocket/events.ts',
        content: `// Define your WebSocket events here
export const WebSocketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  BROADCAST: 'broadcast',
} as const;

export type WebSocketEvent = typeof WebSocketEvents[keyof typeof WebSocketEvents];
`,
      },
    ],
    config: {
      wsPath: '/ws',
      pingInterval: 25000,
      pingTimeout: 60000,
    },
  };
}

export function generateI18nPlugin(): Plugin {
  return {
    name: '@sparkseed/plugin-i18n',
    version: '1.0.0',
    description: 'Internationalization support',
    dependencies: {
      'i18next': '^23.7.0',
      'react-i18next': '^13.5.0',
      'i18next-http-backend': '^2.4.0',
    },
    files: [
      {
        path: 'src/i18n/config.ts',
        content: `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt', 'es'],
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
`,
      },
      {
        path: 'public/locales/en/translation.json',
        content: `{
  "welcome": "Welcome",
  "login": "Login",
  "logout": "Logout",
  "signup": "Sign Up"
}
`,
      },
      {
        path: 'public/locales/pt/translation.json',
        content: `{
  "welcome": "Bem-vindo",
  "login": "Entrar",
  "logout": "Sair",
  "signup": "Cadastrar"
}
`,
      },
      {
        path: 'public/locales/es/translation.json',
        content: `{
  "welcome": "Bienvenido",
  "login": "Iniciar sesión",
  "logout": "Cerrar sesión",
  "signup": "Registrarse"
}
`,
      },
    ],
    config: {
      defaultLocale: 'en',
      supportedLocales: ['en', 'pt', 'es'],
    },
  };
}

export function generateAnalyticsPlugin(): Plugin {
  return {
    name: '@sparkseed/plugin-analytics',
    version: '1.0.0',
    description: 'Analytics integration (Google Analytics, Mixpanel, etc.)',
    dependencies: {
      '@analytics/google-analytics': '^1.0.7',
      'analytics': '^0.8.11',
    },
    files: [
      {
        path: 'src/analytics/config.ts',
        content: `import Analytics from 'analytics';
import googleAnalytics from '@analytics/google-analytics';

const analytics = Analytics({
  app: '${'{{PROJECT_NAME}}'}',
  plugins: [
    googleAnalytics({
      measurementIds: [process.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'],
    }),
  ],
});

export default analytics;
`,
      },
      {
        path: 'src/analytics/events.ts',
        content: `import analytics from './config';

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  analytics.track(eventName, properties);
};

export const trackPageView = (path: string) => {
  analytics.page();
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  analytics.identify(userId, traits);
};
`,
      },
    ],
    config: {
      googleAnalytics: {
        measurementId: 'G-XXXXXXXXXX',
      },
    },
  };
}

export function generatePaymentPlugin(): Plugin {
  return {
    name: '@sparkseed/plugin-payment',
    version: '1.0.0',
    description: 'Payment integration (Stripe, PayPal, Mercado Pago)',
    dependencies: {
      'stripe': '^14.7.0',
    },
    files: [
      {
        path: 'src/payment/stripe.ts',
        content: `import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function createPaymentIntent(amount: number, currency: string = 'usd') {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}

export async function createCheckoutSession(items: any[], successUrl: string, cancelUrl: string) {
  const session = await stripe.checkout.sessions.create({
    line_items: items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.amount,
      },
      quantity: item.quantity || 1,
    })),
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session.url;
}

export default stripe;
`,
      },
      {
        path: 'src/payment/webhooks.ts',
        content: `import { Request, Response } from 'express';
import stripe from './stripe';

export async function handleWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(\`Webhook Error: \${err.message}\`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
    default:
      console.log(\`Unhandled event type \${event.type}\`);
  }

  res.json({ received: true });
}
`,
      },
    ],
    config: {
      stripe: {
        publicKey: 'pk_test_...',
        webhookSecret: 'whsec_...',
      },
    },
  };
}

export function getAvailablePlugins(): Plugin[] {
  return [
    generateGraphQLPlugin(),
    generateWebSocketPlugin(),
    generateI18nPlugin(),
    generateAnalyticsPlugin(),
    generatePaymentPlugin(),
  ];
}

export function installPlugin(pluginName: string): Plugin | null {
  const plugins = getAvailablePlugins();
  return plugins.find((p) => p.name === pluginName) || null;
}
