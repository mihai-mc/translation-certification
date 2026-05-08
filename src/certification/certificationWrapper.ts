import { validateTranslator } from "@/forms/translatorForm";
import { validateDocumentDetails } from "@/forms/documentForm";
import { validatePaymentForm } from "@/forms/paymentForm";

const certificationId: string = "certification";

const container = document.getElementById(certificationId)!;
container.innerHTML = `
    <button id="${certificationId}-validation">Validate all forms</button>
    <button id="${certificationId}-generate">Generate .docx</button>
`;

function validateAll() {
    validateTranslator();
    validateDocumentDetails();
    validatePaymentForm();
}
document.getElementById(`${certificationId}-validation`)!.addEventListener("click", validateAll);

function generateCertification() {
    alert("Not yet implemented");
}
document.getElementById(`${certificationId}-generate`)!.addEventListener("click", generateCertification);