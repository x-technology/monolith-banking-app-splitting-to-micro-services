import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'currency',
    protoPath: join(__dirname, './currency/currency.proto'),
    url: '0.0.0.0:50051',
  },
};
