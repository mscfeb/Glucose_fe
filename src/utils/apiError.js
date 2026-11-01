export function getApiErrorMessage(error) {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.data) {
    const response = error.data;

    if (response.message) {
      return response.message;
    }

    if (response.error) {
      return response.error;
    }
  }

  if (error.status === "FETCH_ERROR") {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  if (error.status === "TIMEOUT_ERROR") {
    return "The request took too long. Please try again.";
  }

  if (error.status === 401) {
    return "Your session has expired. Please sign in again.";
  }

  if (error.status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (error.status >= 500) {
    return "Server error. Please try again later.";
  }

  return "Something went wrong. Please try again.";
}