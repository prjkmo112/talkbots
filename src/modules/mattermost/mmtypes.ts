export type RequestMetadata = {
    priority?: Priority;
}

export type PostParams = {
    channel_id: string;
    message: string;
    root_id?: string;
    file_ids?: string[];
    props?: Record<string, any>;
    metadata?: RequestMetadata;
}

export type PostResponse = {
    id:              string;
    create_at:       number;
    update_at:       number;
    delete_at:       number;
    edit_at:         number;
    user_id:         string;
    channel_id:      string;
    root_id:         string;
    original_id:     string;
    message:         string;
    type:            string;
    props:           Record<string, any>;
    hashtag:         string;
    file_ids:        string[];
    pending_post_id: string;
    metadata:        Metadata;
}

export type Metadata = {
    embeds:           Embed[];
    emojis:           Emoji[];
    files:            File[];
    images:           Props;
    reactions:        Reaction[];
    priority:         Priority;
    acknowledgements: Acknowledgement[];
}

export type Acknowledgement = {
    user_id:         string;
    post_id:         string;
    acknowledged_at: number;
}

export type Embed = {
    type: string;
    url:  string;
    data: Props;
}

export type Props = {
}

export type Emoji = {
    id:         string;
    creator_id: string;
    name:       string;
    create_at:  number;
    update_at:  number;
    delete_at:  number;
}

export type File = {
    id:                string;
    user_id:           string;
    post_id:           string;
    create_at:         number;
    update_at:         number;
    delete_at:         number;
    name:              string;
    extension:         string;
    size:              number;
    mime_type:         string;
    width:             number;
    height:            number;
    has_preview_image: boolean;
}

export type Priority = {
    priority: '' | 'important' | 'urgent';
    requested_ack: boolean;
}

export type Reaction = {
    user_id:    string;
    post_id:    string;
    emoji_name: string;
    create_at:  number;
}