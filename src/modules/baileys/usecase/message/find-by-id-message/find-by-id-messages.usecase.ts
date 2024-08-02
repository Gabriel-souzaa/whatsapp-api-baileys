import { MessageRepository } from '../../../repository/message-repository';
import { getWhatsAppId } from '../../../helpers/get-whats-app-Id';
import FindByIdMessageUseCaseDto from './find-by-id-message.dto';

export class FindByIdMessageUseCase {
  constructor(private messageRepository: MessageRepository) { }

  async execute(input: FindByIdMessageUseCaseDto) {
    const whatsappId = getWhatsAppId(input.to);

    const messages = await this.messageRepository.findById({
      to: whatsappId,
      id: input.messageId
    });

    return messages;
  }
}
