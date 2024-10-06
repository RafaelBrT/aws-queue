import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService implements OnModuleDestroy {
  private sqsClient: SQSClient;
  private queueUrl: string = `${process.env.AWS_CLIENT_URL}${process.env.AWS_SQS_URL}`;
  private isPolling: boolean = true;

  constructor() {
    this.sqsClient = new SQSClient({
      endpoint: process.env.AWS_CLIENT_URL,
      region: process.env.AWS_REGION,
      credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY },
    });

    this.pollMessages();
  }

  async pollMessages() {
    while (this.isPolling) {
      try {
        const command = new ReceiveMessageCommand({
          QueueUrl: this.queueUrl,
          MaxNumberOfMessages: 1,
          WaitTimeSeconds: 10,
        });

        const response = await this.sqsClient.send(command);

        if (response.Messages) {
          const message = response.Messages[0];
          console.log('Received message:')
          console.log(JSON.parse(message.Body))

          await this.deleteMessage(message.ReceiptHandle);
        }
      } catch (error) {
        console.log(`Error receiving message from SQS: ${error}`)
      }
    }
  }

  async deleteMessage(receiptHandle: string) {
    const deleteParams = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    };

    try {
      await this.sqsClient.send(new DeleteMessageCommand(deleteParams));
      console.log('Message deleted successfully');
    } catch (error) {
      console.error(`Error deleting message: ${error}`);
    }
  }

  onModuleDestroy() {
    this.isPolling = false;
  }
}
