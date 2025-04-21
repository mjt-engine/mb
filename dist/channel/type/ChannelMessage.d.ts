export type ChannelMessage<T> = {
    subject: string;
    data: T;
    reply?: string;
    finished?: boolean;
};
