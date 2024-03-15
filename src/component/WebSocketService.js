import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient;

export const initializeWebSocket = (chatId, onMessageReceived) => {
    const socket = new SockJS(process.env.REACT_APP_SOCKJS_URL);
    stompClient = Stomp.over(socket);

    stompClient.configure({
        brokerURL: process.env.REACT_APP_WEBSOCKET_URL,
        onConnect: () => {
            const destination = `${process.env.REACT_APP_CHAT_SUBSCRIBE_URL}/${chatId}`;
            stompClient.subscribe(destination, onMessageReceived);
        },
        onStompError: (error) => {
            console.error('WebSocket error:', error);
        },
    });

    stompClient.activate();
    return stompClient;
};

export const closeWebSocket = () => {
    stompClient && stompClient.deactivate();
};
