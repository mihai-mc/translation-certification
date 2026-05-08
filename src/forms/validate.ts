import { validateTranslator } from "./translatorForm";
import { validateDocumentDetails } from "./documentForm";
import { validatePaymentForm } from "./paymentForm";

const validateAllButtonId: string = "validate-all";

const container = document.getElementById(validateAllButtonId)!;
container.innerHTML = `
    <button id="${validateAllButtonId}-button">Validate all forms</button>
`;

function validateAll() {
    validateTranslator();
    validateDocumentDetails();
    validatePaymentForm();
}
document.getElementById(`${validateAllButtonId}`)!.addEventListener("click", validateAll);