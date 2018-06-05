package com.web.mydoc.video.chat.core;

public interface ThrowingBiFunction<T, U, R, E extends Exception> {

    R apply(T t, U u) throws E;
}
