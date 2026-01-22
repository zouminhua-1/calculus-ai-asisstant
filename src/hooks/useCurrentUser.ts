import { getItem } from "@analytics/storage-utils";
import { LOGIN_USER } from "@/common/constant";
const useCurrentUser = () => getItem(LOGIN_USER, { storage: "sessionStorage" });

export default useCurrentUser;
