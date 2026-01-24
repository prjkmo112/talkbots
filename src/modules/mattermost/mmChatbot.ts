import { HttpChatbot, type HttpChatbotConfig, type HttpChatbotResponse } from "../common";
import * as mmTypes from "./mmtypes";


type MmChatbotConfig = HttpChatbotConfig;

type RequestPostConfig = {
    channel_id: string;
    priority?: mmTypes.Priority;
}

type RequestUpdateConfig = {
    post_id: string;
    is_pinned?: boolean;
    message?: string;
    has_reactions?: boolean;
    props?: string;
}


type MmChatbotResponse = HttpChatbotResponse<mmTypes.PostResponse>;

export class MmChatbot extends HttpChatbot {
    private apiPrefix: string;

    constructor(baseURL: string, config?: MmChatbotConfig) {
        super(baseURL, config);

        this.apiPrefix = 'api/v4';

        this.axiosInst.defaults.headers.common['Content-Type'] = 'application/json';
        this.axiosInst.defaults.headers.common['Accept'] = 'application/json';
    }

    setAuthToken(token: string) {
        this.axiosInst.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    async send(msg: string, cfg: RequestPostConfig): Promise<MmChatbotResponse> {
        const formdata: mmTypes.PostParams = {
            channel_id: cfg.channel_id,
            message: msg,
        }

        if (cfg.priority)
            formdata.metadata = { priority: cfg.priority };

        return await this.sendPostRequestCommon('post', `/${this.apiPrefix}/posts`, formdata);
    }

    async update(cfg: RequestUpdateConfig) {
        const formdata = {
            id: cfg.post_id,
            is_pinned: cfg.is_pinned,
            message: cfg.message,
            has_reactions: cfg.has_reactions,
            props: cfg.props
        }

        return await this.sendPostRequestCommon('put', `/${this.apiPrefix}/posts/${cfg.post_id}`, formdata);
    }

    async getPost(postId: string): Promise<MmChatbotResponse> {
        return await this.sendPostRequestCommon('get', `/${this.apiPrefix}/posts/${postId}`);
    }

    async deletePost(postId: string): Promise<MmChatbotResponse> {
        return await this.sendPostRequestCommon('delete', `/${this.apiPrefix}/posts/${postId}`);
    }

    private async sendPostRequestCommon(
        method: 'get' | 'post' | 'put' | 'delete', 
        url: string, 
        formdata?: any
    ): Promise<MmChatbotResponse> {
        const result: MmChatbotResponse = { success: false, httpCode: 0 };

        const axiosMethod = (
            method === "get" ? this.axiosInst.get.bind(this.axiosInst) :
            method === "post" ? this.axiosInst.post.bind(this.axiosInst) :
            method === "put" ? this.axiosInst.put.bind(this.axiosInst) :
            method === "delete" ? this.axiosInst.delete.bind(this.axiosInst) :
            null
        )

        if (axiosMethod === null)
            throw new Error(`Unsupported method: ${method}`);

        try {
            const { status, data } = await axiosMethod<mmTypes.PostResponse>(url, formdata);
            result.httpCode = status;
            
            if (status === 200 || status === 201) {
                result.success = true;
                result.data = data;
            }
        } catch (error) {
            result.error = (error as Error).message;
        }

        return result;
    }
}