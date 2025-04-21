import { ErrorDetail } from "@mjt-engine/error";
export type ValueOrError<T = unknown> = {
    value: T;
} | {
    error: ErrorDetail;
};
export declare const isValue: <T>(valueOrError: ValueOrError<T>) => valueOrError is {
    value: T;
};
export declare const isError: <T>(valueOrError: ValueOrError<T>) => valueOrError is {
    error: ErrorDetail;
};
export declare const isValueOrError: <T>(valueOrError: ValueOrError<T>) => valueOrError is ValueOrError<T>;
