import { Message } from "@aws-sdk/client-sqs";
import { NextActionEnum } from "../Constants/NextActionEnum";
import { getLogger } from "../Helpers/logger";
import { CertificateService } from "../Services/CertificateService";
import { BaseConsumer } from "./BaseConsumer";

export class DelayedQueueConsumer extends BaseConsumer {
    protected logger = getLogger('DelayedQueueConsumer');

    async handle(message: Message) {
        const log = this.logger.child({ id: message.MessageId });
        log.info(message.Body);
        const data = JSON.parse(message.Body as string);
        const action = data.payload.nextAction;
        const certificateHash = data.payload.certificateHash;
        switch (action) {
            case NextActionEnum.RENEW_CERTITICATE:
                await CertificateService.renewDomain(certificateHash)
                break;
            case NextActionEnum.VALIDATE:
                await CertificateService.triggerValidation(certificateHash);
                break;
            case NextActionEnum.VALIDATION_STATUS:
                await CertificateService.getValidationStatus(certificateHash);
                break
            default:
                log.error("action " + action + " is not handled");
        }
    }
}
