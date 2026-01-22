import { getItem } from "@analytics/storage-utils";
import { LOGIN_USER } from "@/common/constant";
const useCurrentUser = (): { id: number; user_name: string } | undefined =>
  getItem(LOGIN_USER, { storage: "sessionStorage" });

export default useCurrentUser;
