export type ChannelMessage<T = unknown> = {
    subject: string;
    data: T;
    reply?: string;
    finished?: boolean;
};
