// Base URL for API
const BASE_URL = `${Constants.API_URL}/user`;
// Tab Switching Logic
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// Register User
document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    if (!email || !password) {
      alert("Please provide both email and password.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.message}`);
        return;
      }

      alert("Registration successful.");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again later.");
    }
  });

// Login User
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  const password = e.target.querySelector('input[type="password"]').value;

  if (!email || !password) {
    alert("Please provide both email and password.");
    return;
  }

  try {
    // Step 1: Login
    const loginResponse = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      alert(`Login failed: ${error.message}`);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    localStorage.setItem("authToken", token);

    // Step 2: Get Profile
    try {
      const profileResponse = await fetch(
        `${Constants.API_URL}/walker/get_profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();

        // Check if profile exists and has a username
        if (profileData.reports && profileData.reports.length > 0) {
          const username = profileData.reports[0].user.context?.username;

          if (!username) {
            // Step 3: Prompt for username if not set
            const newUsername = prompt("Please enter a username:");
            if (newUsername) {
              try {
                const updateProfileResponse = await fetch(
                  `${Constants.API_URL}/walker/update_profile`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      accept: "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ new_username: newUsername }),
                  }
                );

                if (!updateProfileResponse.ok) {
                  throw new Error("Failed to update username");
                }
              } catch (updateError) {
                console.error("Error updating username:", updateError);
                alert("Failed to update username. Please try again later.");
                return;
              }
            }
          }
        }
      }
    } catch (profileError) {
      console.error("Error fetching profile:", profileError);
      alert("Error fetching profile. Please try again later.");
      return;
    }

    window.location.href = "tweets.html";
  } catch (loginError) {
    console.error("Error during login:", loginError);
    alert("An error occurred during login. Please try again later.");
  }
});
