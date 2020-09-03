export class TodoDto {
	id: string;
	name: string;
	description?: string;
}

export class TodoCreateDto {
	name: string;
	description?: string;
}

export class TodoListDto {
	todos: TodoDto[];
}
