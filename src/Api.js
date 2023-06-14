const BASE_API = "https://gorest.co.in/public";

const signIn = async (id, gender) => {
  try {
    const response = await fetch(`${BASE_API}/v2/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, gender }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export default { signIn };
