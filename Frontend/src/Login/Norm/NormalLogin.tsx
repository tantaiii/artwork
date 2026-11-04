import axios from "axios";
import { User } from "../../Interfaces/UserInterface";
import { ApiResponse } from "../../Interfaces/app.common";

type initialUser = {
  password: "";
  email: "";
};
interface AuthProps {
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
}
export function NormalLogin() {
  return <div>NormalLogin</div>;
}
export async function CheckLogin(
  checkAccount: initialUser,
  { setAccessToken, setUser }: AuthProps
) {
  try {
    const response: ApiResponse<{ accessToken: string; user: User }> =
      (await axios
        .post(
          `${process.env.REACT_APP_API_URL}/login`,
          { email: checkAccount.email, password: checkAccount.password },
          { withCredentials: true }
        )
        .then((res) => res.data)) as ApiResponse<{
        accessToken: string;
        user: User;
      }>;

    if (response.status === "error" || !response.data) {
      alert(response.message);
      return;
    }
    setAccessToken(response.data.accessToken);
    setUser(response.data.user);

    return response.data.user;
  } catch (err: any) {}
}
