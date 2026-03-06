import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export type LLMProvider = 'openai' | 'anthropic' | 'ollama';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  model?: string;
  baseUrl?: string; // Para Ollama ou outros provedores compatíveis com OpenAI
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class LLMClient {
  private config: LLMConfig;
  private openai?: OpenAI;
  private anthropic?: Anthropic;

  constructor(config: LLMConfig) {
    this.config = config;

    if (config.provider === 'openai' && config.apiKey) {
      this.openai = new OpenAI({ apiKey: config.apiKey });
    } else if (config.provider === 'anthropic' && config.apiKey) {
      this.anthropic = new Anthropic({ apiKey: config.apiKey });
    }
  }

  async chat(messages: LLMMessage[], systemPrompt?: string): Promise<LLMResponse> {
    const allMessages: LLMMessage[] = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    switch (this.config.provider) {
      case 'openai':
        return this.chatOpenAI(allMessages);
      case 'anthropic':
        return this.chatAnthropic(allMessages);
      case 'ollama':
        return this.chatOllama(allMessages);
      default:
        throw new Error(`Provider não suportado: ${this.config.provider}`);
    }
  }

  private async chatOpenAI(messages: LLMMessage[]): Promise<LLMResponse> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized. Please provide an API key.');
    }

    const model = this.config.model || 'gpt-4-turbo-preview';
    const completion = await this.openai.chat.completions.create({
      model,
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 4096,
    });

    const choice = completion.choices[0];
    if (!choice?.message?.content) {
      throw new Error('No response from OpenAI');
    }

    return {
      content: choice.message.content,
      model,
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  }

  private async chatAnthropic(messages: LLMMessage[]): Promise<LLMResponse> {
    if (!this.anthropic) {
      throw new Error('Anthropic client not initialized. Please provide an API key.');
    }

    const model = this.config.model || 'claude-3-sonnet-20240229';
    const systemMessage = messages.find((m) => m.role === 'system');
    const userMessages = messages.filter((m) => m.role === 'user');
    
    if (userMessages.length === 0) {
      throw new Error('No user messages to send');
    }

    const lastMessage = userMessages[userMessages.length - 1];
    const fullPrompt = systemMessage ? `${systemMessage.content}\n\n${lastMessage.content}` : lastMessage.content;

    const response: any = await (this.anthropic as any).messages.create({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: fullPrompt }],
    });

    const content = response.content?.[0]?.text;
    if (!content) {
      throw new Error('No response from Anthropic');
    }

    return {
      content,
      model,
      usage: {
        promptTokens: response.usage?.input_tokens || 0,
        completionTokens: response.usage?.output_tokens || 0,
        totalTokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
      },
    };
  }

  private async chatOllama(messages: LLMMessage[]): Promise<LLMResponse> {
    const baseUrl = this.config.baseUrl || 'http://localhost:11434';
    const model = this.config.model || 'llama2';

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: messages as any,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const message = data.message;

    if (!message?.content) {
      throw new Error('No response from Ollama');
    }

    return {
      content: message.content,
      model,
      usage: data.prompt_eval_count
        ? {
            promptTokens: data.prompt_eval_count,
            completionTokens: data.eval_count || 0,
            totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
          }
        : undefined,
    };
  }
}

export function createLLMClient(config: LLMConfig): LLMClient {
  return new LLMClient(config);
}
