import { PaymentDetails, payment_methods } from "@/models/payment_details";
import { safeSet } from "./common";

const paymentFormId: string = "payment-form";

const defaultPaymentDetails = new PaymentDetails();

const container = document.getElementById(paymentFormId)!;

container.innerHTML = `
    <h2>Payment Details</h2>

    <div class="dual-column">
        <div class="col">
            <h3>Translation Request</h3>

            <label for="${paymentFormId}-translation-id">Request Id</label>
            <input type="text" id="${paymentFormId}-translation-id" value="${defaultPaymentDetails.translation_request_id}" />

            <label for="${paymentFormId}-translation-date">Date</label>
            <input type="date" id="${paymentFormId}-translation-date" value="${defaultPaymentDetails.translation_request_date.toISOString().split("T")[0]}"/>
        </div>
        <div class="divider"></div>
        <div class="col">
            <h3>Payment Details</h3>

            <label for="${paymentFormId}-payment-id">Payment Id</label>
            <input type="text" id="${paymentFormId}-payment-id" value="${defaultPaymentDetails.payment_id}" />

            <label for="${paymentFormId}-payment-date">Date</label>
            <input type="date" id="${paymentFormId}-payment-date" value="${defaultPaymentDetails.payment_date.toISOString().split("T")[0]}"/>
        </div>
    </div>

    <label for="${paymentFormId}-payment-method">Payment Method</label>
    <select id="${paymentFormId}-payment-method">
        <option value="PAYMENT_ORDER" selected>${payment_methods.PAYMENT_ORDER.EN.toUpperCase()}</option>
        <option value="SLIP">${payment_methods.SLIP.EN.toUpperCase()}</option>
        <option value="RECEIPT">${payment_methods.RECEIPT.EN.toUpperCase()}</option>
    </select>

    <label for="${paymentFormId}-payment-amount">Payment Amount</label>
    <input type="text" inputmode="decimal" min="0.01" step="0.01" inputmode="decimal" id="${paymentFormId}-payment-amount" value="${(defaultPaymentDetails.payment_amount_in_cents / 100).toFixed(2)}" />

    <button id="${paymentFormId}-validate">Validate</button>

    <label for="${paymentFormId}-out">Validation Messages</label>
    <pre id="${paymentFormId}-out">Validation not yet run</pre>
`;

export function validatePaymentForm() {

    // Gather data
    const paymentDetails = new PaymentDetails();

    const translation_request_id = (document.getElementById(`${paymentFormId}-translation-id`) as HTMLInputElement).value;
    const translation_request_date = new Date((document.getElementById(`${paymentFormId}-translation-date`) as HTMLInputElement).value);
    const payment_id = (document.getElementById(`${paymentFormId}-payment-id`) as HTMLInputElement).value;
    const payment_date = new Date((document.getElementById(`${paymentFormId}-payment-date`) as HTMLInputElement).value);

    const payment_amount_in_cents = Math.round(Number((document.getElementById(`${paymentFormId}-payment-amount`) as HTMLInputElement).value) * 100);

    const payment_method_html = (document.getElementById(`${paymentFormId}-payment-method`) as HTMLSelectElement).value;
    const payment_method = payment_methods[payment_method_html as keyof typeof payment_methods];

    // Catch errors to alert the user
    const errors: string[] = [];
    safeSet(() => { paymentDetails.translation_request_id = translation_request_id }, errors);
    safeSet(() => { paymentDetails.translation_request_date = translation_request_date }, errors);
    safeSet(() => { paymentDetails.payment_id = payment_id }, errors);
    safeSet(() => { paymentDetails.payment_date = payment_date }, errors);
    safeSet(() => { paymentDetails.payment_method = payment_method }, errors);
    safeSet(() => { paymentDetails.payment_amount_in_cents = payment_amount_in_cents }, errors);

    if (import.meta.env.DEV)
        console.log(paymentDetails);

    const pre_out = document.getElementById(`${paymentFormId}-out`)!;
    if (errors.length > 0) {
        const error_message: string = "Failed to validate the paymentDetails:\n\n";
        pre_out.textContent = error_message + errors.join("\n");
        pre_out.style.color = "red";
    }
    else {
        pre_out.textContent = "Validation successful ✅";
        pre_out.style.color = "lightgreen";
    }

    return paymentDetails;
}
document.getElementById(`${paymentFormId}-validate`)!.addEventListener("click", validatePaymentForm);