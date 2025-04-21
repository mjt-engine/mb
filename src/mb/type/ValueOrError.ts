import { ErrorDetail } from "@mjt-engine/error";

export type ValueOrError<T = unknown> = { value: T } | { error: ErrorDetail };


export const isValue = <T>(valueOrError: ValueOrError<T>): valueOrError is { value: T } =>
  "value" in valueOrError && valueOrError.value !== undefined;
export const isError = <T>(valueOrError: ValueOrError<T>): valueOrError is { error: ErrorDetail } =>
  "error" in valueOrError && valueOrError.error !== undefined;
export const isValueOrError = <T>(valueOrError: ValueOrError<T>): valueOrError is ValueOrError<T> =>
  isValue(valueOrError) || isError(valueOrError);