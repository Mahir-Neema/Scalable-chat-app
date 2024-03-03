import { Server } from "socket.io";
import Redis from "ioredis";
import prismaClient from "./prisma";
import { produceMessage } from "./kafka";


const pub = new Redis({
  host: 'redis-1343bbdd-scalable-chat-app.a.aivencloud.com',
  port: 20302,
  username: 'default',
  password: 'AVNS_ewWfZA4_PoA4yF4A8Xn',
});

const sub = new Redis({
  host: 'redis-1343bbdd-scalable-chat-app.a.aivencloud.com',
  port: 20302,
  username: 'default',
  password: 'AVNS_ewWfZA4_PoA4yF4A8Xn',
});


class SocketService {
  private _io: Server;
  // private oldMessagesSent: boolean = false; // Flag to track if old messages have been sent
  constructor() {
    console.log("Init socket server.....");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      }
    });
    sub.subscribe('MESSAGES');
  }

  public initListerners(){
    const io = this.io;

    console.log('Init socket listeners......');

    io.on('connect', async (socket)=>{
        // console.log(`New Socket Connection with id: `, socket.id);
        // let oldMessages;
        // if(!oldMessages){
        //   oldMessages = await prismaClient.message.findMany();
        //   console.log("old memseage..........:)))))))  ",oldMessages);
        // }

        // if (!this.oldMessagesSent) {
        //   const oldMessages = await prismaClient.message.findMany();
        //   console.log("old messages: ", oldMessages);
        //   io.to(socket.id).emit('oldMessages', oldMessages); // Send old messages to the newly connected client
        //   this.oldMessagesSent = true;
        // }
        

        socket.on('event:message', async ({message}:{message:string}) => {
            console.log('New Message recieved: ', message);

            // publishing this message to redis
            await pub.publish('MESSAGES', JSON.stringify({message}));
        })
    });
    sub.on('message',async (channel,message) => {
      if(channel === 'MESSAGES'){
        console.log('new message from redis: ',message);
        io.emit('message',message);
        await produceMessage(message);
        console.log("message produced to kakfa broker");
      }
    })
  }

  get io(){
    return this._io;
  }
}

export default SocketService;