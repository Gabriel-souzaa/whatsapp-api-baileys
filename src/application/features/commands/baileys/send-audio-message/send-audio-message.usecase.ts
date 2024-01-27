import { AppError } from "../../../../../domain/exceptions/app-error";
import { BaileysInstanceRepositoryInterface } from "../../../../../domain/repositories/baileys-instance.repository.interface";
import { sendAudioMessageUseCaseInterface } from "../../../../contracts/send-audio-message-usecase.Interface";
import { sendAudioMessageUseCaseInputDTO } from "./send-audio-message.dto";

type input = sendAudioMessageUseCaseInputDTO;

export class SendAudioMessageUseCase implements sendAudioMessageUseCaseInterface {
    constructor(
        private readonly baileysInstanceRepository: BaileysInstanceRepositoryInterface
    ) { }

    async execute(input: input): Promise<void> {

        const result = await this.baileysInstanceRepository.find(input.key);

        if (!result || !result.waSocket) {
            throw new AppError({
                message: 'Baileys instance not found or not connected',
                statusCode: 204,
                isOperational: true
            });
        }

        const sock = result.waSocket;

        await result.verifyId(this.getWhatsAppId(input.to));

        await sock.sendMessage(
            this.getWhatsAppId(input.to),
            {
                mimetype: input.file.mimetype,
                audio: input.file.buffer,
                caption: input.caption?? '',
                ptt: true,
                fileName: input.file.originalname
            }
        );
    }

    private getWhatsAppId(id: string) {
        if (id.includes('@g.us') || id.includes('@s.whatsapp.net')) return id
        return id.includes('-') ? `${id}@g.us` : `${id}@s.whatsapp.net`
    }
}