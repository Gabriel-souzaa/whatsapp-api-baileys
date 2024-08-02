import { ControllerInterface } from '../../../interfaces/controller.interface';
import { WhatsappService } from '../../../../modules/baileys/facade/baileys.facade.interface';
import { HttpRequest } from '../../../http-types/http-request';
import { HttpResponse } from '../../../http-types/http-response';
import { Config } from '../../../../modules/@shared/infra/config';
import { findByIdMessagesValidator } from '../../../validators/baileys/message/find-by-id-messages.validator';

export class FindByIdMessagesController implements ControllerInterface {
  constructor(private usecase: WhatsappService) { }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { id } = request.params;
    const { to, messageId } = request.query;

    findByIdMessagesValidator.validateSync({
      id,
      messageId,
      to,
    });

    const execute = await this.usecase.findByIdMessage({
      id,
      messageId,
      to,
    });

    return new HttpResponse(
      {
        message: 'Message Successfully',
        data: execute,
        routingKey: Config.routingKey(),
      },
      { 'Content-Type': 'application/json' },
      200,
    );
  }
}
