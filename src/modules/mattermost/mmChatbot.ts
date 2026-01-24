import FormData from "form-data";
import { HttpChatbot, type HttpChatbotConfig, type HttpChatbotResponse } from "../common";
import * as mmTypes from "./mmtypes";


type MmChatbotConfig = HttpChatbotConfig;

type FileUploadConfig = {
    channel_id: string;
    filename?: string;
}

type RequestPostConfig = {
    channel_id: string;
    root_id?: string;
    priority?: mmTypes.Priority;
    file_ids?: string[];
}

type RequestUpdateConfig = {
    post_id: string;
    is_pinned?: boolean;
    message?: string;
    has_reactions?: boolean;
    props?: string;
}

type ResponseType = mmTypes.PostResponse | mmTypes.UploadFileResponse;
type MmChatbotResponse<T extends ResponseType = mmTypes.PostResponse> = HttpChatbotResponse<T>;

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

        if (cfg.priority) formdata.metadata = { priority: cfg.priority };
        if (cfg.root_id) formdata.root_id = cfg.root_id;
        if (cfg.file_ids) formdata.file_ids = cfg.file_ids;

        return await this.sendPostRequestCommon('post', `/${this.apiPrefix}/posts`, formdata);
    }

    async uploadFile(file: File | Buffer, cfg: FileUploadConfig): Promise<MmChatbotResponse<mmTypes.UploadFileResponse>> {
        const result: MmChatbotResponse<mmTypes.UploadFileResponse> = { success: false, httpCode: 0 };

        const formdata = new FormData();
        formdata.append('files', file, cfg.filename ?? 'file.png');
        formdata.append('channel_id', cfg.channel_id);

        try {
            const { status, data } = await this.axiosInst.post<mmTypes.UploadFileResponse>(`/${this.apiPrefix}/files`, formdata, {
                headers: {
                    ...formdata.getHeaders(),
                },
                maxBodyLength: Infinity,
            })
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

    async sendFile(
        msg: string, 
        file: File | Buffer, 
        cfg: RequestPostConfig & FileUploadConfig
    ) : Promise<MmChatbotResponse> {
        const fileResp = await this.uploadFile(file, cfg);

        if (fileResp.success && fileResp.data && fileResp.data.file_infos.length > 0) {
            const fileIds = fileResp.data.file_infos.map(v => v.id);

            const formCfg: RequestPostConfig = {
                channel_id: cfg.channel_id,
                file_ids: fileIds
            };

            if (cfg.priority) formCfg.priority = cfg.priority;
            if (cfg.root_id) formCfg.root_id = cfg.root_id;

            return await this.send(msg, formCfg);
        }

        return { success: false, httpCode: fileResp.httpCode, error: fileResp.error } as MmChatbotResponse;
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