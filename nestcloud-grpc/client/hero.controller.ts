import { Controller, Get, Logger, OnModuleInit, Param } from '@nestjs/common';
import { GrpcClient, RpcClient, Service } from '@nestcloud/grpc';
import { HeroService } from './interfaces/hero-service.interface';
import { join } from 'path';
import { ListHeroResponse } from './interfaces/hero.interface';
import { lastValueFrom } from 'rxjs';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { serverOne } from './client';

@Controller('/heros')
export class HeroController implements OnModuleInit {
	private logger = new Logger(this.constructor.name);

	@RpcClient({
		service: 'rpc-server',
		package: 'hero',
		protoPath: join(__dirname, './interfaces/hero-service.proto')
	})
	private readonly client: GrpcClient;

	@Client(serverOne) private readonly serverOne: ClientGrpc;
	private clientOne: HeroService;

	onModuleInit() {
		this.clientOne = this.serverOne.getService<HeroService>('HeroService');
	}

	@Service('HeroService', {
		service: 'rpc-server',
		url: '0.0.0.0:50052',
		package: 'hero',
		protoPath: join(__dirname, './interfaces/hero-service.proto')
	})
	private heroService: HeroService;

	@Get('/:heroId')
	async get(@Param('heroId') heroId: number): Promise<any> {
		const data = await this.clientOne.get({ id: heroId }).toPromise();
		console.log(data);
		return data;
	}

	@Get('/')
	async list(): Promise<ListHeroResponse> {
		this.logger.debug('Fetching List');
		const data$ = await this.clientOne.list({});
		const data = await lastValueFrom(data$);
		console.log(data);

		return data;
	}
}
