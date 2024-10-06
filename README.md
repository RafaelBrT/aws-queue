# Como utilizar o projeto
Requisitos:

 - Docker
 - Aws Cli

**Locakstack**

    docker-compose up -d

**Aws CLI**

    curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
    sudo installer -pkg AWSCLIV2.pkg -target /
Após instalar o Aws Cli, não precisamos necessariamente de uma conta:

    aws configure
AWS Access Key ID [None]: test
AWS Secret Access Key [None]: test
Default region name [None]: us-east-1
Default output format [None]: json

**Criar SNS e SQS:**

    aws --endpoint-url=http://localhost:4566 sns create-topic --name my-sns-topic
    aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name my-sqs-queue
 
 Interligar as filas para o SNS enviar mensagens ao SQS:

    aws --endpoint-url=http://localhost:4566 sqs get-queue-attributes \
        --queue-url http://localhost:4566/000000000000/my-sqs-queue \
        --attribute-names QueueArn
    aws --endpoint-url=http://localhost:4566 sns subscribe \
    --topic-arn arn:aws:sns:us-east-1:000000000000:my-sns-topic \
    --protocol sqs \
    --notification-endpoint arn:aws:sqs:us-east-1:000000000000:my-sqs-queue


  

