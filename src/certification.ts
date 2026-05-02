import { TranslatorDetails } from "./translator_details";
import { DocumentDetails } from "./document_details";
import { PaymentDetails } from "./payment_details";

class Certification {
    public translator_details: TranslatorDetails;
    public document_details: DocumentDetails;
    public payment_details: PaymentDetails;

    public constructor() {
        this.translator_details = new TranslatorDetails();
        this.document_details = new DocumentDetails();
        this.payment_details = new PaymentDetails();
    }
}