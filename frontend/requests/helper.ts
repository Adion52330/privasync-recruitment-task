export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const handleAuthError = (response: Response) => {
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return true;
  }
  return false;
};