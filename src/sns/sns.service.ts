import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Injectable } from '@nestjs/common';
import { EventExample } from 'src/enum/event-example.interface';

@Injectable()
export class SnsService {
  private snsClient: SNSClient

  constructor() {
    this.snsClient = new SNSClient({
      endpoint: process.env.AWS_CLIENT_URL,
      region: process.env.AWS_REGION,
      credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY }
    })
  }

  async publishMessage(message: EventExample) {
    const publishCommand = new PublishCommand({
      Message: JSON.stringify(message),
      TopicArn: process.env.AWS_SNS_TOPIC,
    })

    return this.snsClient.send(publishCommand);
  }

}
