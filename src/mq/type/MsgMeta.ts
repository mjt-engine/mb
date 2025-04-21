
export type MsgMeta = Partial<{
  hasError: boolean;
  status: string;
  code: number;
  headers: Record<string, string>;
}>;
