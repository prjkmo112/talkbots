import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios';
import type { ChatbotCommonConfig } from './chatbotTypes';

export type HttpChatbotConfig = CreateAxiosDefaults & ChatbotCommonConfig;

export type HttpChatbotResponse<T = any> = {
    success: boolean;
    httpCode: number;
    statusCode?: number;
    data?: T;
    error?: string;
}

export abstract class HttpChatbot {
    protected axiosInst: AxiosInstance;

    constructor(baseURL: string, config?: HttpChatbotConfig) {
        this.axiosInst = axios.create({
            baseURL,
            ...config,
        });
    }

    abstract send(msg: string, ...args: any[]): Promise<HttpChatbotResponse>;
}