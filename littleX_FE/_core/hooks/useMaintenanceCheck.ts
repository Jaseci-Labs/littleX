import { useState, useEffect } from "react";
import { API_URL } from "../api-client";

export const useMaintenanceCheck = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/docs`);
      setIsMaintenanceMode(!response.ok || response.status === 502);
    } catch {
      setIsMaintenanceMode(true);
    }
  };

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isMaintenanceMode, checkApiStatus };
};
