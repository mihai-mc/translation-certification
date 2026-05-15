import { MultiLingualText } from "@/models/translation";


export const payment_methods = Object.freeze({
    SLIP: Object.freeze(new MultiLingualText("chitanță", "slip", "au reçu")),
    RECEIPT: Object.freeze(new MultiLingualText("bon fiscal", "receipt", "au justificatif fiscal")),
    PAYMENT_ORDER: Object.freeze(new MultiLingualText("ordin de plată", "payment order", "à l'ordre de virement"))
});

type PaymentMethod = typeof payment_methods[keyof typeof payment_methods];


export class PaymentDetails {

    private _translation_request_id: string;
    private _translation_request_date: Date;
    private _payment_method: PaymentMethod;
    private _payment_amount_in_cents: number;
    private _payment_id: string;
    private _payment_date: Date;

    public constructor() {
        this._translation_request_id = "1";
        this._translation_request_date = new Date();
        this._payment_method = payment_methods.PAYMENT_ORDER;
        this._payment_amount_in_cents = 50 * 100;
        this._payment_id = "1";
        this._payment_date = new Date();
    }

    public set translation_request_id(id: string) {
        this._translation_request_id = id;
    }

    public get translation_request_id(): string {
        return this._translation_request_id;
    }

    // Helper function to ensure the dates are aligned
    private validateRequestAndPaymentDate(translation_date: Date, pay_date: Date) {
        // NOTE: We don't want to deal with handling the time too, so we'll first check if the 2 dates are identical date-wise
        if (translation_date.getFullYear() === pay_date.getFullYear()
            && translation_date.getMonth() === pay_date.getMonth()
            && translation_date.getDate() === pay_date.getDate()
        )
            return; // NOTE: It's fine if they happen to fall on the same calendar day

        if (pay_date < translation_date)
            throw new Error("Payment date cannot be BEFORE the translation request date !");
        return;
    }

    public set translation_request_date(date: Date) {
        this.validateRequestAndPaymentDate(date, this._payment_date);

        this._translation_request_date = new Date(date);
    }

    public get translation_request_date(): Date {
        return new Date(this._translation_request_date);
    }

    public set payment_method(method: PaymentMethod) {
        this._payment_method = method;
    }

    public get payment_method(): PaymentMethod {
        return this._payment_method;
    }

    public set payment_amount_in_cents(amount_in_cents: number) {
        if (amount_in_cents < 0)
            throw new Error("Cannot charge negative amount in cents");

        if (!Number.isInteger(amount_in_cents))
            throw new Error("Amounts in cents must be integers!");

        this._payment_amount_in_cents = amount_in_cents;
    }

    public get payment_amount_in_cents(): number {
        return this._payment_amount_in_cents;
    }

    public set payment_id(id: string) {
        this._payment_id = id;
    }

    public get payment_id(): string {
        return this._payment_id;
    }

    public set payment_date(date: Date) {
        this.validateRequestAndPaymentDate(this._translation_request_date, date);

        this._payment_date = new Date(date);
    }

    public get payment_date(): Date {
        return new Date(this._payment_date);
    }
}