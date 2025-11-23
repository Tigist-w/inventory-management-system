import { jwtDecode } from "jwt-decode"; // ✅ Correct import

export const isAuthenticated = () => {
  const token = localStorage.getItem("imsToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token); // ✅ Works now
    const currentTime = Date.now() / 1000; // in seconds

    if (decoded.exp < currentTime) {
      localStorage.removeItem("imsToken"); // token expired
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem("imsToken");
    return false;
  }
};

export const getToken = () => localStorage.getItem("imsToken");

export const logout = () => localStorage.removeItem("imsToken");
