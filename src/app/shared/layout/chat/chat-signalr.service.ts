import { Injectable, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import {Subject,Subscription} from 'rxjs/Rx';
import { Observable } from 'rxjs';

@Injectable()
export class ChatSignalrService extends AppComponentBase {
    
    private subject = new Subject<any>();
 
    sendInfo(message: string) { console.log('fffffffffffffffffff');
        this.subject.next({ eventName: message });
    }
 
    clearMessage() {
        this.subject.next();
    }
 
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    chatHub: any;
    appPageTitle: string = 'Dashboard';
    appPageTag: string = 'Reports & Statistics';
    setPageTitle(title: string) {
        this.appPageTitle = title;
    }
    getPageTitle() {
        return this.appPageTitle;
    }
    setPageTag(tag: string) {
        this.appPageTag = tag;
    }
    getPageTag() {
        return this.appPageTag;
    }
    sendMessage(messageData, callback): void {
        if ($.connection.hub.state !== $.signalR.connectionState.connected) {
            callback && callback();
            abp.notify.warn(this.l('ChatIsNotConnectedWarning'));
            return;
        }

        this.chatHub.server.sendMessage(messageData).done(result => {
            if (result) {
                abp.notify.warn(result);
            }
        }).always(() => {
            callback && callback();
        });
    }

    init(): void {
        this.chatHub = ($.connection as any).chatHub;

        if (!this.chatHub) {
            return;
        }

        $.connection.hub.stateChanged(data => {
            if (data.newState === $.connection.connectionState.connected) {
                abp.event.trigger('app.chat.connected');
            }
        });

        this.chatHub.client.getChatMessage = message => {
            abp.event.trigger('app.chat.messageReceived', message);
        };

        this.chatHub.client.getAllFriends = friends => {
            abp.event.trigger('abp.chat.friendListChanged', friends);
        };

        this.chatHub.client.getFriendshipRequest = (friendData, isOwnRequest) => {
            abp.event.trigger('app.chat.friendshipRequestReceived', friendData, isOwnRequest);
        };

        this.chatHub.client.getUserConnectNotification = (friend, isConnected) => {
            abp.event.trigger('app.chat.userConnectionStateChanged',
                {
                    friend: friend,
                    isConnected: isConnected
                });
        };

        this.chatHub.client.getUserStateChange = (friend, state) => {
            abp.event.trigger('app.chat.userStateChanged',
                {
                    friend: friend,
                    state: state
                });
        };

        this.chatHub.client.getallUnreadMessagesOfUserRead = friend => {
            abp.event.trigger('app.chat.allUnreadMessagesOfUserRead',
                {
                    friend: friend
                });
        };
    }
}