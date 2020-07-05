import React from "react"
export const ColorContext=React.createContext({color:'red'}) 
export const ColorProvider=ColorContext.Provider;
export const ColorConsumer=ColorContext.Consumer;

export const UserContext=React.createContext();
export const UserProvider=UserContext.Provider;
export const UserConsumer=UserContext.Consumer; 
