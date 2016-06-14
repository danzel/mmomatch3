let goodBrowser = window.hasOwnProperty('ArrayBuffer') && ('WebSocket' in window && (<any>window).WebSocket.CLOSING === 2);

export = goodBrowser;