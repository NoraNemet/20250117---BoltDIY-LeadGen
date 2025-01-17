import { Module } from '@nestjs/common';
    import { LeadsController } from './leads/leads.controller';
    import { ContactsController } from './contacts/contacts.controller';
    import { TasksController } from './tasks/tasks.controller';
    import { DealsController } from './deals/deals.controller';

    @Module({
      imports: [],
      controllers: [LeadsController, ContactsController, TasksController, DealsController],
      providers: []
    })
    export class AppModule {}
