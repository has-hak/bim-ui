export function buildErrorMessage(errorData, messages) {
    let errorMessage = ""
    Object.values(errorData).forEach((errorMessageKey) => {
        errorMessage += "\n" + messages[errorMessageKey]
    });
    errorMessage = errorMessage.trim();
    return errorMessage;
}
